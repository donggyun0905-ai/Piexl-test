// 에테르 광부(히든, 시즌 2): 곡괭이로 적을 "캐서" 에테르 원석을 모음 · 곡괭이 10개 (계산은 sim/miner)
import type { WeaponDef } from "./content";

/** 캐는 방식: swing 앞쪽 곡괭이질 · drill 드릴(빠르게 여러 번) · tnt 다이너마이트 놓기 · cart 광차 밀어 보내기
 *  · pit 구덩이 파기(빠진 적은 끝) · magnet 끌어당기기 · gem 보석으로 굳히기 · throw 곡괭이 던지기(돌아옴) · pillar 에테르 기둥 */
export type PickMode = "swing" | "drill" | "tnt" | "cart" | "pit" | "magnet" | "gem" | "throw" | "pillar";

/** 방식 · 휘두르는 거리 · 넓이(코사인) · 몇 번째 곡괭이질마다 땅이 갈라지는지(0이면 안 갈라짐) */
export interface PickStyle {
  mode: PickMode;
  reach: number;
  arc: number;
  crack: number;
}

const P = (id: string, damageMul: number, attackSpeed: number, range: number, pick: PickStyle) =>
  ({ id, kind: "pick", damageMul, attackSpeed, range, projectileSpeed: 3, pick, exclusive: "miner" }) as const;

export const MINER_WEAPONS = {
  /** 낡은 곡괭이 (처음 무기): 앞쪽을 찍고 세 번째마다 땅이 갈라짐 */
  mnPick: P("mnPick", 1, 1.3, 40, { mode: "swing", reach: 30, arc: 0.1, crack: 3 }),
  /** 에테르 드릴: 아주 빠르게 갈아 냄 (원석이 두 배로 나옴) */
  mnDrill: P("mnDrill", 0.35, 4, 34, { mode: "drill", reach: 26, arc: 0.5, crack: 0 }),
  /** 거대 곡괭이: 느리지만 찍을 때마다 땅이 크게 갈라짐 */
  mnSledge: P("mnSledge", 2.2, 0.6, 48, { mode: "swing", reach: 40, arc: -0.2, crack: 1 }),
  /** 발파 곡괭이: 찍을 때마다 가장 가까운 적 발밑에 다이너마이트 */
  mnTnt: P("mnTnt", 0.9, 1.1, 80, { mode: "tnt", reach: 30, arc: 0.1, crack: 0 }),
  /** 광차 곡괭이: 세 번째마다 광차가 굴러가며 다 치고 지나감 */
  mnCart: P("mnCart", 1, 1.2, 160, { mode: "cart", reach: 30, arc: 0.1, crack: 0 }),
  /** 구덩이 삽: 네 번째마다 적 발밑에 구덩이 (빠진 보통 적은 그대로 끝, 보스는 크게 다침) */
  mnPit: P("mnPit", 0.9, 1.2, 70, { mode: "pit", reach: 30, arc: 0.1, crack: 0 }),
  /** 자석 곡괭이: 찍을 때마다 둘레 적을 끌어당김 */
  mnMagnet: P("mnMagnet", 1, 1.2, 40, { mode: "magnet", reach: 34, arc: -0.3, crack: 0 }),
  /** 보석 곡괭이: 맞은 적이 확률로 보석이 되어 굳음, 굳은 적을 찍으면 3배로 깨짐 */
  mnGem: P("mnGem", 1, 1.3, 40, { mode: "gem", reach: 30, arc: 0.1, crack: 0 }),
  /** 던지는 곡괭이: 빙글빙글 날아가 뚫고 되돌아옴 */
  mnThrow: P("mnThrow", 1.1, 1, 130, { mode: "throw", reach: 30, arc: 0.1, crack: 0 }),
  /** 에테르 공명 곡괭이: 맞힐 때마다 다른 적 머리 위로 에테르 기둥 */
  mnEther: P("mnEther", 1, 1.2, 40, { mode: "pillar", reach: 30, arc: 0.1, crack: 3 }),
} as const satisfies Record<string, WeaponDef>;

/** 에테르 광부 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const MINER = {
  /** 땅 갈라짐: 길이 · 폭 · 터지기까지 틱 · 피해 배율 */
  crackLen: 80,
  crackWidth: 9,
  crackDelay: 20,
  crackMul: 1.6,
  /** 원석화: 쓰러진 보통 적이 남기는 에테르 결정 (최대 수 · 남는 틱 · 깨면 나오는 파편 수·피해 배율 · 깨면 얻는 원석) */
  nodeMax: 10,
  nodeTicks: 600,
  shards: 6,
  shardMul: 0.8,
  nodeOre: 3,
  /** 광산 붕괴: 원석이 이만큼 모이면 방 전체에 바위가 떨어짐 (바위 수 · 떨어지기까지 · 범위 · 피해 배율) */
  caveNeed: 100,
  rocks: 12,
  rockDelay: 40,
  rockR: 22,
  rockMul: 3,
  /** 땅굴(대시): 땅속에 숨어 무적, 나오며 둘레를 터뜨림 (범위 · 피해 배율 · 기절 틱) */
  burrowR: 42,
  burrowMul: 1.5,
  burrowStun: 30,
  /** 다이너마이트: 터지기까지 · 범위 · 피해 배율 */
  tntDelay: 45,
  tntR: 38,
  tntMul: 2.5,
  /** 광차: 몇 번째마다 · 크기 · 속도 · 피해 배율 */
  cartEvery: 3,
  cartR: 9,
  cartSpeed: 3.2,
  cartMul: 2,
  /** 구덩이: 몇 번째마다 · 크기 · 남는 틱 · 최대 수 · 보스가 빠졌을 때 피해 배율 */
  pitEvery: 4,
  pitR: 14,
  pitTicks: 360,
  pitMax: 3,
  pitBossMul: 6,
  /** 자석: 끌어당기는 범위 · 거리 */
  magnetR: 120,
  magnetPull: 20,
  /** 보석: 굳을 확률 · 굳는 틱 · 깨질 때 배율 */
  gemChance: 0.25,
  gemTicks: 120,
  gemMul: 3,
  /** 던지는 곡괭이: 크기 · 피해 배율 */
  throwR: 6,
  /** 에테르 기둥 피해 배율 */
  pillarMul: 1.5,
};
