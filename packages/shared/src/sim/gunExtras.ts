// 거너 부가 기능: 드론(10마리 처치마다 +1)·지원 드론 · 건 마스터 유령 총 · 출혈 · 특수용병 4단 콤보·텀 보호막 · 수류탄 던지기
import { TICK_RATE } from "../constants";
import { WEAPONS, type WeaponDef } from "../content";
import { dashTo, lunge, strike } from "./brawlMoves";
import { damageEnemy } from "./combat";
import { bullet, fan, roll, shootPattern, SUPPORT_CHANCE, SUPPORT_TICKS } from "./gun";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, DIR16, dist2, hasPerk, markDot, normalize, weaponOf } from "./util";
import { pctHp } from "./pctHp";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 드론: 처치 이만큼마다 +1 · 도는 반경 · 찾는 거리 · 지원 드론 피해 배율·간격 */
  KILLS_PER_DRONE: 10,
  /** 드론 무기 드론 최대 수 */
  DRONE_MAX: 5,
  DRONE_RING: 16,
  DRONE_SEEK: 110,
  SUPPORT_MUL: 0.4,
  SUPPORT_EVERY: 30,
  /** 지원 드론 최대 수 · 드론 무기 한 발 피해: 드론 1대일 때 공격력의 2/8, 1대 늘 때마다 +1/8, 7대부터 그대로 */
  SUPPORT_MAX: 5,
  DRONE_DMG_STEPS: 8,
  /** 출혈: 3초, 0.5초마다 적 최대 체력의 1% */
  BLEED_TICKS: 180,
  BLEED_RATE: 0.01,
  /** 허수아비(체력 99999)는 체력 100짜리처럼 출혈 피해 (연습장에서 출혈 숫자가 보이게) */
  DUMMY_BLEED_HP: 100,
  /** 특수용병: 콤보가 끊기는 쉰 틱 · 돌진 거리 · 찌르기 · 반동으로 물러나는 거리 · 수류탄 배율 */
  MERC_RESET: 60,
  MERC_DASH: 30,
  MERC_STAB: 1.5,
  MERC_RECOIL: 30,
  MERC_GRENADE: 2.5,
  /** 특수용병 보호막: 콤보 사이 텀에 스페이스(대시)를 누르면 생기는 양 · 남는 틱 */
  MERC_SHIELD: 20,
  MERC_SHIELD_TICKS: 60,
  /** NOW! 순간: 다음 콤보 단계가 나가기 전 이만큼 (0.3초) */
  MERC_NOW: 18,
};
export { R as GUN_EXTRAS_RULES };

/** 수류탄: 날아가는 틱 */
export const GRENADE_FLY = 30;

/** 지금 드론 수: 드론 무기면 1대 + 처치 10마리마다 1대 (최대 5대), 지원 드론은 따로 */
export function droneCount(s: RunState): number {
  const p = s.player;
  if (weaponOf(p).gun !== "drone") return 0;
  return Math.min(R.DRONE_MAX, 1 + Math.floor(Math.max(0, s.kills - (p.droneKillBase ?? s.kills)) / R.KILLS_PER_DRONE));
}

/** 드론 자리 (드론 무기 드론 다음에 지원 드론). 그리기도 같은 함수를 씀 */
export function dronePositions(s: RunState, cx: number, cy: number): { x: number; y: number; support: boolean }[] {
  const own = droneCount(s);
  const n = own + (s.player.support?.length ?? 0);
  const out: { x: number; y: number; support: boolean }[] = [];
  for (let i = 0; i < n; i++) {
    const d = DIR16[(Math.floor(s.tick / 5) + Math.floor((i * 16) / n)) % 16]!;
    const ring = R.DRONE_RING + (i >= own ? 6 : 0);
    out.push({ x: cx + d[0] * ring, y: cy + d[1] * ring - 4, support: i >= own });
  }
  return out;
}

