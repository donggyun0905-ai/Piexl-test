// 패왕전 그리기: AI 캐릭터(상대·내 편) 몸·체력 줄·편 표시 · 휘두름 · AI 탄 · 바닥(2층 발판·가시 함정) · 수풀(위에 덮음)
import { allPlayers, inPlay, PW, PW_ARENAS, TILE_SIZE, trapUp, type EnemyState, type ProjectileState, type PwAlly, type PwBrain, type RunState } from "@pixel-rogue/shared";
import { drawBody } from "./actors";
import { bigSheet } from "../sprites";
import { drawFoeCue, pwTint, setPwViewer } from "./pwLook";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 편 색: 내 편 파랑 · 상대 편 빨강 · 모두가 적이면 주황 */
const teamColor = (team: number) => (team === 0 ? "#5ab0ff" : team === 1 ? "#ff5a5a" : "#ffa040");

/** AI 하나: 몸 · 휘두름 · 체력 줄 · 편 표시(데스매치는 레벨) */
function drawUnit(ctx: Ctx, s: RunState, b: { x: number; y: number; prevX: number; prevY: number; r: number; hp: number; maxHp: number; hitFlash: number }, br: PwBrain, alpha: number, snap: Snap): void {
  const x = snap(lerp(b.prevX, b.x, alpha));
  const y = snap(lerp(b.prevY, b.y, alpha));
  const moving = b.x !== b.prevX || b.y !== b.prevY;
  const color = teamColor(br.team);
  // 발밑 편 고리
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.ellipse(x, y + b.r - 1, b.r + 1, (b.r + 1) / 2, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = b.hitFlash > 0 ? 0.6 : 1;
  drawBody(ctx, br.char, x, y, b.r, { faceX: br.faceX, faceY: br.faceY, moving, casting: false, step: Math.floor(s.tick / 8) }, Math.floor(s.tick / 12));
  ctx.globalAlpha = 1;
  if (br.swing > 0) {
    // 근접 휘두름: 바라보는 쪽 반달
    const a = Math.atan2(br.faceY, br.faceX);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, br.range * 0.8, br.swing > 12 ? 0 : a - 0.9, br.swing > 12 ? Math.PI * 2 : a + 0.9);
    ctx.stroke();
    ctx.lineWidth = 1;
  }
  const w = 14;
  ctx.fillStyle = "#000";
  ctx.fillRect(x - w / 2, y - b.r - 6, w, 3);
  ctx.fillStyle = color;
  ctx.fillRect(x - w / 2, y - b.r - 6, Math.max(1, Math.round((w * Math.max(0, b.hp)) / b.maxHp)), 3);
  if (br.lv !== undefined) {
    ctx.font = "6px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText(String(br.lv), x, y - b.r - 8);
  }
}

/** 상대 AI (drawEnemies가 부름) */
export function drawFighter(ctx: Ctx, s: RunState, e: EnemyState, alpha: number, snap: Snap): void {
  drawUnit(ctx, s, e, e.pw!, alpha, snap);
}

/** AI 탄: 편 색 공 */
export function drawPwShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.pwTeam === undefined) return false;
  ctx.fillStyle = "#000";
  ctx.fillRect(Math.round(x) - 2, Math.round(y) - 2, 4, 4);
  ctx.fillStyle = teamColor(pr.pwTeam);
  ctx.fillRect(Math.round(x) - 1.5, Math.round(y) - 1.5, 3, 3);
  return true;
}

/** 바닥: 2층 발판(나무 판자 + 그림자) · 가시 함정 */
export function drawPwGround(ctx: Ctx, s: RunState): void {
  if (s.pvp) setPwViewer(s);
  const id = s.pvp?.arena ?? s.pw?.arena;
  if (!id) return;
  const a = PW_ARENAS[id];
  for (const [c, r, w, h] of a.decks) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.fillRect(c * TILE_SIZE + 3, r * TILE_SIZE + 3, w * TILE_SIZE, h * TILE_SIZE);
    ctx.fillStyle = "#8a6a40";
    ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, w * TILE_SIZE, h * TILE_SIZE);
    ctx.fillStyle = "#6a4e2c";
    for (let i = 0; i < h * 4; i++) ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE + i * 4, w * TILE_SIZE, 1);
  }
  const up = trapUp(s);
  for (const [c, r, w, h] of a.traps) {
    ctx.fillStyle = up ? "rgba(200, 40, 40, 0.35)" : "rgba(60, 40, 30, 0.6)";
    ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, w * TILE_SIZE, h * TILE_SIZE);
    ctx.fillStyle = up ? "#e8e8f0" : "#5a4a40";
    for (let yy = 0; yy < h * 4; yy++) for (let xx = 0; xx < w * 4; xx++) ctx.fillRect(c * TILE_SIZE + xx * 4 + 1, r * TILE_SIZE + yy * 4 + (up ? 0 : 2), 2, up ? 3 : 1);
  }
}

