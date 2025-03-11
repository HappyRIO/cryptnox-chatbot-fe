import React, { useEffect, useState } from "react";
import questionsJson from "./question.json"; // Import JSON file

// Message interface for displaying in the chat
interface Message {
  text: string;
  type: "user" | "bot";
}

const QuestionsFetcher: React.FC = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]); // To store user/bot messages

  // Fetch questions from the JSON file
  const fetchQuestions = () => {
    try {
      setQuestions(questionsJson.questions); // Access questions from the JSON
      setIsLoaded(true); // Set loaded state to true
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Function to send questions one by one with a delay of 5 seconds after receiving a response
  const sendQuestions = () => {
    if (questions.length === 0) {
      console.error("No questions to send.");
      return;
    }

    setIsSending(true); // Start sending questions

    const sendNextQuestion = (index: number) => {
      if (index >= questions.length) {
        setIsSending(false); // All questions sent
        return;
      }

      const question = questions[index];

      // Add the question as a user message to the chat
      setMessages((prev) => [...prev, { text: question, type: "user" }]);

      setLoading(true);
      fetch(`${import.meta.env.VITE_API_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ msg: question }),
      })
        .then(async (response) => {
          if (!response.body) {
            console.error("No response body");
            return;
          }

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
        })
        .catch((error) => {
          console.error("Error sending question:", error);
          setLoading(false);

          // Add bot error message to messages
          setMessages((prev) => [
            ...prev,
            { text: "Error fetching response.", type: "bot" },
          ]);
        })
        .finally(() => {
          // Wait for 5 seconds before sending the next question
          setTimeout(() => sendNextQuestion(index + 1), 5000);
        });
    };

    // Start sending from the first question
    sendNextQuestion(currentQuestionIndex);
  };

  useEffect(() => {
    const chatContainer = document.getElementById("response-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="container mx-auto p-4 h-screen w-screen">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg h-1/5 w-full">
        <h1 className="text-xl font-bold mb-4">Questions Fetcher</h1>

        {/* Upload Button to load questions */}
        <button
          onClick={fetchQuestions}
          className="px-4 py-2 mr-20 bg-green-500 text-white rounded-md mb-4"
        >
          Upload Questions
        </button>

        {/* Button to start sending questions */}
        <button
          onClick={sendQuestions}
          disabled={isSending || questions.length === 0 || !isLoaded}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          Start Sending Questions
        </button>

        {/* Loading state while sending questions */}
        {loading && <div className="text-center mt-4">Sending question...</div>}
      </div>
      <div id="response-container" className="h-4/5 overflow-y-scroll">
        {/* Display questions, current question, and response */}
        <div className="mt-4 ">
          {messages.map((msg, index) => (
            <div key={index} className="my-2">
              {msg.type === "user" ? (
                <div className="text-blue-500">User: {msg.text}</div>
              ) : (
                <div className="text-green-500">Bot: {msg.text}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsFetcher;