/** 틱마다: 드론이 가까운 적에게 쏨 · 지원 드론 시간 줄이기 */
export function droneStep(s: RunState): void {
  const p = s.player;
  if (weaponOf(p).gun === "drone" && p.droneKillBase === undefined) p.droneKillBase = s.kills;
  p.support = (p.support ?? []).map((t) => t - 1).filter((t) => t > 0);
  const spots = dronePositions(s, p.x, p.y);
  const own = droneCount(s);
  const cd = p.droneCd ?? [];
  while (cd.length < spots.length) cd.push(0);
  cd.length = spots.length;
  const every = Math.max(1, Math.round(TICK_RATE / p.stats.attackSpeed));
  let added = 0;
  spots.forEach((d, i) => {
    if (cd[i]! > 0) {
      cd[i]!--;
      return;
    }
    const t = nearest(s, d.x, d.y, R.DRONE_SEEK);
    if (!t) return;
    const dir = normalize(t.x - d.x, t.y - d.y) ?? [1, 0];
    // 지원 드론 탄은 치명타 없음
    if (d.support) bullet(s, d.x, d.y, dir[0], dir[1], p.stats.damage * R.SUPPORT_MUL, { ticksLeft: 40 }, 4, false);
    else bullet(s, d.x, d.y, dir[0], dir[1], (p.stats.damage * Math.min(R.DRONE_DMG_STEPS, own + 1)) / R.DRONE_DMG_STEPS, { ticksLeft: 40 }, 4);
    cd[i] = d.support ? R.SUPPORT_EVERY : every;
    // 지원사격: 드론 무기는 본인이 쏘지 않으므로 드론이 쏠 때 지원 드론이 붙음 (지원 드론이 쏠 때는 안 붙음)
    if (!d.support && hasPerk(p, "supportFire") && roll(s, "droneSupport", s.nextId) < SUPPORT_CHANCE) added++;
  });
  p.droneCd = cd;
  addSupport(p, added);
}

/** 지원 드론 n대 추가 (최대 5대) */
export function addSupport(p: PlayerState, n: number, ticks = SUPPORT_TICKS): void {
  const now = p.support ?? [];
  p.support = [...now, ...Array<number>(Math.max(0, Math.min(n, R.SUPPORT_MAX - now.length))).fill(ticks)];
}

function nearest(s: RunState, x: number, y: number, range: number): EnemyState | null {
  const at = { x, y, prevX: x, prevY: y, r: 0 };
  let best: EnemyState | null = null;
  for (const e of s.enemies) {
    if (e.hp <= 0 || e.immune || dist2(e, at) > range * range) continue;
    if (!best || dist2(e, at) < dist2(best, at)) best = e;
  }
  return best;
}

/** 건 마스터: 이번 판에 가져 본 다른 총 하나가 옆에 나타나 한 번 쏘고 사라짐 */
export function ghostFire(s: RunState): void {
  const p = s.player;
  const others = (p.gunsOwned ?? []).filter((id) => id !== p.weaponId && WEAPONS[id].kind === "gun");
  if (others.length === 0) return;
  const w: WeaponDef = WEAPONS[others[Math.floor(roll(s, "ghostGun") * others.length)]!];
  const side = roll(s, "ghostSide") < 0.5 ? 1 : -1;
  const x = p.x - p.faceY * 12 * side;
  const y = p.y + p.faceX * 12 * side;
  const dmg = (p.stats.damage / weaponOf(p).damageMul) * w.damageMul;
  addEffect(s, { kind: "ghostgun", x, y, dirX: p.faceX, dirY: p.faceY, size: 4, maxTicks: 14 });
  if (w.gun === "drone") addSupport(p, 1, 180);
  else if (w.gun === "merc") bullet(s, x, y, p.faceX, p.faceY, dmg);
  else shootPattern(s, w, x, y, dmg);
}

/** 출혈 걸기 (맞을 때마다 3초로) · 틱마다 0.5초마다 피해 */
export function applyBleed(e: EnemyState): void {
  e.bleedTicks = R.BLEED_TICKS;
}

export function updateBleed(s: RunState): void {
  const pulse = s.tick % 30 === 0;
  for (const e of s.enemies) {
    if ((e.bleedTicks ?? 0) <= 0) continue;
    e.bleedTicks = (e.bleedTicks ?? 0) - 1;
    if (pulse && e.hp > 0) {
      const before = e.hp;
      damageEnemy(s, e, (e.kind === "dummy" ? R.DUMMY_BLEED_HP : pctHp(e)) * R.BLEED_RATE, 0, 0);
      markDot(s, e, "bleed", before - e.hp);
    }
  }
}

/** 특수용병 콤보: 권총 쏘며 돌진 → 앞 찌르기 → 샷건 + 반동으로 물러나기 → 수류탄 마무리 */
export function mercStep(s: RunState, dmg: number): void {
  const p = s.player;
  if (s.tick - (p.gunIdle ?? s.tick) > R.MERC_RESET) p.gunStep = 0;
  p.gunIdle = s.tick;
  const step = p.gunStep ?? 0;
  const mx = p.x + p.faceX * (p.r + 2);
  const my = p.y + p.faceY * (p.r + 2);
  if (step === 0) {
    dashTo(s, R.MERC_DASH, 24);
    for (const [dx, dy] of fan(p.faceX, p.faceY, 3, [0.9962, 0.0872])) bullet(s, p.x, p.y, dx, dy, dmg * 0.8);
  } else if (step === 1) {
    strike(s, dmg * R.MERC_STAB, { kind: "strike", mul: R.MERC_STAB, range: 24, arc: 0.5 }, p.faceX, p.faceY);
  } else if (step === 2) {
    for (const [dx, dy] of fan(p.faceX, p.faceY, 5)) bullet(s, mx, my, dx, dy, dmg * 0.5);
    lunge(s, R.MERC_RECOIL, -p.faceX, -p.faceY);
  } else {
    throwGrenade(s, dmg * R.MERC_GRENADE);
  }
  p.gunStep = (step + 1) % 4;
}

