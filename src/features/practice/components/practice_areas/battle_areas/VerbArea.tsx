import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getAssetPath } from '@/lib/assets';

function DragonVEffect() {
    const [visible, setVisible] = useState(true);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }, []);
  
    if (!visible) return null;
  
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full absolute flex items-center justify-center"
        >
          <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 opacity-60">
              <path d="M20 30 L50 90 L80 30" stroke="orange" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25 35 L50 85 L75 35" stroke="yellow" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M30 40 L50 80 L70 40" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
          </svg>
        </motion.div>
      </div>
    );
  }

interface VerbAreaProps {
  currentDrillIndex: number;
  monsterState: 'idle' | 'hit' | 'defeated' | 'damaged' | 'attack';
  monsterOpacity: number;
  monsterImg: string;
  monsterScale: number;
  attackDistance: number;
}

export function VerbArea({
  currentDrillIndex,
  monsterState,
  monsterOpacity,
  monsterImg,
  monsterScale,
  attackDistance,
}: VerbAreaProps) {
  return (
    <div className="flex-1 flex flex-col items-center relative h-full justify-end pb-12 md:pb-16">
      <div className="relative" style={{ transformOrigin: 'bottom' }}>
        {/* Monster Image Layer - Multiplied */}
        <motion.div
          key={`monster-img-${currentDrillIndex}-${monsterImg}`}
          initial={{ y: 20, opacity: 0, scale: 0.8 * monsterScale }}
          animate={{ 
            y: monsterState === 'hit' ? [0, -20, 0] : (monsterState === 'defeated' ? 20 : 0),
            rotate: monsterState === 'defeated' ? 90 : 0,
            opacity: monsterState === 'defeated' ? 0.6 : monsterOpacity,
            scale: monsterState === 'hit' ? 1.1 * monsterScale : 
                   monsterState === 'damaged' ? [1 * monsterScale, 0.95 * monsterScale, 1 * monsterScale] : 
                   1 * monsterScale,
            filter: monsterState === 'hit' ? 'brightness(2) contrast(2)' : 
                    monsterState === 'damaged' ? ['brightness(1)', 'brightness(1.5) sepia(0.5) hue-rotate(-50deg)', 'brightness(1)'] :
                    (monsterState === 'defeated' ? 'grayscale(100%)' : 'none'),
            x: monsterState === 'hit' ? [0, 10, -10, 10, 0] : 
               monsterState === 'damaged' ? [0, 5, -5, 5, 0] : 
               monsterState === 'attack' ? [0, -attackDistance, 0] : 0
          }}
          transition={{ duration: monsterState === 'hit' ? 0.2 : (monsterState === 'damaged' ? 0.3 : (monsterState === 'attack' ? 0.3 : 0.5)) }}
          className="z-10" 
          style={{ transformOrigin: 'bottom' }}
        >
          <Image 
            src={getAssetPath(monsterImg)} 
            alt="Monster" 
            width={180}
            height={180}
            className="w-28 h-28 md:w-44 md:h-44 object-contain pixelated block"
            style={{ 
              mixBlendMode: monsterImg.includes('bit_golem.png') ? 'normal' : 'multiply' 
            }}
          />
        </motion.div>

        {/* Effects Layer - Normal Blend (Overlay on top of multiplied image) */}
        <motion.div
          key={`monster-fx-${currentDrillIndex}-${monsterImg}`}
          initial={{ y: 20, opacity: 0, scale: 0.8 * monsterScale }}
          animate={{ 
            y: monsterState === 'hit' ? [0, -20, 0] : (monsterState === 'defeated' ? 20 : 0),
            rotate: monsterState === 'defeated' ? 90 : 0,
            opacity: monsterState === 'defeated' ? 0 : monsterOpacity, // Hide FX on defeat
            scale: monsterState === 'hit' ? 1.1 * monsterScale : 
                   monsterState === 'damaged' ? [1 * monsterScale, 0.95 * monsterScale, 1 * monsterScale] :
                   1 * monsterScale,
            x: monsterState === 'hit' ? [0, 10, -10, 10, 0] : 
               monsterState === 'damaged' ? [0, 5, -5, 5, 0] : 
               monsterState === 'attack' ? [0, -attackDistance, 0] : 0
          }}
          transition={{ duration: monsterState === 'hit' ? 0.2 : (monsterState === 'damaged' ? 0.3 : (monsterState === 'attack' ? 0.3 : 0.5)) }}
          className="absolute inset-0 pointer-events-none z-10"
          style={{ transformOrigin: 'bottom' }}
        >
          {monsterImg === '/assets/monsters/void_dragon_v2.png' && monsterState !== 'defeated' && (
            <DragonVEffect />
          )}
          {monsterImg === '/assets/monsters/bit_golem.png' && monsterState !== 'defeated' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2.0, times: [0, 0.2, 1], ease: "easeOut" }}
                className="w-full h-full absolute flex items-center justify-center"
              >
                  <div className="w-3/4 h-3/4 border-2 border-blue-400/30 rounded-lg flex items-center justify-center">
                  <div className="w-full h-full bg-blue-500/10"></div>
                  </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
      <div className="w-24 h-3 bg-black/30 blur-md rounded-[100%] absolute bottom-4"></div>
    </div>
  );
}
