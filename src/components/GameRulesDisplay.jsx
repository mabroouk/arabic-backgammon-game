import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, Lightbulb, Target, Clock } from 'lucide-react';
import { GAME_MODES } from '../lib/gameLogic';

const GameRulesDisplay = ({ selectedMode, isVisible = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!selectedMode || !GAME_MODES[selectedMode]) {
    return null;
  }

  const mode = GAME_MODES[selectedMode];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="w-full max-w-4xl mx-auto mt-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-lg border border-amber-200"
        >
          {/* العنوان القابل للطي */}
          <motion.div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-amber-100 transition-colors rounded-t-lg"
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-amber-700" />
              <h3 className="text-xl font-bold text-amber-900">
                قوانين {mode.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  mode.difficulty === 'سهلة' ? 'bg-green-100 text-green-800' :
                  mode.difficulty === 'متوسطة' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {mode.difficulty}
                </span>
                <div className="flex items-center gap-1 text-amber-700">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{mode.duration}</span>
                </div>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-amber-700" />
            </motion.div>
          </motion.div>

          {/* المحتوى القابل للطي */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 space-y-6">
                  {/* الوصف الأساسي */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      الهدف من اللعبة:
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{mode.description}</p>
                  </div>

                  {/* القوانين التفصيلية */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      القوانين التفصيلية:
                    </h4>
                    <div className="grid gap-3">
                      {mode.rules.map((rule, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100"
                        >
                          <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 leading-relaxed">{rule}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* النصائح الاستراتيجية */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 shadow-sm border border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      نصائح استراتيجية:
                    </h4>
                    <div className="text-blue-800 text-sm leading-relaxed">
                      {getStrategyTips(selectedMode)}
                    </div>
                  </div>

                  {/* معلومات إضافية حسب النمط */}
                  {getAdditionalInfo(selectedMode) && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 shadow-sm border border-purple-200">
                      <h4 className="font-bold text-purple-900 mb-3">معلومات إضافية:</h4>
                      <div className="text-purple-800 text-sm leading-relaxed">
                        {getAdditionalInfo(selectedMode)}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* شريط سريع للمعلومات الأساسية */}
          {!isExpanded && (
            <div className="px-4 pb-4">
              <div className="text-sm text-amber-700 bg-amber-100 rounded-lg p-3">
                <strong>ملخص سريع:</strong> {mode.description}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// دالة الحصول على النصائح الاستراتيجية
function getStrategyTips(mode) {
  const tips = {
    aada: "ركز على حماية قطعك وضرب قطع الخصم المنفردة. كوّن نقاط قوية في منطقة خصمك واحرص على عدم ترك قطع منفردة معرضة للضرب.",
    mahbousa: "استراتيجية الحبس هي المفتاح. احبس قطع الخصم في منطقة البداية واحرص على تحرير قطعك بحذر. كلما حبست أكثر، زادت فرص فوزك.",
    thirtyone: "ركز على السرعة وتجنب المخاطرة غير المحسوبة. احسب النقاط المتبقية للخصم باستمرار وحاول منعه من الوصول للـ31 نقطة.",
    gulbehar: "استغل قانون الدبل المتقدم لصالحك. خطط للحركات المتتالية وتحكم في وسط اللوحة. الدبل يمكن أن يكون سلاح ذو حدين.",
    basita: "سطح القطع بالترتيب الصحيح ولا تتسرع في الإخراج. راقب حركات الخصم بعناية واستغل البساطة لصالحك.",
    longGammon: "السرعة هي كل شيء. ركز على التقدم السريع وتجنب الحجز غير الضروري. لا تضيع الوقت في محاولة إعاقة الخصم.",
    nackgammon: "يتطلب استراتيجيات متقدمة. ادرس الترتيب الابتدائي جيداً وخطط للمدى الطويل. الصبر والتخطيط مفتاح النجاح.",
    hypergammon: "مع 3 قطع فقط، كل حركة مهمة. ركز على الأمان أولاً ثم السرعة. تجنب المخاطرة إلا إذا كنت متأخراً."
  };
  
  return tips[mode] || "خطط بعناية وفكر في كل حركة قبل تنفيذها.";
}

// دالة الحصول على معلومات إضافية
function getAdditionalInfo(mode) {
  const info = {
    aada: "هذا هو النمط الأكثر انتشاراً عالمياً. يُلعب في البطولات الدولية ويتطلب توازناً بين الهجوم والدفاع.",
    mahbousa: "نمط شائع في الشرق الأوسط. يتطلب صبراً وتخطيطاً طويل المدى. اللعبة قد تستغرق وقتاً أطول من المعتاد.",
    thirtyone: "نمط سريع ومثير. مناسب للمبتدئين لتعلم أساسيات الحركة دون تعقيدات الضرب والحبس.",
    gulbehar: "نمط تقليدي من منطقة الخليج. قانون الدبل المتقدم يجعل اللعبة أكثر إثارة وتحدياً.",
    basita: "مثالي لتعليم الأطفال. يركز على الأساسيات دون تعقيدات. يمكن لعبه بسرعة.",
    longGammon: "النمط الروسي التقليدي. يركز على السرعة والكفاءة في الحركة.",
    nackgammon: "تطوير أمريكي للعبة الكلاسيكية. يوفر توازناً أفضل ولعباً أكثر إثارة.",
    hypergammon: "نمط حديث للألعاب السريعة. مثالي عندما يكون الوقت محدوداً."
  };
  
  return info[mode] || null;
}

export default GameRulesDisplay;
