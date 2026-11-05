// 훅(탈라시아, 해적): 누르면 빛 갈고리를 던짐 → 지나가며 적을 걸고(최대 3) 감아 와 내 앞에 모음 → 더블배럴 산탄총 초근접 발사 (sim/hookShot)
// 아무 적도 안 걸린 채 벽에 박히면 밧줄을 타고 벽으로 날아가 내리며 쏨 · 보스에 걸리면 내가 보스에게 끌려가 쏘고 원래 자리로 튕겨 돌아옴
import { TICK_RATE } from "../constants";
import { HOOK_PERKS as K } from "../itemsHook";
import { HOOK as H } from "../weaponsHook";
import { anchored, blast, catchMax, hkHit, hookOf, hookReach, slideTick } from "./hookShot";
import type { HkHook } from "./hookTypes";
import { blocksShot } from "./layout";
import { alive, isBoss, roomKey, stun } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, keepInRoom, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, roomGrid } from "./util";

/** 갈고리 약화: 걸릴 때마다 1스택 (최대 HOOK.markMax) */
function mark(s: RunState, e: EnemyState): void {
  if ((e.hkMark ?? 0) >= H.markMax) return;
  e.hkMark = (e.hkMark ?? 0) + 1;
  addEffect(s, { kind: "hkMark", x: e.x, y: e.y - e.r - 6, dirX: 0, dirY: 0, size: e.hkMark, maxTicks: 18 });
}

/** 갈고리가 나가는 한 틱: 지나가는 적을 걸고 · 보스면 내가 끌려감 · 벽에 박히면 (빈 갈고리는) 밧줄 타기 */
function hookOut(s: RunState, h: HkHook): void {
  const p = s.player;
  const step = Math.min(h.left, H.outSpeed * (hookOf(p).speed ?? 1));
  h.x += h.dx * step;
  h.y += h.dy * step;
  h.left -= step;
  for (const e of alive(s)) {
    if (h.caught.some((c) => c.id === e.id) || dist2(e, h) > (H.catchR + e.r) ** 2) continue;
    if (h.caught.length < catchMax(p) || isBoss(e)) mark(s, e);
    if (isBoss(e) && h.caught.length === 0) {
      h.k = 3;
      h.boss = e.id;
      h.hx = p.x;
      h.hy = p.y;
      h.t = 0;
      addEffect(s, { kind: "hkGrab", x: e.x, y: e.y, dirX: h.dx, dirY: h.dy, size: e.r + 8, maxTicks: 16 });
      return;
    }
    if (h.caught.length >= catchMax(p)) break;
    h.caught.push({ id: e.id, ox: e.x, oy: e.y });
    hkHit(s, e, p.stats.damage * H.grabMul, p.x, p.y);
    addEffect(s, { kind: "hkGrab", x: e.x, y: e.y, dirX: h.dx, dirY: h.dy, size: e.r + 6, maxTicks: 14 });
  }
  const g = roomGrid(s);
  const wall = h.x < ROOM_MIN_X || h.x > ROOM_MAX_X || h.y < ROOM_MIN_Y || h.y > ROOM_MAX_Y || (g !== null && blocksShot(g, h.x, h.y));
  if (wall && h.caught.length === 0) {
    h.k = 2;
    h.x -= h.dx * 8;
    h.y -= h.dy * 8;
    h.t = 0;
    addEffect(s, { kind: "hkGrab", x: h.x, y: h.y, dirX: h.dx, dirY: h.dy, size: 10, maxTicks: 14 });
  } else if (wall || h.left <= 0) h.k = 1;
}

/** 감아 오는 한 틱: 걸린 적을 갈고리째 내 앞까지 끌고 옴 → 닿으면 산탄 */
function hookReel(s: RunState, h: HkHook): boolean {
  const p = s.player;
  const tx = p.x + h.dx * H.holdAt;
  const ty = p.y + h.dy * H.holdAt;
  const d = Math.hypot(tx - h.x, ty - h.y);
  const done = d <= H.reelSpeed;
  h.x = done ? tx : h.x + ((tx - h.x) / d) * H.reelSpeed;
  h.y = done ? ty : h.y + ((ty - h.y) / d) * H.reelSpeed;
  const n = h.caught.length;
  h.caught.forEach((c, i) => {
    const e = s.enemies.find((o) => o.id === c.id && o.hp > 0);
    if (!e || anchored(e)) return;
    const off = (i - (n - 1) / 2) * 11;
    e.x = h.x - h.dy * off;
    e.y = h.y + h.dx * off;
    keepInRoom(e, roomGrid(s));
    stun(e, 3);
  });
  if (!done) return true;
  blast(s, h.dx, h.dy, h.caught);
  return false;
}

