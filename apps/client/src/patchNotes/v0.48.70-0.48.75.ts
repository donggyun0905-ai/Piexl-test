import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.75",
    date: "2026-10-23",
    items: {
      ko: [
        "🦆 히든 캐릭터 '오리' 추가: 무작위 캐릭터로 시작하면 5% 확률로 등장 (별지기 10%와 따로) · 연습장에서는 바로 고를 수 있음",
        "오리: 꽥 음파가 앞쪽 적을 모두 맞히고 밀어냄, 4번째 꽥마다 둘레 전체에 큰 꽥(피해 1.5배·기절) · 새끼 오리가 줄지어 따라오며 적 탄을 막고(1초마다 한 번) 같이 꽥 함 · 체력 130·공격력 12·이동 1.4·행운 2",
        "오리 전용 무기 10개(고무 오리·확성기·깃털 부채·황금알·엄마 오리·물웅덩이·천둥 꽥·백조의 노래·거품 꽥·왕관 오리)와 전용 아이템 10개 · 업적 '꽥꽥 대모험'(오리로 클리어)",
      ],
      en: [
        "🦆 New hidden character: the Duck — 5% chance when you start with a random character (separate from the Stargazer's 10%) · selectable directly in Practice",
        "Duck: quack shockwaves hit and push back every foe in front; every 4th is a Big Quack all around (×1.5 damage, stun) · Ducklings follow in a line, block enemy shots (once per second) and quack along · HP 130, damage 12, speed 1.4, luck 2",
        "10 Duck weapons (Rubber Duck, Megaphone, Feather Fan, Golden Egg, Mother Duck, Puddle Stomp, Thunder Quack, Swan Song, Bubble Quack, Crowned Duck) and 10 exclusive items · Achievement 'Quack Quest' (clear as the Duck)",
      ],
      ja: [
        "🦆 隠しキャラ「アヒル」追加：ランダムなキャラで開始すると5%の確率で登場（星守りの10%とは別）· 練習場ではすぐ選べる",
        "アヒル：ガーガー音波が前方の敵をまとめて攻撃して押し返す、4回ごとに周り全体へ大ガーガー（ダメージ1.5倍・気絶） · 子アヒルが一列について来て敵の弾を防ぎ（1秒に1回）一緒にガーガー · 体力130・攻撃力12・移動1.4・運2",
        "アヒル専用武器10個（ゴムのアヒル・拡声器・羽根の扇・金の卵・母アヒル・水たまり・雷のガーガー・白鳥の歌・泡のガーガー・王冠のアヒル）と専用アイテム10個 · 実績「ガーガー大冒険」（アヒルでクリア）",
      ],
    },
  },
  {
    version: "0.48.74",
    date: "2026-10-23",
    items: {
      ko: ["금기의 서 '끈질긴 생명'(적·보스 체력 회복)을 뺌 (금기 30가지, 최대 136점). 걸어 두었던 사람은 자동으로 풀림"],
      en: ["Removed the Book of Taboos 'Stubborn Life' (enemy and boss regeneration) (30 taboos, up to 136 points). It is cleared automatically if you had it on"],
      ja: ["禁忌の書「しぶとい命」（敵・ボスの体力回復）を削除（禁忌30種、最大136点）。かけていた場合は自動で解除"],
    },
  },
  {
    version: "0.48.73",
    date: "2026-10-23",
    items: {
      ko: [
        "무작위 캐릭터로 시작하면 그 직업의 무작위 무기 · 무작위 패시브(전용이 있으면 전용) · 무작위 사용 아이템 2개를 들고 시작 (판 시드로 정해짐, 레이드 명예의 전당에는 보내지 않음)",
        "히든 캐릭터 '별지기': 무작위 캐릭터로 시작하면 10% 확률로 등장 (연습장에서는 바로 고를 수 있음). 별을 박아 별자리를 그리고, 가까운 별끼리 이어진 빛줄기가 닿는 적을 태우며, 별이 가득 차면 별자리가 완성되어 모든 별이 한꺼번에 터짐. 전용 무기 10개(혜성 꼬리·쌍둥이 별·검은 별·초신성의 심장·북극성·유성우·은하수·얼음별·작은 태양 등) · 전용 아이템 10개",
      ],
      en: [
        "Starting with a random character now also gives a random class weapon, a random passive (class-exclusive if there is one) and 2 random usable items (decided by the run seed; these runs are not sent to the Raid Hall of Fame)",
        "Hidden character 'Stargazer': 10% chance to appear when you pick a random character (selectable directly in Practice). Pin stars to draw constellations; beams between nearby stars burn foes, and a full constellation makes every star burst at once. 10 exclusive weapons (Comet Tail, Twin Stars, Black Star, Heart of a Supernova, Polaris, Meteor Shower, Milky Way, Frost Star, Tiny Sun and more) and 10 exclusive items",
      ],
      ja: [
        "ランダムなキャラで開始すると、その職業のランダム武器・ランダムパッシブ（専用があれば専用）・ランダムな使用アイテム2つを持って開始（回のシードで決定、レイド殿堂には送らない）",
        "隠しキャラ「星守り」：ランダムなキャラで開始すると10%の確率で登場（練習場ではすぐ選べる）。星を打ち込んで星座を描き、近い星同士をつなぐ光の線が敵を焼き、星が満ちると星座が完成して全ての星が一斉に弾ける。専用武器10個（彗星の尾・双子星・黒い星・超新星の心臓・北極星・流星群・天の川・氷の星・小さな太陽など）・専用アイテム10個",
      ],
    },
  },
  {
    version: "0.48.72",
    date: "2026-10-23",
    items: {
      ko: ["금기의 서 '끈질긴 생명': 보스는 저절로 체력이 차지 않고, 나를 때릴 때마다 최대 체력의 1%(건 수만큼)씩 참 (일반 적은 그대로 1초마다)"],
      en: ["Book of Taboos 'Stubborn Life': bosses no longer regenerate on their own; they heal 1% max HP (per stack) each time they hit you (normal enemies still regenerate every second)"],
      ja: ["禁忌の書「しぶとい命」：ボスは自然に回復せず、自分を攻撃するたびに最大体力の1%（かけた数だけ）回復（通常の敵はそのまま1秒ごと）"],
    },
  },
  {
    version: "0.48.71",
    date: "2026-10-23",
    items: {
      ko: [
        "캐릭터 머리 위에도 작은 체력바 (깎이는 게 바로 보이게, 절반 아래면 노랑·4분의 1 아래면 빨강)",
        "이무기 COMBO·CRIT, 악의 사도 영혼 표시를 작게 줄이고 살짝 투명하게",
        "우클릭을 꾹 누르고 있으면 대시가 찰 때마다 계속 대시",
        "황금방 300원 동전을 아주 크게: 톱니 테두리·별 무늬·반짝이는 빛, 위에 금액 표시 (닿는 거리도 넓어짐)",
        "악의 사도: 분노·질투 십자가 장판 위에서는 화상·독 피해가 2배 빨리 들어감 · 사탄의 가면 피해가 최대 체력의 10%로 (보스는 최대 체력의 1/4 기준, 예전 1/5)",
        "새 훈장: 무한 모드 최고 층 · 레이드 아레나 최고 레벨 · 영웅의 길 최고 단계 (캐릭터마다), 타워 디펜스 하늘 성채(별 5개) 클리어 (남은 목숨, 모든 캐릭터 카드에 달 수 있음). 기록이 높을수록 훈장이 화려해짐",
      ],
      en: [
        "A small HP bar now also shows above your character (yellow below half, red below a quarter)",
        "Imugi COMBO/CRIT and Apostle soul counters are now smaller and slightly transparent",
        "Hold right-click to keep dashing whenever a dash is ready",
        "The 300-gold coin in golden rooms is now huge: notched rim, star pattern, sparkle and the amount above it (and easier to pick up)",
        "Apostle: on Wrath and Envy fields, burn and poison tick twice as fast · Mask of Satan now deals 10% of max HP (bosses use 1/4 of max HP, was 1/5)",
        "New medals: best Endless floor, best Raid Arena level, best Hero's Path stage (per character), and clearing Tower Defense Sky Citadel (5 stars, lives left; can be worn on any character card). Better records make fancier medals",
      ],
      ja: [
        "キャラクターの頭上にも小さな体力バー（半分以下で黄色、4分の1以下で赤）",
        "イムギのCOMBO・CRIT、悪の使徒の魂表示を小さく少し透明に",
        "右クリックを押し続けるとダッシュが溜まるたびに連続ダッシュ",
        "黄金部屋の300コインをとても大きく：ギザギザの縁・星の模様・きらめき、上に金額表示（触れる距離も広く）",
        "悪の使徒：憤怒・嫉妬の十字架の床の上では火傷・毒ダメージが2倍速く · サタンの仮面のダメージが最大体力の10%に（ボスは最大体力の1/4基準、以前は1/5）",
        "新しい勲章：エンドレス最高階 · レイドアリーナ最高レベル · 英雄の道最高段階（キャラクターごと）、タワーディフェンス天空の城塞（星5）クリア（残りライフ、全キャラクターのカードに付けられる）。記録が高いほど勲章が豪華に",
      ],
    },
  },
  {
    version: "0.48.70",
    date: "2026-10-23",
    items: {
      ko: [
        "금기의 서: 캐릭터 선택창 '무작위 캐릭터' 옆 버튼. 금기 31가지(적 체력·수·속도, 받는 피해, 돈·상점·보상, 내 몸)를 스스로 걸어 더 어렵게 시작. 같은 금기를 여러 번 걸 수 있고 걸 때마다 금기 점수가 더해짐 (최대 142점)",
        "금기를 건 판으로 라스트 보스를 깨면 훈장에 금기 점수가 새겨짐. 점수가 높을수록 훈장이 화려해짐 (동 → 은 날개 → 금 빛살·보석 → 흑요석 후광 → 전설 불꽃·왕관 → 100점 이상 무지개). 금기를 건 판은 순위표에 남지 않음",
        "닌자 표식 숫자가 적 체력바 위에 보이게",
        "라스트 보스 층 상점: 새로고침하면 회복약 칸도 새로 채워짐",
      ],
      en: [
        "Book of Taboos: a new button next to 'Random character' on character select. Pick from 31 taboos (enemy HP, numbers and speed, damage taken, gold, shop and rewards, your own body) to make the run harder. Many can be stacked, and every stack adds taboo points (up to 142)",
        "Defeat a final boss with taboos on to get a medal engraved with your taboo points. Higher points make a fancier medal (bronze → silver wings → gold rays and gems → obsidian halo → legendary flames and crown → rainbow at 100+). Taboo runs are not ranked",
        "Ninja mark counters now show above the enemy HP bar",
        "Final floor shop: rerolling now also restocks the potion slots",
      ],
      ja: [
        "禁忌の書：キャラクター選択画面の「ランダムキャラクター」の横にボタン。禁忌31種（敵の体力・数・速さ、被ダメージ、お金・ショップ・報酬、自分の体）を自分でかけて難しく始める。同じ禁忌を何度もかけられ、かけるたびに禁忌点数が加算（最大142点）",
        "禁忌をかけた回でラストボスを倒すと勲章に禁忌点数が刻まれる。点数が高いほど勲章が豪華に（銅 → 銀の翼 → 金の光・宝石 → 黒曜石の後光 → 伝説の炎・王冠 → 100点以上で虹）。禁忌をかけた回はランキングに残らない",
        "忍者の印の数字が敵の体力バーの上に表示されるように",
        "ラストボス階のショップ：更新すると回復薬の欄も補充されるように",
      ],
    },
  },
];
