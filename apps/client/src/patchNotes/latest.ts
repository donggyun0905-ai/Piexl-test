import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.190",
    date: "2026-10-28",
    items: {
      ko: [
        "좌클릭(공격)을 누른 채 우클릭하면 공격하면서 대시 · 게임 중 우클릭에 브라우저 메뉴(뒤로·새로고침)가 뜨지 않음",
        "패왕전 랭크전: 밴픽이 끝나면 혼자 하기처럼 스킬 설명과 오른쪽 작은 연습장이 있는 준비 화면을 보다가 저절로 시작 (약 15초)",
        "패왕전에서 쓰러져 관전할 때 내 스킨 대기 모션·효과가 보이던 문제 고침",
      ],
      en: [
        "Hold left click (attack) and right-click to dash while attacking · right-click no longer opens the browser menu in game",
        "Champion Clash Ranked: after the draft you get the same prep screen as solo (skill list and a small practice area on the right) before the match starts by itself (about 15s)",
        "Fixed your skin's idle animation and effects showing while spectating after being knocked out in Champion Clash",
      ],
      ja: [
        "左クリック (攻撃) を押したまま右クリックで攻撃しながらダッシュ · ゲーム中の右クリックでブラウザメニュー (戻る・再読み込み) が出ない",
        "覇王戦ランク戦: バンピック後、ソロと同じスキル説明と右の小さな練習場がある準備画面を経て自動で開始 (約15秒)",
        "覇王戦で倒れて観戦中に自分のスキンの待機モーション・効果が表示される問題を修正",
      ],
    },
  },
];
