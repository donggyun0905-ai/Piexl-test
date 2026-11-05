// 오르카 효과음: 새로 생긴 오르카 효과마다 (물 주먹 촥 · 소용돌이 휘익 · 물기둥 콸 · 상어 물기 · 터짐 첨벙 · 해방 준비 · 범고래 돌파 · 큰 파도 · 해방 폭풍 · 번개 대시 지직 + 흔들림)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = {
  ocSpray: "ocSplash", ocWhirl: "ocSwirl", ocGeyser: "ocGush", ocBite: "ocChomp", ocBurst: "tlSplash", ocReady: "ocCall", ocBreach: "ocCall", ocWave: "ocGush", ocFree: "tempest", ocDart: "tlChomp", ocBolt: "zap",
};

export function orcaSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "orca") return;
  for (const e of run.effects) {
    const sfx = SFX[e.kind];
    if (!sfx || e.ticks < e.maxTicks - 1 || out.includes(sfx)) continue;
    out.push(sfx);
    if (e.kind === "ocWave" || e.kind === "ocFree") onShake(6);
    else if (e.kind === "ocBolt" && e.size > 0) onShake(4);
    else if (e.kind === "ocGeyser") onShake(2);
  }
}
