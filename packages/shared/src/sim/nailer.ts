// 네일러(새벽의 성흔, 못 박는 심판관): 누르고 있으면 망치로 내려침 · 스킬 넷은 숫자 키(sim/nailerSkills)
// 못이 박힌 적은 못 수가 쌓임(한도 없음) → 3 저주의 도화선이 한 번에 터뜨림. 맞힐수록 성흔이 차고 가득 차면 달빛 각성 (sim/nailerKit·stigma)
import { TICK_RATE } from "../constants";
import { NAILER_PERKS as K } from "../itemsNailer";
import { NAILER as N } from "../weaponsNailer";
import { addNails, nlAfter, nlDmg, nlGain as nlGain_, shotsTick as shotsTick_ } from "./nailerKit";
import { detTick, nlSkill, throwTick, tieTick, ultTick } from "./nailerSkills";
import { inCone, roomKey, strike as strike_, stun } from "./s2Kit";
import { isAwake, stigmaTick } from "./stigma";
import type { RunState } from "./types";
import { addEffect, hasPerk, reachOf } from "./util";
import { srcFn } from "./dmgSrc";
const nlGain = srcFn("nailer", () => nlGain_), shotsTick = srcFn("nailer", () => shotsTick_), strike = srcFn("nailer", () => strike_);

/** 망치 내려치기: 앞 부채꼴 (울리는 쇠·못 박기·머리 치기) */
function swing(s: RunState): void {
  const p = s.player;
  const wide = hasPerk(p, "nlWide");
  const r = N.swingR * (wide ? K.nlWide.r : 1) * reachOf(p);
  const mul = N.swingMul * (hasPerk(p, "nlSledge") ? K.nlSledge.mul : 1);
  let n = 0;
  for (const e of inCone(s, r, wide ? K.nlWide.arc : N.swingCos)) {
    const had = e.nlNails ?? 0;
    const echo = hasPerk(p, "nlEcho") ? 1 + Math.min(K.nlEcho.max, had * K.nlEcho.per) : 1;
    strike(s, e, nlDmg(p, mul * echo), N.swingPush);
    if (had > 0 && hasPerk(p, "nlDrive")) addNails(s, e, K.nlDrive.add);
    if (had >= K.nlStun.from && hasPerk(p, "nlStun")) stun(e, K.nlStun.ticks);
    n += N.gainHit + nlAfter(s, e, had);
  }
  addEffect(s, { kind: "nlSwingFx", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 16 });
  nlGain(s, n);
}

/** 방이 바뀌면 못·실·도화선을 거둠 */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.nlRoom === key) return;
  p.nlRoom = key;
  for (const k of ["nlShots", "nlTie", "nlDets", "nlUlt", "nlBurst", "nlBurstT"] as const) delete p[k];
}

/** 틱마다 (망치와 못을 들었을 때 player에서) */
export function nailerTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  stigmaTick(p);
  if (isAwake(p) && s.tick % 20 === 0) addEffect(s, { kind: "blMoonAura", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 26, maxTicks: 20, follow: true });
  const cd = (p.nlCd ??= [0, 0, 0, 0]);
  for (let i = 0; i < cd.length; i++) if (cd[i]! > 0) cd[i]!--;
  if (p.trKey && p.trKey >= 1 && p.trKey <= 4) nlSkill(s, p.trKey - 1);
  throwTick(s);
  tieTick(s);
  ultTick(s);
  shotsTick(s);
  detTick(s);
  if (!want || p.attackCooldown > 0 || p.s2Rush || p.nlUlt) return;
  swing(s);
  p.nlLast = s.tick;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetNailer(p: RunState["player"]): void {
  for (const k of ["sgGauge", "sgAwake", "sgAwakeMax", "nlCd", "nlStage", "nlStageT", "nlLock", "nlBurst", "nlBurstT", "nlShots", "nlTie", "nlDets", "nlUlt", "nlLast", "nlRoom"] as const) delete p[k];
}

export { isNailer, nailerSkills, nailerStages } from "./nailerKit";
