// 캐릭터 설명: 탈라시아 4 (웨이브) · 한·영·일 (수치는 weaponsWave·itemsWave와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_THAL4: Guide = {
  wave: [
    "탈라시아 · 웨이브 · 물을 상상만으로 빚는 서핑 소녀 · 체력 100 · 공격력 11 · 이동 1.45 · 행운 2",
    "누름: 물결 초승달 — 날아가며 커지고 닿는 적을 모두 꿰뚫음 (공격력 80%)",
    "상상력: 초승달을 날릴 때마다 30씩 (가진 기술 하나마다 +2.5) 차고, 100이 되면 가진 물의 기술 가운데 하나가 무작위로 나감 (먹은 순서와 상관없음) · 기술이 없으면 둘레 물보라",
    "물의 기술 30 (전용 아이템 하나 = 기술 하나): 물나비 · 물창 · 물의 갑옷 · 바다의 보석 · 꿈의 고래 · 거품 감옥 · 물시계 · 해파리 등불 · 물거울 · 소나기 구름 · 용오름 · 물연꽃 · 파도 타기 · 물방울 회오리 · 만조",
    "… 물고기 떼 · 물밧줄 · 물풍선 · 진주 구슬 · 물의 손 · 분수 · 물수제비 · 인어의 노래 · 물안개 · 대왕 문어 · 물의 날개 · 심해의 눈 · 밀물 썰물 · 물발자국 · 자유의 해일",
    "무기 6 (상상의 도구): 파도 서핑보드 · 소라 고둥(상상력 1.5배) · 물방울 프리즘(35% 기술 하나 더) · 만조의 왕관(기술 1.35배) · 물결 리본(초승달 셋) · 상상의 물감(다음 기술이 보이고 대시로 바꿈)",
  ],
};

export const GUIDE_EN_THAL4: Guide = {
  wave: [
    "Thalassia · Wave · a surfer girl who shapes water with pure imagination · HP 100 · ATK 11 · Move 1.45 · Luck 2",
    "Press: Ripple Crescent — grows as it flies and pierces every foe it touches (80% ATK)",
    "Imagination: each crescent adds 30 (+2.5 per owned skill); at 100 a random water skill you own fires (pickup order doesn't matter) · with no skills, a splash around you",
    "30 water skills (one exclusive item = one skill): Water Butterflies · Water Spear · Water Armor · Gem of the Sea · Dream Whale · Bubble Prison · Water Clock · Jellyfish Lanterns · Water Mirror · Shower Cloud · Waterspout · Water Lotus · Surf Ride · Droplet Spiral · High Tide",
    "… School of Fish · Water Rope · Water Balloon · Pearl Ball · Hands of Water · Fountain · Stone Skipping · Mermaid's Song · Sea Mist · Giant Octopus · Wings of Water · Eye of the Deep · Ebb and Flow · Water Footprints · Tsunami of Freedom",
    "6 weapons (tools of imagination): Wave Surfboard · Conch Shell (1.5x imagination) · Droplet Prism (35% bonus skill) · Crown of High Tide (1.35x skills) · Ripple Ribbon (three crescents) · Paint of Imagination (see the next skill, dash to reroll)",
  ],
};

export const GUIDE_JA_THAL4: Guide = {
  wave: [
    "タラシア · ウェーブ · 水を想像だけで形作るサーフィン少女 · 体力100 · 攻撃力11 · 移動1.45 · 運2",
    "押す：さざ波の三日月 — 飛びながら大きくなり、触れた敵をすべて貫く（攻撃力80%）",
    "想像力：三日月を投げるたびに30（持っている技1つごとに+2.5）たまり、100で持っている水の技から一つがランダムに出る（取った順番は関係なし）· 技がなければ周りに水しぶき",
    "水の技30（専用アイテム1つ＝技1つ）：水の蝶 · 水の槍 · 水の鎧 · 海の宝石 · 夢の鯨 · 泡の牢獄 · 水時計 · クラゲの灯 · 水鏡 · にわか雨の雲 · 竜巻 · 水の蓮 · 波乗り · しずくの渦 · 満潮",
    "… 魚の群れ · 水の縄 · 水風船 · 真珠玉 · 水の手 · 噴水 · 水切り · 人魚の歌 · 水霧 · 大王ダコ · 水の翼 · 深海の眼 · 満ち潮引き潮 · 水の足跡 · 自由の津波",
    "武器6（想像の道具）：波のサーフボード · ほら貝（想像力1.5倍）· しずくのプリズム（35%で技がもう一つ）· 満潮の冠（技1.35倍）· さざ波のリボン（三日月3つ）· 想像の絵の具（次の技が見え、ダッシュで変更）",
  ],
};
