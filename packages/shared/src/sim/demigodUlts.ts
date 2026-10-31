// 괴력난신 필살기 셋 (그동안 무적 — bosses.updateBoss)
// 70%: 플레이어 뒤로 순간이동해 범위 +50% 콤보 (앞으로만 → 보스 뒤로 대시 한 번이면 피함)
// 50%: 주먹에 붉은 기를 두르고 아주 빠르게 쫓아오며 계속 플레이어 쪽으로 콤보 (때릴 틈 없이 피하기만)
// 10%: 거대한 원기옥을 모아 바닥에 세 번 내리꽂음. 맵 전체가 노랗게 세 번 깜박인 바로 다음 순간에 대시해야 피함 → 세 번 다 피하면 3초 그로기
import { ROOM_CX, ROOM_CY } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { hitDamage } from "./bossKit";
import { ultHp, ultReady } from "./bossUlts";
import { throughDash } from "./bossGrip";
import { comboTick, startCombo } from "./bossDemigod";
import { damagePlayer } from "./combat";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";
import { addEffect, keepInRoom, normalize } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 필살기 1·2를 쓰는 체력 비율 (필살기 3은 라스트 보스 공통 ULT_HP) */
  ULT1_HP: 0.7,
  ULT2_HP: 0.5,
  /** 70%: 뒤로 나타나는 거리 · 콤보 시작까지 · 범위 배율 · 타 수 */
  BEHIND: 28,
  BEHIND_DELAY: 24,
  BEHIND_REACH: 1.5,
  BEHIND_HITS: 5,
  /** 50%: 틱 · 쫓는 빠르기 · 타 사이 · 반경 · 예고 */
  RUSH: 360,
  RUSH_SPEED: 2.6,
  RUSH_GAP: 18,
  RUSH_R: 44,
  RUSH_WARN: 8,
  /** 10%: 모으기 · 원기옥 사이 · 깜박임 사이 (세 번 깜박이고 다음 박자에 내리꽂음) · 피한 것으로 치는 대시 남은 틱 · 피해 배율 · 그로기 */
  CHARGE: 100,
  SLAM_GAP: 90,
  BLINK: 20,
  DODGE_MIN: 4,
  SLAM_MUL: 2.5,
  GROGGY: 180,
};
export { R as DEMIGOD_ULTS_RULES };

/** 원기옥 박자: 장면 k의 첫 깜박임 틱 (시작부터) · 내리꽂는 틱 */
export const SPIRIT_CHARGE = R.CHARGE;
export const SPIRIT_BLINK = R.BLINK;
export const spiritBlink = (k: number) => R.CHARGE + k * R.SLAM_GAP;
export const spiritSlam = (k: number) => spiritBlink(k) + 3 * R.BLINK;

function start(s: RunState, e: EnemyState, k: number): void {
  e.gUlt = k;
  e.gDone = (e.gDone ?? 0) | (1 << (k - 1));
  e.ultAt = s.tick;
  e.phase = "walk";
  e.gDodge = 0;
  delete e.combo;
  // 원기옥은 방 가운데로 뛰어올라 모음
  if (k === 3) {
    e.x = e.prevX = ROOM_CX;
    e.y = e.prevY = ROOM_CY;
  }
  addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 34, maxTicks: 20 });
}

function end(e: EnemyState): void {
  e.ultAt = undefined;
  delete e.gUlt;
  delete e.combo;
  e.immune = false;
  e.timer = 40;
}

/** 체력 ULT_HP 아래에서 필살기를 한 번 쓰는 라스트 보스 (ultReady를 부르는 보스) */
const ULT_BOSSES = ["dragon", "godeater", "plight", "pdark", "sandworm", "scorpion", "roc", "sage"];
/** 보스 체력바에 표시할 필살기 체력 비율 (높은 것부터) · 필살기가 없으면 빈 목록 */
export function ultMarks(kind: string): number[] {
  if (kind === "demigod") return [R.ULT1_HP, R.ULT2_HP, ultHp()];
  return ULT_BOSSES.includes(kind) ? [ultHp()] : [];
}

/** 필살기를 시작하거나 이어 감. 필살기 중이면 true */
export function demigodUlt(s: RunState, e: EnemyState, toP: readonly [number, number]): boolean {
  if (e.ultAt === undefined) {
    const done = e.gDone ?? 0;
    if (!(done & 1) && e.hp < e.maxHp * R.ULT1_HP) start(s, e, 1);
    else if (!(done & 2) && e.hp < e.maxHp * R.ULT2_HP) start(s, e, 2);
    else if (ultReady(e)) start(s, e, 3);
    else return false;
  }
  e.immune = true;
  const t = s.tick - e.ultAt!;
  const p = s.player;
  if (e.gUlt === 1) {
    if (t === 0) {
      // 플레이어가 바라보는 쪽의 반대(등 뒤)로
      e.x = p.x - p.faceX * R.BEHIND;
      e.y = p.y - p.faceY * R.BEHIND;
      keepInRoom(e);
      e.prevX = e.x;
      e.prevY = e.y;
      startCombo(e, normalize(p.x - e.x, p.y - e.y) ?? [p.faceX, p.faceY], R.BEHIND_REACH, R.BEHIND_HITS, R.BEHIND_DELAY);
      addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 24, maxTicks: 16 });
    }
    if (!e.combo || comboTick(s, e)) end(e);
    return true;
  }
  if (e.gUlt === 2) {
    e.x += toP[0] * R.RUSH_SPEED;
    e.y += toP[1] * R.RUSH_SPEED;
    e.dirX = toP[0];
    e.dirY = toP[1];
    if (t % R.RUSH_GAP === 0) addShape(s, R.RUSH_WARN, { x: e.x + toP[0] * 8, y: e.y + toP[1] * 8, radius: R.RUSH_R, damage: hitDamage(s), dirX: toP[0], dirY: toP[1], arc: 0.2, fx: "bslash" });
    if (t >= R.RUSH) end(e);
    return true;
  }
  // 원기옥: 세 번 깜박인 다음 박자에 내리꽂음
  for (let k = 0; k < 3; k++) {
    if (t !== spiritSlam(k)) continue;
    const dodged = p.dashTicks >= R.DODGE_MIN;
    if (dodged) e.gDodge = (e.gDodge ?? 0) + 1;
    else throughDash(s, () => damagePlayer(s, hitDamage(s) * R.SLAM_MUL));
    const rng = createRng(deriveSeed(s.seed, "spirit", e.id, k));
    addEffect(s, { kind: "burst", x: p.x + rng.int(-6, 6), y: p.y, dirX: 0, dirY: 0, size: 120, maxTicks: 24 });
  }
  if (t < spiritSlam(2) + 20) return true;
  const all = (e.gDodge ?? 0) >= 3;
  end(e);
  // 세 번 다 피하면 그로기
  if (all) e.stunTicks = R.GROGGY;
  return false;
}
