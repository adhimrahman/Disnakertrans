import { NextRequest, NextResponse } from "next/server";
import { pipeline } from "@xenova/transformers";

type SummarizeFn = (text: string | string[], options: { max_length?: number }) => Promise<
  	{ summary_text: string }[]
>;

let summarizer: SummarizeFn | null = null;

export async function POST(req: NextRequest) {
    const { text } = await req.json();
    if (!summarizer) {
        // summarizer = await pipeline("summarization", "Xenova/distilbart-cnn-12-6");
        summarizer = await pipeline("summarization", "Xenova/t5-small") as SummarizeFn;
    }

    const output = await summarizer(text, { max_length: 60 });
    
    if (!text || typeof text !== "string" || text.length < 10) {
        return NextResponse.json({ result: "Teks terlalu pendek untuk diringkas." });
    }
    return NextResponse.json({ result: output[0].summary_text });
}