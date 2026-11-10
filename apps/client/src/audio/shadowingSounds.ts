// 쉐도잉 효과음: 봉인(닫힌 원) · 일필 베기 · 패시브 기술 터짐(큰 것은 흔들림: 두루마리 용·달·유성·불기둥)
import { SD_ROW, type RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const BIG = new Set<number>([SD_ROW.scroll, SD_ROW.moon, SD_ROW.meteor, SD_ROW.flame]);

export function shadowingSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "shadowing") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    let sfx: Sfx | undefined;
    if (e.kind === "sdSeal") sfx = "chime";
    else if (e.kind === "sdSlash") sfx = "katana";
    else if (e.kind === "sdBurst") sfx = BIG.has(e.style ?? -1) ? "power" : "blink";
    if (sfx && !out.includes(sfx)) out.push(sfx);
    if (e.kind === "sdBurst" && BIG.has(e.style ?? -1)) onShake(0.8);
  }
}
