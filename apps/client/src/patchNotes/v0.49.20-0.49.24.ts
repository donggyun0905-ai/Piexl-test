import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
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
