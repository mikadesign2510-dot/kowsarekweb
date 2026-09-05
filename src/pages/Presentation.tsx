import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, ChevronUp, ChevronRight, ChevronLeft, Sparkles, Award, ShieldCheck, Bookmark, 
  Compass, Camera, Layers, CheckCircle2, Star, Gem, 
  Stamp, BookOpen, Ruler, QrCode, Crosshair, Flame, Home, ArrowLeft, ArrowRight
} from 'lucide-react';
import { storage, PresentationSection, PresentationFrameStyle, defaultPresentationSections } from '../lib/storage';

export default function Presentation() {
  const [sections, setSections] = useState<PresentationSection[]>(() => {
    const data = storage.getPresentationSections().filter(s => s.isVisible);
    return data.length > 0 ? data.sort((a, b) => a.order - b.order) : defaultPresentationSections;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const isScrollingRef = useRef(false);
  const touchStart = useRef(0);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const updateFromStorage = () => {
      const data = storage.getPresentationSections().filter(s => s.isVisible);
      const finalSections = data.length > 0 ? data.sort((a, b) => a.order - b.order) : defaultPresentationSections;
      setSections(finalSections);
    };

    updateFromStorage();
    
    // Fetch latest sections from PostgreSQL database
    storage.syncPresentationWithDB().then(dbData => {
      if (dbData && dbData.length > 0) {
        const visible = dbData.filter(s => s.isVisible);
        setSections(visible.length > 0 ? visible.sort((a, b) => a.order - b.order) : defaultPresentationSections);
      }
    });

    const handlePresentationChange = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        const visible = e.detail.filter((s: PresentationSection) => s.isVisible);
        setSections(visible.length > 0 ? visible.sort((a: PresentationSection, b: PresentationSection) => a.order - b.order) : defaultPresentationSections);
      } else {
        updateFromStorage();
      }
    };

    window.addEventListener('kowsar_presentation_changed', handlePresentationChange);
    return () => {
      window.removeEventListener('kowsar_presentation_changed', handlePresentationChange);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const navigateSlide = (dir: number) => {
    if (isScrollingRef.current) return;
    
    const current = currentIndexRef.current;
    
    if (dir === 1 && current < sections.length - 1) {
      isScrollingRef.current = true;
      setDirection(1);
      setCurrentIndex(current + 1);
      setTimeout(() => { isScrollingRef.current = false; }, 800);
    } else if (dir === -1 && current > 0) {
      isScrollingRef.current = true;
      setDirection(-1);
      setCurrentIndex(current - 1);
      setTimeout(() => { isScrollingRef.current = false; }, 800);
    }
  };

  const jumpToSlide = (idx: number) => {
    if (idx === currentIndex || isScrollingRef.current) return;
    setDirection(idx > currentIndex ? 1 : -1);
    isScrollingRef.current = true;
    setCurrentIndex(idx);
    setTimeout(() => { isScrollingRef.current = false; }, 800);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 30) {
        navigateSlide(e.deltaY > 0 ? 1 : -1);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'ArrowLeft' || e.key === ' ') {
        e.preventDefault();
        navigateSlide(1);
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'ArrowRight') {
        e.preventDefault();
        navigateSlide(-1);
      }
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sections.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart.current - touchEnd;
    if (Math.abs(diff) > 40) {
      navigateSlide(diff > 0 ? 1 : -1);
    }
  };

  if (sections.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-bold text-lg">در حال بارگذاری محتوا...</p>
      </div>
    );
  }

  const slideVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? '100%' : '-100%',
      zIndex: 1,
    }),
    center: {
      y: 0,
      zIndex: 1,
      transition: {
        duration: 0.9,
        ease: [0.65, 0, 0.35, 1]
      }
    },
    exit: (dir: number) => ({
      y: dir > 0 ? '-100%' : '100%',
      zIndex: 0,
      transition: {
        duration: 0.9,
        ease: [0.65, 0, 0.35, 1]
      }
    })
  };

  return (
    <div 
      className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-slate-900 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Floating Bar - Home Link only */}
      <div className="absolute top-4 right-4 sm:right-8 z-50 pointer-events-auto">
        <Link
          to="/"
          className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-xs font-bold transition-all shadow-lg cursor-pointer"
        >
          <Home className="w-3.5 h-3.5 text-blue-400" />
          <span>صفحه اصلی</span>
        </Link>
      </div>

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          <PresentationBlock 
            section={sections[currentIndex]} 
            index={currentIndex} 
            isLast={currentIndex === sections.length - 1} 
          />
        </motion.div>
      </AnimatePresence>

      {/* Right Side Dots Navigation */}
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {sections.map((sec, i) => (
          <button
            key={sec.id || i}
            onClick={() => jumpToSlide(i)}
            title={sec.title}
            className={`group relative flex items-center justify-end transition-all duration-300 cursor-pointer p-1.5`}
          >
            {/* Tooltip on Hover */}
            <span className="absolute right-full mr-3 whitespace-nowrap bg-slate-900/90 backdrop-blur-md text-white border border-white/20 text-[11px] font-bold px-3 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
              {sec.title}
            </span>
            <span 
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-3.5 h-3.5 bg-blue-400 ring-4 ring-blue-500/30' : 'w-2.5 h-2.5 bg-white/30 group-hover:bg-white/70'
              }`} 
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// Visual Frame Customizer Component for Presentation Images
function RenderPresentationImageFrame({ 
  section, 
  index 
}: { 
  section: PresentationSection; 
  index: number; 
}) {
  const frameStyle: PresentationFrameStyle = section.frameStyle || 'floating-isometric';
  
  // Overlay customization settings
  const showOverlay = section.showOverlayText !== false;
  const badgeText = section.frameBadgeText !== undefined ? section.frameBadgeText.trim() : (section.subtitle || 'دانشگاه علمی کاربردی کوثر');
  const secondaryText = section.overlaySubtitle !== undefined ? section.overlaySubtitle.trim() : '';

  const getOverlayPosClasses = (pos?: string) => {
    switch (pos) {
      case 'top-left':
        return 'top-3 sm:top-4 left-3 sm:left-4 items-start text-left';
      case 'bottom-right':
        return 'bottom-3 sm:bottom-4 right-3 sm:right-4 items-end text-right';
      case 'bottom-left':
        return 'bottom-3 sm:bottom-4 left-3 sm:left-4 items-start text-left';
      case 'top-center':
        return 'top-3 sm:top-4 left-1/2 -translate-x-1/2 items-center text-center';
      case 'bottom-center':
        return 'bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 items-center text-center';
      case 'top-right':
      default:
        return 'top-3 sm:top-4 right-3 sm:right-4 items-end text-right';
    }
  };

  const getOverlayStyleClasses = (style?: string) => {
    switch (style) {
      case 'gold':
        return 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-black border-amber-200/90 shadow-xl shadow-amber-950/40';
      case 'glass':
        return 'bg-white/25 backdrop-blur-xl border-white/50 text-white shadow-2xl';
      case 'neon':
        return 'bg-slate-950/90 backdrop-blur-md border-cyan-400/80 text-cyan-300 shadow-xl shadow-cyan-950/70 font-mono';
      case 'dark':
        return 'bg-slate-950/90 backdrop-blur-md border-slate-700/80 text-white shadow-xl';
      case 'minimal':
        return 'bg-black/60 backdrop-blur-xs text-white border-white/20';
      case 'badge':
      default:
        return 'bg-slate-900/90 backdrop-blur-md border-slate-700/80 text-white shadow-xl';
    }
  };

  // Helper to render user-customized badge overlay with chosen position & style
  const renderOverlayBadge = (defaultPos = 'top-right', defaultStyle = 'badge', customIcon?: React.ReactNode) => {
    if (!showOverlay || (!badgeText && !secondaryText)) return null;
    const currentPos = section.overlayPosition || defaultPos;
    const currentStyle = section.overlayStyle || defaultStyle;
    const posClass = getOverlayPosClasses(currentPos);
    const styleClass = getOverlayStyleClasses(currentStyle);

    return (
      <div className={`absolute ${posClass} z-20 flex flex-col gap-1 max-w-[85%]`}>
        {badgeText && (
          <div className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border text-[11px] sm:text-xs flex items-center gap-1.5 shadow-xl transition-all ${styleClass}`}>
            {customIcon || <Sparkles className="w-3.5 h-3.5 shrink-0 opacity-85" />}
            <span className="font-bold truncate">{badgeText}</span>
          </div>
        )}
        {secondaryText && (
          <div className="bg-black/75 backdrop-blur-md border border-white/20 text-white/95 text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-lg shadow-md truncate max-w-full">
            {secondaryText}
          </div>
        )}
      </div>
    );
  };

  switch (frameStyle) {
    // 1. Modern Glass Card with Neon Ring & Reflection
    case 'glass-card':
      return (
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-[32px] blur-xl opacity-40 group-hover:opacity-75 transition-opacity duration-500" />
          <div className="relative rounded-[28px] p-2 bg-white/10 backdrop-blur-xl border border-white/30 shadow-2xl overflow-hidden">
            <div className="rounded-[22px] overflow-hidden aspect-[16/10] sm:aspect-[21/10] relative">
              <img 
                src={section.image} 
                alt={section.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-white/10" />
              {renderOverlayBadge('top-right', 'glass')}
            </div>
          </div>
        </div>
      );

    // 2. Golden Luxury Academy Gallery Frame
    case 'golden-gallery':
      return (
        <div className="relative group p-3 bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 rounded-[30px] shadow-2xl shadow-amber-900/30">
          <div className="p-1 bg-slate-950 rounded-[26px]">
            <div className="relative rounded-[22px] overflow-hidden aspect-[16/10] sm:aspect-[21/10] border-2 border-amber-300/40">
              <img 
                src={section.image} 
                alt={section.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-amber-500/10" />
              {renderOverlayBadge('top-right', 'gold', <Award className="w-3.5 h-3.5 text-slate-950" />)}
            </div>
          </div>
        </div>
      );

    // 3. Diagonal Cut Geometric Frame
    case 'geometric-cut':
      return (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-tr from-rose-500 to-indigo-600 rounded-3xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-500 opacity-70 blur-xs" />
          <div className="relative bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-2.5 shadow-2xl overflow-hidden">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[21/10]">
              <img 
                src={section.image} 
                alt={section.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/70 via-transparent to-transparent" />
              {renderOverlayBadge('bottom-right', 'badge', <Compass className="w-3.5 h-3.5" />)}
            </div>
          </div>
        </div>
      );

    // 4. Cinematic Glow Ultra-Wide Frame
    case 'cinematic-glow':
      return (
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-600/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700" />
          <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-2 ring-white/20 bg-slate-900 aspect-[16/9] sm:aspect-[21/9]">
            <img 
              src={section.image} 
              alt={section.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
            {renderOverlayBadge('top-right', 'dark')}
          </div>
        </div>
      );

    // 5. Minimalist Polaroid with Pin/Label
    case 'minimal-polaroid':
      return (
        <div className="relative group bg-white p-3.5 pb-5 rounded-2xl shadow-2xl shadow-black/50 transform rotate-1 group-hover:rotate-0 transition-transform duration-500 max-w-md mx-auto">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-rose-500 shadow-md border-2 border-white flex items-center justify-center text-white z-20">
            <Bookmark className="w-4 h-4" />
          </div>
          <div className="rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200 relative mb-3">
            <img 
              src={section.image} 
              alt={section.title}
              className="w-full h-full object-cover"
            />
            {showOverlay && (badgeText || secondaryText) && (
              <div className="absolute bottom-2 right-2 left-2 flex justify-between items-center text-[10px] bg-slate-950/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg">
                <span className="font-bold truncate">{badgeText}</span>
                {secondaryText && <span className="opacity-80 truncate">{secondaryText}</span>}
              </div>
            )}
          </div>
          <div className="text-center px-2">
            <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">{section.title}</p>
            {showOverlay && (badgeText || secondaryText) && (
              <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{secondaryText || badgeText}</p>
            )}
          </div>
        </div>
      );

    // 6. Academic Corporate Slate with Status Bar
    case 'academic-slate':
      return (
        <div className="relative group bg-slate-900 border border-slate-700 rounded-3xl p-3 shadow-2xl">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            {showOverlay && (
              <div className="text-[10px] font-bold text-slate-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                <span>{secondaryText || 'KOWSAR_CAMPUS_PORTAL'}</span>
              </div>
            )}
            {showOverlay && badgeText && (
              <span className="text-[10px] text-slate-400 font-bold truncate max-w-[150px]">{badgeText}</span>
            )}
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[21/10]">
            <img 
              src={section.image} 
              alt={section.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            {renderOverlayBadge('bottom-right', 'dark')}
          </div>
        </div>
      );

    // 7. Cyber Tech HUD Frame
    case 'cyber-tech':
      return (
        <div className="relative group">
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400 z-20" />
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400 z-20" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400 z-20" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400 z-20" />
          
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/30 p-1 shadow-2xl shadow-cyan-950/50">
            <div className="relative rounded-xl overflow-hidden aspect-[16/10] sm:aspect-[21/10]">
              <img 
                src={section.image} 
                alt={section.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/80 via-transparent to-transparent" />
              {renderOverlayBadge('bottom-right', 'neon')}
            </div>
          </div>
        </div>
      );

    // 8. Emerald Prestige - Persian Turquoise & Emerald with Golden Inscription
    case 'emerald-prestige':
      return (
        <div className="relative group p-3 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-900 rounded-[32px] shadow-2xl shadow-emerald-950/60 border border-emerald-400/30">
          <div className="p-1 bg-slate-950 rounded-[28px] relative overflow-hidden">
            <div className="relative rounded-[24px] overflow-hidden aspect-[16/10] sm:aspect-[21/10] border-2 border-emerald-400/50">
              <img 
                src={section.image} 
                alt={section.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-teal-500/10" />
              {renderOverlayBadge('top-right', 'glass', <Gem className="w-3.5 h-3.5 text-amber-300" />)}
            </div>
          </div>
        </div>
      );

    // 9. Vintage University Stamp with Perforated Edge & Seal
    case 'stamp-vintage':
      return (
        <div className="relative group max-w-xl mx-auto p-4 bg-amber-50 rounded-2xl shadow-2xl shadow-black/40 border-4 border-dashed border-amber-800/40 transform -rotate-1 group-hover:rotate-0 transition-transform duration-500">
          <div className="relative rounded-xl overflow-hidden aspect-[16/10] sm:aspect-[21/10] border-2 border-amber-900/20 bg-stone-900">
            <img 
              src={section.image} 
              alt={section.title}
              className="w-full h-full object-cover sepia-[0.15] contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-950/70 via-transparent to-transparent" />
            
            {/* Official Stamp Wax Seal */}
            {showOverlay && (
              <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-full bg-amber-800 text-amber-100 border-4 border-amber-100 flex flex-col items-center justify-center shadow-2xl rotate-12 group-hover:rotate-0 transition-transform">
                <Stamp className="w-6 h-6 text-amber-200" />
                <span className="text-[8px] font-black tracking-widest mt-0.5 truncate max-w-[60px]">
                  {secondaryText || 'مُهر اصالت'}
                </span>
              </div>
            )}
            
            {showOverlay && badgeText && (
              <div className="absolute top-3 left-3 bg-amber-900/90 text-amber-100 text-[10px] font-mono font-bold px-3 py-1 rounded-lg border border-amber-600/40 shadow-md">
                {badgeText}
              </div>
            )}
          </div>
          {showOverlay && (
            <div className="mt-2.5 flex items-center justify-between text-amber-900/70 text-[11px] font-bold px-1">
              <span>{secondaryText || 'سند رسمی دانشگاهی'}</span>
              <span className="font-mono">NO. KW-{section.order + 100}</span>
            </div>
          )}
        </div>
      );

    // 10. Ribbon Spotlight - Stage Honors & Medals
    case 'ribbon-spotlight':
      return (
        <div className="relative group">
          {/* Spotlight background glow */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-400/20 blur-3xl rounded-full" />
          
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border-2 border-amber-500/50 shadow-2xl p-2">
            {/* Silk Ribbon */}
            {showOverlay && badgeText && (
              <div className="absolute -top-1 right-6 z-20 bg-gradient-to-b from-rose-600 to-red-700 text-white px-3 py-2 rounded-b-xl shadow-lg border-b-2 border-amber-300 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span className="text-[10px] font-black">{badgeText}</span>
              </div>
            )}

            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[21/10]">
              <img 
                src={section.image} 
                alt={section.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80" />
              {showOverlay && secondaryText && (
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-bold px-4 py-1.5 rounded-xl flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>{secondaryText}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    // 11. Academic Journal Magazine Cover Style
    case 'magazine-cover':
      return (
        <div className="relative group bg-slate-950 p-3 rounded-3xl border-2 border-indigo-500/40 shadow-2xl shadow-indigo-950/70">
          {/* Top Journal Header Bar */}
          {showOverlay && (
            <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-indigo-950/80 rounded-xl border border-indigo-500/30 text-indigo-200">
              <div className="flex items-center gap-1.5 text-[11px] font-black">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>{secondaryText || 'فصلنامه علمی پژوهشی دانشگاه'}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-indigo-300">ISSN: 2476-8804</span>
            </div>
          )}

          <div className="relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[21/10]">
            <img 
              src={section.image} 
              alt={section.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            {renderOverlayBadge('bottom-right', 'badge')}
          </div>
        </div>
      );

    // 12. Blueprint Architecture & Engineering Grid
    case 'blueprint-arch':
      return (
        <div className="relative group bg-blue-950 p-3 rounded-3xl border-2 border-sky-400/60 shadow-2xl shadow-blue-950/80">
          {/* Blueprint Grid Watermark Header */}
          {showOverlay && (
            <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-blue-900/60 rounded-xl border border-sky-400/30 text-sky-200 font-mono text-[10px]">
              <div className="flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-sky-400" />
                <span>{secondaryText || 'ENGINEERING_BLUEPRINT // SCALE 1:100'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Crosshair className="w-3 h-3 text-sky-300 animate-spin" style={{ animationDuration: '8s' }} />
                <span>COORDS: 28.32° N, 51.52° E</span>
              </div>
            </div>
          )}

          <div className="relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[21/10] border border-sky-400/40">
            <img 
              src={section.image} 
              alt={section.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-blue-900/30 mix-blend-multiply pointer-events-none" />
            {renderOverlayBadge('bottom-right', 'badge')}
          </div>
        </div>
      );

    // 13. Neon Aurora Prism Glass
    case 'neon-prism':
      return (
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-400 rounded-[32px] blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />
          <div className="relative rounded-[28px] p-2.5 bg-slate-950/80 backdrop-blur-2xl border-2 border-fuchsia-400/40 shadow-2xl overflow-hidden">
            <div className="rounded-[22px] overflow-hidden aspect-[16/10] sm:aspect-[21/10] relative">
              <img 
                src={section.image} 
                alt={section.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/80 via-transparent to-fuchsia-500/20" />
              {renderOverlayBadge('top-right', 'neon', <Sparkles className="w-3.5 h-3.5 text-cyan-300" />)}
            </div>
          </div>
        </div>
      );

    // 14. Laptop & Modern Retina Display Mockup Frame
    case 'laptop-mockup':
      return (
        <div className="relative group max-w-2xl mx-auto">
          {/* Laptop Screen Body */}
          <div className="bg-slate-900 rounded-t-2xl p-2.5 sm:p-3 pb-0 shadow-2xl border-4 border-slate-700/90 relative">
            {/* Camera & Sensor Notch */}
            <div className="w-2.5 h-2.5 bg-slate-950 rounded-full mx-auto mb-1.5 border border-slate-800 flex items-center justify-center">
              <div className="w-1 h-1 bg-cyan-400/80 rounded-full" />
            </div>

            {/* Browser Control Bar */}
            <div className="flex items-center justify-between px-3 py-1 bg-slate-800/90 rounded-t-lg text-[10px] text-slate-400 font-mono mb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <span className="truncate max-w-[200px] text-slate-300">kowsar-kaki.uast.ac.ir</span>
              <span className="w-2 h-2 rounded-full bg-slate-600" />
            </div>

            {/* Screen Content */}
            <div className="relative rounded-b-lg overflow-hidden aspect-[16/10] bg-black">
              <img 
                src={section.image} 
                alt={section.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              {renderOverlayBadge('top-right', 'glass')}
            </div>
          </div>

          {/* Laptop Base Stand */}
          <div className="relative">
            <div className="h-3.5 bg-gradient-to-b from-slate-600 to-slate-800 rounded-b-xl shadow-xl mx-auto w-full border-t border-slate-500 flex justify-center">
              <div className="w-16 h-1 bg-slate-900 rounded-b-md" />
            </div>
            <div className="h-1 bg-slate-900/60 rounded-full blur-xs mx-auto w-[92%]" />
          </div>
        </div>
      );

    // 15. Smartphone / iPhone Dynamic Island Mockup Frame
    case 'phone-mockup':
      return (
        <div className="relative group max-w-xs sm:max-w-sm mx-auto">
          {/* Phone Shell */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-950 p-3 rounded-[44px] shadow-2xl border-4 border-slate-600/90 ring-1 ring-white/20 relative">
            {/* Dynamic Island */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-between px-2.5 shadow-md">
              <div className="w-2 h-2 rounded-full bg-cyan-400/80 animate-pulse" />
              <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800" />
            </div>

            {/* Screen Area */}
            <div className="relative rounded-[34px] overflow-hidden aspect-[9/16] bg-slate-950 border border-slate-900">
              <img 
                src={section.image} 
                alt={section.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              {renderOverlayBadge('bottom-center', 'glass')}
              
              {/* Home Indicator Bar */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/70 rounded-full z-20" />
            </div>
          </div>
        </div>
      );

    // 16. Persian Royal Illumination & Arabesque Frame
    case 'persian-illumination':
      return (
        <div className="relative group p-4 sm:p-5 bg-gradient-to-br from-blue-900 via-indigo-950 to-blue-950 rounded-[36px] shadow-2xl border-2 border-amber-400/60">
          <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.25),transparent)] pointer-events-none" />
          <div className="p-2 border border-dashed border-amber-300/50 rounded-[28px] relative z-10">
            <div className="relative rounded-[22px] overflow-hidden aspect-[16/10] sm:aspect-[21/10] border-2 border-amber-400/80 shadow-inner">
              <img 
                src={section.image} 
                alt={section.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-amber-500/10 pointer-events-none" />
              {renderOverlayBadge('top-right', 'gold', <Gem className="w-3.5 h-3.5 text-slate-950" />)}
            </div>
          </div>
        </div>
      );

    // 17. Crimson Ruby & Velvet Luxury Frame
    case 'crimson-ruby':
      return (
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 rounded-[34px] blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
          <div className="relative rounded-[30px] p-3 bg-gradient-to-b from-rose-950 via-slate-950 to-black border-2 border-rose-500/50 shadow-2xl overflow-hidden">
            <div className="rounded-[22px] overflow-hidden aspect-[16/10] sm:aspect-[21/10] relative border border-rose-400/40">
              <img 
                src={section.image} 
                alt={section.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950/90 via-transparent to-rose-500/15 pointer-events-none" />
              {renderOverlayBadge('top-right', 'gold', <Flame className="w-3.5 h-3.5 text-slate-950" />)}
            </div>
          </div>
        </div>
      );

    // 18. Aurora Galaxy & Nebula Cosmic Frame
    case 'aurora-galaxy':
      return (
        <div className="relative group">
          <div className="absolute -inset-3 bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-indigo-600 rounded-[36px] blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 animate-pulse" />
          <div className="relative rounded-[30px] p-2.5 bg-slate-950/90 backdrop-blur-2xl border-2 border-purple-400/40 shadow-2xl overflow-hidden">
            <div className="rounded-[22px] overflow-hidden aspect-[16/10] sm:aspect-[21/10] relative">
              <img 
                src={section.image} 
                alt={section.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/80 via-transparent to-indigo-500/20 pointer-events-none" />
              {renderOverlayBadge('top-right', 'neon', <Sparkles className="w-3.5 h-3.5 text-cyan-300" />)}
            </div>
          </div>
        </div>
      );

    // 19. Minimal Neumorphic Soft Card Frame
    case 'minimal-card-shadow':
      return (
        <div className="relative group p-3 bg-white/95 rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.35)] border border-slate-100">
          <div className="relative rounded-[24px] overflow-hidden aspect-[16/10] sm:aspect-[21/10]">
            <img 
              src={section.image} 
              alt={section.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
            {renderOverlayBadge('bottom-right', 'minimal')}
          </div>
        </div>
      );

    // 20. Floating Isometric / Default
    case 'floating-isometric':
    case 'rounded-standard':
    default:
      return (
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/20 relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 z-10" />
          <img 
            src={section.image} 
            alt={section.title}
            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          {renderOverlayBadge('bottom-right', 'dark')}
        </div>
      );
  }
}

const PresentationBlock: React.FC<{ section: PresentationSection, index: number, isLast: boolean }> = ({ section, index, isLast }) => {
  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case 'ocean':
        return 'bg-gradient-to-br from-sky-950 via-blue-950 to-slate-950 text-white';
      case 'emerald':
        return 'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white';
      case 'royal':
        return 'bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 text-white';
      case 'amber':
        return 'bg-gradient-to-br from-amber-950 via-stone-900 to-slate-950 text-white';
      case 'ruby':
        return 'bg-gradient-to-br from-rose-950 via-red-950 to-slate-950 text-white';
      case 'midnight':
        return 'bg-gradient-to-br from-slate-950 via-black to-slate-950 text-white';
      case 'dark':
        return 'bg-slate-900 text-white';
      case 'primary':
        return 'bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white';
      case 'gradient':
        return 'bg-gradient-to-br from-fuchsia-950 via-indigo-950 to-cyan-950 text-white';
      case 'light':
      default:
        return 'bg-slate-50 text-slate-900';
    }
  };

  const getAnimationProps = (style: string) => {
    switch (style) {
      case 'slide-up':
        return { initial: { opacity: 0, y: 100 }, animate: { opacity: 1, y: 0 } };
      case 'slide-right':
        return { initial: { opacity: 0, x: 100 }, animate: { opacity: 1, x: 0 } };
      case 'slide-left':
        return { initial: { opacity: 0, x: -100 }, animate: { opacity: 1, x: 0 } };
      case 'zoom':
        return { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 } };
      case 'flip-3d':
        return { initial: { opacity: 0, rotateX: -90 }, animate: { opacity: 1, rotateX: 0 } };
      case 'rotate-3d':
        return { initial: { opacity: 0, rotateY: 90 }, animate: { opacity: 1, rotateY: 0 } };
      case 'fade':
      default:
        return { initial: { opacity: 0 }, animate: { opacity: 1 } };
    }
  };

  const animProps = getAnimationProps(section.animationStyle);
  const imageAnimProps = section.imageAnimationStyle ? getAnimationProps(section.imageAnimationStyle) : { initial: { opacity: 0, rotateY: index % 2 === 0 ? 30 : -30, x: index % 2 === 0 ? 100 : -100 }, animate: { opacity: 1, rotateY: 0, x: 0 } };
  const themeClasses = getThemeClasses(section.theme);

  return (
    <section className={`relative w-full h-full flex items-center justify-center overflow-hidden ${themeClasses} px-4 sm:px-8`}>
      {/* Background Image Parallax Effect */}
      {section.image && (
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 z-10 ${section.theme === 'light' ? 'bg-white/90' : 'bg-slate-950/85'} backdrop-blur-sm`} />
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            src={section.image} 
            alt={section.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-6xl w-full mx-auto relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        <motion.div 
          {...animProps}
          transition={{ 
            duration: section.animationDuration || 0.8, 
            ease: section.animationEasing || "easeOut", 
            delay: 0.3 
          }}
          className={`space-y-6 ${index % 2 !== 0 && !section.image ? 'lg:order-2' : ''}`}
        >
          {section.subtitle && (
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-widest ${
              section.theme === 'light' ? 'bg-indigo-100 text-indigo-700' : 'bg-white/10 text-indigo-200'
            }`}>
              {section.subtitle}
            </span>
          )}
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
            {section.title}
          </h2>
          
          <p className={`text-base md:text-lg lg:text-xl leading-loose font-medium ${
            section.theme === 'light' ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {section.content}
          </p>
        </motion.div>

        {/* 3D visual element or custom frame */}
        {section.image && (
          <motion.div
            {...imageAnimProps}
            transition={{ 
              duration: section.animationDuration ? section.animationDuration + 0.2 : 1, 
              ease: section.animationEasing || "easeOut",
              delay: 0.2 
            }}
            className={`perspective-1000 ${index % 2 !== 0 ? 'lg:order-1' : ''}`}
          >
            <RenderPresentationImageFrame section={section} index={index} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
