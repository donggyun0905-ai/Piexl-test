// 차원의 순례자(히든): 수많은 차원을 다니며 무기·능력·물건을 모으는 수집가. 차원 수집품 무기 20 (별 탄 · 칼 · 깃발 · 랜턴 · 냄비 · 지도 · 나침반 · 부메랑 · 새총 · 우산
// · 은방울 · 종이학 · 수정 · 태엽 폭탄 · 떨어진 별 · 씨앗 · 거울 조각 · 모래시계 · 열쇠 · 차원의 문)
// 들어 본 순례자 무기는 수집 도감에 남아 한 칸마다 공격력이 오르고, 다섯 번째 공격마다 배낭에서 도감의 다른 수집품을 꺼내 한 번 씀
// 수치는 weaponsPilgrim.PILGRIM, 아이템은 itemsPilgrim, 도감·땅·맞히기는 pgBag
import { ROOM_WIDTH, TICK_RATE } from "../constants";
import { WEAPONS, type WeaponId } from "../content";
import { PILGRIM_PERKS as K } from "../itemsPilgrim";
import { PILGRIM as P, type CurioMode } from "../weaponsPilgrim";
import { nearest } from "./brawlMoves";
import { hitE, marksTick, PG_IDS, pgRnd, placeMark, recordBook } from "./pgBag";
import { recalcStats } from "./items";
import { fan, inCircle, inCone, inLine, isBoss, shoot, stun } from "./s2Kit";
import type { PlayerState, RunState } from "./types";
import { addEffect, hasPerk, normalize, weaponOf } from "./util";

export { pilgrimBook } from "./pgBag";

/** 탄을 쏘고 방금 쏜 탄(들)을 유도로 */
function homing(s: RunState, n: number, fire: () => void): void {
  const from = s.projectiles.length;
  fire();
  for (const pr of s.projectiles.slice(from, from + n)) Object.assign(pr, { seek: true, homing: true });
}

/** 수집품 한 번 쓰기 (배낭에서 꺼낸 것도 같음) */
function use(s: RunState, mode: CurioMode, radius: number, dmg: number, range: number): void {
  const p = s.player;
  const target = nearest(s, range + 20);
  const d = target && normalize(target.x - p.x, target.y - p.y);
  if (d) [p.faceX, p.faceY] = d;
  const fx = (kind: "pgSlash" | "pgFire" | "pgBonk" | "pgPush" | "pgRing" | "pgSand", size: number) => addEffect(s, { kind, x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size, maxTicks: 14 });
  switch (mode) {
    case "star":
      shoot(s, 0, { damage: dmg, spirit: "pgStar", r: 3, range, speed: 4.5 });
      break;
    case "slash":
      for (const e of inCone(s, radius, 0.2)) hitE(s, e, dmg);
      fx("pgSlash", radius);
      break;
    case "lantern":
      for (const e of inCircle(s, p.x, p.y, radius)) hitE(s, e, dmg);
      fx("pgFire", radius);
      break;
    case "bonk":
      for (const e of inCone(s, radius, 0.4)) {
        hitE(s, e, dmg);
        stun(e, isBoss(e) ? P.bonkStun / 2 : P.bonkStun);
      }
      fx("pgBonk", radius);
      break;
    case "umbrella":
      for (const e of inCone(s, radius, 0.2)) hitE(s, e, dmg, isBoss(e) ? 0 : P.umbrellaPush);
      fx("pgPush", radius);
      break;
    case "bell":
      for (const e of inCircle(s, p.x, p.y, radius)) {
        hitE(s, e, dmg);
        stun(e, isBoss(e) ? P.bellStun / 2 : P.bellStun);
      }
      fx("pgRing", radius);
      break;
    case "sand":
      for (const e of inCircle(s, p.x, p.y, radius)) {
        hitE(s, e, dmg);
        stun(e, isBoss(e) ? P.sandStun / 3 : P.sandStun);
      }
      fx("pgSand", radius);
      break;
    case "map":
    case "prism": {
      const len = mode === "map" ? ROOM_WIDTH : range;
      for (const e of inLine(s, len, radius)) hitE(s, e, dmg);
      addEffect(s, { kind: "pgBeam", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: radius, toX: p.x + p.faceX * len, toY: p.y - 4 + p.faceY * len, maxTicks: 16, tint: mode === "map" ? "#ffe8a0" : "#6ae0ff" });
      break;
    }
    case "needle":
      homing(s, 1, () => shoot(s, 0, { damage: dmg, spirit: "pgNeedle", r: 2, range: range * 1.5, speed: 4 }));
      break;
    case "boomerang":
      shoot(s, 0, { damage: dmg, spirit: "pgBoom", r: 4, range: range * 2, speed: 4, pierce: 99 });
      break;
    case "sling":
      fan(s, 3, 0.25, { damage: dmg, spirit: "pgPebble", r: 2, range, speed: 5 });
      break;
    case "crane":
      homing(s, 3, () => fan(s, 3, 0.6, { damage: dmg, spirit: "pgCrane", r: 3, range, speed: 2.5 }));
      break;
    case "seed":
      shoot(s, 0, { damage: dmg, spirit: "pgSeed", r: 3, range, speed: 3.5 });
      break;
    case "shards":
      for (let i = 0; i < 6; i++) shoot(s, (i * Math.PI) / 3, { damage: dmg, spirit: "pgShard", r: 2, range, speed: 4.5 });
      break;
    case "flag":
    case "gate":
      if (target) placeMark(s, mode, target.x, target.y, radius, dmg, P.zoneTicks);
      break;
    case "gear":
    case "meteor":
      if (target) placeMark(s, mode, target.x, target.y, radius, dmg, mode === "gear" ? P.gearFuse : P.meteorFuse);
      break;
    case "key":
      if (!target) break;
      // 체력이 적은 보통 적은 바로 처치
      hitE(s, target, !isBoss(target) && target.hp < target.maxHp * P.keyExec ? target.hp + 1 : dmg);
      addEffect(s, { kind: "pgKey", x: target.x, y: target.y, dirX: 0, dirY: 0, size: 10, maxTicks: 16 });
      break;
  }
}

