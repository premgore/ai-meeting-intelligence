import { useEffect, useState } from "react";

import MeetingCard from "../../components/meeting/MeetingCard";

import { getMeetings } from "../../services/meetingService";

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);

  const [loading, setLoading] = useState(true);

  async function loadMeetings() {
    try {
      const data = await getMeetings();

      setMeetings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMeetings();
  }, []);

  if (loading) {
    return (
      <div className="text-xl">
        Loading meetings...
      </div>
    );
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Meetings
        </h1>

      </div>

      <div className="grid grid-cols-3 gap-6">

        {meetings.map((meeting) => (
          <MeetingCard
            key={meeting.id}
            meeting={meeting}
          />
        ))}

      </div>

      {!meetings.length && (
        <div className="text-center mt-20 text-gray-500">
          No meetings found.
        </div>
      )}

    </div>
  );
}