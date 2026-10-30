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

export * from "./enemySprites";


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
/** src: 그림 파일의 한 칸 크기가 다를 때 (빛의 사도 성장 그림 2배 촘촘 · 몰락한 왕 96칸 → 보통 크기로 줄여 그림) */
/** v2: 새 시트 4칸 × 5줄 (칸 = 앞·뒤·왼·오): 1줄 서기 · 2줄 공격 · 3줄 걷기(왼발) · 4줄 걷기(오른발) · 5줄 맞음·쓰러짐·대시 오른쪽·대시 왼쪽 (scripts/art/import_v2.py) */
const CHARACTER_SHEETS: Readonly<Record<string, { size: number; footPad: number; src?: number; v2?: true }>> = {
  mage: { size: 32, footPad: 2, src: 128 },
  drifter: { size: 32, footPad: 2 },
  warden: { size: 32, footPad: 2, src: 128 },
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
  wanderer: { size: 48, footPad: 3 },
  silk: { size: 32, footPad: 2 },
  miner: { size: 64, footPad: 3 },
  voyager: { size: 48, footPad: 3 }, zeus: { size: 48, footPad: 3 }, pilgrim: { size: 80, footPad: 3 }, crownKing: { size: 80, footPad: 3 }, fallenKing: { size: 50, footPad: 2, src: 96 }, lux: { size: 48, footPad: 3 }, lux2: { size: 56, footPad: 3, src: 112 }, lux3: { size: 64, footPad: 3, src: 128 }, lux4: { size: 72, footPad: 3, src: 144 },
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
/** 거인·오니(큰 방망이)·방랑객(긴 카타나) 그림은 48칸 */
export const bigSheet = (name: string) => name.startsWith("titan") || name.startsWith("oni") || name.startsWith("mukin") || name.startsWith("slayer") || name.startsWith("rider") || name.startsWith("wanderer");
/** 거인·오니 스킨은 큰 그림 */
const TITAN_SKIN_SHEET = { size: 48, footPad: 3 };
export const sheetCell = (name: string): number | undefined => CHARACTER_SHEETS[name]?.src ?? CHARACTER_SHEETS[name]?.size; // 그림 파일 한 칸 (편집기)
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

const CAST_TICKS = 10; // 공격하면 몇 틱 동안 마법 쓰는 모습
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

const HURT_TICKS = 8; // 맞으면 몇 틱 동안 맞는 모습 (새 시트만)
const hurtMemo = new Map<string, { hp: number; from: number }>();
/** 체력이 줄어든 뒤 HURT_TICKS 동안 true (그리기 전용 기억, key: 사람마다 따로 · 협동) */
export function isHurt(key: string, tick: number, hp: number): boolean {
  const m = hurtMemo.get(key) ?? { hp, from: -99 };
  if (hp < m.hp) m.from = tick;
  m.hp = hp;
  hurtMemo.set(key, m);
  return tick >= m.from && tick < m.from + HURT_TICKS;
}

/** 새 시트(v2: 맞음·쓰러짐·대시 그림이 있음)인지 */
export function hasV2(name: string): boolean {
  return !!CHARACTER_SHEETS[name]?.v2 && images.has(name);
}

export interface CharacterPose {
  faceX: number;
  faceY: number;
  moving: boolean;
  /** 마법 쓰는 중이면 true */
  casting: boolean;
  /** 걷기 장면 번호 */
  step: number;
  /** 새 시트(v2)만: 막 맞음 · 쓰러짐 · 대시 중 */
  hurt?: boolean;
  down?: boolean;
  dash?: boolean;
}

/** 새 시트(v2)의 [줄, 칸] · 걷기는 왼발 → 서기 → 오른발 → 서기 */
function v2Cell(pose: CharacterPose): [number, number] {
  if (pose.down) return [4, 1];
  if (pose.hurt) return [4, 0];
  if (pose.dash) return [4, pose.faceX < 0 ? 3 : 2];
  const side = Math.abs(pose.faceX) > Math.abs(pose.faceY);
  const dir = side ? (pose.faceX < 0 ? 2 : 3) : pose.faceY < 0 ? 1 : 0;
  if (pose.casting) return [1, dir];
  const walk = pose.moving ? pose.step % 4 : 1;
  return [walk === 0 ? 2 : walk === 2 ? 3 : 0, dir];
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
  const ss = Math.round(img.width / 4); // 그림 한 칸 (4칸 시트: 2배·4배 촘촘한 그림·스킨도 자동)
  const side = Math.abs(pose.faceX) > Math.abs(pose.faceY);
  let [row, col, flip] = [0, 0, false];
  if ("v2" in sheet && sheet.v2) [row, col] = v2Cell(pose);
  else if (pose.casting && pose.faceY > -0.5) {
    // 앞을 보면 팔을 오른쪽으로 뻗은 1번째 칸, 옆이면 4번째 칸
    row = 3;
    col = side ? 3 : 0;
    flip = pose.faceX < 0;
  } else {
    row = side ? 2 : pose.faceY < 0 ? 1 : 0;
    col = pose.moving ? pose.step % 4 : 0;
    flip = side && pose.faceX < 0;
  }
  const left = Math.round(x - size / 2);
  const top = Math.round(y + r + 1 + footPad - size);
  const [sx, sy] = [col * ss, row * ss];
  const blit = (from: HTMLImageElement, y0: number) => {
    ctx.imageSmoothingEnabled = ss > size; // 줄여 그리는 촘촘한 그림은 부드럽게
    if (flip) {
      ctx.save();
      ctx.translate(left + size, top);
      ctx.scale(-1, 1);
      ctx.drawImage(from, sx, y0, ss, ss, 0, 0, size, size);
      ctx.restore();
    } else {
      ctx.drawImage(from, sx, y0, ss, ss, left, top, size, size);
    }
  };
  // 오니: 무기마다 다른 방망이를 몸 뒤·앞 두 겹으로 (같은 칸 자리)
  const clubImg = name.startsWith("oni") && club !== null ? clubImage(club ?? "thunderClub") : undefined;
  if (clubImg) blit(clubImg, sy);
  blit(img, sy);
  if (clubImg) blit(clubImg, sy + size * 4);
  ctx.imageSmoothingEnabled = false;
  return true;
}
