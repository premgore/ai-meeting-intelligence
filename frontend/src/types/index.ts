export interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export type SentimentType = 'Positive' | 'Neutral' | 'Negative' | string;

export interface Meeting {
  id: number;
  title: string;
  description: string;
  audio_path?: string | null;
  transcript?: string | null;
  summary?: string | null;
  action_items?: string[] | null;
  key_decisions?: string[] | null;
  risks?: string[] | null;
  sentiment?: SentimentType | null;
  created_at?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface ChatRequest {
  meeting_id: number;
  question: string;
}

export interface ChatResponse {
  answer: string;
}

export interface SendReportRequest {
  recipients: string[];
}

export interface CreateMeetingInput {
  title: string;
  description: string;
}

export interface UpdateMeetingInput {
  title: string;
  description: string;
}

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  meetingId?: number;
}
