"use client";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { faqs } from "@/lib/data/faq";

export default function FAQPage() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    return (
        <section id="faq" className="py-9 md:py-22 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
                    FREQUENTLY ASKED QUESTIONS
                </h1>
                <div className="space-y-3">
                    {faqs.map((item, index) => (
                        <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm bg-white">
                            <button onClick={() => toggleFAQ(index)}
                                className={`w-full flex justify-between items-center px-6 py-4 hover:cursor-pointer text-left transition-colors ${
                                    activeIndex === index ? "bg-darkBlue text-white" : "bg-white text-gray-800"
                                }`} aria-expanded={activeIndex === index} aria-controls={`faq-answer-${index}`}
                            >
                                <span className="font-medium">{item.question}</span>
                                {activeIndex === index ? ( <FaChevronUp className="ml-2" /> ) : ( <FaChevronDown className="ml-2" /> )}
                            </button>
                            <div id={`faq-answer-${index}`}
                            className={`transition-all duration-300 px-6 text-sm hover:cursor-pointer leading-relaxed ${
                                activeIndex === index ? "max-h-[300px] py-4 bg-darkBlue text-white" : "max-h-0 overflow-hidden"
                            }`}>
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}