// 차원의 순례자(히든) 글자 (한·영·일): 차원 수집품 무기 이름·설명(모양에서 만듦) · 전용 아이템 이름·효과 (수치는 weaponsPilgrim·PILGRIM_PERKS와 맞춤)
import type { CurioStyle, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type PgWeapon = "pgStaff" | "pgBlade" | "pgFlag" | "pgLantern" | "pgPan" | "pgMap" | "pgCompass" | "pgBoomerang" | "pgSling" | "pgUmbrella" | "pgBell" | "pgCrane" | "pgCrystal" | "pgClock" | "pgMeteor" | "pgSeed" | "pgMirror" | "pgHourglass" | "pgKey" | "pgGate";
type PgPassive = "pgPack" | "pgBoots" | "pgLens" | "pgClover" | "pgSnack" | "pgBadge" | "pgJournal" | "pgRummage" | "pgDoubleBag" | "pgEcho" | "pgSouvenir" | "pgStamp" | "pgCampfire" | "pgStarDust" | "pgKeyring" | "pgPostcard" | "pgTent" | "pgShortcut" | "pgLuckyCoin" | "pgWorldLeaf";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const PG_WEAPON_NAMES: Record<PgWeapon & WeaponId, Names> = {
  pgStaff: c("순례자의 지팡이", "Pilgrim's Staff", "巡礼者の杖"),
  pgBlade: c("이세계의 낡은 칼", "Otherworld Old Blade", "異界の古い剣"),
  pgFlag: c("차원 깃발", "Dimension Flag", "次元の旗"),
  pgLantern: c("길잡이 랜턴", "Wayfinder Lantern", "道しるべのランタン"),
  pgPan: c("여행 냄비", "Travel Pot", "旅の鍋"),
  pgMap: c("펼친 지도", "Unfolded Map", "広げた地図"),
  pgCompass: c("별 나침반", "Star Compass", "星の羅針盤"),
  pgBoomerang: c("바람 부메랑", "Wind Boomerang", "風のブーメラン"),
  pgSling: c("조약돌 새총", "Pebble Slingshot", "小石のパチンコ"),
  pgUmbrella: c("별빛 우산", "Starlight Umbrella", "星明かりの傘"),
  pgBell: c("은방울", "Silver Bell", "銀の鈴"),
  pgCrane: c("종이학", "Paper Cranes", "折り鶴"),
  pgCrystal: c("차원 수정", "Dimension Crystal", "次元水晶"),
  pgClock: c("태엽 폭탄", "Clockwork Bomb", "ぜんまい爆弾"),
  pgMeteor: c("떨어진 별", "Fallen Star", "落ちた星"),
  pgSeed: c("세계수 씨앗", "World Tree Seed", "世界樹の種"),
  pgMirror: c("거울 조각", "Mirror Shards", "鏡のかけら"),
  pgHourglass: c("모래시계", "Hourglass", "砂時計"),
  pgKey: c("만능 열쇠", "Master Key", "万能の鍵"),
  pgGate: c("차원의 문", "Door of Dimensions", "次元の扉"),
};

/** 수집품 무기 설명 (모양에서 만듦) */
export function curioDesc(st: CurioStyle, lang: Lang): string {
  const mode: Record<CurioStyle["mode"], Names> = {
    star: c("분홍 보석에서 별 탄", "star bolts from a pink gem", "ピンクの宝石から星の弾"),
    slash: c("앞을 넓게 벰", "a wide slash ahead", "前を広く斬る"),
    flag: c("적 자리에 깃발을 꽂아 3초 동안 둘레를 지짐", "plants a flag on foes that burns around it for 3s", "敵の場所に旗を立て3秒間周りを焼く"),
    lantern: c("둘레로 불꽃이 퍼짐", "flames spread around you", "周りに炎が広がる"),
    bonk: c("가까이서 세게 때려 기절", "a hard close bonk that stuns", "近くで強く叩いて気絶"),
    map: c("방 끝까지 지도 빛줄기", "a map beam across the room", "部屋の端まで地図の光"),
    needle: c("끝까지 쫓아가는 바늘", "a needle that hunts foes down", "どこまでも追う針"),
    boomerang: c("꿰뚫고 갔다가 돌아옴", "pierces out and flies back", "貫いて戻ってくる"),
    sling: c("조약돌 셋을 펼쳐 쏨", "three pebbles in a spread", "小石3つを広げて撃つ"),
    umbrella: c("앞을 밀쳐 냄 · 들고 있으면 받는 피해 -20%", "pushes foes back · -20% damage taken while held", "前を押し返す · 持っている間被ダメージ-20%"),
    bell: c("둘레로 방울 소리 파동, 잠깐 멈춤", "a chiming wave around you briefly stops foes", "周りに鈴の音の波、一瞬止める"),
    crane: c("유도하는 종이학 셋", "three homing paper cranes", "追いかける折り鶴3羽"),
    prism: c("꿰뚫는 수정 빛줄기", "a piercing crystal beam", "貫く水晶の光"),
    gear: c("적 자리에 던져 잠시 뒤 터짐", "thrown at foes, bursts a moment later", "敵の場所に投げ少しして爆発"),
    meteor: c("노린 자리에 별똥별이 떨어짐", "a shooting star falls on the target", "狙った場所に流れ星が落ちる"),
    seed: c("씨앗 탄 · 맞히면 체력 회복", "seed shots that heal you on hit", "種の弾 · 当てると体力回復"),
    shards: c("여섯 방향으로 거울 조각", "mirror shards in six directions", "6方向に鏡のかけら"),
    sand: c("둘레 적을 1초 멈춤", "stops foes around you for 1s", "周りの敵を1秒止める"),
    key: c("한 적을 세게 · 체력 20% 아래 보통 적은 바로 처치", "a heavy single hit · normal foes under 20% HP are finished off", "一体を強く · 体力20%以下の普通の敵は即撃破"),
    gate: c("적 자리에 문을 열어 3초 동안 끌어당기며 지짐", "opens a door on foes that pulls them in for 3s", "敵の場所に扉を開き3秒間引き寄せて焼く"),
  };
  return mode[st.mode][lang];
}

export const PG_PASSIVE_NAMES: Record<PgPassive & PassiveId, Names> = {
  pgPack: c("커다란 배낭", "Huge Backpack", "大きなリュック"),
  pgBoots: c("닳은 여행 부츠", "Worn Travel Boots", "すり減った旅のブーツ"),
  pgLens: c("돋보기", "Magnifying Glass", "虫めがね"),
  pgClover: c("네잎클로버", "Four-Leaf Clover", "四つ葉のクローバー"),
  pgSnack: c("간식 주머니", "Snack Pouch", "おやつ袋"),
  pgBadge: c("순례자 배지", "Pilgrim Badge", "巡礼者のバッジ"),
  pgJournal: c("수집 일지", "Collector's Journal", "収集日誌"),
  pgRummage: c("배낭 정리", "Tidy Pack", "リュックの整理"),
  pgDoubleBag: c("두 겹 배낭", "Double Pack", "二重リュック"),
  pgEcho: c("메아리 구슬", "Echo Marble", "こだまのビー玉"),
  pgSouvenir: c("여행 기념품", "Travel Souvenir", "旅のおみやげ"),
  pgStamp: c("차원 도장", "Dimension Stamp", "次元スタンプ"),
  pgCampfire: c("모닥불", "Campfire", "たき火"),
  pgStarDust: c("별 가루", "Stardust", "星くず"),
  pgKeyring: c("수정 열쇠고리", "Crystal Keychain", "水晶のキーホルダー"),
  pgPostcard: c("그림엽서", "Picture Postcards", "絵はがき"),
  pgTent: c("접이식 텐트", "Folding Tent", "折りたたみテント"),
  pgShortcut: c("지름길", "Shortcut", "近道"),
  pgLuckyCoin: c("행운 동전", "Lucky Coin", "幸運のコイン"),
  pgWorldLeaf: c("세계수 잎", "World Tree Leaf", "世界樹の葉"),
};

export const PG_EFFECTS: Partial<Record<PgPassive & PassiveId, Names>> = {
  pgJournal: c("도감 한 칸마다 오르는 공격력이 {mul}배 (2% → 4%)", "Damage per journal entry ×{mul} (2% → 4%)", "図鑑1マスごとの攻撃力上昇が{mul}倍（2% → 4%）"),
  pgRummage: c("배낭에서 꺼내 쓰기가 5번째 → {every}번째 공격마다", "Pull from the pack every {every} attacks instead of 5", "リュックから取り出すのが5回目 → {every}回目の攻撃ごと"),
  pgDoubleBag: c("꺼낼 때 수집품 {n}개를 꺼냄", "Pull out {n} curios at once", "取り出すとき収集品を{n}つ"),
  pgEcho: c("공격할 때 {chance:pct}% 확률로 한 번 더", "{chance:pct}% chance to attack once more", "攻撃時{chance:pct}%でもう一度"),
  pgSouvenir: c("처치하면 {chance:pct}% 확률로 체력 {heal}", "{chance:pct}% chance on kill to heal {heal}", "撃破時{chance:pct}%で体力{heal}"),
  pgStamp: c("처치마다 도장 하나 · {need}개면 아직 도감에 없는 순례자 무기가 떨어짐", "Each kill earns a stamp · at {need}, a pilgrim weapon you haven't collected drops", "撃破ごとにスタンプ1つ · {need}個でまだ図鑑にない巡礼者の武器が落ちる"),
  pgCampfire: c("꺼내 쓸 때마다 최대 체력 {heal:pct}% 회복", "Heal {heal:pct}% max HP each time you pull from the pack", "取り出すたびに最大体力の{heal:pct}%回復"),
  pgStarDust: c("탄이 맞은 적 둘레도 맞음 (공격력 {mul:pct}%)", "Shots also hit foes around the target ({mul:pct}%)", "弾が当たった敵の周りにも当たる（攻撃力{mul:pct}%）"),
  pgKeyring: c("보스에게 피해 +{mul:up}%", "+{mul:up}% damage to bosses", "ボスへのダメージ+{mul:up}%"),
  pgPostcard: c("도감 {per}칸마다 받는 피해 -{cut:pct}%", "-{cut:pct}% damage taken per {per} journal entries", "図鑑{per}マスごとに被ダメージ-{cut:pct}%"),
  pgTent: c("맞으면 {chance:pct}% 확률로 1초 무적", "{chance:pct}% chance when hit to be invincible for 1s", "被弾時{chance:pct}%で1秒無敵"),
  pgShortcut: c("대시한 뒤 첫 공격 {mul}배", "First attack after a dash ×{mul}", "ダッシュ後の最初の攻撃{mul}倍"),
  pgLuckyCoin: c("꺼내 쓴 수집품 피해 {mul}배", "Curios pulled from the pack deal ×{mul}", "取り出した収集品のダメージ{mul}倍"),
  pgWorldLeaf: c("도감 {need}칸 이상이면 공격 속도 +{mul:up}%", "+{mul:up}% attack speed with {need}+ journal entries", "図鑑{need}マス以上で攻撃速度+{mul:up}%"),
};
