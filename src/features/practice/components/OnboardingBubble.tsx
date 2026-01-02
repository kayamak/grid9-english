
import React from 'react';
import { motion } from 'framer-motion';

interface OnboardingBubbleProps {
  message: string;
  onClick: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'center' | 'start' | 'end';
  className?: string;
}

export const OnboardingBubble: React.FC<OnboardingBubbleProps> = ({ 
  message, 
  onClick, 
  position = 'top',
  align = 'center',
  className = ''
}) => {
  const getBubbleStyle = () => {
    const baseStyle: React.CSSProperties = {};
    
    if (position === 'top' || position === 'bottom') {
      if (align === 'center') {
        baseStyle.left = '50%';
        baseStyle.transform = 'translateX(-50%)';
      } else if (align === 'start') {
        baseStyle.left = '0';
        baseStyle.transform = 'none';
      } else if (align === 'end') {
        baseStyle.right = '0';
        baseStyle.transform = 'none';
      }

      if (position === 'top') {
        baseStyle.bottom = '100%';
        baseStyle.marginBottom = '12px';
      } else {
        baseStyle.top = '100%';
        baseStyle.marginTop = '12px';
      }
    } else if (position === 'left') {
      baseStyle.right = '100%';
      baseStyle.marginRight = '12px';
      baseStyle.top = '50%';
      baseStyle.transform = 'translateY(-50%)';
    } else if (position === 'right') {
      baseStyle.left = '100%';
      baseStyle.marginLeft = '12px';
      baseStyle.top = '50%';
      baseStyle.transform = 'translateY(-50%)';
    }
    
    return baseStyle;
  };

  const getPointerClass = () => {
    let classes = 'absolute w-3 h-3 bg-white/90 border-r-2 border-b-2 border-yellow-400 transform rotate-45 ';
    
    if (position === 'top') {
      classes += 'bottom-[-7px] border-t-0 border-l-0 ';
      if (align === 'center') classes += 'left-1/2 -translate-x-1/2';
      else if (align === 'start') classes += 'left-6';
      else if (align === 'end') classes += 'right-6';
    } else if (position === 'bottom') {
      classes += 'top-[-7px] border-b-0 border-r-0 ';
      if (align === 'center') classes += 'left-1/2 -translate-x-1/2';
      else if (align === 'start') classes += 'left-6';
      else if (align === 'end') classes += 'right-6';
    } else if (position === 'left') {
      classes += 'right-[-7px] top-1/2 -translate-y-1/2 border-b-0 border-l-0';
    } else if (position === 'right') {
      classes += 'left-[-7px] top-1/2 -translate-y-1/2 border-t-0 border-r-0';
    }
    
    return classes;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`absolute z-50 cursor-pointer ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={getBubbleStyle()}
    >
      <div className="relative bg-white/90 text-black px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,0,0.6)] border-2 border-yellow-400 max-w-[95vw] md:max-w-[60vw] min-w-[280px] md:min-w-[400px]">
        {/* Triangle Pointer */}
        <div className={getPointerClass()}></div>
        
        <p className="text-sm md:text-base font-bold leading-relaxed whitespace-pre-wrap">
          {message}
        </p>
        <p className="text-[10px] text-gray-500 mt-2 text-right font-mono">
           (クリックしてすすむ)
        </p>
      </div>
    </motion.div>
  );
};
