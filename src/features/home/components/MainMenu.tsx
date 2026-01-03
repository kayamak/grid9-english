'use client';

import { 
  useMainMenu,
  MENU_DATA
} from '../hooks/useMainMenu';

export function MainMenu() {
  const {
    selectedCategory,
    selectedSubMenu,
    descMessage,
    bottomMessage,
    currentLevel,
    showClearLevelMenu,
    setShowClearLevelMenu,
    handleCategoryClick,
    handleItemClick,
    handleBack,
    handleDescClick,
    handleBottomClick,
    handleActionHover,
    handleClearLevel,
    setDescMessage
  } = useMainMenu();

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[320px]">
        {/* Tier 1: Level & Menu Area */}
        <div className="md:col-span-1 flex flex-col gap-4">
          {/* Level Display */}
          <section className="dq-window p-4 flex flex-col items-center justify-center border-yellow-400/50 bg-black/40">
            <span className="text-sm text-white/60 mb-1">現在のレベル</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl text-yellow-400">Lv.</span>
              <span className="text-5xl font-bold text-yellow-400 shadow-yellow-400/20 drop-shadow-lg">{currentLevel}</span>
            </div>
          </section>

          {/* Menu Area */}
          <section className="dq-window h-full flex flex-col flex-1">
            <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-4">
              <h2 className="text-xl text-yellow-400">
                {selectedSubMenu ? selectedSubMenu.label : (selectedCategory ? selectedCategory : "コマンド")}
              </h2>
              {selectedCategory && (
                <button 
                  onClick={handleBack}
                  className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  [もどる]
                </button>
              )}
            </div>
            
            <nav className="flex flex-col gap-1">
              {!selectedCategory ? (
                <>
                  {Object.keys(MENU_DATA).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className="dq-menu-item text-xl w-full text-left"
                    >
                      {cat}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowClearLevelMenu(true)}
                    onMouseEnter={() => setDescMessage("レベルを　しょきか　したり　できるぞ。")}
                    className="dq-menu-item text-xl w-full text-left mt-2 border-t border-white/20 pt-2"
                  >
                    にげる
                  </button>
                </>
              ) : (
                (selectedSubMenu ? selectedSubMenu.items! : MENU_DATA[selectedCategory].items).map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => handleActionHover(true, item)}
                    onMouseLeave={() => handleActionHover(false)}
                    className="dq-menu-item text-xl w-full text-left"
                  >
                    {item.label}
                  </button>
                ))
              )}
            </nav>

          </section>
        </div>

        {/* Description Area */}
        <section 
          className="dq-window md:col-span-2 relative overflow-hidden group cursor-pointer"
          onClick={handleDescClick}
        >
          <div className="absolute top-2 right-4 text-[10px] text-white/20 group-hover:text-white/40">
            Click for Help
          </div>
          <div className="p-4 md:p-8 h-full flex items-center justify-center">
             <p className="text-xl md:text-2xl leading-relaxed text-center font-normal">
               {descMessage}
             </p>
          </div>
        </section>
      </div>

      {/* Message Window */}
      <div 
        className="dq-window h-24 flex items-center px-8 border-yellow-400 cursor-pointer"
        onClick={handleBottomClick}
      >
        <p className="text-xl text-white">
          <span className="inline-block animate-bounce mr-2">▼</span>
          {bottomMessage}
        </p>
      </div>

      {/* Level Clear Menu Modal */}
      {showClearLevelMenu && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
           <div className="dq-window p-8 flex flex-col items-center gap-6 min-w-[300px] animate-in zoom-in duration-200">
              <h2 className="text-2xl text-white font-bold mb-2">メニュー</h2>
              
              <button 
                onClick={handleClearLevel}
                className="dq-button w-full py-3 text-lg border-red-500 text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                 レベルクリア
              </button>

              <button 
                onClick={() => setShowClearLevelMenu(false)}
                className="dq-button w-full py-2 bg-gray-800 text-white/50 border-gray-600"
              >
                 とじる
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
