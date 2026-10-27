// 캐릭터 설명: 시즌 2 비르디아 (이드라·변희) · 한·영·일
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_S2: Guide = {
  idra: [
    "비르디아 · 세계수의 아이 · 체력 100 · 행운 1",
    "무기는 가이아 하나 · 대시 키를 누르면 대시하며 모습이 바뀌고 둘레에 변환 일격",
    "세계수 대궁(느리고 센 관통 화살) → 우드브레이커(아주 빠른 단검, 5번째마다 3배·묶음) → 가이아 버클러(반원 강타·보호막, 받는 피해 -30%) → 브라이어 스커지(한 줄을 휘감는 가시 채찍, 독)",
    "공용 아이템이 나오지 않고 이드라 전용 아이템 20개만 나옴 (능력치 8 · 모습마다 효과 12) · 네 모습을 모두 거치면 강해지는 사계",
  ],
  byeonhui: [
    "비르디아 · 만물의 소녀 · 체력 105",
    "무기가 곧 동물 · 든 동물로 변해 그 동물처럼 싸움 (동물마다 빠르기가 다름)",
    "늑대 물기 · 곰 할퀴기 · 독수리 깃털 · 뱀 독 물기 · 멧돼지 돌진 · 전갈 꼬리(멈춤) · 박쥐 음파(흡혈) · 코끼리 짓밟기(기절) · 거미 거미줄(느리게) · 불사조 불덩이",
    "동물마다 전용 능력이 셋씩: 그 동물로 사냥하면 경험치가 차고(일반 적 3 · 보스 20) 100이 되면 하나를 얻음 (상점·보물방에서는 기본 아이템만) · 얻은 능력은 무기를 바꿔도 남음",
    "셋을 모두 얻으면 그 동물이 각성 (갑옷 입은 큰 모습·체력 +20·사거리 +25%·공격력 +3·방어력 +20·공격 속도 +25%·각성 기술) · 한 번 각성한 동물의 기술은 다른 동물이어도 계속 나옴 · 대시하면 사람 모습, 공격하면 다시 동물",
  ],
  fly: [
    "비르디아 · 잠자리 날개 · 체력 85 · 이동 속도 1.5 (아주 빠름)",
    "공격하면 겨눈 쪽으로 사거리의 두 배만큼 공중을 가르며 급습 · 급습하는 동안 무적, 지나간 적을 베고 끝에서 앞쪽을 할큄 · 20% 확률로 하늘 습격(무적, 방 끝에서 끝까지 10번 내리그음)",
    "발톱마다 더하는 힘: 두 번 베기 · 바람 칼날 · 독 · 연쇄 번개 · 서리 · 흡혈 · 신기루(다시 터짐) · 그림자 분신(같은 길을 되짚어 벰) · 날개 칼날 넷",
    "전용 아이템으로 더 멀리·더 자주·더 빠르게 (가속·긴 비행·연속 비행·겹눈)",
  ],
  elder: [
    "비르디아 · 진법의 장로 · 체력 95 · 느림",
    "공격하면 가장 가까운 적 자리(없으면 바라보는 쪽)에 네모난 진을 깖 · 잠시 뒤 진이 발동 · 한 번에 셋까지 (방을 나가면 사라짐)",
    "덩굴문 · 오검진(불기둥) · 협벽진(양쪽 벽) · 함정진 · 낙검진(떨어지는 검) · 뇌인진 · 빙결진 · 풍뢰진(빨아들임) · 암권진(바위 주먹) · 천원진",
    "전용 아이템으로 진을 더 빨리·넓게·많이·오래 · 결계(진 안에서 받는 피해 감소) · 차 한 잔(가만히 있으면 회복)",
  ],
  ren: [
    "비르디아 · 두건 달린 로브를 쓴 토목의 소녀 · 체력 120 · 무기는 맨손 하나 (무기 대신 아이템이 나옴)",
    "공격하면 거대한 토목이 가까운 적 위로 떨어짐 · 차례로 타격 → 묶기 → 날려버리기 → 짓뭉개기 → 가두기 (넓고 세지만 느림)",
    "둘레를 도는 수호 토목: 부딪힌 적에게 조금씩 피해 · 원거리 탄은 70% 확률로 막음 (대신 몸으로 부딪히는 근접 공격은 2배로 받음)",
    "전용 아이템 20개: 수호 토목·막기·되받기·여진·대지 붕괴·터지는 감옥 등",
  ],
  spiritist: [
    "비르디아 · 교복을 입은 학생 정령사 · 체력 85",
    "본인 공격은 약한 매직 미사일뿐 · 싸움은 정령들이 함: 곁의 작은 정령 셋(12종 중 무작위) + 무기인 대정령",
    "작은 정령은 30초마다 가장 오래된 하나가 떠나고 새 정령이 옴 (강철·중력·용광로·광맥·그림자·강철실·독기·허공·세계수·가시덩굴·포자·대지)",
    "대정령 10: 티탄코어·아이언하이드·크로노스파이어·나이트위버·엄브라·베놈하이드·이드라(어른이 된 미래의 이드라)·브라이어하트·실반가드·아비스루인",
  ],
};

