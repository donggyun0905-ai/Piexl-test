// 거대한 투핸디드 대검 한 콤보 (바스러져가는 왕관의 옛 제국의 왕 · 히든 캐릭터 몰락한 왕이 같이 씀)
// 공격마다 한 단계: ① X자 첫 베기 ② X자 둘째 베기 ③ 가로로 점점 길어지는 검기 ④ 검을 내리꽂음 → 푸른(왕관은 붉은) 불꽃 선이 적에게 이어지고
// 점화선처럼 타고 가 마지막에 적 자리에서 거대한 불기둥 (잠시 뒤 폭발 pendingBlasts)
import { TICK_RATE } from "../constants";
import { FALLEN_KING_PERKS as K } from "../itemsFallenKing";
import { healPlayer } from "./combat";
import { alive, inCircle, inCone, onSegment, strike as strike_ } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk } from "./util";
import { srcFn } from "./dmgSrc";
const strike = srcFn("kingBlade", () => strike_);

const R = {
  /** 단계마다 공격력 배율: X자 베기 · 검기 · 내리꽂기 · 불기둥 */
  slash: 1,
  wave: 1.4,
  plant: 0.8,
  pillar: 2.2,
  /** 베기 부채꼴 cos · 검기 길이(사거리 배율)·폭 · 내리꽂기 범위 · 불꽃 선 닿는 거리·최대 수 · 불기둥 범위 · 불꽃이 타고 가는 틱 */
  arc: 0.2,
  waveLen: 2.6,
  waveW: 14,
  plantR: 30,
  lineReach: 170,
  lines: 5,
  pillarR: 26,
  burn: 36,
  /** 내리꽂은 뒤 다음 콤보까지 더 쉬는 배율 */
  rest: 1.8,
};
export { R as KING_BLADE_RULES };

/** 왕관 = 붉은빛 · 몰락한 왕 = 푸른빛 */
export const kingTint = (s: RunState) => (s.player.characterId === "fallenKing" && s.player.kingRoom === undefined ? "#3ab8ff" : "#ff4a2a");

/** 한 콤보 단계 (공격 간격마다) */
export function kingBlade(s: RunState, speed: number): void {
  const p = s.player;
  const step = p.kgStep ?? 0;
  const dmg = p.stats.damage;
  const reach = p.stats.range;
  const tint = kingTint(s);
  p.attackCount++;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  if (step <= 1) {
    const cross = hasPerk(p, "fkCross") ? K.fkCross.mul : 1;
    for (const e of inCone(s, reach, R.arc)) strike(s, e, dmg * R.slash * cross, 4);
    addEffect(s, { kind: "kgSlash", x: p.x, y: p.y - 6, dirX: p.faceX, dirY: p.faceY, size: reach, width: step ? -1 : 1, maxTicks: 12, tint });
  } else if (step === 2) {
    const len = reach * R.waveLen;
    for (const e of onSegment(s, p.x, p.y, p.x + p.faceX * len, p.y + p.faceY * len, R.waveW)) strike(s, e, dmg * R.wave, 6);
    addEffect(s, { kind: "kgWave", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: R.waveW, toX: p.x + p.faceX * len, toY: p.y + p.faceY * len, maxTicks: 18, tint });
  } else {
    // 내리꽂기 → 가까운 적들에게 불꽃 선 → 타고 간 끝에서 불기둥
    for (const e of inCircle(s, p.x, p.y, R.plantR)) strike(s, e, dmg * R.plant);
    addEffect(s, { kind: "kgPlant", x: p.x + p.faceX * 8, y: p.y, dirX: 0, dirY: 0, size: R.plantR, maxTicks: 24, tint });
    const near = alive(s)
      .filter((e) => (e.x - p.x) ** 2 + (e.y - p.y) ** 2 <= R.lineReach ** 2)
      .sort((a, b) => (a.x - p.x) ** 2 + (a.y - p.y) ** 2 - ((b.x - p.x) ** 2 + (b.y - p.y) ** 2) || a.id - b.id)
      .slice(0, R.lines + (hasPerk(p, "fkLines") ? K.fkLines.add : 0));
    const pyre = hasPerk(p, "fkPyre") ? K.fkPyre : { r: 1, mul: 1 };
    const pr = R.pillarR * pyre.r;
    if (near.length && hasPerk(p, "fkRequiem")) healPlayer(s, p.stats.maxHp * K.fkRequiem.heal * near.length);
    for (const e of near) {
      addEffect(s, { kind: "kgLine", x: p.x + p.faceX * 8, y: p.y, dirX: 0, dirY: 0, size: 3, toX: e.x, toY: e.y, maxTicks: R.burn, tint });
      addEffect(s, { kind: "kgPillar", x: e.x, y: e.y, dirX: 0, dirY: R.burn, size: pr, maxTicks: R.burn + 30, tint });
      s.pendingBlasts.push({ tick: s.tick + R.burn, x: e.x, y: e.y, radius: pr, damage: dmg * R.pillar * pyre.mul });
    }
    p.attackCooldown = Math.round(p.attackCooldown * R.rest);
  }
  p.kgStep = (step + 1) % 4;
}

/** 직업 무기 틱 (classTicks): 누르면 콤보 */
export function kingTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (!want || p.attackCooldown > 0) return;
  kingBlade(s, speed);
}
