// 기어스 대시 구체: 대시 키를 누르면 푸른 보석 기계 구체로 변해 그 방향으로 계속 굴러감 (무적 없음 · 받는 피해 감소는 geKit)
// 구체는 몸보다 크게(GE_BALL.size, 맞는 판정은 몸 그대로) · 튕길 때마다 빨라짐(bounceAdd, 풀면 처음부터)
// 벽에 닿으면 튕김 · 적에게 부딪히면 그 적도 피해(같은 적은 잠시 뒤에 다시)·튕겨 나옴 (적이 주는 몸 피해는 그대로) · 다시 누르면 풀림
// 마법 방패 충격파: 구체 앞에 적이 다가오면 부채꼴 충격파 · 반동 장갑·가속 구체·중갑 돌진 (itemsGears)
import { GE_PERKS as K } from "../itemsGears";
import { GE_BALL as B } from "../weaponsGears";
import { srcRun } from "./dmgSrc";
import { geArea, geStrike } from "./geHit";
import { geSize, hasGe, isGears } from "./geKit";
import { alive, isBoss } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, dist2, keepInRoom, normalize, roomGrid } from "./util";

/** 대시 키: 기어스는 구체를 켜고 끔 (보통 대시는 하지 않음 → false). 다른 캐릭터는 그대로 */
export function gearsDash(s: RunState, pressed: boolean, mx: number, my: number): boolean {
  const p = s.player;
  if (!isGears(p)) return pressed;
  const edge = pressed && !p.geDashKey;
  p.geDashKey = pressed;
  if (!edge || (p.geToggle ?? 0) > 0) return false;
  p.geToggle = B.toggle;
  if (p.geBall) {
    unball(s);
    return false;
  }
  const d = normalize(mx, my) ?? [p.faceX, p.faceY];
  p.geBall = true;
  [p.geBallDx, p.geBallDy] = d;
  p.geBallAt = s.tick;
  p.geSpin = p.geBounce = 0;
  addEffect(s, { kind: "geBump", x: p.x, y: p.y, dirX: d[0], dirY: d[1], size: ballR(p) + 10, maxTicks: 12 });
  return false;
}

/** 구체 풀기 */
export function unball(s: RunState): void {
  const p = s.player;
  p.geBall = false;
  p.geSpin = p.geBounce = 0;
  addEffect(s, { kind: "geBump", x: p.x, y: p.y, dirX: 0, dirY: 0, size: ballR(p) + 8, maxTicks: 10 });
}

/** 구체 반지름 (몸 반지름 × size) */
export const ballR = (p: RunState["player"]) => p.r * B.size;

/** 튕길 때: 빨라짐 · 가속 구체 쌓임 · 반동 장갑 */
function bounced(s: RunState): void {
  const p = s.player;
  speedUp(p);
  if (hasGe(p, "geMomentum")) p.geSpin = Math.min(K.geMomentum.max, (p.geSpin ?? 0) + 1);
  if (hasGe(p, "geRebound")) srcRun(s, "geRebound", () => {
    const r = K.geRebound.r * geSize(p);
    geArea(s, p.x, p.y, r, p.stats.damage * K.geRebound.mul);
    addEffect(s, { kind: "geRebound", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 14 });
  });
}

/** 가속 구체 배율 (빠르기·부딪힘 피해) */
const spinMul = (p: RunState["player"]) => 1 + (p.geSpin ?? 0) * K.geMomentum.add;
/** 튕긴 수 하나 더 (적에게 튕겨도) */
const speedUp = (p: RunState["player"]) => void (p.geBounce = Math.min(B.bounceMax, (p.geBounce ?? 0) + 1));
/** 튕긴 수만큼 빨라지는 배율 */
export const bounceMul = (p: RunState["player"]) => 1 + (p.geBounce ?? 0) * B.bounceAdd;

