// 캐릭터 설명: 아슈바르 (마젠타·베르) · 한·영·일 (수치는 itemsMagenta·itemsVert·itemsNoir와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_ASHVAR4: Guide = {
  magenta: [
    "아슈바르 · 마젠타 '태초의 색채 악마 7원색 군단의 자홍' · 체력 100 · 공격력 9 · 이동 1.3 · 무기는 욕망의 부채 하나 · 패시브 없음 · 로비 칩 45만 개로 열기",
    "적응력·강화·승격·제약은 느아르와 같음: 흑이 차면 레벨업(공격력+1·체력+10·방어력+1·재생력+1)과 강화 한 번 · 기본·추가 공격 4단계 · 스킬 강화판 · 하위→중위→고위→대악마",
    "저주: 모든 공격이 맞을 때마다 저주를 쌓음(최대 10겹, 4초 동안 안 맞으면 풀림) · 0.5초마다 겹마다 공격력의 6% 저주 피해 · 저주 터뜨리기(낙인·환영 붕괴·성역)는 겹마다 공격력의 35%에 배율을 곱한 큰 피해",
    "매료의 향기: 맞은 적이 12% 확률로 매혹(2.5초 · 분홍 매혹 피해 · 느려지고 마젠타 쪽으로 끌려옴(보스는 느려지기만) · 받는 피해 +10%) · 기본 공격 때 25% 확률로 방 아무 곳에 흐릿한 향기 연기(10초 · 최대 6개 · 안의 적 받는 피해 +10% 더)",
    "기본 공격: 1 자홍 저주비(마우스 자리 3타) · 2 푸시아 만개(마우스 자리 2타) · 3 환영 꽃잎 파동(앞 부채꼴 1타 · 저주 2겹) · 4 저주의 꽃가루(마우스 자리 5타) · 추가 공격(35%): 매혹의 시선(반드시 매혹) · 푸시아 환영분신(그 자리 4타) · 자홍 화산파(강한 1타 · 저주 3겹) · 저주의 낙인(저주 3겹 → 터뜨리기)",
    "스킬(1~4키): 환상의 꽃감옥(묶기·매혹·6타) → 환영 붕괴(저주 2배 터뜨리기) · 악몽의 꽃밭(4초 24타 + 향기 연기 2개) → 영혼 유린(빨아들이는 구체 14타 → 강한 1타) · 유혹의 소용돌이(빨아들이며 30타 → 강한 1타 + 매혹) → 매혹의 강우(방 전체 매혹 + 8타) · 궁극기 독화 침식(세 겹 퍼짐 45타) → 종언의 푸시아 성역(방 전체 매혹·저주 가득 → 20타 → 저주 3배 터뜨리기)",
  ],
};

export const GUIDE_EN_ASHVAR4: Guide = {
  magenta: [
    "Ashvar · Magenta 'the Magenta of the Primordial Chromatic Demon Legion of Seven Colors' · HP 100 · Damage 9 · Move 1.3 · one weapon, the Fan of Desire · no passives · unlock with 450,000 lobby chips",
    "Adaptation, upgrades, ranks and Restraint work like Noir: a full Black gauge levels you up (Damage +1, HP +10, Defense +1, Regen +1) and grants one upgrade · base/extra attacks have 4 stages · skills have upgraded versions · Lesser → Middle → Greater → Arch Demon",
    "Curse: every hit adds a curse stack (max 10, cleared after 4s without a hit) · every 0.5s deals 6% of Damage per stack as Curse damage · curse bursts (Brand, Phantom Collapse, Sanctum) deal 35% of Damage per stack times their multiplier",
    "Scent of Allure: hit enemies have a 12% chance to be Charmed (2.5s · pink Charm damage · slowed and drawn toward Magenta (bosses only slowed) · +10% damage taken) · base attacks have a 25% chance to leave a faint scent cloud anywhere in the room (10s · up to 6 · +10% more damage taken inside)",
    "Base attacks: 1 Magenta Curse Rain (3 hits at cursor) · 2 Fuchsia Full Bloom (2 hits at cursor) · 3 Phantom Petal Wave (1 hit in a cone · 2 stacks) · 4 Cursed Pollen (5 hits at cursor) · Extra attacks (35%): Gaze of Allure (always Charms) · Fuchsia Phantom Clones (4 hits in place) · Magenta Eruption (1 strong hit · 3 stacks) · Brand of Curse (3 stacks → burst)",
    "Skills (keys 1–4): Prison of Illusory Flowers (root, Charm, 6 hits) → Phantom Collapse (2× curse burst) · Garden of Nightmares (24 hits over 4s + 2 scent clouds) → Soul Ravage (pulling orb, 14 hits → 1 strong) · Vortex of Temptation (pulls, 30 hits → 1 strong + Charm) → Rain of Allure (Charms the room + 8 hits) · Ultimate Venom Bloom Erosion (three spreading rings, 45 hits) → Fuchsia Sanctum of the End (room-wide Charm and max curse → 20 hits → 3× curse burst)",
  ],
};

