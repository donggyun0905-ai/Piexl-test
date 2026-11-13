// 만능 쿠폰 · 가진 스킨 · 입은 스킨 (이 기기에 저장). 쿠폰 = 업적 보상 + 일일 미션 보상 - 쓴 것
import { uiSfx } from "../audio/uiSounds";
import { ACHIEVEMENTS, type AchievementCategory, type CharacterId } from "@pixel-rogue/shared";
import { loadAchievements } from "../records";
import { onCloudApplied } from "../cloudSave";
import { loadText, saveText } from "../storage";
import { addEventCoins } from "../event/eventCoins";
import { GACHA_ECOIN_ODDS, GACHA_ECOINS, GACHA_COUPONS, GACHA_LIMITED_ODDS, GACHA_ONLY, isKnownSkin, LIMITED_REFUND, LIMITED_THEMES, limitedSkins, MY_SKIN_PRICE, MY_THEME, VICTORY_SKINS, ALL_SKINS, CHARACTER_IDS, mySkinId, TEST_ALL_SKINS, type LimitedTheme } from "./skins";

/** 업적 하나에 받는 쿠폰 (어려운 종류일수록 많이) */
export const ACHIEVEMENT_COUPONS: Record<AchievementCategory, number> = {
  progress: 3,
  combat: 3,
  build: 3,
  wealth: 3,
  boss: 5,
  character: 5,
  career: 5,
  challenge: 10,
};

interface Wallet {
  spent: number;
  /** 일일 미션으로 받은 쿠폰 */
  mission: number;
  /** 뽑기에서 겹쳐 돌려받은 쿠폰 + 뽑기 쿠폰 상품 */
  refund: number;
  owned: string[];
  /** 캐릭터마다 입은 스킨 (없으면 기본) */
  equipped: Partial<Record<CharacterId, string>>;
  /** 로비 꾸밈: 가진 테마 · 쓰는 테마 (없으면 기본 오락실) */
  lobbyOwned: string[];
  lobby?: string;
}

/** 그릴 때마다 읽으므로 한 번 읽은 것을 기억 */
let cache: Wallet | null = null;
// 서버 백업으로 바뀌면 다시 읽음
onCloudApplied(() => (cache = null));

function load(): Wallet {
  if (cache) return structuredClone(cache);
  try {
    const w = JSON.parse(loadText("wallet") ?? "{}") as Partial<Wallet>;
    // 없앤 스킨(상점 테마 9종·5명 밖의 승리)은 가진 목록·입은 것에서 뺌
    const equipped = Object.fromEntries(Object.entries(w.equipped ?? {}).filter(([, id]) => isKnownSkin(id)));
    cache = { spent: w.spent ?? 0, mission: w.mission ?? 0, refund: w.refund ?? 0, owned: (w.owned ?? []).filter(isKnownSkin), equipped, lobbyOwned: w.lobbyOwned ?? [], lobby: w.lobby };
  } catch {
    cache = { spent: 0, mission: 0, refund: 0, owned: [], equipped: {}, lobbyOwned: [] };
  }
  return structuredClone(cache);
}

function save(w: Wallet): void {
  cache = w;
  saveText("wallet", JSON.stringify(w));
}

export function achievementCoupons(): number {
  const got = new Set(loadAchievements());
  return ACHIEVEMENTS.reduce((sum, a) => sum + (got.has(a.id) ? ACHIEVEMENT_COUPONS[a.category] : 0), 0);
}

export function coupons(): number {
  const w = load();
  return achievementCoupons() + w.mission + w.refund - w.spent;
}

/** 가진 스킨 (테스트 중에는 전부) */
export const ownedSkins = (): string[] => (TEST_ALL_SKINS ? [...ALL_SKINS, ...CHARACTER_IDS.map(mySkinId)] : load().owned);
export const equippedSkin = (c: CharacterId): string | undefined => (cache ?? load()).equipped[c];

/** 한정 스킨권 (기간토마키아 상점 물건): 아직 다 갖지 않은 한정 테마 하나의 스킨을 모두 · 다 가졌으면 쿠폰. 받은 테마 (없으면 null) */
export function grantLimitedSkin(): string | null {
  const w = load();
  const theme = LIMITED_THEMES.find((th) => limitedSkins(th).some((id) => !w.owned.includes(id)));
  if (theme) w.owned.push(...limitedSkins(theme).filter((id) => !w.owned.includes(id)));
  else w.refund += LIMITED_REFUND;
  save(w);
  return theme ?? null;
}

