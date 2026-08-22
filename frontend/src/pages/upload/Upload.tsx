import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UploadCloud,
  FileAudio,
  Plus,
  ArrowRight,
} from "lucide-react";
import meetingService from "../../services/meetingService";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { CreateMeetingModal } from "../../components/meeting/CreateMeetingModal";

export const Upload: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch existing meetings
  const { data: meetings = [], refetch } = useQuery({
    queryKey: ["meetings"],
    queryFn: meetingService.getMeetings,
  });

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("audio/") || file.name.match(/\.(mp3|wav|m4a|webm|aac|flac)$/i)) {
        setSelectedFile(file);
      } else {
        toast.error("Please upload a valid audio file (.mp3, .wav, .m4a, .webm).");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select an audio file first.");
      return;
    }
    if (!selectedMeetingId) {
      toast.error("Please select a target meeting or create a new one.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(40);
      await meetingService.uploadAudio(selectedMeetingId, selectedFile);
      setUploadProgress(100);
      toast.success("Audio uploaded! Starting automatic speech-to-text...");

      // Automatically trigger transcribe
      try {
        await meetingService.transcribeMeeting(selectedMeetingId);
        toast.success("Transcription generated successfully!");
      } catch {
        console.warn("Transcribe queued");
      }

      navigate(`/meetings/${selectedMeetingId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Audio upload failed.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#E8E1D8] shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#211F1D]">
            Audio Intelligence Ingestion
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6A65] mt-1">
            Upload meeting audio recordings (.mp3, .wav, .m4a) for NIRNAYA AI transcription & analysis.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Create Target Meeting
        </Button>
      </div>

      {/* Target Meeting Selector */}
      <Card className="p-5 bg-white border-[#E8E1D8]">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6A65] mb-2">
          Select Destination Meeting
        </label>
        <div className="flex items-center gap-3">
          <select
            value={selectedMeetingId || ""}
            onChange={(e) => setSelectedMeetingId(Number(e.target.value))}
            className="flex-1 h-10 px-3.5 rounded-xl border border-[#E8E1D8] bg-[#FAF8F4] text-xs font-bold text-[#211F1D] focus:outline-none focus:border-[#7A171C]"
          >
            <option value="">-- Choose a meeting space --</option>
            {meetings.map((m) => (
              <option key={m.id} value={m.id}>
                Meeting #{m.id} — {m.title}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Drag & Drop File Upload Area */}
      <Card className="p-8 bg-white border-[#E8E1D8]">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="border-2 border-dashed border-[#E8E1D8] hover:border-[#7A171C] rounded-2xl p-8 sm:p-12 text-center transition-all bg-[#FAF8F4] space-y-4 cursor-pointer relative"
        >
          <input
            type="file"
            accept="audio/*,.mp3,.wav,.m4a,.webm,.aac,.flac"
            onChange={handleFileSelect}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          <div className="h-16 w-16 mx-auto rounded-2xl bg-[#FAF4E8] text-[#7A171C] border border-[#C9953E]/30 flex items-center justify-center shadow-xs">
            <UploadCloud size={32} />
          </div>

          <div>
            <h3 className="text-base font-bold text-[#211F1D]">
              Drag & Drop your audio file here
            </h3>
            <p className="text-xs text-[#6F6A65] mt-1">
              Supports MP3, WAV, M4A, WEBM files up to 100MB.
            </p>
          </div>

          <Button variant="outline" size="sm" type="button">
            Browse Audio Files
          </Button>
        </div>

        {/* Selected File Card */}
        {selectedFile && (
          <div className="mt-6 p-4 rounded-xl bg-[#FAF4E8] border border-[#C9953E]/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#7A171C] text-white">
                <FileAudio size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#211F1D]">{selectedFile.name}</p>
                <p className="text-[11px] text-[#6F6A65]">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <Badge variant="gold">File Attached</Badge>
          </div>
        )}

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[#211F1D]">
              <span>Ingesting & Processing Audio...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E8E1D8] overflow-hidden">
              <div
                className="h-full bg-[#7A171C] rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Upload Button */}
        <div className="mt-6 flex justify-end">
          <Button
            variant="primary"
            size="lg"
            isLoading={isUploading}
            disabled={!selectedFile || !selectedMeetingId}
            onClick={handleUploadSubmit}
          >
            Upload Audio & Transcribe
            <ArrowRight size={16} />
          </Button>
        </div>
      </Card>

      {/* Target Meeting Creator Modal */}
      <CreateMeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default Upload;
