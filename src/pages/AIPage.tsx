import { useEffect, useRef, useState } from "react";
import { InputGroup, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { useAIMutation } from "@/services/baseApi";
import { Loader2, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

// 💡 Chat xabari uchun interfeys
interface ChatMessage {
    role: "user" | "ai";
    text: string;
}

export default function AIPage() {
    const [sendRequest, { isLoading }] = useAIMutation();
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<ChatMessage[]>([]);
    const chatRef = useRef<HTMLDivElement>(null);

    const handleSend = async () => {
        if (!message.trim()) return;

        const newUserMsg: ChatMessage = { role: "user", text: message };
        setChat((prev) => [...prev, newUserMsg]);

        try {
            const res = await sendRequest({ body: { content: message } }).unwrap();
            const aiResponse: ChatMessage = {
                role: "ai",
                text: res?.data || "AI javobi topilmadi",
            };
            setChat((prev) => [...prev, aiResponse]);
        } catch (error) {
            console.error("AI so‘rovi xatosi:", error);
            setChat((prev) => [...prev, { role: "ai", text: "❌ Xatolik yuz berdi" }]);
        } finally {
            setMessage("");
        }
    };

    // 🔽 Har safar yangi xabar qo‘shilganda pastga scroll bo‘ladi
    useEffect(() => {
        chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [chat]);

    return (
        <div className="w-full min-h-screen bg-white flex flex-col items-center justify-between pt-10">
            {/* 💬 Chat oynasi */}
            <div
                ref={chatRef}
                className="w-4/5 shadow-lg rounded-2xl h-[80vh] py-5 px-8 overflow-y-auto bg-white border border-zinc-200"
            >
                <div className="border-b">
                    <h1 className="text-xl font-bold">AI chat</h1>
                </div>
                <div className="space-y-5">
                    {chat.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`p-4 rounded-2xl shadow-sm max-w-[70%] leading-relaxed ${msg.role === "user"
                                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                                    : "bg-zinc-100 text-zinc-800"
                                    }`}
                            >
                                {msg.role === "ai" ? (
                                    <ReactMarkdown
                                        components={{
                                            p: ({ ...props }) => <p className="mb-2" {...props} />,
                                            strong: ({ ...props }) => <strong className="font-semibold" {...props} />,
                                            ul: ({ ...props }) => <ul className="list-disc ml-4" {...props} />,
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                ) : (
                                    msg.text
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-2 bg-zinc-100 text-zinc-700 p-3 rounded-2xl">
                                <Loader2 className="w-5 h-5 animate-spin text-zinc-600" /> {/* 🔄 loader */}
                                <span>AI javob bermoqda...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ✍️ Xabar yuborish inputi */}
            <div className="w-3/5 fixed bottom-6 left-1/2 -translate-x-1/2">
                <InputGroup className="bg-white border border-zinc-300 shadow-md rounded-2xl overflow-hidden">
                    <InputGroupTextarea
                        placeholder="Xabar yozing..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        disabled={isLoading}
                        className="resize-none"
                    />
                    <InputGroupButton
                        className="w-12 h-12 bg-blue-600 cursor-pointer hover:bg-blue-700 flex items-center justify-center transition-all mr-5"
                        onClick={handleSend}
                        disabled={isLoading}
                    >
                        <Send stroke="white" size={20} />
                    </InputGroupButton>
                </InputGroup>
            </div>
        </div>
    );
}
