// 수집가(테라코어, 시즌 3): 기본 검 + 수집 무기(패시브 30, itemsCollector)로 이어지는 콤보
// 격투가처럼 공격할 때마다 콤보 한 칸: 기본 검 → 얻은 차례대로 등 뒤 수집 무기가 날아 나와 자기 기술 → 다시 기본 검 (잠깐 쉬면 처음부터)
// 수집 무기를 얻을 때마다 콤보가 한 칸 늘어남 · 수치는 weaponsCollector.COLLECTOR · 기술 표는 itemsCollector.CL_ARMS
// 무기마다 공격은 sim/collectorMoves (여러 번 때리는 무기는 clQueue에 다음 칸) · 그리기(render/collector)는 효과 clMove·탄 clShot
import { TICK_RATE } from "../constants";
import { CL_ARMS, type ClArmId } from "../itemsCollector";
import { armMove } from "./collectorMoves";
import { COLLECTOR as R } from "../weaponsCollector";
import { nearest } from "./brawlMoves";
import { inCone, strike } from "./s2Kit";
import type { PlayerState, RunState } from "./types";
import { addEffect, normalize } from "./util";

export const isCollector = (p: PlayerState) => p.characterId === "collector";
const isArm = (id: string): id is ClArmId => id in CL_ARMS;

/** 얻은 수집 무기 (얻은 차례) */
export function collected(p: PlayerState): ClArmId[] {
  const out: ClArmId[] = [];
  for (const id of p.passives) if (isArm(id) && !out.includes(id)) out.push(id);
  return out;
}

/** 등 뒤에 떠 있는 수집 무기 (방금 콤보로 날아 나간 무기는 잠깐 빼고) */
export function armsOnBack(p: PlayerState): ClArmId[] {
  const out = (p.clOutT ?? 0) > 0 ? p.clOut : undefined;
  return collected(p).filter((id) => id !== out);
}

/** 노린 적 쪽으로 돌아섬 → 노린 방향 각 · 노린 자리 */
function aim(s: RunState): [number, number, number] {
  const p = s.player;
  const e = nearest(s, p.stats.range * R.aim);
  const d = e && normalize(e.x - p.x, e.y - p.y);
  if (d) [p.faceX, p.faceY] = d;
  return [Math.atan2(p.faceY, p.faceX), e ? e.x : p.x + p.faceX * 50, e ? e.y : p.y + p.faceY * 50];
}

/** 수집 무기 하나의 k번째 칸 (다음 칸이 있으면 예약) */
function runArm(s: RunState, id: ClArmId, k: number): void {
  const [a, tx, ty] = aim(s);
  const next = armMove(s, id, k, a, tx, ty);
  if (next > 0) (s.player.clQueue ??= []).push({ id, k: k + 1, t: next });
}

/** 예약된 다음 칸들 (여러 번 때리는 무기) */
function runQueue(s: RunState): void {
  const q = s.player.clQueue;
  if (!q?.length) return;
  const due = q.filter((w) => --w.t <= 0);
  s.player.clQueue = q.filter((w) => w.t > 0);
  for (const w of due) if (isArm(w.id)) runArm(s, w.id, w.k);
}

/** 기본 검: 앞을 반원으로 벰 */
function baseSlash(s: RunState): void {
  const p = s.player;
  aim(s);
  for (const e of inCone(s, R.baseReach, R.baseArc)) strike(s, e, p.stats.damage);
  addEffect(s, { kind: "clMove", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: R.baseReach, maxTicks: 12, from: "arc", tint: "#cfe8ff", motif: "clBlade", arc: 1.1, width: 7 });
}

/** 콤보 한 칸 */
function step(s: RunState, id: string): void {
  if (isArm(id)) runArm(s, id, 0);
  else baseSlash(s);
}

/** 콤보 차례: 기본 검 → 얻은 차례대로 수집 무기 */
export const comboList = (p: PlayerState): string[] => ["clBlade", ...collected(p)];

/** 틱마다 (수집가의 검을 들었을 때 player에서): 격투가처럼 공격할 때마다 콤보 다음 칸 · 잠깐 쉬면 처음부터 */
export function collectorTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  runQueue(s);
  if ((p.clOutT ?? 0) > 0) p.clOutT = (p.clOutT ?? 0) - 1;
  // 다음 칸을 쓸 수 있게 된 뒤 이만큼 안 누르면 콤보가 끊김
  if (p.attackCooldown === 0) p.clIdle = (p.clIdle ?? 0) + 1;
  if ((p.clStep ?? 0) > 0 && (p.clIdle ?? 0) > R.reset) p.clStep = 0;
  if (!want || p.attackCooldown > 0) return;
  const list = comboList(p);
  const i = (p.clStep ?? 0) % list.length;
  const id = list[i]!;
  step(s, id);
  // 날아 나간 무기는 잠깐 등 뒤에서 빠짐 (그리기)
  p.clOut = id;
  p.clOutT = R.out;
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / speed) * R.pace));
  p.attackCount++;
  p.clIdle = 0;
  p.clStep = (i + 1) % list.length;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetCollector(p: PlayerState): void {
  for (const k of ["clStep", "clIdle", "clOut", "clOutT", "clQueue"] as const) delete p[k];
}
