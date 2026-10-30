// 패왕전 귀환(R) 효과: 발밑 고리 · 위로 치솟는 하늘색 반투명 빛기둥(귀환이 찰수록 높고 짙게) · 기둥을 타고 오르는 빛 알갱이 · 남은 막대
import { allPlayers, PW_UNIT, type RunState } from "@pixel-rogue/shared";

type Ctx = CanvasRenderingContext2D;

export function drawRecall(ctx: Ctx, s: RunState): void {
  allPlayers(s).forEach((p, i) => {
    const rc = p.pwRecall;
    if (!rc) return;
    const k = 1 - Math.max(0, rc.end - s.tick) / PW_UNIT.recall;
    const h = 30 + 70 * k;
    const w = 12 + 6 * k;
    const base = p.y + 8;
    ctx.save();
    // 발밑 고리 (돌며 깜빡임)
    ctx.strokeStyle = `rgba(150, 220, 255, ${0.5 + 0.3 * Math.sin(s.tick / 4)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(p.x, base, 13, 5, 0, 0, Math.PI * 2);
    ctx.stroke();
    // 빛기둥: 아래는 짙고 위로 갈수록 옅어짐
    const g = ctx.createLinearGradient(0, base, 0, base - h);
    g.addColorStop(0, `rgba(140, 215, 255, ${0.35 + 0.3 * k})`);
    g.addColorStop(0.7, `rgba(170, 230, 255, ${0.18 + 0.15 * k})`);
    g.addColorStop(1, "rgba(200, 240, 255, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(p.x - w / 2, base - h, w, h);
    // 가운데 밝은 줄기
    const core = ctx.createLinearGradient(0, base, 0, base - h);
    core.addColorStop(0, `rgba(255, 255, 255, ${0.35 + 0.4 * k})`);
    core.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = core;
    ctx.fillRect(p.x - 2, base - h, 4, h);
    // 오르는 빛 알갱이
    for (let n = 0; n < 6; n++) {
      const t = (s.tick * 1.5 + n * 23 + i * 11) % h;
      ctx.fillStyle = n % 2 ? "rgba(255, 255, 255, 0.9)" : "rgba(160, 225, 255, 0.9)";
      ctx.fillRect(Math.round(p.x - w / 2 + ((n * 7 + i * 3) % w)), Math.round(base - t), 2, 2);
    }
    // 남은 막대
    ctx.fillStyle = "#0a0810";
    ctx.fillRect(p.x - 11, p.y + 12, 22, 4);
    ctx.fillStyle = "#8ad8ff";
    ctx.fillRect(p.x - 10, p.y + 13, Math.round(20 * k), 2);
    ctx.restore();
  });
}
