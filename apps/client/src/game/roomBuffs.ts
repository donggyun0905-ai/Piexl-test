// 로그 버프 창 '방에서 얻은 것' (BuffPanel): 제단에서 고른 카드 · 패시브에 새겨진 증강 기술 · 방에서 바뀐 능력치(시련·제단·도박꾼·악마 합계)
// · 상태이상 면역 · 되살아남 · 악마와의 거래 · 이번 층 시련 저주. 줄마다 마우스를 올리면 설명 (tip)
import { ownSkills, waveSetBonus, WAVE, type PlayerState } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";
import { beatriceBuffs } from "./beatriceBuffs";
import { ianBuffs } from "./ianBuffs";
import { gabrielBuffs } from "./gabrielBuffs";
import { serenaBuffs } from "./serenaBuffs";
import { rafaelBuffs } from "./rafaelBuffs";
import { yurielBuffs } from "./yurielBuffs";
import { michaelaBuffs } from "./michaelaBuffs";
import { blastBuffs } from "./blastBuffs";
import { jokerBuffs } from "./jokerBuffs";
import { puppetBuffs, shadowingBuffs } from "./shadowingBuffs";
import { rabbitBuffs } from "./rabbitBuffs";

export interface RoomBuff {
  key: string;
  label: string;
  tip: string;
  bad?: boolean;
}

const STAT_KEY: Record<string, TextKey> = { sharpness: "statSharpness" };
const statName = (k: string, t: (k: TextKey) => string) => t(STAT_KEY[k] ?? (`gymStat_${k}` as TextKey));
const num = (v: number) => String(Math.round(v * 100) / 100);

/** 방에서 바뀐 능력치 합계: 더하기는 더하고 곱하기는 곱함 → "공격력 +10% · 최대 체력 -20 · 방어력 +20" */
function statSummary(p: PlayerState, t: (k: TextKey) => string): { text: string; bad: boolean } | null {
  const add = new Map<string, number>();
  const mul = new Map<string, number>();
  for (const m of p.boons?.mods ?? []) {
    if (m.add !== undefined) add.set(m.stat, (add.get(m.stat) ?? 0) + m.add);
    if (m.mul !== undefined) mul.set(m.stat, (mul.get(m.stat) ?? 1) * m.mul);
  }
  for (const [k, v] of Object.entries(p.boons?.extra ?? {})) if (typeof v === "number") add.set(k, (add.get(k) ?? 0) + v);
  const parts: string[] = [];
  let bad = 0;
  let good = 0;
  for (const [k, v] of mul) {
    const pc = Math.round((v - 1) * 100);
    if (pc === 0) continue;
    parts.push(`${statName(k, t)} ${pc > 0 ? "+" : ""}${pc}%`);
    if (pc > 0) good++;
    else bad++;
  }
  for (const [k, v] of add) {
    if (Math.abs(v) < 1e-9) continue;
    const pct = k === "critChance" || k === "sharpness" || k === "dodge" || k === "lifesteal";
    parts.push(`${statName(k, t)} ${v > 0 ? "+" : ""}${pct ? `${Math.round(v * 100)}%` : num(v)}`);
    if (v > 0) good++;
    else bad++;
  }
  return parts.length ? { text: parts.join(" · "), bad: bad > good } : null;
}

export function roomBuffs(p: PlayerState, floor: number, lang: Lang, t: (k: TextKey) => string): RoomBuff[] {
  const out: RoomBuff[] = [];
  const skill = (k: string) => `${t(`swarmSkill_${k}` as TextKey)}: ${t(`swarmSkillDesc_${k}` as TextKey)}`;
  const wv = waveSetBonus(p);
  if (wv > 0) out.push({ key: "waveSet", label: t("bfWaveSet").replace("{n}", String(ownSkills(p).length)).replaceAll("{b}", String(wv * WAVE.setAtk)), tip: t("bfWaveSetTip") });
  out.push(...beatriceBuffs(p, t));
  out.push(...ianBuffs(p, t));
  out.push(...gabrielBuffs(p, t));
  out.push(...serenaBuffs(p, t));
  out.push(...rafaelBuffs(p, t));
  out.push(...yurielBuffs(p, t));
  out.push(...michaelaBuffs(p, t));
  out.push(...blastBuffs(p, t));
  out.push(...jokerBuffs(p, t));
  out.push(...shadowingBuffs(p, t));
  out.push(...puppetBuffs(p, t));
  out.push(...rabbitBuffs(p, t));
  const stats = statSummary(p, t);
  if (stats) out.push({ key: "stats", label: t("bfRoomStats"), tip: stats.text, bad: stats.bad });
  (p.altar?.got ?? []).forEach((g, i) => {
    const card = t(g.card === 0 ? "altarCardTrade" : g.card === 1 ? "altarCardAug" : "altarCardIgnore");
    const tip = g.card === 0 ? t(`altarTrade_${g.id}` as TextKey) : g.card === 1 ? t(g.swap ? "bfAltarSwapTip" : "bfAltarAugTip") : g.hit ? t(`altarHit_${g.id}` as TextKey) : t("bfNothing");
    out.push({ key: `altar${i}`, label: `${t("bfAltar")} · ${t(`altar_${g.id}` as TextKey).split(" · ").pop()} — ${card}`, tip, bad: g.card === 2 && !!g.hit });
  });
  for (const [i, a] of (p.augments ?? []).entries()) {
    if (!p.passives.includes(a.passive)) continue;
    out.push({ key: `aug${i}`, label: `✦ ${itemName("passive", a.passive, lang)}`, tip: a.skills.map(skill).join(" / ") });
  }
  if (p.boonImmune) out.push({ key: "immune", label: t("bfImmune"), tip: t("bfImmuneTip") });
  if ((p.trial?.revive ?? 0) > 0) out.push({ key: "revive", label: t("bfRevive").replace("{n}", String(p.trial!.revive)), tip: t("trialChestRevive") });
  if (p.devil?.pact) out.push({ key: "pact", label: t("bfPact"), tip: t("bfPactTip") });
  if (p.trial?.dark === floor) out.push({ key: "dark", label: t("trialPen_8"), tip: t("noticeTrialNo"), bad: true });
  if (p.trial?.hp1 === floor) out.push({ key: "hp1", label: t("trialPen_9"), tip: t("noticeTrialNo"), bad: true });
  return out;
}
