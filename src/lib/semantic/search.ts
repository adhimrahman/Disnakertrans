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

export async function searchRelevantDocsFromRaw(
    docs: RawEmbeddingItem[],
    queryEmbedding: number[],
    topN = 2,
    minScore = 0.2
): Promise<EmbeddingItem[]> {
    const embeddings: EmbeddingItem[] = docs.map((item) => ({
        ...item,
        embedding: Object.values(item.embedding),
    }));

    const ranked = embeddings.map((item) => ({
        ...item,
        score: cosineSimilarity(queryEmbedding, item.embedding),
    }));

    const filtered = ranked.filter((item) => item.score >= minScore);
    return filtered.sort((a, b) => b.score - a.score).slice(0, topN);
}