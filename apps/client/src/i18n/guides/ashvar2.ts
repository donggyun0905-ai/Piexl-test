// 캐릭터 설명: 아슈바르 (루주) · 한·영·일 (수치는 itemsRouge·itemsNoir와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_ASHVAR2: Guide = {
  rouge: [
    "아슈바르 · 루주 '태초의 색채 악마 7원색 군단의 빨강' · 체력 105 · 공격력 9 · 이동 1.35 · 무기는 장미쌍검 하나 · 패시브 없음 · 로비 칩 45만 개로 열기",
    "적응력·강화·승격·제약은 느아르와 같음: 흑이 차면 레벨업(공격력+1·체력+10·재생력+1)과 강화 한 번 · 기본·추가 공격 4단계 · 스킬 강화판 · 하위→중위→고위→대악마 · 일반 방에서는 아이템·패시브를 못 얻음 · 재생 가속은 없음(느아르만)",
    "혈장미: 기본 공격 때 40% 확률로 바닥에 작은 장미 · 닿은 적은 고정 피해 1 + 출혈 · 루주의 출혈은 0.25초마다(다른 출혈의 2배 빠르기) 스택만큼, 5스택까지",
    "기본 공격: 1 적장미 쌍검격(2타) · 2 혈염 난무(약한 4타 + 출혈) · 3 광란의 회전참(몸 둘레 8타 + 출혈) · 4 장미 가시 찌르기(6타 + 터짐 + 출혈) · 추가 공격(30%): 혈화 개화(장미가 퍼짐) · 장미꽃잎 폭풍 · 선혈 가시숲 · 업화의 장미(화상)",
    "스킬(1~4키): 혈영 돌진(꽃잎을 남김) → 혈화 만개 · 장미 낙인 → 광란의 혈검무 · 쌍검 혈월참 → 붉은 장미의 장례(느리게 + 3초 동안 출혈 2배 더 빠름) · 궁극기 진홍의 폭우(장미를 모아 16타) → 종언의 혈장미(장미를 모으고 끌어당겨 장미 수만큼 타수)",
  ],
};

export const GUIDE_EN_ASHVAR2: Guide = {
  rouge: [
    "Ashvar · Rouge, the Red of the Primordial Chromatic Demon Legion · HP 105 · damage 9 · move 1.35 · one weapon, the Twin Rose Blades · no passives · unlock with 450,000 lobby chips",
    "Adaptation, upgrades, promotion and restriction work like Noir's: a full Black gauge levels you up (+1 damage · +10 HP · +1 regen) with one upgrade roll · 4-stage Basic and Extra attacks · empowered skills · Lesser → Middle → Greater → Archdemon · no items or passives from normal rooms · no Regen Boost (Noir only)",
    "Blood Rose: basic attacks have a 40% chance to bloom a small rose on the floor · foes touching it take 1 fixed damage + Bleed · Rouge's Bleed deals its stacks every 0.25s (twice as fast as other Bleeds), up to 5 stacks",
    "Basic attack: 1 Crimson Rose Cross (2 hits) · 2 Blood Flame Frenzy (4 weak hits + Bleed) · 3 Frenzied Spin Slash (8 hits around you + Bleed) · 4 Rose Thorn Thrust (6 hits + burst + Bleed) · extra attack (30%): Blood Blossom (spreads roses) · Rose Petal Storm · Crimson Thorn Forest · Hellfire Rose (Burn)",
    "Skills (keys 1–4): Blood Shadow Rush (leaves petals) → Full Blood Bloom · Rose Brand → Frenzied Blood Dance · Twin Blood Moon → Funeral of Red Roses (slow + Bleed twice as fast again for 3s) · Ultimate Crimson Downpour (gathers roses, 16 hits) → Final Blood Rose (gathers roses, pulls foes, one extra hit per rose)",
  ],
};

export const GUIDE_JA_ASHVAR2: Guide = {
  rouge: [
    "アシュヴァル・ルージュ「太初の色彩悪魔七原色軍団の赤」・体力105・攻撃力9・移動1.35・武器は薔薇の双剣ひとつ・パッシブなし・ロビーチップ45万枚で解放",
    "適応力・強化・昇格・制約はノワールと同じ：黒が満タンでレベルアップ（攻撃力+1・体力+10・再生力+1）と強化1回・基本・追加攻撃4段階・スキル強化版・下位→中位→高位→大悪魔・通常の部屋ではアイテム・パッシブを得られない・再生加速はなし（ノワールのみ）",
    "血薔薇：基本攻撃時40%の確率で床に小さな薔薇・触れた敵に固定ダメージ1＋出血・ルージュの出血は0.25秒ごと（他の出血の2倍速）にスタック分、5スタックまで",
    "基本攻撃：1 赤薔薇双剣撃（2ヒット）・2 血炎乱舞（弱い4ヒット＋出血）・3 狂乱の回転斬（周囲8ヒット＋出血）・4 薔薇の棘突き（6ヒット＋爆発＋出血）・追加攻撃（30%）：血花開花（薔薇が広がる）・薔薇の花びらの嵐・鮮血の棘森・業火の薔薇（火傷）",
    "スキル（1〜4キー）：血影突進（花びらを残す）→ 血花満開・薔薇の烙印 → 狂乱の血剣舞・双剣血月斬 → 赤薔薇の葬礼（鈍足＋3秒間出血がさらに2倍速く）・必殺技 真紅の豪雨（薔薇を集めて16ヒット）→ 終焉の血薔薇（薔薇を集め敵を引き寄せ、薔薇の数だけ追加ヒット）",
  ],
};
