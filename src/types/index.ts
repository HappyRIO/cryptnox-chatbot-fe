export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatData {
  id: number;
  chatid: string;
  user: string;
  bot: string;
  edited?: number;
  timestamp: string;
}