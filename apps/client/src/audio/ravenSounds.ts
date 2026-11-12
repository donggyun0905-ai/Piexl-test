// 레이븐 효과음: 킹 내려찍기(묵직한 돌) · 퀸 빛기둥(맑은 종) · 체크(작은 딩) · 체크메이트(왕관 화음) · 기물 공격 · 체스판 기둥 · 포위 · 캐슬링 · 그랜드 · 십자 빛
import type { RunState } from "@pixel-rogue/shared";
import { noise, tone, type Sfx } from "./sound";

/** 맑은 종소리 화음 (hz 뿌리음 · 화음 비율 · 세기) */
const chime = (hz: number, steps: number[] = [1, 1.25, 1.5], vol = 0.06, gap = 0.04) =>
  steps.forEach((k, i) => tone({ type: "sine", from: hz * k, to: hz * k, dur: 0.35, vol, delay: i * gap }));
/** 돌 기물이 바닥에 닿는 소리 */
const thud = (hz = 120, vol = 0.22) => {
  tone({ type: "sine", from: hz, to: hz * 0.4, dur: 0.22, vol });
  noise(0.12, vol * 0.8, 900);
};

export const RAVEN_SOUNDS = {
  rvSlam: () => {
    thud(140, 0.22);
    tone({ type: "triangle", from: 600, to: 300, dur: 0.08, vol: 0.04 });
  },
  rvPillar: () => {
    chime(880, [1, 1.5], 0.05, 0.03);
    noise(0.1, 0.06, 5000);
  },
  rvCheck: () => tone({ type: "sine", from: 1760, to: 1760, dur: 0.08, vol: 0.04 }),
  rvMatePop: () => {
    chime(660, [1, 1.26, 1.5, 2], 0.07, 0.05);
    noise(0.15, 0.08, 4000);
  },
  rvPawn: () => [0, 0.05, 0.1, 0.15].forEach((d) => tone({ type: "square", from: 300, to: 220, dur: 0.04, vol: 0.03, delay: d })),
  rvKnight: () => {
    noise(0.2, 0.08, 2600);
    tone({ type: "triangle", from: 300, to: 700, dur: 0.18, vol: 0.05 });
  },
  rvKnightLand: () => thud(110, 0.24),
  rvBeam: () => tone({ type: "sine", from: 1200, to: 1200, dur: 0.15, vol: 0.04 }),
  rvBeamFire: () => {
    tone({ type: "sawtooth", from: 400, to: 1600, dur: 0.18, vol: 0.06 });
    chime(990, [1, 1.5], 0.05);
  },
  rvRook: () => {
    noise(0.3, 0.16, 700);
    tone({ type: "sine", from: 90, to: 60, dur: 0.3, vol: 0.18 });
  },
  rvDecree: () => chime(1046, [1, 1.25, 1.5, 1.875], 0.05, 0.03),
  rvJudge: () => tone({ type: "sine", from: 900, to: 200, dur: 0.45, vol: 0.06 }),
  rvJudgeHit: () => {
    thud(70, 0.3);
    noise(0.3, 0.22, 1400);
  },
  rvPromo: () => {
    chime(784, [1, 1.26, 1.5, 2], 0.06, 0.04);
    setTimeout(() => thud(100, 0.2), 60);
  },
  rvBoardHit: () => chime(1318, [1, 1.5], 0.035, 0.02),
  rvMateRing: () => [0, 0.06, 0.12, 0.18].forEach((d) => tone({ type: "triangle", from: 500 + d * 2000, to: 500 + d * 2000, dur: 0.06, vol: 0.04, delay: d })),
  rvMateHit: () => noise(0.05, 0.1, 3200),
  rvCastle: () => {
    tone({ type: "sine", from: 400, to: 1200, dur: 0.2, vol: 0.06 });
    chime(523, [1, 1.5, 2], 0.05, 0.04);
  },
  rvRookShock: () => thud(90, 0.24),
  rvGrand: () => {
    tone({ type: "sawtooth", from: 110, to: 220, dur: 0.9, vol: 0.07 });
    chime(440, [1, 1.26, 1.5, 2, 2.52], 0.05, 0.08);
  },
  rvGrandPiece: () => thud(160, 0.12),
  rvCross: () => {
    thud(60, 0.3);
    chime(523, [1, 1.5, 2, 3], 0.08, 0.02);
    noise(0.4, 0.2, 2600);
  },
};

export type RavenSfx = keyof typeof RAVEN_SOUNDS;

/** 효과가 나온 틱에 소리 · 예고가 있는 기술은 실제로 맞는 틱에 한 번 더 */
export function ravenSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  const p = run.player;
  if (p.characterId !== "chessRaven") return;
  const add = (k: RavenSfx) => void (!out.includes(k) && out.push(k));
  for (const e of run.effects) {
    const age = e.maxTicks - e.ticks;
    if (e.kind === "rvJudge" && age === 30) {
      add("rvJudgeHit");
      onShake(0.6);
    }
    if (e.kind === "rvBeam" && age === 8) add("rvBeamFire");
    if (e.kind === "rvBoardHit" && e.ticks === 16) add("rvBoardHit");
    if (age > 1) continue;
    if (e.kind === "rvBoardHit") continue;
    if (e.kind in RAVEN_SOUNDS) add(e.kind as RavenSfx);
    if (e.kind === "rvKnightLand" || e.kind === "rvRookShock" || e.kind === "rvPromo") onShake(0.35);
    else if (e.kind === "rvCross" || e.kind === "rvGrand") onShake(0.7);
  }
  // 새로 나온 기물 (폰 진군·룩 돌진)
  for (const u of p.rvUnits ?? []) {
    if (u.age !== 1) continue;
    if (u.kind === "pawn") add("rvPawn");
    else if (u.kind === "rook") add("rvRook");
  }
}
