// 월드 워 리그 팀 마크 (팀 이름 번호 0~15 · 우리 팀은 "mine"): 방패·원·육각 바탕 + 두 색 + 10×10 픽셀 그림 (X 진한 색 · o 밝은 색)
// 붉은 매 · 푸른 늑대 · 황금 사자 · 은빛 기사단 · 검은 까마귀 · 폭풍 군단 · 서리 거인 · 불꽃 여우 · 별빛 수호대 · 천둥 곰 · 그림자 뱀 · 새벽 독수리 · 강철 거북 · 용암 골렘 · 달빛 부엉이 · 번개 상어

type Shape = "shield" | "round" | "hex";
interface Mark {
  shape: Shape;
  /** 바탕 위·아래 색 · 테두리 · 그림 진한 색 · 밝은 색 */
  bg: [string, string];
  rim: string;
  ink: string;
  hi: string;
  art: readonly string[];
}

const MARKS: Mark[] = [
  // 0 붉은 매: 날개 편 매
  { shape: "shield", bg: ["#c8342a", "#6a1010"], rim: "#ffd27a", ink: "#2a0808", hi: "#ffe0c0", art: ["....XX....", "...XoX....", "X..XXX...X", "XX.XXXX.XX", "XXXXXXXXXX", ".XXXooXXX.", "..XXXXXX..", "...X..X...", "...X..X...", "..XX..XX.."] },
  // 1 푸른 늑대: 늑대 머리
  { shape: "round", bg: ["#3a6ad8", "#142a6a"], rim: "#c8e0ff", ink: "#0a1430", hi: "#e8f4ff", art: ["X........X", "XX......XX", "XXX....XXX", "XXXXXXXXXX", "XXoXXXXoXX", "XXXXXXXXXX", ".XXXooXXX.", "..XXooXX..", "...XXXX...", "....XX...."] },
  // 2 황금 사자: 갈기 머리
  { shape: "shield", bg: ["#f2c040", "#a86a10"], rim: "#fff2b0", ink: "#4a2a04", hi: "#fff8d8", art: ["..X.XX.X..", ".XXXXXXXX.", "XXX....XXX", "XX.o..o.XX", "XX......XX", "XX..XX..XX", "XXX.oo.XXX", ".XXX..XXX.", "..XXXXXX..", "...X..X..."] },
  // 3 은빛 기사단: 투구
  { shape: "hex", bg: ["#d8dce8", "#6a7088"], rim: "#ffffff", ink: "#1e2230", hi: "#f8faff", art: ["....XX....", "...XXXX...", "..XXXXXX..", ".XXXXXXXX.", ".XooooooX.", ".XXXXXXXX.", ".XX.XX.XX.", ".XX.XX.XX.", "..XXXXXX..", "...XXXX..."] },
  // 4 검은 까마귀: 옆을 보는 까마귀
  { shape: "shield", bg: ["#3a2a50", "#0e0818"], rim: "#b08aff", ink: "#000000", hi: "#d8c0ff", art: ["..........", "....XXX...", "...XXoXX..", "..XXXXXXXX", ".XXXXXX...", "XXXXXXX...", "XXXXXXXX..", ".XXXXXXXX.", "...X..X...", "..XX.XX..."] },
  // 5 폭풍 군단: 번개
  { shape: "round", bg: ["#2aa8a0", "#0a3a48"], rim: "#a8fff0", ink: "#04201e", hi: "#ffff9a", art: [".....oooo.", "....oooo..", "...oooo...", "..oooo....", ".ooooooo..", "....ooo...", "...ooo....", "..ooo.....", ".oo.......", "o........."] },
  // 6 서리 거인: 눈꽃
  { shape: "hex", bg: ["#9ad8ff", "#2a6aa8"], rim: "#ffffff", ink: "#0a2a4a", hi: "#ffffff", art: ["....oo....", ".o..oo..o.", "..o.oo.o..", "...oooo...", "oooooooooo", "oooooooooo", "...oooo...", "..o.oo.o..", ".o..oo..o.", "....oo...."] },
  // 7 불꽃 여우: 여우 머리
  { shape: "shield", bg: ["#ff8a2a", "#a83a0a"], rim: "#ffe0a0", ink: "#3a1004", hi: "#fff4e0", art: ["X........X", "XX......XX", "XoX....XoX", "XXXXXXXXXX", "XX.XXXX.XX", ".XXXXXXXX.", ".ooXXXXoo.", "..ooXXoo..", "...ooXo...", "....oo...."] },
  // 8 별빛 수호대: 큰 별
  { shape: "round", bg: ["#4a3aa8", "#140e40"], rim: "#ffe88a", ink: "#140e40", hi: "#fff2a0", art: ["....oo....", "....oo....", "...oooo...", "oooooooooo", ".oooooooo.", "..oooooo..", "..oooooo..", ".ooo..ooo.", ".oo....oo.", "o........o"] },
  // 9 천둥 곰: 곰 머리
  { shape: "shield", bg: ["#8a5a32", "#3a200a"], rim: "#ffd27a", ink: "#1a0c04", hi: "#f0d0a0", art: [".XX....XX.", "XoXX..XXoX", "XXXXXXXXXX", "XXXXXXXXXX", "XX.XXXX.XX", "XXXXXXXXXX", "XXXooooXXX", ".XXoXXoXX.", "..XXooXX..", "...XXXX..."] },
  // 10 그림자 뱀: S자 뱀
  { shape: "hex", bg: ["#3aa850", "#0a3a18"], rim: "#c8ffb0", ink: "#04200a", hi: "#e8ff9a", art: ["...XXXX...", "..XoXXoX..", "..XXXXXX..", "...XX.....", "....XXX...", ".....XXX..", "......XX..", "..XXXXXX..", ".XXXXXX...", "X.X......."] },
  // 11 새벽 독수리: 독수리 머리
  { shape: "shield", bg: ["#ffb040", "#c84a2a"], rim: "#fff2c0", ink: "#3a1a04", hi: "#ffffff", art: ["...ooooo..", "..ooooooo.", ".oooXooooo", ".oooooXXXX", "..ooooXXX.", "..XooooX..", ".XXXoooo..", "XXXXXooo..", "XXXXXXoo..", ".XXXXXX..."] },
  // 12 강철 거북: 등껍질
  { shape: "round", bg: ["#8a98a8", "#2a3440"], rim: "#e0e8f0", ink: "#101820", hi: "#c8f0d0", art: ["..........", "...XXXX...", "..XoXXoX..", ".XXXooXXX.", ".XoXXXXoX.", ".XXXooXXX.", "XXXXXXXXXX", "X.X....X.X", "..........", ".........."] },
  // 13 용암 골렘: 불타는 주먹
  { shape: "hex", bg: ["#e84a1a", "#3a0a04"], rim: "#ffc040", ink: "#1a0400", hi: "#ffd040", art: ["..o..o..o.", ".oo.oo.oo.", ".XXXXXXX..", "XXoXXoXXX.", "XXXXXXXXX.", "XXoXXoXXXX", "XXXXXXXXXX", ".XXXXXXXX.", "..XXXXXX..", "..XXXXXX.."] },
  // 14 달빛 부엉이: 부엉이 얼굴 + 달
  { shape: "round", bg: ["#7a5ac8", "#20104a"], rim: "#f0e0ff", ink: "#140a30", hi: "#fff4c0", art: ["X........X", "XX......XX", "XXXXXXXXXX", "XooXXXXooX", "XoXXXXXXoX", "XooXooXooX", ".XXXooXXX.", ".XXXXXXXX.", "..X.XX.X..", ".........."] },
  // 15 번개 상어: 지느러미와 물결
  { shape: "shield", bg: ["#2ac8e8", "#0a3a6a"], rim: "#ffff9a", ink: "#04182a", hi: "#ffffff", art: ["......X...", ".....XX...", "....XXX...", "...XXXX...", "..XXXXX...", ".XXXXXXX..", "XXXXXXXXXX", "..........", "oo..oo..oo", ".oo..oo..o"] },
];

