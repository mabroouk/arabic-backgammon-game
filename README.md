# 🎲 لعبة الطاولة الاحترافية - Professional Backgammon Game

[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-green.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0+-blue.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **أفضل لعبة طاولة رقمية مع تصميم واقعي وذكاء اصطناعي متقدم**

![لعبة الطاولة](./public/screenshot.png)

---

## 🌟 المميزات الرئيسية

### 🎨 **تصميم واقعي ومبتكر**
- صندوق طاولة قابل للفتح والإغلاق مع رسوم متحركة سلسة
- محاكاة دقيقة للطاولة الحقيقية مع نسيج الخشب والقطع
- كؤوس الشاي التراثية ومبسم الشيشة (خليل مامون)
- تأثيرات بصرية متقدمة مع جسيمات وإضاءة

### 🎮 **أنماط لعب متعددة**
- **الطاولة الكلاسيكية**: النمط التقليدي مع ضرب القطع
- **ناك جامون**: ترتيب مختلف للقطع في البداية
- **هايبر جامون**: لعبة سريعة مع 3 قطع فقط
- **الطاولة الطويلة**: بدون ضرب القطع

### 🤖 **ذكاء اصطناعي متقدم**
- خوارزمية MiniMax مع Alpha-Beta Pruning
- ثلاث مستويات صعوبة (سهل، متوسط، صعب)
- تقييم شامل للموقف (الأمان، التقدم، النقاط القوية)
- ذاكرة مؤقتة للحركات لتحسين الأداء

### 📱 **تصميم متجاوب**
- يعمل على جميع الأجهزة (موبايل، تابلت، كمبيوتر، تلفزيون)
- واجهة مستخدم متكيفة مع حجم الشاشة
- تحكم باللمس والماوس
- أداء محسن لجميع الأجهزة

---

## 🚀 التقنيات المستخدمة

### Frontend Framework
- **React 18+** - مكتبة واجهة المستخدم
- **Vite** - أداة البناء السريعة
- **TailwindCSS** - إطار عمل CSS
- **Framer Motion** - مكتبة الرسوم المتحركة

### UI Components
- **shadcn/ui** - مكونات واجهة المستخدم
- **Lucide React** - أيقونات حديثة
- **Radix UI** - مكونات أساسية

### Game Logic
- **JavaScript ES6+** - منطق اللعبة
- **Custom AI Engine** - محرك الذكاء الاصطناعي
- **Performance Optimization** - تحسين الأداء

---

## 📦 التثبيت والتشغيل

### المتطلبات
- Node.js 18+ 
- pnpm (مفضل) أو npm

### خطوات التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/your-username/backgammon-game.git
cd backgammon-game

# تثبيت التبعيات
pnpm install

# تشغيل خادم التطوير
pnpm run dev

# بناء المشروع للإنتاج
pnpm run build

# معاينة البناء
pnpm run preview
```

### متغيرات البيئة
```env
# اختياري - لتفعيل ميزات إضافية
VITE_ENABLE_ANALYTICS=true
VITE_API_URL=https://api.example.com
```

---

## 🎯 كيفية اللعب

### البداية السريعة
1. **افتح الصندوق**: اضغط على صندوق الطاولة
2. **اختر النمط**: حدد نمط اللعب المفضل
3. **اختر الخصم**: لعب ضد الكمبيوتر أو لاعب آخر
4. **ابدأ اللعب**: ارم النرد وحرك القطع

### القوانين الأساسية
- كل لاعب لديه 15 قطعة
- الهدف هو إخراج جميع القطع من اللوحة
- يمكن ضرب قطع الخصم المنفردة
- الأرقام المتشابهة تُلعب أربع مرات

للمزيد من التفاصيل، راجع [دليل المستخدم](./USER_GUIDE.md)

---

## 🏗️ هيكل المشروع

```
backgammon-game/
├── public/                 # الملفات العامة
├── src/
│   ├── components/         # مكونات React
│   │   ├── BackgammonBox.jsx
│   │   ├── GameBoard.jsx
│   │   └── GameModeSelector.jsx
│   ├── lib/               # منطق اللعبة
│   │   └── gameLogic.js
│   ├── utils/             # أدوات مساعدة
│   │   └── performance.js
│   ├── tests/             # الاختبارات
│   │   └── gameTest.js
│   ├── App.jsx            # المكون الرئيسي
│   └── main.jsx           # نقطة الدخول
├── README.md              # هذا الملف
├── USER_GUIDE.md          # دليل المستخدم
└── package.json           # تبعيات المشروع
```

---

## 🧪 الاختبارات

### تشغيل الاختبارات
```bash
# اختبارات الوحدة
pnpm run test

# اختبارات الأداء
pnpm run test:performance

# اختبارات التكامل
pnpm run test:integration
```

### تغطية الاختبارات
- ✅ منطق اللعبة الأساسي
- ✅ الذكاء الاصطناعي
- ✅ واجهة المستخدم
- ✅ الأداء والذاكرة

---

## 🎨 التخصيص

### تغيير الألوان
```css
/* في src/index.css */
:root {
  --board-primary: #92400e;
  --board-secondary: #78350f;
  --piece-white: #f3f4f6;
  --piece-black: #dc2626;
}
```

### إضافة أنماط لعب جديدة
```javascript
// في src/lib/gameLogic.js
export const GAME_MODES = {
  // أضف نمط جديد هنا
  newMode: {
    name: "النمط الجديد",
    nameEn: "New Mode",
    description: "وصف النمط الجديد",
    rules: ["قانون 1", "قانون 2"]
  }
};
```

---

## 📊 الأداء

### معايير الأداء
- ⚡ **سرعة رمي النرد**: < 10ms لـ 1000 رمية
- 💾 **استهلاك الذاكرة**: < 50MB
- 🎯 **عناصر تفاعلية**: 50+ عنصر
- 📱 **استجابة الواجهة**: < 16ms للإطار

### تحسينات الأداء
- Lazy Loading للمكونات
- ذاكرة مؤقتة للذكاء الاصطناعي
- تحسين الرسوم المتحركة
- ضغط الأصول

---

## 🌐 النشر

### GitHub Pages
```bash
pnpm run build
pnpm run deploy
```

### Vercel
```bash
vercel --prod
```

### Netlify
```bash
netlify deploy --prod --dir=dist
```

---

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

### إرشادات المساهمة
- اتبع معايير الكود الموجودة
- أضف اختبارات للميزات الجديدة
- حدث الوثائق عند الحاجة
- تأكد من عمل جميع الاختبارات

---

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

## 👨‍💻 المطور

**تم تطوير هذه اللعبة بواسطة Manus AI**

- 🌐 الموقع: [manus.im](https://manus.im)
- 📧 البريد الإلكتروني: support@manus.im
- 🐙 GitHub: [@manus-ai](https://github.com/manus-ai)

---

## 🙏 شكر وتقدير

- **React Team** - لإطار العمل الرائع
- **Tailwind CSS** - للتصميم الجميل
- **Framer Motion** - للرسوم المتحركة السلسة
- **shadcn/ui** - لمكونات واجهة المستخدم

---

## 📈 الإحصائيات

![GitHub stars](https://img.shields.io/github/stars/your-username/backgammon-game?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-username/backgammon-game?style=social)
![GitHub issues](https://img.shields.io/github/issues/your-username/backgammon-game)
![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/backgammon-game)

---

## 🔮 الخطط المستقبلية

- [ ] وضع اللعب الجماعي عبر الإنترنت
- [ ] نظام الترتيب والبطولات
- [ ] المزيد من أنماط اللعب
- [ ] تطبيق الهاتف المحمول
- [ ] دعم اللغات المتعددة
- [ ] نظام الإنجازات المتقدم

---

**استمتع باللعب! 🎲✨**
