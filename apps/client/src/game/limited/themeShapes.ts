// 테마 효과 조각 모양 (작은 도트·도형): 꽃잎 · 번개 · 눈꽃 · 조각 · 불꽃 · 별 · 하트 · 도트 · 안개 · 음표 · 잎 · 반딧불 · 새싹 · 반짝임 (themeDraw·dmgSkins가 같이 씀)

type Ctx = CanvasRenderingContext2D;

/** 점 찍기 (도트 한 칸 = s) */
function dots(ctx: Ctx, list: readonly (readonly [number, number])[], s: number): void {
  for (const [x, y] of list) ctx.fillRect(Math.round(x * s), Math.round(y * s), Math.max(1, Math.round(s)), Math.max(1, Math.round(s)));
}

const STAR = [[0, -2], [0, -1], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [0, 1], [-1, 2], [1, 2]] as const;
const HEART = [[-1, -1], [1, -1], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [0, 2]] as const;
const FLAKE = [[0, -2], [0, -1], [0, 0], [0, 1], [0, 2], [-2, 0], [-1, 0], [1, 0], [2, 0], [-1, -1], [1, 1], [-1, 1], [1, -1]] as const;
const NOTE = [[1, -3], [1, -2], [2, -2], [1, -1], [1, 0], [0, 1], [1, 1], [-1, 1], [0, 2]] as const;
const LEAF = [[0, -2], [-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [0, 1], [0, 2]] as const;
const SPROUT = [[0, 0], [0, -1], [-1, -2], [1, -2], [-2, -3], [2, -3]] as const;
const SPARKLE = [[0, -2], [0, -1], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [0, 1], [0, 2]] as const;

/** 모양 하나 (가운데 0,0 · 방향 rot · 크기 size) */
export function drawShape(ctx: Ctx, shape: string, size: number, rot: number, color: string, flip = false): void {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  const s = size;
  switch (shape) {
    case "petal":
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, 2.2 * s, 1.1 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "bolt": {
      ctx.rotate(rot);
      ctx.lineWidth = Math.max(1, s * 0.9);
      ctx.beginPath();
      const f = flip ? -1 : 1;
      ctx.moveTo(-1 * s * f, -5 * s);
      ctx.lineTo(1.5 * s * f, -1 * s);
      ctx.lineTo(-1.5 * s * f, 0.5 * s);
      ctx.lineTo(1 * s * f, 5 * s);
      ctx.stroke();
      break;
    }
    case "flake":
      dots(ctx, FLAKE, s);
      break;
    case "shard":
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, -4 * s);
      ctx.lineTo(1.3 * s, 0);
      ctx.lineTo(0, 4 * s);
      ctx.lineTo(-1.3 * s, 0);
      ctx.closePath();
      ctx.fill();
      break;
    case "flame":
      ctx.beginPath();
      ctx.moveTo(0, -5 * s);
      ctx.quadraticCurveTo(3 * s, -1 * s, 0, 3 * s);
      ctx.quadraticCurveTo(-3 * s, -1 * s, 0, -5 * s);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 255, 200, 0.8)";
      ctx.fillRect(-0.5 * s, -0.5 * s, s, 2 * s);
      break;
    case "star":
      dots(ctx, STAR, s);
      break;
    case "heart":
      dots(ctx, HEART, s);
      break;
    case "pix":
      ctx.fillRect(-1.5 * s, -1.5 * s, 3 * s, 3 * s);
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.fillRect(0, 0, 1.5 * s, 1.5 * s);
      break;
    case "mist":
      ctx.globalAlpha *= 0.6;
      ctx.beginPath();
      ctx.arc(0, 0, 3 * s, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "note":
      dots(ctx, NOTE, s);
      break;
    case "leaf":
      ctx.rotate(rot);
      dots(ctx, LEAF, s);
      break;
    case "firefly":
      ctx.globalAlpha *= 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, 2.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha *= 2;
      ctx.fillRect(-0.5, -0.5, 1, 1);
      break;
    case "sprout":
      dots(ctx, SPROUT, s);
      break;
    case "sparkle":
      dots(ctx, SPARKLE, s * 0.7);
      break;
    case "ember":
      ctx.fillRect(-0.5 * s, -0.5 * s, Math.max(1, s), Math.max(1, s));
      break;
    default:
      ctx.fillRect(-s / 2, -s / 2, Math.max(1, s), Math.max(1, s));
  }
}
