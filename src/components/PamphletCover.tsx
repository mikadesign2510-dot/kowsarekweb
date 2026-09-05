import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  GraduationCap, 
  User, 
  Layers, 
  Bookmark, 
  FileText, 
  Check, 
  Palette,
  Compass,
  Award,
  Maximize2
} from 'lucide-react';
import { FormItem } from '../lib/storage';

export interface FrameStyleConfig {
  id: string;
  name: string;
  description: string;
  badge: string;
  icon: any;
}

export interface ColorPresetConfig {
  id: string;
  name: string;
  gradient: string;
  accent: string;
  bgLight: string;
  borderLight: string;
  textDark: string;
}

export const PAMPHLET_FRAME_STYLES: FrameStyleConfig[] = [
  {
    id: 'isometric-3d',
    name: 'کتاب سه‌بعدی شناور (3D Isometric)',
    description: 'پرسپکتیو واقعی با عطف کتاب، عمق لایه‌ها و صفحات عطف‌دار',
    badge: 'سه‌بعدی ویژه',
    icon: Layers,
  },
  {
    id: 'royal-gold',
    name: 'تذهیب و کادر زرین آکادمیک (Royal Gold)',
    description: 'کادربندی اسلیمی طلایی با اصالت دانشگاهی و حاشیه‌های پرنقش',
    badge: 'طلایی سلطنتی',
    icon: Award,
  },
  {
    id: 'spiral-notebook',
    name: 'دفترچه و جزوه سیمی (Spiral Binder)',
    description: 'سوراخ‌های فنردار فلزی، خط پانچ عطف و بافت کاغذ دانشجویی',
    badge: 'فنردار کاربردی',
    icon: Bookmark,
  },
  {
    id: 'modern-glass',
    name: 'جلد بلورین شیشه‌ای (Glassmorphism)',
    description: 'انعکاس نور و افکت شیشه مات نئونی مدرن با حاشیه‌های لایت',
    badge: 'شیشه‌ای مدرن',
    icon: Sparkles,
  },
  {
    id: 'classic-book',
    name: 'کتاب کلاسیک دانشگاهی (Classic Bound)',
    description: 'جلد گالینگور آکادمیک با نوار چرمی و نشان برجسته دانشگاه',
    badge: 'کلاسیک گالینگور',
    icon: BookOpen,
  },
  {
    id: 'blueprint-tech',
    name: 'پلان مهندسی و شاسی فنی (Blueprint)',
    description: 'شبکه شطرنجی مدرن، خطوط خط‌کش و کادربندی فنی مهندسی',
    badge: 'مهندسی و فنی',
    icon: Compass,
  },
  {
    id: 'magazine-pro',
    name: 'ژورنال علمی تخصصی (Scientific Journal)',
    description: 'سربرگ پرستیژ تمام‌عرض با شماره انتشار و شناسه استاندارد',
    badge: 'ژورنال آکادمیک',
    icon: FileText,
  },
  {
    id: 'minimal-card',
    name: 'مینیمال مدرن (Clean Minimal)',
    description: 'طراحی خلوت با نوار رنگی کناری و تایپوگرافی بولد باکلاس',
    badge: 'مینیمال شیک',
    icon: Maximize2,
  },
];

