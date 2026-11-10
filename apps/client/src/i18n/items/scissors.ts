// 새벽의 성흔 시저스 글자 (한·영·일): 단죄의 쌍가위 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsScissors·SCISSORS_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type SxPassive =
  | "sxEdge" | "sxWide" | "sxSnap" | "sxRust" | "sxTwin" | "sxSpool" | "sxLong" | "sxTaut" | "sxWeave" | "sxBind"
  | "sxHead" | "sxChain" | "sxGiant" | "sxHarvest" | "sxFear" | "sxMoon" | "sxFull" | "sxCrescent" | "sxHalo" | "sxRemain";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const SX_WEAPON_NAMES: Record<"sxShears" & WeaponId, Names> = {
  sxShears: c("단죄의 쌍가위", "Shears of Condemnation", "断罪の双鋏"),
};

export const SX_PASSIVE_NAMES: Record<SxPassive & PassiveId, Names> = {
  sxEdge: c("벼린 날", "Honed Edge", "研いだ刃"),
  sxWide: c("크게 벌린 날", "Wide-Open Blades", "大きく開いた刃"),
  sxSnap: c("맞물리는 날", "Meeting Blades", "噛み合う刃"),
  sxRust: c("녹슨 날", "Rusted Edge", "錆びた刃"),
  sxTwin: c("쌍날", "Twin Edges", "双刃"),
  sxSpool: c("실타래", "Spool of Fate", "糸巻き"),
  sxLong: c("질긴 실", "Tough Thread", "丈夫な糸"),
  sxTaut: c("팽팽한 실", "Taut Thread", "張り詰めた糸"),
  sxWeave: c("엮인 운명", "Woven Fate", "編まれた運命"),
  sxBind: c("얽매임", "Entanglement", "絡みつき"),
  sxHead: c("목 사냥꾼", "Headhunter", "首狩り"),
  sxChain: c("연쇄 단죄", "Chain Condemnation", "連鎖断罪"),
  sxGiant: c("거인 사냥", "Giant Hunt", "巨人狩り"),
  sxHarvest: c("수확", "Harvest", "収穫"),
  sxFear: c("공포", "Dread", "恐怖"),
  sxMoon: c("달빛 실", "Moonlit Thread", "月光の糸"),
  sxFull: c("보름달", "Full Moon Shears", "満月の鋏"),
  sxCrescent: c("초승달 날", "Crescent Edge", "三日月の刃"),
  sxHalo: c("달무리 가위", "Haloed Shears", "月暈の鋏"),
  sxRemain: c("남은 달빛", "Lingering Moonlight", "残る月光"),
};

export const SX_EFFECTS: Partial<Record<SxPassive & PassiveId, Names>> = {
  sxEdge: c("모든 가위질 피해 {mul}배", "{mul}x damage on every cut", "全ての鋏さばきダメージ{mul}倍"),
  sxWide: c("열기 거리 {r}배 · 더 넓게", "{r}x Open reach · wider arc", "開きの距離{r}倍・より広く"),
  sxSnap: c("닫기 피해 {mul}배", "{mul}x Close damage", "閉じのダメージ{mul}倍"),
  sxRust: c("닫기에 맞은 적 출혈 ({mul:pct}%)", "Close makes foes bleed ({mul:pct}%)", "閉じで当たった敵が出血（{mul:pct}%）"),
  sxTwin: c("닫기가 한 번 더 벰 ({mul:pct}%)", "Close cuts once more ({mul:pct}%)", "閉じがもう一度斬る（{mul:pct}%）"),
  sxSpool: c("운명의 실 +{add}", "+{add} threads of fate", "運命の糸+{add}"),
  sxLong: c("운명의 실 +{more:sec}초", "Threads of fate last {more:sec}s longer", "運命の糸+{more:sec}秒"),
  sxTaut: c("팽팽한 실 끊기 피해 {mul}배", "{mul}x damage from taut threads", "張った糸を断つダメージ{mul}倍"),
  sxWeave: c("실이 지나는 적 피해 {mul}배", "{mul}x damage to foes along a snapping thread", "糸が通る敵へのダメージ{mul}倍"),
  sxBind: c("실에 묶인 적이 느려짐", "Foes tied by a thread are slowed", "糸に結ばれた敵が鈍る"),
  sxHead: c("체력 {at:pct}% 이하에서 목을 자름", "Behead at {at:pct}% HP or less", "体力{at:pct}%以下で首を落とす"),
  sxChain: c("목을 자르면 둘레 {r} 안을 한 번 더 벰 ({mul:pct}%)", "Beheading cuts everything within {r} once more ({mul:pct}%)", "首を落とすと周囲{r}以内をもう一度斬る（{mul:pct}%）"),
  sxGiant: c("체력이 적은 보스 피해 {mul}배", "{mul}x damage to bosses at low HP", "体力の少ないボスへのダメージ{mul}倍"),
  sxHarvest: c("목을 자르면 최대 체력 {heal:pct}% 회복", "Beheading heals {heal:pct}% max HP", "首を落とすと最大体力{heal:pct}%回復"),
  sxFear: c("목을 자르면 둘레 {r} 안 적 {stun:sec}초 멈춤", "Beheading freezes foes within {r} for {stun:sec}s", "首を落とすと周囲{r}以内の敵が{stun:sec}秒停止"),
  sxMoon: c("성흔이 {gain}배 빨리 참", "Stigma fills {gain}x faster", "聖痕が{gain}倍早く満ちる"),
  sxFull: c("달빛 각성 +{more:sec}초", "Moonlight Awakening +{more:sec}s", "月光覚醒+{more:sec}秒"),
  sxCrescent: c("각성 중 {snip:sec}초마다 실을 저절로 끊음", "While awakened, threads snap every {snip:sec}s", "覚醒中{snip:sec}秒ごとに糸が自動で切れる"),
  sxHalo: c("각성 달빛 폭발 범위 {r}배 · 피해 {mul}배", "Awakening burst: {r}x radius · {mul}x damage", "覚醒の月光爆発 範囲{r}倍・ダメージ{mul}倍"),
  sxRemain: c("각성이 끝나도 성흔 {keep:pct}% 남음", "{keep:pct}% Stigma remains after awakening", "覚醒が終わっても聖痕{keep:pct}%残る"),
};
