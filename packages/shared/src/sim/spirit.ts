// 정령사(비르디아): 본인은 매직 미사일만, 곁의 작은 정령 셋과 대정령(무기)이 싸움
// 작은 정령은 30초마다 가장 오래된 하나가 떠나고 열두 종류 중 무작위(시드)로 새 정령이 옴. 대정령 공격은 spiritGreat
// 수치는 weaponsSpirit.SPIRIT, 아이템은 itemsSpirit
import { srcRun } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import { SPIRIT_PERKS as K } from "../itemsSpirit";
import { createRng, deriveSeed } from "../rng";
import { SMALL_SPIRITS, SPIRIT as P, type SmallSpirit } from "../weaponsSpirit";
import { blastAt, healPlayer, ignite } from "./combat";
import { alive, fan, inCircle, poison, root, stun, strike } from "./s2Kit";
import { greatTick, harmonyMul } from "./spiritGreat";
import type { PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, keepInRoom, roomGrid, weaponOf } from "./util";
import { raiseShield } from "./imugiMods";

/** 정령 빛깔 (효과 · 그리기) */
export const SPIRIT_TINT: Record<SmallSpirit, string> = {
  steel: "#c8d0e0", gravity: "#8a6aff", furnace: "#ff7a2a", vein: "#6ad8ff", shadow: "#4a3a6a", steelThread: "#e8e8f8",
  miasma: "#9a5ac8", void: "#2a1a3a", worldTree: "#7ae05a", thornVine: "#3a8a2a", spore: "#c8b86a", earth: "#a87a4a",
};

const maxSmall = (p: PlayerState) => P.small + (hasPerk(p, "spBond") ? K.spBond.extra : 0);

/** 곁의 정령 자리 (i번째, 몸 둘레를 돎) */
export function spiritSpot(p: PlayerState, i: number, n: number, tick: number): { x: number; y: number } {
  const a = tick * 0.04 + (i * Math.PI * 2) / Math.max(1, n);
  return { x: p.x + Math.cos(a) * 12, y: p.y - 6 + Math.sin(a) * 6 };
}

/** 새 작은 정령 하나 (시드로 고름) */
function summon(s: RunState): void {
  const p = s.player;
  p.spCount = (p.spCount ?? 0) + 1;
  const rng = createRng(deriveSeed(s.seed, "spirit", p.spCount));
  (p.spirits ??= []).push({ kind: rng.pick(SMALL_SPIRITS), cd: rng.int(0, P.smallEvery) });
  if (hasPerk(p, "spShield")) raiseShield(p, K.spShield.shield, p.stats.maxHp * K.spShield.max);
  addEffect(s, { kind: "ring", x: p.x, y: p.y - 6, dirX: 0, dirY: 0, size: 10, maxTicks: 14, width: 1 });
}

/** 작은 정령 한 번 공격 */
function smallAttack(s: RunState, kind: SmallSpirit, from: { x: number; y: number }): boolean {
  const p = s.player;
  const list = alive(s)
    .filter((e) => dist2(e, p) <= P.smallRange ** 2)
    .sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id);
  const e = list[0];
  if (!e) return false;
  const dmg = p.stats.damage * P.smallMul * (hasPerk(p, "spFury") ? K.spFury.mul : 1) * harmonyMul(p);
  addEffect(s, { kind: "spBeam", x: from.x, y: from.y, dirX: 0, dirY: 0, size: 1, toX: e.x, toY: e.y, maxTicks: 10, tint: SPIRIT_TINT[kind] });
  switch (kind) {
    case "gravity":
      strike(s, e, dmg);
      for (const t of inCircle(s, e.x, e.y, 24)) {
        if (t === e || t.kind === "dummy") continue;
        const d = Math.hypot(e.x - t.x, e.y - t.y) || 1;
        t.x += ((e.x - t.x) / d) * 5;
        t.y += ((e.y - t.y) / d) * 5;
        keepInRoom(t, roomGrid(s));
      }
      break;
    case "furnace":
      strike(s, e, dmg);
      ignite(e, dmg);
      break;
    case "vein":
      strike(s, e, dmg);
      if (list[1]) strike(s, list[1], dmg);
      break;
    case "shadow":
      strike(s, e, dmg * 1.5);
      break;
    case "steelThread":
      strike(s, e, dmg);
      if (e.kind !== "dummy") e.slowTicks = Math.max(e.slowTicks ?? 0, 60);
      break;
    case "miasma":
      strike(s, e, dmg);
      poison(e, dmg * 0.4, 150);
      break;
    case "void":
      blastAt(s, e.x, e.y, 14, dmg, { still: true });
      break;
    case "worldTree":
      strike(s, e, dmg);
      healPlayer(s, 1);
      break;
    case "thornVine":
      strike(s, e, dmg);
      root(e, 30);
      break;
    case "spore":
      blastAt(s, e.x, e.y, 18, dmg * 0.6, { still: true });
      for (const t of inCircle(s, e.x, e.y, 18)) poison(t, dmg * 0.3, 120);
      break;
    case "earth":
      strike(s, e, dmg);
      stun(e, 20);
      break;
    default:
      strike(s, e, dmg);
  }
  return true;
}

/** 작은 정령들 한 틱: 바뀌기 · 공격 */
function smallTick(s: RunState): void {
  const p = s.player;
  // 방이 바뀌어도 정령은 그대로, 비어 있으면 채움
  while ((p.spirits?.length ?? 0) < maxSmall(p)) summon(s);
  p.spSwap = (p.spSwap ?? 0) + 1;
  // 패왕전은 정령이 바뀌지 않음 (예측할 수 있게)
  if (p.spSwap >= (hasPerk(p, "spLonger") ? K.spLonger.ticks : P.swapTicks) && !s.pvp) {
    p.spSwap = 0;
    const gone = p.spirits?.shift();
    if (gone && hasPerk(p, "spFarewell")) srcRun(s, "spFarewell", () => {
      const at = spiritSpot(p, 0, maxSmall(p), s.tick);
      blastAt(s, at.x, at.y, K.spFarewell.r, p.stats.damage * K.spFarewell.mul);
    });
    summon(s);
  }
  const list = p.spirits ?? [];
  const haste = weaponOf(p).great === "chronoSpire" ? P.chronoHaste : 1;
  list.forEach((sp, i) => {
    if (sp.cd > 0) {
      sp.cd--;
      return;
    }
    if (smallAttack(s, sp.kind, spiritSpot(p, i, list.length, s.tick))) sp.cd = Math.round(P.smallEvery * haste);
  });
}

/** 틱마다 (대정령을 들었을 때 player에서) */
export function spiritTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  smallTick(s);
  greatTick(s);
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  // 매직 미사일: 약하고 가까운 적을 따라감
  const n = hasPerk(p, "spMissile") ? 2 : 1;
  fan(s, n, 0.25, { damage: p.stats.damage * P.missileMul, spirit: "magicMissile", r: 2, range: p.stats.range });
  for (const pr of s.projectiles.slice(-n)) pr.homing = true;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetSpirit(p: PlayerState): void {
  for (const k of ["spirits", "spSwap", "spCount", "spGreat", "spDrops", "spGas", "spCharge"] as const) delete p[k];
}