export const PAMPHLET_COLOR_PRESETS: ColorPresetConfig[] = [
  {
    id: 'indigo',
    name: 'لاجوردی و نیلی دانشگاهی',
    gradient: 'from-indigo-600 via-indigo-700 to-slate-900',
    accent: '#4f46e5',
    bgLight: 'bg-indigo-50/70',
    borderLight: 'border-indigo-200',
    textDark: 'text-indigo-900',
  },
  {
    id: 'blue',
    name: 'آبی اقیانوسی و درباری',
    gradient: 'from-blue-600 via-sky-700 to-slate-900',
    accent: '#2563eb',
    bgLight: 'bg-blue-50/70',
    borderLight: 'border-blue-200',
    textDark: 'text-blue-900',
  },
  {
    id: 'emerald',
    name: 'زمردی و یشمی آکادمیک',
    gradient: 'from-emerald-600 via-teal-700 to-slate-950',
    accent: '#059669',
    bgLight: 'bg-emerald-50/70',
    borderLight: 'border-emerald-200',
    textDark: 'text-emerald-900',
  },
  {
    id: 'amber',
    name: 'طلایی کهربایی و برنزی',
    gradient: 'from-amber-500 via-yellow-600 to-amber-950',
    accent: '#d97706',
    bgLight: 'bg-amber-50/70',
    borderLight: 'border-amber-200',
    textDark: 'text-amber-900',
  },
  {
    id: 'rose',
    name: 'یاقوتی و زرشکی نفیس',
    gradient: 'from-rose-600 via-red-700 to-slate-950',
    accent: '#e11d48',
    bgLight: 'bg-rose-50/70',
    borderLight: 'border-rose-200',
    textDark: 'text-rose-900',
  },
  {
    id: 'purple',
    name: 'ارغوانی و شفق بنفش',
    gradient: 'from-purple-600 via-violet-700 to-slate-950',
    accent: '#9333ea',
    bgLight: 'bg-purple-50/70',
    borderLight: 'border-purple-200',
    textDark: 'text-purple-900',
  },
  {
    id: 'cyan',
    name: 'فیروزه‌ای و اطلسی اصیل',
    gradient: 'from-cyan-600 via-teal-700 to-slate-900',
    accent: '#0891b2',
    bgLight: 'bg-cyan-50/70',
    borderLight: 'border-cyan-200',
    textDark: 'text-cyan-900',
  },
  {
    id: 'slate',
    name: 'مشکی کربن و متالیک',
    gradient: 'from-slate-700 via-slate-800 to-slate-950',
    accent: '#334155',
    bgLight: 'bg-slate-100',
    borderLight: 'border-slate-300',
    textDark: 'text-slate-900',
  },
];

export function getPamphletColor(colorId?: string): ColorPresetConfig {
  const found = PAMPHLET_COLOR_PRESETS.find(c => c.id === colorId);
  return found || PAMPHLET_COLOR_PRESETS[0];
}

