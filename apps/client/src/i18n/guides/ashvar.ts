// 캐릭터 설명: 아슈바르 (느아르) · 한·영·일 (수치는 itemsNoir와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_ASHVAR: Guide = {
  noir: [
    "아슈바르 · 느아르 '태초의 색채 악마 7원색 군단의 검정' · 체력 110 · 공격력 9 · 이동 1.3 · 무기는 공허의 손톱 하나 · 패시브 없음 · 로비 칩 45만 개로 열기",
    "적응력: 적을 쓰러뜨리면 흑이 차고(풋내기 경험치와 같은 양, 레벨마다 필요량은 풋내기의 2배) 가득 차면 레벨업 → 공격력+1·체력+10·재생력+1, 강화 한 번",
    "강화: 기본공격·추가공격 4단계(2단계 75% · 3단계 50% · 4단계 20%) · 스킬공격은 스킬 4개 중 하나를 골라 강화판으로(50%) · 실패하면 다음 확률 +5%(승격은 안 오름), 성공하면 처음 확률로",
    "승격: 하위악마 → 중위(50%, 공격력+5·체력+40·재생력+5) → 고위(25%, 공격력+3%·체력+5%·재생력+5) → 대악마(10%, 공격력+25%·체력+25%·재생력+15, 기본·추가 3단계 이상) · 계급마다 등 뒤 마크가 바뀜",
    "기본 공격: 1 칠흑 횡베기(넓게 1타) · 2 무형의 난무(1·3·5타 + 큰 한방) · 3 공허의 회전참(몸 둘레 15타, 점점 세짐) · 4 절대 단절(빨아들이며 15타 → 터짐) · 추가 공격(30% 확률): 심연의 손아귀 · 공간 압축 · 마력 소멸 · 공허 포식",
    "스킬(1~4키, 처음부터 열림): 흑영 돌진 → 시초의 공허 · 공허의 낙인 → 차원 절멸 · 결계 붕괴 → 무한 심연 · 궁극기 흑월 강림 → 태초의 종언(죽음 피해 + 충격파 3번)",
    "제약: 일반 방(보물방·상점·황금방·보상)에서는 아이템·패시브를 못 얻음 · 비밀방·히든 상점·시련의 방은 됨 · 대장장이·성좌의 방·단련의 방·쉼터 회복 못 씀 · 재생 가속: 재생력이 2.5배 빨리 참",
  ],
};

export const GUIDE_EN_ASHVAR: Guide = {
  noir: [
    "Ashvar · Noir, the Black of the Primordial Chromatic Demon Legion · HP 110 · damage 9 · move 1.3 · one weapon, the Void Claw · no passives · unlock with 450,000 lobby chips",
    "Adaptation: kills fill the Black gauge (same amount as the Novice's EXP; each level needs twice the Novice's amount); when full you level up → +1 damage · +10 HP · +1 regen, and one upgrade roll",
    "Upgrades: Basic and Extra attacks have 4 stages (stage 2 75% · stage 3 50% · stage 4 20%) · Skills: pick one of 4 skills to empower (50%) · each failure adds +5% to the next try (not for promotion), success resets it",
    "Promotion: Lesser Demon → Middle (50%, +5 damage · +40 HP · +5 regen) → Greater (25%, +3% damage · +5% HP · +5 regen) → Archdemon (10%, +25% damage · +25% HP · +15 regen, needs Basic & Extra stage 3+) · the mark behind Noir changes with rank",
    "Basic attack: 1 Jet-Black Sweep (wide, 1 hit) · 2 Formless Frenzy (1·3·5 hits + a big blow) · 3 Void Spin Slash (15 hits around you, growing stronger) · 4 Absolute Severance (pulls in, 15 hits → burst) · extra attack (30% chance): Abyssal Grasp · Space Compression · Mana Annihilation · Void Devour",
    "Skills (keys 1–4, open from the start): Shadow Rush → Primordial Void · Void Brand → Dimension Annihilation · Barrier Collapse → Infinite Abyss · Ultimate Black Moon Descent → End of the Beginning (Death damage + 3 shockwaves)",
    "Restriction: no items or passives from normal rooms (treasure, shop, golden room, rewards) · secret rooms, the hidden shop and trial rooms are fine · no blacksmith, constellation room, training room or rest healing · Regen Boost: regeneration fills 2.5× faster",
  ],
};

export const GUIDE_JA_ASHVAR: Guide = {
  noir: [
    "アシュヴァル・ノワール「太初の色彩悪魔七原色軍団の黒」・体力110・攻撃力9・移動1.3・武器は虚無の爪ひとつ・パッシブなし・ロビーチップ45万枚で解放",
    "適応力：敵を倒すと黒が溜まり（ルーキーの経験値と同じ量、各レベルの必要量はルーキーの2倍）、満タンでレベルアップ → 攻撃力+1・体力+10・再生力+1、強化1回",
    "強化：基本攻撃・追加攻撃は4段階（2段階75%・3段階50%・4段階20%）・スキル攻撃は4つのうち1つを選んで強化版に（50%）・失敗すると次の確率+5%（昇格は上がらない）、成功すると元に戻る",
    "昇格：下位悪魔 → 中位（50%、攻撃力+5・体力+40・再生力+5）→ 高位（25%、攻撃力+3%・体力+5%・再生力+5）→ 大悪魔（10%、攻撃力+25%・体力+25%・再生力+15、基本・追加3段階以上）・位階ごとに背中の紋章が変わる",
    "基本攻撃：1 漆黒横斬り（広く1ヒット）・2 無形の乱舞（1・3・5ヒット＋大きな一撃）・3 虚無の回転斬（周囲15ヒット、だんだん強く）・4 絶対断絶（吸い寄せて15ヒット → 弾ける）・追加攻撃（30%）：深淵の掌握・空間圧縮・魔力消滅・虚無捕食",
    "スキル（1〜4キー、最初から使える）：黒影突進 → 始原の虚無・虚無の烙印 → 次元絶滅・結界崩壊 → 無限深淵・必殺技 黒月降臨 → 太初の終焉（死ダメージ＋衝撃波3回）",
    "制約：通常の部屋（宝部屋・ショップ・黄金の部屋・報酬）ではアイテム・パッシブを得られない・秘密の部屋・隠しショップ・試練の部屋はOK・鍛冶屋・星座の部屋・鍛錬の部屋・休憩所の回復は使えない・再生加速：再生力が2.5倍早く溜まる",
  ],
};
