// 이무기 글자 (한·영·일): 무기 이름 · 추가 공격 설명 · 전용 아이템 이름·효과 (수치는 weaponsImugi·IMUGI_PERKS와 맞춤)
import type { DragonArt, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type ImugiWeapon = "imugiSpear" | "azureDragon" | "crimsonDragon" | "galeDragon" | "earthDragon" | "holyDragon" | "shadowDragon" | "silverDragon" | "venomDragon" | "skyDragon" | "dragonPearl";
type ImugiPassive = "dragonEye" | "ascension" | "scaleArmor" | "dragonRage" | "cloudRide" | "scaleGuard" | "thunderCry" | "longBreath" | "lingering" | "dragonLance" | "dragonBlood";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const IMUGI_WEAPON_NAMES: Record<ImugiWeapon & WeaponId, Names> = {
  imugiSpear: c("이무기의 창", "Imugi Spear", "イムギの槍"),
  azureDragon: c("청룡", "Azure Dragon", "青龍"),
  crimsonDragon: c("적룡", "Crimson Dragon", "赤龍"),
  galeDragon: c("풍룡", "Gale Dragon", "風龍"),
  earthDragon: c("토룡", "Earth Dragon", "土龍"),
  holyDragon: c("성룡", "Holy Dragon", "聖龍"),
  shadowDragon: c("암룡", "Shadow Dragon", "暗龍"),
  silverDragon: c("은룡", "Silver Dragon", "銀龍"),
  venomDragon: c("사룡", "Venom Dragon", "蛇龍"),
  skyDragon: c("천룡", "Sky Dragon", "天龍"),
  dragonPearl: c("여의주", "Dragon Pearl", "如意宝珠"),
};

/** 무기 설명: 찌르기 + 휘두르기에 더해지는 추가 공격 */
export const DRAGON_DESC: Record<DragonArt, Names> = {
  plain: c("찌르기와 휘두르기를 한 번에 · 맞히면 콤보 (72 오라 · 108 용이 됨: 용이 맵을 지나가며 공격력 450% + 적 최대 체력 20%(보스 1/5), 8초 동안 더 강한 몸 · 부를 때마다 영구 치명타 +15%, 최대 72%)", "Thrust and swing at once · Hits build combo (72 aura · 108 become the dragon: a dragon sweeps the map for 450% damage + 20% of the foe's max HP (1/5 for bosses) and your body is empowered for 8s · each dragon permanently adds +15% crit chance, up to 72%)", "突きと薙ぎを同時に · 当てるとコンボ（72 オーラ · 108 龍になる：龍がマップを通り抜け攻撃力450% + 敵の最大体力20%（ボスは1/5）、8秒間さらに強い体 · 呼ぶたびに永久にクリティカル率+15%、最大72%）"),
  azure: c("푸른 찌르기·휘두르기 · 맞은 적 위로 번개 5번 (한 번에 공격력 10%)", "Blue thrust and swing · 5 lightning strikes on each hit foe (10% damage each)", "青い突きと薙ぎ · 当たった敵に雷5回（1回攻撃力10%）"),
  crimson: c("붉은 찌르기·휘두르기 · 맞은 적 자리에서 붉은 폭발 (공격력 30%)", "Red thrust and swing · A red explosion on each hit foe (30% damage)", "赤い突きと薙ぎ · 当たった敵の場所で赤い爆発（攻撃力30%）"),
  gale: c("하늘색 찌르기·휘두르기 · 맞은 적에게 3초 폭풍 (0.1초마다 공격력 2%)", "Sky-blue thrust and swing · A 3s storm on each hit foe (2% damage every 0.1s)", "空色の突きと薙ぎ · 当たった敵に3秒の嵐（0.1秒ごとに攻撃力2%）"),
  earth: c("갈색 찌르기·휘두르기 · 맞은 적은 움직임·공격이 느려짐 · 맞힐 때마다 보호막 (공격력 5%, 최대 10) · 토룡 보호막의 50%만큼 공격력 +", "Brown thrust and swing · Hit foes move and attack slower · Each hit gives a shield (5% damage, up to 10) · +damage equal to 50% of that shield", "茶色の突きと薙ぎ · 当たった敵は移動・攻撃が遅くなる · 当てるたびにシールド（攻撃力5%、最大10）· 土龍シールドの50%だけ攻撃力+"),
  holy: c("노란 찌르기·휘두르기 · 맞은 적에게서 크게 빛이 터지며 멀리 밀어냄 (공격력 20%)", "Yellow thrust and swing · A wide burst of light on each hit foe, knocking foes far (20% damage)", "黄色の突きと薙ぎ · 当たった敵から大きく光が弾けて遠くへ押し出す（攻撃力20%）"),
  shadow: c("보라 찌르기·휘두르기 · 맞은 적 밑에서 어둠 늑대가 깨묾 (공격력 10% → 20% → 30% → 45% 차례로)", "Purple thrust and swing · A shadow wolf bites from below (10% → 20% → 30% → 45% damage in turn)", "紫の突きと薙ぎ · 当たった敵の下から闇の狼が噛む（攻撃力10% → 20% → 30% → 45%の順）"),
  silver: c("흰 찌르기·휘두르기 · 맞은 적에게서 은빛 파편 8개가 터져 둘레 적을 벰 (하나에 공격력 15%)", "White thrust and swing · 8 silver shards burst from each hit foe, cutting those nearby (15% damage each)", "白い突きと薙ぎ · 当たった敵から銀の破片8つが弾けて周りの敵を斬る（1つ攻撃力15%）"),
  venom: c("초록 찌르기·휘두르기 · 맞은 적이 중독 (1초마다 최대 체력의 2% × 겹친 수, 최대 5겹 · 보스는 최대 체력의 1/5 기준)", "Green thrust and swing · Hit foes are poisoned (2% of max HP × stacks per second, up to 5 stacks · bosses use 1/5 of max HP)", "緑の突きと薙ぎ · 当たった敵が中毒（1秒ごとに最大体力の2% × 重ねた数、最大5重 · ボスは最大体力の1/5基準）"),
  sky: c("짙은 파랑 찌르기·휘두르기 · 30% 확률로 맞은 적 위에 넓게 하늘이 떨어짐 (공격력 100%)", "Deep blue thrust and swing · 30% chance the sky falls over a wide area on a hit foe (100% damage)", "濃い青の突きと薙ぎ · 30%の確率で当たった敵の上に広く空が落ちる（攻撃力100%）"),
  pearl: c("방 안 모든 적에게 번개 (빠르게, 공격력 30%) · 콤보에 세지 않음", "Lightning on every foe in the room (fast, 30% damage) · Does not build combo", "部屋の全ての敵に雷（速く、攻撃力30%）· コンボに数えない"),
};

export const IMUGI_PASSIVE_NAMES: Record<ImugiPassive & PassiveId, Names> = {
  ascension: c("승천", "Ascension", "昇天"),
  scaleArmor: c("용린갑", "Dragonscale Armor", "龍鱗の鎧"),
  dragonRage: c("용의 분노", "Dragon's Rage", "龍の怒り"),
  cloudRide: c("운룡", "Cloud Rider", "雲龍"),
  scaleGuard: c("비늘 방패", "Scale Guard", "鱗の盾"),
  thunderCry: c("천둥 울음", "Thunder Roar", "雷鳴の咆哮"),
  longBreath: c("쌍룡", "Twin Dragons", "双龍"),
  lingering: c("여운", "Lingering Echo", "余韻"),
  dragonLance: c("용창", "Dragon Lance", "龍槍"),
  dragonBlood: c("용혈", "Dragon Blood", "龍血"),
  dragonEye: c("화룡점정", "The Dragon's Eye", "画竜点睛"),
};

export const IMUGI_EFFECTS: Partial<Record<ImugiPassive & PassiveId, Names>> = {
  dragonEye: c(
    "콤보를 버리고 이무기로서 완벽해짐 (여의주를 물고 있어야 합니다!) · 내리치는 번개 공격 속도 +{speed:up}% · 번개마다 적 최대 체력의 {hp:pct}% 더 (보스는 최대 체력의 1/5 기준)",
    "Cast aside the combo and become a perfect Imugi (you must hold the Dragon Pearl!) · +{speed:up}% lightning attack speed · Each bolt also deals {hp:pct}% of the foe's max HP (bosses use 1/5 of max HP)",
    "コンボを捨てイムギとして完璧になる（如意宝珠をくわえていなければなりません！）· 落ちる雷の攻撃速度+{speed:up}% · 雷ごとに敵の最大体力の{hp:pct}%追加（ボスは最大体力の1/5基準）",
  ),
  ascension: c("콤보가 1.5배 빨리 쌓임 (두 번 맞힐 때마다 1 더)", "Combo builds 1.5x faster (+1 every second hit)", "コンボが1.5倍速くたまる（2回当てるごとに1多く）"),
  scaleArmor: c("최대 체력 +20 · 받는 피해 -{taken:down}%", "+20 max HP · Take {taken:down}% less damage", "最大体力+20 · 受けるダメージ-{taken:down}%"),
  dragonRage: c("오라(콤보 72 이상)·용이 된 동안 공격력 +{damage:up}% 더", "+{damage:up}% more damage while the aura (combo 72+) or dragon form is up", "オーラ（コンボ72以上）・龍になっている間、攻撃力さらに+{damage:up}%"),
  cloudRide: c("대시하면 콤보 +{combo}", "Dashing adds {combo} combo", "ダッシュするとコンボ+{combo}"),
  scaleGuard: c("콤보 {every}마다 보호막 {shield} (이 아이템으로는 최대 {max})", "Every {every} combo gives a {shield} shield (up to {max} from this item)", "コンボ{every}ごとにシールド{shield}（このアイテムでは最大{max}）"),
  thunderCry: c("콤보 108의 용이 지나갈 때 피해 +{damage:up}%", "+{damage:up}% damage when the combo-108 dragon passes", "コンボ108の龍が通り過ぎる時のダメージ+{damage:up}%"),
  longBreath: c("콤보 108의 용이 한 번 더 지나감 (두 번째는 피해 {second:pct}%)", "The combo-108 dragon passes a second time ({second:pct}% damage)", "コンボ108の龍がもう一度通り過ぎる（2回目はダメージ{second:pct}%）"),
  lingering: c("용을 부른 뒤 콤보가 20이 아니라 {restart}에서 다시 시작", "After the dragon, combo restarts at {restart} instead of 20", "龍を呼んだ後、コンボが20ではなく{restart}から再開"),
  dragonLance: c("찌르기 길이 +{thrust:up}%, 휘두르기 범위 +{swing:up}%", "Thrust length +{thrust:up}%, swing reach +{swing:up}%", "突きの長さ+{thrust:up}%、薙ぎの範囲+{swing:up}%"),
  dragonBlood: c("오라·용이 된 동안 1초마다 체력 {heal} 회복", "Heal {heal} HP every second while the aura or dragon form is up", "オーラ・龍になっている間、1秒ごとに体力{heal}回復"),
};
