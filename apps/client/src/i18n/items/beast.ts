// 야수 글자 (한·영·일): 무기 이름 · 무기 설명(공격 방식과 고양이) · 전용 아이템 이름·효과 (수치는 weaponsBeast·sim/beast·pets와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

export type BeastWeapon = "claws" | "pouncers" | "yarnball" | "catpack" | "lionheart" | "hairball" | "catnip" | "catbell" | "shadowpaw" | "tigerclaw";
type BeastPassive = "catNap" | "extraCat" | "sharpClaws" | "nineLives" | "agility" | "hunterInstinct" | "purr" | "packLeader" | "fishTreat" | "wildRoar";

export const BEAST_WEAPON_NAMES: Record<BeastWeapon & WeaponId, Names> = {
  claws: { ko: "고양이 발톱", en: "Cat Claws", ja: "猫の爪" },
  pouncers: { ko: "덮치기", en: "Pounce", ja: "飛びかかり" },
  yarnball: { ko: "털실 뭉치", en: "Yarn Ball", ja: "毛糸玉" },
  catpack: { ko: "고양이 무리", en: "Cat Pack", ja: "猫の群れ" },
  lionheart: { ko: "사자의 심장", en: "Lionheart", ja: "獅子の心" },
  hairball: { ko: "헤어볼", en: "Hairball", ja: "毛玉" },
  catnip: { ko: "캣닢", en: "Catnip", ja: "マタタビ" },
  catbell: { ko: "고양이 방울", en: "Cat Bell", ja: "猫の鈴" },
  shadowpaw: { ko: "그림자 발", en: "Shadow Paw", ja: "影の肉球" },
  tigerclaw: { ko: "호랑이 발톱", en: "Tiger Claw", ja: "虎の爪" },
};

const CAT = { ko: "고양이 1마리", en: "1 cat", ja: "猫1匹" };

export const BEAST_DESC: Record<BeastWeapon, Names> = {
  claws: { ko: `빠르게 앞을 할큄 · ${CAT.ko}`, en: `Quick swipes in front · ${CAT.en}`, ja: `素早く前を引っかく · ${CAT.ja}` },
  pouncers: { ko: `가까운 적에게 뛰어들어 할큄. 맞힐 때마다 게이지가 차고, 다 차면 10초 동안 거대한 호랑이로 변신 (더 멀리 뛰어 둘레를 크게 할큄 · 추가 체력 50이 먼저 깎이고, 남은 채 끝나면 체력이 가득 참) · ${CAT.ko}`, en: `Leaps onto a nearby enemy and swipes. Each hit fills a gauge; when full, become a giant tiger for 10s (longer leaps, wide swipes all around · 50 extra HP lost first; if any is left when it ends, your HP is fully restored) · ${CAT.en}`, ja: `近くの敵に飛びかかって引っかく。当てるたびにゲージがたまり、満タンで10秒間巨大な虎に変身（より遠くへ跳び周りを大きく引っかく · 追加体力50が先に減り、残ったまま終わると体力が全回復） · ${CAT.ja}` },
  yarnball: { ko: `털실을 던짐, 벽에 3번 튕김 · ${CAT.ko}`, en: `Throws yarn that bounces off walls 3 times · ${CAT.en}`, ja: `毛糸を投げる、壁で3回跳ね返る · ${CAT.ja}` },
  catpack: { ko: "약하게 할큄 · 고양이 3마리", en: "Weak swipes · 3 cats", ja: "弱く引っかく · 猫3匹" },
  lionheart: { ko: "할큄 · 사자 1마리 (느리지만 세게, 둘레까지 물어뜯음)", en: "Swipes · 1 lion (slow but strong, mauls nearby enemies too)", ja: "引っかく · ライオン1頭（遅いが強く、周りまで噛みつく）" },
  hairball: { ko: `헤어볼을 뱉음, 맞은 적은 1.5초 느려지고 불탐 · ${CAT.ko}`, en: `Spits a hairball; hit enemies are slowed for 1.5s and burn · ${CAT.en}`, ja: `毛玉を吐く、当たった敵は1.5秒遅くなり燃える · ${CAT.ja}` },
  catnip: { ko: `캣닢 구름이 3초 동안 0.5초마다 피해 · 고양이가 신나서 두 배 빠르게 할큄 · ${CAT.ko}`, en: `Catnip cloud deals damage every 0.5s for 3s · Cats get excited and swipe twice as fast · ${CAT.en}`, ja: `マタタビの雲が3秒間0.5秒ごとにダメージ · 猫が興奮して2倍速く引っかく · ${CAT.ja}` },
  catbell: { ko: "방울을 울려 둘레 적에게 피해 + 0.5초 기절 · 고양이 2마리", en: "Rings a bell: damages and stuns nearby enemies for 0.5s · 2 cats", ja: "鈴を鳴らして周りの敵にダメージ＋0.5秒気絶 · 猫2匹" },
  shadowpaw: { ko: "빠르게 할큄 · 그림자 고양이 2마리 (적 옆으로 순간이동)", en: "Quick swipes · 2 shadow cats (teleport next to enemies)", ja: "素早く引っかく · 影猫2匹（敵の横に瞬間移動）" },
  tigerclaw: { ko: `느리지만 넓고 강하게 할큄 · ${CAT.ko}`, en: `Slow but wide, heavy swipes · ${CAT.en}`, ja: `遅いが広く強く引っかく · ${CAT.ja}` },
};

