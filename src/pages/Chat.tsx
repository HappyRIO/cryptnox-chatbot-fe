import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import UserMessage from "../components/userMessage";
import BotMessage from "../components/botMessage";
import Thinking from "../components/thinking";
import logo from "../assets/logo.svg";
import sendButton from "../assets/sendbutton.svg";
import { Message } from "../types";

function App() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello, How can I help you?" },
  ]);
  const [thinking, setThinking] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || thinking) return;

    setThinking(true);

    // Append user message to messages
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    const data = [...messages, { role: "user", content: input }];

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ msg: data, chat_id: chatId }),
        }
      );

      // Ensure there is a readable body
      if (!response.body) return;

      const decoder = new TextDecoderStream("utf-8");
      const reader = response.body.pipeThrough(decoder).getReader();

      let done = false;
      let answer = "";

      // Initially, add a placeholder message for the bot
      const botMessage: Message = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, botMessage]);

      while (!done) {
        const { value, done: isDone } = await reader.read();
        done = isDone;
        if (!thinking) {
          setThinking(false);
        }

        if (value) {
          answer += value;

          // Update the last bot message text in the state
          setMessages((prev) => {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1] = {
              ...updatedMessages[updatedMessages.length - 1],
              content: answer,
            };
            return updatedMessages;
          });
        }
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error fetching response." },
      ]);
    }

    // Clear input
    setInput("");

    inputRef.current?.focus();
  };

  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [input, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    if (!chatId) {
      setChatId(uuidv4());
    }
  }, []);

  return (
    <div
      id="chatbot"
      className="flex flex-col justify-end fixed bottom-0 right-0 rounded-[32px] bg-[url('/src/assets/background.svg')] bg-cover bg-center bg-no-repeat"
    >
      {
        <div className="p-5 rounded-[32px] shadow-[0_0_15px_rgba(0,0,0,0.5)] shadow-black max-w-[400px] h-[660px] flex flex-col justify-between rounded-b-[32px] text-black">
          <div
            id="chat-header"
            className="flex justify-center items-center px-1 py-2"
          >
            <img src={logo} width={400} height={35.48} alt="logo" />
          </div>

          <div
            className="flex-1 w-full overflow-y-auto flex flex-col-reverse"
            id="chat-container"
          >
            <div className="flex flex-col-reverse w-full justify-start space-y-reverse space-y-2">
              <div ref={messagesEndRef} />
              {thinking && <Thinking />}
              {[...messages].reverse().map((msg, index) => (
                <div key={index}>
                  {msg.role === "user" ? (
                    <UserMessage text={msg.content} />
                  ) : (
                    msg.content && <BotMessage text={msg.content} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className={`w-full py-2 self-center`}>
            <form onSubmit={handleSubmit} className="relative flex">
              <input
                ref={inputRef}
                placeholder="Ask a follow-up question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                autoFocus
                className="w-full p-3 pr-12 rounded-lg border border-[#1602114D] focus:outline-none focus:border-gray-400 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] shadow-white text-black"
                aria-label="Chat message input"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-3.5 border-none bg-transparent cursor-pointer"
                aria-label="Send message"
              >
                <img src={sendButton} alt="Send message" />
              </button>
            </form>
          </div>
          {/* </div> */}
        </div>
      }
    </div>
  );
}

export default App;
