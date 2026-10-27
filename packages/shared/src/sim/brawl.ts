// 격투가 콤보: 누를 때마다 다음 기술 · 잠깐 쉬면 처음부터 · 연속 공격·모으기·에너지파 게이지 · 붙잡은 적 들기 · 고정 도트 · 전용 아이템(존·금강불괴·마하·차력쇼·혈마·속도는 곧 힘)
// 기술 하나하나는 brawlMoves
import { TICK_RATE } from "../constants";
import { COMBOS, type ComboMove } from "../combos";
import { createRng, deriveSeed } from "../rng";
import { counter, dashTo, execute, grab, guard, kiShots, pull, slamHeld, spin, strike, twinSlash } from "./brawlMoves";
import { pierce, startStar, STAR_RUNS, starTick } from "./brawlStar";
import type { PlayerState, RunState } from "./types";
import { hasPerk, keepInRoom, roomGrid, weaponOf } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 다음 기술을 쓸 수 있게 된 뒤 이만큼(1초) 안 누르면 콤보가 처음부터 */
  COMBO_RESET: 60,
  /** 존·금강불괴 확률, 존일 때 간격 배율, 금강불괴 무적 틱 */
  ZONE_CHANCE: 0.15,
  ZONE_PACE: 0.25,
  IRON_CHANCE: 0.15,
  IRON_TICKS: 180,
  /** 차력쇼: 3번 연속, 5초, 공격력 +5, 보호막 20 */
  STRONG_RUNS: 3,
  STRONG_TICKS: 300,
  STRONG_DAMAGE: 5,
  STRONG_SHIELD: 20,
  /** 속도는 곧 힘: 기술마다 이동 +8% (최대 5번) · 혈마: 체력이 바닥이면 +100% */
  PACE_MOVE: 0.08,
  PACE_MAX: 5,
  BLOOD_MAX: 1,
  /** 택견 공격 속도 상한 (너무 빠르면 기술 무적이 끊기지 않음) */
  TAEKKYON_SPEED: 7.6,
};
export { R as BRAWL_RULES };

/** 좌우 번갈아 치는 각도 [cos, sin] (약 30도) */
const SIDE: readonly [number, number] = [0.866, 0.5];

const roll = (s: RunState, label: string) => createRng(deriveSeed(s.seed, label, s.tick)).nextFloat();

function moves(p: PlayerState): readonly ComboMove[] {
  const style = weaponOf(p).combo;
  return style ? COMBOS[style] : [];
}

/** 기술 피해: (공격력 + 차력쇼) × 기술 배율 × 혈마 */
function moveDamage(p: PlayerState, m: ComboMove): number {
  const base = p.stats.damage + ((p.buffTicks ?? 0) > 0 ? R.STRONG_DAMAGE : 0);
  const blood = hasPerk(p, "bloodDemon") ? 1 + R.BLOOD_MAX * (1 - Math.max(0, p.hp) / p.stats.maxHp) : 1;
  return base * m.mul * blood;
}

/** 속도는 곧 힘: 이동 속도 배율 */
export function brawlMoveMul(p: PlayerState): number {
  return hasPerk(p, "speedIsPower") ? 1 + R.PACE_MOVE * Math.min(R.PACE_MAX, p.paceStack ?? 0) : 1;
}

