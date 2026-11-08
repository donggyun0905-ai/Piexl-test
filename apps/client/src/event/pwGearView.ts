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

/** 그림·이름 종류: 패시브 이름표에 없으면 사용 아이템 이름표 (에테르 폭탄·귀환의 문 등) */
export function gearItem(id: string, lang: Lang): IconItem {
  return (itemName("passive", id, lang) === id ? { kind: "use", id } : { kind: "passive", id }) as IconItem;
}
export const gearName = (id: string, lang: Lang): string => {
  const it = gearItem(id, lang);
  return itemName(it.kind, it.id, lang).replace(/^\[[^\]]+\] /, "");
};

/** 역할군마다 추천 전설 장비 (앞에서부터 셋을 보여 줌, 글자 키 pwRec_{역할}{번호} = 왜 좋은지) */
export const PW_REC: Record<PwRoleId, readonly string[]> = {
  warrior: ["blizzardLance", "relicSilver", "gnomeHammer", "aetherBomb", "relicWhite", "fallenWings"],
  ranged: ["relicBlue", "sylphQuiver", "cupidSpirit", "falseHero", "terraform", "relicPrism"],
  mage: ["forbiddenScroll", "dimensionGate", "relicRed", "godShard", "terraform", "portalGun"],
  assassin: ["relicGold", "ifritClaw", "crumblingCrown", "fateDice", "godShard", "portalGun"],
  support: ["laurelShip", "dryadOrb", "cursedDice", "relicGreen", "aphroditeMirror", "fallenWings"],
};
/** 추천 셋: 이미 가진 장비 · 금기된 아티팩트를 하나 가졌으면 다른 아티팩트도 빼고 앞에서부터 (k = 왜 좋은지 글자 번호) */
export const recFor = (c: CharacterId, gear: readonly string[] = []) => {
  const role = pwRoleOf(c);
  const relic = gear.some((g) => PW_LEGEND[g]?.relic);
  const list = PW_REC[role].map((id, k) => ({ id, k })).filter(({ id }) => !gear.includes(id) && !(relic && PW_LEGEND[id]?.relic));
  return { role, list: list.slice(0, 3) };
};
