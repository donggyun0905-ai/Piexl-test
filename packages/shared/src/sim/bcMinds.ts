// 블랑 정신 지배: 한 대에 붙는 것(조종·기절·약화·영혼의 틈, nrKit `on.bc`) · 조종당한 적이 다른 적을 때림 · 허수의 분신 · 늦게 오는 한 대 · 천개의 거짓 눈 레이저 · 백색 거울궁 되돌림
import { ENEMIES } from "../enemyDefs";
import { BC_BASE as B, BC_CLONE as CL, BC_LV as L, BC_PUPPET as PU, BC_SKILLS as K } from "../itemsBlanc";
import { isBlanc, bcExitBlast } from "./bcPossess";
import type { BcOn } from "./bcTypes";
import { damageEnemy as damageEnemy_ } from "./combat";
import { srcCb, srcFn } from "./dmgSrc";
import { nrAlive, nrBoss, nrHit, nrLine, nrNearest, nrRoll } from "./nrKit";
import type { EnemyState, RunState } from "./types";
import { addEffect, normalize } from "./util";

const damageEnemy = srcFn("blanc", () => damageEnemy_);

/** 블랑 한 대: 피해 + 조종(보스 빼고) · 기절 · 약화 · 영혼의 틈 · 준 피해 */
export function bcHit(s: RunState, e: EnemyState, dmg: number, on: BcOn): number {
  const p = s.player;
  const d = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
  const hp = e.hp;
  damageEnemy(s, e, dmg, d[0], d[1], false);
  if (on.weak) e.bcWeak = Math.max(e.bcWeak ?? 0, on.weak);
  if (on.rift) e.bcRift = true;
  if (e.hp > 0 && !nrBoss(e)) {
    if (on.stun) e.stunTicks = Math.max(e.stunTicks ?? 0, on.stun);
    if (on.puppet) {
      e.bcPuppet = Math.max(e.bcPuppet ?? 0, on.puppet);
      e.bcSame = !!on.same;
    }
  }
  return hp - Math.max(0, e.hp);
}

/** 허수의 분신 하나 (최대 수를 넘으면 오래된 것부터) */
export function bcAddClone(s: RunState, x: number, y: number): void {
  const p = s.player;
  const list = (p.bcClones ??= []);
  while (list.length >= CL.max) list.shift();
  list.push({ id: s.tick * 8 + list.length, x, y, prevX: x, prevY: y, until: s.tick + CL.life, cd: 20, face: p.faceX < 0 ? -1 : 1, swing: 0 });
  addEffect(s, { kind: "bcPhantom", x, y, dirX: 0, dirY: 0, size: 40, maxTicks: 30 });
}

/** 백색 거울궁으로 되돌렸는지 (baseStats.dodged: true면 피해 없음 · 가까운 적에게 공격력 × back) */
export function bcMirrored(s: RunState): boolean {
  const p = s.player;
  if (!isBlanc(p) || (p.bcMirror ?? 0) <= s.tick || nrRoll(s, "bcMirror") >= B.s4.chance) return false;
  const e = nrNearest(s, p.x, p.y, B.aim);
  if (e) nrHit(s, e, p.stats.damage * B.s4.back);
  addEffect(s, { kind: "bcReflect", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, maxTicks: 16 });
  return true;
}

/** 조종당한 적: 멈춰서(기절처럼) 가까운 다른 적(같은 종류만이면 그것만)에게 다가가 때림 */
function puppetTick(s: RunState, e: EnemyState): void {
  e.bcPuppet = (e.bcPuppet ?? 0) - 1;
  e.stunTicks = Math.max(e.stunTicks ?? 0, 1);
  let best: EnemyState | undefined;
  let bd = Infinity;
  for (const f of s.enemies) {
    if (f === e || !nrAlive(f) || (e.bcSame && f.kind !== e.kind)) continue;
    const d = (f.x - e.x) ** 2 + (f.y - e.y) ** 2;
    if (d < bd) [best, bd] = [f, d];
  }
  if (!best) return;
  const reach = e.r + best.r + PU.reach;
  if (bd > reach * reach) {
    if ((e.rootTicks ?? 0) > 0) return;
    const sp = ENEMIES[e.kind].speed / Math.sqrt(bd);
    e.x += (best.x - e.x) * sp;
    e.y += (best.y - e.y) * sp;
    return;
  }
  if ((e.bcHitAt ?? 0) > s.tick) return;
  e.bcHitAt = s.tick + PU.rate;
  nrHit(s, best, s.player.stats.damage * PU.mul * (1 + ENEMIES[e.kind].contactDamage / 10));
  addEffect(s, { kind: "bcHostHit", x: best.x, y: best.y, dirX: 0, dirY: 0, size: best.r + 10, maxTicks: 12 });
}

