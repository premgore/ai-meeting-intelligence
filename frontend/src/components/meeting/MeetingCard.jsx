import { CalendarDays, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MeetingCard({ meeting }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/meetings/${meeting.id}`)}
      className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-lg transition cursor-pointer border"
    >
      <div className="flex justify-between items-center">
        <CalendarDays className="text-blue-600" />

        <ChevronRight />
      </div>

      <h2 className="text-xl font-semibold mt-4">
        {meeting.title}
      </h2>

      <p className="text-gray-500 mt-2 line-clamp-2">
        {meeting.description || "No description"}
      </p>

      <div className="mt-6 text-sm text-gray-400">
        Meeting #{meeting.id}
      </div>
    </div>
  );
}