/** 특수용병: 지금이 NOW! 순간인지 = 콤보 중이고 다음 단계가 나가기 직전 0.3초 (공격을 쉬고 있으면 콤보가 끊길 때까지) */
export function mercGuardOpen(s: RunState): boolean {
  const p = s.player;
  if (!mercCombo(s) || p.mercGuardAt === p.gunIdle) return false;
  return p.attackCooldown <= R.MERC_NOW;
}

/** 특수용병 콤보가 이어지는 중 (마지막 단계 뒤 1초 안) */
function mercCombo(s: RunState): boolean {
  const p = s.player;
  if (p.gunIdle === undefined || weaponOf(p).gun !== "merc") return false;
  const gap = s.tick - p.gunIdle;
  return gap >= 0 && gap <= R.MERC_RESET;
}

/** 특수용병 보호막 (컨트롤): NOW! 순간에 스페이스를 새로 누르면 대시 대신 보호막 20 (텀마다 한 번, 1초 뒤 남은 만큼 사라짐).
 * NOW!가 아닐 때 누르면 대시가 나가고 가진 보호막이 바로 사라지며, 콤보 중이면 그 텀의 기회도 날아감. 대시를 막았으면 true */
export function mercGuard(s: RunState, pressed: boolean): boolean {
  const p = s.player;
  const fresh = pressed && !p.mercPress;
  p.mercPress = pressed;
  if (!pressed) p.mercHold = false;
  if ((p.mercShieldTicks ?? 0) > 0 && --p.mercShieldTicks! === 0) dropMercShield(p, true);
  const open = mercGuardOpen(s);
  if (fresh && !open) {
    dropMercShield(p);
    if (mercCombo(s)) p.mercGuardAt = p.gunIdle;
    return false;
  }
  // NOW! 동안이나 보호막을 받은 그 누름을 떼기 전까지는 대시가 나가지 않음
  if (!fresh) return pressed && (p.mercHold === true || open);
  p.mercHold = true;
  p.mercGuardAt = p.gunIdle;
  // 소리용: 성공 횟수 · 몇 번째 콤보 뒤였는지 (1 팅 · 2 탕 · 3과 마무리 뒤 펑)
  p.mercGuards = (p.mercGuards ?? 0) + 1;
  p.mercGuardStep = p.gunStep ?? 0;
  p.shieldPts = Math.max(p.shieldPts ?? 0, R.MERC_SHIELD);
  p.mercShieldTicks = R.MERC_SHIELD_TICKS;
  addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 12, maxTicks: 12 });
  return true;
}

/** 특수용병 보호막을 거둠 (다른 보호막은 그대로 두려고 이 무기가 준 만큼만) */
function dropMercShield(p: PlayerState, expired = false): void {
  if (!expired && (p.mercShieldTicks ?? 0) <= 0) return;
  p.shieldPts = Math.max(0, (p.shieldPts ?? 0) - R.MERC_SHIELD);
  p.mercShieldTicks = 0;
}

/** 수류탄: 겨눈 곳(자동 공격이면 가장 가까운 적, 사거리까지)으로 던져 잠시 뒤 큰 폭발 */
export function throwGrenade(s: RunState, dmg: number): void {
  const p = s.player;
  const radius = weaponOf(p).blast ?? 40;
  const t = nearest(s, p.x, p.y, p.stats.range);
  const dist = t ? Math.sqrt(dist2(t, p)) : (p.aimDist ?? p.stats.range);
  const d = Math.min(p.stats.range, dist);
  const x = p.x + p.faceX * d;
  const y = p.y + p.faceY * d;
  s.pendingBlasts.push({ tick: s.tick + GRENADE_FLY, x, y, radius, damage: dmg });
  addEffect(s, { kind: "lob", x: p.x, y: p.y, dirX: 0, dirY: 0, size: radius, maxTicks: GRENADE_FLY, toX: x, toY: y });
}

/** 거너: 드론 무기를 들었는지 (그리기용) */
export function hasDrones(p: PlayerState): boolean {
  return weaponOf(p).gun === "drone" || (p.support?.length ?? 0) > 0 || hasPerk(p, "supportFire");
}
