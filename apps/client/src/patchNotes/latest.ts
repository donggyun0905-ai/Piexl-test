import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.75",
    date: "2026-11-07",
    items: {
      ko: [
        "미카엘라 무기마다 고유 기술: 37가지 무기가 저마다 3연격 기술 셋과 닿았을 때 기술 둘을 지님 · 기술 14가지 (베기 · 내려찍기 · 휘두르기 · 회전 베기 · 찌르기 · 돌진 찌르기 · 던지기 · 세 갈래 던지기 · X 베기 · 땅 가르기 · 올려베기 · 회오리 · 칼비 · 꿰뚫는 빛 창)",
        "박힌 무기에 닿거나 대시로 순간 이동해 들면 그 무기의 기술 둘이 연달아 (예: 은적 대검은 내려찍고 휘두르기 · 보라 낫창은 회오리 치고 던지기 · 비취 창은 칼비를 부르고 찌르기)",
        "무기를 바꿀 때·던질 때 터지던 폭발과 연쇄 폭발을 뺌 (폭발은 3 일제 폭파에만) · 기술마다 그 무기 그림이 휘둘러지고 꽂히고 날아가며 속성 색 빛",
        "아이템 바뀜: 성스러운 화약 기술 피해 · 넓은 폭심 기술 범위 · 공명 닿을 때 3연격 마지막 기술까지 · 긴 도화선 일제 폭파 피해 · 공허의 칼날 순간 이동해 들 때 기술 피해",
      ],
      en: [
        "Michaela's weapons each have their own techniques: all 37 weapons carry three chain techniques and two touch techniques · 14 techniques (slash · slam · sweep · spin · thrust · lunge · throw · triple throw · cross slash · ground split · rising slash · whirlwind · blade rain · piercing lance)",
        "Touch a planted weapon or dash-teleport to it and its two techniques fire in a row (e.g. the silver-crimson greatsword slams then sweeps · the violet scythe-spear whirls then throws · the jade spear calls blade rain then thrusts)",
        "Removed the explosions on swap and throw and the chain explosions (explosions only in 3 Mass Detonation) · each technique swings, plants and hurls the weapon's own art with its element's glow",
        "Items changed: Holy Powder technique damage · Wide Blast technique range · Resonance also fires the 3rd chain technique on touch · Long Fuse Mass Detonation damage · Void Edge technique damage when dash-teleporting",
      ],
      ja: [
        "ミカエラの武器ごとに固有の技：37本の武器それぞれが3連撃の技3つと触れた時の技2つを持つ · 技14種（斬り · 叩きつけ · 薙ぎ払い · 回転斬り · 突き · 突進突き · 投げ · 三方投げ · X斬り · 地割り · 斬り上げ · 旋風 · 剣の雨 · 貫く光の槍）",
        "刺さった武器に触れるかダッシュで瞬間移動して持つと、その武器の技2つが連続で（例：白銀紅の大剣は叩きつけて薙ぎ払う · 紫の鎌槍は旋風から投げ · 翡翠の槍は剣の雨を呼んで突く）",
        "持ち替え・投擲時の爆発と連鎖爆発を削除（爆発は3 一斉爆破のみ）· 技ごとにその武器の絵が振られ、突き刺さり、飛び、属性の色に光る",
        "アイテム変更：聖なる火薬 技ダメージ · 広い爆心 技の範囲 · 共鳴 触れた時に3連撃最後の技まで · 長い導火線 一斉爆破ダメージ · 虚空の刃 瞬間移動して持つ時の技ダメージ",
      ],
    },
  },
  {
    version: "0.49.74",
    date: "2026-11-07",
    items: {
      ko: [
        "미카엘라 무기 그림: 사용자 그림의 창 21개·검 16개를 하나씩 잘라 게임 무기로 · 방에 쏟아지는 무기·박힌 무기·손에 든 무기·몸 둘레에 떠다니는 무기·던진 무기·떨어지는 무기·베기·찌르기·바꿔 들기·무기고 모두 그 그림으로",
        "무기마다 그림 색에 맞는 속성 (예: 붉은 창 홍염 · 하늘색 수정 검 빙결 · 보라 낫창 자전 · 금빛 검 천광) · 그 무기로 공격하고 터질 때 그 속성 효과와 색 · 투척 뒤에는 다른 종류(검 ↔ 창)의 새 무기를 꺼냄",
      ],
      en: [
        "Michaela's weapon art: the 21 spears and 16 swords from the provided artwork are cut out one by one as in-game weapons · weapons raining into rooms, planted weapons, the weapon in hand, the floating swarm, thrown and falling weapons, slashes, thrusts, swaps and the Armory all use that art",
        "Each weapon has the element matching its colours (e.g. red spear Crimson Flame · sky-blue crystal sword Frost · violet scythe-spear Violet Storm · golden sword Heavenly Light) · attacks and explosions with it carry that element's effect and colour · after a throw she draws a new weapon of the other kind (sword ↔ spear)",
      ],
      ja: [
        "ミカエラの武器の絵：ユーザーの絵の槍21本・剣16本を1本ずつ切り出してゲームの武器に · 部屋に降り注ぐ武器・刺さった武器・手に持つ武器・体の周りに漂う武器・投げた武器・落ちてくる武器・斬り・突き・持ち替え・武器庫の全てがその絵",
        "武器ごとに絵の色に合う属性（例：赤い槍は紅炎 · 水色の水晶の剣は氷結 · 紫の鎌槍は紫電 · 金の剣は天光）· その武器での攻撃と爆発にその属性効果と色 · 投擲後は別の種類（剣 ↔ 槍）の新しい武器を取り出す",
      ],
    },
  },
];
