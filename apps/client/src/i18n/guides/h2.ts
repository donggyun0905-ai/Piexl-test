// 캐릭터 설명: 시즌 2 헬리오스 (역병의사·학살자) · 한·영·일
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_H2: Guide = {
  samyeol: [
    "헬리오스 · 사멸 · 사천 당가 · 체력 95 · 빠름 · 행운 1",
    "무기는 모두 독침 · 모든 침에 독(0.5초마다)과 죽음(1초마다)이 붙음",
    "당가 독침 · 폭우침 · 연화침(사방) · 실침(모두 꿰뚫음) · 부채침 · 연사침 · 안개침 · 혼침(죽음 2배) · 전갈침(독 2배·느리게) · 만천화우(사방 스물넷 + 앞 다섯)",
    "던진 침이 30개 쌓일 때마다 맵에 독가스가 피어남 (최대 6, 안의 적은 계속 독·죽음)",
  ],
  eater: [
    "헬리오스 · 이터 · 체력 110 · 넓고 세지만 느린 공격",
    "무기는 이빨 달린 그림자 하나 · 누를 때마다 열 가지 공격 중 하나가 확률로 나옴",
    "그림자 베기 · 검기 셋 · 물어뜯기 · 땅에서 솟는 심연의 괴물 · 그림자 창 · 뒤에서 솟는 창 연타 · X자 가르기 · 돌진해 씹기 · 세 번 씹기 · 땅에서 솟아 낚아채기(약한 적은 통째로 삼킴)",
    "쓰러뜨린 적은 먹은 것으로 셈 · 왼쪽 위 '포식(DEVOUR)' 스택 창에 먹은 수와 재생력이 보임 · 먹을 때마다 재생력 +0.1 (상한 100, 10초마다 그만큼 회복) · 재생력 10마다 공격력 +3 · 오래 싸울수록 단단해짐",
  ],
  mukin: [
    "헬리오스 · 묵인 · 체력 160 · 큰 몸 · 느림",
    "방어력 30: 받는 피해의 30%를 무시 (아무리 높아도 한 번에 적어도 1은 받음) · 맞아도 무적이 거의 없음",
    "공격은 몸으로 들이받는 돌진 · 피해 = 방어력의 300% + 공격력 · 무기마다 기절·충격파·왕복·연쇄·방벽 등이 더해짐",
    "재생력 10 (10초마다 10) · 회복약은 바로 차지 않고 1초에 최대 체력의 10%씩 천천히 차오름",
  ],
  plague: [
    "헬리오스 · 역병의사 · 체력 100 · 행운 1",
    "모기떼: 겨눈 곳으로 날아가 누르는 동안 넓은 둘레를 쉬지 않고 갈아버림 · 연기 구역: 독·불·죽음을 주고 방어력을 5% 깎는 구름을 깖",
    "쥐떼: 맵 곳곳에서 쥐가 튀어나와 둘레 적들을 1씩 갉음 · 20% 확률로 흑사병(1초마다 최대 체력의 20%, 보스는 1/5의 20%) · 흑사병이 걸리면 붙은 쥐가 10 피해로 터지고, 병이 끝날 때까지 다시 붙지 않음",
    "죽음의 손아귀: 가까이 움켜쥐어 34% 확률로 즉사 (보스는 최대 체력 1/4의 20%) · 사거리·공격 속도가 늘지 않음",
  ],
  slayer: [
    "헬리오스 · 학살자 · 체력 280 · 큰 사거리 · 아주 빠른 공격",
    "한 번 누르면 거대한 대낫으로 아주 빠른 5연속 콤보, 끝나면 보통 공격 속도만큼 쉬고 다시 · 기술마다 체력 5 (체력 40 아래로는 안 내려감) · 받는 피해 +50% · 회복약은 듣지 않음 · 공용 능력치 아이템이 나오지 않음",
    "때리면 게이지가 참 · 가득 차면 10초 동안 피의 학살 (체력 소모 없음 · 흡혈 50% · 공격력 +25% · 공격 속도 +25% · 이동 속도 +0.5) · 체력이 낮을수록 공격력이 오름",
    "대낫 10개는 모두 콤보가 다름 (처음 무기: 3연속 베기 → 급습 베기 → 일직선 베기 → 강하게 베기+검기 셋 → 더욱 강하게 베기 · 그 밖에 마름모 검기·회오리·X자·피의 검기 폭발·끌어당겨 베기·내려찍는 강하 등)",
  ],
};

