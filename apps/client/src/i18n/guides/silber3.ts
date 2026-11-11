// 캐릭터 설명: 실베르 (백령) · 한·영·일 (수치는 weaponsBaekryeong·itemsBaekryeong·factionDefs.FACTION_GROWTH와 맞춤) — silber2.ts가 커서 나눔
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SILBER3: Guide = {
  baekryeong: [
    "실베르 · 백령 '영혼과 대태도를 다루는 오니 소녀' · 체력 100 · 공격력 9 · 이동 1.2 · 행운 1 · 처음엔 약하지만 패시브를 먹을수록 강해짐 (진영 특징: 패시브 하나마다 능력치가 더 오름)",
    "대태도: 누르면 바라보는 쪽 앞(거리 34)을 부채꼴로 베어 공격력의 120% (0.47초마다, 공격 속도가 빠를수록 자주 · 사거리 증가만큼 멀리)",
    "영혼 게이지: 적을 때리기보다 처치하면 영혼이 저절로 몸에 쌓임 (보스는 10) · 1칸 15 · 2칸 25 · 3칸 35 · 그 뒤 칸마다 40 · 3칸이 차면 머리 위에 푸른 혼불의 대태도를 든 유령팔이 나와, 벨 때마다 에너지 참격(공격력의 100%)이 앞으로 날아감 (기본 베기보다 멀리·크게) · 그 뒤 칸마다 유령팔·참격이 10%씩 커지고 2배가 되면 멈춤 (게이지도 사라짐)",
    "전용 아이템 20 (모두 새 기술·능력 + 능력치): 혼령참(참격에 망령이 같이 날아감) · 삼위령(망령 셋) · 위백도(망령에 닿으면 검무 소용돌이 추가 피해 3번) · (진)대태도(유령팔이 벨 때 25% 확률로 큰 대태도가 하늘에서 떨어짐) · (진)대태도 - 랑(떨어진 곳 뒤로 맵 끝까지 이어 떨어짐) · (진)대태도 - 백(20% 확률로 범위 끝에 꽂혀 둘레 적에게 번개) · 영혼 포식 · 혼 흡수 · 오니의 뿔 · 넓은 참격 · 이연참 · 청혼불 · 유령 걸음 · 혼의 가호 · 원혼 · 귀신 들림 · 저승 베기 · 혼등 · 서리 혼 · 혼 부름",
  ],
};

export const GUIDE_EN_SILBER3: Guide = {
  baekryeong: [
    "Silber · Baekryeong, the oni girl who wields souls and an odachi · HP 100 · damage 9 · move 1.2 · luck 1 · starts weak but grows with every passive (faction trait: each passive raises stats further)",
    "Odachi: cut a fan in front of you (34 ahead) for 120% of damage (every 0.47s, faster with attack speed · range increases reach farther)",
    "Soul gauge: kills, not hits, fill your body with souls on their own (bosses give 10) · bar 1 needs 15 · bar 2 25 · bar 3 35 · then 40 per bar · at 3 bars a ghost arm holding a blue soulfire odachi appears above your head, and every cut also sends an energy slash flying forward (100% of damage, farther and wider than your cut) · each bar after that grows the arm and slash by 10% until 2x, where it stops (and the gauge vanishes)",
    "20 exclusive items (each a new skill or ability + stats): Wraith Slash (wraiths fly with the slash) · Trinity Wraiths (three wraiths) · Whirling Blades (wraith hits start a sword-dance whirl for 3 more hits) · True Odachi (25% per ghost arm cut to drop a huge odachi from the sky) · True Odachi: Wolf (more keep falling behind it to the map edge) · True Odachi: White (20% to plant one at the edge of your reach that strikes nearby foes with lightning) · Soul Feast · Soul Drain · Oni Horns · Wide Slash · Twin Slash · Blue Soulfire · Ghost Step · Soul Ward · Vengeful Spirits · Possessed · Underworld Cut · Soul Lantern · Frost Soul · Soul Calling",
  ],
};

export const GUIDE_JA_SILBER3: Guide = {
  baekryeong: [
    "シルベル・白霊「魂と大太刀を操る鬼の少女」・体力100・攻撃力9・移動1.2・幸運1・最初は弱いがパッシブを取るほど強くなる（陣営の特徴：パッシブひとつごとに能力値がさらに上がる）",
    "大太刀：押すと向いている方向の前（距離34）を扇形に斬り攻撃力の120%（0.47秒ごと、攻撃速度が速いほど頻繁・射程増加の分だけ遠く）",
    "魂ゲージ：叩くより倒すと魂が自然に体にたまる（ボスは10）・1本目15・2本目25・3本目35・その後1本ごとに40・3本たまると頭上に青い魂火の大太刀を持つ幽霊の腕が現れ、斬るたびにエネルギーの斬撃（攻撃力の100%）が前へ飛ぶ（基本の斬りより遠く大きい）・その後1本ごとに腕と斬撃が10%ずつ大きくなり、2倍で止まる（ゲージも消える）",
    "専用アイテム20（すべて新しい技・能力＋能力値）：霊斬（斬撃と一緒に亡霊が飛ぶ）・三位霊（亡霊3体）・威白刀（亡霊に触れると剣舞の渦で追加3回）・（真）大太刀（幽霊の腕が斬る時25%で巨大な大太刀が空から落ちる）・（真）大太刀・狼（落ちた所の後ろへマップの端まで続けて落ちる）・（真）大太刀・白（20%で範囲の端に刺さり周りの敵に雷）・魂喰らい・魂吸い・鬼の角・広い斬撃・二連斬・青い魂火・幽霊の歩み・魂の加護・怨霊・憑依・冥府斬り・魂灯・霜の魂・魂呼び",
  ],
};
