// 캐릭터 설명: 실베르 (백령·빙설) · 한·영·일 (수치는 weaponsBaekryeong·itemsBaekryeong·weaponsBingseol·itemsBingseol·factionDefs.FACTION_GROWTH와 맞춤) — silber2.ts가 커서 나눔
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SILBER3: Guide = {
  bingseol: [
    "실베르 · 빙설 '얼음을 다루는 자유분방한 해군 소녀' · 체력 95 · 공격력 8 · 이동 1.2 · 행운 1 · 처음엔 약하지만 패시브를 먹을수록 강해짐 (진영 특징: 전용 패시브 하나마다 능력치가 더 오름)",
    "얼음 영역: 늘 몸 둘레(반지름 56, 사거리 증가만큼 넓어짐)에 눈이 내림 · 안에 들어온 적은 움직임·공격이 느려짐 (보스는 조금)",
    "무기 10 (모두 얼음 칼날): 얼음칼(앞 부채꼴) · 얼음 낫(몸 둘레 넓게) · 서리 단검(짧고 빠르게) · 빙하 대검(멀리·세게) · 고드름 창(앞 줄 찌르기) · 빙인 투척(칼날 던지기, 관통 2) · 눈꽃 부채(칼날 셋) · 서리 채찍(좁고 길게) · 빙륜(몸 둘레 한 바퀴) · 눈보라 지팡이(눈덩이 터짐·영역 넓음)",
    "전용 아이템 10 (모두 새 기술·능력 + 능력치): 궁극기-빙설창(공격마다 3% · 3초 기 모아 마우스 쪽으로 · 적마다 슬로우 모션 60연타 · 맵 끝까지 관통) · 빙설무장-활(좌우에 큰 활, 2개까지) · 빙설무장-창(머리 위 창 4~7개가 차례로 생겨 한 개씩 연발) · 얼음가루(공격마다 3~5개, 닿으면 고정 피해 2, 30개까지) · 얼음가루(속)(5개가 모여 유도 얼음, 3번 뒤 1.5초 쉼) · 얼음가루(강)(10개가 모여 관통하는 급속 얼음, 3초 쉼) · 빙격(앞에 빙각, 구속) · 영역강화(눈 결정 벽 5개·방어력 +10·적 탄 막음) · 눈보라 확장(영역 넓게·냉기 피해) · 쇄빙(영역 안 적 피해 증가)",
  ],
  baekryeong: [
    "실베르 · 백령 '영혼과 대태도를 다루는 오니 소녀' · 체력 100 · 공격력 9 · 이동 1.2 · 행운 1 · 처음엔 약하지만 패시브를 먹을수록 강해짐 (진영 특징: 전용 패시브 하나마다 능력치가 더 오름)",
    "대태도: 누르면 바라보는 쪽 앞(거리 34)을 부채꼴로 베어 공격력의 120% (0.47초마다, 공격 속도가 빠를수록 자주 · 사거리 증가만큼 멀리)",
    "영혼 게이지: 적을 때리기보다 처치하면 영혼이 저절로 몸에 쌓임 (보스는 10) · 1칸 15 · 2칸 25 · 3칸 35 · 그 뒤 칸마다 40 · 3칸이 차면 머리 위에 푸른 혼불의 대태도를 든 유령팔이 나와, 벨 때마다 에너지 참격(공격력의 100%)이 앞으로 날아감 (기본 베기보다 멀리·크게) · 그 뒤 칸마다 유령팔·참격이 10%씩 커지고 2배가 되면 멈춤 (게이지도 사라짐)",
    "전용 아이템 20 (모두 새 기술·능력 + 능력치): 혼령참(참격마다 35% 확률로 망령이 같이 날아감) · 삼위령(망령 셋) · 위백도(망령에 닿으면 검무 소용돌이 추가 피해 3번) · (진)대태도(유령팔이 벨 때 25% 확률로 큰 대태도가 하늘에서 떨어짐) · (진)대태도 - 랑(떨어진 곳 뒤로 맵 끝까지 이어 떨어짐) · (진)대태도 - 백(20% 확률로 범위 끝에 꽂혀 둘레 적에게 번개, 맵에 하나만) · 영혼 포식 · 혼 흡수 · 오니의 뿔 · 넓은 참격 · 이연참 · 청혼불(모든 공격에 청염 상태이상) · 유령 걸음 · 혼의 가호 · 원혼 · 귀신 들림 · 저승 베기 · 혼등 · 서리 혼 · 혼 부름",
  ],
};