export const GUIDE_EN_H2: Guide = {
  samyeol: [
    "Helios · Samyeol · Tang clan of Sichuan · 95 HP · fast · Luck 1",
    "All weapons are poison needles · every needle inflicts poison (every 0.5s) and death (every 1s)",
    "Tang Needles · Needle Storm · Lotus Needles (all around) · Thread Needle (pierces all) · Fan of Needles · Needle Volley · Mist Needles · Soul Needle (double death) · Scorpion Needles (double poison, slows) · Rain of a Thousand Flowers (24 all around + 5 ahead)",
    "Every 30 needles thrown, poison gas blooms on the map (up to 6; foes inside keep taking poison and death)",
  ],
  eater: [
    "Helios · Eater · 110 HP · wide, strong but slow attacks",
    "One weapon, the Fanged Shadow · each press unleashes one of ten attacks at random",
    "Shadow slash · three blades · bite · abyssal beast from below · shadow spear · spear barrage from behind · X-cut · dash bite · triple bite · ambush from the ground (swallows weak foes whole)",
    "Foes it fells count as eaten · the DEVOUR stack at the top left shows how many and the regen · +0.1 regen per foe eaten (max 100, heals that much every 10s) · +3 damage per 10 regen · grows tougher the longer it fights",
  ],
  mukin: [
    "Helios · Mukin · 160 HP · huge body · slow",
    "30 Defense: ignores 30% of damage taken (always takes at least 1 per hit) · almost no invincibility after hits",
    "Attacks by body-slamming charges · damage = 300% of Defense + Damage · each weapon adds stuns, shockwaves, return charges, chains, barriers and more",
    "10 regen (10 HP every 10s) · potions don't heal at once but restore 10% of max HP per second",
  ],
  plague: [
    "Helios · Plague Doctor · 100 HP · Luck 1",
    "Mosquito Swarm: flies where you aim and, while held, relentlessly grinds a wide area · Miasma: lays clouds that poison, burn, curse and cut defense by 5%",
    "Rat Swarm: rats pop up all over the map and gnaw nearby foes for 1 · 20% chance of Black Death (20% of max HP per second, bosses 20% of 1/5) · When the plague takes hold, clinging rats burst for 10 and won't cling again until it ends",
    "Grip of Death: grabs at close range with a 34% chance to kill outright (bosses lose 20% of 1/4 max HP) · Range and attack speed don't increase",
  ],
  slayer: [
    "Helios · Slayer · 280 HP · Long reach · Very fast attacks",
    "One press unleashes a blazing 5-move combo with her huge scythe, then a rest at normal attack speed · Each move costs 5 HP (never below 40) · Takes 50% more damage · Potions don't heal her · Common stat items don't drop",
    "Hits fill a gauge · When full, Blood Massacre for 10s (no HP cost · 50% lifesteal · +25% damage · +25% attack speed · +0.5 move speed) · The lower her HP, the higher her damage",
    "All 10 scythes have different combos (starter: triple slash → raid slash → line cleave → heavy slash + three blades → grand slash · also diamond blades, whirl, X-cut, blood nova, reaping pull, skyfall and more)",
  ],
};

export const GUIDE_JA_H2: Guide = {
  samyeol: [
    "ヘリオス · 死滅 · 四川唐家 · 体力95 · 速い · 運1",
    "武器はすべて毒針 · すべての針に毒（0.5秒ごと）と死（1秒ごと）が付く",
    "唐家の毒針 · 暴雨針 · 蓮華針（四方）· 糸針（すべて貫く）· 扇針 · 連射針 · 霧針 · 魂針（死2倍）· 蠍針（毒2倍・鈍化）· 満天花雨（四方に24本＋前に5本）",
    "投げた針が30本たまるごとにマップに毒ガスが湧く（最大6、中の敵は毒・死を受け続ける）",
  ],
  eater: [
    "ヘリオス · イーター · 体力110 · 広く強いが遅い攻撃",
    "武器は牙ある影ひとつ · 押すたびに10種の攻撃のどれかが確率で出る",
    "影斬り · 剣気3つ · 噛みつき · 地中から現れる深淵の怪物 · 影の槍 · 背後からの槍連打 · X字斬り · 突進噛み · 三度噛み · 地中からの捕食（弱った敵は丸呑み）",
    "倒した敵は喰ったと数える · 左上の「捕食（DEVOUR）」スタックに数と再生力が出る · 喰うたびに再生力+0.1（上限100、10秒ごとにその分回復）· 再生力10ごとに攻撃力+3· 長く戦うほど頑丈に",
  ],
  mukin: [
    "ヘリオス · 黙忍 · 体力160 · 大きな体 · 遅い",
    "防御力30：被ダメージの30%を無視（どれだけ高くても1回で最低1は受ける）· 被弾後の無敵がほぼない",
    "攻撃は体当たりの突進 · ダメージ = 防御力の300% + 攻撃力 · 武器ごとに気絶・衝撃波・往復・連鎖・防壁などが加わる",
    "再生力10（10秒ごとに10）· 回復薬はすぐには効かず毎秒最大体力の10%ずつゆっくり回復",
  ],
  plague: [
    "ヘリオス · 疫病医 · 体力100 · 運1",
    "蚊の群れ: 狙った所へ飛び、押している間広い範囲をすり潰し続ける · 瘴気: 毒・炎・死を与え防御を5%削る雲を置く",
    "ネズミの群れ: マップのあちこちから現れ周りの敵を1ずつかじる · 20%で黒死病(毎秒最大体力の20%、ボスは1/5の20%) · 発病すると張り付いたネズミが10ダメージで破裂し、病が終わるまで再び張り付かない",
    "死の手: 近くを掴み34%で即死(ボスは最大体力1/4の20%) · 射程・攻撃速度は上がらない",
  ],
  slayer: [
    "ヘリオス · 虐殺者 · 体力280 · 長い射程 · とても速い攻撃",
    "1回押すと巨大な大鎌でとても速い5連続コンボ、終わると通常の攻撃速度分休んで再び · 技ごとに体力5（40未満にはならない）· 被ダメージ+50% · 回復薬は効かない · 共通の能力値アイテムが出ない",
    "攻撃でゲージが溜まる · 満タンで10秒間、血の虐殺(体力消費なし · 吸血50% · 攻撃力+25% · 攻撃速度+25% · 移動速度+0.5) · 体力が低いほど攻撃力が上がる",
    "大鎌10本はすべてコンボが違う（初期武器：鎌斬り3連 → 急襲斬り → 一直線斬り → 強斬り＋剣気3つ → 渾身の大斬り · ほかに菱形の剣気・旋風・X字・血の剣気爆発・引き寄せ斬り・天墜など）",
  ],
};