/** 지금 든 무기로 한 번 (지름길: 대시 뒤 첫 공격 두 배) */
function attack(s: RunState): void {
  const p = s.player;
  const st = weaponOf(p).curio ?? { mode: "star", radius: 0 };
  let dmg = p.stats.damage;
  if (p.pgDash) {
    delete p.pgDash;
    dmg *= K.pgShortcut.mul;
  }
  use(s, st.mode, st.radius, dmg, p.stats.range);
}

/** 배낭 뒤지기: 도감의 다른 수집품을 꺼내 한 번 씀 (두 겹 배낭: 둘 · 행운 동전: 더 셈 · 모닥불: 체력) */
function rummage(s: RunState): void {
  const p = s.player;
  const others = (p.pgBook ?? []).filter((id) => id !== p.weaponId) as WeaponId[];
  const n = Math.min(others.length, hasPerk(p, "pgDoubleBag") ? K.pgDoubleBag.n : 1);
  const mul = P.bagMul * (hasPerk(p, "pgLuckyCoin") ? K.pgLuckyCoin.mul : 1);
  for (let i = 0; i < n; i++) {
    const id = others.splice(Math.floor(pgRnd(s, "bag", i) * others.length), 1)[0]!;
    const w = WEAPONS[id] as { curio?: { mode: CurioMode; radius: number }; range: number };
    if (!w.curio) continue;
    use(s, w.curio.mode, w.curio.radius, p.stats.damage * mul, w.range);
    addEffect(s, { kind: "pgBag", x: p.x, y: p.y - 22, dirX: 0, dirY: 0, size: PG_IDS.indexOf(id), maxTicks: 30 });
  }
  if (n > 0 && hasPerk(p, "pgCampfire")) {
    p.hp = Math.min(p.stats.maxHp, p.hp + p.stats.maxHp * K.pgCampfire.heal);
    addEffect(s, { kind: "pgHeal", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 12, maxTicks: 20 });
  }
}

/** 부메랑: 반쯤 날아가면 나에게 돌아옴 (돌아올 때 다시 맞힐 수 있음) */
function boomerangs(s: RunState): void {
  const p = s.player;
  for (const pr of s.projectiles) {
    if (pr.spirit !== "pgBoom" || !pr.fromPlayer) continue;
    const half = Math.ceil(p.stats.range / 4);
    if (pr.ticksLeft === half) pr.hitIds = [];
    if (pr.ticksLeft > half) continue;
    const d = normalize(p.x - pr.x, p.y - pr.y);
    if (!d || Math.hypot(p.x - pr.x, p.y - pr.y) < 6) pr.ticksLeft = 0;
    else [pr.vx, pr.vy] = [d[0] * 4, d[1] * 4];
  }
}

/** 틱마다 (순례자 무기를 들었을 때 player에서) */
export function pilgrimTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (p.characterId !== "pilgrim") return;
  if (recordBook(p)) recalcStats(s);
  marksTick(s);
  boomerangs(s);
  if (p.dashTicks > 0 && hasPerk(p, "pgShortcut")) p.pgDash = true;
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  attack(s);
  if (hasPerk(p, "pgEcho") && pgRnd(s, "echo") < K.pgEcho.chance) attack(s);
  if (p.attackCount % (hasPerk(p, "pgRummage") ? K.pgRummage.every : P.bagEvery) === 0) rummage(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetPilgrim(p: PlayerState): void {
  for (const k of ["pgBook", "pgMarks", "pgStamps", "pgDash"] as const) delete p[k];
}
