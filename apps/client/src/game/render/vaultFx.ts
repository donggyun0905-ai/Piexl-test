// 비밀의 방 효과 (sim/vault·devil·gamble·auction, fxTypes VaultFx): 벽 무너짐(돌덩이·먼지) · 악마 거래(핏빛 영혼이 석상으로) · 거절
// · 절규 범위(푸른 파동) · 리퍼 낫 · 야바위 당첨(금화 분수)·꽝(검은 연기) · 경매 입찰(띠링 고리)·낙찰(망치 충격)·돈 날림(지폐·금화가 진행자에게)
// 악마의 거래 오라 (붉은 반점 검정 · 절규 파랑 · 십자가 빨강 · 리퍼 몸 뒤 낫) · 악마의 방 석상은 어둠 위에 (drawVaultOverlay)
import { ROOM_HEIGHT, ROOM_WIDTH, type EffectState, type RunState } from "@pixel-rogue/shared";
import { drawDevilStatue } from "./vaultDraw";
import { seatPos } from "./auctionDraw";
import { additive, alpha, crescent, easeOut, glow, rnd, shock, sparks } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const BLOOD = "#c01828";
const GOLD = "#ffd040";

export function drawVaultFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("sr")) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  switch (fx.kind) {
    case "srCrumble": {
      // 돌덩이가 방 안쪽으로 튀어 떨어지고 먼지가 퍼짐 (dirX = 벽 쪽: 0 왼 · 1 오른 · 2 아래)
      const ix = fx.dirX === 0 ? 1 : fx.dirX === 1 ? -1 : 0;
      const iy = fx.dirX === 2 ? -1 : 0;
      ctx.fillStyle = alpha("#8a8296", (1 - f) * 0.5);
      ctx.beginPath();
      ctx.arc(x + ix * 10, y + iy * 10, r * easeOut(f), 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 12; i++) {
        const sp = 0.5 + rnd(i, 1) * 1.2;
        const side = (rnd(i, 2) - 0.5) * 2;
        const d = f * 40 * sp;
        const bx = x + ix * d + (ix ? 0 : side * d) + (iy ? side * 8 : 0);
        const by = y + iy * d + (iy ? 0 : side * d * 0.6) + f * f * 30 * sp;
        ctx.fillStyle = i % 3 ? "#5a5268" : "#3a3446";
        ctx.fillRect(Math.round(bx), Math.round(by), 2 + (i % 3), 2 + (i % 2));
      }
      return true;
    }
    case "srDeal": {
      // 거래: 물건 자리에서 핏빛 영혼이 석상으로 빨려 들어감 + 석상 아래 붉은 충격파
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const g = easeOut(Math.min(1, f * 1.6));
      additive(ctx, () => {
        for (let i = 0; i < 6; i++) {
          const k = Math.max(0, g - i * 0.06);
          glow(ctx, x + (tx - x) * k + Math.sin(f * 9 + i) * 6, y + (ty - y) * k - Math.sin(k * Math.PI) * 20, 6 - i * 0.6, BLOOD, (1 - f) * 0.9, 0.3);
        }
        shock(ctx, tx, ty + 30, r * easeOut(f), BLOOD, 1 - f, 6);
        glow(ctx, tx, ty - 10, 26, BLOOD, (1 - f) * 0.8, 0.5);
      });
      return true;
    }
    case "srRefuse": {
      ctx.strokeStyle = alpha("#ff4a5a", 1 - f);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 6, y - 16);
      ctx.lineTo(x + 6, y - 4);
      ctx.moveTo(x + 6, y - 16);
      ctx.lineTo(x - 6, y - 4);
      ctx.stroke();
      return true;
    }
    case "srScream":
      additive(ctx, () => {
        shock(ctx, x, y, r * easeOut(f), "#4a9aff", 1 - f, 3);
        glow(ctx, x, y, r * 0.6, "#4a9aff", (1 - f) * 0.5);
      });
      return true;
    case "srScythe": {
      // 검은 낫이 위에서 아래로 그어짐
      const a = Math.atan2(fx.dirY, fx.dirX) - 1.6 + f * 2.4;
      crescent(ctx, x, y, r, a, 1.4, 3, "#120a14", 1 - f);
      additive(ctx, () => crescent(ctx, x, y, r + 1, a, 1.2, 1, "#a070ff", (1 - f) * 0.6));
      return true;
    }
    case "srWin":
      // 당첨: 금빛 기둥 + 금화 분수
      additive(ctx, () => {
        shock(ctx, x, y, r * easeOut(f), GOLD, 1 - f, 6);
        glow(ctx, x, y - 10, 30, GOLD, (1 - f) * 0.9, 0.7);
        sparks(ctx, x, y - 6, 26, r * 1.4, f, GOLD, fx.x + fx.maxTicks);
      });
      return true;
    case "srLose":
      // 꽝: 검은 연기 · 깨진 금
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = alpha("#1a1420", (1 - f) * 0.7);
        ctx.beginPath();
        ctx.arc(x + (rnd(i, 1) - 0.5) * 30, y - f * 30 * (0.5 + rnd(i, 2)), 5 + f * 8, 0, Math.PI * 2);
        ctx.fill();
      }
      return true;
    case "srBid": {
      // 입찰: 부른 자리(그림자 손님 자리 또는 나)에서 금빛 고리 + 값
      const at = fx.dirX >= 0 ? seatPos(fx.dirX, ROOM_WIDTH / 2, ROOM_HEIGHT / 2) : { x, y };
      const py = fx.dirX >= 0 ? at.y - 34 : y - 16;
      additive(ctx, () => shock(ctx, at.x, py, 6 + 14 * easeOut(f), GOLD, 1 - f, 2));
      ctx.font = "bold 8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = alpha("#fff6c0", 1 - f);
      ctx.fillText(`${r}G`, at.x, py - 6 - f * 10);
      ctx.textAlign = "start";
      return true;
    }
    case "srSold":
      additive(ctx, () => {
        shock(ctx, x, y + 30, r * easeOut(f), fx.dirX === 1 ? "#7aff9a" : "#ff6a7a", 1 - f, 5);
        sparks(ctx, x, y + 20, 14, r, f, GOLD, fx.x + fx.y);
      });
      return true;
    case "srMoney": {
      // 돈 날림: 지폐·금화가 내 자리에서 진행자에게 팔랑이며 날아감
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      for (let i = 0; i < r; i++) {
        const k = Math.max(0, Math.min(1, f * 1.4 - (i / r) * 0.4));
        const bx = x + (tx - x) * k + Math.sin(k * 8 + i) * 8;
        const by = y + (ty - y) * k - Math.sin(k * Math.PI) * (20 + rnd(i, 4) * 20);
        ctx.save();
        ctx.translate(Math.round(bx), Math.round(by));
        ctx.rotate(Math.sin(f * 12 + i) * 0.8);
        ctx.fillStyle = i % 3 === 0 ? GOLD : "#6ac87a";
        ctx.fillRect(i % 3 === 0 ? -2 : -4, -2, i % 3 === 0 ? 4 : 8, i % 3 === 0 ? 4 : 5);
        if (i % 3) {
          ctx.fillStyle = "#2a6a3a";
          ctx.fillRect(-1, -1, 2, 3);
        }
        ctx.restore();
      }
      return true;
    }
  }
  return false;
}

