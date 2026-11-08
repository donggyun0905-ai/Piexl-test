// 새벽의 성흔 인시전 글자 (한·영·일): 도살자의 쌍도끼 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsIncision·INCISION_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type IcPassive =
  | "icHeavy" | "icWide" | "icSwift" | "icThrow" | "icVortex" | "icKeep" | "icIron" | "icRampage" | "icDrink" | "icBurst"
  | "icLeapOften" | "icLeapBig" | "icLeapPow" | "icQuake" | "icDouble" | "icRushPow" | "icTrail" | "icSense" | "icEndless" | "icCarnage";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const IC_WEAPON_NAMES: Record<"icAxes" & WeaponId, Names> = {
  icAxes: c("도살자의 쌍도끼", "Butcher's Twin Axes", "屠殺者の双斧"),
};

export const IC_PASSIVE_NAMES: Record<IcPassive & PassiveId, Names> = {
  icHeavy: c("무거운 도끼날", "Heavy Axeheads", "重い斧刃"),
  icWide: c("크게 휘두르기", "Wide Swings", "大振り"),
  icSwift: c("피에 젖은 손잡이", "Blood-Soaked Grip", "血に濡れた柄"),
  icThrow: c("날아가는 초승달", "Flying Crescents", "飛ぶ三日月"),
  icVortex: c("피의 소용돌이", "Blood Vortex", "血の渦"),
  icKeep: c("끈질긴 광기", "Stubborn Madness", "しつこい狂気"),
  icIron: c("흔들리지 않는 광기", "Unshaken Madness", "揺るがぬ狂気"),
  icRampage: c("끝없는 광란", "Endless Rampage", "果てなき狂乱"),
  icDrink: c("피의 연타", "Blood Flurry", "血の連打"),
  icBurst: c("도륙 폭발", "Carnage Burst", "屠殺の爆発"),
  icLeapOften: c("사냥감 냄새", "Scent of Prey", "獲物の匂い"),
  icLeapBig: c("무너지는 땅", "Crumbling Ground", "崩れる大地"),
  icLeapPow: c("도살자의 무게", "Butcher's Weight", "屠殺者の重み"),
  icQuake: c("갈라진 땅", "Split Earth", "裂けた大地"),
  icDouble: c("연속 도약", "Chain Leap", "連続跳躍"),
  icRushPow: c("짓밟는 돌진", "Trampling Rush", "踏み潰す突進"),
  icTrail: c("피의 길", "Trail of Blood", "血の道"),
  icSense: c("광기의 성흔", "Stigma of Madness", "狂気の聖痕"),
  icEndless: c("멈추지 않는 광란", "Unstoppable Frenzy", "止まらぬ狂乱"),
  icCarnage: c("학살", "Massacre", "虐殺"),
};

