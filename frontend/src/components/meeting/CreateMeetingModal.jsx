import { useState } from "react";
import meetingService from "../../services/meetingService";

export default function CreateMeetingModal({
  open,
  onClose,
  onCreated,
}) {
  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await meetingService.createMeeting({
        title,
        description,
      });

      setTitle("");
      setDescription("");

      onCreated();

      onClose();
    } catch (err) {
      console.error(err);

      alert("Unable to create meeting.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: 500,
          borderRadius: 12,
          padding: 30,
        }}
      >
        <h2>Create Meeting</h2>

        <form onSubmit={handleSubmit}>

          <div style={{ marginTop: 20 }}>

            <label>Title</label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
              style={{
                width: "100%",
                padding: 10,
                marginTop: 8,
              }}
            />

          </div>

          <div style={{ marginTop: 20 }}>

            <label>Description</label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={5}
              style={{
                width: "100%",
                padding: 10,
                marginTop: 8,
              }}
            />

          </div>

          <div
            style={{
              marginTop: 30,
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              disabled={loading}
              type="submit"
            >
              {loading
                ? "Creating..."
                : "Create Meeting"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}