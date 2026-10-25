import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.3.1",
    date: "2026-10-04",
    items: {
      ko: ["움직임이 더 부드럽게 보이도록 화면 해상도로 그리기 (고해상도 화면 포함)"],
      en: ["Smoother movement: the game now draws at your screen's full resolution (including high-DPI screens)"],
      ja: ["動きがより滑らかに見えるよう画面の解像度で描画(高解像度画面を含む)"],
    },
  },
  {
    version: "0.3.0",
    date: "2026-10-04",
    items: {
      ko: [
        "층과 방: 시드로 층 지도를 만듦 (6층, 층마다 방 7~12개)",
        "방 종류: 시작·전투·보물(내용은 다음 업데이트)·계단방",
        "적이 있는 방은 문이 잠김. 잠긴 문 앞에서 F(모바일은 버튼)로 최대 체력 20%를 내고 나갈 수 있음",
        "계단방을 정리하면 F로 다음 층, 6층 계단에서 클리어",
        "미니맵: 가 본 방은 종류별 색, 옆 방은 테두리로 표시",
      ],
      en: [
        "Floors and rooms: floor maps generated from the seed (6 floors, 7–12 rooms each)",
        "Room types: start, combat, treasure (contents next update), stairs room",
        "Doors lock while enemies remain. Press F at a locked door (button on mobile) to pay 20% of max HP and leave",
        "Clear the stairs room and press F to go down; take the stairs on floor 6 to clear the run",
        "Minimap: visited rooms colored by type, neighboring rooms outlined",
      ],
      ja: [
        "階層と部屋: シードから階層マップを生成(6階、各階7〜12部屋)",
        "部屋の種類: スタート・戦闘・宝物(中身は次のアップデート)・階段部屋",
        "敵がいる部屋は扉がロック。ロックされた扉の前でF(モバイルはボタン)を押すと最大体力の20%を払って出られる",
        "階段部屋を制圧してFで次の階へ、6階の階段でクリア",
        "ミニマップ: 訪れた部屋は種類別の色、隣の部屋は枠で表示",
      ],
    },
  },
  {
    version: "0.2.0",
    date: "2026-10-04",
    items: {
      ko: [
        "캐릭터 2종: 파수꾼(근접), 떠돌이(원거리). 캐릭터 선택 화면",
        "공격(누르고 있으면 계속), 대시(대시 중 회피), 자동 조준, 맞은 뒤 짧은 무적",
        "적 3종과 시험용 무리 (층·방은 다음 업데이트)",
        "체력 숫자+막대, 쓰러지면 결과 화면",
        "모바일 조작: 왼쪽 이동 조이스틱, 오른쪽 조준·공격 조이스틱(조준점 표시), 오른쪽 두 번 탭 대시, 자동 조준 공격 버튼, 일시정지 버튼, 뒤로가기는 나가기 확인",
      ],
      en: [
        "Two characters: Warden (melee) and Drifter (ranged), with a character select screen",
        "Attack (hold to repeat), dash (dodge while dashing), auto-aim, brief invincibility after a hit",
        "Three enemy types and test waves (floors and rooms come next)",
        "HP shown as number and bar, results screen when you fall",
        "Mobile controls: left move stick, right aim/attack stick with reticle, double-tap right to dash, auto-aim attack button, pause button, back button asks before quitting",
      ],
      ja: [
        "キャラクター2種: 番人(近接)、流れ者(遠距離)。キャラクター選択画面",
        "攻撃(押し続けで連続)、ダッシュ(ダッシュ中は回避)、オートエイム、被弾後の短い無敵",
        "敵3種とテスト用ウェーブ(階層・部屋は次のアップデート)",
        "体力を数字+バーで表示、倒れたら結果画面",
        "モバイル操作: 左は移動スティック、右は照準・攻撃スティック(照準表示)、右ダブルタップでダッシュ、オートエイム攻撃ボタン、一時停止ボタン、戻るボタンで終了確認",
      ],
    },
  },
  {
    version: "0.1.0",
    date: "2026-10-04",
    items: {
      ko: ["게임 뼈대 제작", "타이틀 화면, 패치 노트, 언어 선택(한국어·English·日本語)", "테스트용 게임 화면 (방 하나, 이동만)", "게임 중 Esc를 누르면 나가기 확인, P로 일시정지"],
      en: ["Game skeleton", "Title screen, patch notes, language select (Korean, English, Japanese)", "Test game screen (one room, movement only)", "Esc during a run asks before quitting, P to pause"],
      ja: ["ゲームの骨組みを作成", "タイトル画面、パッチノート、言語選択(韓国語・English・日本語)", "テスト用ゲーム画面(部屋1つ、移動のみ)", "ゲーム中にEscで終了確認、Pで一時停止"],
    },
  },
];
