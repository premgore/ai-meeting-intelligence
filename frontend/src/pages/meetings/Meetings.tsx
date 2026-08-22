import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, CalendarDays } from "lucide-react";
import meetingService from "../../services/meetingService";
import { MeetingCard } from "../../components/meeting/MeetingCard";
import { CreateMeetingModal } from "../../components/meeting/CreateMeetingModal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Skeleton } from "../../components/ui/Skeleton";

export const Meetings: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");

  const {
    data: meetings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["meetings"],
    queryFn: meetingService.getMeetings,
  });

  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSentiment =
      sentimentFilter === "all" ||
      (m.sentiment || "").toLowerCase().includes(sentimentFilter.toLowerCase());

    return matchesSearch && matchesSentiment;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-white border border-[#E8E1D8] shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#211F1D]">
            Meetings Repository
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6A65] mt-1">
            Manage corporate meeting recordings, transcriptions, decisions, and action items.
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          Create Meeting
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-[#E8E1D8]">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search meetings by title, topic, or description..."
            icon={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-[#6F6A65] ml-2 hidden sm:inline-block" />
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="w-full sm:w-auto h-9 px-3 rounded-xl border border-[#E8E1D8] bg-[#FAF8F4] text-xs font-bold text-[#211F1D] focus:outline-none focus:border-[#7A171C]"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive Tone</option>
            <option value="neutral">Neutral Discussion</option>
            <option value="negative">Risks / Friction</option>
          </select>
        </div>
      </div>

      {/* Meetings Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="py-16 text-center space-y-4 rounded-2xl border border-dashed border-[#E8E1D8] bg-white">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-[#FAF4E8] text-[#7A171C] border border-[#C9953E]/30 flex items-center justify-center">
            <CalendarDays size={32} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#211F1D]">
              No meetings found
            </h3>
            <p className="text-xs text-[#6F6A65] max-w-sm mx-auto mt-1">
              {searchQuery
                ? "No meetings match your current search or sentiment filter."
                : "Get started by creating your first meeting or uploading an audio file."}
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            Create Meeting Now
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMeetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}

      {/* Create Meeting Modal */}
      <CreateMeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default Meetings;
