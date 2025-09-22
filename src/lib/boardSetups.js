// إعدادات توزيع القطع لكل نمط لعب
export const BOARD_SETUPS = {
  // العادة (الكلاسيكية) - الترتيب التقليدي
  aada: {
    white: {
      24: 2, 13: 5, 8: 3, 6: 5
    },
    black: {
      1: 2, 12: 5, 17: 3, 19: 5
    }
  },

  // المحبوسة - جميع القطع في نقطة واحدة
  mahbousa: {
    white: {
      1: 15  // جميع القطع البيضاء في النقطة 1
    },
    black: {
      24: 15  // جميع القطع السوداء في النقطة 24
    }
  },

  // الواحد والثلاثون - نفس المحبوسة
  thirtyone: {
    white: {
      1: 15
    },
    black: {
      24: 15
    }
  },

  // الجلبهار - ترتيب قطري
  gulbehar: {
    white: {
      1: 15  // البداية في الزاوية
    },
    black: {
      13: 15  // البداية في الزاوية المقابلة قطرياً
    }
  },

  // البسيطة - نصف اللوحة فقط
  basita: {
    white: {
      1: 2, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3
    },
    black: {
      7: 2, 8: 2, 9: 2, 10: 3, 11: 3, 12: 3
    }
  },

  // الطاولة الطويلة - نفس العادة
  longGammon: {
    white: {
      24: 2, 13: 5, 8: 3, 6: 5
    },
    black: {
      1: 2, 12: 5, 17: 3, 19: 5
    }
  },

  // ناك جامون - ترتيب معدل
  nackgammon: {
    white: {
      24: 2, 23: 2, 13: 4, 8: 3, 6: 4
    },
    black: {
      1: 2, 2: 2, 12: 4, 17: 3, 19: 4
    }
  },

  // هايبر جامون - 3 قطع فقط
  hypergammon: {
    white: {
      24: 1, 23: 1, 22: 1
    },
    black: {
      1: 1, 2: 1, 3: 1
    }
  }
};

// دالة إنشاء اللوحة حسب النمط
export function createBoardForMode(mode) {
  const board = Array(25).fill(null).map(() => ({ white: 0, black: 0 }));
  const setup = BOARD_SETUPS[mode];
  
  if (!setup) {
    console.warn(`No setup found for mode: ${mode}`);
    return board;
  }

  // توزيع القطع البيضاء
  Object.entries(setup.white).forEach(([point, count]) => {
    board[parseInt(point)].white = count;
  });

  // توزيع القطع السوداء
  Object.entries(setup.black).forEach(([point, count]) => {
    board[parseInt(point)].black = count;
  });

  return board;
}

// دالة التحقق من صحة الحركة حسب النمط
export function isValidMoveForMode(mode, from, to, board, player) {
  const setup = BOARD_SETUPS[mode];
  
  switch (mode) {
    case 'aada':
    case 'longGammon':
    case 'nackgammon':
    case 'hypergammon':
      return isValidClassicMove(from, to, board, player);
      
    case 'mahbousa':
      return isValidMahbousaMove(from, to, board, player);
      
    case 'thirtyone':
      return isValidThirtyOneMove(from, to, board, player);
      
    case 'gulbehar':
      return isValidGulbeharMove(from, to, board, player);
      
    case 'basita':
      return isValidBasitaMove(from, to, board, player);
      
    default:
      return isValidClassicMove(from, to, board, player);
  }
}

// قوانين العادة الكلاسيكية
function isValidClassicMove(from, to, board, player) {
  // لا يمكن الهبوط على نقطة بها قطعتان أو أكثر للخصم
  const opponent = player === 'white' ? 'black' : 'white';
  return board[to][opponent] <= 1;
}

// قوانين المحبوسة
function isValidMahbousaMove(from, to, board, player) {
  const opponent = player === 'white' ? 'black' : 'white';
  
  // يمكن حبس قطع الخصم
  if (board[to][opponent] === 1) {
    return true; // يمكن حبس القطعة المنفردة
  }
  
  // لا يمكن الهبوط على نقطة بها قطعتان أو أكثر للخصم
  return board[to][opponent] === 0;
}

