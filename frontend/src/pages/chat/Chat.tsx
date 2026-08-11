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
  Brain,
} from "lucide-react";

import meetingService from "../../services/meetingService";
import chatService from "../../services/chatService";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

import { ChatMessageItem } from "../../types";


export const Chat: React.FC = () => {

  /*
   * null = ALL MEETINGS
   * number = selected meeting
   */
  const [selectedMeetingId, setSelectedMeetingId] =
    useState<number | null>(null);

  const [question, setQuestion] =
    useState("");

  const [copiedMessageId, setCopiedMessageId] =
    useState<string | null>(null);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [processingStep, setProcessingStep] =
    useState("");

  const messagesEndRef =
    useRef<HTMLDivElement>(null);


  /*
   * Load user's meetings
   */
  const {
    data: meetings = [],
  } = useQuery({
    queryKey: ["meetings"],
    queryFn: meetingService.getMeetings,
  });


  /*
   * IMPORTANT:
   *
   * We intentionally DO NOT select Meeting #1.
   *
   * null means:
   *
   * "Search across all meetings"
   */
  useEffect(() => {
    setSelectedMeetingId(null);
  }, []);


  /*
   * Initial message
   */
  const [messages, setMessages] =
    useState<ChatMessageItem[]>([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Welcome to **AI Meeting Assistant**! I can search across all your meetings or focus on a specific meeting. Choose a context above and ask me anything about your meetings.",
        timestamp: new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
      },
    ]);


  /*
   * Auto scroll
   */
  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages, isProcessing]);


  /*
   * Copy
   */
  const handleCopy = (
    content: string,
    id: string
  ) => {

    navigator.clipboard.writeText(content);

    setCopiedMessageId(id);

    toast.success(
      "Copied to clipboard!"
    );

    setTimeout(
      () => setCopiedMessageId(null),
      2000
    );
  };


  /*
   * Send question
   */
  const handleSend = async (
    e?: React.FormEvent
  ) => {

    e?.preventDefault();

    if (
      !question.trim() ||
      isProcessing
    ) {
      return;
    }


    const userQ =
      question.trim();

    setQuestion("");


    /*
     * User message
     */
    const userMessage: ChatMessageItem = {
      id: Date.now().toString(),
      role: "user",
      content: userQ,
      timestamp: new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
      meetingId:
        selectedMeetingId ?? undefined,
    };


    /*
     * Assistant placeholder
     */
    const assistantMessageId =
      (Date.now() + 1).toString();

    const assistantMessage:
      ChatMessageItem = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
        meetingId:
          selectedMeetingId ?? undefined,
      };


    setMessages((prev) => [
      ...prev,
      userMessage,
      assistantMessage,
    ]);


    setIsProcessing(true);


    try {

      /*
       * STEP 1
       */
      setProcessingStep(
        selectedMeetingId
          ? `Reading Meeting #${selectedMeetingId}...`
          : "Searching your meetings..."
      );


      /*
       * Give the UI a moment to show
       * the processing state.
       */
      await new Promise(
        (resolve) =>
          setTimeout(resolve, 300)
      );


      /*
       * STEP 2
       */
      setProcessingStep(
        "Finding relevant information..."
      );


      await new Promise(
        (resolve) =>
          setTimeout(resolve, 300)
      );


      /*
       * STEP 3
       */
      setProcessingStep(
        "Analyzing meeting data..."
      );


      /*
       * Use the reliable REST endpoint.
       *
       * null = all meetings
       * number = selected meeting
       */
      const answer =
        await chatService.askQuestion(
          selectedMeetingId,
          userQ
        );


      /*
       * STEP 4
       */
      setProcessingStep(
        "Preparing answer..."
      );


      await new Promise(
        (resolve) =>
          setTimeout(resolve, 200)
      );


      /*
       * Put final answer into message
       */
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: answer,
              }
            : msg
        )
      );

    } catch (err: any) {

      console.error(
        "AI Chat Error:",
        err
      );

      const errorMessage =
        err?.response?.data?.detail ||
        "Unable to generate an answer. Please try again.";

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content:
                  `### Something went wrong\n\n${errorMessage}`,
              }
            : msg
        )
      );

      toast.error(
        "AI response failed."
      );

    } finally {

      setIsProcessing(false);
      setProcessingStep("");
    }
  };


  /*
   * Context label
   */
  const contextLabel =
    selectedMeetingId === null
      ? "All Meetings"
      : `Meeting #${selectedMeetingId}`;


  /*
   * Prompt suggestions
   */
  const promptSuggestions =
    selectedMeetingId === null
      ? [
          "What were the main decisions from my recent meetings?",
          "What are the most important action items across my meetings?",
          "Were there any important risks or blockers?",
        ]
      : [
          "What was the agenda of this meeting?",
          "What were the key decisions?",
          "What action items were assigned?",
        ];


  return (

    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4 max-w-5xl mx-auto">


      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">

        <div className="flex items-center gap-3">

          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-md">

            <Bot size={22} />

          </div>


          <div>

            <h1 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">

              AI Meeting Assistant

              <Badge variant="info">
                AI
              </Badge>

            </h1>


            <p className="text-xs text-slate-500 dark:text-slate-400">

              Ask questions across your meetings
              or select a specific meeting.

            </p>

          </div>

        </div>


        {/* CONTEXT SELECTOR */}

        <div className="flex items-center gap-2">

          <span className="text-xs font-semibold text-slate-500">
            Context:
          </span>


          <select
            value={
              selectedMeetingId === null
                ? "all"
                : String(selectedMeetingId)
            }

            onChange={(e) => {

              if (
                e.target.value === "all"
              ) {

                setSelectedMeetingId(
                  null
                );

              } else {

                setSelectedMeetingId(
                  Number(
                    e.target.value
                  )
                );
              }

            }}

            disabled={isProcessing}

            className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >

            {/* DEFAULT */}

            <option value="all">
              All Meetings
            </option>


            {/* INDIVIDUAL MEETINGS */}

            {meetings.map(
              (meeting) => (

                <option
                  key={meeting.id}
                  value={meeting.id}
                >
                  Meeting #{meeting.id} - {meeting.title}
                </option>

              )
            )}

          </select>

        </div>

      </div>


      {/* ACTIVE CONTEXT */}

      <div className="flex items-center gap-2 px-1">

        {selectedMeetingId === null ? (

          <>
            <Search
              size={14}
              className="text-blue-500"
            />

            <span className="text-xs text-slate-500">
              Searching across all your meetings
            </span>
          </>

        ) : (

          <>
            <FileText
              size={14}
              className="text-purple-500"
            />

            <span className="text-xs text-slate-500">
              Focused on Meeting #{selectedMeetingId}
            </span>
          </>

        )}

      </div>


      {/* CHAT */}

      <Card
        glass
        className="flex-1 flex flex-col min-h-0 p-4 sm:p-6 overflow-hidden"
      >

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">

          {messages.map((msg) => {

            const isUser =
              msg.role === "user";


            return (

              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${
                  isUser
                    ? "flex-row-reverse"
                    : "flex-row"
                }`}
              >

                {/* AVATAR */}

                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs shadow-sm ${
                    isUser
                      ? "bg-blue-600 text-white"
                      : "bg-purple-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-slate-700"
                  }`}
                >

                  {isUser ? (
                    <User size={16} />
                  ) : (
                    <Bot size={16} />
                  )}

                </div>


                {/* MESSAGE */}

                <div
                  className={`space-y-1 max-w-[85%] ${
                    isUser
                      ? "items-end"
                      : "items-start"
                  }`}
                >

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">

                    <span>
                      {isUser
                        ? "You"
                        : "AI Assistant"}
                    </span>

                    <span>
                      •
                    </span>

                    <span>
                      {msg.timestamp}
                    </span>

                  </div>


                  <div
                    className={`relative group p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60"
                    }`}
                  >

                    {/* COPY */}

                    {!isUser &&
                      msg.content && (

                        <button
                          onClick={() =>
                            handleCopy(
                              msg.content,
                              msg.id
                            )
                          }

                          className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 bg-white/80 dark:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs"
                          title="Copy text"
                        >

                          {copiedMessageId ===
                          msg.id ? (
                            <Check
                              size={14}
                              className="text-emerald-500"
                            />
                          ) : (
                            <Copy
                              size={14}
                            />
                          )}

                        </button>

                      )}


                    {/* CONTENT */}

                    {msg.content ? (

                      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm">

                        <ReactMarkdown
                          remarkPlugins={[
                            remarkGfm,
                          ]}
                        >
                          {msg.content}
                        </ReactMarkdown>

                      </div>

                    ) : (

                      <div className="flex items-center gap-2 text-slate-400 py-1">

                        <Sparkles
                          size={14}
                          className="animate-pulse text-purple-500"
                        />

                        <span>
                          {processingStep ||
                            "Thinking..."}
                        </span>

                      </div>

                    )}

                  </div>

                </div>

              </div>

            );
          })}


          <div
            ref={messagesEndRef}
          />

        </div>


        {/* PROMPT SUGGESTIONS */}

        {messages.length <= 2 &&
          !isProcessing && (

            <div className="py-3 flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800">

              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">

                <Zap
                  size={12}
                  className="text-amber-500"
                />

                Prompt Ideas:

              </span>


              {promptSuggestions.map(
                (suggestion, index) => (

                  <button
                    key={index}
                    onClick={() =>
                      setQuestion(
                        suggestion
                      )
                    }

                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors"
                  >
                    "{suggestion}"
                  </button>

                )
              )}

            </div>

          )}


        {/* INPUT */}

        <form
          onSubmit={handleSend}
          className="mt-3 flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800"
        >

          <input
            type="text"
            placeholder={
              selectedMeetingId === null
                ? "Ask anything across your meetings..."
                : `Ask anything about Meeting #${selectedMeetingId}...`
            }

            value={question}

            onChange={(e) =>
              setQuestion(
                e.target.value
              )
            }

            disabled={isProcessing}

            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />


          <Button
            type="submit"
            variant="primary"
            isLoading={isProcessing}
            disabled={
              !question.trim() ||
              isProcessing
            }
          >

            <Send size={16} />

            <span className="hidden sm:inline">
              Send
            </span>

          </Button>

        </form>

      </Card>

    </div>
  );
};


export default Chat;
