// 백인장 스킬(숫자 키 1~4, 전용 패시브를 먹어야 열림): 적안 표식 · 혈철 감옥 · 사신의 팔연참 · 종언의 붉은 날개(궁극기)
import { BJ_PERKS as K } from "../itemsBaekinjang";
import { bjNearest, hasBj } from "./bjKit";
import { bjBoss, bjHit, bjVolley } from "./bjVolley";
import type { RunState } from "./types";
import { addEffect, reachOf } from "./util";

/** 스킬 칸 차례의 전용 패시브 */
export const BJ_SKILLS = ["bjEye", "bjPrison", "bjReaper", "bjEnd"] as const;

type P = RunState["player"];

/** 스킬이 하나라도 열렸는지 */
export const bjHasSkill = (p: P) => BJ_SKILLS.some((id) => hasBj(p, id));

/** 스킬 칸 넷의 남은 대기 (0~1, 안 열린 칸은 1) */
export const bjSkills = (p: P): number[] => BJ_SKILLS.map((id, i) => (hasBj(p, id) ? Math.min(1, (p.bjSkillCd?.[i] ?? 0) / K[id].cd) : 1));

/** 스킬 i(0~3) 쓰기 */
export function bjSkill(s: RunState, i: number): void {
  const p = s.player;
  const id = BJ_SKILLS[i];
  const cd = (p.bjSkillCd ??= [0, 0, 0, 0]);
  if (!id || !hasBj(p, id) || (cd[i] ?? 0) > 0) return;
  const k = reachOf(p);
  const dmg = p.stats.damage;
  if (id === "bjEnd") {
    bjVolley(s, { kind: "end", x: p.x, y: p.y, dx: 0, dy: 0, r: 0, dmg: dmg * K.bjEnd.mul, n: K.bjEnd.hits, every: 1 });
    addEffect(s, { kind: "bjEnd", x: p.x, y: p.y - 6, dirX: 0, dirY: 0, size: 60, maxTicks: K.bjEnd.hits });
    cd[i] = K.bjEnd.cd;
    return;
  }
  // 나머지는 겨눌 적이 있어야 나감 (없으면 대기 시간도 안 씀)
  const e = bjNearest(s, p.x, p.y, K[id].dist * k, p.faceX, p.faceY);
  if (!e) return;
  cd[i] = K[id].cd;
  if (id === "bjEye") {
    e.bjMark = s.tick + K.bjEye.ticks;
    addEffect(s, { kind: "bjEye", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 22, maxTicks: 24 });
    bjHit(s, e, dmg * K.bjEye.mul);
  } else if (id === "bjPrison") {
    const R = K.bjPrison;
    const r = R.r * k;
    bjVolley(s, { kind: "prison", x: e.x, y: e.y, dx: 0, dy: 0, r, dmg: dmg * R.mul, n: R.hits, every: R.every });
    addEffect(s, { kind: "bjPrison", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: R.hits * R.every });
    // 보스는 갇히지 않음: 억지로 뚫고 나오며 큰 피해와 출혈
    for (const b of s.enemies) {
      if (!bjBoss(b) || (b.x - e.x) ** 2 + (b.y - e.y) ** 2 > (r + b.r) ** 2) continue;
      b.bjBleed = R.bleed;
      b.bjBleedDmg = dmg * R.bleedMul;
      bjHit(s, b, dmg * R.bossMul);
    }
  } else {
    const R = K.bjReaper;
    const r = R.r * k;
    bjVolley(s, { kind: "reaper", x: e.x, y: e.y, dx: 0, dy: 0, r, dmg: dmg * R.mul, n: R.hits, every: R.every });
    addEffect(s, { kind: "bjReaper", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: R.hits * R.every + 4 });
  }
}
