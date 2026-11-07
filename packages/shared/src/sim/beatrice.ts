// 베아트리스(성국, 심판의 불꽃): 누르고 있으면 쌍검 3연격 (왼→오 베기 · 오→왼 베기로 X자 → 3타가 그 X자를 다시 X로 베어 터뜨림)
// 스킬 넷은 숫자 키(설정에서 바꿈)·모바일 스킬 버튼 (sim/beatriceSkills) · 악·화상·화염 계수·재생은 sim/beatriceKit
import { TICK_RATE } from "../constants";
import { BEATRICE_PERKS as K } from "../itemsBeatrice";
import { BEATRICE as B } from "../weaponsBeatrice";
import { addBurn, btHit, btRegen, burnTick } from "./beatriceKit";
import { btSkill, danceTick, execTick, judgeTick, solarOn, wavesTick } from "./beatriceSkills";
import { heal } from "./heal";
import { inCircle, onSegment, roomKey } from "./s2Kit";
import type { PlayerState, RunState } from "./types";
import { addEffect, hasPerk, reachOf } from "./util";

/** 기본 공격이 태양 검날로 강화되었을 때 더하는 화염 몫 */
const fireOf = (p: PlayerState) => (solarOn(p) ? B.solarFire : 0);

/** X자 가운데 (바라보는 쪽 앞) */
const center = (p: PlayerState): [number, number] => [p.x + p.faceX * B.crossAt * reachOf(p), p.y + p.faceY * B.crossAt * reachOf(p)];

/** 대각선 칼선 하나 (side 1 = 왼쪽 위 → 오른쪽 아래, -1 = 오른쪽 위 → 왼쪽 아래 · 둘이 겹치면 X자) */
export function strokeOf(p: PlayerState, side: number, len: number): [number, number, number, number] {
  const [cx, cy] = center(p);
  // 사거리 증가만큼 칼선이 길어짐
  const h = len * 0.7071 * reachOf(p);
  const fx = p.faceX * h;
  const fy = p.faceY * h;
  const nx = -p.faceY * h;
  const ny = p.faceX * h;
  return side > 0 ? [cx - fx - nx, cy - fy - ny, cx + fx + nx, cy + fy + ny] : [cx + fx - nx, cy + fy - ny, cx - fx + nx, cy - fy + ny];
}

/** 1·2타: 대각선으로 베어 내림 (1타 왼→오 · 2타 오→왼, 두 칼선이 겹쳐 X자) */
function slash(s: RunState, side: number, mul: number, len: number, kind: "btSlash" | "btTwin" = "btSlash"): void {
  const p = s.player;
  const [ax, ay, bx, by] = strokeOf(p, side, len);
  for (const e of onSegment(s, ax, ay, bx, by, B.slashW)) {
    btHit(s, e, mul, fireOf(p), 3);
    if (solarOn(p)) addBurn(e, p);
  }
  addEffect(s, { kind, x: ax, y: ay - 3, toX: bx, toY: by - 3, dirX: p.faceX, dirY: p.faceY, size: B.slashW, style: side, maxTicks: 40, tint: solarOn(p) ? "sun" : "" });
}

/** 3타: 앞에 생긴 X자를 다시 X로 베어 터뜨림 */
function cross(s: RunState): void {
  const p = s.player;
  const r = B.crossR * (hasPerk(p, "btBreaker") ? K.btBreaker.r : 1) * reachOf(p);
  const [cx, cy] = center(p);
  for (const e of inCircle(s, cx, cy, r)) {
    btHit(s, e, B.crossMul, fireOf(p) * 1.5, B.crossPush);
    if (solarOn(p)) addBurn(e, p, 2);
  }
  addEffect(s, { kind: "btCross", x: cx, y: cy - 3, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 22, tint: solarOn(p) ? "sun" : "" });
}

/** 일식의 춤 뒤 강화 베기: 두 자루로 앞을 빠르게 베어 넘김 */
function twin(s: RunState): void {
  const p = s.player;
  slash(s, (p.btTwin ?? 0) % 2 === 0 ? 1 : -1, B.twinMul, B.twinLen, "btTwin");
  p.btTwin = (p.btTwin ?? 1) - 1;
  p.btTwinGap = p.btTwin > 0 ? B.twinGap : 0;
  if (p.btTwin <= 0) delete p.btTwin;
}

/** 방이 바뀌면 처단·검기·심판 예고를 거둠 (악·지운 악 수·대기는 남김) */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.btRoom === key) return;
  p.btRoom = key;
  for (const k of ["btExecs", "btWaves", "btJudge"] as const) delete p[k];
}

/** 시간 재기: 대기 · 태양 검날 · 자애(체력 1 고정, 끝나면 회복 불가) · 재생 */
function timers(s: RunState): void {
  const p = s.player;
  const cd = (p.btCd ??= [0, 0, 0, 0]);
  for (let i = 0; i < cd.length; i++) if (cd[i]! > 0) cd[i]!--;
  if ((p.btSolar ?? 0) > 0) p.btSolar!--;
  if ((p.btSilverT ?? 0) > 0) p.btSilverT!--;
  if ((p.btNoHeal ?? 0) > 0) p.btNoHeal!--;
  if ((p.btGrace ?? 0) > 0) {
    if (p.hp > 0) p.hp = 1;
    if (--p.btGrace! <= 0) {
      delete p.btGrace;
      p.btNoHeal = hasPerk(p, "btGrace") ? K.btGrace.ticks : B.noHealTicks;
    }
  }
  if (s.tick % TICK_RATE === 0 && p.hp > 0 && p.hp < p.stats.maxHp) heal(s, btRegen(p) / 10);
}

/** 틱마다 (쌍검을 들었을 때 player에서) */
export function beatriceTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  timers(s);
  burnTick(s);
  execTick(s);
  wavesTick(s);
  judgeTick(s);
  danceTick(s);
  if (p.trKey && p.trKey >= 1 && p.trKey <= 4) btSkill(s, p.trKey - 1);
  // 강화 베기가 이어지는 중
  p.btGap = (p.btGap ?? 0) + 1;
  if (p.btGap > B.comboGap) p.btStep = 0;
  if ((p.btTwinGap ?? 0) > 0 && --p.btTwinGap! <= 0 && p.btTwin) twin(s);
  if (!want || p.attackCooldown > 0 || p.s2Rush) return;
  if (p.btTwin && !p.btTwinGap) {
    twin(s);
    p.attackCooldown = Math.max(1, Math.round((TICK_RATE / speed) * 0.5));
    p.attackCount++;
    return;
  }
  const k = p.btStep ?? 0;
  if (k < 2) slash(s, k === 0 ? 1 : -1, B.slashMul, B.slashLen);
  else cross(s);
  p.btLast = { k, t: s.tick };
  p.btStep = (k + 1) % 3;
  p.btGap = 0;
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / speed) * (B.stepTime[k] ?? 1)));
  p.attackCount++;
}

/** 태양 검날: 공격 속도 (classSpeed) */
export const beatriceSpeedMul = (p: PlayerState) => (solarOn(p) ? B.solarSpeed : 1);

/** 연습장 등에서 다시 시작할 때 */
export function resetBeatrice(p: PlayerState): void {
  for (const k of ["btStep", "btGap", "btLast", "btCd", "btSolar", "btGrace", "btNoHeal", "btTwin", "btTwinGap", "btExecs", "btWaves", "btPurged", "btJudge", "btSilverT", "btRoom"] as const) delete p[k];
}

export { beatriceSkills, beaTaken, evilTaken, fireCoef, healBlocked, isBea } from "./beatriceKit";
