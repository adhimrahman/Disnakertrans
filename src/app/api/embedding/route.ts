import { NextRequest, NextResponse } from "next/server";
import { pipeline } from "@xenova/transformers";

export async function POST(req: NextRequest) {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });

    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const output = await extractor(query, { pooling: "mean", normalize: true });

    return NextResponse.json({ embedding: Array.from(output.data) });
}