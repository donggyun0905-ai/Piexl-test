import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.133",
    date: "2026-10-27",
    items: {
      ko: ["마법사·떠돌이 한정 '범 풍류' 스킨을 예전 디자인 그대로 새 그림체로 (금빛 테두리 · 마법사 범 귀 흰 두건과 남색·금 옷 · 떠돌이 금테 남색 두건과 흰·금 옷, 한정 효과도 그대로)"],
      en: ["Mage and Drifter limited Tiger skins now keep their original design in the new art style (golden outline · Mage's white tiger-ear hood with navy and gold · Drifter's gold-trimmed navy hood with white and gold; limited effects unchanged)"],
      ja: ["魔法使い・流れ者の限定「虎の風流」スキンを以前のデザインのまま新しい絵柄に（金の縁取り · 魔法使いは虎耳の白い頭巾と紺・金の服 · 流れ者は金縁の紺の頭巾と白・金の服、限定エフェクトもそのまま）"],
    },
  },
  {
    version: "0.48.132",
    date: "2026-10-27",
    items: {
      ko: [
        "원소술사 웨폰 마스터: 검이 커지고, 빛 꼬리를 끌며 휘어 날아가 적을 꿰뚫고 지나쳐 크게 돌아 다시 꿰뚫기를 되풀이한 뒤 돌아옴",
        "원소술사 상태이상: 무기·원소마다 색이 다른 상태이상 피해 숫자 (물 물결 · 땅 부식 · 번개 감전 · 빛 광휘 · 은하수 공허 · 중력 저주 · 갓 핸드 황금 · 별 폭풍 · 강철 출혈 · 트리거 폭풍, 행성도 하나씩)",
        "트리거: 50% 확률로 구슬 +1 → +2",
      ],
      en: [
        "Elementalist Blade Lord: bigger swords that curve out trailing light, pierce through foes, overshoot, swing around and pierce again before returning",
        "Elementalist statuses: each weapon and element now deals colored status damage (water tide · earth rot · lightning shock · light radiance · galaxy void · gravity curse · god hand gold · stars storm · steel bleed · trigger storm, plus one per planet)",
        "Trigger: the 50% orb bonus is now +2 instead of +1",
      ],
      ja: [
        "元素術師ウェポンマスター：剣が大きくなり、光の尾を引いて弧を描き、敵を貫いて通り過ぎ、大きく回ってまた貫くのを繰り返してから戻る",
        "元素術師の状態異常：武器・元素ごとに色の違う状態異常ダメージの数字（水は潮 · 土は腐食 · 雷は感電 · 光は光輝 · 天の川は虚空 · 重力は呪い · ゴッドハンドは黄金 · 星は嵐 · 鋼は出血 · トリガーは嵐、惑星にもそれぞれ）",
        "トリガー：50%で珠+1 → +2",
      ],
    },
  },
  {
    version: "0.48.131",
    date: "2026-10-27",
    items: {
      ko: [
        "마법사 새 모습 '별빛 마법사' (은빛 긴 머리 · 보석 이마띠 · 남색 로브 · 수정 지팡이) · 떠돌이 새 모습 '바람 유랑자' (바람에 날리는 목도리 · 가죽 재킷 · 화살통) · 두 캐릭터의 테마 스킨 9개와 한정 백호 스킨도 새로",
        "능력치 창: 처음부터 켜져 있고 캐릭터 설명이 펼쳐져 있음 (버튼으로 접기) · 아래에 이 캐릭터의 무기·전용 아이템 목록, 마우스를 올리면(모바일은 누르면) 설명",
      ],
      en: [
        "New Mage look 'Starlight Mage' (long silver hair · jeweled circlet · navy robe · crystal staff) · new Drifter look 'Wind Wanderer' (windswept scarf · leather jacket · quiver) · their 9 theme skins and limited White Tiger skins are redrawn too",
        "Stats panel: on from the start with the character guide open (a button folds it) · lists the character's weapons and own items below; hover (or tap on mobile) for details",
      ],
      ja: [
        "魔法使いの新しい姿「星明かりの魔法使い」（銀の長い髪 · 宝石の額飾り · 紺のローブ · 水晶の杖）· 流れ者の新しい姿「風の旅人」（風になびくマフラー · 革のジャケット · 矢筒）· 二人のテーマスキン9つと限定白虎スキンも描き直し",
        "能力値画面：最初から表示され、キャラ説明も開いた状態（ボタンで閉じる）· 下にこのキャラの武器・専用アイテム一覧、マウスを乗せると（モバイルはタップで）説明",
      ],
    },
  },
  {
    version: "0.48.130",
    date: "2026-10-27",
    items: {
      ko: ["변희 각성 갑옷 새로: 둥근 금속 가슴판 · 어깨 보호대 · 동물마다 상징 빛의 보석과 번쩍이는 기운", "관리자: 영웅의 길을 끝까지 깬 시간도 캐릭터마다 따로 모음"],
      en: ["New Byeonhui awakened armor: rounded metal chest plate · shoulder guard · gems and crackling energy in each animal's own color", "Admin: Hero's Path full-clear times are now collected per character too"],
      ja: ["ビョンヒの覚醒の鎧を一新：丸い金属の胸当て · 肩当て · 動物ごとの象徴色の宝石とほとばしる気", "管理者：英雄の道を最後までクリアした時間もキャラごとに別で集計"],
    },
  },
  {
    version: "0.48.129",
    date: "2026-10-27",
    items: {
      ko: [
        "변희 동물 능력 새로: 든 동물로 사냥하면 그 동물 경험치가 참 (일반 적 3 · 보스 20, 발밑 막대) · 100이 되면 그 동물 전용 능력 하나를 얻음 · 상점·보물방에서는 기본 아이템만 나옴 · 얻은 능력은 무기를 바꿔도 남음",
        "각성: 방어력 +20 · 공격 속도 +25% 추가 · 배·가슴에 동물마다 상징 색 갑옷 · 한 번 각성한 동물의 기술은 다른 동물을 들어도 계속 나옴 · 태양 불사조 각성 기술은 둘레 큰 열기 (안의 적에게 불꽃 x1~x5, 겹칠수록 센 화상)",
        "캐릭터 설명에 변희 각성 기술 목록",
      ],
      en: [
        "Byeonhui abilities reworked: hunting as an animal fills that animal's XP (3 per foe · 20 per boss, bar at her feet) · at 100 she gains one of its own abilities · shops and treasure rooms give only basic items · abilities stay when she switches weapons",
        "Awakening now also gives +20 defense and +25% attack speed, with chest armor in each animal's own color · awakened skills keep firing even as other animals · Sun Phoenix's skill is now a great heat around her (flames stack x1–x5 on foes inside, hotter burns as they stack)",
        "Byeonhui's awakened skills are listed in her character guide",
      ],
      ja: [
        "ビョンヒの動物能力を一新：持った動物で狩るとその動物の経験値が溜まる（通常の敵3 · ボス20、足元のバー）· 100でその動物の専用能力を一つ得る · ショップ・宝部屋は基本アイテムのみ · 得た能力は武器を替えても残る",
        "覚醒：防御力+20 · 攻撃速度+25%を追加 · 胸・腹に動物ごとの象徴色の鎧 · 一度覚醒した動物の技は別の動物でも出続ける · 太陽の不死鳥の覚醒技は周りに大きな熱気（中の敵に炎x1〜x5、重なるほど強い火傷）",
        "キャラ説明にビョンヒの覚醒技一覧",
      ],
    },
  },
  {
    version: "0.48.128",
    date: "2026-10-27",
    items: {
      ko: [
        "원소술사 손보기: 원소마다 상태이상 (불 화상 · 물 둔화 · 땅 기절 · 번개 감전 · 풀 독) · 행성도 하나씩 상태이상",
        "빛 구슬 30% 확률로 빛 폭발 · 은하수 안에 머문 적은 스택이 쌓여 100이면 빅뱅 · 중력은 내려찍은 자리에 두 번째 중력 · 강철 구슬 피해 +40% · 트리거 구슬 +1 확률 30% → 50%",
        "웨폰 마스터: 칼끝이 적을 향하는 진짜 검 5자루, 셋은 휘어지며 날아가 적을 쫓고 둘은 몸 둘레를 지키며 붙은 적을 벰 · 갓 핸드 모습 새로",
      ],
      en: [
        "Elementalist rework: each element inflicts a status (fire burn · water slow · earth stun · lightning shock · grass poison) · every planet now has a status too",
        "Light Orbs 30% chance to burst · foes staying inside the Milky Way build stacks and trigger a Big Bang at 100 · Gravity leaves a second gravity on the slam spot · Steel Orbs +40% damage · Trigger +1 orb chance 30% → 50%",
        "Blade Lord: 5 real swords with tips turned toward foes; 3 curve out to chase enemies, 2 guard your body and cut foes that close in · new God Hand look",
      ],
      ja: [
        "元素術師の見直し：元素ごとに状態異常（火は火傷 · 水は鈍化 · 土は気絶 · 雷は感電 · 草は毒）· 惑星にもそれぞれ状態異常",
        "光の珠は30%で光が弾ける · 天の川の中に留まった敵はスタックが溜まり100でビッグバン · 重力は叩きつけた場所に2つ目の重力 · 鋼の珠ダメージ+40% · トリガーの珠+1確率30% → 50%",
        "ウェポンマスター：切っ先が敵を向く本物の剣5本、3本は弧を描いて飛び敵を追い、2本は体の周りを守り近づいた敵を斬る · ゴッドハンドの見た目を一新",
      ],
    },
  },
];
