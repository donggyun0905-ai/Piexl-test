import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.6",
    date: "2026-11-10",
    items: {
      ko: ["레이드 대장간: 암흑 강화로 무기가 부서진 뒤 '처음부터 다시'를 누르면 부서진 무기를 돌려받음 (대장간에 처음 들어온 것처럼 강화·돈·무기 모두 되돌림)"],
      en: ["Raid forge: after a Dark Enhance destroys your weapon, 'Start over' now gives the weapon back (weapon, upgrades and gold reset as if you just entered the forge)"],
      ja: ["レイドの鍛冶場: 暗黒強化で武器が壊れた後「最初からやり直す」を押すと壊れた武器が戻ります（鍛冶場に入った直後のように武器・強化・お金をすべて戻す）"],
    },
  },
  {
    version: "0.52.5",
    date: "2026-11-10",
    items: {
      ko: [
        "레이드 장비창: 창을 좌우로 넓히고 '장비 능력치 합계'(왼쪽)와 '세트 효과'(오른쪽)를 나란히 놓아 줄이 많아져도 덜 길어지게",
        "추가 능력치 색: 범위에서 가장 높은 값은 금색 · 상위 보라 · 중위 흰색 · 하위 하늘색 · 최하위 회색 (장신구 설명 아래에 색 뜻)",
        "레이드 성공 보상: 보상 상자를 열면 로비 칩 30,000개",
        "레이드 랭킹: 보스를 잡기까지 걸린 시간(컷신 빼고)으로 서버 순위표 · 사람마다 가장 빠른 기록 · 같이 싸운 캐릭터·사람 수 표시 · 레이드 화면의 '레이드 랭킹' 버튼",
      ],
      en: [
        "Raid gear window: wider, with 'Total from gear' (left) and 'Set bonus' (right) side by side so it stays shorter as stats pile up",
        "Bonus stat colors: the max value of its range is gold · high purple · mid white · low sky blue · lowest gray (legend under the item details)",
        "Raid clear reward: opening the reward chest gives 30,000 lobby chips",
        "Raid ranking: an online leaderboard by time to defeat the boss (cutscenes excluded) · best time per player · shows party characters and player count · 'Raid ranking' button in the raid menu",
      ],
      ja: [
        "レイド装備画面: 横に広げ、「装備能力の合計」（左）と「セット効果」（右）を並べて、行が増えても縦に長くなりにくく",
        "追加能力の色: 範囲の最高値は金 · 上位は紫 · 中位は白 · 下位は水色 · 最下位は灰色（アクセサリー説明の下に色の意味）",
        "レイド成功報酬: 報酬の箱を開けるとロビーチップ 30,000枚",
        "レイドランキング: ボスを倒すまでの時間（カットシーン除く）のサーバー順位表 · 一人一つの最速記録 · 一緒に戦ったキャラ・人数を表示 · レイド画面の「レイドランキング」ボタン",
      ],
    },
  },
  {
    version: "0.52.4",
    date: "2026-11-10",
    items: {
      ko: ["레이드 장신구 승급 추가: 1성 → 2성(같은 종류 1성 2개) · 2성 → 3성(같은 종류 2성 3개). 이제 1성부터 5성까지 모두 승급할 수 있어요"],
      en: ["Raid accessory promotion extended: 1★→2★ (two 1★ of the same type) · 2★→3★ (three 2★ of the same type). Every star from 1★ to 5★ can now be promoted"],
      ja: ["レイドアクセサリーの昇級を追加: 1★→2★（同じ種類の1★を2つ）· 2★→3★（同じ種類の2★を3つ）。1★から5★まですべて昇級できます"],
    },
  },
  {
    version: "0.52.3",
    date: "2026-11-10",
    items: {
      ko: [
        "같이 하기·협동 화면 새 단장: 입장 화면에 제목과 캐릭터 그림 카드 · 대기실은 위에 제목·방 코드, 사람마다 움직이는 캐릭터 그림 자리 카드(빈 자리를 누르면 초대), 진영 탭이 있는 그림 캐릭터 고르기, 아래 고정된 나가기·시작 줄",
        "협동 게임 중 파티 창: 캐릭터 얼굴 · 자리 색 줄 · 체력 숫자가 보이는 둥근 체력 막대 · 결과 표도 다듬음",
      ],
      en: [
        "Play Together / Co-op screens redesigned: entry screen with a title and character art cards · the room now shows the title and room code on top, a seat card with an animated character for each player (tap an empty seat to invite), a character picker with faction tabs and art, and a fixed Leave/Start bar at the bottom",
        "Co-op party panel in game: character faces, seat color stripes and rounded HP bars with numbers · the results table was polished too",
      ],
      ja: [
        "みんなで遊ぶ・協力プレイの画面を一新: 入場画面にタイトルとキャラ絵カード · 待機室は上にタイトル・部屋コード、プレイヤーごとに動くキャラ絵の席カード（空き席を押すと招待）、陣営タブ付きの絵で選ぶキャラ選択、下に固定の退出・開始バー",
        "協力プレイ中のパーティ欄: キャラの顔・席の色の帯・数字つきの丸い体力バー · 結果表も整えました",
      ],
    },
  },
];
