// 1~3위 기록 다시 돌려 확인 (일일 도전·레이드·아레나): 무료 플랜은 요청 하나의 계산 시간이 짧아 한 판을 한 번에 못 돌림.
// 기록은 먼저 받아 두고(확인 중), 입력 기록을 대기열에 넣은 뒤 알람마다 조금씩(chunk 틱) 돌림. 다 돌려 결과가 같으면 확인됨(1),
// 다르면 순위표에서 숨김(-1). 돌리던 판은 메모리에만 두고, 중간에 서버가 다시 켜졌으면(계산 시간 초과 등) 한 번에 돌리는 양을 줄여 처음부터
import {
  arenaCleared,
  createRun,
  parseSeed,
  raidReplayStep,
  stepSim,
  summarize,
  unpackInputs,
  withBalance,
  type CharacterId,
  type LastBossKind,
  type RunState,
  type TickInput,
} from "@pixel-rogue/shared";
import { balanceVersion } from "./balanceApi";
import type { HubContext } from "./hub";
import { first } from "./sql";

/** 다시 돌려 확인하는 순위 */
export const REPLAY_TOP = 3;
const CHUNK = { start: 300, min: 30, max: 1200 };

export const REPLAY_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS replays (id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL, board TEXT NOT NULL, user TEXT NOT NULL, params TEXT NOT NULL, inputs TEXT NOT NULL)`,
];

export type ReplayJob =
  | { kind: "daily"; board: string; user: string; seedText: string; character: CharacterId; sudden: boolean; balance: string; score: number; floor: number; kills: number; won: boolean; ticks: number }
  | { kind: "raid"; board: LastBossKind; user: string; seedText: string; character: CharacterId; unlocks: string[]; balance: string; ticks: number }
  | { kind: "arena"; board: string; user: string; seedText: string; character: CharacterId; unlocks: string[]; balance: string; level: number; ticks: number };

interface Active {
  id: number;
  job: ReplayJob;
  values: NonNullable<ReturnType<typeof balanceVersion>>;
  run: RunState;
  inputs: TickInput[];
  at: number;
}

/** 지금 돌리는 판 (메모리만) */
const active = new WeakMap<HubContext, Active>();

const meta = (ctx: HubContext, k: string): string | undefined => {
  const row = first(ctx.sql, "SELECT v FROM meta WHERE k = ?", k);
  return row ? String(row.v) : undefined;
};
const setMeta = (ctx: HubContext, k: string, v: string) => ctx.sql.exec("INSERT INTO meta (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v", k, v);

/** 대기열에 넣고 알람. 같은 사람의 같은 순위표 예전 일은 지움 (더 좋은 기록이 새로 옴) */
export function queueReplay(ctx: HubContext, job: ReplayJob, inputs: string): void {
  ctx.sql.exec("DELETE FROM replays WHERE kind = ? AND board = ? AND user = ?", job.kind, job.board, job.user);
  ctx.sql.exec("INSERT INTO replays (kind, board, user, params, inputs) VALUES (?, ?, ?, ?, ?)", job.kind, job.board, job.user, JSON.stringify(job), inputs);
  ctx.wake(ctx.now());
}

function startRun(job: ReplayJob): RunState {
  const seed = parseSeed(job.seedText);
  if (job.kind === "daily") return createRun(seed, job.character, [], job.sudden);
  if (job.kind === "raid") return createRun(seed, job.character, job.unlocks);
  return createRun(seed, job.character, job.unlocks, false, false, true);
}

/** 한 틱. 더 돌릴 게 없으면 false */
function step(job: ReplayJob, run: RunState, input: TickInput): boolean {
  if (job.kind === "raid") return raidReplayStep(run, job.board, input);
  if (run.over) return false;
  stepSim(run, input);
  return true;
}

function same(job: ReplayJob, run: RunState): boolean {
  if (job.kind === "daily") {
    const r = summarize(run);
    return r.score === job.score && r.floor === job.floor && r.kills === job.kills && r.won === job.won && r.ticks === job.ticks;
  }
  if (job.kind === "raid") return run.won && run.lastBoss === job.board && run.raidTicks === job.ticks;
  return run.over && arenaCleared(run) === job.level && run.tick === job.ticks;
}

/** 결과 적기: 그사이 같은 사람이 더 좋은 기록을 냈으면 그 기록은 건드리지 않음 */
function mark(ctx: HubContext, job: ReplayJob, ok: boolean): void {
  const v = ok ? 1 : -1;
  if (job.kind === "daily") ctx.sql.exec("UPDATE daily SET verified = ? WHERE day = ? AND user = ? AND score = ? AND ticks = ?", v, job.board, job.user, job.score, job.ticks);
  else if (job.kind === "raid") ctx.sql.exec("UPDATE raid SET verified = ? WHERE boss = ? AND user = ? AND ticks = ?", v, job.board, job.user, job.ticks);
  else ctx.sql.exec("UPDATE arena SET verified = ? WHERE user = ? AND level = ? AND ticks = ?", v, job.user, job.level, job.ticks);
}

function finish(ctx: HubContext, id: number, job: ReplayJob | null, ok: boolean): void {
  if (job) mark(ctx, job, ok);
  ctx.sql.exec("DELETE FROM replays WHERE id = ?", id);
  active.delete(ctx);
  setMeta(ctx, "replayJob", "");
}

/** 알람 한 번: 조금 돌리고, 남았으면 다음 알람. 다 끝났으면 false */
export async function runReplayChunk(ctx: HubContext): Promise<boolean> {
  let a = active.get(ctx);
  let chunk = Number(meta(ctx, "replayChunk") ?? CHUNK.start);
  if (!a) {
    const row = first(ctx.sql, "SELECT id, params, inputs FROM replays ORDER BY id ASC LIMIT 1");
    if (!row) return false;
    const id = Number(row.id);
    // 이 일을 돌리다 메모리가 사라짐 (계산 시간 초과일 수 있음) → 한 번에 돌리는 양을 줄임
    if (meta(ctx, "replayJob") === String(id)) {
      chunk = Math.max(CHUNK.min, Math.floor(chunk / 2));
      setMeta(ctx, "replayChunk", String(chunk));
    }
    const job = JSON.parse(String(row.params)) as ReplayJob;
    const values = balanceVersion(ctx, job.balance);
    let inputs: TickInput[] | null = null;
    try {
      inputs = await unpackInputs(String(row.inputs));
    } catch {
      inputs = null;
    }
    if (!values || !inputs) {
      finish(ctx, id, inputs ? null : job, false);
      return true;
    }
    setMeta(ctx, "replayJob", String(id));
    a = { id, job, values, inputs, at: 0, run: withBalance(values, () => startRun(job)) };
    active.set(ctx, a);
  }
  const cur = a;
  const done = withBalance(cur.values, () => {
    const end = Math.min(cur.inputs.length, cur.at + chunk);
    for (; cur.at < end; cur.at++) if (!step(cur.job, cur.run, cur.inputs[cur.at]!)) return true;
    return cur.at >= cur.inputs.length;
  });
  if (done) {
    finish(ctx, cur.id, cur.job, same(cur.job, cur.run));
    // 끊김 없이 끝났으면 조금씩 다시 늘림
    if (chunk < CHUNK.max) setMeta(ctx, "replayChunk", String(Math.min(CHUNK.max, Math.ceil(chunk * 1.25))));
  }
  return true;
}
