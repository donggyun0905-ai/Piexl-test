// 베두인 글자 (한·영·일): 차크람 이름·설명 · 전용 아이템 이름·효과 (수치는 weaponsBedouin·sim/bedouin·BEDOUIN_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type BedouinPassive =
  | "returnWind" | "mirageStep" | "desertMirage" | "sunWarrior" | "accumulate" | "sandstorm" | "scorchBlade" | "duneRush" | "oasis" | "heatHaze"
  | "scarabCharm" | "whirlRing" | "spinMaster" | "farThrow" | "reboundRing" | "sandVeil" | "quickCatch" | "mirageDouble" | "nomadSpirit" | "desertKing";

export const BEDOUIN_WEAPON_NAMES: Record<"sandChakram" & WeaponId, Names> = {
  sandChakram: { ko: "사막의 대륜", en: "Great Dune Chakram", ja: "砂漠の大輪" },
};

export const CHAKRAM_DESC: Names = {
  ko: "한 번은 둘레를 한 바퀴 베고, 다음은 멀리 던짐 · 던진 뒤엔 떨어진 차크람에 닿아 주워야 다시 공격 (주울 때 모래와 함께 크게 한 바퀴 벰)",
  en: "Spin-slash around you, then hurl it far · Touch the landed chakram to pick it up before attacking again (picking it up unleashes a wide sand slash)",
  ja: "一度は周りを一回転斬り、次は遠くへ投げる · 投げた後は落ちたチャクラムに触れて拾うまで攻撃できない（拾う時に砂と共に大きく一回転斬り）",
};

export const BEDOUIN_PASSIVE_NAMES: Record<BedouinPassive & PassiveId, Names> = {
  returnWind: { ko: "회귀 바람", en: "Returning Wind", ja: "回帰の風" },
  mirageStep: { ko: "신기루 걸음", en: "Mirage Step", ja: "蜃気楼の歩み" },
  desertMirage: { ko: "사막 환영", en: "Desert Mirage", ja: "砂漠の幻影" },
  sunWarrior: { ko: "태양 전사", en: "Sun Warrior", ja: "太陽の戦士" },
  accumulate: { ko: "축적", en: "Accumulate", ja: "蓄積" },
  sandstorm: { ko: "모래 폭풍", en: "Sandstorm", ja: "砂嵐" },
  scorchBlade: { ko: "작열 칼날", en: "Scorching Edge", ja: "灼熱の刃" },
  duneRush: { ko: "무희의 춤", en: "Dancer's Whirl", ja: "舞姫の舞" },
  oasis: { ko: "오아시스", en: "Oasis", ja: "オアシス" },
  heatHaze: { ko: "아지랑이", en: "Heat Haze", ja: "陽炎" },
  scarabCharm: { ko: "풍뎅이 부적", en: "Scarab Charm", ja: "スカラベのお守り" },
  whirlRing: { ko: "잔상 고리", en: "Afterimage Ring", ja: "残像の輪" },
  spinMaster: { ko: "회전의 달인", en: "Spin Master", ja: "回転の達人" },
  farThrow: { ko: "멀리 던지기", en: "Long Throw", ja: "遠投" },
  reboundRing: { ko: "되튕김", en: "Rebound", ja: "跳ね返り" },
  sandVeil: { ko: "모래 장막", en: "Sand Veil", ja: "砂の帳" },
  quickCatch: { ko: "날랜 손", en: "Quick Catch", ja: "素早い手" },
  mirageDouble: { ko: "신기루 분신", en: "Mirage Double", ja: "蜃気楼の分身" },
  nomadSpirit: { ko: "유목민의 혼", en: "Nomad Spirit", ja: "遊牧民の魂" },
  desertKing: { ko: "사막의 왕", en: "King of the Desert", ja: "砂漠の王" },
};

