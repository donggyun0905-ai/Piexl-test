// 층 테마: 그 층 보스에 어울리는 바닥·벽 색과 바닥 꾸밈 (그리기 전용, 게임 계산과 상관없음)
// 보통 판은 bossForFloor, 영웅의 길은 heroBosses, 라스트 보스 층은 그 보스, 레이드 아레나는 지금 방의 보스
import { bossForFloor, ENEMIES, heroBosses, type PwArenaId, type RunState } from "@pixel-rogue/shared";
import { C } from "./palette";

/** 바닥 꾸밈: grass 풀 · leaf 잎 · rivet 쇠못 · ember 불씨 · crack 금 · bubble 물방울 · egg 알 · star 별 · bone 뼈 · petal 꽃잎 · feather 깃털 · sand 모래 · flower 꽃 */
export type Deco = "grass" | "leaf" | "rivet" | "ember" | "crack" | "bubble" | "egg" | "star" | "bone" | "petal" | "feather" | "sand" | "flower";

export interface FloorTheme {
  floorA: string;
  floorB: string;
  wall: string;
  wallTop: string;
  pillar: string;
  pillarTop: string;
  pillarShade: string;
  pit: string;
  pitEdge: string;
  /** 꾸밈 두 가지 [종류, 색] · 꾸밈이 나오는 칸 비율 */
  deco: readonly (readonly [Deco, string])[];
  density: number;
}

const T = (floorA: string, floorB: string, wall: string, wallTop: string, pillar: string, pillarTop: string, pit: string, pitEdge: string, deco: FloorTheme["deco"], density = 0.34): FloorTheme => ({
  floorA,
  floorB,
  wall,
  wallTop,
  pillar,
  pillarTop,
  pillarShade: wall,
  pit,
  pitEdge,
  deco,
  density,
});

const BASE: FloorTheme = { ...C, deco: [], density: 0 };
/** 천상의 방 (여신의 선물·천상의 상점): 하얀 대리석 바닥 · 연보라 벽 · 금빛 별·하얀 깃털 */
/** 시련의 방: 새빨간 바닥 · 핏빛 벽 · 붉은 금·불씨 */
const TRIAL = T("#3a0e14", "#320c12", "#5a141c", "#ff3a3a", "#4a1018", "#7a2028", "#140408", "#ff2a3a", [["crack", "#ff2a3a"], ["ember", "#ff7a3a"]], 0.14);
const HEAVEN = T("#f1eff8", "#e7e3f2", "#b4aed0", "#fff2c8", "#e4e0f0", "#fffaf0", "#c8c2dc", "#f0d890", [["feather", "#ffffff"], ["star", "#e8c25a"]], 0.16);

