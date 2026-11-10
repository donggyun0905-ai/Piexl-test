// 실베르 래빗 글자 (한·영·일): 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsRabbit·RABBIT_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type RbPassive =
  | "rbQuake" | "rbTriple" | "rbSeal" | "rbHomerun" | "rbLucky" | "rbCarrot" | "rbEars" | "rbHop" | "rbClover" | "rbBell"
  | "rbGhost" | "rbHeavy" | "rbStomp" | "rbAfter" | "rbCrack" | "rbMoon" | "rbFluff" | "rbMega" | "rbFever" | "rbStar";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const RB_WEAPON_NAMES: Record<"rbHammer" & WeaponId, Names> = {
  rbHammer: c("토끼 망치", "Bunny Hammer", "うさぎハンマー"),
};

export const RB_PASSIVE_NAMES: Record<RbPassive & PassiveId, Names> = {
  rbQuake: c("땅울림", "Ground Quake", "地響き"),
  rbTriple: c("세 갈래 땅울림", "Triple Quake", "三つ又の地響き"),
  rbSeal: c("토끼인장", "Bunny Seal", "うさぎの印"),
  rbHomerun: c("홈런!", "Home Run!", "ホームラン！"),
  rbLucky: c("슈퍼 럭키!", "Super Lucky!", "スーパーラッキー！"),
  rbCarrot: c("당근 간식", "Carrot Snack", "にんじんおやつ"),
  rbEars: c("긴 귀", "Long Ears", "長い耳"),
  rbHop: c("깡총 뛰기", "Bunny Hop", "ぴょんぴょん"),
  rbClover: c("네잎클로버", "Four-Leaf Clover", "四つ葉のクローバー"),
  rbBell: c("방울", "Little Bell", "鈴"),
  rbGhost: c("유령 망치", "Ghost Hammer", "幽霊ハンマー"),
  rbHeavy: c("묵직한 망치", "Heavy Hammer", "ずっしりハンマー"),
  rbStomp: c("쿵쿵쿵", "Thump Thump", "ドンドンドン"),
  rbAfter: c("여진", "Aftershock", "余震"),
  rbCrack: c("갈라진 땅", "Cracked Ground", "ひび割れた地面"),
  rbMoon: c("달토끼", "Moon Rabbit", "月うさぎ"),
  rbFluff: c("폭신한 솜털", "Fluffy Fur", "ふわふわの毛"),
  rbMega: c("왕망치", "Mega Hammer", "特大ハンマー"),
  rbFever: c("럭키 피버", "Lucky Fever", "ラッキーフィーバー"),
  rbStar: c("별사탕", "Star Candy", "金平糖"),
};

