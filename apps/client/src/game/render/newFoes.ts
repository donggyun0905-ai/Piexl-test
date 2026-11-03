// 시즌 3 새 몬스터 표시 (sim/newFoes, 몸 그림은 보통 몬스터 그림): 폭발풍뎅이 터질 범위(점점 빨리 깜빡임) · 스켈레톤 궁병 조준선(따라오는 얇은 선) · 하이오크 분노 오라(체력이 적을수록 크고 진함)·한 방이면 쓰러질 때 머리 위 WARNING
// 쇠사슬 간수 사슬 길은 위험 표시(render/bossFx, from "chainward")
// 궁병 선이 굳어 깜빡이는 것은 위험 표시(render/bossFx, from "skelarcher")
import { archerAim, bugFuse, NEW_FOES_RULES as R, orcLethal, orcRage, type EnemyState, type RunState } from "@pixel-rogue/shared";

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
  if (e.kind === "highorc") drawOrcRage(ctx, s, e, x, y);
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

/** 하이오크 분노 오라: 체력이 적을수록 붉은 빛이 크고 진해지고 불꽃이 위로 솟음 · 한 방에 내가 쓰러질 만큼 세면 머리 위에 작은 WARNING */
function drawOrcRage(ctx: Ctx, s: RunState, e: EnemyState, x: number, y: number): void {
  const rage = orcRage(e);
  if (rage > 0.05) {
    const pulse = 0.85 + 0.15 * Math.sin(s.tick / 5 + e.id);
    // 하이오크 그림은 몸 반경보다 커서 그림 밖으로 번지게 크게
    const r = (e.r * 1.6 + 6 + 14 * rage) * pulse;
    const g = ctx.createRadialGradient(x, y, e.r * 0.5, x, y, r);
    g.addColorStop(0, `rgba(255, 50, 20, ${0.35 + 0.45 * rage})`);
    g.addColorStop(0.6, `rgba(255, 30, 10, ${0.2 + 0.3 * rage})`);
    g.addColorStop(1, "rgba(255, 20, 10, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    // 위로 솟는 불꽃 (분노가 클수록 많음)
    for (let i = 0; i < Math.round(2 + 6 * rage); i++) {
      const t = ((s.tick * 0.8 + i * 17 + e.id * 7) % 30) / 30;
      const fx = x + Math.sin(i * 2.3 + e.id) * (e.r * 1.4);
      ctx.fillStyle = `rgba(255, ${120 + Math.round(100 * (1 - t))}, 40, ${0.7 * (1 - t) * (0.4 + rage)})`;
      ctx.fillRect(Math.round(fx), Math.round(y + e.r * 0.6 - t * (e.r * 2 + 8)), 1, 2);
    }
  }
  if (!orcLethal(s, e)) return;
  // 한 방 경고: 작고 깜빡임 (몸 위쪽, 체력 줄보다 위)
  const on = Math.floor(s.tick / 8) % 2 === 0;
  ctx.font = "bold 5px sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillText("WARNING", x + 0.5, y - e.r - 9.5);
  ctx.fillStyle = on ? "#ff4040" : "#ffd040";
  ctx.fillText("WARNING", x, y - e.r - 10);
}
