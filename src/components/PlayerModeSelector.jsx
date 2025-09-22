import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Users, Zap, Brain, Target, Settings, Palette } from 'lucide-react';
import BoardLayoutSelector from './BoardLayoutSelector';

const PlayerModeSelector = ({ onModeSelect, selectedGameMode }) => {
  const [selectedPlayerMode, setSelectedPlayerMode] = useState('ai'); // الافتراضي: اللعب مع الكمبيوتر
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [aiSpeed, setAiSpeed] = useState('normal');
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState(null);

  const playerModes = {
    ai: {
      name: 'ضد الكمبيوتر',
      icon: Bot,
      description: 'العب ضد ذكاء اصطناعي متقدم مع مستويات صعوبة مختلفة',
      color: 'blue'
    },
    human: {
      name: 'لاعب ضد لاعب',
      icon: Users,
      description: 'العب مع صديق على نفس الجهاز',
      color: 'green'
    }
  };

  const aiDifficultyLevels = {
    easy: {
      name: 'سهل',
      description: 'مناسب للمبتدئين - يرتكب أخطاء أحياناً',
      color: 'green',
      thinkingTime: 500
    },
    medium: {
      name: 'متوسط',
      description: 'تحدي متوازن - يفكر بعناية',
      color: 'yellow',
      thinkingTime: 1000
    },
    hard: {
      name: 'صعب',
      description: 'للخبراء - استراتيجية متقدمة',
      color: 'red',
      thinkingTime: 1500
    },
    expert: {
      name: 'خبير',
      description: 'مستوى احترافي - تحدي حقيقي',
      color: 'purple',
      thinkingTime: 2000
    }
  };

  const aiSpeedSettings = {
    instant: {
      name: 'فوري',
      description: 'حركة فورية بدون تأخير',
      multiplier: 0
    },
    fast: {
      name: 'سريع',
      description: 'استجابة سريعة (0.5 ثانية)',
      multiplier: 0.5
    },
    normal: {
      name: 'عادي',
      description: 'سرعة طبيعية (1-2 ثانية)',
      multiplier: 1
    },
    slow: {
      name: 'بطيء',
      description: 'يفكر بعمق (2-3 ثواني)',
      multiplier: 1.5
    }
  };

  const handleContinueToLayout = () => {
    setShowLayoutSelector(true);
  };

  const handleLayoutSelect = (layoutKey, layoutData) => {
    setSelectedLayout({ key: layoutKey, data: layoutData });
    
    const settings = {
      playerMode: selectedPlayerMode,
      aiDifficulty: selectedPlayerMode === 'ai' ? aiDifficulty : null,
      aiSpeed: selectedPlayerMode === 'ai' ? aiSpeed : null,
      thinkingTime: selectedPlayerMode === 'ai' 
        ? aiDifficultyLevels[aiDifficulty].thinkingTime * aiSpeedSettings[aiSpeed].multiplier
        : 0,
      boardLayout: { key: layoutKey, data: layoutData }
    };
    
    onModeSelect(settings);
  };

  const handleBackFromLayout = () => {
    setShowLayoutSelector(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* اختيار نوع اللاعب */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl">اختر نوع اللعب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(playerModes).map(([key, mode]) => {
              const Icon = mode.icon;
              const isSelected = selectedPlayerMode === key;
              
              return (
                <motion.div
                  key={key}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? `border-${mode.color}-500 bg-${mode.color}-50 shadow-lg transform scale-105`
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedPlayerMode(key)}
                  whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={`w-8 h-8 ${isSelected ? `text-${mode.color}-600` : 'text-gray-600'}`} />
                    <h3 className={`text-lg font-bold ${isSelected ? `text-${mode.color}-900` : 'text-gray-900'}`}>
                      {mode.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">{mode.description}</p>
                  
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-gray-200"
                    >
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        ✓ محدد
                      </Badge>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* إعدادات الذكاء الاصطناعي */}
      <AnimatePresence>
        {selectedPlayerMode === 'ai' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* مستوى الصعوبة */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  مستوى الصعوبة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(aiDifficultyLevels).map(([key, level]) => {
                    const isSelected = aiDifficulty === key;
                    
                    return (
                      <motion.div
                        key={key}
                        className={`p-3 rounded-lg border-2 cursor-pointer text-center transition-all duration-300 ${
                          isSelected
                            ? `border-${level.color}-500 bg-${level.color}-50 shadow-md`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setAiDifficulty(key)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <h4 className={`font-bold ${isSelected ? `text-${level.color}-900` : 'text-gray-900'}`}>
                          {level.name}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">{level.description}</p>
                        
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-2"
                          >
                            <Badge variant="default" size="sm">✓</Badge>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* سرعة الاستجابة */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  سرعة الاستجابة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(aiSpeedSettings).map(([key, speed]) => {
                    const isSelected = aiSpeed === key;
                    
                    return (
                      <motion.div
                        key={key}
                        className={`p-3 rounded-lg border-2 cursor-pointer text-center transition-all duration-300 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setAiSpeed(key)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <h4 className={`font-bold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                          {speed.name}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">{speed.description}</p>
                        
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-2"
                          >
                            <Badge variant="default" size="sm">✓</Badge>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* معاينة الإعدادات */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-blue-900">معاينة الإعدادات</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-2 bg-white rounded-lg">
                    <div className="font-medium text-gray-900">المستوى</div>
                    <div className="text-blue-600">{aiDifficultyLevels[aiDifficulty].name}</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded-lg">
                    <div className="font-medium text-gray-900">السرعة</div>
                    <div className="text-blue-600">{aiSpeedSettings[aiSpeed].name}</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded-lg">
                    <div className="font-medium text-gray-900">وقت التفكير</div>
                    <div className="text-blue-600">
                      {aiSpeedSettings[aiSpeed].multiplier === 0 
                        ? 'فوري' 
                        : `${(aiDifficultyLevels[aiDifficulty].thinkingTime * aiSpeedSettings[aiSpeed].multiplier / 1000).toFixed(1)} ثانية`
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* زر المتابعة لاختيار التخطيط */}
      {!showLayoutSelector && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleContinueToLayout}
            size="lg"
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xl px-12 py-4 rounded-xl shadow-lg"
          >
            <Palette className="w-6 h-6 mr-3" />
            اختر تخطيط اللوحة
            {selectedPlayerMode === 'ai' 
              ? ` - ${aiDifficultyLevels[aiDifficulty].name} (${aiSpeedSettings[aiSpeed].name})`
              : ' - لاعب ضد لاعب'
            }
          </Button>
        </div>
      )}

      {/* اختيار تخطيط اللوحة */}
      <AnimatePresence>
        {showLayoutSelector && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            <div className="flex justify-between items-center mb-6">
              <Button
                onClick={handleBackFromLayout}
                variant="outline"
                className="flex items-center gap-2"
              >
                ← العودة للإعدادات
              </Button>
              
              <h3 className="text-xl font-bold text-amber-900">
                اختر تخطيط اللوحة المفضل
              </h3>
              
              <div className="w-32"></div>
            </div>
            
            <BoardLayoutSelector
              onLayoutSelect={handleLayoutSelect}
              selectedGameMode={selectedGameMode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayerModeSelector;