// قوانين الواحد والثلاثون
function isValidThirtyOneMove(from, to, board, player) {
  const opponent = player === 'white' ? 'black' : 'white';
  
  // لا يمكن الهبوط على نقطة بها قطع للخصم نهائياً
  return board[to][opponent] === 0;
}

// قوانين الجلبهار
function isValidGulbeharMove(from, to, board, player) {
  // نفس قوانين الواحد والثلاثون
  return isValidThirtyOneMove(from, to, board, player);
}

// قوانين البسيطة
function isValidBasitaMove(from, to, board, player) {
  // في البسيطة، الحركة محدودة بنصف اللوحة
  const maxPoint = player === 'white' ? 6 : 12;
  const minPoint = player === 'white' ? 1 : 7;
  
  if (to > maxPoint || to < minPoint) {
    return false;
  }
  
  return isValidClassicMove(from, to, board, player);
}

// دالة الحصول على الحركات المتاحة
export function getAvailableMovesForMode(mode, from, diceValues, board, player) {
  const moves = [];
  
  diceValues.forEach(diceValue => {
    let to;
    
    // حساب النقطة المستهدفة حسب اتجاه اللاعب
    if (player === 'white') {
      to = from - diceValue;
    } else {
      to = from + diceValue;
    }
    
    // التحقق من صحة النقطة
    if (to >= 1 && to <= 24) {
      if (isValidMoveForMode(mode, from, to, board, player)) {
        moves.push({
          from,
          to,
          diceValue,
          isCapture: board[to][player === 'white' ? 'black' : 'white'] === 1
        });
      }
    }
    
    // التحقق من إمكانية الإخراج
    if (canBearOff(mode, player, board)) {
      if ((player === 'white' && to <= 0) || (player === 'black' && to >= 25)) {
        moves.push({
          from,
          to: 'off',
          diceValue,
          isBearOff: true
        });
      }
    }
  });
  
  return moves;
}

// دالة التحقق من إمكانية الإخراج
function canBearOff(mode, player, board) {
  const homeStart = player === 'white' ? 1 : 19;
  const homeEnd = player === 'white' ? 6 : 24;
  
  // التحقق من وجود جميع القطع في المنطقة الأخيرة
  for (let i = 1; i <= 24; i++) {
    if (board[i][player] > 0 && (i < homeStart || i > homeEnd)) {
      return false;
    }
  }
  
  return true;
}

// دالة الحصول على شرح النمط
export function getModeExplanation(mode) {
  const explanations = {
    aada: "في العادة، يمكن ضرب قطع الخصم المنفردة وإرسالها للبداية. لا يمكن الهبوط على نقطة بها قطعتان أو أكثر للخصم.",
    mahbousa: "في المحبوسة، يمكن حبس قطع الخصم بوضع قطعة أمامها. كلما زاد عدد القطع فوق المحبوسة، صعب تحريرها.",
    thirtyone: "في الواحد والثلاثون، لا يمكن ضرب أو حبس قطع الخصم. فقط القطع من نفس اللون يمكن أن تكون معاً.",
    gulbehar: "في الجلبهار، عند رمي دبل يجب لعب الرقم 4 مرات، ثم الأعلى 4 مرات حتى الـ6.",
    basita: "في البسيطة، استخدم نصف اللوحة فقط. سطح القطع أولاً ثم ابدأ الإخراج.",
    longGammon: "في الطاولة الطويلة، لا يمكن ضرب قطع الخصم. التركيز على السرعة والتقدم.",
    nackgammon: "ناك جامون له ترتيب ابتدائي مختلف يجعل اللعبة أكثر تحدياً وإثارة.",
    hypergammon: "هايبر جامون سريع مع 3 قطع فقط. كل حركة مهمة!"
  };
  
  return explanations[mode] || "نمط لعب كلاسيكي.";
}
