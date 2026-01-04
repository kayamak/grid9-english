import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getAssetPath } from '@/lib/assets';
import { Subject } from '@/domain/practice/types';

interface BattleSubjectAreaProps {
  subject: Subject;
  currentDrillIndex: number;
  heroAction: 'idle' | 'run-away' | 'defeated' | 'attack' | 'damaged';
  heroOpacity: number;
  attackDistance: number;
  subjectImg: string;
}

export function BattleSubjectArea({
  subject,
  currentDrillIndex,
  heroAction,
  heroOpacity,
  attackDistance,
  subjectImg,
}: BattleSubjectAreaProps) {
  return (
    <div className="flex-1 flex flex-col items-center relative h-full justify-end pb-12 md:pb-16">
      <div className="z-10 flex flex-col items-center">
        {(subject === 'first_p' || subject === 'second_p' || subject === 'third_p') && (
          <motion.div
            key={`hero-sub-${subject}-${currentDrillIndex}`}
            initial={{ x: -20, opacity: 0 }}
            animate={
              heroAction === 'run-away' ? { x: -100, opacity: heroOpacity } : 
              heroAction === 'defeated' ? { rotate: -90, y: 20, opacity: 0.6, filter: 'grayscale(100%)' } :
              heroAction === 'attack' ? { x: [0, attackDistance, 0] } :
              heroAction === 'damaged' ? { x: [0, -5, 5, -5, 5, 0], filter: ['brightness(1)', 'brightness(2) sepia(1) hue-rotate(-50deg)', 'brightness(1)'] } :
              { x: 0, opacity: heroOpacity, rotate: 0, y: 0, filter: 'none' }
            }
            transition={{ duration: heroAction === 'attack' ? 0.3 : (heroAction === 'damaged' ? 0.5 : 0.5) }}
          >
            <Image 
              src={getAssetPath(subjectImg)} 
              alt="Hero Second" 
              width={150}
              height={150}
              className={`w-12 h-12 md:w-20 md:h-20 object-contain pixelated mix-blend-multiply ${
                subject === 'first_p' || subject === 'second_p' ? 'scale-x-[-1]' : ''
              }`}
            />
          </motion.div>
        )}
        <motion.div
          key={`hero-main-${subject}-${currentDrillIndex}`}
          initial={{ x: -20, opacity: 0 }}
          animate={
            heroAction === 'run-away' ? { x: -100, opacity: heroOpacity } : 
            heroAction === 'defeated' ? { rotate: -90, y: 20, opacity: 0.6, filter: 'grayscale(100%)' } :
            heroAction === 'attack' ? { x: [0, attackDistance, 0] } :
            { x: 0, opacity: heroOpacity, rotate: 0, y: 0, filter: 'none' }
          }
          transition={{ duration: heroAction === 'attack' ? 0.3 : 0.5 }}
        >
          <Image 
            src={getAssetPath(subjectImg)} 
            alt="Hero" 
            width={150}
            height={150}
            className={`w-20 h-20 md:w-32 md:h-32 object-contain pixelated mix-blend-multiply ${
              subject === 'first_s' || subject === 'first_p' || subject === 'second' || subject === 'second_p' ? 'scale-x-[-1]' : ''
            }`}
          />
        </motion.div>
      </div>
      <div className="w-20 h-3 bg-black/30 blur-md rounded-[100%] absolute bottom-4"></div>
    </div>
  );
}
