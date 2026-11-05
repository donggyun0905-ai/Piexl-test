// 리바이어 고래: 고래 대돌격(날아가는 큰 고래) · 해류 웅덩이 · 고래가 나올 때 아이템 반응 · 고래 도약
import { LEVIA_PERKS as K } from "../itemsLevia";
import { LEVIA as L } from "../weaponsLevia";
import { nearest } from "./brawlMoves";
import { healPlayer } from "./combat";
import { rot } from "./orbit";
import { gemOf, lvHit, whaleDmg, whaleSize } from "./leviaKit";
import type { LvWhale } from "./leviaTypes";
import { alive, inCircle, isBoss, onSegment, stun } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, dist2, hasPerk, keepInRoom, roomGrid } from "./util";

/** 고래 하나를 (dx, dy) 쪽으로 내보냄 */
export function launchWhale(s: RunState, dx: number, dy: number, w: Omit<LvWhale, "x" | "y" | "dx" | "dy" | "hit">): void {
  const p = s.player;
  (p.lvWhales ??= []).push({ x: p.x + dx * 6, y: p.y + dy * 6, dx, dy, hit: [], ...w });
  if (p.lvWhales.length > 8) p.lvWhales.shift();
}

/** 3타 고래 대돌격: 바라보는 쪽으로 큰 고래 (쌍둥이 진주 · 고래 무리면 여럿이 벌어져서) */
export function whaleCharge(s: RunState): void {
  const p = s.player;
  const cur = hasPerk(p, "lvCurrent");
  const twin = gemOf(p).gem === "twin";
  const n = 1 + (twin ? 1 : 0) + (hasPerk(p, "lvPod") ? K.lvPod.n : 0);
  const spread = twin ? L.twinSpread : K.lvPod.spread;
  const sp = L.chargeSpeed;
  for (let i = 0; i < n; i++) {
    const a = (i - (n - 1) / 2) * spread;
    const [c, sn] = rot(a);
    const dx = p.faceX * c - p.faceY * sn;
    const dy = p.faceX * sn + p.faceY * c;
    const mul = L.chargeMul * (twin && i > 0 ? L.twinMul : 1);
    launchWhale(s, dx, dy, {
      t: Math.ceil((L.chargeRange * (cur ? K.lvCurrent.range : 1)) / sp),
      sp,
      r: L.chargeR * whaleSize(p) * (cur ? K.lvCurrent.r : 1),
      dmg: whaleDmg(p, mul),
      pool: 0,
    });
  }
  addEffect(s, { kind: "lvCharge", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: L.chargeR * whaleSize(p), maxTicks: 18 });
}

/** 고래가 나왔을 때 (1~4타 어디서든): 뇌명 토파즈 번개 · 심해의 노래 · 아기 고래 · 물뿜기 */
export function onWhale(s: RunState): void {
  const p = s.player;
  if (gemOf(p).gem === "topaz") {
    const near = alive(s)
      .filter((e) => dist2(e, p) < L.boltReach ** 2)
      .sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id)
      .slice(0, L.boltN);
    for (const e of near) {
      lvHit(s, e, whaleDmg(p, L.boltMul), 0, "shock", true);
      addEffect(s, { kind: "lvBolt", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 10, maxTicks: 16 });
    }
  }
  if (hasPerk(p, "lvSong")) {
    for (const e of inCircle(s, p.x, p.y, K.lvSong.r)) stun(e, K.lvSong.stun);
    addEffect(s, { kind: "lvSong", x: p.x, y: p.y, dirX: 0, dirY: 0, size: K.lvSong.r, maxTicks: 30 });
  }
  if (hasPerk(p, "lvCalf")) {
    const e = nearest(s, K.lvCalf.range);
    const len = e ? Math.hypot(e.x - p.x, e.y - p.y) || 1 : 1;
    const dx = e ? (e.x - p.x) / len : p.faceX;
    const dy = e ? (e.y - p.y) / len : p.faceY;
    launchWhale(s, dx, dy, { t: Math.ceil(K.lvCalf.range / 4), sp: 4, r: K.lvCalf.r * whaleSize(p), dmg: whaleDmg(p, K.lvCalf.mul), calf: true });
  }
  if (hasPerk(p, "lvBlowhole")) {
    const k = K.lvBlowhole;
    for (const e of inCircle(s, p.x, p.y, k.r)) lvHit(s, e, whaleDmg(p, k.mul), 6, "tide", true);
    healPlayer(s, p.stats.maxHp * k.heal);
    addEffect(s, { kind: "lvGush", x: p.x, y: p.y, dirX: 0, dirY: 0, size: k.r, maxTicks: 30 });
  }
}

