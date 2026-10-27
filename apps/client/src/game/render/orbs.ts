// 원소술사 그리기: 은하수·중력 장판(적 아래) · 회전체·검·별·펫·전깃줄·갓 핸드(플레이어 위) · 날아간 자국·풀 범위·내려찍기 효과 · 펫·강철·트리거 탄
import { ORBIT_RULES, orbBodies, WEAPONS, wirePairs, type EffectState, type OrbBody, type ProjectileState, type RunState, type WeaponDef } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { bladeAngle, drawElemFx, drawGalaxyStacks, drawGodHand, drawSword } from "./orbsNew";

const ORB_COLOR: Record<OrbBody["tag"], string> = {
  fire: "#ff6a2a",
  water: "#3aa0ff",
  earth: "#c08a40",
  thunder: "#ffe23a",
  grass: "#5ad05a",
  freeze: "#c8f4ff",
  area: "#ffcf7a",
  push: "#4a90e0",
  burn: "#e0603a",
  leech: "#d83a4a",
  slow: "#e8c890",
  stall: "#9ad8c8",
  guard: "#8a9aff",
  plain: "#8ad0ff",
  light: "#fff6c0",
  blade: "#e8ecf4",
  star: "#ffffff",
  steel: "#c8ccd8",
  pet: "#ff1a3a",
};

const weaponOf = (s: RunState): WeaponDef => WEAPONS[s.player.weaponId];

function center(s: RunState, alpha: number): [number, number] {
  return [lerp(s.player.prevX, s.player.x, alpha), lerp(s.player.prevY, s.player.y, alpha)];
}