export const GUIDE_EN_SILBER3: Guide = {
  bingseol: [
    "Silber · Bingseol, the free-spirited navy girl of ice · HP 95 · damage 8 · move 1.2 · luck 1 · starts weak but grows with every passive (faction trait: each exclusive passive raises stats further)",
    "Frost field: snow always falls around her (radius 56, wider with range) · foes inside move and attack more slowly (bosses a little)",
    "10 weapons (all ice blades): Ice Blade (fan ahead) · Ice Scythe (wide sweep around you) · Frost Dagger (short and fast) · Glacier Greatsword (far and heavy) · Icicle Pike (thrust in a line) · Ice Edge Throw (thrown blade, pierces 2) · Snowflake Fan (three blades) · Frost Whip (narrow and long) · Ice Wheel (full circle) · Blizzard Staff (bursting snowball, wider field)",
    "10 exclusive items (each a new skill or ability + stats): Ultimate Frostsnow Lance (3% per attack · charges 3s, flies toward your mouse · 60 slow-motion hits on every foe · pierces to the map edge) · Frost Arms: Bow (giant bows at your sides, up to 2) · Frost Arms: Spears (4-7 spears form above you one by one, then fire one at a time) · Ice Dust (3-5 per attack, 2 fixed damage on touch, up to 30) · Ice Dust: Swift (5 gather into homing ice, rests 1.5s after 3) · Ice Dust: Strong (10 gather into piercing rapid ice, rests 3s) · Ice Strike (ice spike ahead, binds) · Field Fortify (5 snow-crystal walls, +10 defense, block shots) · Spreading Blizzard (wider field, chill damage) · Icebreaker (more damage inside the field)",
  ],
  baekryeong: [
    "Silber · Baekryeong, the oni girl who wields souls and an odachi · HP 100 · damage 9 · move 1.2 · luck 1 · starts weak but grows with every passive (faction trait: each exclusive passive raises stats further)",
    "Odachi: cut a fan in front of you (34 ahead) for 120% of damage (every 0.47s, faster with attack speed · range increases reach farther)",
    "Soul gauge: kills, not hits, fill your body with souls on their own (bosses give 10) · bar 1 needs 15 · bar 2 25 · bar 3 35 · then 40 per bar · at 3 bars a ghost arm holding a blue soulfire odachi appears above your head, and every cut also sends an energy slash flying forward (100% of damage, farther and wider than your cut) · each bar after that grows the arm and slash by 10% until 2x, where it stops (and the gauge vanishes)",
    "20 exclusive items (each a new skill or ability + stats): Wraith Slash (35% chance per slash for a wraith to fly with it) · Trinity Wraiths (three wraiths) · Whirling Blades (wraith hits start a sword-dance whirl for 3 more hits) · True Odachi (25% per ghost arm cut to drop a huge odachi from the sky) · True Odachi: Wolf (more keep falling behind it to the map edge) · True Odachi: White (20% to plant one at the edge of your reach that strikes nearby foes with lightning) · Soul Feast · Soul Drain · Oni Horns · Wide Slash · Twin Slash · Blue Soulfire · Ghost Step · Soul Ward · Vengeful Spirits · Possessed · Underworld Cut · Soul Lantern · Frost Soul · Soul Calling",
  ],
};

export const GUIDE_JA_SILBER3: Guide = {
  bingseol: [
    "シルベル・氷雪「氷を操る自由奔放な海軍少女」・体力95・攻撃力8・移動1.2・幸運1・最初は弱いがパッシブを取るほど強くなる（陣営の特徴：専用パッシブひとつごとに能力値がさらに上がる）",
    "氷の領域：いつも体の周り（半径56、射程増加の分だけ広がる）に雪が降る・中に入った敵は動きと攻撃が遅くなる（ボスは少し）",
    "武器10（すべて氷の刃）：氷の剣（前に扇形）・氷の鎌（体の周りを広く）・霜の短剣（短く速く）・氷河の大剣（遠く強く）・つららの槍（前に一直線の突き）・氷刃投げ（刃を投げる、貫通2）・雪花の扇（刃3本）・霜の鞭（狭く長く）・氷輪（体の周りを一周）・吹雪の杖（雪玉が弾ける・領域が広い）",
    "専用アイテム10（すべて新しい技・能力＋能力値）：奥義・氷雪槍（攻撃ごとに3%・3秒力をためマウスの方向へ・敵ごとにスローモーション60連打・マップの端まで貫通）・氷雪武装・弓（左右に大きな弓、2個まで）・氷雪武装・槍（頭上に槍4～7本が順に現れ1本ずつ連発）・氷の粉（攻撃ごとに3～5個、触れると固定ダメージ2、30個まで）・氷の粉（速）（5個が集まって誘導氷、3回のあと1.5秒休む）・氷の粉（強）（10個が集まって貫通する急速氷、3秒休む）・氷撃（前に氷の棘、拘束）・領域強化（雪の結晶の壁5個・防御力+10・敵の弾を防ぐ）・吹雪拡張（領域が広く・冷気ダメージ）・砕氷（領域内の敵へのダメージ増加）",
  ],
  baekryeong: [
    "シルベル・白霊「魂と大太刀を操る鬼の少女」・体力100・攻撃力9・移動1.2・幸運1・最初は弱いがパッシブを取るほど強くなる（陣営の特徴：専用パッシブひとつごとに能力値がさらに上がる）",
    "大太刀：押すと向いている方向の前（距離34）を扇形に斬り攻撃力の120%（0.47秒ごと、攻撃速度が速いほど頻繁・射程増加の分だけ遠く）",
    "魂ゲージ：叩くより倒すと魂が自然に体にたまる（ボスは10）・1本目15・2本目25・3本目35・その後1本ごとに40・3本たまると頭上に青い魂火の大太刀を持つ幽霊の腕が現れ、斬るたびにエネルギーの斬撃（攻撃力の100%）が前へ飛ぶ（基本の斬りより遠く大きい）・その後1本ごとに腕と斬撃が10%ずつ大きくなり、2倍で止まる（ゲージも消える）",
    "専用アイテム20（すべて新しい技・能力＋能力値）：霊斬（斬撃ごとに35%の確率で亡霊が一緒に飛ぶ）・三位霊（亡霊3体）・威白刀（亡霊に触れると剣舞の渦で追加3回）・（真）大太刀（幽霊の腕が斬る時25%で巨大な大太刀が空から落ちる）・（真）大太刀・狼（落ちた所の後ろへマップの端まで続けて落ちる）・（真）大太刀・白（20%で範囲の端に刺さり周りの敵に雷）・魂喰らい・魂吸い・鬼の角・広い斬撃・二連斬・青い魂火・幽霊の歩み・魂の加護・怨霊・憑依・冥府斬り・魂灯・霜の魂・魂呼び",
  ],
};
