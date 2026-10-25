import type { PatchNote } from "./types";

// 지난 기록 (0.48.25~0.48.29)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.29",
    date: "2026-10-22",
    items: {
      ko: ["범 풍류 맞힘 발톱 자국이 때릴 때마다 달라집니다: 방향을 번갈아 뒤집고, 각도·크기·자리가 조금씩 바뀌며, 가끔은 한두 줄만 살짝 긁습니다"],
      en: ["Tiger Revelry hit claw marks now vary with every hit: alternating direction, shifting angle, size and position, and sometimes just a light one- or two-line scratch"],
      ja: ["虎の風流のヒット爪痕が毎回変わります：向きを交互に反転し、角度・大きさ・位置が少しずつ変わり、時には一、二本だけ軽く引っかきます"],
    },
  },
  {
    version: "0.48.28",
    date: "2026-10-22",
    items: {
      ko: [
        "연습장 허수아비에도 출혈이 걸려 붉은 출혈 피해 숫자가 보입니다 (허수아비는 체력 100짜리처럼 계산)",
        "닌자 독 수리검이 화상 대신 독 상태를 걸어 초록 독 피해 숫자가 뜹니다 (점화와 따로 들어감) · 소환술사 독버섯 포자 피해도 독 숫자로 표시",
      ],
      en: [
        "Bleed now applies to the practice scarecrow too, so red bleed numbers show up (the scarecrow counts as a 100-HP foe)",
        "The Ninja's venom shuriken now poisons instead of burning, showing green poison numbers (it stacks separately from ignite) · Summoner toadstool spores also show as poison damage",
      ],
      ja: [
        "練習場のかかしにも出血がかかり、赤い出血ダメージ数字が見えます（かかしは体力100の敵として計算）",
        "忍者の毒手裏剣が火傷ではなく毒状態をかけ、緑の毒ダメージ数字が出ます（点火とは別に入る）・召喚術師の毒キノコの胞子ダメージも毒の数字で表示",
      ],
    },
  },
  {
    version: "0.48.27",
    date: "2026-10-22",
    items: {
      ko: ["범 풍류 근접·맞힘 발톱 자국을 반투명하게 (처음부터 살짝 비쳐 보이고 서서히 흐려짐)"],
      en: ["Tiger Revelry melee and hit claw slashes are now semi-transparent, fading out gradually"],
      ja: ["虎の風流の近接・ヒットの爪痕を半透明に（最初から少し透けて徐々に薄れる）"],
    },
  },
  {
    version: "0.48.26",
    date: "2026-10-22",
    items: {
      ko: ["범 풍류 스킨 근접 공격·맞힘 효과를 노란 네모 대신 끝이 날카로운 발톱 자국 세 줄로 (갈색 테두리 · 노란 안쪽 · 붉은 가운데 줄). 휘두른 자국은 내 바로 앞에, 맞힌 적 위에는 맞힘 자국이 생겨 멀리서 때려도 허공에 뜨지 않습니다"],
      en: ["Tiger Revelry melee and hit effects are now three razor claw slashes (brown edge, yellow inside, red core) instead of yellow squares. Swing slashes appear right in front of you and hit slashes on the enemy, so nothing floats mid-air at long reach"],
      ja: ["虎の風流スキンの近接攻撃・ヒット演出を黄色い四角から先の鋭い爪痕三本に（茶色の縁・黄色の内側・赤い芯）。振りの爪痕は自分のすぐ前、当たった敵の上にはヒットの爪痕が出るので、遠くから当てても宙に浮きません"],
    },
  },
  {
    version: "0.48.25",
    date: "2026-10-22",
    items: {
      ko: [
        "범 풍류 치명타를 새로 디자인: 번쩍임과 함께 끝이 날카로운 검은 발톱 자국 세 줄(안쪽은 붉게 타고 가장자리는 하얗게 빛남)이 그어지고 불씨가 튀며, 그 위에 묵직한 붉은 숫자가 크게 튀어나옵니다",
        "켄타우로스를 다시 그림: 크고 둥근 말 몸에 장식 천, 말 가슴에서 그대로 솟은 뿔 투구 기사, 앞으로 길게 겨눈 큰 창과 깃발",
      ],
      en: [
        "Redesigned Tiger Revelry crits: a flash, three razor-tipped black claw slashes (burning red inside, glowing white at the edge) with flying embers, and a heavy red number bursting out on top",
        "Redrew the Centaur: a big, rounded horse body with a caparison, a horned knight rising straight out of the horse's chest, and a huge lance with a pennant thrust forward",
      ],
      ja: [
        "虎の風流の会心を新デザイン：閃光とともに先の鋭い黒い爪痕が三本（内側は赤く燃え、縁は白く光る）走って火の粉が飛び、その上に重厚な赤い数字が大きく飛び出します",
        "ケンタウロスを描き直し：大きく丸い馬体に飾り布、馬の胸からそのまま伸びる角兜の騎士、前へ構えた大きな槍と旗",
      ],
    },
  },
];
