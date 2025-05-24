import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import botImg from "../assets/bot.svg";

const BotMessage = ({ text }: { text: string }) => {
  const components: Components = {
    h1: (props) => (
      <h1 className="text-2xl font-bold my-1" {...props} />
    ),
    h2: (props) => (
      <h2 className="text-xl font-semibold my-1" {...props} />
    ),
    h3: (props) => (
      <h3 className="text-lg font-semibold my-1" {...props} />
    ),
    a: (props) => (
      <a className="text-blue-400 underline" target="_blank" rel="noopener noreferrer" {...props}>
        {props.children}
      </a>
    ),
    ul: ({ children, ...props }) => {
      const validChildren = React.Children.toArray(children).filter(
        (child) => {
          if (typeof child === "string") return child.trim() !== "";
          if (React.isValidElement(child)) return true;
          return false;
        }
      );
      if (validChildren.length === 0) return null;
      return (
        <ul className="list-disc list-inside ml-4 my-1" {...props}>
          {validChildren}
        </ul>
      );
    },
    ol: ({ children, ...props }) => {
      const validChildren = React.Children.toArray(children).filter(
        (child) => {
          if (typeof child === "string") return child.trim() !== "";
          if (React.isValidElement(child)) return true;
          return false;
        }
      );
      if (validChildren.length === 0) return null;
      return (
        <ol className="list-decimal list-inside ml-4 my-1" {...props}>
          {validChildren}
        </ol>
      );
    },
    li: ({ children, ...props }) => {
      const validChildren = React.Children.toArray(children).map(child => {
        if (React.isValidElement(child) && child.type === 'p') {
          return <React.Fragment>{child.props.children}</React.Fragment>;
        }
        return child;
      });
    
      if (!validChildren.length) return null;
    
      return (
        <li className="my-0.5" {...props}>
          {validChildren}
        </li>
      );
    },
    strong: (props) => (
      <strong className="font-bold text-white" {...props} />
    ),
    code: ({ inline, className, children, ...props }: any) => {
      return inline ? (
        <code className="bg-gray-800 rounded px-1 py-0.5 font-mono" {...props}>
          {children}
        </code>
      ) : (
        <pre className="bg-gray-800 rounded p-2 my-2 overflow-x-auto">
          <code className="font-mono text-sm" {...props}>
            {children}
          </code>
        </pre>
      );
    },
    hr: () => (
      <hr className="my-4 border-gray-600" />
    ),
  };

  return (
    <div className="flex rounded-lg space-x-2.5">
      <img src={botImg} alt="bot" width={38} height={38} className="self-start" />
      <div className="p-2 text-white text-sm bg-[#101F2E] rounded-lg px-4 py-2 min-h-14 w-72 flex flex-col items-start">
        <ReactMarkdown components={components}>
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default BotMessage;
