import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.252",
    date: "2026-10-30",
    items: {
      ko: ["Tab 점수판 장비에 마우스를 올리면 창이 흔들리고 스크롤이 생겼다 없어지던 문제 (설명 창이 점수판 안에 붙어 크기를 바꿈)", "쟁탈전 가운데 점령지: 처음 점령만 상대 포탑 둘을 부숴야 하고, 그 뒤로는 서로 계속 빼앗을 수 있음 · 주인 편만 서 있으면 상대가 쌓던 점령도가 줄어듦 · AI도 빼앗기면 먼저 되찾으러 감", "상점에서 아래쪽 전설 장비를 누르면 재료 창이 맨 위에 떠서 스크롤을 올려야 보이던 문제 → 보고 있는 화면 가운데에"],
      en: ["Hovering gear on the Tab scoreboard made it shake and its scrollbar flicker (the tooltip was attached inside the board); fixed", "Divine Contest center: only the first capture needs both enemy towers down — after that it can be stolen back and forth · if only the owner stands in it, the other team's progress drains · AI rushes to retake it when lost", "In the shop, clicking legendary gear further down opened its recipe window at the very top; it now appears in the middle of the screen you're looking at"],
      ja: ["Tabスコアボードの装備にマウスを乗せるとウィンドウが揺れ、スクロールバーが出たり消えたりした問題（説明がボード内に付いて大きさが変わっていた）", "争奪戦の中央: 最初の占領だけ相手の砲塔2つを壊す必要があり、その後は何度でも奪い合える · 持ち主チームだけが立っていると相手の占領度が減る · AIも奪われたら先に奪い返しに行く", "ショップで下の方の伝説装備を押すと素材ウィンドウが一番上に出てスクロールを戻す必要があった問題 → 見ている画面の中央に"],
    },
  },
  {
    version: "0.48.251",
    date: "2026-10-30",
    items: {
      ko: ["패왕전 1대1·토너먼트 경기장 1.5배로 넓게 (모양은 그대로)", "패왕전 모든 대결에서 화면 줄이기(0.75배로 시작, 0.6배까지)·끌어 보기", "집 상점 추천 장비: 역할군마다 후보 여섯 중 아직 안 가진 셋을 보여 줌 (산 장비·금기된 아티팩트를 이미 가졌으면 다른 아티팩트는 빠짐)"],
      en: ["Champion Clash 1v1 and Tournament arenas are 1.5× larger (same layouts)", "Every Champion Clash mode now has the zoomed-out view (starts at 0.75×, down to 0.6×) and view dragging", "Home shop recommendations: three gear you don't own yet, picked from six per role (gear you bought — and other forbidden artifacts once you have one — drop out)"],
      ja: ["覇王戦1対1・トーナメントの闘技場を1.5倍に（形はそのまま）", "覇王戦の全対戦で画面縮小（0.75倍で開始、0.6倍まで）・画面ドラッグ", "拠点ショップのおすすめ装備: 役割ごとの候補6つから、まだ持っていない3つを表示（買った装備・禁じられたアーティファクトを持っていれば他のアーティファクトは除外）"],
    },
  },
  {
    version: "0.48.250",
    date: "2026-10-30",
    items: {
      ko: ["점령전도 화면 줄이기(0.75배로 시작, 0.6배까지)·끌어 보기 · 패왕전 결과 창을 가로로 넓혀 점수판이 옆으로 스크롤되지 않게"],
      en: ["Capture also gets the zoomed-out view (starts at 0.75×, down to 0.6×) and view dragging · the Champion Clash result window is wider so the scoreboard no longer scrolls sideways"],
      ja: ["占領戦も画面縮小（0.75倍で開始、0.6倍まで）・画面ドラッグ · 覇王戦の結果ウィンドウを横に広げ、スコアボードが横スクロールしないように"],
    },
  },
];
