import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.23.1",
    date: "2026-10-19",
    items: {
      ko: [
        "서든데스에서는 체력이 1 / 1로 표시됩니다",
        "일일 도전 화면에서 닉네임을 바로 바꿀 수 있습니다 (수정을 누르면 그 자리에서 입력)",
      ],
      en: [
        "In Sudden Death, HP is shown as 1 / 1",
        "You can change your nickname right on the Daily screen (press Edit to type it in place)",
      ],
      ja: [
        "サドンデスでは体力が 1 / 1 と表示されます",
        "デイリー画面でニックネームをその場で変更できます（変更を押してその場で入力）",
      ],
    },
  },
  {
    version: "0.23.0",
    date: "2026-10-19",
    items: {
      ko: [
        "일일 도전에 서든데스가 생겼습니다. 일일 도전 화면 위의 탭에서 고를 수 있고, 시드는 같지만 순위표는 따로입니다",
        "서든데스에서는 한 대라도 맞으면 바로 끝납니다 (대시·무적 중에는 맞지 않음). 두 번째 숨도 되살려 주지 않습니다",
        "서든데스에서는 회복약·영약과 체력 회복 패시브(두 번째 숨, 재생 부적, 생명 흡수, 마력 흡수)가 나오지 않고, 잠긴 출구를 체력으로 나갈 수 없습니다",
      ],
      en: [
        "Daily Challenge now has Sudden Death. Pick it from the tabs at the top of the Daily screen; same seed, separate leaderboard",
        "In Sudden Death a single hit ends the run (you can't be hit while dashing or invulnerable). Second Wind won't revive you",
        "In Sudden Death, Potions, Elixirs and healing passives (Second Wind, Regen Charm, Life Leech, Mana Drain) never appear, and you can't pay HP to leave a locked exit",
      ],
      ja: [
        "デイリーチャレンジにサドンデスが追加されました。デイリー画面上のタブで選べます。シードは同じで、ランキングは別です",
        "サドンデスでは一度でも当たると即終了です（ダッシュ・無敵中は当たりません）。二度目の息でも復活しません",
        "サドンデスでは回復薬・霊薬と体力回復パッシブ（二度目の息、再生の護符、生命吸収、魔力吸収）が出ず、ロックされた出口を体力で抜けることもできません",
      ],
    },
  },
  {
    version: "0.22.0",
    date: "2026-10-19",
    items: {
      ko: [
        "상점에 새로고침이 생겼습니다. 아직 안 산 물건만 새로 바뀌고, 이미 산 자리는 비어 있는 그대로입니다 (회복약 자리는 그대로). 5G부터 누를 때마다 5G씩 비싸집니다",
        "체력을 모두 채우는 영약이 회복약보다 비싸졌습니다 (기본 12G → 30G)",
      ],
      en: [
        "Shops now have a Refresh. It replaces only the items you haven't bought; slots you already bought stay empty (the Potion slot stays as is). Starts at 5G and costs 5G more each time",
        "The Elixir, which fully restores HP, now costs more than a Potion (base 12G → 30G)",
      ],
      ja: [
        "ショップに入れ替えが追加されました。まだ買っていない品物だけが入れ替わり、買った場所は空いたままです（回復薬の場所はそのまま）。5Gから、押すたびに5Gずつ高くなります",
        "体力を全回復する霊薬が回復薬より高くなりました（基本12G → 30G）",
      ],
    },
  },
  {
    version: "0.21.0",
    date: "2026-10-19",
    items: {
      ko: [
        "전투방과 강한 적 방의 모양이 방마다 달라집니다. 기둥, ㄱ자, 칸막이, 십자, 구덩이 등 9가지 틀이 좌우로 뒤집혀 나옵니다",
        "벽과 기둥은 몸과 탄을 모두 막아서 숨으며 싸울 수 있습니다. 구덩이는 걸어서 지나갈 수 없지만 탄은 넘어갑니다",
        "적은 벽과 구덩이를 돌아서 다가옵니다. 튕기는 화살촉은 방 안 벽과 기둥에서도 튕깁니다",
        "게임 규칙이 바뀌어서 이어하기 저장은 이어지지 않습니다",
      ],
      en: [
        "Combat and Elite rooms now come in different shapes: pillars, L-shapes, dividers, crosses, pits and more, from 9 layouts that can also be mirrored",
        "Walls and pillars block both bodies and shots, so you can take cover. Pits can't be walked across, but shots fly over them",
        "Enemies walk around walls and pits to reach you. Ricochet tips also bounce off walls and pillars inside the room",
        "Game rules changed, so saved runs can't be continued",
      ],
      ja: [
        "戦闘部屋と強敵部屋の形が部屋ごとに変わります。柱、L字、仕切り、十字、穴など9種類の形が左右反転して出てきます",
        "壁と柱は体と弾の両方を防ぐので、隠れながら戦えます。穴は歩いて渡れませんが、弾は飛び越えます",
        "敵は壁や穴を回り込んで近づいてきます。跳ね返る矢じりは部屋の中の壁や柱でも跳ね返ります",
        "ゲームのルールが変わったため、続きから遊ぶ保存データは引き継がれません",
      ],
    },
  },
  {
    version: "0.20.2",
    date: "2026-10-18",
    items: {
      ko: [
        "마법사와 떠돌이를 네모 대신 캐릭터 그림으로 그립니다. 앞·뒤·옆 걷는 모습과 공격하는 모습이 있고, 대시 잔상도 캐릭터 모양으로 나옵니다",
        "바라보는 방향 표시를 흰 네모에서 발밑의 작은 화살촉으로 바꿨습니다",
        "Space를 누르고 있는 동안 캐릭터 그림 위에 실제로 맞는 범위를 작은 고리로 보여 줍니다. H 키·위쪽 버튼·설정으로 늘 보이게 할 수 있고, 모바일은 오른쪽 아래 맞는 범위 버튼을 누르고 있으면 보입니다. Space 대시는 없애고 대시는 우클릭으로만 합니다",
        "가장 가까운 적이 다가올수록 공격 범위가 옅은 원으로 점점 진하게 보이고, 적이 범위 안에 들어와 때릴 수 있게 되면 사라집니다",
      ],
      en: [
        "The Mage and Drifter are now drawn as character sprites instead of a square, with front, back and side walking and an attack pose. The dash afterimage matches the character too",
        "The facing marker is now a small arrowhead at the character's feet instead of a white square",
        "Hold Space to show the area that can actually be hit as a small ring over your character. H, the top button or Settings keep it always on, and on mobile hold the Hitbox button at the bottom right. Space no longer dashes; dash with right click",
        "Your attack range appears as a faint circle that grows stronger as the nearest enemy approaches, and disappears once an enemy is in range",
      ],
      ja: [
        "魔法使いと流れ者を四角ではなくキャラクターの絵で描くようにしました。前・後ろ・横の歩く姿と、攻撃する姿があり、ダッシュの残像もキャラクターの形になります",
        "向いている方向の表示を白い四角から足元の小さな矢じりに変えました",
        "Spaceを押している間、キャラクターの絵の上に実際に当たる範囲を小さな輪で表示します。Hキー・上のボタン・設定で常に表示でき、モバイルは右下の当たり判定ボタンを押している間表示されます。Spaceのダッシュはなくなり、ダッシュは右クリックのみです",
        "一番近い敵が近づくほど攻撃範囲が薄い円でだんだん濃く表示され、敵が範囲に入って攻撃できるようになると消えます",
      ],
    },
  },
  {
    version: "0.20.1",
    date: "2026-10-17",
    items: {
      ko: ["파수꾼 시작 무기 대검의 사거리를 늘렸습니다 (26 → 32)"],
      en: ["Increased the Warden's starting Greatblade range (26 → 32)"],
      ja: ["番人の初期武器・大剣の射程を伸ばしました（26 → 32）"],
    },
  },
  {
    version: "0.20.0",
    date: "2026-10-17",
    items: {
      ko: [
        "층 구조를 갈림길로 바꿨습니다. 아래쪽 시작 방에서 위쪽 보스방까지 칸을 하나씩 올라가며, 방을 정리하면 위쪽 벽에 출구가 2~3개 열립니다. 출구 아래 그림이 다음 방 종류이고, 하나를 골라 들어갑니다. 지나온 방으로는 돌아갈 수 없습니다",
        "새 방 2가지: 강한 적(적이 2마리 더, 체력 1.5배 · 정리하면 돈 2배와 사용 아이템) · 쉼터(들어가면 최대 체력 30% 회복, 보스 바로 앞 칸에 하나)",
        "미니맵을 세로 노선도로 바꿨습니다 (오른쪽 위, 아래가 시작). 층 전체의 갈림길과 방 종류가 처음부터 보이고, 지나온 길은 밝게 표시됩니다. 미니맵 클릭 이동은 없앴습니다. 배틀 관전 지도도 노선도로 바뀌었습니다",
        "보물방은 받침대 대신 열린 상자로 그립니다",
        "튜토리얼의 미니맵 단계를 '출구 고르기' 단계로 바꿨습니다",
        "게임 규칙이 바뀌어서 이어하기 저장은 이어지지 않습니다",
      ],
      en: [
        "Floors are now branching routes. You climb from the start room at the bottom to the boss room at the top, one step at a time. Clearing a room opens 2-3 exits on the top wall; the icon under each exit shows the next room, and you pick one. You can't go back",
        "Two new rooms: Elite (2 more enemies with 1.5x HP; clearing it gives double gold and a usable item) and Spring (heals 30% max HP on entry, one right before the boss)",
        "The minimap is now a vertical route map (top right, start at the bottom). It shows every branch and room type on the floor from the start and highlights the path you took. Clicking the map to travel was removed. The battle spectator map is a route map too",
        "Treasure rooms show an open chest instead of a pedestal",
        "The tutorial's minimap step is now a 'pick an exit' step",
        "The game rules changed, so continue-saves do not carry over",
      ],
      ja: [
        "階の構造を分かれ道に変えました。下のスタート部屋から上のボス部屋まで1マスずつ上り、部屋をクリアすると上の壁に出口が2〜3個開きます。出口の下の絵が次の部屋の種類で、1つを選んで入ります。通った部屋には戻れません",
        "新しい部屋2種：強敵（敵が2体多く体力1.5倍・クリアでお金2倍と使用アイテム）・泉（入ると最大体力の30%回復、ボスの直前のマスに1つ）",
        "ミニマップを縦のルートマップに変えました（右上、下がスタート）。階全体の分かれ道と部屋の種類が最初から見え、通った道は明るく表示されます。マップのクリック移動はなくしました。バトルの観戦マップもルートマップになりました",
        "宝部屋は台座の代わりに開いた宝箱で描きます",
        "チュートリアルのミニマップの段階を「出口を選ぶ」段階に変えました",
        "ゲームのルールが変わったため、つづきから遊ぶデータは引き継がれません",
      ],
    },
  },
];
