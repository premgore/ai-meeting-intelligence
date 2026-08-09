import api from "../lib/api";
import { ApiResponse, ChatRequest, ChatResponse } from "../types";

export const chatService = {
  async askQuestion(meetingId: number, question: string): Promise<string> {
    const response = await api.post<ApiResponse<ChatResponse>>("/chat", {
      meeting_id: meetingId,
      question,
    } as ChatRequest);
    return response.data.data.answer;
  },

  async streamChat(
    meetingId: number,
    question: string,
    onChunk: (chunk: string) => void,
    onError?: (err: Error) => void,
    onDone?: () => void
  ): Promise<void> {
    try {
      const token = localStorage.getItem("access_token");
      const baseURL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

      const response = await fetch(`${baseURL}/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ meeting_id: meetingId, question }),
      });

      if (!response.ok) {
        throw new Error(`Streaming failed with status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No readable stream body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        
        // Parse Server-Sent Events lines
        const lines = text.split("\n");
        for (const line of lines) {
          if (line.startsWith("data:")) {
            const dataContent = line.slice(5).trim();
            if (dataContent) {
              onChunk(dataContent);
            }
          }
        }
      }
      if (onDone) onDone();
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Streaming error");
      if (onError) onError(error);
      else console.error(error);
    }
  },
};

export default chatService;