export const GUIDE_EN_S2: Guide = {
  idra: [
    "Virdia · Child of the World Tree · 100 HP · 1 luck",
    "Her only weapon is Gaia · the dash key dashes and shifts its form, bursting around her",
    "World Tree Longbow (slow, heavy piercing arrows) → Woodbreaker (very fast dagger, every 5th strike ×3 and roots) → Gaia Buckler (half-circle bash and shield, -30% damage taken) → Briar Scourge (thorn whip lashing a whole line, poison)",
    "Common items never drop, only Idra's 20 own items (8 stats · 12 form effects) · Four Seasons empowers her after cycling all four forms",
  ],
  byeonhui: [
    "Virdia · The All-Shaped Girl · 105 HP",
    "Her weapons are animals · she becomes the one she holds and fights like it (each moves at its own speed)",
    "Wolf bites · bear swipes · eagle feathers · serpent venom · boar charge · scorpion sting (stop) · bat sound (lifesteal) · elephant stomp (stun) · spider webs (slow) · phoenix fireballs",
    "Three own abilities per animal: hunting as that animal fills its XP (3 per foe · 20 per boss) and at 100 she gains one (shops and treasure rooms give only basic items) · abilities stay when she switches weapons",
    "Gain all three to awaken it (armored, bigger look, +20 HP, +25% range, +3 damage, +20 defense, +25% attack speed, an awakened skill) · awakened skills keep firing even as other animals · dashing turns her human, attacking turns her back",
  ],
  fly: [
    "Virdia · Dragonfly wings · 85 HP · 1.5 move speed (very fast)",
    "Attacking swoops twice your range through the air toward your aim · invulnerable while swooping, slashing foes on the way and raking ahead at the end · 20% chance of a Sky Raid (invulnerable, 10 sweeps edge to edge)",
    "Each claw adds: double slash · wind blades · poison · chain lightning · frost · lifesteal · mirage (bursts again) · shadow double (slashes back along the path) · four wing blades",
    "Own items swoop farther, more often and faster (Afterburn, Long Flight, Chain Flight, Compound Eyes)",
  ],
  elder: [
    "Virdia · Elder of arrays · 95 HP · slow",
    "Attacking lays a square array under the nearest foe (or ahead) · it triggers after a moment · up to three at once (they vanish when you leave the room)",
    "Vine Gate · Five-Dagger (fire pillar) · Crushing Walls · Pit · Falling Swords · Thunder Seal · Frost · Wind Cage (pull) · Stone Fist · Heavenly Palace",
    "Own items make arrays faster, wider, more numerous and lasting · Ward (less damage inside your array) · A Cup of Tea (heal while standing still)",
  ],
  ren: [
    "Virdia · A hooded, robed girl of earthwood · 120 HP · bare hands only (items drop instead of weapons)",
    "Attacking drops giant earthwood on the nearest foe · in turn: strike → bind → launch → crush → imprison (wide and strong but slow)",
    "Guardian earthwood circles her: chips at foes it touches · blocks ranged shots 70% of the time (but body hits deal double damage)",
    "20 own items: more guardians, blocking, throwback, aftershocks, earth collapse, bursting prisons and more",
  ],
  spiritist: [
    "Virdia · A student spiritist in school uniform · 85 HP",
    "Her own attack is just a weak magic missile · the spirits fight: three small spirits (random from 12) + her weapon, a great spirit",
    "Every 30s the oldest small spirit leaves and a new one arrives (Steel, Gravity, Furnace, Ore Vein, Shadow, Steel Thread, Miasma, Void, World Tree, Thornvine, Spore, Earth)",
    "10 great spirits: Titancore, Ironhide, Chronospire, Nightweaver, Umbra, Venomhide, Idra (the grown-up Idra of the future), Briarheart, Sylvanguard, Abyssruin",
  ],
};

