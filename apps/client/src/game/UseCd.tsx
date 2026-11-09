// 레이드 사용 아이템 쿨타임 (sim/raidPrep): 칸 위를 아래부터 어둡게 채우고 남은 초 (PC 장비 줄·모바일 버튼 공용)
export function UseCd({ cd }: { cd?: [number, number] }) {
  if (!cd || cd[0] <= 0) return null;
  return (
    <i className="use-cd" style={{ ["--cd" as string]: `${Math.round(cd[1] * 100)}%` }} aria-hidden="true">
      {cd[0]}
    </i>
  );
}
