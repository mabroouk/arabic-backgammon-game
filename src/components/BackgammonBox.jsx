import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Settings, Users, Bot } from 'lucide-react';
import EnhancedGameBoard from './EnhancedGameBoard';
import GameModeSelection from './GameModeSelection';

const BackgammonBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showModeSelection, setShowModeSelection] = useState(false);
  const [gameMode, setGameMode] = useState('aada');
  const [playerMode, setPlayerMode] = useState({ playerMode: 'ai', aiDifficulty: 'medium', aiSpeed: 'normal' });

  const handleOpenBox = () => {
    setIsOpen(true);
    // تأخير بسيط لإظهار الرسوم المتحركة
    setTimeout(() => {
      setShowModeSelection(true);
    }, 1000);
  };

  const handleCloseBox = () => {
    setGameStarted(false);
    setShowModeSelection(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  const handleModeSelect = (mode, playerSettings) => {
    setGameMode(mode);
    setPlayerMode(playerSettings);
    setShowModeSelection(false);
    setGameStarted(true);
  };

  const handleBackToModeSelection = () => {
    setGameStarted(false);
    setShowModeSelection(true);
  };

  if (gameStarted) {
    return <EnhancedGameBoard onBackToMenu={handleBackToModeSelection} gameMode={gameMode} playerMode={playerMode} />;
  }

  if (showModeSelection) {
    return <GameModeSelection onModeSelect={handleModeSelect} onBack={handleCloseBox} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="relative">
        {/* الصندوق المغلق */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              className="relative w-96 h-64 cursor-pointer"
              onClick={handleOpenBox}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* الجزء العلوي من الصندوق */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-amber-800 to-amber-900 rounded-2xl shadow-2xl border-4 border-amber-700"
                style={{
                  background: `
                    linear-gradient(135deg, #92400e 0%, #78350f 50%, #451a03 100%),
                    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)
                  `
                }}
              >
                {/* نسيج الخشب */}
                <div className="absolute inset-0 opacity-20 rounded-2xl"
                     style={{
                       backgroundImage: `
                         radial-gradient(circle at 20% 20%, rgba(0,0,0,0.1) 1px, transparent 1px),
                         radial-gradient(circle at 80% 80%, rgba(0,0,0,0.1) 1px, transparent 1px),
                         linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.05) 50%, transparent 60%)
                       `
                     }}
                />
                
                {/* المفصلات */}
                <div className="absolute top-4 left-4 w-8 h-4 bg-amber-600 rounded-full shadow-inner" />
                <div className="absolute top-4 right-4 w-8 h-4 bg-amber-600 rounded-full shadow-inner" />
                
                {/* القفل */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-12 bg-gradient-to-b from-yellow-600 to-yellow-700 rounded-lg shadow-lg border-2 border-yellow-500">
                    <div className="w-8 h-8 bg-yellow-800 rounded-full mx-auto mt-2 flex items-center justify-center">
                      <div className="w-3 h-3 bg-yellow-900 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* النص العربي */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                  <h2 className="text-2xl font-bold text-amber-100 mb-2 drop-shadow-lg">
                    لعبة الطاولة الاحترافية
                  </h2>
                  <p className="text-amber-200 text-sm drop-shadow">
                    اضغط لفتح الصندوق
                  </p>
                </div>

                {/* تأثير اللمعان */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 rounded-2xl"
                  animate={{
                    x: [-100, 400],
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  style={{ transform: 'skewX(-20deg)' }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* الصندوق المفتوح */}
        <AnimatePresence>
          {isOpen && !gameStarted && (
            <motion.div
              className="w-96 h-80"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* الجزء السفلي من الصندوق */}
              <motion.div
                className="relative w-full h-64 bg-gradient-to-br from-amber-800 to-amber-900 rounded-2xl shadow-2xl border-4 border-amber-700"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: 0 }}
              >
                {/* الداخلية */}
                <div className="absolute inset-4 bg-gradient-to-br from-red-900 to-red-800 rounded-xl shadow-inner">
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-amber-100 mb-4">
                      اختر نمط اللعب
                    </h3>
                    
                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          setPlayerMode('ai');
                          setGameMode('classic');
                          setGameStarted(true);
                        }}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        <Bot className="w-4 h-4 mr-2" />
                        لعب ضد الكمبيوتر
                      </Button>
                      
                      <Button
                        onClick={() => {
                          setPlayerMode('human');
                          setGameMode('classic');
                          setGameStarted(true);
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        لاعب ضد لاعب
                      </Button>
                      
                      <Button
                        onClick={handleCloseBox}
                        variant="outline"
                        className="w-full border-amber-300 text-amber-100 hover:bg-amber-800"
                      >
                        إغلاق الصندوق
                      </Button>
                    </div>
                  </div>
                </div>

                {/* المفصلات المفتوحة */}
                <div className="absolute -top-2 left-4 w-8 h-6 bg-amber-600 rounded-t-full shadow-lg" />
                <div className="absolute -top-2 right-4 w-8 h-6 bg-amber-600 rounded-t-full shadow-lg" />
              </motion.div>

              {/* الغطاء المفتوح */}
              <motion.div
                className="absolute -top-16 left-0 w-full h-64 bg-gradient-to-br from-amber-800 to-amber-900 rounded-2xl shadow-2xl border-4 border-amber-700 origin-bottom"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -120 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* داخل الغطاء */}
                <div className="absolute inset-4 bg-gradient-to-br from-red-900 to-red-800 rounded-xl shadow-inner">
                  <div className="p-4 text-center">
                    <h4 className="text-lg font-bold text-amber-100 mb-2">
                      مرحباً بك في
                    </h4>
                    <p className="text-amber-200 text-sm">
                      أفضل لعبة طاولة رقمية
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* تأثيرات الجسيمات عند الفتح */}
        <AnimatePresence>
          {isOpen && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{
                    x: 200,
                    y: 150,
                    scale: 0,
                    opacity: 1
                  }}
                  animate={{
                    x: 200 + (Math.random() - 0.5) * 400,
                    y: 150 + (Math.random() - 0.5) * 300,
                    scale: [0, 1, 0],
                    opacity: [1, 0.8, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
      
      {/* معلومات المطور */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
          <p className="text-white/80 text-sm font-medium text-center">
            برمجة وتطوير: <span className="text-amber-300 font-semibold">محاسب أحمد مبروك</span> © 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackgammonBox;
