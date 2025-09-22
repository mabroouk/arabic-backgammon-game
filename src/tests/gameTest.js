// اختبارات شاملة للعبة الطاولة
import { BackgammonGame, AdvancedAI } from '../lib/gameLogic.js';

class GameTester {
  constructor() {
    this.testResults = [];
  }

  // تشغيل جميع الاختبارات
  runAllTests() {
    console.log('🎯 بدء اختبارات لعبة الطاولة...\n');
    
    this.testGameInitialization();
    this.testDiceRolling();
    this.testPieceMovement();
    this.testValidMoves();
    this.testAIPerformance();
    this.testGameModes();
    this.testWinConditions();
    
    this.printResults();
  }

  // اختبار تهيئة اللعبة
  testGameInitialization() {
    console.log('📋 اختبار تهيئة اللعبة...');
    
    try {
      const game = new BackgammonGame();
      
      // التحقق من تهيئة اللوحة
      this.assert(game.board.length === 24, 'عدد النقاط في اللوحة صحيح');
      
      // التحقق من وضع القطع الابتدائي
      let whitePieces = 0;
      let blackPieces = 0;
      
      game.board.forEach(point => {
        if (point.player === 'white') whitePieces += point.pieces.length;
        if (point.player === 'black') blackPieces += point.pieces.length;
      });
      
      this.assert(whitePieces === 15, 'عدد القطع البيضاء صحيح');
      this.assert(blackPieces === 15, 'عدد القطع السوداء صحيح');
      this.assert(game.currentPlayer === 'white', 'اللاعب الأول صحيح');
      
      console.log('✅ تهيئة اللعبة نجحت\n');
    } catch (error) {
      console.log('❌ فشل في تهيئة اللعبة:', error.message);
    }
  }

  // اختبار رمي النرد
  testDiceRolling() {
    console.log('🎲 اختبار رمي النرد...');
    
    try {
      const game = new BackgammonGame();
      
      for (let i = 0; i < 100; i++) {
        const dice = game.rollDice();
        this.assert(dice.length === 2, 'عدد النرد صحيح');
        this.assert(dice[0] >= 1 && dice[0] <= 6, 'قيمة النرد الأول صحيحة');
        this.assert(dice[1] >= 1 && dice[1] <= 6, 'قيمة النرد الثاني صحيحة');
        
        // اختبار الدبل
        if (dice[0] === dice[1]) {
          this.assert(game.availableMoves.length === 4, 'حركات الدبل صحيحة');
        } else {
          this.assert(game.availableMoves.length === 2, 'عدد الحركات العادية صحيح');
        }
      }
      
      console.log('✅ رمي النرد يعمل بشكل صحيح\n');
    } catch (error) {
      console.log('❌ فشل في اختبار النرد:', error.message);
    }
  }

  // اختبار حركة القطع
  testPieceMovement() {
    console.log('♟️ اختبار حركة القطع...');
    
    try {
      const game = new BackgammonGame();
      game.rollDice();
      
      // اختبار حركة صحيحة
      const validMove = game.makeMove(0, game.availableMoves[0]);
      this.assert(validMove, 'الحركة الصحيحة تمت');
      
      // اختبار حركة غير صحيحة
      const invalidMove = game.makeMove(0, 10);
      this.assert(!invalidMove, 'الحركة غير الصحيحة رُفضت');
      
      console.log('✅ حركة القطع تعمل بشكل صحيح\n');
    } catch (error) {
      console.log('❌ فشل في اختبار حركة القطع:', error.message);
    }
  }

  // اختبار الحركات الصحيحة
  testValidMoves() {
    console.log('✅ اختبار صحة الحركات...');
    
    try {
      const game = new BackgammonGame();
      
      // اختبار حركة إلى نقطة فارغة
      this.assert(game.isValidMove(0, 3, 'white'), 'الحركة إلى نقطة فارغة صحيحة');
      
      // اختبار حركة إلى نقطة بها قطعة واحدة للخصم
      game.board[3] = { pieces: ['black'], player: 'black' };
      this.assert(game.isValidMove(0, 3, 'white'), 'ضرب قطعة الخصم صحيح');
      
      // اختبار حركة إلى نقطة بها قطعتان للخصم
      game.board[3] = { pieces: ['black', 'black'], player: 'black' };
      this.assert(!game.isValidMove(0, 3, 'white'), 'الحركة إلى نقطة محجوزة مرفوضة');
      
      console.log('✅ صحة الحركات تعمل بشكل صحيح\n');
    } catch (error) {
      console.log('❌ فشل في اختبار صحة الحركات:', error.message);
    }
  }