export const BEDOUIN_EFFECTS: Partial<Record<BedouinPassive & PassiveId, Names>> = {
  returnWind: { ko: "떨어진 차크람이 {chance:pct}% 확률로 혼자 돌아옴", en: "{chance:pct}% chance a landed chakram flies back on its own", ja: "落ちたチャクラムが{chance:pct}%の確率で自ら戻る" },
  mirageStep: { ko: "대시 대기 시간 -{cooldown:down}% · 대시를 {charges}번까지 모아 연속으로 씀", en: "Dash cooldown -{cooldown:down}% · Store up to {charges} dashes and chain them", ja: "ダッシュ待ち時間-{cooldown:down}% · ダッシュを{charges}回まで溜めて連続で使う" },
  desertMirage: { ko: "던질 때 환영 차크람 2개가 부채꼴로 같이 날아감 (공격력 {damage:pct}%)", en: "Throws also send 2 mirage chakrams in a fan ({damage:pct}% damage)", ja: "投げる時に幻影チャクラム2つが扇状に飛ぶ（攻撃力{damage:pct}%）" },
  sunWarrior: { ko: "공격력 +30% · 던지는 거리 +100% · 모아 둔 대시 하나마다 피해 +{perDash:pct}%", en: "+30% damage · +100% throw range · +{perDash:pct}% damage per stored dash", ja: "攻撃力+30% · 投げる距離+100% · 溜めたダッシュ1回ごとにダメージ+{perDash:pct}%" },
  accumulate: { ko: "대시를 1번 더 모아 둘 수 있음 (겹쳐서 가질 수 있음)", en: "Store 1 more dash (stacks)", ja: "ダッシュをもう1回溜められる（重ねて持てる）" },
  sandstorm: { ko: "주울 때 모래 베기 범위 +{area:up}% · 그 자리에 {ticks:sec}초 모래 회오리 (0.5초마다 공격력 {damage:pct}%)", en: "Catch slash area +{area:up}% · Leaves a sand vortex for {ticks:sec}s ({damage:pct}% damage every 0.5s)", ja: "拾う時の砂斬り範囲+{area:up}% · その場に{ticks:sec}秒の砂竜巻（0.5秒ごとに攻撃力{damage:pct}%）" },
  scorchBlade: { ko: "던진 차크람에 맞은 적이 2초 동안 불탐 (총 공격력 {damage:pct}%)", en: "Thrown chakram burns foes for 2s ({damage:pct}% damage total)", ja: "投げたチャクラムに当たった敵が2秒燃える（合計攻撃力{damage:pct}%）" },
  duneRush: { ko: "대시하며 무희처럼 빙글 돌아, 지나간 적을 공격력 {damage:pct}%로 연달아 {hits}번 벰 (기본 대시 공격 대신)", en: "Whirl like a dancer as you dash, slashing foes you pass {hits} times in a row for {damage:pct}% damage each (replaces the basic dash attack)", ja: "ダッシュ中に舞姫のようにくるりと回り、通り抜けた敵を攻撃力{damage:pct}%で{hits}回連続で斬る（基本のダッシュ攻撃の代わり）" },
  oasis: { ko: "차크람을 주울 때마다 최대 체력의 {heal:pct}% 회복", en: "Heal {heal:pct}% max HP each catch", ja: "チャクラムを拾うたびに最大体力の{heal:pct}%回復" },
  heatHaze: { ko: "차크람을 주운 뒤 {ticks:sec}초 무적", en: "Invulnerable for {ticks:sec}s after a catch", ja: "チャクラムを拾った後{ticks:sec}秒無敵" },
  whirlRing: { ko: "날아가는 차크람이 지나간 자리에 잔상을 남김 · 잔상은 {ticks:sec}초 동안 돌며 닿은 적을 0.5초마다 공격력 {damage:pct}%로 벰", en: "A flying chakram leaves afterimages along its path · each spins for {ticks:sec}s, cutting touching foes for {damage:pct}% damage every 0.5s", ja: "飛んでいるチャクラムが通った跡に残像を残す · 残像は{ticks:sec}秒間回り続け、触れた敵を0.5秒ごとに攻撃力{damage:pct}%で斬る" },
  scarabCharm: { ko: "행운 +2 · 보스에게 주는 피해 +{boss:up}%", en: "Luck +2 · +{boss:up}% damage to bosses", ja: "幸運+2 · ボスへのダメージ+{boss:up}%" },
  spinMaster: { ko: "회전 베기 범위 +{area:up}%, 피해 +{damage:up}%", en: "Spin slash area +{area:up}%, damage +{damage:up}%", ja: "回転斬りの範囲+{area:up}%、ダメージ+{damage:up}%" },
  farThrow: { ko: "던지는 속도 +40% · 던진 차크람 피해 +{damage:up}%", en: "Throw speed +40% · Thrown chakram damage +{damage:up}%", ja: "投げる速さ+40% · 投げたチャクラムのダメージ+{damage:up}%" },
  reboundRing: { ko: "날아가는 차크람이 벽에 닿을 때마다 계속 튕겨 더 날아감", en: "The flying chakram keeps bouncing off every wall it hits", ja: "飛んでいるチャクラムが壁に当たるたびに跳ね返り続ける" },
  sandVeil: { ko: "차크람을 던져 손이 비어 있는 동안 받는 피해 -{taken:down}%", en: "Take {taken:down}% less damage while your hands are empty", ja: "チャクラムを投げて手が空いている間、受けるダメージ-{taken:down}%" },
  quickCatch: { ko: "차크람을 주우면 대시 1번을 바로 돌려받음", en: "Catching the chakram refunds 1 dash", ja: "チャクラムを拾うとダッシュ1回をすぐ取り戻す" },
  mirageDouble: { ko: "주울 때 모래 베기 피해 +{damage:up}%", en: "Catch slash damage +{damage:up}%", ja: "拾う時の砂斬りダメージ+{damage:up}%" },
  desertKing: { ko: "{every:nth}번째로 던질 때마다 {size}배 크기의 거대 차크람 (피해 {damage}배)", en: "Every {every:nth} throw is a giant chakram ({size}x size, {damage}x damage)", ja: "{every}回目に投げるたびに{size}倍の巨大チャクラム（ダメージ{damage}倍）" },
};
