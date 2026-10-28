// 그림 교체 준비: public/sprites/ 에 PNG를 넣고 아래 목록에 이름을 적으면 도형 대신 그 그림을 그림.
// 목록에 없거나 아직 못 불러온 그림은 지금처럼 도형으로 그림. 규격은 docs/ART.md
import type { CharacterId } from "@pixel-rogue/shared";
import { equippedSkin } from "../shop/wallet";
import { draftSrc, mySkinSrc } from "./customArt";

/** 넣은 그림 이름 (확장자 빼고). 예: "warden", "crawler" */
const SPRITE_FILES: readonly string[] = [];

const images = new Map<string, HTMLImageElement>();

for (const name of SPRITE_FILES) {
  const img = new Image();
  img.src = `${import.meta.env.BASE_URL}sprites/${name}.png`;
  img.onload = () => images.set(name, img);
}

/** 몬스터 그림 (public/sprites/enemies/{종류}.png, 오른쪽을 봄, 움직임 칸을 가로로) */
export const ENEMY_SPRITES: readonly string[] = [
  "dummy", "crawler", "spitter", "mortar", "charger", "gnat", "guardian", "paladin", "tower", "soul", "ghost",
  "hulk", "brood", "seer", "knight", "archer", "siren", "centaur", "plant", "reaper", "swordgod", "archangel",
  "godeater", "ruinblade", "chaosblade", "plight", "pdark", "dragon", "umbra", "sandworm", "scorpion", "roc", "sandworm_dark", "scorpion_dark", "roc_dark", "demigod", "sage", "sage_cloud",
  "slime", "runner", "bat", "beetle", "golem", "shaman", "eggsac", "wisp",
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

/** 몬스터 그림이 있으면 (x, y) 가운데로 그리고 true. tint: [색, 세기] · scale: 원래 크기보다 크거나 작을 때 (타워 디펜스 보스 등) */
/** 몬스터 그림 한 칸 크기 (아직 못 불러왔으면 undefined) */
export const enemyCell = (kind: string): number | undefined => enemyImages.get(kind)?.height;

export function drawEnemySprite(ctx: CanvasRenderingContext2D, kind: string, x: number, y: number, frame: number, flip: boolean, tint?: readonly [string, number], scale = 1): boolean {
  const img = enemyImages.get(kind);
  if (!img) return false;
  const cell = img.height;
  const size = cell * scale;
  const frames = Math.max(1, Math.floor(img.width / cell));
  const src = tint ? tintOf(kind, img, tint[0], tint[1]) : img;
  const left = Math.round(x - size / 2);
  const top = Math.round(y - size / 2);
  ctx.save();
  if (flip) {
    ctx.translate(left + size, top);
    ctx.scale(-1, 1);
  } else ctx.translate(left, top);
  ctx.drawImage(src, (frame % frames) * cell, 0, cell, cell, 0, 0, size, size);
  ctx.restore();
  return true;
}

/**
 * 그림이 있으면 (x, y)를 가운데로 그리고 true. 없으면 false (도형으로 그리기).
 * 가로로 여러 칸이 이어진 그림이면 frame 번째 칸 (한 칸은 세로 길이와 같은 정사각형)
 */
export function drawSprite(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, frame = 0, flip = false): boolean {
  const img = images.get(name);
  if (!img) return false;
  const size = img.height;
  const frames = Math.max(1, Math.floor(img.width / size));
  const sx = (frame % frames) * size;
  const left = Math.round(x - size / 2);
  const top = Math.round(y - size / 2);
  if (flip) {
    ctx.save();
    ctx.translate(left + size, top);
    ctx.scale(-1, 1);
    ctx.drawImage(img, sx, 0, size, size, 0, 0, size, size);
    ctx.restore();
  } else {
    ctx.drawImage(img, sx, 0, size, size, left, top, size, size);
  }
  return true;
}

// ── 캐릭터 방향 시트 ──
// 한 칸 크기 정사각형, 4줄 × 4칸: 1줄 앞(아래), 2줄 뒤(위), 3줄 옆(오른쪽, 왼쪽은 뒤집음), 4줄 마법 쓰기
// 테두리가 잘리지 않게 칸 둘레에 여백을 둠
/** 방향 시트로 넣은 캐릭터 그림: 이름 → 한 칸 크기, 발 아래 여백 */
const CHARACTER_SHEETS: Readonly<Record<string, { size: number; footPad: number }>> = {
  mage: { size: 32, footPad: 2 },
  drifter: { size: 32, footPad: 2 },
  warden: { size: 32, footPad: 2 },
  mystic: { size: 32, footPad: 2 },
  engineer: { size: 32, footPad: 2 },
  elementalist: { size: 32, footPad: 2 },
  brawler: { size: 32, footPad: 2 },
  doctor: { size: 32, footPad: 2 },
  gunner: { size: 32, footPad: 2 },
  beast: { size: 32, footPad: 2 },
  ninja: { size: 32, footPad: 2 },
  chronomancer: { size: 32, footPad: 2 },
  summoner: { size: 32, footPad: 2 },
  novice: { size: 32, footPad: 2 },
  bedouin: { size: 32, footPad: 2 },
  general: { size: 32, footPad: 2 },
  imugi: { size: 32, footPad: 2 },
  apostle: { size: 32, footPad: 2 },
  stargazer: { size: 32, footPad: 2 },
  duck: { size: 32, footPad: 2 },
  scribe: { size: 32, footPad: 2 },
  idra: { size: 32, footPad: 2 },
  byeonhui: { size: 32, footPad: 2 },
  fly: { size: 32, footPad: 2 },
  elder: { size: 32, footPad: 2 },
  ren: { size: 32, footPad: 2 },
  spiritist: { size: 32, footPad: 2 },
  plague: { size: 32, footPad: 2 },
  slayer: { size: 48, footPad: 3 },
  eater: { size: 32, footPad: 2 },
  mukin: { size: 48, footPad: 3 },
  samyeol: { size: 32, footPad: 2 },
  automata: { size: 32, footPad: 2 },
  rider: { size: 48, footPad: 3 },
  bomber: { size: 32, footPad: 2 },
  artifacter: { size: 32, footPad: 2 },
  punk: { size: 32, footPad: 2 },
  tracker: { size: 32, footPad: 2 },
  forgotten: { size: 32, footPad: 2 },
  remnant: { size: 32, footPad: 2 },
  wanderer: { size: 32, footPad: 2 },
  silk: { size: 32, footPad: 2 },
  miner: { size: 64, footPad: 3 },
  voyager: { size: 48, footPad: 3 }, zeus: { size: 48, footPad: 3 },
  // 변희가 변한 동물 (옆모습만, render/actors가 옆을 보게 그림)
  ...Object.fromEntries(["wolf", "bear", "eagle", "snake", "boar", "scorpion", "bat", "elephant", "spider", "phoenix"].flatMap((a) => [[`morph-${a}`, { size: 32, footPad: 2 }], [`morph-${a}-evo`, { size: 48, footPad: 3 }]])),
  abandoned: { size: 32, footPad: 2 },
  abandoned2: { size: 32, footPad: 2 },
  abandoned3: { size: 32, footPad: 2 },
  titan: { size: 48, footPad: 3 },
  oni: { size: 48, footPad: 3 },
  novice5: { size: 32, footPad: 2 },
  novice10: { size: 32, footPad: 2 },
  novice15: { size: 32, footPad: 2 },
  novice20: { size: 32, footPad: 2 },
};

for (const name of Object.keys(CHARACTER_SHEETS)) {
  const img = new Image();
  img.src = draftSrc(name) ?? `${import.meta.env.BASE_URL}sprites/${name}.png`;
  img.onload = () => images.set(name, img);
}

/** 캐릭터 그림 이름: 입은 스킨이 있으면 스킨, 풋내기는 5레벨마다 옷이 바뀜 (5·10·15·20) */
/** member: 버려진 자들의 지금 아이 (0 P1 · 1 P2 · 2 P3, 그림 abandoned·abandoned2·abandoned3, 스킨은 뒤에 _p2·_p3) */
export function sheetFor(id: string, lv = 1, member = 0): string {
  const skin = equippedSkin(id as CharacterId);
  if (id === "abandoned" && member > 0) return skin ? `${skin}_p${member + 1}` : `abandoned${member + 1}`;
  if (skin) return skin;
  if (id !== "novice") return id;
  const tier = Math.min(20, Math.floor(lv / 5) * 5);
  return tier >= 5 ? `novice${tier}` : id;
}

/** 스킨 그림 (public/sprites/skins/): 처음 쓸 때 불러옴 (다 불러오기 전에는 기본 그림) */
const SKIN_SHEET = { size: 32, footPad: 2 };
/** 거인·오니(큰 방망이) 그림은 48칸 */
export const bigSheet = (name: string) => name.startsWith("titan") || name.startsWith("oni") || name.startsWith("mukin") || name.startsWith("slayer") || name.startsWith("rider");
/** 거인·오니 스킨은 큰 그림 */
const TITAN_SKIN_SHEET = { size: 48, footPad: 3 };
const skinImages = new Map<string, HTMLImageElement | null>();
export function skinImage(name: string): HTMLImageElement | undefined {
  if (!skinImages.has(name)) {
    skinImages.set(name, null);
    const img = new Image();
    img.src = mySkinSrc(name) ?? draftSrc(name) ?? `${import.meta.env.BASE_URL}sprites/skins/${name}.png`;
    img.onload = () => skinImages.set(name, img);
  }
  return skinImages.get(name) ?? undefined;
}

/** 공격하면 몇 틱 동안 마법 쓰는 모습 */
const CAST_TICKS = 10;
let lastAttackCount = 0;
let castFrom = -1;

/** 공격 횟수가 늘어난 뒤 CAST_TICKS 동안 true (그리기 전용 기억) */
export function isCasting(tick: number, attackCount: number): boolean {
  if (attackCount !== lastAttackCount) {
    if (attackCount > lastAttackCount) castFrom = tick;
    lastAttackCount = attackCount;
  }
  return tick >= castFrom && tick < castFrom + CAST_TICKS;
}

export interface CharacterPose {
  faceX: number;
  faceY: number;
  moving: boolean;
  /** 마법 쓰는 중이면 true */
  casting: boolean;
  /** 걷기 장면 번호 */
  step: number;
}

/**
 * 방향 시트 캐릭터를 그림. (x, y)는 몸 중심 (발은 아래쪽 r 근처).
 * 그림이 없으면 false (도형으로 그리기)
 */
/** 오니 방망이 그림 (public/sprites/oni_clubs/{무기}.png: 위 4줄 = 몸 뒤 · 아래 4줄 = 몸 앞, scripts/art/oni_clubs.py) */
const clubImages = new Map<string, HTMLImageElement | null>();
function clubImage(id: string): HTMLImageElement | undefined {
  if (!clubImages.has(id)) {
    clubImages.set(id, null);
    const img = new Image();
    img.src = `${import.meta.env.BASE_URL}sprites/oni_clubs/${id}.png`;
    img.onload = () => clubImages.set(id, img);
  }
  return clubImages.get(id) ?? undefined;
}

/** club: 오니가 든 방망이 무기 (없으면 명뢰봉, null이면 빈손) */
export function drawCharacter(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, r: number, pose: CharacterPose, club?: string | null): boolean {
  const sheet = CHARACTER_SHEETS[name] ?? (name.includes("_") ? (bigSheet(name) ? TITAN_SKIN_SHEET : SKIN_SHEET) : undefined);
  const img = sheet && name.includes("_") ? skinImage(name) : images.get(name);
  if (!sheet || !img) return false;
  const { size, footPad } = sheet;
  const side = Math.abs(pose.faceX) > Math.abs(pose.faceY);
  let row: number;
  let col: number;
  let flip = false;
  if (pose.casting && pose.faceY > -0.5) {
    // 앞을 보면 팔을 오른쪽으로 뻗은 1번째 칸, 옆이면 4번째 칸
    row = 3;
    col = side ? 3 : 0;
    flip = pose.faceX < 0;
  } else {
    row = side ? 2 : pose.faceY < 0 ? 1 : 0;
    col = pose.moving ? pose.step % 4 : 0;
    flip = side && pose.faceX < 0;
  }
  // 그림 맨 아래(발)를 몸 아래쪽에 맞춤
  const left = Math.round(x - size / 2);
  const top = Math.round(y + r + 1 + footPad - size);
  const sx = col * size;
  const sy = row * size;
  const blit = (from: HTMLImageElement, y0: number) => {
    if (flip) {
      ctx.save();
      ctx.translate(left + size, top);
      ctx.scale(-1, 1);
      ctx.drawImage(from, sx, y0, size, size, 0, 0, size, size);
      ctx.restore();
    } else {
      ctx.drawImage(from, sx, y0, size, size, left, top, size, size);
    }
  };
  // 오니: 무기마다 다른 방망이를 몸 뒤·앞 두 겹으로 (같은 칸 자리)
  const clubImg = name.startsWith("oni") && club !== null ? clubImage(club ?? "thunderClub") : undefined;
  if (clubImg) blit(clubImg, sy);
  blit(img, sy);
  if (clubImg) blit(clubImg, sy + size * 4);
  return true;
}
