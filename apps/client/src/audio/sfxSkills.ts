// 패왕전 스킬 효과음 (sound의 효과음 표에 합쳐짐): 스킬 그림 모양마다 하나 · 예고 · 궁극기 외침
import type { RunState } from "@pixel-rogue/shared";
import { noise, tone, type Sfx } from "./sound";
import { fenrirSounds } from "./fenrirSounds";
import { eclipseSounds } from "./eclipseSounds";
import { thorkenSounds } from "./thorkenSounds";
import { leviaSounds } from "./leviaSounds";
import { tailSounds } from "./tailSounds";
import { madQueenSounds } from "./madQueenSounds";
import { hookSounds } from "./hookSounds";

export const SKILL_SOUNDS = {
  // 터짐: 낮은 펑 · 떨어지는 운석: 쿵 + 우르르
  pwBurst: () => {
    noise(0.18, 0.4, 900);
    tone({ type: "square", from: 160, to: 50, dur: 0.18, vol: 0.18 });
  },
  pwMeteor: () => {
    noise(0.5, 0.6, 500);
    tone({ type: "sawtooth", from: 110, to: 30, dur: 0.5, vol: 0.3 });
  },
  // 기둥(번개·빛): 지직 + 맑은 음 · 비(화살·운석 비): 짧은 쉭 여러 번
  pwPillar: () => {
    noise(0.1, 0.35, 5000);
    tone({ type: "triangle", from: 1400, to: 700, dur: 0.2, vol: 0.1 });
  },
  pwRain: () => {
    noise(0.2, 0.18, 2600);
    for (let i = 0; i < 3; i++) tone({ type: "triangle", from: 1800, to: 900, dur: 0.04, vol: 0.04, delay: i * 0.06 });
  },
  // 빔: 위로 올라가는 윙 · 파도(부채꼴): 쏴아 · 베기: 날카로운 쉭
  pwBeam: () => tone({ type: "sawtooth", from: 300, to: 1200, dur: 0.22, vol: 0.1 }),
  pwWave: () => noise(0.3, 0.3, 1500),
  pwSlash: () => {
    noise(0.08, 0.3, 4500);
    tone({ type: "triangle", from: 2200, to: 1600, dur: 0.07, vol: 0.06 });
  },
  pwSpin: () => {
    noise(0.22, 0.25, 3600);
    tone({ type: "triangle", from: 500, to: 900, dur: 0.2, vol: 0.05 });
  },
  // 돌진: 바람 · 순간이동: 빨려 드는 소리
  pwDash: () => noise(0.2, 0.28, 1200),
  // 고래 울음 (리바이어): 낮게 올라갔다 내려오는 긴 노래 + 물보라
  lvWhale: () => {
    noise(0.35, 0.22, 900);
    tone({ type: "sine", from: 170, to: 340, dur: 0.35, vol: 0.16 });
    tone({ type: "sine", from: 340, to: 190, dur: 0.45, vol: 0.13, delay: 0.3 });
  },
  // 물 상어 (테일): 첨벙 솟구치는 물보라 + 쏴아 · 씹기: 짧고 단단한 콱 두 번
  tlSplash: () => {
    noise(0.28, 0.24, 1600);
    tone({ type: "triangle", from: 620, to: 180, dur: 0.18, vol: 0.12 });
  },
  tlChomp: () => {
    noise(0.06, 0.3, 500);
    tone({ type: "square", from: 220, to: 70, dur: 0.08, vol: 0.14 });
    tone({ type: "square", from: 260, to: 80, dur: 0.08, vol: 0.12, delay: 0.09 });
  },
  // 매드퀸: 미래형 대포 (짧은 전자음 + 낮은 쾅) · 날개 레이저 (높게 쓸어내림) · 전탄 일제사격 (길게 울리는 포격 소리)
  // 훅: 더블배럴 산탄총 (탁한 쾅 두 겹) · 갈고리 걸림 (높은 철컥)
  hkShotgun: () => {
    noise(0.22, 0.5, 900);
    tone({ type: "square", from: 140, to: 40, dur: 0.2, vol: 0.2 });
    tone({ type: "sawtooth", from: 400, to: 90, dur: 0.1, vol: 0.1, delay: 0.04 });
  },
  hkClank: () => {
    tone({ type: "square", from: 1400, to: 900, dur: 0.05, vol: 0.08 });
    tone({ type: "triangle", from: 700, to: 500, dur: 0.08, vol: 0.08, delay: 0.04 });
  },
  mqCannon: () => {
    noise(0.12, 0.28, 1200);
    tone({ type: "square", from: 900, to: 300, dur: 0.06, vol: 0.08 });
    tone({ type: "sine", from: 180, to: 50, dur: 0.18, vol: 0.2 });
  },
  mqLaser: () => {
    tone({ type: "sawtooth", from: 1800, to: 700, dur: 0.12, vol: 0.06 });
  },
  mqSalvo: () => {
    tone({ type: "square", from: 300, to: 900, dur: 0.3, vol: 0.1 });
    noise(0.9, 0.35, 700);
    tone({ type: "sine", from: 120, to: 35, dur: 0.8, vol: 0.25, delay: 0.3 });
  },
  pwBlink: () => {
    tone({ type: "sine", from: 1200, to: 200, dur: 0.14, vol: 0.12 });
    tone({ type: "sine", from: 300, to: 1500, dur: 0.12, vol: 0.08, delay: 0.1 });
  },
  // 오라·버프: 오르는 화음 · 회복: 맑은 두 음 · 소환: 퐁 · 장판·그물: 웅웅
  pwAura: () => {
    for (const [i, f] of [392, 523, 659].entries()) tone({ type: "triangle", from: f, to: f, dur: 0.25, vol: 0.06, delay: i * 0.05 });
  },
  pwHeal: () => {
    tone({ type: "sine", from: 880, to: 880, dur: 0.18, vol: 0.09 });
    tone({ type: "sine", from: 1320, to: 1320, dur: 0.25, vol: 0.08, delay: 0.1 });
  },
  pwSummon: () => {
    tone({ type: "square", from: 300, to: 900, dur: 0.1, vol: 0.08 });
    noise(0.15, 0.2, 1800);
  },
  pwField: () => tone({ type: "sine", from: 140, to: 120, dur: 0.3, vol: 0.12 }),
  pwNet: () => {
    tone({ type: "triangle", from: 600, to: 300, dur: 0.12, vol: 0.08 });
    noise(0.08, 0.15, 2000);
  },
  // 예고 (곧 터짐): 짧게 높은 삐
  pwWarn: () => tone({ type: "square", from: 1500, to: 1500, dur: 0.05, vol: 0.05 }),
  // 궁극기: 낮은 북 + 오르는 금관 화음
  pwUlt: () => {
    noise(0.4, 0.5, 700);
    tone({ type: "sawtooth", from: 80, to: 40, dur: 0.5, vol: 0.3 });
    for (const [i, f] of [262, 330, 392, 523].entries()) tone({ type: "sawtooth", from: f, to: f, dur: 0.45, vol: 0.06, delay: 0.08 + i * 0.07 });
  },
};

