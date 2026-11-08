"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface Infinity3DProps {
  className?: string;
  /** Custom horizontal center (if omitted, uses landing page offset: mobile 0, tablet 0.75, desktop 1.35) */
  offsetX?: number;
  /** Custom vertical center (if omitted, uses landing page: mobile 0.45, desktop 0.05) */
  offsetY?: number;
  /** Custom scale multiplier (default 1.0) */
  scaleMultiplier?: number;
  /** Enable scroll dissolve (true for landing page, false for auth/static views) */
  enableScrollDissolve?: boolean;
}

/**
 * 3D Bernoulli Lemniscate Curve with Spatial Z-Weave
 * Parametric figure-8 loop in 3D where the front strand curves forward (+Z)
 * and the rear strand curves backward (-Z), weaving gracefully at the origin.
 */
class Lemniscate3DCurve extends THREE.Curve<THREE.Vector3> {
  scale: number;
  zDepth: number;

  constructor(scale = 2.4, zDepth = 0.55) {
    super();
    this.scale = scale;
    this.zDepth = zDepth;
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    const u = t * Math.PI * 2;
    const denom = 1 + Math.sin(u) * Math.sin(u);
    const x = (this.scale * Math.cos(u)) / denom;
    const y = (this.scale * Math.sin(u) * Math.cos(u)) / denom;
    // Spatial Z-weave: curves forward (+Z) at u = PI/2, backward (-Z) at u = 3PI/2
    const z = Math.sin(u) * this.zDepth;
    return optionalTarget.set(x, y, z);
  }
}

