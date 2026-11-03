// 시즌 3 새 몬스터 (enemies → stalkers.updateStalker에서 부름)
// 폭발풍뎅이: 들어오자마자 빠르게 달려와 몸에 달라붙음(닿아도 피해 없음) → 1.5초 뒤 폭발. 대시하면 떨어져 나가 그 자리에서 터짐
//   (못 피하면 큰 피해 + 화상, foeStatus) · 터지기 전에 잡으면 안 터짐
// 스켈레톤 궁병: 멀리서 얇은 일직선으로 나를 겨눔(따라옴) → 선이 굳어 깜빡임 → 진짜 화살 한 발이 그 선을 따라 매우 빠르게 날아감 (큰 피해)
// 쇠사슬 간수(3층부터): 사슬이 날아갈 길이 미리 보임 → 사슬에 맞으면 피해 + 간수 쪽으로 끌려감 (대시로 피함)
// 하이오크(3층부터): 다가와 큰 도끼를 반원으로 휘두름 · 체력이 적을수록 빨라지고 세짐
import { ENEMIES } from "../content";
import { depth } from "./hero";
import { addShape, inHazard } from "./hazards";
import { damagePlayer } from "./combat";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2, enemyShot } from "./util";
import { lateDmg } from "./foeScale";
import { trialFoeDmg } from "./trialFoes";
import { tabooUp } from "./taboo";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 폭발풍뎅이: 달라붙고 터지기까지 틱 (1.5초) · 폭발 반경 · 피해(+층 세기 × 3) */
  BUG_FUSE: 90,
  BUG_BLAST_R: 26,
  BUG_DMG: 24,
  /** 스켈레톤 궁병: 거리 두기 · 쉬는 틱 · 겨누는 틱(선이 나를 따라옴) · 깜빡이는 틱(선이 굳음) · 선 길이 · 선 굵기(반) · 피해(+층 세기 × 3) · 화살 빠르기(틱마다) */
  ARCH_KEEP: 110,
  ARCH_REST: 150,
  ARCH_AIM: 60,
  ARCH_LOCK: 30,
  ARCH_LEN: 320,
  ARCH_WIDTH: 3,
  ARCH_DMG: 22,
  ARCH_SPEED: 9,
  /** 쇠사슬 간수: 거리 두기 · 쉬는 틱 · 사슬 길 예고 틱 · 사슬 길이 · 굵기(반) · 피해(+층 세기 × 2) · 끌려가는 틱 */
  JAIL_KEEP: 85,
  JAIL_REST: 170,
  JAIL_WARN: 40,
  JAIL_LEN: 170,
  JAIL_WIDTH: 4,
  JAIL_DMG: 10,
  JAIL_PULL: 40,
  /** 하이오크: 휘두르기 시작 거리 · 예고 틱 · 범위 · 피해(+층 세기 × 3) · 쉬는 틱 · 체력이 0에 가까울 때 더하는 이동 속도·공격력 배율 */
  ORC_REACH: 36,
  ORC_WARN: 30,
  ORC_R: 40,
  ORC_DMG: 18,
  ORC_REST: 70,
  ORC_SPEED_UP: 1.2,
  ORC_DMG_UP: 1.5,
};
export { R as NEW_FOES_RULES };

type Vec = readonly [number, number];

/** 폭발풍뎅이: phase walk 달려옴 · act 달라붙음(step 0) / 떨어져 나감(step 1) */
function bombbug(s: RunState, e: EnemyState, go: Vec): void {
  const p = s.player;
  if (e.phase !== "act") {
    const sp = ENEMIES.bombbug.speed;
    e.x += go[0] * sp;
    e.y += go[1] * sp;
    e.dirX = go[0];
    if (dist2(e, p) > (e.r + p.r + 1) ** 2) return;
    e.phase = "act";
    e.step = 0;
    e.timer = R.BUG_FUSE;
    e.auxX = e.x - p.x;
    e.auxY = e.y - p.y;
    return;
  }
  // 대시하면 떨어져 나가 그 자리에 남음
  if (e.step === 0 && p.dashTicks > 0) e.step = 1;
  if (e.step === 0) {
    e.x = p.x + (e.auxX ?? 0);
    e.y = p.y + (e.auxY ?? 0);
  }
  if (--e.timer > 0) return;
  addShape(s, 0, { x: e.x, y: e.y, radius: R.BUG_BLAST_R, damage: R.BUG_DMG + 3 * depth(s), by: "bombbug" });
  // 스스로 터진 것은 처치가 아님 (돈 없음 · 시련 점수에도 넣지 않게 combat.removeDead가 더할 1을 미리 뺌)
  e.hp = 0;
  e.noGold = true;
  if (s.trialRun) s.trialRun.got = (s.trialRun.got ?? 0) - 1;
}

