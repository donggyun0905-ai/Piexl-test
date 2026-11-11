// 실베르 아수라 글자 (한·영·일): 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsAsura·ASURA_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type AsPassive =
  | "asCrush" | "asField" | "asWave" | "asUlt" | "asRapid" | "asDemon" | "asIron" | "asReach" | "asFury" | "asGate"
  | "asSix" | "asWeight" | "asPress" | "asHell" | "asRage" | "asShell" | "asBarrage" | "asFlying" | "asSoul" | "asStep";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const AS_WEAPON_NAMES: Record<"asFist" & WeaponId, Names> = {
  asFist: c("귀신의 주먹", "Spectral Fists", "鬼神の拳"),
};

export const AS_PASSIVE_NAMES: Record<AsPassive & PassiveId, Names> = {
  asCrush: c("분쇄", "Pulverize", "粉砕"),
  asField: c("귀진", "Spirit Domain", "鬼陣"),
  asWave: c("파동", "Shockwave", "波動"),
  asUlt: c("아수라", "Asura", "阿修羅"),
  asRapid: c("연발", "Flurry", "連発"),
  asDemon: c("악귀", "Fiend", "悪鬼"),
  asIron: c("철권", "Iron Fist", "鉄拳"),
  asReach: c("귀수 확장", "Spirit Reach", "鬼手拡張"),
  asFury: c("수라장", "Carnage", "修羅場"),
  asGate: c("귀문 개방", "Open Spirit Gate", "鬼門開放"),
  asSix: c("육도", "Six Paths", "六道"),
  asWeight: c("천근추", "Thousand-Weight", "千斤墜"),
  asPress: c("귀압", "Spirit Pressure", "鬼圧"),
  asHell: c("업화", "Hellfire", "業火"),
  asRage: c("분노의 팔", "Arms of Wrath", "憤怒の腕"),
  asShell: c("귀갑", "Spirit Shell", "鬼甲"),
  asBarrage: c("마수 연타", "Demon Barrage", "魔手連打"),
  asFlying: c("육비 난무", "Six-Arm Frenzy", "六臂乱舞"),
  asSoul: c("혼백 흡수", "Soul Drain", "魂魄吸収"),
  asStep: c("귀신 걸음", "Ghost Step", "鬼神歩"),
};

