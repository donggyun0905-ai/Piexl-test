// 운명의 여행자 능력: 운명이 이어지는 동안 돕는 힘 (배 · 병사 · 바람 · 방패 · 회복 · 세이렌 · 거인의 바위 · 파도 · 소용돌이 · 금 · 충견 · 번개 · 돼지 마법 · 섬 · 올빼미 · 목마 · 로토스 · 헤르메스 · 망령 · 태양)
// 운명 붙잡기면 바로 전 운명의 능력도 같이. 빠른 걸음(swift)은 voyager.voyagerMoveMul, 올빼미(owl)는 쏠 때 배율
import { ROOM_WIDTH } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { FATES, type AbilityKind } from "../voyagerFates";
import { addGold, blastAt, healPlayer } from "./combat";
import { nearest } from "./brawlMoves";
import { rot } from "./orbit";
import { alive, inCircle, isBoss, strike, stun } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, keepInRoom, normalize, roomGrid } from "./util";
import { drop } from "./voyagerSkills";
import { raiseShield } from "./imugiMods";

/** 지금 켜진 능력 값 (지금 운명 · 붙잡은 운명 중 그 종류, 없으면 null) */
export function abilityVal(s: RunState, kind: AbilityKind): number | null {
  const p = s.player;
  let v: number | null = null;
  for (const f of [p.vyFate, p.vyPrev]) {
    const a = f && FATES[f.i]!.ability;
    if (a?.[0] === kind) v = Math.max(v ?? 0, a[1]);
  }
  return v;
}

const rnd = (s: RunState, tag: string) => createRng(deriveSeed(s.seed, "vyAb", tag, s.tick)).nextFloat();

/** 다음까지 기다리는 틱 */
const CD: Partial<Record<AbilityKind, number>> = { ship: 240, soldiers: 90, wind: 180, shield: 300, regen: 60, siren: 360, boulder: 180, wave: 300, whirl: 30, dog: 40, bolt: 120, pig: 240, calypso: 600, horse: 600, sun: 120 };

/** 보조 탄 하나 (나에게서 dx, dy 쪽으로) */
function bolt(s: RunState, x: number, y: number, dx: number, dy: number, dmg: number, spirit: "vySpear" | "vyShade" | "vyShip", r: number, speed: number, ticks: number, extra: object = {}): void {
  s.projectiles.push({ id: s.nextId++, fromPlayer: true, x, y, prevX: x, prevY: y, r, vx: dx * speed, vy: dy * speed, damage: dmg, ticksLeft: ticks, spirit, pierce: 99, hitIds: [], ...extra });
}

