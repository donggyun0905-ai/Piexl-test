// 서기관(히든, 아카식 레코드): 깃펜으로 잉크 탄을 쏘아 맞은 적에게 기록(잉크)을 새김 · 몇 번째 공격마다 무기의 글자가 써지며 발동
// 글자: 검 · 폭 · 봉 · 뢰 · 빙 · 염 · 재 · 성 · 멸 · 원본(차례로 모두). 수치는 weaponsScribe.SCRIBE, 아이템은 itemsScribe
import { TICK_RATE } from "../constants";
import { ENEMIES } from "../enemyDefs";
import { createRng, deriveSeed } from "../rng";
import { SCRIBE_PERKS as K } from "../itemsScribe";
import { SCRIBE as S, type ScribeWord } from "../weaponsScribe";
import { blastAt, damageEnemy, healPlayer, ignite } from "./combat";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize, weaponOf } from "./util";

/** 아카식 원본이 차례로 쓰는 글자 */
const ORIGIN: readonly ScribeWord[] = ["blade", "burst", "seal", "bolt", "frost", "flame", "recall", "star", "void"];
/** 글자 번호 (그리기: render/scribe의 글자 모양 순서) */
export const WORD_INDEX: Record<ScribeWord, number> = { blade: 0, burst: 1, seal: 2, bolt: 3, frost: 4, flame: 5, recall: 6, star: 7, void: 8, origin: 9 };

/** 각주: 기록 하나당 받는 피해 + (combat.damageEnemy) */
export const inkTaken = (p: PlayerState, e: EnemyState) => ((e.ink ?? 0) > 0 && hasPerk(p, "footnote") ? K.footnote.per * (e.ink ?? 0) : 0);

/** 금서: 기록이 새겨진 적을 쓰러뜨리면 회복 (combat.removeDead) */
export function scribeKill(s: RunState, e: EnemyState): void {
  if ((e.ink ?? 0) > 0 && hasPerk(s.player, "forbiddenBook")) healPlayer(s, K.forbiddenBook.heal);
}

const alive = (s: RunState) => s.enemies.filter((e) => e.hp > 0 && !e.svBox && !e.immune);

/** 글자 맞힘: 피해 + 검열이면 잠깐 멈춤 */
function hit(s: RunState, e: EnemyState, dmg: number): void {
  const p = s.player;
  const d = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
  damageEnemy(s, e, dmg, d[0], d[1]);
  if (hasPerk(p, "censor") && !ENEMIES[e.kind].boss) e.stunTicks = Math.max(e.stunTicks ?? 0, K.censor.stun);
}

/** 글자가 써질 자리: 사거리 안 가장 가까운 적, 없으면 바라보는 쪽 사거리 끝 */
function aimPoint(s: RunState): { x: number; y: number } {
  const p = s.player;
  let best: EnemyState | null = null;
  for (const e of alive(s)) if (dist2(e, p) < (p.stats.range * 1.4) ** 2 && (!best || dist2(e, p) < dist2(best, p))) best = e;
  return best ? { x: best.x, y: best.y } : { x: p.x + p.faceX * p.stats.range, y: p.y + p.faceY * p.stats.range };
}

function around(s: RunState, x: number, y: number, r: number): EnemyState[] {
  return alive(s).filter((e) => dist2(e, { x, y }) <= (r + e.r) ** 2);
}

