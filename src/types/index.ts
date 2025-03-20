export interface Message {
    // id: string;
    content: string;
    role: 'user' | 'assistant';
    // timestamp: Date;
  }
  
  export interface Conversation {
    id: string;
    messages: Message[];
  }
  
  export interface ChatbotInstruction {
    instruction: string;
    timestamp: Date;
  }

  export const end_query = [
    "okay",
    "ok",
    "sure",
    "yes",
    "yeah",
    "yep",
    "yup",
    "yeppers",
    "understand",
    "got it",
    "gotcha",
    "alright",
    "alrighty",
    "alrighty then",
    "I understand",
  ]