/** 능력 한 번 (v: 세기) */
function act(s: RunState, kind: AbilityKind, v: number): void {
  const p = s.player;
  const dmg = p.stats.damage;
  switch (kind) {
    case "ship": {
      // 방 한쪽 끝에서 배가 들어와 적이 있는 줄을 가로지름
      const foes = alive(s);
      const y = foes[Math.floor(rnd(s, "ship") * foes.length)]?.y ?? p.y;
      const dir = rnd(s, "shipDir") < 0.5 ? 1 : -1;
      bolt(s, dir > 0 ? 0 : ROOM_WIDTH, y, dir, 0, dmg * v, "vyShip", 12, 2.6, Math.ceil(ROOM_WIDTH / 2.6));
      break;
    }
    case "soldiers":
      for (let i = 0; i < v; i++) {
        const e = alive(s)[i];
        const d = e ? normalize(e.x - p.x, e.y - p.y) : rot((i * Math.PI * 2) / v);
        if (d) bolt(s, p.x, p.y, d[0], d[1], dmg * 0.8, "vySpear", 3, 4.5, 50);
      }
      break;
    case "wind":
      for (const e of alive(s)) {
        const d = normalize(e.x - p.x, e.y - p.y);
        if (!d || isBoss(e)) continue;
        e.x += d[0] * v;
        e.y += d[1] * v;
        keepInRoom(e, roomGrid(s));
        strike(s, e, dmg * 0.3);
      }
      addEffect(s, { kind: "vyWind", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 120, maxTicks: 24 });
      break;
    case "shield":
      raiseShield(p, v, v * 3);
      addEffect(s, { kind: "vyShield", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 16, maxTicks: 24 });
      break;
    case "regen":
      healPlayer(s, v);
      break;
    case "siren":
      for (const e of alive(s)) stun(e, 30 + 60 * v);
      addEffect(s, { kind: "vySiren", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 140, maxTicks: 40 });
      break;
    case "boulder": {
      const e = alive(s)[Math.floor(rnd(s, "rock") * alive(s).length)];
      if (e) drop(s, e.x, e.y, 30, 26, dmg * v, "boulder");
      break;
    }
    case "wave":
      for (const e of alive(s)) strike(s, e, dmg * v, 16);
      addEffect(s, { kind: "vyTide", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: 200, maxTicks: 30 });
      break;
    case "whirl":
      for (const e of inCircle(s, p.x, p.y, 90)) {
        const d = normalize(p.x - e.x, p.y - e.y);
        if (d && !isBoss(e)) {
          e.x += d[0] * 8;
          e.y += d[1] * 8;
        }
        strike(s, e, dmg * v);
      }
      addEffect(s, { kind: "vyWhirl", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 90, maxTicks: 30 });
      break;
    case "dog": {
      const e = nearest(s, 80);
      if (!e) break;
      strike(s, e, dmg * v);
      addEffect(s, { kind: "vyBite", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 4, maxTicks: 14 });
      break;
    }
    case "bolt": {
      const foes = alive(s);
      const e = foes[Math.floor(rnd(s, "bolt") * foes.length)];
      if (!e) break;
      strike(s, e, dmg * v);
      addEffect(s, { kind: "vyBolt", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 4, maxTicks: 16 });
      break;
    }
    case "pig": {
      const e = nearest(s, 200, (f) => !isBoss(f));
      if (!e) break;
      stun(e, 180);
      e.vyShredT = s.tick + 300;
      e.vyShred = 1;
      addEffect(s, { kind: "vyPig", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 4, maxTicks: 40 });
      break;
    }
    case "calypso":
      p.invulnTicks = Math.max(p.invulnTicks, 90 * v);
      addEffect(s, { kind: "vyIsland", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 24, maxTicks: 90 });
      break;
    case "horse":
      drop(s, p.x, p.y, 60, 50, dmg * 4 * v, "horse");
      break;
    case "sun":
      blastAt(s, p.x, p.y, 60, dmg * v);
      addEffect(s, { kind: "vySun", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 60, maxTicks: 20 });
      break;
    case "gods":
      act(s, "bolt", 2 * v);
      if (s.tick % 3 === 0) act(s, "ship", 3 * v);
      if (s.tick % 2 === 0) act(s, "shield", 30 * v);
      break;
    default:
      break;
  }
}

/** 틱마다: 능력마다 기다렸다가 한 번 · 늘 켜진 것(로토스·헤르메스·금·망령) */
export function abilityTick(s: RunState): void {
  const p = s.player;
  const cd = (p.vyCd ??= {});
  const fresh = s.kills - (p.vySeen ?? s.kills);
  p.vySeen = s.kills;
  for (const f of [p.vyFate, p.vyPrev]) {
    if (!f) continue;
    const [kind, v] = FATES[f.i]!.ability;
    if (kind === "lotus") for (const e of inCircle(s, p.x, p.y, 90)) e.slowTicks = Math.max(e.slowTicks ?? 0, 10);
    if (kind === "hermes" && p.dashCooldown > 0) p.dashCooldown = Math.max(0, p.dashCooldown - v);
    if (kind === "gold" && fresh > 0) addGold(s, fresh * v);
    if (kind === "shade") for (let i = 0; i < fresh * v; i++) {
      const [dx, dy] = rot(rnd(s, `shade${i}`) * Math.PI * 2);
      bolt(s, p.x, p.y, dx, dy, p.stats.damage * 1.2, "vyShade", 4, 2.5, 120, { seek: true, homing: true });
    }
    const wait = CD[kind] ?? (kind === "gods" ? 150 : 0);
    if (!wait) continue;
    const key = f === p.vyFate ? kind : `prev:${kind}`;
    cd[key] = (cd[key] ?? Math.floor(wait / 2)) - 1;
    if (cd[key] > 0) continue;
    cd[key] = wait;
    act(s, kind, v);
  }
}
