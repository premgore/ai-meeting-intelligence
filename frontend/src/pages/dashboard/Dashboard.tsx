import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckSquare,
  Award,
  AlertTriangle,
  Sparkles,
  Plus,
  ArrowUpRight,
  ChevronRight,
  MessageSquare,
  FileText,
  Upload,
  Clock,
  Users,
} from "lucide-react";
import meetingService from "../../services/meetingService";
import { useAuth } from "../../context/AuthContext";
import { StatCard } from "../../components/ui/StatCard";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatDate } from "../../lib/utils";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ["meetings"],
    queryFn: meetingService.getMeetings,
  });

  // Calculate statistics from actual meeting models
  const totalMeetings = meetings.length;

  const totalActionItems = meetings.reduce(
    (acc, m) => acc + (m.action_items?.length || 0),
    0
  );

  const totalDecisions = meetings.reduce(
    (acc, m) => acc + (m.key_decisions?.length || 0),
    0
  );

  const totalRisks = meetings.reduce(
    (acc, m) => acc + (m.risks?.length || 0),
    0
  );

  // Time based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName = user?.name ? user.name.split(" ")[0] : "Executive";

  const recentMeetings = meetings.slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-white border border-[#E8E1D8] shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-[#FAF4E8] to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#211F1D]">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6A65]">
            Here's what NIRNAYA found across your meetings.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/upload")}
            className="text-xs"
          >
            <Upload size={15} />
            Upload Audio
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/chat")}
            className="text-xs"
          >
            <Sparkles size={15} className="text-[#C9953E]" />
            Ask NIRNAYA AI
          </Button>
        </div>
      </div>

      {/* Four Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Meetings"
          value={totalMeetings}
          icon={<CalendarDays size={20} className="text-[#7A171C]" />}
          trend="+12%"
          isPositive={true}
          subtitle="Processed recordings"
          isLoading={isLoading}
        />
        <StatCard
          title="Action Items"
          value={totalActionItems}
          icon={<CheckSquare size={20} className="text-[#7A171C]" />}
          trend="+24%"
          isPositive={true}
          subtitle="Extracted tasks"
          isLoading={isLoading}
        />
        <StatCard
          title="Key Decisions"
          value={totalDecisions}
          icon={<Award size={20} className="text-[#7A171C]" />}
          trend="+18%"
          isPositive={true}
          subtitle="Agreed commitments"
          isLoading={isLoading}
        />
        <StatCard
          title="Open Risks"
          value={totalRisks}
          icon={<AlertTriangle size={20} className="text-[#7A171C]" />}
          trend="-5%"
          isPositive={true}
          subtitle="Identified blockers"
          isLoading={isLoading}
        />
      </div>

      {/* Main Grid: Recent Meetings & AI Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Recent Meetings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D8]">
              <div>
                <h3 className="text-base font-bold text-[#211F1D]">
                  RECENT MEETINGS
                </h3>
                <p className="text-xs text-[#6F6A65]">
                  Executive summary status and decision metrics
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/meetings")}
                className="text-xs text-[#7A171C]"
              >
                View All <ChevronRight size={14} />
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))
              ) : recentMeetings.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <CalendarDays size={38} className="mx-auto text-[#6F6A65]/40" />
                  <p className="text-xs text-[#6F6A65]">No meetings recorded yet.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/upload")}
                  >
                    Upload Audio Ingestion
                  </Button>
                </div>
              ) : (
                recentMeetings.map((meeting) => {
                  const actionCount = meeting.action_items?.length || 0;
                  const decisionCount = meeting.key_decisions?.length || 0;
                  const riskCount = meeting.risks?.length || 0;
                  const hasSummary = !!meeting.summary;

                  return (
                    <div
                      key={meeting.id}
                      onClick={() => navigate(`/meetings/${meeting.id}`)}
                      className="group p-4 rounded-xl border border-[#E8E1D8] bg-white hover:bg-[#FAF8F4] hover:border-[#D4C9BC] transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-[#211F1D] group-hover:text-[#7A171C] transition-colors">
                            {meeting.title}
                          </h4>
                          <p className="text-xs text-[#6F6A65] flex items-center gap-2 mt-0.5">
                            <span>{formatDate(meeting.created_at)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> 42 min
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Users size={12} /> 8 participants
                            </span>
                          </p>
                        </div>

                        <Badge
                          variant={hasSummary ? "gold" : "outline"}
                          className="self-start sm:self-center text-[10px]"
                        >
                          {hasSummary ? "Summary Ready" : "Transcribed"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E8E1D8]/60 text-xs">
                        <div className="flex items-center gap-4 text-[#6F6A65]">
                          <span className="font-semibold text-[#7A171C]">
                            {actionCount} Action Items
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-[#C9953E]">
                            {decisionCount} Decisions
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-[#211F1D]">
                            {riskCount} Risks
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-[#7A171C] font-semibold group-hover:translate-x-0.5 transition-transform"
                        >
                          View Meeting <ChevronRight size={14} />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: AI Assistant & Quick Actions */}
        <div className="space-y-6">
          {/* NIRNAYA AI Insights Card */}
          <Card className="bg-[#FAF4E8] border-[#C9953E]/30 relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-xl bg-[#7A171C] text-white">
                <Sparkles size={18} className="text-[#C9953E]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#7A171C]">
                  NIRNAYA Decision Intelligence
                </h3>
                <p className="text-[11px] text-[#6F6A65]">
                  Cross-meeting AI synthesis
                </p>
              </div>
            </div>

            <p className="text-xs text-[#211F1D] leading-relaxed mb-4">
              {meetings.length > 0
                ? `NIRNAYA analyzed ${meetings.length} meeting(s). Total ${totalDecisions} decisions and ${totalActionItems} action items extracted across your organization.`
                : "No meetings ingested yet. Upload an audio recording to extract decisions and action items automatically."}
            </p>

            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/chat")}
              className="w-full text-xs"
            >
              Open NIRNAYA AI Assistant
              <ArrowUpRight size={14} />
            </Button>
          </Card>

          {/* Quick Executive Shortcuts */}
          <Card className="p-5 space-y-3 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6F6A65]">
              Quick Executive Workflows
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => navigate("/chat")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF8F4] hover:bg-[#F7EDED] border border-[#E8E1D8] transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare size={16} className="text-[#7A171C]" />
                  <div>
                    <p className="text-xs font-bold text-[#211F1D]">Cross-Meeting AI Query</p>
                    <p className="text-[10px] text-[#6F6A65]">Search across all organizational discussions</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-[#6F6A65] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/reports")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF8F4] hover:bg-[#FAF4E8] border border-[#E8E1D8] transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-[#C9953E]" />
                  <div>
                    <p className="text-xs font-bold text-[#211F1D]">Export Executive Report</p>
                    <p className="text-[10px] text-[#6F6A65]">Generate PDF report or email stakeholders</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-[#6F6A65] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