/** 우리 팀: 금빛 왕관 + 별 */
const MINE: Mark = { shape: "shield", bg: ["#ffb030", "#a8400a"], rim: "#ffffff", ink: "#d8202a", hi: "#fff4b0", art: ["....oo....", "o...oo...o", "oo..oo..oo", "ooo.oo.ooo", "oooooooooo", "oXooXXooXo", "oooooooooo", "..........", ".oooooooo.", ".........."] };

const PATH: Record<Shape, string> = {
  shield: "M4 3 H36 V20 C36 30 28 36 20 39 C12 36 4 30 4 20 Z",
  round: "M20 2 A18 18 0 1 1 19.99 2 Z",
  hex: "M20 2 L36 11 V29 L20 38 L4 29 V11 Z",
};

export function TeamEmblem({ name, size = 40 }: { name: number | "mine"; size?: number }) {
  const m = name === "mine" ? MINE : (MARKS[name % MARKS.length] ?? MARKS[0]!);
  const id = `tm-${name}`;
  return (
    <svg className="team-emblem" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" shapeRendering="crispEdges">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={m.bg[0]} />
          <stop offset="1" stopColor={m.bg[1]} />
        </linearGradient>
      </defs>
      <path d={PATH[m.shape]} fill={`url(#${id})`} stroke={m.rim} strokeWidth="2.5" />
      <path d={PATH[m.shape]} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1" transform="translate(20 20) scale(0.86) translate(-20 -20)" />
      {m.art.flatMap((row, y) =>
        [...row].map((c, x) => (c === "." ? null : <rect key={`${x}-${y}`} x={10 + x * 2} y={9 + y * 2} width="2" height="2" fill={c === "X" ? m.ink : m.hi} />)),
      )}
      {/* 위쪽 반짝임 */}
      <path d="M9 6 H31 L29 9 H11 Z" fill="rgba(255,255,255,0.22)" />
    </svg>
  );
}
