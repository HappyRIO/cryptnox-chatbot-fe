

const UserMessage = ({text}:{text: string}) => {
    return (
        <div className="flex flex-col items-end">
              <div className={`inline-block p-2 rounded-lg bg-[#35302a] text-[#f6f3ec]`}>
                {text}
              </div>
        </div>
    )
}

export default UserMessage;