// 도트 편집에서 고를 수 있는 그림 목록: 캐릭터·스킨·몬스터(파일) · 아이콘·효과·탄(코드 그림 → 게임은 game/customArt로 바꿔 그림)
import { CHARACTERS, PASSIVE_IDS, PASSIVES, USE_ITEM_IDS, WEAPON_IDS, WEAPONS, type CharacterId, type PassiveDef, type WeaponDef } from "@pixel-rogue/shared";
import { artFile, CUSTOM_FILES, myFxKey } from "../game/customArt";
import { PAW } from "../game/limited/tigerArt";
import { bigSheet, ENEMY_SPRITES, sheetCell } from "../game/sprites";
import { itemName } from "../i18n/items";
import { TEXT } from "../i18n/text";
import type { TextKey } from "../i18n";
import { hasLimited, LIMITED_THEMES, VICTORY_CHARS, VICTORY_THEME } from "../shop/skins";
import { THEME_KEY } from "../shop/SkinTab";
import { fxImage, iconImage, shotImage } from "./defaults";
import { FX_LABELS, SHOT_LABELS, TIGER_LABELS, type GroupId } from "./labels";
import { TIGER_SPRITES, type TigerSprite } from "../game/limited/tigerSprites";
import { enemyName } from "../i18n/enemies";
import { loadImage, type Grid } from "./sheet";

export interface Asset {
  /** 초안 저장·게임 교체에 쓰는 이름 */
  id: string;
  label: string;
  group: GroupId;
  /** 처음 그림 (크기를 모르면 불러온 뒤 grid를 정함) */
  load: () => Promise<ImageData>;
  /** 칸 나누기 (null이면 높이 = 한 칸, 가로로 이어짐) */
  grid: Grid | null;
  rowNames?: string[];
  /** 캐릭터 시트 줄 이름 (화면 언어로) */
  rowKeys?: TextKey[];
  /** 가운데·발 기준선 */
  guide?: readonly [number, number];
  /** 내려받을 파일 이름 · 넣을 자리 */
  file: string;
  place: string;
}

const BASE = import.meta.env.BASE_URL;
const CHAR_GRID: Grid = { cw: 32, ch: 32, cols: 4, rows: 4 };
/** 거인·오니는 48칸 */
const BIG_GRID: Grid = { cw: 48, ch: 48, cols: 4, rows: 4 };
const ko = (k: string) => (TEXT as Record<string, { ko: string }>)[k]?.ko ?? k;
const charName = (c: string) => ko(c);
const sheet = (name: string, group: GroupId, label: string, dir: string): Asset => ({
  id: name,
  label,
  group,
  load: () => loadImage(`${BASE}sprites/${dir}${name}.png`),
  // 고해상도 그림(2배 촘촘)은 그 칸 크기로
  grid: sheetCell(name) ? { ...CHAR_GRID, cw: sheetCell(name)!, ch: sheetCell(name)! } : bigSheet(name) ? BIG_GRID : CHAR_GRID,
  rowKeys: ["pxRowFront", "pxRowBack", "pxRowSide", "pxRowAttack"],
  guide: sheetCell(name) ? [sheetCell(name)! / 2, sheetCell(name)! - 2] : bigSheet(name) ? [24, 45] : [16, 30],
  file: name,
  place: `public/sprites/${dir}${name}.png`,
});
const code = (id: string, group: GroupId, label: string, load: () => ImageData, grid: Grid, rowNames?: string[]): Asset => ({
  id,
  label,
  group,
  // 저장소에 이미 넣은 그림이 있으면 그걸, 없으면 지금 코드 모습
  load: () => (CUSTOM_FILES.includes(id) ? loadImage(`${BASE}sprites/custom/${artFile(id)}.png`) : Promise.resolve(load())),
  grid,
  rowNames,
  file: artFile(id),
  place: `public/sprites/custom/${artFile(id)}.png`,
});

const ICON: Grid = { cw: 16, ch: 16, cols: 1, rows: 1 };
const exclusiveTag = (c: CharacterId | undefined) => (c ? ` (${charName(c)})` : "");

