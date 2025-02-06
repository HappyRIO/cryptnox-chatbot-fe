import React, { useState, useEffect } from 'react';

const Thinking: React.FC = () => {
  const [dots, setDots] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) {
          return '';
        }
        return prevDots + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2 text-[#574c3f] animate-pulse">
      <div className="w-4 h-4 rounded-full bg-[#574c3f] animate-bounce"></div>
      <span className="text-lg font-medium">
        Thinking{dots}
      </span>
    </div>
  );
};

export default Thinking;