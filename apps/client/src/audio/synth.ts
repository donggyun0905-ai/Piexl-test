// 결이 있는 소리 도우미 (2026-11-13): 걸러낸 잡음(쉭·지글)·타닥타닥·종소리(FM)·떨리는 음 · 단순한 "삥" 대신 섞어서 씀
import { sfxNode } from "./sound";

let white: AudioBuffer | null = null;
/** 1초짜리 흰 잡음 (한 번 만들어 계속 씀, 소리라서 브라우저 랜덤) */
function noiseBuf(c: BaseAudioContext): AudioBuffer {
  if (white && white.sampleRate === c.sampleRate) return white;
  const b = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return (white = b);
}

export interface Hiss {
  /** 거르는 방식 · 가운데 주파수 · 끝 주파수(쓸어 감) · 날카로움(Q) */
  type?: BiquadFilterType;
  freq: number;
  to?: number;
  q?: number;
  /** 커지는 시간 (짧으면 "탁", 길면 "쏴아") */
  attack?: number;
  delay?: number;
}

/** 걸러낸 잡음: 불꽃 지글·물 쏴·바람 쉭 (주파수를 쓸어 움직임을 줌) */
export function hiss(dur: number, vol: number, h: Hiss): void {
  const n = sfxNode();
  if (!n) return;
  const { ctx, out } = n;
  const t0 = ctx.currentTime + (h.delay ?? 0);
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf(ctx);
  src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = h.type ?? "bandpass";
  f.Q.value = h.q ?? 1;
  f.frequency.setValueAtTime(h.freq, t0);
  if (h.to) f.frequency.exponentialRampToValueAtTime(h.to, t0 + dur);
  const g = ctx.createGain();
  const a = Math.min(h.attack ?? 0.005, dur / 2);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + a);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  src.connect(f).connect(g).connect(out);
  src.start(t0, Math.random() * 0.5);
  src.stop(t0 + dur + 0.02);
}

/** 타닥타닥: 짧은 딸깍을 dur 안에 count번 흩뿌림 (불꽃 튐·얼음 금·전기 지직) */
export function crackle(dur: number, count: number, vol: number, freq: number, delay = 0): void {
  for (let i = 0; i < count; i++) hiss(0.012 + Math.random() * 0.02, vol * (0.5 + Math.random() * 0.5), { type: "bandpass", freq: freq * (0.7 + Math.random() * 0.6), q: 4, attack: 0.001, delay: delay + Math.random() * dur });
}

/** 종소리 (FM): 맑은 쇠 울림 · ratio가 정수가 아니면 얼음·유리처럼 차가움 */
export function bell(freq: number, dur: number, vol: number, ratio = 1.4, depth = 2, delay = 0): void {
  const n = sfxNode();
  if (!n) return;
  const { ctx, out } = n;
  const t0 = ctx.currentTime + delay;
  const car = ctx.createOscillator();
  const mod = ctx.createOscillator();
  const mg = ctx.createGain();
  const g = ctx.createGain();
  car.frequency.value = freq;
  mod.frequency.value = freq * ratio;
  mg.gain.setValueAtTime(freq * depth, t0);
  mg.gain.exponentialRampToValueAtTime(freq * 0.05, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.003);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  mod.connect(mg).connect(car.frequency);
  car.connect(g).connect(out);
  for (const o of [car, mod]) {
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }
}

/** 떨리는 음 (비브라토): 저주 웅웅·유령·느려짐 · rate = 1초에 떨림 수, depth = 떨림 폭(Hz) */
export function wobble(type: OscillatorType, from: number, to: number, dur: number, vol: number, rate: number, depth: number, delay = 0): void {
  const n = sfxNode();
  if (!n) return;
  const { ctx, out } = n;
  const t0 = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  const lfo = ctx.createOscillator();
  const lg = ctx.createGain();
  const g = ctx.createGain();
  const soft = ctx.createBiquadFilter();
  soft.type = "lowpass";
  soft.frequency.value = Math.max(from, to) * 4;
  o.type = type;
  o.frequency.setValueAtTime(from, t0);
  o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  lfo.frequency.value = rate;
  lg.gain.value = depth;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + Math.min(0.04, dur / 3));
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  lfo.connect(lg).connect(o.frequency);
  o.connect(soft).connect(g).connect(out);
  for (const x of [o, lfo]) {
    x.start(t0);
    x.stop(t0 + dur + 0.02);
  }
}
