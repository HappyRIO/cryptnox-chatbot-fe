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
  chatid: string;
  user: string;
  bot: string;
  edited?: number;
  timestamp: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}