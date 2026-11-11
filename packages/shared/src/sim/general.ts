// 장수: 누를 때마다 콤보가 끊기지 않고 이어짐 (찌르기·휘두르기·돌진 내리꽂기, 무기마다 다른 표 weaponsGeneral.SPEAR_COMBOS)
// 묶음 끝마다 조금 쉼 · 콤보 마지막에 숨겨진 힘이면 필살기(generalLegends) · 전용 아이템 효과
import { srcRun } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import { GENERAL_PERKS as K } from "../itemsGeneral";
import { GENERAL, SPEAR_COMBOS, type SpearMove } from "../weaponsGeneral";
import { healPlayer } from "./combat";
import { useLegend } from "./generalLegends";
import { cleave, cross, fan, flurry, lunge, rush, shock, sweep, thrustLine, wave } from "./generalMoves";
import type { PlayerState, RunState } from "./types";
import { hasPerk, weaponOf } from "./util";

function doMove(s: RunState, m: SpearMove, dmg: number): void {
  const p = s.player;
  const range = p.stats.range * (m.reach ?? 1);
  switch (m.kind) {
    case "thrust":
      return thrustLine(s, dmg, range);
    case "double":
      // 두 칼로 나란히 찌름 (각도 없이 옆으로 조금씩 비켜서 앞의 적에게 둘 다 맞음)
      thrustLine(s, dmg, range, GENERAL.width - 1, 0, -3);
      return thrustLine(s, dmg, range, GENERAL.width - 1, 0, 3);
    case "swing":
      return sweep(s, dmg, range * GENERAL.swingReach, weaponOf(p).arcCos ?? 0.2);
    case "spin":
      return sweep(s, dmg, range * GENERAL.swingReach, -1);
    case "wave":
      sweep(s, dmg * 0.6, range * GENERAL.swingReach, weaponOf(p).arcCos ?? 0.2);
      return wave(s, dmg, range * 2.5);
    case "lunge":
      return lunge(s, dmg, range);
    case "cleave":
      return cleave(s, dmg, range);
    case "rush":
      return rush(s, dmg);
    case "flurry":
      return flurry(s, dmg, range);
    case "shock":
      return shock(s, dmg, range);
    case "fan":
      return fan(s, dmg, range);
    case "cross":
      return cross(s, dmg, range);
  }
}

/** 기술 피해: 공격력 × 기술 배율 × 함성 × 명장의 기세 */
function moveDamage(p: PlayerState, m: SpearMove): number {
  let d = p.stats.damage * m.mul * ((p.warCryTicks ?? 0) > 0 ? K.warCry.damage : 1);
  if (p.momentumReady) {
    d *= K.momentum.damage;
    p.momentumReady = false;
  }
  return d;
}

/** 틱마다 (창·검을 들었을 때 player에서). want = 공격 키(자동 공격이면 사거리 안에 적) */
export function generalTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if ((p.warCryTicks ?? 0) > 0) p.warCryTicks = (p.warCryTicks ?? 0) - 1;
  if ((p.gPause ?? 0) > 0) p.gPause = (p.gPause ?? 0) - 1;
  if ((p.gShieldTicks ?? 0) > 0 && --p.gShieldTicks! === 0) p.shieldPts = Math.max(0, (p.shieldPts ?? 0) - GENERAL.dashShield);
  if (!want || p.attackCooldown > 0) return;
  const w = weaponOf(p);
  const list = SPEAR_COMBOS[w.spear ?? "basic"] ?? SPEAR_COMBOS.basic!;
  const i = (p.gStep ?? 0) % list.length;
  const m = list[i]!;
  p.attackCount++;
  doMove(s, m, moveDamage(p, m));
  p.gStep = (i + 1) % list.length;
  let interval = TICK_RATE / speed;
  const steady = hasPerk(p, "unbreakable") && p.hp <= p.stats.maxHp * K.unbreakable.below;
  if (m.pause && !steady) {
    interval *= GENERAL.pause;
    p.gPause = Math.round(interval);
  }
  p.attackCooldown = Math.max(1, Math.round(interval));
  // 콤보를 끝까지 함
  if (i === list.length - 1) {
    if (hasPerk(p, "warCry")) p.warCryTicks = K.warCry.ticks;
    if (hasPerk(p, "loyalty")) healPlayer(s, p.stats.maxHp * K.loyalty.heal);
    if (hasPerk(p, "hiddenPower") && w.legend) srcRun(s, "hiddenPower", () => useLegend(s, w.legend!, p.stats.damage));
  }
}

/** 콤보 처음으로 (연습장 초기화) */
export function resetGeneral(p: PlayerState): void {
  p.gStep = p.gPause = p.warCryTicks = p.gShieldTicks = undefined;
  p.momentumReady = undefined;
}
