// 실베르 기어스 글자 (한·영·일): 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsGears·GE_PERKS와 맞춤) — items/gears.ts(기계공학자)와 다른 파일
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type GePassive =
  | "geMirror" | "geDome" | "geQuake" | "geWave" | "geHex" | "geThrow" | "geTwin" | "geBarrage" | "geGuardian" | "geStorm"
  | "geArmor" | "geRebound" | "geMomentum" | "geCounter" | "geFortress" | "geEcho" | "geCrystal" | "geOrbit" | "geResolve" | "geHeavy";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const GE_WEAPON_NAMES: Record<"geShields" & WeaponId, Names> = {
  geShields: c("은빛 쌍방패", "Silver Twin Shields", "銀の双盾"),
};

export const GE_PASSIVE_NAMES: Record<GePassive & PassiveId, Names> = {
  geMirror: c("거울 반격", "Mirror Counter", "鏡の反撃"),
  geDome: c("마법 보호막 돔", "Magic Barrier Dome", "魔法障壁ドーム"),
  geQuake: c("대지 분쇄", "Earth Shatter", "大地粉砕"),
  geWave: c("마법 방패 충격파", "Magic Shield Shockwave", "魔法盾の衝撃波"),
  geHex: c("푸른 육각 방벽", "Azure Hex Bulwark", "青き六角防壁"),
  geThrow: c("방패 던지기", "Shield Throw", "盾投げ"),
  geTwin: c("쌍성 방패", "Twin Star Shields", "双星の盾"),
  geBarrage: c("연속 방패타", "Shield Barrage", "連続盾打"),
  geGuardian: c("천상의 수호자", "Celestial Guardian", "天上の守護者"),
  geStorm: c("청뢰 방패 폭풍", "Azure Thunder Shield Storm", "青雷盾嵐"),
  geArmor: c("은빛 갑주", "Silver Plate", "銀の甲冑"),
  geRebound: c("반동 장갑", "Rebound Plating", "反動装甲"),
  geMomentum: c("가속 구체", "Accelerating Orb", "加速球体"),
  geCounter: c("반격 태세", "Counter Stance", "反撃態勢"),
  geFortress: c("철옹성", "Iron Fortress", "鉄壁の城"),
  geEcho: c("메아리 방패", "Echo Shield", "残響の盾"),
  geCrystal: c("육각 결정", "Hex Crystal", "六角結晶"),
  geOrbit: c("위성 방패", "Satellite Shields", "衛星の盾"),
  geResolve: c("불굴", "Indomitable", "不屈"),
  geHeavy: c("중갑 돌진", "Heavy Charge", "重甲突進"),
};