/** 밧줄 타기 (벽) · 보스에게 끌려감 · 튕겨 돌아옴: 끝나면 false */
function ride(s: RunState, h: HkHook): boolean {
  const p = s.player;
  h.t++;
  p.invulnTicks = Math.max(p.invulnTicks, 3);
  if (h.k === 4) {
    p.x += h.dx;
    p.y += h.dy;
    keepInRoom(p, roomGrid(s));
    return h.t < H.bounceTicks;
  }
  const boss = h.k === 3 ? s.enemies.find((o) => o.id === h.boss && o.hp > 0) : undefined;
  if (h.k === 3 && !boss) return false;
  const tx = boss ? boss.x : h.x;
  const ty = boss ? boss.y : h.y;
  const stop = boss ? boss.r + p.r + H.zipStop : 2;
  const d = Math.hypot(tx - p.x, ty - p.y);
  const step = Math.min(H.zipStep, Math.max(0, d - stop));
  if (d > 0) {
    p.x += ((tx - p.x) / d) * step;
    p.y += ((ty - p.y) / d) * step;
    p.faceX = (tx - p.x) / d || p.faceX;
    p.faceY = (ty - p.y) / d || p.faceY;
  }
  keepInRoom(p, roomGrid(s));
  if (d - step > stop + 1 && h.t < H.zipTicks) return true;
  if (boss) {
    // 보스 코앞에서 쏘고 원래 자리 쪽으로 튕겨 돌아옴
    blast(s, h.dx, h.dy, [{ id: boss.id, ox: boss.x, oy: boss.y }]);
    h.k = 4;
    h.t = 0;
    h.dx = ((h.hx ?? p.x) - p.x) / H.bounceTicks;
    h.dy = ((h.hy ?? p.y) - p.y) / H.bounceTicks;
    return true;
  }
  // 벽에 내림: 밧줄 그네는 둘레 충격파 · 내리며 바라보는 쪽으로 산탄
  if (hasPerk(p, "hkSwing")) for (const e of alive(s)) if (dist2(e, p) <= (K.hkSwing.r + e.r) ** 2) hkHit(s, e, p.stats.damage * K.hkSwing.mul, p.x, p.y);
  addEffect(s, { kind: "hkLand", x: p.x, y: p.y, dirX: h.dx, dirY: h.dy, size: hasPerk(p, "hkSwing") ? K.hkSwing.r : 20, maxTicks: 20 });
  blast(s, -h.dx, -h.dy, []);
  return false;
}

/** 방이 바뀌면 갈고리를 거둠 */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.hkRoom === key) return;
  p.hkRoom = key;
  resetHook(p, true);
}

/** 틱마다 (갈고리 무기를 들었을 때 player에서) */
export function hookTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  slideTick(s);
  if (p.hkTap && --p.hkTap.t <= 0) {
    blast(s, p.hkTap.dx, p.hkTap.dy, [], K.hkDoubleTap.mul, true);
    delete p.hkTap;
  }
  const h = p.hkHook;
  if (h) {
    if (h.k === 0) hookOut(s, h);
    const going = h.k === 0 || (h.k === 1 ? hookReel(s, h) : ride(s, h));
    if (!going) delete p.hkHook;
    return;
  }
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  p.hkHook = { k: 0, x: p.x + p.faceX * 8, y: p.y + p.faceY * 8, dx: p.faceX, dy: p.faceY, left: hookReach(p), t: 0, caught: [] };
}

/** 연습장 등에서 다시 시작할 때 (keepRoom: 방 이름은 남김) */
export function resetHook(p: PlayerState, keepRoom = false): void {
  for (const k of ["hkHook", "hkSlides", "hkTap", "hkShot"] as const) delete p[k];
  if (!keepRoom) delete p.hkRoom;
}

export { hookReach, isHook } from "./hookShot";
