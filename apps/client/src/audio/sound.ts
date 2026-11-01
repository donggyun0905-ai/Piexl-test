// 효과음·음악: 파일 없이 브라우저에서 바로 만든 소리 (저작권 걱정 없음). 그림처럼 나중에 직접 만든 소리로 바꿀 수 있음
import { getSettings } from "../settings";
import { ASCALON_SOUNDS } from "./sfxAscalon";
import { CORE_SOUNDS } from "./sfxCore";
import { SECRET_SOUNDS } from "./sfxSecret";
import { SKILL_SOUNDS, type SkillSfx } from "./sfxSkills";
import { GYM_SOUNDS, type GymSfx } from "./sfxGym";

export type Sfx =
  | "swing"
  | "shot"
  | "hit"
  | "kill"
  | "hurt"
  | "coin"
  | "pickup"
  | "buy"
  | "use"
  | "stairs"
  | "boss"
  | "bossDown"
  | "achievement"
  | "fall"
  | "clear"
  | "parry"
  | "guard1"
  | "guard2"
  | "guard3"
  | "crit"
  | "rifle"
  | "snipe"
  | "power"
  | "chime"
  | "awaken"
  | "slice"
  | "blink"
  | "katana"
  | "ping"
  | "sharp"
  | "tempest"
  | "string"
  | "ting"
  | "spool"
  | "clank"
  | "rumble"
  | "twang"
  | "dice"
  | "zap"
  | "descend"
  | "twinkle"
  | "rustle"
  | "kgCleave"
  | "kgPyre"
  | "kgSoul"
  | "lxBlade"
  | "lxCross"
  | "lxShard"
  | SkillSfx
  | GymSfx;

let ctx: AudioContext | null = null;
let sfxGain: GainNode | null = null;
let musicGain: GainNode | null = null;

/** 브라우저는 사람이 화면을 누른 뒤에만 소리를 낼 수 있어서, 첫 입력 때 준비 */
export function unlockAudio(): void {
  if (ctx) {
    if (ctx.state === "suspended") void ctx.resume();
    return;
  }
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  sfxGain = ctx.createGain();
  musicGain = ctx.createGain();
  // 효과음은 압축기를 거쳐 겹쳐도 깨지지 않고 묵직하게 (sfxCore)
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.ratio.value = 4;
  sfxGain.connect(comp).connect(ctx.destination);
  musicGain.connect(ctx.destination);
  applyVolume();
}

export function applyVolume(): void {
  const s = getSettings();
  if (sfxGain) sfxGain.gain.value = s.sfx * 0.5;
  if (musicGain) musicGain.gain.value = s.music * 0.25;
}

interface Tone {
  type: OscillatorType;
  from: number;
  to?: number;
  dur: number;
  vol?: number;
  delay?: number;
}

export function tone(t: Tone, out: GainNode | null = sfxGain): void {
  if (!ctx || !out) return;
  const start = ctx.currentTime + (t.delay ?? 0);
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = t.type;
  osc.frequency.setValueAtTime(t.from, start);
  if (t.to) osc.frequency.exponentialRampToValueAtTime(t.to, start + t.dur);
  g.gain.setValueAtTime(t.vol ?? 0.3, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + t.dur);
  osc.connect(g).connect(out);
  osc.start(start);
  osc.stop(start + t.dur + 0.02);
}

/** 짧은 잡음 (폭발·맞음) */
export function noise(dur: number, vol: number, freq = 1200, out: GainNode | null = sfxGain): void {
  if (!ctx || !out) return;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  // 소리용 잡음은 게임 결과와 상관없어 브라우저 랜덤을 씀
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.value = vol;
  src.connect(filter).connect(g).connect(out);
  src.start();
}

/** 치명타 연속: 이 시간(초) 안에 또 터지면 한 음씩 올라감 (장조 음계, 끝까지 가면 맨 위에서 계속 반짝임) */
const CRIT_CHAIN = 0.9;
const CRIT_SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
let critStep = -1;
let critAt = -Infinity;

/** 치명타: "챙!" 하고 터지는 쇳소리 + 맑은 울림. 연속으로 터질수록 음이 올라가고 반짝임이 더해짐 */
function critSound(): void {
  if (!ctx) return;
  const now = ctx.currentTime;
  critStep = now - critAt < CRIT_CHAIN ? Math.min(CRIT_SCALE.length - 1, critStep + 1) : 0;
  critAt = now;
  const f = 784 * 2 ** (CRIT_SCALE[critStep]! / 12);
  noise(0.06, 0.45, 7000);
  tone({ type: "square", from: f / 2, to: f, dur: 0.05, vol: 0.2 });
  tone({ type: "triangle", from: f, dur: 0.22, vol: 0.4, delay: 0.03 });
  tone({ type: "sine", from: f * 2, dur: 0.16, vol: 0.15, delay: 0.05 });
  // 3번째 연속부터 위로 반짝이는 두 음
  if (critStep >= 2) {
    tone({ type: "triangle", from: f * 1.5, dur: 0.1, vol: 0.18, delay: 0.09 });
    tone({ type: "triangle", from: f * 2, dur: 0.14, vol: 0.14, delay: 0.14 });
  }
}

