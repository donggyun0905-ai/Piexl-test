// 라스트 보스 덧그리기: 빛의 네 방향 빔 · 어둠의 거대한 두 손 · 갓이터 닫히는 구역 · 바닥 파동 · 다크 오라 선 · 어둠(공격 범위 밖이 깜깜) · 그물 방향키 · 사슬(W·A·S·D 순서) · 거울(이동 반대)
import { beamDirs, DARK_DEATH, zoneRect, ROOM_HEIGHT, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, ROOM_WIDTH, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

const TAU = Math.PI * 2;
/** 그물 방향 화살표: 0 위 · 1 오른쪽 · 2 아래 · 3 왼쪽 */
const ARROW = ["↑", "→", "↓", "←"];
/** 사슬 글자: 같은 방향의 W·D·S·A */
const KEY = ["W", "D", "S", "A"];

/** 적 다음에: 빔 · 손 · 오라 선 */
export function drawPrimeval(ctx: CanvasRenderingContext2D, s: RunState, snap: Snap): void {
  for (const e of s.enemies) {
    if (e.kind === "plight" && (e.beamTicks ?? 0) > 0 && e.beam) {
      // 네 방향 빔: 처음엔 가는 예고선, 그다음 굵은 빛
      const warm = 420 - (e.beamTicks ?? 0) < 45;
      for (const d of beamDirs(e.beam)) {
        ctx.strokeStyle = warm ? "rgba(255, 240, 180, 0.4)" : "rgba(255, 245, 200, 0.85)";
        ctx.lineWidth = warm ? 1 : 5;
        ctx.beginPath();
        ctx.moveTo(snap(e.x), snap(e.y));
        ctx.lineTo(snap(e.x + d[0] * 400), snap(e.y + d[1] * 400));
        ctx.stroke();
        if (!warm) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    if (e.kind === "pdark" && e.hands) {
      // 거대한 두 손: 검은 손바닥 + 손가락
      for (let i = 0; i + 1 < e.hands.length; i += 2) {
        const x = snap(e.hands[i]!);
        const y = snap(e.hands[i + 1]!);
        ctx.fillStyle = "rgba(20, 10, 30, 0.85)";
        ctx.fillRect(x - 15, y - 10, 30, 20);
        for (let f = 0; f < 4; f++) ctx.fillRect(x - 15 + f * 8, y - 20, 5, 10);
        ctx.fillStyle = "#8a5ad8";
        ctx.fillRect(x - 3, y - 2, 6, 3);
      }
    }
    for (const z of e.zones ?? []) {
      // 갓이터 구역 닫기: 닫히기 전엔 붉게 깜빡이는 테두리, 닫히면 검붉게 칠함
      const [l, t, r, b] = zoneRect(z.q);
      if (s.tick < z.at) {
        if (Math.floor((z.at - s.tick) / 6) % 2 === 0) {
          ctx.strokeStyle = "rgba(255, 60, 60, 0.9)";
          ctx.lineWidth = 2;
          ctx.strokeRect(l + 2, t + 2, r - l - 4, b - t - 4);
        }
        ctx.fillStyle = `rgba(255, 40, 40, ${0.08 + 0.2 * (1 - Math.min(1, (z.at - s.tick) / 70))})`;
      } else ctx.fillStyle = "rgba(40, 0, 20, 0.6)";
      ctx.fillRect(l, t, r - l, b - t);
    }
    for (const w of e.waves ?? []) {
      // 바닥을 쳐서 퍼지는 원형 파동 (대시로 넘어감)
      if (w.wait > 0) continue;
      ctx.strokeStyle = "rgba(255, 150, 60, 0.9)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(snap(w.x), snap(w.y), w.r, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255, 240, 200, 0.9)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    for (const sw of e.sweeps ?? []) {
      // 다크 오라: 기다리는 동안은 벽 쪽에 점선, 움직이면 꽉 찬 선
      ctx.strokeStyle = sw.wait > 0 ? "rgba(160, 90, 255, 0.6)" : "rgba(60, 20, 90, 0.95)";
      ctx.lineWidth = sw.wait > 0 ? 1 : 8;
      ctx.setLineDash(sw.wait > 0 ? [4, 4] : []);
      ctx.beginPath();
      if (sw.x) {
        ctx.moveTo(snap(sw.pos), ROOM_MIN_Y);
        ctx.lineTo(snap(sw.pos), ROOM_MAX_Y);
      } else {
        ctx.moveTo(ROOM_MIN_X, snap(sw.pos));
        ctx.lineTo(ROOM_MAX_X, snap(sw.pos));
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

/** 효과 다음에: 어둠(공격 범위 밖이 깜깜, 유령에 닿을수록 더 좁고 짙게 · 갓이터 구역에 갇혀도) · 그물 방향키 · 못 움직임 */
export function drawPrimevalOverlay(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  const dark = s.enemies.some((e) => e.kind === "pdark" && (e.veil ?? 0) > 0) || (p.blindTicks ?? 0) > 0;
  if (dark) {
    const stacks = p.darkStacks ?? 0;
    const r = Math.max(14, p.stats.range * (1 - stacks / (DARK_DEATH + 1)));
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.97, 0.82 + stacks * 0.03)})`;
    ctx.beginPath();
    ctx.rect(0, 0, ROOM_WIDTH, ROOM_HEIGHT);
    ctx.arc(x, y, r, 0, TAU, true);
    ctx.fill();
  }
  if ((p.netSeq?.length ?? 0) > 0) {
    // 그물: 남은 방향을 머리 위에
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, p.r + 4, 0, TAU);
    ctx.stroke();
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff6c0";
    ctx.fillText(p.netSeq!.map((d) => ARROW[d]).join(""), x, y - p.r - 8);
  } else if ((p.netStun ?? 0) > 0) {
    ctx.font = "bold 8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ff8a8a";
    ctx.fillText("✕", x, y - p.r - 6);
  }
  if ((p.chainTicks ?? 0) > 0) {
    // 봉인의 사슬: 몸을 감은 사슬 + 남은 방향 글자
    ctx.strokeStyle = "#b8b0c8";
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    ctx.arc(x, y, p.r + 3, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = "bold 8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffe070";
    ctx.fillText((p.chains ?? []).map((d) => KEY[d]).join(""), x, y - p.r - 8);
  }
  if ((p.mirrorTicks ?? 0) > 0) {
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#c8f0ff";
    ctx.fillText("⇄", x, y + p.r + 12);
  }
}
