import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Info, Play } from 'lucide-react';
import { GAME_MODES } from '@/lib/gameLogic';

const GameModeSelector = ({ selectedMode, onModeSelect, onStartGame }) => {
  const [expandedMode, setExpandedMode] = useState(null);

  const toggleExpanded = (mode) => {
    setExpandedMode(expandedMode === mode ? null : mode);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-amber-900 mb-2">
          اختر نمط اللعب
        </h3>
        <p className="text-amber-700">
          كل نمط له قوانين وإستراتيجيات مختلفة
        </p>
      </div>

      <div className="grid gap-4 max-h-96 overflow-y-auto">
        {Object.entries(GAME_MODES).map(([key, mode]) => (
          <motion.div
            key={key}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-200 ${
                selectedMode === key 
                  ? 'ring-2 ring-amber-500 bg-amber-50' 
                  : 'hover:shadow-lg hover:bg-amber-25'
              }`}
              onClick={() => onModeSelect(key)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedMode === key 
                        ? 'bg-amber-500 border-amber-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedMode === key && (
                        <motion.div
                          className="w-2 h-2 bg-white rounded-full m-0.5"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{mode.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{mode.nameEn}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(key);
                    }}
                  >
                    <Info className="w-4 h-4 mr-1" />
                    {expandedMode === key ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-3">{mode.description}</p>
                
                <AnimatePresence>
                  {expandedMode === key && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t pt-3 mt-3">
                        <h4 className="font-semibold text-sm mb-2 text-amber-800">
                          القوانين الأساسية:
                        </h4>
                        <div className="space-y-1">
                          {mode.rules.map((rule, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <Badge variant="outline" className="text-xs px-1 py-0 min-w-fit">
                                {index + 1}
                              </Badge>
                              <span className="text-xs text-gray-600 leading-relaxed">
                                {rule}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4 border-t"
        >
          <Button
            onClick={onStartGame}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3"
            size="lg"
          >
            <Play className="w-5 h-5 mr-2" />
            ابدأ اللعب - {GAME_MODES[selectedMode].name}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default GameModeSelector;
