import botImg from "../assets/user.svg";

const UserMessage = ({ text }: { text: string }) => {
  return (
    <div className="flex rounded-lg space-x-2.5 justify-end">
      <div
        className="p-2 text-white text-sm bg-gradient-to-l from-black to-[#5A2E00] rounded-lg px-4 py-2 min-h-[63px] w-[339px] flex items-center"
      >
        {text}
      </div>
      <img
        src={botImg}
        alt="bot"
        width={38}
        height={38}
        className="self-start"
      />
    </div>
  );
};

export default UserMessage;
