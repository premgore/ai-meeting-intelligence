import api from "../lib/api";
import { ApiResponse, CreateMeetingInput, Meeting, SendReportRequest, UpdateMeetingInput } from "../types";

export const meetingService = {
  async getMeetings(): Promise<Meeting[]> {
    const response = await api.get<ApiResponse<Meeting[]>>("/");
    return response.data.data;
  },

  async getMeetingById(id: number): Promise<Meeting> {
    const response = await api.get<ApiResponse<Meeting>>(`/${id}`);
    return response.data.data;
  },

  async createMeeting(data: CreateMeetingInput): Promise<Meeting> {
    const response = await api.post<ApiResponse<Meeting>>("/", data);
    return response.data.data;
  },

  async updateMeeting(id: number, data: UpdateMeetingInput): Promise<Meeting> {
    const response = await api.put<ApiResponse<Meeting>>(`/${id}`, data);
    return response.data.data;
  },

  async deleteMeeting(id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`/${id}`);
  },

  async uploadAudio(id: number, file: File): Promise<Meeting> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<ApiResponse<Meeting>>(`/${id}/upload-audio`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  async transcribeMeeting(id: number): Promise<Meeting> {
    const response = await api.post<ApiResponse<Meeting>>(`/${id}/transcribe`);
    return response.data.data;
  },

  async summarizeMeeting(id: number): Promise<Meeting> {
    const response = await api.post<ApiResponse<Meeting>>(`/${id}/summarize`);
    return response.data.data;
  },

  async downloadReport(id: number): Promise<Blob> {
    const response = await api.get(`/${id}/report`, {
      responseType: "blob",
    });
    return response.data;
  },

  async sendReport(id: number, recipients: string[]): Promise<Record<string, unknown>> {
    const response = await api.post<ApiResponse<Record<string, unknown>>>(`/${id}/send-report`, {
      recipients,
    } as SendReportRequest);
    return response.data.data;
  },
};

export default meetingService;