/** 보스 → 테마 */
const THEMES: Record<string, FloorTheme> = {
  /** 강철 거구: 용광로 공장 (쇠판·쇠못·불씨) */
  hulk: T("#2a2a2e", "#2f2f34", "#4a3a30", "#6a5240", "#5a5a62", "#7a7a84", "#120a06", "#3a1a08", [["rivet", "#6a6a74"], ["ember", "#ff8a2a"]]),
  /** 검은 기사: 성 (돌바닥·금·붉은 깃발 조각) */
  knight: T("#2c2a33", "#33303b", "#3e3a48", "#5a5468", "#5a5266", "#7a7088", "#0b0910", "#18141f", [["crack", "#1e1c24"], ["petal", "#8a2a2a"]]),
  /** 얍삽한 활잡이: 숲 (풀·잎) */
  archer: T("#1f2a1f", "#233023", "#2f4a2a", "#4a6a3a", "#4a3a2a", "#6a5238", "#0c1208", "#18240f", [["grass", "#3a6a2a"], ["leaf", "#8aa83a"]]),
  /** 무리 여왕: 붉은 둥지 (알·끈적한 바닥) */
  brood: T("#2e1f2a", "#35232f", "#4a2a40", "#6a3a5a", "#5a2a48", "#7a3a62", "#140810", "#2a1020", [["egg", "#c86a9a"], ["bubble", "#8a3a6a"]]),
  /** 세이렌: 바닷속 (물결·물방울, 구덩이는 깊은 물) */
  siren: T("#1a2638", "#1e2c40", "#2a4a6a", "#3a6a8a", "#3a5a7a", "#5a8aaa", "#06142a", "#0e2a4a", [["bubble", "#6ac0e8"], ["leaf", "#2a8a6a"]]),
  /** 켄타우로스: 초원 (풀·흙) */
  centaur: T("#2a2a1c", "#30301f", "#5a4a2a", "#7a6a3a", "#6a5a3a", "#8a7a4a", "#14100a", "#2a2010", [["grass", "#6a7a2a"], ["sand", "#8a7040"]]),
  /** 하드플랜트: 밀림 (덩굴·꽃) */
  plant: T("#1c2a1e", "#1f3022", "#2a4a28", "#3a6a34", "#2a5a2a", "#3a7a3a", "#081208", "#142414", [["leaf", "#3a8a3a"], ["flower", "#e04a6a"]]),
  /** 공허의 눈: 공허 (별) */
  seer: T("#14101e", "#181326", "#2a1f44", "#3e2e66", "#3a2a5a", "#5a4a8a", "#040208", "#100a1a", [["star", "#c8b8ff"], ["star", "#8a6aff"]], 0.26),
  /** 데스: 묘지 (뼈·금) */
  reaper: T("#1e1e24", "#232329", "#3a3a42", "#55555f", "#4a4a54", "#6a6a76", "#08080a", "#141418", [["bone", "#c8c4b4"], ["crack", "#141418"]]),
  /** 검신: 도장 (나무 바닥·벚꽃잎) */
  swordgod: T("#3a2a1c", "#40301f", "#5a3a24", "#7a5234", "#6a4a2a", "#8a6238", "#140c06", "#2a1a0c", [["petal", "#ff9ac8"], ["petal", "#ffd0e4"]], 0.24),
  /** 천사장: 신전 (흰 대리석·금빛·깃털) */
  archangel: T("#3a3848", "#423f52", "#6a6480", "#8a84a4", "#8a84a4", "#b8b2d0", "#141220", "#2a2638", [["feather", "#f4f0ff"], ["star", "#ffd860"]], 0.22),
  /** 늪의 두꺼비 왕: 늪 (물방울·잎, 구덩이는 늪물) */
  toad: T("#22281a", "#262d1d", "#3a4428", "#566236", "#3e4a2a", "#5a6a3a", "#0e1a10", "#1e3420", [["bubble", "#7a9a4a"], ["leaf", "#4a7a2a"]]),
  /** 불도롱뇽: 화산 동굴 (불씨·금) */
  salamander: T("#2a1e1a", "#30221d", "#4a2a20", "#6a3a26", "#5a3424", "#7a4a30", "#1a0804", "#4a1a08", [["ember", "#ff7a2a"], ["crack", "#ff5a1a"]]),
  /** 번개 해파리: 산호초 물가 (물방울·별 반짝임) */
  jelly: T("#16263a", "#192b40", "#245070", "#2e6a90", "#2a6a8a", "#3a8ab0", "#041428", "#0a2a4a", [["bubble", "#8ae0ff"], ["star", "#fff27a"]]),
  /** 유령선 선장: 썩은 갑판 (나무·뼈) */
  captain: T("#2a2420", "#302823", "#3a3230", "#544842", "#4a3a30", "#6a5446", "#0a0e14", "#16222e", [["crack", "#1a1410"], ["bone", "#b8c4b0"]], 0.22),
  /** 멸망의 용: 용암 (불씨·금) */
  dragon: T("#2a1414", "#301818", "#4a1e1a", "#6a2a22", "#5a2420", "#7a342a", "#3a0a04", "#8a2a08", [["ember", "#ff6a1a"], ["crack", "#ff3a0a"]]),
  /** 갓이터: 흑요석 지옥 */
  godeater: T("#1a0e14", "#20111a", "#3a1424", "#5a1e36", "#4a1a2e", "#6a2a44", "#0a0206", "#2a0612", [["ember", "#c83a5a"], ["crack", "#0a0206"]]),
  /** 태초의 빛과 어둠: 빛과 그림자가 갈린 바닥 */
  plight: T("#26242c", "#2c2a33", "#4a4658", "#6a6680", "#5a566a", "#8a86a0", "#060508", "#141218", [["star", "#fff4c0"], ["star", "#3a2a5a"]], 0.24),
  /** 검은 잔영: 사막 (모래 바닥·사암 벽·모래·뼈) */
  /** 괴력난신: 아르테의 태산 (바위 산길·이끼·금) */
  demigod: T("#3a3630", "#403b34", "#5a5248", "#7a7064", "#6a6258", "#8a8276", "#14110e", "#2a241e", [["crack", "#2a261f"], ["grass", "#5a7a3a"]], 0.3),
  /** 제천대성: 고대인들의 옛 땅 세레스티아 (구름 위 금빛 신전 바닥·꽃잎·깃털) */
  sage: T("#3a3848", "#423f52", "#6a5a3a", "#9a8250", "#7a6a4a", "#b8a070", "#141220", "#2a2638", [["petal", "#ffd860"], ["feather", "#f4f0ff"]], 0.26),
  umbra: T("#6a5234", "#735a39", "#8a6a40", "#b08a52", "#9a7646", "#c09a5e", "#2a1a0a", "#4a3018", [["sand", "#a8844c"], ["bone", "#d8ccb0"]], 0.3),
};

