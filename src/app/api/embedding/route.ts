import { NextRequest, NextResponse } from "next/server";
import { pipeline } from "@xenova/transformers";
import path from "path";
import fs from "fs";

export async function GET() {
    const filePath = path.join(process.cwd(), "src", "lib", "data", "embeddings.json");

    try {
        const content = fs.readFileSync(filePath, "utf-8");
        return NextResponse.json(JSON.parse(content));
    } catch (e) {
        console.error("Error reading embeddings file:", e);
        return NextResponse.json({ error: "Gagal membaca embeddings" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });

    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const output = await extractor(query, { pooling: "mean", normalize: true });

    return NextResponse.json({ embedding: Array.from(output.data) });
}