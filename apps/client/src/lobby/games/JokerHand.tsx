// 조커 게임 내 손 (혼자·같이 하기 공용): 방금 뽑은 카드를 보여 주고, 짝이 있으면 손의 짝을 눌러 버림
import { JOKER, type JokerView } from "@pixel-rogue/shared";
import type { TextKey } from "../../i18n";
import { JokerCard } from "./PlayingCard";

const face = (c: number) => <JokerCard n={c} joker={c === JOKER} />;

export function JokerHand({ label, view, turn, onMatch }: { label: string; view: JokerView; turn: boolean; onMatch: ((index: number) => void) | null }) {
  const { hand, got, pending } = view;
  return (
    <div className={`seat mine${turn ? " turn" : ""}`}>
      <span>{label}</span>
      <div className="seat-cards">
        {pending && got !== null && <span className="card-btn got">{face(got)}</span>}
        {hand.map((c, k) =>
          pending && onMatch ? (
            <button key={k} type="button" className="card-btn pairable" onClick={() => onMatch(k)}>
              {face(c)}
            </button>
          ) : (
            <span key={k} className="card-btn">
              {face(c)}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

/** 아래 안내 글: 짝 찾기 · 뽑을 차례 · 방금 가져온 카드 */
export function jokerNote(v: JokerView, mine: boolean, t: (k: TextKey) => string, fromName: string): string {
  if (mine && v.pending && v.got !== null) return t("mgJokerMatch").replace("{n}", String(v.got));
  if (mine) return t("mgJokerPick").replace("{n}", fromName);
  if (v.got === JOKER) return t("mgJokerGot");
  if (v.got !== null) return t("mgJokerKept").replace("{n}", String(v.got));
  return "";
}
