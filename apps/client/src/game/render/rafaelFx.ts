// 라파엘 기술 효과 — 폭풍의 사수 (하늘색 에테르 · 흰 빛 · 금 · 폭풍 회청). 그림 도구는 rafaelArt
// 화살(빛의 화살 + 바람 꼬리) · 저격(감아 도는 바람 리본·에테르 렌즈 고리·꿰뚫는 섬광) · 돌풍(휘감는 바람 초승달·깃털) · 폭풍 화살비(사선으로 쏟아지는 화살·땅의 튐)
// 스코프(겹쳐지는 렌즈) · 모으기 · 천공의 빛 화살(거대한 빛의 화살·나선 바람·뒤에 남는 빛길) · 끝 폭발(십자 섬광·빛 기둥·깃털) · 표적 맞힘
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, easeOut, glow, rune, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { feather, hash, lightArrow, RF, starFlare, windHelix } from "./rafaelArt";

export { RF } from "./rafaelArt";
const RF_FX = new Set(["rfArrowFx", "rfGustFx", "rfStormFx", "rfScopeFx", "rfChargeFx", "rfHeavenFx", "rfBlastFx", "rfMarkFx"]);

/** 빛 꼬리: (x,y)→(tx,ty) 굵기 w, 끝(머리)으로 갈수록 밝고 굵게 */
function trail(ctx: Ctx, x: number, y: number, tx: number, ty: number, w: number, c: string, al: number): void {
  additive(ctx, () => {
    const g = ctx.createLinearGradient(x, y, tx, ty);
    g.addColorStop(0, alpha(c, 0));
    g.addColorStop(1, alpha(c, 0.7 * al));
    ctx.strokeStyle = g;
    ctx.lineCap = "round";
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.lineCap = "butt";
  });
}

