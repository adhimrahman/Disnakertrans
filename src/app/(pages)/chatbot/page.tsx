"use client";
import { useState } from "react";
import { searchRelevantDocsFromRaw } from "@/lib/semantic/search";
import Link from "next/link";
import Header from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ChatbotPage() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<
        { id: string; type: string; text: string; score: number }[]
    >([]);
    const [summary, setSummary] = useState<string>("");
    const [filter, setFilter] = useState("all");
    const [minScore] = useState(0.2);

    const handleAsk = async () => {
        if (!query.trim()) return;
        setLoading(true);

        const res = await fetch("/api/embedding", {
            method: "POST",
            body: JSON.stringify({ query }),
            headers: { "Content-Type": "application/json" },
        });

        const { embedding } = await res.json();

        const docsRes = await fetch("/api/embedding", { cache: "no-store" });
        const rawDocs = await docsRes.json();
        const docs = await searchRelevantDocsFromRaw(rawDocs, embedding, 2, minScore);

        const filtered = filter === "all" ? docs : docs.filter((doc) => doc.type === filter);

        if (filtered.length === 0) {
            setResults([]);
            setSummary("Tidak ditemukan hasil dengan skor memadai.");
            setLoading(false);
            return;
        }

        setResults(filtered.map((doc: { id: string; type: string; text: string; score?: number }) => ({
            id: doc.id,
            type: doc.type,
            text: doc.text,
            score: doc.score ?? 0
        })));
        setSummary(filtered[0].text.split("\n")[0]);
        setLoading(false);
    };

    return (
        <>
        <Header />
        <div className="mx-auto px-56 py-8 pt-26 bg-steelBlue w-full min-h-[calc(100vh-64px)]">

            <h1 className="text-2xl font-bold mb-4">🤖 Chatbot Disnaker AI</h1>

            <div className="flex gap-2 mb-4">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 px-4 py-3 border rounded outline-0"
                    placeholder="Tanyakan tentang kegiatan, pelatihan, atau lowongan..."
                />
                <button
                    onClick={handleAsk}
                    className="bg-darkBlue text-white px-4 py-3 rounded disabled:opacity-50 hover:cursor-pointer"
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
                    className="border p-2 rounded text-gray-200 bg-darkBlue hover:cursor-pointer"
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
                    <span className="text-xs text-green-800 mt-1 opacity-0">{summary}</span>
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
        <Footer />
        </>
    );
}