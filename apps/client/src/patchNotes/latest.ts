import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.17",
    date: "2026-11-11",
    items: {
      ko: [
        "새 캐릭터 백령 (실베르): 영혼과 대태도를 다루는 오니 소녀 · 누르면 앞을 대태도로 부채꼴 베기 (공격력의 120%) · 무기는 대태도 하나",
        "영혼 게이지: 적을 처치하면 영혼이 저절로 몸에 쌓임 (보스는 10 · 1칸 15 · 2칸 25 · 3칸 35 · 그 뒤 칸마다 40) · 3칸이 차면 머리 위에 푸른 혼불의 대태도를 든 유령팔이 나와 벨 때마다 에너지 참격이 같이 날아감 (기본 베기보다 멀리·크게) · 그 뒤 칸마다 유령팔·참격이 10%씩 커지고 2배가 되면 멈추고 게이지도 사라짐",
        "전용 패시브 20 (모두 새 기술·능력 + 능력치): 혼령참(참격에 망령이 같이 날아감) · 삼위령(망령 셋) · 위백도(망령에 닿으면 검무 소용돌이 추가 피해 3번) · (진)대태도(유령팔이 벨 때 25% 확률로 하늘에서 큰 대태도가 떨어짐) · (진)대태도 - 랑(떨어진 곳 뒤로 맵 끝까지 이어 떨어짐) · (진)대태도 - 백(20% 확률로 범위 끝에 대태도가 꽂혀 둘레 적에게 번개) · 영혼 포식 · 혼 흡수 · 오니의 뿔 · 넓은 참격 · 이연참 · 청혼불 · 유령 걸음 · 혼의 가호 · 원혼 · 귀신 들림 · 저승 베기 · 혼등 · 서리 혼 · 혼 부름",
        "백령 그림 시트·이펙트(참격·검무 소용돌이·망령·유령팔·대태도)·아이콘·효과음·글자(한·영·일)·업적·패왕전 스킬",
      ],
      en: [
        "New character Baekryeong (Silber): an oni girl who wields souls and an odachi · cut a fan in front of you with the odachi (120% of damage) · one weapon, the odachi",
        "Soul gauge: kills fill your body with souls on their own (bosses give 10 · bar 1 needs 15 · bar 2 25 · bar 3 35 · then 40 per bar) · at 3 bars a ghost arm holding a blue soulfire odachi appears above your head and sends an energy slash with every cut (farther and wider than your cut) · each bar after that grows the arm and slash by 10%, stopping at 2x, where the gauge vanishes",
        "20 exclusive passives (each a new skill or ability + stats): Wraith Slash (wraiths fly with the slash) · Trinity Wraiths (three wraiths) · Whirling Blades (wraith hits start a sword-dance whirl for 3 more hits) · True Odachi (25% per ghost arm cut to drop a huge odachi from the sky) · True Odachi: Wolf (more keep falling behind it to the map edge) · True Odachi: White (20% to plant an odachi at the edge of your reach that strikes nearby foes with lightning) · Soul Feast · Soul Drain · Oni Horns · Wide Slash · Twin Slash · Blue Soulfire · Ghost Step · Soul Ward · Vengeful Spirits · Possessed · Underworld Cut · Soul Lantern · Frost Soul · Soul Calling",
        "Baekryeong sprite sheet, effects (slashes, sword-dance whirls, wraiths, ghost arm, odachi), icons, sounds, text (KO/EN/JA), achievement and Paewang skills",
      ],
      ja: [
        "新キャラ白霊（シルベル）：魂と大太刀を操る鬼の少女・押すと前を大太刀で扇形に斬る（攻撃力の120%）・武器は大太刀ひとつ",
        "魂ゲージ：敵を倒すと魂が自然に体にたまる（ボスは10・1本目15・2本目25・3本目35・その後1本ごとに40）・3本たまると頭上に青い魂火の大太刀を持つ幽霊の腕が現れ、斬るたびにエネルギーの斬撃が一緒に飛ぶ（基本の斬りより遠く大きい）・その後1本ごとに腕と斬撃が10%ずつ大きくなり、2倍で止まってゲージも消える",
        "専用パッシブ20（すべて新しい技・能力＋能力値）：霊斬（斬撃と一緒に亡霊が飛ぶ）・三位霊（亡霊3体）・威白刀（亡霊に触れると剣舞の渦で追加3回）・（真）大太刀（幽霊の腕が斬る時25%で空から巨大な大太刀が落ちる）・（真）大太刀・狼（落ちた所の後ろへマップの端まで続けて落ちる）・（真）大太刀・白（20%で範囲の端に大太刀が刺さり周りの敵に雷）・魂喰らい・魂吸い・鬼の角・広い斬撃・二連斬・青い魂火・幽霊の歩み・魂の加護・怨霊・憑依・冥府斬り・魂灯・霜の魂・魂呼び",
        "白霊のスプライトシート・エフェクト（斬撃・剣舞の渦・亡霊・幽霊の腕・大太刀）・アイコン・効果音・テキスト（日韓英）・実績・覇王戦スキル",
      ],
    },
  },
];
