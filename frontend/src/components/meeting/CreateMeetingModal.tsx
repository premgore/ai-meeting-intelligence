import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { CalendarDays } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import meetingService from "../../services/meetingService";

const createMeetingSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
});

type CreateMeetingSchema = z.infer<typeof createMeetingSchema>;

export interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMeetingSchema>({
    resolver: zodResolver(createMeetingSchema),
  });

  const onSubmit = async (data: CreateMeetingSchema) => {
    try {
      setLoading(true);
      await meetingService.createMeeting(data);
      toast.success("Meeting initialized successfully!");
      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to create meeting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Meeting"
      description="Initialize an executive meeting space to record, transcribe, and extract decisions."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Meeting Title"
          placeholder="Q3 Strategic Roadmap Review"
          icon={<CalendarDays size={16} />}
          error={errors.title?.message}
          {...register("title")}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6A65]">
            Description / Executive Context
          </label>
          <textarea
            rows={4}
            placeholder="Key objectives, agenda topics, attendees, and expected deliverables..."
            className="w-full rounded-xl border border-[#E8E1D8] bg-white p-3 text-sm text-[#211F1D] placeholder-[#A39D97] transition-all focus:border-[#7A171C] focus:outline-none focus:ring-2 focus:ring-[#7A171C]/15"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-rose-600 font-medium">{errors.description.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E1D8]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Create Meeting
          </Button>
        </div>
      </form>
    </Modal>
  );
};
