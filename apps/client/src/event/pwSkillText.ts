// 패왕전 스킬 설명 글: 모양 · 피해(숫자) · 상태이상 · 회복 · 버프 · 소환 · 대기 (스킬 칸 말풍선·스킬 보기가 같이 씀)
import { PW, type PwSkillDef } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";

const sec = (ticks: number) => String(Math.round((ticks / 60) * 10) / 10);
const fill = (t: (k: TextKey) => string, k: TextKey, n: number | string, s?: string) => t(k).replace("{n}", String(n)).replace("{s}", s ?? "");

/** 스킬 이름 */
export const skillName = (c: string, k: number, t: (k: TextKey) => string) => t(`pwSk_${c}${k + 1}` as TextKey);

/** 설명 줄들 */
export function skillLines(def: PwSkillDef, t: (k: TextKey) => string): string[] {
  const out: string[] = [];
  const head = [t(`pwShape_${def.shape}` as TextKey)];
  if (def.delay) head.push(fill(t, "pwSkDelay", sec(def.delay)));
  if (def.repeat) head.push(fill(t, "pwSkRepeat", def.repeat.n));
  out.push(head.join(" · "));
  const h = def.hit;
  if (h) {
    const hits = [fill(t, "pwSkDmg", Math.round(PW.skillDmg * h.dmg * (def.repeat?.n ?? 1)))];
    if (h.stun) hits.push(fill(t, "pwSkStun", sec(h.stun)));
    if (h.slow) hits.push(fill(t, "pwSkSlow", sec(h.slow)));
    if (h.root) hits.push(fill(t, "pwSkRoot", sec(h.root)));
    if (h.silence) hits.push(fill(t, "pwSkSilence", sec(h.silence)));
    if (h.dot) hits.push(fill(t, "pwSkDot", sec(h.dot)));
    if (h.push) hits.push(t(h.push > 0 ? "pwSkPush" : "pwSkPull"));
    out.push(hits.join(" · "));
  }
  if (def.heal) out.push(fill(t, "pwSkHeal", Math.round(def.heal * 100 * (def.repeat?.n ?? 1))));
  const b = def.buff;
  if (b) {
    const parts = [fill(t, "pwSkBuff", "", sec(b.ticks))];
    if (b.dmg) parts.push(fill(t, "pwBuffDmg", b.dmg));
    if (b.move) parts.push(fill(t, "pwBuffMove", b.move));
    if (b.rate) parts.push(fill(t, "pwBuffRate", b.rate));
    if (b.taken) parts.push(fill(t, "pwBuffTaken", b.taken));
    if (b.regen) parts.push(t("pwBuffRegen"));
    if (b.hide) parts.push(t("pwBuffHide"));
    if (b.allies) parts.push(t("pwBuffAllies"));
    out.push(parts.join(" · "));
  }
  if (def.summon) out.push(fill(t, "pwSkSummon", def.summon.n, sec(def.summon.ticks)) + " · " + fill(t, "pwSkDmg", Math.round(PW.skillDmg * def.summon.dmg)));
  out.push(fill(t, "pwSkCd", def.cd));
  return out;
}
