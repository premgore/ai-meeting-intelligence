import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle2, ChevronRight, Volume2, MicOff } from "lucide-react";
import { Meeting } from "../../types";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { getSentimentBadge } from "../../lib/utils";

export interface MeetingCardProps {
  meeting: Meeting;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  const navigate = useNavigate();
  const sentiment = getSentimentBadge(meeting.sentiment);
  const actionItemsCount = meeting.action_items?.length || 0;
  const hasAudio = !!meeting.audio_path;
  const hasTranscript = !!meeting.transcript;

  return (
    <Card
      glass
      hoverable
      onClick={() => navigate(`/meetings/${meeting.id}`)}
      className="cursor-pointer group relative flex flex-col justify-between h-full p-5 border-slate-200/80 dark:border-slate-800"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-extrabold text-xs flex items-center justify-center">
              #{meeting.id}
            </span>
            <Badge variant="outline" className={sentiment.className}>
              <span className={`w-1.5 h-1.5 rounded-full ${sentiment.dotColor} mr-1`} />
              {sentiment.label}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            {hasAudio ? (
              <span className="p-1 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400" title="Audio Uploaded">
                <Volume2 size={14} />
              </span>
            ) : (
              <span className="p-1 rounded-md bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500" title="No Audio File">
                <MicOff size={14} />
              </span>
            )}
          </div>
        </div>

        {/* Meeting Title & Description */}
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {meeting.title}
        </h3>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {meeting.description || "No description provided."}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium" title="Action Items">
            <CheckCircle2 size={14} className="text-blue-500" />
            {actionItemsCount} Task{actionItemsCount !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1 font-medium" title="Transcript Status">
            <FileText size={14} className={hasTranscript ? "text-purple-500" : "text-slate-300"} />
            {hasTranscript ? "Transcribed" : "Pending"}
          </span>
        </div>

        <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
      </div>
    </Card>
  );
};
