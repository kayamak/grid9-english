import React from 'react';
import { OverlayTimerBar } from './overlay_areas/OverlayTimerBar';
import { OverlayTopUiArea } from './overlay_areas/OverlayTopUiArea';
import { OverlayBottomButtonArea } from './overlay_areas/OverlayBottomButtonArea';

export function BattleOverlayArea() {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-20">
      <OverlayTimerBar />
      <OverlayTopUiArea />
      <OverlayBottomButtonArea />
    </div>
  );
}
