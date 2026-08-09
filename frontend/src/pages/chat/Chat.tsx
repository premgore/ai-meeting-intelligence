import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import meetingService from "../../services/meetingService";
import chatService from "../../services/chatService";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { ChatMessageItem } from "../../types";

export const Chat: React.FC = () => {
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch available meetings for context selection
  const { data: meetings = [] } = useQuery({
    queryKey: ["meetings"],
    queryFn: meetingService.getMeetings,
  });

  // Set default selected meeting once fetched
  useEffect(() => {
    if (meetings.length > 0 && selectedMeetingId === null) {
      setSelectedMeetingId(meetings[0].id);
    }
  }, [meetings, selectedMeetingId]);

  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to **AI Meeting Assistant**! Select a meeting context above, and ask me anything about transcripts, key decisions, risks, or action items.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim() || isStreaming) return;

    if (!selectedMeetingId) {
      toast.error("Please select or create a meeting context first.");
      return;
    }

    const userQ = question.trim();
    setQuestion("");

    const userMessage: ChatMessageItem = {
      id: Date.now().toString(),
      role: "user",
      content: userQ,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      meetingId: selectedMeetingId,
    };

    const assistantMessageId = (Date.now() + 1).toString();
    const initialAssistantMessage: ChatMessageItem = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      meetingId: selectedMeetingId,
    };

    setMessages((prev) => [...prev, userMessage, initialAssistantMessage]);
    setIsStreaming(true);

    try {
      // Attempt SSE streaming chat
      let accumulatedAnswer = "";
      await chatService.streamChat(
        selectedMeetingId,
        userQ,
        (chunk) => {
          accumulatedAnswer += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, content: accumulatedAnswer } : msg
            )
          );
        },
        async () => {
          // Fallback to standard REST if streaming errors
          const fallbackAnswer = await chatService.askQuestion(selectedMeetingId, userQ);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, content: fallbackAnswer } : msg
            )
          );
        },
        () => {
          setIsStreaming(false);
        }
      );
    } catch {
      setIsStreaming(false);
    }
  };

  const promptSuggestions = [
    "What were the top 3 action items assigned in this meeting?",
    "Summarize the key decisions made regarding product roadmap.",
    "Were any critical risks or blockers identified?",
  ];

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4 max-w-5xl mx-auto">
      {/* Header Banner & Meeting Context Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Bot size={22} />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              AI RAG Meeting Assistant
              <Badge variant="info">GPT-4o Stream</Badge>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Query vector embeddings across your transcript history.
            </p>
          </div>
        </div>

        {/* Meeting Context Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Context:</span>
          <select
            value={selectedMeetingId || ""}
            onChange={(e) => setSelectedMeetingId(Number(e.target.value))}
            className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {meetings.map((m) => (
              <option key={m.id} value={m.id}>
                Meeting #{m.id} - {m.title}
              </option>
            ))}
            {meetings.length === 0 && <option value="">No Meetings Available</option>}
          </select>
        </div>
      </div>

      {/* Main Chat Messages Container */}
      <Card glass className="flex-1 flex flex-col min-h-0 p-4 sm:p-6 overflow-hidden">
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
                  className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs shadow-sm ${
                    isUser
                      ? "bg-blue-600 text-white"
                      : "bg-purple-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-slate-700"
                  }`}
                >
                  {isUser ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Message Bubble Content */}
                <div className={`space-y-1 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                    <span>{isUser ? "You" : "AI Assistant"}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`relative group p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60"
                    }`}
                  >
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 bg-white/80 dark:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs"
                        title="Copy text"
                      >
                        {copiedMessageId === msg.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    )}

                    {msg.content ? (
                      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 animate-pulse py-1">
                        <Sparkles size={14} className="animate-spin text-purple-500" />
                        <span>Synthesizing response...</span>
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
        {messages.length <= 2 && (
          <div className="py-3 flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Zap size={12} className="text-amber-500" /> Prompt Ideas:
            </span>
            {promptSuggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => setQuestion(sug)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors"
              >
                "{sug}"
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} className="mt-3 flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <input
            type="text"
            placeholder="Ask AI anything about your meetings..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isStreaming}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <Button type="submit" variant="primary" isLoading={isStreaming} disabled={!question.trim()}>
            <Send size={16} />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Chat;
