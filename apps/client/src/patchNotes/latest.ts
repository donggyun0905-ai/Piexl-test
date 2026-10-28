import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.198",
    date: "2026-10-28",
    items: {
      ko: ["패왕전 잔영 기본 공격: 뒤로 물러나던 것을 마우스에 가장 가까운 상대(사거리 안) 등 뒤로 순간이동해 숨었다가 그 상대를 찌르게 바꿈 (사거리 안에 상대가 없으면 제자리에서 숨었다가 앞을 찌름)"],
      en: ["Champion Clash Remnant basic attack: instead of stepping back, it now blinks behind the opponent nearest your cursor (in range), hides, then stabs that opponent (with no one in range it hides in place and stabs ahead)"],
      ja: ["覇王戦の残影の通常攻撃: 後ろに下がる代わりに、カーソルに一番近い相手(射程内)の背後へ瞬間移動して隠れ、その相手を突くように変更 (射程内に相手がいなければその場で隠れて前方を突く)"],
    },
  },
  {
    version: "0.48.197",
    date: "2026-10-28",
    items: {
      ko: [
        "미니 게임 새 단장: 카드 게임은 펠트 테이블과 진짜 같은 트럼프 카드(구석 숫자·가운데 무늬·뒤집히며 나옴), 주사위는 점이 찍힌 주사위와 굴림, 슬롯은 돌아가는 릴과 당첨 빛, 하이로우는 지난 카드 기록",
        "사과 상자 → '별사탕 상자': 숫자마다 색이 다른 별사탕, 터질 때 반짝이와 +점수, 한 번에 많이 묶으면 보너스, 남은 시간 막대, 최고 기록",
        "블록 쌓기 → '룬 블록': 빛나는 룬 무늬 돌(색은 무작위), 놓일 자리 표시, 다음 돌, 단계가 오를수록 빨라짐, 점수·최고 기록, 줄을 지우면 번쩍",
        "숫자 타일·조커 게임도 테이블·타일·카드 모양 다듬음 · 로비 게임기 그림도 새 이름에 맞춤",
      ],
      en: [
        "Mini game makeover: card games get a felt table and real playing cards (corner indexes, center suit, flip-in), dice show proper pips and roll, slots have spinning reels and a win glow, High-Low shows recent cards",
        "Apple Box → 'Star Candy Box': candies colored by number, sparkles and +points when they pop, bonus for big boxes, a time bar and best score",
        "Block Stack → 'Rune Drop': stones with glowing rune marks (random colors), landing preview, next piece, levels that speed up, points and best score, flashing line clears",
        "Number Tiles and Joker Game tables, tiles and cards polished too · lobby machine art updated to match the new names",
      ],
      ja: [
        "ミニゲームを一新: カードゲームはフェルトのテーブルと本物らしいトランプ (隅の数字・中央の柄・めくれて登場)、サイコロは目のあるサイコロと転がり、スロットは回るリールと当たりの光、ハイ&ローは直前のカード履歴",
        "リンゴ箱 → 「金平糖の箱」: 数字ごとに色が違う金平糖、はじけるときのきらめきと+点数、一度に多く囲むとボーナス、残り時間バー、ベスト記録",
        "ブロック積み → 「ルーンブロック」: 光るルーン模様の石 (色はランダム)、落下位置表示、次の石、レベルが上がるほど速く、スコア・ベスト記録、ライン消去で光る",
        "数字タイル・ジョーカーゲームもテーブル・タイル・カードを調整 · ロビーのゲーム機の絵も新しい名前に合わせた",
      ],
    },
  },
  {
    version: "0.48.196",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 점수판(Tab)에 치유량(이 판에 받은 회복) 칸 추가",
        "랭크전 상대를 찾거나 대기실에서 기다리는 동안 미니 게임 8가지를 눌러서 바로 할 수 있음",
        "친구 방 패왕전: 밴픽이 끝나면 랭크전처럼 스킬 설명·작은 연습장 준비방이 저절로 뜨고, 방장은 거기서 대결 시작 (손님은 방장을 기다림, 뒤로 가면 대기실)",
      ],
      en: [
        "Added a Healed column (healing received this match) to the Champion Clash scoreboard (Tab)",
        "While searching for a Ranked match or waiting in its lobby, you can play any of 8 mini games",
        "Champion Clash friend rooms: after the draft, the skill list and small practice area open automatically like Ranked, and the host starts the match from there (guests wait for the host; going back returns to the lobby)",
      ],
      ja: [
        "覇王戦スコアボード (Tab) に回復量 (この試合で受けた回復) の列を追加",
        "ランク戦の相手探し中や待機部屋で待つ間、ミニゲーム8種をすぐに遊べる",
        "友だち部屋の覇王戦: バンピック後、ランク戦のようにスキル説明・小さな練習場の準備画面が自動で開き、部屋主がそこで対決開始 (ゲストは部屋主を待つ、戻ると待機部屋)",
      ],
    },
  },
];
