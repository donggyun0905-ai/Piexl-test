import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.106",
    date: "2026-10-26",
    items: {
      ko: ["헬리오스 시즌 2 새 캐릭터 '사멸' (사천 당가): 모든 침에 독과 죽음이 붙는 독침 10개(당가 독침·폭우침·연화침·실침·부채침·연사침·안개침·혼침·전갈침·만천화우) · 침을 많이 던질수록 맵에 독가스가 피어남 (침 30개마다, 최대 6) · 전용 아이템 10"],
      en: ["New Helios Season 2 character 'Samyeol' (Tang clan of Sichuan): 10 poison-needle weapons where every needle inflicts poison and death (Tang Needles, Needle Storm, Lotus Needles, Thread Needle, Fan of Needles, Needle Volley, Mist Needles, Soul Needle, Scorpion Needles, Rain of a Thousand Flowers) · the more needles she throws, the more poison gas blooms on the map (every 30 needles, up to 6) · 10 exclusive items"],
      ja: ["ヘリオスのシーズン2新キャラ「死滅」（四川唐家）：すべての針に毒と死が付く毒針10種（唐家の毒針・暴雨針・蓮華針・糸針・扇針・連射針・霧針・魂針・蠍針・満天花雨）· 針を投げるほどマップに毒ガスが湧く（30本ごと、最大6）· 専用アイテム10"],
    },
  },
  {
    version: "0.48.105",
    date: "2026-10-26",
    items: {
      ko: [
        "헬리오스 시즌 2 새 캐릭터 '이터': 이빨 달린 그림자 하나로 싸우며 누를 때마다 열 가지 공격(그림자 베기·검기 셋·물어뜯기·심연의 괴물·그림자 창·창 연타·X자 가르기·돌진해 씹기·세 번 씹기·낚아채기) 중 하나가 확률로 나옴 · 넓고 세지만 느림 · 먹은 적마다 재생력 +0.1 (상한 20) · 전용 아이템 10",
        "헬리오스 시즌 2 새 캐릭터 '묵인': 큰 몸 · 새 능력치 방어력 30 (받는 피해 30% 무시, 적어도 1) · 맞아도 무적이 거의 없음 · 몸으로 들이받는 돌진(피해 = 방어력 300% + 공격력) · 재생력 10 · 회복약은 천천히 차오름 · 돌진 무기 10 · 전용 아이템 10",
      ],
      en: [
        "New Helios Season 2 character 'Eater': fights with a single fanged shadow, and each press unleashes one of ten attacks at random (shadow slash, three blades, bite, abyssal beast, shadow spear, spear barrage, X-cut, dash bite, triple bite, ambush) · wide and strong but slow · +0.1 regen per foe eaten (max 20) · 10 exclusive items",
        "New Helios Season 2 character 'Mukin': a huge body · new Defense stat of 30 (ignores 30% of damage, at least 1) · almost no invincibility after hits · body-slam charges (damage = 300% Defense + Damage) · 10 regen · potions heal slowly · 10 charge weapons · 10 exclusive items",
      ],
      ja: [
        "ヘリオスのシーズン2新キャラ「イーター」：牙ある影ひとつで戦い、押すたびに10種の攻撃（影斬り・剣気3つ・噛みつき・深淵の怪物・影の槍・槍連打・X字斬り・突進噛み・三度噛み・捕食）のどれかが確率で出る · 広く強いが遅い · 喰った敵ごとに再生力+0.1（上限20）· 専用アイテム10",
        "ヘリオスのシーズン2新キャラ「黙忍」：大きな体 · 新しい能力値の防御力30（被ダメージ30%無視、最低1）· 被弾後の無敵がほぼない · 体当たり突進（ダメージ = 防御力300% + 攻撃力）· 再生力10 · 回復薬はゆっくり回復 · 突進武器10 · 専用アイテム10",
      ],
    },
  },
  {
    version: "0.48.104",
    date: "2026-10-25",
    items: {
      ko: [
        "헬리오스 시즌 2 새 캐릭터 '역병의사': 모기떼(겨눈 곳을 계속 갉음) · 연기 구역(독·불·죽음·방어력 -5%) · 쥐떼(1씩 갉다가 20% 흑사병: 1초마다 최대 체력 20%, 보스는 1/5의 20%, 붙은 쥐는 10 피해로 터짐) · 죽음의 손아귀(20% 즉사, 보스는 최대 체력 1/4의 20%) · 무기 4 · 전용 아이템 10",
        "헬리오스 시즌 2 새 캐릭터 '학살자': 체력 280 · 한 번 누르면 대낫 5연속 콤보(기술마다 체력 5) · 회복약으로 회복하지 않음 · 게이지가 차면 10초 '피의 학살'(흡혈 10%·공격력·공격 속도 +25%·이동 속도 +0.5) · 체력이 낮을수록 강해짐 · 콤보가 모두 다른 대낫 10 · 전용 아이템 10 (공용 능력치 아이템은 나오지 않음)",
        "그림 규칙을 문서에 적음: 새 캐릭터도 시즌 1 그림체(얼굴 아래 4줄·입 없음·보랏빛 테두리)로",
      ],
      en: [
        "New Helios Season 2 character 'Plague Doctor': Mosquito Swarm (keeps gnawing where you aim) · Miasma (poison, fire, death, -5% defense) · Rat Swarm (gnaws for 1, 20% Black Death: 20% of max HP per second, bosses 20% of 1/5, clinging rats burst for 10) · Grip of Death (20% instant kill, bosses lose 20% of 1/4 max HP) · 4 weapons · 10 exclusive items",
        "New Helios Season 2 character 'Slayer': 280 HP · one press unleashes a 5-hit scythe combo (5 HP per move) · potions don't heal her · a full gauge starts 10s of Blood Massacre (10% lifesteal, +25% damage and attack speed, +0.5 move speed) · stronger at low HP · 10 scythes, each with its own combo · 10 exclusive items (common stat items don't drop)",
        "Wrote down the art rule: new characters use the Season 1 style too (four face rows, no mouth, purple outline)",
      ],
      ja: [
        "ヘリオスのシーズン2新キャラ「疫病医」：蚊の群れ（狙った所をかじり続ける）· 瘴気（毒・炎・死・防御-5%）· ネズミの群れ（1ずつかじり20%で黒死病：毎秒最大体力の20%、ボスは1/5の20%、張り付いたネズミは10ダメージで破裂）· 死の手（20%で即死、ボスは最大体力1/4の20%）· 武器4 · 専用アイテム10",
        "ヘリオスのシーズン2新キャラ「虐殺者」：体力280 · 1回押すと大鎌の5連続コンボ（技ごとに体力5）· 回復薬で回復しない · ゲージが溜まると10秒間「血の虐殺」（吸血10%・攻撃力と攻撃速度+25%・移動速度+0.5）· 体力が低いほど強い · コンボがすべて違う大鎌10 · 専用アイテム10（共通の能力値アイテムは出ない）",
        "絵のルールを文書に記録：新キャラもシーズン1の絵柄（顔は下の4行・口なし・紫の縁取り）で",
      ],
    },
  },
];