/** 악마의 거래 오라 (몸 아래 · 사람마다) */
export function drawDevilAura(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  if (!p.passives.some((id) => id.startsWith("devil"))) return;
  const x = snap(p.x);
  const y = snap(p.y);
  const t = s.tick;
  const pulse = 0.5 + 0.2 * Math.sin(t / 10);
  if (p.passives.includes("devilSpots")) {
    ctx.fillStyle = alpha("#000000", 0.35);
    ctx.beginPath();
    ctx.ellipse(x, y + 2, p.r + 7, p.r + 3, 0, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = alpha("#120814", 0.6);
      ctx.fillRect(Math.round(x + Math.cos(t / 20 + i * 1.6) * (p.r + 4)), Math.round(y - 4 - ((t + i * 15) % 30) / 2), 2, 2);
    }
  }
  additive(ctx, () => {
    if (p.passives.includes("devilScream")) glow(ctx, x, y, p.r + 10, "#3a7aff", pulse * 0.6, 0.2);
    if (p.passives.includes("devilCross")) glow(ctx, x, y, p.r + 8, BLOOD, pulse * 0.7, 0.2);
  });
  if (p.passives.includes("devilReaper")) crescent(ctx, x - 8, y - 6, 9, -2.2 + Math.sin(t / 30) * 0.2, 1.3, 2, "#140a18", 0.85);
}

/** 어둠 위에: 악마의 방 석상 (붉은 눈·촛불이 어둠 속에 보임) */
export function drawVaultOverlay(ctx: Ctx, s: RunState): void {
  if (s.map.rooms[s.roomId]?.type === "devil") drawDevilStatue(ctx, s, ROOM_WIDTH / 2);
}
