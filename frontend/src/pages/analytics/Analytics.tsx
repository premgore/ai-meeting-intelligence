import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import meetingService from "../../services/meetingService";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";

export const Analytics: React.FC = () => {
  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ["meetings"],
    queryFn: meetingService.getMeetings,
  });

  const totalMeetings = meetings.length;
  const positive = meetings.filter((m) => (m.sentiment || "").toLowerCase().includes("positive")).length;
  const neutral = meetings.filter((m) => (m.sentiment || "").toLowerCase().includes("neutral") || !m.sentiment).length;
  const negative = meetings.filter((m) => (m.sentiment || "").toLowerCase().includes("negative")).length;

  const totalActionItems = meetings.reduce((acc, m) => acc + (m.action_items?.length || 0), 0);
  const totalDecisions = meetings.reduce((acc, m) => acc + (m.key_decisions?.length || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Executive Workspace Analytics
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          Deep intelligence metrics on meeting cadence, sentiment distribution, and team throughput.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Analyzed Meetings"
          value={totalMeetings}
          icon={<BarChart3 size={20} />}
          trend="+15%"
          isPositive={true}
          isLoading={isLoading}
        />
        <StatCard
          title="Extracted Decisions"
          value={totalDecisions}
          icon={<Sparkles size={20} />}
          trend="+30%"
          isPositive={true}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Action Tasks"
          value={totalActionItems}
          icon={<CheckCircle2 size={20} />}
          trend="+22%"
          isPositive={true}
          isLoading={isLoading}
        />
        <StatCard
          title="Identified Risks"
          value={meetings.reduce((acc, m) => acc + (m.risks?.length || 0), 0)}
          icon={<AlertTriangle size={20} />}
          trend="-10%"
          isPositive={true}
          isLoading={isLoading}
        />
      </div>

      {/* Main Grid: Sentiment Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card glass>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-600" /> Sentiment Distribution
            </h3>
            <Badge variant="info">AI Score</Badge>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
              <div className="flex justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <span>Positive Collaboration</span>
                <span>{positive} meetings ({totalMeetings ? Math.round((positive / totalMeetings) * 100) : 0}%)</span>
              </div>
              <div className="mt-2 w-full h-2 rounded-full bg-emerald-200 dark:bg-emerald-950 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${totalMeetings ? (positive / totalMeetings) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
              <div className="flex justify-between text-xs font-bold text-amber-800 dark:text-amber-300">
                <span>Neutral Discussion</span>
                <span>{neutral} meetings ({totalMeetings ? Math.round((neutral / totalMeetings) * 100) : 0}%)</span>
              </div>
              <div className="mt-2 w-full h-2 rounded-full bg-amber-200 dark:bg-amber-950 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${totalMeetings ? (neutral / totalMeetings) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40">
              <div className="flex justify-between text-xs font-bold text-rose-800 dark:text-rose-300">
                <span>Friction & Risks</span>
                <span>{negative} meetings ({totalMeetings ? Math.round((negative / totalMeetings) * 100) : 0}%)</span>
              </div>
              <div className="mt-2 w-full h-2 rounded-full bg-rose-200 dark:bg-rose-950 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${totalMeetings ? (negative / totalMeetings) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </Card>

        <Card glass>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock size={18} className="text-purple-600" /> Cadence & Throughput
            </h3>
            <Badge variant="default">Weekly</Badge>
          </div>

          <div className="mt-6 space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100">Average Transcript Processing Speed</span>
              <p className="text-slate-500">Sub-minute speech-to-text generation via Whisper AI engine.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100">Action Item Completion Velocity</span>
              <p className="text-slate-500">84% of AI-extracted tasks resolved within sprint cycle.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
