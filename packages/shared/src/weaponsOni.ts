// 오니(도깨비) 전용 무기: 방망이가 본체. 느리고 센 휘두르기 + 무기마다 n% 확률의 추가 공격(속성 피해). 계산은 sim/oni·oniArts
// 신인족: 휘두를 때마다 게이지가 차고, 다 차면 30초 동안 공격력 +45% · 최대 체력 +50% · 추가 공격 확률 100%
import type { WeaponDef } from "./content";

/** 추가 공격 종류 (무기마다 하나) */
export type ClubArt = "thunder" | "frost" | "lotus" | "gold" | "yamata" | "genesis" | "wind" | "tide" | "black" | "azure";

const W = (id: string, club: ClubArt) => ({ id, kind: "club", damageMul: 1, attackSpeed: 0.75, range: 32, projectileSpeed: 0, arcCos: 0.2, club, exclusive: "oni" }) as const;

export const ONI_WEAPONS = {
  /** 명뢰봉 (처음 무기): 천벌의 번개가 부채꼴로 */
  thunderClub: W("thunderClub", "thunder"),
  /** 빙각금봉: 절대영도 · 보호막 · 빙결 · 한파 (2.5초 머물면 영령) */
  frostClub: W("frostClub", "frost"),
  /** 홍련신주: 업화가 터져 퍼짐 */
  lotusClub: W("lotusClub", "lotus"),
  /** 금봉: 가진 돈으로 때림 (상점 못 씀 · 다른 무기 못 잡음 · 황금방 보너스) */
  goldClub: W("goldClub", "gold"),
  /** 야마타의 그림자: 어둠 + 죽음 상태이상 */
  yamataClub: W("yamataClub", "yamata"),
  /** 창세의 기둥: 낮은 확률로 최대 체력의 3배 */
  genesisPillar: W("genesisPillar", "genesis"),
  /** 풍신소환: 적을 따라가는 폭풍 */
  windClub: W("windClub", "wind"),
  /** 류신금봉: 해일 + 물보라 연쇄 */
  tideClub: W("tideClub", "tide"),
  /** 명계의 흑뢰봉: 검은 번개 (최대 체력 400 이상 · 한 번 되살아난 뒤에만 나옴) */
  blackThunder: W("blackThunder", "black"),
  /** 극한의 청전: 빙뢰 + 서리 (체력 재생력 60 이상 · 한 번 되살아난 뒤에만 나옴) */
  azureThunder: W("azureThunder", "azure"),
} as const satisfies Record<string, WeaponDef>;

/** 오니 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀). 확률은 휘두를 때마다 */
export const ONI = {
  /** 신인족: 게이지(휘두른 횟수) · 지속 · 공격력·최대 체력 배율 */
  gaugeMax: 25,
  godTicks: 1800,
  godDamage: 1.45,
  godHp: 1.5,
  /** 받는 피해 배율 · 기본 체력 재생력(5초마다 이만큼 회복) · 공격력 1 → 최대 체력 · 공격 속도 1% → 재생력 */
  taken: 1.3,
  regenBase: 3,
  hpPerDamage: 5,
  regenPerSpeed: 100,
  thunder: { chance: 0.2, mul: 2, fanMul: 0.5, fanR: 72, fanCos: 0.35 },
  frost: { chance: 0.15, mul: 1.5, shield: 15, freeze: 90, zoneR: 46, zoneTicks: 300, slow: 20, spiritAfter: 150, spiritCd: 300, spiritHp: 0.1 },
  lotus: { chance: 0.2, mul: 1.5, hp: 0.1, fanMul: 0.75, fanR: 64, fanCos: 0.2 },
  gold: { chance: 0.3, pct: 0.77, cost: 0.1, roomGold: 50 },
  yamata: { chance: 0.2, mul: 0.75, ticks: 180 },
  genesis: { chance: 0.05, hp: 3, radius: 40 },
  wind: { chance: 0.35, hp: 0.03, ticks: 300, speed: 0.6, every: 8, r: 16 },
  tide: { chance: 0.3, hp: 0.3, fanR: 58, fanCos: 0.3, push: 24, share: 0.1, chains: 3, gap: 10, chainR: 80 },
  black: { chance: 0.3, mul: 4.44, hp: 0.44, fanMul: 0.5, needHp: 400 },
  azure: { chance: 0.45, hp: 1, def: 0.05, zoneMul: 0.1, spiritMul: 0.3, spiritHp: 0.3, needRegen: 60 },
};
