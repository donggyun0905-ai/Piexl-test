// 그림 파일로 그리는 장식 (장소 표의 장식 deco, worldDeco가 먼저 부름): 건물 안 가구 · 헬리오스 분수·제단 · 테라코어 기계·가로등·열차 칸 · 비르디아 버섯·수풀·랜턴
// 그림(public/world/obj, 손질 scripts/art/world_art.py)이 있으면 그 그림 · 지역마다 다른 그림은 Region.skin (술집 탁자·공방 상자 등)
// (x, b) = 칸 가운데 x · 아래 끝 y
import { shadow } from "./worldArt";
import { drawObj, objOf } from "./worldTex";

/** 그림으로만 그리는 새 장식 (그림이 없으면 작은 상자) */
export type ArtDeco = "longTable" | "crates" | "lamp" | "gearMachine" | "steamTank" | "yardCrane" | "robot" | "pipes" | "crateStack" | "trainCar" | "mushroom" | "fern" | "flowerBush" | "lantern";

/** 부딪힘 반지름 (픽셀) */
export const ART_DECO_R: Record<ArtDeco, number> = {
  longTable: 14, crates: 7, lamp: 2, gearMachine: 12, steamTank: 10, yardCrane: 10, robot: 6, pipes: 8, crateStack: 8, trainCar: 14, mushroom: 6, fern: 6, flowerBush: 6, lantern: 3,
};

/** 장식 → 그림 이름 (코드 그림이 있는 가구도 그림이 있으면 그림으로) */
const IMG: Record<string, string> = {
  bed: "bed", table: "dining_table", shelf: "bookshelf", fireplace: "fireplace", throne: "throne", pillar: "pillar", armor: "armor_stand", barrel: "barrels", plant: "potted_plant",
  counter: "shop_counter", potions: "potion_shelf", rack: "weapon_rack", dummy: "dummy", fountainGold: "fountain_gold", altar: "black_altar",
  longTable: "long_table", crates: "crates", lamp: "gas_lamp", gearMachine: "gear_machine", steamTank: "steam_tank", yardCrane: "yard_crane", robot: "guard_robot",
  pipes: "pipe_bundle", crateStack: "crate_stack", trainCar: "train_car", mushroom: "glow_mushroom", fern: "fern", flowerBush: "flower_bush", lantern: "lantern_post",
};
/** 불·빛이 나는 것: 그림 위에 깜박이는 빛 (색, 빛 높이) */
const GLOW: Record<string, readonly [string, number]> = {
  fireplace: ["255,170,80", 5], lamp: ["255,214,140", 22], mushroom: ["120,190,255", 6], lantern: ["140,255,170", 15], altar: ["190,110,255", 13],
};

/** 그림이 있으면 그리고 true (없으면 false → 코드 그림) */
export function drawArtDeco(g: CanvasRenderingContext2D, art: string, x: number, b: number, t: number, r: number): boolean {
  const name = IMG[art];
  const img = name ? objOf(name) : undefined;
  if (!img) {
    if (!(art in ART_DECO_R)) return false;
    // 그림을 못 받았을 때: 작은 상자
    shadow(g, x, b, r + 2, 2.5, 0.3);
    g.fillStyle = "#6a5a4a";
    g.fillRect(x - r, b - r * 1.5, r * 2, r * 1.5);
    return true;
  }
  if (r > 0) shadow(g, x, b, r + 2, 2.5, 0.3);
  drawObj(g, img, x, b + 1);
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
