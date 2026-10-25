import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.19.0",
    date: "2026-10-16",
    items: {
      ko: [
        "새 적 '포격수'를 추가했습니다 (3층부터). 멀리서 내가 서 있는 자리에 붉은 원을 남기고, 약 0.85초 뒤 그 자리가 터집니다. 원 밖으로 움직이면 피할 수 있습니다",
        "공통 아이템 4개를 추가했습니다 (모든 캐릭터, 한 판에 하나씩): 두 번째 숨(쓰러질 때 한 번 되살아남) · 재생 부적(방 정리 시 회복) · 돈 주머니(돈 +50%) · 회피 망토(대시 대기 40% 감소)",
        "패시브 47개 모두 이름에 맞는 아이콘으로 다시 그렸습니다 (전용 패시브는 캐릭터 색 틀)",
        "메인 화면에 '기록'을 추가했습니다: 누적 판 수·클리어 수·최단 클리어 시간·최고 점수와 최근 10판 기록 (이 기기에 저장)",
        "튜토리얼을 추가했습니다 (혼자 하기 → 튜토리얼). 이동·자동 공격·대시·예고 표시 피하기·무기 비교와 F 교체·층 보상 클릭·아이템 사용·미니맵으로 방 이동을 9단계로 배웁니다. 단계는 건너뛸 수 있고, 안내 글은 방을 가리지 않게 방 위쪽에 뜹니다",
        "공격 예고 표시를 넣었습니다: 탄을 쏘는 적은 쏘기 직전 겨냥선이, 돌진하는 적·강철 거구는 돌진 방향선이, 무리 여왕·공허의 눈은 공격 직전 몸 둘레의 붉은 고리가 보입니다",
        "화면 흐름을 바꿨습니다: 메인에 닉네임 줄과 큰 버튼 3개(혼자 하기 · 일일 도전 · 함께 하기), 혼자 하기를 누르면 이어하기·새로 시작·연습장을 고르는 창이 뜹니다. 언어는 오른쪽 위 설정으로 옮겼습니다",
        "함께 하기 입장 화면을 빠른 매칭 · 친구와 하기(방 만들기 · 코드로 들어가기)로 나눴습니다. 대기실은 방 코드·초대 링크 | 캐릭터·참가자 | 채팅으로 바뀌었고, 시작 전에도 채팅할 수 있습니다. 초대 링크를 누르면 그 방으로 바로 들어갑니다. 폰 뒤로가기는 앞 화면으로 갑니다",
        "보스방에 들어가면 어느 문으로 들어가도 플레이어는 방 아래쪽 가운데, 보스는 위쪽 가운데 같은 자리에서 시작합니다. 보스는 들어온 뒤 1.5초 동안 공격하지 않아, 들어가자마자 맞지 않습니다 (다시 들어가도 같음)",
        "게임 규칙이 바뀌어서 이어하기 저장은 이어지지 않습니다",
      ],
      en: [
        "Added a new enemy, the Mortar (from floor 3). It marks a red circle where you stand and the spot blows up about 0.85s later. Step out of the circle to dodge",
        "Added 4 shared items (all characters, one each per run): Second Wind (revive once) · Regen Charm (heal on room clear) · Gold Pouch (+50% gold) · Dodge Cloak (-40% dash cooldown)",
        "Redrew all 47 passive icons to match their names (exclusive passives get a character-colored frame)",
        "Added a Records screen on the title: total runs, clears, fastest clear time, best score and your last 10 runs (stored on this device)",
        "Added a Tutorial (Solo → Tutorial): short steps covering movement, auto-attack, dash, dodging telegraphed attacks, weapon compare and F swap, clicking floor rewards, using items and jumping rooms via the minimap (9 steps). Steps can be skipped, and the guide sits above the room so it never covers it",
        "Added attack telegraphs: shooting enemies show an aim line just before firing, charging enemies and the Iron Hulk show their charge direction, and the Brood Queen and Void Seer show a shrinking red ring just before they attack",
        "New screen flow: the title now has a nickname bar and three big buttons (Play Solo · Daily Challenge · Play Together). Play Solo opens a chooser for Continue, New Run and Practice. Language moved to Settings at the top right",
        "Play Together now splits into Quick match and With Friends (create a room or join with a code). The lobby shows the room code and invite link, characters and players, and a chat you can use before the start. Opening an invite link takes you straight into the room. The phone back button returns to the previous screen",
        "Boss rooms now start the same way whichever door you enter: you at the bottom center, the boss at the top center. The boss holds its attack for 1.5s after you enter, so you no longer get hit the moment you walk in (also on re-entry)",
        "The game rules changed, so continue-saves do not carry over",
      ],
      ja: [
        "新しい敵「砲撃手」を追加しました（3階から）。離れた所から自分の立っている場所に赤い円を残し、約0.85秒後にその場所が爆発します。円の外へ動けば避けられます",
        "共通アイテムを4つ追加しました（全キャラ、1回のプレイで1つずつ）：二度目の息（1度復活）・再生の護符（部屋を片付けると回復）・金の袋（ゴールド+50%）・回避のマント（ダッシュ待機-40%）",
        "パッシブ47個すべてのアイコンを名前に合わせて描き直しました（専用パッシブはキャラ色の枠）",
        "タイトル画面に「記録」を追加しました：累計プレイ数・クリア数・最短クリア時間・最高スコアと直近10回の記録（この端末に保存）",
        "チュートリアルを追加しました（ソロ→チュートリアル）：移動・自動攻撃・ダッシュ・予告表示の回避・武器の比較とF交換・階層報酬のクリック・アイテム使用・ミニマップでの部屋移動を9ステップで学びます。ステップはスキップでき、案内は部屋を隠さないよう部屋の上に表示されます",
        "攻撃の予告表示を追加しました：弾を撃つ敵は発射直前に照準線、突進する敵と鋼の巨躯は突進方向の線、群れの女王と虚ろの眼は攻撃直前に体の周りの赤い輪が見えます",
        "画面の流れを変えました：タイトルにニックネーム欄と大きなボタン3つ（ひとりで遊ぶ・デイリーチャレンジ・みんなで遊ぶ）。ひとりで遊ぶを押すと、続きから・新しく始める・練習場を選ぶ画面が出ます。言語は右上の設定に移しました",
        "みんなで遊ぶの入口をクイックマッチと友達と遊ぶ（部屋を作る・コードで参加）に分けました。待機室は部屋コード・招待リンク｜キャラクター・参加者｜チャットになり、開始前もチャットできます。招待リンクを開くとその部屋にすぐ入れます。スマホの戻るボタンで前の画面に戻ります",
        "ボス部屋はどの扉から入っても、自分は部屋の下の中央、ボスは上の中央の同じ位置から始まります。ボスは入ってから1.5秒間攻撃しないので、入った瞬間に当たることはなくなりました（入り直しても同じ）",
        "ゲームルールが変わったため、続きから再開の保存は引き継がれません",
      ],
    },
  },
  {
    version: "0.18.0",
    date: "2026-10-16",
    items: {
      ko: [
        "메인 화면에 '연습장'을 추가했습니다. 문이 막힌 방 하나에서 기록·업적 없이 자유롭게 시험할 수 있습니다",
        "연습장에서는 모든 무기·패시브·사용 아이템을 아이콘으로 눌러 바로 얻을 수 있습니다 (다른 캐릭터 전용도 가능). 가진 패시브를 다시 누르면 하나 빠집니다",
        "방 한쪽에 허수아비가 서 있습니다 (움직이지도 공격하지도 않고 쓰러지지 않음). 적 치우기를 해도 남고, 패널의 '허수아비 켬/끔' 버튼으로 세우거나 치울 수 있습니다",
        "아이템 아이콘을 게임 전체에 적용했습니다: 바닥 아이템·상점·층 보상, 아래 장비 줄, 설명창, 모바일 아이템 버튼. 무기 36종은 이름에 맞는 모양(대검·활·지팡이 등)으로 하나씩 그렸습니다 (임시 그림)",
        "초기화 버튼, 적 치우기 버튼, 적·보스 불러오기, 캐릭터 바꾸기를 넣었습니다. 죽어도 체력이 다시 차서 계속 시험할 수 있습니다",
      ],
      en: [
        "Added a Practice mode on the title screen: a single closed room for free testing, with no records or achievements",
        "In Practice you can click any weapon, passive or consumable icon to get it instantly (including other characters' exclusives). Click an owned passive again to drop one",
        "A scarecrow stands in the room (it neither moves nor attacks and never falls). It stays when you clear enemies, and a Scarecrow on/off button in the panel puts it up or takes it down",
        "Item icons now appear everywhere: floor items, shop, floor rewards, the loadout bar, tooltips and mobile item buttons. All 36 weapons got their own icon matching their name (placeholder art)",
        "Added Reset, Clear enemies, enemy and boss spawning, and character switching. You revive when you die so you can keep testing",
      ],
      ja: [
        "タイトル画面に「練習場」を追加しました。扉の閉じた部屋1つで、記録・実績なしに自由に試せます",
        "練習場ではすべての武器・パッシブ・使用アイテムをアイコンで押してすぐ入手できます（他キャラ専用も可）。持っているパッシブをもう一度押すと1つ外れます",
        "部屋の隅にかかしが立っています（動かず攻撃もせず倒れません）。敵を消しても残り、パネルの「かかし オン/オフ」ボタンで立てたり片付けたりできます",
        "アイテムアイコンをゲーム全体に適用しました：床のアイテム・ショップ・階の報酬、装備欄、説明ウィンドウ、モバイルのアイテムボタン。武器36種は名前に合う形で1つずつ描きました（仮の絵）",
        "リセットボタン、敵を消すボタン、敵・ボスの召喚、キャラ変更を追加しました。死んでも体力が戻るので試し続けられます",
      ],
    },
  },
];
