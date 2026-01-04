import React from 'react';

interface OverlayTimerBarProps {
    isQuestMode: boolean;
    timeLeft: number;
    timeLimit: number;
}

export function OverlayTimerBar({ isQuestMode, timeLeft, timeLimit }: OverlayTimerBarProps) {
    if (!isQuestMode) return null;

    return (
        <div className="absolute top-0 left-0 right-0 h-1 md:h-2 bg-gray-800 z-30">
            <div 
                className="h-full bg-yellow-400 transition-all duration-1000" 
                style={{ width: `${Math.max(0, (timeLeft / timeLimit) * 100)}%` }}
            ></div>
        </div>
    );
}
