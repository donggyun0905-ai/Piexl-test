// 라스트 보스 덧그리기: 빛의 네 방향 빔 · 어둠의 거대한 두 손 · 갓이터 닫히는 구역 · 바닥 파동 · 다크 오라 선 · 어둠(공격 범위 밖이 깜깜) · 그물 방향키 · 사슬(W·A·S·D 순서) · 거울(이동 반대)
import { beamDirs, DARK_DEATH, zoneRect, ROOM_HEIGHT, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, ROOM_WIDTH, type RunState } from "@pixel-rogue/shared";
import { additive, beam, glow, glowStroke, shock } from "./pwFxBits";
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
      // 네 방향 빔: 예고는 가늘게 깜빡이는 금빛 선, 쏘면 일렁이는 굵은 빛기둥 + 보스 둘레 빛
      const wob = 1 + 0.15 * Math.sin(s.tick * 0.8);
      additive(ctx, () => {
        if (!warm) glow(ctx, snap(e.x), snap(e.y), 40, "#fff0b0", 0.8, 1.2);
        for (const d of beamDirs(e.beam!)) beam(ctx, snap(e.x), snap(e.y), snap(e.x + d[0] * 400), snap(e.y + d[1] * 400), warm ? 1.5 : 7 * wob, "#ffe8a0", warm ? 0.3 + 0.3 * ((s.tick >> 2) % 2) : 0.95);
      });
    }
    if (e.kind === "pdark" && e.hands) {
      // 거대한 두 손: 검은 손바닥 + 손가락
      for (let i = 0; i + 1 < e.hands.length; i += 2) {
        const x = snap(e.hands[i]!);
        const y = snap(e.hands[i + 1]!);
        // 보랏빛 기운을 두른 검은 손: 둥근 손바닥 + 마디 진 손가락 + 손바닥의 눈
        additive(ctx, () => glow(ctx, x, y - 5, 30, "#8a5ad8", 0.6));
        ctx.fillStyle = "rgba(20, 10, 30, 0.92)";
        ctx.beginPath();
        ctx.ellipse(x, y, 16, 11, 0, 0, TAU);
        ctx.fill();
        for (let f = 0; f < 4; f++) {
          const fx0 = x - 12 + f * 8;
          const bend = Math.sin(s.tick * 0.1 + f) * 2;
          ctx.beginPath();
          ctx.moveTo(fx0 - 2.5, y - 6);
          ctx.lineTo(fx0 - 2 + bend, y - 20 + Math.abs(f - 1.5) * 2);
          ctx.lineTo(fx0 + 2 + bend, y - 21 + Math.abs(f - 1.5) * 2);
          ctx.lineTo(fx0 + 2.5, y - 6);
          ctx.fill();
        }
        additive(ctx, () => glow(ctx, x, y - 1, 6, "#c08aff", 0.9, 1));
        ctx.fillStyle = "#e0c8ff";
        ctx.fillRect(x - 2, y - 2, 4, 2);
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
      // 불타는 충격파 고리 (가장자리 흰 불)
      additive(ctx, () => {
        // 켈베로스 전역 검기는 붉은 고리
        // 레비아탄 고래의 지진은 푸른 고리
        const red = e.kind === "cerberus";
        const blue = e.kind === "levwhale";
        shock(ctx, snap(w.x), snap(w.y), w.r + 4, red ? "#ff1a2a" : blue ? "#2a8aff" : "#ff963c", 0.95, red || blue ? 16 : 12);
        shock(ctx, snap(w.x), snap(w.y), w.r + 1, red ? "#ffb0b0" : blue ? "#c8f0ff" : "#fff0c8", 0.9, 4);
      });
    }
    for (const sw of e.sweeps ?? []) {
      // 다크 오라: 기다리는 동안은 벽 쪽에 점선, 움직이면 꽉 찬 선
      // 다크 오라: 움직이면 보랏빛 번개가 감도는 어둠의 벽
      if (sw.wait <= 0)
        additive(ctx, () => {
          if (sw.x) beam(ctx, snap(sw.pos), ROOM_MIN_Y, snap(sw.pos), ROOM_MAX_Y, 12, "#8a4aff", 0.6);
          else beam(ctx, ROOM_MIN_X, snap(sw.pos), ROOM_MAX_X, snap(sw.pos), 12, "#8a4aff", 0.6);
        });
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
      glowStroke(ctx);
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
    // 암흑 속의 무리 시련: 내 몸 둘레만 남기고 완전히 깜깜 (고립)
    const pitch = s.trialRun?.kind === 1 && s.trialRun.room === s.roomId;
    const r = pitch ? p.r + 7 : Math.max(14, p.stats.range * (1 - stacks / (DARK_DEATH + 1)));
    ctx.fillStyle = pitch ? "#000" : `rgba(0, 0, 0, ${Math.min(0.97, 0.82 + stacks * 0.03)})`;
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
    glowStroke(ctx);
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
    glowStroke(ctx);
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
