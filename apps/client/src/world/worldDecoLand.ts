// 0.53.0 새 지역 장식 표 (worldDecoArt가 씀): 장식 이름 → [그림 이름, 부딪힘 반지름(-99 = 없음), 빛(색, 높이)]
// 지옥 · 해저 도시 · 사이버펑크 · 바람골 · 성국 · 새벽의 성흔 아지트 · 해저 열차 (그림 손질 scripts/art/world_art_sheets.py)
type Glow = readonly [string, number];
type Row = readonly [string, number, Glow?];

export const LAND_DECO = {
  // 지옥
  skullPillar: ["skull_pillar", 7],
  twistedTower: ["twisted_tower", 9],
  chainPost: ["chain_post", 4],
  boneTree: ["bone_tree", 6],
  firePit: ["fire_pit", 8, ["255,110,40", 5]],
  spikyRock: ["spiky_rock", 7],
  // 해저 도시
  coral: ["coral_big", 8],
  kelp: ["kelp_tall", 4],
  clam: ["clam", 6, ["220,240,255", 6]],
  chest: ["sunken_chest", 6],
  // 사이버펑크
  streetLamp: ["street_lamp", 2, ["160,220,255", 24]],
  vending: ["vending", 6, ["120,200,255", 8]],
  hologram: ["hologram", 5, ["90,170,255", 18]],
  car: ["car", 12],
  airVent: ["air_vent", 8],
  trashBin: ["trash_bin", 4],
  neonSign: ["neon_sign", 9, ["255,90,200", 8]],
  utilityPole: ["utility_pole", 3],
  // 바람골
  windmill: ["windmill", 12],
  pinwheel: ["pinwheel", 2],
  clothBanner: ["cloth_banner", 2],
  bamboo: ["bamboo", 6],
  stoneWall: ["stone_wall", 9],
  jars: ["jars", 8],
  blossom: ["blossom_tree", 6],
  pavilion: ["pavilion", 16],
  // 성국
  holyBrazier: ["sacred_brazier", 6, ["255,220,120", 18]],
  angel: ["angel_statue", 7],
  candles: ["candle_stand", 4, ["255,210,140", 18]],
  whiteBanner: ["white_banner", 3],
  bellTower: ["bell_tower", 12],
  churchAltar: ["church_altar", 9, ["255,230,160", 10]],
  pew: ["pew", 9],
  candleTall: ["candle_tall", 4, ["255,210,140", 20]],
  organ: ["organ", 9],
  // 새벽의 성흔 아지트 · 계단
  mapTable: ["map_table", 12, ["255,200,120", 8]],
  cell: ["prison_cell", 11],
  stairsDown: ["cellar_stairs", -99],
  stairsUp: ["stairs_up", -99],
  // 해저 열차: 창문은 코드 그림(지나가는 바다)
  trainWindow: ["", -99],
} as const satisfies Record<string, Row>;

export type LandDeco = keyof typeof LAND_DECO;

/** 해저 열차 창문 (벽 칸 위): 푸른 바다가 뒤로 흐름 · 거품 · 가끔 물고기 떼 (x = 칸 가운데, b = 칸 아래 끝) */
export function drawTrainWindow(g: CanvasRenderingContext2D, x: number, b: number, t: number): void {
  const [l, top, w, h] = [x - 10, b - 14, 20, 10];
  g.fillStyle = "#3a3440";
  g.fillRect(l - 1, top - 1, w + 2, h + 2);
  const sea = g.createLinearGradient(0, top, 0, top + h);
  sea.addColorStop(0, "#2a7ab8");
  sea.addColorStop(1, "#0c2a58");
  g.fillStyle = sea;
  g.fillRect(l, top, w, h);
  g.save();
  g.beginPath();
  g.rect(l, top, w, h);
  g.clip();
  // 열차가 오른쪽으로 가니 바깥은 왼쪽으로 흐름
  for (let i = 0; i < 4; i++) {
    const k = (t * 0.9 + i / 4 + x * 0.013) % 1;
    g.fillStyle = "rgba(220,245,255,0.7)";
    g.fillRect(l + w - k * (w + 4), top + 2 + ((i * 3 + x) % (h - 3)), 1, 1);
  }
  const f = (t * 0.25 + x * 0.007) % 1;
  if (f < 0.5) {
    g.fillStyle = "rgba(10,30,50,0.8)";
    for (let i = 0; i < 3; i++) g.fillRect(l + w - f * 2 * (w + 12) + i * 4, top + 4 + (i % 2) * 2, 3, 1);
  }
  g.restore();
  g.fillStyle = "rgba(255,255,255,0.18)";
  g.fillRect(l, top, w, 1);
}
