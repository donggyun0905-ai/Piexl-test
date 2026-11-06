import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.60",
    date: "2026-11-06",
    items: {
      ko: ["스킬 칸(베아트리스·추적자)에 마우스를 올리면 위에 스킬 설명이 뜸 (효과·피해·대기 시간)"],
      en: ["Hovering a skill button (Beatrice · Tracker) shows the skill's description above it (effect · damage · cooldown)"],
      ja: ["スキル欄（ベアトリス・追跡者）にマウスを乗せると上にスキル説明が出る（効果・ダメージ・待機時間）"],
    },
  },
  {
    version: "0.49.59",
    date: "2026-11-06",
    items: {
      ko: ["베아트리스 일식의 춤: 무희가 춤추며 베고 지나가듯 몸 둘레 곳곳에 작은 초승달 칼빛이 연달아 그어지고, 베인 적마다 가는 일직선 칼선 · 지나가며 베는 범위 넓힘 (경로 둘레 28) · 무거운 일식 고리 잔상은 옅은 빛으로"],
      en: ["Beatrice's Eclipse Dance: like a dancer cutting through as she spins, small crescent blade lights flash all around her, and each foe cut gets a thin straight slash · wider cutting area along the path (28 around it) · the heavy eclipse-ring afterimages are now a faint glow"],
      ja: ["ベアトリスの日食の舞：舞姫が舞いながら斬り抜けるように、体の周りのあちこちに小さな三日月の剣光が次々と走り、斬られた敵ごとに細い一直線の剣線 · 通り抜けて斬る範囲を広げた（道の周り28）· 重い日食の輪の残像は淡い光に"],
    },
  },
  {
    version: "0.49.58",
    date: "2026-11-06",
    items: {
      ko: ["베아트리스 칼빛: 파수꾼 검격과 같은 두께·모양으로 · 색만 평소 주황, 태양 검날(1번)·자애 중 빨강 · 3타·처단도 기본 공격과 같은 칼빛 X자 (심판은 그대로)"],
      en: ["Beatrice's blade light: same thickness and shape as the Warden's slash · only the color differs, orange normally and red during Solar Blade (1) or Mercy · the 3rd hit and Execution use the same X of blade light (Judgment unchanged)"],
      ja: ["ベアトリスの剣光：番人の剣撃と同じ太さ・形に · 色だけ普段はオレンジ、太陽剣刃（1番）・慈愛中は赤 · 3撃目・処断も通常攻撃と同じ剣光のX字（審判はそのまま）"],
    },
  },
  {
    version: "0.49.57",
    date: "2026-11-06",
    items: {
      ko: ["베아트리스 검격: 파수꾼 검격과 같은 초승달 칼빛을 더 두껍게 · 1타·2타 초승달이 대각선으로 겹쳐 X자, 3타도 같은 초승달 둘로 X자를 다시 벰"],
      en: ["Beatrice's slashes: the same crescent blade light as the Warden's, but thicker · hits 1 and 2 overlap diagonally into an X, and hit 3 re-cuts the X with the same two crescents"],
      ja: ["ベアトリスの剣撃：番人の剣撃と同じ三日月の剣光をより太く · 1撃目・2撃目の三日月が斜めに重なってX字、3撃目も同じ三日月2つでX字を斬り直す"],
    },
  },
  {
    version: "0.49.56",
    date: "2026-11-06",
    items: {
      ko: ["베아트리스: 악의 마크와 숫자를 다른 캐릭터 표식 크기로 줄임 ('x숫자') · 칼선 한쪽 끝이 평평하던 것 고침 (양 끝 모두 뾰족)"],
      en: ["Beatrice: the Evil mark and number are now the same size as other characters' marks ('x number') · fixed one end of her slashes being flat (both ends are sharp)"],
      ja: ["ベアトリス：悪のマークと数字を他キャラクターの印と同じ大きさに（「x数字」）· 剣線の片端が平らだったのを修正（両端とも尖る）"],
    },
  },
  {
    version: "0.49.55",
    date: "2026-11-06",
    items: {
      ko: ["캐릭터 선택창 나라 탭·아카이브 나라 색: 탈라시아는 하늘색, 성국은 흰색 (색이 없어 검게 보이던 것 고침)"],
      en: ["Nation colors in the character select tabs and the archive: Thalassia is sky blue, the Holy Kingdom is white (they showed as black before)"],
      ja: ["キャラクター選択の国タブ・アーカイブの国の色：タラシアは空色、聖国は白（色がなく黒く見えていたのを修正）"],
    },
  },
];
