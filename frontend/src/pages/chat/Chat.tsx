import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";

import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Zap,
  Search,
  FileText,
  CheckCircle2,
  ListFilter,
} from "lucide-react";

import meetingService from "../../services/meetingService";
import chatService from "../../services/chatService";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

import { ChatMessageItem } from "../../types";

export const Chat: React.FC = () => {
  // null = All Meetings
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStageIndex, setProcessingStageIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user's meetings for context dropdown
  const { data: meetings = [] } = useQuery({
    queryKey: ["meetings"],
    queryFn: meetingService.getMeetings,
  });

  // Default context is ALWAYS All Meetings
  useEffect(() => {
    setSelectedMeetingId(null);
  }, []);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to **NIRNAYA AI Assistant**. I analyze your meetings to extract decisions, action items, and strategic intelligence.\n\nYou can query across **All Meetings** or focus on a specific discussion.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing, processingStageIndex]);

  // Processing stages
  const processingStages = [
    "Searching relevant meetings...",
    "Reviewing transcript context...",
    "Finding key decisions & action items...",
    "Synthesizing structured answer...",
  ];

  // Helper to sanitize raw Python dict outputs if any reach client
  const formatAIResponse = (text: string): string => {
    if (!text) return "";
    let cleaned = text.trim();

    // Remove any accidental raw Python object strings
    if (cleaned.startsWith("{'model':") || cleaned.startsWith("{'messages':")) {
      try {
        const parsed = JSON.parse(cleaned.replace(/'/g, '"'));
        if (parsed.output) return parsed.output;
        if (parsed.content) return parsed.content;
      } catch {
        // Fallback cleanup
        cleaned = cleaned.replace(/^\{.*?'content':\s*'/s, "").replace(/'\s*\}$/s, "");
      }
    }

    return cleaned;
  };

  // Copy to clipboard
  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Send question
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!question.trim() || isProcessing) return;

    const userQ = question.trim();
    setQuestion("");

    const userMessage: ChatMessageItem = {
      id: Date.now().toString(),
      role: "user",
      content: userQ,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      meetingId: selectedMeetingId ?? undefined,
    };

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: ChatMessageItem = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      meetingId: selectedMeetingId ?? undefined,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsProcessing(true);
    setProcessingStageIndex(0);

    // Animate multi-stage processing indicator
    const stageInterval = setInterval(() => {
      setProcessingStageIndex((prev) => (prev < 3 ? prev + 1 : prev));
    }, 450);

    try {
      const rawAnswer = await chatService.askQuestion(selectedMeetingId, userQ);
      const cleanAnswer = formatAIResponse(rawAnswer);

      clearInterval(stageInterval);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: cleanAnswer,
              }
            : msg
        )
      );
    } catch (err: any) {
      clearInterval(stageInterval);
      console.error("NIRNAYA AI Error:", err);
      const errorMessage =
        err?.response?.data?.detail || "Unable to generate an answer. Please try again.";

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: `### NIRNAYA AI Notice\n\n${errorMessage}`,
              }
            : msg
        )
      );
      toast.error("AI response generation failed.");
    } finally {
      setIsProcessing(false);
      setProcessingStageIndex(0);
    }
  };

  const promptSuggestions =
    selectedMeetingId === null
      ? [
          "What were the major decisions across our recent meetings?",
          "What action items are currently pending?",
          "Summarize key risks identified in product discussions.",
        ]
      : [
          "What were the key decisions in this meeting?",
          "List all action items assigned with owners.",
          "What risks or blockers were raised?",
        ];

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col space-y-4 max-w-5xl mx-auto">
      {/* NIRNAYA AI Header & Context Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-[#E8E1D8] bg-white shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#7A171C] text-white flex items-center justify-center border border-[#C9953E]/40 shadow-xs">
            <Bot size={22} className="text-[#C9953E]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#211F1D] flex items-center gap-2">
              NIRNAYA AI
              <Badge variant="gold">Decision Intelligence</Badge>
            </h1>
            <p className="text-xs text-[#6F6A65]">
              Ask anything about your meetings and strategic decisions.
            </p>
          </div>
        </div>

        {/* Context Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#6F6A65] flex items-center gap-1">
            <ListFilter size={14} className="text-[#C9953E]" /> Context:
          </span>

          <select
            value={selectedMeetingId === null ? "all" : String(selectedMeetingId)}
            onChange={(e) => {
              if (e.target.value === "all") {
                setSelectedMeetingId(null);
              } else {
                setSelectedMeetingId(Number(e.target.value));
              }
            }}
            disabled={isProcessing}
            className="h-9 px-3 rounded-xl border border-[#E8E1D8] bg-[#FAF8F4] text-xs font-bold text-[#211F1D] focus:outline-none focus:border-[#7A171C] focus:ring-2 focus:ring-[#7A171C]/15 cursor-pointer"
          >
            <option value="all">🌐 All Meetings (Global RAG)</option>
            {meetings.map((meeting) => (
              <option key={meeting.id} value={meeting.id}>
                Meeting #{meeting.id} — {meeting.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Scope Bar */}
      <div className="flex items-center gap-2 px-1 text-xs text-[#6F6A65]">
        {selectedMeetingId === null ? (
          <>
            <Search size={14} className="text-[#C9953E]" />
            <span>Searching across <strong>All Meetings</strong> in your repository</span>
          </>
        ) : (
          <>
            <FileText size={14} className="text-[#7A171C]" />
            <span>Restricted analysis to <strong>Meeting #{selectedMeetingId}</strong></span>
          </>
        )}
      </div>

      {/* Main Chat Container */}
      <Card className="flex-1 flex flex-col min-h-0 p-4 sm:p-6 overflow-hidden bg-white">
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs shadow-xs ${
                    isUser
                      ? "bg-[#7A171C] text-white"
                      : "bg-[#FAF4E8] text-[#7A171C] border border-[#C9953E]/30"
                  }`}
                >
                  {isUser ? <User size={16} /> : <Bot size={16} className="text-[#C9953E]" />}
                </div>

                {/* Message Content */}
                <div className={`space-y-1 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2 text-[10px] text-[#6F6A65] px-1">
                    <span>{isUser ? "You" : "NIRNAYA AI"}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`relative group p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-[#7A171C] text-white rounded-tr-none"
                        : "bg-[#FAF8F4] text-[#211F1D] rounded-tl-none border border-[#E8E1D8]"
                    }`}
                  >
                    {/* Copy Action */}
                    {!isUser && msg.content && (
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 bg-white text-[#6F6A65] hover:text-[#7A171C] border border-[#E8E1D8] transition-all shadow-xs cursor-pointer"
                        title="Copy answer"
                      >
                        {copiedMessageId === msg.id ? (
                          <Check size={14} className="text-emerald-600" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    )}

                    {/* Final Answer vs Multi-stage Processing State */}
                    {msg.content ? (
                      <div className="prose max-w-none text-xs sm:text-sm text-[#211F1D] space-y-2">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      /* NIRNAYA Processing Experience Indicator */
                      <div className="space-y-2 py-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#7A171C]">
                          <Sparkles size={14} className="animate-spin text-[#C9953E]" />
                          <span>NIRNAYA is thinking...</span>
                        </div>
                        <div className="space-y-1 pl-5 text-xs text-[#6F6A65]">
                          {processingStages.map((stage, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              {idx < processingStageIndex ? (
                                <CheckCircle2 size={13} className="text-[#C9953E]" />
                              ) : idx === processingStageIndex ? (
                                <span className="h-2 w-2 rounded-full bg-[#7A171C] animate-ping" />
                              ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#E8E1D8]" />
                              )}
                              <span
                                className={
                                  idx === processingStageIndex
                                    ? "font-semibold text-[#211F1D]"
                                    : idx < processingStageIndex
                                    ? "text-[#6F6A65]"
                                    : "text-[#A39D97]"
                                }
                              >
                                {stage}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions */}
        {messages.length <= 2 && !isProcessing && (
          <div className="py-3 flex flex-wrap gap-2 border-t border-[#E8E1D8]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F6A65] flex items-center gap-1">
              <Zap size={12} className="text-[#C9953E]" /> Suggested Queries:
            </span>
            {promptSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setQuestion(suggestion)}
                className="text-xs px-3 py-1.5 rounded-xl bg-[#FAF8F4] text-[#211F1D] hover:bg-[#F7EDED] hover:text-[#7A171C] border border-[#E8E1D8] transition-colors cursor-pointer"
              >
                "{suggestion}"
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="mt-3 flex gap-2 pt-3 border-t border-[#E8E1D8]"
        >
          <input
            type="text"
            placeholder={
              selectedMeetingId === null
                ? "Ask NIRNAYA AI across all meetings..."
                : `Ask about Meeting #${selectedMeetingId}...`
            }
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#E8E1D8] bg-[#FAF8F4] text-xs sm:text-sm text-[#211F1D] placeholder-[#A39D97] focus:outline-none focus:border-[#7A171C] focus:ring-2 focus:ring-[#7A171C]/15 transition-all"
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isProcessing}
            disabled={!question.trim() || isProcessing}
          >
            <Send size={16} />
            <span className="hidden sm:inline">Send Query</span>
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Chat;
