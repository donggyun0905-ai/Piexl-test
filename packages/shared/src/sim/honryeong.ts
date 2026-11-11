// 혼령(실베르): 누르면 곰방대에서 보랏빛 연기용을 앞으로 내뿜음 (앞 줄 위 적 모두, 무기마다 길이·속성 weaponsHonryeong.HR_STYLE)
// 공격할 때마다 방 어딘가에 연기 구름 (30개까지·10초) → 구름 안이면 은신: 적이 쫓아오지만 내 자리를 정확히 겨누지 못함 (sim/enemies가 hrLure로 목표를 바꿈)
// 공격마다 전용 아이템 소환(sim/hrBeasts 늑대·범·분신 · sim/hrSpirits 부엉이·용) · 구름 효과(혼-귀 공포(보스 제외)·짙은 연기·깊은 들숨)
import { ENEMIES } from "../enemyDefs";
import { HONRYEONG_PERKS as K } from "../itemsHonryeong";
import { HR_CLOUD as C } from "../weaponsHonryeong";
import { healPlayer } from "./combat";
import { applyBleed, updateBleed } from "./gunExtras";
import { beastsTick, summonOnAttack } from "./hrBeasts";
import { addCloud, hasHr, hrHit as hrHit_, hrRoll, inCloud, styleOf } from "./hrKit";
import { spiritsOnAttack, spiritsTick } from "./hrSpirits";
import { alive } from "./shadowingSpirits";
import { ignite } from "./status";
import type { EnemyState, RunState } from "./types";
import { addEffect, reachOf } from "./util";
import { srcFn } from "./dmgSrc";
const hrHit = srcFn("honryeong", () => hrHit_);

type P = RunState["player"];

export { cloudR, hrLure, huntOn, isHonryeong } from "./hrKit";
export { dragonTicks } from "./hrSpirits";

const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;

/** 무기 속성 (맞은 적) */
function status(s: RunState, e: EnemyState, dmg: number): void {
  const st = styleOf(s.player);
  if (!st.status || e.hp <= 0 || st.status === 4) return;
  if (st.chance < 1 && hrRoll(s, "hrStatus") >= st.chance) return;
  if (st.status === 1) ignite(e, dmg);
  else if (st.status === 2) e.slowTicks = Math.max(e.slowTicks ?? 0, st.ticks);
  else if (st.status === 3) {
    e.poisonTicks = Math.max(e.poisonTicks ?? 0, st.ticks);
    e.poisonDmg = Math.max(e.poisonDmg ?? 0, dmg * C.poison);
  } else if (st.status === 5) e.stunTicks = Math.max(e.stunTicks ?? 0, st.ticks);
  else if (st.status === 6) applyBleed(e);
}

/** 연기용 내뿜기: 앞 줄 위 적 모두 */
function strike(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  const k = reachOf(p);
  const reach = st.reach * k;
  const dmg = p.stats.damage * st.mul;
  let hits = 0;
  for (const e of s.enemies) {
    if (!alive(e)) continue;
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const along = dx * p.faceX + dy * p.faceY;
    if (along < -e.r || along > reach + e.r || Math.abs(dx * p.faceY - dy * p.faceX) > st.half * k + e.r) continue;
    hrHit(s, e, dmg, p.faceX, p.faceY);
    status(s, e, dmg);
    hits++;
  }
  // 약초: 적을 맞히면 확률로 회복
  if (st.status === 4 && hits > 0 && hrRoll(s, "hrHerb") < st.chance) healPlayer(s, st.ticks);
  addEffect(s, { kind: "hrBreath", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: reach, style: st.status, maxTicks: 20 });
}

/** 구름: 사라짐 · 은신 · 혼-귀 공포 · 짙은 연기 피해 · 깊은 들숨 회복 */
function cloudsTick(s: RunState): void {
  const p = s.player;
  const list = p.hrClouds ?? [];
  for (const c of list) c.age++;
  if (list.length && list[0]!.age >= C.life) p.hrClouds = list.filter((c) => c.age < C.life);
  p.hrHidden = inCloud(p, p.x, p.y);
  if (p.hrHidden && hasHr(p, "hrBreath") && s.tick % K.hrBreath.every === 0) healPlayer(s, K.hrBreath.heal);
  const fear = hasHr(p, "hrFear") && s.tick % K.hrFear.every === 0;
  const dot = hasHr(p, "hrThick") && s.tick % K.hrThick.every === 0;
  if (!fear && !dot) return;
  for (const e of s.enemies) {
    if (!alive(e) || !inCloud(p, e.x, e.y, e.r)) continue;
    if (dot) hrHit(s, e, p.stats.damage * K.hrThick.dot, 0, 0);
    if (fear && e.hp > 0 && !ENEMIES[e.kind].boss && (e.fearTicks ?? 0) <= 0 && hrRoll(s, "hrFear") < K.hrFear.chance) {
      e.fearTicks = K.hrFear.ticks;
      addEffect(s, { kind: "hrFear", x: e.x, y: e.y - e.r, dirX: 0, dirY: 0, size: e.r, maxTicks: 30 });
    }
  }
}

/** 틱마다 (곰방대를 들었을 때 player에서) */
export function honryeongTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const key = roomKey(s);
  const moved = p.hrRoom !== key;
  if (moved) {
    p.hrRoom = key;
    p.hrClouds = [];
    p.hrOwls = [];
    p.hrDecoys = [];
    p.hrBit = [];
    delete p.hrDragon;
  }
  if ((p.hrCd ?? 0) > 0) p.hrCd = (p.hrCd ?? 0) - 1;
  if (want && (p.hrCd ?? 0) <= 0) {
    const st = styleOf(p);
    p.hrCd = Math.max(6, Math.round(st.cd / Math.max(0.3, speed)));
    p.attackCount++;
    p.hrAtkAt = s.tick;
    strike(s);
    for (let i = 0; i < st.clouds; i++) addCloud(s);
    summonOnAttack(s);
    spiritsOnAttack(s);
  }
  cloudsTick(s);
  beastsTick(s, moved);
  spiritsTick(s);
  if (styleOf(p).status === 6 || hasHr(p, "hrHunt")) updateBleed(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetHonryeong(p: P): void {
  for (const k of ["hrCd", "hrRoom", "hrAtkAt", "hrClouds", "hrBeasts", "hrOwls", "hrDecoys", "hrDragon", "hrHidden", "hrRolls", "hrNext", "hrBit"] as const) delete p[k];
}
