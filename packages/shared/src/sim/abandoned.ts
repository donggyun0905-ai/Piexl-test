// 버려진 자들: 한 캐릭터 안의 세 아이(P1 방패 · P2 총 · P3 검). 대시 버튼 = 탭(다음 아이와 자리를 바꿔 교대, 짧은 무적)
// 나와 있지 않은 두 아이는 곁에서 따로 싸움(abandonedKids). 아이마다 자기 콤보 순번을 기억. 무기의 조합(3단계)대로 치고 탭하면 단계 끝(P3)에 두 아이가 특수기(abandonedShow)
// 차례를 다 치면 탭을 기다리고, 탭을 잘못 누르면 조합·콤보가 모두 처음으로 돌아가고 P1로 강제 교대 (무적 없음). 공격 속도는 오르지 않음 (무기 값 그대로). 기술은 abandonedMoves, 무기 표는 weaponsAbandoned
import { TICK_RATE } from "../constants";
import { ABANDONED_PERKS as K } from "../itemsAbandoned";
import { ABANDONED as A, TAG_SETS, type TagMoveKind, type TagSet } from "../weaponsAbandoned";
import { doTagMove } from "./abandonedMoves";
import { kidsOf, swapKid, updateKids } from "./abandonedKids";
import { startShow, updateShow } from "./abandonedShow";
import { healPlayer } from "./combat";
import { applyBleed } from "./gunExtras";
import type { PlayerState, RunState } from "./types";
import { addEffect, hasPerk, weaponOf } from "./util";

export const tagSet = (p: PlayerState): TagSet => TAG_SETS[weaponOf(p).tag ?? "street"] ?? TAG_SETS.street!;

/** 이 단계 순서: 0·1·2 = 그 아이가 한 번 침, -1 = 탭 */
export function stageTokens(set: TagSet, stage: number): number[] {
  const out: number[] = [];
  set.stages[stage]!.forEach((n, m) => {
    if (m > 0) out.push(-1);
    for (let i = 0; i < n; i++) out.push(m);
  });
  return out;
}

/** 순서 하나 기록: 맞음 ok · 이번 단계를 끝까지 맞춤 done (특수기) · 틀림 miss (단계를 다 맞춘 뒤 P3 탭 말고 다른 것도 틀림) */
function record(p: PlayerState, set: TagSet, ev: number): "ok" | "done" | "miss" {
  if (p.abDone) return "miss";
  const toks = stageTokens(set, p.abStage ?? 0);
  const pos = p.abPos ?? 0;
  if (toks[pos] !== ev) return "miss";
  p.abPos = pos + 1;
  if (p.abPos < toks.length) return "ok";
  p.abDone = true;
  return "done";
}

/** 틀림: 조합·세 아이 콤보 모두 처음으로, P1로 강제 교대 (무적 없음) */
function miss(s: RunState): void {
  const p = s.player;
  p.abStage = p.abPos = p.abSeg = 0;
  p.abStep = [0, 0, 0];
  p.abDone = false;
  p.abMiss = A.missTicks;
  swapKid(s, 0);
  p.abM = 0;
  addEffect(s, { kind: "tagMiss", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 10, maxTicks: A.missTicks });
}

/** 아이마다 피해 배율 (전용 아이템) */
function memberMul(p: PlayerState, m: number): number {
  if (m === 1 && hasPerk(p, "lastMag")) return K.lastMag.damage;
  if (m === 2 && hasPerk(p, "rustyEdge")) return K.rustyEdge.damage;
  return 1;
}

const buff = (p: PlayerState) => ((p.abBuff ?? 0) > 0 ? K.threeAsOne.damage : 1);

/** 탭: 다음 아이와 자리를 바꿔 교대 (무적 · 교대 일격). 단계를 다 맞춘 P3에서 탭하면 다음 단계, 순서가 틀리면 처음으로. 대시 시간(틱)을 돌려줌 (자리를 바꾸니 0) */
export function abandonedTag(s: RunState): number {
  const p = s.player;
  const from = p.abM ?? 0;
  if (from === 2 ? !p.abDone : record(p, tagSet(p), -1) === "miss") {
    miss(s);
    return 0;
  }
  if (from === 2) {
    p.abStage = ((p.abStage ?? 0) + 1) % 3;
    p.abPos = 0;
    p.abDone = false;
  }
  swapKid(s, (from + 1) % 3);
  p.abM = (from + 1) % 3;
  p.abSeg = 0;
  p.invulnTicks = Math.max(p.invulnTicks, hasPerk(p, "quickSwap") ? K.quickSwap.ticks : A.tagInvuln);
  if (hasPerk(p, "tagStrike")) {
    const kind: TagMoveKind = p.abM === 0 ? "bash" : p.abM === 1 ? "shot" : "slash";
    doTagMove(s, { kind, mul: 1 }, p.stats.damage * K.tagStrike.mul * buff(p));
  }
  addEffect(s, { kind: "tagSwap", x: p.x, y: p.y, dirX: p.abM, dirY: 0, size: 10, maxTicks: 14 });
  return 0;
}

