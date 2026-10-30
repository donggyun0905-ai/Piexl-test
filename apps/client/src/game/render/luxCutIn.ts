// 빛의 사도 성장 연출: 조각 6개마다 성장하는 순간 화면 가운데 띠에 일러스트(사용자 그림 sprites/illust/lux_face.webp)가 미끄러져 들어옴
// 그리기 전용 기억 (게임 계산과 무관) · 게임 틱 기준이라 멈추면 같이 멈춤
import { luxStage, type RunState } from "@pixel-rogue/shared";
import { lightSword } from "./lux";
import { additive, glow } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;
const LEN = 120;
const img = new Image();
img.src = `${import.meta.env.BASE_URL}sprites/illust/lux_face.webp`;
let seen = 0;
let from = -1;
let lastTick = 0;

/** 화면 띠 연출 (drawLuxHud에서, HUD 크기 단위 w·h) */
export function drawLuxCutIn(ctx: Ctx, s: RunState, w: number, h: number): void {
  const st = luxStage(s.player);
  // 새 판(틱이 거꾸로 감)이면 다시 셈
  if (s.tick < lastTick || st < seen) seen = st;
  lastTick = s.tick;
  if (st > seen) {
    seen = st;
    from = s.tick;
  }
  const t = (s.tick - from) / LEN;
  if (from < 0 || t < 0 || t >= 1) return;
  const ease = 1 - (1 - Math.min(1, t / 0.18)) ** 3;
  const fade = t < 0.1 ? t / 0.1 : t > 0.85 ? (1 - t) / 0.15 : 1;
  const bh = Math.min(90, h * 0.3);
  const cy = h * 0.4;
  ctx.save();
  ctx.globalAlpha = fade;
  // 어두운 띠 · 금빛 위아래 줄
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, "rgba(10, 8, 16, 0.2)");
  g.addColorStop(0.35, "rgba(10, 8, 16, 0.9)");
  g.addColorStop(1, "rgba(10, 8, 16, 0.95)");
  ctx.fillStyle = g;
  ctx.fillRect(0, cy - bh / 2, w, bh);
  ctx.fillStyle = "#ffc84a";
  ctx.fillRect(0, cy - bh / 2 - 1, w * ease, 1);
  ctx.fillRect(w * (1 - ease), cy + bh / 2, w * ease, 1);
  // 일러스트: 오른쪽에서 미끄러져 들어옴 (띠 안에서만)
  if (img.complete && img.naturalWidth) {
    const iw = bh * (img.naturalWidth / img.naturalHeight);
    const ix = w - iw - 8 + (1 - ease) * 80;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, cy - bh / 2, w, bh);
    ctx.clip();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, ix, cy - bh / 2, iw, bh);
    // 왼쪽 끝을 띠 색으로 부드럽게
    const e = ctx.createLinearGradient(ix, 0, ix + iw * 0.3, 0);
    e.addColorStop(0, "rgba(10, 8, 16, 1)");
    e.addColorStop(1, "rgba(10, 8, 16, 0)");
    ctx.fillStyle = e;
    ctx.fillRect(ix, cy - bh / 2, iw * 0.3, bh);
    ctx.restore();
  }
  // 글자: 성장 단계 · 이름
  const tx = 16 + (1 - ease) * -40;
  ctx.textBaseline = "middle";
  ctx.font = "bold 18px serif";
  ctx.fillStyle = "#ffe060";
  ctx.fillText(`STAGE ${st}`, tx + 22, cy - 8);
  ctx.font = "9px serif";
  ctx.fillStyle = "#fffbe8";
  ctx.fillText("APOSTLE OF LIGHT · AWAKENING", tx + 22, cy + 12);
  lightSword(ctx, tx + 8, cy - 2, 9, (s.tick * 0.03) % (Math.PI / 2), fade);
  // 띠 위로 흩날리는 빛
  additive(ctx, () => {
    for (let i = 0; i < 10; i++) {
      const k = (t * 1.6 + i * 0.1) % 1;
      glow(ctx, ((i * 97) % 100) / 100 * w, cy + bh / 2 - k * bh, 1.6, i % 2 ? "#ffe060" : "#ff8a1a", fade * (1 - k));
    }
  });
  ctx.restore();
}
