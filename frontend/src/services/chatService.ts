import api from "../lib/api";
import { ApiResponse, ChatResponse } from "../types";

export const chatService = {

  async askQuestion(
    meetingId: number | null,
    question: string
  ): Promise<string> {

    const response = await api.post<ApiResponse<ChatResponse>>(
      "/chat",
      {
        meeting_id: meetingId,
        question,
      }
    );

    return response.data.data.answer;
  },

  async streamChat(
    meetingId: number | null,
    question: string,
    onChunk: (chunk: string) => void,
    onError?: (err: Error) => void,
    onDone?: () => void
  ): Promise<void> {

    try {

      const token = localStorage.getItem("access_token");

      const baseURL =
        import.meta.env.VITE_API_BASE_URL ||
        "/api/v1";

      const response = await fetch(
        `${baseURL}/chat/stream`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            meeting_id: meetingId,
            question,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Streaming failed with status: ${response.status}`
        );
      }

      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error("No readable stream body");
      }

      const decoder = new TextDecoder();

      while (true) {

        const { done, value } =
          await reader.read();

        if (done) {
          break;
        }

        const text =
          decoder.decode(value, { stream: true });

        const lines =
          text.split("\n");

        for (const line of lines) {

          if (line.startsWith("data:")) {

            const dataContent =
              line.slice(5).trim();

            if (dataContent) {
              onChunk(dataContent);
            }
          }
        }
      }

      onDone?.();

    } catch (err: unknown) {

      const error =
        err instanceof Error
          ? err
          : new Error("Streaming error");

      onError?.(error);
    }
  },
};

export default chatService;
