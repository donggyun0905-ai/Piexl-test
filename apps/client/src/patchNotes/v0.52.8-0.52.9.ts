import type { PatchNote } from "./types";

// 지난 패치 노트 0.52.8~0.52.9 (latest.ts에서 옮김)
export const NOTES: PatchNote[] = [
  {
    version: "0.52.9",
    date: "2026-11-10",
    items: {
      ko: ["조커: 튕길 때마다 피해 +4는 15번까지 (트럼프 카드·사신의 낫 최대 64 · 장난감 총 49 · 날 선 모서리면 94) · 다 쌓인 카드는 금색으로 빛남"],
      en: ["Joker: the +4 damage per bounce now stops at 15 bounces (Playing Cards/Reaper's Scythe max 64 · Toy Gun 49 · 94 with Sharpened Edge) · maxed cards glow gold"],
      ja: ["ジョーカー: 跳ねるたびのダメージ+4は15回まで（トランプ・死神の鎌は最大64・おもちゃの銃49・研いだ角なら94）・最大になったカードは金色に光る"],
    },
  },
  {
    version: "0.52.8",
    date: "2026-11-10",
    items: {
      ko: [
        "새 진영 실베르: 몬스터가 강해지기 전부터 강대한 몬스터가 살던 북부를 지켜 온 나라 · 진영 특징 '성장': 처음엔 약하지만 패시브(공용·전용 모두)를 하나 가질 때마다 최대 체력 +3, 공격력·공격 속도·투사체 속도 +2%, 이동 속도 +1%가 더 오름 (30개까지)",
        "새 캐릭터 조커 (실베르): 조준한 쪽으로 카드를 한 장씩 던짐 · 피해는 공격력과 상관없는 고정 4 · 카드는 벽에 끝없이 튕기고 튕길 때마다 피해 +4 · 판 위 카드가 15장을 넘으면 가장 먼저 던진 카드가 사라짐 · 투사체 속도가 빠를수록 빨리 튕겨 세짐",
        "조커 무기 3: 트럼프 카드 · 사신의 낫 (크고 느리게 돌며 더 자주 벰) · 장난감 총 (작은 탄을 빠르고 자주 · 튕길 때 +3)",
        "조커 전용 아이템 15: 모두 새 기술·능력과 능력치를 줌 · 카드뽑기: 맞힐 때마다 게이지 → 머리 위 카드 셋이 섞이다 한 장이 뒤집힘 (달: 히든 캐릭터 아홉 중 하나의 힘 10초 · 붉은 일식: 10초 동안 받는 피해 +30%·카드 처음 피해 16 · 세계수: 체력 20 회복) · 날 선 모서리 · 더블 덱 · 마술사의 소매 · 불꽃·서리 카드 · 지휘봉 · 폭죽 카드 · 분신 카드 · 에이스 · 행운의 7 · 하트 카드 · 가속 카드 · 카드 방패 · 풀 하우스",
      ],
      en: [
        "New faction Silber: the nation that has guarded the North, home of mighty monsters even before monsters grew strong · Faction trait 'Growth': weak at first, but each passive you hold (shared or exclusive) grants +3 max HP, +2% damage, attack speed and projectile speed, and +1% move speed (up to 30)",
        "New character Joker (Silber): throws one card at a time toward your aim · fixed 4 damage, unaffected by attack · cards bounce off walls forever, +4 damage per bounce · past 15 cards on the field, the oldest vanishes · faster projectiles bounce sooner and hit harder",
        "Joker's 3 weapons: Playing Cards · Reaper's Scythe (big, slow spin, cuts more often) · Toy Gun (small fast shots, often · +3 per bounce)",
        "Joker's 15 exclusive items, each granting a new skill or ability plus stats · Card Draw: hits fill a gauge → three cards above your head shuffle and one flips (Moon: one of nine hidden heroes' powers for 10s · Red Eclipse: for 10s +30% damage taken, cards start at 16 · World Tree: heal 20 HP) · Sharpened Edge · Double Deck · Magician's Sleeve · Flame/Frost Card · Baton · Firework Card · Twin Card · Ace · Lucky Seven · Heart Card · Accel Card · Card Shield · Full House",
      ],
      ja: [
        "新陣営シルベル：魔物が強くなる前から強大な魔物が棲む北部を守り続けてきた国・陣営の特徴『成長』：最初は弱いが、パッシブ（共通・専用とも）を1つ持つごとに最大体力+3、攻撃力・攻撃速度・弾速+2%、移動速度+1%がさらに上がる（30個まで）",
        "新キャラクター ジョーカー（シルベル）：狙った方へカードを1枚ずつ投げる・ダメージは攻撃力と関係ない固定4・カードは壁で無限に跳ね、跳ねるたびにダメージ+4・場のカードが15枚を超えると最初に投げたカードが消える・弾速が速いほど早く跳ねて強くなる",
        "ジョーカーの武器3つ：トランプ・死神の鎌（大きくゆっくり回りより頻繁に斬る）・おもちゃの銃（小さな弾を速く頻繁に・跳ねるたび+3）",
        "ジョーカー専用アイテム15：すべて新しい技・能力と能力値をくれる・カード引き：当てるたびにゲージ → 頭上の3枚が混ざり1枚がめくれる（月：隠しキャラ9人のうち1人の力を10秒・赤い日食：10秒間被ダメージ+30%・カードの初期ダメージ16・世界樹：体力20回復）・研いだ角・ダブルデッキ・奇術師の袖・炎/霜のカード・指揮棒・花火のカード・分身カード・エース・幸運の7・ハートのカード・加速カード・カードの盾・フルハウス",
      ],
    },
  },
];
