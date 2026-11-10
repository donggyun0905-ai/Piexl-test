// 캐릭터 설명: 실베르 (조커 · 쉐도잉) · 한·영·일 (수치는 weaponsJoker·itemsJoker·factionDefs.FACTION_GROWTH와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SILBER: Guide = {
  joker: [
    "실베르 · 조커 '튕기는 카드 투척자' · 체력 80 · 이동 1.25 · 행운 1 · 처음엔 약하지만 패시브를 먹을수록 강해짐 (진영 특징: 패시브 하나마다 최대 체력 +3 · 공격력·공격 속도·투사체 속도 +2% · 이동 속도 +1%, 30개까지)",
    "카드 던지기 (누르고 있으면): 조준한 쪽으로 카드 한 장 · 피해는 공격력과 상관없는 고정 4 · 카드는 적을 뚫고 지나가며 벽·기둥에 끝없이 튕김 · 튕길 때마다 피해 +4 (15번까지, 트럼프 카드 최대 64 · 다 쌓인 카드는 금색으로 빛남) · 같은 적은 잠깐 뒤 다시 맞음",
    "판 위 카드는 15장까지 · 넘으면 가장 먼저 던진 카드가 사라짐 · 방을 나가면 카드를 모두 거둠 · 투사체 속도가 빠를수록 카드가 빨리 튕겨 금방 세짐",
    "무기 3: 트럼프 카드 (기본) · 사신의 낫 (크고 느리게 돌며 더 자주 벰 · 던지는 간격이 김) · 장난감 총 (작은 탄을 빠르게 자주 · 튕길 때 +3)",
    "카드뽑기 (전용 아이템): 카드가 맞힐 때마다 게이지 (40) → 머리 위 카드 셋이 섞이다 한 장이 뒤집힘 · 달: 히든 캐릭터 아홉 중 하나의 힘 10초 (별똥별 · 꽥 충격파 · 먹 글자 · 에테르 분출 · 운명(카드 피해 2배) · 낙뢰 · 차원 균열 · 왕의 위엄(받는 피해 절반) · 빛의 축복) · 붉은 일식: 10초 동안 받는 피해 +30% · 카드 처음 피해 16 · 세계수: 체력 20 회복",
    "전용 아이템 15 (모두 새 기술·능력 + 능력치): 카드뽑기 · 날 선 모서리 · 더블 덱 · 마술사의 소매 · 불꽃 카드 · 서리 카드 · 지휘봉 · 폭죽 카드 · 분신 카드 · 에이스 · 행운의 7 · 하트 카드 · 가속 카드 · 카드 방패 · 풀 하우스",
  ],
  shadowing: [
    "실베르 · 쉐도잉 '그림을 그리는 정령 소녀' · 체력 85 · 공격력 8 · 이동 1.2 · 행운 1 · 처음엔 약하지만 패시브를 먹을수록 강해짐 (진영 특징: 패시브 하나마다 최대 체력 +3 · 공격력·공격 속도·투사체 속도 +2% · 이동 속도 +1%, 30개까지)",
    "먹 그림 (누르고 있으면): 마우스 자리(붓 끝, 붓이 닿는 거리 150까지 · 사거리 증가만큼 멀리)를 따라 바닥에 먹 획을 그림 · 획에 닿은 적은 0.33초마다 공격력의 60% (공격 속도가 빠를수록 자주) · 손을 떼면 획이 2초 남았다가 사라짐 · 판 위 획은 8개까지",
    "모양 기술: 처음과 끝이 만나는 닫힌 원 = 봉인 (안의 적 공격력의 250% · 0.5초 묶음) · 곧은 줄 = 일필 베기 (줄 위 적 공격력의 180%) · 잉크 100을 써서 그리고(1픽셀에 0.3) 손을 떼면 다시 참 · 자동 조준이면 붓이 가까운 적 둘레를 돌며 원을 그림",
    "무기: 마법 붓 하나 · 전용 아이템 20 (모두 새 기술·능력 + 능력치): 검무 일필 · 수묵 산수화 · 연꽃 각성 · 학과 구름 · 벚꽃 물결 · 봉인 사슬 · 불기둥 획 · 얼음 결정 · 먹 소용돌이 · 달 낙관 · 별 꺾임 · 멈춘 시계 · 유령 먹 · 가시 장미 · 혜성 붓 · 나비 붓끝 · 황금 문 · 날개 획 · 유성 낙하 · 먹의 용",
  ],
};

