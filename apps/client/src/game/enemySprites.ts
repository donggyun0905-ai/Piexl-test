// 몬스터 그림 (public/sprites/enemies/{종류}.png, 오른쪽을 봄, 움직임 칸을 가로로): 불러오기 · 색 입히기 · 모양 그림 · 그리기
// ENEMY_SRC: 2배 촘촘한 그림 (칸이 두 배 · 게임에서는 원래 크기로 줄여 그림, 4칸 = 걷기 2 · 공격 준비 · 공격)
import { mipFor, screenScale } from "./mipmap";
import { draftSrc } from "./customArt";

/** 몬스터 그림 (public/sprites/enemies/{종류}.png, 오른쪽을 봄, 움직임 칸을 가로로) */
export const ENEMY_SPRITES: readonly string[] = [
  "dummy", "crawler", "spitter", "mortar", "charger", "gnat", "guardian", "paladin", "tower", "soul", "ghost",
  "hulk", "brood", "seer", "knight", "archer", "siren", "centaur", "plant", "reaper", "swordgod", "archangel", "toad", "salamander", "jelly", "captain",
  "godeater", "ruinblade", "chaosblade", "plight", "pdark", "dragon", "umbra", "sandworm", "scorpion", "roc", "sandworm_dark", "scorpion_dark", "roc_dark", "demigod", "sage", "sage_cloud",
  "slime", "runner", "bat", "beetle", "golem", "shaman", "eggsac", "wisp", "doppel", "venom", "landfish", "lurker", "bombbug", "skelarcher", "chainward", "highorc",
  // 서큐버스(무리 여왕)가 부른 졸개
  "incubus",
];
const enemyImages = new Map<string, HTMLImageElement>();
for (const name of ENEMY_SPRITES) {
  const img = new Image();
  img.src = draftSrc(`enemy:${name}`) ?? `${import.meta.env.BASE_URL}sprites/enemies/${name}.png`;
  img.onload = () => enemyImages.set(name, img);
}

/** 색을 입힌 그림 (맞음 흰색 · 기절 푸른빛 · 공격 준비 노란빛) */
const tinted = new Map<string, HTMLCanvasElement>();
function tintOf(name: string, img: HTMLImageElement, color: string, amount: number): HTMLCanvasElement {
  const key = `${name}|${color}|${amount}`;
  let cv = tinted.get(key);
  if (!cv) {
    cv = document.createElement("canvas");
    cv.width = img.width;
    cv.height = img.height;
    const c = cv.getContext("2d")!;
    c.drawImage(img, 0, 0);
    c.globalCompositeOperation = "source-atop";
    c.globalAlpha = amount;
    c.fillStyle = color;
    c.fillRect(0, 0, cv.width, cv.height);
    tinted.set(key, cv);
  }
  return cv;
}

/** 몬스터 그림 모양만 한 가지 색으로 꽉 채운 그림 (테두리·명암 없음, 이무기의 기로 된 용) · 아직 못 불러왔으면 undefined */
const shapes = new Map<string, HTMLCanvasElement>();
export function shapeSprite(kind: string, color: string): HTMLCanvasElement | undefined {
  const img = enemyImages.get(kind);
  if (!img) return undefined;
  const key = `${kind}|${color}`;
  let cv = shapes.get(key);
  if (!cv) {
    cv = document.createElement("canvas");
    cv.width = img.width;
    cv.height = img.height;
    const c = cv.getContext("2d")!;
    c.drawImage(img, 0, 0);
    c.globalCompositeOperation = "source-in";
    c.fillStyle = color;
    c.fillRect(0, 0, cv.width, cv.height);
    shapes.set(key, cv);
  }
  return cv;
}

/** 2배 촘촘하게 다시 그린 몬스터 (그림 칸 ÷ 이 값 = 게임 크기) */
/** 일반 몬스터 20종은 2배 (원래 그림 그대로 촘촘하게, scripts/art/hd_monsters_2x, 2026-10-31) */
const HD2 = "crawler spitter mortar charger gnat guardian paladin slime runner bat beetle golem shaman eggsac wisp venom landfish lurker soul doppel bombbug skelarcher chainward".split(" ");
/** 하이오크는 큰 도트 48칸의 2배 (scripts/art/highorc_sprite, 칸: 걷기 2 · 도끼 치켜듦) */
export const ENEMY_SRC: Readonly<Record<string, number>> = { highorc: 2, hulk: 2, seer: 2, tower: 2, brood: 4, dragon: 4, ...Object.fromEntries(HD2.map((k) => [k, 2])) };

/** 몬스터 그림 한 칸 크기 (게임 크기, 아직 못 불러왔으면 undefined) */
export const enemyCell = (kind: string): number | undefined => {
  const h = enemyImages.get(kind)?.height;
  return h && h / (ENEMY_SRC[kind] ?? 1);
};
/** 몬스터 그림 칸 수 (고해상도 보스는 4칸: 걷기 2 · 공격 준비 · 공격) */
export const enemyFrames = (kind: string): number => {
  const img = enemyImages.get(kind);
  return img ? Math.max(1, Math.floor(img.width / img.height)) : 0;
};

/** 몬스터 그림이 있으면 (x, y) 가운데로 그리고 true. tint: [색, 세기] · scale: 원래 크기보다 크거나 작을 때 (타워 디펜스 보스 등) */
export function drawEnemySprite(ctx: CanvasRenderingContext2D, kind: string, x: number, y: number, frame: number, flip: boolean, tint?: readonly [string, number], scale = 1): boolean {
  const img = enemyImages.get(kind);
  if (!img) return false;
  const cell = img.height;
  const hd = ENEMY_SRC[kind] ?? 1;
  const size = (cell * scale) / hd;
  const frames = Math.max(1, Math.floor(img.width / cell));
  const src = tint ? tintOf(kind, img, tint[0], tint[1]) : img;
  // 화면 픽셀에 맞춰 놓음 (반 픽셀에 걸치면 흐려짐)
  const k = screenScale(ctx);
  const left = Math.round((x - size / 2) * k) / k;
  const top = Math.round((y - size / 2) * k) / k;
  ctx.save();
  if (flip) {
    ctx.translate(left + size, top);
    ctx.scale(-1, 1);
  } else ctx.translate(left, top);
  // 줄여 그리면 화면 크기에 딱 맞춘 그림(mipmap)을 거의 1:1로 · 키워 그리면 또렷한 픽셀 그대로 (부드럽게는 아주 조금 줄일 때만)
  const [from, m] = mipFor(src, cell / (size * k));
  ctx.imageSmoothingEnabled = m === 1 && cell > size * k;
  ctx.drawImage(from, (frame % frames) * cell * m, 0, cell * m, cell * m, 0, 0, size, size);
  ctx.restore();
  return true;
}
