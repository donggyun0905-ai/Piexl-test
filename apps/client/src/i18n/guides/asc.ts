// 캐릭터 설명: 시즌 2 아스칼론 (추적자 · 잊혀진 자 · 잔영 · 방랑객 …) · 한·영·일
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_ASC: Guide = {
  tracker: [
    "아스칼론 · 추적자 · 조용히 노리는 여자 저격수 · 체력 90 · 조금 빠름",
    "저격총 하나: 멀리 꿰뚫는 한 발. 스킬 셋은 PC 1·2·3 키, 모바일은 오른쪽 스킬 버튼",
    "1 암습 저격(대기 10초): 무적이 되고 화면이 까매지며 조준 원만 보임. 10초 안에 10발 (한 발 공격력 200%, 조준 원 안의 적). 모바일·자동 조준은 가까운 적을 노림",
    "2 강력한 한방(대기 60초): 1.5초 모으는 동안 앞에 적 탄을 막는 빛 벽 (무적은 아님) → 방을 꿰뚫는 한 줄 (공격력 1000% + 최대 체력 20%, 보스는 그 1/5)",
    "3 연발사격(대기 3초): 조준 없이 10발을 흩뿌려 쏨",
    "전용 아이템 10: 고배율 조준경 · 할로 포인트탄 · 소음기 · 양각대 · 사냥감 표식 · 도탄 · 확장 탄창 · 고압 장약 · 위장복 · 헤드샷",
  ],
  forgotten: [
    "아스칼론 · 잊혀진 자 · 옛 신의 마지막 후손인 반신, 빛으로 싸우는 여자 · 체력 85 · 아주 빠름 · 재생력 20 · 회피 20%",
    "빛 무기 10: 빛의 손길 · 여래신장(하늘에서 빛 십자가 셋) · 빛의 창 · 성광 · 빛비 · 빛의 날개 · 프리즘 · 후광 · 심판의 빛 · 새벽 베기",
    "빛의 고리: 적을 쓰러뜨리면 등의 고리가 차오름 (25마리). 가득 차면 10초 동안 신족: 공격 속도 2배 + 둘레 적을 빛기둥이 저절로 침 (0.3초마다 셋, 공격력 30%)",
    "전용 아이템 10: 잊힌 기억 · 신의 잔향 · 빛기둥 강화 · 늘어나는 기둥 · 신의 가호 · 광휘 · 성흔 · 빛의 박동 · 깨어남 · 잔광",
  ],
  remnant: [
    "아스칼론 · 잔영 · 그림자 속을 움직이는 남자 암살자 · 체력 90 · 빠름 · 치명타 25% · 치명타 피해 250% · 모든 상태이상 면역",
    "그림자 단검 10: 잔영 단검 · 쌍단검 · 그림자 발톱 · 스틸레토 · 그림자 투척 · 회전 칼날 · 섬영 · 그림자 낫 · 독니 · 월식",
    "아주 빠르게 벰. 노리는 적이 칼끝에서 멀면 그 적 뒤로 순간이동해 등 뒤를 벰 (뒤에서 치면 1.5배, 스틸레토는 2.5배). 떠난 자리에는 잔영이 남아 0.3초 뒤 한 번 더 벰",
    "전용 아이템 10: 그림자 걸음 · 등 뒤의 칼 · 처형 · 겹친 잔영 · 사라짐 · 피의 칼날 · 그림자 손놀림 · 소리 없는 발 · 연쇄 암살 · 그림자 숨기",
  ],
  wanderer: [
    "아스칼론 · 방랑객 · 카타나 한 자루로 떠도는 남자 무사 · 체력 105 · 기본 예리함 25% (맞히면 확률로 방어 -25% + 출혈, 터지면 칼빛과 쇳소리)",
    "카타나 10: 방랑 카타나 · 발도 · 무심의 원 · 칼날 폭풍 · 천검란 · 초승달 베기 · 이도류 · 노다치 · 연참 · 달빛 일섬",
    "무심의 원: 1초 가만히 서면 큰 원이 펼쳐지고, 원에 들어온 적은 거리와 상관없이 바로 베임 (공격력 200%). 대시하면 원 안 적이 모두 멈추고 크게 베이며 앞으로 발도 급습",
    "천검란: 벨 때마다 발밑 게이지가 차고, 가득 차면 방 전체에 칼날 폭풍 (공격력 120% × 5)",
    "전용 아이템 10: 숫돌 · 깊은 상처 · 명경지수 · 바람의 칼 · 납도 · 검기 응축 · 낭인의 걸음 · 집중 · 피의 비 · 잔월",
  ],
};