export const GUIDE_JA_S2: Guide = {
  idra: [
    "ヴィルディア · 世界樹の子 · 体力100 · 運1",
    "武器はガイアひとつ · ダッシュキーでダッシュしながら姿が変わり、周囲へ変換の一撃",
    "世界樹の大弓（遅く強い貫通矢）→ ウッドブレイカー（とても速い短剣、5回目ごとに3倍・縛る）→ ガイアバックラー（半円の強打・シールド、被ダメージ-30%）→ ブライアスカージ（一列を薙ぐ棘の鞭、毒）",
    "共通アイテムは出ずイドラ専用アイテム20個だけ（能力値8・姿ごとの効果12）· 四つの姿を巡ると強くなる四季",
  ],
  byeonhui: [
    "ヴィルディア · 万物の少女 · 体力105",
    "武器は動物そのもの · 持った動物に変身してその動物のように戦う（動物ごとに速さが違う）",
    "狼の噛みつき · 熊の引っかき · 鷲の羽根 · 蛇の毒 · 猪の突進 · 蠍の尾（停止）· 蝙蝠の音波（吸血）· 象の踏みつけ（気絶）· 蜘蛛の糸（減速）· 不死鳥の火の玉",
    "動物ごとに専用能力3つ：その動物で狩ると経験値が溜まり（通常の敵3 · ボス20）100で一つ得る（ショップ・宝部屋は基本アイテムのみ）· 得た能力は武器を替えても残る",
    "三つ全部得るとその動物が覚醒（鎧をまとった大きな姿・体力+20・射程+25%・攻撃力+3・防御力+20・攻撃速度+25%・覚醒技）· 一度覚醒した動物の技は別の動物でも出続ける · ダッシュすると人の姿、攻撃すると再び動物",
  ],
  fly: [
    "ヴィルディア · 蜻蛉の翅 · 体力85 · 移動速度1.5（とても速い）",
    "攻撃すると狙った方へ射程の2倍、空を切って急襲 · 急襲中は無敵、通り道の敵を斬り最後に前方を引っかく · 20%の確率で空襲（無敵、端から端まで10回切り裂く）",
    "爪ごとの力：二回斬り · 風の刃 · 毒 · 連鎖する雷 · 霜 · 吸血 · 蜃気楼（もう一度弾ける）· 影の分身（同じ道を引き返して斬る）· 羽の刃四つ",
    "専用アイテムでより遠く・より頻繁に・より速く（加速・長い飛行・連続飛行・複眼）",
  ],
  elder: [
    "ヴィルディア · 陣法の長老 · 体力95 · 遅い",
    "攻撃すると一番近い敵の場所（いなければ前方）に四角い陣を敷く · 少し後に発動 · 同時に三つまで（部屋を出ると消える）",
    "蔓の門 · 五剣陣（火柱）· 挟壁陣（両側の壁）· 陥穽陣 · 落剣陣（降る剣）· 雷印陣 · 氷結陣 · 風籠陣（吸い込み）· 岩拳陣（岩の拳）· 天元陣",
    "専用アイテムで陣をより早く・広く・多く・長く · 結界（陣の中で被ダメージ減少）· お茶一杯（じっとしていると回復）",
  ],
  ren: [
    "ヴィルディア · フード付きローブの土木の少女 · 体力120 · 武器は素手のみ（武器の代わりにアイテムが出る）",
    "攻撃すると巨大な土木が近くの敵の上に落ちる · 順に打撃 → 縛る → 吹き飛ばす → 押し潰す → 閉じ込める（広く強いが遅い）",
    "周りを回る守護の土木：当たった敵に少しずつダメージ · 遠距離弾を70%の確率で防ぐ（代わりに体当たりは2倍のダメージ）",
    "専用アイテム20個：守護の土木・防御・跳ね返し・余震・大地崩壊・弾ける牢獄など",
  ],
  spiritist: [
    "ヴィルディア · 制服を着た学生の精霊使い · 体力85",
    "本人の攻撃は弱いマジックミサイルだけ · 戦うのは精霊たち：そばの小さな精霊三体（12種からランダム）＋武器の大精霊",
    "30秒ごとに一番古い小さな精霊が去り新しい精霊が来る（鋼鉄・重力・溶鉱炉・鉱脈・影・鋼糸・毒気・虚空・世界樹・茨・胞子・大地）",
    "大精霊10：タイタンコア・アイアンハイド・クロノスパイア・ナイトウィーバー・アンブラ・ベノムハイド・イドラ（大人になった未来のイドラ）・ブライアハート・シルヴァンガード・アビスルイン",
  ],
};
