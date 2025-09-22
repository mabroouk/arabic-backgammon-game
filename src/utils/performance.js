// أدوات تحسين الأداء للعبة الطاولة

// تحسين الذاكرة للذكاء الاصطناعي
export class MemoizedAI {
  constructor(ai) {
    this.ai = ai;
    this.cache = new Map();
    this.maxCacheSize = 10000;
  }

  // الحصول على أفضل حركة مع التخزين المؤقت
  getBestMove(game) {
    const gameState = this.serializeGameState(game);
    
    if (this.cache.has(gameState)) {
      return this.cache.get(gameState);
    }

    const bestMove = this.ai.getBestMove(game);
    
    // إدارة حجم الذاكرة المؤقتة
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(gameState, bestMove);
    return bestMove;
  }

  // تحويل حالة اللعبة إلى نص
  serializeGameState(game) {
    return JSON.stringify({
      board: game.board.map(point => ({
        player: point.player,
        count: point.pieces.length
      })),
      currentPlayer: game.currentPlayer,
      availableMoves: game.availableMoves.sort()
    });
  }

  // مسح الذاكرة المؤقتة
  clearCache() {
    this.cache.clear();
  }
}

// مراقب الأداء
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      aiMoveTime: [],
      renderTime: [],
      gameStateUpdates: 0,
      totalMoves: 0
    };
  }

  // قياس وقت حركة الذكاء الاصطناعي
  measureAIMove(aiFunction) {
    const startTime = performance.now();
    const result = aiFunction();
    const endTime = performance.now();
    
    this.metrics.aiMoveTime.push(endTime - startTime);
    this.metrics.totalMoves++;
    
    return result;
  }

  // قياس وقت الرسم
  measureRender(renderFunction) {
    const startTime = performance.now();
    const result = renderFunction();
    const endTime = performance.now();
    
    this.metrics.renderTime.push(endTime - startTime);
    
    return result;
  }

  // تسجيل تحديث حالة اللعبة
  recordGameStateUpdate() {
    this.metrics.gameStateUpdates++;
  }

  // الحصول على إحصائيات الأداء
  getStats() {
    const avgAITime = this.average(this.metrics.aiMoveTime);
    const avgRenderTime = this.average(this.metrics.renderTime);
    
    return {
      averageAIMoveTime: avgAITime.toFixed(2) + 'ms',
      averageRenderTime: avgRenderTime.toFixed(2) + 'ms',
      totalMoves: this.metrics.totalMoves,
      gameStateUpdates: this.metrics.gameStateUpdates,
      performance: this.getPerformanceRating(avgAITime, avgRenderTime)
    };
  }

  // حساب المتوسط
  average(array) {
    return array.length > 0 ? array.reduce((a, b) => a + b, 0) / array.length : 0;
  }

  // تقييم الأداء
  getPerformanceRating(aiTime, renderTime) {
    if (aiTime < 100 && renderTime < 16) return 'ممتاز';
    if (aiTime < 500 && renderTime < 33) return 'جيد';
    if (aiTime < 1000 && renderTime < 50) return 'مقبول';
    return 'يحتاج تحسين';
  }

  // إعادة تعيين الإحصائيات
  reset() {
    this.metrics = {
      aiMoveTime: [],
      renderTime: [],
      gameStateUpdates: 0,
      totalMoves: 0
    };
  }
}

// تحسين الرسوم المتحركة
export class AnimationOptimizer {
  constructor() {
    this.animationQueue = [];
    this.isAnimating = false;
  }

  // إضافة رسوم متحركة إلى الطابور
  queueAnimation(animation) {
    this.animationQueue.push(animation);
    if (!this.isAnimating) {
      this.processQueue();
    }
  }

  // معالجة طابور الرسوم المتحركة
  async processQueue() {
    this.isAnimating = true;
    
    while (this.animationQueue.length > 0) {
      const animation = this.animationQueue.shift();
      await this.executeAnimation(animation);
    }
    
    this.isAnimating = false;
  }

