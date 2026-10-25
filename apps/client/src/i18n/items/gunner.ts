// 거너 글자 (한·영·일): 무기 이름 · 총 설명 · 전용 아이템 이름·효과 (수치는 weaponsGunner·sim/gun·gunExtras와 맞춤)
import type { GunStyle, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type GunWeapon = "pistol" | "sniper" | "shotgun" | "bayonet" | "dualpistol" | "mercenary" | "smg" | "minigun" | "grenade" | "drone";
type GunPassive = "gunMaster" | "discipline" | "focusFire" | "ration" | "allIn" | "elite" | "scrapGun" | "supportFire" | "bleed" | "rapidFire";

export const GUNNER_WEAPON_NAMES: Record<GunWeapon & WeaponId, Names> = {
  pistol: { ko: "권총", en: "Pistol", ja: "拳銃" },
  sniper: { ko: "스나이퍼", en: "Sniper Rifle", ja: "スナイパー" },
  shotgun: { ko: "샷건", en: "Shotgun", ja: "ショットガン" },
  bayonet: { ko: "총검", en: "Bayonet Gun", ja: "銃剣" },
  dualpistol: { ko: "쌍발총", en: "Dual Pistols", ja: "二丁拳銃" },
  mercenary: { ko: "특수용병", en: "Special Merc", ja: "特殊傭兵" },
  smg: { ko: "기관단총", en: "SMG", ja: "短機関銃" },
  minigun: { ko: "미니건", en: "Minigun", ja: "ミニガン" },
  grenade: { ko: "수류탄", en: "Grenades", ja: "手榴弾" },
  drone: { ko: "드론", en: "Drones", ja: "ドローン" },
};

export const GUN_DESC: Record<GunStyle, Names> = {
  pistol: { ko: "탄창 8발, 다 쓰면 1.2초 장전", en: "8-round magazine, 1.2s reload when empty", ja: "弾倉8発、撃ち切ると1.2秒リロード" },
  sniper: { ko: "탄창 4발, 아주 빠른 탄이 5명 관통 · 장전 2.5초", en: "4 rounds, very fast shots pierce 5 · 2.5s reload", ja: "弾倉4発、とても速い弾が5体貫通 · リロード2.5秒" },
  shotgun: { ko: "탄창 8발, 5발 부채꼴 · 장전 중에도 한 발씩 채우며 쏠 수 있음", en: "8 shells, 5-pellet spread · Reloads one shell at a time and can fire while reloading", ja: "弾倉8発、5発の扇状 · リロード中も1発ずつ込めながら撃てる" },
  bayonet: { ko: "탄창 8발, 쏠 때마다 앞을 찌름 · 대시하면 둘레에 피해", en: "8 rounds, stabs in front with every shot · Dashing damages around you", ja: "弾倉8発、撃つたびに前を突く · ダッシュで周りにダメージ" },
  dual: { ko: "권총 두 자루로 두 발씩, 탄창 16발", en: "Two pistols fire two shots at once, 16-round magazine", ja: "拳銃2丁で2発ずつ、弾倉16発" },
  merc: {
    ko: "4단 콤보: 권총을 쏘며 돌진 → 앞 찌르기 → 샷건 반동으로 물러나기 → 수류탄 마무리 · 다음 콤보 직전 NOW!에 스페이스를 누르면 대시 대신 보호막 20 (1초), NOW!가 아닐 때 누르면 보호막이 사라짐",
    en: "4-step combo: dash firing the pistol → stab → shotgun blast and recoil back → finishing grenade · Press Space at NOW! right before the next step for a 20 shield instead of a dash (1s); pressing outside NOW! drops the shield",
    ja: "4段コンボ：拳銃を撃ちながら突進 → 突き → ショットガンの反動で下がる → 手榴弾でとどめ · 次のコンボ直前のNOW!でスペースを押すとダッシュの代わりにシールド20（1秒）、NOW!以外で押すとシールドが消える",
  },
  smg: { ko: "탄창 35발, 아주 빠르게 쏨 · 쏘는 동안 이동 속도 -35%", en: "35 rounds, very fast fire · Move 35% slower while firing", ja: "弾倉35発、とても速く撃つ · 撃っている間移動速度-35%" },
  minigun: { ko: "탄창 100발 · 누르고 2초 예열 뒤 쏨, 그동안 이동 속도 절반 · 장전 3초", en: "100 rounds · Spins up for 2s before firing, moving at half speed meanwhile · 3s reload", ja: "弾倉100発 · 押して2秒予熱してから撃つ、その間移動速度半分 · リロード3秒" },
  grenade: { ko: "던지면 0.5초 뒤 큰 폭발 (범위 40) · 공격 속도 느림", en: "Explodes 0.5s after landing (radius 40) · Slow attacks", ja: "投げて0.5秒後に大爆発（範囲40） · 攻撃速度が遅い" },
  drone: {
    ko: "직접 쏘지 않고 드론이 쏨 · 1대로 시작해 10마리 처치마다 +1 (최대 5대) · 한 발 피해는 드론 1대일 때 공격력의 2/8, 1대 늘 때마다 +1/8",
    en: "You don't fire; drones do · Start with 1, +1 per 10 kills (up to 5) · Each shot deals 2/8 of your damage with 1 drone, +1/8 per extra drone",
    ja: "自分は撃たずドローンが撃つ · 1機から始まり10体倒すごとに+1（最大5機） · 1発のダメージはドローン1機で攻撃力の2/8、1機増えるごとに+1/8",
  },
};

export const GUNNER_PASSIVE_NAMES: Record<GunPassive & PassiveId, Names> = {
  gunMaster: { ko: "건 마스터", en: "Gun Master", ja: "ガンマスター" },
  discipline: { ko: "군기", en: "Discipline", ja: "軍紀" },
  focusFire: { ko: "화력 집중", en: "Focused Fire", ja: "火力集中" },
  ration: { ko: "전투식량", en: "Field Ration", ja: "戦闘糧食" },
  allIn: { ko: "총 공격", en: "All-Out Attack", ja: "総攻撃" },
  elite: { ko: "특급", en: "Elite", ja: "特級" },
  scrapGun: { ko: "폐급?", en: "Scrap Gun?", ja: "ポンコツ？" },
  supportFire: { ko: "지원사격", en: "Support Fire", ja: "支援射撃" },
  bleed: { ko: "출혈", en: "Bleed", ja: "出血" },
  rapidFire: { ko: "연발", en: "Rapid Fire", ja: "連射" },
};

export const GUNNER_EFFECTS: Record<GunPassive & PassiveId, Names> = {
  gunMaster: { ko: "이번 판에 가져 본 다른 총이 쏠 때마다 30% 확률로 옆에 나타나 한 번 쏘고 사라짐", en: "30% chance per shot for another gun you've held this run to appear beside you, fire once and vanish", ja: "撃つたびに30%の確率で、この回に持ったことのある別の銃が横に現れて一度撃って消える" },
  discipline: { ko: "이동 속도 +0.2", en: "Move speed +0.2", ja: "移動速度+0.2" },
  focusFire: { ko: "치명타 확률 +30%, 치명타 피해 +20% (기본 5%, 1.5배)", en: "Crit chance +30%, crit damage +20% (base 5%, 1.5x)", ja: "クリティカル率+30%、クリティカルダメージ+20%（基本5%、1.5倍）" },
  ration: { ko: "방을 정리하면 최대 체력의 10% 회복", en: "Heal 10% of max health after clearing a room", ja: "部屋を片付けると最大体力の10%回復" },
  allIn: { ko: "공격력 +5, 이동 속도 +0.1", en: "Damage +5, move speed +0.1", ja: "攻撃力+5、移動速度+0.1" },
  elite: { ko: "공격력 +2, 이동 속도 +0.1, 장전 10% 빠르게, 치명타 확률 +20%", en: "Damage +2, move speed +0.1, 10% faster reload, crit chance +20%", ja: "攻撃力+2、移動速度+0.1、リロード10%速く、クリティカル率+20%" },
  scrapGun: { ko: "가끔(쏠 때마다 2%) 총이 고장 나 3초 못 쏨, 대신 모든 탄이 치명타", en: "Sometimes (2% per shot) the gun jams for 3s, but every shot is a crit", ja: "たまに（撃つたび2%）銃が故障して3秒撃てない、代わりに全弾クリティカル" },
  supportFire: { ko: "쏠 때마다(드론 무기는 드론이 쏠 때마다) 30% 확률로 지원 드론이 3초 동안 같이 쏨 (최대 5대, 지원 드론 탄은 치명타 없음)", en: "30% chance per shot (per drone shot with the Drones weapon) for a support drone to fire alongside you for 3s (up to 5, support drone shots never crit)", ja: "撃つたびに（ドローン武器はドローンが撃つたびに）30%の確率で支援ドローンが3秒間一緒に撃つ（最大5機、支援ドローンの弾はクリティカルなし）" },
  bleed: { ko: "맞힌 적이 3초 동안 피를 흘림 (0.5초마다 적 최대 체력의 1%)", en: "Hit enemies bleed for 3s (1% of their max health every 0.5s)", ja: "当てた敵が3秒間出血（0.5秒ごとに敵の最大体力の1%）" },
  rapidFire: { ko: "공격 속도 +100%, 장전 2배 빠르게, 탄 빠르기 +50%", en: "Attack speed +100%, reload twice as fast, bullet speed +50%", ja: "攻撃速度+100%、リロード2倍速、弾速+50%" },
};
