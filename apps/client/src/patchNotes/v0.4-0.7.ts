import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.7.0",
    date: "2026-10-15",
    items: {
      ko: [
        "이어하기: 혼자 하기는 방을 옮길 때마다·나갈 때 자동 저장. 타이틀의 '이어하기'로 계속",
        "시드: 캐릭터 선택에서 시드를 직접 입력할 수 있음 (비우면 무작위). 일시정지·결과 창에서 시드 보기·공유 (공유 주소로 들어오면 그 시드로 시작)",
        "결과 창에서 '같은 시드로 다시'",
        "점수: 도달 층 + 처치 + 보스 처치 + 클리어 보너스 + 남은 시간 보너스(15분 기준). 이 기기 최고 기록을 타이틀에 표시",
        "업적 8개: 달성하면 위쪽에 알림, 결과 창에 정리. 타이틀 '업적'에서 목록 보기",
        "영구 해금(혼자 하기만): 업적을 달성하면 새 아이템이 나오기 시작 (패시브 빠른 손·금니·강철 피부, 사용 아이템 영약·얼음 시계, 무기 언월도·별빛 지팡이)",
      ],
      en: [
        "Continue: solo runs save automatically whenever you change rooms or quit. Pick it up with 'Continue' on the title screen",
        "Seeds: enter a seed on the character screen (empty = random). See and share the seed from the pause and result screens; opening a shared link starts with that seed",
        "'Retry same seed' on the result screen",
        "Score: floor reached + kills + bosses + clear bonus + time-left bonus (15 min). Your best on this device is shown on the title screen",
        "8 achievements: a notice pops up at the top when you earn one, and the result screen lists them. See them all under 'Achievements' on the title screen",
        "Permanent unlocks (solo only): achievements make new items start appearing (passives Quick Hands, Gold Tooth, Iron Skin; use items Elixir, Frost Clock; weapons Glaive, Star Wand)",
      ],
      ja: [
        "続きから: ソロは部屋を移動するたび・終了するときに自動保存。タイトルの「続きから」で再開",
        "シード: キャラクター選択でシードを入力可能 (空欄でランダム)。一時停止・リザルト画面でシードを確認・共有 (共有リンクから入るとそのシードで開始)",
        "リザルト画面に「同じシードで再挑戦」",
        "スコア: 到達階 + 撃破 + ボス撃破 + クリアボーナス + 残り時間ボーナス(15分基準)。この端末のベストをタイトルに表示",
        "実績8個: 達成すると上に通知、リザルト画面にまとめて表示。タイトルの「実績」で一覧",
        "永久解放(ソロのみ): 実績を達成すると新しいアイテムが出始める (パッシブ 早業・金歯・鋼の肌、使用アイテム 霊薬・氷の時計、武器 薙刀・星の杖)",
      ],
    },
  },
  {
    version: "0.6.0",
    date: "2026-10-15",
    items: {
      ko: [
        "돈: 적을 잡거나 전투방을 정리하면 돈을 얻음. 위쪽 줄에 가진 돈 표시",
        "상점방: 층마다 하나. 패시브·무기·사용 아이템·회복약을 팖. 물건 앞에서 F(모바일은 버튼)를 눌러야만 삼 (서 있기만 해서는 안 삼). 행운이 높으면 조금 쌈",
        "보스: 층마다 계단방에 보스가 나옴 (1·2층 강철 거구, 3·4층 무리 여왕, 5·6층 공허의 눈). 보스를 잡아야 계단이 열리고 층 보상을 고름. 위쪽에 보스 체력 막대",
        "보스는 체력이 절반 아래로 내려가면 더 거세짐",
        "미니맵에 상점(초록)·보스방(빨강) 표시",
      ],
      en: [
        "Gold: earn it by defeating enemies and clearing combat rooms. Shown in the top bar",
        "Shop rooms: one per floor, selling passives, weapons, use items and potions. You only buy by pressing F (button on mobile) at an item, never by just standing on it. High luck makes things a little cheaper",
        "Bosses: each floor's stairs room now has a boss (floors 1-2 Iron Hulk, 3-4 Brood Queen, 5-6 Void Seer). Defeat it to open the stairs and choose the floor reward. Boss health bar at the top",
        "Bosses get fiercer below half health",
        "The map shows shops (green) and boss rooms (red)",
      ],
      ja: [
        "お金: 敵を倒したり戦闘部屋をクリアすると手に入る。上のバーに所持金を表示",
        "ショップ部屋: 各階に1つ。パッシブ・武器・使用アイテム・回復薬を販売。商品の前でF(モバイルはボタン)を押したときだけ購入 (上に立つだけでは買わない)。幸運が高いと少し安い",
        "ボス: 各階の階段部屋にボスが登場 (1・2階 鋼の巨躯、3・4階 群れの女王、5・6階 虚ろの眼)。ボスを倒すと階段が開き、階層報酬を選ぶ。上にボスの体力バー",
        "ボスは体力が半分を切ると激しくなる",
        "ミニマップにショップ(緑)・ボス部屋(赤)を表示",
      ],
    },
  },
  {
    version: "0.5.1",
    date: "2026-10-15",
    items: {
      ko: [
        "아이템 줍기를 버튼 없이: 무기 바꾸기·꽉 찬 칸 바꾸기·층 보상 고르기는 아이템 위에 잠깐(0.5초) 서 있으면 가짐. 아래 막대로 남은 정도 표시. F(모바일은 버튼)를 누르면 바로",
        "빈 칸에 들어가는 사용 아이템은 지금처럼 닿으면 바로 주움. 지나가다 스치기만 해서는 무기가 바뀌지 않음",
        "줍는 거리를 조금 넓힘",
      ],
      en: [
        "Picking up without buttons: to swap weapons, swap a full item slot or choose a floor reward, stand on the item briefly (0.5 s). A bar shows the progress. F (button on mobile) takes it instantly",
        "Use items that fit an empty slot are still taken on touch. Brushing past a weapon no longer swaps it",
        "Slightly larger pickup range",
      ],
      ja: [
        "ボタンなしでアイテム取得: 武器の持ち替え・満杯の枠の入れ替え・階層報酬の選択は、アイテムの上で少し(0.5秒)止まると取得。下のバーで進み具合を表示。F(モバイルはボタン)で即取得",
        "空き枠に入る使用アイテムは今まで通り触れるとすぐ取得。通り過ぎただけでは武器は替わらない",
        "拾える距離を少し広げた",
      ],
    },
  },
  {
    version: "0.5.0",
    date: "2026-10-15",
    items: {
      ko: [
        "자동 공격이 기본: 누르지 않아도 사거리 안의 가장 가까운 적을 계속 공격. R(모바일은 화면 버튼)로 끄면 직접 조준해 공격",
        "사용 아이템을 칸마다 바로 쓰기: PC는 Q·E(또는 1·2), 아래 칸을 클릭해도 사용. 모바일은 오른쪽 아래 아이템 버튼 2개. 칸 바꾸기는 없앰",
        "칸이 다 찼을 때 새 아이템은 먼저 얻은 아이템과 바뀜",
        "대시: PC는 Space도 사용 가능, 모바일은 오른쪽 아래 대시 버튼 추가",
        "PC: 방향키로도 이동, 휠만 굴려도 화면 확대·축소",
        "모바일 공격 버튼은 없앰",
      ],
      en: [
        "Auto-attack is now the default: you keep attacking the nearest enemy in range without pressing anything. Turn it off with R (screen button on mobile) to aim manually",
        "Use items straight from each slot: Q/E (or 1/2) on PC, or click the slot. Two item buttons at the bottom right on mobile. Slot switching is removed",
        "When both slots are full, a new item replaces the one you got first",
        "Dash: Space also works on PC; a dash button is added at the bottom right on mobile",
        "PC: arrow keys also move, and the mouse wheel alone zooms",
        "The mobile attack button is removed",
      ],
      ja: [
        "オートアタックが標準に: 押さなくても射程内の一番近い敵を攻撃し続ける。R(モバイルは画面のボタン)でオフにすると自分で照準して攻撃",
        "使用アイテムは枠ごとに直接使用: PCはQ・E(または1・2)、下の枠をクリックしても使用。モバイルは右下のアイテムボタン2つ。枠の切り替えは廃止",
        "枠がいっぱいのとき、新しいアイテムは先に手に入れたアイテムと入れ替わる",
        "ダッシュ: PCはSpaceでも可能、モバイルは右下にダッシュボタンを追加",
        "PC: 矢印キーでも移動、ホイールだけで画面ズーム",
        "モバイルの攻撃ボタンは廃止",
      ],
    },
  },
  {
    version: "0.4.1",
    date: "2026-10-04",
    items: {
      ko: ["층 보상 패시브는 닿기만 해서는 가져가지 않고, 가까이 가서 F(모바일은 버튼)를 눌러 고르도록 변경"],
      en: ["Floor-reward passives are no longer taken on touch: walk up and press F (button on mobile) to choose"],
      ja: ["階層報酬のパッシブは触れただけでは取らず、近づいてF(モバイルはボタン)で選ぶように変更"],
    },
  },
  {
    version: "0.4.0",
    date: "2026-10-04",
    items: {
      ko: [
        "패시브 아이템 10종: 능력치가 바뀌고 서로 중첩됨. 계단방을 정리하면 층 보상으로 3개 중 1개 고르기",
        "사용 아이템 2칸: 회복약·폭탄·보호막 (임시). PC는 휠로 칸 바꾸기·휠 클릭으로 사용, 모바일은 아이템 버튼(탭 사용, 위·아래 드래그로 칸 바꾸기)",
        "무기 6종 추가 (공용 4종, 캐릭터 전용 2종). 바닥 무기에 닿으면 바꾸고, 떨어졌다가 다시 닿으면 또 바뀜",
        "보물방에 무기와 사용 아이템, 전투방을 정리하면 확률로 사용 아이템 (행운이 높을수록 잘 나옴)",
        "바닥 아이템 가까이 가면 이름과 효과 표시, 아래쪽에 무기·아이템 칸·패시브 표시",
        "화면 확대·축소: PC는 Ctrl+휠, 모바일은 오른쪽에서 두 손가락",
      ],
      en: [
        "10 passive items: they change your stats and stack. Clearing the stairs room offers a floor reward: pick 1 of 3",
        "2 use-item slots: Potion, Bomb, Ward (temporary). PC: wheel to switch, wheel click to use. Mobile: item button (tap to use, drag up/down to switch)",
        "6 new weapons (4 shared, 2 character-exclusive). Touch a weapon on the ground to swap; step off and touch again to swap back",
        "Treasure rooms hold a weapon and a use item; cleared combat rooms may drop a use item (more likely with Luck)",
        "Item name and effect shown when you are near; weapon, item slots and passives shown at the bottom",
        "Zoom: Ctrl+Wheel on PC, pinch on the right side on mobile",
      ],
      ja: [
        "パッシブアイテム10種: 能力値が変わり重ねがけ可能。階段部屋を制圧すると階層報酬として3つから1つを選ぶ",
        "使用アイテム2枠: 回復薬・爆弾・バリア(仮)。PCはホイールで切替・ホイールクリックで使用、モバイルはアイテムボタン(タップで使用、上下ドラッグで切替)",
        "武器6種を追加(共通4種、キャラクター専用2種)。床の武器に触れると持ち替え、離れてまた触れると再び持ち替え",
        "宝物部屋に武器と使用アイテム、戦闘部屋を制圧すると確率で使用アイテム(幸運が高いほど出やすい)",
        "床のアイテムに近づくと名前と効果を表示、下に武器・アイテム枠・パッシブを表示",
        "ズーム: PCはCtrl+ホイール、モバイルは右側で二本指",
      ],
    },
  },
];
