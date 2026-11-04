import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.29",
    date: "2026-11-05",
    items: {
      ko: ["이클립스: 새 그림을 색을 더 진하게 하지 않고 원래 색 그대로"],
      en: ["Eclipse: the new sprites now keep their original colors (no extra saturation)"],
      ja: ["エクリプス：新しい絵の色を濃くせず元の色のままに"],
    },
  },
  {
    version: "0.49.28",
    date: "2026-11-05",
    items: {
      ko: ["이클립스: 태양·일식 두 모습 그림을 새로 (선이 또렷하고 몸이 더 잘 보이게, 색 대비도 진하게)"],
      en: ["Eclipse: new sprites for both Sun and Eclipse forms (cleaner lines, more readable body, stronger contrast)"],
      ja: ["エクリプス：太陽・日食の両方の姿の絵を新しく（線がくっきり、体が見やすく、色のコントラストも強く）"],
    },
  },
  {
    version: "0.49.27",
    date: "2026-11-05",
    items: {
      ko: ["이클립스 태양: 4타는 앞에서 X자로 엇갈리는 두 불꽃 날(엇갈린 자리 번쩍), 5타는 앞으로 내리찍어 바닥에 태양 낙인이 터짐(둘레 불꽃·빛살, 터진 자리 전부 맞음) · 맞는 범위도 새 모양대로 · 이클립스 캐릭터를 크게 (뒤의 태양·일식 고리 말고 몸이 다른 캐릭터와 같은 크기)"],
      en: ["Eclipse Sun: hit 4 is now two flaming blades crossing in an X ahead (flash where they cross), hit 5 slams down ahead and a sun brand bursts on the ground (flame ring and rays; everything in the burst is hit) · hit areas follow the new shapes · Eclipse is drawn larger so her body (not the sun/eclipse halo behind) matches other characters"],
      ja: ["エクリプス太陽：4撃目は前方でX字に交差する2本の炎の刃（交差点が光る）、5撃目は前へ叩きつけ地面に太陽の刻印が弾ける（周りの炎・光芒、弾けた範囲すべてに命中）· 当たり範囲も新しい形どおり · エクリプスを大きく（後ろの太陽・日食の輪ではなく体が他のキャラクターと同じ大きさに）"],
    },
  },
  {
    version: "0.49.26",
    date: "2026-11-05",
    items: {
      ko: ["이클립스 태양: 공격을 새로 · 1~3타는 불꽃 도끼 궤적(1 위→아래 · 2 아래→위 · 3 옆으로 크게, 가는 꼬리는 몸 쪽으로 살짝 꺾이고 휘두른 끝은 도끼 머리) · 4·5타는 가늘고 길게 찌른 끝에서 작은 태양이 터짐 (터진 자리도 맞음) · 맞는 범위도 새 모양대로"],
      en: ["Eclipse Sun: new attacks · hits 1–3 are fiery axe arcs (1 top→down · 2 bottom→up · 3 a wide sideways sweep; the thin tail bends slightly toward her and the leading end is an axe head) · hits 4–5 are long thin thrusts that end in a small sun burst (the burst also deals damage) · hit areas follow the new shapes"],
      ja: ["エクリプス太陽：攻撃を一新 · 1〜3撃目は炎の斧の軌跡（1 上→下 · 2 下→上 · 3 横に大きく、細い尾は体側へ少し折れ、振った先端は斧頭）· 4・5撃目は細く長く突いた先で小さな太陽が弾ける（弾けた所にも当たる）· 当たり範囲も新しい形どおり"],
    },
  },
  {
    version: "0.49.25",
    date: "2026-11-05",
    items: {
      ko: ["이클립스 일식: 서 있을 때·걸을 때 좌우 바라보는 그림이 반대로 나오던 것 고침"],
      en: ["Eclipse (Eclipse form): fixed the standing and walking sprites facing the wrong way left/right"],
      ja: ["エクリプス日食：立ち・歩きで左右の向きが逆に表示されていたのを修正"],
    },
  },
  {
    version: "0.49.24",
    date: "2026-11-05",
    items: {
      ko: ["이클립스 태양: 서 있을 때·걸을 때 좌우 바라보는 그림이 반대로 나오던 것 고침"],
      en: ["Eclipse Sun: fixed the standing and walking sprites facing the wrong way left/right"],
      ja: ["エクリプス太陽：立ち・歩きで左右の向きが逆に表示されていたのを修正"],
    },
  },
  {
    version: "0.49.23",
    date: "2026-11-05",
    items: {
      ko: ["이클립스: 검격·이펙트를 다른 캐릭터처럼 비쳐 보이게 투명도를 낮춤"],
      en: ["Eclipse: slashes and effects are now more transparent, like other characters'"],
      ja: ["エクリプス：斬撃・エフェクトを他のキャラクターのように透けて見えるよう不透明度を下げた"],
    },
  },
  {
    version: "0.49.22",
    date: "2026-11-05",
    items: {
      ko: ["이클립스 일식: 도끼날 끝을 훨씬 두껍게 · 이클립스 이펙트를 화려하게: 태양 검격 꼭짓점 번쩍임·불똥, 일식 베기 잔상·도끼 머리 빛, 흑월 회전 도는 고리, 그림자 돌진 잔상, 일식 낙하 빛기둥·불똥, 맞은 자리 터짐, 개기일식 빛살, 영역의 도는 고리·태양 불꽃 혀, 블랙홀에 빨려 드는 알갱이, 날아가는 초승달 꼬리, 변신·치유의 빛 알갱이"],
      en: ["Eclipse (Eclipse form): much heavier axe-blade tips · flashier Eclipse effects: a flash and sparks at the tip of Sun slashes, afterimages and a glowing axe head on Eclipse cuts, a spinning ring on the Black Moon spin, shadow afterimages on the dash, a pillar of light and sparks on the eclipse slam, hit bursts, light rays on Totality, a turning ring and Sun flame tongues on the zone, dust swirling into black holes, trails on flying crescents, and rising motes on transformation and healing"],
      ja: ["エクリプス日食：斧の刃先をさらに太く · エクリプスのエフェクトを華やかに：太陽斬撃の頂点の閃光・火花、日食斬りの残像・斧頭の光、黒月回転の回るリング、影の突進の残像、日食落下の光の柱・火花、命中時の弾け、皆既日食の光芒、領域の回るリング・太陽の炎の舌、ブラックホールに吸い込まれる粒、飛ぶ三日月の尾、変身・治癒の光の粒"],
    },
  },
  {
    version: "0.49.21",
    date: "2026-11-05",
    items: {
      ko: ["이클립스 태양: 검격을 더 진하게 · 빨강을 몸 쪽으로 2배 두껍게 · 테두리 물결 무늬 빼고 얇은 노랑 줄만 · 1타는 위에서 꺾임(위 짧게·아래 길게), 2타는 가운데, 3타는 아래에서 꺾임(아래 짧게·위 길게) · 1타 좌우 폭 조금 좁게 · 4·5타 찌르기는 바깥은 각지고 안쪽 끝은 살짝 둥글게 · 왼쪽을 볼 때도 위·아래가 화면 그대로 · 맞는 범위도 새 모양대로"],
      en: ["Eclipse Sun: bolder slashes · the red part is twice as thick toward her body · the wavy edge pattern is gone, leaving a thin gold line · hit 1 bends high (short above, long below), hit 2 in the middle, hit 3 bends low (short below, long above) · hit 1 is slightly narrower · stabs 4 and 5 keep a sharp outer edge with a slightly rounded inner tip · up/down stays the same on screen when facing left · hit areas follow the new shapes"],
      ja: ["エクリプス太陽：斬撃をより濃く · 赤を体側へ2倍太く · 縁の波模様をなくし細い黄色の線だけに · 1撃目は上で折れる（上短く・下長く）、2撃目は中央、3撃目は下で折れる（下短く・上長く）· 1撃目の左右幅を少し狭く · 4・5撃目の突きは外側は角張り、内側の先端は少し丸く · 左を向いても上下は画面どおり · 当たり範囲も新しい形どおり"],
    },
  },
  {
    version: "0.49.20",
    date: "2026-11-05",
    items: {
      ko: [
        "이클립스 태양: 검격을 두꺼운 빨강 날로 (몸 쪽으로 더 두껍게) · 앞쪽 테두리에만 얇은 노랑 불꽃 무늬가 일렁임 · 검격을 몸에 더 붙여 직접 베는 느낌으로",
        "이클립스 일식: 내려베기·올려베기·초승달 참격의 휘두르는 쪽 끝을 도끼날처럼 네모나고 두껍게 · 날을 더 진하게 · 바깥 날에 밝은 줄",
      ],
      en: [
        "Eclipse Sun: slashes are now thick red blades (thicker toward her body) with a thin flickering gold flame pattern only on the front edge · drawn closer to her body so the hits feel like her own strikes",
        "Eclipse (Eclipse form): the leading end of Downward Cut, Rising Cut and Crescent Slash is now square and heavy like an axe blade · bolder blades with a bright outer edge",
      ],
      ja: [
        "エクリプス太陽：斬撃を太い赤い刃に（体側ほど太く）· 前側の縁だけに細い黄色の炎模様が揺らめく · 斬撃を体に近づけ、自分で斬っている感じに",
        "エクリプス日食：振り下ろし・振り上げ・三日月斬りの振る側の先端を斧の刃のように四角く太く · 刃をより濃く · 外側の刃に明るい線",
      ],
    },
  },
];
