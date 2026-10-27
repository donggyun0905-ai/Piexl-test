// 스킨 목록·가격: 캐릭터마다 테마 9개 (마지막 swap = 성별 바꾸기) (그림은 public/sprites/skins/{캐릭터}_{테마}.png, 규격은 docs/ART.md)
import { CHARACTER_IDS as PLAYABLE, type CharacterId } from "@pixel-rogue/shared";
import { TEST_OPEN } from "../testFlags";

export const SKIN_THEMES = ["swim", "xmas", "halloween", "school", "newyear", "japan", "china", "usa", "swap"] as const;
/** 뽑기 한정 테마: 한 번 나오면 모든 캐릭터에 생김. 입으면 공격·처치·대기·발자국·강화 효과와 전용 음악 (game/limited) */
export const LIMITED_THEMES = ["tiger", "summer"] as const;
/** 시즌 2 캐릭터(비르디아·헬리오스·테라코어): 범 풍류 대신 여름 파도 한정 스킨 */
export const SEASON2_SKIN_CHARS: readonly CharacterId[] = ["idra", "byeonhui", "fly", "elder", "ren", "spiritist", "plague", "slayer", "eater", "mukin", "samyeol", "automata", "rider", "bomber", "artifacter", "punk", "tracker", "forgotten", "remnant"];
export type LimitedTheme = (typeof LIMITED_THEMES)[number];
/** 나만의 스킨: 상점에서 칸을 사서 직접 그림 (그림은 이 기기에만, game/customArt.mySkinSrc) */
export const MY_THEME = "my" as const;
export type SkinTheme = (typeof SKIN_THEMES)[number] | LimitedTheme | typeof MY_THEME;

/** 바로 사기 · 뽑기 1번 · 10번(1번 덤) · 이미 가진 스킨이 나오면 돌려받는 쿠폰 */
export const SKIN_PRICE = 30;
export const GACHA_PRICE = 10;
export const GACHA10_PRICE = 90;
export const GACHA_REFUND = 3;
/** 나만의 스킨 칸 (캐릭터마다 1칸) */
export const MY_SKIN_PRICE = 30;

export const skinId = (c: CharacterId, theme: SkinTheme) => `${c}_${theme}`;
export const mySkinId = (c: CharacterId) => skinId(c, MY_THEME);
/** 스킨이 있는 캐릭터 (숨은 캐릭터 빼고) */
export const CHARACTER_IDS: readonly CharacterId[] = PLAYABLE;
/** 테스트 중: 모든 스킨(한정·나만의 스킨 포함)을 가진 상태 (testFlags) */
export const TEST_ALL_SKINS = TEST_OPEN;

/** 상점에서 살 수 있는 스킨 · 뽑기로만 얻는 한정 스킨 · 전부 */
export const SHOP_SKINS: readonly string[] = CHARACTER_IDS.flatMap((c) => SKIN_THEMES.map((th) => skinId(c, th)));
/** 이 캐릭터에 그 한정 테마가 있는지 (여름 파도는 시즌 2만, 범 풍류는 시즌 2 빼고) */
export const hasLimited = (theme: LimitedTheme, c: CharacterId) => (theme === "summer") === SEASON2_SKIN_CHARS.includes(c);
export const limitedSkins = (theme: LimitedTheme) => CHARACTER_IDS.filter((c) => hasLimited(theme, c)).map((c) => skinId(c, theme));
export const GACHA_ONLY: readonly string[] = LIMITED_THEMES.flatMap(limitedSkins);
export const ALL_SKINS: readonly string[] = [...SHOP_SKINS, ...GACHA_ONLY];
export const isLimitedTheme = (th: string): th is LimitedTheme => (LIMITED_THEMES as readonly string[]).includes(th);

/** 뽑기 한 번에 나오는 것: 한정 테마 1% · 상점 스킨 44% · 나머지는 쿠폰 (적게) */
export const GACHA_LIMITED_ODDS = 0.01;
export const GACHA_SKIN_ODDS = 0.44;
/** 쿠폰 상품: [장 수, 확률] (합 0.55) */
export const GACHA_COUPONS: readonly (readonly [number, number])[] = [
  [1, 0.25],
  [2, 0.18],
  [3, 0.09],
  [5, 0.03],
];
/** 이미 가진 상점 스킨(꽝)이 나오면 이 확률로 쿠폰 대신 이벤트 코인 [최소, 최대] */
export const GACHA_ECOIN_ODDS = 0.5;
export const GACHA_ECOINS = [1, 3] as const;
/** 이미 가진 한정 테마가 또 나오면 돌려받는 쿠폰 */
export const LIMITED_REFUND = 30;

/** 스킨 id → 캐릭터 · 테마 */
export function parseSkin(id: string): { character: CharacterId; theme: SkinTheme } {
  const i = id.lastIndexOf("_");
  return { character: id.slice(0, i) as CharacterId, theme: id.slice(i + 1) as SkinTheme };
}
