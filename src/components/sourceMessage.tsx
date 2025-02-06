const SourceMessage = ({sources}:{sources: string[]}) => {
    return (
        <div className="bg-[#f6f3ec] rounded-lg p-2 mt-2">
            <h1 className="font-bold p-2 text-[#35302a] text-xl">Sources</h1>
              <div className={`inline-block w-full p-2 rounded-lg text-[#574c3f]`}>
                {sources.map((source, index) => (
                    <li key={index}>
                        <a href={source} target="_blank" rel="noopener noreferrer">
                            {source}
                        </a>
                    </li>
                ))}
              </div>
        </div>
    )
}

export default SourceMessage;