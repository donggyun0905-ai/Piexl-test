// 대장간 강화 표시: 노란 별 + 강화 단계 · 보라 별 + 암흑 강화 단계 (장비 줄·대장간 창·설명이 같이 씀)
export function ForgeStars({ lv, dark }: { lv: number; dark: number }) {
  if (!lv && !dark) return null;
  return (
    <span className="forge-stars">
      {lv > 0 && <span className="fs-up">★+{lv}</span>}
      {dark > 0 && <span className="fs-dark">★+{dark}</span>}
    </span>
  );
}
