// منطق لعبة الطاولة الأساسي
export class BackgammonGame {
  constructor() {
    this.board = this.initializeBoard();
    this.currentPlayer = 'white'; // 'white' أو 'black'
    this.dice = [0, 0];
    this.gameMode = 'classic'; // classic, fevga, plakoto, etc.
    this.score = { white: 0, black: 0 };
    this.moves = { white: 0, black: 0 };
    this.gameState = 'setup'; // setup, playing, finished
    this.winner = null;
    this.moveHistory = [];
    this.availableMoves = [];
  }

  // تهيئة اللوحة بالوضع الابتدائي للطاولة الكلاسيكية
  initializeBoard() {
    const board = Array(24).fill(null).map(() => ({ pieces: [], player: null }));
    
    // الوضع الابتدائي للطاولة الكلاسيكية
    // اللاعب الأبيض
    board[0] = { pieces: Array(2).fill('white'), player: 'white' };
    board[11] = { pieces: Array(5).fill('white'), player: 'white' };
    board[16] = { pieces: Array(3).fill('white'), player: 'white' };
    board[18] = { pieces: Array(5).fill('white'), player: 'white' };
    
    // اللاعب الأسود (الأحمر في التصميم)
    board[23] = { pieces: Array(2).fill('black'), player: 'black' };
    board[12] = { pieces: Array(5).fill('black'), player: 'black' };
    board[7] = { pieces: Array(3).fill('black'), player: 'black' };
    board[5] = { pieces: Array(5).fill('black'), player: 'black' };
    
    return board;
  }

  // رمي النرد
  rollDice() {
    this.dice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];
    
    // إذا كان الرقمان متشابهين، يمكن اللعب أربع مرات
    if (this.dice[0] === this.dice[1]) {
      this.availableMoves = [this.dice[0], this.dice[0], this.dice[0], this.dice[0]];
    } else {
      this.availableMoves = [...this.dice];
    }
    
