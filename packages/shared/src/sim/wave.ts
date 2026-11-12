// 웨이브(탈라시아): 누르면 물결 초승달 (뚫고 나가며 커짐, 물거울 분신도 같이) · 때릴 때마다 상상력이 참
// 상상력이 가득 차면 가진 물의 기술(전용 아이템 30개가 하나씩) 가운데 하나가 무작위로 나감 (먹은 순서와 상관없음)
import { TICK_RATE } from "../constants";
import { WAVE_PERKS as K, WV_SKILLS, type WvSkill } from "../itemsWave";
import { createRng, deriveSeed } from "../rng";
import { WAVE as W } from "../weaponsWave";
import { rot } from "./orbit";
import { alive } from "./s2Kit";
import { roomKey } from "./s2Kit";
import type { ExtraStats } from "../characters";
import type { StatMod } from "../stats";
import type { PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk } from "./util";
import { addBit, big, burstAt as burstAt_, dmgOf, isWall, turnDir, waveOf, wvHit as wvHit_ } from "./waveKit";
import { wvFx as fx } from "./waveSkillsA";
import { floodTick, surfTick } from "./waveSkillsC";
import { mistTick } from "./waveSkillsD";
import { wingsTick } from "./waveSkillsE";
import { WAVE_CASTS, WAVE_STEPS } from "./waveTable";
import type { WvBit } from "./waveTypes";
import { srcFn, srcEach } from "./dmgSrc";
const burstAt = srcFn("wave", () => burstAt_), wvHit = srcFn("wave", () => wvHit_);

/** 가진 기술 */
export const ownSkills = (p: PlayerState): WvSkill[] => WV_SKILLS.filter((k) => hasPerk(p, k));
/** 기술 세기 (도구) */
const skillMul = (p: PlayerState) => waveOf(p).skill ?? 1;

/** 다음 기술 무작위로 (not: 지금 것과 다르게) */
function roll(s: RunState, salt: string | number, not?: string): string | undefined {
  const own = ownSkills(s.player).filter((k) => k !== not || ownSkills(s.player).length === 1);
  if (own.length === 0) return undefined;
  return createRng(deriveSeed(s.seed, "wvSkill", s.tick, s.player.attackCount, salt)).pick(own);
}

/** 기술 하나 나감 (이름 효과) */
function castOne(s: RunState, k: string, m: number): void {
  const p = s.player;
  WAVE_CASTS[k]?.(s, m);
  p.wvLast = { k, t: s.tick };
  addEffect(s, { kind: "wvCast", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: 20, maxTicks: 50, from: k });
}

/** 상상력이 가득: 미리 굴린 기술(없거나 못 쓰면 새로 굴림) · 프리즘은 다른 기술 하나 더 · 기술이 없으면 물보라 */
function castSkill(s: RunState): void {
  const p = s.player;
  const own = ownSkills(p);
  if (own.length === 0) {
    burstAt(s, p.x, p.y, W.splashR, dmgOf(s, W.splashMul), 8);
    fx(s, "wvSplash", p.x, p.y, W.splashR, 26);
    return;
  }
  const k = p.wvNext && own.includes(p.wvNext as WvSkill) ? p.wvNext : roll(s, "now")!;
  const m = skillMul(p);
  castOne(s, k, m);
  const st = waveOf(p);
  if (st.echo && own.length > 1 && createRng(deriveSeed(s.seed, "wvEcho", s.tick)).nextFloat() < st.echo) castOne(s, roll(s, "echo", k)!, m * 0.7);
  p.wvNext = roll(s, "next");
}

/** 물결 초승달 (x, y에서 dx, dy로 · gain: 적을 맞혔을 때 차는 상상력 비율) */
function crest(s: RunState, x: number, y: number, dx: number, dy: number, mul: number, gain = 1): void {
  addBit(s, { k: "crest", x: x + dx * 6, y: y + dy * 6 - 3, dx, dy, t: W.crestLife, mul, hit: [], n: gain });
}

/** 상상력 채우기 (초승달이 적을 맞혔을 때만) · 가득 차면 기술 */
function fill(s: RunState, part: number): void {
  const p = s.player;
  p.wvGauge = (p.wvGauge ?? 0) + (W.gain * (waveOf(p).gauge ?? 1) + W.gainPer * ownSkills(p).length) * part;
  if (p.wvGauge < W.gaugeMax) return;
  p.wvGauge -= W.gaugeMax;
  castSkill(s);
}

/** 누름: 초승달 (리본은 셋) · 물거울 분신도 같이 · 상상력 */
function basic(s: RunState, speed: number): void {
  const p = s.player;
  const st = waveOf(p);
  const n = st.crests ?? 1;
  for (let i = 0; i < n; i++) {
    const [c, sn] = rot((i - (n - 1) / 2) * W.ribbonSpread);
    const [dx, dy] = turnDir(p.faceX, p.faceY, c, sn);
    const side = n > 1 && i !== (n - 1) / 2;
    crest(s, p.x, p.y, dx, dy, W.crestMul * (side ? 0.6 : 1), side ? W.sideGain : 1);
  }
  for (const b of srcEach(p.wvBits ?? [])) if (b.k === "wvMirror") crest(s, b.x, b.y, p.faceX, p.faceY, W.crestMul * W.mirrorMul * b.mul, W.mirrorGain);
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / speed) * W.crestTime));
  p.attackCount++;
}

