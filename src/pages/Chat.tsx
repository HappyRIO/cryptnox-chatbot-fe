import { useState, useEffect } from "react";
import UserMessage from "../components/userMessage";
import BotMessage from "../components/botMessage";
import { ChevronUp, Send, X } from "lucide-react";
import Thinking from "../components/thinking";
import logo from "../assets/cryptnox-logo.png";

interface Message {
  text: string;
  type: "user" | "bot";
}

function App() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello!, how can I help you?", type: "bot" },
  ]);
  const [thinking, setThinking] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState<boolean>(false); // State to manage chat visibility

  const handleSubmit = async (e: React.FormEvent) => {
    setThinking(true);
    e.preventDefault();

    if (!input) return;

    // Append user message to messages
    setMessages((prev) => [...prev, { text: input, type: "user" }]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ msg: input }),
      });

      // Ensure there is a readable body
      if (!response.body) return;

      const decoder = new TextDecoderStream("utf-8");
      const reader = response.body.pipeThrough(decoder).getReader();

      let done = false;
      let answer = "";

      // Initially, add a placeholder message for the bot
      const botMessage: Message = { text: "", type: "bot" };
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
              text: answer,
            };
            return updatedMessages;
          });
        }
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error fetching response.", type: "bot" },
      ]);
    }

    // Clear input
    setThinking(false);
    setInput("");
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
    <div className="flex flex-col justify-end fixed bottom-4 right-4 max-w-96 h-screen">
      {isChatVisible && (
        <>
          <div
            id="chat-header"
            className="flex justify-center items-center p-4 rounded-t-lg bg-black"
          >
            <img src={logo} width={150} height={60} alt="logo" />
            {/* <h1 className="text-xl font-bold">Cryptnox</h1> */}
          </div>

          <div className="flex flex-col rounded-b-lg bg-[#b7a58f] p-2 text-black">
            <div
              id="chat-container"
              className="w-full h-[500px] flex flex-col items-center self-center overflow-y-auto space-y-4"
            >
              <div className="flex-1 w-full items-center self-center p-2 space-y-1">
                {messages.map((msg, index) => (
                  <div key={index}>
                    {msg.type === "user" ? (
                      <UserMessage text={msg.text} />
                    ) : (
                      <div>{msg.text && <BotMessage text={msg.text} />}</div>
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
                  disabled={thinking}
                  placeholder="Ask a follow-up question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  className="w-full p-3 pr-24 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400 bg-[#35302a] shadow-[0_0_15px_rgba(0,0,0,0.5)] shadow-white text-white"
                  aria-label="Chat message input"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-[#794444] bg-[#b7a58f] rounded-full hover:text-[#794444]"
                  aria-label="Send message"
                >
                  <Send />
                </button>
              </form>
            </div>
          </div>
        </>
      )}
      <div
        onClick={toggleChatVisibility}
        className="h-12 w-12 p-2 m-1 self-end text-[#7e4949] bg-[#534636] rounded-full right-0 hover:text-[#794444] cursor-pointer flex flex-col justify-center items-center"
      >
        {isChatVisible ? <X /> : <ChevronUp />}
      </div>
    </div>
  );
}

export default App;
