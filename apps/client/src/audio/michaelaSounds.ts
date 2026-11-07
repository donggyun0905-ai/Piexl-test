// 미카엘라 효과음: 새로 생긴 미카엘라 효과마다 (무기 기술(내려찍기·땅 가르기는 무겁게 + 흔들림) · 투척 · 폭발 · 포탈 · 바꿔 듦 · 순간 이동 · 무기고 + 흔들림)
import { MC_MOVE_IDS, type RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = {
  mcMoveFx: "pwSlash", mcThrowFx: "pwDash", mcBlastFx: "gbQuake", mcPortalFx: "gbGrav", mcSwapFx: "chime", mcBlinkFx: "pwDash", mcUltFx: "gbBell", mcBoltFx: "iaStab",
};
/** 화면이 흔들리는 큰 기술 */
const SHAKE: Partial<Record<string, number>> = { mcBlastFx: 1, mcUltFx: 3 };

export function michaelaSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "michaela") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    // 무기 기술: 내려찍기·땅 가르기·꿰뚫는 빛 창은 무거운 소리와 흔들림
    const heavy = e.kind === "mcMoveFx" && ["slam", "quake", "pierce"].includes(MC_MOVE_IDS[Math.floor((e.style ?? 0) / 64)] ?? "");
    if (heavy && !out.includes("gbQuake")) {
      out.push("gbQuake");
      onShake(2);
      continue;
    }
    const sfx = SFX[e.kind];
    if (!sfx || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
