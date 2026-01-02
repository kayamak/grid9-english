
import React from 'react';
import { motion } from 'framer-motion';

interface OnboardingBubbleProps {
  message: string;
  onClick: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const OnboardingBubble: React.FC<OnboardingBubbleProps> = ({ 
  message, 
  onClick, 
  position = 'top',
  className = ''
}) => {
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
      style={{
        ...(position === 'top' && { bottom: '100%', marginBottom: '12px', left: '50%', transform: 'translateX(-50%)' }),
        ...(position === 'bottom' && { top: '100%', marginTop: '12px', left: '50%', transform: 'translateX(-50%)' }),
        ...(position === 'left' && { right: '100%', marginRight: '12px', top: '50%', transform: 'translateY(-50%)' }),
        ...(position === 'right' && { left: '100%', marginLeft: '12px', top: '50%', transform: 'translateY(-50%)' }),
      }}
    >
      <div className="relative bg-white/90 text-black px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,0,0.6)] border-2 border-yellow-400 max-w-[95vw] md:max-w-[60vw] min-w-[280px] md:min-w-[400px]">
        {/* Triangle Pointer */}
        <div 
          className={`absolute w-3 h-3 bg-white/90 border-r-2 border-b-2 border-yellow-400 transform rotate-45 ${
            position === 'top' ? 'bottom-[-7px] left-1/2 -translate-x-1/2 border-t-0 border-l-0' :
            position === 'bottom' ? 'top-[-7px] left-1/2 -translate-x-1/2 border-b-0 border-r-0' :
            position === 'left' ? 'right-[-7px] top-1/2 -translate-y-1/2 border-b-0 border-l-0' :
            'left-[-7px] top-1/2 -translate-y-1/2 border-t-0 border-r-0' // correct for right
          }`}
        ></div>
        
        {/* Fix pointer border for bottom/right cases which are tricky with single div, simplifying to just box for now or adjusting */}
        {/* Adjusted pointer logic:
            Top bubble -> arrow at bottom. border-bottom and border-right of rotated box.
            Bottom bubble -> arrow at top. border-top and border-left.
        */}

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
