// 인형술사(실베르): 마우스 자리가 곧 손(손이 닿는 거리까지). 짧게 클릭 = 손 크기만큼 실을 내리쳐 공격
// 꾹 누르기 = 손 아래 적(보스 빼고)에게 실을 걸어 조종 게이지를 채움 → 가득 차면 나무 왕관을 쓴 아군이 됨 (최대 3)
// 게이지를 채우는 동안 그 적이 피해를 받거나 나를 때리면 0으로 · 손이 떠나면 조금씩 줄어듦. 아군은 sim/puppetAllies, 패시브는 puppetDolls·puppetFriends
import { ENEMIES } from "../enemyDefs";
import { PUPPET_PERKS as K } from "../itemsPuppet";
import { PUPPET_HAND as H } from "../weaponsPuppet";
import { actingFoe } from "./moonlight";
import { alliesTick, crownFoe } from "./puppetAllies";
import { afterStrike, dollsTick } from "./puppetDolls";
import { cloneOnHurt, friendsTick } from "./puppetFriends";
import { alive, damageEnemyLite } from "./shadowingSpirits";
import type { EnemyState, RunState } from "./types";
import { addEffect, hasPerk, normalize, reachOf } from "./util";

type P = RunState["player"];

export const isPuppeteer = (p: P) => p.characterId === "puppeteer";
/** 손이 닿는 거리 · 손 크기 (사거리 증가·긴 실만큼) */
export const handReach = (p: P) => H.reach * reachOf(p) * (hasPerk(p, "ppLong") ? K.ppLong.reach : 1);
export const handSize = (p: P) => H.handR * reachOf(p) * (hasPerk(p, "ppLong") ? K.ppLong.size : 1);
/** 왕관 최대 수 */
export const crownCap = (p: P) => H.crowns + (hasPerk(p, "ppCrown") ? K.ppCrown.more : 0);
const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;

/** 조종할 수 있는 적 (보스·구조물·허수아비·하늘에 뜬 적 빼고) */
export function charmable(e: EnemyState): boolean {
  const d = ENEMIES[e.kind];
  return alive(e) && !d.boss && d.speed > 0 && e.kind !== "dummy" && !e.air && !e.pw && !e.svBox && !e.noGold;
}

/** 손 자리: 조준 방향 × 누른 곳까지 거리 · 자동 조준이면 그 적 자리 */
function handPoint(s: RunState): [number, number] | null {
  const p = s.player;
  if (p.pwAimD === undefined) {
    const e = s.enemies.find((f) => f.id === s.autoTargetId && alive(f));
    return e ? [e.x, e.y] : null;
  }
  const d = Math.min(p.pwAimD, handReach(p));
  return [p.x + p.faceX * d, p.y + p.faceY * d];
}

/** 손 아래 적 (가까운 것 하나) */
function underHand(s: RunState, x: number, y: number, ok: (e: EnemyState) => boolean): EnemyState | null {
  const r = handSize(s.player);
  let best: EnemyState | null = null;
  let bd = Infinity;
  for (const e of s.enemies) {
    if (!ok(e)) continue;
    const d = (e.x - x) ** 2 + (e.y - y) ** 2;
    if (d <= (r + e.r) ** 2 && d < bd) {
      bd = d;
      best = e;
    }
  }
  return best;
}

/** 실 내리치기: 손 크기 안의 적 모두 */
export function strike(s: RunState, x: number, y: number): void {
  const p = s.player;
  const r = handSize(p);
  const hit: EnemyState[] = [];
  for (const e of s.enemies) {
    if (!alive(e) || (e.x - x) ** 2 + (e.y - y) ** 2 > (r + e.r) ** 2) continue;
    const d = normalize(e.x - x, e.y - y) ?? [0, 0];
    damageEnemyLite(s, e, p.stats.damage * H.strikeMul, d[0], d[1]);
    hit.push(e);
  }
  p.attackCount++;
  addEffect(s, { kind: "ppStrike", x, y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 16 });
  afterStrike(s, x, y, hit);
}

