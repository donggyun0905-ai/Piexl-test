// 레오 전용 아이템 효과: 뇌광 도약(대시) · 번개 갈기 · 뇌운 · 황금 갑주(받는 피해·방전)
// 사자의 긍지·연쇄 뇌전·번개 송곳니·천뢰 보석·우레 포효·백수의 왕은 sim/leo 안에서
import { LEO_PERKS as K } from "../itemsLeo";
import { createRng, deriveSeed } from "../rng";
import { addMark, charge, isLeo, leoPower, skyBolt } from "./leo";
import { alive, inCircle, strike, stun } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, dist2, hasPerk, keepInRoom, roomGrid } from "./util";

/** 뇌광 도약: 대시를 시작한 틱에 앞쪽(대시 방향) 가까운 적 곁으로 뛰어들어 내려침 */
export function leoDash(s: RunState): void {
  const p = s.player;
  const start = p.dashTicks > 0 && !p.leDashing;
  p.leDashing = p.dashTicks > 0;
  if (!start || !hasPerk(p, "lePounce")) return;
  const e = alive(s)
    .filter((o) => dist2(o, p) <= K.lePounce.reach ** 2 && (o.x - p.x) * p.dashDirX + (o.y - p.y) * p.dashDirY > 0)
    .sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id)[0];
  if (!e) return;
  const fromX = p.x;
  const fromY = p.y;
  const d = Math.hypot(e.x - p.x, e.y - p.y) || 1;
  const stop = Math.max(0, d - e.r - p.r - 2);
  p.x += ((e.x - p.x) / d) * stop;
  p.y += ((e.y - p.y) / d) * stop;
  keepInRoom(p, roomGrid(s));
  p.faceX = (e.x - fromX) / d;
  p.faceY = (e.y - fromY) / d;
  let hits = 0;
  for (const o of inCircle(s, p.x, p.y, K.lePounce.r)) {
    strike(s, o, leoPower(s) * K.lePounce.mul, 6, "shock");
    stun(o, K.lePounce.stun);
    addMark(p, o);
    hits++;
  }
  if (hits) charge(s, hits * 4);
  addEffect(s, { kind: "lePounce", x: fromX, y: fromY, dirX: p.faceX, dirY: p.faceY, size: K.lePounce.r, toX: p.x, toY: p.y, maxTicks: 20 });
}

/** 번개 갈기: 몸 둘레 적에게 정전기 */
export function leoMane(s: RunState): void {
  const p = s.player;
  if (!hasPerk(p, "leMane")) return;
  p.leMane = (p.leMane ?? K.leMane.gap) - 1;
  if (p.leMane > 0) return;
  p.leMane = K.leMane.gap;
  const near = inCircle(s, p.x, p.y, K.leMane.r);
  for (const e of near) strike(s, e, leoPower(s) * K.leMane.mul, 0, "shock");
  if (near.length) addEffect(s, { kind: "leSpark", x: p.x, y: p.y - 4, dirX: 0, dirY: 0, size: K.leMane.r, maxTicks: 12 });
}

/** 뇌운: 몇 초마다 방 어딘가의 적 하나에게 낙뢰 (시드로 고름) */
export function leoStorm(s: RunState): void {
  const p = s.player;
  if (!hasPerk(p, "leStorm")) return;
  p.leStorm = (p.leStorm ?? K.leStorm.gap) - 1;
  if (p.leStorm > 0) return;
  const list = alive(s).sort((a, b) => a.id - b.id);
  if (!list.length) {
    p.leStorm = 1;
    return;
  }
  p.leStorm = K.leStorm.gap;
  const e = list[Math.floor(createRng(deriveSeed(s.seed, "leStorm", s.tick)).nextFloat() * list.length)]!;
  skyBolt(s, e, leoPower(s) * K.leStorm.mul, "storm");
}

/** 황금 갑주: 받는 피해 배율 (classTaken) · 맞으면 둘레에 방전 */
export function leoTaken(s: RunState): number {
  const p = s.player;
  if (!isLeo(p) || !hasPerk(p, "leArmor")) return 1;
  if (!p.leArmorCd) {
    p.leArmorCd = K.leArmor.gap;
    for (const e of inCircle(s, p.x, p.y, K.leArmor.r)) strike(s, e, leoPower(s) * K.leArmor.mul, 10, "shock");
    addEffect(s, { kind: "leSpark", x: p.x, y: p.y - 4, dirX: 0, dirY: 0, size: K.leArmor.r, maxTicks: 18, width: 1 });
  }
  return K.leArmor.taken;
}