/** 폭발풍뎅이가 터지기까지 남은 몫 (0~1, 화면 깜빡임) · 달라붙지 않았으면 undefined */
export const bugFuse = (e: EnemyState): number | undefined => (e.kind === "bombbug" && e.phase === "act" ? e.timer / R.BUG_FUSE : undefined);

/** 스켈레톤 궁병: phase walk 거리 두기 · windup step 0 겨눔(따라옴) · step 1 굳어 깜빡임 → 화살 */
function skelarcher(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  e.timer--;
  if (e.phase === "windup") {
    if (e.step === 0) {
      e.dirX = toP[0];
      e.dirY = toP[1];
      if (e.timer > 0) return;
      e.step = 1;
      e.timer = R.ARCH_LOCK;
      // 굳은 선은 표시만 (피해는 화살이 줌)
      addShape(s, R.ARCH_LOCK, { x: e.x, y: e.y, toX: e.x + e.dirX * R.ARCH_LEN, toY: e.y + e.dirY * R.ARCH_LEN, width: R.ARCH_WIDTH, radius: 0, damage: 0, from: "skelarcher", owner: e.id });
      return;
    }
    if (e.timer > 0) return;
    // 굳은 선을 따라 매우 빠른 화살 한 발
    const arrow = enemyShot(s, e.x, e.y, e.dirX, e.dirY, R.ARCH_SPEED, R.ARCH_DMG + 3 * depth(s));
    Object.assign(arrow, { look: "arrow", by: "skelarcher", from: "skelarcher", ticksLeft: Math.ceil(R.ARCH_LEN / R.ARCH_SPEED) });
    e.phase = "walk";
    e.timer = R.ARCH_REST;
    return;
  }
  // 거리를 두고 섬
  const sp = ENEMIES.skelarcher.speed;
  const d2 = dist2(e, s.player);
  const dir = d2 > R.ARCH_KEEP ** 2 ? 1 : d2 < (R.ARCH_KEEP - 25) ** 2 ? -1 : 0;
  const m = dir > 0 ? go : toP;
  e.x += m[0] * sp * dir;
  e.y += m[1] * sp * dir;
  e.dirX = toP[0];
  e.dirY = toP[1];
  if (e.timer > 0) return;
  e.phase = "windup";
  e.step = 0;
  e.timer = R.ARCH_AIM;
}

/** 궁병이 겨누는 중: 0 따라옴 · 1 굳어 깜빡임 (화면 선) · 아니면 undefined */
export const archerAim = (e: EnemyState): 0 | 1 | undefined => (e.kind === "skelarcher" && e.phase === "windup" ? (e.step === 1 ? 1 : 0) : undefined);
export const ARCHER_LEN = () => R.ARCH_LEN;

