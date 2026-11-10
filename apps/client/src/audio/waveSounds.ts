// 웨이브 효과음: 새로 생긴 웨이브 효과마다 (기술 반짝 · 물보라 · 거품 퐁 · 물기둥 콸 · 손뼉 · 해일 울림 + 흔들림)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = {
  wvCast: "wvSparkle", wvCrest: "wvPlip", wvSplash: "tlSplash", wvFlyPop: "wvPop", wvPierce: "pwBeam", wvArmorPop: "tlSplash", wvPour: "ocGush",
  wvBreach: "wvDeep", wvBubblePop: "wvPop", wvZap: "zap", wvBloom: "chime", wvSurfEnd: "ocGush", wvFloodWave: "pwWave", wvRopeCrash: "pwBurst",
  wvBalloonPop: "tlSplash", wvPearlBounce: "wvPlip", wvClap: "pwBurst", wvLob: "wvPlip", wvSkipRing: "wvPlip", wvNote: "chime", wvErase: "wvPop",
  wvSlam: "ocSplash", wvFeather: "ocSwirl", wvCrush: "wvDeep", wvSpike: "wvPlip", wvTsunamiHit: "ocGush",
};
/** 화면이 흔들리는 큰 기술 */
const SHAKE: Partial<Record<string, number>> = { wvBreach: 5, wvCrush: 5, wvClap: 4, wvRopeCrash: 4, wvFloodWave: 2, wvTsunamiHit: 2 };

export function waveSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "wave") return;
  for (const e of run.effects) {
    const sfx = SFX[e.kind];
    if (!sfx || e.ticks < e.maxTicks - 1 || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
