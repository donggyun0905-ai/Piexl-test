import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.75",
    date: "2026-11-13",
    items: {
      ko: ["블뢰: 종언의 영구동토 이펙트 크기 1/4"],
      en: ["Bleu: Permafrost of the End effect is a quarter of the size"],
      ja: ["ブルー：終焉の永久凍土のエフェクトの大きさが4分の1"],
    },
  },
  {
    version: "0.52.74",
    date: "2026-11-13",
    items: {
      ko: ["블뢰: 추가 공격 1~4단계(영혼 늑대·매·사슴·군단)와 월광 백랑의 포효·종언의 영구동토 효과를 예전처럼 (차례대로 보여 주고 마지막 그림에서 머묾)", "존: 황뢰 천수 이펙트 크기 절반"],
      en: ["Bleu: Extra attack stages 1–4 (Spirit Wolf, Hawk, Stag, Legion), Roar of the Moonlit White Wolf and Permafrost of the End play as before (frames in order, holding on the last)", "Jaune: Thousand Golden Thunder Hands effect is half the size"],
      ja: ["ブルー：追加攻撃1〜4段階（霊狼・霊鷹・霊鹿・霊軍団）と月光白狼の咆哮・終焉の永久凍土のエフェクトを以前の形に（順に見せて最後のコマで止まる）", "ジョーヌ：黄雷千手のエフェクトの大きさが半分"],
    },
  },
  {
    version: "0.52.73",
    date: "2026-11-13",
    items: {
      ko: ["느아르·루주·블뢰·존: 다른 캐릭터처럼 빛 효과가 붙음 (기술마다 보라·붉은·하늘·금빛 빛과 고리·불티, 궁극기는 빛기둥과 번쩍임 · 등 뒤 악마 계급 빛 · 혈장미·눈결정·결정탄·뇌구 등은 은은하게 빛남 · 한정 스킨 색)", "블뢰: 효과 길이를 마지막 한 대에 맞춤 (마지막 그림이 마지막 한 대 때 뜨고 끝남)"],
      en: ["Noir, Rouge, Bleu & Jaune: now get light effects like other characters (violet, red, sky-blue and golden glows, rings and sparks per skill; light pillars and flashes for ultimates · a glow of the demon rank behind them · Blood Roses, snowflakes, crystal shots and thunder orbs softly glow · limited-skin accent colors)", "Bleu: effect lengths now match the last hit (the final frame appears with the last hit)"],
      ja: ["ノワール・ルージュ・ブルー・ジョーヌ：他のキャラクターと同じく光の効果が付く（技ごとに紫・赤・空色・金色の光と輪・火花、必殺技は光の柱と閃光・背中に悪魔の位階の光・血薔薇・雪の結晶・結晶弾・雷球などがほのかに光る・限定スキンの色）", "ブルー：エフェクトの長さを最後の一撃に合わせた（最後のコマが最後の一撃で出て終わる）"],
    },
  },
  {
    version: "0.52.72",
    date: "2026-11-13",
    items: {
      ko: ["연습장 진영 탭: 아슈바르(느아르·루주·블뢰·존)는 '레벨업 (흑 가득)' 버튼으로 바로 레벨업", "존: 황금 번개 주먹·초월 벽력일섬·광란의 천뢰·뇌신의 손아귀 범위·이펙트 절반, 지그재그 뇌격·초월 벽력일섬은 1/3 · 광란의 천뢰·뇌신의 손아귀·종언의 황천뢰(낙뢰 부분)가 끊기지 않고 반복 · 종언의 황천뢰 강한 1타가 맨 마지막에", "블뢰·존: 효과 그림이 겹쳐 넘어갈 때 어두워지며 깜빡이던 것 고침 · 마지막 그림이 끝까지 보임"],
      en: ["Practice faction tab: Ashvar characters (Noir, Rouge, Bleu, Jaune) can level up instantly with 'Level up (fill Black)'", "Jaune: Golden Lightning Fist, Transcendent Thunderclap Flash, Frenzied Heaven Thunder and Grasp of the Thunder God have half the range and effect size; Zigzag Bolt and Transcendent Thunderclap Flash a third · Frenzied Heaven Thunder, Grasp of the Thunder God and the falling bolts of Golden Heaven Thunder of the End now loop without breaks · its strong hit now lands last", "Bleu & Jaune: effect frames no longer dim and flicker while blending · the last frame stays fully visible"],
      ja: ["練習場の陣営タブ：アシュヴァル（ノワール・ルージュ・ブルー・ジョーヌ）は「レベルアップ（黒満タン）」ですぐレベルアップ", "ジョーヌ：黄金雷拳・超越霹靂一閃・狂乱の天雷・雷神の掌握の範囲・エフェクトが半分、ジグザグ雷撃・超越霹靂一閃は1/3・狂乱の天雷・雷神の掌握・終焉の黄天雷（落雷部分）が途切れず繰り返す・終焉の黄天雷の強い1ヒットが最後に", "ブルー・ジョーヌ：エフェクトのコマが重なって切り替わる時に暗くなってちらつくのを修正・最後のコマが最後まで見える"],
    },
  },
  {
    version: "0.52.71",
    date: "2026-11-13",
    items: {
      ko: ["블뢰·존: 오래 가는 효과가 마지막 그림에서 멈추지 않고 가운데 그림들을 부드럽게 반복 (느아르·루주처럼)", "존: 황금 뇌구는 마지막 그림과 좌우 반전 그림을 번갈아 돌며 회전 · 혼돈의 낙뢰는 한 대마다 낙뢰가 다시 내려치고 마지막 강타 3번은 크게 · 천둥의 발자취는 이펙트의 지그재그 번개 길을 따라 캐릭터가 꺾이며 돌진하고 이펙트가 돌진 방향으로 돌아감"],
      en: ["Bleu & Jaune: long effects no longer freeze on the last frame; they loop their middle frames smoothly (like Noir and Rouge)", "Jaune: Golden Thunder Orb alternates its last frame with a mirrored copy while spinning · Chaos Thunderfall strikes again with every hit, with the last 3 strong hits drawn larger · Footsteps of Thunder now dashes along the effect's zigzag lightning path, and the effect turns to the dash direction"],
      ja: ["ブルー・ジョーヌ：長いエフェクトが最後のコマで止まらず、中間のコマを滑らかに繰り返す（ノワール・ルージュと同じ）", "ジョーヌ：黄金雷球は最後のコマと左右反転のコマを交互に回転しながら表示・混沌の落雷は一撃ごとに落雷が落ち直し、最後の強撃3回は大きく・雷鳴の足跡はエフェクトのジグザグの雷の道に沿って曲がりながら突進し、エフェクトも突進方向に回る"],
    },
  },
];