const SOUNDS: Record<Sfx, () => void> = {
  crit: critSound,
  ...ASCALON_SOUNDS,
  ...SECRET_SOUNDS,
  ...SKILL_SOUNDS,
  ...CORE_SOUNDS,
  ...GYM_SOUNDS,
  blink: () => {
    tone({ type: "sine", from: 900, to: 120, dur: 0.12, vol: 0.12 });
    noise(0.1, 0.2, 1800);
    tone({ type: "triangle", from: 2400, to: 2300, dur: 0.1, vol: 0.06, delay: 0.08 });
  },
  // 받아 넘김: 맑게 울리는 "띠링!"
  parry: () => {
    tone({ type: "sine", from: 1568, dur: 0.12, vol: 0.35 });
    tone({ type: "sine", from: 2349, dur: 0.35, vol: 0.3, delay: 0.07 });
    tone({ type: "triangle", from: 3136, dur: 0.25, vol: 0.12, delay: 0.07 });
  },
  // 특수용병 보호막 성공: 팅(맑은 쇳소리) · 탕(총소리) · 펑(폭발)
  guard1: () => tone({ type: "triangle", from: 2637, to: 2400, dur: 0.12, vol: 0.35 }),
  guard2: () => {
    noise(0.08, 0.35, 5000);
    tone({ type: "square", from: 900, to: 260, dur: 0.1, vol: 0.18 });
  },
  guard3: () => {
    noise(0.35, 0.5, 700);
    tone({ type: "sine", from: 140, to: 40, dur: 0.35, vol: 0.5 });
  },
};

/** 같은 소리가 한 프레임에 여러 번 겹치지 않게 */
const lastPlayed = new Map<Sfx, number>();

export function play(name: Sfx): void {
  if (!ctx || getSettings().sfx <= 0) return;
  const now = ctx.currentTime;
  if (now - (lastPlayed.get(name) ?? -1) < 0.04) return;
  lastPlayed.set(name, now);
  SOUNDS[name]();
}

// ───────── 음악: 짧은 8마디를 반복하는 단순한 칩튠 (층이 바뀌면 음높이가 바뀜) ─────────

const BASS = [0, 0, 7, 7, 5, 5, 3, 3];
const LEAD = [12, 15, 19, 15, 17, 15, 12, 10, 12, 15, 19, 22, 19, 17, 15, 12];
let musicTimer = 0;
let musicStep = 0;
let musicRoot = 110;
let bossMode = false;
/** 다른 곡 (한정 스킨 전용 음악 등): 한 박마다 부름, 박 길이(ms). 없으면 기본 곡 */
let customBeat: { beat: (step: number, boss: boolean) => void; ms: number } | null = null;

export function setMusicBeat(b: typeof customBeat): void {
  if (b === customBeat) return;
  customBeat = b;
  if (musicTimer) {
    stopMusic();
    startMusic(0, bossMode);
  }
}

/** 효과음을 낼 수 있는지 (소리를 껐거나 아직 준비 전이면 false) */
export const sfxOn = () => !!ctx && getSettings().sfx > 0;

export function startMusic(floor: number, boss: boolean): void {
  musicRoot = 110 * (floor % 2 === 0 ? 1.122 : 1);
  bossMode = boss;
  if (musicTimer || !ctx) return;
  const custom = customBeat;
  const beat = () => {
    if (!ctx || !musicGain || getSettings().music <= 0) return;
    if (custom) {
      custom.beat(musicStep++, bossMode);
      return;
    }
    const fast = bossMode ? 0.75 : 1;
    const step = musicStep++;
    const semis = (n: number) => musicRoot * 2 ** (n / 12);
    if (step % 2 === 0) tone({ type: "triangle", from: semis(BASS[(step >> 2) % BASS.length]!), dur: 0.22 * fast, vol: 0.5 }, musicGain);
    if (step % 4 !== 3) tone({ type: "square", from: semis(LEAD[step % LEAD.length]! + (bossMode ? 1 : 0)), dur: 0.1, vol: 0.12 }, musicGain);
  };
  musicTimer = window.setInterval(beat, custom ? custom.ms : 180);
}

/** 음악 소리 줄기 (다른 곡에서 씀, 음악을 껐으면 null) */
export function musicOut(): GainNode | null {
  return getSettings().music > 0 ? musicGain : null;
}

export function setMusicBoss(boss: boolean): void {
  bossMode = boss;
}

export function stopMusic(): void {
  clearInterval(musicTimer);
  musicTimer = 0;
}