/** 조종 게이지 채우기 (가득 차면 왕관) */
function charm(s: RunState, e: EnemyState, speed: number): void {
  const p = s.player;
  if (p.ppTarget !== e.id) {
    p.ppTarget = e.id;
    e.ppSeen = e.hp;
  }
  // 그 적이 피해를 받았으면 처음부터
  if (e.hp < (e.ppSeen ?? e.hp)) e.ppCharm = 0;
  e.ppSeen = e.hp;
  const slow = Math.min(H.slowMax, 1 + e.maxHp / H.hpRef);
  const fill = (speed * (hasPerk(p, "ppSpool") ? K.ppSpool.fill : 1)) / (H.charmTicks * slow);
  e.ppCharm = Math.min(1, (e.ppCharm ?? 0) + fill);
  if (e.ppCharm >= 1 && (p.ppAllies?.length ?? 0) < crownCap(p)) crownFoe(s, e);
}

/** 손이 떠난 적의 게이지는 조금씩 줄어듦 */
function decay(s: RunState, keep: number | undefined): void {
  const d = H.decay * (hasPerk(s.player, "ppSpool") ? K.ppSpool.decay : 1);
  for (const e of s.enemies) if ((e.ppCharm ?? 0) > 0 && e.id !== keep) e.ppCharm = Math.max(0, (e.ppCharm ?? 0) - d);
}

/** 틱마다 (인형술사 손을 들었을 때 player에서) */
export function puppetTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const key = roomKey(s);
  const moved = p.ppRoom !== key;
  p.ppRoom = key;
  if (moved) {
    p.ppDolls = [];
    p.ppSpots = [];
  }
  const h = handPoint(s);
  if (h) [p.ppHx, p.ppHy] = h;
  else delete p.ppHx;
  if ((p.ppCd ?? 0) > 0) p.ppCd = (p.ppCd ?? 0) - 1;
  const full = (p.ppAllies?.length ?? 0) >= crownCap(p);
  let held: number | undefined;
  if (h && want) {
    p.ppHold = (p.ppHold ?? 0) + 1;
    const auto = p.pwAimD === undefined;
    // 자동 조준: 조종할 수 있으면 조종, 아니면 계속 내리침
    const target = !full && (auto || (p.ppHold ?? 0) >= H.tap) ? underHand(s, h[0], h[1], charmable) : null;
    if (target) {
      held = target.id;
      charm(s, target, speed);
    } else if (auto && (p.ppCd ?? 0) <= 0) doStrike(s, h, speed);
  } else {
    // 짧게 눌렀다 뗌 = 실 내리치기
    if (h && (p.ppHold ?? 0) > 0 && (p.ppHold ?? 0) < H.tap && (p.ppCd ?? 0) <= 0) doStrike(s, h, speed);
    p.ppHold = 0;
  }
  if (held === undefined) delete p.ppTarget;
  decay(s, held);
  alliesTick(s, moved);
  friendsTick(s, moved);
  dollsTick(s);
}

function doStrike(s: RunState, h: [number, number], speed: number): void {
  s.player.ppCd = Math.max(4, Math.round(H.strikeCd / Math.max(0.5, speed)));
  strike(s, h[0], h[1]);
}

/** 맞았을 때 (classTaken): 조종 중인 적이 나를 때렸으면 게이지 0 · 분신 */
export function puppetHurt(s: RunState): void {
  const p = s.player;
  if (!isPuppeteer(p)) return;
  const f = actingFoe();
  if (f && f.id === p.ppTarget) f.ppCharm = 0;
  cloneOnHurt(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetPuppet(p: P): void {
  for (const k of ["ppHx", "ppHy", "ppHold", "ppCd", "ppTarget", "ppAllies", "ppDolls", "ppSpots", "ppNext", "ppGolem", "ppGolemCd", "ppClone", "ppCloneCd", "ppRoom", "ppCrowned"] as const) delete p[k];
}
