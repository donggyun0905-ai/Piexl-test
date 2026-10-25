import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.27.0",
    date: "2026-10-20",
    items: {
      ko: [
        "설정에서 모바일 조작키를 바꿀 수 있습니다: '조작키 (모바일)'의 '크기·위치 바꾸기'를 누르면 대시·아이템·맞는 범위·상점 버튼을 끌어서 원하는 자리로 옮기고, 버튼 크기(60~150%)와 조이스틱 크기(70~150%)를 고를 수 있습니다. '처음대로'로 되돌리고, 이 기기에 저장됩니다",
      ],
      en: [
        "You can now customize the touch controls in Settings: tap Resize & move under Touch controls to drag the dash, item, hitbox and shop buttons wherever you like, and pick the button size (60-150%) and joystick size (70-150%). Reset restores the defaults; it is saved on this device",
      ],
      ja: [
        "設定でモバイルの操作ボタンを変更できるようになりました：「タッチ操作」の「大きさ・位置を変更」でダッシュ・アイテム・当たり判定・ショップのボタンをドラッグして好きな位置に動かし、ボタンの大きさ（60〜150%）とジョイスティックの大きさ（70〜150%）を選べます。「元に戻す」で初期状態に戻り、この端末に保存されます",
      ],
    },
  },
  {
    version: "0.26.1",
    date: "2026-10-20",
    items: {
      ko: ["아이템을 가질 때 뜨는 설명이 '…'로 잘리지 않고 여러 줄로 끝까지 보입니다 (모바일 버튼·PC 안내 모두)"],
      en: ["Item descriptions shown when picking something up are no longer cut off with '…'; they wrap onto several lines (mobile button and PC prompt)"],
      ja: ["アイテムを取るときの説明が「…」で切れず、複数行で最後まで表示されるようになりました（モバイルのボタン・PCの案内とも）"],
    },
  },
  {
    version: "0.26.0",
    date: "2026-10-20",
    items: {
      ko: [
        "웹앱으로 설치할 수 있습니다: 메인 화면 왼쪽 위 '앱 설치' 버튼. 안드로이드·PC 크롬과 엣지는 바로 설치 창이 뜨고, 아이폰·아이패드는 Safari에서 홈 화면에 추가하는 방법을 알려 줍니다",
        "설치한 앱은 홈 화면 아이콘으로 주소창 없이 전체 화면으로 열리고, 한 번 열어 둔 뒤에는 인터넷이 없어도 혼자 하기를 할 수 있습니다 (앱으로 열면 설치 버튼은 숨겨짐)",
        "설치한 앱은 가로 화면으로 열립니다 (안드로이드. 아이폰·아이패드는 기기가 화면 방향 고정을 지원하지 않아 직접 돌려 주세요)",
        "공격 사거리 원이 다시 적이 다가올 때만 보이고, 적이 사거리 안에 들어오면 사라집니다 (사거리 표시를 켜 둔 경우)",
      ],
      en: [
        "You can now install the game as a web app: the Install app button at the top left of the main screen. Chrome and Edge on Android and PC show the install prompt right away; on iPhone and iPad it shows how to add it to the Home Screen from Safari",
        "The installed app opens full screen from its home screen icon without the address bar, and once opened you can play solo even offline (the install button is hidden when running as the app)",
        "The installed app opens in landscape (Android. iPhone and iPad do not support locking the screen direction, so please rotate the device yourself)",
        "The attack range ring again shows only while an enemy is approaching and disappears once an enemy is in range (when the range display is on)",
      ],
      ja: [
        "Webアプリとしてインストールできるようになりました：メイン画面左上の「アプリをインストール」ボタン。Android・PCのChromeとEdgeはすぐインストール画面が開き、iPhone・iPadはSafariでホーム画面に追加する方法を案内します",
        "インストールしたアプリはホーム画面のアイコンからアドレスバーなしの全画面で開き、一度開いた後はインターネットがなくても一人プレイができます（アプリで開くとインストールボタンは非表示）",
        "インストールしたアプリは横画面で開きます（Android。iPhone・iPadは画面の向きの固定に対応していないため、端末を横向きにしてください）",
        "攻撃の射程の円が再び敵が近づくときだけ表示され、敵が射程内に入ると消えるようになりました（射程表示がオンのとき）",
      ],
    },
  },
  {
    version: "0.25.1",
    date: "2026-10-20",
    items: {
      ko: [
        "조이스틱 원이 너무 빨리 따라오던 것을 고쳤습니다: 원 밖으로 조금 나간 정도는 원이 제자리에 있고, 손가락이 많이 멀어졌을 때만 끌려옵니다",
        "오른쪽 아래 버튼을 여러 손가락으로 동시에 누를 수 있습니다: 조이스틱을 잡은 채 대시·아이템을 눌러도, 두 버튼을 함께 눌러도 바로 동작합니다",
        "버튼 사이 빈 곳을 누르면 그 자리도 조이스틱으로 쓰입니다",
      ],
      en: [
        "The joystick ring no longer follows too eagerly: going a little past the ring keeps it in place, and it only gets dragged along when your finger moves far away",
        "Bottom-right buttons now work with multiple fingers at once: dash or use items while holding the joystick, or press two buttons together, and they respond right away",
        "Touching the gaps between buttons now works as joystick area",
      ],
      ja: [
        "ジョイスティックの円がすぐ付いてきすぎる問題を直しました：円の外に少し出た程度では円はその場にあり、指が大きく離れたときだけ引っぱられます",
        "右下のボタンを複数の指で同時に押せるようになりました：ジョイスティックを握ったままダッシュ・アイテムを押しても、2つのボタンを一緒に押してもすぐ反応します",
        "ボタンの間の空いた所を押すと、そこもジョイスティックとして使えます",
      ],
    },
  },
  {
    version: "0.25.0",
    date: "2026-10-19",
    items: {
      ko: [
        "모바일 조이스틱이 조금 커지고, 가운데를 살짝 건드린 정도로는 움직이지 않습니다 (손가락 떨림으로 미끄러지지 않게)",
        "오른쪽 아래 버튼을 엄지 자리에 맞게 다시 놓았습니다: 대시가 가장 크게 오른쪽 아래, 아이템 1은 왼쪽, 2는 위. 아이템 버튼은 그림과 짧은 이름으로 보입니다",
        "대시 버튼에 다시 쓸 수 있을 때까지 남은 시간이 어둡게 돌아가며 보이고, 버튼을 누르면 눌린 모양과 짧은 진동이 있습니다",
        "상점·계단·무기 바꾸기 버튼이 화면 가운데가 아니라 오른쪽 버튼 묶음 바로 위에 나오고, 누르는 순간 바로 동작합니다",
        "세로 화면에서 위쪽 버튼이 화면 밖으로 밀려 자동 공격 버튼이 안 보이던 것을 고쳤습니다 (두 줄로 보임)",
        "가로 화면에서 아래 안내 글이 대시 버튼과 겹치지 않고, 아이폰 아래쪽 줄·노치를 피해 버튼이 놓입니다",
      ],
      en: [
        "The mobile joystick is a bit larger, and a tiny nudge in the center no longer moves you (no drifting from a shaky finger)",
        "Bottom-right buttons rearranged for your thumb: Dash is the largest at the bottom right, item 1 to its left and item 2 above. Item buttons show the icon and a short name",
        "The Dash button shows its remaining cooldown as a dark sweep, and buttons look pressed and give a short vibration when tapped",
        "Shop, stairs and weapon swap buttons now appear just above the right-hand buttons instead of mid-screen, and act the moment you press",
        "Fixed the top buttons running off screen in portrait so the Auto-attack button was hidden (they now wrap to two rows)",
        "In landscape the hint text no longer runs under the Dash button, and buttons stay clear of the home bar and notch",
      ],
      ja: [
        "モバイルのジョイスティックが少し大きくなり、中央を少し触れた程度では動かなくなりました（指のぶれで滑らないように）",
        "右下のボタンを親指の位置に合わせて並べ直しました：ダッシュが一番大きく右下、アイテム1は左、2は上。アイテムボタンは絵と短い名前で表示されます",
        "ダッシュボタンに再使用までの残り時間が暗く回って表示され、ボタンを押すと押された見た目と短い振動があります",
        "ショップ・階段・武器交換のボタンが画面中央ではなく右のボタン群のすぐ上に出て、押した瞬間に反応します",
        "縦画面で上のボタンが画面外に押し出され、オートアタックボタンが見えなかった問題を直しました（2行で表示）",
        "横画面で下の案内文がダッシュボタンと重ならず、ボタンがiPhoneのホームバー・ノッチを避けて置かれます",
      ],
    },
  },
  {
    version: "0.24.2",
    date: "2026-10-19",
    items: {
      ko: ["연습장 도구의 아이템(무기·패시브·사용 아이템)에 마우스를 올리면 마우스 옆에 이름과 효과가 보입니다 (모바일은 아이콘을 누르면 그 위에 보이고, 다른 곳을 누르면 닫힘)"],
      en: ["In the practice tools, hover an item (weapon, passive or usable) to see its name and effect next to the cursor (on mobile, tap the icon to see it above; tap elsewhere to close)"],
      ja: ["練習ツールのアイテム（武器・パッシブ・使用アイテム）にマウスを乗せると、カーソルの横に名前と効果が表示されます（モバイルはアイコンをタップするとその上に表示、他の場所をタップで閉じる）"],
    },
  },
  {
    version: "0.24.1",
    date: "2026-10-19",
    items: {
      ko: [
        "아래 장비 줄의 패시브 아이콘에 마우스를 올리면 이름과 효과가 보입니다 (모바일은 아이콘을 누르면 보이고, 다시 누르거나 다른 곳을 누르면 닫힘)",
        "공격 사거리 표시와 맞는 범위 표시를 따로 켜고 끌 수 있습니다. 공격 사거리는 G 키·위쪽 사거리 버튼·설정의 공격 사거리 보기로, 맞는 범위는 지금처럼 H 키·맞는 범위 버튼·설정으로 바꿉니다",
        "공격 사거리 원은 켜 두면 늘 옅게 보이고, 가장 가까운 적이 다가올수록 진해집니다 (처음에는 켜져 있음)",
      ],
      en: [
        "Hover a passive icon in the bottom equipment bar to see its name and effect (on mobile, tap the icon; tap it again or anywhere else to close)",
        "Attack range and hitbox displays now turn on and off separately. Toggle attack range with G, the top Range button or Show attack range in Settings; the hitbox still uses H, the Hitbox button or Settings",
        "When on, the attack range ring is always faintly visible and gets stronger as the nearest enemy approaches (on by default)",
      ],
      ja: [
        "下の装備欄のパッシブアイコンにマウスを乗せると名前と効果が表示されます（モバイルはアイコンをタップ、もう一度タップするか他の場所をタップで閉じる）",
        "攻撃の射程表示と当たり判定表示を別々にオン・オフできるようになりました。射程はGキー・上の射程ボタン・設定の「攻撃の射程を表示」で、当たり判定はこれまでどおりHキー・当たり判定ボタン・設定で切り替えます",
        "射程の円はオンにすると常に薄く表示され、一番近い敵が近づくほど濃くなります（最初はオン）",
      ],
    },
  },
  {
    version: "0.24.0",
    date: "2026-10-19",
    items: {
      ko: [
        "업적이 8개에서 41개로 늘었습니다 (진행·전투·보스·돈·상점·아이템·캐릭터·도전·누적)",
        "누적 업적이 생겼습니다: 판 수·클리어 수·처치 수·보스·번 돈을 모든 판에 걸쳐 셉니다 (연습장·튜토리얼 제외, 이 기기 기준)",
        "업적 창이 새로워졌습니다: 전체 달성률, 묶음별 탭과 달성 수, 업적 카드, 누적 업적 진행도 막대",
      ],
      en: [
        "Achievements grew from 8 to 41 (Progress, Combat, Bosses, Gold & Shop, Items, Characters, Challenges, Lifetime)",
        "New Lifetime achievements count runs, clears, kills, bosses and gold across all runs (not Practice or Tutorial, per device)",
        "Redesigned Achievements window: overall completion, category tabs with counts, achievement cards and progress bars for Lifetime goals",
      ],
      ja: [
        "実績が8個から41個に増えました（進行・戦闘・ボス・お金・ショップ・アイテム・キャラクター・チャレンジ・累計）",
        "累計実績が追加されました：プレイ回数・クリア回数・撃破数・ボス・稼いだお金をすべてのプレイで数えます（練習場・チュートリアルを除く、この端末ごと）",
        "実績画面を一新：全体の達成率、分類ごとのタブと達成数、実績カード、累計実績の進行バー",
      ],
    },
  },
];