export const IC_EFFECTS: Partial<Record<IcPassive & PassiveId, Names>> = {
  icHeavy: c("네 박자 피해 {mul}배", "{mul}x four-beat damage", "四拍子のダメージ{mul}倍"),
  icWide: c("베기·교차·회오리 범위 {r}배", "{r}x slash · cross · whirlwind reach", "斬り・交差・旋風の範囲{r}倍"),
  icSwift: c("박자 간격 {time:pct}%", "Beat interval {time:pct}%", "拍子の間隔{time:pct}%"),
  icThrow: c("새 공격: 교차 베기 때 붉은 초승달 참격 둘이 앞으로 날아가 꿰뚫음 ({mul:pct}%)", "New attack: the crossing slash also hurls two red crescents forward that pierce ({mul:pct}%)", "新攻撃：交差斬りの時、赤い三日月の斬撃が2つ前へ飛んで貫く（{mul:pct}%）"),
  icVortex: c("새 공격: 회오리 베기가 {ticks:sec}초 동안 몸 둘레에 남아 {every:sec}초마다 벰 ({mul:pct}%)", "New attack: the whirlwind slash lingers around you for {ticks:sec}s, cutting every {every:sec}s ({mul:pct}%)", "新攻撃：旋風斬りが{ticks:sec}秒間周囲に残り、{every:sec}秒ごとに斬る（{mul:pct}%）"),
  icKeep: c("콤보가 끊기기까지 {hold}배 오래 버팀", "Combo lasts {hold}x longer without hits", "コンボが途切れるまで{hold}倍長く持つ"),
  icIron: c("맞아도 콤보가 {keep:pct}% 남음", "{keep:pct}% of the combo remains when hit", "被弾してもコンボが{keep:pct}%残る"),
  icRampage: c("콤보 최대 {max}단계까지", "Combo goes up to tier {max}", "コンボ最大{max}段階まで"),
  icDrink: c("콤보 {min} 이상이면 맞힌 적마다 최대 체력 {heal:pct}% 회복 (한 번에 {cap:pct}%까지)", "At {min}+ combo, heal {heal:pct}% max HP per foe hit (up to {cap:pct}% per swing)", "コンボ{min}以上なら当てた敵ごとに最大体力{heal:pct}%回復（1回{cap:pct}%まで）"),
  icBurst: c("새 공격: 콤보 {every}마다 몸 둘레가 피로 터짐 ({mul:pct}%)", "New attack: every {every} combo, blood bursts around you ({mul:pct}%)", "新攻撃：コンボ{every}ごとに周囲が血で弾ける（{mul:pct}%）"),
  icLeapOften: c("도살 도약이 콤보 {every}마다", "Butcher's Leap every {every} combo", "屠殺の跳躍がコンボ{every}ごとに"),
  icLeapBig: c("도약 착지 범위 {r}배", "{r}x leap landing radius", "跳躍の着地範囲{r}倍"),
  icLeapPow: c("도약 피해 {mul}배", "{mul}x leap damage", "跳躍のダメージ{mul}倍"),
  icQuake: c("새 공격: 착지한 자리가 {ticks:sec}초 동안 갈라져 {every:sec}초마다 벰 ({mul:pct}%)", "New attack: the landing spot splits open for {ticks:sec}s, cutting every {every:sec}s ({mul:pct}%)", "新攻撃：着地点が{ticks:sec}秒間裂け、{every:sec}秒ごとに斬る（{mul:pct}%）"),
  icDouble: c("새 공격: 착지 뒤 {reach} 안 다른 적에게 한 번 더 뛰어듦 ({mul:pct}%)", "New attack: after landing, leap once more onto another foe within {reach} ({mul:pct}%)", "新攻撃：着地後、{reach}以内の別の敵にもう一度飛び込む（{mul:pct}%）"),
  icRushPow: c("돌진 연참 피해 {mul}배 · 적마다 {hits}번", "{mul}x Rushing Cleave damage · {hits} cuts per foe", "突進連斬のダメージ{mul}倍・敵ごとに{hits}回"),
  icTrail: c("새 공격: 돌진이 끝나면 지나온 길이 피로 터짐 ({mul:pct}%)", "New attack: after a dash, the path behind you bursts with blood ({mul:pct}%)", "新攻撃：突進後、通った道が血で弾ける（{mul:pct}%）"),
  icSense: c("성흔이 {gain}배 빨리 참", "Stigma fills {gain}x faster", "聖痕が{gain}倍早く満ちる"),
  icEndless: c("광란 각성 +{more:sec}초", "Frenzy Awakening +{more:sec}s", "狂乱覚醒+{more:sec}秒"),
  icCarnage: c("새 공격: 광란 각성 중 처치한 적 자리에서 피가 터짐 ({mul:pct}%)", "New attack: during Frenzy Awakening, slain foes burst with blood ({mul:pct}%)", "新攻撃：狂乱覚醒中に倒した敵の位置で血が弾ける（{mul:pct}%）"),
};
