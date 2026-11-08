// 버프 창: 새벽의 성흔 줄 (각성 남은 시간 · 블래스트 · 네일러 · 시저스 · 헬피스트 · 실버불렛 · 루나틱 · 인시전) · 헬피스트 악마화 스택 (사거리 증가) · 실버불렛 연사 남은 시간 · 인시전 도륙 콤보
import { comboTier, HELLFIST, HELLFIST_PERKS, INCISION, isHellfist, isIncision, rageOf, type PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

const LABEL: Partial<Record<string, TextKey>> = { blast: "bfSgAwake", nailer: "bfNlAwake", scissors: "bfSxAwake", hellfist: "bfHfAwake", silverBullet: "bfSbAwake", blueFlame: "bfBzAwake", lunatic: "bfLnAwake", incision: "bfIcAwake" };

/** 헬피스트 악마화: 스택 · 늘어난 사거리 % */
function rageBuff(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  const n = isHellfist(p) ? rageOf(p) : 0;
  if (n <= 0) return [];
  const per = p.passives.includes("hfSpread") ? HELLFIST_PERKS.hfSpread.per : HELLFIST.ragePer;
  return [{ key: "hfRage", label: t("bfHfRage").replace("{n}", String(n)).replace("{p}", String(Math.round(n * per * 100))), tip: t("bfHfRageTip") }];
}

/** 인시전 도륙 콤보: 콤보 · 단계 · 늘어난 공격 속도·피해 % */
function comboBuff(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  const n = isIncision(p) ? (p.icCombo ?? 0) : 0;
  if (n <= 0) return [];
  const k = comboTier(p);
  const label = t("bfIcCombo").replace("{n}", String(n)).replace("{t}", String(k)).replace("{a}", String(Math.round(k * INCISION.tierSpeed * 100))).replace("{d}", String(Math.round(k * INCISION.tierDmg * 100)));
  return [{ key: "icCombo", label, tip: t("bfIcComboTip") }];
}

/** 실버불렛 연사: 남은 초 */
function barrageBuff(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  const b = p.sbBarrage;
  return b ? [{ key: "sbBarrage", label: t("bfSbBarrage").replace("{s}", String(Math.ceil(b.t / 60))), tip: t("bfSbBarrageTip") }] : [];
}

export function blastBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  const k = LABEL[p.characterId];
  const rage = [...rageBuff(p, t), ...barrageBuff(p, t), ...comboBuff(p, t)];
  if (!k || !(p.sgAwake ?? 0)) return rage;
  return [{ key: "sgAwake", label: t(k).replace("{s}", String(Math.ceil(p.sgAwake! / 60))), tip: t("sgGaugeTip") }, ...rage];
}
