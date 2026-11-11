import type { PatchNote } from "./types";

// 지난 패치 노트 0.52.17~0.52.19 (latest.ts에서 옮김)
export const NOTES: PatchNote[] = [
  {
    version: "0.52.19",
    date: "2026-11-11",
    items: {
      ko: [
        "백령 (진)대태도: 떨어지는 범위를 절반으로 (반지름 40 → 20, 검 그림 크기는 그대로)",
        "백령 (진)대태도 - 랑: 이어 떨어지는 대태도 범위를 더 작게 (대태도의 85% → 70%) · 간격을 촘촘하게 (56 → 22, 더 빠르게) · 맵 끝 가까이에서 터져도 검이 여러 개 이어 보임",
        "백령 (진)대태도 - 백: 꽂힌 대태도는 맵에 하나만 (사라진 뒤에 다시 확률로 생김)",
        "백령 청혼불: 화상 대신 블루 플레임과 같은 청염 상태이상 (적 머리 위 푸른 불꽃 · 2.5초 동안 0.5초마다 공격력의 32%) · 기본 베기뿐 아니라 참격·망령·소용돌이·대태도·번개·유령 걸음·혼등 모든 공격에 걸림",
      ],
      en: [
        "Baekryeong True Odachi: impact area halved (radius 40 → 20, sword art unchanged)",
        "Baekryeong True Odachi: Wolf: the trailing odachi hit a smaller area (85% → 70% of the odachi) · tighter spacing (56 → 22, and faster) · several swords now line up even when it triggers near the map edge",
        "Baekryeong True Odachi: White: only one planted odachi on the map at a time (it can appear again by chance once it fades)",
        "Baekryeong Blue Soulfire: instead of a regular burn, it now applies the same Blue Flame status as Blue Flame (blue flame above the foe · 32% of damage every 0.5s for 2.5s) · applies on every attack, not just cuts: slashes, wraiths, whirls, odachi, lightning, Ghost Step and Soul Lantern",
      ],
      ja: [
        "白霊（真）大太刀：落ちる範囲を半分に（半径40→20、剣の絵の大きさはそのまま）",
        "白霊（真）大太刀・狼：続けて落ちる大太刀の範囲をさらに小さく（大太刀の85%→70%）・間隔を細かく（56→22、より速く）・マップの端近くで起きても剣が何本も続いて見える",
        "白霊（真）大太刀・白：刺さった大太刀はマップにひとつだけ（消えた後にまた確率で現れる）",
        "白霊・青い魂火：普通の火傷ではなくブルーフレームと同じ青炎の状態異常（敵の頭上に青い炎・2.5秒間0.5秒ごとに攻撃力の32%）・基本の斬りだけでなく斬撃・亡霊・渦・大太刀・雷・幽霊の歩み・魂灯のすべての攻撃でかかる",
      ],
    },
  },
  {
    version: "0.52.18",
    date: "2026-11-11",
    items: {
      ko: ["백령 위백도: 검무 소용돌이가 빙글빙글 돌지 않고, 망령에 닿은 순간부터 그림 1→2→3→4칸이 영상처럼 차례로 한 번 재생됨 (추가 피해 3번 동안) · 유령팔 에너지 참격도 1칸부터 4칸까지 차례로 커지며 날아감"],
      en: ["Baekryeong Whirling Blades: the sword-dance whirl no longer spins; from the moment a wraith hits, frames 1→2→3→4 play once in order like a clip (over the 3 extra hits) · ghost arm energy slashes also grow through frames 1 to 4 as they fly"],
      ja: ["白霊・威白刀：剣舞の渦がくるくる回らず、亡霊が触れた瞬間から絵の1→2→3→4コマが映像のように順に一度だけ再生（追加3回の間）・幽霊の腕のエネルギー斬撃も1コマから4コマまで順に大きくなって飛ぶ"],
    },
  },
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
