import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FileText,
  Sparkles,
  Download,
  Mail,
  Upload,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  TrendingUp,
  Play,
  Volume2,
  RefreshCw,
  Send,
} from "lucide-react";
import meetingService from "../../services/meetingService";
import chatService from "../../services/chatService";
import { Tabs } from "../../components/ui/Tabs";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Skeleton } from "../../components/ui/Skeleton";
import { getSentimentBadge } from "../../lib/utils";

export const MeetingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const meetingId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("transcript");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState("");

  // Embedded Chat State
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: `Hello! I am your AI assistant for Meeting #${id}. Ask me any question about this meeting's transcript, decisions, or action items.` },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch Meeting Details
  const { data: meeting, isLoading, error } = useQuery({
    queryKey: ["meeting", meetingId],
    queryFn: () => meetingService.getMeetingById(meetingId),
    enabled: !isNaN(meetingId),
  });

  // Mutations for Transcribe, Summarize, Report
  const transcribeMutation = useMutation({
    mutationFn: () => meetingService.transcribeMeeting(meetingId),
    onSuccess: (updated) => {
      toast.success("Audio transcribed successfully!");
      queryClient.setQueryData(["meeting", meetingId], updated);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Transcription failed.");
    },
  });

  const summarizeMutation = useMutation({
    mutationFn: () => meetingService.summarizeMeeting(meetingId),
    onSuccess: (updated) => {
      toast.success("AI Insights generated successfully!");
      queryClient.setQueryData(["meeting", meetingId], updated);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "AI Summarization failed.");
    },
  });

  const handleDownloadReport = async () => {
    try {
      const blob = await meetingService.downloadReport(meetingId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `meeting_${meetingId}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("PDF Report downloaded!");
    } catch (err: any) {
      toast.error("Failed to download PDF report.");
    }
  };

  const handleSendEmailReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRecipients.trim()) return;
    const recipients = emailRecipients.split(",").map((s) => s.trim());
    try {
      await meetingService.sendReport(meetingId, recipients);
      toast.success("Report emailed to recipients!");
      setShowEmailModal(false);
      setEmailRecipients("");
    } catch (err: any) {
      toast.error("Failed to email report.");
    }
  };

  // Handle Embedded Chat Send
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim() || chatLoading) return;
    const q = chatQuestion.trim();
    setChatQuestion("");
    setChatMessages((prev) => [...prev, { role: "user", content: q }]);
    setChatLoading(true);

    try {
      const answer = await chatService.askQuestion(meetingId, q);
      setChatMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (err: any) {
      toast.error("Chat response failed.");
    } finally {
      setChatLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Meeting Not Found</h2>
        <Button variant="outline" onClick={() => navigate("/meetings")}>
          <ArrowLeft size={16} /> Back to Meetings
        </Button>
      </div>
    );
  }

  const sentiment = getSentimentBadge(meeting.sentiment);

  const tabs = [
    { id: "transcript", label: "Transcript", icon: <FileText size={16} /> },
    { id: "summary", label: "AI Summary", icon: <Sparkles size={16} /> },
    { id: "actions", label: "Action Items", icon: <CheckCircle2 size={16} />, badge: meeting.action_items?.length },
    { id: "decisions", label: "Key Decisions", icon: <Lightbulb size={16} />, badge: meeting.key_decisions?.length },
    { id: "risks", label: "Risks", icon: <AlertTriangle size={16} />, badge: meeting.risks?.length },
    { id: "sentiment", label: "Sentiment Analysis", icon: <TrendingUp size={16} /> },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button & Top Header */}
      <button
        onClick={() => navigate("/meetings")}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Meetings Workspace
      </button>

      {/* Main Header Banner */}
      <Card glass className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-extrabold text-sm">
                Meeting #{meeting.id}
              </span>
              <Badge variant="outline" className={sentiment.className}>
                <span className={`w-1.5 h-1.5 rounded-full ${sentiment.dotColor} mr-1`} />
                {sentiment.label}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {meeting.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              {meeting.description || "No description provided."}
            </p>
          </div>

          {/* Actions Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              isLoading={transcribeMutation.isPending}
              onClick={() => transcribeMutation.mutate()}
              title="Run Whisper Speech-to-Text"
            >
              <FileText size={14} /> Transcribe
            </Button>

            <Button
              variant="secondary"
              size="sm"
              isLoading={summarizeMutation.isPending}
              onClick={() => summarizeMutation.mutate()}
              title="Generate Executive Summary & Action Items"
            >
              <Sparkles size={14} /> AI Summarize
            </Button>

            <Button variant="glass" size="sm" onClick={handleDownloadReport} title="Download PDF Summary Report">
              <Download size={14} /> PDF Report
            </Button>

            <Button variant="outline" size="sm" onClick={() => setShowEmailModal(true)} title="Email Stakeholders">
              <Mail size={14} /> Email Report
            </Button>
          </div>
        </div>
      </Card>

      {/* 2 Column Layout: Main Content Tabs vs Right AI Chat Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Tabs Content */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          <Card glass className="p-6 min-h-[400px]">
            {/* Transcript Tab */}
            {activeTab === "transcript" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FileText size={16} className="text-blue-600" /> Audio Transcript
                  </h3>
                  {meeting.audio_path && (
                    <Badge variant="success" dot>
                      <Volume2 size={12} className="mr-1" /> Audio Attached
                    </Badge>
                  )}
                </div>

                {meeting.transcript ? (
                  <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed space-y-2 max-h-[500px] overflow-y-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800 font-sans">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{meeting.transcript}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3">
                    <FileText size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
                    <p className="text-xs text-slate-500">No transcript generated for this meeting yet.</p>
                    <Button variant="primary" size="sm" isLoading={transcribeMutation.isPending} onClick={() => transcribeMutation.mutate()}>
                      <Sparkles size={14} /> Run Speech-to-Text Transcription
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* AI Summary Tab */}
            {activeTab === "summary" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-600" /> Executive AI Summary
                  </h3>
                  <Button variant="ghost" size="sm" isLoading={summarizeMutation.isPending} onClick={() => summarizeMutation.mutate()}>
                    <RefreshCw size={14} /> Regenerate
                  </Button>
                </div>

                {meeting.summary ? (
                  <div className="prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{meeting.summary}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3">
                    <Sparkles size={40} className="mx-auto text-purple-400" />
                    <p className="text-xs text-slate-500">No AI summary generated yet.</p>
                    <Button variant="secondary" size="sm" isLoading={summarizeMutation.isPending} onClick={() => summarizeMutation.mutate()}>
                      Summarize with AI
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Action Items Tab */}
            {activeTab === "actions" && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-600" /> Extracted Action Items
                  </h3>
                </div>

                {meeting.action_items && meeting.action_items.length > 0 ? (
                  <div className="space-y-2">
                    {meeting.action_items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                        <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-normal">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-8 text-center">No action items extracted. Trigger AI Summarize to extract tasks.</p>
                )}
              </div>
            )}

            {/* Key Decisions Tab */}
            {activeTab === "decisions" && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Lightbulb size={16} className="text-amber-500" /> Key Decisions
                  </h3>
                </div>

                {meeting.key_decisions && meeting.key_decisions.length > 0 ? (
                  <div className="space-y-2">
                    {meeting.key_decisions.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                        <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-normal">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-8 text-center">No key decisions recorded.</p>
                )}
              </div>
            )}

            {/* Risks Tab */}
            {activeTab === "risks" && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-rose-500" /> Risks & Blockers
                  </h3>
                </div>

                {meeting.risks && meeting.risks.length > 0 ? (
                  <div className="space-y-2">
                    {meeting.risks.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                        <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-normal">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-8 text-center">No risks identified.</p>
                )}
              </div>
            )}

            {/* Sentiment Tab */}
            {activeTab === "sentiment" && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-500" /> Sentiment Analysis
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Overall Sentiment Tone</span>
                    <Badge variant="outline" className={sentiment.className}>
                      {sentiment.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    AI evaluated meeting discussion dynamics. Sentiment classification: <strong className="text-slate-900 dark:text-slate-100">{meeting.sentiment || "Neutral"}</strong>.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Embedded Meeting AI Chat Panel */}
        <Card glass className="flex flex-col h-[600px] p-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-600" /> Meeting AI Assistant
            </h3>
            <Badge variant="info">Context Active</Badge>
          </div>

          {/* Chat History Messages */}
          <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl max-w-[85%] ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-600 text-white rounded-br-none"
                    : "mr-auto bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/50 dark:border-slate-700/50"
                }`}
              >
                <p className="leading-relaxed">{msg.content}</p>
              </div>
            ))}
            {chatLoading && (
              <div className="mr-auto p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 animate-pulse">
                Thinking & analyzing transcript...
              </div>
            )}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <input
              type="text"
              placeholder="Ask anything about this meeting..."
              value={chatQuestion}
              onChange={(e) => setChatQuestion(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <Button type="submit" variant="primary" size="icon" isLoading={chatLoading}>
              <Send size={14} />
            </Button>
          </form>
        </Card>
      </div>

      {/* Email Report Dialog Modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Email Meeting Summary Report"
        description="Send executive PDF and AI action summary to team members."
      >
        <form onSubmit={handleSendEmailReport} className="space-y-4">
          <Input
            label="Recipient Emails (comma separated)"
            placeholder="prem@example.com, manager@example.com"
            icon={<Mail size={16} />}
            value={emailRecipients}
            onChange={(e) => setEmailRecipients(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setShowEmailModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Email
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MeetingDetails;
