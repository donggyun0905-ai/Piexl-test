// 맞으면 뒤로 밀림 (타격감): 몇 틱에 걸쳐 미끄러지듯 밀림 · 치명타는 더 멀리 · 정예는 절반 · 보스·돌진 중인 적은 안 밀림
// 연타는 밀지 않음: 짧은 간격으로 다시 맞으면 미끄러짐을 멈추고 더 밀지 않음 · 소환수·빔·연사 캐릭터·작은 조각 피해도 밀지 않음
import { ENEMIES } from "../enemyDefs";
import type { EnemyState, RunState } from "./types";
import { keepInRoom, roomGrid } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 밀리는 거리 (보통 · 치명타) · 몇 틱에 걸쳐 */
  DIST: 10,
  CRIT: 16,
  TICKS: 6,
  /** 이 틱 안에 다시 맞으면 연타로 보고 밀지 않음 */
  GAP: 24,
  /** 플레이어 공격력의 이 비율보다 작은 피해(조각·도트)는 밀지 않음 */
  MIN_HIT: 0.6,
  /** 정예(주황) 밀리는 비율 */
  CHAMP: 0.5,
  /** 기본 공격 속도가 이 이상인 캐릭터(연사)는 밀지 않음 */
  FAST: 2.6,
};
export { R as KNOCK_RULES };

/** 연타가 기본인 캐릭터 (소환수·빔·회전체·연속 콤보·표창) */
const MULTI = new Set(["ninja", "summoner", "engineer", "doctor", "elementalist", "brawler"]);

/** 맞음 (combat.damageEnemy) */
export function knock(s: RunState, e: EnemyState, dirX: number, dirY: number, dmg: number, crit: boolean): void {
  const p = s.player;
  const again = (e.kbCd ?? 0) > 0;
  e.kbCd = R.GAP;
  if (again) {
    e.kbT = 0;
    return;
  }
  if (ENEMIES[e.kind].boss || (e.kind === "charger" && e.phase === "charge")) return;
  if (MULTI.has(p.characterId) || p.stats.attackSpeed >= R.FAST || dmg < p.stats.damage * R.MIN_HIT) return;
  const dist = (crit ? R.CRIT : R.DIST) * (e.champ ? R.CHAMP : 1);
  e.kbX = (dirX * dist) / R.TICKS;
  e.kbY = (dirY * dist) / R.TICKS;
  e.kbT = R.TICKS;
}

/** 틱마다 (enemies): 미끄러지며 밀림 */
export function knockTick(s: RunState, e: EnemyState): void {
  if ((e.kbCd ?? 0) > 0) e.kbCd = (e.kbCd ?? 0) - 1;
  if ((e.kbT ?? 0) <= 0) return;
  e.kbT = (e.kbT ?? 0) - 1;
  e.x += e.kbX ?? 0;
  e.y += e.kbY ?? 0;
  keepInRoom(e, roomGrid(s));
}