/** 틱마다 (격투가 무기를 들었을 때 player에서). want = 공격 키(자동 공격이면 사거리 안에 적) */
export function comboTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const list = moves(p);
  const interval = TICK_RATE / (weaponOf(p).combo === "taekkyon" ? Math.min(R.TAEKKYON_SPEED, speed) : speed);
  holdAndPin(s);
  // 다음 기술을 쓸 수 있게 된 뒤 1초 동안 안 누르면 콤보가 끊김
  if (p.attackCooldown === 0) p.comboIdle = (p.comboIdle ?? 0) + 1;
  if ((p.comboStep ?? 0) > 0 && (p.comboIdle ?? 0) > R.COMBO_RESET) {
    // 콤보가 끊김
    p.comboStep = 0;
    p.paceStack = 0;
    p.comboRuns = 0;
    p.zoneLeft = 0;
    p.grabId = undefined;
    p.rock = false;
  }
  // 이어지는 기술: 쌍광연격 별 · 연속 공격 · 모으기 (파동탄 모으기 포함)
  if (starTick(s, list[list.length - 1]!)) return;
  if ((p.flurryLeft ?? 0) > 0) {
    if ((p.flurryTimer ?? 0) > 0) p.flurryTimer = (p.flurryTimer ?? 0) - 1;
    else flurryHit(s, list[p.flurryMove ?? 0]!);
    return;
  }
  if ((p.chargeTicks ?? 0) > 0) {
    p.chargeTicks = (p.chargeTicks ?? 0) - 1;
    if (p.chargeTicks === 0) {
      const m = list[p.chargeMove ?? 0]!;
      if (m.kind === "shot") kiShots(s, moveDamage(p, m), m);
      else spin(s, moveDamage(p, m), m);
      landed(s, m, p.chargeMove ?? 0);
    }
    return;
  }
  if (!want || p.attackCooldown > 0 || list.length === 0) return;
  let i = (p.comboStep ?? 0) % list.length;
  // 마하: 첫 기술을 바로 끝내고 두 번째부터
  if (i === 0 && list.length > 1 && hasPerk(p, "mach")) {
    perform(s, list[0]!, 0);
    i = 1;
  }
  const m = list[i]!;
  p.comboHit = false;
  perform(s, m, i);
  procs(s, list.length - 1 - i);
  const pace = (m.pace ?? 1) * ((p.zoneLeft ?? 0) > 0 ? R.ZONE_PACE : 1);
  if ((p.zoneLeft ?? 0) > 0) p.zoneLeft = (p.zoneLeft ?? 0) - 1;
  // 연속 공격·모으기는 끝난 뒤부터 간격을 셈
  const busy = m.kind === "flurry" ? (m.hits ?? 1) * (m.gap ?? 1) : m.charge ? (m.charge ?? 0) : 0;
  p.attackCooldown = Math.max(1, Math.round(busy + interval * pace));
  p.attackCount++;
  p.comboIdle = 0;
  p.paceStack = (p.paceStack ?? 0) + 1;
  // 맞혀야 다음 기술로 (파동탄·버티기 제외). 연속 공격·모으기는 끝날 때 정함
  const later = m.kind === "flurry" || (m.charge ?? 0) > 0;
  const ok = later || m.kind === "shot" || m.kind === "guard" || hitLanded(p);
  p.comboStep = ok ? (i + 1) % list.length : i;
  if (ok && !later && p.comboStep === 0) finished(s);
}

/** 이번 기술이 적을 맞혔는지 (기술 안에서 바뀌는 값) */
const hitLanded = (p: PlayerState): boolean => p.comboHit === true;

/** 연속 공격·모으기가 끝남: 하나도 안 맞았으면 그 기술부터 다시, 맞았고 마지막 기술이면 콤보 완성 */
function landed(s: RunState, m: ComboMove, i: number): void {
  const p = s.player;
  if (m.kind !== "shot" && !p.comboHit) p.comboStep = i;
  else if (p.comboStep === 0) finished(s);
}

/** 기술 하나 쓰기 */
function perform(s: RunState, m: ComboMove, i: number): void {
  const p = s.player;
  const dmg = moveDamage(p, m);
  if (m.invuln) p.invulnTicks = Math.max(p.invulnTicks, invulnFor(m));
  switch (m.kind) {
    case "strike":
      strike(s, dmg, m, p.faceX, p.faceY);
      break;
    case "spin":
      spin(s, dmg, m);
      break;
    case "flurry":
      p.flurryLeft = m.hits ?? 1;
      p.flurryTimer = 0;
      p.flurryMove = i;
      flurryHit(s, m);
      break;
    case "dash":
      dashTo(s, m.dash ?? 0, m.range);
      spin(s, dmg, m);
      break;
    case "charge":
      p.chargeTicks = m.charge ?? 1;
      p.chargeMove = i;
      p.rootTicks = Math.max(p.rootTicks ?? 0, m.charge ?? 1);
      break;
    case "grab":
      grab(s, dmg, m);
      break;
    case "throw":
      slamHeld(s, dmg, m);
      break;
    case "pull":
      pull(s, dmg, m);
      break;
    case "twin":
      twinSlash(s, dmg, m);
      break;
    case "pierce":
      pierce(s, dmg, m);
      break;
    case "guard":
      guard(s, m);
      break;
    case "counter":
      counter(s, dmg, m);
      break;
    case "execute":
      execute(s, dmg, m);
      break;
    case "shot":
      if (m.charge) {
        p.chargeTicks = m.charge;
        p.chargeMove = i;
        p.rootTicks = Math.max(p.rootTicks ?? 0, m.charge);
      } else kiShots(s, dmg, m);
      break;
  }
}

