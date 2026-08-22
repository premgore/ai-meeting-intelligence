import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import meetingService from "../../services/meetingService";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Badge } from "../../components/ui/Badge";

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
      <div className="p-6 rounded-2xl bg-white border border-[#E8E1D8] shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#211F1D]">
          Executive Workspace Analytics
        </h1>
        <p className="text-xs sm:text-sm text-[#6F6A65] mt-1">
          Deep intelligence metrics on meeting cadence, sentiment distribution, and team throughput.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Analyzed Meetings"
          value={totalMeetings}
          icon={<BarChart3 size={20} className="text-[#7A171C]" />}
          trend="+15%"
          isPositive={true}
          isLoading={isLoading}
        />
        <StatCard
          title="Extracted Decisions"
          value={totalDecisions}
          icon={<Sparkles size={20} className="text-[#7A171C]" />}
          trend="+30%"
          isPositive={true}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Action Tasks"
          value={totalActionItems}
          icon={<CheckCircle2 size={20} className="text-[#7A171C]" />}
          trend="+22%"
          isPositive={true}
          isLoading={isLoading}
        />
        <StatCard
          title="Identified Risks"
          value={meetings.reduce((acc, m) => acc + (m.risks?.length || 0), 0)}
          icon={<AlertTriangle size={20} className="text-[#7A171C]" />}
          trend="-10%"
          isPositive={true}
          isLoading={isLoading}
        />
      </div>

      {/* Main Grid: Sentiment Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-[#E8E1D8]">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D8]">
            <h3 className="text-base font-bold text-[#211F1D] flex items-center gap-2">
              <TrendingUp size={18} className="text-[#7A171C]" /> Sentiment Distribution
            </h3>
            <Badge variant="gold">AI Analysis</Badge>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-xl bg-[#FAF4E8] border border-[#C9953E]/30">
              <div className="flex justify-between text-xs font-bold text-[#9A6F27]">
                <span>Positive Tone</span>
                <span>{positive} meetings ({totalMeetings ? Math.round((positive / totalMeetings) * 100) : 0}%)</span>
              </div>
              <div className="mt-2 w-full h-2 rounded-full bg-[#E8E1D8] overflow-hidden">
                <div className="h-full bg-[#C9953E] rounded-full" style={{ width: `${totalMeetings ? (positive / totalMeetings) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#E8E1D8]">
              <div className="flex justify-between text-xs font-bold text-[#6F6A65]">
                <span>Neutral Discussion</span>
                <span>{neutral} meetings ({totalMeetings ? Math.round((neutral / totalMeetings) * 100) : 0}%)</span>
              </div>
              <div className="mt-2 w-full h-2 rounded-full bg-[#E8E1D8] overflow-hidden">
                <div className="h-full bg-[#A39D97] rounded-full" style={{ width: `${totalMeetings ? (neutral / totalMeetings) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F7EDED] border border-[#7A171C]/20">
              <div className="flex justify-between text-xs font-bold text-[#7A171C]">
                <span>Friction & Risks</span>
                <span>{negative} meetings ({totalMeetings ? Math.round((negative / totalMeetings) * 100) : 0}%)</span>
              </div>
              <div className="mt-2 w-full h-2 rounded-full bg-[#E8E1D8] overflow-hidden">
                <div className="h-full bg-[#7A171C] rounded-full" style={{ width: `${totalMeetings ? (negative / totalMeetings) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white border-[#E8E1D8]">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D8]">
            <h3 className="text-base font-bold text-[#211F1D] flex items-center gap-2">
              <Clock size={18} className="text-[#C9953E]" /> Cadence & Throughput
            </h3>
            <Badge variant="outline">Weekly Cycle</Badge>
          </div>

          <div className="mt-6 space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#E8E1D8] space-y-1">
              <span className="font-bold text-[#211F1D]">Average Transcript Processing Speed</span>
              <p className="text-[#6F6A65]">Sub-minute speech-to-text generation via NIRNAYA Whisper engine.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#E8E1D8] space-y-1">
              <span className="font-bold text-[#211F1D]">Action Item Completion Velocity</span>
              <p className="text-[#6F6A65]">84% of AI-extracted tasks resolved within sprint cycle.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