/** 분신: 가까운 적에게 다가가 때림 · 시간이 다 되면 사라짐 */
function cloneTick(s: RunState, c: NonNullable<RunState["player"]["bcClones"]>[number]): boolean {
  [c.prevX, c.prevY] = [c.x, c.y];
  if (c.swing > 0) c.swing--;
  const e = nrNearest(s, c.x, c.y, 400);
  if (e) {
    const dx = e.x - c.x;
    const dy = e.y - c.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (Math.abs(dx) > 1) c.face = dx < 0 ? -1 : 1;
    if (d > CL.r + e.r - 6) {
      c.x += (dx / d) * CL.speed;
      c.y += (dy / d) * CL.speed;
    } else if (--c.cd <= 0) {
      c.cd = CL.rate;
      c.swing = 10;
      for (const f of s.enemies) if (nrAlive(f) && (f.x - c.x) ** 2 + (f.y - c.y) ** 2 <= (CL.r + f.r) ** 2) nrHit(s, f, s.player.stats.damage * CL.mul);
      addEffect(s, { kind: "bcFan", x: c.x, y: c.y, dirX: c.face, dirY: 0, size: CL.r, maxTicks: 16 });
    }
  }
  return s.tick < c.until;
}

/** 천개의 거짓 눈 레이저 한 발: 눈 자리에서 아무 적에게 (맞은 적 기절) */
function eyesTick(s: RunState): void {
  const p = s.player;
  const y = p.bcEyes;
  if (!y || s.tick < y.next) return;
  y.next = s.tick + K.eyes.every;
  y.left--;
  const foes = s.enemies.filter((e) => nrAlive(e) && (e.x - y.x) ** 2 + (e.y - y.y) ** 2 <= K.eyes.range ** 2);
  const e = foes[Math.floor(nrRoll(s, "bcEye") * foes.length)];
  if (y.left <= 0) delete p.bcEyes;
  if (!e) return;
  const len = Math.max(20, Math.sqrt((e.x - y.x) ** 2 + (e.y - y.y) ** 2) + 12);
  const [dx, dy] = normalize(e.x - y.x, e.y - y.y) ?? [1, 0];
  nrLine(s, y.x, y.y, dx, dy, len, K.eyes.w, p.stats.damage * L.weak, { bc: { stun: K.eyes.stun } });
  addEffect(s, { kind: "bcLaser", x: y.x, y: y.y, dirX: dx, dirY: dy, size: len, maxTicks: 10 });
}

/** 틱마다: 약화 줄기 · 조종당한 적 · 분신 · 늦게 오는 한 대 · 눈 레이저 */
export function bcMindsTick(s: RunState): void {
  const p = s.player;
  for (const e of s.enemies) {
    if ((e.bcWeak ?? 0) > 0) e.bcWeak = (e.bcWeak ?? 0) - 1;
    if ((e.bcPuppet ?? 0) > 0 && nrAlive(e)) puppetTick(s, e);
  }
  if (p.bcClones?.length) p.bcClones = p.bcClones.filter(srcCb((c) => cloneTick(s, c)));
  if (p.bcLaters?.length)
    p.bcLaters = p.bcLaters.filter(srcCb((l) => {
      if (s.tick < l.at) return true;
      if (l.clone) {
        const f = s.enemies.find((g) => g.id === l.id);
        if (!f || f.hp <= 0) bcAddClone(s, f?.x ?? l.clone[0], f?.y ?? l.clone[1]);
        return false;
      }
      const e = s.enemies.find((f) => f.id === l.id && nrAlive(f));
      if (e && l.big) bcExitBlast(s, e, l.dmg / p.stats.damage);
      else if (e) {
        nrHit(s, e, l.dmg);
        addEffect(s, { kind: "bcFeather", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 14, maxTicks: 14 });
      }
      return false;
    }));
  eyesTick(s);
}
