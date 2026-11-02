// 피해 없는 상태이상 표시 (모든 적 공통): 느림 = 발밑 노란 물결(바닥) · 기절 = 머리 위 어질어질 별 · 공포 = 머리 위 보랏빛 해골 + 식은땀
// 속박은 몸을 감는 붕대(render/medic drawMedicAir) · 로그 플레이어(적이 건 상태이상)도 같은 표시 + 속박 사슬·출혈 핏방울·부식 녹물·저주 보랏빛 고리
import { allPlayers, type PlayerState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

interface Mark {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  r: number;
  id: number;
  hp: number;
  slowTicks?: number;
  stunTicks?: number;
  fearTicks?: number;
}

const at = (e: Mark, alpha: number, snap: Snap) => ({ x: snap(lerp(e.prevX, e.x, alpha)), y: snap(lerp(e.prevY, e.y, alpha)) });

/** 적 + 로그 플레이어 (패왕전 사람은 자기 표시가 따로 있음) */
function marks(s: RunState): Mark[] {
  if (s.pvp) return s.enemies;
  const ps: Mark[] = allPlayers(s).map((p, i) => ({ ...p, id: 900 + i, slowTicks: p.dbSlow, stunTicks: p.dbStun, fearTicks: p.dbFear }));
  return [...s.enemies, ...ps];
}

/** 바닥: 느려진 적 발밑에 퍼져 나가는 노란 물결 두 겹 */
export function drawStatusGround(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  for (const e of marks(s)) {
    if (e.hp <= 0 || (e.slowTicks ?? 0) <= 0) continue;
    const { x, y } = at(e, alpha, snap);
    const foot = y + e.r * 0.7;
    ctx.lineWidth = 1;
    for (const off of [0, 15]) {
      const t = ((s.tick + off + e.id * 7) % 30) / 30;
      ctx.globalAlpha = 0.9 * (1 - t * 0.8);
      ctx.strokeStyle = "#ffd84a";
      ctx.beginPath();
      ctx.ellipse(x, foot, e.r * (0.6 + t * 0.9), e.r * (0.22 + t * 0.3), 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}

const STAR = ["..Y..", ".YWY.", "YWWWY", ".YWY.", "..Y.."];
const SKULL = [".PPP.", "PkPkP", "PPPPP", ".PkP."];
const HEART = [".H.H.", "HWHHH", "HHHHH", ".HHH.", "..H.."];

function pixels(ctx: CanvasRenderingContext2D, rows: readonly string[], x: number, y: number, colors: Record<string, string>): void {
  ctx.fillStyle = "#1a1622";
  rows.forEach((r, j) => [...r].forEach((ch, i) => ch !== "." && ctx.fillRect(x + i - 0.5, y + j - 0.5, 2, 2)));
  rows.forEach((r, j) =>
    [...r].forEach((ch, i) => {
      if (ch === ".") return;
      ctx.fillStyle = colors[ch]!;
      ctx.fillRect(x + i, y + j, 1, 1);
    }),
  );
}

/** 머리 위: 기절(도는 별 셋 + 궤도) · 공포(흔들리는 해골 + 식은땀) */
export function drawStatusAir(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  if (!s.pvp) for (const p of allPlayers(s)) if (p.hp > 0) playerOnly(ctx, p, s.tick, alpha, snap);
  for (const e of marks(s)) {
    if (e.hp <= 0) continue;
    const stun = (e.stunTicks ?? 0) > 0;
    const fear = (e.fearTicks ?? 0) > 0;
    if (!stun && !fear) continue;
    const { x, y } = at(e, alpha, snap);
    const top = y - e.r - 5;
    if (stun) {
      const rx = Math.max(6, e.r * 0.9);
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = "#ffe070";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(x, top, rx, 2.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      const a = s.tick * 0.15 + e.id;
      for (let k = 0; k < 3; k++) {
        const t = a + (k * Math.PI * 2) / 3;
        pixels(ctx, STAR, snap(x + Math.cos(t) * rx) - 2, snap(top + Math.sin(t) * 2.5) - 2, { Y: "#ffd84a", W: "#fff8d0" });
      }
    }
    if (fear) {
      const bob = Math.round(Math.sin(s.tick * 0.5) * 1);
      const sy = top - (stun ? 9 : 2) + bob;
      pixels(ctx, SKULL, x - 2, sy, { P: "#c890ff", k: "#2a1640" });
      // 식은땀: 머리 양옆에서 떨어지는 물방울
      const t = (s.tick % 24) / 24;
      ctx.fillStyle = "#8ad8ff";
      for (const side of [-1, 1]) ctx.fillRect(snap(x + side * (e.r + 1)), snap(y - e.r + t * 6), 1, 2);
    }
  }
}

/** 로그 플레이어만: 속박 사슬 고리 · 출혈 떨어지는 핏방울 · 부식 녹물 · 저주 도는 보랏빛 점 */
function playerOnly(ctx: CanvasRenderingContext2D, p: PlayerState, tick: number, alpha: number, snap: Snap): void {
  const { x, y } = at({ ...p, id: 0 }, alpha, snap);
  if ((p.dbRoot ?? 0) > 0) {
    ctx.strokeStyle = "#c8c8d0";
    ctx.lineWidth = 1;
    for (const dy of [-1, 2]) {
      ctx.beginPath();
      ctx.ellipse(x, y + dy, p.r + 1, 2, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x - p.r - 1, y, 1, 1);
    ctx.fillRect(x + p.r, y + 2, 1, 1);
  }
  if ((p.dbBleed ?? 0) > 0) {
    ctx.fillStyle = "#e02a3a";
    for (let i = 0; i < 2; i++) {
      const k = (tick + i * 17) % 34;
      ctx.fillRect(snap(x - 3 + i * 6), snap(y - p.r + k / 3), 1, 2);
    }
  }
  if ((p.dbBurn ?? 0) > 0) {
    // 화상: 몸 위로 불똥이 튀어 오름
    for (let i = 0; i < 3; i++) {
      const k = (tick + i * 9) % 27;
      ctx.fillStyle = i % 2 ? "#ffb040" : "#ff5a2a";
      ctx.fillRect(snap(x - 4 + i * 4), snap(y - k / 3), 1, 2);
    }
  }
  if ((p.dbRot ?? 0) > 0) {
    ctx.fillStyle = "rgba(184, 224, 74, 0.9)";
    for (let i = 0; i < 3; i++) {
      const k = (tick + i * 11) % 30;
      ctx.fillRect(snap(x - 4 + i * 4), snap(y + p.r - 2 + k / 6), 1, 1);
    }
  }
  // 매혹(세이렌 음표): 머리 위로 분홍 하트가 떠오르고 몸에 분홍 빛
  if ((p.lureTicks ?? 0) > 0 && p.lureId === undefined) {
    ctx.globalAlpha = 0.25 + 0.15 * Math.sin(tick * 0.3);
    ctx.fillStyle = "#ff7ad8";
    ctx.beginPath();
    ctx.ellipse(x, y, p.r + 2, p.r + 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    for (let i = 0; i < 2; i++) {
      const k = (tick + i * 20) % 40;
      ctx.globalAlpha = 1 - k / 40;
      pixels(ctx, HEART, snap(x - 5 + i * 6), snap(y - p.r - 6 - k / 4), { H: "#ff6ac8", W: "#ffe0f4" });
    }
    ctx.globalAlpha = 1;
  }
  if ((p.dbCurse ?? 0) > 0) {
    const fast = (p.dbCurse ?? 0) < 60;
    for (let k = 0; k < 3; k++) {
      const t = tick * (fast ? 0.3 : 0.12) + (k * Math.PI * 2) / 3;
      ctx.fillStyle = fast && tick % 6 < 3 ? "#ffffff" : "#b06aff";
      ctx.fillRect(snap(x + Math.cos(t) * (p.r + 3)), snap(y + Math.sin(t) * (p.r + 1)), 2, 2);
    }
  }
}
