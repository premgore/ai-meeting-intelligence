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
      a.download = `meeting_${meetingId}_report.pdf`;
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Executive Reports & Exports
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          Export automated PDF summaries or dispatch email reports directly to stakeholders.
        </p>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading reports...</p>
        ) : meetings.length === 0 ? (
          <Card glass className="py-12 text-center space-y-3">
            <FileText size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-xs text-slate-500">No meeting reports generated yet.</p>
          </Card>
        ) : (
          meetings.map((m) => (
            <Card key={m.id} glass className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-purple-500/20">
                  #{m.id}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{m.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {m.summary ? m.summary.slice(0, 90) + "..." : "No summary generated"}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span>{m.action_items?.length || 0} Tasks</span>
                    <span>•</span>
                    <span>{m.key_decisions?.length || 0} Decisions</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="glass" size="sm" onClick={() => handleDownload(m.id)}>
                  <Download size={14} /> PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedMeetingId(m.id);
                    setShowEmailModal(true);
                  }}
                >
                  <Mail size={14} /> Email
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
        title="Email Meeting Summary Report"
        description="Dispatch automated executive PDF report to stakeholders."
      >
        <form onSubmit={handleSendEmail} className="space-y-4">
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
              Send Report
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Reports;
