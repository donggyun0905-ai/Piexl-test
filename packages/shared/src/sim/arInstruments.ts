// 아리아 악기 (전용 패시브): 공격마다 확률로 방 어딘가에 놓임 · 피아노(하나·60초, 음표 셋) · 하프(하나·60초, 음표 다섯 부채꼴) · 호른(둘·30초, 빠른 음표 하나씩)
// 클라리넷(둘·30초): 가까운 적을 따라다니며 둘레 적을 느리게·공격을 늦게·받는 피해를 크게 (sim/arLull) · 영혼의 바이올린: 곁을 떠다니다 활로 휘감아 벰
// 피해 출처는 악기마다 그 패시브 이름 (악기 음표는 쏜 악기를 달고 감)
import { ARIA_PERKS as K } from "../itemsAria";
import { AR_NOTE as N } from "../weaponsAria";
import { arAlive, arArea, arHit, arNearest, arRng, arRoll, arSpot, hasAr } from "./arKit";
import type { ArInst, ArShot } from "./arTypes";
import { srcRun, srcEach } from "./dmgSrc";
import { rot } from "./orbit";
import type { RunState } from "./types";
import { addEffect, normalize } from "./util";

type P = RunState["player"];

const IDS = ["arPiano", "arHarp", "arHorn", "arClarinet"] as const;
const M = () => K.arMaestro;

/** 악기 수치 (kind 번호) */
const def = (k: number) => K[IDS[k]!];
const lifeOf = (p: P, k: number) => Math.round(def(k).life * (hasAr(p, "arMaestro") ? M().life : 1));
const shotMul = (p: P) => (hasAr(p, "arMaestro") ? M().mul : 1);

/** 공격마다: 가진 악기를 확률로 놓음 (가장 많이 놓인 수까지) */
export function instOnAttack(s: RunState): void {
  const p = s.player;
  const list = (p.arInst ??= []);
  for (let k = 0; k < IDS.length; k++) {
    const id = IDS[k]!;
    if (!hasAr(p, id) || list.filter((i) => i.kind === k).length >= def(k).max) continue;
    if (arRoll(s, id) >= def(k).chance * (hasAr(p, "arMaestro") ? M().chance : 1)) continue;
    const [x, y] = arSpot(s, "arInstAt", 30);
    list.push({ kind: k, x, y, prevX: x, prevY: y, left: lifeOf(p, k), cd: 20, face: x < p.x ? 1 : -1 });
    addEffect(s, { kind: "arPlace", x, y, dirX: 0, dirY: 0, size: 26, style: k, maxTicks: 30 });
  }
}

/** 악기 음표 하나 (tgt 쫓는 적) */
function shoot(s: RunState, i: ArInst, dx: number, dy: number, spd: number, mul: number, tgt: number): void {
  const p = s.player;
  const kind = Math.floor(arRng(s, "arShotKind").nextFloat() * N.kinds);
  const y = i.y - 12;
  (p.arShots ??= []).push({ x: i.x, y, prevX: i.x, prevY: y, dx, dy, spd, dmg: p.stats.damage * mul * shotMul(p), left: N.shotLife, tgt, kind, src: IDS[i.kind]! });
}

/** 악기 하나 연주 */
function play(s: RunState, i: ArInst): void {
  if (i.kind === 3) {
    // 클라리넷: 가까운 적을 따라다님 · 둘레 적에게 효과
    const C = K.arClarinet;
    const e = arNearest(s, i.x, i.y);
    const d = e ? normalize(e.x - i.x, e.y - i.y - 16) : null;
    if (e && d && (e.x - i.x) ** 2 + (e.y - 16 - i.y) ** 2 > 14 ** 2) {
      i.x += d[0] * C.speed;
      i.y += d[1] * C.speed;
      if (Math.abs(d[0]) > 0.2) i.face = d[0] > 0 ? 1 : -1;
    }
    for (const f of s.enemies) {
      if (!arAlive(f) || (f.x - i.x) ** 2 + (f.y - i.y) ** 2 > (C.r + f.r) ** 2) continue;
      f.arLull = s.tick + 6;
      f.slowTicks = Math.max(f.slowTicks ?? 0, 6);
    }
    if (s.tick % 40 === 0) i.playAt = s.tick;
    return;
  }
  if (--i.cd > 0) return;
  const e = arNearest(s, i.x, i.y);
  if (!e) return;
  const d = normalize(e.x - i.x, e.y - (i.y - 12)) ?? [1, 0];
  i.face = d[0] >= 0 ? 1 : -1;
  i.playAt = s.tick;
  if (i.kind === 0) {
    // 피아노: 가까운 적 셋에게 하나씩 (적이 적으면 같은 적에게)
    const R = K.arPiano;
    const skip: number[] = [];
    for (let n = 0; n < R.n; n++) {
      const t = arNearest(s, i.x, i.y, Infinity, skip) ?? e;
      skip.push(t.id);
      const v = normalize(t.x - i.x, t.y - (i.y - 12)) ?? d;
      const w = rot(Math.atan2(v[1], v[0]) + (n - 1) * 0.35);
      shoot(s, i, w[0], w[1], R.speed, R.mul, t.id);
    }
    i.cd = R.rate;
  } else if (i.kind === 1) {
    // 하프: 가까운 적 쪽으로 부채꼴 다섯
    const R = K.arHarp;
    const a = Math.atan2(d[1], d[0]);
    for (let n = 0; n < R.n; n++) {
      const w = rot(a + (n - (R.n - 1) / 2) * R.spread);
      shoot(s, i, w[0], w[1], R.speed, R.mul, e.id);
    }
    i.cd = R.rate;
  } else {
    // 호른: 빠른 음표 하나
    shoot(s, i, d[0], d[1], K.arHorn.speed, K.arHorn.mul, e.id);
    i.cd = K.arHorn.rate;
  }
}

