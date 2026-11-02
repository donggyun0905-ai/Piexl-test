// 작업대 이름·설명 (바닥 물건) · 추적자 튜닝소 부위·부품 이름과 효과 글자 (game/StationWindow)
import type { TunePartFx } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

export const STATION_NAME: Record<"bench" | "tune" | "gym" | "trial" | "boon" | "altar" | "gambler" | "auction", Names> = {
  gambler: { ko: "도박꾼", en: "Gambler", ja: "ギャンブラー" },
  auction: { ko: "내 자리 (맨 앞줄)", en: "Your seat (front row)", ja: "自分の席 (最前列)" },
  altar: { ko: "성좌의 제단", en: "Constellation Altar", ja: "星座の祭壇" },
  trial: { ko: "시련의 비석", en: "Monolith of Trials", ja: "試練の石碑" },
  boon: { ko: "시련의 보상 상자", en: "Trial Reward Chest", ja: "試練の報酬箱" },
  bench: { ko: "거대한 제작대", en: "Grand Workbench", ja: "巨大な作業台" },
  gym: { ko: "단련 기구", en: "Training Equipment", ja: "鍛錬器具" },
  tune: { ko: "튜닝소", en: "Tuning Bay", ja: "チューニング工房" },
};

/** 단련의 방 기구 셋 (sim/gym 기구 번호 차례) */
export const GYM_DEVICE: Names[] = [
  { ko: "샌드백", en: "Sandbag", ja: "サンドバッグ" },
  { ko: "랫풀다운", en: "Lat Pulldown", ja: "ラットプルダウン" },
  { ko: "벤치 프레스", en: "Bench Press", ja: "ベンチプレス" },
];

export const STATION_DESC: Record<"bench" | "tune" | "gym" | "trial" | "boon" | "altar" | "gambler" | "auction" | "devil", Names> = {
  devil: { ko: "거래 조건: 최대 체력 {cost} · F로 거래", en: "Price: {cost} max HP · press F to deal", ja: "取引条件: 最大体力{cost} · Fで取引" },
  gambler: {
    ko: "F를 눌러 야바위 · 당첨 상자를 잘 따라가 맞히면 패시브 5 · 300원 · 원하는 능력치 2장, 틀리면 무작위 능력치 둘 -10% (한 번만)",
    en: "Press F for the shell game · follow the winning box: 5 passives · 300 gold · 2 stat picks; miss and two random stats drop 10% (once)",
    ja: "Fでシェルゲーム · 当たりの箱を追って当てればパッシブ5 · 300ゴールド · 好きな能力値2枚、外すとランダムな能力値2つ-10% (1回のみ)",
  },
  auction: {
    ko: "F로 앉으면 경매 시작 · 다시 F(Esc)로 일어남 · 그림자 손님보다 높게 부르면 낙찰 (4번째 상품부터는 ???) · 무대 위 상품에 마우스를 올리면 설명",
    en: "Press F to sit and start the auction · F (Esc) again to stand · outbid the shadow guests to win (lots 4+ are hidden ???) · hover the lots on stage for details",
    ja: "Fで座るとオークション開始 · もう一度F(Esc)で立つ · 影の客より高く入札すれば落札 (4番目の品から???) · 舞台の品にマウスを乗せると説明",
  },
  altar: {
    ko: "F를 눌러 성좌와 마주함 · 카드 셋 중 하나를 골라야 방을 나갈 수 있음",
    en: "Press F to face the constellation · you must pick one of three cards to leave",
    ja: "Fで星座と向き合う · 3枚のカードから1枚選ばないと部屋を出られない",
  },
  trial: {
    ko: "F를 눌러 시련에 도전할지 고름 · 거절하면 무언가를 빼앗김 · 도전하면 시련을 이겨 낸 만큼 보상이 쏟아짐",
    en: "Press F to choose whether to face the trial · refusing costs you something · the better you do, the more rewards pour out",
    ja: "Fで試練に挑むか選ぶ · 断ると何かを奪われる · 挑めば乗り越えた分だけ報酬があふれ出る",
  },
  boon: {
    ko: "F를 눌러 열기 · 바로 받거나 창에서 하나를 고름",
    en: "Press F to open · take it at once or pick one in the window",
    ja: "Fで開ける · すぐ受け取るか窓で一つ選ぶ",
  },
  gym: {
    ko: "F를 눌러 운동(미니게임) · 셋 중 하나만 · 점수만큼 강화 포인트를 얻어 능력치·무기·패시브 강화",
    en: "Press F to train (minigame) · only one of the three · earn upgrade points to boost stats, weapon and passives",
    ja: "Fで運動（ミニゲーム）· 3つのうち1つだけ · 点数に応じた強化ポイントで能力値・武器・パッシブを強化",
  },
  bench: {
    ko: "F를 눌러 제작대에 들어가면 패시브 강화 · 교체 · 튜닝",
    en: "Press F to use the workbench: enhance, swap or tune passives",
    ja: "Fで作業台に入るとパッシブの強化 · 交換 · チューニング",
  },
  tune: {
    ko: "F를 눌러 저격총 부품을 갈아 끼우거나 골드로 강화",
    en: "Press F to swap sniper parts or upgrade them with gold",
    ja: "Fでスナイパーのパーツを交換したりゴールドで強化",
  },
};

