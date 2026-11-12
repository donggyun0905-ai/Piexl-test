// 장비 줄에 보낼 느아르 값: 적응력(레벨·흑·강화 횟수·단계·계급·확률·방금 결과) · 스킬 대기와 이름(강화판이면 강화 이름)
import { expToNext, isNoir, nrChance, nrSkills, type RunState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { NoirView } from "./NoirPanel";

/** 방금 강화 결과를 보여 주는 틱 */
const MSG_TICKS = 90;

export function noirView(run: RunState): { noir?: NoirView; skills?: number[]; skillNames?: TextKey[]; skillTips?: TextKey[] } {
  const p = run.player;
  if (!isNoir(p) || run.pvp) return {};
  const up = [0, 1, 2, 3].map((i) => !!p.nrSkillUp?.[i]);
  const last = p.nrLast && run.tick - p.nrLast.t < MSG_TICKS ? p.nrLast : null;
  return {
    noir: {
      lv: p.nrLv ?? 1,
      exp: p.nrExp ?? 0,
      need: expToNext(p.nrLv ?? 1),
      pts: p.nrPts ?? 0,
      base: p.nrBase ?? 1,
      extra: p.nrExtra ?? 1,
      up,
      rank: p.nrRank ?? 0,
      ch: [1, 2, 3, 4, 5, 6, 7].map((k) => nrChance(p, k)),
      ...(last ? { msg: last.ok ? ("ok" as const) : ("fail" as const) } : {}),
    },
    skills: nrSkills(p).map((v) => Math.ceil(v * 20) / 20),
    skillNames: up.map((u, i) => `nr${u ? "SkillUp" : "Skill"}${i + 1}` as TextKey),
    skillTips: up.map((u, i) => `nr${u ? "SkillUpTip" : "SkillTip"}${i + 1}` as TextKey),
  };
}