export function drawRafaelFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!RF_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = f < 0.3 ? 1 : 1 - (f - 0.3) / 0.7;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = Math.atan2(fx.dirY, fx.dirX);
  const r = fx.size;
  const seed = Math.abs(Math.round(fx.x * 7 + fx.y * 3));
  const tx = snap(fx.toX ?? fx.x);
  const ty = snap(fx.toY ?? fx.y);
  switch (fx.kind) {
    case "rfArrowFx": {
      if (fx.style !== 1) {
        // 화살: 빛의 화살이 날아가며 뒤로 하늘빛 꼬리 · 닿은 자리 작은 섬광
        const fly = easeOut(Math.min(1, f * 2.6));
        const hx = x + (tx - x) * fly;
        const hy = y + (ty - y) * fly;
        const back = Math.max(0, fly - 0.45);
        trail(ctx, x + (tx - x) * back, y + (ty - y) * back, hx, hy, 3, RF.sky, fade);
        if (fly < 1) lightArrow(ctx, hx, hy, a, 12, 1.2, fade);
        else starFlare(ctx, tx, ty, 7 * (1 - f) + 3, RF.sky, fade);
        return true;
      }
      // 저격: 시위에서 겹쳐 퍼지는 에테르 렌즈 고리 · 굵은 빛줄기를 감아 도는 바람 리본 · 끝 섬광
      const fly = easeOut(Math.min(1, f * 4));
      const hx = x + (tx - x) * fly;
      const hy = y + (ty - y) * fly;
      additive(ctx, () => {
        for (let i = 0; i < 3; i++) {
          const rr = 5 + i * 4 + f * 10;
          ctx.strokeStyle = alpha(i % 2 ? RF.white : RF.ether, fade * (1 - i * 0.25));
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(x + Math.cos(a) * (6 + i * 5), y + Math.sin(a) * (6 + i * 5) * 0.6, rr * 0.35, rr, a, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      trail(ctx, x, y, hx, hy, 7 * (1 - f * 0.6), RF.ether, fade);
      trail(ctx, x, y, hx, hy, 2.5, RF.white, fade);
      windHelix(ctx, x, y, hx, hy, 6 * (1 - f * 0.5), f * 14, fade, RF.sky);
      if (fly < 1) lightArrow(ctx, hx, hy, a, 18, 2, fade, RF.ether);
      else starFlare(ctx, tx, ty, 16 * (1 - f) + 5, RF.ether, fade);
      return true;
    }
    case "rfGustFx": {
      // 돌풍: 휘감아 퍼지는 바람 초승달 넷 · 흩날리는 빛 깃털
      const k = easeOut(f);
      additive(ctx, () => {
        for (let i = 0; i < 4; i++) {
          const rr = r * (0.4 + 0.7 * k) * (1 - i * 0.12);
          const st = a + i * 1.6 + k * 2.5;
          ctx.strokeStyle = alpha(i % 2 ? RF.white : RF.sky, fade * 0.8);
          ctx.lineWidth = 2.5 - i * 0.4;
          ctx.beginPath();
          ctx.ellipse(x, y - 4, rr, rr * 0.55, 0, st, st + 1.9);
          ctx.stroke();
        }
        for (let i = 0; i < 7; i++) {
          const ang = hash(seed + i) * Math.PI * 2;
          const d = r * (0.3 + k * hash(seed + i * 5));
          feather(ctx, x + Math.cos(ang) * d, y - 6 + Math.sin(ang) * d * 0.55 - k * 10, ang + k * 4, 4, i % 2 ? RF.white : RF.gold, fade);
        }
      });
      return true;
    }
    case "rfStormFx": {
      if (fx.style === 0) {
        // 예고: 하늘색 과녁 문양이 조여 들며 짙은 폭풍 그림자
        additive(ctx, () => {
          rune(ctx, x, y, r * (1.25 - 0.3 * f), RF.sky, 0.4 + 0.5 * f, f * 2);
          glow(ctx, x, y, r * 0.6, RF.storm, 0.3 * f);
        });
        return true;
      }
      // 한 차례: 자리마다 다른 곳에 사선으로 쏟아지는 빛의 화살 (차례마다 위치·때가 다름) · 꽂힌 자리 작은 튐
      const wave = Math.round(fx.dirX);
      for (let i = 0; i < 12; i++) {
        const sd = seed * 31 + wave * 977 + i * 13;
        const ang = hash(sd) * Math.PI * 2;
        const d = Math.sqrt(hash(sd + 1)) * r;
        const gx = x + Math.cos(ang) * d;
        const gy = y + Math.sin(ang) * d * 0.55;
        const start = hash(sd + 2) * 0.45;
        const u = (f - start) / 0.3;
        if (u < 0) continue;
        if (u < 1) {
          const k = easeOut(u);
          const hx = gx + 22 * (1 - k);
          const hy = gy - 80 * (1 - k);
          trail(ctx, hx + 9, hy - 32, hx, hy, 2, RF.sky, 1);
          lightArrow(ctx, hx, hy, Math.atan2(80, -22), 9, 1, 1);
        } else {
          const v = Math.min(1, (u - 1) / 1.2);
          additive(ctx, () => {
            ctx.strokeStyle = alpha(RF.sky, 1 - v);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(gx, gy, 3 + v * 7, (3 + v * 7) * 0.45, 0, 0, Math.PI * 2);
            ctx.stroke();
            glow(ctx, gx, gy, 4 * (1 - v) + 1, RF.white, 1 - v);
          });
          // 꽂혀 사라지는 화살 끝
          ctx.fillStyle = alpha(RF.gold, 1 - v);
          ctx.fillRect(Math.round(gx), Math.round(gy - 5), 1, 5);
        }
      }
      return true;
    }
    case "rfScopeFx": {
      // 에테르 스코프: 눈앞에서 크기가 다른 렌즈 고리 셋이 겹쳐지며 맞춰짐 · 십자선 반짝
      const k = easeOut(f);
      const lx = x + fx.dirX * 10;
      const ly = y - 12;
      additive(ctx, () => {
        for (let i = 0; i < 3; i++) {
          const rr = 14 - i * 4 + (1 - k) * (8 + i * 6);
          ctx.strokeStyle = alpha(i === 1 ? RF.white : RF.ether, fade * 0.9);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(lx + fx.dirX * (1 - k) * (i - 1) * 8, ly, rr, 0, Math.PI * 2);
          ctx.stroke();
        }
        starFlare(ctx, lx, ly, 10 * k, RF.ether, fade);
        rune(ctx, x, y, 34 * k, RF.ether, fade * 0.5, f * 3);
      });
      return true;
    }
    case "rfChargeFx": {
      // 모으기: 발밑 문양이 조여 들고 바깥에서 빛 알갱이가 빨려 듦 (활끝 빛은 rafaelBody)
      additive(ctx, () => {
        rune(ctx, x, y, r * (1.4 - 0.6 * f), RF.light, 0.4 + 0.5 * f, f * 4);
        rune(ctx, x, y, r * (0.7 - 0.3 * f), RF.sky, 0.3 + 0.5 * f, -f * 6);
        for (let i = 0; i < 16; i++) {
          const ang = hash(seed + i) * Math.PI * 2 + f * 2;
          const d = 70 * (1 - ((f + hash(seed + i * 3)) % 1));
          ctx.fillStyle = alpha(i % 3 ? RF.sky : RF.gold, 0.9);
          ctx.fillRect(Math.round(x + Math.cos(ang) * d), Math.round(y - 10 + Math.sin(ang) * d * 0.6), 1, 1);
        }
      });
      return true;
    }
    case "rfHeavenFx": {
      // 천공의 빛 화살: 거대한 빛의 화살이 방을 가로지름 · 나선 바람 두 가닥 · 지나간 뒤 금빛 빛길이 천천히 사라짐 · 쏜 자리 섬광
      const fly = easeOut(Math.min(1, f * 3));
      const hx = x + (tx - x) * fly;
      const hy = y - 8 + (ty - y) * fly;
      const k = 1 - f;
      trail(ctx, x, y - 8, hx, hy, r * 1.2 * k, RF.gold, fade * 0.7);
      trail(ctx, x, y - 8, hx, hy, r * 0.5 * k + 1, RF.sky, fade);
      trail(ctx, x, y - 8, hx, hy, 2, RF.white, fade);
      windHelix(ctx, x, y - 8, hx, hy, r * 0.9, f * 20, fade, RF.sky);
      windHelix(ctx, x, y - 8, hx, hy, r * 0.55, -f * 26, fade, RF.light);
      additive(ctx, () => {
        // 빛길을 따라 떠오르는 빛 알갱이
        for (let i = 0; i < 24; i++) {
          const u = hash(seed + i) * fly;
          const px = x + (tx - x) * u + (hash(seed + i * 7) - 0.5) * r * 2;
          const py = y - 8 + (ty - y) * u + (hash(seed + i * 11) - 0.5) * r - f * 12;
          ctx.fillStyle = alpha(i % 3 ? RF.light : RF.white, fade);
          ctx.fillRect(Math.round(px), Math.round(py), 1, 1);
        }
        glow(ctx, x, y - 8, r * 1.5 * k + 6, RF.light, fade, 0.5 * k);
      });
      if (fly < 1) lightArrow(ctx, hx, hy, a, r * 5, r * 0.45, 1, RF.gold);
      if (f < 0.25) starFlare(ctx, x, y - 8, 40 * (1 - f * 4), RF.light, 1 - f * 4);
      return true;
    }
    case "rfBlastFx": {
      // 끝 폭발: 커다란 십자 섬광 · 하늘·금 고리 두 겹 · 솟는 빛 기둥 · 흩날리는 깃털
      const k = easeOut(f);
      starFlare(ctx, x, y - 8, r * 1.4 * (1 - f) + 6, RF.light, fade);
      additive(ctx, () => {
        shock(ctx, x, y, r * k, RF.sky, fade, 3);
        shock(ctx, x, y, r * 0.65 * k, RF.gold, fade * 0.8, 2);
        const pw = 10 * (1 - f) + 2;
        const g = ctx.createLinearGradient(x, y, x, y - 120);
        g.addColorStop(0, alpha(RF.white, 0.8 * fade));
        g.addColorStop(1, alpha(RF.sky, 0));
        ctx.fillStyle = g;
        ctx.fillRect(x - pw / 2, y - 120, pw, 120);
        for (let i = 0; i < 10; i++) {
          const ang = hash(seed + i) * Math.PI * 2;
          const d = r * k * (0.5 + 0.5 * hash(seed + i * 3));
          feather(ctx, x + Math.cos(ang) * d, y - 6 + Math.sin(ang) * d * 0.55 - k * 14, ang + f * 5, 4, i % 2 ? RF.gold : RF.white, fade);
        }
        sparks(ctx, x, y - 6, 16, r * 1.2, f, RF.sky, seed, fade);
      });
      return true;
    }
    case "rfMarkFx": {
      // 표적 맞힘: 붉은 과녁 꺾쇠가 안으로 탁 조여 들며 번쩍
      const k = easeOut(f);
      const d = r * (1.6 - 0.8 * k);
      additive(ctx, () => {
        ctx.strokeStyle = alpha(RF.red, fade);
        ctx.lineWidth = 1.5;
        for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) {
          const cx = x + sx * d;
          const cy = y - 4 + sy * d * 0.8;
          ctx.beginPath();
          ctx.moveTo(cx - sx * 4, cy);
          ctx.lineTo(cx, cy);
          ctx.lineTo(cx, cy - sy * 4);
          ctx.stroke();
        }
        glow(ctx, x, y - 4, 6 * (1 - f) + 2, RF.red, fade * 0.6);
      });
      return true;
    }
  }
  return false;
}
