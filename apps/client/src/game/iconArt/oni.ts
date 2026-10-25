// 오니 아이콘: 도깨비 방망이 10개 (무기마다 색·속성 무늬) · 전용 아이템 18개
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import { K, Pen } from "./pen";

/** 방망이: 손잡이(왼쪽 아래) → 굵은 머리(오른쪽 위) + 박힌 징 */
function club(g: Pen, body: string, hi: string, stud: string): void {
  g.line(2, 14, 6, 10, K).line(3, 14, 6, 11, "#6a4a32");
  for (let i = 0; i < 6; i++) g.disc(7 + i, 9 - i, 2, K);
  for (let i = 0; i < 6; i++) g.disc(7 + i, 9 - i, 1, body);
  g.line(7, 8, 12, 3, hi);
  for (const [x, y] of [[8, 10], [10, 6], [12, 4], [13, 7], [9, 7]] as const) g.px(x, y, stud);
}

type OniWeapon = "thunderClub" | "frostClub" | "lotusClub" | "goldClub" | "yamataClub" | "genesisPillar" | "windClub" | "tideClub" | "blackThunder" | "azureThunder";
type OniPassive =
  | "oniThunderCloud" | "oniJudgment" | "oniChainBolt" | "oniFrostMail" | "oniPermafrost" | "oniSpiritEcho" | "oniHellBrand" | "oniRedLotus" | "oniBloodFlame"
  | "oniEightHeads" | "oniAbyssDrink" | "oniShadowSpread" | "oniTyphoonEye" | "oniGale" | "oniTwinWind" | "oniGreatWave" | "oniSprayChain" | "oniDragonPalace";

const bolt = (g: Pen, x: number, y: number, c: string) => g.line(x, y, x - 2, y + 3, c).line(x - 2, y + 3, x + 1, y + 3, c).line(x + 1, y + 3, x - 1, y + 6, c);

export const ONI_WEAPON_ART: Record<OniWeapon & WeaponId, (g: Pen) => void> = {
  thunderClub: (g) => {
    club(g, "#c8a040", "#ffe08a", "#fff4c0");
    bolt(g, 4, 1, "#ffe04a");
  },
  frostClub: (g) => {
    club(g, "#5ab8e8", "#c8f0ff", "#ffffff");
    g.px(2, 3, "#c8f0ff").px(3, 2, "#c8f0ff").px(3, 4, "#c8f0ff").px(4, 3, "#c8f0ff").px(3, 3, "#fff");
  },
  lotusClub: (g) => {
    club(g, "#c83a2a", "#ff8a4a", "#ffd040");
    g.disc(3, 4, 2, "#ff6a2a").px(3, 3, "#ffd040").px(3, 1, "#ff6a2a");
  },
  goldClub: (g) => {
    club(g, "#e8b030", "#fff0a0", "#ffffff");
    g.disc(3, 3, 2, "#ffd040").px(3, 3, "#c88a20");
  },
  yamataClub: (g) => {
    club(g, "#2a1a3a", "#6a3aa8", "#9a4aff");
    g.px(2, 3, "#9a4aff").px(4, 2, "#9a4aff").px(3, 5, "#6a3aa8");
  },
  genesisPillar: (g) => {
    club(g, "#e8e0c8", "#ffffff", "#ffd040");
    for (const [x, y] of [[3, 0], [3, 6], [0, 3], [6, 3]] as const) g.line(3, 3, x, y, "#fff4c0");
  },
  windClub: (g) => {
    club(g, "#3aa878", "#8af0c0", "#e0fff0");
    g.ring(3, 4, 2, "#8af0c0").px(5, 2, "#e0fff0");
  },
  tideClub: (g) => {
    club(g, "#2a6ad8", "#7ac8ff", "#e0f4ff");
    g.line(0, 5, 2, 3, "#7ac8ff").line(2, 3, 4, 4, "#7ac8ff").line(4, 4, 6, 2, "#e0f4ff");
  },
  blackThunder: (g) => {
    club(g, "#14101c", "#5a3a8a", "#c8a0ff");
    bolt(g, 4, 1, "#3a2a5a");
  },
  azureThunder: (g) => {
    club(g, "#2a8ac8", "#9ae8ff", "#ffffff");
    bolt(g, 4, 1, "#6ad8ff");
  },
};

/** 아이템 바탕 모양: 동그란 부적 위 속성 무늬 */
const seal = (g: Pen, c: string) => g.disc(8, 8, 6, K).disc(8, 8, 5, c);

