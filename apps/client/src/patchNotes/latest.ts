import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.325",
    date: "2026-11-01",
    items: {
      ko: ["단련의 방 샌드백을 조금 느리게 (처음 1.2초, 가장 빠를 때 0.36초)"],
      en: ["Training Room Sandbag slightly slower (1.2s at first, 0.36s at fastest)"],
      ja: ["鍛錬の部屋のサンドバッグを少し遅く（最初1.2秒、最速0.36秒）"],
    },
  },
  {
    version: "0.48.324",
    date: "2026-11-01",
    items: {
      ko: ["단련의 방 효과음: 샌드백 퍽 · 랫풀다운 공 터짐 · 벤치 프레스 밀기·힘 가득·바벨 내려놓기 · 실수 · 미니게임 끝 · 강화", "단련의 방 강화 목록에서 흡혈을 뺌"],
      en: ["Training Room sound effects: sandbag punches · Lat Pulldown ball pops · Bench Press pushes, full strength and racking the bar · misses · minigame end · upgrades", "Lifesteal removed from the Training Room upgrade list"],
      ja: ["鍛錬の部屋の効果音: サンドバッグを打つ音 · ラットプルダウンのボールが割れる音 · ベンチプレスの押す音・力満タン・バーベルを置く音 · ミス · ミニゲーム終了 · 強化", "鍛錬の部屋の強化リストから吸血を外した"],
    },
  },
  {
    version: "0.48.323",
    date: "2026-11-01",
    items: {
      ko: ["라스트 보스방에 처음 들어가면 체력 가득: 7층뿐 아니라 무한 모드(11층부터 큰 보스방)·영웅의 길 라스트 보스방에서도 되게 고침"],
      en: ["Full heal on first entering a last-boss room now also works in Endless mode (big boss rooms from floor 11) and Hero's Road, not just floor 7"],
      ja: ["ラストボス部屋に初めて入ると体力全快: 7階だけでなく無限モード（11階からの大きなボス部屋）・英雄の道のラストボス部屋でも効くよう修正"],
    },
  },
  {
    version: "0.48.322",
    date: "2026-11-01",
    items: {
      ko: [
        "여신의 선물: 얻을 수 있는 아이템 종류가 적은 경우(해금이 적을 때·풋내기·변희) 6개만 나오던 것 고침 → 늘 9개 (모자라면 겹쳐 가질 수 있는 아이템으로 채움)",
        "단련의 방 샌드백: 화살표를 ↑↓←→ 모양으로 · 바로 앞 두 번과 다른 방향만 나와 같은 방향·두 방향 번갈아 반복이 없음 · 더 빨라짐",
        "단련의 방 벤치 프레스: 힘이 더 빨리 빠지고 한 번 누를 때 덜 차서 더 어려움",
      ],
      en: [
        "Goddess's Gift: fixed only 6 items appearing when few item types were available (few unlocks, Novice, Byeonhui) → always 9 (filled with stackable items if short)",
        "Training Room Sandbag: arrows now shown as ↑↓←→ · never the same as the previous two, so no repeats or back-and-forth patterns · faster",
        "Training Room Bench Press: strength drains faster and each press fills less, so it's harder",
      ],
      ja: [
        "女神の贈り物: 出せるアイテムの種類が少ない時（解放が少ない・見習い・ピョンヒ）6個しか出なかったのを修正 → 常に9個（足りなければ重ねて持てるアイテムで補充）",
        "鍛錬の部屋サンドバッグ: 矢印を↑↓←→の形に · 直前2回と違う方向だけ出るので同じ方向・2方向の交互の繰り返しがない · より速く",
        "鍛錬の部屋ベンチプレス: 力がより早く抜け、1回押して溜まる量が減ってより難しく",
      ],
    },
  },
  {
    version: "0.48.321",
    date: "2026-11-01",
    items: {
      ko: [
        "몬스터 처치 돈: 이제 40% 확률로만 나옴 (정예는 그대로 늘 나옴) · 라스트 보스 층에서는 돈이 나오지 않음",
        "라스트 보스 층 '황금방' → '여신의 선물' (돈 300 없앰, 아이템 9개 중 3개 고르기는 그대로) · 상점 → '천상의 상점' · 두 방 모두 하얀 대리석 방·여신 표시·하얀 기둥으로 꾸밈 (지도에도 하얀 칸)",
        "단련의 방 랫풀다운: 공이 한 번에 1~2개, 왼쪽·오른쪽 무작위로 나오고 더 빨라짐",
        "단련의 방 미니게임을 하는 동안 게임 시간이 멈춤 (혼자 하는 판)",
        "연습장 '방' 탭: 상점·천상의 상점·여신의 선물·보물방·단련의 방·쉼터를 바로 시험 (단련의 방은 몇 번이고 다시)",
      ],
      en: [
        "Monster gold: now drops only 40% of the time (elites still always drop) · no gold on the last-boss floor",
        "Last-boss floor 'Golden Room' → 'Goddess's Gift' (300 gold removed, still pick 3 of 9 items) · shop → 'Celestial Shop' · both rooms decorated in white marble with the goddess mark and white pillars (white on the map too)",
        "Training Room Lat Pulldown: 1-2 balls at a time from random sides, and faster",
        "Game time is paused while playing a Training Room minigame (solo runs)",
        "Practice 'Rooms' tab: try the shop, Celestial Shop, Goddess's Gift, treasure room, Training Room and rest room instantly (training gear reusable)",
      ],
      ja: [
        "モンスター討伐のお金: 40%の確率でのみ出る（精鋭は今まで通り必ず出る）· ラストボスの階ではお金が出ない",
        "ラストボスの階「黄金部屋」→「女神の贈り物」（お金300を削除、アイテム9個から3個選ぶのはそのまま）· ショップ →「天上のショップ」· どちらも白い大理石の部屋・女神の印・白い柱で飾り付け（地図でも白いマス）",
        "鍛錬の部屋ラットプルダウン: ボールが一度に1〜2個、左右ランダムに出てより速く",
        "鍛錬の部屋のミニゲーム中はゲーム時間が止まる（ソロ）",
        "練習場「部屋」タブ: ショップ・天上のショップ・女神の贈り物・宝部屋・鍛錬の部屋・休憩所をすぐ試せる（鍛錬の器具は何度でも）",
      ],
    },
  },
  {
    version: "0.48.320",
    date: "2026-11-01",
    items: {
      ko: [
        "새 방 '단련의 방': 4층부터 층마다 꼭 1개 · 샌드백·랫풀다운·벤치 프레스 중 하나만 F로 사용 (방마다 한 번)",
        "샌드백: 화살표 방향을 때맞춰 · 랫풀다운: 공이 가운데 칸에 있을 때 패드 · 벤치 프레스: 패드를 계속 눌러 바벨 버티기 · 갈수록 빨라짐",
        "점수(최대 1000) 100점마다 단련 포인트 1 (최대 10) → 능력치·무기 숙련·가진 패시브를 눌러 강화 (단계당 오르는 몫·지금 오른 몫 표시, 능력치 창 바로 반영)",
        "가디언 정예: 체력 조금 늘고 공격 주기 더 빠름 · 거인 정예: 체력은 그대로, 내려치기 범위 1.5배",
      ],
      en: [
        "New room 'Training Room': exactly one per floor from floor 4 · use one of Sandbag, Lat Pulldown or Bench Press with F (once per room)",
        "Sandbag: hit the arrow direction in time · Lat Pulldown: press the pad while a ball is in the middle zone · Bench Press: keep tapping the pad to hold the bar · they speed up over time",
        "Every 100 score (max 1000) gives 1 training point (max 10) → click to upgrade stats, weapon mastery or owned passives (per-level and current amounts shown, stats panel updates instantly)",
        "Elite Guardian: a little more HP and attacks more often · Elite Golem: no extra HP, slam radius 1.5×",
      ],
      ja: [
        "新しい部屋「鍛錬の部屋」: 4階から各階に必ず1つ · サンドバッグ・ラットプルダウン・ベンチプレスのどれか1つだけFで使用（部屋ごとに1回）",
        "サンドバッグ: 矢印の方向をタイミングよく · ラットプルダウン: ボールが中央の枠にある時にパッド · ベンチプレス: パッドを押し続けてバーベルを支える · だんだん速くなる",
        "スコア（最大1000）100点ごとに鍛錬ポイント1（最大10）→ 能力値・武器熟練・持っているパッシブを押して強化（1段階の上昇量・現在の上昇量を表示、能力値画面にすぐ反映）",
        "ガーディアン精鋭: 体力少し増え攻撃間隔がより短い · 巨人精鋭: 体力はそのまま、叩きつけ範囲1.5倍",
      ],
    },
  },
];
