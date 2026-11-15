import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.53.20",
    date: "2026-11-15",
    items: {
      ko: ["퀘스트 진행·프롤로그·아지트 안내를 서버에도 백업 (기기 연동·브라우저 저장소를 지워도 남음) · 세계 지도: 가야 할 곳이 화면 밖이면 화면 가장자리에 금빛 화살표 · 다른 나라·건물이면 그쪽으로 가는 국경 길·문을 가리킴 · 아지트 물건 앞 버튼 글자(영웅 고르기·열기·펼치기·들어가기) · 퀘스트를 끝낸 뒤 이야기 장면 위에 로딩 화면이 겹쳐 보이던 문제 고침"],
      en: ["Quest progress, the prologue and the hideout guide are now backed up to the server too (kept across linked devices and cleared browser storage) · World map: a golden arrow at the screen edge when your destination is off-screen · Points to the border road or door leading there when it's in another country or building · Clearer button labels on hideout objects (Choose a hero, Open, Read, Enter) · Fixed the loading screen overlapping the story scene after finishing a quest"],
      ja: ["クエスト進行・プロローグ・アジト案内をサーバーにもバックアップ（端末連携やブラウザの保存データを消しても残る）・世界地図：行き先が画面外なら画面の端に金色の矢印・別の国や建物ならそこへ向かう国境の道や扉を指す・アジトの物の前のボタン表記（英雄を選ぶ・開ける・開く・入る）・クエスト完了後に物語の場面へロード画面が重なって見える問題を修正"],
    },
  },
  {
    version: "0.53.19",
    date: "2026-11-15",
    items: {
      ko: ["세계 지도(시험 중) 아스칼론에 광장 게시판(일일 도전·이벤트)과 모험가 집합소(함께 하기·협동) · 퀘스트 '날마다 적히는 이야기'는 게시판에 가면 끝남 · 지도가 있는 곳에서는 플레이 창의 일일·함께·협동·이벤트·로비가 지도 속 장소로 옮겨감"],
      en: ["World Map (testing): a plaza notice board (Daily Challenge, Events) and the Adventurers' Guild (Play Together, Co-op) in Ascalon · The quest 'A Story Written Daily' completes at the board · Where the map is available, Daily, Play Together, Co-op, Events and Lobby move from the Play window to places on the map"],
      ja: ["世界地図（テスト中）アスカロンに広場の掲示板（デイリーチャレンジ・イベント）と冒険者ギルド（みんなで遊ぶ・協力プレイ）・クエスト『日々綴られる物語』は掲示板へ行くと完了・地図がある所ではプレイ画面のデイリー・みんなで・協力・イベント・ロビーが地図の場所へ移動"],
    },
  },
  {
    version: "0.53.18",
    date: "2026-11-15",
    items: {
      ko: ["세계 지도(시험 중) 메인 퀘스트: 퀘스트를 하나씩 끝내며 이야기 장과 모드가 차례로 열림 (로그 시작 → 영웅의 길 → 무한 모드 → 레이드 아레나 → 타워 디펜스 → 일일 도전·이벤트 → 광야의 새벽 → 패왕전) · 오른쪽 위 지금 할 일 · 가야 할 곳에 금빛 화살표 · 끝내면 '기록됨' 도장과 서기관 한마디, 새 장이면 그 장 이야기 · 아지트 기록서에서 퀘스트 목록·이야기 다시 보기 · 이미 하던 사람은 모든 모드가 열린 채로 이야기만 진행"],
      en: ["World Map (testing) main quests: finish quests one by one to open story chapters and modes in order (Dungeon → Hero's Path → Endless Mode → Raid Arena → Tower Defense → Daily Challenge & Events → Dawn of the Wilds → Champion Clash) · Current goal at top right · Golden arrow over where to go · A 'Recorded' stamp and a word from the Scribe when done, plus the new chapter's story · Quest list and story replay in the hideout's Book of Records · Existing players keep every mode open and just follow the story"],
      ja: ["世界地図（テスト中）メインクエスト：クエストをひとつずつ終えると物語の章とモードが順に開く（ダンジョン→英雄の道→エンドレスモード→レイドアリーナ→タワーディフェンス→デイリーチャレンジ・イベント→荒野の夜明け→覇王戦）・右上にいまの目標・行き先に金色の矢印・終えると『記録済み』の判子と書記官のひとこと、新しい章ならその物語・アジトの記録書でクエスト一覧と物語の読み返し・既存プレイヤーはすべてのモードが開いたまま物語だけ進行"],
    },
  },
  {
    version: "0.53.17",
    date: "2026-11-15",
    items: {
      ko: ["세계 지도(시험 중) 새 아지트 '기록의 다락방': 프롤로그가 끝나면 여기서 눈뜸 · 서기관이 거울(캐릭터 고르기)·장비 상자·기록서(이야기 다시 보기)·오락실 문·나가는 문을 화살표로 하나씩 안내 · 나가면 마지막에 있던 나라로 · 지도 위 '아지트' 버튼으로 언제든 돌아옴 · 다시 들어오면 마지막에 있던 곳에서 시작"],
      en: ["World Map (testing) new hideout, the Attic of Records: you wake up here after the prologue · The Scribe guides you with arrows to the mirror (choose a hero), gear chest, Book of Records (reread the story), arcade door and exit · Leaving takes you to the last country you were in · Return anytime with the 'Hideout' button · Coming back resumes where you last were"],
      ja: ["世界地図（テスト中）新しいアジト『記録の屋根裏部屋』：プロローグの後ここで目覚める・書記官が鏡（英雄選び）・装備の箱・記録書（物語を読み返す）・ゲームセンターの扉・出口を矢印でひとつずつ案内・出ると最後にいた国へ・地図の『アジト』ボタンでいつでも戻れる・再び入ると最後にいた場所から"],
    },
  },
  {
    version: "0.53.16",
    date: "2026-11-15",
    items: {
      ko: ["프롤로그: 처음 플레이를 누르면 검은 화면에서 서기관이 이야기를 들려주고 이름을 물어봄 (닉네임으로 저장) · 세계 지도 들어갈 때 새 로딩 화면"],
      en: ["Prologue: the first time you press Play, the Scribe speaks to you in the dark and asks your name (saved as your nickname) · New loading screen when entering the world map"],
      ja: ["プロローグ：初めてプレイを押すと、暗闇の中で書記官が語りかけ名前を尋ねる（ニックネームとして保存）・世界地図に入るときの新しいロード画面"],
    },
  },
  {
    version: "0.53.15",
    date: "2026-11-15",
    items: {
      ko: ["메인 화면 정리: 버튼은 플레이 · 아카이브 · 상점 셋만 · 기록·업적·도감·패치 노트·기기 연동은 아카이브 창으로 · 일일 도전·함께 하기·협동·이벤트·로비는 플레이 창 안으로 (세계 지도 장소가 생기면 옮길 예정)"],
      en: ["Cleaner main screen: only Play, Archive and Shop · Records, Achievements, Codex, Patch Notes and Link devices moved into the Archive window · Daily Challenge, Play Together, Co-op, Events and Lobby moved into the Play window (they will move to places on the world map later)"],
      ja: ["メイン画面を整理：ボタンはプレイ・アーカイブ・ショップの3つだけ・記録・実績・図鑑・パッチノート・端末連携はアーカイブ画面へ・デイリーチャレンジ・みんなで遊ぶ・協力プレイ・イベント・ロビーはプレイ画面の中へ（後で世界地図の場所へ移す予定）"],
    },
  },
  {
    version: "0.53.14",
    date: "2026-11-15",
    items: {
      ko: ["범 풍류 스킨 새 그림 (파수꾼·떠돌이·마법사·음양사·기계공학자·원소술사·격투가·의사): 한복·백호 옷의 새 걷기·공격·맞음·쓰러짐·대시 그림 · 입으면 캐릭터 선택 카드와 정보 창에 스킨 일러스트"],
      en: ["New Tiger Revelry skin art (Warden, Drifter, Mage, Talisman Master, Engineer, Elementalist, Brawler, Doctor): new hanbok and white-tiger outfits with walk, attack, hit, down and dash frames · wearing one shows its skin illustration on the character select card and info window"],
      ja: ["虎の風流スキンの新しい絵（番人・流れ者・魔法使い・陰陽師・エンジニア・元素術師・格闘家・医者）：韓服と白虎の衣装で歩き・攻撃・被弾・ダウン・ダッシュの新しい絵・着るとキャラクター選択カードと情報ウィンドウにスキンのイラスト"],
    },
  },
];