export const ONI_PASSIVE_ART: Record<OniPassive & PassiveId, (g: Pen) => void> = {
  oniThunderCloud: (g) => g.disc(6, 6, 3, "#8a8aa0").disc(10, 5, 3, "#a8a8c0").rect(4, 6, 9, 3, "#8a8aa0").line(8, 10, 6, 13, "#ffe04a").line(6, 13, 9, 13, "#ffe04a").line(9, 13, 7, 15, "#ffe04a"),
  oniJudgment: (g) => {
    seal(g, "#c8a040");
    bolt(g, 9, 4, "#fff4c0");
  },
  oniChainBolt: (g) => g.disc(3, 8, 2, "#ffe04a").disc(13, 4, 2, "#ffe04a").disc(12, 13, 2, "#ffe04a").line(3, 8, 13, 4, "#fff4c0").line(13, 4, 12, 13, "#fff4c0"),
  oniFrostMail: (g) => g.rect(3, 3, 10, 10, K).rect(4, 4, 8, 8, "#9ae8ff").line(8, 4, 8, 11, "#ffffff").line(4, 8, 11, 8, "#ffffff"),
  oniPermafrost: (g) => g.rect(1, 11, 14, 4, "#9ae8ff").rect(1, 11, 14, 1, "#ffffff").line(5, 3, 5, 9, "#c8f0ff").line(2, 6, 8, 6, "#c8f0ff").line(11, 4, 11, 9, "#c8f0ff"),
  oniSpiritEcho: (g) => g.disc(8, 6, 4, "#c8f0ff").rect(4, 6, 9, 6, "#c8f0ff").px(6, 6, K).px(10, 6, K).px(5, 12, "#9ae8ff").px(8, 13, "#9ae8ff").px(11, 12, "#9ae8ff"),
  oniHellBrand: (g) => {
    seal(g, "#c83a2a");
    g.disc(8, 9, 2, "#ffd040").px(8, 5, "#ff8a4a").px(7, 6, "#ff8a4a");
  },
  oniRedLotus: (g) => g.disc(8, 9, 2, "#ffd040").disc(4, 7, 3, "#e83a48").disc(12, 7, 3, "#e83a48").disc(8, 4, 3, "#ff6a6a").disc(8, 12, 2, "#c82a36"),
  oniBloodFlame: (g) => g.disc(8, 10, 4, "#c82a36").px(8, 5, "#c82a36").px(7, 6, "#c82a36").px(9, 6, "#c82a36").disc(8, 10, 2, "#ff8a4a"),
  oniEightHeads: (g) => {
    for (let i = 0; i < 4; i++) g.line(2 + i * 4, 14, 2 + i * 4 + (i % 2 ? 1 : -1), 4, "#6a3aa8").px(2 + i * 4 + (i % 2 ? 1 : -1), 3, "#9a4aff");
  },
  oniAbyssDrink: (g) => g.disc(8, 8, 6, "#14101c").disc(8, 8, 4, "#2a1a3a").disc(8, 8, 2, "#9a4aff").px(8, 8, "#e0c8ff"),
  oniShadowSpread: (g) => g.disc(5, 9, 3, "#6a3aa8").disc(11, 9, 3, "#4a2a7a").disc(8, 5, 3, "#9a4aff"),
  oniTyphoonEye: (g) => g.ring(8, 8, 6, "#8af0c0").ring(8, 8, 4, "#3aa878").disc(8, 8, 1, "#e0fff0"),
  oniGale: (g) => g.line(2, 5, 13, 5, "#8af0c0").line(4, 8, 15, 8, "#e0fff0").line(1, 11, 11, 11, "#8af0c0"),
  oniTwinWind: (g) => g.ring(5, 8, 3, "#8af0c0").ring(11, 8, 3, "#3aa878").px(5, 8, "#e0fff0").px(11, 8, "#e0fff0"),
  oniGreatWave: (g) => g.disc(6, 10, 5, "#2a6ad8").disc(9, 7, 4, "#3a9aff").line(5, 4, 12, 4, "#e0f4ff").px(13, 5, "#e0f4ff"),
  oniSprayChain: (g) => g.disc(3, 12, 2, "#3a9aff").disc(8, 7, 2, "#3a9aff").disc(13, 3, 2, "#3a9aff").px(3, 11, "#e0f4ff").px(8, 6, "#e0f4ff").px(13, 2, "#e0f4ff"),
  oniDragonPalace: (g) => g.rect(3, 6, 10, 8, "#c83a2a").rect(2, 4, 12, 2, "#2a6ad8").rect(4, 2, 8, 2, "#2a6ad8").rect(7, 9, 2, 5, "#ffd040"),
};
