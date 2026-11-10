// 실베르 조커 글자 (한·영·일): 무기 3 이름 · 전용 아이템 15 이름·효과 (수치는 weaponsJoker·JOKER_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type JkPassive =
  | "jkDraw" | "jkEdge" | "jkDouble" | "jkSleeve" | "jkFlame" | "jkFrost" | "jkRecall" | "jkFirework"
  | "jkSplit" | "jkAce" | "jkSeven" | "jkHeart" | "jkAccel" | "jkGuard" | "jkFullHouse";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const JK_WEAPON_NAMES: Record<("jkCards" | "jkScythe" | "jkToyGun") & WeaponId, Names> = {
  jkCards: c("트럼프 카드", "Playing Cards", "トランプ"),
  jkScythe: c("사신의 낫", "Reaper's Scythe", "死神の鎌"),
  jkToyGun: c("장난감 총", "Toy Gun", "おもちゃの銃"),
};

export const JK_PASSIVE_NAMES: Record<JkPassive & PassiveId, Names> = {
  jkDraw: c("카드뽑기", "Card Draw", "カード引き"),
  jkEdge: c("날 선 모서리", "Sharpened Edge", "研いだ角"),
  jkDouble: c("더블 덱", "Double Deck", "ダブルデッキ"),
  jkSleeve: c("마술사의 소매", "Magician's Sleeve", "奇術師の袖"),
  jkFlame: c("불꽃 카드", "Flame Card", "炎のカード"),
  jkFrost: c("서리 카드", "Frost Card", "霜のカード"),
  jkRecall: c("지휘봉", "Baton", "指揮棒"),
  jkFirework: c("폭죽 카드", "Firework Card", "花火のカード"),
  jkSplit: c("분신 카드", "Twin Card", "分身カード"),
  jkAce: c("에이스", "Ace", "エース"),
  jkSeven: c("행운의 7", "Lucky Seven", "幸運の7"),
  jkHeart: c("하트 카드", "Heart Card", "ハートのカード"),
  jkAccel: c("가속 카드", "Accel Card", "加速カード"),
  jkGuard: c("카드 방패", "Card Shield", "カードの盾"),
  jkFullHouse: c("풀 하우스", "Full House", "フルハウス"),
};

export const JK_EFFECTS: Partial<Record<JkPassive & PassiveId, Names>> = {
  jkDraw: c(
    "새 기술: 카드가 맞힐 때마다 게이지가 차고, 가득 차면 머리 위 카드 셋이 섞이다 한 장이 뒤집힘 · 달: 히든 캐릭터의 힘 10초 · 붉은 일식: 10초 동안 받는 피해 +30%, 카드 처음 피해 16 · 세계수: 체력 20 회복",
    "New skill: each card hit fills a gauge; when full, three cards above your head shuffle and one flips · Moon: a hidden hero's power for 10s · Red Eclipse: for 10s, +30% damage taken and cards start at 16 damage · World Tree: heal 20 HP",
    "新技：カードが当たるたびにゲージが溜まり、満タンで頭上の3枚が混ざって1枚がめくれる・月：隠しキャラの力を10秒・赤い日食：10秒間被ダメージ+30%、カードの初期ダメージ16・世界樹：体力20回復",
  ),
  jkEdge: c("튕길 때마다 피해 +{more} 더", "+{more} more damage per bounce", "跳ねるたびにダメージ+{more}追加"),
  jkDouble: c("새 기술: {every}번째 던질 때마다 카드 두 장을 갈라 던짐", "New skill: every {every}th throw splits into two cards", "新技：{every}回目の投げごとにカード2枚に分けて投げる"),
  jkSleeve: c("판 위 카드 한도 +{more}장", "+{more} card limit on the field", "場のカード上限+{more}枚"),
  jkFlame: c("새 능력: 맞은 적이 불탐 (카드 피해의 {burn:pct}%)", "New ability: hit foes burn ({burn:pct}% of card damage)", "新能力：当たった敵が燃える（カードダメージの{burn:pct}%）"),
  jkFrost: c("새 능력: 맞은 적이 {slow:sec}초 느려짐", "New ability: hit foes are slowed for {slow:sec}s", "新能力：当たった敵が{slow:sec}秒遅くなる"),
  jkRecall: c("새 기술: 대시하면 모든 카드가 조준한 쪽으로 방향을 바꿈 ({cool:sec}초마다)", "New skill: dashing turns every card toward your aim (every {cool:sec}s)", "新技：ダッシュすると全カードが狙った方へ向きを変える（{cool:sec}秒ごと）"),
  jkFirework: c("새 기술: 한도를 넘어 사라지는 카드가 그 자리에서 터짐 (그 카드 피해의 {mul:pct}%)", "New skill: cards vanishing past the limit explode on the spot ({mul:pct}% of that card's damage)", "新技：上限を超えて消えるカードがその場で爆発（そのカードのダメージの{mul:pct}%）"),
  jkSplit: c("새 기술: 카드가 {every}번 튕길 때마다 분신 카드 한 장이 갈라져 나옴 (피해 {mul:pct}%부터)", "New skill: every {every} bounces, a card splits off a twin (starting at {mul:pct}% damage)", "新技：カードが{every}回跳ねるごとに分身カードが1枚分かれる（ダメージ{mul:pct}%から）"),
  jkAce: c("새 기술: {every}번째 던지는 카드는 에이스 (크기 {size}배 · 처음 피해 {base})", "New skill: every {every}th card is an Ace ({size}x size · starts at {base} damage)", "新技：{every}枚目に投げるカードはエース（大きさ{size}倍・初期ダメージ{base}）"),
  jkSeven: c("새 능력: 맞힐 때 {chance:pct}% 확률로 피해 {mul}배", "New ability: {chance:pct}% chance to deal {mul}x damage on hit", "新能力：当てた時{chance:pct}%の確率でダメージ{mul}倍"),
  jkHeart: c("새 능력: 카드로 처치하면 체력 {heal} 회복", "New ability: card kills heal {heal} HP", "新能力：カードで倒すと体力{heal}回復"),
  jkAccel: c("새 능력: 튕길 때마다 카드가 빨라짐 (투사체 속도의 {max}배까지)", "New ability: cards speed up on every bounce (up to {max}x projectile speed)", "新能力：跳ねるたびにカードが速くなる（弾速の{max}倍まで）"),
  jkGuard: c("새 능력: 카드에 닿은 적 탄이 사라짐", "New ability: enemy shots touching a card are erased", "新能力：カードに触れた敵弾が消える"),
  jkFullHouse: c("새 능력: 판 위 카드가 한도만큼 가득이면 모든 카드 피해 {mul}배", "New ability: when the field is full of cards, all cards deal {mul}x damage", "新能力：場のカードが上限いっぱいなら全カードのダメージ{mul}倍"),
};
