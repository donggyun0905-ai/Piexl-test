// 이안(성국, 침묵의 서기관): 누르고 있으면 3연격 (펜 찌르기 · 펜 찌르기 → 강철 실이 앞을 휘감아 끌어당김)
// 맞힌 적에게 기록(최대 5) → 5면 속박 · 속박된 적을 찌르면 급소. 스킬 넷은 숫자 키(sim/ianSkills) · 기록·급소는 sim/ianKit
import { TICK_RATE } from "../constants";
import { IAN_PERKS as K } from "../itemsIan";
import { IAN as I } from "../weaponsIan";
import { addRec, iaHit as iaHit_ } from "./ianKit";
import { iaSkill, lawTick, stepTick, threadsTick } from "./ianSkills";
import { inCone, inLine, roomKey } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk } from "./util";
import { srcFn } from "./dmgSrc";
const iaHit = srcFn("ian", () => iaHit_);

/** 이번 기본 공격이 급소인지 (그림자 걸음 뒤 · 침묵의 서약) — 쓰면 지움 */
function takeAmbush(s: RunState): boolean {
  const p = s.player;
  const calm = hasPerk(p, "iaSilence") && (p.iaCalm ?? 0) >= K.iaSilence.ticks;
  if (!p.iaAmbush && !calm) return false;
  delete p.iaAmbush;
  p.iaCalm = 0;
  return true;
}

/** 1·2타: 앞으로 길게 찌르는 펜 (side: 그림에서 펜 끝이 살짝 위·아래) */
function thrust(s: RunState, side: number): void {
  const p = s.player;
  const needle = hasPerk(p, "iaNeedle");
  const len = I.thrustLen * (needle ? K.iaNeedle.len : 1);
  const force = takeAmbush(s);
  for (const e of inLine(s, len, I.thrustW)) {
    iaHit(s, e, I.thrustMul * (needle ? K.iaNeedle.mul : 1), 2, force);
    addRec(s, e, 1);
  }
  addEffect(s, { kind: "iaThrust", x: p.x, y: p.y - 4, toX: p.x + p.faceX * len, toY: p.y - 4 + p.faceY * len, dirX: p.faceX, dirY: p.faceY, size: I.thrustW, style: side, maxTicks: 16 });
}

/** 3타: 강철 실이 앞 부채꼴을 휘감아 끌어당김 */
function whip(s: RunState): void {
  const p = s.player;
  const snare = hasPerk(p, "iaSnare");
  const r = I.whipR * (snare ? K.iaSnare.r : 1);
  const force = takeAmbush(s);
  for (const e of inCone(s, r, I.whipCos)) {
    iaHit(s, e, I.whipMul, -I.whipPull * (snare ? K.iaSnare.pull : 1), force);
    addRec(s, e, I.whipRec);
  }
  addEffect(s, { kind: "iaWhip", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 20 });
}

/** 방이 바뀌면 실·인과율을 거둠 (기록·대기는 남김) */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.iaRoom === key) return;
  p.iaRoom = key;
  delete p.iaThreads;
  delete p.iaLaw;
}

/** 시간 재기: 대기 · 침묵 · 적 속박 */
function timers(s: RunState): void {
  const p = s.player;
  const cd = (p.iaCd ??= [0, 0, 0, 0]);
  for (let i = 0; i < cd.length; i++) if (cd[i]! > 0) cd[i]!--;
  p.iaCalm = (p.iaCalm ?? 0) + 1;
  for (const e of s.enemies) if ((e.iaBind ?? 0) > 0 && --e.iaBind! <= 0) delete e.iaBind;
}

/** 틱마다 (펜을 들었을 때 player에서) */
export function ianTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  timers(s);
  threadsTick(s);
  lawTick(s);
  stepTick(s);
  if (p.trKey && p.trKey >= 1 && p.trKey <= 4) iaSkill(s, p.trKey - 1);
  p.iaGap = (p.iaGap ?? 0) + 1;
  if (p.iaGap > I.comboGap) p.iaStep = 0;
  if (!want || p.attackCooldown > 0 || p.s2Rush) return;
  const k = p.iaStep ?? 0;
  if (k < 2) thrust(s, k === 0 ? 1 : -1);
  else whip(s);
  p.iaLast = { k, t: s.tick };
  p.iaStep = (k + 1) % 3;
  p.iaGap = 0;
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / speed) * (I.stepTime[k] ?? 1)));
  p.attackCount++;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetIan(p: RunState["player"]): void {
  for (const k of ["iaStep", "iaGap", "iaLast", "iaCd", "iaAmbush", "iaCalm", "iaLaw", "iaThreads", "iaRoom"] as const) delete p[k];
}

export { ianSkills, ianTaken, isIan } from "./ianKit";