export const GUIDE_JA_ASHVAR4: Guide = {
  magenta: [
    "アシュヴァル・マゼンタ「太初の色彩悪魔七原色軍団の紅紫」・体力100・攻撃力9・移動1.3・武器は欲望の扇ひとつ・パッシブなし・ロビーチップ45万枚で解放",
    "適応力・強化・昇格・制約はノワールと同じ：黒が満タンでレベルアップ（攻撃力+1・体力+10・防御力+1・再生力+1）と強化1回・基本・追加攻撃4段階・スキル強化版・下位→中位→高位→大悪魔",
    "呪い：すべての攻撃が当たるたびに呪いを重ねる（最大10重、4秒当たらないと解ける）・0.5秒ごとに1重につき攻撃力の6%の呪いダメージ・呪い炸裂（烙印・幻影崩壊・聖域）は1重につき攻撃力の35%×倍率の大ダメージ",
    "魅了の香り：当たった敵は12%で魅了（2.5秒・ピンクの魅了ダメージ・遅くなりマゼンタへ引き寄せられる（ボスは遅くなるだけ）・被ダメージ+10%）・基本攻撃時25%で部屋のどこかにかすかな香りの煙（10秒・最大6つ・中の敵はさらに被ダメージ+10%）",
    "基本攻撃：1 紅紫の呪雨（マウス位置3ヒット）・2 フクシア満開（マウス位置2ヒット）・3 幻影花弁の波動（前方扇形1ヒット・呪い2重）・4 呪いの花粉（マウス位置5ヒット）・追加攻撃（35%）：魅惑の視線（必ず魅了）・フクシア幻影分身（その場で4ヒット）・紅紫の火山波（強い1ヒット・呪い3重）・呪いの烙印（呪い3重 → 炸裂）",
    "スキル（1〜4キー）：幻想の花獄（拘束・魅了・6ヒット）→ 幻影崩壊（呪い2倍炸裂）・悪夢の花畑（4秒24ヒット＋香りの煙2つ）→ 魂の蹂躙（吸い込む球体14 → 強い1ヒット）・誘惑の渦（吸い込み30 → 強い1ヒット＋魅了）→ 魅惑の降雨（部屋全体を魅了＋8ヒット）・必殺技 毒花侵食（三重に広がる45ヒット）→ 終焉のフクシア聖域（部屋全体を魅了・呪い最大 → 20ヒット → 呪い3倍炸裂）",
  ],
};

// 베르 (수치는 itemsVert·itemsNoir와 맞춤)
export const GUIDE_KO_ASHVAR5: Guide = {
  vert: [
    "아슈바르 · 베르 '태초의 색채 악마 7원색 군단의 초록' · 체력 105 · 공격력 9 · 이동 1.35 · 무기는 덩굴 쌍낫 하나 · 패시브 없음 · 로비 칩 45만 개로 열기",
    "적응력·강화·승격·제약은 느아르와 같음: 흑이 차면 레벨업과 강화 한 번 · 기본·추가 공격 4단계 · 스킬 강화판 · 하위→중위→고위→대악마",
    "녹독: 모든 공격이 독을 걸음 · 독이 0.25초마다(보통의 2배 빠르기) 들어가고 들어갈수록 세짐(최대 2.5배) · 맞을 때마다 10% 확률로 몸속에 씨앗(최대 5겹) · 씨앗이 독을 45번 받으면 발아: 겹마다 공격력의 250% 큰 한 방 + 출혈·독·화상",
    "기본 공격: 1 녹식 쌍낫격(앞 2타) · 2 가시 회전무(둘레 8타 + 출혈) · 3 부패의 난무(앞 16타 + 출혈) · 4 맹독 덩굴채찍(앞 직선 2타 + 출혈·부식) · 추가 공격(35%)은 씨앗이 있는 가까운 적을 바로 발아: 기생 씨앗 · 체내 개화(꽃이 남아 독가스) · 생명 착취(발아 피해 10% 회복) · 시든 육신(덩굴이 남아 씨앗을 뿌리고, 씨앗이 있던 적은 또 발아해 덩굴이 늘어남 · 최대 8)",
    "스킬(1~4키): 부패의 꽃밭(1.5초 고정 + 독·출혈·부식·화상) → 사령화 조종(쓰러진 적을 덩굴 인형으로 10초) · 가시숲 강림(강한 2타 + 느려짐) → 만개의 포식자(꽃 설치 최대 3, 다가오면 물기) · 대지 부식(방 아무 곳 셋, 3초 고정 + 상태이상) → 천륜 가시무(돌진 후 4·8·32·2타) · 궁극기 기생 덩굴 감옥(씨앗 있는 적 모두 발아 + 3초 고정) → 종언의 생명수확(씨앗 5겹 발아 · 쓰러지면 시든 육신)",
  ],
};

