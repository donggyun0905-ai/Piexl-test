import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.33",
    date: "2026-11-05",
    items: {
      ko: [
        "탈라시아 새 캐릭터 리바이어: 고래와 함께 자유로운 바다를 누비는 창술사 (체력 105 · 공격력 12 · 이동 1.35, 여는 조건: 이동 속도 1.8 달성)",
        "리바이어: 바다의 창 3단 콤보 · 1타 앞 휘두르기 → 2타 한 바퀴 돌고 앞으로 커다란 고래 대돌격 → 3타 앞으로 돌진하고 부채꼴 충격파 · 타마다 확률로 고래가 같이 나와 날개로 넓게 쓸고 · 몸을 감아 한 바퀴 돌고 · 같이 돌진함 (안 나올수록 다음엔 잘 나옴)",
        "리바이어: 무기는 창에 박는 힘의 보석 10 (아쿠아마린·해류 사파이어·뇌명 토파즈·산호석·밀물 월장석·심해석·빙정·쌍둥이 진주·해풍석·리바이어던의 눈) · 전용 아이템 20 (창 10 · 고래 10) · 푸른 고래·물살·물보라 이펙트 · 고래 울음 · 그림 시트 · 패왕전 스킬 4",
      ],
      en: [
        "New Thalassia character Levia: a spear dancer roaming the free sea with the whales (105 HP · 12 attack · 1.35 move; unlock: reach 1.8 move speed)",
        "Levia: a 3-hit sea-spear combo · 1st a forward sweep → 2nd a full spin, then a giant whale charges forward → 3rd a lunge ending in a fan-shaped shockwave · each hit may bring a whale that sweeps wide with its fins, coils around you, or lunges beside you (more likely the longer it stays away)",
        "Levia: weapons are 10 power gems set in the spear (Aquamarine, Current Sapphire, Thunder Topaz, Coral Stone, Tide Moonstone, Abyss Stone, Ice Crystal, Twin Pearls, Sea Breeze Stone, Eye of the Leviathan) · 20 exclusive items (10 spear · 10 whale) · blue whale, water and splash effects · whale song · sprite sheet · 4 Paewang skills",
      ],
      ja: [
        "タラシアの新キャラクター、リヴァイア：クジラと共に自由な海を駆ける槍使い（体力105 · 攻撃力12 · 移動1.35、解放条件：移動速度1.8達成）",
        "リヴァイア：海の槍の3段コンボ · 1段目 前へ薙ぎ払い → 2段目 一回転して前へ巨大なクジラ大突撃 → 3段目 前へ突進して扇形の衝撃波 · 各段で確率でクジラが現れ、ヒレで広く薙ぎ・体を巻いて一回転し・一緒に突進する（出ないほど次は出やすい）",
        "リヴァイア：武器は槍にはめる力の宝石10（アクアマリン・海流のサファイア・雷鳴のトパーズ・珊瑚石・満ち潮のムーンストーン・深海石・氷晶・双子の真珠・海風石・リヴァイアサンの瞳）· 専用アイテム20（槍10 · クジラ10）· 青いクジラ・水流・水しぶきのエフェクト · クジラの歌 · スプライトシート · 覇王戦スキル4",
      ],
    },
  },
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