/** 은하수·중력 장판 (적보다 먼저) */
export function drawOrbitField(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  const w = weaponOf(s);
  if (w.orbit !== "galaxy" && w.orbit !== "gravity") return;
  const [x, y] = center(s, alpha);
  const R = s.player.stats.range;
  if (w.orbit === "galaxy") drawGalaxyStacks(ctx, s, snap, ORBIT_RULES.GALAXY_MAX);
  if (w.orbit === "galaxy") {
    // 은하수: 짙은 보랏빛 원반 위로 반짝이는 별이 천천히 돎
    ctx.fillStyle = "rgba(70, 40, 140, 0.22)";
    disc(ctx, snap(x), snap(y), R);
    ctx.fillStyle = "rgba(140, 110, 255, 0.18)";
    disc(ctx, snap(x), snap(y), R * 0.55);
    for (let i = 0; i < 28; i++) {
      const a = i * 2.39996 + s.tick * 0.006 * (i % 2 === 0 ? 1 : -1);
      const d = R * Math.sqrt(((i * 37) % 28) / 28 + 0.02);
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(s.tick * 0.05 + i));
      ctx.globalAlpha = tw;
      ctx.fillStyle = i % 5 === 0 ? "#ffd8ff" : "#ffffff";
      ctx.fillRect(Math.round(x + Math.cos(a) * d), Math.round(y + Math.sin(a) * d), 1, 1);
    }
    ctx.globalAlpha = 1;
  } else {
    // 중력: 어두운 원 + 안쪽으로 빨려 드는 고리
    ctx.fillStyle = "rgba(40, 20, 70, 0.25)";
    disc(ctx, snap(x), snap(y), R);
    const k = 1 - (s.tick % 60) / 60;
    ctx.strokeStyle = `rgba(170, 120, 255, ${0.15 + 0.35 * (1 - k)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(snap(x), snap(y), Math.max(1, R * k), 0, Math.PI * 2);
    ctx.stroke();
  }
}

/** 회전체·전깃줄·갓 핸드 (플레이어 다음) */
export function drawOrbs(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  const w = weaponOf(s);
  if (w.kind !== "orbit" || s.over) return;
  const [cx, cy] = center(s, alpha);
  const bodies = orbBodies(p, cx, cy, s.tick);
  if (p.passives.includes("electronic")) {
    ctx.strokeStyle = `rgba(140, 240, 255, ${0.35 + 0.3 * Math.abs(Math.sin(s.tick * 0.4))})`;
    ctx.lineWidth = 1;
    for (const [a, b] of wirePairs(bodies)) {
      ctx.beginPath();
      ctx.moveTo(snap(a.x), snap(a.y));
      ctx.lineTo(snap(b.x), snap(b.y));
      ctx.stroke();
    }
  }
  bodies.forEach((b, i) => {
    // 웨폰 마스터: 칼끝이 적(지키는 검은 도는 방향)을 향한 진짜 검
    if (w.orbit === "blades" && b.tag !== "pet") drawSword(ctx, snap(b.x), snap(b.y), bladeAngle(s, b, i, cx, cy), b.tag, s.tick);
    else drawBody(ctx, b, snap, s.tick);
  });
  if (w.orbit === "hand") drawGodHand(ctx, s, cx, cy, snap);
}

function drawBody(ctx: CanvasRenderingContext2D, b: OrbBody, snap: Snap, tick: number): void {
  const x = snap(b.x);
  const y = snap(b.y);
  const c = ORB_COLOR[b.tag];
  if (b.striker !== undefined && b.tag !== "star") {
    // 검 (날아가는 검 + 몸 둘레를 도는 풀 검): 바깥쪽을 향한 작은 칼날 + 원소 색 손잡이
    ctx.fillStyle = "#e8ecf4";
    ctx.fillRect(x - 1, y - 4, 2, 6);
    ctx.fillStyle = c;
    ctx.fillRect(x - 2, y + 2, 4, 1);
    ctx.fillRect(x - 1, y + 3, 2, 1);
    return;
  }
  // 은은한 빛 + 몸 + 하이라이트
  ctx.globalAlpha = b.tag === "light" || b.tag === "star" ? 0.3 + 0.25 * Math.abs(Math.sin(tick * 0.2 + b.x)) : 0.25;
  ctx.fillStyle = c;
  disc(ctx, x, y, b.r + 1);
  ctx.globalAlpha = 1;
  if (b.tag === "steel") {
    ctx.fillStyle = "#5a6070";
    disc(ctx, x, y, b.r);
  }
  ctx.fillStyle = c;
  disc(ctx, x, y, b.tag === "steel" ? b.r - 1.2 : b.r - 0.5);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(Math.round(x - b.r / 2), Math.round(y - b.r / 2), 1, 1);
}

/** 원소술사 효과면 그리고 true */
export function drawOrbitFx(ctx: CanvasRenderingContext2D, fx: EffectState, snap: Snap): boolean {
  if (drawElemFx(ctx, fx, snap)) return true;
  const t = fx.ticks / fx.maxTicks;
  if (fx.kind === "streak") {
    ctx.strokeStyle = fx.size === 0 ? "#ffffff" : "#fff2b0";
    ctx.globalAlpha = t;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(snap(fx.x), snap(fx.y));
    ctx.lineTo(snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y));
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(snap(fx.toX ?? fx.x) - 1, snap(fx.toY ?? fx.y) - 1, 2, 2);
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "verdant") {
    ctx.strokeStyle = "#5ad05a";
    ctx.globalAlpha = t;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(snap(fx.x), snap(fx.y), Math.max(1, fx.size * (1.1 - t * 0.6)), 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "slam") {
    const x = snap(fx.x);
    const y = snap(fx.y);
    ctx.fillStyle = "#a070ff";
    ctx.globalAlpha = 0.25 * t;
    disc(ctx, x, y, fx.size);
    ctx.globalAlpha = t;
    ctx.strokeStyle = "#d8c0ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1, fx.size * (1.2 - t * 0.4)), 0, Math.PI * 2);
    ctx.stroke();
    // 갈라지는 땅
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const a = i * 1.047 + 0.3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * fx.size * 0.8, y + Math.sin(a) * fx.size * 0.8);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    return true;
  }
  return false;
}

/** 펫·강철·트리거 탄이면 그리고 true */
export function drawOrbShot(ctx: CanvasRenderingContext2D, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit === "pet") {
    ctx.fillStyle = "#5a0a14";
    ctx.fillRect(x - 2, y - 2, 4, 4);
    ctx.fillStyle = ORB_COLOR.pet;
    ctx.fillRect(x - 1, y - 1, 3, 3);
    return true;
  }
  if (pr.spirit === "steel") {
    ctx.fillStyle = "#5a6070";
    ctx.fillRect(x - 2, y - 2, 4, 4);
    ctx.fillStyle = ORB_COLOR.steel;
    ctx.fillRect(x - 1, y - 1, 2, 2);
    return true;
  }
  if (pr.spirit === "trigger") {
    ctx.strokeStyle = "rgba(138, 208, 255, 0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - pr.vx * 2, y - pr.vy * 2);
    ctx.lineTo(x, y);
    ctx.stroke();
    // 치명타 탄은 주황
    ctx.fillStyle = pr.crit ? "#ff8a30" : "#e8f6ff";
    ctx.fillRect(x - 1, y - 1, 2, 2);
    return true;
  }
  return false;
}

function disc(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2);
  ctx.fill();
}