/** 글자 하나 쓰기 (power: 개정판 두 번째는 절반) */
function write(s: RunState, word: ScribeWord, power: number): void {
  const p = s.player;
  const dmg = p.stats.damage * S.wordMul * power * (hasPerk(p, "sealStamp") ? K.sealStamp.damage : 1);
  const at = aimPoint(s);
  const w = word === "origin" ? ORIGIN[(p.writes ?? 0) % ORIGIN.length]! : word;
  addEffect(s, { kind: "scWord", x: at.x, y: at.y - 6, dirX: WORD_INDEX[w], dirY: 0, size: 12, maxTicks: 36 });
  switch (w) {
    case "blade": {
      // 나와 적 사이를 가르는 잉크 칼날 (선분 둘레 width 안)
      const d = normalize(at.x - p.x, at.y - p.y) ?? [p.faceX, p.faceY];
      const len = Math.max(p.stats.range, Math.hypot(at.x - p.x, at.y - p.y) + 20);
      for (const e of alive(s)) {
        const t = (e.x - p.x) * d[0] + (e.y - p.y) * d[1];
        const off = Math.abs((e.x - p.x) * d[1] - (e.y - p.y) * d[0]);
        if (t > -e.r && t < len + e.r && off < S.bladeWidth + e.r) hit(s, e, dmg);
      }
      addEffect(s, { kind: "streak", x: p.x, y: p.y, dirX: d[0], dirY: d[1], size: 4, toX: p.x + d[0] * len, toY: p.y + d[1] * len, maxTicks: 14 });
      break;
    }
    case "burst":
      for (const e of around(s, at.x, at.y, S.burstR)) hit(s, e, dmg);
      addEffect(s, { kind: "blast", x: at.x, y: at.y, dirX: 0, dirY: 0, size: S.burstR, maxTicks: 14 });
      break;
    case "seal":
      for (const e of around(s, p.x, p.y, S.sealR)) {
        hit(s, e, dmg * 0.6);
        if (e.kind !== "dummy") e.stunTicks = Math.max(e.stunTicks ?? 0, ENEMIES[e.kind].boss ? S.sealStun / 2 : S.sealStun);
      }
      addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: S.sealR, maxTicks: 20, width: 2 });
      break;
    case "bolt": {
      // 기록이 많은 적부터 차례로 번개 (없으면 가까운 적)
      const list = alive(s).sort((a, b) => (b.ink ?? 0) - (a.ink ?? 0) || dist2(a, p) - dist2(b, p) || a.id - b.id).slice(0, S.boltChain);
      let from = { x: p.x, y: p.y - 6 };
      for (const e of list) {
        hit(s, e, dmg * 0.8);
        addEffect(s, { kind: "bolt", x: from.x, y: from.y, dirX: 0, dirY: 0, size: 2, maxTicks: 10, toX: e.x, toY: e.y, width: 2 });
        from = e;
      }
      break;
    }
    case "frost":
      for (const e of around(s, p.x, p.y, S.frostR)) {
        hit(s, e, dmg * 0.8);
        if (e.kind !== "dummy" && !ENEMIES[e.kind].boss) e.stunTicks = Math.max(e.stunTicks ?? 0, S.frostStun);
      }
      addEffect(s, { kind: "oFrost", x: p.x, y: p.y, dirX: 0, dirY: 0, size: S.frostR, maxTicks: 24, tint: "#8ad8ff" });
      break;
    case "flame":
      for (const e of around(s, at.x, at.y, S.flameR)) {
        hit(s, e, dmg * 0.6);
        ignite(e, dmg);
      }
      addEffect(s, { kind: "oFlame", x: at.x, y: at.y, dirX: 0, dirY: -1, size: S.flameR, width: -1, maxTicks: 22 });
      break;
    case "recall":
      // 기록된 적마다 새긴 기록 수만큼 피해 (기록은 지워짐)
      for (const e of alive(s)) {
        if (!e.ink) continue;
        hit(s, e, dmg * S.recallPer * e.ink);
        addEffect(s, { kind: "hit", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 8, maxTicks: 12 });
        e.ink = 0;
      }
      break;
    case "star": {
      const rng = createRng(deriveSeed(s.seed, "scStar", s.tick, p.writes ?? 0));
      const list = alive(s).filter((e) => dist2(e, p) < (p.stats.range * 1.6) ** 2);
      for (let i = 0; i < S.stars; i++) {
        const e = list.length ? list[rng.int(0, list.length - 1)]! : null;
        const x = e ? e.x : at.x + rng.int(-20, 20);
        const y = e ? e.y : at.y + rng.int(-20, 20);
        blastAt(s, x, y, S.starR, dmg * 0.7, { still: true });
        addEffect(s, { kind: "meteor", x, y, dirX: 0, dirY: 0, size: S.starR, maxTicks: 16 });
      }
      break;
    }
    case "void": {
      // 가장 체력이 적은 적 하나를 크게
      const e = alive(s).filter((x) => dist2(x, p) < (p.stats.range * 1.6) ** 2).sort((a, b) => a.hp - b.hp || a.id - b.id)[0];
      if (e) {
        hit(s, e, dmg * S.voidMul);
        addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 18, maxTicks: 18 });
      }
      break;
    }
  }
  if (hasPerk(p, "parchment")) p.shieldPts = Math.min(p.stats.maxHp * K.parchment.max, (p.shieldPts ?? 0) + K.parchment.shield);
}

/** 잉크 탄 한 발 (각도 a만큼 돌려서) */
function inkShot(s: RunState, a: number): void {
  const p = s.player;
  const dx = p.faceX * Math.cos(a) - p.faceY * Math.sin(a);
  const dy = p.faceX * Math.sin(a) + p.faceY * Math.cos(a);
  const sp = p.stats.projectileSpeed;
  const pierce = hasPerk(p, "thickNib") ? K.thickNib.pierce : 0;
  s.projectiles.push({
    id: s.nextId++,
    fromPlayer: true,
    x: p.x + dx * 5,
    y: p.y + dy * 5,
    prevX: p.x,
    prevY: p.y,
    r: 2.5,
    vx: dx * sp,
    vy: dy * sp,
    damage: p.stats.damage,
    ticksLeft: Math.ceil(p.stats.range / sp),
    spirit: "ink",
    ...(pierce ? { pierce, hitIds: [] } : {}),
  });
}

/** 틱마다 (서기관 무기를 들었을 때 player에서) */
export function scribeTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  p.writes = (p.writes ?? 0) + 1;
  if (hasPerk(p, "shorthand")) for (const a of [-K.shorthand.spread, K.shorthand.spread]) inkShot(s, a);
  else inkShot(s, 0);
  const room = `${s.floor}/${s.roomId}`;
  const first = hasPerk(p, "preface") && p.scRoom !== room;
  p.scRoom = room;
  const every = Math.max(2, S.every - (hasPerk(p, "inkWell") ? K.inkWell.every : 0));
  if (!first && p.writes % every !== 0) return;
  const word = weaponOf(p).word ?? "blade";
  write(s, word, 1);
  if (hasPerk(p, "revision")) write(s, word, K.revision.power);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetScribe(p: PlayerState): void {
  p.writes = 0;
  delete p.scRoom;
}
