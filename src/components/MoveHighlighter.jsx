import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MoveHighlighter = ({ availableMoves, onMoveSelect, selectedPiece }) => {
  if (!selectedPiece || !availableMoves || availableMoves.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {availableMoves.map((move, index) => (
        <motion.div
          key={`${move.from}-${move.to}-${move.diceValue}`}
          className="absolute pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ delay: index * 0.05 }}
          style={{
            left: getPointPosition(move.to).x,
            top: getPointPosition(move.to).y,
            zIndex: 1000
          }}
        >
          {/* دائرة الحركة المتاحة */}
          <motion.div
            className={`w-8 h-8 rounded-full border-3 cursor-pointer ${
              move.isCapture 
                ? 'bg-red-400 border-red-600 shadow-red-300' 
                : move.isBearOff
                ? 'bg-green-400 border-green-600 shadow-green-300'
                : 'bg-blue-400 border-blue-600 shadow-blue-300'
            } shadow-lg flex items-center justify-center pointer-events-auto`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(59, 130, 246, 0.7)',
                '0 0 0 10px rgba(59, 130, 246, 0)',
                '0 0 0 0 rgba(59, 130, 246, 0)'
              ]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            onClick={() => onMoveSelect(move)}
          >
            {/* رقم النرد */}
            <span className="text-white font-bold text-xs">
              {move.diceValue}
            </span>
          </motion.div>

          {/* أيقونة نوع الحركة */}
          <motion.div
            className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-xs"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            {move.isCapture && (
              <span className="text-red-600">⚔️</span>
            )}
            {move.isBearOff && (
              <span className="text-green-600">🏁</span>
            )}
            {!move.isCapture && !move.isBearOff && (
              <span className="text-blue-600">➡️</span>
            )}
          </motion.div>

          {/* خط الاتصال */}
          <motion.div
            className="absolute w-1 bg-blue-400 opacity-50"
            style={{
              height: getDistanceBetweenPoints(move.from, move.to),
              transformOrigin: 'top center',
              transform: `rotate(${getAngleBetweenPoints(move.from, move.to)}deg)`,
              left: '50%',
              top: '50%',
              marginLeft: '-2px'
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: index * 0.05 + 0.1 }}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

// دالة الحصول على موقع النقطة على الشاشة
function getPointPosition(pointIndex) {
  // هذه دالة مبسطة - يجب تعديلها حسب تصميم اللوحة الفعلي
  const boardWidth = 800;
  const boardHeight = 600;
  const pointWidth = boardWidth / 12;
  
  if (pointIndex === 'off') {
    return { x: boardWidth + 20, y: boardHeight / 2 };
  }
  
  let x, y;
  
  if (pointIndex >= 1 && pointIndex <= 6) {
    // النقاط السفلية اليمنى
    x = (6 - pointIndex) * pointWidth + pointWidth / 2;
    y = boardHeight - 50;
  } else if (pointIndex >= 7 && pointIndex <= 12) {
    // النقاط السفلية اليسرى
    x = (12 - pointIndex) * pointWidth + pointWidth / 2 + pointWidth * 6;
    y = boardHeight - 50;
  } else if (pointIndex >= 13 && pointIndex <= 18) {
    // النقاط العلوية اليسرى
    x = (pointIndex - 13) * pointWidth + pointWidth / 2 + pointWidth * 6;
    y = 50;
  } else if (pointIndex >= 19 && pointIndex <= 24) {
    // النقاط العلوية اليمنى
    x = (pointIndex - 19) * pointWidth + pointWidth / 2;
    y = 50;
  }
  
  return { x: x || 0, y: y || 0 };
}

// دالة حساب المسافة بين نقطتين
function getDistanceBetweenPoints(from, to) {
  const fromPos = getPointPosition(from);
  const toPos = getPointPosition(to);
  
  return Math.sqrt(
    Math.pow(toPos.x - fromPos.x, 2) + Math.pow(toPos.y - fromPos.y, 2)
  );
}

// دالة حساب الزاوية بين نقطتين
function getAngleBetweenPoints(from, to) {
  const fromPos = getPointPosition(from);
  const toPos = getPointPosition(to);
  
  return Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x) * 180 / Math.PI + 90;
}

export default MoveHighlighter;
