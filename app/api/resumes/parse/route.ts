import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_PDF_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_TEXT_CHARS = 30_000;

function normalizeText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function POST(request: Request) {
  await requireUser();

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
      return NextResponse.json({ error: "Missing PDF file or invalid format." }, { status: 400 });
    }

    const nextFile = file as File;
    if (nextFile.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
    }

    if (nextFile.size > MAX_PDF_BYTES) {
      return NextResponse.json(
        { error: `PDF is too large. Max size is ${Math.round(MAX_PDF_BYTES / (1024 * 1024))}MB.` },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await nextFile.arrayBuffer());

    let parsedText = "";
    if (process.env.GEMINI_API_KEY) {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent([
        "Please extract all plain text from this resume document. Respond with ONLY the exact, raw extracted text, maintaining all sections and line breaks. Do not add any conversational filler. If there is no text, respond with nothing.",
        {
          inlineData: {
            data: buffer.toString("base64"),
            mimeType: "application/pdf",
          },
        },
      ]);
      parsedText = result.response.text().trim();
    } else {
      throw new Error("GEMINI_API_KEY is not configured for PDF extraction.");
    }

    const normalized = normalizeText(parsedText);
    if (!normalized) {
      return NextResponse.json(
        {
          error:
            "No readable text found. If this is a scanned PDF, export it with selectable text or run OCR first.",
        },
        { status: 422 },
      );
    }

    const truncated = normalized.length > MAX_TEXT_CHARS;
    const text = truncated ? normalized.slice(0, MAX_TEXT_CHARS) : normalized;

    return NextResponse.json({
      text,
      charCount: text.length,
      truncated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to parse PDF." },
      { status: 400 },
    );
  }
}