export const GUIDE_EN_ASC: Guide = {
  tracker: [
    "Ascalon · Tracker · a quiet female sniper · HP 90 · a bit fast",
    "One sniper rifle: a long piercing shot. Three skills on keys 1·2·3 (PC) or the skill buttons (mobile)",
    "1 Ambush Snipe (10s cooldown): invulnerable, the screen goes black except the scope circle. 10 shots within 10s (200% each, foes inside the circle). Mobile/auto-aim targets the nearest foe",
    "2 Power Shot (60s cooldown): charge 1.5s behind a light wall that blocks enemy shots (not invulnerable) → a line through the room (1000% + 20% max HP, 1/5 of that on bosses)",
    "3 Rapid Fire (3s cooldown): 10 scattered shots without aiming",
    "10 exclusive items: High-Power Scope · Hollow Points · Suppressor · Bipod · Quarry Mark · Ricochet · Extended Mag · High-Pressure Charge · Ghillie Suit · Headshot",
  ],
  forgotten: [
    "Ascalon · The Forgotten · a demigod woman, last descendant of the old gods, who fights with light · HP 85 · very fast · Regen 20 · 20% dodge",
    "10 light weapons: Touch of Light · Tathagata Palm (three light crosses from the sky) · Spear of Light · Holy Flash · Light Rain · Wings of Light · Prism · Halo · Light of Judgment · Dawn Cleave",
    "Ring of light: kills fill the ring on her back (25). When full she takes divine form for 10s: double attack speed + pillars of light strike nearby foes on their own (three every 0.3s, 30% damage)",
    "10 exclusive items: Forgotten Memory · Echo of the Gods · Brighter Pillars · More Pillars · Divine Ward · Radiance · Stigma · Pulse of Light · Awakening · Afterglow",
  ],
  remnant: [
    "Ascalon · Remnant · a male assassin who moves through shadows · HP 90 · fast · 25% crit · 250% crit damage · immune to all status effects",
    "10 shadow daggers: Afterimage Dagger · Twin Daggers · Shadow Claws · Stiletto · Shadow Throw · Spinning Blades · Flash Shadow · Shadow Sickle · Venom Fang · Eclipse",
    "Very fast cuts. If the target is out of reach he blinks behind it and stabs its back (×1.5 from behind, Stiletto ×2.5). An afterimage stays where he left and cuts once more 0.3s later",
    "10 exclusive items: Shadow Step · Knife in the Back · Execution · Double Afterimage · Vanish · Bloody Edge · Shadow Hands · Silent Feet · Chain Assassination · Shadow Shroud",
  ],
  wanderer: [
    "Ascalon · Wanderer · a swordsman who roams with a single katana · HP 105 · base Sharpness 25% (hits may cut defense by 25% and cause bleeding, with a flash and a ring of steel)",
    "10 katanas: Wanderer's Katana · Quick Draw · Circle of No-Mind · Blade Storm · Thousand Swords · Crescent Cut · Two Swords · Nodachi · Flurry · Moonlit Flash",
    "Circle of No-Mind: stand still for 1s to open a wide circle; any foe that enters is cut instantly at any range (200%). Dashing freezes every foe inside, cuts them hard and you quick-draw forward",
    "Thousand Swords: cuts fill the gauge under your feet; when full, a blade storm hits the whole room (120% × 5)",
    "10 exclusive items: Whetstone · Deep Wound · Still Water · Wind Blade · Sheathe · Condensed Edge · Ronin's Stride · Focus · Blood Rain · Waning Moon",
  ],
};

