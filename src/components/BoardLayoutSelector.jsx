import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Grid, Eye, Sparkles, Gamepad2 } from 'lucide-react';

const BoardLayoutSelector = ({ onLayoutSelect, selectedGameMode }) => {
  const [selectedLayout, setSelectedLayout] = useState('classic');

  const boardLayouts = {
    classic: {
      name: 'الكلاسيكي',
      nameEn: 'Classic Wood',
      description: 'التصميم التقليدي بالخشب البني الأنيق',
      preview: '🟫',
      colors: {
        primary: '#8B4513',
        secondary: '#A0522D',
        accent: '#D2691E',
        background: 'from-amber-800 to-amber-900'
      },
      style: 'traditional'
    },
    luxury: {
      name: 'الفاخر',
      nameEn: 'Luxury Mahogany',
      description: 'خشب الماهوجني الفاخر مع تطعيمات ذهبية',
      preview: '🟤',
      colors: {
        primary: '#4A0E0E',
        secondary: '#8B0000',
        accent: '#FFD700',
        background: 'from-red-900 to-red-950'
      },
      style: 'luxury'
    },
    modern: {
      name: 'العصري',
      nameEn: 'Modern Glass',
      description: 'تصميم عصري بالزجاج والمعدن اللامع',
      preview: '⬜',
      colors: {
        primary: '#2C3E50',
        secondary: '#34495E',
        accent: '#3498DB',
        background: 'from-slate-700 to-slate-900'
      },
      style: 'modern'
    },
    royal: {
      name: 'الملكي',
      nameEn: 'Royal Purple',
      description: 'التصميم الملكي بالأرجواني والذهب',
      preview: '🟣',
      colors: {
        primary: '#4B0082',
        secondary: '#6A0DAD',
        accent: '#FFD700',
        background: 'from-purple-800 to-purple-950'
      },
      style: 'royal'
    },
    nature: {
      name: 'الطبيعي',
      nameEn: 'Natural Bamboo',
      description: 'خشب البامبو الطبيعي مع لمسات خضراء',
      preview: '🟢',
      colors: {
        primary: '#228B22',
        secondary: '#32CD32',
        accent: '#ADFF2F',
        background: 'from-green-700 to-green-900'
      },
      style: 'nature'
    },
    desert: {
      name: 'الصحراوي',
      nameEn: 'Desert Sand',
      description: 'ألوان الصحراء الدافئة مع لمسات برتقالية',
      preview: '🟠',
      colors: {
        primary: '#CD853F',
        secondary: '#DEB887',
        accent: '#FF8C00',
        background: 'from-orange-600 to-orange-800'
      },
      style: 'desert'
    },
    ocean: {
      name: 'المحيط',
      nameEn: 'Ocean Blue',
      description: 'ألوان المحيط الزرقاء مع لمعان اللؤلؤ',
      preview: '🔵',
      colors: {
        primary: '#1E3A8A',
        secondary: '#1E40AF',
        accent: '#60A5FA',
        background: 'from-blue-800 to-blue-950'
      },
      style: 'ocean'
    },
    vintage: {
      name: 'الكلاسيكي القديم',
      nameEn: 'Vintage Leather',
      description: 'الجلد القديم مع التفاصيل النحاسية',
      preview: '🟤',
      colors: {
        primary: '#8B4513',
        secondary: '#A0522D',
        accent: '#B8860B',
        background: 'from-yellow-800 to-yellow-900'
      },
      style: 'vintage'
    },
    neon: {
      name: 'النيون',
      nameEn: 'Neon Cyber',
      description: 'تصميم مستقبلي بألوان النيون المتوهجة',
      preview: '🌈',
      colors: {
        primary: '#0F0F23',
        secondary: '#1A1A2E',
        accent: '#00FFFF',
        background: 'from-gray-900 to-black'
      },
      style: 'neon'
    },
    marble: {
      name: 'الرخامي',
      nameEn: 'Marble Elite',
      description: 'الرخام الأبيض الفاخر مع العروق الذهبية',
      preview: '⬜',
      colors: {
        primary: '#F8F8FF',
        secondary: '#E6E6FA',
        accent: '#FFD700',
        background: 'from-gray-100 to-gray-300'
      },
      style: 'marble'
    },
    arabic: {
      name: 'العربي التراثي',
      nameEn: 'Arabic Heritage',
      description: 'النقوش العربية التراثية مع الخط الكوفي',
      preview: '🕌',
      colors: {
        primary: '#8B0000',
        secondary: '#A52A2A',
        accent: '#FFD700',
        background: 'from-red-800 to-red-900'
      },
      style: 'arabic'
    },
    space: {
      name: 'الفضائي',
      nameEn: 'Space Galaxy',
      description: 'تصميم فضائي مع النجوم والمجرات',
      preview: '🌌',
      colors: {
        primary: '#191970',
        secondary: '#483D8B',
        accent: '#9370DB',
        background: 'from-indigo-900 to-purple-900'
      },
      style: 'space'
    }
  };

  const handleLayoutSelect = (layoutKey) => {
    setSelectedLayout(layoutKey);
  };

  const handleConfirmSelection = () => {
    onLayoutSelect(selectedLayout, boardLayouts[selectedLayout]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* العنوان */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <Palette className="w-8 h-8 text-amber-600" />
            اختر تخطيط اللوحة المفضل
          </CardTitle>
          <p className="text-amber-700 mt-2">
            اختر من بين {Object.keys(boardLayouts).length} تصميم مختلف للوحة الطاولة
          </p>
        </CardHeader>
      </Card>

      {/* شبكة التخطيطات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(boardLayouts).map(([key, layout]) => {
          const isSelected = selectedLayout === key;
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Object.keys(boardLayouts).indexOf(key) * 0.05 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isSelected
                    ? 'ring-2 ring-amber-500 bg-amber-50 shadow-lg transform scale-105'
                    : 'hover:shadow-md hover:bg-gray-50'
                }`}
                onClick={() => handleLayoutSelect(key)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-4xl">{layout.preview}</div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-green-500 text-white rounded-full p-1"
                      >
                        ✓
                      </motion.div>
                    )}
                  </div>
                  <CardTitle className="text-lg text-gray-900">
                    {layout.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 font-medium">
                    {layout.nameEn}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {layout.description}
                  </p>
                  
                  {/* معاينة الألوان */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-500">الألوان:</span>
                    <div className="flex gap-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: layout.colors.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: layout.colors.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: layout.colors.accent }}
                      />
                    </div>
                  </div>
                  
                  {/* نوع التصميم */}
                  <div className="flex justify-between items-center">
                    <Badge
                      variant={
                        layout.style === 'luxury' || layout.style === 'royal' ? 'default' :
                        layout.style === 'modern' || layout.style === 'neon' ? 'secondary' :
                        'outline'
                      }
                      className="text-xs"
                    >
                      {layout.style === 'traditional' ? 'تقليدي' :
                       layout.style === 'luxury' ? 'فاخر' :
                       layout.style === 'modern' ? 'عصري' :
                       layout.style === 'royal' ? 'ملكي' :
                       layout.style === 'nature' ? 'طبيعي' :
                       layout.style === 'desert' ? 'صحراوي' :
                       layout.style === 'ocean' ? 'محيطي' :
                       layout.style === 'vintage' ? 'كلاسيكي' :
                       layout.style === 'neon' ? 'مستقبلي' :
                       layout.style === 'marble' ? 'رخامي' :
                       layout.style === 'arabic' ? 'تراثي' :
                       layout.style === 'space' ? 'فضائي' : 'مخصص'}
                    </Badge>
                    
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1 text-green-600 text-xs"
                      >
                        <Eye className="w-3 h-3" />
                        محدد
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* معاينة التصميم المحدد */}
      <AnimatePresence>
        {selectedLayout && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-blue-900">
                    معاينة التصميم: {boardLayouts[selectedLayout].name}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* معلومات التصميم */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">الاسم العربي:</span>
                      <span>{boardLayouts[selectedLayout].name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">الاسم الإنجليزي:</span>
                      <span>{boardLayouts[selectedLayout].nameEn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">النمط:</span>
                      <span>{boardLayouts[selectedLayout].style}</span>
                    </div>
                    <div>
                      <span className="font-medium">الوصف:</span>
                      <p className="text-sm text-gray-600 mt-1">
                        {boardLayouts[selectedLayout].description}
                      </p>
                    </div>
                  </div>
                  
                  {/* معاينة مصغرة للوحة */}
                  <div className="flex justify-center">
                    <div 
                      className={`w-48 h-32 rounded-lg border-4 border-gray-300 bg-gradient-to-br ${boardLayouts[selectedLayout].colors.background} flex items-center justify-center shadow-lg`}
                    >
                      <div className="text-white text-center">
                        <div className="text-2xl mb-2">{boardLayouts[selectedLayout].preview}</div>
                        <div className="text-sm font-medium">معاينة اللوحة</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* زر التأكيد */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleConfirmSelection}
          size="lg"
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xl px-12 py-4 rounded-xl shadow-lg"
          disabled={!selectedLayout}
        >
          <Gamepad2 className="w-6 h-6 mr-3" />
          ابدأ اللعب بتصميم {selectedLayout ? boardLayouts[selectedLayout].name : ''}
        </Button>
      </div>
    </div>
  );
};

export default BoardLayoutSelector;
