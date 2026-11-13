// 캐릭터 설명: 아슈바르 (마젠타) · 한·영·일 (수치는 itemsMagenta·itemsNoir와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_ASHVAR4: Guide = {
  magenta: [
    "아슈바르 · 마젠타 '태초의 색채 악마 7원색 군단의 자홍' · 체력 100 · 공격력 9 · 이동 1.3 · 무기는 욕망의 부채 하나 · 패시브 없음 · 로비 칩 45만 개로 열기",
    "적응력·강화·승격·제약은 느아르와 같음: 흑이 차면 레벨업(공격력+1·체력+10·방어력+1·재생력+1)과 강화 한 번 · 기본·추가 공격 4단계 · 스킬 강화판 · 하위→중위→고위→대악마",
    "저주: 모든 공격이 맞을 때마다 저주를 쌓음(최대 10겹, 4초 동안 안 맞으면 풀림) · 0.5초마다 겹마다 공격력의 6% 저주 피해 · 저주 터뜨리기(낙인·환영 붕괴·성역)는 겹마다 공격력의 35%에 배율을 곱한 큰 피해",
    "매료의 향기: 맞은 적이 12% 확률로 매혹(2.5초 · 분홍 매혹 피해 · 느려지고 마젠타 쪽으로 끌려옴(보스는 느려지기만) · 받는 피해 +10%) · 기본 공격 때 25% 확률로 방 아무 곳에 흐릿한 향기 연기(10초 · 최대 6개 · 안의 적 받는 피해 +10% 더)",
    "기본 공격: 1 자홍 저주비(마우스 자리 3타) · 2 푸시아 만개(마우스 자리 2타) · 3 환영 꽃잎 파동(앞 부채꼴 1타 · 저주 2겹) · 4 저주의 꽃가루(마우스 자리 6타) · 추가 공격(35%): 매혹의 시선(반드시 매혹) · 푸시아 환영분신(그 자리 5타) · 자홍 화산파(강한 1타 · 저주 3겹) · 저주의 낙인(저주 3겹 → 터뜨리기)",
    "스킬(1~4키): 환상의 꽃감옥(묶기·매혹·8타) → 환영 붕괴(저주 2배 터뜨리기) · 악몽의 꽃밭(5초 30타 + 향기 연기 2개) → 영혼 유린(빨아들이는 구체 20타 → 강한 1타) · 유혹의 소용돌이(빨아들이며 40타 → 강한 1타 + 매혹) → 매혹의 강우(방 전체 매혹 + 12타) · 궁극기 독화 침식(세 겹 퍼짐 45타) → 종언의 푸시아 성역(방 전체 매혹·저주 가득 → 20타 → 저주 3배 터뜨리기)",
  ],
};

export const GUIDE_EN_ASHVAR4: Guide = {
  magenta: [
    "Ashvar · Magenta 'the Magenta of the Primordial Chromatic Demon Legion of Seven Colors' · HP 100 · Damage 9 · Move 1.3 · one weapon, the Fan of Desire · no passives · unlock with 450,000 lobby chips",
    "Adaptation, upgrades, ranks and Restraint work like Noir: a full Black gauge levels you up (Damage +1, HP +10, Defense +1, Regen +1) and grants one upgrade · base/extra attacks have 4 stages · skills have upgraded versions · Lesser → Middle → Greater → Arch Demon",
    "Curse: every hit adds a curse stack (max 10, cleared after 4s without a hit) · every 0.5s deals 6% of Damage per stack as Curse damage · curse bursts (Brand, Phantom Collapse, Sanctum) deal 35% of Damage per stack times their multiplier",
    "Scent of Allure: hit enemies have a 12% chance to be Charmed (2.5s · pink Charm damage · slowed and drawn toward Magenta (bosses only slowed) · +10% damage taken) · base attacks have a 25% chance to leave a faint scent cloud anywhere in the room (10s · up to 6 · +10% more damage taken inside)",
    "Base attacks: 1 Magenta Curse Rain (3 hits at cursor) · 2 Fuchsia Full Bloom (2 hits at cursor) · 3 Phantom Petal Wave (1 hit in a cone · 2 stacks) · 4 Cursed Pollen (6 hits at cursor) · Extra attacks (35%): Gaze of Allure (always Charms) · Fuchsia Phantom Clones (5 hits in place) · Magenta Eruption (1 strong hit · 3 stacks) · Brand of Curse (3 stacks → burst)",
    "Skills (keys 1–4): Prison of Illusory Flowers (root, Charm, 8 hits) → Phantom Collapse (2× curse burst) · Garden of Nightmares (30 hits over 5s + 2 scent clouds) → Soul Ravage (pulling orb, 20 hits → 1 strong) · Vortex of Temptation (pulls, 40 hits → 1 strong + Charm) → Rain of Allure (Charms the room + 12 hits) · Ultimate Venom Bloom Erosion (three spreading rings, 45 hits) → Fuchsia Sanctum of the End (room-wide Charm and max curse → 20 hits → 3× curse burst)",
  ],
};

export const GUIDE_JA_ASHVAR4: Guide = {
  magenta: [
    "アシュヴァル・マゼンタ「太初の色彩悪魔七原色軍団の紅紫」・体力100・攻撃力9・移動1.3・武器は欲望の扇ひとつ・パッシブなし・ロビーチップ45万枚で解放",
    "適応力・強化・昇格・制約はノワールと同じ：黒が満タンでレベルアップ（攻撃力+1・体力+10・防御力+1・再生力+1）と強化1回・基本・追加攻撃4段階・スキル強化版・下位→中位→高位→大悪魔",
    "呪い：すべての攻撃が当たるたびに呪いを重ねる（最大10重、4秒当たらないと解ける）・0.5秒ごとに1重につき攻撃力の6%の呪いダメージ・呪い炸裂（烙印・幻影崩壊・聖域）は1重につき攻撃力の35%×倍率の大ダメージ",
    "魅了の香り：当たった敵は12%で魅了（2.5秒・ピンクの魅了ダメージ・遅くなりマゼンタへ引き寄せられる（ボスは遅くなるだけ）・被ダメージ+10%）・基本攻撃時25%で部屋のどこかにかすかな香りの煙（10秒・最大6つ・中の敵はさらに被ダメージ+10%）",
    "基本攻撃：1 紅紫の呪雨（マウス位置3ヒット）・2 フクシア満開（マウス位置2ヒット）・3 幻影花弁の波動（前方扇形1ヒット・呪い2重）・4 呪いの花粉（マウス位置6ヒット）・追加攻撃（35%）：魅惑の視線（必ず魅了）・フクシア幻影分身（その場で5ヒット）・紅紫の火山波（強い1ヒット・呪い3重）・呪いの烙印（呪い3重 → 炸裂）",
    "スキル（1〜4キー）：幻想の花獄（拘束・魅了・8ヒット）→ 幻影崩壊（呪い2倍炸裂）・悪夢の花畑（5秒30ヒット＋香りの煙2つ）→ 魂の蹂躙（吸い込む球体20 → 強い1ヒット）・誘惑の渦（吸い込み40 → 強い1ヒット＋魅了）→ 魅惑の降雨（部屋全体を魅了＋12ヒット）・必殺技 毒花侵食（三重に広がる45ヒット）→ 終焉のフクシア聖域（部屋全体を魅了・呪い最大 → 20ヒット → 呪い3倍炸裂）",
  ],
};
