// 실베르 백인장 글자 (한·영·일): 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsBaekinjang·BJ_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type BjPassive = "bjFlurry" | "bjSpin" | "bjDash" | "bjRain" | "bjNeedle" | "bjSpear" | "bjShock" | "bjEye" | "bjPrison" | "bjReaper" | "bjEnd"
  | "bjFleet" | "bjHeat" | "bjStain" | "bjShare" | "bjChain" | "bjWane" | "bjOverload" | "bjPact" | "bjSteel";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const BJ_WEAPON_NAMES: Record<"bjBlades" & WeaponId, Names> = {
  bjBlades: c("혈월 쌍검", "Blood Moon Twin Blades", "血月の双剣"),
};

export const BJ_PASSIVE_NAMES: Record<BjPassive & PassiveId, Names> = {
  bjFlurry: c("적색 난무", "Crimson Flurry", "赤色乱舞"),
  bjSpin: c("선혈 회전참", "Bloodspin Slash", "鮮血回転斬"),
  bjDash: c("섬광 돌진베기", "Flash Rush Slash", "閃光突進斬り"),
  bjRain: c("붉은 날개 폭우", "Red Wing Downpour", "赤い翼の豪雨"),
  bjNeedle: c("추적 침격", "Seeker Needles", "追跡針撃"),
  bjSpear: c("관통 나선창", "Piercing Spiral Lance", "貫通螺旋槍"),
  bjShock: c("기계익 충격파", "Mech Wing Shockwave", "機械翼衝撃波"),
  bjEye: c("적안 표식", "Red Eye Mark", "赤眼の刻印"),
  bjPrison: c("혈철 감옥", "Blood Iron Prison", "血鉄の牢獄"),
  bjReaper: c("사신의 팔연참", "Reaper's Eightfold Slash", "死神の八連斬"),
  bjEnd: c("종언의 붉은 날개", "Red Wings of the End", "終焉の赤い翼"),
  bjFleet: c("편대 증설", "Expanded Squadron", "編隊増設"),
  bjHeat: c("과열 드릴", "Overheated Drills", "過熱ドリル"),
  bjStain: c("혈흔", "Bloodstain", "血痕"),
  bjShare: c("표적 공유", "Shared Target", "標的共有"),
  bjChain: c("연환", "Unbroken Chain", "連環"),
  bjWane: c("잔월", "Waning Moon", "残月"),
  bjOverload: c("날개 과부하", "Wing Overload", "翼の過負荷"),
  bjPact: c("사신의 계약", "Reaper's Pact", "死神の契約"),
  bjSteel: c("강철 날개", "Steel Wings", "鋼鉄の翼"),
};

