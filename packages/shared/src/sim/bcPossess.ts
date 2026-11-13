// 블랑 백무(기본 패시브): 대시 → 3초 동안 세상이 느려지고 공격 범위 안 적(보스 빼고) 머리 위에 방향키 → 맞게 누른 적 몸속으로 (나는 사라지고 무적)
// 조종: 내가 움직이면 그 몸도 같이 · 공격은 그 몬스터 몸으로 (블랑 기본 공격·스킬 없음, 추가 공격은 나감) · 10초가 지나거나 옮겨 타면 그 적에게 큰 한 방 + 앞으로 빠져나옴
// 옮겨 탈 때마다 방향키 +1 · 방향키가 0개인 적은 고르자마자 큰 한 방 · 실패하면 그냥 대시(다음 빙의까지 10초) · 차례 빙의(영혼 전이·종언)도 여기
import { ENEMIES } from "../enemyDefs";
import { BC_LV as L, BC_POSSESS as P0 } from "../itemsBlanc";
import { createRng, deriveSeed } from "../rng";
import { dirOf } from "./bossPrimeval";
import { nrAlive, nrBoss, nrHit } from "./nrKit";
import { restoreShots, slowShots } from "./slowShots";
import type { EnemyState, RunState, TickInput } from "./types";
import { addEffect } from "./util";

type P = RunState["player"];
const SLOW = 4;

export const isBlanc = (p: Pick<P, "characterId">) => p.characterId === "blanc";
/** 지금 몸속에 있는 적 (없으면 null) */
export const bcHostOf = (s: RunState): EnemyState | null => {
  const id = s.player.bcHost;
  return id === undefined ? null : (s.enemies.find((e) => e.id === id && nrAlive(e)) ?? null);
};
/** 빙의할 수 있는 적 (보스·구조물·허수아비·하늘·움직이지 않는 적 빼고) */
export const canHost = (e: EnemyState) => nrAlive(e) && !nrBoss(e) && e.kind !== "dummy" && ENEMIES[e.kind].speed > 0 && !e.air && !e.pw && !e.svBox;
/** 이 적에게 눌러야 할 방향키 수 (영혼의 틈이면 고정 · 날개로 줄어듦 · 옮겨 탈 때마다 늘어남) */
/** 백무 대기 (0~1, 대기 칸 표시용) */
export const bcDanceCd = (p: P) => ((p.bcCd ?? 0) > 0 ? Math.min(1, (p.bcCd ?? 0) / (p.bcCdMax ?? P0.cdFail)) : 0);
export const keysFor = (p: P, e: EnemyState) => Math.max(0, (e.bcRift ? P0.riftKeys : P0.keys) + (p.bcHops ?? 0) * P0.hopKeys - (e.bcCut ?? 0));

/** 고르는 동안 세상이 느려짐 (punk.timeSlowed가 부름): 네 틱에 세 틱 쉼 */
export function bcSlowed(s: RunState): boolean {
  const k = s.player.bcPick;
  return !!k && s.tick < k.until && s.tick % SLOW !== 0;
}

/** 빠져나오며 그 적에게 큰 한 방 */
export function bcExitBlast(s: RunState, e: EnemyState, mul = P0.exitMul): void {
  addEffect(s, { kind: "bcExit", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 30, maxTicks: 24 });
  nrHit(s, e, s.player.stats.damage * mul);
}

/** 몸에서 나옴: 큰 한 방(blast) · 그 적 바로 앞에 나타남 */
export function bcLeave(s: RunState, blast = true): void {
  const p = s.player;
  const e = bcHostOf(s);
  if (e) {
    [p.x, p.y] = [e.x + p.faceX * (e.r + 10), e.y + p.faceY * (e.r + 10)];
    [p.prevX, p.prevY] = [p.x, p.y];
    if (blast) bcExitBlast(s, e);
  }
  for (const k of ["bcHost", "bcHostAt", "bcHostUntil", "bcHops"] as const) delete p[k];
  p.invulnTicks = Math.max(p.invulnTicks, 20);
}

/** 그 적 몸속으로 (이미 다른 몸이면 그 적에게 큰 한 방 후 옮겨 탐 · until: 나와야 하는 틱) */
export function bcEnter(s: RunState, e: EnemyState, until?: number): void {
  const p = s.player;
  const old = bcHostOf(s);
  if (old && old.id !== e.id) {
    bcExitBlast(s, old);
    p.bcHops = (p.bcHops ?? 0) + 1;
  }
  p.bcHost = e.id;
  p.bcHostAt = s.tick;
  p.bcHostUntil = until ?? (old ? (p.bcHostUntil ?? s.tick + P0.life) : s.tick + P0.life);
  [p.x, p.y, p.prevX, p.prevY] = [e.x, e.y, e.x, e.y];
  addEffect(s, { kind: "bcSeize", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 26, maxTicks: 30 });
}

/** 빙의 고르기 끝 (ok: 성공) */
function endPick(s: RunState, ok: boolean): void {
  const p = s.player;
  const k = p.bcPick;
  if (!k) return;
  restoreShots(s, k.frozen, 1 / SLOW);
  delete p.bcPick;
  p.bcCd = p.bcCdMax = ok ? P0.cdOk : P0.cdFail;
}