export const BEAST_PASSIVE_NAMES: Record<BeastPassive & PassiveId, Names> = {
  catNap: { ko: "고양이 낮잠", en: "Cat Nap", ja: "猫の昼寝" },
  extraCat: { ko: "한 마리 더", en: "One More Cat", ja: "もう一匹" },
  sharpClaws: { ko: "날카로운 발톱", en: "Sharp Claws", ja: "鋭い爪" },
  nineLives: { ko: "아홉 목숨", en: "Nine Lives", ja: "九つの命" },
  agility: { ko: "고양이 몸놀림", en: "Feline Agility", ja: "猫の身のこなし" },
  hunterInstinct: { ko: "사냥 본능", en: "Hunter's Instinct", ja: "狩りの本能" },
  purr: { ko: "골골송", en: "Purr", ja: "ゴロゴロ" },
  packLeader: { ko: "무리의 우두머리", en: "Pack Leader", ja: "群れのボス" },
  fishTreat: { ko: "생선 간식", en: "Fish Treat", ja: "お魚おやつ" },
  wildRoar: { ko: "포효", en: "Wild Roar", ja: "咆哮" },
};

export const BEAST_EFFECTS: Record<BeastPassive & PassiveId, Names> = {
  catNap: { ko: "1초 넘게 가만히 있으면 초당 체력 1 회복", en: "Standing still for over 1s heals 1 health per second", ja: "1秒以上じっとしていると毎秒体力1回復" },
  extraCat: { ko: "고양이 +1 (여러 개 가질 수 있음)", en: "+1 cat (stackable)", ja: "猫+1（複数持てる）" },
  sharpClaws: { ko: "공격력 +3, 고양이 피해 +30%", en: "Damage +3, cat damage +30%", ja: "攻撃力+3、猫のダメージ+30%" },
  nineLives: { ko: "층마다 한 번, 쓰러질 때 체력 1로 버티고 2초 무적", en: "Once per floor, survive a fatal hit with 1 health and 2s of invulnerability", ja: "階ごとに1回、倒れる時に体力1で耐えて2秒無敵" },
  agility: { ko: "이동 속도 +0.15, 대시 대기 시간 -30%", en: "Move speed +0.15, dash cooldown -30%", ja: "移動速度+0.15、ダッシュの待ち時間-30%" },
  hunterInstinct: { ko: "체력 절반 이하 적에게 본인·고양이 피해 +30%", en: "You and your cats deal 30% more damage to enemies at half health or less", ja: "体力半分以下の敵に自分と猫のダメージ+30%" },
  purr: { ko: "고양이가 할퀼 때마다 체력 0.3 회복", en: "Heal 0.3 health whenever a cat scratches", ja: "猫が引っかくたびに体力0.3回復" },
  packLeader: { ko: "고양이 한 마리당 공격 속도 +5%", en: "+5% attack speed per cat", ja: "猫1匹につき攻撃速度+5%" },
  fishTreat: { ko: "적을 쓰러뜨리면 3초 동안 고양이가 두 배 빠르게 할큄", en: "Defeating an enemy makes cats scratch twice as fast for 3s", ja: "敵を倒すと3秒間猫が2倍速く引っかく" },
  wildRoar: { ko: "맞으면 포효: 둘레 적을 밀어내며 피해, 3초 동안 고양이 피해 +50%", en: "When hit, roar: push back and damage nearby enemies, cats deal +50% damage for 3s", ja: "被弾すると咆哮：周りの敵を押し返してダメージ、3秒間猫のダメージ+50%" },
};