export const BJ_EFFECTS: Partial<Record<BjPassive & PassiveId, Names>> = {
  bjFlurry: c("콤보 2단: 기본 공격 다음 클릭 · 붉은 칼날이 좌우로 이어지고 한꺼번에 터짐 ({hits}타 · 한 번에 공격력의 {mul:pct}%)", "Combo step 2: the click after a basic attack · red blades sweep left and right, then burst together ({hits} hits · {mul:pct}% of damage each)", "コンボ2段：通常攻撃の次のクリック・赤い刃が左右に続き一斉に弾ける（{hits}打・1回に攻撃力の{mul:pct}%）"),
  bjSpin: c("콤보 3단: 그다음 클릭 · 몸을 돌려 둘레(반지름 {r})를 붉은 원형 칼날로 크게 벰 ({hits}타 · 한 번에 공격력의 {mul:pct}%)", "Combo step 3: the next click · spin and carve a thick red ring around you (radius {r} · {hits} hits · {mul:pct}% of damage each)", "コンボ3段：その次のクリック・回転して周り（半径{r}）を赤い円形の刃で大きく斬る（{hits}打・1回に攻撃力の{mul:pct}%）"),
  bjDash: c("콤보 4단: 그다음 클릭 · 앞으로 길게 돌진하며 지나간 줄의 적을 크게 한 번 벰 (공격력의 {mul:pct}% · 돌진 중 무적)", "Combo step 4: the next click · rush far ahead and land one heavy slash on every foe along the path ({mul:pct}% of damage · invulnerable while rushing)", "コンボ4段：その次のクリック・前へ長く突進し通った線上の敵を大きく1回斬る（攻撃力の{mul:pct}%・突進中は無敵）"),
  bjRain: c("새 기술: 공격마다 {chance:pct}% 확률로 날개에서 붉은 칼날 수십 개가 앞으로 쏟아짐 ({hits}타 · 한 번에 공격력의 {mul:pct}%)", "New skill: each attack has a {chance:pct}% chance to pour dozens of red blades from your wings ahead ({hits} hits · {mul:pct}% of damage each)", "新技：攻撃ごとに{chance:pct}%の確率で翼から赤い刃が数十本前へ降り注ぐ（{hits}打・1回に攻撃力の{mul:pct}%）"),
  bjNeedle: c("새 기술: 공격마다 {chance:pct}% 확률로 드릴이 한 적에게 잇달아 꽂힘 ({hits}타 · 한 번에 공격력의 {mul:pct}% · 쓰러지면 다음 적으로)", "New skill: each attack has a {chance:pct}% chance to fire drills one after another into a single foe ({hits} hits · {mul:pct}% of damage each · moves on if it falls)", "新技：攻撃ごとに{chance:pct}%の確率でドリルが1体の敵に次々と刺さる（{hits}打・1回に攻撃力の{mul:pct}%・倒れたら次の敵へ）"),
  bjSpear: c("새 기술: 공격마다 {chance:pct}% 확률로 드릴들이 거대한 나선 창으로 합쳐져 곧게 꿰뚫음 (길이 {len} · 공격력의 {mul:pct}%)", "New skill: each attack has a {chance:pct}% chance to merge the drills into a giant spiral lance that pierces straight ahead (length {len} · {mul:pct}% of damage)", "新技：攻撃ごとに{chance:pct}%の確率でドリルが巨大な螺旋槍に合わさりまっすぐ貫く（長さ{len}・攻撃力の{mul:pct}%）"),
  bjShock: c("새 기술: 공격마다 {chance:pct}% 확률로 날개 네 장을 펼쳐 몸 둘레 넓게 충격파 (반지름 {r} · 공격력의 {mul:pct}%)", "New skill: each attack has a {chance:pct}% chance to spread all four wings in a wide shockwave around you (radius {r} · {mul:pct}% of damage)", "新技：攻撃ごとに{chance:pct}%の確率で翼4枚を広げ体の周りに広く衝撃波（半径{r}・攻撃力の{mul:pct}%）"),
  bjEye: c("스킬 개방 (1번): 가까운 적에게 침을 꽂고 표식 {ticks:sec}초 (공격력의 {mul:pct}%) · 표식 붙은 적은 받는 피해 +{taken:pct}% · 치명타로 맞을 확률 +{crit:pct}% · 대기 {cd:sec}초", "Unlocks skill 1: spike the nearest foe and mark it for {ticks:sec}s ({mul:pct}% of damage) · marked foes take +{taken:pct}% damage and are +{crit:pct}% more likely to be crit · {cd:sec}s cooldown", "スキル解放（1番）：近くの敵に針を刺し{ticks:sec}秒刻印（攻撃力の{mul:pct}%）・刻印された敵は被ダメージ+{taken:pct}%・会心を受ける確率+{crit:pct}%・待機{cd:sec}秒"),
  bjPrison: c("스킬 개방 (2번): 칼날 감옥에 가둬 못 움직이게 하고 계속 벰 ({hits}번 · 한 번에 공격력의 {mul:pct}%) · 보스는 갇히지 않는 대신 뚫고 나오며 공격력의 {bossMul:pct}% 피해와 출혈 {bleed:sec}초 · 대기 {cd:sec}초", "Unlocks skill 2: lock foes in a blade prison, unable to move, and keep cutting ({hits} hits · {mul:pct}% of damage each) · bosses cannot be held: they break out, taking {bossMul:pct}% of damage and bleeding for {bleed:sec}s · {cd:sec}s cooldown", "スキル解放（2番）：刃の牢獄に閉じ込めて動けなくし斬り続ける（{hits}回・1回に攻撃力の{mul:pct}%）・ボスは閉じ込められない代わりに突き破って攻撃力の{bossMul:pct}%ダメージと出血{bleed:sec}秒・待機{cd:sec}秒"),
  bjReaper: c("스킬 개방 (3번): 여덟 방향에서 {hits}번 베고 (한 번에 {mul:pct}%) 별 모양으로 터짐 (공격력의 {star:pct}%) · 죽음 상태이상 {death:sec}초: 1초마다 최대 체력의 {pct:pct}% (보스는 절반) · 대기 {cd:sec}초", "Unlocks skill 3: {hits} slashes from eight directions ({mul:pct}% each), then a star-shaped burst ({star:pct}% of damage) · Death for {death:sec}s: {pct:pct}% of max HP every second (halved on bosses) · {cd:sec}s cooldown", "スキル解放（3番）：八方から{hits}回斬り（1回{mul:pct}%）星形に弾ける（攻撃力の{star:pct}%）・死の状態異常{death:sec}秒：1秒ごとに最大体力の{pct:pct}%（ボスは半分）・待機{cd:sec}秒"),
  bjEnd: c("스킬 개방 (4번 · 궁극기): 날개에서 미니 드론 {hits}기가 붉은 레이저 선을 남기며 {hits}번 찌름 (한 번에 공격력의 {mul:pct}%) · 끝에 맞고도 살아남은 적에게 붉은 십자와 함께 쌓인 피해를 그대로 한 번 더 · 대기 {cd:sec}초", "Unlocks skill 4 (ultimate): {hits} mini drones burst from your wings, trailing red lasers, and stab {hits} times ({mul:pct}% of damage each) · at the end, every foe that was hit and still lives is struck by a red cross for all the damage it took, once more · {cd:sec}s cooldown", "スキル解放（4番・究極技）：翼からミニドローン{hits}機が赤いレーザーの線を残して{hits}回刺す（1回に攻撃力の{mul:pct}%）・最後に、当たっても生き残った敵へ赤い十字とともに蓄積ダメージをそのままもう一度・待機{cd:sec}秒"),
  bjFleet: c("능력: 미니 창 드론이 {n}기로 늘어남", "Ability: the mini lance drones grow to {n}", "能力：ミニ槍ドローンが{n}機に増える"),
  bjHeat: c("능력: 드론이 한 번에 공격력의 {mul:pct}%로 더 세게, {cd:sec}초마다 더 자주 찌름", "Ability: drones stab harder ({mul:pct}% of damage each) and more often (every {cd:sec}s)", "能力：ドローンが1回に攻撃力の{mul:pct}%でより強く、{cd:sec}秒ごとにより頻繁に刺す"),
  bjStain: c("능력: 드론에 찔린 적은 출혈 {ticks:sec}초 (0.5초마다 공격력의 {mul:pct}%)", "Ability: foes stabbed by a drone bleed for {ticks:sec}s ({mul:pct}% of damage every 0.5s)", "能力：ドローンに刺された敵は出血{ticks:sec}秒（0.5秒ごとに攻撃力の{mul:pct}%）"),
  bjShare: c("능력: 적안 표식이 붙은 적을 드론 전부가 먼저 노리고, 그 적에게는 드론 피해 {mul}배 (스킬 '적안 표식'이 있어야 함)", "Ability: every drone targets a Red Eye-marked foe first and deals {mul}x drone damage to it (needs the Red Eye Mark skill)", "能力：赤眼の刻印がついた敵をドローン全機が優先して狙い、その敵にはドローンのダメージ{mul}倍（スキル「赤眼の刻印」が必要）"),
  bjChain: c("능력: 섬광 돌진베기까지 콤보를 끝내면 {ticks:sec}초 동안 공격 속도 {speed:up}% 증가", "Ability: finishing the combo with Flash Rush Slash raises attack speed by {speed:up}% for {ticks:sec}s", "能力：閃光突進斬りまでコンボを決めると{ticks:sec}秒間攻撃速度{speed:up}%増加"),
  bjWane: c("새 기술: 기본 공격의 검격이 앞으로 날아가 줄 위의 적을 한 번 더 벰 (거리 {len} · 공격력의 {mul:pct}%)", "New skill: the basic attack's slash flies ahead and cuts every foe along the line once more (distance {len} · {mul:pct}% of damage)", "新技：通常攻撃の斬撃が前へ飛び線上の敵をもう一度斬る（距離{len}・攻撃力の{mul:pct}%）"),
  bjOverload: c("능력: 확률 원거리 기술 4종(폭우·침격·나선창·충격파)의 발동 확률 +{add:pct}%p", "Ability: +{add:pct}%p chance for all four chance-based ranged skills (Downpour, Needles, Lance, Shockwave)", "能力：確率発動の遠距離技4種（豪雨・針撃・螺旋槍・衝撃波）の発動確率+{add:pct}%p"),
  bjPact: c("능력: 표식·출혈·죽음이 걸린 적을 처치하면 체력 {heal} 회복 · 모든 스킬 대기 {cut:sec}초 감소", "Ability: killing a foe that is marked, bleeding or under Death heals {heal} HP and cuts all skill cooldowns by {cut:sec}s", "能力：刻印・出血・死がかかった敵を倒すと体力{heal}回復・全スキルの待機{cut:sec}秒減少"),
  bjSteel: c("능력: 받는 피해 {taken:down}% 감소 · 섬광 돌진베기가 끝난 뒤 {invuln:sec}초 더 무적", "Ability: take {taken:down}% less damage · stay invulnerable {invuln:sec}s longer after Flash Rush Slash", "能力：被ダメージ{taken:down}%減少・閃光突進斬りの後{invuln:sec}秒さらに無敵"),
};
