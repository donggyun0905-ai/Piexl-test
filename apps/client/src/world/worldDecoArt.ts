// 그림 파일로 그리는 장식 (장소 표의 장식 deco, worldDeco가 먼저 부름): 건물 안 가구 · 헬리오스 분수·제단 · 테라코어 기계·가로등·열차 칸 · 비르디아 버섯·수풀·랜턴
// 그림(public/world/obj, 손질 scripts/art/world_art.py)이 있으면 그 그림 · 지역마다 다른 그림은 Region.skin (술집 탁자·공방 상자 등)
// (x, b) = 칸 가운데 x · 아래 끝 y
import { shadow } from "./worldArt";
import { drawTrainWindow, LAND_DECO, type LandDeco } from "./worldDecoLand";
import { ART_DENS, objOf } from "./worldTex";
import { castShadow, drawSway, gust } from "./worldWeather";

/** 그림으로만 그리는 새 장식 (그림이 없으면 작은 상자) */
export type ArtDeco = "longTable" | "crates" | "lamp" | "gearMachine" | "steamTank" | "yardCrane" | "robot" | "pipes" | "crateStack" | "trainCar" | "mushroom" | "fern" | "flowerBush" | "lantern" | LandDeco;

/** 부딪힘 반지름 (픽셀) */
export const ART_DECO_R: Record<ArtDeco, number> = {
  longTable: 14, crates: 7, lamp: 2, gearMachine: 12, steamTank: 10, yardCrane: 10, robot: 6, pipes: 8, crateStack: 8, trainCar: 14, mushroom: 6, fern: 6, flowerBush: 6, lantern: 3,
  ...(Object.fromEntries(Object.entries(LAND_DECO).map(([k, v]) => [k, v[1]])) as Record<LandDeco, number>),
};

/** 장식 → 그림 이름 (코드 그림이 있는 가구도 그림이 있으면 그림으로) */
const IMG: Record<string, string> = {
  bed: "bed", table: "dining_table", shelf: "bookshelf", fireplace: "fireplace", throne: "throne", pillar: "pillar", armor: "armor_stand", barrel: "barrels", plant: "potted_plant",
  counter: "shop_counter", potions: "potion_shelf", rack: "weapon_rack", dummy: "dummy", fountainGold: "fountain_gold", altar: "black_altar",
  longTable: "long_table", crates: "crates", lamp: "gas_lamp", gearMachine: "gear_machine", steamTank: "steam_tank", yardCrane: "yard_crane", robot: "guard_robot",
  pipes: "pipe_bundle", crateStack: "crate_stack", trainCar: "train_car", mushroom: "glow_mushroom", fern: "fern", flowerBush: "flower_bush", lantern: "lantern_post",
  ...Object.fromEntries(Object.entries(LAND_DECO).map(([k, v]) => [k, v[0]])),
};
/** 불·빛이 나는 것: 그림 위에 깜박이는 빛 (색, 빛 높이) */
const GLOW: Record<string, readonly [string, number]> = {
  fireplace: ["255,170,80", 5], lamp: ["255,214,140", 22], mushroom: ["120,190,255", 6], lantern: ["140,255,170", 15], altar: ["190,110,255", 13],
  ...Object.fromEntries(Object.entries(LAND_DECO).flatMap(([k, v]) => ("2" in v ? [[k, v[2]]] : []))),
};

/** 그림이 있으면 그리고 true (없으면 false → 코드 그림) */
export function drawArtDeco(g: CanvasRenderingContext2D, art: string, x: number, b: number, t: number, r: number): boolean {
  if (art === "trainWindow") {
    drawTrainWindow(g, x, b, t);
    return true;
  }
  const name = IMG[art];
  const img = name ? objOf(name) : undefined;
  if (!img) {
    if (!(art in ART_DECO_R)) return false;
    r = Math.max(4, r);
    // 그림을 못 받았을 때: 작은 상자
    shadow(g, x, b, r + 2, 2.5, 0.3);
    g.fillStyle = "#6a5a4a";
    g.fillRect(x - r, b - r * 1.5, r * 2, r * 1.5);
    return true;
  }
  if (r > 0) shadow(g, x, b, r + 2, 2.5, 0.3);
  if (art === "kite") drawKite(g, img, x, b, t);
  else drawProp(g, name ?? art, img, x, b, t, r);
  const gl = GLOW[art];
  if (gl) {
    const k = 0.22 + Math.sin(t * 7 + x) * 0.05;
    const y = b - gl[1];
    const glow = g.createRadialGradient(x, y, 0, x, y, 20);
    glow.addColorStop(0, `rgba(${gl[0]},${k})`);
    glow.addColorStop(1, `rgba(${gl[0]},0)`);
    g.fillStyle = glow;
    g.fillRect(x - 20, y - 20, 40, 40);
  }
  return true;
}

/** 바람에 윗부분이 흔들리는 그림 (대나무·해초·천 깃발·야자수·꽃나무) */
const SWAY = new Set(["bamboo", "kelp_tall", "cloth_banner", "white_banner", "palm", "palm2", "blossom_tree", "willow"]);

/** 물건 그림 하나 (발 = x, b): 부딪히는 것은 한 방향 그림자 · 흔들리는 그림은 띠마다 기울임 */
export function drawProp(g: CanvasRenderingContext2D, name: string, img: HTMLImageElement, x: number, b: number, t: number, r: number): void {
  const w = img.naturalWidth / ART_DENS;
  const h = img.naturalHeight / ART_DENS;
  if (r > 0) castShadow(g, img, x, b + 1, w, h);
  g.drawImage(img, 0, 0, 0, 0);
  if (SWAY.has(name)) drawSway(g, img, Math.round(x - w / 2), Math.round(b + 1 - h), w, h, t, name === "kelp_tall" ? 3 : 1.5);
  else g.drawImage(img, Math.round(x - w / 2), Math.round(b + 1 - h), w, h);
}

/** 비연 연: 땅에 박은 말뚝에서 줄이 올라가 하늘에서 바람 따라 오르내림 */
function drawKite(g: CanvasRenderingContext2D, img: HTMLImageElement, x: number, b: number, t: number): void {
  const s = gust(t, x);
  const kx = x + 14 + s * 6;
  const ky = b - 52 + Math.sin(t * 1.7 + x) * 4 - s * 3;
  g.fillStyle = "#6a4a2a";
  g.fillRect(x - 1, b - 4, 2, 4);
  g.strokeStyle = "rgba(240,240,230,0.7)";
  g.lineWidth = 0.5;
  g.beginPath();
  g.moveTo(x, b - 4);
  g.quadraticCurveTo(x + 4 + s * 4, b - 20, kx, ky);
  g.stroke();
  const w = img.naturalWidth / ART_DENS;
  const h = img.naturalHeight / ART_DENS;
  g.save();
  g.translate(kx, ky);
  g.rotate(Math.sin(t * 2.3 + x) * 0.12 + s * 0.05);
  g.drawImage(img, -w / 2, -h / 2, w, h);
  g.restore();
}
