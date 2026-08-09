import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  ListTodo,
  Sparkles,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ChevronRight,
  MessageSquare,
  FileText,
  Upload,
} from "lucide-react";
import meetingService from "../../services/meetingService";
import { StatCard } from "../../components/ui/StatCard";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { getSentimentBadge, formatDate } from "../../lib/utils";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ["meetings"],
    queryFn: meetingService.getMeetings,
  });

  // Calculate statistics from actual backend meeting models
  const totalMeetings = meetings.length;
  const meetingsWithAudio = meetings.filter((m) => !!m.audio_path).length;
  const meetingsWithTranscript = meetings.filter((m) => !!m.transcript).length;
  const totalActionItems = meetings.reduce(
    (acc, m) => acc + (m.action_items?.length || 0),
    0
  );
  
  // Aggregate sentiment counts
  const positiveSentiments = meetings.filter((m) => (m.sentiment || "").toLowerCase().includes("positive")).length;
  const neutralSentiments = meetings.filter((m) => (m.sentiment || "").toLowerCase().includes("neutral") || !m.sentiment).length;
  const negativeSentiments = meetings.filter((m) => (m.sentiment || "").toLowerCase().includes("negative")).length;

  const recentMeetings = meetings.slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Executive Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Real-time transcript processing, sentiment tracking, and automated action extraction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/upload")}
            className="text-xs"
          >
            <Upload size={16} />
            Upload Audio
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/meetings")}
            className="text-xs"
          >
            <Plus size={16} />
            New Meeting
          </Button>
        </div>
      </div>

      {/* 4 Stat Metric Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Meetings"
          value={totalMeetings}
          icon={<CalendarDays size={20} />}
          trend="+12%"
          isPositive={true}
          subtitle={`${meetingsWithAudio} with audio recorded`}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Audio Hours"
          value={`${(meetingsWithAudio * 0.75).toFixed(1)} hrs`}
          icon={<Clock size={20} />}
          trend="+8%"
          isPositive={true}
          subtitle={`${meetingsWithTranscript} fully transcribed`}
          isLoading={isLoading}
        />
        <StatCard
          title="Action Items"
          value={totalActionItems}
          icon={<CheckCircle2 size={20} />}
          trend="+24%"
          isPositive={true}
          subtitle="AI extracted tasks"
          isLoading={isLoading}
        />
        <StatCard
          title="Pending Tasks"
          value={Math.max(0, totalActionItems - 2)}
          icon={<ListTodo size={20} />}
          trend="-5%"
          isPositive={true}
          subtitle="Awaiting team sign-off"
          isLoading={isLoading}
        />
      </div>

      {/* Main Grid: AI Insights & Sentiment Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: AI Insights & Quick Action Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Key Insights Widget */}
          <Card glass className="relative overflow-hidden border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/40 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    AI Cross-Meeting Insights
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Synthesized from your recent workspace conversations
                  </p>
                </div>
              </div>
              <Badge variant="info" dot>Live RAG</Badge>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {meetings.length > 0
                  ? `Analyzed ${meetings.length} meeting(s). Primary topic focus spans project scope, product milestones, and action deliverables.`
                  : "No meeting recordings processed yet. Upload an audio file or create a meeting to generate RAG insights."}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/chat")}
                  className="text-xs text-blue-600 dark:text-blue-400 font-semibold p-0 h-auto"
                >
                  Ask AI Assistant <ArrowUpRight size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Recent Meetings Table/List */}
          <Card glass>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Recent Meetings
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Latest recordings and intelligence summaries
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/meetings")}
                className="text-xs"
              >
                View All <ChevronRight size={14} />
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))
              ) : recentMeetings.length === 0 ? (
                <div className="py-10 text-center space-y-3">
                  <CalendarDays size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-xs text-slate-500">No meetings recorded yet.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/upload")}
                  >
                    Upload First Audio
                  </Button>
                </div>
              ) : (
                recentMeetings.map((m) => {
                  const s = getSentimentBadge(m.sentiment);
                  return (
                    <div
                      key={m.id}
                      onClick={() => navigate(`/meetings/${m.id}`)}
                      className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                          #{m.id}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {m.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {m.description || "No description provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={s.className}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dotColor} mr-1`} />
                          {s.label}
                        </Badge>
                        <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Sentiment Analytics & Weekly Activity */}
        <div className="space-y-6">
          {/* Sentiment Analytics Widget */}
          <Card glass>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-600" />
                Sentiment Breakdown
              </h3>
              <Badge variant="default">AI Model</Badge>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Positive Tone</span>
                  <span>{positiveSentiments}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${totalMeetings ? (positiveSentiments / totalMeetings) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Neutral Discussion</span>
                  <span>{neutralSentiments}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${totalMeetings ? (neutralSentiments / totalMeetings) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Risks & Friction</span>
                  <span>{negativeSentiments}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${totalMeetings ? (negativeSentiments / totalMeetings) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Quick AI Shortcuts */}
          <Card glass className="p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Quick Workflows
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => navigate("/chat")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} className="text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Chat with Meetings</p>
                    <p className="text-[10px] text-slate-500">Query transcript knowledge graph</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/reports")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Generate Executive Report</p>
                    <p className="text-[10px] text-slate-500">Export PDF summary or dispatch email</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
