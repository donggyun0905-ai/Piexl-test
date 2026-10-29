// 패왕전 장비 보여 주기 도우미: 능력치 글 · 이름·그림 (히든 아이템 중 던전에서 '사용 아이템'인 것은 그 이름표·그림을 씀) · 역할군별 추천 장비
import { PW_LEGEND, pwGearDef, pwRoleOf, type CharacterId, type PwGearStat, type PwRoleId } from "@pixel-rogue/shared";
import type { IconItem } from "../game/itemIcon";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";

const PCT = new Set(["dmgMul", "rate", "rangeMul", "shot", "crit", "critDmg", "dashCut", "skillDmg", "skillHeal"]);

/** 장비 능력치 글 (한 줄씩) + 전설 특수 효과 */
export function gearLines(id: string, t: (k: TextKey) => string): string[] {
  const d = pwGearDef(id);
  if (!d) return [];
  const out = Object.entries(d as PwGearStat)
    .filter(([k, v]) => typeof v === "number" && k !== "cost" && v !== 0)
    .map(([k, v]) => t(`pwSt_${k}` as TextKey).replace("{n}", PCT.has(k) ? String(Math.round(v * 100)) : k === "move" ? `${v > 0 ? "+" : ""}${v}` : String(v)));
  // 특수 효과 (능력치 줄과 같은 글이면 한 번만)
  const fx = PW_LEGEND[id] ? t(`pwFx_${id}` as TextKey) : "";
  if (fx && !out.includes(fx)) out.push(fx);
  return out;
}

/** 그림·이름 종류: 패시브 이름표에 없으면 사용 아이템 이름표 (에테르 폭탄·포탈건 등) */
export function gearItem(id: string, lang: Lang): IconItem {
  return (itemName("passive", id, lang) === id ? { kind: "use", id } : { kind: "passive", id }) as IconItem;
}
export const gearName = (id: string, lang: Lang): string => {
  const it = gearItem(id, lang);
  return itemName(it.kind, it.id, lang).replace(/^\[[^\]]+\] /, "");
};

/** 역할군마다 추천 전설 장비 셋 (글자 키 pwRec_{역할}{번호} = 왜 좋은지) */
export const PW_REC: Record<PwRoleId, readonly string[]> = {
  warrior: ["blizzardLance", "relicSilver", "gnomeHammer"],
  ranged: ["relicBlue", "sylphQuiver", "cupidSpirit"],
  mage: ["forbiddenScroll", "dimensionGate", "relicRed"],
  assassin: ["relicGold", "ifritClaw", "crumblingCrown"],
  support: ["laurelShip", "dryadOrb", "cursedDice"],
};
export const recFor = (c: CharacterId) => ({ role: pwRoleOf(c), ids: PW_REC[pwRoleOf(c)] });