  // اختبار أداء الذكاء الاصطناعي
  testAIPerformance() {
    console.log('🤖 اختبار أداء الذكاء الاصطناعي...');
    
    try {
      const game = new BackgammonGame();
      const ai = new AdvancedAI('medium');
      
      let aiMoveCount = 0;
      let validMoveCount = 0;
      
      // اختبار 50 حركة للذكاء الاصطناعي
      for (let i = 0; i < 50; i++) {
        game.rollDice();
        const aiMove = ai.getBestMove(game);
        
        if (aiMove) {
          aiMoveCount++;
          if (game.isValidMove(aiMove.from, aiMove.to, game.currentPlayer)) {
            validMoveCount++;
          }
        }
        
        // إعادة تعيين اللعبة للاختبار التالي
        game.currentPlayer = game.currentPlayer === 'white' ? 'black' : 'white';
      }
      
      const accuracy = (validMoveCount / aiMoveCount) * 100;
      this.assert(accuracy > 90, `دقة الذكاء الاصطناعي: ${accuracy.toFixed(1)}%`);
      
      console.log('✅ الذكاء الاصطناعي يعمل بكفاءة عالية\n');
    } catch (error) {
      console.log('❌ فشل في اختبار الذكاء الاصطناعي:', error.message);
    }
  }

  // اختبار أنماط اللعب المختلفة
  testGameModes() {
    console.log('🎮 اختبار أنماط اللعب...');
    
    try {
      const modes = ['classic', 'nackgammon', 'hypergammon', 'longGammon'];
      
      modes.forEach(mode => {
        const game = new BackgammonGame(mode);
        this.assert(game.gameMode === mode, `نمط ${mode} تم تطبيقه بنجاح`);
      });
      
      console.log('✅ جميع أنماط اللعب تعمل بشكل صحيح\n');
    } catch (error) {
      console.log('❌ فشل في اختبار أنماط اللعب:', error.message);
    }
  }

  // اختبار شروط الفوز
  testWinConditions() {
    console.log('🏆 اختبار شروط الفوز...');
    
    try {
      const game = new BackgammonGame();
      
      // محاكاة حالة فوز
      game.board.forEach((point, index) => {
        if (point.player === 'white') {
          game.board[index] = { pieces: [], player: null };
        }
      });
      
      // وضع جميع القطع البيضاء خارج اللوحة
      game.whiteHome = 15;
      
      const winner = game.checkWinner();
      this.assert(winner === 'white', 'تحديد الفائز يعمل بشكل صحيح');
      
      console.log('✅ شروط الفوز تعمل بشكل صحيح\n');
    } catch (error) {
      console.log('❌ فشل في اختبار شروط الفوز:', error.message);
    }
  }

  // دالة التحقق
  assert(condition, message) {
    if (condition) {
      this.testResults.push({ status: 'pass', message });
    } else {
      this.testResults.push({ status: 'fail', message });
      throw new Error(message);
    }
  }

  // طباعة النتائج
  printResults() {
    console.log('📊 نتائج الاختبارات:');
    console.log('==================');
    
    const passed = this.testResults.filter(r => r.status === 'pass').length;
    const failed = this.testResults.filter(r => r.status === 'fail').length;
    
    console.log(`✅ نجح: ${passed}`);
    console.log(`❌ فشل: ${failed}`);
    console.log(`📈 معدل النجاح: ${((passed / this.testResults.length) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ الاختبارات الفاشلة:');
      this.testResults
        .filter(r => r.status === 'fail')
        .forEach(r => console.log(`  - ${r.message}`));
    }
  }
}

// تشغيل الاختبارات
if (typeof window !== 'undefined') {
  window.runGameTests = () => {
    const tester = new GameTester();
    tester.runAllTests();
  };
}

export default GameTester;