/** 고래 도약 (리바이어던의 눈): 바다에서 솟구쳐 (x, y)에 내리찍음 */
export function breach(s: RunState, x: number, y: number): void {
  const p = s.player;
  const r = L.breachR * whaleSize(p);
  for (const e of inCircle(s, x, y, r)) {
    lvHit(s, e, whaleDmg(p, L.breachMul), 14, "tide", true);
    stun(e, L.breachStun);
  }
  addEffect(s, { kind: "lvBreach", x, y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 36 });
}

/** 산호석: 고래가 끝에서 터짐 */
function burst(s: RunState, x: number, y: number): void {
  const p = s.player;
  for (const e of inCircle(s, x, y, L.burstR)) lvHit(s, e, whaleDmg(p, L.burstMul), 10, "tide", true);
  addEffect(s, { kind: "lvBurst", x, y, dirX: 0, dirY: 0, size: L.burstR, maxTicks: 26 });
}

/** 날아가는 고래 한 틱: 지나온 줄로 맞힘 (적마다 한 번) · 방 끝이나 시간이 다하면 끝 */
function whaleStep(s: RunState, w: LvWhale): number {
  const p = s.player;
  const ax = w.x;
  const ay = w.y;
  const b = { x: w.x + w.dx * w.sp, y: w.y + w.dy * w.sp, prevX: 0, prevY: 0, r: 4 };
  keepInRoom(b, roomGrid(s));
  w.x = b.x;
  w.y = b.y;
  w.t--;
  // 벽에 막히면 끝
  if (Math.abs(b.x - (ax + w.dx * w.sp)) + Math.abs(b.y - (ay + w.dy * w.sp)) > 0.5) w.t = 0;
  let n = 0;
  for (const e of onSegment(s, ax, ay, w.x, w.y, w.r)) {
    if (w.hit.includes(e.id)) continue;
    w.hit.push(e.id);
    n++;
    lvHit(s, e, w.dmg, isBoss(e) ? 0 : 8, "tide", true);
  }
  if (w.pool !== undefined && gemOf(p).gem === "sapphire" && --w.pool <= 0) {
    w.pool = L.poolEvery;
    (p.lvPools ??= []).push({ x: w.x, y: w.y, t: L.poolTicks, cd: 0, r: L.poolR * whaleSize(p) });
    if (p.lvPools.length > 30) p.lvPools.shift();
  }
  if (w.t <= 0 && !w.calf && w.pool !== undefined && gemOf(p).gem === "coral") burst(s, w.x, w.y);
  return n;
}

/** 틱마다: 날아가는 고래 · 해류 웅덩이 · 용연향 */
export function whaleTick(s: RunState): void {
  const p = s.player;
  if (p.lvHaste) p.lvHaste--;
  if (p.lvWhales) {
    for (const w of p.lvWhales) {
      whaleStep(s, w);
      if (w.t <= 0 && w.hit.length >= K.lvAmber.need && hasPerk(p, "lvAmber")) p.lvHaste = K.lvAmber.ticks;
    }
    p.lvWhales = p.lvWhales.filter((w) => w.t > 0);
    if (p.lvWhales.length === 0) delete p.lvWhales;
  }
  if (p.lvPools) {
    for (const o of p.lvPools) {
      o.t--;
      for (const e of inCircle(s, o.x, o.y, o.r)) {
        if (isBoss(e) || e.kind === "dummy") continue;
        const d = Math.hypot(o.x - e.x, o.y - e.y);
        if (d > 2) {
          e.x += ((o.x - e.x) / d) * L.poolPull;
          e.y += ((o.y - e.y) / d) * L.poolPull;
        }
      }
      if (o.cd-- > 0) continue;
      o.cd = L.poolGap;
      for (const e of inCircle(s, o.x, o.y, o.r)) lvHit(s, e, whaleDmg(p, L.poolMul), 0, "tide", true);
    }
    p.lvPools = p.lvPools.filter((o) => o.t > 0);
    if (p.lvPools.length === 0) delete p.lvPools;
  }
}
