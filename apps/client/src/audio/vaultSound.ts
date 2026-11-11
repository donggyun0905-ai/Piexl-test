// 비밀의 방 소리: 벽 무너짐(돌 구르는 굉음) · 악마 거래(낮은 울림 + 비명 같은 미끄럼)·거절 · 절규(짧은 파열) · 야바위 섞기(탁탁)·당첨(금화 쏟아짐)·꽝(낮은 부웅)
// · 경매 입찰(띠링)·낙찰(망치 쾅 + 종)·돈 날림(바스락) · 방 곡: 악마(어두운 오르간) · 도박꾼(흥겨운 스윙) · 경매장(점잖은 왈츠)
import { GAMBLE, gambleNow, gambleTrick, type RunState } from "@pixel-rogue/shared";
import { beatOf, type Song } from "./altarSound";
import { noise, tone } from "./sound";

export const VAULT_SOUNDS = {
  vaultCrumble: () => {
    noise(0.9, 0.45, 600);
    tone({ type: "sine", from: 70, to: 30, dur: 0.8, vol: 0.5 });
    for (let i = 0; i < 5; i++) tone({ type: "square", from: 140 - i * 15, to: 60, dur: 0.08, vol: 0.06, delay: 0.1 + i * 0.09 });
  },
  vaultDeal: () => {
    tone({ type: "sine", from: 55, to: 35, dur: 1.4, vol: 0.5 });
    tone({ type: "sawtooth", from: 880, to: 220, dur: 0.9, vol: 0.05, delay: 0.1 });
    noise(1, 0.12, 900);
  },
  vaultRefuse: () => tone({ type: "square", from: 160, to: 110, dur: 0.25, vol: 0.1 }),
  vaultScream: () => {
    tone({ type: "sawtooth", from: 700, to: 300, dur: 0.12, vol: 0.04 });
    noise(0.08, 0.05, 3000);
  },
  vaultShuffle: () => {
    noise(0.04, 0.12, 2500);
    tone({ type: "square", from: 300, to: 240, dur: 0.04, vol: 0.04 });
  },
  vaultWin: () => {
    for (const [i, f] of [523, 659, 784, 1047, 1319].entries()) tone({ type: "triangle", from: f, dur: 0.5, vol: 0.09, delay: i * 0.07 });
    for (let i = 0; i < 12; i++) tone({ type: "square", from: 2000 + (i % 4) * 300, dur: 0.04, vol: 0.03, delay: 0.3 + i * 0.05 });
  },
  vaultLose: () => {
    tone({ type: "sawtooth", from: 220, to: 70, dur: 0.9, vol: 0.12 });
    tone({ type: "sine", from: 90, to: 50, dur: 1, vol: 0.3 });
  },
  vaultBid: () => {
    tone({ type: "sine", from: 1760, dur: 0.5, vol: 0.12 });
    tone({ type: "sine", from: 2637, dur: 0.4, vol: 0.06, delay: 0.02 });
  },
  vaultSold: () => {
    noise(0.12, 0.4, 400);
    tone({ type: "sine", from: 120, to: 60, dur: 0.3, vol: 0.45 });
    for (const [i, f] of [784, 1047, 1568].entries()) tone({ type: "triangle", from: f, dur: 0.8, vol: 0.07, delay: 0.15 + i * 0.1 });
  },
  vaultMoney: () => {
    noise(0.45, 0.07, 4500);
    for (let i = 0; i < 6; i++) tone({ type: "square", from: 2400 + (i % 3) * 400, dur: 0.03, vol: 0.03, delay: i * 0.07 });
  },
  // 야바위 방해: 연막 · 카드 뿌리기 · 금화 폭죽
  vaultSmoke: () => noise(0.7, 0.3, 400),
  vaultCards: () => {
    noise(0.4, 0.14, 3000);
    for (let i = 0; i < 6; i++) tone({ type: "square", from: 900, to: 500, dur: 0.03, vol: 0.05, delay: i * 0.06 });
  },
  vaultCoins: () => {
    for (let i = 0; i < 6; i++) tone({ type: "square", from: 1400 + i * 180, to: 1900 + i * 180, dur: 0.07, vol: 0.09, delay: i * 0.05 });
  },
};
export type VaultSfx = keyof typeof VAULT_SOUNDS;