export const TUNE_SLOT_NAMES: Record<string, Names> = {
  barrel: { ko: "총열", en: "Barrel", ja: "銃身" },
  scope: { ko: "조준경", en: "Scope", ja: "スコープ" },
  stock: { ko: "개머리판", en: "Stock", ja: "銃床" },
  mag: { ko: "탄창", en: "Magazine", ja: "弾倉" },
  muzzle: { ko: "총구", en: "Muzzle", ja: "銃口" },
  rail: { ko: "레일·받침", en: "Rail & Mount", ja: "レール・台座" },
};

export const TUNE_PART_NAMES: Record<string, Names> = {
  barrelStd: { ko: "표준 총열", en: "Standard Barrel", ja: "標準銃身" },
  barrelLong: { ko: "장총열", en: "Long Barrel", ja: "ロングバレル" },
  barrelFluted: { ko: "플루티드 총열", en: "Fluted Barrel", ja: "フルーテッドバレル" },
  barrelRifled: { ko: "다조선 강선 총열", en: "Polygonal Rifled Barrel", ja: "ポリゴナルライフリング銃身" },
  scope4x: { ko: "4배율 조준경", en: "4x Scope", ja: "4倍スコープ" },
  scope8x: { ko: "8배율 조준경", en: "8x Scope", ja: "8倍スコープ" },
  scopeThermal: { ko: "열상 조준경", en: "Thermal Scope", ja: "サーマルスコープ" },
  scopeHolo: { ko: "홀로그램 조준경", en: "Holographic Sight", ja: "ホロサイト" },
  stockFixed: { ko: "고정 개머리판", en: "Fixed Stock", ja: "固定銃床" },
  stockFolding: { ko: "접이식 개머리판", en: "Folding Stock", ja: "折りたたみ銃床" },
  stockPad: { ko: "충격 흡수 패드", en: "Recoil Pad", ja: "リコイルパッド" },
  stockAdjust: { ko: "조절식 뺨받침", en: "Adjustable Cheek Rest", ja: "可変チークレスト" },
  magStd: { ko: "기본 탄창", en: "Standard Magazine", ja: "標準弾倉" },
  magExtended: { ko: "확장 탄창", en: "Extended Magazine", ja: "拡張弾倉" },
  magClip: { ko: "빠른 장전 클립", en: "Speed-Loader Clip", ja: "スピードローダー" },
  magDrum: { ko: "드럼 탄창", en: "Drum Magazine", ja: "ドラムマガジン" },
  muzzleBare: { ko: "맨 총구", en: "Bare Muzzle", ja: "素の銃口" },
  muzzleSuppressor: { ko: "소음기", en: "Suppressor", ja: "サプレッサー" },
  muzzleBrake: { ko: "머즐 브레이크", en: "Muzzle Brake", ja: "マズルブレーキ" },
  muzzleFlash: { ko: "소염기", en: "Flash Hider", ja: "フラッシュハイダー" },
  railNone: { ko: "민짜 레일", en: "Bare Rail", ja: "素のレール" },
  railBipod: { ko: "양각대", en: "Bipod", ja: "バイポッド" },
  railTactical: { ko: "전술 레일", en: "Tactical Rail", ja: "タクティカルレール" },
  railGhillie: { ko: "위장 덮개", en: "Ghillie Wrap", ja: "ギリーラップ" },
};

const FX_LABEL: Record<keyof TunePartFx, Names> = {
  range: { ko: "사거리", en: "Range", ja: "射程" },
  move: { ko: "이동 속도", en: "Move speed", ja: "移動速度" },
  proj: { ko: "탄속", en: "Bullet speed", ja: "弾速" },
  hp: { ko: "최대 체력", en: "Max HP", ja: "最大体力" },
  luck: { ko: "행운", en: "Luck", ja: "幸運" },
  cd: { ko: "모든 스킬 대기", en: "All skill cooldowns", ja: "全スキルの待ち時間" },
  cd3: { ko: "연발사격 대기", en: "Rapid Fire cooldown", ja: "連射の待ち時間" },
  scopeR: { ko: "암습 조준 원", en: "Ambush sight circle", ja: "暗襲の照準円" },
  ambT: { ko: "암습 제한 시간", en: "Ambush time", ja: "暗襲の制限時間" },
  shield: { ko: "암습 보호막", en: "Ambush shield", ja: "暗襲のシールド" },
  spread: { ko: "연발 흔들림", en: "Rapid Fire spread", ja: "連射のぶれ" },
  wall: { ko: "강력한 한방 벽 폭", en: "Power Shot wall width", ja: "強力な一撃の壁幅" },
};

const MUL: readonly string[] = ["range", "move", "proj", "cd", "cd3", "scopeR", "ambT", "spread", "wall"];
const NONE: Names = { ko: "효과 없음 (기본 부품)", en: "No effect (stock part)", ja: "効果なし (標準パーツ)" };

/** 부품 효과 글자 (grow = 강화 단계로 커진 배율) */
export function tuneFxText(fx: TunePartFx, lang: Lang, grow = 1): string {
  const parts = (Object.keys(fx) as (keyof TunePartFx)[]).map((k) => {
    const v = fx[k]!;
    if (MUL.includes(k)) {
      const pct = Math.round((v - 1) * grow * 100);
      return `${FX_LABEL[k][lang]} ${pct > 0 ? "+" : ""}${pct}%`;
    }
    return `${FX_LABEL[k][lang]} +${Math.round(v * grow * 10) / 10}`;
  });
  return parts.length ? parts.join(" · ") : NONE[lang];
}
