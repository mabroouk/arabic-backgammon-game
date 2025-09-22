import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../utils/sounds';

const TeaCup = ({ position = 'left', onClick }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    soundManager.playSound('teaCup');
    if (onClick) onClick();
    
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <motion.div
      className={`absolute ${position === 'left' ? 'left-4' : 'right-4'} top-4 cursor-pointer`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={isClicked ? { rotate: [0, -5, 5, 0] } : {}}
      onClick={handleClick}
    >
      {/* الصحن */}
      <div className="relative">
        <div className="w-12 h-3 bg-gradient-to-r from-amber-200 to-amber-300 rounded-full shadow-lg"></div>
        
        {/* الكوب */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-8 bg-gradient-to-b from-amber-100 to-amber-200 rounded-b-full border-2 border-amber-300 shadow-md relative">
            {/* الشاي */}
            <div className="absolute top-1 left-1 right-1 h-4 bg-gradient-to-b from-amber-800 to-amber-900 rounded-b-full"></div>
            
            {/* المقبض */}
            <div className="absolute -right-2 top-2 w-3 h-4 border-2 border-amber-300 rounded-r-full bg-transparent"></div>
            
            {/* البخار */}
            <motion.div
              className="absolute -top-2 left-1/2 transform -translate-x-1/2"
              animate={{
                opacity: [0.3, 0.7, 0.3],
                y: [0, -3, -6],
                scale: [0.8, 1, 1.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="text-gray-400 text-xs">💨</div>
            </motion.div>
          </div>
        </div>
        
        {/* ملعقة صغيرة */}
        <div className="absolute -top-4 -right-1 w-1 h-6 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full transform rotate-12"></div>
        <div className="absolute -top-5 -right-1 w-2 h-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full transform rotate-12"></div>
      </div>
      
      {/* تأثير الانعكاس */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-gradient-to-t from-transparent to-white rounded-full pointer-events-none"></div>
    </motion.div>
  );
};

export default TeaCup;