const SONGS: Record<"devil" | "gamble" | "auction", Song> = {
  devil: { ms: 260, root: 65.4, scale: [0, 1, 3, 5, 6, 8, 10], melody: [7, -1, 8, -1, 7, -1, 4, -1, 7, -1, 11, 10, 8, -1, 7, -1], lead: "sawtooth", drums: [0, 10], pad: "sawtooth", detune: 0.02 },
  gamble: { ms: 125, root: 130.8, scale: [0, 2, 3, 5, 7, 9, 10], melody: [7, -1, 9, 10, -1, 9, 7, 5, 7, -1, 4, 5, 7, -1, 9, -1], lead: "square", drums: [0, 3, 8, 11], pad: "triangle" },
  auction: { ms: 175, root: 116.5, scale: [0, 2, 4, 5, 7, 9, 11], melody: [7, 9, 11, 14, -1, 11, 9, -1, 7, 9, 11, 9, -1, 7, 4, -1], lead: "triangle", drums: [0, 6, 12], pad: "sine" },
};
const BEATS = Object.fromEntries(Object.entries(SONGS).map(([id, song]) => [id, { beat: beatOf(song), ms: song.ms }])) as Record<keyof typeof SONGS, { beat: (step: number) => void; ms: number }>;
/** 비밀의 방 곡 (audio/roomMusic이 켜고 끔) */
export const vaultMusic = (type: string) => BEATS[type as keyof typeof SONGS] ?? null;

/** 소리 낼 것 (audio/runSounds가 틱마다 비교): 이번 틱에 새로 생긴 효과 · 야바위 섞은 횟수 · 야바위 방해 (몇 번째 × 3 + 종류, 없으면 -1) */
export interface VaultSeen {
  fx: string;
  cups: number;
  trick: number;
}
export function vaultSeen(s: RunState): VaultSeen {
  const g = gambleNow(s);
  const tr = g ? gambleTrick(g, s.tick) : null;
  return {
    trick: tr ? tr.n * 3 + tr.kind : -1,
    fx: [...new Set(s.effects.filter((f) => f.kind.startsWith("sr") && f.ticks >= f.maxTicks - 1).map((f) => f.kind))].join(","),
    cups: g && g.pick === undefined ? Math.min(GAMBLE.swaps, Math.floor((s.tick - (g.at ?? 0) - GAMBLE.show) / GAMBLE.swapTicks)) : -1,
  };
}
const CUES = [["srCrumble", "vaultCrumble"], ["srDeal", "vaultDeal"], ["srRefuse", "vaultRefuse"], ["srScream", "vaultScream"], ["srWin", "vaultWin"], ["srLose", "vaultLose"], ["srBid", "vaultBid"], ["srSold", "vaultSold"], ["srMoney", "vaultMoney"]] as const;
/** 벽 무너짐·거래·절규·야바위·경매 소리 · 상자를 섞을 때마다 탁 */
export function vaultCues(now: VaultSeen, seen: VaultSeen | undefined): VaultSfx[] {
  const out: VaultSfx[] = CUES.filter(([k]) => now.fx.includes(k)).map(([, sfx]) => sfx);
  if (now.cups >= 0 && now.cups !== seen?.cups && now.cups < GAMBLE.swaps) out.push("vaultShuffle");
  if (now.trick >= 0 && now.trick !== seen?.trick) out.push((["vaultSmoke", "vaultCards", "vaultCoins"] as const)[now.trick % 3]!);
  return out;
}