export const GUIDE_EN_SILBER: Guide = {
  joker: [
    "Silber · Joker, the Bouncing Card Thrower · 80 HP · 1.25 move · 1 luck · weak at first but grows with every passive (faction trait: each passive grants +3 max HP · +2% damage, attack speed and projectile speed · +1% move speed, up to 30)",
    "Throw (hold): one card toward your aim · fixed 4 damage, unaffected by attack · cards pierce foes and bounce off walls and pillars forever · +4 damage per bounce (up to 15 bounces, Playing Cards max 64 · maxed cards glow gold) · the same foe can be hit again shortly after",
    "Up to 15 cards on the field · past that, the oldest card vanishes · leaving the room collects all cards · faster projectiles bounce sooner and grow strong quickly",
    "3 weapons: Playing Cards (basic) · Reaper's Scythe (big, slow spinning, cuts more often · longer throw interval) · Toy Gun (small fast shots, often · +3 per bounce)",
    "Card Draw (exclusive): every card hit fills a gauge (40) → three cards above your head shuffle and one flips · Moon: one of nine hidden heroes' powers for 10s (Falling Star · Quack Shockwave · Ink Letter · Ether Burst · Fate (2x card damage) · Lightning · Dimensional Rift · Royal Majesty (half damage taken) · Blessing of Light) · Red Eclipse: for 10s, +30% damage taken · cards start at 16 damage · World Tree: heal 20 HP",
    "15 exclusive items (each unlocks a new skill or ability + stats): Card Draw · Sharpened Edge · Double Deck · Magician's Sleeve · Flame Card · Frost Card · Baton · Firework Card · Twin Card · Ace · Lucky Seven · Heart Card · Accel Card · Card Shield · Full House",
  ],
  shadowing: [
    "Silber · Shadowing, the Painting Spirit Girl · 85 HP · 8 damage · 1.2 move · 1 luck · weak at first but grows with every passive (faction trait: each passive grants +3 max HP · +2% damage, attack speed and projectile speed · +1% move speed, up to 30)",
    "Ink Painting (hold): paints ink strokes on the floor following your cursor (the brush tip, reaching up to 150 · farther with range) · foes touching a stroke take 60% of damage every 0.33s (more often with attack speed) · let go and the stroke lingers 2s · up to 8 strokes on the field",
    "Shape skills: a closed loop whose ends meet = Seal (250% of damage to foes inside · binds 0.5s) · a straight line = One-Stroke Slash (180% of damage along the line) · painting spends 100 ink (0.3 per pixel), which refills when you let go · with auto-aim the brush circles the nearest foe",
    "Weapon: one Magic Brush · 20 exclusive items (each unlocks a new skill or ability + stats): Sword Dance Stroke · Ink Landscape · Lotus Awakening · Crane and Cloud · Sakura Wave · Sealing Chain · Flame Pillar Stroke · Ice Crystal · Ink Vortex · Moon Seal Stamp · Star Corners · Stopped Clock · Ghost Ink · Thorned Rose · Comet Brush · Butterfly Tip · Golden Gate · Winged Stroke · Meteor Fall · Ink Dragon",
  ],
};

export const GUIDE_JA_SILBER: Guide = {
  joker: [
    "シルベル・ジョーカー『跳ねるカード投げ』・体力80・移動1.25・幸運1・最初は弱いがパッシブを得るほど強くなる（陣営の特徴：パッシブ1つごとに最大体力+3・攻撃力・攻撃速度・弾速+2%・移動速度+1%、30個まで）",
    "カード投げ（押し続ける）：狙った方へカード1枚・ダメージは攻撃力と関係ない固定4・カードは敵を貫き、壁や柱で無限に跳ねる・跳ねるたびにダメージ+4（15回まで、トランプは最大64・最大のカードは金色に光る）・同じ敵には少し後にまた当たる",
    "場のカードは15枚まで・超えると最初に投げたカードが消える・部屋を出ると全カードを回収・弾速が速いほど早く跳ねてすぐ強くなる",
    "武器3つ：トランプ（基本）・死神の鎌（大きくゆっくり回りより頻繁に斬る・投げる間隔が長い）・おもちゃの銃（小さな弾を速く頻繁に・跳ねるたび+3）",
    "カード引き（専用アイテム）：カードが当たるたびにゲージ（40）→ 頭上の3枚が混ざり1枚がめくれる・月：隠しキャラ9人のうち1人の力を10秒（流れ星・ガア衝撃波・墨の文字・エーテル噴出・運命（カードダメージ2倍）・落雷・次元の裂け目・王の威厳（被ダメージ半分）・光の祝福）・赤い日食：10秒間被ダメージ+30%・カードの初期ダメージ16・世界樹：体力20回復",
    "専用アイテム15（すべて新しい技・能力＋能力値）：カード引き・研いだ角・ダブルデッキ・奇術師の袖・炎のカード・霜のカード・指揮棒・花火のカード・分身カード・エース・幸運の7・ハートのカード・加速カード・カードの盾・フルハウス",
  ],
  shadowing: [
    "シルベル・シャドーイング『絵を描く精霊の少女』・体力85・攻撃力8・移動1.2・幸運1・最初は弱いがパッシブを得るほど強くなる（陣営の特徴：パッシブ1つごとに最大体力+3・攻撃力・攻撃速度・弾速+2%・移動速度+1%、30個まで）",
    "墨絵（押し続ける）：カーソル（筆先、筆が届く距離150まで・射程増加で遠く）に沿って床に墨の線を描く・線に触れた敵は0.33秒ごとに攻撃力の60%（攻撃速度が速いほど頻繁）・離すと線は2秒残って消える・場の線は8本まで",
    "形の技：始めと終わりが出会う閉じた円＝封印（中の敵に攻撃力の250%・0.5秒拘束）・まっすぐな線＝一筆斬り（線上の敵に攻撃力の180%）・インク100を使って描き（1ピクセル0.3）、離すと回復・自動照準なら筆が近い敵の周りを回って円を描く",
    "武器：魔法の筆ひとつ・専用アイテム20（すべて新しい技・能力＋能力値）：剣舞一筆・水墨山水画・蓮華覚醒・鶴と雲・桜の波・封印の鎖・火柱の線・氷の結晶・墨の渦・月の落款・星の角・止まった時計・幽霊の墨・棘の薔薇・彗星の筆・蝶の筆先・黄金の門・翼の線・流星落下・墨の龍",
  ],
};
