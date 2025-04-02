export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface User {
  email: string;
  password: string;
}

export interface ChatData {
  id: number;
  user: string;
  bot: string;
  timestamp: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}