export const GE_EFFECTS: Partial<Record<GePassive & PassiveId, Names>> = {
  geMirror: c("새 기술: 맞으면 {chance:pct}% 확률로 방패가 거울처럼 빛나 가까운 적(거리 {dist} 안)에게 공격력의 {mul:pct}% 반격", "New skill: when hit, {chance:pct}% chance your shield flares like a mirror and strikes back at the nearest foe (within {dist}) for {mul:pct}% damage", "新技：被弾時{chance:pct}%の確率で盾が鏡のように輝き、近くの敵（距離{dist}以内）に攻撃力の{mul:pct}%で反撃"),
  geDome: c("새 기술: 맞으면 {chance:pct}% 확률로 몸 둘레에 마법 보호막 돔 · {ticks:sec}초 동안 공격을 모두 막음", "New skill: when hit, {chance:pct}% chance to raise a magic barrier dome · blocks every attack for {ticks:sec}s", "新技：被弾時{chance:pct}%の確率で魔法障壁ドームを展開・{ticks:sec}秒間すべての攻撃を防ぐ"),
  geQuake: c("새 기술: 공격마다 {chance:pct}% 확률로 두 방패로 땅을 내리쳐 앞 둘레(반지름 {r})를 {hits}번 흔듦 (한 번에 공격력의 {mul:pct}% · 잠깐 기절)", "New skill: each attack has a {chance:pct}% chance to smash the ground with both shields, shaking the area ahead (radius {r}) {hits} times ({mul:pct}% damage each · brief stun)", "新技：攻撃ごとに{chance:pct}%の確率で2枚の盾で地面を叩き、前方（半径{r}）を{hits}回揺らす（1回で攻撃力の{mul:pct}%・短い気絶）"),
  geWave: c("새 기술: 구체로 굴러가는 동안 앞에 방패 충격파가 달려 있음 · 앞에 적이 다가오면 부채꼴 충격파 (공격력의 {mul:pct}% · 밀쳐 냄)", "New skill: while rolling as an orb, a shield shockwave rides in front · when a foe comes close ahead, it bursts in a fan ({mul:pct}% damage · knockback)", "新技：球体で転がる間、前に盾の衝撃波がつく・前に敵が近づくと扇形の衝撃波（攻撃力の{mul:pct}%・押し出す）"),
  geHex: c("새 기술: 맞으면 {chance:pct}% 확률로 푸른 육각 방벽 · 보호막 +{pts} (겹쳐 쌓이지 않음)", "New skill: when hit, {chance:pct}% chance to raise the azure hex bulwark · +{pts} shield (does not stack)", "新技：被弾時{chance:pct}%の確率で青き六角防壁・シールド+{pts}（重ならない）"),
  geThrow: c("새 기술: 공격마다 {chance:pct}% 확률로 방패를 앞으로 던짐 · 뚫고 지나가며 공격력의 {mul:pct}% · 끝에서 터짐 (반지름 {boomR} · {boomMul:pct}%)", "New skill: each attack has a {chance:pct}% chance to hurl a shield ahead · pierces for {mul:pct}% damage · bursts at the end (radius {boomR} · {boomMul:pct}%)", "新技：攻撃ごとに{chance:pct}%の確率で盾を前へ投げる・貫通して攻撃力の{mul:pct}%・最後に炸裂（半径{boomR}・{boomMul:pct}%）"),
  geTwin: c("능력: 기본 공격이 쌍성 방패로 바뀜 · {size}배 크게 · {hits}번 때림", "Ability: your basic attack becomes Twin Star Shields · {size}x larger · hits {hits} times", "能力：基本攻撃が双星の盾に変わる・{size}倍大きく・{hits}回ヒット"),
  geBarrage: c("새 기술: 기본 공격마다 {chance:pct}% 확률로 앞에 방패가 {hits}번 연달아 내리침 (한 번에 공격력의 {mul:pct}%)", "New skill: each basic attack has a {chance:pct}% chance for shields to slam ahead {hits} times in a row ({mul:pct}% damage each)", "新技：基本攻撃ごとに{chance:pct}%の確率で前方に盾が{hits}回連続で叩きつける（1回で攻撃力の{mul:pct}%）"),
  geGuardian: c("필살기: 공격마다 {chance:pct}% 확률로 {ticks:sec}초 동안 거대한 방패를 앞에 들고 느리게 걸음 · 방패에 부딪힌 적은 {hits}번 맞음 (한 번에 공격력의 {mul:pct}%)", "Ultimate: each attack has a {chance:pct}% chance to raise a giant shield ahead for {ticks:sec}s while walking slower · any foe that hits the shield takes {hits} hits ({mul:pct}% damage each)", "必殺技：攻撃ごとに{chance:pct}%の確率で{ticks:sec}秒間巨大な盾を前に構えてゆっくり歩く・盾にぶつかった敵は{hits}回ヒット（1回で攻撃力の{mul:pct}%）"),
  geStorm: c("필살기: 공격마다 {chance:pct}% 확률로 몸 둘레(반지름 {r})에 푸른 번개 방패 폭풍 · 안의 적은 {hits}번 맞음 (한 번에 공격력의 {mul:pct}%)", "Ultimate: each attack has a {chance:pct}% chance to unleash an azure thunder shield storm around you (radius {r}) · foes inside take {hits} hits ({mul:pct}% damage each)", "必殺技：攻撃ごとに{chance:pct}%の確率で周り（半径{r}）に青い雷の盾嵐・中の敵は{hits}回ヒット（1回で攻撃力の{mul:pct}%）"),
  geArmor: c("능력: 받는 피해 ×{taken}", "Ability: damage taken x{taken}", "能力：受けるダメージ×{taken}"),
  geRebound: c("새 기술: 구체가 벽에 튕길 때마다 둘레(반지름 {r})에 충격 · 공격력의 {mul:pct}%", "New skill: each time the orb bounces off a wall, it sends a shock around you (radius {r}) · {mul:pct}% damage", "新技：球体が壁で跳ね返るたびに周り（半径{r}）に衝撃・攻撃力の{mul:pct}%"),
  geMomentum: c("능력: 구체가 튕길 때마다 빠르기·부딪힘 피해 +{add:pct}% ({max}번까지 · 풀면 처음으로)", "Ability: each orb bounce adds +{add:pct}% speed and ram damage (up to {max} · resets when you return)", "能力：球体が跳ね返るたびに速さ・衝突ダメージ+{add:pct}%（{max}回まで・解除で元に戻る）"),
  geCounter: c("능력: 맞은 뒤 {ticks:sec}초 동안 공격 속도 ×{speed}", "Ability: attack speed x{speed} for {ticks:sec}s after being hit", "能力：被弾後{ticks:sec}秒間攻撃速度×{speed}"),
  geFortress: c("능력: 보호막이 있는 동안 주는 피해 ×{mul}", "Ability: deal x{mul} damage while you have a shield", "能力：シールドがある間、与えるダメージ×{mul}"),
  geEcho: c("새 기술: 기본 공격 자리에 {delay:sec}초 뒤 한 번 더 내리침 (그 한 대의 {mul:pct}%)", "New skill: {delay:sec}s after a basic attack, the shields strike the same spot again ({mul:pct}% of that hit)", "新技：基本攻撃の場所に{delay:sec}秒後もう一度叩きつける（その1撃の{mul:pct}%）"),
  geCrystal: c("새 기술: 보호막이 깨질 때 둘레(반지름 {r})에 푸른 결정이 터짐 · 공격력의 {mul:pct}%", "New skill: when your shield breaks, blue crystals burst around you (radius {r}) · {mul:pct}% damage", "新技：シールドが割れると周り（半径{r}）に青い結晶が弾ける・攻撃力の{mul:pct}%"),
  geOrbit: c("새 기술: 작은 방패 {n}개가 몸 둘레를 돌며 닿은 적을 때림 (공격력의 {mul:pct}% · 같은 적은 {again:sec}초마다)", "New skill: {n} small shields orbit you and strike foes they touch ({mul:pct}% damage · each foe every {again:sec}s)", "新技：小さな盾{n}枚が周りを回り、触れた敵を打つ（攻撃力の{mul:pct}%・同じ敵は{again:sec}秒ごと）"),
  geResolve: c("능력: 체력이 {below:pct}% 아래면 받는 피해 ×{taken}", "Ability: below {below:pct}% HP, damage taken x{taken}", "能力：体力{below:pct}%未満で受けるダメージ×{taken}"),
  geHeavy: c("능력: 구체로 받는 피해 ×{taken} (보통 0.7) · 부딪힘 피해 ×{mul}", "Ability: damage taken as an orb x{taken} (normally 0.7) · ram damage x{mul}", "能力：球体時の被ダメージ×{taken}（通常0.7）・衝突ダメージ×{mul}"),
};
