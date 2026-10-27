// 렌 대지의 추가 공격: 렌 전용 아이템 3개마다 한 단계 (최대 5). 평소 공격마다 단계당 10% 확률로 그중 하나 (수치는 weaponsRen.REN_EARTH)
// 1 돌 던지기 · 2 용머리 · 3 용오름 · 4 머리 위 거대 토목(5개면 큰 돌 5번) · 5 양쪽 토목 짓뭉개기. 대지의 힘이면 피해 +30%
import { REN_PERKS as K } from "../itemsRen";
import { PASSIVES, type PassiveDef } from "../items";
import { createRng, deriveSeed } from "../rng";
import { REN_EARTH as E } from "../weaponsRen";
import { alive, inCircle, inCone, onSegment, strike, stun } from "./s2Kit";
import type { PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk } from "./util";

/** 열린 단계 수: 렌 전용 아이템 3개마다 하나 */
export function earthTiers(p: PlayerState): number {
  const own = p.passives.filter((id) => (PASSIVES[id] as PassiveDef | undefined)?.exclusive === "ren").length;
  return Math.min(E.tiers, Math.floor(own / E.per));
}

const power = (p: PlayerState, mul: number) => p.stats.damage * mul * (hasPerk(p, "renEarth") ? K.renEarth.mul : 1);

/** 평소 공격 뒤 (x, y: 토목이 떨어진 자리) */
export function earthAttack(s: RunState, x: number, y: number): void {
  const p = s.player;
  const tiers = earthTiers(p);
  if (tiers <= 0) return;
  const r = createRng(deriveSeed(s.seed, "renEarth", s.tick, p.attackCount)).nextFloat();
  const pick = Math.floor(r / E.chance);
  if (pick >= tiers) return;
  if (pick === 0) rocks(s);
  else if (pick === 1) head(s, x, y);
  else if (pick === 2) wyrm(s);
  else if (pick === 3) stone(s);
  else crush(s, x, y);
}

/** 1 돌 던지기: 앞으로 넓게 흩뿌려 멀리 날림 (피해는 약함) */
function rocks(s: RunState): void {
  const p = s.player;
  for (const e of inCone(s, E.rockReach, E.rockArc)) strike(s, e, power(p, E.rockMul), E.rockPush);
  addEffect(s, { kind: "renRock", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: E.rockReach, maxTicks: 26 });
}

/** 2 용머리: 공격한 자리 바닥에서 솟아오름 */
function head(s: RunState, x: number, y: number): void {
  const p = s.player;
  // 입을 벌리고 솟아 적을 물어 삼킴 (무는 동안 꼼짝 못 함)
  for (const e of inCircle(s, x, y, E.headR)) {
    strike(s, e, power(p, E.headMul));
    stun(e, E.headHold);
  }
  addEffect(s, { kind: "renHead", x, y, dirX: p.faceX < 0 ? -1 : 1, dirY: 0, size: E.headR, maxTicks: 44 });
}

/** 3 용오름: 내 자리에서 앞으로 오르내리며 나아감 */
function wyrm(s: RunState): void {
  const p = s.player;
  (p.rWyrms ??= []).push({ x: p.x, y: p.y, dx: p.faceX, dy: p.faceY, t: E.wyrmTicks, dmg: power(p, E.wyrmMul), hit: [] });
}

/** 4 머리 위 거대 토목: 하나씩 쌓이고 5개가 되면 큰 돌 5번 */
function stone(s: RunState): void {
  const p = s.player;
  p.rStones = (p.rStones ?? 0) + 1;
  addEffect(s, { kind: "renStone", x: p.x, y: p.y - 26, dirX: p.rStones, dirY: 0, size: 8, maxTicks: 16 });
  if (p.rStones < E.stoneMax) return;
  p.rStones = 0;
  p.rDrop = { left: E.stoneMax, gap: 0, dmg: power(p, E.dropMul) };
}

/** 5 양쪽 토목: 적 좌우에서 네모난 토목이 짓뭉개고 부서짐 */
function crush(s: RunState, x: number, y: number): void {
  const p = s.player;
  const t = alive(s).sort((a, b) => dist2(a, { x, y }) - dist2(b, { x, y }) || a.id - b.id)[0];
  const cx = t?.x ?? x;
  const cy = t?.y ?? y;
  for (const e of inCircle(s, cx, cy, E.crushR)) strike(s, e, power(p, E.crushMul));
  addEffect(s, { kind: "renCrush", x: cx, y: cy, dirX: 0, dirY: 0, size: E.crushR, maxTicks: 30 });
}

/** 틱마다: 용오름 나아가기 · 큰 돌 쏟기 */
export function earthTick(s: RunState): void {
  const p = s.player;
  if (p.rWyrms?.length) {
    for (const w of p.rWyrms) {
      const nx = w.x + w.dx * E.wyrmSpeed;
      const ny = w.y + w.dy * E.wyrmSpeed;
      for (const e of onSegment(s, w.x, w.y, nx, ny, E.wyrmR)) {
        if (w.hit.includes(e.id)) continue;
        w.hit.push(e.id);
        strike(s, e, w.dmg, 4);
      }
      w.x = nx;
      w.y = ny;
      w.t--;
    }
    p.rWyrms = p.rWyrms.filter((w) => w.t > 0);
  }
  const d = p.rDrop;
  if (d && --d.gap <= 0) {
    // 가까운 적부터 돌아가며 (없으면 앞쪽)
    const list = alive(s).sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id);
    const e = list[(E.stoneMax - d.left) % Math.max(1, list.length)];
    const x = e?.x ?? p.x + p.faceX * 40;
    const y = e?.y ?? p.y + p.faceY * 40;
    for (const o of inCircle(s, x, y, E.dropR)) strike(s, o, d.dmg, 6);
    addEffect(s, { kind: "renDrop", x, y, dirX: 0, dirY: 0, size: E.dropR, maxTicks: 24 });
    d.gap = E.dropGap;
    if (--d.left <= 0) delete p.rDrop;
  }
}
