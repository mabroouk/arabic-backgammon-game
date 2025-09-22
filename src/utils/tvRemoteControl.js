// نظام التحكم بالريموت للتلفزيون
// TV Remote Control System

class TVRemoteControl {
  constructor() {
    this.focusedElement = null;
    this.focusableElements = [];
    this.currentIndex = 0;
    this.isEnabled = false;
    this.init();
  }

  init() {
    // تحديد ما إذا كان الجهاز تلفزيون أو جهاز يدعم التحكم بالريموت
    this.detectTVEnvironment();
    
    if (this.isEnabled) {
      this.setupEventListeners();
      this.addTVStyles();
    }
  }

  detectTVEnvironment() {
    // فحص إذا كان الجهاز تلفزيون ذكي أو يستخدم ريموت
    const userAgent = navigator.userAgent.toLowerCase();
    const isTizen = userAgent.includes('tizen'); // Samsung Smart TV
    const isWebOS = userAgent.includes('webos'); // LG Smart TV
    const isAndroidTV = userAgent.includes('android') && userAgent.includes('tv');
    const isAppleTV = userAgent.includes('apple tv');
    const isRoku = userAgent.includes('roku');
    const isFireTV = userAgent.includes('afts'); // Amazon Fire TV
    
    // فحص إذا كان يستخدم gamepad (ريموت)
    const hasGamepad = 'getGamepads' in navigator;
    
    // فحص حجم الشاشة (التلفزيونات عادة أكبر من 40 بوصة)
    const isLargeScreen = window.screen.width >= 1920 && window.screen.height >= 1080;
    
    this.isEnabled = isTizen || isWebOS || isAndroidTV || isAppleTV || isRoku || isFireTV || hasGamepad || isLargeScreen;
    
    console.log('TV Environment Detection:', {
      isTizen, isWebOS, isAndroidTV, isAppleTV, isRoku, isFireTV,
      hasGamepad, isLargeScreen, enabled: this.isEnabled
    });
  }

  addTVStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* أنماط التحكم بالريموت للتلفزيون */
      .tv-focusable {
        transition: all 0.3s ease;
        border: 3px solid transparent;
        border-radius: 8px;
        outline: none;
      }
      
      .tv-focused {
        border: 3px solid #FFD700 !important;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.8) !important;
        transform: scale(1.05);
        z-index: 1000;
        position: relative;
      }
      
      .tv-navigation-hint {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-size: 18px;
        z-index: 10000;
        display: flex;
        gap: 20px;
        align-items: center;
        direction: rtl;
      }
      
