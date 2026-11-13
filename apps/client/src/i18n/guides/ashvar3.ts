// 캐릭터 설명: 아슈바르 (존) · 한·영·일 (수치는 itemsJaune·itemsNoir와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_ASHVAR3: Guide = {
  jaune: [
    "아슈바르 · 존 '태초의 색채 악마 7원색 군단의 노랑' · 체력 100 · 공격력 6(매우 낮음) · 이동 1.35 · 무기는 금빛 손아귀 하나 · 패시브 없음 · 로비 칩 45만 개로 열기",
    "적응력·강화·승격·제약은 느아르와 같음: 흑이 차면 레벨업(공격력+1·체력+10·방어력+1·재생력+1)과 강화 한 번 · 기본·추가 공격 4단계 · 스킬 강화판 · 하위→중위→고위→대악마",
    "황금 번개: 모든 공격이 번개(감전, 상태이상) 피해 · 번개가 맞으면 같은 적에게 추가 타격 3번(그 피해의 100% · 70% · 30%) · 세기는 매우매우 약하게 0.1 · 매우 약하게 0.2 · 약하게 0.45 · 보통 0.8 · 강하게 1.8 (공격력 배)",
    "기본 공격: 1 황뢰 할퀴기(앞 부채꼴 1타) · 2 벽력일섬(직선 관통 3타) · 3 뇌광 연속격(바로 앞 4타) · 4 황금 번개 주먹(직선 강한 2타) · 추가 공격(35%): 지그재그 뇌격(직선 4타) · 황뢰 낙하(마우스 자리 강한 1타) · 번개 분신(앞 6타) · 뇌전 구속(마우스 자리 묶고 3타 → 강한 1타)",
    "스킬(1~4키): 황금 뇌구(날아가는 구체 6타 → 15타) → 광란의 천뢰(강한 1타 → 30타) · 혼돈의 낙뢰(마우스 자리 7타 → 강한 3타) → 초월 벽력일섬(거대한 직선 15타 → 강한 1타) · 뇌신의 손아귀(앞 30타 → 강한 1타) → 황뢰 천수(앞 60타 → 강한 1타) · 궁극기 천둥의 발자취(무적 돌진 + 둘레 77타) → 종언의 황천뢰(구체가 닿은 적 자리에서 15타 + 70타)",
  ],
};

export const GUIDE_EN_ASHVAR3: Guide = {
  jaune: [
    "Ashvar · Jaune, the Yellow of the Primordial Chromatic Demon Legion · HP 100 · damage 6 (very low) · move 1.35 · one weapon, the Golden Grip · no passives · unlock with 450,000 lobby chips",
    "Adaptation, upgrades, promotion and restriction work like Noir's: a full Black gauge levels you up (+1 damage · +10 HP · +1 defense · +1 regen) with one upgrade roll · 4-stage Basic and Extra attacks · empowered skills · Lesser → Middle → Greater → Archdemon",
    "Golden Lightning: every attack deals Lightning (Shock, status) damage · each Lightning hit is followed by 3 extra strikes on the same foe (100% · 70% · 30% of it) · strengths: extremely weak 0.1 · very weak 0.2 · weak 0.45 · normal 0.8 · strong 1.8 (× damage)",
    "Basic attack: 1 Golden Thunder Claw (1 hit in a cone) · 2 Thunderclap Flash (3 piercing hits in a line) · 3 Lightning Flurry (4 hits right ahead) · 4 Golden Lightning Fist (2 strong hits in a line) · extra attack (35%): Zigzag Bolt (4 in a line) · Golden Thunderfall (1 strong at the cursor) · Lightning Doppelgangers (6 ahead) · Thunder Bind (roots at the cursor, 3 hits → 1 strong)",
    "Skills (keys 1–4): Golden Thunder Orb (flying orb, 6 → 15 hits) → Frenzied Heaven Thunder (1 strong → 30) · Chaos Thunderfall (7 → 3 strong at the cursor) → Transcendent Thunderclap Flash (huge line, 15 → 1 strong) · Grasp of the Thunder God (30 → 1 strong ahead) → Thousand Golden Thunder Hands (60 → 1 strong) · Ultimate Footsteps of Thunder (invulnerable dash + 77 hits around you) → Golden Heaven Thunder of the End (15 + 70 hits where the orb strikes)",
  ],
};

export const GUIDE_JA_ASHVAR3: Guide = {
  jaune: [
    "アシュヴァル・ジョーヌ「太初の色彩悪魔七原色軍団の黄」・体力100・攻撃力6（とても低い）・移動1.35・武器は金色の掌握ひとつ・パッシブなし・ロビーチップ45万枚で解放",
    "適応力・強化・昇格・制約はノワールと同じ：黒が満タンでレベルアップ（攻撃力+1・体力+10・防御力+1・再生力+1）と強化1回・基本・追加攻撃4段階・スキル強化版・下位→中位→高位→大悪魔",
    "黄金の雷：すべての攻撃が雷（感電、状態異常）ダメージ・雷が当たると同じ敵に追加打撃3回（そのダメージの100%・70%・30%）・強さは極めて弱い0.1・非常に弱い0.2・弱い0.45・普通0.8・強い1.8（攻撃力倍）",
    "基本攻撃：1 黄雷の引っ掻き（前方扇形1ヒット）・2 霹靂一閃（直線貫通3ヒット）・3 雷光連続撃（すぐ前4ヒット）・4 黄金雷拳（直線に強い2ヒット）・追加攻撃（35%）：ジグザグ雷撃（直線4ヒット）・黄雷落下（マウス位置に強い1ヒット）・雷の分身（前方6ヒット）・雷電拘束（マウス位置で拘束し3ヒット → 強い1ヒット）",
    "スキル（1〜4キー）：黄金雷球（飛ぶ球体6 → 15ヒット）→ 狂乱の天雷（強い1 → 30ヒット）・混沌の落雷（マウス位置7 → 強い3ヒット）→ 超越霹靂一閃（巨大な直線15 → 強い1ヒット）・雷神の掌握（前方30 → 強い1ヒット）→ 黄雷千手（前方60 → 強い1ヒット）・必殺技 雷鳴の足跡（無敵の突進＋周り77ヒット）→ 終焉の黄天雷（球体が当たった敵の位置で15＋70ヒット）",
  ],
};
