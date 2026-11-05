import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.32",
    date: "2026-11-05",
    items: {
      ko: ["캐릭터 선택창: 게임에서 크게 그리는 캐릭터(토르켄·이클립스·펜리르)의 그림이 칸보다 커서 잘리고 더 늘어나 흐리게 보이던 것 고침 · 이제 닻·광륜까지 다 보이고 다른 캐릭터와 같은 또렷함"],
      en: ["Character select: characters drawn larger in game (Thorken, Eclipse, Fenrir) no longer get cropped and over-stretched (blurry) in their cards · the anchor and halo now fit and look as crisp as everyone else"],
      ja: ["キャラクター選択：ゲームで大きく描くキャラクター（トルケン・エクリプス・フェンリル）の絵が枠より大きく切れて引き伸ばされ、ぼやけて見えていたのを修正 · 錨や光輪まで全部見え、他のキャラと同じくっきりさに"],
    },
  },
  {
    version: "0.49.31",
    date: "2026-11-05",
    items: {
      ko: ["토르켄: 닻을 휘두를 때마다 커다란 금빛 닻 모양이 몸 둘레로 부채꼴을 그리며 휙 돌아감 (잔상 셋 + 뒤따르는 물살)"],
      en: ["Thorken: every anchor swing now shows a big golden anchor sweeping around you in an arc (three afterimages + a trailing water wake)"],
      ja: ["トルケン：錨を振るたび、大きな金色の錨の形が体の周りを扇形にぶんと回る（残像3つ + 後を追う水流）"],
    },
  },
  {
    version: "0.49.30",
    date: "2026-11-05",
    items: {
      ko: [
        "새 나라 탈라시아(바다의 나라, 자유와 해방) · 첫 캐릭터 토르켄: 거대한 닻 + 사슬로 이은 철구공 (체력 120 · 공격력 12 · 방어 5, 여는 조건: 최대 체력 250 달성)",
        "토르켄: 처음 누르면 철구공을 던져 떨어진 자리에 천둥 · 그 뒤 닻을 휘두를 때마다(느리지만 넓고 셈) 사슬 끝 철구공이 나를 중심으로 크게 돌며 휩씀 (공을 어디 두느냐에 따라 휩쓰는 길이 달라짐) · 대시하면 철구공을 감아 들여 다시 던짐",
        "토르켄: 때릴수록 폭풍 게이지가 차고, 가득이면 다음 휘두르기에 태풍(철구공을 따라다니며 끌어당김) + 하늘에서 천둥 · 무기는 철구공 10개(무쇠·조수·뇌운·소용돌이·성게·쌍둥이·간헐천·빙해·크라켄·대해일) · 전용 아이템 10 · 물보라·파도·소용돌이·번개 이펙트 · 그림 시트 · 패왕전 스킬 4",
      ],
      en: [
        "New nation Thalassia (the sea nation of freedom and liberation) · first character Thorken: a giant anchor + a chained iron ball (120 HP · 12 attack · 5 defense; unlock: reach 250 max HP)",
        "Thorken: the first press throws the ball, and thunder strikes where it lands · then every anchor swing (slow but wide and heavy) whips the chained ball around you in a huge arc (where you leave the ball shapes the sweep) · dash reels the ball back to throw again",
        "Thorken: hits fill the Storm gauge; when full, your next swing calls a typhoon (follows the ball and pulls foes in) + thunder from the sky · weapons are 10 balls (Iron, Tide, Thundercloud, Whirlpool, Urchin, Twin, Geyser, Ice Floe, Kraken, Maelstrom) · 10 exclusive items · splash, wave, whirlpool and lightning effects · sprite sheet · 4 Paewang skills",
      ],
      ja: [
        "新しい国タラシア（自由と解放の海の国）· 最初のキャラクター、トルケン：巨大な錨 + 鎖でつないだ鉄球（体力120 · 攻撃力12 · 防御5、解放条件：最大体力250達成）",
        "トルケン：最初の入力で鉄球を投げ、落ちた場所に雷 · 以後は錨を振るたび（遅いが広く強い）鎖の先の鉄球が自分を中心に大きく回って薙ぐ（球をどこに置くかで薙ぐ道が変わる）· ダッシュで鉄球を巻き戻してまた投げる",
        "トルケン：当てるほど嵐ゲージがたまり、満ちると次の振りで台風（鉄球について回り敵を引き寄せる）+ 空から雷 · 武器は鉄球10種（鉄・潮・雷雲・渦潮・ウニ・双子・間欠泉・氷海・クラーケン・大海嘯）· 専用アイテム10 · 水しぶき・波・渦潮・雷のエフェクト · スプライトシート · 覇王戦スキル4",
      ],
    },
  },
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
];
