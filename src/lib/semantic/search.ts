import { cosineSimilarity } from "@/lib/semantic/utils";

type EmbeddingItem = {
    id: string;
    type: string;
    text: string;
    embedding: number[];
};

type RawEmbeddingItem = {
    id: string;
    type: string;
    text: string;
    embedding: { [key: string]: number };
};

import rawEmbeddings from "../../../public/embeddings.json";
const embeddings: EmbeddingItem[] = (rawEmbeddings as RawEmbeddingItem[]).map((item) => ({
    ...item,
    embedding: Object.values(item.embedding),
}));

export async function searchRelevantDocs(queryEmbedding: number[], topN = 3) {
    const ranked = embeddings.map((item) => ({
        ...item,
        score: cosineSimilarity(queryEmbedding, item.embedding),
    }));

    return ranked.sort((a, b) => b.score - a.score).slice(0, topN);
}