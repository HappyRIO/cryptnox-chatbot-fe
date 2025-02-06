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