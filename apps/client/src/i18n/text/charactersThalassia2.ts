import type { Lang } from "../index";

// 화면 글자: 탈라시아 캐릭터 2 (웨이브) 이름·설명 (charactersThalassia가 커서 나눔)
export const CHARACTER_TEXT_THALASSIA_2 = {
  wave: { ko: "웨이브", en: "Wave", ja: "ウェーブ" },
  muse: { ko: "상상의 물결과 물의 기술", en: "Imagined Tides & Water Skills", ja: "想像の波と水の技" },
  waveDesc: {
    ko: "탈라시아. 물을 상상만으로 마음대로 빚는 서핑 소녀. 누르면 뚫고 나가며 커지는 물결 초승달 · 날릴 때마다 상상력이 차고, 가득 차면 가진 물의 기술 가운데 하나가 무작위로 나감 · 전용 아이템 30개가 모두 서로 다른 기술 (물나비 · 물창 · 물의 여신 · 꿈의 고래 · 해파리 등불 · 자유의 해일 …) · 기술을 많이 모을수록 상상력이 빨리 차고 더 다양해짐",
    en: "Thalassia. A surfer girl who shapes water with nothing but imagination. Press to throw a ripple crescent that grows as it pierces · every throw fills her imagination; when full, a random water skill she owns fires · all 30 exclusive items are different skills (water butterflies · water spear · water goddess · dream whale · jellyfish lanterns · tsunami of freedom …) · the more skills you gather, the faster imagination fills and the wilder the mix",
    ja: "タラシア。水を想像だけで自由に形作るサーフィン少女。押すと貫きながら大きくなるさざ波の三日月 · 投げるたびに想像力がたまり、満タンで持っている水の技から一つがランダムに出る · 専用アイテム30個はすべて違う技（水の蝶 · 水の槍 · 水の女神 · 夢の鯨 · クラゲの灯 · 自由の津波 …）· 技を集めるほど想像力が早くたまり、多彩になる",
  },
} satisfies Record<string, Record<Lang, string>>;
