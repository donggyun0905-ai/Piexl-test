// 실베르 백령 글자 (한·영·일): 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsBaekryeong·BAEK_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type ByPassive =
  | "byWraith" | "byTrinity" | "byWhirl" | "byGreat" | "byGreatWolf" | "byGreatWhite" | "byFeast" | "byDrain" | "byHorn" | "byWide"
  | "byTwin" | "byFlame" | "byStep" | "byGuard" | "byHaunt" | "byPossess" | "byReaper" | "byWisp" | "byFrost" | "byCall";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const BY_WEAPON_NAMES: Record<"byBlade" & WeaponId, Names> = {
  byBlade: c("백령의 대태도", "Baekryeong's Odachi", "白霊の大太刀"),
};

export const BY_PASSIVE_NAMES: Record<ByPassive & PassiveId, Names> = {
  byWraith: c("혼령참", "Wraith Slash", "霊斬"),
  byTrinity: c("삼위령", "Trinity Wraiths", "三位霊"),
  byWhirl: c("위백도", "Whirling Blades", "威白刀"),
  byGreat: c("(진)대태도", "True Odachi", "（真）大太刀"),
  byGreatWolf: c("(진)대태도 - 랑", "True Odachi: Wolf", "（真）大太刀・狼"),
  byGreatWhite: c("(진)대태도 - 백", "True Odachi: White", "（真）大太刀・白"),
  byFeast: c("영혼 포식", "Soul Feast", "魂喰らい"),
  byDrain: c("혼 흡수", "Soul Drain", "魂吸い"),
  byHorn: c("오니의 뿔", "Oni Horns", "鬼の角"),
  byWide: c("넓은 참격", "Wide Slash", "広い斬撃"),
  byTwin: c("이연참", "Twin Slash", "二連斬"),
  byFlame: c("청혼불", "Blue Soulfire", "青い魂火"),
  byStep: c("유령 걸음", "Ghost Step", "幽霊の歩み"),
  byGuard: c("혼의 가호", "Soul Ward", "魂の加護"),
  byHaunt: c("원혼", "Vengeful Spirits", "怨霊"),
  byPossess: c("귀신 들림", "Possessed", "憑依"),
  byReaper: c("저승 베기", "Underworld Cut", "冥府斬り"),
  byWisp: c("혼등", "Soul Lantern", "魂灯"),
  byFrost: c("서리 혼", "Frost Soul", "霜の魂"),
  byCall: c("혼 부름", "Soul Calling", "魂呼び"),
};

