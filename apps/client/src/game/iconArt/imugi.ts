// 이무기 아이콘: 용의 창 10개(무기 빛깔의 창날 + 용의 힘 표시) · 여의주 · 전용 아이템 10개
import type { DragonArt, PassiveId, WeaponId } from "@pixel-rogue/shared";
import { D, K, Pen, S } from "./pen";

const JADE = "#2a6a5a";
const GOLD = "#ffd040";

/** 용 비늘 자루 (왼쪽 아래 → 오른쪽 위) + 빛깔 창날 + 자루를 감은 용 */
function lance(g: Pen, c: string): void {
  g.line(1, 15, 10, 6, JADE).px(3, 13, GOLD).px(6, 10, GOLD).px(9, 7, GOLD);
  g.line(10, 6, 14, 2, S).line(11, 6, 14, 3, c).px(14, 1, "#fff");
  // 감은 용 몸 (S자)
  g.px(2, 12, c).px(4, 12, c).px(5, 11, c).px(4, 10, c).px(7, 9, c).px(8, 8, c);
}

/** 무기마다 추가 표시 (오른쪽 아래) */
const MARK: Record<Exclude<DragonArt, "plain" | "pearl">, (g: Pen, c: string) => void> = {
  azure: (g, c) => g.line(12, 8, 10, 11, c).line(10, 11, 13, 11, c).line(13, 11, 11, 15, "#fff"),
  crimson: (g, c) => g.disc(12, 12, 2.5, c).px(12, 12, "#ffd040").px(9, 10, c).px(15, 14, c),
  gale: (g, c) => g.ring(12, 12, 3, c).px(12, 12, "#fff").px(15, 10, c),
  earth: (g, c) => g.rect(9, 12, 6, 3, c).rect(10, 11, 3, 1, "#d8a868").px(14, 11, K),
  holy: (g, c) => g.line(12, 8, 12, 15, c).line(9, 12, 15, 12, c).px(12, 12, "#fff"),
  shadow: (g, c) => g.line(9, 10, 10, 13, "#fff").line(12, 10, 12, 14, "#fff").line(15, 10, 14, 13, "#fff").line(9, 15, 15, 15, c),
  silver: (g, c) => g.px(10, 10, c).px(14, 10, c).px(12, 12, "#fff").px(10, 14, c).px(14, 14, c).px(12, 9, D).px(12, 15, D),
  venom: (g, c) => g.disc(12, 13, 2, c).px(12, 10, c).px(11, 9, c).px(13, 13, "#d8ffc0"),
  sky: (g, c) => g.rect(8, 9, 8, 2, c).rect(9, 11, 6, 1, "#8aa8ff").line(10, 12, 9, 15, c).line(14, 12, 15, 15, c),
};

const W = (art: Exclude<DragonArt, "plain" | "pearl">, c: string) => (g: Pen) => {
  lance(g, c);
  MARK[art](g, c);
};

type ImugiWeapon = "imugiSpear" | "azureDragon" | "crimsonDragon" | "galeDragon" | "earthDragon" | "holyDragon" | "shadowDragon" | "silverDragon" | "venomDragon" | "skyDragon" | "dragonPearl";
type ImugiPassive = "dragonEye" | "ascension" | "scaleArmor" | "dragonRage" | "cloudRide" | "scaleGuard" | "thunderCry" | "longBreath" | "lingering" | "dragonLance" | "dragonBlood";

export const IMUGI_WEAPON_ART: Record<ImugiWeapon & WeaponId, (g: Pen) => void> = {
  imugiSpear: (g) => lance(g, GOLD),
  azureDragon: W("azure", "#3a8aff"),
  crimsonDragon: W("crimson", "#ff3a3a"),
  galeDragon: W("gale", "#7ae0ff"),
  earthDragon: W("earth", "#b07a3a"),
  holyDragon: W("holy", "#ffe860"),
  shadowDragon: W("shadow", "#a04aff"),
  silverDragon: W("silver", "#e8eef8"),
  venomDragon: W("venom", "#4ae05a"),
  skyDragon: W("sky", "#2a4ad8"),
  dragonPearl: (g) => {
    g.disc(8, 8, 6, "#ffe8a0").disc(8, 8, 4, "#fff6d0").px(6, 6, "#fff").px(5, 7, "#fff");
    g.ring(8, 8, 7, "#ffb030").line(12, 2, 10, 5, "#fff").line(10, 5, 12, 5, "#fff");
  },
};

