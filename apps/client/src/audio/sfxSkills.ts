// 패왕전 스킬 효과음 (sound의 효과음 표에 합쳐짐): 스킬 그림 모양마다 하나 · 예고 · 궁극기 외침
import type { RunState } from "@pixel-rogue/shared";
import { noise, tone, type Sfx } from "./sound";
import { fenrirSounds } from "./fenrirSounds";
import { raidSounds } from "./raidSounds";
import { eclipseSounds } from "./eclipseSounds";
import { thorkenSounds } from "./thorkenSounds";
import { leviaSounds } from "./leviaSounds";
import { tailSounds } from "./tailSounds";
import { madQueenSounds } from "./madQueenSounds";
import { hookSounds } from "./hookSounds";
import { orcaSounds } from "./orcaSounds";
import { waveSounds } from "./waveSounds";
import { miryuSounds } from "./miryuSounds";
import { beatriceSounds } from "./beatriceSounds";
import { ianSounds } from "./ianSounds";
import { gabrielSounds } from "./gabrielSounds";
import { serenaSounds } from "./serenaSounds";
import { rafaelSounds } from "./rafaelSounds";
import { yurielSounds } from "./yurielSounds";
import { michaelaSounds } from "./michaelaSounds";
import { blastSounds } from "./blastSounds";
import { nailerSounds } from "./nailerSounds";
import { scissorsSounds } from "./scissorsSounds";
import { hellfistSounds } from "./hellfistSounds";
import { silverBulletSounds } from "./silverBulletSounds";
import { blueFlameSounds } from "./blueFlameSounds";
import { lunaticSounds } from "./lunaticSounds";
import { incisionSounds } from "./incisionSounds";
import { crusaderSounds } from "./crusaderSounds";
import { jokerSounds } from "./jokerSounds";
import { shadowingSounds } from "./shadowingSounds";
import { factionSounds } from "./factionSounds";

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
  // 오르카: 물보라 촥 · 소용돌이 휘익 · 물기둥·큰 파도 콸 · 상어 물기 딱 · 해방 고래 울음
  // 미류: 물을 가르는 쏴아 · 칼 챙 + 물 · 해룡이 깨어나는 깊은 울림
  mrSwish: () => {
    noise(0.16, 0.16, 2600);
    tone({ type: "sine", from: 700, to: 300, dur: 0.12, vol: 0.05 });
  },
  mrShing: () => {
    tone({ type: "triangle", from: 2400, to: 1800, dur: 0.18, vol: 0.06 });
    tone({ type: "sine", from: 3200, to: 3000, dur: 0.25, vol: 0.03, delay: 0.02 });
    noise(0.22, 0.14, 1800);
  },
  // 베아트리스: 쌍검 칼바람 · 불꽃 터짐 · 심판의 태양 검격 (깊은 울림 + 높은 쇳소리)
  btSwing: () => {
    noise(0.12, 0.18, 3200);
    tone({ type: "triangle", from: 1800, to: 900, dur: 0.1, vol: 0.05 });
  },
  btBurst: () => {
    noise(0.3, 0.3, 1100);
    tone({ type: "sawtooth", from: 320, to: 120, dur: 0.25, vol: 0.06 });
  },
  btJudge: () => {
    tone({ type: "sawtooth", from: 90, to: 60, dur: 0.9, vol: 0.08 });
    tone({ type: "triangle", from: 2600, to: 1400, dur: 0.6, vol: 0.06, delay: 0.05 });
    noise(1, 0.35, 700);
  },
  // 이안: 펜 찌르기(가늘고 높은 쇳소리) · 실 휘감기(바람 가르는 소리) · 인과율 속박(낮은 종 + 실 떨림)
  // 가브리엘: 대지 강타(낮게 쿵 + 돌 부서짐) · 중력 붕괴(빨려 드는 낮은 소리) · 불멸의 성벽(큰 종 + 울림)
  gbQuake: () => {
    tone({ type: "sine", from: 120, to: 40, dur: 0.35, vol: 0.2 });
    noise(0.25, 0.22, 700);
  },
  gbGrav: () => {
    tone({ type: "sawtooth", from: 220, to: 60, dur: 0.4, vol: 0.06 });
    noise(0.3, 0.1, 500);
  },
  gbBell: () => {
    tone({ type: "sine", from: 98, to: 96, dur: 1.4, vol: 0.12 });
    tone({ type: "triangle", from: 1320, to: 1300, dur: 1, vol: 0.05, delay: 0.05 });
    noise(0.4, 0.2, 600);
  },
  iaStab: () => {
    tone({ type: "triangle", from: 2600, to: 1900, dur: 0.06, vol: 0.04 });
    noise(0.05, 0.08, 5200);
  },
  iaLash: () => {
    noise(0.18, 0.14, 2200);
    tone({ type: "sine", from: 700, to: 1300, dur: 0.15, vol: 0.04 });
  },
  iaLaw: () => {
    tone({ type: "sine", from: 110, to: 108, dur: 1.1, vol: 0.08 });
    tone({ type: "triangle", from: 1760, to: 1720, dur: 0.8, vol: 0.04, delay: 0.08 });
    noise(0.6, 0.12, 900);
  },
  mrRoar: () => {
    tone({ type: "sawtooth", from: 110, to: 220, dur: 0.5, vol: 0.06 });
    tone({ type: "sine", from: 220, to: 660, dur: 0.6, vol: 0.06, delay: 0.1 });
    noise(0.7, 0.22, 900);
  },
  // 웨이브: 상상이 물이 되는 반짝 · 거품 퐁 · 맑은 물방울 똑 · 깊은 물 울림
  wvSparkle: () => {
    for (let i = 0; i < 3; i++) tone({ type: "sine", from: 1300 + i * 400, to: 1800 + i * 400, dur: 0.08, vol: 0.05, delay: i * 0.05 });
    noise(0.12, 0.08, 4200);
  },
  wvPop: () => {
    tone({ type: "sine", from: 500, to: 1400, dur: 0.06, vol: 0.1 });
    noise(0.04, 0.12, 3200);
  },
  wvPlip: () => tone({ type: "sine", from: 1600, to: 700, dur: 0.07, vol: 0.06 }),
  wvDeep: () => {
    noise(0.6, 0.35, 420);
    tone({ type: "sine", from: 90, to: 45, dur: 0.6, vol: 0.2 });
    tone({ type: "sine", from: 300, to: 520, dur: 0.4, vol: 0.05, delay: 0.1 });
  },
  ocSplash: () => {
    noise(0.12, 0.25, 2600);
    tone({ type: "sine", from: 900, to: 300, dur: 0.1, vol: 0.08 });
  },
  ocSwirl: () => {
    noise(0.25, 0.18, 1400);
    tone({ type: "sine", from: 300, to: 700, dur: 0.22, vol: 0.07 });
  },
  ocGush: () => {
    noise(0.4, 0.4, 700);
    tone({ type: "sine", from: 120, to: 60, dur: 0.35, vol: 0.18 });
  },
  ocChomp: () => {
    tone({ type: "square", from: 500, to: 120, dur: 0.06, vol: 0.12 });
    noise(0.05, 0.2, 3000);
  },
  ocCall: () => {
    tone({ type: "sine", from: 400, to: 900, dur: 0.3, vol: 0.1 });
    tone({ type: "sine", from: 900, to: 600, dur: 0.35, vol: 0.08, delay: 0.25 });
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
  raidSounds(run, out, onShake);
  eclipseSounds(run, out, onShake);
  thorkenSounds(run, out, onShake);
  leviaSounds(run, out, onShake);
  tailSounds(run, out, onShake);
  madQueenSounds(run, out, onShake);
  hookSounds(run, out, onShake);
  orcaSounds(run, out, onShake);
  waveSounds(run, out, onShake);
  miryuSounds(run, out, onShake);
  beatriceSounds(run, out, onShake);
  ianSounds(run, out, onShake);
  gabrielSounds(run, out, onShake);
  serenaSounds(run, out, onShake);
  rafaelSounds(run, out, onShake);
  yurielSounds(run, out, onShake);
  michaelaSounds(run, out, onShake);
  blastSounds(run, out, onShake);
  nailerSounds(run, out, onShake);
  scissorsSounds(run, out, onShake);
  hellfistSounds(run, out, onShake);
  silverBulletSounds(run, out, onShake);
  blueFlameSounds(run, out, onShake);
  lunaticSounds(run, out, onShake);
  incisionSounds(run, out, onShake);
  crusaderSounds(run, out, onShake);
  jokerSounds(run, out, onShake);
  shadowingSounds(run, out, onShake);
  factionSounds(run, out, onShake);
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