/** 악기 음표: 쫓는 적에게 조금씩 휨 · 처음 닿은 적에게 터지고 사라짐 */
function shotsTick(s: RunState): void {
  const p = s.player;
  const keep: ArShot[] = [];
  for (const sh of srcEach(p.arShots ?? [])) {
    sh.prevX = sh.x;
    sh.prevY = sh.y;
    const t = s.enemies.find((e) => e.id === sh.tgt && arAlive(e));
    const d = t ? normalize(t.x - sh.x, t.y - sh.y) : null;
    if (d) [sh.dx, sh.dy] = normalize(sh.dx + d[0] * N.shotHome, sh.dy + d[1] * N.shotHome) ?? [sh.dx, sh.dy];
    sh.x += sh.dx * sh.spd;
    sh.y += sh.dy * sh.spd;
    const e = s.enemies.find((f) => arAlive(f) && (f.x - sh.x) ** 2 + (f.y - sh.y) ** 2 <= (f.r + 6) ** 2);
    if (e) {
      srcRun(s, sh.src, () => arHit(s, e, sh.dmg, sh.dx, sh.dy));
      addEffect(s, { kind: "arPop", x: sh.x, y: sh.y, dirX: 0, dirY: 0, size: 8, style: sh.kind, maxTicks: 12 });
      continue;
    }
    if (--sh.left > 0) keep.push(sh);
  }
  p.arShots = keep;
}

/** 영혼의 바이올린: 몸 뒤 어깨 위를 떠다님 · 가까운 적이 있으면 활로 휘감아 여러 번 벰 */
function violinTick(s: RunState): void {
  const p = s.player;
  if (!hasAr(p, "arViolin")) return void delete p.arViolin;
  const R = K.arViolin;
  const v = (p.arViolin ??= { x: p.x, y: p.y, prevX: p.x, prevY: p.y, cd: 30, hits: 0, gap: 0 });
  v.prevX = v.x;
  v.prevY = v.y;
  const [tx, ty] = [p.x - p.faceX * 16, p.y - 18];
  v.x += (tx - v.x) * 0.12;
  v.y += (ty - v.y) * 0.12;
  if (v.hits > 0) {
    if (--v.gap > 0) return;
    srcRun(s, "arViolin", () => arArea(s, v.x, v.y + 10, R.r, p.stats.damage * R.mul, "arSweep", 0, 20));
    v.swingAt = s.tick;
    v.hits--;
    v.gap = R.gap;
    return;
  }
  if (--v.cd > 0) return;
  v.cd = 10;
  if (!arNearest(s, v.x, v.y, R.sight)) return;
  v.cd = R.rate;
  v.hits = R.hits;
  v.gap = 0;
}

/** 틱마다: 악기 남은 시간 · 연주 · 악기 음표 · 바이올린 */
export function instTick(s: RunState): void {
  const p = s.player;
  const list = p.arInst ?? [];
  for (const i of list) {
    i.prevX = i.x;
    i.prevY = i.y;
    i.left--;
    play(s, i);
  }
  if (list.some((i) => i.left <= 0)) p.arInst = list.filter((i) => i.left > 0);
  shotsTick(s);
  violinTick(s);
}
