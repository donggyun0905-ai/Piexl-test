// 캐릭터 설명: 새벽의 성흔 (실버불렛) · 한·영·일 (수치는 weaponsSilverBullet·itemsSilverBullet·weaponsDawn과 맞춤, dawn3가 커서 나눔)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_DAWN4: Guide = {
  silverBullet: [
    "새벽의 성흔 · 실버불렛 '은빛 집행자' · 스타일리시하게 전장을 누비며 은탄을 난사하고 성수 폭탄으로 광역 정화를 행하는 정통파 엘리트 사냥꾼 · 체력 105 · 공격력 11 · 방어력 1 · 이동 1.4 · 행운 2 · 스킬 없음(성흔 게이지)",
    "쌍권총 (누르고 있으면): 한 번 공격에 은탄 두 발 — 오른손이 먼저, 왼손이 조금 뒤 (탕-탕) · 한 발 42% · 공격력은 낮고 공격 속도는 빠름 · 날아가는 거리 170 · 모든 공격이 달빛 상태이상 (맞을 때마다 1스택, 각성 중엔 2스택)",
    "성수 폭탄: 기본 공격 8번째마다 앞 가까운 적 자리에 던짐 → 둘레 42 빛 피해 120% (광역 정화) · 맞은 적마다 성흔 2",
    "대시: 앞에 장애물·기둥이 있으면 넘어감 (넘는 중 대시가 끝나면 다 넘을 때까지 더 미끄러짐) · 대시하는 순간 가까운 적에게 은탄 두 발 (60%)",
    "은탄 마크: 은탄이 맞힐 때마다 적에게 1 (체력 줄 위에 은탄 ×개수) · 30이 되면 연사: 2초 동안 그 적에게 두 발씩 매우 빠르게 몰아 쏨 (30%씩, 마크·성흔 안 참)",
    "성흔 차는 양: 은탄이 맞힐 때 1.5 · 처치 4 · 성수 폭탄에 맞은 적마다 2 (최대 100)",
    "달빛 각성 (6초): 둘레 80 달빛 폭발 140% · 잠깐 무적 · 피해 1.3배 · 공격 속도 1.3배 · 동시에 몸이 고정되고 몸 앞에 흰 활 ) → 2.5초 동안 가운데 두 발·양끝 유도 두 발씩 (32%) 매우 빠르게 (3틱마다)",
    "무기 1: 은빛 쌍권총 · 무기 대신 아이템이 나옴",
    "전용 아이템 20: 쌍권총 5 (빠른 손 · 할로우 포인트 · 관통 은탄 · 세 번째 총성 · 긴 총열) · 연사 5 (은빛 각인 · 탄막 폭풍 · 연사 가속 · 은빛 파열 · 순은) · 성수 5 (큰 성수병 · 축복받은 물 · 넉넉한 탄띠 · 정화 · 성수 뿌리기) · 집행 5 (사냥꾼의 집중 · 끝없는 탄창 · 추적 은탄 · 날렵한 발 · 달의 집행자)",
  ],
};

export const GUIDE_EN_DAWN4: Guide = {
  silverBullet: [
    "Dawn Stigmata · Silver Bullet, 'the Silver Executioner' · an orthodox elite hunter who glides stylishly across the field spraying silver rounds and purging crowds with holy water bombs · HP 105 · Attack 11 · Defense 1 · Move 1.4 · Luck 2 · No skills (Stigma gauge)",
    "Twin pistols (hold): two silver rounds per attack — the right hand first, the left a beat later · 42% each · low damage, high attack speed · 170 travel distance · every attack inflicts Moonlight (1 stack per hit, 2 while awakened)",
    "Holy water bomb: every 8th basic attack, thrown at the nearest foe ahead → 120% holy damage in a 42 radius · 2 Stigma per foe hit",
    "Dash: vault over obstacles and pillars ahead (if the dash ends mid-vault you slide on until clear) · fire two rounds (60%) at the nearest foe as you dash",
    "Silver Marks: +1 on a foe per round hit (silver round ×count above its HP bar) · at 30, Barrage: rapid pairs of rounds into that foe for 2s (30% each, no marks or Stigma)",
    "Stigma gain: 1.5 per round hit · 4 per kill · 2 per foe hit by a holy water bomb (max 100)",
    "Moonlight Awakening (6s): 140% Moonlight burst in an 80 radius · brief invulnerability · 1.3x damage · 1.3x attack speed · you are rooted behind a white bow ) that fires two center rounds and two homing side rounds (32%) every 3 ticks for 2.5s",
    "Weapon 1: Silver Twin Pistols · items appear instead of weapons",
    "Exclusive items 20: Pistols 5 (Quick Hands · Hollow Point · Piercing Silver · Third Gunshot · Long Barrel) · Barrage 5 (Silver Engraving · Bullet Storm · Rapid Fire · Silver Rupture · Pure Silver) · Holy Water 5 (Large Flask · Blessed Water · Full Bandolier · Purification · Holy Sprinkle) · Execution 5 (Hunter's Focus · Endless Magazine · Seeking Silver · Nimble Feet · Lunar Executioner)",
  ],
};

export const GUIDE_JA_DAWN4: Guide = {
  silverBullet: [
    "夜明けの聖痕 · シルバーバレット「銀の執行者」· 華麗に戦場を駆け、銀弾を乱射し聖水爆弾で広範囲を浄化する正統派エリート狩人 · 体力105 · 攻撃力11 · 防御力1 · 移動1.4 · 運2 · スキルなし（聖痕ゲージ）",
    "双銃（押し続ける）：一度の攻撃で銀弾2発 — 右手が先、左手が少し遅れて · 1発42% · 攻撃力は低く攻撃速度は速い · 飛距離170 · 全ての攻撃が月光状態異常（当たるたび1スタック、覚醒中は2スタック）",
    "聖水爆弾：通常攻撃8回ごとに前方の近い敵の位置へ投げる → 周囲42に光ダメージ120%（広範囲浄化）· 当たった敵ごとに聖痕2",
    "ダッシュ：前に障害物・柱があれば飛び越える（越える途中でダッシュが終わると越え切るまで滑る）· ダッシュの瞬間 近い敵に銀弾2発（60%）",
    "銀弾マーク：銀弾が当たるたび敵に1（体力バーの上に銀弾×個数）· 30で連射：2秒間その敵に2発ずつ非常に速く撃ち込む（30%ずつ、マーク・聖痕は溜まらない）",
    "聖痕の溜まり方：銀弾が当たると1.5 · 撃破4 · 聖水爆弾に当たった敵ごとに2（最大100）",
    "月光覚醒（6秒）：周囲80に月光爆発140% · 短い無敵 · ダメージ1.3倍 · 攻撃速度1.3倍 · 同時に体が固定され体の前に白い弓 ) → 2.5秒間 中央2発・両端の誘導2発ずつ（32%）非常に速く（3ティックごと）",
    "武器1：銀の双銃 · 武器の代わりにアイテムが出る",
    "専用アイテム20：双銃5（早撃ちの手・ホローポイント・貫通銀弾・三発目の銃声・長銃身）· 連射5（銀の刻印・弾幕の嵐・連射加速・銀の破裂・純銀）· 聖水5（大きな聖水瓶・祝福の水・たっぷりの弾帯・浄化・聖水撒き）· 執行5（狩人の集中・尽きない弾倉・追跡銀弾・身軽な足・月の執行者）",
  ],
};
