// 이무기 전용 무기: 찌르기와 휘두르기를 한 번에 (맞은 적마다 무기별 추가 공격) · 여의주는 방 안 모든 적에게 번개 (콤보에 안 셈). 계산은 sim/imugi·imugiArts
import type { WeaponDef } from "./content";

/** 무기마다 추가 공격 종류 */
export type DragonArt = "plain" | "azure" | "crimson" | "gale" | "earth" | "holy" | "shadow" | "silver" | "venom" | "sky" | "pearl";

const D = (id: string, dragon: DragonArt, damageMul = 1, attackSpeed = 1.8, range = 46) =>
  ({ id, kind: "dragon", damageMul, attackSpeed, range, projectileSpeed: 0, arcCos: 0.3, dragon, exclusive: "imugi" }) as const;

export const IMUGI_WEAPONS = {
  /** 이무기의 창 (처음 무기): 찌르기 + 휘두르기 */
  imugiSpear: D("imugiSpear", "plain", 1.1),
  /** 청룡: 맞은 적 위로 번개 5번 */
  azureDragon: D("azureDragon", "azure"),
  /** 적룡: 맞은 적 자리에서 붉은 폭발 */
  crimsonDragon: D("crimsonDragon", "crimson"),
  /** 풍룡: 맞은 적에게 3초 폭풍 (계속 피해) */
  galeDragon: D("galeDragon", "gale"),
  /** 토룡: 맞은 적이 느려짐 · 맞힐 때마다 보호막, 보호막만큼 공격력 */
  earthDragon: D("earthDragon", "earth"),
  /** 성룡: 맞은 적에게서 크게 빛이 터지며 밀어냄 */
  holyDragon: D("holyDragon", "holy"),
  /** 암룡: 맞은 적 밑에서 어둠 늑대가 깨묾 (깨물 때마다 점점 세게) */
  shadowDragon: D("shadowDragon", "shadow"),
  /** 은룡: 맞은 적에게서 은빛 파편이 사방으로 */
  silverDragon: D("silverDragon", "silver"),
  /** 사룡: 맞은 적이 중독 (때릴수록 겹침) */
  venomDragon: D("venomDragon", "venom"),
  /** 천룡: 확률로 맞은 적 위에 넓게 하늘이 떨어짐 */
  skyDragon: D("skyDragon", "sky"),
  /** 여의주: 방 안 모든 적에게 번개 (빠름, 콤보에 안 셈) */
  dragonPearl: { id: "dragonPearl", kind: "dragon", damageMul: 1, attackSpeed: 3, range: 400, projectileSpeed: 0, dragon: "pearl", exclusive: "imugi" },
} as const satisfies Record<string, WeaponDef>;

/** 무기마다 빛깔 (찌르기·휘두르기·추가 공격·콤보 100 용) */
export const DRAGON_COLORS: Record<DragonArt, string> = {
  plain: "#ffd040",
  azure: "#3a8aff",
  crimson: "#ff3a3a",
  gale: "#7ae0ff",
  earth: "#b07a3a",
  holy: "#ffe860",
  shadow: "#a04aff",
  silver: "#e8eef8",
  venom: "#4ae05a",
  sky: "#2a4ad8",
  pearl: "#7ad0ff",
};

/** 이무기 수치 (배율은 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const IMUGI = {
  /** 콤보: 이만큼이면 오라 · 이만큼이면 용 · 용 뒤에 여기서 다시 */
  aura: 72,
  ult: 108,
  restart: 20,
  /** 용을 부를 때마다 영구 치명타 확률 +15% (이번 판 내내, 최대 72%) · 치명타 피해 배율 */
  wakeCrit: 0.15,
  wakeCritMax: 0.72,
  critMul: 1.5,
  /** 용이 됨(콤보 108): 8초 동안 오라보다 강한 몸 · 들어설 때 보호막 */
  form: { ticks: 480, damage: 1.45, hp: 40, shield: 40, move: 0.3, speed: 1.45 },
  /** 오라(콤보 72 이상): 공격력 · 최대 체력 · 들어설 때 보호막 · 이동 · 공격 속도 */
  auraDamage: 1.2,
  auraHp: 20,
  auraShield: 20,
  auraMove: 0.2,
  auraSpeed: 1.2,
  /** 찌르기 굵기(반) · 휘두르기 반경 배율 */
  width: 6,
  swingReach: 0.8,
  /** 용(콤보 100): 맵 아래에서 위로 지나가며 머리가 지나간 적마다 피해 · 빠르기(픽셀/틱) · 맵 밖에서 나오고 사라지는 거리 */
  ultMul: 4.5,
  /** 용이 지나갈 때 더해지는 적 최대 체력 비율 (보스는 최대 체력의 1/5 기준) */
  ultHp: 0.2,
  ultBossDiv: 5,
  ultSpeed: 3,
  ultMargin: 140,
  azure: { bolts: 5, gap: 6, mul: 0.1 },
  crimson: { mul: 0.3, radius: 18 },
  /** 풍룡: 3초 동안 0.1초마다 2% (총 60%) */
  gale: { mul: 0.02, ticks: 180, every: 6 },
  /** 토룡: 맞힐 때마다 공격력 5% 보호막 (토룡으로는 최대 10) · 토룡 보호막의 50%만큼 공격력 + */
  earth: { slow: 90, shield: 0.05, shieldMax: 10, perShield: 0.5 },
  holy: { mul: 0.2, radius: 36, push: 40 },
  shadow: { muls: [0.1, 0.2, 0.3, 0.45] },
  silver: { shards: 8, mul: 0.15, speed: 3, range: 54 },
  /** 사룡: 1초마다 최대 체력(보스는 1/5)의 2% × 겹친 수, 3초 (맞힐 때마다 다시 3초) */
  venom: { pct: 0.02, stacks: 5, ticks: 180, bossDiv: 5 },
  sky: { chance: 0.3, mul: 1, radius: 40 },
  /** 여의주: 번개 피해 · 화룡점정이면 한 번 피해를 hits번으로 나눠 every틱마다 (레이저처럼) */
  pearl: { mul: 0.3, hits: 6, every: 2 },
};
