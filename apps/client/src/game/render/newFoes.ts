// 시즌 3 새 몬스터 표시 (sim/newFoes, 몸 그림은 보통 몬스터 그림): 폭발풍뎅이 터질 범위(점점 빨리 깜빡임) · 스켈레톤 궁병 조준선(따라오는 얇은 선) · 하이오크 분노 기운
// 쇠사슬 간수 사슬 길은 위험 표시(render/bossFx, from "chainward")
// 궁병 선이 굳어 깜빡이는 것은 위험 표시(render/bossFx, from "skelarcher")
import { archerAim, bugFuse, NEW_FOES_RULES as R, orcRage, type EnemyState, type RunState } from "@pixel-rogue/shared";

type Ctx = CanvasRenderingContext2D;

/** 몸 그림 아래에 (actors) */
export function drawNewFoeMark(ctx: Ctx, s: RunState, e: EnemyState, x: number, y: number): void {
  const fuse = bugFuse(e);
  if (fuse !== undefined) {
    // 남은 시간이 줄수록 빨리 깜빡이고 진해짐
    const gap = Math.max(2, Math.round(3 + fuse * 9));
    const on = Math.floor(s.tick / gap) % 2 === 0;
    ctx.fillStyle = `rgba(255, 90, 40, ${0.1 + 0.25 * (1 - fuse)})`;
    ctx.beginPath();
    ctx.arc(x, y, R.BUG_BLAST_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = on ? "rgba(255, 220, 120, 0.95)" : "rgba(255, 70, 40, 0.8)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    if (on) {
      ctx.fillStyle = "#fff2a0";
      ctx.fillRect(Math.round(x) - 1, Math.round(y - e.r - 4), 2, 2);
    }
  }
  const rage = orcRage(e);
  if (rage > 0.05) {
    // 하이오크 분노: 체력이 적을수록 붉은 기운이 커지고 일렁임
    ctx.fillStyle = `rgba(255, 40, 30, ${0.12 + 0.3 * rage + 0.06 * Math.sin(s.tick / 5)})`;
    ctx.beginPath();
    ctx.arc(x, y, e.r + 2 + 4 * rage, 0, Math.PI * 2);
    ctx.fill();
  }
  if (archerAim(e) === 0) {
    // 겨누는 중: 나를 따라오는 얇은 붉은 선
    ctx.strokeStyle = "rgba(255, 80, 80, 0.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + e.dirX * R.ARCH_LEN, y + e.dirY * R.ARCH_LEN);
    ctx.stroke();
  }
}
