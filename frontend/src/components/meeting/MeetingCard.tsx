import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle2, ChevronRight, Volume2, MicOff } from "lucide-react";
import { Meeting } from "../../types";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

export interface MeetingCardProps {
  meeting: Meeting;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  const navigate = useNavigate();
  const actionItemsCount = meeting.action_items?.length || 0;
  const decisionsCount = meeting.key_decisions?.length || 0;
  const hasAudio = !!meeting.audio_path;
  const hasTranscript = !!meeting.transcript;

  return (
    <Card
      hoverable
      onClick={() => navigate(`/meetings/${meeting.id}`)}
      className="cursor-pointer group relative flex flex-col justify-between h-full p-5 bg-white border-[#E8E1D8]"
    >
      {/* Subtle Gold top accent on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7A171C] via-[#C9953E] to-[#7A171C] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-[#FAF4E8] text-[#9A6F27] border border-[#C9953E]/30 font-bold text-xs flex items-center justify-center">
              #{meeting.id}
            </span>
            <Badge variant="gold">
              {meeting.sentiment || "Analyzed"}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            {hasAudio ? (
              <span className="p-1 rounded-md bg-[#F7EDED] text-[#7A171C]" title="Audio Ingested">
                <Volume2 size={14} />
              </span>
            ) : (
              <span className="p-1 rounded-md bg-[#FAF8F4] text-[#A39D97]" title="No Audio File">
                <MicOff size={14} />
              </span>
            )}
          </div>
        </div>

        {/* Meeting Title & Description */}
        <h3 className="text-base font-bold text-[#211F1D] group-hover:text-[#7A171C] transition-colors line-clamp-1">
          {meeting.title}
        </h3>
        <p className="mt-1.5 text-xs text-[#6F6A65] line-clamp-2 leading-relaxed">
          {meeting.description || "No description provided."}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-3 border-t border-[#E8E1D8] flex items-center justify-between text-xs text-[#6F6A65]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-[#7A171C]" title="Action Items">
            <CheckCircle2 size={14} />
            {actionItemsCount} Task{actionItemsCount !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1 font-semibold text-[#C9953E]" title="Decisions">
            <FileText size={14} />
            {decisionsCount} Decisions
          </span>
        </div>

        <ChevronRight size={16} className="text-[#6F6A65] group-hover:translate-x-1 transition-transform" />
      </div>
    </Card>
  );
};