/** 월드 워 리그 우승: '승리' 한정 스킨 (5명). 새로 받은 게 있으면 true */
export function grantVictorySkins(): boolean {
  const w = load();
  const add = VICTORY_SKINS.filter((id) => !w.owned.includes(id));
  w.owned.push(...add);
  save(w);
  return add.length > 0;
}

/** 쿠폰 쓰기 (서고의 감시자 뽑기 등) · 모자라면 false */
export function spendCoupons(n: number): boolean {
  if (coupons() < n) return false;
  const w = load();
  w.spent += n;
  save(w);
  return true;
}

/** 쿠폰 돌려받기 (뽑기에서 겹침) */
export function refundCoupons(n: number): void {
  const w = load();
  w.refund += n;
  save(w);
}

export function addMissionCoupons(n: number): void {
  const w = load();
  w.mission += n;
  save(w);
}

/** 바로 사기 (나만의 스킨 칸만). 성공하면 true */
export function buySkin(id: string): boolean {
  const w = load();
  const price = MY_SKIN_PRICE;
  if (!id.endsWith(`_${MY_THEME}`) || ownedSkins().includes(id) || GACHA_ONLY.includes(id) || coupons() < price) return false;
  w.spent += price;
  w.owned.push(id);
  save(w);
  uiSfx("uiBuy");
  return true;
}

/** 입기 (null = 기본으로) */
export function equipSkin(c: CharacterId, id: string | null): void {
  const w = load();
  if (id === null) delete w.equipped[c];
  else if (ownedSkins().includes(id)) w.equipped[c] = id;
  save(w);
  uiSfx("uiEquip");
}

/** 뽑기 결과 하나: 한정 테마(모든 캐릭터) · 이벤트 코인 · 쿠폰. dup이면 이미 있어서 refund장을 돌려받음 */
export type GachaPrize = { kind: "limited"; theme: LimitedTheme; dup: boolean; refund: number } | { kind: "coupon"; n: number } | { kind: "ecoin"; n: number };

/** 뽑기 n번 (꾸밈이라 브라우저 랜덤을 씀, 게임 결과와 상관없음) */
export function gacha(n: number, price: number): GachaPrize[] | null {
  if (coupons() < price) return null;
  const w = load();
  w.spent += price;
  const out = Array.from({ length: n }, (): GachaPrize => {
    let r = Math.random();
    if (r < GACHA_LIMITED_ODDS) {
      const theme = LIMITED_THEMES[Math.floor(Math.random() * LIMITED_THEMES.length)]!;
      const ids = limitedSkins(theme);
      const dup = ids.every((id) => w.owned.includes(id));
      if (dup) w.refund += LIMITED_REFUND;
      else w.owned.push(...ids.filter((id) => !w.owned.includes(id)));
      return { kind: "limited", theme, dup, refund: dup ? LIMITED_REFUND : 0 };
    }
    r -= GACHA_LIMITED_ODDS;
    if (r < GACHA_ECOIN_ODDS) {
      const n = GACHA_ECOINS[0] + Math.floor(Math.random() * (GACHA_ECOINS[1] - GACHA_ECOINS[0] + 1));
      addEventCoins(n);
      return { kind: "ecoin", n };
    }
    r -= GACHA_ECOIN_ODDS;
    let got = GACHA_COUPONS[GACHA_COUPONS.length - 1]![0];
    for (const [k, p] of GACHA_COUPONS) {
      if (r < p) {
        got = k;
        break;
      }
      r -= p;
    }
    w.refund += got;
    return { kind: "coupon", n: got };
  });
  save(w);
  return out;
}

// ───────── 로비 꾸밈 ─────────

export const lobbyOwned = () => load().lobbyOwned;
export const lobbyTheme = (): string => (cache ?? load()).lobby ?? "arcade";

/** 로비 꾸밈 사기 (가격은 lobby/lobbyThemes.LOBBY_PRICE). 성공하면 true */
export function buyLobby(theme: string, price: number): boolean {
  const w = load();
  if (w.lobbyOwned.includes(theme) || coupons() < price) return false;
  w.spent += price;
  w.lobbyOwned.push(theme);
  save(w);
  uiSfx("uiBuy");
  return true;
}

export function setLobbyTheme(theme: string): void {
  const w = load();
  if (theme === "arcade" || w.lobbyOwned.includes(theme)) w.lobby = theme;
  save(w);
  uiSfx("uiEquip");
}
