// 음양사 부적 무기의 추가 효과 설명 (수치는 sim/talisman의 상수와 맞춤)
import type { CharmKind } from "@pixel-rogue/shared";
import type { Names } from "./names";

export const CHARM_DESC: Record<CharmKind, Names> = {
  ramp: {
    ko: "맞힐 때마다 피해 +15%, 5번째는 2.5배 피해 뒤 처음으로",
    en: "Each hit deals +15% more; the 5th deals 2.5x, then it resets",
    ja: "当てるたびにダメージ+15%、5回目は2.5倍の後に元に戻る",
  },
  smite: { ko: "5번 맞히면 가까운 적 3명도 같이 맞음", en: "Every 5 hits also strikes 3 nearby enemies", ja: "5回当てると近くの敵3体にも当たる" },
  seal: {
    ko: "적에게 붙어 0.5초마다 피해 (3초, 최대 3장)",
    en: "Sticks to enemies and deals damage every 0.5s (3s, up to 3 stacks)",
    ja: "敵に貼り付き0.5秒ごとにダメージ（3秒、最大3枚）",
  },
  spark: { ko: "벽을 뚫고 지나감 · 3번 맞히면 한 번 더 공격", en: "Passes through walls · Every 3 hits strikes once more", ja: "壁を通り抜ける · 3回当てるともう1回攻撃" },
  blaze: {
    ko: "맞은 적이 불탐 · 5번 맞히면 3배 피해와 주변 폭발",
    en: "Burns enemies · Every 5 hits deals 3x damage and explodes",
    ja: "当たった敵が燃える · 5回当てると3倍ダメージと周囲に爆発",
  },
  frost: { ko: "5번 맞히면 적이 1.5초 경직 (보스는 절반)", en: "Every 5 hits stuns the enemy for 1.5s (half for bosses)", ja: "5回当てると敵が1.5秒硬直（ボスは半分）" },
  bloom: {
    ko: "벚꽃이 빠르게 나갔다가 점점 아주 느려지며 적을 뚫고 지나감 · 5번 맞히면 그 자리에서 폭발",
    en: "A blossom flies out fast, then slows to a gentle drift through enemies · Every 5 hits explodes on the spot",
    ja: "桜が速く飛び出し、だんだんとても遅くなりながら敵を貫いて進む · 5回当てるとその場で爆発",
  },
  radiant: { ko: "3번 맞히면 적을 밀쳐 냄", en: "Every 3 hits knocks the enemy back", ja: "3回当てると敵を押し返す" },
  shade: { ko: "부채꼴로 5장 · 5번 맞히면 등 뒤에서 유도 부적 5장이 나가 적을 쫓아가 범위로 터짐", en: "Fires 5 in a fan · Every 5 hits launches 5 homing talismans from behind you that chase enemies and explode in an area", ja: "扇状に5枚 · 5回当てると背後から追尾する符が5枚飛び出し、敵を追って範囲で爆発" },
  quake: {
    ko: "사거리 무제한, 지나가는 자리 주변에 계속 피해 · 5번 맞히면 3초 동안 공격 속도 +50%",
    en: "Unlimited range, damages around its path · Every 5 hits: attack speed +50% for 3s",
    ja: "射程無制限、通り道の周りに継続ダメージ · 5回当てると3秒間攻撃速度+50%",
  },
};