export const BY_EFFECTS: Partial<Record<ByPassive & PassiveId, Names>> = {
  byWraith: c("새 기술: 유령팔 참격에 망령 {n}개가 같이 날아가 닿은 적마다 공격력의 {mul:pct}% (영혼 게이지 3칸부터)", "New skill: a wraith flies along with each ghost arm slash, dealing {mul:pct}% of damage to every foe it touches (from 3 soul bars)", "新技：幽霊の腕の斬撃と一緒に亡霊が飛び、触れた敵ごとに攻撃力の{mul:pct}%（魂ゲージ3本から）"),
  byTrinity: c("새 기술: 혼령참 망령이 {n}개로 늘어 양옆으로 벌어져 날아감", "New skill: Wraith Slash sends {n} wraiths, fanning out to both sides", "新技：霊斬の亡霊が{n}体に増え、左右に広がって飛ぶ"),
  byWhirl: c("새 기술: 망령에 닿은 적에게 검무 소용돌이가 일어 {every:sec}초마다 {hits}번 더 공격력의 {mul:pct}% (반지름 {r})", "New skill: foes touched by a wraith are caught in a whirling sword dance, taking {hits} more hits of {mul:pct}% of damage every {every:sec}s (radius {r})", "新技：亡霊に触れた敵に剣舞の渦が起き、{every:sec}秒ごとにさらに{hits}回、攻撃力の{mul:pct}%（半径{r}）"),
  byGreat: c("새 기술: 유령팔이 벨 때 {chance:pct}% 확률로 푸른 불꽃의 큰 대태도가 하늘에서 앞쪽 적 위로 떨어져 아래 반지름 {r} 안에 공격력의 {mul:pct}%", "New skill: ghost arm cuts have a {chance:pct}% chance to drop a huge blue-flamed odachi from the sky onto a foe ahead, dealing {mul:pct}% of damage within radius {r}", "新技：幽霊の腕が斬る時{chance:pct}%の確率で青い炎の大きな大太刀が空から前の敵の上に落ち、下の半径{r}内に攻撃力の{mul:pct}%"),
  byGreatWolf: c("새 기술: (진)대태도가 떨어지면 그 뒤로 대태도가 하나씩 맵 끝까지 이어 떨어짐 (하나마다 대태도의 {mul:pct}%)", "New skill: when a True Odachi falls, more odachi keep dropping one after another behind it all the way to the map edge (each {mul:pct}% of the odachi)", "新技：（真）大太刀が落ちると、その後ろへ大太刀がひとつずつマップの端まで続けて落ちる（ひとつごとに大太刀の{mul:pct}%）"),
  byGreatWhite: c("새 기술: 유령팔이 벨 때 {chance:pct}% 확률로 범위 끝에 푸른 불꽃의 대태도가 꽂혀 {life:sec}초 동안 반지름 {r} 안 적에게 {every:sec}초마다 번개 (공격력의 {mul:pct}% · 최대 {max}개)", "New skill: ghost arm cuts have a {chance:pct}% chance to plant a blue-flamed odachi at the edge of your reach; for {life:sec}s it strikes foes within radius {r} with lightning every {every:sec}s ({mul:pct}% of damage · up to {max})", "新技：幽霊の腕が斬る時{chance:pct}%の確率で範囲の端に青い炎の大太刀が刺さり、{life:sec}秒間、半径{r}内の敵に{every:sec}秒ごとに雷（攻撃力の{mul:pct}%・最大{max}本）"),
  byFeast: c("능력: 처치할 때마다 영혼이 {extra}개 더 쌓임", "Ability: each kill adds {extra} more soul", "能力：倒すたびに魂がさらに{extra}つたまる"),
  byDrain: c("능력: 적을 처치하면 {chance:pct}% 확률로 체력 {heal} 회복", "Ability: kills have a {chance:pct}% chance to heal {heal} HP", "能力：敵を倒すと{chance:pct}%の確率で体力{heal}回復"),
  byHorn: c("능력: 대태도 베기가 {size}배 더 멀리·넓게 닿음 (유령 걸음도)", "Ability: odachi cuts reach {size}x farther and wider (Ghost Step too)", "能力：大太刀斬りが{size}倍遠く・広く届く（幽霊の歩みも）"),
  byWide: c("능력: 유령팔 참격 크기 {size}배", "Ability: ghost arm slashes are {size}x larger", "能力：幽霊の腕の斬撃の大きさ{size}倍"),
  byTwin: c("새 기술: 유령팔이 벨 때 {chance:pct}% 확률로 참격이 {delay:sec}초 뒤 한 번 더 나감", "New skill: ghost arm cuts have a {chance:pct}% chance to send a second slash {delay:sec}s later", "新技：幽霊の腕が斬る時{chance:pct}%の確率で{delay:sec}秒後に斬撃がもう一度出る"),
  byFlame: c("능력: 대태도에 베인 적이 푸른 불에 탐 (2초 동안 공격력의 {burn:pct}%)", "Ability: foes cut by the odachi burn with blue fire ({burn:pct}% of damage over 2s)", "能力：大太刀に斬られた敵が青い炎で燃える（2秒間で攻撃力の{burn:pct}%）"),
  byStep: c("새 기술: 대시가 끝난 자리에 혼불이 터져 반지름 {r} 안에 공격력의 {mul:pct}%", "New skill: soulfire bursts where your dash ends, dealing {mul:pct}% of damage within radius {r}", "新技：ダッシュが終わった所で魂火が弾け、半径{r}内に攻撃力の{mul:pct}%"),
  byGuard: c("능력: 받는 피해 {taken:down}% 감소", "Ability: take {taken:down}% less damage", "能力：受けるダメージ{taken:down}%減少"),
  byHaunt: c("능력: 영혼 게이지 칸마다 백령의 모든 공격 피해 +{per:pct}%", "Ability: +{per:pct}% damage on all of Baekryeong's attacks per soul bar", "能力：魂ゲージ1本ごとに白霊のすべての攻撃ダメージ+{per:pct}%"),
  byPossess: c("능력: 체력이 {below:pct}% 아래면 공격 속도 {speed}배", "Ability: below {below:pct}% HP, attack speed x{speed}", "能力：体力が{below:pct}%未満なら攻撃速度{speed}倍"),
  byReaper: c("능력: 체력이 {below:pct}% 아래인 적에게 대태도 베기 피해 {mul}배", "Ability: odachi cuts deal {mul}x damage to foes below {below:pct}% HP", "能力：体力が{below:pct}%未満の敵に大太刀斬りのダメージ{mul}倍"),
  byWisp: c("새 기술: 적을 처치하면 {chance:pct}% 확률로 혼불이 가까운 적에게 날아가 공격력의 {mul:pct}%", "New skill: kills have a {chance:pct}% chance to send a soulfire wisp at a nearby foe for {mul:pct}% of damage", "新技：敵を倒すと{chance:pct}%の確率で魂火が近くの敵へ飛び、攻撃力の{mul:pct}%"),
  byFrost: c("능력: 유령팔 참격·망령에 닿은 적이 {slow:sec}초 느려짐", "Ability: foes hit by ghost arm slashes or wraiths are slowed for {slow:sec}s", "能力：幽霊の腕の斬撃・亡霊に触れた敵が{slow:sec}秒遅くなる"),
  byCall: c("능력: 영혼 게이지 한 칸에 필요한 영혼 {need:down}% 감소", "Ability: {need:down}% fewer souls needed per soul bar", "能力：魂ゲージ1本に必要な魂{need:down}%減少"),
};