export const GUIDE_JA_ASC: Guide = {
  tracker: [
    "アスカロン · 追跡者 · 静かに狙う女性狙撃手 · 体力90 · やや速い",
    "狙撃銃ひとつ：遠くまで貫く一発。スキル3つはPCの1·2·3キー、モバイルは右のスキルボタン",
    "1 暗襲狙撃（待ち10秒）：無敵になり画面が暗転、照準円だけが見える。10秒以内に10発（1発200%、照準円内の敵）。モバイル・自動照準は近い敵を狙う",
    "2 強力な一撃（待ち60秒）：1.5秒溜める間、前に敵弾を防ぐ光の壁（無敵ではない）→ 部屋を貫く一直線（1000%＋最大体力20%、ボスはその1/5）",
    "3 連射（待ち3秒）：狙わずに10発ばらまく",
    "専用アイテム10：高倍率スコープ · ホローポイント弾 · サプレッサー · バイポッド · 獲物の印 · 跳弾 · 拡張マガジン · 高圧装薬 · ギリースーツ · ヘッドショット",
  ],
  forgotten: [
    "アスカロン · 忘れられし者 · 古き神の最後の末裔、光で戦う半神の女性 · 体力85 · とても速い · 再生力20 · 回避20%",
    "光の武器10：光の手 · 如来神掌（空から光の十字架3つ）· 光の槍 · 聖光 · 光の雨 · 光の翼 · プリズム · 後光 · 審判の光 · 暁の斬撃",
    "光の輪：敵を倒すと背中の輪が満ちる（25体）。満ちると10秒間神族：攻撃速度2倍＋光柱が周りの敵を自動で撃つ（0.3秒ごとに3本、攻撃力30%）",
    "専用アイテム10：忘れられた記憶 · 神の残響 · 光柱強化 · 増える光柱 · 神の加護 · 光輝 · 聖痕 · 光の鼓動 · 目覚め · 残光",
  ],
  remnant: [
    "アスカロン · 残影 · 影の中を動く男の暗殺者 · 体力90 · 速い · クリティカル25% · クリティカルダメージ250% · すべての状態異常に免疫",
    "影の短剣10：残影の短剣 · 双短剣 · 影の爪 · スティレット · 影の投擲 · 回転刃 · 閃影 · 影の鎌 · 毒牙 · 月蝕",
    "とても速く斬る。狙う敵が刃先から遠いとその敵の背後へ瞬間移動して背中を斬る（背後から1.5倍、スティレットは2.5倍）。去った場所に残影が残り0.3秒後にもう一度斬る",
    "専用アイテム10：影歩き · 背中の刃 · 処刑 · 重なる残影 · 消失 · 血の刃 · 影の手さばき · 音なき足 · 連鎖暗殺 · 影隠れ",
  ],
  wanderer: [
    "アスカロン · 放浪者 · 刀一振りで流れ歩く男の剣士 · 体力105 · 基本の鋭さ25%（当てると確率で防御-25%＋出血、発動すると刃の光と金属音）",
    "刀10：流浪の刀 · 抜刀 · 無心の円 · 刃の嵐 · 千剣乱 · 三日月斬り · 二刀流 · 野太刀 · 連斬 · 月光一閃",
    "無心の円：1秒じっとすると大きな円が開き、円に入った敵は距離に関係なく即座に斬られる（攻撃力200%）。ダッシュすると円の中の敵が全員止まり大きく斬られ、前へ抜刀奇襲",
    "千剣乱：斬るたびに足元のゲージが溜まり、満ちると部屋全体に刃の嵐（攻撃力120%×5）",
    "専用アイテム10：砥石 · 深い傷 · 明鏡止水 · 風の刃 · 納刀 · 剣気凝縮 · 浪人の歩み · 集中 · 血の雨 · 残月",
  ],
};
