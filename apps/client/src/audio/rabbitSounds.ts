// 래빗 효과음: 망치 쿵 · 땅울림 파동 쿵쿵 · 홈런 딱! · 맵 밖으로 날아가는 휘파람+반짝 · 토끼 뿅 · 방울 · 별사탕 · 여진
// 슈퍼 럭키: 시작 팡파르 · 슬로우 동안 나눠 맞을 때마다 점점 높아지는 다단 타격음(최대 30번) · 다 가린 뒤 휘둘러 나갈 때 쾅
import { RABBIT_HAMMER, RABBIT_ULT, type RunState } from "@pixel-rogue/shared";
import { noise, tone, type Sfx } from "./sound";

/** 지금 몇 번째 나눠 맞음인지 (다단 타격음 높이) */
let ultStep = 0;
/** 휘둘러 나가는 소리를 낸 슈퍼 럭키 (시작 틱) */
let swungAt = -1;

export const RABBIT_SOUNDS = {
  rbSlam: () => {
    tone({ type: "sine", from: 130, to: 45, dur: 0.16, vol: 0.4 });
    noise(0.1, 0.28, 700);
    tone({ type: "triangle", from: 520, to: 260, dur: 0.06, vol: 0.06 });
  },
  rbHomer: () => {
    noise(0.05, 0.5, 6000);
    tone({ type: "square", from: 1400, to: 700, dur: 0.06, vol: 0.2 });
    tone({ type: "sine", from: 90, to: 40, dur: 0.25, vol: 0.45 });
    tone({ type: "triangle", from: 900, to: 2400, dur: 0.35, vol: 0.08, delay: 0.06 });
  },
  rbFly: () => {
    tone({ type: "sine", from: 700, to: 2000, dur: 0.55, vol: 0.09 });
    tone({ type: "triangle", from: 2637, dur: 0.18, vol: 0.12, delay: 0.62 });
    tone({ type: "triangle", from: 3520, dur: 0.22, vol: 0.1, delay: 0.7 });
  },
  rbBunny: () => {
    tone({ type: "sine", from: 420, to: 1300, dur: 0.09, vol: 0.2 });
    noise(0.14, 0.3, 1600);
    tone({ type: "triangle", from: 1568, dur: 0.12, vol: 0.08, delay: 0.08 });
  },
  rbBell: () => {
    tone({ type: "sine", from: 1760, dur: 0.45, vol: 0.18 });
    tone({ type: "sine", from: 2637, dur: 0.35, vol: 0.1, delay: 0.03 });
  },
  /** 땅울림 파동이 한 칸 쿵 (작게) */
  rbStomp: () => {
    tone({ type: "sine", from: 110, to: 50, dur: 0.1, vol: 0.2 });
    noise(0.06, 0.12, 600);
  },
  rbStar: () => tone({ type: "triangle", from: 2000, to: 3200, dur: 0.07, vol: 0.08 }),
  rbAfter: () => {
    noise(0.3, 0.4, 500);
    tone({ type: "sawtooth", from: 100, to: 35, dur: 0.3, vol: 0.2 });
  },
  rbUlt: () => {
    // 슈퍼 럭키! 짧은 팡파르 (도 미 솔 도) + 휘익
    noise(0.4, 0.3, 2400);
    [523, 659, 784, 1047].forEach((f, i) => tone({ type: "square", from: f, dur: 0.1, vol: 0.12, delay: i * 0.07 }));
    tone({ type: "triangle", from: 1047, dur: 0.4, vol: 0.18, delay: 0.28 });
  },
  rbUltHit: () => {
    // 맞을 때마다 반음씩 높아지는 탁! (마지막 몇 번은 더 세게)
    const f = 330 * 2 ** (Math.min(30, ultStep) / 12);
    const last = ultStep >= RABBIT_ULT.hits - 2;
    noise(0.05, last ? 0.6 : 0.42, 4200);
    tone({ type: "square", from: f, to: f / 2, dur: 0.05, vol: last ? 0.24 : 0.16 });
    tone({ type: "triangle", from: f * 2, dur: 0.07, vol: 0.12, delay: 0.01 });
    tone({ type: "sine", from: 140, to: 60, dur: 0.07, vol: 0.25 });
  },
  rbSwing: () => {
    noise(0.45, 0.55, 900);
    tone({ type: "sine", from: 80, to: 30, dur: 0.6, vol: 0.55 });
    tone({ type: "sawtooth", from: 300, to: 1400, dur: 0.3, vol: 0.06 });
  },
};

export type RabbitSfx = keyof typeof RABBIT_SOUNDS;

const SFX: Record<string, RabbitSfx> = { rbBunny: "rbBunny", rbFly: "rbFly", rbBell: "rbBell", rbStar: "rbStar", rbAfter: "rbAfter", rbUlt: "rbUlt", rbUltHit: "rbUltHit" };

export function rabbitSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  const p = run.player;
  if (p.characterId !== "rabbit") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = e.kind === "rbSlam" ? (e.style === 1 ? "rbHomer" : "rbSlam") : SFX[e.kind];
    if (e.kind === "rbUltHit") ultStep = Math.max(ultStep, e.style ?? 0);
    if (sfx && !out.includes(sfx)) out.push(sfx);
    if (e.kind === "rbSlam") onShake(e.style === 1 ? 1.2 : 0.35);
    else if (e.kind === "rbAfter" || e.kind === "rbBunny") onShake(0.6);
    else if (e.kind === "rbUltHit") onShake(0.5);
  }
  // 땅울림 파동이 쿵 찍는 틱 (여러 갈래여도 한 번)
  if (p.rbWaves?.some((w) => w.age > 0 && w.age % RABBIT_HAMMER.waveEvery === 0) && !out.includes("rbStomp")) out.push("rbStomp");
  const u = p.rbUlt;
  if (!u) {
    ultStep = 0;
    return;
  }
  const end = RABBIT_ULT.enter + RABBIT_ULT.slow;
  const start = run.tick - u.t;
  if (u.t >= end && swungAt !== start) {
    swungAt = start;
    out.push("rbSwing");
    onShake(2);
  }
}