/** 용 머리 (작게) */
function head(g: Pen, x: number, y: number, c: string): void {
  g.rect(x, y, 4, 3, c).px(x + 4, y + 1, c).px(x + 1, y, "#fff").px(x - 1, y - 1, c).px(x + 3, y + 3, "#fff");
}

export const IMUGI_PASSIVE_ART: Record<ImugiPassive & PassiveId, (g: Pen) => void> = {
  dragonEye: (g) => {
    // 화룡점정: 여의주를 문 용 머리 + 번개
    head(g, 1, 6, GOLD);
    g.disc(8, 9, 2.5, "#fff0a0").px(7, 8, "#fff");
    g.line(13, 0, 11, 5, "#fff").line(11, 5, 14, 5, "#fff").line(14, 5, 11, 12, "#ffe860").px(4, 7, "#ff3a3a");
  },
  ascension: (g) => {
    g.line(4, 15, 8, 9, GOLD).line(8, 9, 6, 6, GOLD).line(6, 6, 10, 3, GOLD);
    head(g, 9, 1, GOLD);
    g.px(3, 4, "#fff").px(13, 8, "#fff");
  },
  scaleArmor: (g) => {
    g.rect(4, 3, 8, 11, JADE);
    for (let y = 4; y < 14; y += 3) for (let x = 4 + (y % 2); x < 12; x += 3) g.px(x, y, GOLD).px(x + 1, y + 1, "#5ab8a0");
  },
  dragonRage: (g) => {
    head(g, 4, 6, "#ff4a3a");
    g.px(9, 9, "#ffd040").px(10, 10, "#ff8a2a").px(11, 9, "#ffd040").px(12, 11, "#ff8a2a").ring(8, 8, 7, GOLD);
  },
  cloudRide: (g) => {
    g.rect(2, 10, 12, 3, "#e8ecf4").rect(4, 8, 5, 2, "#e8ecf4").rect(9, 9, 4, 1, "#e8ecf4");
    head(g, 8, 3, GOLD);
    g.line(3, 6, 8, 5, GOLD);
  },
  scaleGuard: (g) => {
    g.rect(4, 2, 8, 9, JADE).line(4, 11, 8, 14, JADE).line(12, 11, 8, 14, JADE);
    g.px(6, 5, GOLD).px(9, 5, GOLD).px(7, 8, GOLD).px(8, 11, GOLD);
  },
  thunderCry: (g) => {
    head(g, 2, 6, GOLD);
    g.line(9, 2, 7, 7, "#fff").line(7, 7, 11, 7, "#fff").line(11, 7, 8, 14, "#ffe860");
  },
  longBreath: (g) => {
    // 쌍룡: 나란히 솟는 용 둘
    g.line(3, 15, 5, 8, GOLD).line(10, 15, 12, 8, "#ff6a3a");
    head(g, 2, 4, GOLD);
    head(g, 9, 4, "#ff6a3a");
  },
  lingering: (g) => {
    g.ring(8, 8, 6, GOLD).ring(8, 8, 4, "#a8781e").px(8, 2, "#fff").px(14, 8, "#fff");
    g.line(8, 8, 8, 4, S).line(8, 8, 11, 9, S);
  },
  dragonLance: (g) => {
    g.line(1, 15, 13, 3, JADE).line(11, 3, 15, 1, S).line(12, 4, 15, 1, GOLD).px(15, 0, "#fff");
    g.line(5, 7, 9, 3, D).px(4, 8, D);
  },
  dragonBlood: (g) => {
    g.disc(8, 10, 4, "#c8202e").line(8, 3, 8, 6, "#c8202e").px(7, 6, "#c8202e").px(9, 6, "#c8202e");
    g.px(6, 9, "#ff8a8a").px(11, 4, GOLD).px(4, 4, GOLD).px(8, 10, K);
  },
};
