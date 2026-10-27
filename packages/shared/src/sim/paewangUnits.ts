// 패왕전 AI 캐릭터 만들기·맞히기: 상대 = 적(kind "fighter") · 내 편 = pw.allies. 나·내 편·상대를 한 목록(Unit)으로 다룸
import { CHARACTERS, WEAPONS, type CharacterDef, type CharacterId, type WeaponDef } from "../content";
import { PW, PW_MODE } from "../paewangDefs";
import { damagePlayer } from "./combat";
import type { PwAlly, PwBrain } from "./paewangTypes";
import type { Body, EnemyState, ProjectileState, RunState } from "./types";
import { addEffect, dist2, makeEnemy } from "./util";

/** 싸우는 하나: 나 · 내 편 AI · 상대 AI */
export interface Unit {
  kind: "me" | "ally" | "foe";
  b: Body & { hp: number; hitFlash?: number; pwBy?: number };
  team: number;
  brain?: PwBrain;
  id: number;
}

/** 캐릭터의 처음 무기로 공격 방식을 정함 (근접·원거리 · 사거리 · 피해 · 빠르기) */
export function makeBrain(s: RunState, char: CharacterId, team: number, tag: number, lv?: number): PwBrain {
  const diff = PW_MODE[s.pw!.mode].diff;
  const same = s.pw!.same;
  const c = CHARACTERS[char];
  const w: WeaponDef = WEAPONS[c.startWeapon];
  const melee = w.kind === "melee" || w.range < PW.meleeRange || w.projectileSpeed <= 0;
  const rate = Math.min(PW.rateMax, Math.max(0.5, w.attackSpeed) * PW.rateBase * diff.rate);
  const shots = Math.min(3, w.shots ?? 1);
  return {
    char,
    team,
    tag,
    melee,
    range: melee ? Math.max(24, Math.min(40, w.range)) : Math.max(PW.rangeMin, Math.min(PW.rangeMax, w.range)),
    // 여러 발 쏘는 무기는 한 발 피해를 나눔 · 무한 모드 이벤트는 내 공격력 기준 (층마다 세지는 것은 받는 피해에서 combat.endlessPow)
    dmg: same ? s.player.stats.damage * w.damageMul * PW.dmgBase * (shots > 1 ? 1.6 / shots : 1) : (c.damage * w.damageMul * PW.dmgBase * diff.dmg * (shots > 1 ? 1.6 / shots : 1)) / (c.damage > 20 ? 2 : 1),
    every: Math.round(60 / rate),
    speed: c.moveSpeed * PW.moveBase * diff.speed,
    shotSpeed: Math.max(2.2, Math.min(4, w.projectileSpeed || 3)),
    shots,
    arc: melee ? Math.min(0.6, w.arcCos ?? 0.4) : 1,
    cd: 40 + (tag % 5) * 9,
    skill: PW.skillEvery / 2 + (tag % 7) * 17,
    dashCd: 0,
    dash: 0,
    dashX: 0,
    dashY: 0,
    side: tag % 2 ? 1 : -1,
    sideT: 60,
    stuck: 0,
    faceX: team === 0 ? 1 : -1,
    faceY: 0,
    swing: 0,
    goalX: 0,
    goalY: 0,
    ...(lv !== undefined ? { lv } : {}),
  };
}

/** AI 체력: 캐릭터 최대 체력 × hpBase × 보정 (거너처럼 체력이 고정된 캐릭터는 90으로 침) */
export const foeHp = (s: RunState, char: CharacterId): number => {
  // 무한 모드 이벤트: 내 최대 체력 기준
  const same = s.pw!.same;
  if (same) return Math.round(s.player.stats.maxHp * same);
  return Math.round(((CHARACTERS[char] as CharacterDef).fixedHp ? 90 : CHARACTERS[char].maxHp) * PW.hpBase * PW_MODE[s.pw!.mode].diff.hp);
};

/** 상대 AI 하나 놓기 */
export function spawnFoe(s: RunState, char: CharacterId, team: number, x: number, y: number, tag: number, lv?: number): EnemyState {
  const e = makeEnemy(s, "fighter", x, y, 1, 0);
  e.hp = e.maxHp = foeHp(s, char);
  e.pw = makeBrain(s, char, team, tag, lv);
  e.dirX = e.pw.faceX;
  s.enemies.push(e);
  addEffect(s, { kind: "burst", x, y, dirX: 0, dirY: 0, size: 14, maxTicks: 14 });
  return e;
}

/** 내 편 AI 하나 놓기 */
export function spawnAlly(s: RunState, char: CharacterId, x: number, y: number, tag: number): PwAlly {
  const hp = foeHp(s, char);
  const a: PwAlly = { id: s.nextId++, x, y, prevX: x, prevY: y, r: 6, hp, maxHp: hp, hitFlash: 0, pw: makeBrain(s, char, 0, tag) };
  s.pw!.allies.push(a);
  return a;
}

/** 지금 싸우는 모두 (쓰러진 사람 빼고) */
export function units(s: RunState): Unit[] {
  const pw = s.pw!;
  const out: Unit[] = [];
  if (!pw.down && s.player.hp > 0) out.push({ kind: "me", b: s.player, team: 0, id: 0 });
  for (const a of pw.allies) if (a.hp > 0) out.push({ kind: "ally", b: a, team: 0, brain: a.pw, id: a.id });
  for (const e of s.enemies) if (e.pw && e.hp > 0) out.push({ kind: "foe", b: e, team: e.pw.team, brain: e.pw, id: e.id });
  return out;
}

/** AI(by)가 하나를 맞힘. melee: 대시 중인 나는 피함 */
export function hurt(s: RunState, by: number, u: Unit, dmg: number): void {
  if (u.kind === "me") {
    damagePlayer(s, dmg);
    return;
  }
  u.b.hp -= dmg;
  u.b.hitFlash = 6;
  u.b.pwBy = by;
}

/** AI가 쏜 탄 하나 */
export function fireShot(s: RunState, u: Unit, dx: number, dy: number, dmg: number): void {
  const br = u.brain!;
  const pr: ProjectileState = {
    id: s.nextId++,
    fromPlayer: false,
    x: u.b.x,
    y: u.b.y,
    prevX: u.b.x,
    prevY: u.b.y,
    r: 3,
    vx: dx * br.shotSpeed,
    vy: dy * br.shotSpeed,
    damage: dmg,
    ticksLeft: Math.ceil((br.range * 1.35) / br.shotSpeed),
    pwBy: u.id,
    pwTeam: u.team,
  };
  s.projectiles.push(pr);
}

/** AI 탄이 내 편·다른 AI에 닿음 (나에게 닿는 것은 투사체 계산이 이미 처리) */
export function resolveShots(s: RunState, list: Unit[]): void {
  s.projectiles = s.projectiles.filter((pr) => {
    if (pr.pwTeam === undefined || pr.fromPlayer) return true;
    for (const u of list) {
      if (u.kind === "me" || u.team === pr.pwTeam || u.id === pr.pwBy || u.b.hp <= 0) continue;
      const rr = u.b.r + pr.r;
      if (dist2(u.b, pr) < rr * rr) {
        hurt(s, pr.pwBy ?? 0, u, pr.damage);
        return false;
      }
    }
    return true;
  });
}