export const AS_EFFECTS: Partial<Record<AsPassive & PassiveId, Names>> = {
  asCrush: c("능력: 주먹 한 번의 피해를 {n}번으로 나눠 한 틱에 한 번씩 때림 (합은 같지만 치명타·악귀가 {n}번 따로 굴러감)", "Ability: each punch's damage is split into {n} hits, one per tick (same total, but crits and Fiend roll {n} times)", "能力：拳1回のダメージを{n}回に分けて1ティックに1回ずつ与える（合計は同じだが会心・悪鬼が{n}回別々に判定）"),
  asField: c("새 기술: 몸 둘레(반지름 {r})에 남색 영역 · 안에 들어온 적 머리 위에 다이아 표식이 새겨지고 방어력 -5 (받는 피해 +{taken:pct}%)", "New skill: a navy domain surrounds you (radius {r}) · foes inside get a diamond mark over their heads and -5 defense (+{taken:pct}% damage taken)", "新技：体の周り（半径{r}）に紺色の領域・中に入った敵の頭上にダイヤの印が刻まれ防御力-5（受けるダメージ+{taken:pct}%）"),
  asWave: c("새 기술: 모든 공격 끝에 앞으로 부채꼴 파동이 한 번 더 침 (반지름 {r} · 공격력의 {mul:pct}%)", "New skill: every attack ends with a fan-shaped shockwave ahead (radius {r} · {mul:pct}% of damage)", "新技：すべての攻撃の終わりに前方へ扇形の波動がもう一度打つ（半径{r}・攻撃力の{mul:pct}%）"),
  asUlt: c("필살기: 공격마다 {chance:pct}% 확률로 아수라 각성 10초 · 각성 동안 누를 때마다 1·2타 → 1·2타 → 3타(여섯 팔로 바닥을 3번 연속 강타) → 4타(공격력의 320% · 1.5초 기절) 차례로 이어짐", "Ultimate: each attack has a {chance:pct}% chance to awaken Asura for 10s · while awakened, each press chains strike 1-2 → 1-2 → 3 (six arms pound the ground 3 times) → 4 (320% of damage · 1.5s stun)", "必殺技：攻撃ごとに{chance:pct}%の確率で阿修羅覚醒10秒・覚醒中は押すたびに1・2打→1・2打→3打（六本の腕で床を3回連続強打）→4打（攻撃力の320%・1.5秒気絶）と続く"),
  asRapid: c("새 기술: 공격마다 {chance:pct}% 확률로 연속 펀치가 같이 나가 한 틱에 한 번씩 {hits}번 때림 (한 번에 공격력의 {mul:pct}%)", "New skill: each attack has a {chance:pct}% chance to unleash a flurry alongside it, hitting {hits} times, once per tick ({mul:pct}% of damage each)", "新技：攻撃ごとに{chance:pct}%の確率で連続パンチが一緒に出て1ティックに1回ずつ{hits}回打つ（1回に攻撃力の{mul:pct}%）"),
  asDemon: c("새 기술: 때릴 때마다 {chance:pct}% 확률로 붉게 터지며 그 한 대 피해의 {mul:pct}% 추가 피해 (분쇄·연발로 나눠 때리는 한 대 한 대에도)", "New skill: every hit has a {chance:pct}% chance to burst red for {mul:pct}% extra damage of that hit (applies to each split hit from Pulverize and Flurry too)", "新技：打つたびに{chance:pct}%の確率で赤く弾けてその一撃のダメージの{mul:pct}%追加ダメージ（粉砕・連発で分けた一撃ずつにも）"),
  asIron: c("능력: 주먹 피해가 크게 오름 (공격력 +20%)", "Ability: much stronger punches (+20% damage)", "能力：拳のダメージが大きく上がる（攻撃力+20%）"),
  asReach: c("능력: 귀신 주먹이 {size}배 넓게 닿음 (각성 공격·파동도)", "Ability: spectral fists reach {size}x wider (awakened strikes and shockwaves too)", "能力：鬼神の拳が{size}倍広く届く（覚醒攻撃・波動も）"),
  asFury: c("능력: 맞힐 때마다 공격 속도 +{add:pct}% ({max}번까지 쌓임 · {keep:sec}초 안 맞히면 사라짐)", "Ability: each landed attack grants +{add:pct}% attack speed (stacks up to {max} · lost after {keep:sec}s without hitting)", "能力：当てるたびに攻撃速度+{add:pct}%（{max}回まで重なる・{keep:sec}秒当てないと消える）"),
  asGate: c("능력: 아수라 각성이 {ticks:sec}초 이어짐", "Ability: Asura awakening lasts {ticks:sec}s", "能力：阿修羅覚醒が{ticks:sec}秒続く"),
  asSix: c("능력: 아수라 각성 확률이 {chance:pct}%로 오름", "Ability: Asura awakening chance rises to {chance:pct}%", "能力：阿修羅覚醒の確率が{chance:pct}%に上がる"),
  asWeight: c("능력: 각성 4타 기절이 {stun:sec}초로 길어지고 {size}배 넓게 내리침", "Ability: awakened strike 4 stuns for {stun:sec}s and slams {size}x wider", "能力：覚醒4打の気絶が{stun:sec}秒に伸び、{size}倍広く叩きつける"),
  asPress: c("능력: 파동 피해 {mul}배 · 파동에 맞은 적이 밀려남", "Ability: shockwave damage x{mul} · shockwaves knock foes back", "能力：波動ダメージ{mul}倍・波動に当たった敵が押し出される"),
  asHell: c("능력: 악귀가 터진 적이 불탐", "Ability: foes hit by Fiend bursts catch fire", "能力：悪鬼が弾けた敵が燃える"),
  asRage: c("능력: 귀신 팔과 효과가 붉게 변함 · 때릴 때마다 체력 {cost}을 내줌 (체력 {floor}부터는 안 깎임) · 체력이 {below:pct}% 아래면 아수라의 피해 {mul}배", "Ability: spectral arms and effects turn red · each attack costs {cost} HP (stops at {floor} HP) · below {below:pct}% HP, Asura deals x{mul} damage", "能力：鬼神の腕とエフェクトが赤く変わる・攻撃するたびに体力{cost}を払う（体力{floor}からは減らない）・体力が{below:pct}%未満なら阿修羅のダメージ{mul}倍"),
  asShell: c("능력: 받는 피해 ×{taken}", "Ability: damage taken x{taken}", "能力：受けるダメージ×{taken}"),
  asBarrage: c("능력: 연발 확률이 {chance:pct}%로 오르고 {hits}번 때림", "Ability: Flurry chance rises to {chance:pct}% and hits {hits} times", "能力：連発の確率が{chance:pct}%に上がり{hits}回打つ"),
  asFlying: c("새 기술: 공격마다 귀신 주먹 하나가 가까운 적(거리 {dist} 안)에게 날아가 공격력의 {mul:pct}%", "New skill: each attack sends a spectral fist flying at the nearest foe (within {dist}) for {mul:pct}% of damage", "新技：攻撃ごとに鬼神の拳ひとつが近くの敵（距離{dist}以内）へ飛んで攻撃力の{mul:pct}%"),
  asSoul: c("능력: 적을 처치하면 {chance:pct}% 확률로 체력 {heal} 회복", "Ability: kills have a {chance:pct}% chance to heal {heal} HP", "能力：敵を倒すと{chance:pct}%の確率で体力{heal}回復"),
  asStep: c("능력: 대시가 끝난 뒤 다음 주먹이 {size}배 넓게 닿음", "Ability: after a dash, your next punch reaches {size}x wider", "能力：ダッシュの後、次の拳が{size}倍広く届く"),
};
