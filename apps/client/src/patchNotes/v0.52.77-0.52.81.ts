import type { PatchNote } from "./types";

// 지난 패치 노트 0.52.77~0.52.81
export const NOTES: PatchNote[] = [
  {
    version: "0.52.81",
    date: "2026-11-13",
    items: {
      ko: ["스토리를 장면으로: 위에는 장면 그림, 아래에는 한 문단씩 넘기는 대사 상자(말하는 캐릭터 얼굴·이름) · 누르기·Space로 다음, ←로 이전, Esc로 닫기 · '책으로 보기'로 예전처럼 읽기 · 아카이브 › 스토리와 세계 지도 이야기 모두 · 장면 일러스트는 차례로 채우는 중 (그 전에는 임시 배경 + 말하는 캐릭터)"],
      en: ["Story as scenes: an illustration on top and a dialogue box below that advances one paragraph at a time (speaker face and name) · tap/Space for next, ← to go back, Esc to close · 'Read as book' for the old view · in both Archive › Story and the world map · scene illustrations are being added (until then, a placeholder background with the speaking character)"],
      ja: ["ストーリーをシーンで：上にシーンの絵、下に一段落ずつ進む台詞ボックス（話す人の顔・名前）・タップ・Spaceで次、←で前、Escで閉じる・「本で読む」で以前の形式・アーカイブ › ストーリーと世界地図の物語の両方・シーンのイラストは順次追加中（それまでは仮の背景と話すキャラクター）"],
    },
  },
  {
    version: "0.52.80",
    date: "2026-11-13",
    items: {
      ko: ["세계 지도 (시험 서버에서만): 아스칼론 성 안 마을(집·분수·주민 마법사·떠돌이·풋내기와 대화) · 장군에게 말 걸면 지금까지 열린 스토리 장을 책으로 · 처음 들어오면 1장 이야기부터 · 던전에 다녀오면 메인 화면 대신 지도로 돌아옴"],
      en: ["World map (test server only): the town inside Ascalon Castle (houses, fountain, talk with the Mage, Drifter and Novice) · talk to the General to read the latest unlocked story chapter · first visit starts with Chapter 1 · after a dungeon run you return to the map instead of the menu"],
      ja: ["世界地図（テストサーバーのみ）：アスカロン城の城下町（家・噴水・魔法使い・流れ者・見習いと会話）・将軍に話しかけるとここまで開いたストーリーの章を本で読める・初めて入ると1章から・ダンジョンから戻るとメイン画面ではなく地図へ"],
    },
  },
  {
    version: "0.52.79",
    date: "2026-11-13",
    items: {
      ko: ["세계 지도 준비 (시험 서버에서만 보임): 혼자 하기 › 세계 지도에서 아스칼론 필드를 걸어 다님 · 성·밭·바위산·강과 다리·국경 숲 · 던전 입구에서 F로 혼자 하기 시작 · 표지판 읽기 · 마지막 자리 기억 · 로비와 같은 조작"],
      en: ["World map preview (test server only): walk the Ascalon field from Play Solo › World Map · castle, fields, rocky hills, river and bridge, border forest · press F at the dungeon entrance to start a run · read signs · remembers where you left off · same controls as the lobby"],
      ja: ["世界地図の準備（テストサーバーのみ）：ひとりで遊ぶ › 世界地図でアスカロンのフィールドを歩ける・城・畑・岩山・川と橋・国境の森・ダンジョンの入口でFを押すとひとりで遊ぶを開始・看板を読む・最後の位置を記憶・ロビーと同じ操作"],
    },
  },
  {
    version: "0.52.78",
    date: "2026-11-13",
    items: {
      ko: [
        "스토리 진행: 처음 온 사람은 아스칼론 진영과 혼자 하기부터 시작하고, 혼자 하기 기록으로 스토리 장이 하나씩 열림 (1층 보스 → 1장 · 3층 보스 → 2장 · 첫 클리어 → 3장 · 라스트 보스 → 4장 · 영웅의 길 3단계 → 5장 · 무한 모드 10층 → 6장 · 클리어 5·8·12번 → 7~9장)",
        "장이 열릴 때마다 진영(1장 비르디아 · 2장 테라코어 · 3장 헬리오스 · 6장 아카식 레코드·이방인 · 7장 새벽의 성흔·아슈바르 · 8장 성국 · 9장 탈라시아·실베르)과 모드(1장 일일 도전 · 2장 함께 하기·협동 · 3장 이벤트·타워 디펜스·상점·로비 · 4장 영웅의 길 · 5장 무한 모드 · 6장 레이드 아레나·레이드 · 7장 패왕전 · 9장 금기의 서)가 열림 · 메인 화면에 새 장 알림·다음 장 조건",
        "이미 하던 분은 지금처럼 모두 열린 채로 그대로",
      ],
      en: [
        "Story progress: newcomers start with the Ascalon faction and Solo, and story chapters unlock one by one from Solo records (floor 1 boss → Ch.1 · floor 3 boss → Ch.2 · first clear → Ch.3 · Last Boss → Ch.4 · Hero's Path stage 3 → Ch.5 · Endless Mode floor 10 → Ch.6 · 5/8/12 clears → Ch.7–9)",
        "Each chapter opens factions (Ch.1 Virdia · Ch.2 Terracore · Ch.3 Helios · Ch.6 Akashic Records/Outsiders · Ch.7 Dawn Stigmata/Ashvar · Ch.8 Holy Kingdom · Ch.9 Thalassia/Silber) and modes (Ch.1 Daily Challenge · Ch.2 Play Together/Co-op · Ch.3 Events/Tower Defense/Shop/Lobby · Ch.4 Hero's Path · Ch.5 Endless Mode · Ch.6 Raid Arena/Raid · Ch.7 Champion Clash · Ch.9 Book of Taboos) · the main screen shows new chapters and the next goal",
        "Existing players keep everything unlocked as before",
      ],
      ja: [
        "ストーリー進行：初めての方はアスカロン陣営と「ひとりで遊ぶ」から始まり、「ひとりで遊ぶ」の記録でストーリーの章が一つずつ開く（1階ボス→1章・3階ボス→2章・初クリア→3章・ラストボス→4章・英雄の道ステージ3→5章・エンドレスモード10階→6章・クリア5・8・12回→7～9章）",
        "章が開くたびに陣営（1章ヴィルディア・2章テラコア・3章ヘリオス・6章アカシックレコード・異邦人・7章暁の聖痕・アシュヴァル・8章聖国・9章タラシア・シルベル）とモード（1章デイリーチャレンジ・2章みんなで遊ぶ・協力プレイ・3章イベント・タワーディフェンス・ショップ・ロビー・4章英雄の道・5章エンドレスモード・6章レイドアリーナ・レイド・7章覇王戦・9章禁忌の書）が開く・メイン画面に新しい章の通知と次の章の条件",
        "すでに遊んでいた方はこれまで通りすべて開いたまま",
      ],
    },
  },
  {
    version: "0.52.77",
    date: "2026-11-13",
    items: {
      ko: ["마젠타: 궁극기(4번)를 빼고 공격 범위·이펙트를 줄이고 피해를 조금 줄임 · 특히 2번(악몽의 꽃밭·영혼 유린)·3번(유혹의 소용돌이·매혹의 강우) 스킬이 작아짐 (꽃밭 24타 · 영혼 유린 14타 · 소용돌이 30타 · 강우 8타 · 꽃감옥 6타 · 꽃가루 5타 · 환영분신 4타)"],
      en: ["Magenta: smaller areas and effects and slightly less damage on everything except the ultimate (skill 4) · skills 2 (Garden of Nightmares, Soul Ravage) and 3 (Vortex of Temptation, Rain of Allure) shrink the most (Garden 24 hits · Soul Ravage 14 · Vortex 30 · Rain 8 · Prison 6 · Pollen 5 · Clones 4)"],
      ja: ["マゼンタ：必殺技（4番）以外の攻撃範囲・エフェクトを小さくし、ダメージを少し下げた・特に2番（悪夢の花畑・魂の蹂躙）・3番（誘惑の渦・魅惑の降雨）スキルが小さくなった（花畑24ヒット・魂の蹂躙14・渦30・降雨8・花獄6・花粉5・幻影分身4）"],
    },
  },
];
