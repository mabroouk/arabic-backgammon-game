import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, BookOpen, Clock, Target, Users, Bot, ArrowLeft } from 'lucide-react';
import { GAME_MODES } from '../lib/gameLogic';
import GameRulesDisplay from './GameRulesDisplay';
import PlayerModeSelector from './PlayerModeSelector';

const GameModeSelection = ({ onModeSelect, onBack }) => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setShowRules(true);
  };

  const handleContinueToPlayerSelection = () => {
    setShowPlayerSelector(true);
    setShowRules(false);
  };

  const handlePlayerModeSelect = (playerSettings) => {
    onModeSelect(selectedMode, playerSettings);
  };

  const handleBackFromPlayerSelector = () => {
    setShowPlayerSelector(false);
    setShowRules(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* العنوان والتحكم */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة
          </Button>
          
          <h1 className="text-3xl font-bold text-amber-900 text-center">
            🎲 اختر نمط اللعب المفضل
          </h1>
          
          <div className="w-20"></div> {/* مساحة للتوازن */}
        </div>



        {/* شبكة أنماط اللعب */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {Object.entries(GAME_MODES).map(([key, mode]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Object.keys(GAME_MODES).indexOf(key) * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedMode === key
                    ? 'ring-2 ring-amber-500 bg-amber-50 shadow-lg transform scale-105'
                    : 'hover:shadow-md hover:bg-amber-25'
                }`}
                onClick={() => handleModeSelect(key)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg text-amber-900">
                      {mode.name}
                    </CardTitle>
                    <Badge
                      variant={
                        mode.difficulty === 'سهلة' ? 'default' :
                        mode.difficulty === 'متوسطة' ? 'secondary' : 'destructive'
                      }
                      className="text-xs"
                    >
                      {mode.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-amber-700 font-medium">
                    {mode.nameEn}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {mode.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{mode.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      <span>
                        {key === 'aada' || key === 'mahbousa' ? 'تقليدي' :
                         key === 'thirtyone' || key === 'longGammon' ? 'سريع' :
                         key === 'gulbehar' ? 'متقدم' : 'مبسط'}
                      </span>
                    </div>
                  </div>
                  
                  {selectedMode === key && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-amber-200"
                    >
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContinueToPlayerSelection();
                        }}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                        size="sm"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        التالي
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* عرض القوانين */}
        <AnimatePresence>
          {selectedMode && showRules && !showPlayerSelector && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <GameRulesDisplay
                selectedMode={selectedMode}
                isVisible={true}
              />
              
              {/* زر المتابعة */}
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleContinueToPlayerSelection}
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xl px-12 py-4 rounded-xl shadow-lg"
                >
                  <Play className="w-6 h-6 mr-3" />
                  اختر نوع اللاعب
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* اختيار نوع اللاعب */}
        <AnimatePresence>
          {showPlayerSelector && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <Button
                  onClick={handleBackFromPlayerSelector}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  العودة للقوانين
                </Button>
                
                <h2 className="text-2xl font-bold text-amber-900">
                  اختر نوع اللاعب لـ {GAME_MODES[selectedMode]?.name}
                </h2>
                
                <div className="w-32"></div>
              </div>
              
              <PlayerModeSelector
                onModeSelect={handlePlayerModeSelect}
                selectedGameMode={selectedMode}
              />
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    </div>
  );
};

export default GameModeSelection;
