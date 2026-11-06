// 베아트리스 효과음: 새로 생긴 베아트리스 효과마다 (쌍검 휘두름 · X자·처단 터짐 · 태양 검날·자애 울림 · 심판 + 흔들림)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = {
  btSlash: "btSwing", btTwin: "btSwing", btCross: "btBurst", btExec: "btBurst", btFlare: "btBurst", btBrand: "mrShing",
  btSolar: "wvSparkle", btGrace: "chime", btJudgeWarn: "wvDeep", btJudge: "btJudge",
};
/** 화면이 흔들리는 큰 기술 */
const SHAKE: Partial<Record<string, number>> = { btJudge: 8, btCross: 1, btExec: 1 };

export function beatriceSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "beatrice") return;
  for (const e of run.effects) {
    const sfx = SFX[e.kind];
    if (!sfx || e.ticks < e.maxTicks - 1 || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
