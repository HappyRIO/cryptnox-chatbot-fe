import ReactMarkdown from "react-markdown";

const BotMessage = ({ text }: { text: string }) => {
  return (
    <div className="bg-gray-300 rounded-lg flex flex-col w-fit items-start">
      <div className="inline-block p-2 text-black">
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
