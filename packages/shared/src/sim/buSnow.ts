// 블뢰 눈결정(얼음마녀) · 서리 결정탄 · 공격 범위 안 마우스 자리
// 눈결정: 기본 공격 때 확률로 방의 아무 자리에 → 닿은 적은 느려짐 · 종언의 영구동토가 수를 셈
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { BU_BASE as B, BU_SNOW as W } from "../itemsBleu";
import { nrAim, nrAlive, nrArea, nrRoll } from "./nrKit";
import type { HitOn } from "./nrTypes";
import type { RunState } from "./types";
import { addEffect } from "./util";

const FROST: HitOn = { frost: true };

/** 기본 공격 한 번: 확률로 방의 아무 자리에 눈결정 하나 (가득 차면 오래된 것부터 사라짐) */
export function buMaybeFlake(s: RunState): void {
  if (nrRoll(s, "buFlake") >= W.chance) return;
  const x = ROOM_MIN_X + 12 + (ROOM_MAX_X - ROOM_MIN_X - 24) * nrRoll(s, "buFlakeX");
  const y = ROOM_MIN_Y + 12 + (ROOM_MAX_Y - ROOM_MIN_Y - 24) * nrRoll(s, "buFlakeY");
  const flakes = (s.player.buFlakes ??= []);
  flakes.push({ x, y, until: s.tick + W.life });
  if (flakes.length > W.max) flakes.splice(0, flakes.length - W.max);
  addEffect(s, { kind: "buFlake", x, y, dirX: 0, dirY: 0, size: 14, maxTicks: 20 });
}

/** 방의 눈결정 수 */
export const buFlakeCount = (s: RunState) => s.player.buFlakes?.length ?? 0;

/** 틱마다: 사라질 때가 된 눈결정 정리 · 닿은 적은 느려짐 (얼음 시계 동안은 눈결정도 그대로) */
export function buFlakeTick(s: RunState): void {
  const p = s.player;
  if (!p.buFlakes?.length) return;
  if (s.freezeTicks > 0) for (const f of p.buFlakes) f.until++;
  p.buFlakes = p.buFlakes.filter((f) => f.until > s.tick);
  for (const e of s.enemies) {
    if (!nrAlive(e) || !p.buFlakes.some((f) => (f.x - e.x) ** 2 + (f.y - e.y) ** 2 <= (W.r + e.r) ** 2)) continue;
    e.slowTicks = Math.max(e.slowTicks ?? 0, W.slow);
  }
}

/** 공격 범위 안 마우스 자리 (nrAim) */
export const buAim = (s: RunState) => nrAim(s, B.aim);

/** 서리 결정탄 쏘기 (바라보는 쪽) */
export function buShoot(s: RunState, dmg: number): void {
  const p = s.player;
  (p.buBolts ??= []).push({ x: p.x + p.faceX * 10, y: p.y + p.faceY * 10, dx: p.faceX, dy: p.faceY, left: B.s1.range, dmg });
}

/** 틱마다: 결정탄이 날아가 처음 닿은 적 자리에서 터짐 (작은 범위 강한 1타) · 벽·거리 끝에서 사라짐 */
export function buBoltTick(s: RunState): void {
  const p = s.player;
  if (!p.buBolts?.length) return;
  const R = B.s1;
  for (const b of p.buBolts) {
    b.x += b.dx * R.speed;
    b.y += b.dy * R.speed;
    b.left -= R.speed;
    const e = s.enemies.find((f) => nrAlive(f) && (f.x - b.x) ** 2 + (f.y - b.y) ** 2 <= (R.r + f.r) ** 2);
    const wall = b.x < ROOM_MIN_X || b.x > ROOM_MAX_X || b.y < ROOM_MIN_Y || b.y > ROOM_MAX_Y;
    if (!e && !wall && b.left > 0) continue;
    b.left = 0;
    if (!e) continue;
    nrArea(s, b.x, b.y, R.boom, b.dmg, undefined, FROST);
    addEffect(s, { kind: "buBolt", x: b.x, y: b.y, dirX: b.dx, dirY: b.dy, size: R.boom, maxTicks: 18 });
  }
  p.buBolts = p.buBolts.filter((b) => b.left > 0);
}