/** 패왕전 경기장 → 테마 */
const PW_THEME: Record<PwArenaId, string> = {
  small: "swordgod", wide: "centaur", forest: "archer", field: "plant", manor: "knight",
  dLava: "salamander", dMarsh: "toad", dGarden: "jelly", dSpike: "reaper",
  pCross: "centaur", pLava: "salamander", pMaze: "archer", pShore: "siren", pMud: "toad",
  tFort: "dragon", tRiver: "jelly", tGrove: "plant", tTemple: "swordgod",
  qVolcano: "salamander", qSwamp: "toad", qCanyon: "centaur", qGarden: "plant",
  bLava: "dragon", bPonds: "jelly", bGrass: "archer", bRuins: "knight",
  gCastle: "knight", gVolcano: "salamander", gVillage: "toad", gPrison: "reaper",
  cHall: "knight", cCliff: "reaper", cRing: "swordgod", gContest: "archangel", gWar: "centaur", gGiga: "plant",
  practice: "plant",
};

/** 광야의 새벽 맵 → 테마 */
const SWARM_THEME = { plains: "centaur", ruins: "knight", fort: "reaper", swamp: "plant", volcano: "dragon" } as const;

/** 지금 층(방)의 테마 */
export function themeFor(s: RunState): FloorTheme {
  if (s.tdShared) return BASE;
  const room = s.map?.rooms[s.roomId];
  if (room && (room.heaven || room.type === "golden")) return HEAVEN;
  if (room?.type === "trial") return TRIAL;
  if (s.swarm) return THEMES[SWARM_THEME[(s.swarm.map ?? "plains") as keyof typeof SWARM_THEME] ?? SWARM_THEME.plains]!;
  const pa = s.pvp?.arena ?? s.pw?.arena;
  if (pa) return THEMES[PW_THEME[pa]]!;
  let boss: string | undefined;
  // 연습장에서 부른 시즌 2 라스트 보스도 그 맵
  const s2 = s.enemies.find((e) => e.kind === "umbra" || e.kind === "demigod" || e.kind === "sage")?.kind;
  if (s.lastBoss) boss = s.lastBoss === "pdark" ? "plight" : s.lastBoss;
  else if (s2) boss = s2;
  else if (s.arenaLv) boss = s.enemies.find((e) => ENEMIES[e.kind].boss)?.kind;
  else if (s.hero) boss = heroBosses(s)[0];
  else if (s.floor >= 1) boss = bossForFloor(s.floor, s.seed);
  return (boss && THEMES[boss === "pdark" ? "plight" : boss]) || BASE;
}

/** 칸마다 정해진 값 0~1 (같은 칸은 늘 같은 꾸밈) */
function hash(a: number, b: number, c: number): number {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** 바닥 칸 하나에 꾸밈 (x, y = 칸 왼쪽 위, size = 칸 크기) */
export function drawDeco(ctx: CanvasRenderingContext2D, th: FloorTheme, col: number, row: number, x: number, y: number, size: number, floor: number): void {
  if (!th.deco.length) return;
  const r = hash(col, row, floor);
  if (r > th.density) return;
  const [kind, color] = th.deco[Math.floor(hash(row, col, floor + 7) * th.deco.length)]!;
  const px = x + 2 + Math.floor(hash(col, floor, row) * (size - 6));
  const py = y + 2 + Math.floor(hash(floor, row, col) * (size - 6));
  ctx.fillStyle = color;
  const dot = (dx: number, dy: number, w = 1, h = 1) => ctx.fillRect(px + dx, py + dy, w, h);
  switch (kind) {
    case "grass":
      dot(0, 1, 1, 2);
      dot(1, 0, 1, 3);
      dot(2, 1, 1, 2);
      break;
    case "leaf":
      dot(0, 1, 2, 1);
      dot(1, 0, 2, 1);
      break;
    case "rivet":
      dot(0, 0);
      dot(size - 8, 0);
      break;
    case "ember":
      dot(0, 0);
      if (r < th.density / 2) dot(2, 1);
      break;
    case "crack":
      dot(0, 0, 2, 1);
      dot(2, 1, 1, 1);
      dot(3, 2, 2, 1);
      break;
    case "bubble":
      ctx.fillRect(px, py, 2, 2);
      dot(3, -1);
      break;
    case "egg":
      dot(0, 0, 2, 3);
      dot(3, 1, 2, 2);
      break;
    case "star":
      dot(0, 0);
      if (r < th.density / 3) {
        dot(-1, 0);
        dot(1, 0);
        dot(0, -1);
        dot(0, 1);
      }
      break;
    case "bone":
      dot(0, 0, 4, 1);
      dot(-1, -1);
      dot(-1, 1);
      dot(4, -1);
      dot(4, 1);
      break;
    case "petal":
      dot(0, 0, 2, 1);
      dot(1, 1);
      break;
    case "feather":
      dot(0, 2, 1, 1);
      dot(1, 1, 1, 1);
      dot(2, 0, 2, 1);
      break;
    case "sand":
      dot(0, 0);
      dot(2, 1);
      dot(4, 0);
      break;
    case "flower":
      dot(0, 1);
      dot(2, 1);
      dot(1, 0);
      dot(1, 2);
      ctx.fillStyle = "#ffe060";
      dot(1, 1);
      break;
  }
}