/** 맨 위 그리기 (render/index, 패왕전·무한 모드 AI 대결): 내 편 AI · 수풀(사람 위를 반쯤 덮음) · 숲 나무 꼭대기 */
export function drawPaewang(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const id = s.pvp?.arena ?? s.pw?.arena;
  if (!id) return;
  for (const a of (s.pw?.allies ?? []) as PwAlly[]) drawUnit(ctx, s, a, a.pw, alpha, snap);
  if (s.pvp) drawSeats(ctx, s, alpha, snap);
  const arena = PW_ARENAS[id];
  // 수풀: 잎 덩어리 여러 개 (안에 숨은 사람이 반쯤 보임)
  for (const [c, r, w, h] of arena.bushes) {
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const x = (c + xx) * TILE_SIZE;
        const y = (r + yy) * TILE_SIZE;
        const k = (c + xx) * 7 + (r + yy) * 13;
        leaf(ctx, x + 5 + (k % 3), y + 6, 6, "rgba(46, 112, 50, 0.72)");
        leaf(ctx, x + 11, y + 10 - (k % 2) * 2, 6, "rgba(58, 130, 56, 0.72)");
        leaf(ctx, x + 8, y + 3, 4, "rgba(96, 168, 80, 0.6)");
      }
    }
  }
  // 숲: 나무 기둥 위에 잎이 무성한 꼭대기
  if (id === "forest") {
    for (const [c, r, w, h] of arena.rocks) {
      const x = (c + w / 2) * TILE_SIZE;
      const y = (r + h / 2) * TILE_SIZE - 8;
      const R = 9 + w * 5;
      leaf(ctx, x, y + 2, R, "rgba(18, 52, 22, 0.9)");
      leaf(ctx, x - R * 0.35, y - R * 0.2, R * 0.6, "rgba(34, 82, 34, 0.92)");
      leaf(ctx, x + R * 0.3, y - R * 0.35, R * 0.5, "rgba(52, 104, 44, 0.9)");
    }
  }
}

function leaf(ctx: Ctx, x: number, y: number, r: number, color: string): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** 패왕전 자리마다: 발밑 편 고리 · 그림 위 편 색 체력 줄(+보호막) · 데스매치 레벨 · 가까운 적 표시 */
function drawSeats(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const pv = s.pvp!;
  const me = s.seat ?? 0;
  const ps = allPlayers(s);
  const at = (i: number) => {
    const p = ps[i]!;
    const x = snap(lerp(p.prevX, p.x, alpha));
    const y = snap(lerp(p.prevY, p.y, alpha));
    // 캐릭터 그림(32칸, 큰 그림은 48칸)의 맨 위
    return { x, y, top: y + p.r - (bigSheet(p.characterId) ? 46 : 31) };
  };
  ps.forEach((p, i) => {
    const seat = pv.seats[i]!;
    if (!inPlay(s, i)) return;
    const { x, y, top } = at(i);
    const color = pwTint(s, i);
    // 발밑 고리: 나는 노랑 두 겹
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x, y + p.r - 1, p.r + 3, (p.r + 3) / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
    if (i === me) {
      ctx.strokeStyle = "#ffd860";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(x, y + p.r - 1, p.r + 5, (p.r + 5) / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.lineWidth = 1;
    const w = 20;
    const hp = Math.max(0, Math.min(1, p.hp / p.stats.maxHp));
    ctx.fillStyle = "#0a0810";
    ctx.fillRect(x - w / 2 - 1, top - 1, w + 2, 5);
    ctx.fillStyle = "#3a3444";
    ctx.fillRect(x - w / 2, top, w, 3);
    ctx.fillStyle = color;
    ctx.fillRect(x - w / 2, top, Math.max(hp > 0 ? 1 : 0, Math.round(w * hp)), 3);
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.fillRect(x - w / 2, top, Math.round(w * hp), 1);
    const sh = Math.min(1, (p.shieldPts ?? 0) / PW.shield);
    if (sh > 0) {
      ctx.fillStyle = "#e8f4ff";
      ctx.fillRect(x - w / 2, top - 2, Math.round(w * sh), 1);
    }
    if (pv.mode === "gungame") {
      ctx.font = "bold 6px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "#0a0810";
      ctx.fillText(`Lv${seat.lv}`, x + 0.5, top - 3.5);
      ctx.fillStyle = color;
      ctx.fillText(`Lv${seat.lv}`, x, top - 4);
    }
  });
  if (!s.over) drawFoeCue(ctx, s, at);
}