/** 적과 부딪힘: 서로 피해 (적 쪽은 같은 적을 잠시 뒤에 다시) · 적에게서 튕겨 나옴 → 새 방향 */
function ram(s: RunState, dx: number, dy: number): [number, number] {
  const p = s.player;
  const dmg = p.stats.damage * B.mul * spinMul(p) * (hasGe(p, "geHeavy") ? K.geHeavy.mul : 1);
  let back = false;
  for (const e of alive(s)) {
    const rr = ballR(p) + e.r + B.pad;
    if (dist2(e, p) > rr * rr) continue;
    const n = normalize(e.x - p.x, e.y - p.y) ?? [dx, dy];
    const dot = dx * n[0] + dy * n[1];
    if (dot > 0) {
      dx -= 2 * dot * n[0];
      dy -= 2 * dot * n[1];
      back = true;
    }
    if ((e.geBallHit ?? -999) > s.tick - B.again) continue;
    e.geBallHit = s.tick;
    geStrike(s, e, dmg, p.x, p.y);
    if (!isBoss(e)) [e.x, e.y] = [e.x + n[0] * 6, e.y + n[1] * 6];
    addEffect(s, { kind: "geBump", x: (p.x + e.x) / 2, y: (p.y + e.y) / 2, dirX: n[0], dirY: n[1], size: e.r + 6, maxTicks: 12 });
    p.geBumpAt = s.tick;
  }
  if (back) speedUp(p);
  return [dx, dy];
}

/** 틱마다 (구체일 때): 굴러가기 · 벽에 튕기기 · 적과 부딪히기 · 충격파 */
export function ballTick(s: RunState): void {
  const p = s.player;
  if (!p.geBall) return;
  let dx = p.geBallDx ?? p.faceX;
  let dy = p.geBallDy ?? p.faceY;
  const sp = p.stats.moveSpeed * B.speed * spinMul(p) * bounceMul(p);
  // 벽 판정은 구체 크기로 (몸 반지름은 그대로 둠)
  const ball = { x: p.x, y: p.y, prevX: p.x, prevY: p.y, r: ballR(p) };
  const g = roomGrid(s);
  let hit = false;
  // 한 축씩 움직여 벽에 막힌 축만 뒤집음
  const x0 = (ball.x += dx * sp);
  keepInRoom(ball, g);
  if (Math.abs(ball.x - x0) > 0.01) [dx, hit] = [-dx, true];
  const y0 = (ball.y += dy * sp);
  keepInRoom(ball, g);
  if (Math.abs(ball.y - y0) > 0.01) [dy, hit] = [-dy, true];
  [p.x, p.y] = [ball.x, ball.y];
  keepInRoom(p, g);
  if (hit) {
    addEffect(s, { kind: "geBump", x: p.x, y: p.y, dirX: dx, dirY: dy, size: ballR(p) + 4, maxTicks: 10 });
    p.geBumpAt = s.tick;
    bounced(s);
  }
  [dx, dy] = srcRun(s, "n:geBall", () => ram(s, dx, dy));
  const d = normalize(dx, dy) ?? [1, 0];
  [p.geBallDx, p.geBallDy] = d;
  [p.faceX, p.faceY] = d;
  waveTick(s);
}

/** 마법 방패 충격파: 구체 앞에 적이 다가오면 부채꼴로 밀쳐 냄 */
function waveTick(s: RunState): void {
  const p = s.player;
  if (!hasGe(p, "geWave")) return;
  if ((p.geWaveCd ?? 0) > 0) return void p.geWaveCd!--;
  const W = K.geWave;
  const k = geSize(p);
  const dx = p.geBallDx ?? 1;
  const dy = p.geBallDy ?? 0;
  const near = alive(s).some((e) => {
    const ex = e.x - p.x;
    const ey = e.y - p.y;
    return ex * ex + ey * ey <= (W.sense * k + e.r) ** 2 && ex * dx + ey * dy > 0;
  });
  if (!near) return;
  p.geWaveCd = W.cd;
  srcRun(s, "geWave", () => {
    for (const e of alive(s)) {
      const ex = e.x - p.x;
      const ey = e.y - p.y;
      const dd = Math.sqrt(ex * ex + ey * ey);
      if (dd > W.r * k + e.r || (dd > e.r && (ex * dx + ey * dy) / dd < W.arc)) continue;
      geStrike(s, e, p.stats.damage * W.mul, p.x, p.y);
      if (!isBoss(e) && dd > 0) [e.x, e.y] = [e.x + (ex / dd) * W.push, e.y + (ey / dd) * W.push];
    }
  });
  addEffect(s, { kind: "geWave", x: p.x + dx * 20 * k, y: p.y + dy * 20 * k, dirX: dx, dirY: dy, size: W.r * k, maxTicks: 20 });
}
