import api from "./api";

const meetingService = {
  async getAllMeetings() {
    const response = await api.get("/");
    return response.data.data;
  },

  async getMeetingById(id) {
    const response = await api.get(`/${id}`);
    return response.data.data;
  },

  async createMeeting(meetingData) {
    const response = await api.post("/", meetingData);
    return response.data.data;
  },

  async updateMeeting(id, meetingData) {
    const response = await api.put(`/${id}`, meetingData);
    return response.data.data;
  },

  async deleteMeeting(id) {
    await api.delete(`/${id}`);
  },

  async uploadAudio(id, file) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
      `/${id}/upload-audio`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  },

  async transcribeMeeting(id) {
    const response = await api.post(`/${id}/transcribe`);

    return response.data.data;
  },
};

export default meetingService;