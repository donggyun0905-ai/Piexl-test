// 리바이어 효과음: 새로 생긴 리바이어 효과마다 (창 휘두르기 쉭 · 회전 · 고래 울음 · 대돌격 물보라 · 충격파 쿵 + 흔들림 · 고래 도약 · 번개)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = { lvSwing: "pwSlash", lvThrust: "pwSlash", lvTailSweep: "lvWhale", lvSpin: "pwSpin", lvFin: "lvWhale", lvOrbit: "lvWhale", lvCharge: "pwWave", lvQuake: "pwBurst", lvBreach: "pwMeteor", lvBolt: "zap", lvSong: "chime", lvGush: "pwWave", lvBurst: "pwBurst" };

export function leviaSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  const p = run.player;
  if (p.characterId !== "levia") return;
  for (const e of run.effects) {
    const sfx = SFX[e.kind];
    if (!sfx || e.ticks < e.maxTicks - 1 || out.includes(sfx)) continue;
    out.push(sfx);
    if (e.kind === "lvQuake") onShake(3);
    else if (e.kind === "lvBreach") onShake(7);
    else if (e.kind === "lvOrbit" || e.kind === "lvFin") onShake(2);
  }
  // 3타 돌진에 고래가 같이 나오면 고래 울음
  if (p.lvRush === 2 && p.s2Rush && p.s2Rush.t === 8 && !out.includes("lvWhale")) out.push("lvWhale");
}
