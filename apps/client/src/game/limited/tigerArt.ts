// 범 풍류 그림 조각: 백호 머리(대기 때 뒤에 크게) · 갓 쓴 까치(날갯짓 2장) · 호랑이 발자국. 글자 지도 → 픽셀
type Ctx = CanvasRenderingContext2D;

/** 백호 머리 (27×23) */
export const TIGER_HEAD = [
  "......ggg.........ggg......",
  ".....gwwwg.......gwwwg.....",
  "....gwwwwwg.ggg.gwwwwwg....",
  "....gwwpwwggwwwggwwpwwg....",
  "...gwwpppwwwwwwwwwpppwwg...",
  "...ghhwwwwssssssswwwwhhg...",
  "....ggwwwwwwwswwwwwwwgg....",
  "....gwwwwwwssssswwwwwwg....",
  "....gwwwwwwwwswwwwwwwwg....",
  "...gwwwwwwwwssswwwwwwwwg...",
  "..gswwwsweewwwwweewswwwsg..",
  ".gwwwwwweEewwwwweEewwwwwwg.",
  ".gswwwwwwwwwwwwwwwwwwwwwsg.",
  "gwwsswwwwwwwwwwwwwwwwwsswwg",
  "gwwwwwwwwwwWnnnWwwwwwwwwwwg",
  ".gswwwwwwWWWWnWWWWwwwwwwsg.",
  ".gwswwwwWWsWWmWWsWWwwwwswg.",
  ".ghwwwwwWsWmmWmmWsWwwwwwhg.",
  "..ghwwwwWWWWWWWWWWWwwwwhg..",
  "...ghhwwwWWWWWWWWWwwwhhg...",
  "....gghhwwwWWWWWwwwhhgg....",
  "......gghhhhwwwhhhhgg......",
  "........gggghhhgggg........",
];
export const HEAD_COLORS: Record<string, string> = { g: "#ffd860", w: "#f4f6ff", h: "#c8d0e8", W: "#ffffff", s: "#1e1c2c", p: "#ff9ab0", e: "#8ad8ff", E: "#ffffff", n: "#ff8aa0", m: "#3a1a2a" };

/** 갓 쓴 까치 (오른쪽을 봄): 날개 위 · 아래 */
export const MAGPIE = [
  ["...KK....", ".kkkkkk..", "...bb....", "..bbwbo..", "WbbwwbB..", ".bbwwb...", "..b..b..."],
  ["...KK....", ".kkkkkk..", "...bb....", "..bbwbo..", ".bbwwbB..", "WbbwwB...", "..b..b..."],
];
export const MAGPIE_COLORS: Record<string, string> = { K: "#1a1820", k: "#4a4454", b: "#1a2a5a", w: "#f4f4f8", o: "#2a2a30", W: "#2a4aa0", B: "#3a6ad0" };

export const PAW = [".o.o.", "o...o", ".ooo.", ".ooo."];

/** 글자 지도를 (x, y) 가운데에 배율 s로 */
export function drawMap(ctx: Ctx, map: readonly string[], colors: Record<string, string>, x: number, y: number, s: number, flip = false): void {
  const w = map[0]!.length;
  const h = map.length;
  const left = x - (w * s) / 2;
  const top = y - (h * s) / 2;
  for (let r = 0; r < h; r++) {
    const row = map[r]!;
    for (let c = 0; c < w; c++) {
      const col = colors[row[flip ? w - 1 - c : c]!];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(left + c * s, top + r * s, s, s);
    }
  }
}

/** 캐릭터마다 효과 빛깔 (금빛과 섞어 씀) */
export const ACCENT: Record<string, string> = {
  warden: "#e8f0ff",
  mage: "#ff5a3a",
  drifter: "#7ad8e8",
  tracker: "#ff6a5a",
  forgotten: "#ffd860",
  remnant: "#8a6aff",
  wanderer: "#e85a5a",
  silk: "#ff8ad8",
  pungryu: "#3ad8b0",
  leo: "#ffd040",
  onyx: "#c080ff",
  fenrir: "#8ab8ff",
  eclipse: "#ffb040",
  thorken: "#6ae0ff",
  levia: "#7ac0ff",
  tail: "#6af0e0",
  madQueen: "#5af0ff",
  hook: "#4ab8ff",
  orca: "#3ae0ff",
  wave: "#8af4ff",
  miryu: "#5ad0ff",
  beatrice: "#ff3a1a",
  ian: "#b89aff",
  gabriel: "#ffd76a",
  serena: "#ffc8e0",
  rafael: "#b0e8ff",
  yuriel: "#fff2c0",
  michaela: "#d8c8ff",
  blast: "#e8e8f4",
  nailer: "#c8303a",
  scissors: "#c8b8e8",
  hellfist: "#d8202a",
  silverBullet: "#d8e0ec",
  blueFlame: "#2a7aff",
  lunatic: "#cfd8ff",
  incision: "#ff4a4a",
  crusader: "#ffd36a",
  joker: "#c86bff",
  shadowing: "#9ab8ff",
  collector: "#5a8aff",
  mystic: "#ff6a8a",
  engineer: "#5ad0f0",
  elementalist: "#5af0c0",
  brawler: "#ff7a3a",
  doctor: "#7ae0a0",
  gunner: "#ff3a2a",
  beast: "#ffa040",
  ninja: "#b08aff",
  chronomancer: "#8ab8ff",
  summoner: "#c0f070",
  novice: "#ffe08a",
  bedouin: "#ffc040",
  general: "#ff4a3a",
};
export const GOLD = "#ffd860";
export const INK = "#1e1c2c";
export const FUR = "#f4f6ff";
