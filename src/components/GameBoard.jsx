import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Coffee, Crown, Timer, RotateCcw, Volume2, VolumeX } from 'lucide-react';
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

const GamePiece = ({ color, position, onClick, isSelected }) => (
  <motion.div
    className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
      color === 'white' 
        ? 'bg-gradient-to-br from-amber-50 to-amber-200 border-amber-400 shadow-amber-300' 
        : 'bg-gradient-to-br from-red-700 to-red-900 border-red-800 shadow-red-600'
    } ${isSelected ? 'ring-2 ring-blue-400' : ''} shadow-lg`}
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

const BoardPoint = ({ point, index, onPointClick, selectedPoint }) => {
  const isTop = index >= 12;
  const isSelected = selectedPoint === index;
  const hasNoPieces = !point.pieces || point.pieces.length === 0;
  
  return (
    <div 
      className={`relative flex flex-col items-center justify-start h-48 w-12 cursor-pointer
        ${isTop ? 'rotate-180' : ''} 
        ${index % 2 === 0 ? 'bg-amber-700' : 'bg-amber-900'}
        ${isSelected ? 'ring-2 ring-blue-400' : ''}
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
          />
        ))}
      </div>
    </div>
  );
};

const TeaGlass = ({ player }) => (
  <motion.div 
    className="flex flex-col items-center space-y-2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
  >
    <div className="relative">
      <div className="w-12 h-16 bg-gradient-to-b from-transparent via-red-600 to-red-800 rounded-b-full border-2 border-amber-300 shadow-lg">
        <div className="absolute top-2 left-1 right-1 h-2 bg-red-500 rounded-full opacity-80" />
      </div>
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-amber-300 rounded-full" />
    </div>
    <Coffee className="w-4 h-4 text-amber-600" />
    <span className="text-xs text-amber-700 font-medium">{player}</span>
  </motion.div>
);

const ShishaPipe = () => (
  <motion.div 
    className="flex flex-col items-center space-y-2"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.7 }}
  >
    <div className="relative">
      <div className="w-3 h-12 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full" />
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-amber-700 rounded-full border-2 border-amber-500" />
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-amber-800 rounded-full" />
    </div>
    <span className="text-xs text-amber-700 font-medium">خليل مامون</span>
  </motion.div>
);

