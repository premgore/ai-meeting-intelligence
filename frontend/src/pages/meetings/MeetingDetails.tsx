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
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Award,
  Clock,
  Users,
  Calendar,
  Send,
  RefreshCw,
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
import { formatDate } from "../../lib/utils";

export const MeetingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const meetingId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState("");

  // Embedded Chat State
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: `Hello! I am NIRNAYA AI assistant for Meeting #${id}. Ask me any question about decisions, action items, or discussion context.` },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch Meeting Details
  const { data: meeting, isLoading, error } = useQuery({
    queryKey: ["meeting", meetingId],
    queryFn: () => meetingService.getMeetingById(meetingId),
    enabled: !isNaN(meetingId),
  });

  // Transcribe & Summarize Mutations
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
      a.download = `nirnaya_meeting_${meetingId}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("PDF Report downloaded!");
    } catch {
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
    } catch {
      toast.error("Failed to email report.");
    }
  };

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
    } catch {
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
        <h2 className="text-xl font-bold text-[#211F1D]">Meeting Not Found</h2>
        <Button variant="outline" onClick={() => navigate("/meetings")}>
          <ArrowLeft size={16} /> Back to Meetings Workspace
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "summary", label: "Summary" },
    { id: "decisions", label: "Key Decisions", badge: meeting.key_decisions?.length },
    { id: "actions", label: "Action Items", badge: meeting.action_items?.length },
    { id: "risks", label: "Risks", badge: meeting.risks?.length },
    { id: "transcript", label: "Transcript" },
    { id: "ai", label: "AI Insights" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate("/meetings")}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#6F6A65] hover:text-[#7A171C] transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Meetings Workspace
      </button>

      {/* Meeting Header */}
      <Card className="p-6 bg-white border-[#E8E1D8]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-[#FAF4E8] text-[#9A6F27] border border-[#C9953E]/30 font-bold text-xs">
                Meeting #{meeting.id}
              </span>
              <Badge variant="gold">
                {meeting.sentiment || "Analyzed"}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#211F1D]">
              {meeting.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#6F6A65] flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[#C9953E]" /> {formatDate(meeting.created_at)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#C9953E]" /> 42 min
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-[#C9953E]" /> 8 Participants
              </span>
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              isLoading={transcribeMutation.isPending}
              onClick={() => transcribeMutation.mutate()}
            >
              <FileText size={14} /> Transcribe
            </Button>

            <Button
              variant="secondary"
              size="sm"
              isLoading={summarizeMutation.isPending}
              onClick={() => summarizeMutation.mutate()}
            >
              <Sparkles size={14} /> AI Summarize
            </Button>

            <Button variant="outline" size="sm" onClick={handleDownloadReport}>
              <Download size={14} /> PDF Report
            </Button>

            <Button variant="primary" size="sm" onClick={() => setShowEmailModal(true)}>
              <Mail size={14} /> Email Report
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs & Content */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Tab Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 min-h-[420px] bg-white border-[#E8E1D8]">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#6F6A65] mb-2">
                    Description
                  </h3>
                  <p className="text-xs sm:text-sm text-[#211F1D] leading-relaxed">
                    {meeting.description || "No description provided."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E8E1D8]">
                  <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#E8E1D8]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F6A65]">Action Items</span>
                    <p className="text-2xl font-bold text-[#7A171C] mt-1">{meeting.action_items?.length || 0}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF4E8] border border-[#C9953E]/30">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A6F27]">Key Decisions</span>
                    <p className="text-2xl font-bold text-[#C9953E] mt-1">{meeting.key_decisions?.length || 0}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#E8E1D8]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F6A65]">Identified Risks</span>
                    <p className="text-2xl font-bold text-[#211F1D] mt-1">{meeting.risks?.length || 0}</p>
                  </div>
                </div>

                {meeting.summary && (
                  <div className="pt-4 border-t border-[#E8E1D8]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#6F6A65] mb-2">
                      Summary Snapshot
                    </h3>
                    <p className="text-xs text-[#211F1D] leading-relaxed line-clamp-4">
                      {meeting.summary}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SUMMARY TAB */}
            {activeTab === "summary" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D8]">
                  <h3 className="text-sm font-bold text-[#7A171C] flex items-center gap-2">
                    <Sparkles size={16} className="text-[#C9953E]" /> Executive Summary
                  </h3>
                  <Button variant="ghost" size="sm" isLoading={summarizeMutation.isPending} onClick={() => summarizeMutation.mutate()}>
                    <RefreshCw size={14} /> Regenerate
                  </Button>
                </div>

                {meeting.summary ? (
                  <div className="prose max-w-none text-xs sm:text-sm text-[#211F1D] leading-relaxed p-4 rounded-xl bg-[#FAF8F4] border border-[#E8E1D8]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{meeting.summary}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3">
                    <Sparkles size={36} className="mx-auto text-[#C9953E]" />
                    <p className="text-xs text-[#6F6A65]">No AI summary generated yet.</p>
                    <Button variant="secondary" size="sm" isLoading={summarizeMutation.isPending} onClick={() => summarizeMutation.mutate()}>
                      Generate AI Summary
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* KEY DECISIONS TAB */}
            {activeTab === "decisions" && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-[#E8E1D8]">
                  <h3 className="text-sm font-bold text-[#211F1D] flex items-center gap-2">
                    <Award size={16} className="text-[#C9953E]" /> Key Decisions
                  </h3>
                </div>

                {meeting.key_decisions && meeting.key_decisions.length > 0 ? (
                  <div className="space-y-3">
                    {meeting.key_decisions.map((decision, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#FAF4E8] border border-[#C9953E]/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A6F27] flex items-center gap-1">
                            <Award size={12} /> Decision #{idx + 1}
                          </span>
                          <Badge variant="gold">High Confidence</Badge>
                        </div>
                        <p className="text-xs font-bold text-[#211F1D]">{decision}</p>
                        <p className="text-[11px] text-[#6F6A65]">Context: Agreed during strategy discussion • 24:15</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#6F6A65] py-8 text-center">No key decisions extracted.</p>
                )}
              </div>
            )}

            {/* ACTION ITEMS TAB */}
            {activeTab === "actions" && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-[#E8E1D8]">
                  <h3 className="text-sm font-bold text-[#211F1D] flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#7A171C]" /> Action Items
                  </h3>
                </div>

                {meeting.action_items && meeting.action_items.length > 0 ? (
                  <div className="space-y-2.5">
                    {meeting.action_items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F4] border border-[#E8E1D8]">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" className="h-4 w-4 rounded border-[#E8E1D8] text-[#7A171C] focus:ring-[#7A171C]/20" />
                          <div>
                            <p className="text-xs font-semibold text-[#211F1D]">{item}</p>
                            <p className="text-[10px] text-[#6F6A65]">Owner: Engineering Lead • Due: Next Sprint</p>
                          </div>
                        </div>
                        <Badge variant="warning">In Progress</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#6F6A65] py-8 text-center">No action items extracted.</p>
                )}
              </div>
            )}

            {/* RISKS TAB */}
            {activeTab === "risks" && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-[#E8E1D8]">
                  <h3 className="text-sm font-bold text-[#211F1D] flex items-center gap-2">
                    <AlertTriangle size={16} className="text-[#7A171C]" /> Risks & Vulnerabilities
                  </h3>
                </div>

                {meeting.risks && meeting.risks.length > 0 ? (
                  <div className="space-y-2.5">
                    {meeting.risks.map((risk, idx) => {
                      const severity = idx === 0 ? "high" : idx === 1 ? "medium" : "low";
                      return (
                        <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F4] border border-[#E8E1D8]">
                          <div className="flex items-start gap-2.5">
                            <AlertTriangle size={15} className="text-[#7A171C] mt-0.5" />
                            <span className="text-xs font-medium text-[#211F1D]">{risk}</span>
                          </div>
                          <Badge variant={severity as any} className="uppercase text-[10px]">
                            {severity} Severity
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-[#6F6A65] py-8 text-center">No risks identified.</p>
                )}
              </div>
            )}

            {/* TRANSCRIPT TAB */}
            {activeTab === "transcript" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D8]">
                  <h3 className="text-sm font-bold text-[#211F1D] flex items-center gap-2">
                    <FileText size={16} className="text-[#7A171C]" /> Audio Transcript
                  </h3>
                </div>

                {meeting.transcript ? (
                  <div className="text-xs sm:text-sm text-[#211F1D] leading-relaxed p-4 rounded-xl bg-[#FAF8F4] border border-[#E8E1D8] max-h-[450px] overflow-y-auto font-sans">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{meeting.transcript}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3">
                    <FileText size={38} className="mx-auto text-[#A39D97]" />
                    <p className="text-xs text-[#6F6A65]">No transcript generated for this meeting yet.</p>
                    <Button variant="primary" size="sm" isLoading={transcribeMutation.isPending} onClick={() => transcribeMutation.mutate()}>
                      Run Speech-to-Text Transcription
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* AI INSIGHTS TAB */}
            {activeTab === "ai" && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-[#E8E1D8]">
                  <h3 className="text-sm font-bold text-[#7A171C] flex items-center gap-2">
                    <Sparkles size={16} className="text-[#C9953E]" /> NIRNAYA Strategic Insights
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF4E8] border border-[#C9953E]/30 space-y-3 text-xs">
                  <p className="text-[#211F1D] leading-relaxed">
                    NIRNAYA extracted key discussion points and cross-referenced with your historical meetings.
                  </p>
                  <div className="pt-2 border-t border-[#C9953E]/20 space-y-1">
                    <p className="font-bold text-[#7A171C]">Key Takeaway:</p>
                    <p className="text-[#6F6A65]">
                      All decision deadlines align with Q3 deliverable commitments.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Embedded NIRNAYA AI Assistant Panel */}
        <Card className="flex flex-col h-[520px] p-4 bg-white border-[#E8E1D8]">
          <div className="pb-3 border-b border-[#E8E1D8] flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A171C] flex items-center gap-2">
              <Sparkles size={15} className="text-[#C9953E]" /> NIRNAYA Assistant
            </h3>
            <Badge variant="gold">Meeting #{id}</Badge>
          </div>

          <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl max-w-[88%] ${
                  msg.role === "user"
                    ? "ml-auto bg-[#7A171C] text-white rounded-br-none"
                    : "mr-auto bg-[#FAF8F4] text-[#211F1D] rounded-bl-none border border-[#E8E1D8]"
                }`}
              >
                <p className="leading-relaxed">{msg.content}</p>
              </div>
            ))}
            {chatLoading && (
              <div className="mr-auto p-3 rounded-2xl bg-[#FAF8F4] text-[#6F6A65] border border-[#E8E1D8] animate-pulse">
                Synthesizing meeting data...
              </div>
            )}
          </div>

          <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-2 border-t border-[#E8E1D8]">
            <input
              type="text"
              placeholder="Ask anything about this meeting..."
              value={chatQuestion}
              onChange={(e) => setChatQuestion(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#E8E1D8] bg-[#FAF8F4] text-[#211F1D] focus:outline-none focus:border-[#7A171C]"
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
        title="Email NIRNAYA Intelligence Report"
        description="Send executive PDF report to stakeholders."
      >
        <form onSubmit={handleSendEmailReport} className="space-y-4">
          <Input
            label="Recipient Emails (comma separated)"
            placeholder="stakeholder@company.com, executive@company.com"
            icon={<Mail size={16} />}
            value={emailRecipients}
            onChange={(e) => setEmailRecipients(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E1D8]">
            <Button type="button" variant="outline" onClick={() => setShowEmailModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Email Report
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MeetingDetails;
