// 테일(탈라시아, 상어 수인): 꼬리 3연타 + 영역 바다의 물 상어 (sim/tailSea)
// 1타 위→아래 꼬리 · 2타 아래→위 꼬리 · 3타 위→아래 내려치기. 멈추면 1타부터
// 한 방에 쓰러뜨릴 적이 가까이 있으면 누를 때 물 상어로 변해 번개처럼 돌진해 씹어먹음 (흡혈)
import { TICK_RATE } from "../constants";
import { TAIL_PERKS as K } from "../itemsTail";
import { TAIL as T } from "../weaponsTail";
import { healPlayer } from "./combat";
import { inCircle, inCone, roomKey, stun } from "./s2Kit";
import { biteDmg, tlHit as tlHit_ } from "./tailKit";
import { seaTick } from "./tailSea";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, keepInRoom, roomGrid } from "./util";
import { srcFn } from "./dmgSrc";
const tlHit = srcFn("tail", () => tlHit_);

/** 1·2타: 꼬리를 위→아래(up=false) · 아래→위(up=true)로 휘두름 */
function swipe(s: RunState, up: boolean): void {
  const p = s.player;
  const reach = T.swipeReach * (hasPerk(p, "tlFin") ? K.tlFin.reach : 1);
  for (const e of inCone(s, reach, T.swipeArc)) tlHit(s, e, p.stats.damage * T.swipeMul, T.swipePush);
  addEffect(s, { kind: up ? "tlUp" : "tlDown", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: reach, maxTicks: 14, follow: true });
}

/** 3타: 꼬리로 앞을 크게 내려침 (물기둥 + 잠깐 기절) */
function slam(s: RunState): void {
  const p = s.player;
  const far = hasPerk(p, "tlFin") ? K.tlFin.reach : 1;
  const x = p.x + p.faceX * T.slamAt * far;
  const y = p.y + p.faceY * T.slamAt * far;
  for (const e of inCircle(s, x, y, T.slamR * far)) {
    tlHit(s, e, p.stats.damage * T.slamMul, 6);
    stun(e, T.slamStun);
  }
  addEffect(s, { kind: "tlSmash", x, y, dirX: p.faceX, dirY: p.faceY, size: T.slamR * far, maxTicks: 20 });
}

/** 한 방에 쓰러뜨릴 수 있는 가장 가까운 적 (마무리 물기 대상) */
function prey(s: RunState): EnemyState | undefined {
  const p = s.player;
  const dmg = biteDmg(p);
  const range = T.biteRange * (hasPerk(p, "tlChain") ? K.tlChain.range : 1);
  let best: EnemyState | undefined;
  for (const e of s.enemies) {
    if (e.hp <= 0 || e.hp > dmg || e.immune || e.svBox || e.pwHid || e.kind === "dummy") continue;
    if (dist2(e, p) > (range + e.r) ** 2) continue;
    if (!best || dist2(e, p) < dist2(best, p)) best = e;
  }
  return best;
}

/** 물 상어로 변해 돌진하는 한 틱 · 닿으면 씹어먹음 (흡혈) */
function biteTick(s: RunState): void {
  const p = s.player;
  const b = p.tlBite!;
  const e = s.enemies.find((o) => o.id === b.id && o.hp > 0);
  b.t--;
  p.invulnTicks = Math.max(p.invulnTicks, 3);
  if (e) {
    const d = Math.hypot(e.x - p.x, e.y - p.y) || 1;
    b.dx = (e.x - p.x) / d;
    b.dy = (e.y - p.y) / d;
    p.faceX = b.dx;
    p.faceY = b.dy;
  }
  const ax = p.x;
  const ay = p.y;
  const gap = e ? Math.hypot(e.x - p.x, e.y - p.y) - e.r - p.r - 2 : 0;
  const step = Math.min(T.biteStep, Math.max(0, gap));
  p.x += b.dx * step;
  p.y += b.dy * step;
  keepInRoom(p, roomGrid(s));
  addEffect(s, { kind: "tlDart", x: ax, y: ay, toX: p.x, toY: p.y, dirX: b.dx, dirY: b.dy, size: 6, maxTicks: 10 });
  if (!e) {
    delete p.tlBite;
    return;
  }
  if (gap > T.biteStep && b.t > 0) return;
  const hp = e.hp;
  tlHit(s, e, biteDmg(p), 0, "tide", false);
  const feast = hasPerk(p, "tlFeast") ? K.tlFeast.leech : 1;
  healPlayer(s, Math.min((hp - Math.max(0, e.hp)) * T.biteLeech * feast, p.stats.maxHp * T.biteCap * feast));
  addEffect(s, { kind: "tlChomp", x: e.x, y: e.y, dirX: b.dx, dirY: b.dy, size: e.r + 10, maxTicks: 22 });
  delete p.tlBite;
  p.tlBiteCd = hasPerk(p, "tlChain") ? 0 : T.biteCd;
  p.attackCooldown = Math.max(p.attackCooldown, 6);
}

/** 방이 바뀌면 콤보·상어를 비움 */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.tlRoom === key) return;
  p.tlRoom = key;
  resetTail(p, true);
}

/** 틱마다 (꼬리 무기를 들었을 때 player에서) */
export function tailTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  seaTick(s, speed);
  if (p.tlGap) p.tlGap--;
  if (p.tlBiteCd) p.tlBiteCd--;
  if (p.tlBite) {
    biteTick(s);
    return;
  }
  if (!want || p.attackCooldown > 0) return;
  const e = (p.tlBiteCd ?? 0) <= 0 ? prey(s) : undefined;
  if (e) {
    p.tlBite = { id: e.id, t: T.biteTicks, dx: p.faceX, dy: p.faceY };
    p.attackCount++;
    addEffect(s, { kind: "tlMorph", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: 16, maxTicks: 14 });
    return;
  }
  const step = (p.tlGap ?? 0) > 0 ? (p.tlStep ?? 0) : 0;
  const cd = Math.max(1, Math.round((TICK_RATE / speed) * (step === 2 ? T.restMul : 1)));
  p.attackCooldown = cd;
  p.attackCount++;
  if (step === 2) slam(s);
  else swipe(s, step === 1);
  p.tlStep = (step + 1) % 3;
  p.tlGap = T.comboGap + cd;
}

/** 연습장 등에서 다시 시작할 때 (keepRoom: 방 이름은 남김) */
export function resetTail(p: PlayerState, keepRoom = false): void {
  for (const k of ["tlStep", "tlGap", "tlCd", "tlSharks", "tlBite", "tlBiteCd"] as const) delete p[k];
  if (!keepRoom) delete p.tlRoom;
}

export { isTail, tailShark, tailStep, seaR } from "./tailKit";
