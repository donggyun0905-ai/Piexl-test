// 메뉴 버튼용 작은 픽셀 아이콘 (칸을 글자로 그림 X = 칠함, 색은 글자색을 따름)

const ICONS = {
  // 한 사람
  user: ["..XXXX..", ".XXXXXX.", ".XXXXXX.", "..XXXX..", "........", "XXXXXXXX", "XXXXXXXX", "XXXXXXXX"],
  // 여러 사람
  users: ["..XX...XX..", ".XXXX.XXXX.", ".XXXX.XXXX.", "..XX...XX..", "...........", "XXXXX.XXXXX", "XXXXX.XXXXX", "XXXXX.XXXXX"],
  // 왕관 (일일 도전)
  crown: ["........", "X..XX..X", "XX.XX.XX", "XXXXXXXX", "XXXXXXXX", ".XXXXXX.", ".XXXXXX.", "........"],
  // 칼 (새 모험)
  sword: [".....XXX", "....XXX.", "...XXX..", "X.XXX...", ".XXX....", "..X.....", ".X.X....", "X......."],
  // 되감기 화살표 (이어하기)
  resume: ["..XXXX..", ".X....X.", "X......X", "X..XX..X", "X..XXX.X", "X..XX..X", ".X....X.", "..XXXX.."],
  // 과녁 (연습장)
  target: ["..XXXX..", ".X....X.", "X..XX..X", "X.X..X.X", "X.X..X.X", "X..XX..X", ".X....X.", "..XXXX.."],
  // 톱니 (설정)
  gear: ["...XX...", ".XXXXXX.", ".XX..XX.", "XX....XX", "XX....XX", ".XX..XX.", ".XXXXXX.", "...XX..."],
  // 오른쪽 꺾쇠
  chevron: ["..X.....", "..XX....", "...XX...", "....XX..", "....XX..", "...XX...", "..XX....", "..X....."],
  // 사슬 (기기 연동)
  link: ["....XXX.", "...X...X", "...X..X.", "..X.XX..", "..XX.X..", ".X..X...", "X...X...", ".XXX...."],
  // 트로피 (기록)
  trophy: ["XXXXXXXX", "X.XXXX.X", "X.XXXX.X", ".XXXXXX.", "..XXXX..", "...XX...", "..XXXX..", ".XXXXXX."],
  // 별 (업적)
  star: ["...XX...", "...XX...", "XXXXXXXX", ".XXXXXX.", "..XXXX..", ".XXXXXX.", ".XX..XX.", "X......X"],
  // 책 (튜토리얼)
  book: ["XXXXXXX.", "X..X..XX", "X.XXXX.X", "X..X..XX", "X.XXXX.X", "X..X..XX", "XXXXXXX.", "........"],
  // 쪽지 (패치 노트)
  note: ["XXXXXX..", "X....XX.", "X.XX..X.", "X.....X.", "X.XXX.X.", "X.....X.", "X.XXX.X.", "XXXXXXX."],
  // 무한 (무한 모드)
  infinity: ["........", ".XX..XX.", "X..XX..X", "X..XX..X", "X..XX..X", ".XX..XX.", "........", "........"],
  // 떠오르는 해 (광야의 새벽)
  dawn: ["...XX...", ".X.XX.X.", "..XXXX..", ".XXXXXX.", "XXXXXXXX", "........", "XXXXXXXX", "........"],
  // 아래 화살표 (앱 설치)
  castle: ["X.X..X.X", "XXXXXXXX", ".XXXXXX.", ".XX..XX.", ".XXXXXX.", ".XXXXXX.", ".XX..XX.", "XXX..XXX"],
  bag: ["..XXXX..", ".X....X.", "XXXXXXXX", "XX.XX.XX", "XXXXXXXX", "XXX..XXX", "XXXXXXXX", ".XXXXXX."],
  download: ["...XX...", "...XX...", "...XX...", ".XXXXXX.", "..XXXX..", "...XX...", "X......X", "XXXXXXXX"],
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name }: { name: IconName }) {
  const rows: readonly string[] = ICONS[name];
  const w = Math.max(...rows.map((r) => r.length));
  return (
    <svg className="icon" viewBox={`0 0 ${w} ${rows.length}`} aria-hidden="true" shapeRendering="crispEdges">
      {rows.map((row, y) =>
        [...row].map((c, x) => (c === "X" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" /> : null)),
      )}
    </svg>
  );
}
