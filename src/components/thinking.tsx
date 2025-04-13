import React from "react";
import { motion } from "framer-motion";
import botImg from "../assets/bot.svg";

const Thinking: React.FC = () => {
  return (
    <div className="flex space-x-2.5">
      <img
        src={botImg}
        alt="bot"
        width={38}
        height={38}
        className="self-start"
      />

      <div className="flex w-20 space-x-1.5 bg-[#101F2E] px-5 py-auto rounded-r-2xl rounded-t-2xl rounded-es-[1px] items-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="rounded-full bg-white"
            animate={{
              opacity: [0.3, 1, 0.3],
              width: ["6px", "8px", "6px"],
              height: ["6px", "8px", "6px"],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Thinking;
