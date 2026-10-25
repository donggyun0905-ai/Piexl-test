// 같이 하는 조커 게임: 내 차례에 다음 사람의 뒤집힌 카드 한 장을 고르고, 짝이 있으면 손의 짝을 눌러 버림. 마지막까지 조커를 가진 사람이 짐
import type { JokerView } from "@pixel-rogue/shared";
import { JokerHand, jokerNote } from "../games/JokerHand";
import { seatName, type TableProps } from "./CardTable";

export function JokerMulti({ view, t, send }: TableProps) {
  const g = view.game_ as JokerView;
  const mine = view.turn === view.you && g.loser < 0;
  return (
    <div className="mg joker">
      <div className="joker-seats">
        {g.counts.map((n, i) =>
          i === view.you ? null : (
            <div key={i} className={`seat${view.turn === i ? " turn" : ""}`}>
              <span>
                {seatName(view, i, t)} · {n || "✓"}
              </span>
              <div className="seat-cards">
                {Array.from({ length: n }, (_, k) =>
                  mine && !g.pending && i === g.from ? (
                    <button key={k} type="button" className="card back pick" onClick={() => send({ t: "act", a: { pick: k } })}>
                      ?
                    </button>
                  ) : (
                    <span key={k} className="card back small" />
                  ),
                )}
              </div>
            </div>
          ),
        )}
      </div>
      <JokerHand label={seatName(view, view.you, t)} view={g} turn={mine} onMatch={mine ? (k) => send({ t: "act", a: { match: k } }) : null} />
      {g.loser >= 0 ? (
        <strong className={`mg-result ${g.loser === view.you ? "lose" : "win"}`}>{g.loser === view.you ? t("mgLose") : t("mpLoser").replace("{n}", seatName(view, g.loser, t))}</strong>
      ) : (
        <p className="mg-note">{jokerNote(g, mine, t, seatName(view, g.from, t)) || t("mpTurnOf").replace("{n}", seatName(view, view.turn, t))}</p>
      )}
    </div>
  );
}
