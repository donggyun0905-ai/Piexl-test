// 패왕전 성장 대결 그리기: 집(깃발 둘레 원) · 쟁탈전 가운데 점령지(가진 편 색) · 병사·포탑·보스(던전 몬스터 그림 + 편 고리 + 체력 줄) · 포탑·원거리 병사 공격 빛줄기
import { BASE_R, capCenter, ENEMIES, fogAt, PW_ARENAS, PW_GROW, PW_WAR, spotXY, TILE_SIZE, type EnemyKind, type RunState } from "@pixel-rogue/shared";
import { drawEnemySprite } from "../sprites";

type Ctx = CanvasRenderingContext2D;
const T = TILE_SIZE;
const color = (team: number, mine: number) => (team === 2 ? "#e0c060" : team === mine ? "#5ab0ff" : "#ff5a5a");

export function drawGrowGround(ctx: Ctx, s: RunState): void {
  const pv = s.pvp;
  const g = pv?.grow;
  if (!pv || !g) return;
  const a = PW_ARENAS[pv.arena];
  const mine = pv.seats[s.seat ?? 0]!.team;
  ctx.save();
  // 집: 회복·상점 범위 · 쟁탈전 집 점령지
  (a.homes ?? []).forEach(([c, r], team) => {
    const x = (c + 0.5) * T;
    const y = (r + 0.5) * T;
    ctx.fillStyle = team === mine ? "rgba(90, 176, 255, 0.10)" : "rgba(255, 90, 90, 0.10)";
    ctx.beginPath();
    ctx.arc(x, y, PW_GROW.homeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = color(team, mine);
    ctx.beginPath();
    ctx.arc(x, y, g.bossDown[team] ? BASE_R : PW_GROW.homeR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  });
  // 전쟁의 서막 체크포인트: 가진 편 색 동그라미 · 점령 중이면 바깥 호
  (a.points ?? []).forEach((pt, k) => {
    const [x, y] = spotXY(pt.at);
    const st = g.points?.[k];
    const own = st?.owner ?? -1;
    ctx.fillStyle = own < 0 ? "rgba(220, 220, 230, 0.15)" : own === mine ? "rgba(90, 176, 255, 0.22)" : "rgba(255, 90, 90, 0.22)";
    ctx.strokeStyle = own < 0 ? "#d8d8e8" : color(own, mine);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, PW_WAR.pointR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    for (const [team, v] of Object.entries(st?.prog ?? {})) {
      ctx.strokeStyle = color(Number(team), mine);
      ctx.beginPath();
      ctx.arc(x, y, PW_WAR.pointR + 4, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * v) / 100);
      ctx.stroke();
    }
    ctx.lineWidth = 1;
  });
  // 가운데 점령지
  if (a.zone?.rect) {
    const [c, r, w, h] = a.zone.rect;
    const tint = g.owner === undefined ? "200, 200, 220" : g.owner === mine ? "90, 176, 255" : "255, 90, 90";
    ctx.fillStyle = `rgba(${tint}, 0.12)`;
    ctx.fillRect(c * T, r * T, w * T, h * T);
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(${tint}, 0.8)`;
    ctx.strokeRect(c * T, r * T, w * T, h * T);
    const [cx, cy] = capCenter(a);
    ctx.fillStyle = `rgba(${tint}, 0.9)`;
    ctx.fillRect(cx - 2, cy - 14, 2, 14);
    ctx.fillRect(cx, cy - 14, 8, 5);
  }
  ctx.restore();
}

/** 병사·포탑·보스 (사람 아래에) */
export function drawGrowUnits(ctx: Ctx, s: RunState): void {
  const pv = s.pvp;
  const g = pv?.grow;
  if (!pv || !g) return;
  const mine = pv.seats[s.seat ?? 0]!.team;
  const myFog = fogAt(pv.arena, s.player.x, s.player.y);
  for (const u of g.units) {
    const b = u.body;
    if (b.hp <= 0) continue;
    // 안개 안은 같은 안개에 있어야 보임
    const f = fogAt(pv.arena, b.x, b.y);
    if (f >= 0 && f !== myFog) continue;
    const col = color(u.team, mine);
    // 공격 빛줄기
    if (u.shot && s.tick - u.shot.at < 8 && u.kind !== "minion") {
      ctx.strokeStyle = u.kind === "tower" ? "#fff0a0" : col;
      ctx.lineWidth = u.kind === "tower" ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y - b.r);
      ctx.lineTo(u.shot.x, u.shot.y);
      ctx.stroke();
      ctx.lineWidth = 1;
    }
    ctx.strokeStyle = col;
    ctx.beginPath();
    ctx.ellipse(b.x, b.y + b.r - 1, b.r + 2, (b.r + 2) / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
    const def = ENEMIES[u.look as EnemyKind];
    const tint: readonly [string, number] | undefined = b.hitFlash > 0 ? ["#ffffff", 0.7] : b.immune ? ["#8a8aa0", 0.35] : undefined;
    if (!def || !drawEnemySprite(ctx, u.look, Math.round(b.x), Math.round(b.y), Math.floor(s.tick / 12), b.dirX < 0, tint, b.r / def.radius)) {
      ctx.fillStyle = col;
      ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
    }
    // 체력 줄 (포탑·보스는 크게) · 못 때리는 동안 자물쇠 표시
    const w = Math.max(12, b.r * 2);
    ctx.fillStyle = "#0a0810";
    ctx.fillRect(b.x - w / 2 - 1, b.y - b.r - 7, w + 2, 4);
    ctx.fillStyle = col;
    ctx.fillRect(b.x - w / 2, b.y - b.r - 6, Math.max(1, Math.round((w * b.hp) / b.maxHp)), 2);
    if (b.immune) {
      ctx.fillStyle = "#d8d8e8";
      ctx.fillRect(b.x - 2, b.y - b.r - 13, 5, 4);
      ctx.strokeStyle = "#d8d8e8";
      ctx.strokeRect(b.x - 1.5, b.y - b.r - 16, 4, 4);
    }
  }
}

/** 전쟁의 서막 안개 지역: 내가 들어가 있지 않은 안개는 자욱하게 덮음 (사람·체력 줄 위에) */
export function drawWarFog(ctx: Ctx, s: RunState): void {
  const pv = s.pvp;
  const fogs = pv && PW_ARENAS[pv.arena].fogs;
  if (!fogs) return;
  const mine = fogAt(pv.arena, s.player.x, s.player.y);
  fogs.forEach((rects, k) => {
    ctx.fillStyle = k === mine ? "rgba(120, 110, 150, 0.12)" : "rgba(58, 54, 72, 0.88)";
    for (const [c, r, w, h] of rects) ctx.fillRect(c * T, r * T, w * T, h * T);
    if (k === mine) return;
    // 연기 덩어리 (천천히 흐름)
    ctx.fillStyle = "rgba(150, 140, 170, 0.18)";
    rects.forEach(([c, r, w], j) => {
      if (j % 4) return;
      const x = (c + ((j * 7 + s.tick / 30) % Math.max(1, w))) * T;
      ctx.beginPath();
      ctx.arc(x, r * T, 18, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}
