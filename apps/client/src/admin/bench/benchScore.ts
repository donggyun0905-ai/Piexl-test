// 관리자 AI 측정 평가: 여러 판 평균 · 종합 점수(0~100)와 등급 · 표 붙여넣기용 글자
import { TICK_RATE, type CharacterId } from "@pixel-rogue/shared";
import type { BenchRow } from "./benchRun";

/** 점수 비중 (합 100): 로그 클리어 시간 · 쓰러진 횟수 · 최종보스 잡은 시간 · 최종보스에서 쓰러진 횟수 */
const W = { clear: 35, deaths: 15, boss: 35, bossDeaths: 15 };
/** 등급 점수 아래 끝 */
const GRADES: readonly [string, number][] = [["S", 85], ["A", 70], ["B", 55], ["C", 40], ["D", 0]];

/** 캐릭터 하나의 평균 줄 (runs = 돌린 판 수 · cleared·bossWins = 그중 깬 판) */
export interface BenchAvg extends Omit<BenchRow, "bossCleared"> {
  runs: number;
  cleared: number;
  bossWins: number;
  score: number;
  grade: string;
}

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

/** 판마다 줄 → 캐릭터마다 평균 (시간은 깬 판만 평균) */
export function averageRows(rows: readonly BenchRow[]): BenchAvg[] {
  const by = new Map<CharacterId, BenchRow[]>();
  for (const r of rows) by.set(r.character, [...(by.get(r.character) ?? []), r]);
  const out: BenchAvg[] = [];
  for (const [character, rs] of by) {
    const won = rs.filter((r) => r.clearTicks > 0);
    const boss = rs.filter((r) => r.bossCleared);
    const m = (k: keyof BenchRow, from = rs) => mean(from.map((r) => Number(r[k])));
    out.push({
      character, runs: rs.length, cleared: won.length, bossWins: boss.length,
      clearTicks: m("clearTicks", won), floor: m("floor"), deaths: m("deaths"), dealt: m("dealt"), fightTicks: m("fightTicks"), taken: m("taken"), healed: m("healed"), skips: m("skips"),
      bossDeaths: m("bossDeaths"), bossTicks: m("bossTicks", boss.length ? boss : rs), bossPct: m("bossPct"), bossDealt: m("bossDealt"), bossTaken: m("bossTaken"),
      score: 0, grade: "D",
    });
  }
  // 종합 점수: 가장 빠른 캐릭터를 기준으로 얼마나 가까운지 (못 깼으면 그 몫은 진행한 만큼만)
  const bestClear = Math.min(...out.filter((r) => r.cleared).map((r) => r.clearTicks), Infinity);
  const bestBoss = Math.min(...out.filter((r) => r.bossWins).map((r) => r.bossTicks), Infinity);
  for (const r of out) {
    const clear = r.cleared ? bestClear / r.clearTicks : (r.floor / 6) * 0.3;
    const boss = r.bossWins ? bestBoss / r.bossTicks : (r.bossPct / 100) * 0.3;
    r.score = Math.round(W.clear * clear + W.deaths / (1 + r.deaths / 10) + W.boss * boss + (r.cleared ? W.bossDeaths / (1 + r.bossDeaths / 10) : 0));
    r.grade = GRADES.find(([, min]) => r.score >= min)![0];
  }
  return out.sort((a, b) => b.score - a.score);
}

/** 초당 피해 (싸운 시간 기준) */
export const dps = (r: Pick<BenchRow, "dealt" | "fightTicks">) => (r.fightTicks > 0 ? (r.dealt / r.fightTicks) * TICK_RATE : 0);

/** 분:초 (0이면 -) */
export const mmss = (ticks: number) => (ticks > 0 ? `${Math.floor(ticks / TICK_RATE / 60)}:${String(Math.floor(ticks / TICK_RATE) % 60).padStart(2, "0")}` : "-");

/** 표 붙여넣기용 (탭으로 나눔, 엑셀·시트에 그대로) */
export function toTsv(rows: readonly BenchAvg[], name: (c: string) => string): string {
  const head = ["순위", "캐릭터", "등급", "점수", "판 수", "클리어", "클리어 시간", "쓰러짐", "준 피해", "초당 피해", "받은 피해", "회복", "넘긴 방", "보스 처치", "보스 잡은 시간", "보스 쓰러짐", "보스 준 피해", "보스 받은 피해"];
  const body = rows.map((r, i) => [i + 1, name(r.character), r.grade, r.score, r.runs, r.cleared, mmss(r.clearTicks), r.deaths.toFixed(1), Math.round(r.dealt), dps(r).toFixed(1), Math.round(r.taken), Math.round(r.healed), r.skips.toFixed(1), r.bossWins, mmss(r.bossWins ? r.bossTicks : 0), r.bossDeaths.toFixed(1), Math.round(r.bossDealt), Math.round(r.bossTaken)]);
  return [head, ...body].map((x) => x.join("\t")).join("\n");
}
