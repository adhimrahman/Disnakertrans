"use client";
import { useState } from "react";
import { searchRelevantDocs } from "@/lib/semantic/search";
import Link from "next/link";

export default function ChatbotPage() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<
        { id: string; type: string; text: string; score: number }[]
    >([]);
    const [summary, setSummary] = useState<string>("");
    const [filter, setFilter] = useState("all");
    // const [minScore, setMinScore] = useState(0.6);
    const [minScore] = useState(0.6);

    const handleAsk = async () => {
        if (!query.trim()) return;
        setLoading(true);

        const res = await fetch("/api/embedding", {
            method: "POST",
            body: JSON.stringify({ query }),
            headers: { "Content-Type": "application/json" },
        });

        const { embedding } = await res.json();
        const docs = await searchRelevantDocs(embedding, 5);
        const filtered = filter === "all" ? docs : docs.filter((doc) => doc.type === filter);

        if (filtered.length === 0) {
            const allDocs: { id: string; type: string; text: string; score: number }[] = [];
            const keywordHits = allDocs.filter((doc) =>
                doc.text.toLowerCase().includes(query.toLowerCase())
            );
            setResults(keywordHits.slice(0, 3));
            setSummary("Menampilkan hasil berdasarkan pencocokan kata kunci.");
            setLoading(false);
            return;
        }

        setResults(filtered);
        setSummary(filtered.length > 0 ? filtered[0].text.split("\n")[0] : "");
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">🤖 Chatbot Disnaker AI</h1>

            <div className="flex gap-2 mb-4">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Tanyakan tentang kegiatan, pelatihan, atau lowongan..."
                />
                <button
                    onClick={handleAsk}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Mencari..." : "Tanya"}
                </button>
            </div>

            <div className="mb-4">
                <label className="font-medium mr-2">Kategori:</label>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border p-2 rounded text-gray-200 bg-black"
                >
                    <option value="all">Semua</option>
                    <option value="pelatihan">Pelatihan</option>
                    <option value="lowongan">Lowongan</option>
                    <option value="kegiatan">Kegiatan</option>
                </select>
            </div>

            {summary && (
                <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded">
                    <strong className="text-green-700">Jawaban AI:</strong>
                    <span className="text-xs text-green-800 mt-1 opacity-30">{summary}</span>
                </div>
            )}

            {results.length > 0 && (
                <div className="space-y-4">
                    {results.map((res) => (
                        <div key={res.id} className="border p-4 rounded shadow bg-gray-200">
                            <div className="text-sm text-gray-500 uppercase font-semibold">
                                {res.type}
                            </div>
                            <div className="font-medium mb-2 text-gray-900">{res.text.split("\n")[0]}</div>
                            <div className="text-sm text-gray-600">
                                {res.text.split("\n").slice(1).join(" ").slice(0, 250)}...
                            </div>  
                            <h2 className="text-sm mt-3 text-black">Kemiripan: {Math.round(minScore * 100)}%</h2>
                            <Link href={`/${res.type}/${res.id}`}
                                className="text-blue-600 text-sm my-3 inline-block" target="_blank">
                                ➜ Lihat Detail
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}