interface PamphletCoverVisualProps {
  item: Partial<FormItem>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PamphletCoverVisual: React.FC<PamphletCoverVisualProps> = ({
  item,
  size = 'md',
  className = '',
}) => {
  const frameStyle = item.frameStyle || 'isometric-3d';
  const colorConfig = getPamphletColor(item.frameColor);

  const title = item.title || 'عنوان جزوه آموزشی';
  const professor = item.professorName || 'نام استاد درس';
  const courseCode = item.courseCode || 'BOK-101';
  const major = item.fieldOfStudy || 'مهندسی کامپیوتر';
  const pageCount = item.pageCount || '۶۴ صفحه';

  // Sizing styles
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  // Height and aspect
  const containerHeight = isSm ? 'h-40' : isLg ? 'h-80' : 'h-52';

  // 1. ISOMETRIC 3D BOOK
  if (frameStyle === 'isometric-3d') {
    return (
      <div className={`relative flex items-center justify-center p-3 select-none ${containerHeight} ${className}`}>
        {/* Shadow */}
        <div className="absolute inset-x-4 bottom-2 h-6 bg-slate-950/20 rounded-full blur-md transform -skew-x-12" />
        
        {/* 3D Book wrapper */}
        <div 
          className="relative w-full h-full max-w-[240px] rounded-2xl p-3 sm:p-4 text-white flex flex-col justify-between overflow-hidden shadow-2xl transition-transform group-hover:scale-[1.02] duration-300"
          style={{
            background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
          }}
        >
          {/* Background gradient from colorConfig */}
          <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.gradient}`} />
          
          {/* Book Spine (Left side) */}
          <div className="absolute right-0 top-0 bottom-0 w-3.5 sm:w-4 bg-black/25 border-l border-white/20 flex flex-col items-center justify-between py-2 shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="text-[8px] font-mono text-white/70 rotate-90 whitespace-nowrap tracking-wider">
              {courseCode}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          </div>

          {/* Book Pages thickness illusion */}
          <div className="absolute left-0.5 top-2 bottom-2 w-1.5 bg-amber-50 rounded-l-sm border-r border-slate-300 shadow-sm opacity-85 flex flex-col justify-around py-1">
            <div className="w-full h-px bg-slate-300" />
            <div className="w-full h-px bg-slate-300" />
            <div className="w-full h-px bg-slate-300" />
          </div>

          {/* Subtle light reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />

          {/* Content inside cover */}
          <div className="relative z-10 mr-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-sm border border-white/25">
                جزوه دانشگاهی
              </span>
              <span className="text-[9px] font-mono text-white/80 font-bold">
                {courseCode}
              </span>
            </div>
            <h4 className={`font-black line-clamp-2 leading-tight drop-shadow-sm text-white ${isSm ? 'text-xs' : isLg ? 'text-lg' : 'text-sm'}`}>
              {title}
            </h4>
          </div>

          {/* Footer of cover */}
          <div className="relative z-10 mr-4 pt-2 border-t border-white/20 space-y-1">
            <div className="flex items-center gap-1 text-[10px] text-white/90 font-bold truncate">
              <User className="w-3 h-3 shrink-0" />
              <span>{professor}</span>
            </div>
            <div className="flex items-center justify-between text-[9px] text-white/75 font-medium">
              <span className="truncate max-w-[120px]">{major}</span>
              <span className="bg-black/30 px-1.5 py-0.5 rounded text-[8px] font-bold">{pageCount}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. ROYAL GOLD FRAME
  if (frameStyle === 'royal-gold') {
    return (
      <div className={`relative flex items-center justify-center p-3 select-none ${containerHeight} ${className}`}>
        <div className={`relative w-full h-full max-w-[240px] rounded-2xl p-3 sm:p-4 text-white flex flex-col justify-between overflow-hidden shadow-xl border-2 border-amber-400/80 bg-gradient-to-br ${colorConfig.gradient}`}>
          {/* Persian Royal Decorative Border */}
          <div className="absolute inset-1.5 border border-amber-300/40 rounded-xl pointer-events-none flex flex-col justify-between p-1">
            <div className="flex justify-between text-amber-300 text-[10px] font-mono opacity-80">
              <span>✦</span>
              <span>✦</span>
            </div>
            <div className="flex justify-between text-amber-300 text-[10px] font-mono opacity-80">
              <span>✦</span>
              <span>✦</span>
            </div>
          </div>

          <div className="relative z-10 space-y-1.5">
            <div className="flex items-center justify-between text-amber-300 text-[9px] font-black">
              <span className="flex items-center gap-1 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/40">
                <Award className="w-3 h-3 text-amber-300" />
                نسخه مصوب دانشگاه
              </span>
              <span className="font-mono text-amber-200">{courseCode}</span>
            </div>
            <h4 className={`font-black text-amber-50 line-clamp-2 leading-tight ${isSm ? 'text-xs' : isLg ? 'text-lg' : 'text-sm'}`}>
              {title}
            </h4>
          </div>

          <div className="relative z-10 pt-2 border-t border-amber-300/30 space-y-1">
            <div className="flex items-center gap-1 text-[10px] text-amber-100 font-bold truncate">
              <User className="w-3 h-3 text-amber-300 shrink-0" />
              <span>{professor}</span>
            </div>
            <div className="flex items-center justify-between text-[9px] text-amber-200/80 font-medium">
              <span className="truncate max-w-[120px]">{major}</span>
              <span className="bg-amber-950/50 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30 font-bold text-[8px]">
                {pageCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. SPIRAL BINDER NOTEBOOK
  if (frameStyle === 'spiral-notebook') {
    return (
      <div className={`relative flex items-center justify-center p-3 select-none ${containerHeight} ${className}`}>
        <div className={`relative w-full h-full max-w-[240px] rounded-2xl p-3 sm:p-4 text-white flex flex-col justify-between overflow-hidden shadow-xl border border-slate-300 bg-gradient-to-br ${colorConfig.gradient}`}>
          
          {/* Spiral Wire Rings on top or right side */}
          <div className="absolute right-2 top-0 bottom-0 w-4 flex flex-col justify-around py-3 z-20 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-white/40 shadow-inner" />
                <div className="w-3 h-1 bg-gradient-to-r from-slate-200 via-white to-slate-400 rounded-r shadow -mr-1" />
              </div>
            ))}
          </div>

          {/* Dotted Notebook Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }} 
          />

          <div className="relative z-10 mr-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black px-2 py-0.5 rounded bg-black/30 border border-white/20">
                دفترچه و جزوه کلاسی
              </span>
              <span className="text-[9px] font-mono text-white/80">{courseCode}</span>
            </div>
            <h4 className={`font-black line-clamp-2 leading-tight text-white ${isSm ? 'text-xs' : isLg ? 'text-lg' : 'text-sm'}`}>
              {title}
            </h4>
          </div>

          <div className="relative z-10 mr-5 pt-2 border-t border-white/20 space-y-1">
            <div className="flex items-center gap-1 text-[10px] text-white/90 font-bold truncate">
              <User className="w-3 h-3 text-white/80 shrink-0" />
              <span>{professor}</span>
            </div>
            <div className="flex items-center justify-between text-[9px] text-white/80 font-medium">
              <span className="truncate max-w-[110px]">{major}</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[8px] font-bold">{pageCount}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. MODERN GLASSMORPHISM
  if (frameStyle === 'modern-glass') {
    return (
      <div className={`relative flex items-center justify-center p-3 select-none ${containerHeight} ${className}`}>
        <div className={`relative w-full h-full max-w-[240px] rounded-3xl p-3.5 sm:p-4 text-white flex flex-col justify-between overflow-hidden shadow-2xl border border-white/30 bg-gradient-to-br ${colorConfig.gradient} backdrop-blur-xl`}>
          
          {/* Glass Neon Glow Balls */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-black/30 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-sm">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                منبع مدرن
              </span>
              <span className="text-[9px] font-mono text-white/80 font-bold">{courseCode}</span>
            </div>
            <h4 className={`font-black line-clamp-2 leading-tight text-white drop-shadow ${isSm ? 'text-xs' : isLg ? 'text-lg' : 'text-sm'}`}>
              {title}
            </h4>
          </div>

          <div className="relative z-10 pt-2 border-t border-white/25 space-y-1 bg-white/10 backdrop-blur-md -mx-3.5 -mb-3.5 p-3 rounded-b-2xl border-b border-white/20">
            <div className="flex items-center gap-1 text-[10px] text-white font-bold truncate">
              <User className="w-3 h-3 text-white/80 shrink-0" />
              <span>{professor}</span>
            </div>
            <div className="flex items-center justify-between text-[9px] text-white/80 font-medium">
              <span className="truncate max-w-[120px]">{major}</span>
              <span className="bg-black/30 text-white px-1.5 py-0.5 rounded text-[8px] font-bold">{pageCount}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. BLUEPRINT TECH
  if (frameStyle === 'blueprint-tech') {
    return (
      <div className={`relative flex items-center justify-center p-3 select-none ${containerHeight} ${className}`}>
        <div className={`relative w-full h-full max-w-[240px] rounded-xl p-3 sm:p-4 text-white flex flex-col justify-between overflow-hidden shadow-xl border-2 border-cyan-400/60 bg-gradient-to-br ${colorConfig.gradient}`}>
          
          {/* Engineering Grid */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none" 
            style={{
              backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }} 
          />

          <div className="relative z-10 space-y-1">
            <div className="flex items-center justify-between text-cyan-200">
              <span className="font-mono text-[9px] font-bold border border-cyan-300/40 px-1.5 py-0.5 rounded bg-cyan-950/40">
                [TECH-DOC]
              </span>
              <span className="font-mono text-[9px] text-cyan-200">{courseCode}</span>
            </div>
            <h4 className={`font-mono font-black line-clamp-2 leading-tight text-white ${isSm ? 'text-xs' : isLg ? 'text-lg' : 'text-sm'}`}>
              {title}
            </h4>
          </div>

          <div className="relative z-10 pt-2 border-t border-cyan-400/30 space-y-1">
            <div className="flex items-center gap-1 text-[10px] text-cyan-100 font-bold truncate">
              <Compass className="w-3 h-3 text-cyan-300 shrink-0" />
              <span>{professor}</span>
            </div>
            <div className="flex items-center justify-between text-[9px] text-cyan-200/80 font-medium">
              <span className="truncate max-w-[120px]">{major}</span>
              <span className="bg-cyan-950/60 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-400/30 text-[8px] font-bold font-mono">
                {pageCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. MAGAZINE PRO / SCIENTIFIC JOURNAL
  if (frameStyle === 'magazine-pro') {
    return (
      <div className={`relative flex items-center justify-center p-3 select-none ${containerHeight} ${className}`}>
        <div className={`relative w-full h-full max-w-[240px] rounded-2xl text-slate-800 flex flex-col justify-between overflow-hidden shadow-xl border border-slate-200 bg-white`}>
          
          {/* Top Magazine Header */}
          <div className={`p-2.5 text-white bg-gradient-to-r ${colorConfig.gradient} flex items-center justify-between`}>
            <span className="text-[9px] font-black tracking-wider">JOURNAL & HANDOUT</span>
            <span className="text-[8px] font-mono bg-black/25 px-1.5 py-0.5 rounded">{courseCode}</span>
          </div>

          <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-center">
            <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-slate-500" />
              {major}
            </span>
            <h4 className={`font-black text-slate-900 line-clamp-2 leading-tight ${isSm ? 'text-xs' : isLg ? 'text-base' : 'text-xs'}`}>
              {title}
            </h4>
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-600 font-bold">
            <span className="truncate max-w-[120px]">{professor}</span>
            <span className="text-slate-500 font-mono text-[8px]">{pageCount}</span>
          </div>
        </div>
      </div>
    );
  }

  // 7. CLASSIC BOUND BOOK (Default fallback)
  return (
    <div className={`relative flex items-center justify-center p-3 select-none ${containerHeight} ${className}`}>
      <div className={`relative w-full h-full max-w-[240px] rounded-2xl p-3.5 sm:p-4 text-white flex flex-col justify-between overflow-hidden shadow-xl border border-white/20 bg-gradient-to-br ${colorConfig.gradient}`}>
        
        {/* Left Spine leather line */}
        <div className="absolute right-0 top-0 bottom-0 w-3 bg-black/30 border-l border-white/10" />

        <div className="relative z-10 mr-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold bg-white/20 px-1.5 py-0.5 rounded">
              دانشگاه جامع علمی کاربردی
            </span>
            <span className="font-mono text-[9px] text-white/80">{courseCode}</span>
          </div>
          <h4 className={`font-black line-clamp-2 leading-tight text-white ${isSm ? 'text-xs' : isLg ? 'text-lg' : 'text-sm'}`}>
            {title}
          </h4>
        </div>

        <div className="relative z-10 mr-3 pt-2 border-t border-white/20 space-y-1">
          <div className="flex items-center gap-1 text-[10px] text-white/90 font-bold truncate">
            <User className="w-3 h-3 text-white/75 shrink-0" />
            <span>{professor}</span>
          </div>
          <div className="flex items-center justify-between text-[9px] text-white/75 font-medium">
            <span className="truncate max-w-[120px]">{major}</span>
            <span className="bg-black/25 px-1.5 py-0.5 rounded text-[8px] font-bold">{pageCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PamphletFramePickerProps {
  selectedStyle?: string;
  selectedColor?: string;
  onStyleChange: (styleId: string) => void;
  onColorChange: (colorId: string) => void;
  formData: Partial<FormItem>;
}

export const PamphletFramePicker: React.FC<PamphletFramePickerProps> = ({
  selectedStyle = 'isometric-3d',
  selectedColor = 'indigo',
  onStyleChange,
  onColorChange,
  formData,
}) => {
  return (
    <div className="space-y-6 bg-slate-50/80 p-4 sm:p-6 rounded-3xl border border-slate-200">
      
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800">طرح قاب و رنگ جلد جزوه</h3>
            <p className="text-xs text-slate-500">انتخاب استایل ۳بعدی، فریم جلد و تم رنگی اختصاصی برای نمایش در پرتال دانشجویان</p>
          </div>
        </div>
        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg self-start sm:self-auto">
          {PAMPHLET_FRAME_STYLES.find(f => f.id === selectedStyle)?.name || 'پیش‌فرض'}
        </span>
      </div>

      {/* Live Preview & Color Selection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Live Preview Visual */}
        <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <span className="text-[11px] font-bold text-slate-400 mb-2">پیش‌نمایش زنده جلد جزوه:</span>
          <div className="w-full">
            <PamphletCoverVisual 
              item={{
                ...formData,
                frameStyle: selectedStyle,
                frameColor: selectedColor,
              }}
              size="md"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2 text-center font-medium">
            این طرح و رنگ به عنوان کاور رسمی و کارت در پرتال دانشجویان نمایش داده می‌شود.
          </p>
        </div>

        {/* Color Palette Selector */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-700 mb-2">
              پالت رنگی جلد (Color Palette):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PAMPHLET_COLOR_PRESETS.map((color) => {
                const isSelected = selectedColor === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => onColorChange(color.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-right transition-all border ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div 
                      className={`w-6 h-6 rounded-lg shrink-0 shadow-sm bg-gradient-to-br ${color.gradient} flex items-center justify-center text-white`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 truncate">
                      {color.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Frame Styles Grid */}
      <div className="space-y-3 pt-2">
        <label className="block text-xs font-black text-slate-700">
          انتخاب سبک و طرح قاب جزوه (Frame Style):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PAMPHLET_FRAME_STYLES.map((frame) => {
            const isSelected = selectedStyle === frame.id;
            const FrameIcon = frame.icon;
            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => onStyleChange(frame.id)}
                className={`p-3.5 rounded-2xl text-right transition-all border flex flex-col justify-between relative group ${
                  isSelected
                    ? 'border-indigo-600 bg-white shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }`}>
                      <FrameIcon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                        انتخاب شده
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-black text-slate-900 mb-1">
                    {frame.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-light">
                    {frame.description}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-indigo-600">
                  <span>{frame.badge}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
