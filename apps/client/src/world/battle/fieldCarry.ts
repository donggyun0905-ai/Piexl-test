// 지도 전투 사이에 이어지는 캐릭터 상태 (2026-11-16 사용자: 스택·영혼·레벨처럼 판 내내 키우는 능력이 싸울 때마다 0이 되던 것)
// 끝난 판을 그대로 보관 → 다음 판에 캐릭터 상태·시간·적 번호·처치 수·돈을 넣음 (같은 캐릭터만 · 쓰러지면 처음부터)
// 레벨업 능력치(거짓된 용사·아슈바르): 판 안이면 다음 틱 입력으로, 판 밖이면 보관한 판에 바로 찍음 (sim/novice spendStat)
import { spendStat, type CharacterId, type RunState } from "@pixel-rogue/shared";
import type { BattlePad } from "./battleInput";

let carry: RunState | null = null;
/** 지금 열린 판의 입력 (없으면 판 밖) · 지금 열린 판 */
let live: { pad: BattlePad; run: RunState } | null = null;

/** 다음 판에 넣을 상태 (같은 캐릭터일 때만) */
export const carryFor = (who: CharacterId): RunState | null => (carry?.player.characterId === who ? carry : null);
/** 판이 끝남: 쓰러졌으면 버림 */
export function keepCarry(run: RunState, down: boolean): void {
  carry = down ? null : run;
}
export function setLive(v: { pad: BattlePad; run: RunState } | null): void {
  live = v;
}
/** 능력치 화면이 읽을 판 (열린 판 → 보관한 판) */
export const statRun = (): RunState | null => live?.run ?? carry;

/** 능력치 한 점 (NovicePanel·NoirPanel의 queueStat) */
export function pickStat(k: number): void {
  if (live) live.pad.stat = k;
  else if (carry) spendStat(carry, k);
}

/** 다음 판에 이어 넣기: 캐릭터 상태(깊은 복사) · 시간 · 적 번호 · 처치 수 · 돈 · 방마다 새로 시작하는 값은 지움 (sim/rooms enterRoom과 같게) */
export function applyCarry(s: RunState, c: RunState): void {
  const p = structuredClone(c.player);
  for (const k of Object.keys(p)) if (k.endsWith("Room")) delete (p as unknown as Record<string, unknown>)[k];
  delete p.smGas;
  delete p.rdFire;
  s.player = p;
  s.tick = c.tick;
  s.nextId = Math.max(s.nextId, c.nextId);
  s.kills = c.kills;
  s.gold = c.gold;
}