    return this.dice;
  }

  // التحقق من صحة الحركة
  isValidMove(from, to, player = this.currentPlayer) {
    // التحقق من الحدود
    if (from < 0 || from > 23 || to < 0 || to > 23) return false;
    
    // التحقق من وجود قطعة للاعب في المكان المحدد
    if (!this.board[from].pieces.length || this.board[from].player !== player) return false;
    
    // التحقق من اتجاه الحركة
    const direction = player === 'white' ? 1 : -1;
    const distance = (to - from) * direction;
    
    if (distance <= 0) return false;
    
    // التحقق من توفر الحركة في النرد
    if (!this.availableMoves.includes(distance)) return false;
    
    // التحقق من إمكانية الوقوف في المكان المقصود
    const targetPoint = this.board[to];
    if (targetPoint.pieces.length > 1 && targetPoint.player !== player) return false;
    
    return true;
  }

  // تنفيذ الحركة
  makeMove(from, to) {
    if (!this.isValidMove(from, to)) return false;
    
    const distance = Math.abs(to - from);
    const piece = this.board[from].pieces.pop();
    
    // إذا كان المكان المقصود يحتوي على قطعة واحدة للخصم، يتم ضربها
    if (this.board[to].pieces.length === 1 && this.board[to].player !== this.currentPlayer) {
      // ضرب القطعة (في الطاولة الكلاسيكية)
      this.board[to].pieces = [];
      this.board[to].player = null;
    }
    
    // وضع القطعة في المكان الجديد
    this.board[to].pieces.push(piece);
    this.board[to].player = this.currentPlayer;
    
    // تحديث المكان السابق
    if (this.board[from].pieces.length === 0) {
      this.board[from].player = null;
    }
    
    // إزالة الحركة المستخدمة
    const moveIndex = this.availableMoves.indexOf(distance);
    this.availableMoves.splice(moveIndex, 1);
    
    // تسجيل الحركة
    this.moveHistory.push({ from, to, player: this.currentPlayer, dice: [...this.dice] });
    this.moves[this.currentPlayer]++;
    
    return true;
  }

  // التحقق من انتهاء الدور
  isTurnComplete() {
    return this.availableMoves.length === 0 || !this.hasValidMoves();
  }

  // التحقق من وجود حركات صالحة
  hasValidMoves() {
    for (let from = 0; from < 24; from++) {
      if (this.board[from].player === this.currentPlayer) {
        for (const move of this.availableMoves) {
          const to = this.currentPlayer === 'white' ? from + move : from - move;
          if (this.isValidMove(from, to)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // تبديل اللاعب
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    this.availableMoves = [];
  }

  // التحقق من الفوز
  checkWin() {
    const whitePieces = this.countPlayerPieces('white');
    const blackPieces = this.countPlayerPieces('black');
    
    if (whitePieces === 0) {
      this.winner = 'white';
      this.gameState = 'finished';
      return 'white';
    } else if (blackPieces === 0) {
      this.winner = 'black';
      this.gameState = 'finished';
      return 'black';
    }
    
    return null;
  }

  // عد قطع اللاعب
  countPlayerPieces(player) {
    let count = 0;
    for (const point of this.board) {
      if (point.player === player) {
        count += point.pieces.length;
      }
    }
    return count;
  }

  // الحصول على حالة اللعبة
  getGameState() {
    return {
      board: this.board,
      currentPlayer: this.currentPlayer,
      dice: this.dice,
      availableMoves: this.availableMoves,
      score: this.score,
      moves: this.moves,
      gameState: this.gameState,
      winner: this.winner,
      gameMode: this.gameMode
    };
  }

  // إعادة تعيين اللعبة
  resetGame() {
    this.board = this.initializeBoard();
    this.currentPlayer = 'white';
    this.dice = [0, 0];
    this.score = { white: 0, black: 0 };
    this.moves = { white: 0, black: 0 };
    this.gameState = 'setup';
    this.winner = null;
    this.moveHistory = [];
    this.availableMoves = [];
  }
}

// أنماط اللعب المختلفة - الأنماط العربية الأصيلة
export const GAME_MODES = {
  aada: {
    name: 'العادة (الكلاسيكية)',
    nameEn: 'Aada (Classic Backgammon)', 
    description: 'النمط الأكثر انتشاراً في العالم، مع إمكانية ضرب القطع وحبسها',
    difficulty: 'متوسطة',
    duration: '15-30 دقيقة',
    rules: [
      'كل لاعب لديه 15 قطعة في الترتيب التقليدي',
      'الهدف هو إخراج جميع القطع من اللوحة قبل الخصم', 
      'يمكن ضرب قطع الخصم المنفردة وإرسالها للبداية',
      'لا يمكن الهبوط على نقطة بها قطعتان أو أكثر للخصم',
      'الفوز بنقطة واحدة، أو نقطتان إذا لم يخرج الخصم أي قطعة'
    ]
  },
  mahbousa: {
    name: 'المحبوسة',
    nameEn: 'Mahbousa (Trapped)',
    description: 'لعبة الحبس والتحرير، حيث تبدأ جميع القطع مكدسة في نقطة واحدة',
    difficulty: 'صعبة',
    duration: '20-40 دقيقة',
    rules: [
      'جميع القطع تبدأ مكدسة في النقطة الأولى (الأبعد عن الهدف)',
      'يمكن حبس قطع الخصم بوضع قطعة أمامها',
      'كلما زاد عدد القطع فوق المحبوسة، صعب تحريرها',
      'الاستراتيجية الرئيسية: حبس قطع الخصم في منطقة البداية',
      'نفس نظام النقاط كالعادة (3 نقاط للفوز بالمجموعة)'
    ]
  },
  thirtyone: {
    name: 'الواحد والثلاثون',
    nameEn: '31 (Thirty-One)',
    description: 'لعبة النقاط التراكمية بدون ضرب أو حبس القطع',
    difficulty: 'متوسطة',
    duration: '10-25 دقيقة',
    rules: [
      'نفس الترتيب الابتدائي للمحبوسة (جميع القطع في نقطة واحدة)',
      'لا يمكن ضرب أو حبس قطع الخصم نهائياً',
      'لا يمكن الهبوط على نقطة بها قطع للخصم',
      'الفائز يحصل على نقاط بعدد القطع المتبقية للخصم',
      'الفوز بالمجموعة عند الوصول لـ 31 نقطة'
    ]
  },
  gulbehar: {
    name: 'الجلبهار',
    nameEn: 'Gulbehar (Diagonal)',
    description: 'اللعبة القطرية مع قانون الدبل المتقدم',
    difficulty: 'صعبة',
    duration: '25-45 دقيقة',
    rules: [
      'اللاعبان يبدآن في زوايا قطرية متقابلة',
      'لا يمكن ضرب أو حبس قطع الخصم',
      'عند رمي دبل: يجب لعب الرقم 4 مرات، ثم الأعلى 4 مرات حتى الـ6',
      'إذا لم يستطع اللاعب إكمال التسلسل، ينتقل الدور للخصم',
      'نفس نظام النقاط كالعادة (3 نقاط للفوز)'
    ]
  },
  basita: {
    name: 'البسيطة',
    nameEn: 'Al-Basita (Simple)',
    description: 'لعبة الأطفال والمبتدئين باستخدام نصف اللوحة فقط',
    difficulty: 'سهلة',
    duration: '5-10 دقائق',
    rules: [
      'استخدام نصف اللوحة فقط مع النقاط مرقمة من 1 إلى 6',
      'قطعتان في النقاط 1-3، وثلاث قطع في النقاط 4-6',
      'الهدف: تسطيح جميع القطع ثم إخراجها',
      'عند رمي رقم، يتم تسطيح قطعة من النقطة المقابلة',
      'الفائز من يخرج جميع قطعه أولاً'
    ]
  },
  longGammon: {
    name: 'الطاولة الطويلة',
    nameEn: 'Long Gammon (Russian)', 
    description: 'النمط الروسي/الأوروبي بدون ضرب القطع مع التركيز على السرعة',
    difficulty: 'متوسطة',
    duration: '15-30 دقيقة',
    rules: [
      'نفس الترتيب الابتدائي للعادة',
      'لا يمكن ضرب قطع الخصم نهائياً',
      'التركيز على السرعة والتقدم',
      'استراتيجية مختلفة تماماً عن الأنماط الأخرى',
      'الفوز للأسرع في إخراج جميع القطع'
    ]
  },
  nackgammon: {
    name: 'ناك جامون',
    nameEn: 'Nackgammon',
    description: 'النمط الأمريكي المحسن مع ترتيب ابتدائي أكثر تعقيداً',
    difficulty: 'صعبة',
    duration: '20-35 دقيقة',
    rules: [
      'ترتيب ابتدائي مختلف يجعل اللعبة أكثر تحدياً',
      'نفس قوانين العادة لكن مع بداية معقدة أكثر',
      'المزيد من التحدي والإثارة',
      'يتطلب استراتيجيات متقدمة',
      'مفضل لدى اللاعبين المحترفين'
    ]
  },
  hypergammon: {
    name: 'هايبر جامون', 
    nameEn: 'Hypergammon',
    description: 'اللعبة السريعة مع عدد قطع محدود للألعاب القصيرة',
    difficulty: 'سهلة',
    duration: '5-15 دقيقة',
    rules: [
      '3 قطع فقط لكل لاعب',
      'ألعاب سريعة تستغرق 5-15 دقيقة',
      'مثالية للمبتدئين والألعاب السريعة',
      'نفس قوانين الحركة الأساسية للعادة',
      'تركيز أكبر على الحظ من الاستراتيجية'
    ]
  }
};

// الذكاء الاصطناعي المحسن
export class AdvancedAI {
  constructor(difficulty = 'hard') {
    this.difficulty = difficulty; // easy, medium, hard
    this.evaluationDepth = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 4;
  }

  // اختيار أفضل حركة باستخدام MiniMax
  getBestMove(game) {
    const possibleMoves = this.getAllPossibleMoves(game);
    if (possibleMoves.length === 0) return null;

    if (this.difficulty === 'easy') {
      return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }

    let bestMove = null;
    let bestValue = -Infinity;

    for (const move of possibleMoves) {
      const newGame = this.simulateMove(game, move);
      const moveValue = this.minimax(newGame, this.evaluationDepth - 1, false, -Infinity, Infinity);
      
      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = move;
      }
    }

    return bestMove;
  }

  // خوارزمية MiniMax مع Alpha-Beta Pruning
  minimax(game, depth, isMaximizingPlayer, alpha, beta) {
    if (depth === 0 || game.winner) {
      return this.evaluateBoard(game);
    }

    const possibleMoves = this.getAllPossibleMoves(game);

    if (isMaximizingPlayer) {
      let maxEval = -Infinity;
      for (const move of possibleMoves) {
        const newGame = this.simulateMove(game, move);
        const evaluation = this.minimax(newGame, depth - 1, false, alpha, beta);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of possibleMoves) {
        const newGame = this.simulateMove(game, move);
        const evaluation = this.minimax(newGame, depth - 1, true, alpha, beta);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  // محاكاة الحركة
  simulateMove(game, move) {
    const newGame = new BackgammonGame();
    Object.assign(newGame, JSON.parse(JSON.stringify(game)));
    newGame.makeMove(move.from, move.to);
    if (newGame.isTurnComplete()) {
      newGame.switchPlayer();
    }
    return newGame;
  }

  // الحصول على جميع الحركات الممكنة
  getAllPossibleMoves(game) {
    const moves = [];
    const player = game.currentPlayer;

    for (let from = 0; from < 24; from++) {
      if (game.board[from].player === player) {
        for (const moveDistance of game.availableMoves) {
          const to = player === 'white' ? from + moveDistance : from - moveDistance;
          if (game.isValidMove(from, to, player)) {
            moves.push({ from, to });
          }
        }
      }
    }

    return moves;
  }

  // تقييم شامل للوحة
  evaluateBoard(game) {
    let score = 0;
    const aiPlayer = 'black';
    const humanPlayer = 'white';

    // 1. فارق القطع (Pip Count)
    score += this.calculatePipCount(game, humanPlayer) - this.calculatePipCount(game, aiPlayer);

    // 2. تقييم أمان القطع
    score += this.evaluateSafety(game, aiPlayer) * 10;
    score -= this.evaluateSafety(game, humanPlayer) * 10;

    // 3. تقييم النقاط المحجوزة (Blocks)
    score += this.countBlocks(game, aiPlayer) * 5;
    score -= this.countBlocks(game, humanPlayer) * 5;

    // 4. تقييم النقاط القوية (Anchors)
    score += this.countAnchors(game, aiPlayer) * 8;
    score -= this.countAnchors(game, humanPlayer) * 8;

    // 5. تقييم حالة الفوز
    if (game.winner === aiPlayer) score += 10000;
    if (game.winner === humanPlayer) score -= 10000;

    return score;
  }

  // حساب فارق القطع
  calculatePipCount(game, player) {
    let count = 0;
    for (let i = 0; i < 24; i++) {
      if (game.board[i].player === player) {
        const distance = player === 'white' ? 24 - i : i + 1;
        count += game.board[i].pieces.length * distance;
      }
    }
    return count;
  }

  // تقييم أمان القطع
  evaluateSafety(game, player) {
    let safePieces = 0;
    for (let i = 0; i < 24; i++) {
      if (game.board[i].player === player && game.board[i].pieces.length > 1) {
        safePieces += game.board[i].pieces.length;
      }
    }
    return safePieces;
  }

  // عد النقاط المحجوزة
  countBlocks(game, player) {
    let blocks = 0;
    for (let i = 0; i < 24; i++) {
      if (game.board[i].player === player && game.board[i].pieces.length > 1) {
        blocks++;
      }
    }
    return blocks;
  }

  // عد النقاط القوية
  countAnchors(game, player) {
    let anchors = 0;
    const opponentHomeStart = player === 'white' ? 18 : 0;
    const opponentHomeEnd = player === 'white' ? 23 : 5;
    for (let i = opponentHomeStart; i <= opponentHomeEnd; i++) {
      if (game.board[i].player === player && game.board[i].pieces.length > 1) {
        anchors++;
      }
    }
    return anchors;
  }
}
