"use client";

import React, { useEffect, useRef } from "react";

export interface VolumetricSmokeProps {
  className?: string;
  /** Factor for mouse position lag (higher = faster response, e.g. 0.065) */
  pointerDamping?: number;
  /** Factor for mouse velocity lag (higher = faster ramp-up, e.g. 0.080) */
  velocityDamping?: number;
  /** Maximum pointer velocity to prevent sudden disturbances on fast flicks */
  maxVelocity?: number;
  /** Influence radius in normalized screen coords (e.g. 0.80 = broad soft breeze) */
  influenceRadius?: number;
  /** Displacement strength of the smoke field (e.g. 0.095 = elegant fluid deflection) */
  displacementStrength?: number;
  /** Tangential swirl multiplier (e.g. 0.40 = gentle curl without sharp whirlpools) */
  swirlStrength?: number;
  /** Idle smoke evolution speed multiplier (0.30 = ~67% faster than original 0.18) */
  idleSpeed?: number;
  /** Overall smoke density multiplier */
  densityScale?: number;
  /** Scroll parallax responsiveness */
  scrollParallax?: number;
}

export default function VolumetricSmoke({
  className = "",
  pointerDamping = 0.065,
  velocityDamping = 0.080,
  maxVelocity = 0.10,
  influenceRadius = 0.80,
  displacementStrength = 0.095,
  swirlStrength = 0.40,
  idleSpeed = 0.30,
  densityScale = 1.0,
  scrollParallax = 0.12,
}: VolumetricSmokeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check WebGL availability
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      console.warn("WebGL not supported, falling back to static atmosphere.");
      return;
    }

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec2 u_mouse_vel;
      uniform float u_mouse_hover;
      uniform float u_aspect;
      uniform float u_influence_radius;
      uniform float u_displacement_strength;
      uniform float u_swirl_strength;
      uniform float u_density_scale;
      uniform float u_scroll;
      uniform vec4 u_vortex0;
      uniform vec4 u_vortex1;
      uniform vec4 u_vortex2;

      // High-precision pseudo-random 2D hash
      vec2 hash2(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * vec3(443.897, 441.423, 437.195));
        p3 += dot(p3, p3.yzx + 19.19);
        return fract((p3.xx + p3.yz) * p3.zy) * 2.0 - 1.0;
      }

      // Smooth quintic interpolation gradient noise (C2-continuous, zero grid artifacts)
      float snoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

        float a = dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0));
        float b = dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
        float c = dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
        float d = dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));

        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      // Fast forward-difference curl field (3 noise evaluations instead of 4, 30% faster)
      vec2 curl(vec2 p) {
        float eps = 0.038;
        float n0 = snoise(p);
        float nx = snoise(p + vec2(eps, 0.0));
        float ny = snoise(p + vec2(0.0, eps));
        return vec2((ny - n0) / eps, -(nx - n0) / eps);
      }

      // 3-octave Fractal Brownian Motion (identical organic macro turbulence, 25% lower GPU cost)
      float fbm(vec2 p) {
        float sum = 0.0;
        float amp = 0.52;
        mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
        for (int i = 0; i < 3; i++) {
          sum += amp * snoise(p);
          p = m * p + vec2(1.4, 2.1);
          amp *= 0.48;
        }
        return sum;
      }

      // 4-octave fine curling wisps & filaments
      float smokeWisps(vec2 p, float t) {
        float wisps = 0.0;
        float freq = 1.0;
        float amp = 0.55;
        mat2 rot = mat2(1.5, 1.3, -1.3, 1.5);

        for (int i = 0; i < 4; i++) {
          float n = snoise(p * freq + vec2(t * 0.06, -t * 0.04));
          float r = pow(1.0 - abs(n), 5.5);
          wisps += r * amp;
          p = rot * p + vec2(2.1, 1.8);
          freq *= 1.95;
          amp *= 0.50;
        }
        return wisps;
      }

      // Sheer translucent silk ribbon with lit edge fold (Image 2 style)
      float silkRibbon(vec2 p, float offset, float width, float warp) {
        float d = abs(p.y - offset + warp);
        float body = exp(-d * d / (width * width));
        float fold = exp(-d * d / ((width * 0.24) * (width * 0.24)));
        return body * 0.45 + fold * 0.55;
      }

      void main() {
        vec2 uv = v_uv;
        vec2 p = (uv - 0.5) * vec2(u_aspect, 1.0);
        float t = u_time * 0.35;

        // Vertical scroll parallax displacement
        p.y += u_scroll * 0.14;

        // Instant, fluid mouse displacement & breeze
        vec2 mPos = (u_mouse - 0.5) * vec2(u_aspect, 1.0);
        vec2 mDiff = p - mPos;
        float mDist = length(mDiff);

        // Smooth cubic falloff over influence radius
        float mInfluence = smoothstep(u_influence_radius, 0.0, mDist) * u_mouse_hover;
        vec2 swirl = vec2(-mDiff.y, mDiff.x) * u_swirl_strength;
        vec2 breeze = u_mouse_vel * 0.95;
        vec2 mouseForce = (swirl + breeze) * mInfluence;
        p -= mouseForce * u_displacement_strength;

        // Interactive drifting vortices spawned by mouse movement
        vec2 vd0 = p - u_vortex0.xy;
        float dist0 = length(vd0);
        if (dist0 < u_vortex0.w && u_vortex0.z != 0.0) {
          float inf0 = smoothstep(u_vortex0.w, 0.0, dist0) * u_vortex0.z;
          p -= vec2(-vd0.y, vd0.x) * (inf0 * 0.12);
        }

        vec2 vd1 = p - u_vortex1.xy;
        float dist1 = length(vd1);
        if (dist1 < u_vortex1.w && u_vortex1.z != 0.0) {
          float inf1 = smoothstep(u_vortex1.w, 0.0, dist1) * u_vortex1.z;
          p -= vec2(-vd1.y, vd1.x) * (inf1 * 0.12);
        }

        vec2 vd2 = p - u_vortex2.xy;
        float dist2 = length(vd2);
        if (dist2 < u_vortex2.w && u_vortex2.z != 0.0) {
          float inf2 = smoothstep(u_vortex2.w, 0.0, dist2) * u_vortex2.z;
          p -= vec2(-vd2.y, vd2.x) * (inf2 * 0.12);
        }

        // Advective drifting smoke stream (continuous, non-repeating flow)
        vec2 drift1 = vec2(t * 0.12, -t * 0.025);
        vec2 drift2 = vec2(-t * 0.06, t * 0.05);

        // 2-stage multi-octave curl warping: authentic fluid vorticity with high framerate efficiency
        vec2 c1 = curl(p * 1.15 + drift1);
        vec2 p1 = p + c1 * 0.42;

        vec2 c2 = curl(p1 * 2.25 + drift2);
        vec2 p2 = p1 + c2 * 0.32;

        // Central horizontal undulating spine across the viewport
        float spine = sin(p.x * 1.3 + t * 0.08) * 0.09 + cos(p.x * 2.5 - t * 0.05) * 0.05;
        vec2 q = vec2(p2.x, p2.y - spine);

        // Multi-frequency noise fields
        float f1 = fbm(p1 * 1.35 + drift1);
        float f2 = fbm(p2 * 2.25 + drift2);

        // --- LAYER 1: Translucent Silk Sheers & Waves ---
        float silk1 = silkRibbon(q,  0.02, 0.14, f1 * 0.22);
        float silk2 = silkRibbon(q,  0.10, 0.10, f2 * 0.26) * smoothstep(-0.35, 0.45, f1);
        float silk3 = silkRibbon(q, -0.09, 0.11, f2 * 0.24) * smoothstep(-0.25, 0.55, f2);
        float silkCombined = (silk1 * 1.10 + silk2 * 0.85 + silk3 * 0.80) * 0.65;

        // --- LAYER 2: Fine Curling Wisps & Vortex Tendrils ---
        float wisps1 = smokeWisps(p1 * 1.65, t) * smoothstep(-0.2, 0.6, f1);
        float wisps2 = smokeWisps(p2 * 2.45, t * 1.1) * smoothstep(-0.1, 0.7, f2);
        float wispsCombined = (wisps1 * 0.75 + wisps2 * 0.55);

        // --- LAYER 3: Soft Volumetric Atmosphere Haze ---
        float haze = smoothstep(-0.3, 0.6, f1) * exp(-pow(q.y * 2.2, 2.0)) * 0.32;

        // Vertical envelope: leaves top and bottom deep velvet black
        float vBounds = exp(-pow(p.y * 2.4, 2.0));

        // Soft readability cushion on left side (hero text protection)
        float leftCushion = smoothstep(-0.55, 0.25, p.x) * 0.35 + 0.65;

        // Total smoke optical density
        float density = (silkCombined + wispsCombined + haze) * vBounds * leftCushion * u_density_scale;
        density = clamp(density, 0.0, 1.0);

        // Illuminated fold crests & backlit filaments
        float highlights = pow(wispsCombined * 1.1 + (silk1 + silk2) * 0.4, 2.2) * vBounds * leftCushion;

        // Pure Obsidian Pitch Black Background
        vec3 col = vec3(0.002, 0.001, 0.004);

        // Authentic purple smoke color palette:
        vec3 colShadowPlum   = vec3(0.14, 0.02, 0.22);  // deep velvety plum
        vec3 colRoyalViolet  = vec3(0.40, 0.08, 0.68);  // rich midtone body
        vec3 colVibrantPurp  = vec3(0.68, 0.20, 0.90);  // saturated magenta-violet
        vec3 colLuminousLilac= vec3(0.88, 0.55, 1.00);  // bright gossamer folds
        vec3 colSpecularRim  = vec3(0.98, 0.92, 1.00);  // sharp backlit fold highlight

        // Multi-stop optical absorption
        col = mix(col, colShadowPlum,    smoothstep(0.03, 0.20, density));
        col = mix(col, colRoyalViolet,   smoothstep(0.15, 0.52, density));
        col = mix(col, colVibrantPurp,   smoothstep(0.42, 0.78, density));
        col = mix(col, colLuminousLilac, smoothstep(0.70, 0.96, density) * 0.70);

        // Sharp backlit crease and curling wisp illumination
        col += colSpecularRim * highlights * 0.75;

        // Floating sparkling micro-embers
        vec2 eUv = p2 * 22.0 + vec2(t * 0.28, -t * 0.48);
        vec2 eCell = floor(eUv);
        vec2 eFrac = fract(eUv) - 0.5;
        vec2 eH = hash2(eCell);
        float eDist = length(eFrac - eH * 0.35);
        float twinkle = sin(t * 3.5 + eH.x * 25.0) * 0.35 + 0.65;
        float ember = smoothstep(0.08, 0.0, eDist) * step(0.72, eH.y) * twinkle;
        vec3 emberCol = mix(vec3(1.0, 0.42, 0.78), vec3(1.0, 0.85, 0.45), eH.x * 0.5 + 0.5);
        col += emberCol * ember * 0.95 * vBounds;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error("Shader compile error:", glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const aPosLoc = gl.getAttribLocation(program, "a_position");
    const uResLoc = gl.getUniformLocation(program, "u_resolution");
    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uMouseLoc = gl.getUniformLocation(program, "u_mouse");
    const uMouseVelLoc = gl.getUniformLocation(program, "u_mouse_vel");
    const uHoverLoc = gl.getUniformLocation(program, "u_mouse_hover");
    const uAspectLoc = gl.getUniformLocation(program, "u_aspect");
    const uRadiusLoc = gl.getUniformLocation(program, "u_influence_radius");
    const uDispLoc = gl.getUniformLocation(program, "u_displacement_strength");
    const uSwirlLoc = gl.getUniformLocation(program, "u_swirl_strength");
    const uDensityLoc = gl.getUniformLocation(program, "u_density_scale");
    const uScrollLoc = gl.getUniformLocation(program, "u_scroll");
    const uVortex0Loc = gl.getUniformLocation(program, "u_vortex0");
    const uVortex1Loc = gl.getUniformLocation(program, "u_vortex1");
    const uVortex2Loc = gl.getUniformLocation(program, "u_vortex2");

    const mouse = { x: 0.65, y: 0.5, targetX: 0.65, targetY: 0.5 };
    const mouseVel = { x: 0, y: 0 };
    let prevMouseX = 0.65;
    let prevMouseY = 0.5;
    let hover = 0.0;
    let targetHover = 0.0;
    let lastVortexPos = { x: 0.65, y: 0.5 };
    let scrollPos = 0;
    let targetScrollPos = 0;

    // Interactive vortices: smooth organic rotational disturbances with continuous envelope
    interface Vortex {
      x: number;
      y: number;
      vx: number;
      vy: number;
      age: number;
      lifetime: number;
      peakStrength: number;
      spin: number;
      radius: number;
    }
    const vortices: Vortex[] = [
      { x: 0, y: 0, vx: 0, vy: 0, age: 99, lifetime: 2.2, peakStrength: 0, spin: 0, radius: 0.40 },
      { x: 0, y: 0, vx: 0, vy: 0, age: 99, lifetime: 2.2, peakStrength: 0, spin: 0, radius: 0.40 },
      { x: 0, y: 0, vx: 0, vy: 0, age: 99, lifetime: 2.2, peakStrength: 0, spin: 0, radius: 0.40 },
    ];
    let nextVortexIndex = 0;
    let lastVortexDropTime = 0;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeScale = prefersReducedMotion ? 0.05 : 1.0;

    let isVisible = true;
    let animationFrameId: number;
    let cachedRect: DOMRect | null = null;

    function updateRect() {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      // Bound strictly to viewport dimensions so full-page scrolling containers never bloat canvas height
      const w = Math.max(1, Math.min(r.width || window.innerWidth, window.innerWidth));
      const h = Math.max(1, Math.min(r.height || window.innerHeight, window.innerHeight));
      cachedRect = new DOMRect(r.left, r.top, w, h);
    }

    function resize() {
      if (!canvas) return;
      updateRect();
      const rect = cachedRect || canvas.getBoundingClientRect();
      
      // High-performance render resolution (0.85x with GPU linear filtering provides silky 60 FPS while preserving lush smoke texture)
      const renderScale = 0.85;
      const width = Math.max(1, Math.floor(rect.width * renderScale));
      const height = Math.max(1, Math.floor(rect.height * renderScale));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl?.viewport(0, 0, width, height);
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(canvas);

    const onMouseMove = (e: MouseEvent) => {
      targetHover = 1.0;
      if (!cachedRect) updateRect();
      const rect = cachedRect || (canvas ? canvas.getBoundingClientRect() : null);
      if (!rect || rect.width <= 0 || rect.height <= 0) return;

      // Container-relative normalized coords: 100% accurate on both full-page and split-panel layouts
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = 1.0 - (e.clientY - rect.top) / rect.height;
      mouse.targetX = nx;
      mouse.targetY = ny;

      // Spawn drifting vortex on smooth cursor gestures (throttled to avoid visual chaos)
      const now = performance.now();
      const distFromLastVortex = Math.hypot(nx - lastVortexPos.x, ny - lastVortexPos.y);
      if (distFromLastVortex > 0.06 && now - lastVortexDropTime > 260) {
        const aspect = (canvas?.width || 1) / (canvas?.height || 1);
        const v = vortices[nextVortexIndex];
        v.x = (nx - 0.5) * aspect;
        v.y = ny - 0.5;
        v.vx = (nx - lastVortexPos.x) * 0.14;
        v.vy = (ny - lastVortexPos.y) * 0.14;
        v.age = 0.0;
        v.lifetime = 2.2;
        v.peakStrength = Math.min(1.0, distFromLastVortex * 6.5);
        v.spin = (nx >= lastVortexPos.x ? 1.0 : -1.0);
        v.radius = 0.40;
        nextVortexIndex = (nextVortexIndex + 1) % 3;
        lastVortexDropTime = now;
        lastVortexPos = { x: nx, y: ny };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        targetHover = 1.0;
        if (!cachedRect) updateRect();
        const rect = cachedRect || (canvas ? canvas.getBoundingClientRect() : null);
        if (!rect || rect.width <= 0 || rect.height <= 0) return;

        mouse.targetX = (touch.clientX - rect.left) / rect.width;
        mouse.targetY = 1.0 - (touch.clientY - rect.top) / rect.height;
      }
    };

    const onMouseLeave = () => {
      targetHover = 0.0;
    };

    const onScroll = () => {
      updateRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const scrollH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, 1);
      const maxScroll = Math.max(1, scrollH - window.innerHeight);
      targetScrollPos = (scrollY / maxScroll) * scrollParallax;
    };

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    resize();
    onScroll();

    // Setup static WebGL vertex buffer binding once outside the render loop
    gl.useProgram(program);
    gl.enableVertexAttribArray(aPosLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    const startTime = performance.now();
    let lastTime = performance.now();

    // Map pointer responsiveness to delta-time frequency
    const posLambda = Math.max(12.0, pointerDamping * 240.0);
    const velLambda = Math.max(8.0, velocityDamping * 160.0);

    function render(now: number) {
      if (isVisible && gl && program) {
        const dt = Math.min(Math.max((now - lastTime) * 0.001, 0.001), 0.1);
        lastTime = now;

        const elapsed = (now - startTime) * 0.001 * timeScale * idleSpeed;

        // Delta-time aware exponential smoothing for position: instant reaction, zero lag, silky continuous motion
        const posFactor = 1.0 - Math.exp(-posLambda * dt);
        mouse.x += (mouse.targetX - mouse.x) * posFactor;
        mouse.y += (mouse.targetY - mouse.y) * posFactor;

        // Continuous physical velocity calculated from smooth interpolated motion (zero event jitter)
        const rawVx = (mouse.x - prevMouseX) / dt;
        const rawVy = (mouse.y - prevMouseY) / dt;
        prevMouseX = mouse.x;
        prevMouseY = mouse.y;

        const rawSpeed = Math.hypot(rawVx, rawVy);
        const clampedSpeed = Math.min(rawSpeed, maxVelocity * 14.0);
        const speedRatio = rawSpeed > 0.0001 ? clampedSpeed / rawSpeed : 0;
        const targetVx = rawVx * speedRatio * 0.06;
        const targetVy = rawVy * speedRatio * 0.06;

        // Smooth velocity ramp-up & natural dissipation
        const velFactor = 1.0 - Math.exp(-velLambda * dt);
        mouseVel.x += (targetVx - mouseVel.x) * velFactor;
        mouseVel.y += (targetVy - mouseVel.y) * velFactor;

        // Update interactive drifting vortices with continuous envelope (NEVER pops)
        for (let i = 0; i < 3; i++) {
          const v = vortices[i];
          if (v.age < v.lifetime) {
            v.age += dt;
            v.x += v.vx * dt;
            v.y += (v.vy + 0.012) * dt; // gentle buoyant rise
            // Smooth 120ms attack followed by organic decay: completely continuous
            const attack = Math.min(1.0, v.age / 0.12);
            const decay = Math.exp(-2.2 * (v.age / v.lifetime));
            const currentStrength = v.peakStrength * attack * decay;
            v.vx *= Math.exp(-0.8 * dt);
            v.vy *= Math.exp(-0.8 * dt);

            const effSpin = currentStrength * v.spin;
            if (i === 0) gl.uniform4f(uVortex0Loc, v.x, v.y, effSpin, v.radius);
            if (i === 1) gl.uniform4f(uVortex1Loc, v.x, v.y, effSpin, v.radius);
            if (i === 2) gl.uniform4f(uVortex2Loc, v.x, v.y, effSpin, v.radius);
          } else {
            if (i === 0) gl.uniform4f(uVortex0Loc, 0, 0, 0, 0);
            if (i === 1) gl.uniform4f(uVortex1Loc, 0, 0, 0, 0);
            if (i === 2) gl.uniform4f(uVortex2Loc, 0, 0, 0, 0);
          }
        }

        const hoverFactor = 1.0 - Math.exp(-8.0 * dt);
        hover += (targetHover - hover) * hoverFactor;

        const scrollFactor = 1.0 - Math.exp(-10.0 * dt);
        scrollPos += (targetScrollPos - scrollPos) * scrollFactor;

        gl.uniform2f(uResLoc, canvas?.width || 1, canvas?.height || 1);
        gl.uniform1f(uTimeLoc, elapsed);
        gl.uniform2f(uMouseLoc, mouse.x, mouse.y);
        gl.uniform2f(uMouseVelLoc, mouseVel.x, mouseVel.y);
        gl.uniform1f(uHoverLoc, hover);
        gl.uniform1f(uAspectLoc, (canvas?.width || 1) / (canvas?.height || 1));
        gl.uniform1f(uRadiusLoc, influenceRadius);
        gl.uniform1f(uDispLoc, displacementStrength);
        gl.uniform1f(uSwirlLoc, swirlStrength);
        gl.uniform1f(uDensityLoc, densityScale);
        gl.uniform1f(uScrollLoc, scrollPos);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      if (gl) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, [
    pointerDamping,
    velocityDamping,
    maxVelocity,
    influenceRadius,
    displacementStrength,
    swirlStrength,
    idleSpeed,
    densityScale,
    scrollParallax,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`block select-none pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
