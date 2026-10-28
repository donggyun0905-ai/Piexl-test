// 패왕전 혼자 하기 밴픽: 나는 0번 자리(우리 편 밴도 내가), 나머지는 AI · 끝나면 고른 캐릭터들로 대결
import { draftDone, pwSeatCount, type CharacterId, type PwDraftTurn, type PwMode } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { PwDraftView } from "./PwDraft";
import { startDraft, stepDraft, useDraftDrive } from "./pwDraftDrive";

/** 다 고른 뒤 대결로 넘어가기까지 (밀리초) */
const DONE_MS = 1500;

interface Props {
  mode: PwMode;
  lang: Lang;
  t: (key: TextKey) => string;
  onDone: (picks: CharacterId[]) => void;
  onBack: () => void;
}

export function PwDraftSolo({ mode, lang, t, onDone, onBack }: Props) {
  const [cur, setCur] = useState(() => startDraft(mode));
  const { d } = cur;
  const act = (c: CharacterId | null) => {
    const next = stepDraft(cur, c);
    if (next) setCur(next);
  };
  const mineTurn = (turn: PwDraftTurn) => (turn.ban ? turn.team === 0 : turn.seat === 0);
  useDraftDrive(cur, act, (turn) => !mineTurn(turn));
  useEffect(() => {
    if (!draftDone(d)) return;
    const id = window.setTimeout(() => onDone(d.picks as CharacterId[]), DONE_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d]);
  const n = pwSeatCount(mode);
  const names = Array.from({ length: n }, (_, i) => (i === 0 ? t("pwYou") : "AI"));
  const ai = names.map((_, i) => i !== 0);
  const turn = d.turns[d.at];
  return (
    <PwDraftView d={d} names={names} ai={ai} me={0} mine={!!turn && mineTurn(turn)} endAt={cur.endAt} onAct={act} lang={lang} t={t}>
      <div className="pw-prep-actions">
        <button type="button" className="ghost" onClick={onBack}>
          {t("back")}
        </button>
      </div>
    </PwDraftView>
  );
}