export type SkillSfx = keyof typeof SKILL_SOUNDS;

/** 스킬 그림 모양(PW_FX_STYLES 순서) → 소리 */
export const SKILL_SFX_BY_STYLE: readonly SkillSfx[] = ["pwBurst", "pwMeteor", "pwPillar", "pwRain", "pwBeam", "pwWave", "pwSlash", "pwSpin", "pwDash", "pwBlink", "pwAura", "pwField", "pwHeal", "pwNet", "pwSummon"];

const ultAt = new Map<number, number>();

/** 이번 프레임에 새로 생긴 스킬 그림 → 소리 (내 둘레만) · 궁극기는 어디서든 외침 + 가까우면 화면 흔들림 */
export function skillSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  fenrirSounds(run, out, onShake);
  eclipseSounds(run, out, onShake);
  thorkenSounds(run, out, onShake);
  leviaSounds(run, out, onShake);
  tailSounds(run, out, onShake);
  madQueenSounds(run, out, onShake);
  hookSounds(run, out, onShake);
  if (!run.pvp) return;
  const me = run.player;
  for (const e of run.effects) {
    if ((e.kind !== "pwFx" && e.kind !== "pwWarn") || e.ticks < e.maxTicks - 1) continue;
    const near = (e.x - me.x) ** 2 + (e.y - me.y) ** 2 < 260 ** 2;
    // 궁극기 외침은 쓴 사람마다 2초에 한 번 (예고·여러 번 터지는 것은 한 번만)
    const last = ultAt.get(e.seat ?? 0) ?? -999;
    if (e.ult && (run.tick < last || run.tick - last > 120)) {
      ultAt.set(e.seat ?? 0, run.tick);
      if (!out.includes("pwUlt")) out.push("pwUlt");
      if (near) onShake(5);
    }
    if (!near) continue;
    const sfx = e.kind === "pwWarn" ? "pwWarn" : SKILL_SFX_BY_STYLE[e.style ?? 0];
    if (sfx && !out.includes(sfx)) out.push(sfx);
  }
}
