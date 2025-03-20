import { useState, useEffect, useRef } from "react";
import UserMessage from "../components/userMessage";
import BotMessage from "../components/botMessage";
import { ArrowUp, X } from "lucide-react";
import Thinking from "../components/thinking";
import logo from "../assets/cryptnox-logo.png";
import message from "../assets/message.svg"
import { end_query } from "../types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// const greeting = `Hello! 😊

// I hope you're doing well. I apologize for the delay in my delivery, but I have been working diligently to ensure the best results. To enhance speed and accuracy, I've explored various solutions, and I believe the current option is the most effective.
// I also think the UI could be modified to align more closely with the website style.

// Additionally, I find communication on Upwork a bit challenging. If possible, would you be open to using Telegram for smoother communication? My Telegram ID is @higodev.`;

function App() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    // { role: "assistant", content: "Hello, How are you?" },
  ]);
  const [thinking, setThinking] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState<boolean>(false); // State to manage chat visibility
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || thinking) return;

    setThinking(true);

    // Append user message to messages
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    const data = [...messages, { role: "user", content: input }] 
    if (end_query.some((query) => input.toLowerCase().includes(query))) {
      setInput("");
      setThinking(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ msg: data }),
      });
      console.log(data)

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

        if (value) {
          console.log(value);
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
    setThinking(false);
    setInput("");

    inputRef.current?.focus();
    console.log("Focus set to input element");
  };

  const toggleChatVisibility = () => {
    setIsChatVisible((prev) => !prev);
  };

  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [input, messages]);

  return (
    <div id="chatbot" className="flex flex-col justify-end fixed bottom-4 right-4 max-w-96 h-screen z-50 bg-transparent">
      {isChatVisible && (
        <div className="rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] shadow-black">
          <div
            id="chat-header"
            className="flex justify-center items-center p-4 rounded-t-lg bg-black"
          >
            <img src={logo} width={150} height={60} alt="logo" />
            {/* <h1 className="text-xl font-bold">Cryptnox</h1> */}
          </div>

          <div className="flex flex-col rounded-b-lg 1bg-[#b7a58f] bg-green-50 p-2 text-black">
            <div
              id="chat-container"
              className="w-full h-[500px] flex flex-col items-center self-center overflow-y-auto space-y-4"
            >
              <div className="flex-1 w-full items-center self-center p-2 space-y-2">
                {messages.map((msg, index) => (
                  <div key={index}>
                    {msg.role === "user" ? (
                      <UserMessage text={msg.content} />
                    ) : (
                      <div>{msg.content && <BotMessage text={msg.content} />}</div>
                    )}
                  </div>
                ))}
                {thinking && <Thinking />}
              </div>
            </div>

            {/* Footer */}
            <div className={`w-96 p-2 self-center bg-transparent`}>
              <form onSubmit={handleSubmit} className="relative flex">
                <input
                  ref={inputRef}
                  // disabled={thinking}
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
                  className="w-full p-3 pr-24 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400 bg-[#35302a] shadow-[0_0_15px_rgba(0,0,0,0.5)] shadow-white text-white"
                  aria-label="Chat message input"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-gray-500 hover:bg-gray-800 text-white rounded-full border-none focus:outline-none"
                  aria-label="Send message"
                >
                  <ArrowUp />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      <div
        onClick={toggleChatVisibility}
        className="h-14 w-14 m-1 self-end bg-gray-500 hover:bg-gray-800 text-white rounded-full right-0  cursor-pointer flex flex-col justify-center items-center"
      >
        {isChatVisible ? <X className="h-8 w-8"/> : <img src={message} className="h-16 w-16 rounded-full"/>}
      </div>
    </div>
  );
}

export default App;