/** 초승달 한 틱: 날아가며 커지고 닿는 적을 한 번씩 꿰뚫음 */
function crestStep(s: RunState, b: WvBit): boolean {
  const f = 1 - b.t / b.t0;
  const r = (W.crestR0 + (W.crestR1 - W.crestR0) * f) * big(s.player);
  b.x += b.dx * W.crestSpeed;
  b.y += b.dy * W.crestSpeed;
  b.v = r;
  for (const e of alive(s)) {
    if (b.hit!.includes(e.id) || dist2(e, b) > (r + e.r) ** 2) continue;
    // 앞쪽 반원만 (초승달 모양)
    if ((e.x - b.x) * b.dx + (e.y - b.y) * b.dy < -e.r - 2) continue;
    b.hit!.push(e.id);
    wvHit(s, e, dmgOf(s, b.mul), b.x - b.dx * 8, b.y - b.dy * 8, 4);
    // 처음 맞힌 적은 다 차고, 뚫고 지나가 더 맞힌 적은 조금
    fill(s, (b.n ?? 1) * (b.hit!.length === 1 ? 1 : W.pierceGain));
  }
  if (--b.t > 0 && !isWall(s, b.x, b.y)) return true;
  fx(s, "wvCrest", b.x, b.y, r, 18, { dirX: b.dx, dirY: b.dy });
  return false;
}

/** 물로 빚은 것들 한 틱 (새로 생긴 것은 다음 틱부터) */
function bitsTick(s: RunState): void {
  const p = s.player;
  const list = p.wvBits;
  if (!list) return;
  p.wvBits = [];
  const keep = list.filter((b) => (b.k === "crest" ? crestStep(s, b) : (WAVE_STEPS[b.k]?.(s, b) ?? false)));
  p.wvBits = keep.concat(p.wvBits);
  if (p.wvBits.length === 0) delete p.wvBits;
}

/** 물의 갑옷: 보호막이 깨지거나 시간이 끝나면 둘레로 터짐 */
function armorTick(s: RunState): void {
  const p = s.player;
  if (!p.wvArmor) return;
  p.wvArmor--;
  if (p.wvArmor > 0 && (p.shieldPts ?? 0) > 0) return;
  const k = K.wvArmor;
  burstAt(s, p.x, p.y, k.r * big(p), dmgOf(s, k.mul * skillMul(p)), k.push);
  fx(s, "wvArmorPop", p.x, p.y, k.r * big(p), 30);
  delete p.wvArmor;
}

/** 방이 바뀌면 빚은 것·만조·잠·발자국을 거둠 (상상력·다음 기술은 남김) */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.wvRoom === key) return;
  p.wvRoom = key;
  resetWave(p, true);
}

/** 대시 시작: 상상의 물감은 다음 기술을 다른 것으로 바꿈 */
function dashCheck(s: RunState): void {
  const p = s.player;
  const dashing = p.dashTicks > 0;
  const start = dashing && !p.wvDash;
  p.wvDash = dashing;
  if (start && waveOf(p).dream && p.wvNext) p.wvNext = roll(s, "dash", p.wvNext);
}

/** 틱마다 (상상의 도구를 들었을 때) */
export function waveTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  if (!p.wvNext) p.wvNext = roll(s, "first");
  if (s.tick % W.stepEvery === 0) {
    const st = (p.wvSteps ??= []);
    st.push(p.x, p.y);
    if (st.length > W.stepKeep * 2) st.splice(0, st.length - W.stepKeep * 2);
  }
  bitsTick(s);
  armorTick(s);
  floodTick(s);
  mistTick(s);
  wingsTick(s);
  if (p.wvSurf) {
    surfTick(s);
    return;
  }
  dashCheck(s);
  if (want && p.attackCooldown <= 0) basic(s, speed);
}

/** 연습장 등에서 다시 시작할 때 (keepRoom: 방 이름·상상력·다음 기술·몸에 두른 것은 남김) */
export function resetWave(p: PlayerState, keepRoom = false): void {
  for (const k of ["wvBits", "wvSurf", "wvFlood", "wvFloodMul", "wvSleep", "wvSteps", "wvDash"] as const) delete p[k];
  if (!keepRoom) for (const k of ["wvRoom", "wvGauge", "wvNext", "wvArmor", "wvMist", "wvMistMul", "wvWings", "wvWingsMul", "wvLast"] as const) delete p[k];
}

export { isWave } from "./waveKit";
export { jellyPts } from "./waveSkillsB";
export { waveTaken } from "./waveSkillsD";
export { waveMoveMul } from "./waveSkillsE";

/** 모은 물의 기술 5개마다 공격력 +5 · 방어력 +5 (recalcStats, 버프 창에 보임) */
export const waveSetBonus = (p: PlayerState): number => (p.characterId === "wave" ? Math.floor(ownSkills(p).length / W.setEvery) : 0);
export function waveMods(p: PlayerState): StatMod[] {
  const n = waveSetBonus(p);
  return n > 0 ? [{ stat: "damage", add: n * W.setAtk }] : [];
}
export function waveExtras(p: PlayerState): Partial<ExtraStats> | null {
  const n = waveSetBonus(p);
  return n > 0 ? { defense: n * W.setDef } : null;
}