/** 대시를 막 눌렀을 때: 공격 범위 안 적들에게 방향키 (0개인 적은 바로 큰 한 방) */
function startPick(s: RunState): void {
  const p = s.player;
  const host = bcHostOf(s);
  if (host && s.tick - (p.bcHostAt ?? 0) < P0.hop) return;
  const cands: [number, number[]][] = [];
  for (const e of s.enemies) {
    if (!canHost(e) || e.id === host?.id || (e.x - p.x) ** 2 + (e.y - p.y) ** 2 > (P0.range + e.r) ** 2) continue;
    const n = keysFor(p, e);
    if (n <= 0) {
      bcExitBlast(s, e);
      continue;
    }
    const rng = createRng(deriveSeed(s.seed, "bcKeys", e.id, s.tick));
    cands.push([e.id, Array.from({ length: n }, () => rng.int(0, 3))]);
  }
  if (!cands.length) return;
  p.bcPick = { until: s.tick + P0.pick, cands, at: 0, last: -1, fresh: true, frozen: slowShots(s, undefined, 1 / SLOW) };
}

/** 고르는 동안 (bossBinds.bindInput이 부름): 이동 대신 방향 누르기 (새로 누른 방향만) · 틀린 적은 빠짐 · 다 누른 적 몸속으로 */
export function bcInput(s: RunState, input: TickInput): TickInput {
  const k = s.player.bcPick;
  if (!k) return input;
  if (s.tick >= k.until) {
    endPick(s, false);
    return input;
  }
  k.frozen = slowShots(s, k.frozen, 1 / SLOW);
  const d = dirOf(input.moveX / 100, input.moveY / 100);
  if (k.fresh) {
    // 대시 때 누르고 있던 방향은 손을 뗄 때까지 셈하지 않음
    if (d < 0) delete k.fresh;
    k.last = d;
  } else if (d >= 0 && d !== k.last) {
    k.cands = k.cands.filter(([, seq]) => seq[k.at] === d);
    k.at++;
    const done = k.cands.find(([, seq]) => seq.length <= k.at);
    const e = done && s.enemies.find((f) => f.id === done[0] && canHost(f));
    if (e) {
      endPick(s, true);
      bcEnter(s, e);
    } else if (!k.cands.length) endPick(s, false);
  }
  k.last = d;
  return { ...input, moveX: 0, moveY: 0, dash: false };
}

/** 차례 빙의 시작 (영혼 전이 · 종언): ids 차례로 stay틱씩 · later가 있으면 끝나고 살아남은 적에게 한 번 더 */
export function bcChainStart(s: RunState, ids: number[], stay: number, later?: number): void {
  if (!ids.length) return;
  endPick(s, true);
  s.player.bcChain = { ids: [...ids], stay, all: [...ids], ...(later ? { later } : {}) };
  chainNext(s);
}

/** 차례 빙의 다음 적 (보스·빙의 못 하는 적은 큰 한 방만) · 다 돌면 빠져나옴 */
function chainNext(s: RunState): void {
  const p = s.player;
  const c = p.bcChain;
  if (!c) return;
  while (c.ids.length) {
    const e = s.enemies.find((f) => f.id === c.ids[0] && nrAlive(f));
    c.ids.shift();
    if (!e) continue;
    if (!canHost(e)) {
      bcExitBlast(s, e);
      continue;
    }
    bcEnter(s, e, s.tick + c.stay);
    return;
  }
  bcLeave(s);
  if (c.later) {
    const dmg = p.stats.damage * P0.exitMul;
    for (const id of c.all) (p.bcLaters ??= []).push({ id, at: s.tick + c.later, dmg, big: true });
  }
  delete p.bcChain;
}

/** 조종 공격: 그 몬스터 몸으로 앞을 들이받음 (몸 피해가 클수록 셈 · 그 몸은 맞지 않음) */
export function bcHostAttack(s: RunState, e: EnemyState): number {
  const p = s.player;
  const r = e.r + P0.hostR;
  const [x, y] = [e.x + p.faceX * e.r, e.y + p.faceY * e.r];
  const dmg = p.stats.damage * L.mid * (1 + ENEMIES[e.kind].contactDamage / P0.hostDiv);
  for (const f of s.enemies) if (f.id !== e.id && nrAlive(f) && (f.x - x) ** 2 + (f.y - y) ** 2 <= (r + f.r) ** 2) nrHit(s, f, dmg);
  addEffect(s, { kind: "bcHostHit", x, y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 14 });
  return P0.hostCd;
}

/** 틱마다: 대시를 누르면 고르기 · 몸속이면 그 몸이 나를 따라옴(그 적은 멈춤 · 나는 무적) · 시간이 다 되면 빠져나옴 */
export function bcPossessTick(s: RunState): void {
  const p = s.player;
  if ((p.bcCd ?? 0) > 0) p.bcCd = (p.bcCd ?? 0) - 1;
  const dashing = p.dashTicks > 0;
  if (dashing && !p.bcDashWas && !p.bcPick && !p.bcChain && (p.bcCd ?? 0) <= 0 && !s.pvp && !s.pw) startPick(s);
  p.bcDashWas = dashing;
  if (p.bcHost === undefined) return;
  const e = bcHostOf(s);
  if (!e) {
    if (p.bcChain) return chainNext(s);
    return bcLeave(s, false);
  }
  if (s.tick >= (p.bcHostUntil ?? 0)) {
    if (p.bcChain) return chainNext(s);
    return bcLeave(s);
  }
  p.invulnTicks = Math.max(p.invulnTicks, 2);
  e.stunTicks = Math.max(e.stunTicks ?? 0, 2);
  [e.x, e.y] = [p.x, p.y];
  if (Math.abs(p.faceX) > 0.1) e.dirX = p.faceX;
}