export const GUIDE_EN_ASHVAR5: Guide = {
  vert: [
    "Ashvar · Vert 'the Green of the Primordial Chromatic Demon Legion of Seven Colors' · HP 105 · Damage 9 · Move 1.35 · one weapon, the Twin Vine Scythes · no passives · unlock with 450,000 lobby chips",
    "Adaptation, upgrades, ranks and Restraint work like Noir: a full Black gauge levels you up and grants one upgrade · base/extra attacks have 4 stages · skills have upgraded versions · Lesser → Middle → Greater → Arch Demon",
    "Verdant Venom: every attack poisons · poison ticks every 0.25s (twice the usual speed) and grows stronger (up to 2.5×) · each hit has a 10% chance to plant a seed (up to 5) · after 45 poison ticks the seed sprouts: 250% of Damage per seed in one big hit + bleed, poison and burn",
    "Base attacks: 1 Verdant Twin Slash (2 hits ahead) · 2 Thorn Whirl (8 hits around + bleed) · 3 Frenzy of Decay (16 hits ahead + bleed) · 4 Venom Vine Whip (2 hits in a line + bleed, corrosion) · Extra attacks (35%) sprout the nearest seeded foe at once: Parasitic Seed · Inner Bloom (a flower stays and spreads gas) · Life Siphon (heal 10% of sprout damage) · Withered Husk (a vine stays and spreads seeds; seeded foes sprout again and leave more vines · up to 8)",
    "Skills (keys 1–4): Garden of Decay (1.5s root + poison, bleed, corrosion, burn) → Puppetry of the Dead (raise fallen foes as vine puppets for 10s) · Thornwood Descent (2 strong hits + slow) → Full-Bloom Devourer (plant up to 3 biting flowers) · Earth Corrosion (three random spots, 3s root + ailments) → Heavenwheel Thorn Dance (dash, then 4·8·32·2 hits) · Ultimate Parasite Vine Prison (all seeded foes sprout + 3s root) → Final Harvest of Life (5-seed sprouts · fallen foes leave withered vines)",
  ],
};

export const GUIDE_JA_ASHVAR5: Guide = {
  vert: [
    "アシュヴァル・ヴェール「太初の色彩悪魔七原色軍団の緑」・体力105・攻撃力9・移動1.35・武器は蔓の双鎌ひとつ・パッシブなし・ロビーチップ45万枚で解放",
    "適応力・強化・昇格・制約はノワールと同じ：黒が満ちるとレベルアップと強化1回・基本／追加攻撃4段階・スキル強化版・下位→中位→高位→大悪魔",
    "緑毒：全ての攻撃が毒を付与・毒は0.25秒ごと（通常の2倍の速さ）に入り、入るほど強くなる（最大2.5倍）・ヒットごとに10%で体内に種（最大5重）・種が毒を45回受けると発芽：1重ごとに攻撃力の250%の大ダメージ＋出血・毒・火傷",
    "基本攻撃：1 緑蝕双鎌撃（前方2ヒット）・2 棘の回転舞（周囲8ヒット＋出血）・3 腐敗の乱舞（前方16ヒット＋出血）・4 猛毒の蔓鞭（前方直線2ヒット＋出血・腐食）・追加攻撃（35%）は種のある近くの敵をすぐ発芽：寄生の種・体内開花（花が残り毒ガス）・生命搾取（発芽ダメージ10%回復）・枯れた肉体（蔓が残って種をまき、種のある敵はまた発芽して蔓が増える・最大8）",
    "スキル（1〜4キー）：腐敗の花畑（1.5秒固定＋毒・出血・腐食・火傷）→ 死霊化操縦（倒れた敵を蔓の人形にして10秒）・棘森降臨（強い2ヒット＋鈍化）→ 満開の捕食者（噛みつく花を最大3設置）・大地腐食（部屋のどこか3か所、3秒固定＋状態異常）→ 天輪棘舞（突進後4・8・32・2ヒット）・必殺技 寄生蔓の牢獄（種のある敵が全て発芽＋3秒固定）→ 終焉の生命収穫（種5重で発芽・倒れると枯れた肉体）",
  ],
};