function invulnFor(m: ComboMove): number {
  if (m.invulnTicks) return m.invulnTicks;
  if (m.kind === "flurry") return (m.hits ?? 1) * (m.gap ?? 1) + 6;
  if (m.kind === "charge") return (m.charge ?? 0) + 6;
  return 20;
}

/** 연속 공격 한 번 (좌우 번갈아면 바라보는 방향에서 비껴서) */
function flurryHit(s: RunState, m: ComboMove): void {
  const p = s.player;
  const n = (m.hits ?? 1) - (p.flurryLeft ?? 1);
  let fx = p.faceX;
  let fy = p.faceY;
  if (m.side && n % 3 !== 2) {
    const k = n % 2 === 0 ? 1 : -1;
    [fx, fy] = [fx * SIDE[0] - fy * SIDE[1] * k, fx * SIDE[1] * k + fy * SIDE[0]];
  }
  strike(s, moveDamage(p, m), m, fx, fy);
  p.flurryLeft = (p.flurryLeft ?? 1) - 1;
  p.flurryTimer = m.gap ?? 1;
  if (p.flurryLeft === 0) landed(s, m, p.flurryMove ?? 0);
}

/** 공격할 때마다: 금강불괴(3초 무적) · 존(남은 콤보 아주 빠르게) */
function procs(s: RunState, rest: number): void {
  const p = s.player;
  if (hasPerk(p, "ironBody") && roll(s, "iron") < R.IRON_CHANCE) p.invulnTicks = Math.max(p.invulnTicks, R.IRON_TICKS);
  if (hasPerk(p, "zone") && rest > 0 && (p.zoneLeft ?? 0) === 0 && roll(s, "zone") < R.ZONE_CHANCE) p.zoneLeft = rest;
}

/** 콤보를 끝까지 이어 감: 차력쇼 */
function finished(s: RunState): void {
  const p = s.player;
  p.comboRuns = (p.comboRuns ?? 0) + 1;
  // 쌍광연격: 5번 연속 콤보를 마치면 찌르기로 별을 그림 (마지막 기술 피해로)
  const list = moves(p);
  const last = list[list.length - 1];
  if (last?.kind === "pierce" && p.comboRuns % STAR_RUNS === 0) startStar(s, moveDamage(p, last));
  if (hasPerk(p, "strongman") && p.comboRuns % R.STRONG_RUNS === 0) {
    p.buffTicks = R.STRONG_TICKS;
    p.shieldPts = Math.max(p.shieldPts ?? 0, R.STRONG_SHIELD);
  }
}

/** 틱마다: 붙잡은 적을 앞에 들고 있음 · 고정 도트·끝나면 저절로 풀기 · 버티기·움직임 막기·버프 시간 */
function holdAndPin(s: RunState): void {
  const p = s.player;
  if ((p.rootTicks ?? 0) > 0) p.rootTicks = (p.rootTicks ?? 0) - 1;
  if ((p.guardTicks ?? 0) > 0) p.guardTicks = (p.guardTicks ?? 0) - 1;
  if ((p.buffTicks ?? 0) > 0 && --p.buffTicks! === 0) p.shieldPts = Math.max(0, (p.shieldPts ?? 0) - R.STRONG_SHIELD);
  // 바위를 들고 있는 동안 무적
  if (p.rock) p.invulnTicks = Math.max(p.invulnTicks, 2);
  if (p.grabId) {
    const held = s.enemies.find((e) => e.id === p.grabId && e.hp > 0);
    if (!held) p.grabId = undefined;
    else {
      // 붙잡고 있는 동안 무적
      p.invulnTicks = Math.max(p.invulnTicks, 2);
      held.x = p.x + p.faceX * (p.r + held.r + 1);
      held.y = p.y + p.faceY * (p.r + held.r + 1);
      keepInRoom(held, roomGrid(s));
      held.stunTicks = Math.max(held.stunTicks ?? 0, 2);
    }
  }
}

/** 무기를 바꾸거나 연습장을 초기화할 때 콤보 상태 지우기 */
export function resetCombo(p: PlayerState): void {
  p.comboStep = p.comboIdle = p.comboRuns = p.paceStack = p.zoneLeft = p.starLeft = 0;
  p.flurryLeft = p.chargeTicks = p.guardTicks = p.guardTaken = p.rootTicks = 0;
  p.grabId = undefined;
  p.rock = false;
}
