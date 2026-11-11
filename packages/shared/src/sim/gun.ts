// 거너 총: 탄창·장전(샷건은 쏘면서 한 발씩) · 미니건 예열 · 고장(폐급) · 치명타 · 쏘는 모양(권총·저격·샷건·총검·쌍권총·기관단총·미니건)
// 드론·지원 드론·건 마스터·출혈·특수용병 콤보·수류탄은 gunExtras
import { srcRun } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import type { WeaponDef } from "../content";
import { createRng, deriveSeed } from "../rng";
import { blastAt } from "./combat";
import { strike } from "./brawlMoves";
import { addSupport, droneStep, ghostFire, mercStep, throwGrenade, updateBleed } from "./gunExtras";
import type { PlayerState, ProjectileState, RunState } from "./types";
import { DASH_TICKS, hasPerk, weaponOf } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  IDLE_RELOAD: 60,
  /** 기관단총(쏘는 동안)·미니건(예열 중) 이동 속도 배율, 쏘는 중으로 보는 틱 */
  SMG_MOVE: 0.65,
  MINIGUN_MOVE: 0.5,
  FIRING_TICKS: 12,
  /** 치명타: 기본 확률·배율, 화력 집중·특급·폐급 */
  CRIT_BASE: 0.05,
  CRIT_MUL: 1.5,
  FOCUS_CRIT: 0.3,
  FOCUS_MUL: 0.2,
  ELITE_CRIT: 0.2,
  /** 특급 장전 10% 빠르게 · 연발 장전 2배 · 폐급 고장 확률·시간 · 지원 사격 확률·시간 */
  ELITE_RELOAD: 0.9,
  RAPID_RELOAD: 0.5,
  JAM_CHANCE: 0.02,
  JAM_TICKS: 180,
  GHOST_CHANCE: 0.3,
  /** 총검: 찌르기 범위·대시 범위 · 쌍권총 두 총구 간격 */
  STAB_RANGE: 22,
  BAYONET_DASH: 28,
  DUAL_GAP: 4,
};
export { R as GUN_RULES };

/** 미니건 예열 (2초) · 쏜 뒤 이만큼 안 쏘면 남은 탄을 채우기 시작 (1초) */
export const SPIN_FULL = 120;
export const SUPPORT_CHANCE = 0.3;
export const SUPPORT_TICKS = 180;

export const roll = (s: RunState, ...labels: (string | number)[]) => createRng(deriveSeed(s.seed, ...labels, s.tick)).nextFloat();

/** 장전에 걸리는 틱 (아이템 반영) */
export function reloadTicksOf(p: PlayerState, w: WeaponDef = weaponOf(p)): number {
  let t = w.reload ?? 0;
  if (hasPerk(p, "elite")) t *= R.ELITE_RELOAD;
  if (hasPerk(p, "rapidFire")) t *= R.RAPID_RELOAD;
  return Math.max(1, Math.round(t));
}

/** 기관단총·미니건을 쏘는 동안 이동 속도 배율 */
export function gunMoveMul(p: PlayerState, tick: number): number {
  const g = weaponOf(p).gun;
  if (g === "minigun" && (p.spin ?? 0) > 0) return R.MINIGUN_MOVE;
  if (g === "smg" && tick - (p.shotTick ?? -999) < R.FIRING_TICKS) return R.SMG_MOVE;
  return 1;
}

/** 거너 총알 치명타: 확률 · 배율 (아이템 반영) */
export function gunCrit(p: PlayerState): { chance: number; mul: number } {
  return {
    chance: hasPerk(p, "scrapGun") ? 1 : R.CRIT_BASE + (hasPerk(p, "focusFire") ? R.FOCUS_CRIT : 0) + (hasPerk(p, "elite") ? R.ELITE_CRIT : 0),
    mul: R.CRIT_MUL + (hasPerk(p, "focusFire") ? R.FOCUS_MUL : 0),
  };
}

/** 탄 하나 (치명타·출혈 반영, canCrit = false면 치명타 없음) */
export function bullet(s: RunState, x: number, y: number, dx: number, dy: number, dmg: number, opt: Partial<ProjectileState> = {}, speed = s.player.stats.projectileSpeed, canCrit = true): void {
  const p = s.player;
  const c = gunCrit(p);
  const crit = canCrit && roll(s, "crit", s.nextId) < c.chance;
  const mul = crit ? c.mul : 1;
  s.projectiles.push({
    id: s.nextId++,
    fromPlayer: true,
    x,
    y,
    prevX: x,
    prevY: y,
    r: 1.5,
    vx: dx * speed,
    vy: dy * speed,
    damage: dmg * mul,
    ticksLeft: Math.ceil(p.stats.range / speed),
    spirit: "bullet",
    ...(crit ? { crit } : {}),
    ...(hasPerk(p, "bleed") ? { bleed: true } : {}),
    ...opt,
  });
}

/** 부채꼴 방향 (가운데 + 양옆으로 spread씩) */
export function fan(dx: number, dy: number, shots: number, spread: readonly [number, number] = [0.9848, 0.1736]): [number, number][] {
  const out: [number, number][] = [[dx, dy]];
  let l: [number, number] = [dx, dy];
  let r: [number, number] = [dx, dy];
  const [c, sn] = spread;
  for (let i = 0; i < (shots - 1) / 2; i++) {
    l = [l[0] * c - l[1] * sn, l[0] * sn + l[1] * c];
    r = [r[0] * c + r[1] * sn, -r[0] * sn + r[1] * c];
    out.push(l, r);
  }
  return out;
}

