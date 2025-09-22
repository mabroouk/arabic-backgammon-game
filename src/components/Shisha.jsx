import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/sounds';

const Shisha = ({ position = 'center', onClick }) => {
  const [isActive, setIsActive] = useState(false);
  const [smokeParticles, setSmokeParticles] = useState([]);

  const handleClick = () => {
    setIsActive(true);
    soundManager.playSound('shishaBubble');
    if (onClick) onClick();
    
    // إنشاء جسيمات الدخان
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 50,
      size: Math.random() * 20 + 10,
      opacity: Math.random() * 0.7 + 0.3,
      duration: Math.random() * 3 + 2
    }));
    
    setSmokeParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => setIsActive(false), 1000);
    
    // إزالة الجسيمات بعد انتهاء الرسوم المتحركة
    setTimeout(() => {
      setSmokeParticles(prev => 
        prev.filter(p => !newParticles.find(np => np.id === p.id))
      );
    }, 5000);
  };

  return (
    <div className={`absolute ${
      position === 'center' ? 'left-1/2 transform -translate-x-1/2' : 
      position === 'left' ? 'left-8' : 'right-8'
    } bottom-4`}>
      
      {/* جسيمات الدخان */}
      <AnimatePresence>
        {smokeParticles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${particle.x}%`,
              bottom: '100%',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            initial={{ 
              opacity: particle.opacity,
              scale: 0.5,
              y: 0,
              x: 0
            }}
            animate={{ 
              opacity: 0,
              scale: 1.5,
              y: -100 - Math.random() * 50,
              x: (Math.random() - 0.5) * 100
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: particle.duration,
              ease: "easeOut"
            }}
          >
            <div 
              className="w-full h-full bg-gray-400 rounded-full blur-sm"
              style={{ opacity: 0.6 }}
            ></div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* الشيشة */}
      <motion.div
        className="relative cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isActive ? { 
          filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
        } : {}}
        transition={{ duration: 0.5 }}
        onClick={handleClick}
      >
        {/* القاعدة */}
        <div className="w-16 h-20 bg-gradient-to-b from-amber-600 to-amber-800 rounded-b-full relative shadow-lg">
          {/* الماء */}
          <motion.div 
            className="absolute bottom-2 left-2 right-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-b-full"
            animate={isActive ? {
              background: [
                'linear-gradient(to bottom, #60a5fa, #2563eb)',
                'linear-gradient(to bottom, #93c5fd, #3b82f6)',
                'linear-gradient(to bottom, #60a5fa, #2563eb)'
              ]
            } : {}}
            transition={{ duration: 0.5, repeat: isActive ? 3 : 0 }}
          />
          
          {/* فقاعات الماء */}
          {isActive && (
            <motion.div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  initial={{ opacity: 0, y: 0, x: (Math.random() - 0.5) * 20 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    y: -15,
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 0.8,
                    delay: i * 0.1,
                    repeat: 2
                  }}
                />
              ))}
            </motion.div>
          )}
          
          {/* الأنبوب الداخلي */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-gray-400 to-gray-600"></div>
        </div>
        
        {/* العمود */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-2 h-16 bg-gradient-to-b from-amber-400 to-amber-600 shadow-md"></div>
        
        {/* الرأس */}
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-b from-red-600 to-red-800 rounded-t-full shadow-lg">
          {/* الفحم */}
          <motion.div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"
            animate={isActive ? {
              boxShadow: [
                '0 0 5px #f97316',
                '0 0 15px #ea580c',
                '0 0 5px #f97316'
              ]
            } : {}}
            transition={{ duration: 0.3, repeat: isActive ? 5 : 0 }}
          />
        </div>
        
        {/* الخرطوم */}
        <div className="absolute top-4 -right-8 w-12 h-2 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full transform rotate-12 shadow-md"></div>
        <div className="absolute top-6 -right-16 w-8 h-2 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full transform rotate-45 shadow-md"></div>
        
        {/* المبسم */}
        <div className="absolute top-8 -right-20 w-4 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full shadow-sm"></div>
        <div className="absolute top-8 -right-24 w-2 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full shadow-sm"></div>
        
        {/* تأثيرات الإضاءة */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white to-transparent opacity-20 rounded-b-full pointer-events-none"></div>
      </motion.div>
      
      {/* النص التوضيحي */}
      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-amber-700 text-center whitespace-nowrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        شيشة خليل مامون
      </motion.div>
    </div>
  );
};

export default Shisha;
