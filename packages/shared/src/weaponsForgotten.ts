// 잊혀진 자(아스칼론, 시즌 2): 옛 신의 마지막 후손 · 빛으로 싸우는 무기 10개 (계산은 sim/forgotten)
import type { WeaponDef } from "./content";

/** 빛 공격 모양: bolt 빛 탄 · beam 곧은 빛줄기 · nova 몸 둘레 터짐 · fall 하늘에서 떨어지는 빛 십자가 · slash 앞쪽 빛 베기 */
export type LightPattern = "bolt" | "beam" | "nova" | "fall" | "slash";

/** 수 · 사이 각도 · 반지름(터짐·십자가·베기 거리) · 빛줄기 길이·폭 · 십자가가 떨어지기까지 틱 · 흩어지는 거리 · 함께 사방으로 나가는 탄 수 · 느려짐 */
export interface LightStyle {
  pattern: LightPattern;
  n: number;
  spread?: number;
  r?: number;
  len?: number;
  width?: number;
  delay?: number;
  scatter?: number;
  ring?: number;
  slow?: number;
}

const L = (id: string, damageMul: number, attackSpeed: number, range: number, light: LightStyle) =>
  ({ id, kind: "light", damageMul, attackSpeed, range, projectileSpeed: 4.5, light, exclusive: "forgotten" }) as const;

export const FORGOTTEN_WEAPONS = {
  /** 빛의 손길 (처음 무기): 빛 탄 두 갈래 */
  fgGrace: L("fgGrace", 0.8, 2, 150, { pattern: "bolt", n: 2, spread: 0.12 }),
  /** 여래신장: 하늘에서 커다란 빛 십자가 셋이 적 위로 떨어짐 */
  fgTathagata: L("fgTathagata", 1.6, 0.9, 170, { pattern: "fall", n: 3, r: 22, delay: 24 }),
  /** 빛의 창: 곧게 뻗어 모두 꿰뚫는 빛줄기 */
  fgSpear: L("fgSpear", 1.4, 1.2, 190, { pattern: "beam", n: 1, len: 190, width: 6 }),
  /** 성광: 몸 둘레로 빛이 터짐 */
  fgNova: L("fgNova", 1.0, 1.1, 60, { pattern: "nova", n: 1, r: 48 }),
  /** 빛비: 작은 빛 십자가가 적 둘레에 흩어져 쏟아짐 */
  fgRain: L("fgRain", 0.7, 1, 150, { pattern: "fall", n: 6, r: 12, delay: 18, scatter: 26 }),
  /** 빛의 날개: 일곱 갈래 빛 깃털 */
  fgWing: L("fgWing", 0.45, 1.4, 140, { pattern: "bolt", n: 7, spread: 0.14 }),
  /** 프리즘: 세 갈래로 갈라지는 빛줄기 */
  fgPrism: L("fgPrism", 0.8, 1.1, 150, { pattern: "beam", n: 3, spread: 0.35, len: 150, width: 4 }),
  /** 후광: 몸 둘레가 터지며 사방으로 빛 탄 여덟 */
  fgHalo: L("fgHalo", 0.7, 1.2, 110, { pattern: "nova", n: 1, r: 36, ring: 8 }),
  /** 심판의 빛: 느리지만 아주 큰 십자가 하나 (맞으면 느려짐) */
  fgJudge: L("fgJudge", 3.2, 0.6, 180, { pattern: "fall", n: 1, r: 40, delay: 36, slow: 90 }),
  /** 새벽 베기: 앞쪽을 넓게 가르는 빛의 검 */
  fgDawn: L("fgDawn", 1.2, 1.6, 55, { pattern: "slash", n: 1, r: 55 }),
} as const satisfies Record<string, WeaponDef>;

/** 잊혀진 자 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const FORGOTTEN = {
  /** 빛의 고리 게이지: 적을 맞힌 공격 한 번마다 1 · 이만큼이면 가득 → 신족 (틱) · 적에게 맞으면 깎이는 양 */
  ringKills: 40,
  ringLoss: 4,
  godTicks: 600,
  /** 신족: 공격 속도 배율 · 빛기둥 간격 틱 · 한 번에 기둥 수 · 닿는 거리 · 피해(공격력 배율) */
  godSpeed: 2,
  pillarGap: 20,
  pillarN: 3,
  pillarReach: 110,
  pillarMul: 0.3,
  /** 빛 탄 크기 · 베기 폭(코사인) */
  boltR: 2.5,
  slashCos: 0.3,
};