export default function Infinity3D({
  className = "",
  offsetX,
  offsetY,
  scaleMultiplier = 1.0,
  enableScrollDissolve = true,
}: Infinity3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Check WebGL availability
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch (e) {
      console.warn("WebGL not supported for 3D Infinity:", e);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    const initialW = container.clientWidth || window.innerWidth;
    const initialH = container.clientHeight || window.innerHeight;
    renderer.setSize(initialW, initialH, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      initialW / Math.max(initialH, 1),
      0.1,
      100
    );
    camera.position.set(0, 0, 7.2);

    // Root group for the 3D Infinity sculpture
    const infinityGroup = new THREE.Group();
    scene.add(infinityGroup);

    // ── 1. Parametric 3D Curve ──────────────────────────────────────────────
    const curve = new Lemniscate3DCurve(2.25, 0.52);

    // ── 2. Glass Outer Tube & Energy Flow Shader ─────────────────────────────
    const tubeGeo = new THREE.TubeGeometry(curve, 220, 0.27, 36, true);

    const glassUniforms = {
      uTime: { value: 0 },
      uPulseTime: { value: 0 },
      uOpacity: { value: 1.0 },
      uRimColor: { value: new THREE.Color(0xa855f7) }, // Brand violet
      uCoreColor: { value: new THREE.Color(0xf3e8ff) }, // Luminous lilac core
      uGlowColor: { value: new THREE.Color(0x7c3aed) }, // Deep royal purple
      uCyanColor: { value: new THREE.Color(0x38bdf8) }, // Electric cyan accent
      uMagentaColor: { value: new THREE.Color(0xec4899) }, // Energetic magenta
    };

    const glassMat = new THREE.ShaderMaterial({
      uniforms: glassUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vWorldPos;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uPulseTime;
        uniform float uOpacity;
        uniform vec3 uRimColor;
        uniform vec3 uCoreColor;
        uniform vec3 uGlowColor;
        uniform vec3 uCyanColor;
        uniform vec3 uMagentaColor;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vWorldPos;

        void main() {
          if (uOpacity <= 0.005) discard;

          float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 2.8);
          float glancing = pow(1.0 - abs(dot(vNormal, vViewDir)), 5.2);

          // ── Energy Flow Circulating Along the Lemniscate Path ─────────────
          // Pulse 1: Primary high-energy pulse circling the complete loop
          float p1 = fract(uPulseTime * 0.26);
          float d1 = abs(vUv.x - p1);
          d1 = min(d1, 1.0 - d1); // circular distance along loop
          float pulse1 = exp(-pow(d1 * 13.0, 2.0));

          // Pulse 2: Secondary harmonic pulse with magenta phase offset
          float p2 = fract(uPulseTime * 0.36 + 0.50);
          float d2 = abs(vUv.x - p2);
          d2 = min(d2, 1.0 - d2);
          float pulse2 = exp(-pow(d2 * 16.0, 2.0)) * 0.85;

          // Pulse 3: Swift cyan electric tracer
          float p3 = fract(uPulseTime * 0.52 + 0.22);
          float d3 = abs(vUv.x - p3);
          d3 = min(d3, 1.0 - d3);
          float pulse3 = exp(-pow(d3 * 26.0, 2.0)) * 0.70;

          // Traveling high-frequency ripples coursing along the path
          float wave1 = sin(vUv.x * 32.0 - uTime * 4.2);
          float wave2 = cos(vUv.x * 56.0 + uTime * 2.8);
          float ripples = smoothstep(0.3, 0.95, wave1 * 0.6 + wave2 * 0.4) * 0.28;

          // Specular highlights reacting to virtual lighting
          vec3 lightDir1 = normalize(vec3(0.6, 0.8, 1.0));
          vec3 lightDir2 = normalize(vec3(-0.6, -0.4, 0.8));
          float spec1 = pow(max(dot(vNormal, lightDir1), 0.0), 32.0);
          float spec2 = pow(max(dot(vNormal, lightDir2), 0.0), 24.0);

          // Traveling light sweep across glass contours
          float sweep = pow(max(dot(vNormal, normalize(vec3(cos(uTime * 1.2), sin(uTime * 0.9), 1.0))), 0.0), 28.0) * 0.6;

          // Color composite: deep velvet glass base + dynamic flowing pulses
          vec3 col = mix(uGlowColor * 0.30, uRimColor, fresnel * 0.85);
          col = mix(col, uMagentaColor, pulse2 * 0.75);
          col = mix(col, uCyanColor, pulse3 * 0.80);
          col += uCoreColor * (pulse1 * 1.1 + glancing * 0.70 + (spec1 + spec2) * 0.50 + sweep + ripples);

          // Smooth transmission alpha
          float alpha = clamp((0.20 + fresnel * 0.70 + glancing * 0.85 + pulse1 * 0.60 + spec1 * 0.8) * uOpacity, 0.0, 0.95);

          gl_FragColor = vec4(col * uOpacity, alpha);
        }
      `,
    });

    const glassMesh = new THREE.Mesh(tubeGeo, glassMat);
    infinityGroup.add(glassMesh);

    // ── 3. Inner Plasma Lightning Core ───────────────────────────────────────
    const coreGeo = new THREE.TubeGeometry(curve, 160, 0.062, 14, true);

    const coreUniforms = {
      uTime: { value: 0 },
      uPulseTime: { value: 0 },
      uOpacity: { value: 1.0 },
      uColor1: { value: new THREE.Color(0xd8b4fe) }, // Bright lilac
      uColor2: { value: new THREE.Color(0x38bdf8) }, // Electric cyan lightning
      uColor3: { value: new THREE.Color(0xec4899) }, // Hot plasma magenta
    };

    const coreMat = new THREE.ShaderMaterial({
      uniforms: coreUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uPulseTime;
        uniform float uOpacity;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;

        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          if (uOpacity <= 0.005) discard;

          // High-speed crackling lightning sparks along the inner curve
          float spark = sin(vUv.x * 64.0 + uTime * 8.5) * cos(vUv.x * 32.0 - uTime * 5.5);
          float electric = smoothstep(0.12, 0.92, spark);

          // Flowing plasma pulse tracking the outer pulse
          float p = fract(uPulseTime * 0.26);
          float d = abs(vUv.x - p);
          d = min(d, 1.0 - d);
          float flowGlow = exp(-pow(d * 10.0, 2.0));

          vec3 col = mix(uColor1, uColor2, electric * 0.65);
          col = mix(col, uColor3, flowGlow * 0.50);
          col += uColor1 * flowGlow * 0.70;

          float alpha = (0.50 + electric * 0.45 + flowGlow * 0.40) * uOpacity;

          gl_FragColor = vec4(col * 1.35 * uOpacity, alpha);
        }
      `,
    });

    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    infinityGroup.add(coreMesh);

    // ── 4. Circulating Energy Particles (Flow Along Curve) ───────────────────
    const circCount = 55;
    const circProgress = new Float32Array(circCount);
    const circSpeeds = new Float32Array(circCount);
    const circPositions = new Float32Array(circCount * 3);
    const circSizes = new Float32Array(circCount);

    for (let i = 0; i < circCount; i++) {
      circProgress[i] = Math.random();
      // Flow along curve with varied speeds (some fast tracers, some steady clusters)
      circSpeeds[i] = 0.08 + Math.random() * 0.16;
      circSizes[i] = Math.random() * 0.045 + 0.025;
      const pt = curve.getPoint(circProgress[i]);
      circPositions[i * 3 + 0] = pt.x;
      circPositions[i * 3 + 1] = pt.y;
      circPositions[i * 3 + 2] = pt.z;
    }

    const circGeo = new THREE.BufferGeometry();
    circGeo.setAttribute("position", new THREE.BufferAttribute(circPositions, 3));
    circGeo.setAttribute("size", new THREE.BufferAttribute(circSizes, 1));

    const circMat = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: { value: 1.0 },
        uColor1: { value: new THREE.Color(0xf3e8ff) }, // Lilac spark
        uColor2: { value: new THREE.Color(0x38bdf8) }, // Cyan spark
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
        attribute float size;
        uniform float uOpacity;
        varying float vAlpha;
        varying float vType;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = (size * 360.0) / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
          vAlpha = uOpacity;
          vType = sin(position.x * 5.0 + position.y * 3.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying float vAlpha;
        varying float vType;

        void main() {
          if (vAlpha <= 0.005) discard;
          vec2 coord = gl_PointCoord - vec2(0.5);
          float d = length(coord);
          if (d > 0.5) discard;
          float glow = smoothstep(0.5, 0.0, d);
          vec3 col = mix(uColor1, uColor2, vType * 0.5 + 0.5);
          gl_FragColor = vec4(col, glow * vAlpha);
        }
      `,
    });

    const circParticles = new THREE.Points(circGeo, circMat);
    infinityGroup.add(circParticles);

    // ── 5. Ambient Floating Spark Atmosphere (Surrounding Halo) ──────────────
    const haloCount = 75;
    const haloPositions = new Float32Array(haloCount * 3);
    const haloScales = new Float32Array(haloCount);
    const haloPhases = new Float32Array(haloCount);

    for (let i = 0; i < haloCount; i++) {
      const t = Math.random();
      const pt = curve.getPoint(t);
      const spread = 0.35;
      haloPositions[i * 3 + 0] = pt.x + (Math.random() - 0.5) * spread;
      haloPositions[i * 3 + 1] = pt.y + (Math.random() - 0.5) * spread;
      haloPositions[i * 3 + 2] = pt.z + (Math.random() - 0.5) * spread;
      haloScales[i] = Math.random() * 0.035 + 0.015;
      haloPhases[i] = Math.random() * Math.PI * 2;
    }

    const haloGeo = new THREE.BufferGeometry();
    haloGeo.setAttribute("position", new THREE.BufferAttribute(haloPositions, 3));
    haloGeo.setAttribute("scale", new THREE.BufferAttribute(haloScales, 1));
    haloGeo.setAttribute("phase", new THREE.BufferAttribute(haloPhases, 1));

    const haloMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1.0 },
        uColor: { value: new THREE.Color(0xd8b4fe) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
        attribute float scale;
        attribute float phase;
        uniform float uTime;
        uniform float uOpacity;
        varying float vAlpha;

        void main() {
          vec3 pos = position;
          pos.y += sin(uTime * 1.8 + phase) * 0.05;
          pos.x += cos(uTime * 1.4 + phase) * 0.04;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = (scale * 300.0) / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
          vAlpha = (0.40 + 0.60 * sin(uTime * 2.5 + phase)) * uOpacity;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;

        void main() {
          if (vAlpha <= 0.005) discard;
          vec2 coord = gl_PointCoord - vec2(0.5);
          float d = length(coord);
          if (d > 0.5) discard;
          float glow = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(uColor, glow * vAlpha);
        }
      `,
    });

    const haloParticles = new THREE.Points(haloGeo, haloMat);
    infinityGroup.add(haloParticles);

    // ── 6. Dynamic Point Lighting ────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x3b0764, 1.4);
    scene.add(ambientLight);

    const violetLight = new THREE.PointLight(0xa855f7, 3.8, 16);
    violetLight.position.set(3, 2, 4);
    scene.add(violetLight);

    const magentaLight = new THREE.PointLight(0xd946ef, 3.0, 16);
    magentaLight.position.set(-3, -2, 3);
    scene.add(magentaLight);

    // ── 7. Responsive Placement & Interaction State ──────────────────────────
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, speed: 0 };
    let lastMousePos = { x: 0, y: 0 };
    let scrollY = 0;
    let targetScrollY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container?.getBoundingClientRect();
      let nx = 0;
      let ny = 0;
      if (rect && rect.width > 0 && rect.height > 0) {
        nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        nx = Math.max(-1.5, Math.min(1.5, nx));
        ny = Math.max(-1.5, Math.min(1.5, ny));
      } else {
        nx = (e.clientX / window.innerWidth) * 2 - 1;
        ny = -(e.clientY / window.innerHeight) * 2 + 1;
      }
      mouse.targetX = nx;
      mouse.targetY = ny;

      const dist = Math.hypot(nx - lastMousePos.x, ny - lastMousePos.y);
      mouse.speed = Math.min(dist * 8.0, 1.5);
      lastMousePos = { x: nx, y: ny };
    };

    const onScroll = () => {
      targetScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    };

    const onResize = () => {
      if (!container || !renderer) return;
      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width) || container.clientWidth || window.innerWidth;
      const height = Math.floor(rect.height) || container.clientHeight || window.innerHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);

      const mob = width < 768;
      const tab = width >= 768 && width < 1024;
      const aspect = width / Math.max(height, 1);

      const baseX = offsetX !== undefined ? offsetX : (mob ? 0 : tab ? 0.75 : 1.35 * Math.min(aspect / 1.5, 1.25));
      const baseY = offsetY !== undefined ? offsetY : (mob ? 0.45 : 0.05);
      const baseScale = (mob ? 0.68 : tab ? 0.90 : 1.15) * scaleMultiplier;

      infinityGroup.position.x = baseX;
      infinityGroup.position.y = baseY;
      infinityGroup.scale.setScalar(baseScale);
    };

    const resizeObserver = new ResizeObserver(() => {
      onResize();
    });
    resizeObserver.observe(container);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    onScroll();
    onResize();

    // ── 8. Animation Loop (60 FPS with Choreographed States) ──────────────────
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speedMult = prefersReducedMotion ? 0.15 : 1.0;
    let pulseTimeAccum = 0;

    function animate() {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime() * speedMult;

      // Mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.045;
      mouse.y += (mouse.targetY - mouse.y) * 0.045;
      mouse.speed *= 0.94; // bleed off interaction boost

      // Scroll damping
      scrollY += (targetScrollY - scrollY) * 0.06;

      // Dynamic energy flow accumulator (accelerates subtly when user moves mouse)
      const energyRate = 1.0 + mouse.speed * 0.45;
      pulseTimeAccum += delta * speedMult * energyRate;

      // Update shader uniforms
      glassUniforms.uTime.value = elapsed;
      glassUniforms.uPulseTime.value = pulseTimeAccum;
      coreUniforms.uTime.value = elapsed;
      coreUniforms.uPulseTime.value = pulseTimeAccum;
      haloMat.uniforms.uTime.value = elapsed;

      // ── Update Circulating Energy Particles ────────────────────────────────
      const circPosAttr = circGeo.attributes.position as THREE.BufferAttribute;
      const circPosArr = circPosAttr.array as Float32Array;
      for (let i = 0; i < circCount; i++) {
        circProgress[i] = (circProgress[i] + circSpeeds[i] * delta * speedMult * energyRate) % 1.0;
        const pt = curve.getPoint(circProgress[i]);
        circPosArr[i * 3 + 0] = pt.x;
        circPosArr[i * 3 + 1] = pt.y;
        circPosArr[i * 3 + 2] = pt.z;
      }
      circPosAttr.needsUpdate = true;

      // ── Choreographed Animation States & Safe Boundaries ───────────────────
      // State A & B: Hero Idle & Pointer Parallax
      const idleBobY = Math.sin(elapsed * 0.9) * 0.07;
      const idleBobX = Math.cos(elapsed * 0.6) * 0.04;
      const idleYaw = Math.sin(elapsed * 0.5) * 0.10;
      const idlePitch = Math.cos(elapsed * 0.4) * 0.06;
      const idleRoll = Math.sin(elapsed * 0.3) * 0.03;

      const mouseRotX = mouse.y * 0.18;
      const mouseRotY = mouse.x * 0.25;

      // State C & D: Controlled Scroll Transition & Dissolve into Features
      // The infinity symbol maintains its majestic horizontal identity:
      // Maximum scroll tilt is strictly capped (no awkward vertical flip!)
      const scrollNorm = Math.min(Math.max(scrollY / 700.0, 0.0), 1.0);
      const scrollRotX = scrollNorm * 0.12; // gentle 7-degree forward incline
      const scrollRotY = scrollNorm * 0.22; // gentle 12-degree profile angle
      const scrollRotZ = scrollNorm * 0.08;

      // Smooth Opacity Dissolve:
      // Begins fading after 200px and completely dissolves by 650px before touching feature cards (if enabled)
      const opacity = enableScrollDissolve
        ? Math.max(0.0, Math.min(1.0, 1.0 - (scrollY - 200.0) / 450.0))
        : 1.0;
      glassUniforms.uOpacity.value = opacity;
      coreUniforms.uOpacity.value = opacity;
      circMat.uniforms.uOpacity.value = opacity;
      haloMat.uniforms.uOpacity.value = opacity;

      // Position choreography: gently drifts up and to the right in the hero, then fades
      const w = container?.clientWidth || window.innerWidth;
      const h = container?.clientHeight || window.innerHeight;
      const mob = w < 768;
      const tab = w >= 768 && w < 1024;
      const asp = w / Math.max(h, 1);
      const currentBaseX = offsetX !== undefined ? offsetX : (mob ? 0 : tab ? 0.75 : 1.35 * Math.min(asp / 1.5, 1.25));
      const currentBaseY = offsetY !== undefined ? offsetY : (mob ? 0.45 : 0.05);
      const currentBaseScale = (mob ? 0.68 : tab ? 0.90 : 1.15) * scaleMultiplier;

      infinityGroup.rotation.x = idlePitch + mouseRotX + scrollRotX;
      infinityGroup.rotation.y = idleYaw + mouseRotY + scrollRotY;
      infinityGroup.rotation.z = idleRoll + scrollRotZ;

      infinityGroup.position.x = currentBaseX + idleBobX + mouse.x * 0.10 + scrollNorm * 0.35;
      infinityGroup.position.y = currentBaseY + idleBobY + mouse.y * 0.08 + scrollNorm * 0.45;
      infinityGroup.position.z = -scrollNorm * 0.8;
      infinityGroup.scale.setScalar(currentBaseScale * (1.0 - scrollNorm * 0.15));

      // Orbiting dynamic lighting
      violetLight.position.x = Math.sin(elapsed * 1.1) * 4.0;
      violetLight.position.y = Math.cos(elapsed * 1.4) * 3.0;
      magentaLight.position.x = -Math.cos(elapsed * 0.9) * 4.0;
      magentaLight.position.y = -Math.sin(elapsed * 1.2) * 3.0;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // ── 9. Clean up ──────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      tubeGeo.dispose();
      glassMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      circGeo.dispose();
      circMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none select-none ${className ? className : "fixed inset-0 w-full h-full"}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
