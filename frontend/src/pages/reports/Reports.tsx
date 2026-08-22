import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FileText, Download, Mail } from "lucide-react";
import meetingService from "../../services/meetingService";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";

export const Reports: React.FC = () => {
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState("");

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ["meetings"],
    queryFn: meetingService.getMeetings,
  });

  const handleDownload = async (meetingId: number) => {
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

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeetingId || !emailRecipients.trim()) return;
    const recipients = emailRecipients.split(",").map((s) => s.trim());
    try {
      await meetingService.sendReport(selectedMeetingId, recipients);
      toast.success("Meeting summary report emailed!");
      setShowEmailModal(false);
      setEmailRecipients("");
    } catch {
      toast.error("Failed to email report.");
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8E1D8] shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#211F1D]">
          Intelligence Reports & Exports
        </h1>
        <p className="text-xs sm:text-sm text-[#6F6A65] mt-1">
          Export automated PDF summaries or dispatch email reports directly to executive stakeholders.
        </p>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-xs text-[#6F6A65] py-8 text-center">Loading reports...</p>
        ) : meetings.length === 0 ? (
          <Card className="py-12 text-center space-y-3 bg-white border-[#E8E1D8]">
            <FileText size={38} className="mx-auto text-[#A39D97]" />
            <p className="text-xs text-[#6F6A65]">No meeting reports generated yet.</p>
          </Card>
        ) : (
          meetings.map((m) => (
            <Card key={m.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-[#E8E1D8]">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#7A171C] text-white flex items-center justify-center font-bold text-sm border border-[#C9953E]/30 shadow-xs">
                  #{m.id}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#211F1D]">{m.title}</h3>
                  <p className="text-xs text-[#6F6A65] line-clamp-1 mt-0.5">
                    {m.summary ? m.summary.slice(0, 90) + "..." : "No summary generated"}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-[#6F6A65]">
                    <span className="font-semibold text-[#7A171C]">{m.action_items?.length || 0} Action Items</span>
                    <span>•</span>
                    <span className="font-semibold text-[#C9953E]">{m.key_decisions?.length || 0} Decisions</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload(m.id)}>
                  <Download size={14} /> PDF Report
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedMeetingId(m.id);
                    setShowEmailModal(true);
                  }}
                >
                  <Mail size={14} /> Email Report
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Email Modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Email NIRNAYA Intelligence Report"
        description="Dispatch automated executive PDF report to stakeholders."
      >
        <form onSubmit={handleSendEmail} className="space-y-4">
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

export default Reports;
