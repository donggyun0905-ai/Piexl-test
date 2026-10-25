// 이벤트 코인 그림: 초록 동전 (만능 쿠폰·금화와 구별). big이면 뽑기 결과처럼 크게
export function EcoinIcon({ big = false }: { big?: boolean }) {
  return <span className={big ? "ecoin-icon big" : "ecoin-icon"} aria-hidden="true" />;
}
