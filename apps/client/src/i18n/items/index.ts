// 아이템 이름·설명. 패시브·무기 설명은 수치에서 자동으로 만듦 (이름은 names.ts, 효과 설명은 effects.ts)
import { CL_ARMS, type ClArmId, devilCost, PASSIVES, type DevilId, PERKS, USE_ITEMS, WEAPONS, type PassiveDef, type PassiveId, type StatKey, type UseItemId, type WeaponDef, type WeaponId } from "@pixel-rogue/shared";
import { collectorArmDesc } from "./collector";
import type { Lang, TextKey } from "../index";
import { CHARM_DESC } from "./charms";
import { EFFECT_DESC } from "./effects";
import { COMBO_DESC } from "./brawler";
import { GUN_DESC } from "./gunner";
import { BEAST_DESC, type BeastWeapon } from "./beast";
import { NINJA_DESC, type NinjaWeapon } from "./ninja";
import { CHRONO_DESC, type ChronoWeapon } from "./chrono";
import { SUMMON_DESC, type SummonWeapon } from "./summon";
import { CHAKRAM_DESC } from "./bedouin";
import { SPEAR_DESC, type GeneralWeapon } from "./general";
import { DRAGON_DESC } from "./imugi";
import { SIN_DESC } from "./apostle";
import { STAR_DESC } from "./star";
import { DUCK_DESC, type DuckWeapon } from "./duck";
import { EVO_DESC } from "./morphEvo";
import { ANIMAL_DESC, autoDesc, bombDesc, cyberDesc, FORMATION_DESC, GAIA_DESC, GREAT_DESC, MAW_DESC, needleDesc, PLAGUE_DESC, ramDesc, REPULSOR_DESC, rideDesc, REN_DESC, scytheDesc, SNIPER_DESC, TALON_DESC, lightDesc, phantomDesc, katanaDesc, silkDesc, scriptDesc, lionDesc, gemDesc, fangDesc, solarDesc, flailDesc, pickDesc, FATE_DESC, zeusDesc, curioDesc } from "./season2";
import { WORD_DESC } from "./scribe";
import { tagDesc } from "./abandoned";
import { titanDesc } from "./titan";
import { clubDesc } from "./oni";
import { ORBIT_DESC } from "./elemental";
import { GEAR_DESC } from "./gears";
import { MEDIC_DESC } from "./doctor";
import { PASSIVE_NAMES, USE_DESC, USE_NAMES, WEAPON_NAMES, type Names } from "./names";
import { STATION_DESC, STATION_NAME } from "./station";
import { zweiDesc } from "./fallenKing";
import { radiantDesc } from "./lux";

const STAT_LABEL: Record<StatKey, TextKey> = {
  maxHp: "statHp",
  damage: "statDamage",
  attackSpeed: "statAttackSpeed",
  range: "statRange",
  moveSpeed: "statMoveSpeed",
  projectileSpeed: "statProjectileSpeed",
  luck: "statLuck",
};

const num = (v: number) => String(Math.round(v * 100) / 100);

const ORDINAL = ["th", "st", "nd", "rd"];
/** 설명 글의 {값 이름:모양}을 지금 수치로 채움 (pct ×100 · up (값-1)×100 · down (1-값)×100 · sec 틱→초 · nth 영어 서수) */
function fill(text: string, row: Record<string, unknown> | undefined): string {
  return text.replace(/\{(\w+)(?::(\w+))?\}/g, (all, key: string, how?: string) => {
    const v = row?.[key];
    if (typeof v !== "number") return all;
    if (how === "pct") return num(v * 100);
    if (how === "up") return num((v - 1) * 100);
    if (how === "down") return num((1 - v) * 100);
    if (how === "sec") return num(v / 60);
    if (how === "nth") return `${v}${(v % 100 < 11 || v % 100 > 13 ? ORDINAL[v % 10] : undefined) ?? "th"}`;
    return num(v);
  });
}

type ItemKind = "weapon" | "use" | "passive" | "coin" | "reroll" | "trash" | "bench" | "tune" | "gym" | "trial" | "boon" | "altar" | "devil" | "gambler" | "auction" | "forge";

const COIN_NAME: Names = { ko: "돈", en: "Gold", ja: "ゴールド" };
const REROLL_NAME: Names = { ko: "새로고침", en: "Refresh", ja: "入れ替え" };
const REROLL_DESC: Names = {
  ko: "아직 안 산 물건을 새로 바꿉니다 (회복약 제외). 누를 때마다 비싸집니다",
  en: "Replaces items you haven't bought yet (except the Potion). Costs more each time",
  ja: "まだ買っていない品物を入れ替えます（回復薬は除く）。押すたびに高くなります",
};

