import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.139",
    date: "2026-10-27",
    items: {
      ko: [
        "상점: 사용 아이템·패시브 팔기 (상점 방 아래 '판매' 줄, 한 번 누르면 확인·한 번 더 누르면 판매, 상점 값의 1/4) · 한 번만 먹는 패시브가 두 자리에 같이 나와도 하나만 먹어짐",
        "보스가 부른 적은 처치 수·쌓이는 힘(빛의 고리·잔영·경험치·먹은 영혼 등)에 들어가지 않음 (악의 사도는 그 영혼으로 회복만 됨)",
        "멸망의 용 염옥(필살기) 중에는 몸에 닿아도 피해 없음 · 게임 화면 전용 커서 (잘 보이는 조준 커서)",
        "추적자: 스킬을 쓰는 동안에도 움직일 수 있음 · 강력한 한방은 한 판에 3번 (라스트 보스방에 들어가면 다시 3번, 버튼에 남은 횟수) · 위장복: 대시 뒤 1초 무적 → 1초 동안 받는 피해 -40%",
        "붐버: 유도 지뢰는 박힌 지 3초가 지나면 저절로 터짐 · 네이팜은 자동 조준을 끄면 누른 곳으로 · 사거리 안의 적에게만 던짐 (폭발 반경만큼 사거리 밖을 맞히지 않게)",
      ],
      en: [
        "Shop: sell use items and passives (the 'Sell' row in shop rooms; tap once to confirm, again to sell, for 1/4 of the shop price) · a one-time passive shown on two shelves can only be taken once",
        "Enemies summoned by bosses no longer count as kills or toward stacking powers (Halo, Remnant, EXP, eaten souls, etc.); the Apostle still heals from their souls",
        "No contact damage from the Dragon of Ruin's body during its Hellfire ultimate · a custom, easy-to-see aiming cursor in game",
        "Tracker: can move while using skills · Power Shot is limited to 3 per run (refilled when entering the last boss room; uses shown on the button) · Ghillie Suit: 1s invulnerable after a dash → 40% less damage for 1s",
        "Bomber: homing mines explode on their own after 3s in place · Napalm goes where you aim when auto-aim is off · bombs only target foes within range (blast radius no longer reaches past it)",
      ],
      ja: [
        "ショップ: 使用アイテム・パッシブを売却（ショップ部屋の「売却」列、1回押して確認・もう1回で売却、ショップ価格の1/4）· 1回だけ取れるパッシブが2か所に並んでも1つしか取れない",
        "ボスが呼んだ敵は撃破数・溜まる力（光の輪・残影・経験値・食べた魂など）に数えない（悪の使徒はその魂で回復のみ）",
        "滅びの竜の炎獄（必殺技）中は体に触れてもダメージなし · ゲーム画面専用の見やすい照準カーソル",
        "追跡者: スキル中も移動できる · 強力な一撃は1プレイ3回（ラストボス部屋に入ると再び3回、ボタンに残り回数）· ギリースーツ: ダッシュ後1秒無敵 → 1秒間受けるダメージ-40%",
        "ボマー: 誘導地雷は設置から3秒で自動で爆発 · ナパームはオートエイムをオフにすると狙った場所へ · 射程内の敵にだけ投げる（爆発範囲で射程外に届かない）",
      ],
    },
  },
  {
    version: "0.48.138",
    date: "2026-10-27",
    items: {
      ko: [
        "아스칼론 새 캐릭터 '영사' (여, 보이지 않는 실을 다루는 · 체력 90 · 빠름 · 아주 빠른 공격)",
        "실 100가닥 장전 (다 쓰면 장전) · 실 하나는 방 끝에서 끝까지 1초 보이는 실선, 그 줄의 적을 모두 벰 · 얽힘 5가 쌓이면 실 다섯이 \"띵\" 하고 당겨 찢음 (250% + 출혈) · 30가닥마다 노리는 적을 가로지르는 실 30가닥 연사",
        "실 무기 10 · 전용 아이템 10 · 테마 스킨 9 + 여름 한정 '여름 파도'",
      ],
      en: [
        "New Ascalon character 'Silk' (female thread-wielder · HP 90 · fast · very fast attacks)",
        "100 threads loaded (reload when empty) · each thread is a wall-to-wall line shown for 1s that cuts every foe on it · at 5 tangles, five threads pull tight with a 'ting' and tear the foe apart (250% + bleed) · every 30 threads, a 30-thread barrage crosses the target",
        "10 thread weapons · 10 exclusive items · 9 theme skins + the limited Summer Wave skin",
      ],
      ja: [
        "アスカロンの新キャラクター「影糸使い」（女性、見えない糸を操る · 体力90 · 速い · とても速い攻撃）",
        "糸100本を装填（使い切ると装填）· 糸1本は部屋の端から端まで1秒見える線で、その線上の敵をすべて斬る · 絡みが5溜まると糸5本が「ティン」と引かれ引き裂く（250%＋出血）· 30本ごとに狙う敵を横切る糸30本の連射",
        "糸の武器10 · 専用アイテム10 · テーマスキン9＋限定「夏の波」",
      ],
    },
  },
  {
    version: "0.48.137",
    date: "2026-10-27",
    items: {
      ko: [
        "아스칼론 새 캐릭터 '방랑객' (남, 카타나를 든 떠돌이 무사 · 체력 105 · 기본 예리함 25%)",
        "카타나 10: 방랑 카타나 · 발도 · 무심의 원(1초 가만히 서면 원이 펼쳐지고 들어온 적은 거리와 상관없이 바로 베임, 대시로 끌어당김) · 칼날 폭풍 · 천검란(게이지가 차면 방 전체 칼날 폭풍) · 초승달 베기 · 이도류 · 노다치 · 연참 · 달빛 일섬",
        "예리함이 터지면 새 칼빛 효과와 맑은 쇳소리 (예리함을 가진 모든 캐릭터)",
        "전용 아이템 10 · 테마 스킨 9 + 여름 한정 '여름 파도'",
      ],
      en: [
        "New Ascalon character 'Wanderer' (male swordsman with a katana · HP 105 · base Sharpness 25%)",
        "10 katanas: Wanderer's Katana · Quick Draw · Circle of No-Mind (stand still 1s to open a circle; foes entering are cut instantly at any range, dash pulls them in) · Blade Storm · Thousand Swords (full gauge unleashes a room-wide blade storm) · Crescent Cut · Two Swords · Nodachi · Flurry · Moonlit Flash",
        "Sharpness procs now show a new blade flash with a ringing steel sound (for every character with Sharpness)",
        "10 exclusive items · 9 theme skins + the limited Summer Wave skin",
      ],
      ja: [
        "アスカロンの新キャラクター「放浪者」（男性、刀を持つ流浪の剣士 · 体力105 · 基本の鋭さ25%）",
        "刀10：流浪の刀 · 抜刀 · 無心の円（1秒じっとすると円が開き、入った敵は距離に関係なく即座に斬られる、ダッシュで引き寄せる）· 刃の嵐 · 千剣乱（ゲージが満ちると部屋全体に刃の嵐）· 三日月斬り · 二刀流 · 野太刀 · 連斬 · 月光一閃",
        "鋭さが発動すると新しい刃の光と澄んだ金属音（鋭さを持つすべてのキャラクター）",
        "専用アイテム10 · テーマスキン9＋限定「夏の波」",
      ],
    },
  },
  {
    version: "0.48.136",
    date: "2026-10-27",
    items: {
      ko: [
        "아스칼론 새 캐릭터 '잔영' (남, 그림자 속 암살자 · 체력 90 · 빠름 · 치명타 25% · 치명타 피해 250% · 모든 상태이상 면역)",
        "아주 빠른 단검 공격 · 노리는 적이 멀면 그 적 뒤로 순간이동해 등 뒤를 벰 (뒤에서 치면 더 아픔) · 떠난 자리에 잔영이 남아 한 번 더 벰",
        "그림자 단검 10: 잔영 단검 · 쌍단검 · 그림자 발톱 · 스틸레토 · 그림자 투척 · 회전 칼날 · 섬영 · 그림자 낫 · 독니 · 월식",
        "전용 아이템 10 · 테마 스킨 9 + 여름 한정 '여름 파도'",
      ],
      en: [
        "New Ascalon character 'Remnant' (male shadow assassin · HP 90 · fast · 25% crit · 250% crit damage · immune to all status effects)",
        "Very fast dagger cuts · blinks behind far targets to stab their backs (more damage from behind) · leaves an afterimage that cuts once more",
        "10 shadow daggers: Afterimage Dagger · Twin Daggers · Shadow Claws · Stiletto · Shadow Throw · Spinning Blades · Flash Shadow · Shadow Sickle · Venom Fang · Eclipse",
        "10 exclusive items · 9 theme skins + the limited Summer Wave skin",
      ],
      ja: [
        "アスカロンの新キャラクター「残影」（男性、影の暗殺者 · 体力90 · 速い · クリティカル25% · クリティカルダメージ250% · すべての状態異常に免疫）",
        "とても速い短剣攻撃 · 狙う敵が遠いとその背後へ瞬間移動して背中を斬る（背後からはより痛い）· 去った場所に残影が残りもう一度斬る",
        "影の短剣10：残影の短剣 · 双短剣 · 影の爪 · スティレット · 影の投擲 · 回転刃 · 閃影 · 影の鎌 · 毒牙 · 月蝕",
        "専用アイテム10 · テーマスキン9＋限定「夏の波」",
      ],
    },
  },
  {
    version: "0.48.135",
    date: "2026-10-27",
    items: {
      ko: [
        "아스칼론 새 캐릭터 '잊혀진 자' (여, 옛 신의 후손인 반신 · 체력 85 · 아주 빠름 · 재생력 20 · 회피 20%)",
        "빛 무기 10: 빛의 손길 · 여래신장(하늘에서 빛 십자가가 떨어짐) · 빛의 창 · 성광 · 빛비 · 빛의 날개 · 프리즘 · 후광 · 심판의 빛 · 새벽 베기",
        "빛의 고리: 적을 쓰러뜨리면 등의 고리가 차오르고, 가득 차면 10초 동안 신족 (공격 속도 2배 · 빛 날개 · 빛기둥이 둘레 적을 저절로 침, 공격력 30%)",
        "전용 아이템 10 · 테마 스킨 9 + 여름 한정 '여름 파도'",
      ],
      en: [
        "New Ascalon character 'The Forgotten' (female demigod, descendant of the old gods · HP 85 · very fast · Regen 20 · 20% dodge)",
        "10 light weapons: Touch of Light · Tathagata Palm (light crosses fall from the sky) · Spear of Light · Holy Flash · Light Rain · Wings of Light · Prism · Halo · Light of Judgment · Dawn Cleave",
        "Ring of light: kills fill the ring on her back; when full she takes divine form for 10s (double attack speed · wings of light · pillars of light strike nearby foes on their own for 30%)",
        "10 exclusive items · 9 theme skins + the limited Summer Wave skin",
      ],
      ja: [
        "アスカロンの新キャラクター「忘れられし者」（女性、古き神の末裔の半神 · 体力85 · とても速い · 再生力20 · 回避20%）",
        "光の武器10：光の手 · 如来神掌（空から光の十字架が落ちる）· 光の槍 · 聖光 · 光の雨 · 光の翼 · プリズム · 後光 · 審判の光 · 暁の斬撃",
        "光の輪：敵を倒すと背中の輪が満ち、満ちると10秒間神族（攻撃速度2倍 · 光の翼 · 光柱が周りの敵を自動で撃つ、攻撃力30%）",
        "専用アイテム10 · テーマスキン9＋限定「夏の波」",
      ],
    },
  },
  {
    version: "0.48.134",
    date: "2026-10-27",
    items: {
      ko: [
        "새 진영 아스칼론 왕국 (시즌 2): 첫 캐릭터 '추적자' (여, 저격수 · 체력 90)",
        "저격총 하나 + 스킬 셋 (PC 1·2·3 키, 모바일 스킬 버튼): 1 암습 저격 (무적, 화면이 까매지고 조준 원만 보임, 10초 안에 10발 · 한 발 200%) · 2 강력한 한방 (모으는 동안 앞에 탄을 막는 벽, 방을 꿰뚫는 1000% + 최대 체력 20%) · 3 연발사격 (10발 흩뿌림)",
        "전용 아이템 10 · 테마 스킨 9 + 여름 한정 '여름 파도' (물총)",
      ],
      en: [
        "New faction, the Kingdom of Ascalon (Season 2): first character 'Tracker' (female sniper · HP 90)",
        "One sniper rifle + three skills (keys 1·2·3 on PC, skill buttons on mobile): 1 Ambush Snipe (invulnerable, the screen goes black except the scope, 10 shots within 10s · 200% each) · 2 Power Shot (a wall blocks shots while charging, then 1000% + 20% max HP through the room) · 3 Rapid Fire (10 scattered shots)",
        "10 exclusive items · 9 theme skins + the limited Summer Wave skin (water rifle)",
      ],
      ja: [
        "新陣営アスカロン王国（シーズン2）：最初のキャラクター「追跡者」（女性狙撃手 · 体力90）",
        "狙撃銃ひとつ＋スキル3つ（PCは1·2·3キー、モバイルはスキルボタン）：1 暗襲狙撃（無敵、画面が暗転して照準円だけ、10秒以内に10発 · 1発200%）· 2 強力な一撃（溜める間は前の壁が弾を防ぐ、部屋を貫く1000%＋最大体力20%）· 3 連射（10発ばらまく）",
        "専用アイテム10 · テーマスキン9＋限定「夏の波」（水鉄砲）",
      ],
    },
  },
];