      .tv-hint-item {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .tv-hint-key {
        background: #333;
        padding: 5px 10px;
        border-radius: 5px;
        font-weight: bold;
        min-width: 30px;
        text-align: center;
      }
      
      /* تحسينات للتلفزيون */
      @media screen and (min-width: 1920px) {
        body {
          font-size: 120%;
        }
        
        button, .card, .game-piece {
          cursor: none; /* إخفاء المؤشر في التلفزيون */
        }
        
        .game-board {
          transform: scale(1.1);
        }
      }
    `;
    document.head.appendChild(style);
  }

  setupEventListeners() {
    // إضافة مستمعي الأحداث للوحة المفاتيح والريموت
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('gamepadconnected', this.handleGamepadConnected.bind(this));
    document.addEventListener('gamepaddisconnected', this.handleGamepadDisconnected.bind(this));
    
    // تحديث العناصر القابلة للتركيز عند تغيير DOM
    const observer = new MutationObserver(() => {
      this.updateFocusableElements();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // إضافة دليل التنقل
    this.addNavigationHint();
  }

  addNavigationHint() {
    const hint = document.createElement('div');
    hint.className = 'tv-navigation-hint';
    hint.innerHTML = `
      <div class="tv-hint-item">
        <span class="tv-hint-key">↑↓←→</span>
        <span>التنقل</span>
      </div>
      <div class="tv-hint-item">
        <span class="tv-hint-key">Enter</span>
        <span>اختيار</span>
      </div>
      <div class="tv-hint-item">
        <span class="tv-hint-key">Back</span>
        <span>رجوع</span>
      </div>
      <div class="tv-hint-item">
        <span class="tv-hint-key">Menu</span>
        <span>القائمة</span>
      </div>
    `;
    document.body.appendChild(hint);
    
    // إخفاء الدليل بعد 10 ثوان
    setTimeout(() => {
      hint.style.opacity = '0';
      setTimeout(() => hint.remove(), 300);
    }, 10000);
  }

  updateFocusableElements() {
    // العثور على جميع العناصر القابلة للتركيز
    const selectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '.game-piece:not(.disabled)',
      '.board-point:not(.disabled)',
      '.card:not(.disabled)',
      '.dice:not(.disabled)'
    ];
    
    this.focusableElements = Array.from(document.querySelectorAll(selectors.join(', ')))
      .filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && 
               window.getComputedStyle(el).visibility !== 'hidden' &&
               window.getComputedStyle(el).display !== 'none';
      });
    
    // إضافة كلاس للعناصر القابلة للتركيز
    this.focusableElements.forEach(el => {
      el.classList.add('tv-focusable');
      el.setAttribute('tabindex', '0');
    });
    
    // تركيز العنصر الأول إذا لم يكن هناك عنصر مركز
    if (this.focusableElements.length > 0 && !this.focusedElement) {
      this.focusElement(0);
    }
  }

  handleKeyDown(event) {
    if (!this.isEnabled || this.focusableElements.length === 0) return;
    
    const { key, keyCode } = event;
    
    switch (key) {
      case 'ArrowUp':
      case 'Up':
        event.preventDefault();
        this.navigateVertical(-1);
        break;
        
      case 'ArrowDown':
      case 'Down':
        event.preventDefault();
        this.navigateVertical(1);
        break;
        
      case 'ArrowLeft':
      case 'Left':
        event.preventDefault();
        this.navigateHorizontal(-1);
        break;
        
      case 'ArrowRight':
      case 'Right':
        event.preventDefault();
        this.navigateHorizontal(1);
        break;
        
      case 'Enter':
      case 'Select':
        event.preventDefault();
        this.activateElement();
        break;
        
      case 'Escape':
      case 'Back':
      case 'Backspace':
        event.preventDefault();
        this.goBack();
        break;
        
      case 'Menu':
      case 'Home':
        event.preventDefault();
        this.showMenu();
        break;
        
      // أزرار الأرقام للاختيار السريع
      case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8':
        event.preventDefault();
        this.quickSelect(parseInt(key) - 1);
        break;
    }
    
    // دعم أزرار الريموت الخاصة
    if (keyCode >= 37 && keyCode <= 40) { // Arrow keys
      event.preventDefault();
    }
  }

  navigateVertical(direction) {
    if (!this.focusedElement) {
      this.focusElement(0);
      return;
    }
    
    const currentRect = this.focusedElement.getBoundingClientRect();
    const candidates = this.focusableElements
      .map((el, index) => ({
        element: el,
        index,
        rect: el.getBoundingClientRect()
      }))
      .filter(item => {
        const verticalOverlap = Math.max(0, 
          Math.min(currentRect.right, item.rect.right) - 
          Math.max(currentRect.left, item.rect.left)
        );
        
        if (direction > 0) {
          return item.rect.top > currentRect.bottom && verticalOverlap > 20;
        } else {
          return item.rect.bottom < currentRect.top && verticalOverlap > 20;
        }
      })
      .sort((a, b) => {
        const distanceA = Math.abs(a.rect.top - currentRect.top);
        const distanceB = Math.abs(b.rect.top - currentRect.top);
        return distanceA - distanceB;
      });
    
    if (candidates.length > 0) {
      this.focusElement(candidates[0].index);
    }
  }

  navigateHorizontal(direction) {
    if (!this.focusedElement) {
      this.focusElement(0);
      return;
    }
    
    const currentRect = this.focusedElement.getBoundingClientRect();
    const candidates = this.focusableElements
      .map((el, index) => ({
        element: el,
        index,
        rect: el.getBoundingClientRect()
      }))
      .filter(item => {
        const horizontalOverlap = Math.max(0,
          Math.min(currentRect.bottom, item.rect.bottom) -
          Math.max(currentRect.top, item.rect.top)
        );
        
        if (direction > 0) {
          return item.rect.left > currentRect.right && horizontalOverlap > 20;
        } else {
          return item.rect.right < currentRect.left && horizontalOverlap > 20;
        }
      })
      .sort((a, b) => {
        const distanceA = Math.abs(a.rect.left - currentRect.left);
        const distanceB = Math.abs(b.rect.left - currentRect.left);
        return distanceA - distanceB;
      });
    
    if (candidates.length > 0) {
      this.focusElement(candidates[0].index);
    } else {
      // التنقل الدائري في نفس الصف
      const nextIndex = direction > 0 ? 
        (this.currentIndex + 1) % this.focusableElements.length :
        (this.currentIndex - 1 + this.focusableElements.length) % this.focusableElements.length;
      this.focusElement(nextIndex);
    }
  }

  focusElement(index) {
    if (index < 0 || index >= this.focusableElements.length) return;
    
    // إزالة التركيز من العنصر السابق
    if (this.focusedElement) {
      this.focusedElement.classList.remove('tv-focused');
    }
    
    // تركيز العنصر الجديد
    this.currentIndex = index;
    this.focusedElement = this.focusableElements[index];
    this.focusedElement.classList.add('tv-focused');
    
    // التمرير للعنصر إذا كان خارج الشاشة
    this.focusedElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
    
    // تشغيل صوت التنقل
    this.playNavigationSound();
  }

  activateElement() {
    if (!this.focusedElement) return;
    
    // تشغيل صوت التفعيل
    this.playActivationSound();
    
    // محاكاة النقر
    if (this.focusedElement.tagName === 'BUTTON' || this.focusedElement.tagName === 'A') {
      this.focusedElement.click();
    } else if (this.focusedElement.classList.contains('game-piece')) {
      // تفعيل قطعة اللعب
      const event = new CustomEvent('pieceSelected', {
        detail: { element: this.focusedElement }
      });
      this.focusedElement.dispatchEvent(event);
    } else if (this.focusedElement.classList.contains('board-point')) {
      // تفعيل نقطة على اللوحة
      const event = new CustomEvent('pointSelected', {
        detail: { element: this.focusedElement }
      });
      this.focusedElement.dispatchEvent(event);
    }
  }

  quickSelect(index) {
    if (index < this.focusableElements.length) {
      this.focusElement(index);
      setTimeout(() => this.activateElement(), 200);
    }
  }

  goBack() {
    // البحث عن زر الرجوع
    const backButtons = this.focusableElements.filter(el => 
      el.textContent.includes('رجوع') || 
      el.textContent.includes('العودة') ||
      el.textContent.includes('إغلاق') ||
      el.classList.contains('back-button')
    );
    
    if (backButtons.length > 0) {
      backButtons[0].click();
    } else {
      // محاولة الضغط على Escape
      window.history.back();
    }
  }

  showMenu() {
    // البحث عن زر القائمة
    const menuButtons = this.focusableElements.filter(el =>
      el.textContent.includes('قائمة') ||
      el.textContent.includes('إعدادات') ||
      el.classList.contains('menu-button')
    );
    
    if (menuButtons.length > 0) {
      menuButtons[0].click();
    }
  }

  playNavigationSound() {
    // تشغيل صوت خفيف للتنقل
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // تجاهل الأخطاء الصوتية
    }
  }

  playActivationSound() {
    // تشغيل صوت للتفعيل
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
      // تجاهل الأخطاء الصوتية
    }
  }

  handleGamepadConnected(event) {
    console.log('Gamepad connected:', event.gamepad);
    this.setupGamepadPolling();
  }

  handleGamepadDisconnected(event) {
    console.log('Gamepad disconnected:', event.gamepad);
  }

  setupGamepadPolling() {
    // مراقبة أزرار الريموت/الجيم باد
    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];
        if (gamepad) {
          this.handleGamepadInput(gamepad);
        }
      }
      requestAnimationFrame(pollGamepad);
    };
    
    requestAnimationFrame(pollGamepad);
  }

  handleGamepadInput(gamepad) {
    // معالجة إدخال الريموت/الجيم باد
    const threshold = 0.5;
    
    // الأزرار الاتجاهية
    if (gamepad.axes[1] < -threshold) { // Up
      this.navigateVertical(-1);
    } else if (gamepad.axes[1] > threshold) { // Down
      this.navigateVertical(1);
    }
    
    if (gamepad.axes[0] < -threshold) { // Left
      this.navigateHorizontal(-1);
    } else if (gamepad.axes[0] > threshold) { // Right
      this.navigateHorizontal(1);
    }
    
    // أزرار التفعيل
    if (gamepad.buttons[0] && gamepad.buttons[0].pressed) { // A/Select
      this.activateElement();
    }
    
    if (gamepad.buttons[1] && gamepad.buttons[1].pressed) { // B/Back
      this.goBack();
    }
  }

  // تفعيل/إلغاء تفعيل النظام
  enable() {
    this.isEnabled = true;
    this.updateFocusableElements();
  }

  disable() {
    this.isEnabled = false;
    if (this.focusedElement) {
      this.focusedElement.classList.remove('tv-focused');
    }
  }
}

// إنشاء مثيل عام للتحكم بالريموت
window.tvRemoteControl = new TVRemoteControl();

export default TVRemoteControl;