const TRASH_NAME: Names = { ko: "휴지통", en: "Trash Can", ja: "ゴミ箱" };
const TRASH_DESC: Names = {
  ko: "들고 있는 무기를 버리고 빈손(맨손)이 됩니다. 무기 값의 1/4을 돌려받습니다",
  en: "Throw away your weapon and go empty-handed. Refunds 1/4 of a weapon's price",
  ja: "持っている武器を捨てて素手になります。武器の値段の1/4が戻ります",
};

export function itemName(kind: ItemKind, id: string, lang: Lang): string {
  if (kind === "coin") return COIN_NAME[lang];
  if (kind === "reroll") return REROLL_NAME[lang];
  if (kind === "trash") return TRASH_NAME[lang];
  if (kind === "bench" || kind === "tune" || kind === "gym" || kind === "trial" || kind === "boon" || kind === "altar" || kind === "gambler" || kind === "auction" || kind === "forge") return STATION_NAME[kind][lang];
  if (kind === "devil") kind = "passive"; // 악마의 거래는 패시브 이름
  const table = kind === "weapon" ? WEAPON_NAMES : kind === "use" ? USE_NAMES : PASSIVE_NAMES;
  return (table as Record<string, Names>)[id]?.[lang] ?? id;
}

export function itemDesc(kind: ItemKind, id: string, lang: Lang, t: (k: TextKey) => string, cost?: number): string {
  if (kind === "coin") return "";
  if (kind === "reroll") return REROLL_DESC[lang];
  if (kind === "trash") return TRASH_DESC[lang];
  if (kind === "bench" || kind === "tune" || kind === "gym" || kind === "trial" || kind === "boon" || kind === "altar" || kind === "gambler" || kind === "auction" || kind === "forge") return STATION_DESC[kind][lang];
  if (kind === "devil") return `${itemDesc("passive", id, lang, t)} · ${STATION_DESC.devil[lang].replace("{cost}", String(cost ?? devilCost(id as DevilId)))}`;
  if (kind === "use") return fill(USE_DESC[id as UseItemId][lang], USE_ITEMS[id as UseItemId]);
  if (kind === "weapon") {
    const w: WeaponDef = WEAPONS[id as WeaponId];
    const type = t(w.kind);
    const extra = [
      w.arcCos !== undefined && w.arcCos <= -1 ? t("statSpin") : "",
      w.shots ? `${t("statShots")} ${w.shots}` : "",
      w.pierce && !w.charm && !w.shade ? `${t("statPierce")} ${w.pierce}` : "",
      w.blast ? `${t("statBlast")} ${w.blast}` : "",
      w.charm ? CHARM_DESC[w.charm][lang] : "",
      w.gear ? GEAR_DESC[w.gear][lang] : "",
      w.orbit ? ORBIT_DESC[w.orbit][lang] : "",
      w.combo ? COMBO_DESC[w.combo][lang] : "",
      w.gun ? GUN_DESC[w.gun][lang] : "",
      w.medic ? MEDIC_DESC[w.medic][lang] : "",
      w.beast ? BEAST_DESC[w.id as BeastWeapon][lang] : "",
      w.shade ? NINJA_DESC[w.id as NinjaWeapon][lang] : "",
      w.chrono ? CHRONO_DESC[w.id as ChronoWeapon][lang] : "",
      w.summon ? SUMMON_DESC[w.id as SummonWeapon][lang] : "",
      w.kind === "chakram" ? CHAKRAM_DESC[lang] : "",
      w.spear ? SPEAR_DESC[w.id as GeneralWeapon][lang] : "",
      w.dragon ? DRAGON_DESC[w.dragon][lang] : "",
      w.sin ? SIN_DESC[w.sin][lang] : "",
      w.star ? STAR_DESC[w.star][lang] : "",
      w.quack ? DUCK_DESC[w.id as DuckWeapon][lang] : "",
      w.tag ? tagDesc(w.tag, lang) : "",
      w.titan && w.smash ? titanDesc(w.titan, w.smash, lang) : "",
      w.club ? clubDesc(w.club, lang) : "",
      w.word ? WORD_DESC[w.word][lang] : "",
      w.kind === "gaia" ? GAIA_DESC[lang] : "",
      w.animal ? `${ANIMAL_DESC[w.animal][lang]} · ${EVO_DESC[w.animal][lang]}` : "",
      w.talon ? TALON_DESC[w.talon][lang] : "",
      w.formation ? FORMATION_DESC[w.formation][lang] : "",
      w.kind === "earthwood" ? REN_DESC[lang] : "",
      w.great ? GREAT_DESC[w.great][lang] : "",
      w.kind === "zwei" ? zweiDesc(lang) : "",
      w.kind === "radiant" ? radiantDesc(lang) : "",
      w.plague ? PLAGUE_DESC[w.plague][lang] : "",
      w.combo5 ? scytheDesc(w.combo5, lang) : "",
      w.kind === "maw" ? MAW_DESC[lang] : "",
      w.ram ? ramDesc(w.ram, lang) : "",
      w.needle ? needleDesc(w.needle, lang) : "",
      w.auto ? autoDesc(w.auto, lang) : "",
      w.ride ? rideDesc(w.ride, lang) : "",
      w.bomb ? bombDesc(w.bomb, lang) : "",
      w.kind === "repulse" ? REPULSOR_DESC[lang] : "",
      w.cyber ? cyberDesc(w.cyber, lang) : "",
      w.kind === "snipe" ? SNIPER_DESC[lang] : "",
      w.light ? lightDesc(w.light, lang) : "",
      w.phantom ? phantomDesc(w.phantom, lang) : "",
      w.katana ? katanaDesc(w.katana, lang) : "",
      w.silk ? silkDesc(w.silk, lang) : "",
      w.script ? scriptDesc(w.script, lang) : "",
      w.kind === "lion" ? lionDesc(lang) : "",
      w.kind === "gem" ? gemDesc(lang) : "",
      w.kind === "fang" ? fangDesc(lang) : "",
      w.kind === "solar" ? solarDesc(lang) : "",
      w.flail ? flailDesc(w.flail, lang) : "",
      w.pick ? pickDesc(w.pick, lang) : "",
      w.kind === "fate" ? FATE_DESC[lang] : "",
      w.zeus ? zeusDesc(w.zeus, lang) : "",
      w.curio ? curioDesc(w.curio, lang) : "",
      w.returns ? t("statReturns") : "",
    ]
      .filter(Boolean)
      .map((x) => ` · ${x}`)
      .join("");
    return `${type} · ${t("statDamage")} ×${num(w.damageMul)} · ${t("statAttackSpeed")} ${num(w.attackSpeed)} · ${t("statRange")} ${w.range >= 400 ? "∞" : w.range}${extra}`;
  }
  const def: PassiveDef = PASSIVES[id as PassiveId];
  return `[${t(passiveRole(def))}] ${passiveDesc(id, def, lang, t)}`;
}

