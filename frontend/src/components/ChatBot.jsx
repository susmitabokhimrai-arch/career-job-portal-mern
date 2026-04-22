import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";

const ChatBot = () => {
    const { user } = useSelector((store) => store.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "model",
            parts: [{ text: `Hi ${user?.fullname?.split(" ")[0] || "there"}! 👋 I'm CareerBot, your AI career assistant. I can help you with:\n\n• Finding the right job or internship\n• Career advice and guidance\n• Resume tips\n• Interview preparation\n• Questions about CareerYatra platform\n\nHow can I help you today?` }]
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    if (!user || user.role !== "student") return null;

    const systemInstruction = `You are CareerBot, a helpful AI assistant for CareerYatra — a job and internship portal for students in Nepal.

Your job is to help students with:
1. Career guidance — suggest career paths based on their interests and skills
2. Job search tips — how to find the right jobs and internships
3. Resume advice — how to write a great resume
4. Interview preparation — common questions, tips, and how to answer them
5. Platform help — explain how CareerYatra works

About CareerYatra platform:
- Students can browse and apply for jobs and internships
- Students can save jobs for later
- Students can build their resume using the AI Resume Builder
- Students can update their profile with skills, bio, and resume
- Recruiters post jobs on the platform
- Admin manages the platform

Keep responses concise, friendly, and helpful. Use bullet points when listing things.
If asked something unrelated to careers or the platform, politely redirect to career topics.
The user's name is ${user?.fullname || "Student"} and their skills are: ${user?.profile?.skills?.join(", ") || "not specified yet"}.`;

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = {
            role: "user",
            parts: [{ text: input.trim() }]
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `${systemInstruction}\n\nUser: ${input}`
                                    }
                                ]
                            }
                        ]
                    })
                }
            );

            const data = await response.json();
            const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "Sorry, I couldn't understand that. Please try again!";

            setMessages(prev => [...prev, {
                role: "model",
                parts: [{ text: botReply }]
            }]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                role: "model",
                parts: [{ text: "Sorry, I'm having trouble connecting right now. Please try again! 🙏" }]
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const quickQuestions = [
        "How do I apply for a job?",
        "Tips for resume writing",
        "How to prepare for interview?",
        "How to save a job?"
    ];

    const getMessageText = (msg) => msg.parts?.[0]?.text || "";

    return (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}>

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: "360px",
                    height: "520px",
                    background: "#ffffff",
                    borderRadius: "20px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "16px",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb"
                }}>

                    {/* Header */}
                    <div style={{
                        background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                        padding: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                                width: "36px",
                                height: "36px",
                                background: "rgba(255,255,255,0.2)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Bot size={20} color="white" />
                            </div>
                            <div>
                                <p style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: 0 }}>CareerBot</p>
                                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <div style={{ width: "6px", height: "6px", background: "#4ade80", borderRadius: "50%" }}></div>
                                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", margin: 0 }}>Online • Powered by Gemini</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: "rgba(255,255,255,0.2)",
                                border: "none",
                                borderRadius: "50%",
                                width: "30px",
                                height: "30px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <X size={16} color="white" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        background: "#f9fafb"
                    }}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                                    alignItems: "flex-end",
                                    gap: "8px"
                                }}
                            >
                                {msg.role === "model" && (
                                    <div style={{
                                        width: "28px",
                                        height: "28px",
                                        background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0
                                    }}>
                                        <Bot size={14} color="white" />
                                    </div>
                                )}
                                <div style={{
                                    maxWidth: "75%",
                                    padding: "10px 14px",
                                    borderRadius: msg.role === "user"
                                        ? "18px 18px 4px 18px"
                                        : "18px 18px 18px 4px",
                                    background: msg.role === "user"
                                        ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                                        : "#ffffff",
                                    color: msg.role === "user" ? "white" : "#1a1a1a",
                                    fontSize: "13px",
                                    lineHeight: "1.6",
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    border: msg.role === "model" ? "1px solid #e5e7eb" : "none"
                                }}>
                                    {getMessageText(msg)}
                                </div>
                            </div>
                        ))}

                        {/* Loading */}
                        {loading && (
                            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                                <div style={{
                                    width: "28px",
                                    height: "28px",
                                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <Bot size={14} color="white" />
                                </div>
                                <div style={{
                                    padding: "12px 16px",
                                    background: "#ffffff",
                                    borderRadius: "18px 18px 18px 4px",
                                    border: "1px solid #e5e7eb",
                                    display: "flex",
                                    gap: "4px",
                                    alignItems: "center"
                                }}>
                                    <div style={{ width: "6px", height: "6px", background: "#7c3aed", borderRadius: "50%", animation: "bounce 1s infinite" }}></div>
                                    <div style={{ width: "6px", height: "6px", background: "#7c3aed", borderRadius: "50%", animation: "bounce 1s infinite 0.2s" }}></div>
                                    <div style={{ width: "6px", height: "6px", background: "#7c3aed", borderRadius: "50%", animation: "bounce 1s infinite 0.4s" }}></div>
                                </div>
                            </div>
                        )}

                        {/* Quick Questions */}
                        {messages.length === 1 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                                <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>Quick questions:</p>
                                {quickQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setInput(q);
                                            inputRef.current?.focus();
                                        }}
                                        style={{
                                            background: "#f3e8ff",
                                            border: "1px solid #e9d5ff",
                                            borderRadius: "20px",
                                            padding: "6px 12px",
                                            fontSize: "12px",
                                            color: "#7c3aed",
                                            cursor: "pointer",
                                            textAlign: "left",
                                            fontWeight: "500"
                                        }}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{
                        padding: "12px 16px",
                        background: "#ffffff",
                        borderTop: "1px solid #e5e7eb",
                        display: "flex",
                        gap: "8px",
                        alignItems: "flex-end"
                    }}>
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything..."
                            rows={1}
                            style={{
                                flex: 1,
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                padding: "10px 14px",
                                fontSize: "13px",
                                resize: "none",
                                outline: "none",
                                fontFamily: "inherit",
                                color: "#1a1a1a",
                                background: "#f9fafb",
                                maxHeight: "80px",
                                overflowY: "auto"
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            style={{
                                width: "40px",
                                height: "40px",
                                background: loading || !input.trim()
                                    ? "#e5e7eb"
                                    : "linear-gradient(135deg, #7c3aed, #4f46e5)",
                                border: "none",
                                borderRadius: "12px",
                                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0
                            }}
                        >
                            <Send size={16} color={loading || !input.trim() ? "#9ca3af" : "white"} />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: "56px",
                    height: "56px",
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 20px rgba(124, 58, 237, 0.4)",
                    transition: "transform 0.2s",
                    position: "relative"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
                {isOpen
                    ? <X size={24} color="white" />
                    : <MessageCircle size={24} color="white" />
                }
                {!isOpen && (
                    <div style={{
                        position: "absolute",
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        background: "rgba(124, 58, 237, 0.3)",
                        animation: "pulse 2s infinite"
                    }} />
                )}
            </button>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(1.8); opacity: 0; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
            `}</style>
        </div>
    );
};

export default ChatBot;