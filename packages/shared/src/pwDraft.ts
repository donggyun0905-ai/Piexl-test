// 패왕전 밴픽 (편 대결만): 두 편이 번갈아 캐릭터를 막고(밴) 지그재그 차례로 고름(픽). 한 판에 같은 캐릭터는 한 번만
// 화면 전용 규칙 (판 계산 전): 혼자 하기는 내 화면이, 같이 하기는 방장이 차례를 진행하고 손님은 받은 상태를 그림
import { CHARACTER_IDS, type CharacterId } from "./characters";
import { PW_MODE, type PwMode } from "./paewangDefs";

/** 차례 하나: 밴(편이 함) · 픽(그 자리가 함) */
export interface PwDraftTurn {
  ban: boolean;
  team: 0 | 1;
  /** 픽할 자리 (밴은 -1) */
  seat: number;
}

export interface PwDraft {
  mode: PwMode;
  turns: PwDraftTurn[];
  /** 지금 차례 번호 (turns.length면 끝) */
  at: number;
  /** 밴 차례마다 막은 캐릭터 (null = 시간이 다해 넘어감) */
  bans: (CharacterId | null)[];
  /** 자리마다 고른 캐릭터 */
  picks: (CharacterId | null)[];
}

/** 한 차례 시간 (초) */
export const PW_DRAFT_SEC = 20;

/** 편 대결만 밴픽 (난투·데스매치는 없음) */
export const pwHasDraft = (mode: PwMode): boolean => !PW_MODE[mode].ffa;

/** 편의 자리 수 · 자리 i의 편 */
export const draftSize = (mode: PwMode): number => PW_MODE[mode].allies + 1;
export const draftTeam = (mode: PwMode, seat: number): 0 | 1 => (seat < draftSize(mode) ? 0 : 1);

/** 차례 순서: 밴을 편마다 1개(3명 이상이면 2개) 번갈아 → 픽은 A1 · B1 B2 · A2 A3 · B3 … */
export function draftTurns(mode: PwMode): PwDraftTurn[] {
  const size = draftSize(mode);
  const bans = size >= 3 ? 2 : 1;
  const turns: PwDraftTurn[] = [];
  for (let k = 0; k < bans * 2; k++) turns.push({ ban: true, team: (k % 2) as 0 | 1, seat: -1 });
  const next = [0, size];
  for (let k = 0; k < size * 2; k++) {
    // 0, 1 1, 0 0, 1 1 … (첫 픽만 하나)
    const team = (Math.floor((k + 1) / 2) % 2) as 0 | 1;
    turns.push({ ban: false, team, seat: next[team]!++ });
  }
  return turns;
}

export function newDraft(mode: PwMode): PwDraft {
  const turns = draftTurns(mode);
  return { mode, turns, at: 0, bans: turns.filter((x) => x.ban).map(() => null), picks: Array.from({ length: draftSize(mode) * 2 }, () => null) };
}

export const draftTurn = (d: PwDraft): PwDraftTurn | undefined => d.turns[d.at];
export const draftDone = (d: PwDraft): boolean => d.at >= d.turns.length;

/** 1대1은 서로 고른 것을 모름 (같은 캐릭터도 됨, 밴만 막음) */
export const draftBlind = (mode: PwMode): boolean => draftSize(mode) === 1;

/** 이미 막혔거나 골라진 캐릭터 (team: 그 편이 볼 때. 1대1은 상대 픽을 빼고) */
export function draftTaken(d: PwDraft, team?: 0 | 1): Set<CharacterId> {
  const picks = d.picks.filter((_, i) => team === undefined || !draftBlind(d.mode) || draftTeam(d.mode, i) === team);
  return new Set([...d.bans, ...picks].filter((c): c is CharacterId => !!c));
}

/** 지금 차례에 c를 밴·픽 (null = 밴 넘기기, 픽은 넘길 수 없음). 됐으면 true */
export function draftAct(d: PwDraft, c: CharacterId | null): boolean {
  const turn = draftTurn(d);
  if (!turn || (c && (!CHARACTER_IDS.includes(c) || draftTaken(d, turn.team).has(c)))) return false;
  if (turn.ban) d.bans[d.turns.slice(0, d.at).filter((x) => x.ban).length] = c;
  else if (c) d.picks[turn.seat] = c;
  else return false;
  d.at++;
  return true;
}

/** AI 또는 시간 초과: 밴은 상대 편이 좋아할 만한 것 아무거나, 픽은 남은 것 중 아무거나 (rnd 0~1) */
export function draftAuto(d: PwDraft, rnd: () => number): CharacterId {
  const taken = draftTaken(d, draftTurn(d)?.team);
  const free = CHARACTER_IDS.filter((c) => !taken.has(c));
  return free[Math.floor(rnd() * free.length) % free.length]!;
}

/** 받은 밴픽 상태가 올바른지 (같이 하기: 방장이 보낸 것) */
export function draftOk(d: unknown, mode: PwMode): d is PwDraft {
  const x = d as PwDraft;
  return !!x && x.mode === mode && Array.isArray(x.picks) && Array.isArray(x.bans) && x.picks.length === draftSize(mode) * 2 && typeof x.at === "number" && Array.isArray(x.turns);
}