export default function GameBoard({ onClose, gameMode = 'classic', playerMode = 'ai' }) {
  const [game, setGame] = useState(new BackgammonGame());
  const [ai] = useState(new AdvancedAI('medium'));
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isAIGame, setIsAIGame] = useState(playerMode === 'ai');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMoveHint, setShowMoveHint] = useState(false);
  const [lastMove, setLastMove] = useState(null);

  useEffect(() => {
    if (isAIGame && game.currentPlayer === 'black' && game.gameState === 'playing') {
      const timer = setTimeout(() => {
        handleAIMove();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [game.currentPlayer, game.gameState, isAIGame]);

  const handleAIMove = () => {
    if (game.availableMoves.length === 0) {
      game.rollDice();
    }
    
    const bestMove = ai.getBestMove(game);
    if (bestMove) {
      game.makeMove(bestMove.from, bestMove.to);
    }
    
    if (game.isTurnComplete()) {
      game.switchPlayer();
    }
    
    setGame(new BackgammonGame(game));
  };

  const handleRollDice = () => {
    if (game.availableMoves.length > 0) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      game.rollDice();
      if (game.gameState === 'setup') {
        game.gameState = 'playing';
      }
      setGame(new BackgammonGame(game));
      setIsAnimating(false);
    }, 500);
  };

  const handlePointClick = (pointIndex) => {
    if (game.currentPlayer === 'black' && isAIGame) return;
    
    if (selectedPoint === null) {
      // اختيار نقطة البداية
      if (game.board[pointIndex].player === game.currentPlayer) {
        setSelectedPoint(pointIndex);
      }
    } else {
      // محاولة تنفيذ الحركة
      if (game.isValidMove(selectedPoint, pointIndex)) {
        game.makeMove(selectedPoint, pointIndex);
        
        if (game.isTurnComplete()) {
          game.switchPlayer();
        }
        
        setGame(new BackgammonGame(game));
      }
      setSelectedPoint(null);
    }
  };

  const handleNewGame = () => {
    const newGame = new BackgammonGame();
    newGame.gameMode = gameMode;
    setGame(newGame);
    setSelectedPoint(null);
  };

  const currentMode = GAME_MODES[gameMode];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            لعبة الطاولة الاحترافية
          </h1>
          <p className="text-amber-700">Professional Backgammon Game</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Board */}
          <div className="lg:col-span-3">
            <motion.div 
              className="relative bg-gradient-to-br from-amber-800 to-amber-900 rounded-2xl p-6 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Tea Glasses */}
              <div className="absolute -top-4 left-8">
                <TeaGlass player="اللاعب الأبيض" />
              </div>
              <div className="absolute -top-4 right-8">
                <TeaGlass player="اللاعب الأحمر" />
              </div>
              
              {/* Shisha Pipe */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <ShishaPipe />
              </div>

              {/* Board */}
              <div className="bg-amber-600 rounded-xl p-4 shadow-inner">
                <div className="grid grid-cols-12 gap-1 mb-4">
                  {/* Top row (points 12-23) */}
                  {game.board.slice(12, 24).map((point, index) => (
                    <BoardPoint
                      key={index + 12}
                      point={point}
                      index={index + 12}
                      onPointClick={handlePointClick}
                      selectedPoint={selectedPoint}
                    />
                  ))}
                </div>
                
                {/* Middle bar */}
                <div className="h-8 bg-amber-800 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-amber-200 font-bold text-sm">الوسط</div>
                </div>
                
                <div className="grid grid-cols-12 gap-1">
                  {/* Bottom row (points 0-11) */}
                  {game.board.slice(0, 12).map((point, index) => (
                    <BoardPoint
                      key={index}
                      point={point}
                      index={index}
                      onPointClick={handlePointClick}
                      selectedPoint={selectedPoint}
                    />
                  ))}
                </div>
              </div>

              {/* Dice Area */}
              <div className="flex justify-center mt-6 space-x-4">
                <AnimatePresence>
                  {game.dice[0] > 0 && (
                    <motion.div
                      className="bg-white rounded-lg p-3 shadow-lg"
                      initial={{ rotateX: 0, rotateY: 0 }}
                      animate={isAnimating ? { 
                        rotateX: [0, 360, 720, 1080],
                        rotateY: [0, 360, 720, 1080]
                      } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <DiceIcon value={game.dice[0]} />
                    </motion.div>
                  )}
                  {game.dice[1] > 0 && (
                    <motion.div
                      className="bg-white rounded-lg p-3 shadow-lg"
                      initial={{ rotateX: 0, rotateY: 0 }}
                      animate={isAnimating ? { 
                        rotateX: [0, -360, -720, -1080],
                        rotateY: [0, -360, -720, -1080]
                      } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <DiceIcon value={game.dice[1]} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Game Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5" />
                  <span>معلومات اللعبة</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>الدور الحالي:</span>
                  <Badge variant={game.currentPlayer === 'white' ? 'default' : 'destructive'}>
                    {game.currentPlayer === 'white' ? 'الأبيض' : 'الأحمر'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>نقاط الأبيض:</span>
                    <span className="font-bold">{game.score.white}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>نقاط الأحمر:</span>
                    <span className="font-bold">{game.score.black}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>حركات الأبيض:</span>
                    <span>{game.moves.white}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>حركات الأحمر:</span>
                    <span>{game.moves.black}</span>
                  </div>
                </div>

                {game.availableMoves.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground">الحركات المتاحة:</span>
                    <div className="flex space-x-1 mt-1">
                      {game.availableMoves.map((move, index) => (
                        <Badge key={index} variant="outline">{move}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Game Mode */}
            <Card>
              <CardHeader>
                <CardTitle>نمط اللعب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-semibold">{currentMode.name}</h4>
                  <p className="text-sm text-muted-foreground">{currentMode.description}</p>
                  <div className="space-y-1">
                    {currentMode.rules.map((rule, index) => (
                      <div key={index} className="text-xs text-muted-foreground">
                        • {rule}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle>التحكم</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={handleRollDice} 
                  disabled={game.availableMoves.length > 0 || isAnimating}
                  className="w-full"
                >
                  <Timer className="w-4 h-4 mr-2" />
                  رمي النرد
                </Button>
                
                <Button 
                  onClick={handleNewGame} 
                  variant="outline" 
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  لعبة جديدة
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