/** 패시브 꼬리표: 효과 아이템은 특수, 능력치 아이템은 가장 앞 능력치로 공격·방어·이동·보조 */
function passiveRole(def: PassiveDef): TextKey {
  if (def.effect) return "roleSpecial";
  const st = String(def.mods[0]?.stat ?? "");
  if (["damage", "attackSpeed", "range", "projectileSpeed", "critChance", "critDamage", "sharpness", "statusPower"].includes(st)) return "roleAtk";
  if (["maxHp", "defense", "regen", "dodge", "lifesteal", "dmgReduce"].includes(st)) return "roleDef";
  return st === "moveSpeed" ? "roleMove" : "roleUtil";
}

function passiveDesc(id: string, def: PassiveDef, lang: Lang, t: (k: TextKey) => string): string {
  // 공격 방식 아이템 · 설명이 따로 있는 아이템 (천지창조처럼 여러 개 가질 수 있는 전용 아이템)
  if (def.effect || EFFECT_DESC[id as PassiveId]) {
    const tag = def.exclusive ? `[${t(def.exclusive)} ${t("exclusiveTag")}] ` : "";
    // 수집가 수집 무기: 콤보 기술 + 작은 능력치
    if (id in CL_ARMS) return `${tag}${collectorArmDesc(id as ClArmId, lang)} · ${modsText(def, t)}`;
    return tag + fill(EFFECT_DESC[id as PassiveId]?.[lang] ?? "", (PERKS as Record<string, Record<string, number>>)[id]);
  }
  return modsText(def, t);
}

/** 능력치 아이템 설명 (능력치 · 오름) */
function modsText(def: PassiveDef, t: (k: TextKey) => string): string {
  return def.mods
    .map((m) => {
      const label = t(STAT_LABEL[m.stat]);
      const parts: string[] = [];
      if ("add" in m && m.add !== undefined) parts.push(`${m.add > 0 ? "+" : ""}${num(m.add)}`);
      if ("mul" in m && m.mul !== undefined) parts.push(`${m.mul >= 1 ? "+" : ""}${Math.round((m.mul - 1) * 100)}%`);
      return `${label} ${parts.join(" ")}`;
    })
    .join(" · ");
}
