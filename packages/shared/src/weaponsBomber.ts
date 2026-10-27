// 붐버(테라코어, 시즌 2) 무기 10개: "폭발은 예술이다". 모두 터지는 무기. 계산은 sim/bomber
import type { WeaponDef } from "./content";

/** 터뜨리는 방식: lob 던져서 떨어진 곳 · sticky 적에게 붙어 늦게 · cluster 작은 폭탄으로 흩어짐 · mine 발밑 지뢰 · rocket 곧게 날아가 맞으면
 *  fan 여러 개를 부채꼴로 · firework 하늘에서 별처럼 · napalm 불바다 · chain 옆 적으로 이어 터짐 · mega 아주 큰 한 방 */
export type BombMode = "lob" | "sticky" | "cluster" | "mine" | "rocket" | "fan" | "firework" | "napalm" | "chain" | "mega";

/** 방식 · 폭발 반경 · 터지기까지 틱 · 수 */
export interface BombStyle {
  mode: BombMode;
  r: number;
  fuse: number;
  n?: number;
}

const B = (id: string, damageMul: number, attackSpeed: number, range: number, bomb: BombStyle) =>
  ({ id, kind: "bomb", damageMul, attackSpeed, range, projectileSpeed: 3.4, bomb, exclusive: "bomber" }) as const;

export const BOMBER_WEAPONS = {
  /** 수류탄 (처음 무기): 겨눈 곳에 던져 터뜨림 */
  bmGrenade: B("bmGrenade", 1.2, 1.1, 120, { mode: "lob", r: 22, fuse: 24 }),
  /** 끈끈이 폭탄: 적 몸에 붙어 4.5초 뒤 터짐 · 많이 붙을수록 범위와 힘이 커짐 */
  bmSticky: B("bmSticky", 1.5, 1.0, 120, { mode: "sticky", r: 24, fuse: 18 }),
  /** 집속탄: 터지며 작은 폭탄 여섯이 흩어짐 */
  bmCluster: B("bmCluster", 0.8, 0.9, 120, { mode: "cluster", r: 16, fuse: 24, n: 6 }),
  /** 유도 지뢰: 적이 없어도 땅에 박아 둠 (최대 6개) · 사거리 안에 적이 오면 눈을 뜨고 달려가 터짐 */
  bmMine: B("bmMine", 1.6, 1.3, 110, { mode: "mine", r: 24, fuse: 0, n: 6 }),
  /** 로켓: 늘 쫓아가 맞으면 터짐 · 25% 확률로 등 뒤에서 작은 유도 미사일 */
  bmRocket: B("bmRocket", 1.3, 1.3, 160, { mode: "rocket", r: 20, fuse: 0 }),
  /** 다이너마이트: 셋을 부채꼴로 */
  bmDynamite: B("bmDynamite", 0.8, 0.9, 110, { mode: "fan", r: 18, fuse: 30, n: 3 }),
  /** 불꽃놀이: 하늘로 쏘아 올려 넓게 별 모양으로 여러 번 터짐 */
  bmFirework: B("bmFirework", 0.6, 0.9, 130, { mode: "firework", r: 20, fuse: 30, n: 12 }),
  /** 네이팜: 터진 자리에 넓은 불바다 (불꽃 스택 x1~x5) */
  bmNapalm: B("bmNapalm", 0.9, 1.0, 120, { mode: "napalm", r: 24, fuse: 24 }),
  /** 연쇄 폭약: 터지면 가까운 적에게 이어서 네 번까지 */
  bmChain: B("bmChain", 0.9, 1.0, 120, { mode: "chain", r: 16, fuse: 24, n: 4 }),
  /** 메가 폭탄: 아주 느리고 아주 큰 한 방 */
  bmMega: B("bmMega", 3.5, 0.35, 120, { mode: "mega", r: 52, fuse: 50 }),
} as const satisfies Record<string, WeaponDef>;

/** 붐버 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const BOMBER = {
  /** 예술 연쇄: 이 틱 안에 또 터지면 한 칸씩 (칸마다 피해 · 반경 +) · 최대 칸 */
  artWindow: 60,
  artDmg: 0.06,
  artR: 0.04,
  artMax: 10,
  /** 터져 쓰러진 적 자리의 여진 (반경 · 공격력 배율) */
  afterR: 14,
  afterMul: 0.4,
  /** 작은 폭탄 · 불바다(남는 틱 · 반경 · 0.5초마다 배율) · 연쇄가 닿는 거리 · 지뢰가 밟히는 거리 */
  bombletMul: 0.5,
  fireTicks: 180,
  fireR: 26,
  fireMul: 0.35,
  chainReach: 60,
  mineTrigger: 10,
  /** 터지는 자리에 내가 있으면 받는 피해 */
  selfDmg: 20,
  /** 끈끈이: 붙고 터지기까지 틱 · 붙은 수 하나마다 반경 + · 피해 + · 최대 수 */
  stickTicks: 270,
  stickR: 0.2,
  stickMul: 0.25,
  stickMax: 10,
  /** 유도 지뢰: 달리는 빠르기 · 이 틱 동안 못 닿으면 그 자리에서 터짐 */
  mineSpeed: 2.4,
  mineTicks: 150,
  /** 유도 지뢰: 박힌 채 이만큼 지나면 그 자리에서 저절로 터짐 (3초) */
  mineFuse: 180,
  /** 로켓: 등 뒤 작은 미사일 확률 · 수 · 피해 배율 */
  rocketMini: 0.25,
  rocketMiniN: 3,
  rocketMiniMul: 0.3,
  /** 불꽃놀이 별이 퍼지는 거리 · 네이팜 불 자리 수 · 퍼지는 거리 */
  starSpread: 52,
  napalmPatches: 3,
  napalmSpread: 22,
};
