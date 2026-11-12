// 실베르 레이븐 글자 (한·영·일): 무기 1 이름 · 전용 아이템 20 이름 (효과 설명은 ravenEffects)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

export type RvPassive = "rvPawn" | "rvKnight" | "rvBishop" | "rvRook" | "rvQueen" | "rvKing" | "rvBoard" | "rvMate" | "rvPromote" | "rvCastle"
  | "rvAssault" | "rvGrand" | "rvEnPassant" | "rvGuard" | "rvIron" | "rvRadiance" | "rvChain" | "rvTempo" | "rvStale" | "rvGambit";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const RV_WEAPON_NAMES: Record<"rvLance" & WeaponId, Names> = {
  rvLance: c("왕국의 창", "Kingdom Lance", "王国の槍"),
};

export const RV_PASSIVE_NAMES: Record<RvPassive & PassiveId, Names> = {
  rvPawn: c("폰 — 왕국의 진군", "Pawn — March of the Kingdom", "ポーン — 王国の進軍"),
  rvKnight: c("나이트 — 황금 기사의 도약", "Knight — Golden Knight's Leap", "ナイト — 黄金騎士の跳躍"),
  rvBishop: c("비숍 — 성역의 대각선", "Bishop — Sanctum Diagonal", "ビショップ — 聖域の対角線"),
  rvRook: c("룩 — 왕성의 철벽", "Rook — Castle Rampart", "ルーク — 王城の鉄壁"),
  rvQueen: c("퀸 — 여왕의 칙령", "Queen — Royal Decree", "クイーン — 女王の勅令"),
  rvKing: c("킹 — 왕의 심판", "King — Judgment of the King", "キング — 王の審判"),
  rvBoard: c("왕국의 체스판", "Kingdom Board", "王国のチェス盤"),
  rvMate: c("체크메이트", "Checkmate", "チェックメイト"),
  rvPromote: c("폰의 승격", "Pawn Promotion", "ポーンの昇格"),
  rvCastle: c("캐슬링 — 왕의 수호", "Castling — King's Guard", "キャスリング — 王の守護"),
  rvAssault: c("왕실의 합동 공세", "Royal Joint Assault", "王室の合同攻勢"),
  rvGrand: c("그랜드 체크메이트", "Grand Checkmate", "グランドチェックメイト"),
  rvEnPassant: c("앙파상", "En Passant", "アンパッサン"),
  rvGuard: c("왕실 근위대", "Royal Guard", "王室近衛隊"),
  rvIron: c("왕의 철퇴", "King's Mace", "王の鉄槌"),
  rvRadiance: c("여왕의 광휘", "Queen's Radiance", "女王の光輝"),
  rvChain: c("연쇄 체크", "Chain Check", "連鎖チェック"),
  rvTempo: c("템포", "Tempo", "テンポ"),
  rvStale: c("스테일메이트", "Stalemate", "ステイルメイト"),
  rvGambit: c("갬빗", "Gambit", "ギャンビット"),
};