/** 쇠사슬 간수: phase walk 거리 두기 · windup 사슬 길 예고(굳음) → 맞으면 끌어당김 */
function chainward(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  const p = s.player;
  e.timer--;
  if (e.phase === "windup") {
    if (e.timer > 0) return;
    // 예고를 지우고 그 길로 사슬 (대시·무적이면 빗나감)
    const h = s.hazards?.find((z) => z.owner === e.id && z.hold);
    s.hazards = s.hazards?.filter((z) => z !== h);
    if (h) {
      addEffect(s, { kind: "gleam", x: h.x, y: h.y, toX: h.toX, toY: h.toY, dirX: 0, dirY: 0, size: 4, width: R.JAIL_WIDTH, maxTicks: 12, foe: true });
      if (inHazard(h, p.x, p.y, p.r) && p.dashTicks <= 0 && p.invulnTicks <= 0 && p.shieldTicks <= 0) {
        damagePlayer(s, R.JAIL_DMG + 2 * depth(s), "chainward");
        p.lureTicks = R.JAIL_PULL;
        p.lureId = e.id;
      }
    }
    e.phase = "walk";
    e.timer = R.JAIL_REST;
    return;
  }
  const sp = ENEMIES.chainward.speed;
  const d2 = dist2(e, p);
  const dir = d2 > R.JAIL_KEEP ** 2 ? 1 : d2 < (R.JAIL_KEEP - 25) ** 2 ? -1 : 0;
  const m = dir > 0 ? go : toP;
  e.x += m[0] * sp * dir;
  e.y += m[1] * sp * dir;
  e.dirX = toP[0];
  e.dirY = toP[1];
  if (e.timer > 0 || d2 > (R.JAIL_LEN - 10) ** 2) return;
  e.phase = "windup";
  e.timer = R.JAIL_WARN;
  addShape(s, R.JAIL_WARN, { x: e.x, y: e.y, toX: e.x + toP[0] * R.JAIL_LEN, toY: e.y + toP[1] * R.JAIL_LEN, width: R.JAIL_WIDTH, radius: 0, damage: 0, from: "chainward", owner: e.id, hold: true });
}

/** 하이오크 분노 (0 = 체력 가득 ~ 1 = 거의 쓰러짐) */
export const orcRage = (e: EnemyState): number => (e.kind === "highorc" ? Math.max(0, Math.min(1, 1 - e.hp / Math.max(1, e.maxHp))) : 0);

/** 하이오크 도끼 한 방 피해 (분노가 클수록 셈) */
export const orcAxe = (s: RunState, e: EnemyState): number => (R.ORC_DMG + 3 * depth(s)) * (1 + R.ORC_DMG_UP * orcRage(e));

/** 하이오크 한 방이 지금 내 체력을 넘을 만큼 센지 (화면 WARNING): 내 방어·회피는 빼고 적이 세지는 배율만 넣어 넉넉히 셈 */
export const orcLethal = (s: RunState, e: EnemyState): boolean =>
  e.kind === "highorc" && e.hp > 0 && orcAxe(s, e) * lateDmg(s) * trialFoeDmg(s.player, s, "highorc") * tabooUp(s, "frail") >= s.player.hp;

/** 하이오크: phase walk 다가옴 · swing 도끼 휘두르기 예고(반원, 큰 그림이라 노란 깜빡임 없이 도끼 든 그림으로) */
function highorc(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  const rage = orcRage(e);
  e.timer--;
  if (e.phase === "swing") {
    if (e.timer > 0) return;
    e.phase = "walk";
    e.timer = Math.round(R.ORC_REST * (1 - 0.4 * rage));
    return;
  }
  const sp = ENEMIES.highorc.speed * (1 + R.ORC_SPEED_UP * rage);
  e.x += go[0] * sp;
  e.y += go[1] * sp;
  e.dirX = toP[0];
  e.dirY = toP[1];
  if (e.timer > 0 || dist2(e, s.player) > R.ORC_REACH ** 2) return;
  const warn = Math.round(R.ORC_WARN * (1 - 0.3 * rage));
  addShape(s, warn, { x: e.x, y: e.y, radius: R.ORC_R, damage: Math.round(orcAxe(s, e)), dirX: toP[0], dirY: toP[1], arc: 0, fx: "bslash", by: "highorc", owner: e.id });
  e.phase = "swing";
  e.timer = warn;
}

/** 새 몬스터면 움직이고 true */
export function updateNewFoe(s: RunState, e: EnemyState, toP: Vec, go: Vec): boolean {
  if (e.kind === "bombbug") bombbug(s, e, go);
  else if (e.kind === "skelarcher") skelarcher(s, e, toP, go);
  else if (e.kind === "chainward") chainward(s, e, toP, go);
  else if (e.kind === "highorc") highorc(s, e, toP, go);
  else return false;
  return true;
}