export function allAssets(): Asset[] {
  const chars = Object.keys(CHARACTERS) as CharacterId[];
  const out: Asset[] = [];
  for (const c of chars) out.push(sheet(c, "char", charName(c), ""));
  for (const n of [5, 10, 15, 20]) out.push(sheet(`novice${n}`, "char", `${charName("novice")} · ${n}레벨 옷`, ""));
  for (const c of chars)
    for (const th of [...LIMITED_THEMES.filter((x) => hasLimited(x, c)), ...(VICTORY_CHARS.includes(c) ? [VICTORY_THEME] : [])]) {
      const label = `${charName(c)} · ${ko(THEME_KEY[th])}`;
      out.push(sheet(`${c}_${th}`, "skin", label, "skins/"));
      if (c === "bedouin") out.push(sheet(`${c}_${th}_bare`, "skin", `${label} (던진 뒤)`, "skins/"));
    }
  out.push(sheet("bedouin_bare", "skin", `${charName("bedouin")} · 기본 (던진 뒤)`, "skins/"));
  for (const k of ENEMY_SPRITES)
    out.push({ id: `enemy:${k}`, label: `${enemyName(k, "ko")} (${k})`, group: "enemy", load: () => loadImage(`${BASE}sprites/enemies/${k}.png`), grid: null, rowNames: ["움직임"], file: k, place: `public/sprites/enemies/${k}.png` });
  for (const id of WEAPON_IDS) out.push(code(`icon:weapon:${id}`, "weapon", itemName("weapon", id, "ko") + exclusiveTag((WEAPONS[id] as WeaponDef).exclusive), () => iconImage({ kind: "weapon", id }), ICON));
  for (const id of PASSIVE_IDS) out.push(code(`icon:passive:${id}`, "passive", itemName("passive", id, "ko") + exclusiveTag((PASSIVES[id] as PassiveDef).exclusive), () => iconImage({ kind: "passive", id }), ICON));
  for (const id of USE_ITEM_IDS) out.push(code(`icon:use:${id}`, "use", itemName("use", id, "ko"), () => iconImage({ kind: "use", id }), ICON));
  for (const [k, label] of Object.entries(FX_LABELS)) out.push(code(`fx:${k}`, "fx", label, () => fxImage(k), { cw: 48, ch: 48, cols: 4, rows: 1 }, ["장면"]));
  for (const [k, label] of Object.entries(TIGER_LABELS)) {
    const s = TIGER_SPRITES[k as TigerSprite];
    out.push(code(`tiger:${k}`, "tiger", label, () => (k === "paw" ? pawImage() : new ImageData(s.w * s.frames, s.h * s.rows)), { cw: s.w, ch: s.h, cols: s.frames, rows: s.rows }, k === "claw" ? ["자국 1개", "자국 2개", "자국 3개"] : k === "band" ? ["장구", "꽹과리", "북", "소고", "태평소", "청사초롱"] : ["장면"]));
  }
  for (const [k, label] of Object.entries(SHOT_LABELS)) out.push(code(`shot:${k}`, "shot", label, () => shotImage(k), ICON));
  return out;
}

/** 발자국 처음 그림: 코드 발자국(PAW)을 8×8 칸 가운데에 금빛으로 */
function pawImage(): ImageData {
  const img = new ImageData(8, 8);
  PAW.forEach((row, r) =>
    [...row].forEach((ch, c) => {
      if (ch !== "o") return;
      const i = ((r + 2) * 8 + c + 1) * 4;
      img.data.set([255, 216, 96, 255], i);
    }),
  );
  return img;
}

/** 이벤트 상점에서 산 효과 그림 (/pixel/?fx=1): 초안 이름 myfx:{id} = game/customArt.myFxKey */
export function myFxAssets(ids: readonly string[], t: (k: TextKey) => string): Asset[] {
  return allAssets()
    .filter((a) => ids.includes(a.id))
    .map((a) => ({ ...a, id: myFxKey(a.id), label: t(`pxFx_${a.id.slice(6)}` as TextKey), rowNames: undefined, place: "" }));
}

/** 불러온 그림 크기로 칸 나누기 */
export function gridOf(a: Asset, d: ImageData): Grid {
  return a.grid ?? { cw: d.height, ch: d.height, cols: Math.max(1, Math.floor(d.width / d.height)), rows: 1 };
}

/** 나만의 스킨 그리기: 그 캐릭터 칸 하나 (처음은 기본 그림, 초안 이름 my:{캐릭터} = game/customArt.mySkinSrc) */
export function myAsset(c: CharacterId): Asset {
  return { ...sheet(c, "skin", charName(c), ""), id: `my:${c}`, file: `${c}_my`, place: "" };
}

/** 나만의 스킨 바탕으로 불러올 수 있는 그림: 기본 + 가진 스킨 */
export function myBases(c: CharacterId, owned: readonly string[], t: (k: TextKey) => string): Asset[] {
  const themes = [...LIMITED_THEMES, VICTORY_THEME].filter((th) => owned.includes(`${c}_${th}`));
  const name = t(c as TextKey);
  return [sheet(c, "char", `${name} · ${t("shopDefault")}`, ""), ...themes.map((th) => sheet(`${c}_${th}`, "skin", `${name} · ${t(THEME_KEY[th])}`, "skins/"))];
}
