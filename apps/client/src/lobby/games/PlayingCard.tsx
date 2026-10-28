// 트럼프 카드 한 장 (블랙잭·하이로우 공용): 왼쪽 위·오른쪽 아래 숫자와 무늬 · 가운데 큰 무늬 · 뒷면 · 놓일 때 뒤집히며 나옴
const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

/** rank 0~12 (A~K) · suit 0~3 (♠♥♦♣) · back: 뒷면 */
export function PlayingCard({ rank, suit, back = false, big = false }: { rank: number; suit: number; back?: boolean; big?: boolean }) {
  if (back) return <span className={`pcard back${big ? " big" : ""}`} />;
  const r = RANKS[rank]!;
  const s = SUITS[suit]!;
  return (
    <span key={`${rank}-${suit}`} className={`pcard${suit === 1 || suit === 2 ? " red" : ""}${big ? " big" : ""}${rank >= 10 ? " face" : ""}`}>
      <b className="pc-top">
        {r}
        <i>{s}</i>
      </b>
      <i className="pc-mid">{rank >= 10 ? r : s}</i>
      <b className="pc-bot">
        {r}
        <i>{s}</i>
      </b>
    </span>
  );
}
