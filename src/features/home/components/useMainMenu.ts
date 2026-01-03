import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type MenuItem = {
  label: string;
  href?: string;
  descriptions: string[];
  items?: MenuItem[];
};

export type CategoryData = {
  descriptions: string[];
  items: MenuItem[];
};

export const MENU_DATA: Record<string, CategoryData> = {
  "たたかう": {
    descriptions: [
      "きびしい　しれんに　いどみ、おのれの　スキルを　みがきあげろ！",
      "しれんを　のりこえたさきに、あらたな　ちからが　やどるだろう。",
      "こころを　むにして、もんだいを　なぎたおせ！"
    ],
    items: [
      { 
        label: "ドリルクエスト", 
        href: "/practice?mode=quest", 
        descriptions: [
          "せまりくる　せいげんじかんないに　あまたの　もんだいを　ときあかせ！",
          "はやさと　せいかくさ。その　どちらもが　もとめられる　クエストだ。",
          "ハイスコアを　めざして、なんども　ちょうせんしよう！"
        ]
      }
    ]
  },
  "れんしゅう": {
    descriptions: [
      "ぶんぽうというなの　れんしゅうまほうを　じざいに　つかいこなせ！",
      "ことばの　ならびを　あやつるものは、せかいを　あやつる。",
      "ただしい　えいごは、ひとの　こころを　うごかす　まほうだ。"
    ],
    items: [
      { 
        label: "しゅご ＋ Doどうし", 
        href: "/practice?mode=drill&pattern=DO_SV", 
        descriptions: [
          "いっぱんどうしの　きほんけい。しゅごと　どうしの　きずなを　たしかめろ！",
          "だれが　なにを　するのか。すべての　きほんは　ここにある。"
        ]
      },
      { 
        label: "しゅご ＋ Doどうし ＋ もくてきご", 
        href: "/practice?mode=drill&pattern=DO_SVO", 
        descriptions: [
          "なにかを　たいしょうにする　うごき。もくてきを　とらえる　いちげきを！",
          "「なにを」を　はっきりさせる。それが　SVOの　ごくいだ。"
        ]
      },
      { 
        label: "しゅご ＋ Beどうし ＋ ほご", 
        href: "/practice?mode=drill&pattern=BE_SVC", 
        descriptions: [
          "じょうたいを　しめす　れんしゅう。ありのままの　すがたを　ひょうげんせよ！",
          "イコールのかんけい。きみの　じょうたいを　ことばに　のせろ。"
        ]
      }
    ]
  },
  "おためし": {
    descriptions: [
      "さまざまな　おためしが　できる　じゆうトレーニングだ！",
      "ときには　じゆうに、ときには　しんけんに。おためしの　つかいかたは　きみしだい。",
      "じぶんだけの　スタイルで、えいごの　たびを　つづけよう。"
    ],
    items: [
      { 
        label: "じゆうトレーニング", 
        href: "/practice?mode=free", 
        descriptions: [
          "じぶんの　ペースで　じっくりと　じつりょくを　たくわえろ。",
          "まちがいを　おそれず、なんどでも　ためしてみるのが　じょうたつへの　ちかみちだ。"
        ]
      }
    ]
  },
  "せつめい": {
    descriptions: [
      "ゲームの　あそびかたや　きほんてきな　ルールを　かくにんできるぞ。",
      "まよったときは　ここを　みて　きほんを　おもいだそう。"
    ],
    items: [
      {
        label: "オンボーディング",
        href: "/practice?mode=drill&pattern=DO_SV&onboarding=true",
        descriptions: [
          "はじめての　ぼうけんしゃへの　しなんしょ。",
          "まずは　ここから　はじめて　えいごの　せかいに　なれよう！"
        ]
      }
    ]
  }
};

const MOTIVATIONAL_MESSAGES = [
  "きみなら　できる！",
  "あきらめたら　そこで　しあいしゅうりょうだよ",
  "いっぽずつの　つみかさねが　おおきな　ちからに　なる！",
  "でんせつの　ゆうしゃは　きみのことだ！",
  "えいごの　れんしゅうを　マスターしよう！",
  "こんかいの　べんきょうは　きっと　やくにたつぞ！",
  "つづけることが　さいだいの　ぶきだ！",
  "ちりもつもれば　やまとなる！",
  "きみの　なまえを　れきしに　きざめ！",
  "こころの　エンジンを　ぜんかいにしろ！",
  "まいにちの　どりょくが　あしたを　かえる！",
  "きみの　なかに　ねむる　さいのうを　よびおこせ！"
];

const OPERATION_MESSAGES = [
  "マウスで　コマンドを　えらび　クリックして　けっていしよう！",
  "スマホの　ときは　がめんを　ちょくせつ　タップするのだぞ。",
  "「もどる」ボタンを　おすと　まえの　メニューに　もどれるぞ。",
  "この　ウィンドウを　クリックすると　べつの　メッセージが　きけるぞ。",
  "さあ　コマンドを　えらんで　ぼうけんを　はじめよう！"
];

export const useMainMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState<MenuItem | null>(null);
  const [descMessage, setDescMessage] = useState<string>("コマンドを　えらんでください。");
  const [bottomMessage, setBottomMessage] = useState<string>("ぼうけんの　じゅんびは　いいかな？");
  const [opIndex, setOpIndex] = useState(0);
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showClearLevelMenu, setShowClearLevelMenu] = useState(false);

  useEffect(() => {
    const loadLevel = () => {
      if (typeof document !== 'undefined') {
        const match = document.cookie.match(/(^| )playerLevel=([^;]+)/);
        if (match) {
          setCurrentLevel(parseInt(match[2]));
        }
      }
    };
    // Defer to avoid "set-state-in-effect" lint error
    void Promise.resolve().then(loadLevel);
  }, []);

  const updateMotivation = useCallback(() => {
    const randomMsg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    setBottomMessage(randomMsg);
  }, []);

  const updateOperation = useCallback(() => {
    const msg = OPERATION_MESSAGES[opIndex % OPERATION_MESSAGES.length];
    setOpIndex(prev => prev + 1);
    return msg;
  }, [opIndex]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setDescMessage(MENU_DATA[category].descriptions[0]);
    updateMotivation();
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.items) {
      setSelectedSubMenu(item);
      setDescMessage(item.descriptions[0]);
    } else if (item.href) {
      updateMotivation();
      router.push(item.href);
    }
  };

  const handleBack = () => {
    if (selectedSubMenu) {
      setSelectedSubMenu(null);
      if (selectedCategory) {
        setDescMessage(MENU_DATA[selectedCategory].descriptions[0]);
      }
    } else {
      setSelectedCategory(null);
      setDescMessage("コマンドを　えらんでください。");
    }
    updateMotivation();
  };

  const handleDescClick = () => {
    setDescMessage(updateOperation());
  };

  const handleBottomClick = () => {
    setBottomMessage(updateOperation());
  };

  const handleActionHover = (isHovering: boolean, item?: MenuItem) => {
    if (isHovering && item) {
      setDescMessage(item.descriptions[0]);
    } else {
       // revert to parent description
       if (selectedSubMenu) {
          setDescMessage(selectedSubMenu.descriptions[0]);
       } else if (selectedCategory) {
          setDescMessage(MENU_DATA[selectedCategory].descriptions[0]);
       }
    }
  };

  const handleClearLevel = () => {
    document.cookie = "playerLevel=1; path=/; max-age=31536000";
    setCurrentLevel(1);
    setShowClearLevelMenu(false);
    setBottomMessage("レベルを　しょきか　しました。");
  };

  return {
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
    setDescMessage,
  };
};
