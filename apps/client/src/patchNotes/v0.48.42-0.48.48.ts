import type { PatchNote } from "./types";

// 지난 기록 (0.48.42~0.48.48)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.48",
    date: "2026-10-23",
    items: {
      ko: ["베두인: 던진 차크람은 벽에 닿을 때까지 멈추지 않고 날아가 한 번 튕긴 뒤, 거기서 사거리만큼 더 날아감 (튕겨 돌아올 때 닿으면 잡음) · 회귀 바람의 던지는 거리 -25% 없앰"],
      en: ["Bedouin: a thrown chakram never stops before reaching a wall; it bounces once and then flies its range from there (touch it on the way back to catch it) · Returning Wind no longer reduces throw range by 25%"],
      ja: ["ベドウィン：投げたチャクラムは壁に当たるまで止まらず、一度跳ね返ってからそこから射程分さらに飛ぶ（戻ってくる時に触れるとキャッチ）· 回帰の風の投げる距離-25%を削除"],
    },
  },
  {
    version: "0.48.47",
    date: "2026-10-23",
    items: {
      ko: ["베두인: 차크람을 던져 손이 비어 있는 동안 이동 속도 +0.2 · 벽에 튕긴 차크람은 이미 벤 적도 다시 벰"],
      en: ["Bedouin: move speed +0.2 while the chakram is thrown · a chakram that bounces off a wall can hit the same foe again"],
      ja: ["ベドウィン：チャクラムを投げて手が空いている間は移動速度+0.2 · 壁で跳ね返ったチャクラムは同じ敵をもう一度斬る"],
    },
  },
  {
    version: "0.48.46",
    date: "2026-10-23",
    items: {
      ko: ["베두인: 대시 거리 1.4배 · 벽에 튕긴 차크람은 날아가는 중에도 닿으면 잡음"],
      en: ["Bedouin: dash distance x1.4 · a chakram that has bounced off a wall can be caught mid-flight by touching it"],
      ja: ["ベドウィン：ダッシュ距離1.4倍 · 壁で跳ね返ったチャクラムは飛んでいる途中でも触れるとキャッチ"],
    },
  },
  {
    version: "0.48.45",
    date: "2026-10-23",
    items: {
      ko: ["거너: 최대 체력 40 고정 (70 → 40, 체력 아이템을 먹어도 늘지 않음) · 그래서 전용 아이템 군기·총 공격·특급의 체력 증감은 뺌"],
      en: ["Gunner: max HP fixed at 40 (70 → 40; HP items no longer raise it) · so the HP changes on Discipline, All-Out Attack and Elite were removed"],
      ja: ["ガンナー：最大体力を40に固定（70 → 40、体力アイテムでも増えない）· そのため専用アイテム軍紀・総攻撃・特級の体力増減を削除"],
    },
  },
  {
    version: "0.48.44",
    date: "2026-10-23",
    items: {
      ko: [
        "장수: 의천검·쌍고검의 X자 베기를 앞에서 엇갈리는 진짜 X자로 고침 · 쌍고검 쌍검 찌르기는 벌어지지 않고 나란히 찔러 앞의 적에게 잘 맞음",
        "베두인: 공격력 24로 올림 (어려웠던 난이도 완화) · 모든 베두인이 대시로 지나간 적을 공격력 30%로 벰 · 대시할 때 굵은 모래바람 효과",
        "베두인 전용 '사구 질주'를 '무희의 춤'으로 바꿈: 대시하며 빙글 돌고, 지나간 적을 공격력 20%로 연달아 3번 벰",
        "베두인 '되튕김': 한 번이 아니라 날아가는 동안 벽에 닿을 때마다 계속 튕김",
      ],
      en: [
        "General: the X cut of Heaven Sword and Twin Swords is now a real X crossing in front · Twin Swords' twin thrust now stabs side by side so it reliably hits foes in front",
        "Bedouin: damage raised to 24 (eases the difficulty) · every Bedouin now cuts foes they dash through for 30% damage · thick sandstorm trail while dashing",
        "Bedouin item 'Dune Rush' is now 'Dancer's Whirl': twirl while dashing and slash foes you pass 3 times in a row for 20% damage each",
        "Bedouin 'Rebound': the chakram now keeps bouncing off every wall while flying, not just once",
      ],
      ja: [
        "武将：倚天剣・双股剣のX字斬りを前方で交差する本物のX字に · 双股剣の双剣突きは広がらず並んで突くので前の敵によく当たる",
        "ベドウィン：攻撃力を24に（難しすぎた難易度を緩和）· すべてのベドウィンがダッシュで通り抜けた敵を攻撃力30%で斬る · ダッシュ時に太い砂嵐の演出",
        "ベドウィン専用「砂丘疾走」を「舞姫の舞」に変更：ダッシュ中にくるりと回り、通り抜けた敵を攻撃力20%で3回連続で斬る",
        "ベドウィン「跳ね返り」：一度だけでなく、飛んでいる間は壁に当たるたびに跳ね返り続ける",
      ],
    },
  },
  {
    version: "0.48.43",
    date: "2026-10-23",
    items: {
      ko: [
        "장수: 적에게 뛰어드는 기술(돌진 내리꽂기·돌파)을 쓰면 보호막 10이 2초 동안 생김",
        "장수: 모든 무기 콤보가 다섯 기술 이상 (장팔사모 긴 찌르기 3, 애각창 찌르기·휘두르기 → 연속 찌르기 → 찌르기 → 돌파 → 회전)",
      ],
      en: [
        "General: charging moves (lunging slam, breakthrough) now give a 10-point shield for 2 seconds",
        "General: every weapon combo now has at least 5 moves (Serpent Spear 3 long thrusts; Cliff Spear thrust, swing → flurry → thrust → breakthrough → spin)",
      ],
      ja: [
        "武将：敵に飛び込む技（突進叩きつけ・突破）でシールド10が2秒間つく",
        "武将：すべての武器コンボが5技以上に（蛇矛は長い突き3、涯角槍は突き・薙ぎ → 連続突き → 突き → 突破 → 回転）",
      ],
    },
  },
  {
    version: "0.48.42",
    date: "2026-10-22",
    items: {
      ko: [
        "장수 무기 콤보를 무기 주인에 맞게 새로 짬: 돌진 내리꽂기는 훈련용 창만. 방천화극 회전·돌파, 청룡언월도 크게 베기·큰 검기, 장팔사모 다섯 번 연속 찌르기·호령 충격파, 의천검 빠른 베기·십자 베기, 쌍고검 두 갈래 찌르기·회전, 화랑 보검 부채꼴 검기, 고려 대도 크게 베기 연속, 애각창 연속 찌르기·돌파, 쌍룡검 부채꼴 검기·충격파, 결사의 장검 결사 충격파",
        "숨겨진 힘 필살기마다 고유한 색 (광풍난무 빨강·청룡참 초록·장판교 호령 주황·패도 보라·인덕 금빛·삼한일통 하늘색·일기당천 진홍·칠진칠출 은빛·학익진 파랑·황산벌 결사 불꽃색) · 필살기 빛과 이름도 그 색으로, 광풍난무·장판교 호령은 더 크게",
      ],
      en: [
        "General weapon combos redesigned to fit each weapon's owner: only the training spear ends with the lunging slam. Sky Halberd spins and breaks through, Green Dragon Blade cleaves with a giant wave, Serpent Spear does a 5-hit flurry and roaring shockwave, Heaven Sword quick cuts and a cross cut, Twin Swords twin thrusts and a spin, Hwarang Sword a fan of waves, Goryeo blade chained great cleaves, Cliff Spear flurries and a breakthrough, Twin Dragon Sword a wave fan and shockwave, Gyebaek's blade a do-or-die shockwave",
        "Every Hidden Power finisher now has its own color (Frenzy red, Dragon Cleave green, Bridge Roar orange, Hegemon purple, Benevolence gold, Unify sky blue, One Against a Thousand crimson, Seven In Seven Out silver, Crane Wing blue, Last Stand flame) · the finisher light and name use it too, and Frenzy and Roar are bigger",
      ],
      ja: [
        "武将の武器コンボを持ち主に合わせて作り直し：突進叩きつけは訓練用の槍だけ。方天画戟は回転・突破、青龍偃月刀は大薙ぎ・大剣気、蛇矛は五連突き・咆哮の衝撃波、倚天剣は素早い斬り・十字斬り、双股剣は二股突き・回転、花郎の宝剣は扇状の剣気、高麗の大刀は大薙ぎの連続、涯角槍は連続突き・突破、双龍剣は扇状の剣気・衝撃波、決死の長剣は決死の衝撃波",
        "秘めた力の必殺技ごとに固有の色（狂風乱舞は赤・青龍斬は緑・長坂橋の咆哮は橙・覇道は紫・仁徳は金・三韓一統は空色・一騎当千は真紅・七進七出は銀・鶴翼の陣は青・黄山伐の決死は炎色）· 必殺技の光と名前もその色に、狂風乱舞と咆哮はより大きく",
      ],
    },
  },
];
