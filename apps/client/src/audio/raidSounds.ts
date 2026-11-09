// 레이드 루시퍼 효과음 (2026-11-09 사용자 요청: 크고 웅장하고 길게): 새로 생긴 루시퍼 효과마다 낮은 울림 + 금속성 울림 + 합창 같은 화음 + 메아리
// 큰 기술(석화의 빔·검기·돔·변신 컷신·맵 전체 기절·보상 상자)은 화면도 흔들림 (방해되지 않게 짧게) · 같은 소리는 0.3초 안에 겹치지 않음
import { RAID_ROOM, type RunState } from "@pixel-rogue/shared";
import { noise, sfxOn, tone, type Sfx } from "./sound";

/** 소리 세기 (0 작은 견제 · 1 기본 공격 · 2 큰 기술 · 3 필살·컷신) */
const POWER: Partial<Record<string, number>> = {
  beam: 3, slash: 3, stunAll: 2, chestOpen: 3, quake: 2, domeHit: 3, swordCast: 2, swordfall: 2,
  fire: 1, mine: 1, orb: 2, crown: 1, x: 1, dark: 2, toDark: 2, fromDark: 1, flameIn: 1, rain: 1, spin: 2, sweep: 1,
  dkGaze: 3, dkLight: 3, dkLink: 3, dkHug: 3, dkGazeEnd: 3, dkLightEnd: 3, dkLinkEnd: 3, dkHugEnd: 3, dkDie: 2,
  chainx: 1, ice: 1, gold: 1, meteor: 1, hand: 1, coverBreak: 1,
};
/** 소리마다 화음 바탕음 (Hz) */
const ROOT: Partial<Record<string, number>> = { beam: 55, slash: 49, stunAll: 62, chestOpen: 98, domeHit: 41, swordCast: 58, dark: 46, orb: 52, spin: 65 };
/** 화면 흔들림 (세기 → 흔들림) */
const SHAKE = [0, 0, 2.5, 4.5];

let last = 0;
let lastCut: string | undefined;

/** 웅장한 한 번: 낮은 울림 · 금속 울림 · 화음(단조) · 잡음 굉음 · 메아리 두 번 */
function grand(root: number, power: number): void {
  const len = 0.9 + power * 0.6;
  const vol = 0.18 + power * 0.1;
  tone({ type: "sine", from: root * 1.5, to: root * 0.5, dur: len, vol: vol * 1.4 });
  tone({ type: "sawtooth", from: root * 2, to: root, dur: len * 0.8, vol: vol * 0.5 });
  noise(Math.min(2, len * 0.9), vol * 0.9, 260 + power * 120);
  if (power < 2) return;
  // 합창 같은 단조 화음 (근음 · 단3도 · 5도 · 옥타브)
  for (const [k, m] of [[0, 2], [1, 2.38], [2, 3], [3, 4]] as const) tone({ type: "triangle", from: root * m, to: root * m * 0.98, dur: len * 1.3, vol: vol * 0.32, delay: 0.05 + k * 0.04 });
  // 메아리
  for (const d of [0.32, 0.66]) tone({ type: "sine", from: root * 1.2, to: root * 0.6, dur: len * 0.7, vol: vol * (d < 0.5 ? 0.5 : 0.28), delay: d });
}

/** 매 프레임 (sfxSkills): 레이드 방 새 효과 → 소리 · 흔들림 · 컷신 시작 */
export function raidSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (!run.raidBoss || run.roomId < RAID_ROOM.boss || !sfxOn()) return;
  void out;
  const now = performance.now();
  const cut = run.raidBoss.fight?.cut;
  if (cut && cut !== lastCut) {
    grand(cut === "death" ? 41 : 46, 3);
    onShake(SHAKE[3]!);
    last = now;
  }
  lastCut = cut;
  let best = -1;
  let from = "";
  for (const e of run.effects) {
    if (e.kind !== "lucFx" || e.ticks < e.maxTicks - 1 || !e.from) continue;
    const pw = POWER[e.from] ?? -1;
    if (pw > best) [best, from] = [pw, e.from];
  }
  if (best < 0 || (now - last < 300 && best < 3)) return;
  last = now;
  grand(ROOT[from] ?? 58 + best * 4, best);
  if (SHAKE[best]) onShake(SHAKE[best]!);
}
