// 패왕전 스킬 칸에 보일 값 (gameLoop가 틱마다 만듦): 남은 대기(5% 단위) · 남은 초 · 조준 중 · 침묵
import { kitOf, type RunState } from "@pixel-rogue/shared";
import type { PwSkillView } from "./PwSkillBar";

export function pwSkillView(run: RunState, armed: number): PwSkillView | undefined {
  const p = run.player;
  const kit = kitOf(p.characterId);
  if (!kit) return undefined;
  const cd = (k: number) => p.pwCd?.[k] ?? 0;
  return {
    chr: p.characterId,
    cds: kit.skills.map((d, k) => Math.ceil((cd(k) / (d.cd * 60)) * 20) / 20),
    left: kit.skills.map((_, k) => Math.ceil(cd(k) / 60)),
    armed,
    silenced: (run.pvp?.seats[run.seat ?? 0]?.silence ?? 0) > 0,
  };
}
