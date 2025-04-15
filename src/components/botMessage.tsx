import ReactMarkdown from "react-markdown";
import botImg from "../assets/bot.svg";

const BotMessage = ({ text }: { text: string }) => {
  return (
    <div className="flex rounded-lg space-x-2.5">
      <img src={botImg} alt="bot" width={38} height={38} className="self-start" />
      <div className="p-2 text-white text-sm bg-[#101F2E] rounded-lg px-4 py-2 min-h-14 w-72 flex items-center">
        <ReactMarkdown
          components={{
            a: ({ node, ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer">
                {props.children}
              </a>
            ),
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default BotMessage;
