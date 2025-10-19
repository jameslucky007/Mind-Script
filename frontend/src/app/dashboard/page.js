"use client";
import React, { useState, useRef, useEffect } from "react";
import { Plus, Mic, Image as ImgIcon, Video, X, Send } from "lucide-react";
import axios from "axios";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { useAuth } from "@/firebase/useAuth";

export default function DashboardPage() {
  const user = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const recognitionRef = useRef(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const autoScrollRef = useRef(true);

  const [messages, setMessages] = useState([]);

  // Voice input
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript || "";
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const extractTextHandler = async () => {
    setImgLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:14000/extract-image",
        {
          image: imageFile,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const text = res.data?.text;
      if (text) {
        const msg = `Ignore all the special characters and find the data according to valid text string or if you dont know than ask me to what to do.\n ${text}`;
        handleSend(msg);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setImgLoading(false);
    }
  };

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!imageFile) return;

    const objectUrl = URL.createObjectURL(imageFile);
    setPreview(objectUrl);

    // cleanup
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    autoScrollRef.current = distance < 120;
  };

  useEffect(() => {
    if (autoScrollRef.current && messages.length > 0) {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
    }
  }, [messages, isLoading]);

  // autosize
  const taRef = useRef(null);
  const autosize = () => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    const max = 200; // px cap (about 8–10 lines depending on font)
    el.style.height = Math.min(el.scrollHeight, max) + "px";
  };

  useEffect(() => {
    autosize();
  }, [input]);

  const handleSend = async (query = "") => {
    const text = input.trim() || query;
    if (!text || isLoading) return;

    setMessages((p) => [...p, { role: "user", content: text }]);
    setInput("");
    setIsLoading(true);
    setImageFile(null);
    setPreview(null);

    let assistantIndex = -1;
    setMessages((p) => {
      assistantIndex = p.length;
      return [...p, { role: "assistant", content: "" }];
    });

    try {
      const res = await fetch("https://ai-chatbot-y7q6.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, userEmail: user?.email }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const copy = [...prev];
          if (assistantIndex === -1) assistantIndex = copy.length - 1;
          copy[assistantIndex] = {
            ...copy[assistantIndex],
            content: (copy[assistantIndex].content || "") + chunk,
          };
          return copy;
        });
      }
    } catch (e) {
      console.error(e);
      setMessages((p) => [
        ...p,
        { role: "assistant", content: "⚠️ Error connecting to server." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (e) => {
    // Enter -> send, Shift+Enter -> newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Welcome Screen or Chat Messages */}
        {messages.length === 0 ? (
          // Welcome Screen
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Welcome to MindScript
              </h1>
              <p className="text-gray-400 text-lg">
                Ask or search for a true fact...
              </p>
            </div>
          </div>
        ) : (
          // Chat Messages
          <div className="flex-1 overflow-hidden">
            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="h-full overflow-y-auto px-4 py-6 space-y-6"
            >
              {messages.map((message, index) => (
                <div key={index} className="max-w-4xl mx-auto">
                  {message.role === "user" ? (
                    <div className="flex justify-end mb-4">
                      <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 max-w-xs md:max-w-2xl">
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start mb-4">
                      <div className="bg-gray-700 text-white rounded-2xl px-4 py-3 max-w-xs md:max-w-2xl">
                        <MarkdownRenderer content={message.content} />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="max-w-4xl mx-auto">
                  <div className="flex justify-start mb-4">
                    <div className="bg-gray-700 text-white rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>
        )}

        {/* Image Preview */}
        {preview && (
          <div className="px-4 pb-2">
            <div className="max-w-4xl mx-auto">
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-600"
                />
                <button
                  onClick={() => {
                    setImageFile(null);
                    setPreview(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className=" px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end bg-gray-800 rounded-full border border-gray-600 focus-within:border-blue-500 transition-colors">
              {/* Textarea */}
              <textarea
                ref={taRef}
                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-400 resize-none outline-none rounded-l-full min-h-[48px] max-h-[200px]"
                placeholder="Ask or search for a true fact..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={isLoading}
                rows={1}
              />

              {/* Voice Button */}
              <button
                onClick={handleVoiceInput}
                className={`p-3 transition-colors rounded-full ${
                  isListening
                    ? "text-red-400 animate-pulse"
                    : "text-gray-400 hover:text-blue-400"
                }`}
                aria-label="Voice input"
                disabled={isLoading}
              >
                <Mic size={20} />
              </button>

              {/* Upload Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-3 text-gray-400 hover:text-blue-400 transition-colors rounded-full"
                  aria-label="Upload menu"
                  disabled={isLoading}
                >
                  {isMenuOpen ? <X size={20} /> : <Plus size={20} />}
                </button>

                {isMenuOpen && (
                  <div className="absolute bottom-full mb-2 right-0 bg-gray-800 rounded-lg shadow-lg border border-gray-600 p-2 min-w-[140px]">
                    <label className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer text-sm">
                      <ImgIcon size={16} />
                      <span>Images</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setImageFile(file);
                            setIsMenuOpen(false);
                          }
                        }}
                      />
                    </label>
                    <label className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer text-sm">
                      <Video size={16} />
                      <span>Videos</span>
                      <input type="file" accept="video/*" className="hidden" />
                    </label>
                  </div>
                )}
              </div>

              {/* Send Button */}
              <button
                onClick={preview ? extractTextHandler : handleSend}
                disabled={
                  isLoading || imgLoading || (!input.trim() && !preview)
                }
                className="p-3 text-gray-400 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-full mr-1"
                aria-label="Send message"
              >
                {isLoading || imgLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-blue-400 rounded-full animate-spin"></div>
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
