import ReactMarkdown from 'react-markdown';

const BotMessage = ({text}:{text: string}) => {
    return (
        <div className="bg-[#f6f3ec] rounded-lg p-2 flex flex-col w-fit items-start">
            {/* <h1 className="font-bold p-2 text-[#35302a] text-xl">Answer</h1> */}
              <div className={`inline-block p-2 text-[#574c3f]`}>
                <ReactMarkdown>{text}</ReactMarkdown>
              </div>
        </div>
    )
}

export default BotMessage;