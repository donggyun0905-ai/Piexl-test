// 캐릭터 설명: 실베르 (조커) · 한·영·일 (수치는 weaponsJoker·itemsJoker·factionDefs.FACTION_GROWTH와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SILBER: Guide = {
  joker: [
    "실베르 · 조커 '튕기는 카드 투척자' · 체력 80 · 이동 1.25 · 행운 1 · 처음엔 약하지만 패시브를 먹을수록 강해짐 (진영 특징: 패시브 하나마다 최대 체력 +3 · 공격력·공격 속도·투사체 속도 +2% · 이동 속도 +1%, 30개까지)",
    "카드 던지기 (누르고 있으면): 조준한 쪽으로 카드 한 장 · 피해는 공격력과 상관없는 고정 4 · 카드는 적을 뚫고 지나가며 벽·기둥에 끝없이 튕김 · 튕길 때마다 피해 +4 · 같은 적은 잠깐 뒤 다시 맞음",
    "판 위 카드는 15장까지 · 넘으면 가장 먼저 던진 카드가 사라짐 · 방을 나가면 카드를 모두 거둠 · 투사체 속도가 빠를수록 카드가 빨리 튕겨 금방 세짐",
    "무기 3: 트럼프 카드 (기본) · 사신의 낫 (크고 느리게 돌며 더 자주 벰 · 던지는 간격이 김) · 장난감 총 (작은 탄을 빠르게 자주 · 튕길 때 +3)",
    "카드뽑기 (전용 아이템): 카드가 맞힐 때마다 게이지 (40) → 머리 위 카드 셋이 섞이다 한 장이 뒤집힘 · 달: 히든 캐릭터 아홉 중 하나의 힘 10초 (별똥별 · 꽥 충격파 · 먹 글자 · 에테르 분출 · 운명(카드 피해 2배) · 낙뢰 · 차원 균열 · 왕의 위엄(받는 피해 절반) · 빛의 축복) · 붉은 일식: 10초 동안 받는 피해 +30% · 카드 처음 피해 16 · 세계수: 체력 20 회복",
    "전용 아이템 15 (모두 새 기술·능력 + 능력치): 카드뽑기 · 날 선 모서리 · 더블 덱 · 마술사의 소매 · 불꽃 카드 · 서리 카드 · 지휘봉 · 폭죽 카드 · 분신 카드 · 에이스 · 행운의 7 · 하트 카드 · 가속 카드 · 카드 방패 · 풀 하우스",
  ],
};

export const GUIDE_EN_SILBER: Guide = {
  joker: [
    "Silber · Joker, the Bouncing Card Thrower · 80 HP · 1.25 move · 1 luck · weak at first but grows with every passive (faction trait: each passive grants +3 max HP · +2% damage, attack speed and projectile speed · +1% move speed, up to 30)",
    "Throw (hold): one card toward your aim · fixed 4 damage, unaffected by attack · cards pierce foes and bounce off walls and pillars forever · +4 damage per bounce · the same foe can be hit again shortly after",
    "Up to 15 cards on the field · past that, the oldest card vanishes · leaving the room collects all cards · faster projectiles bounce sooner and grow strong quickly",
    "3 weapons: Playing Cards (basic) · Reaper's Scythe (big, slow spinning, cuts more often · longer throw interval) · Toy Gun (small fast shots, often · +3 per bounce)",
    "Card Draw (exclusive): every card hit fills a gauge (40) → three cards above your head shuffle and one flips · Moon: one of nine hidden heroes' powers for 10s (Falling Star · Quack Shockwave · Ink Letter · Ether Burst · Fate (2x card damage) · Lightning · Dimensional Rift · Royal Majesty (half damage taken) · Blessing of Light) · Red Eclipse: for 10s, +30% damage taken · cards start at 16 damage · World Tree: heal 20 HP",
    "15 exclusive items (each unlocks a new skill or ability + stats): Card Draw · Sharpened Edge · Double Deck · Magician's Sleeve · Flame Card · Frost Card · Baton · Firework Card · Twin Card · Ace · Lucky Seven · Heart Card · Accel Card · Card Shield · Full House",
  ],
};

export const GUIDE_JA_SILBER: Guide = {
  joker: [
    "シルベル・ジョーカー『跳ねるカード投げ』・体力80・移動1.25・幸運1・最初は弱いがパッシブを得るほど強くなる（陣営の特徴：パッシブ1つごとに最大体力+3・攻撃力・攻撃速度・弾速+2%・移動速度+1%、30個まで）",
    "カード投げ（押し続ける）：狙った方へカード1枚・ダメージは攻撃力と関係ない固定4・カードは敵を貫き、壁や柱で無限に跳ねる・跳ねるたびにダメージ+4・同じ敵には少し後にまた当たる",
    "場のカードは15枚まで・超えると最初に投げたカードが消える・部屋を出ると全カードを回収・弾速が速いほど早く跳ねてすぐ強くなる",
    "武器3つ：トランプ（基本）・死神の鎌（大きくゆっくり回りより頻繁に斬る・投げる間隔が長い）・おもちゃの銃（小さな弾を速く頻繁に・跳ねるたび+3）",
    "カード引き（専用アイテム）：カードが当たるたびにゲージ（40）→ 頭上の3枚が混ざり1枚がめくれる・月：隠しキャラ9人のうち1人の力を10秒（流れ星・ガア衝撃波・墨の文字・エーテル噴出・運命（カードダメージ2倍）・落雷・次元の裂け目・王の威厳（被ダメージ半分）・光の祝福）・赤い日食：10秒間被ダメージ+30%・カードの初期ダメージ16・世界樹：体力20回復",
    "専用アイテム15（すべて新しい技・能力＋能力値）：カード引き・研いだ角・ダブルデッキ・奇術師の袖・炎のカード・霜のカード・指揮棒・花火のカード・分身カード・エース・幸運の7・ハートのカード・加速カード・カードの盾・フルハウス",
  ],
};