/** 틱마다 (버려진 자들 무기를 들었을 때 player에서). want = 공격 키. 공격 속도는 무기 값 그대로 */
export function abandonedTick(s: RunState, want: boolean): void {
  const p = s.player;
  if ((p.abGuard ?? 0) > 0) p.abGuard = (p.abGuard ?? 0) - 1;
  if ((p.abBuff ?? 0) > 0) p.abBuff = (p.abBuff ?? 0) - 1;
  if ((p.abMiss ?? 0) > 0) p.abMiss = (p.abMiss ?? 0) - 1;
  updateKids(s);
  updateShow(s);
  const set = tagSet(p);
  // 탭을 누를 수 없는 공격자(타워·두 번째 무기)는 조합대로 스스로 교대
  if (p.abAuto && p.attackCooldown === 0 && (p.abSeg ?? 0) >= set.stages[p.abStage ?? 0]![p.abM ?? 0]!) abandonedTag(s);
  if (!want || p.attackCooldown > 0) return;
  const m = p.abM ?? 0;
  // 이 아이 차례를 다 쳤으면 탭을 기다림 (더 눌러도 공격이 나가지 않아, 틀리는 건 탭을 잘못 눌렀을 때뿐)
  if (p.abDone || (p.abSeg ?? 0) >= set.stages[p.abStage ?? 0]![m]!) return;
  const steps = (p.abStep ??= [0, 0, 0]);
  const list = set.moves[m]!;
  const i = (steps[m] ?? 0) % list.length;
  const mv = list[i]!;
  const before = m === 2 && hasPerk(p, "rustyEdge") ? new Map(s.enemies.map((e) => [e, e.hp])) : null;
  doTagMove(s, mv, p.stats.damage * mv.mul * memberMul(p, m) * buff(p));
  if (before) for (const [e, hp] of before) if (e.hp < hp) applyBleed(e);
  steps[m] = (i + 1) % list.length;
  p.abSeg = (p.abSeg ?? 0) + 1;
  p.attackCount++;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / weaponOf(p).attackSpeed));
  const r = record(p, set, m);
  if (r === "done") special(s, set);
  else if (r === "miss") miss(s);
}

/** 단계 특수기: 곁에서 싸우던 두 아이의 연출 공격 */
function special(s: RunState, set: TagSet): void {
  const p = s.player;
  const spc = set.specials[p.abStage ?? 0]!;
  const dmg = p.stats.damage * spc.mul * (hasPerk(p, "alleyBond") ? K.alleyBond.damage : 1) * buff(p);
  kidsOf(s);
  startShow(s, spc, dmg);
  if (hasPerk(p, "grewTogether")) healPlayer(s, p.stats.maxHp * K.grewTogether.heal);
  if (hasPerk(p, "threeAsOne")) p.abBuff = K.threeAsOne.ticks;
}

/** 받는 피해 배율: 막기 · 맏이의 방패(P1이 나와 있을 때) */
export function abandonedTaken(p: PlayerState): number {
  if (p.characterId !== "abandoned") return 1;
  return ((p.abGuard ?? 0) > 0 ? A.guardTaken : 1) * ((p.abM ?? 0) === 0 && hasPerk(p, "eldestShield") ? K.eldestShield.taken : 1);
}

/** 처음으로 (무기 바꾸기·연습장 초기화) */
export function resetAbandoned(p: PlayerState): void {
  p.abM = p.abStep = p.abStage = p.abPos = p.abMiss = p.abDone = p.abSeg = p.abGuard = p.abBuff = p.abKids = p.abShow = undefined;
}

/** 자동 공격이 닿는 거리 배율: 총 아이(P2)가 나와 있으면 총알이 날아가는 거리만큼 (사거리 × 3) */
export const tagReachMul = (p: PlayerState): number => (p.characterId === "abandoned" && (p.abM ?? 0) === 1 ? 3 : 1);