  // تنفيذ الرسوم المتحركة
  executeAnimation(animation) {
    return new Promise(resolve => {
      const duration = animation.duration || 300;
      
      // استخدام requestAnimationFrame للحصول على أداء أفضل
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        animation.update(progress);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          animation.complete && animation.complete();
          resolve();
        }
      };
      
      requestAnimationFrame(animate);
    });
  }
}

// مدير الموارد
export class ResourceManager {
  constructor() {
    this.loadedAssets = new Map();
    this.preloadQueue = [];
  }

  // تحميل مسبق للأصول
  preloadAsset(url, type = 'image') {
    if (this.loadedAssets.has(url)) {
      return Promise.resolve(this.loadedAssets.get(url));
    }

    return new Promise((resolve, reject) => {
      if (type === 'image') {
        const img = new Image();
        img.onload = () => {
          this.loadedAssets.set(url, img);
          resolve(img);
        };
        img.onerror = reject;
        img.src = url;
      }
    });
  }

  // تحميل مسبق لعدة أصول
  async preloadAssets(urls) {
    const promises = urls.map(url => this.preloadAsset(url));
    return Promise.all(promises);
  }

  // الحصول على أصل محمل
  getAsset(url) {
    return this.loadedAssets.get(url);
  }

  // مسح الذاكرة
  clearCache() {
    this.loadedAssets.clear();
  }
}

// تحسين استجابة الواجهة
export class ResponsiveOptimizer {
  constructor() {
    this.breakpoints = {
      mobile: 768,
      tablet: 1024,
      desktop: 1200
    };
    this.currentBreakpoint = this.getCurrentBreakpoint();
    this.listeners = [];
  }

  // الحصول على نقطة التوقف الحالية
  getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width < this.breakpoints.mobile) return 'mobile';
    if (width < this.breakpoints.tablet) return 'tablet';
    if (width < this.breakpoints.desktop) return 'desktop';
    return 'large';
  }

  // مراقبة تغيير حجم الشاشة
  onBreakpointChange(callback) {
    this.listeners.push(callback);
    
    const handleResize = () => {
      const newBreakpoint = this.getCurrentBreakpoint();
      if (newBreakpoint !== this.currentBreakpoint) {
        this.currentBreakpoint = newBreakpoint;
        this.listeners.forEach(listener => listener(newBreakpoint));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }

  // الحصول على إعدادات محسنة للجهاز
  getOptimizedSettings() {
    switch (this.currentBreakpoint) {
      case 'mobile':
        return {
          animationDuration: 200,
          maxParticles: 10,
          aiDepth: 1,
          renderQuality: 'low'
        };
      case 'tablet':
        return {
          animationDuration: 250,
          maxParticles: 20,
          aiDepth: 2,
          renderQuality: 'medium'
        };
      default:
        return {
          animationDuration: 300,
          maxParticles: 50,
          aiDepth: 3,
          renderQuality: 'high'
        };
    }
  }
}

// مراقب استخدام الذاكرة
export class MemoryMonitor {
  constructor() {
    this.checkInterval = null;
    this.thresholds = {
      warning: 50 * 1024 * 1024, // 50MB
      critical: 100 * 1024 * 1024 // 100MB
    };
  }

  // بدء مراقبة الذاكرة
  startMonitoring(callback) {
    if (!performance.memory) {
      console.warn('Memory monitoring not supported in this browser');
      return;
    }

    this.checkInterval = setInterval(() => {
      const memoryInfo = performance.memory;
      const usedMemory = memoryInfo.usedJSHeapSize;
      
      let status = 'normal';
      if (usedMemory > this.thresholds.critical) {
        status = 'critical';
      } else if (usedMemory > this.thresholds.warning) {
        status = 'warning';
      }

      callback({
        used: usedMemory,
        total: memoryInfo.totalJSHeapSize,
        limit: memoryInfo.jsHeapSizeLimit,
        status: status,
        percentage: (usedMemory / memoryInfo.jsHeapSizeLimit) * 100
      });
    }, 5000);
  }

  // إيقاف مراقبة الذاكرة
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

// تصدير جميع الأدوات
export const PerformanceUtils = {
  MemoizedAI,
  PerformanceMonitor,
  AnimationOptimizer,
  ResourceManager,
  ResponsiveOptimizer,
  MemoryMonitor
};
