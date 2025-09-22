import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TVRemoteControl from '../utils/tvRemoteControl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Coffee, Crown, Timer, RotateCcw, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { BackgammonGame, AdvancedAI, GAME_MODES } from '@/lib/gameLogic';
import { createBoardForMode, getAvailableMovesForMode, getModeExplanation } from '../lib/boardSetups';
import { soundManager } from '../utils/sounds';
import TeaCup from './TeaCup';
import Shisha from './Shisha';
import GameRulesDisplay from './GameRulesDisplay';
import MoveHighlighter from './MoveHighlighter';

const DiceIcon = ({ value }) => {
  const icons = { 1: Dice1, 2: Dice2, 3: Dice3, 4: Dice4, 5: Dice5, 6: Dice6 };
  const Icon = icons[value] || Dice1;
  return <Icon className="w-8 h-8" />;
};

const GamePiece = ({ color, position, onClick, isSelected, isHighlighted }) => (
  <motion.div
    className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
      color === 'white' 
        ? 'bg-gradient-to-br from-amber-50 to-amber-200 border-amber-400 shadow-amber-300' 
        : 'bg-gradient-to-br from-red-700 to-red-900 border-red-800 shadow-red-600'
    } ${isSelected ? 'ring-2 ring-blue-400' : ''} ${isHighlighted ? 'ring-2 ring-green-400' : ''} shadow-lg`}
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    style={{
      marginBottom: position === 0 ? '0px' : '2px',
      zIndex: position + 1
    }}
  />
);

const BoardPoint = ({ point, index, onPointClick, selectedPoint, highlightedMoves }) => {
  const isTop = index >= 12;
  const isSelected = selectedPoint === index;
  const isHighlighted = highlightedMoves.some(move => move.to === index);
  const hasNoPieces = !point.pieces || point.pieces.length === 0;
  
  return (
    <div 
      className={`relative flex flex-col items-center justify-start h-48 w-12 cursor-pointer
        ${isTop ? 'rotate-180' : ''} 
        ${index % 2 === 0 ? 'bg-amber-700' : 'bg-amber-900'}
        ${isSelected ? 'ring-2 ring-blue-400' : ''}
        ${isHighlighted ? 'ring-2 ring-green-400' : ''}
        transition-all duration-200 hover:brightness-110`}
      onClick={() => onPointClick(index)}
      style={{
        clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)'
      }}
    >
      <div className={`absolute ${isTop ? 'bottom-2' : 'top-2'} text-xs text-amber-100 font-bold z-10`}>
        {index + 1}
      </div>
      <div className={`relative ${isTop ? 'mb-6' : 'mt-6'} flex flex-col items-center`}>
        {!hasNoPieces && point.pieces.map((piece, pieceIndex) => (
          <GamePiece
            key={`${index}-${pieceIndex}`}
            color={piece}
            position={pieceIndex}
            onClick={(e) => {
              e.stopPropagation();
              onPointClick(index);
            }}
            isSelected={isSelected}
            isHighlighted={isHighlighted}
          />
        ))}
      </div>
      
      {/* عرض الحركات المتاحة */}
      {isHighlighted && (
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-green-400 rounded-full opacity-50"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </div>
  );
};

const EnhancedGameBoard = ({ gameMode, onBackToMenu, playerMode = { playerMode: 'human' } }) => {
  const boardLayout = playerMode.boardLayout || { 
    key: 'classic', 
    data: { 
      colors: { 
        primary: '#8B4513', 
        secondary: '#A0522D', 
        accent: '#D2691E', 
        background: 'from-amber-800 to-amber-900' 
      } 
    } 
  };
  const [game] = useState(() => new BackgammonGame());
  const [gameState, setGameState] = useState(game.getGameState());
  const [ai] = useState(() => new AdvancedAI());
  const [isThinking, setIsThinking] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [availableMoves, setAvailableMoves] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showRules, setShowRules] = useState(true);
  const [board, setBoard] = useState([]);

  // تهيئة نظام التحكم بالريموت للتلفزيون
  useEffect(() => {
    if (window.tvRemoteControl) {
      window.tvRemoteControl.enable();
      window.tvRemoteControl.updateFocusableElements();
    }
    
    return () => {
      if (window.tvRemoteControl) {
        window.tvRemoteControl.disable();
      }
    };
  }, []);

  // تهيئة اللوحة حسب نمط اللعب
  useEffect(() => {
    if (gameMode) {
      const newBoard = createBoardForMode(gameMode);
      setBoard(newBoard);
      // تحديث حالة اللعبة
      game.initializeBoard(newBoard);
      setGameState(game.getGameState());
    }
  }, [gameMode]);

  // تشغيل الذكاء الاصطناعي
  useEffect(() => {
    if (playerMode.playerMode === 'ai' && gameState.currentPlayer === 'black' && gameState.phase === 'playing') {
      setIsThinking(true);
      const thinkingTime = playerMode.thinkingTime || 1000;
      const timer = setTimeout(() => {
        handleAIMove();
        setIsThinking(false);
      }, thinkingTime);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.phase, playerMode]);

  const handleAIMove = () => {
    try {
      // تعديل مستوى الذكاء الاصطناعي حسب الصعوبة
      ai.setDifficulty(playerMode.aiDifficulty || 'medium');
      const bestMove = ai.getBestMove(gameState, gameMode);
      if (bestMove) {
        makeMove(bestMove.from, bestMove.to);
      }
    } catch (error) {
      console.error('AI move error:', error);
    }
  };

  const handleRollDice = () => {
    if (gameState.diceRolled && gameState.availableMoves.length > 0) return;
    
    if (soundEnabled) {
      soundManager.playSound('diceRoll');
    }
    
    game.rollDice();
    setGameState(game.getGameState());
    setSelectedPiece(null);
    setAvailableMoves([]);
  };

  const handlePointClick = (pointIndex) => {
    const point = board[pointIndex];
    const currentPlayer = gameState.currentPlayer;
    
    // إذا كانت النقطة تحتوي على قطع اللاعب الحالي
    if (point && point[currentPlayer] > 0) {
      setSelectedPiece(pointIndex);
      
      // الحصول على الحركات المتاحة
      const moves = getAvailableMovesForMode(
        gameMode, 
        pointIndex, 
        gameState.dice, 
        board, 
        currentPlayer
      );
      setAvailableMoves(moves);
      
      if (soundEnabled) {
        soundManager.playSound('pieceDrag');
      }
    }
    // إذا كانت النقطة هدف للحركة
    else if (selectedPiece !== null) {
      const move = availableMoves.find(m => m.to === pointIndex);
      if (move) {
        makeMove(selectedPiece, pointIndex);
      }
    }
  };

  const makeMove = (from, to) => {
    try {
      const success = game.makeMove(from, to);
      if (success) {
        if (soundEnabled) {
          soundManager.playSound('piecePlace');
        }
        
        setBoard(game.getBoard());
        setGameState(game.getGameState());
        setSelectedPiece(null);
        setAvailableMoves([]);
      }
    } catch (error) {
      console.error('Move error:', error);
    }
  };

  const handleMoveSelect = (move) => {
    makeMove(move.from, move.to);
  };

  const toggleSound = () => {
    const newState = soundManager.toggleSound();
    setSoundEnabled(newState);
  };

  const resetGame = () => {
    game.reset();
    const newBoard = createBoardForMode(gameMode);
    setBoard(newBoard);
    game.initializeBoard(newBoard);
    setGameState(game.getGameState());
    setSelectedPiece(null);
    setAvailableMoves([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-red-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* شريط التحكم العلوي */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={onBackToMenu}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للقائمة
          </Button>
          
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-amber-900">
              {GAME_MODES[gameMode]?.name || 'لعبة الطاولة'}
            </h1>
            <Badge variant="secondary">
              {GAME_MODES[gameMode]?.difficulty || 'متوسطة'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleSound}
              variant="outline"
              size="sm"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              onClick={resetGame}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* منطقة اللعب الرئيسية */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* اللوحة الرئيسية */}
          <div className="lg:col-span-3">
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                {/* كؤوس الشاي */}
                <TeaCup position="left" onClick={() => soundEnabled && soundManager.playSound('teaCup')} />
                <TeaCup position="right" onClick={() => soundEnabled && soundManager.playSound('teaCup')} />
                
                {/* الشيشة */}
                <Shisha position="center" onClick={() => soundEnabled && soundManager.playSound('shishaBubble')} />
                
                {/* اللوحة */}
                <div 
                  className={`bg-gradient-to-br ${boardLayout.data.colors.background} rounded-lg p-4 shadow-2xl relative border-2`}
                  style={{ borderColor: boardLayout.data.colors.accent }}
                >
                  {/* النصف العلوي */}
                  <div className="grid grid-cols-12 gap-1 mb-4">
                    {Array.from({ length: 12 }, (_, i) => {
                      const pointIndex = i + 13;
                      return (
                        <BoardPoint
                          key={pointIndex}
                          point={board[pointIndex]}
                          index={pointIndex}
                          onPointClick={handlePointClick}
                          selectedPoint={selectedPiece}
                          highlightedMoves={availableMoves}
                        />
                      );
                    })}
                  </div>
                  
                  {/* الوسط - منطقة النرد والنقاط */}
                  <div 
                    className="flex justify-center items-center py-4 rounded-lg mb-4"
                    style={{ backgroundColor: boardLayout.data.colors.primary }}
                  >
                    <div className="flex items-center gap-8">
                      {/* نقاط اللاعب الأبيض */}
                      <div className="text-center">
                        <div className="text-white font-bold">اللاعب الأبيض</div>
                        <div className="text-2xl font-bold text-amber-100">
                          {gameState.scores?.white || 0}
                        </div>
                      </div>
                      
                      {/* النرد */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-2">
                          {gameState.dice.map((die, index) => (
                            <motion.div
                              key={index}
                              className="bg-white rounded-lg p-2 shadow-lg"
                              whileHover={{ scale: 1.1 }}
                              animate={gameState.diceRolled ? {} : { rotate: [0, 360] }}
                              transition={{ duration: 0.5 }}
                            >
                              <DiceIcon value={die} />
                            </motion.div>
                          ))}
                        </div>
                        
                        <Button
                          onClick={handleRollDice}
                          disabled={gameState.diceRolled && gameState.availableMoves.length > 0}
                          className="bg-amber-500 hover:bg-amber-600"
                        >
                          {gameState.diceRolled ? 'تم الرمي' : 'ارمي النرد'}
                        </Button>
                      </div>
                      
                      {/* نقاط اللاعب الأسود */}
                      <div className="text-center">
                        <div className="text-white font-bold">اللاعب الأسود</div>
                        <div className="text-2xl font-bold text-amber-100">
                          {gameState.scores?.black || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* النصف السفلي */}
                  <div className="grid grid-cols-12 gap-1">
                    {Array.from({ length: 12 }, (_, i) => {
                      const pointIndex = 12 - i;
                      return (
                        <BoardPoint
                          key={pointIndex}
                          point={board[pointIndex]}
                          index={pointIndex}
                          onPointClick={handlePointClick}
                          selectedPoint={selectedPiece}
                          highlightedMoves={availableMoves}
                        />
                      );
                    })}
                  </div>
                </div>
                
                {/* عرض الحركات المتاحة */}
                <MoveHighlighter
                  availableMoves={availableMoves}
                  onMoveSelect={handleMoveSelect}
                  selectedPiece={selectedPiece}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* اللوحة الجانبية */}
          <div className="space-y-4">
            {/* معلومات اللعبة */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  حالة اللعبة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>اللاعب الحالي:</span>
                    <Badge variant={gameState.currentPlayer === 'white' ? 'default' : 'destructive'}>
                      {gameState.currentPlayer === 'white' ? 'أبيض' : 'أسود'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>نوع اللعب:</span>
                    <span className="font-medium">
                      {playerMode.playerMode === 'ai' ? 'ضد الكمبيوتر' : 'لاعب ضد لاعب'}
                    </span>
                  </div>
                  {playerMode.playerMode === 'ai' && (
                    <>
                      <div className="flex justify-between">
                        <span>مستوى الصعوبة:</span>
                        <Badge variant="secondary">
                          {playerMode.aiDifficulty === 'easy' ? 'سهل' :
                           playerMode.aiDifficulty === 'medium' ? 'متوسط' :
                           playerMode.aiDifficulty === 'hard' ? 'صعب' : 'خبير'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>سرعة الاستجابة:</span>
                        <span className="text-sm">
                          {playerMode.aiSpeed === 'instant' ? 'فوري' :
                           playerMode.aiSpeed === 'fast' ? 'سريع' :
                           playerMode.aiSpeed === 'normal' ? 'عادي' : 'بطيء'}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span>تخطيط اللوحة:</span>
                    <span className="text-sm font-medium">
                      {boardLayout.data.name || 'الكلاسيكي'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>المرحلة:</span>
                    <span className="font-medium">
                      {gameState.phase === 'setup' ? 'إعداد' : 
                       gameState.phase === 'playing' ? 'لعب' : 'انتهت'}
                    </span>
                  </div>
                  {isThinking && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Timer className="w-4 h-4 animate-spin" />
                      <span>الذكاء الاصطناعي يفكر...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* إحصائيات */}
            <Card>
              <CardHeader>
                <CardTitle>الإحصائيات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>الحركات المتاحة:</span>
                    <span>{availableMoves.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>القطعة المختارة:</span>
                    <span>{selectedPiece !== null ? `النقطة ${selectedPiece}` : 'لا يوجد'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* شرح القوانين */}
        <GameRulesDisplay 
          selectedMode={gameMode} 
          isVisible={showRules}
        />
      </div>
    </div>
  );
};

export default EnhancedGameBoard;