export const RB_EFFECTS: Partial<Record<RbPassive & PassiveId, Names>> = {
  rbQuake: c("새 기술: 망치로 찍은 곳에서 땅울림이 커진 뒤, 그 크기 그대로 앞으로 맵 끝까지 나아가며 닿은 적마다 공격력의 80%", "New skill: after the quake ring grows where you slam, it rolls forward at full size to the edge of the map, hitting each foe for 80% of damage", "新技：ハンマーで叩いた所の地響きが広がった後、その大きさのまま前へマップの端まで進み、触れた敵ごとに攻撃力の80%"),
  rbTriple: c("새 기술: 땅울림이 앞과 양옆 세 방향으로 나아감 (땅울림이 없어도 세 갈래로 나감)", "New skill: quakes roll out in three directions, forward and to both sides (works even without Ground Quake)", "新技：地響きが前と左右の三方向へ進む（地響きがなくても三つ又で出る）"),
  rbSeal: c("새 기술: 망치로 찍은 곳에서 토끼가 나와 {delay:sec}초 뒤 터짐 (반지름 {r} · 공격력의 {mul:pct}%) · 땅울림 파동에서는 안 나옴", "New skill: a bunny pops out where you slam and bursts after {delay:sec}s (radius {r} · {mul:pct}% of damage) · not from rolling quakes", "新技：ハンマーで叩いた所からうさぎが出て{delay:sec}秒後に弾ける（半径{r}・攻撃力の{mul:pct}%）・地響きの波からは出ない"),
  rbHomerun: c("새 기술: 공격마다 {chance:pct}% 확률로 망치를 아주 크게 휘두름 ({size}배 크기 · 피해 {mul}배) · 몬스터를 보통의 {knock}배 밀치고 {fly:pct}% 확률로 맵 밖으로 날려 버림 (즉사 · 보스 빼고)", "New skill: each swing has a {chance:pct}% chance to be a giant swing ({size}x size · {mul}x damage) · knocks foes back {knock}x as far, with a {fly:pct}% chance to send them flying off the map (instant kill · not bosses)", "新技：攻撃ごとに{chance:pct}%の確率でハンマーをとても大きく振る（{size}倍の大きさ・ダメージ{mul}倍）・敵を通常の{knock}倍吹き飛ばし、{fly:pct}%の確率でマップの外へ飛ばす（即死・ボス以外）"),
  rbLucky: c("새 기술: 래빗 전용 아이템을 {need}개 이상 가지면 공격할 때 {chance:pct}% 확률로 초거대 망치! 맵을 가릴 만큼 큰 망치가 왼쪽에서 나와 슬로우 모션이 되고, 방 안 적 모두가 피해를 나눠 최대 30번 맞은 뒤 오른쪽으로 휘둘러짐 (그동안 무적 · 쿨타임 {cd:sec}초)", "New skill: with {need}+ Rabbit items, swings have a {chance:pct}% chance to summon a colossal hammer! It sweeps in from the left, slows to slow motion as every foe in the room takes up to 30 split hits, then swings off to the right (invincible meanwhile · {cd:sec}s cooldown)", "新技：ラビット専用アイテムを{need}個以上持つと攻撃時{chance:pct}%の確率で超巨大ハンマー！マップを覆うほどのハンマーが左から現れスローモーションになり、部屋の敵全員がダメージを分けて最大30回受けた後、右へ振り抜かれる（その間無敵・クールタイム{cd:sec}秒）"),
  rbCarrot: c("능력: 적을 처치하면 {chance:pct}% 확률로 체력 {heal} 회복", "Ability: kills have a {chance:pct}% chance to heal {heal} HP", "能力：敵を倒すと{chance:pct}%の確率で体力{heal}回復"),
  rbEars: c("능력: 망치가 {size}배 더 멀리·크게 닿음 (땅울림·토끼인장도)", "Ability: the hammer reaches {size}x farther and wider (quakes and seals too)", "能力：ハンマーが{size}倍遠く・大きく届く（地響き・うさぎの印も）"),
  rbHop: c("새 기술: 대시가 끝난 자리에 망치를 내리찍어 땅울림 ({size}배 크기)", "New skill: slam the hammer where your dash ends ({size}x size)", "新技：ダッシュが終わった所にハンマーを叩きつけて地響き（{size}倍の大きさ）"),
  rbClover: c("능력: 홈런·슈퍼 럭키·유령 망치·별사탕·당근 간식 확률 {mul}배", "Ability: Home Run, Super Lucky, Ghost Hammer, Star Candy and Carrot Snack chances x{mul}", "能力：ホームラン・スーパーラッキー・幽霊ハンマー・金平糖・にんじんおやつの確率{mul}倍"),
  rbBell: c("새 기술: {every}번 찍을 때마다 방울 소리 파동이 퍼져 반지름 {r} 안 적을 {stun:sec}초 묶음 (공격력의 {mul:pct}%)", "New skill: every {every} slams a bell chime ripples out, binding foes within {r} for {stun:sec}s ({mul:pct}% of damage)", "新技：{every}回叩くごとに鈴の音の波が広がり半径{r}内の敵を{stun:sec}秒拘束（攻撃力の{mul:pct}%）"),
  rbGhost: c("새 기술: 찍을 때 {chance:pct}% 확률로 반투명한 유령 망치가 가까운 다른 적 위에 떨어짐 (망치와 같은 피해)", "New skill: slams have a {chance:pct}% chance to drop a translucent ghost hammer on another nearby foe (same damage as the hammer)", "新技：叩くと{chance:pct}%の確率で半透明の幽霊ハンマーが近くの別の敵の上に落ちる（ハンマーと同じダメージ）"),
  rbHeavy: c("능력: 망치에 맞은 적이 {stun:sec}초 기절", "Ability: foes hit by the hammer are stunned for {stun:sec}s", "能力：ハンマーに当たった敵が{stun:sec}秒気絶"),
  rbStomp: c("능력: 쉬지 않고 찍을수록 한 번마다 피해 +{add:pct}% (최대 {max}번 · {keep:sec}초 쉬면 처음부터)", "Ability: each consecutive slam adds +{add:pct}% damage (up to {max} · resets after {keep:sec}s idle)", "能力：休まず叩くほど1回ごとにダメージ+{add:pct}%（最大{max}回・{keep:sec}秒休むと最初から）"),
  rbAfter: c("새 기술: 땅울림 파동이 맵 끝에 닿으면 크게 터짐 (반지름 {r} · 공격력의 {mul:pct}%)", "New skill: rolling quakes erupt when they reach the map edge (radius {r} · {mul:pct}% of damage)", "新技：地響きの波がマップの端に届くと大きく弾ける（半径{r}・攻撃力の{mul:pct}%）"),
  rbCrack: c("새 기술: 찍은 자리에 금이 {ticks:sec}초 남아 위에 선 적을 느리게 하고 {every:sec}초마다 공격력의 {mul:pct}%", "New skill: slams leave cracks for {ticks:sec}s that slow foes on them and deal {mul:pct}% of damage every {every:sec}s", "新技：叩いた所にひびが{ticks:sec}秒残り、上の敵を遅くし{every:sec}秒ごとに攻撃力の{mul:pct}%"),
  rbMoon: c("능력: 체력이 {below:pct}% 아래면 공격 속도 {speed}배", "Ability: below {below:pct}% HP, attack speed x{speed}", "能力：体力が{below:pct}%未満なら攻撃速度{speed}倍"),
  rbFluff: c("능력: 받는 피해 {taken:down}% 감소", "Ability: take {taken:down}% less damage", "能力：受けるダメージ{taken:down}%減少"),
  rbMega: c("능력: 망치·땅울림 크기 {size}배 · 망치 피해 {mul}배", "Ability: hammer and quake size x{size} · hammer damage x{mul}", "能力：ハンマー・地響きの大きさ{size}倍・ハンマーダメージ{mul}倍"),
  rbFever: c("능력: 홈런이 터지면 {ticks:sec}초 동안 공격 속도 {speed}배", "Ability: after a Home Run, attack speed x{speed} for {ticks:sec}s", "能力：ホームランが出ると{ticks:sec}秒間攻撃速度{speed}倍"),
  rbStar: c("새 기술: 찍을 때 {chance:pct}% 확률로 별사탕 {n}개가 튀어 가까운 적들에게 날아감 (공격력의 {mul:pct}%)", "New skill: slams have a {chance:pct}% chance to burst {n} star candies at nearby foes ({mul:pct}% of damage)", "新技：叩くと{chance:pct}%の確率で金平糖{n}個が近くの敵へ飛ぶ（攻撃力の{mul:pct}%）"),
};
