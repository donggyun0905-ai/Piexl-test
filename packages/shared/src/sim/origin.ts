// 처음 두 캐릭터의 특징 (늘 켜짐). 전용 패시브가 그 특징을 키움
// - 떠돌이 기습: 대시가 끝난 뒤 잠깐 안의 첫 공격이 2배. 패시브 '기습'이 있으면 배율이 오르고 맞힌 적 최대 체력에 비례한 피해가 더해짐
// - 파수꾼 반격: 맞은 뒤 잠깐 안의 첫 휘두르기가 한 바퀴 베기 + 1.5배. 패시브 '반격의 방패'가 있으면 2배 + 더 넓게 (맞을 때 충격파는 그대로)
import { ENEMIES } from "../content";
import { PERKS } from "../perks";
import { blastAt as blastAt_ } from "./combat";
import { addEffect, hasPerk } from "./util";
import type { EnemyState, PlayerState, RunState } from "./types";
import { hiddenHurt, hiddenTick } from "./hiddenPerks";
import { pilgrimTick } from "./pilgrim";
import { srcFn } from "./dmgSrc";
const blastAt = srcFn("origin", () => blastAt_);

const R = {
  /** 떠돌이: 대시 뒤 이 틱 안의 첫 공격 · 배율 */
  ambushTicks: 90,
  ambushMul: 2,
  /** 파수꾼: 맞은 뒤 이 틱 안의 첫 휘두르기 · 배율 */
  counterTicks: 90,
  counterMul: 1.5,
};
export { R as ORIGIN_RULES };

/** 대시가 끝날 때: 떠돌이·기습 패시브는 기습 준비 */
export function readyAmbush(p: PlayerState): void {
  if (p.characterId === "drifter" || hasPerk(p, "ambush")) p.ambushTicks = hasPerk(p, "ambush") ? PERKS.ambush.ticks : R.ambushTicks;
}

/** 공격할 때: 기습·반격이 준비돼 있으면 쓰고 배율 · 체력 비례 몫 · 한 바퀴 베기 여부 · 범위 배율 · 기습 탄 표시 (1 특징 · 2 패시브) */
export function takeOrigin(s: RunState, melee: boolean): { mul: number; cut: number; spin: boolean; reach: number; amb: number } {
  const p = s.player;
  let mul = 1;
  let cut = 0;
  let spin = false;
  let reach = 1;
  let amb = 0;
  if (p.ambushTicks > 0) {
    const perk = hasPerk(p, "ambush");
    mul *= perk ? PERKS.ambush.damage : R.ambushMul;
    if (perk) cut = PERKS.ambush.hpCut;
    p.ambushTicks = 0;
    amb = perk ? 2 : 1;
    // 쏘는 순간 활 끝 섬광 (size = 1 특징 · 2 패시브)
    if (!melee) addEffect(s, { kind: "ogShot", x: p.x + p.faceX * 8, y: p.y + p.faceY * 8, dirX: p.faceX, dirY: p.faceY, size: amb, maxTicks: 12 });
  }
  if (melee && (p.counterTicks ?? 0) > 0) {
    const perk = hasPerk(p, "counterGuard");
    mul *= perk ? PERKS.counterGuard.swing : R.counterMul;
    if (perk) reach = PERKS.counterGuard.reach;
    spin = true;
    p.counterTicks = 0;
    // 반격 베기: 금빛 방패 충격파 (width 2 = 반격의 방패)
    addEffect(s, { kind: "ogCounter", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: p.stats.range * reach, maxTicks: 18, width: perk ? 2 : 1 });
  }
  return { mul, cut, spin, reach, amb };
}

/** 기습 탄이 맞았을 때: 맞은 자리에 터짐 (그리기용) */
export function ambushHitFx(s: RunState, kind: number, x: number, y: number, dx: number, dy: number): void {
  addEffect(s, { kind: "ogHit", x, y, dirX: dx, dirY: dy, size: kind, maxTicks: 16 });
}

/** 맞았을 때: 파수꾼·반격의 방패는 반격 준비 · 반격의 방패는 주변 적을 밀어내며 공격력만큼 피해 */
export function readyCounter(s: RunState, taken: number): void {
  const p = s.player;
  hiddenHurt(s, taken);
  const guard = hasPerk(p, "counterGuard");
  if (p.characterId === "warden" || guard) p.counterTicks = R.counterTicks;
  if (guard) blastAt(s, p.x, p.y, PERKS.counterGuard.radius, p.stats.damage * PERKS.counterGuard.damage, { push: PERKS.counterGuard.push });
}

/** 틱마다 준비 시간 줄이기 · 히든 아이템 · 순례자 */
export function tickOrigin(s: RunState): void {
  const p = s.player;
  hiddenTick(s);
  pilgrimTick(s);
  if (p.ambushTicks > 0) p.ambushTicks--;
  if ((p.counterTicks ?? 0) > 0) p.counterTicks!--;
}

/** 기습 패시브: 맞힌 적 최대 체력 × cut (보스는 더 적게, 공격력의 cap배까지) */
export function ambushCut(p: PlayerState, e: EnemyState, cut: number | undefined): number {
  if (!cut) return 0;
  const boss = ENEMIES[e.kind].boss ? PERKS.ambush.bossCut : 1;
  return Math.min(e.maxHp * cut * boss, p.stats.damage * PERKS.ambush.cap);
}
