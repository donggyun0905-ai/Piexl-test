// 새벽의 성흔 루나틱 글자 (한·영·일): 월광의 세검 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsLunatic·LUNATIC_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type LnPassive =
  | "lnSwift" | "lnPierce" | "lnFlurry" | "lnWave" | "lnLunge" | "lnEye" | "lnDeep" | "lnMarkFast" | "lnTwinMark" | "lnExecute"
  | "lnSlashBig" | "lnSlashPow" | "lnChain" | "lnFullMoon" | "lnMoonRain" | "lnDashPow" | "lnAfterimage" | "lnSense" | "lnEndless" | "lnCrescent";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const LN_WEAPON_NAMES: Record<"lnRapier" & WeaponId, Names> = {
  lnRapier: c("월광의 세검", "Moonlight Rapier", "月光の細剣"),
};

export const LN_PASSIVE_NAMES: Record<LnPassive & PassiveId, Names> = {
  lnSwift: c("섬광 같은 손목", "Flash Wrist", "閃光の手首"),
  lnPierce: c("긴 칼날", "Long Blade", "長い刃"),
  lnFlurry: c("삼연 찌르기", "Triple Thrust", "三連突き"),
  lnWave: c("월광 검기", "Moonlight Wave", "月光の剣気"),
  lnLunge: c("달려드는 발", "Lunging Step", "踏み込む足"),
  lnEye: c("꿰뚫는 눈", "Piercing Eye", "見抜く目"),
  lnDeep: c("급소 찌르기", "Vital Strike", "急所突き"),
  lnMarkFast: c("사냥꾼의 조준", "Hunter's Aim", "狩人の照準"),
  lnTwinMark: c("쌍둥이 달", "Twin Moons", "双子の月"),
  lnExecute: c("처형의 달", "Executioner's Moon", "処刑の月"),
  lnSlashBig: c("만개한 달", "Blooming Moon", "満開の月"),
  lnSlashPow: c("차가운 달빛", "Cold Moonlight", "冷たい月光"),
  lnChain: c("이어지는 달빛", "Chained Moonlight", "連なる月光"),
  lnFullMoon: c("보름달의 낙인", "Full Moon Brand", "満月の烙印"),
  lnMoonRain: c("초승달 비", "Crescent Rain", "三日月の雨"),
  lnDashPow: c("돌격 세검", "Charging Rapier", "突撃の細剣"),
  lnAfterimage: c("잔상 찌르기", "Afterimage Thrust", "残像突き"),
  lnSense: c("리더의 성흔", "Leader's Stigma", "指導者の聖痕"),
  lnEndless: c("지지 않는 달", "Unsetting Moon", "沈まぬ月"),
  lnCrescent: c("초승달 회전 베기", "Crescent Spin", "三日月回転斬り"),
};

export const LN_EFFECTS: Partial<Record<LnPassive & PassiveId, Names>> = {
  lnSwift: c("찌르기 간격 {time:pct}%", "Thrust interval {time:pct}%", "突きの間隔{time:pct}%"),
  lnPierce: c("찌르기 길이 {len}배", "{len}x thrust length", "突きの長さ{len}倍"),
  lnFlurry: c("새 공격: {every}번째 찌르기마다 양옆으로도 찌름 ({mul:pct}%)", "New attack: every {every}th thrust also stabs to both sides ({mul:pct}%)", "新攻撃：{every}回目の突きごとに左右にも突く（{mul:pct}%）"),
  lnWave: c("새 공격: 찌를 때마다 칼끝에서 초승달 검기가 날아가 꿰뚫음 ({mul:pct}%)", "New attack: every thrust fires a crescent wave from the tip that pierces ({mul:pct}%)", "新攻撃：突くたびに剣先から三日月の剣気が飛んで貫く（{mul:pct}%）"),
  lnLunge: c("찌를 때 돌진 거리 {dist}배 · 찌르기 피해 {mul}배", "{dist}x lunge distance · {mul}x thrust damage", "突きの踏み込み{dist}倍・突きのダメージ{mul}倍"),
  lnEye: c("기본 약점 공격 확률 +{add:pct}%p", "Base weak-point chance +{add:pct}%p", "基本の弱点攻撃確率+{add:pct}%p"),
  lnDeep: c("약점 공격 추가 피해 {extra:pct}%로", "Weak-point bonus damage becomes {extra:pct}%", "弱点攻撃の追加ダメージが{extra:pct}%に"),
  lnMarkFast: c("월광 표적이 {every}배 간격으로 (더 자주)", "Moonlight Marks appear at {every}x interval (more often)", "月光の標的が{every}倍の間隔で（より頻繁に）"),
  lnTwinMark: c("월광 표적이 한 번에 {n}개", "{n} Moonlight Marks at once", "月光の標的が一度に{n}つ"),
  lnExecute: c("체력 {hp:pct}% 이하 적에게 약점 공격 {mul}배", "{mul}x weak-point damage to foes at or below {hp:pct}% HP", "体力{hp:pct}%以下の敵に弱点攻撃{mul}倍"),
  lnSlashBig: c("달빛 베기 범위 {r}배", "{r}x Moonlight Slash radius", "月光斬りの範囲{r}倍"),
  lnSlashPow: c("달빛 베기 피해 {mul}배", "{mul}x Moonlight Slash damage", "月光斬りのダメージ{mul}倍"),
  lnChain: c("새 공격: 달빛 베기가 {reach} 안 가까운 다른 적에게 한 번 더 이어짐 ({mul:pct}%)", "New attack: Moonlight Slash chains once to another foe within {reach} ({mul:pct}%)", "新攻撃：月光斬りが{reach}以内の別の敵にもう一度連なる（{mul:pct}%）"),
  lnFullMoon: c("달빛 베기가 달빛 {stacks}스택(보름달)을 바로 검", "Moonlight Slash applies {stacks} Moonlight stacks (full moon) at once", "月光斬りが月光{stacks}スタック（満月）を即付与"),
  lnMoonRain: c("새 공격: 달빛 베기 뒤 둘레에 초승달 {n}개가 떨어짐 ({mul:pct}%)", "New attack: {n} crescents fall around after a Moonlight Slash ({mul:pct}%)", "新攻撃：月光斬りの後、周囲に三日月が{n}つ落ちる（{mul:pct}%）"),
  lnDashPow: c("대시 찌르기 피해 {mul}배 · 범위 {r}배", "{mul}x dash thrust damage · {r}x radius", "ダッシュ突きのダメージ{mul}倍・範囲{r}倍"),
  lnAfterimage: c("새 공격: 대시가 끝나면 지나온 길을 잔상이 한 번 더 찌름 ({mul:pct}%)", "New attack: after a dash, an afterimage thrusts along the path again ({mul:pct}%)", "新攻撃：ダッシュ後、通った道を残像がもう一度突く（{mul:pct}%）"),
  lnSense: c("성흔이 {gain}배 빨리 참", "Stigma fills {gain}x faster", "聖痕が{gain}倍早く満ちる"),
  lnEndless: c("만월 각성 +{more:sec}초", "Full Moon Awakening +{more:sec}s", "満月覚醒+{more:sec}秒"),
  lnCrescent: c("새 공격: 만월 각성 중 {every}번 찌를 때마다 몸 둘레를 초승달로 벰 ({mul:pct}%)", "New attack: during Full Moon Awakening, every {every} thrusts slash a crescent around you ({mul:pct}%)", "新攻撃：満月覚醒中、{every}回突くごとに周囲を三日月で斬る（{mul:pct}%）"),
};
