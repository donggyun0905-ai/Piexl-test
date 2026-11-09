// 조커 게임 (4명): 같은 숫자 두 장은 버림. 차례에 왼쪽 사람의 뒤집힌 카드 한 장을 뽑고, 짝이 손에 있으면 그 짝을 눌러 버림.
// 손이 빈 사람은 빠지고, 마지막까지 조커를 가진 사람이 짐 (나 + 컴퓨터 3명). 규칙은 같이 하기와 같은 JOKER_RULES
import { useEffect, useState } from "react";
import { JOKER_RULES, type JokerAction, type JokerState, type JokerView } from "@pixel-rogue/shared";
import type { TextKey } from "../../i18n";
import { addChips } from "../chips";
import { JokerHand, jokerNote } from "./JokerHand";
import { rng, WIN_CHIPS } from "./util";
import { CardBack } from "./PlayingCard";

const PLAYERS = 4;
const deal = () => JOKER_RULES.start(PLAYERS, rng);

export function JokerGame({ t }: { t: (k: TextKey) => string }) {
  const [s, setS] = useState<JokerState>(deal);
  const v = JOKER_RULES.view(s, 0) as JokerView;
  const over = v.loser >= 0;
  const play = (a: JokerAction) => setS((cur) => JOKER_RULES.act(cur, cur.turn, a, rng) ?? cur);
  const myTurn = !over && s.turn === 0;
  const name = (i: number) => `${t("mgCpu")} ${i}`;

  // 컴퓨터 차례: 잠깐 뒤 아무 카드나 뽑고, 짝이 있으면 버림
  useEffect(() => {
    if (over || s.turn === 0) return;
    const id = window.setTimeout(() => setS((cur) => JOKER_RULES.act(cur, cur.turn, JOKER_RULES.auto(cur, cur.turn, rng), rng) ?? cur), 600);
    return () => window.clearTimeout(id);
  }, [s, over]);
  useEffect(() => {
    if (over && v.loser !== 0) addChips(WIN_CHIPS);
  }, [over, v.loser]);

  return (
    <div className="mg joker">
      <p className="mg-rule">{t("mgJokerRule")}</p>
      <div className="joker-seats">
        {v.counts.map((n, i) =>
          i === 0 ? null : (
            <div key={i} className={`seat${s.turn === i ? " turn" : ""}`}>
              <span>
                {name(i)} · {n || "✓"}
              </span>
              <div className="seat-cards">
                {Array.from({ length: n }, (_, k) =>
                  myTurn && !v.pending && i === v.from ? (
                    <button key={k} type="button" className="card-btn pick" onClick={() => play({ pick: k })}>
                      <CardBack />
                    </button>
                  ) : (
                    <CardBack key={k} cls=" small" />
                  ),
                )}
              </div>
            </div>
          ),
        )}
      </div>
      <JokerHand label={t("mgMe")} view={v} turn={s.turn === 0} onMatch={myTurn ? (k) => play({ match: k }) : null} />
      <p className="mg-note">{over ? "" : jokerNote(v, myTurn, t, name(v.from))}</p>
      {over && (
        <div className="mg-row">
          <strong className={`mg-result ${v.loser === 0 ? "lose" : "win"}`}>{v.loser === 0 ? t("mgLose") : t("mgJokerSafe")}</strong>
          <button type="button" className="primary" onClick={() => setS(deal())}>
            {t("mgAgain")}
          </button>
        </div>
      )}
    </div>
  );
}