/** 무기 하나의 기본 쏘기 모양 (건 마스터 유령 총도 같이 씀). x·y = 총구 */
export function shootPattern(s: RunState, w: WeaponDef, x: number, y: number, dmg: number): void {
  const p = s.player;
  const fx = p.faceX;
  const fy = p.faceY;
  const speed = p.stats.projectileSpeed * (w.projectileSpeed / Math.max(0.1, weaponOf(p).projectileSpeed));
  if (w.gun === "shotgun") for (const [dx, dy] of fan(fx, fy, w.shots ?? 5, w.spread)) bullet(s, x, y, dx, dy, dmg, {}, speed);
  else if (w.gun === "sniper") bullet(s, x, y, fx, fy, dmg, { pierce: w.pierce ?? 1, hitIds: [], r: 2 }, speed);
  else if (w.gun === "dual") for (const k of [1, -1]) bullet(s, x - fy * R.DUAL_GAP * k, y + fx * R.DUAL_GAP * k, fx, fy, dmg, {}, speed);
  else if (w.gun === "grenade") throwGrenade(s, dmg);
  else bullet(s, x, y, fx, fy, dmg, {}, speed);
}

/** 틱마다 (거너 무기를 들었을 때 player에서). want = 공격 키(자동 공격이면 사거리 안에 적) */
export function gunTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const w = weaponOf(p);
  if (!(p.gunsOwned ?? []).includes(p.weaponId)) p.gunsOwned = [...(p.gunsOwned ?? []), p.weaponId];
  if ((p.jamTicks ?? 0) > 0) p.jamTicks = (p.jamTicks ?? 0) - 1;
  if (!s.tdShared) updateBleed(s);
  droneStep(s);
  reload(s, w, want);
  // 총검: 대시를 시작하면 둘레에 피해
  if (w.gun === "bayonet" && p.dashTicks === DASH_TICKS - 1) blastAt(s, p.x, p.y, R.BAYONET_DASH, p.stats.damage, { push: 6 });
  // 미니건: 누르고 있으면 예열 (놓으면 식음)
  if (w.gun === "minigun") p.spin = want && (p.jamTicks ?? 0) === 0 ? Math.min(SPIN_FULL, (p.spin ?? 0) + 1) : Math.max(0, (p.spin ?? 0) - 2);
  if (!want || p.attackCooldown > 0 || (p.jamTicks ?? 0) > 0 || w.gun === "drone") return;
  if (w.gun === "minigun" && (p.spin ?? 0) < SPIN_FULL) return;
  if (w.mag && (p.ammo ?? w.mag) <= 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  p.shotTick = s.tick;
  const dmg = p.stats.damage;
  const mx = p.x + p.faceX * (p.r + 2);
  const my = p.y + p.faceY * (p.r + 2);
  if (w.gun === "merc") mercStep(s, dmg);
  else {
    shootPattern(s, w, mx, my, dmg);
    if (w.gun === "bayonet") strike(s, dmg, { kind: "strike", mul: 1, range: R.STAB_RANGE, arc: 0.5 }, p.faceX, p.faceY);
  }
  if (w.mag) {
    p.ammo = (p.ammo ?? w.mag) - 1;
    if (w.gun !== "shotgun" && p.ammo <= 0) p.reloadLeft = reloadTicksOf(p, w);
  }
  if (hasPerk(p, "supportFire") && roll(s, "support") < SUPPORT_CHANCE) addSupport(p, 1);
  if (hasPerk(p, "gunMaster") && roll(s, "ghost") < R.GHOST_CHANCE) srcRun(s, "gunMaster", () => ghostFire(s));
  if (hasPerk(p, "scrapGun") && roll(s, "jam") < R.JAM_CHANCE) p.jamTicks = R.JAM_TICKS;
}

/** 장전: 다 쓰면 정해진 시간 뒤 가득 · 1초 안 쏘면 남은 탄도 채움 · 샷건은 쏘는 중에도 한 발씩 */
function reload(s: RunState, w: WeaponDef, want: boolean): void {
  const p = s.player;
  if (!w.mag) return;
  if (p.ammo === undefined) p.ammo = w.mag;
  if (w.gun === "shotgun") {
    if (p.ammo >= w.mag) return;
    const per = Math.max(1, Math.round(reloadTicksOf(p, w) / w.mag));
    p.reloadLeft = (p.reloadLeft ?? 0) > 0 ? (p.reloadLeft ?? 0) - 1 : per;
    if (p.reloadLeft === 0) p.ammo++;
    return;
  }
  if ((p.reloadLeft ?? 0) > 0) {
    p.reloadLeft = (p.reloadLeft ?? 0) - 1;
    if (p.reloadLeft === 0) p.ammo = w.mag;
  } else if (p.ammo < w.mag && !want && s.tick - (p.shotTick ?? -999) > R.IDLE_RELOAD) {
    p.reloadLeft = reloadTicksOf(p, w);
  }
}

/** 무기를 바꾸거나 연습장을 초기화할 때 */
export function resetGun(p: PlayerState): void {
  p.ammo = p.reloadLeft = p.spin = p.gunStep = p.gunIdle = p.droneKillBase = undefined;
  p.droneCd = [];
}
