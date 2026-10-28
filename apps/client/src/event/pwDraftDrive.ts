// 패왕전 밴픽 진행 (혼자 하기는 내 화면, 같이 하기는 방장): 차례마다 제한 시간을 정하고, AI 차례는 잠깐 뒤 AI가, 시간이 다하면 밴은 넘기고 픽은 무작위
import { createRng, draftAct, draftAuto, draftDone, draftTurn, newDraft, PW_DRAFT_SEC, type CharacterId, type PwDraft, type PwDraftTurn, type PwMode } from "@pixel-rogue/shared";
import { useEffect, useRef, useState } from "react";

/** AI가 고르기까지 (밀리초) */
const AI_MS = 1000;
const AI_MORE_MS = 1200;

/** 밴픽 상태 + 이 차례가 끝나는 시각 */
export interface DraftClock {
  d: PwDraft;
  endAt: number;
}

export const startDraft = (mode: PwMode): DraftClock => ({ d: newDraft(mode), endAt: Date.now() + PW_DRAFT_SEC * 1000 });

/** 지금 차례에 c를 밴·픽한 새 상태 (안 되면 null) */
export function stepDraft(cur: DraftClock, c: CharacterId | null): DraftClock | null {
  const d = structuredClone(cur.d);
  return draftAct(d, c) ? { d, endAt: Date.now() + PW_DRAFT_SEC * 1000 } : null;
}

/** AI 차례는 잠깐 뒤 AI가, 사람 차례는 시간이 다하면 대신 함 */
export function useDraftDrive(cur: DraftClock | null, act: (c: CharacterId | null) => void, isAi: (turn: PwDraftTurn) => boolean) {
  // 판 시드처럼 밴픽마다 다르게 (밴픽 안의 무작위는 이것으로만)
  const [rng] = useState(() => createRng(Math.floor(Math.random() * 0x7fffffff)));
  const ref = useRef({ act, isAi });
  useEffect(() => {
    ref.current = { act, isAi };
  });
  useEffect(() => {
    const turn = cur && draftTurn(cur.d);
    if (!cur || !turn || draftDone(cur.d)) return;
    const ai = ref.current.isAi(turn);
    const rnd = () => rng.nextFloat();
    const ms = ai ? AI_MS + rnd() * AI_MORE_MS : cur.endAt - Date.now();
    const id = window.setTimeout(() => ref.current.act(ai || !turn.ban ? draftAuto(cur.d, rnd) : null), ms);
    return () => window.clearTimeout(id);
  }, [cur, rng]);
}
