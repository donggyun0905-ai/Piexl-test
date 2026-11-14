// 나라마다 코드로 얹는 효과 (그림에는 빛·그림자를 넣지 않음, docs/WORLD_ART.md 같은 규칙)
// 바람(지역마다 세기 · 흔들리는 그림은 윗부분을 띠로 나눠 위로 갈수록 더 기울임) · 한 방향 그림자(해는 왼쪽 위 → 오른쪽 아래로 눕힌 그림자)
// 색 보정 · 나라별 입자(눈·반딧불·모래바람·그을음) — 지옥 불씨·해저 거품·비·꽃잎·금빛은 worldMood
// 입자 자리는 시간·번호로만 정함 (랜덤 없음)
import type { View } from "../lobby/walker";

type Ctx = CanvasRenderingContext2D;
export type Weather = "snow" | "fireflies" | "dust" | "soot";
interface Look {
  /** 바람 세기 (1 = 보통, 0 = 안 흔들림) */
  wind: number;
  /** 화면 전체 색 보정 */
  grade?: string;
  weather?: Weather;
}

/** 나라·지역 필드마다 (건물 안은 바람·그림자 없음) */
const LOOKS: Record<string, Look> = {
  ascalon: { wind: 1 },
  terracore: { wind: 0.6, grade: "rgba(90,70,50,0.10)", weather: "soot" },
  virdia: { wind: 0.8, grade: "rgba(40,110,60,0.08)", weather: "fireflies" },
  helios: { wind: 0.7, grade: "rgba(255,200,110,0.07)" },
  desert: { wind: 1.4, grade: "rgba(255,170,70,0.10)", weather: "dust" },
  silber: { wind: 1.3, grade: "rgba(150,190,255,0.12)", weather: "snow" },
  thalassia: { wind: 1.2, grade: "rgba(90,170,220,0.06)" },
  windtown: { wind: 2 },
  undersea: { wind: 0.5 },
  hell: { wind: 0.4 },
  cyber: { wind: 0.6 },
  seongguk: { wind: 0.8 },
};

let look: Look = LOOKS.ascalon!;
let outdoor = true;
/** 지역이 바뀔 때 (WorldStage) */
export function setLook(regionId: string, indoor: boolean): void {
  outdoor = !indoor;
  look = indoor ? { wind: 0 } : (LOOKS[regionId] ?? { wind: 1 });
}
export const windNow = (): number => look.wind;

/** 지금 바람에 기운 정도 (-0.3~1.3 × 세기, 서풍이라 주로 오른쪽 · x마다 돌풍이 지나감) */
export function gust(t: number, x: number): number {
  return look.wind * (Math.sin(t * 1.3 + x * 0.013) * 0.6 + Math.sin(t * 0.41 + x * 0.004) * 0.4 + 0.3);
}

/** 흔들리는 그림: 아래 fixed 비율은 그대로, 위는 띠 넷으로 나눠 위로 갈수록 amp 픽셀까지 기울임 (l, tp, w, h = 그릴 자리) */
export function drawSway(g: Ctx, img: CanvasImageSource & { naturalHeight?: number; height: number; width: number }, l: number, tp: number, w: number, h: number, t: number, amp = 1.5, fixed = 0.3): void {
  const iw = img.width;
  const ih = img.naturalHeight || img.height;
  const cut = Math.round(ih * (1 - fixed));
  g.drawImage(img, 0, cut, iw, ih - cut, l, tp + (cut / ih) * h, w, h - (cut / ih) * h);
  const s = gust(t, l) * amp;
  const B = 4;
  for (let i = 0; i < B; i++) {
    const sy = Math.round((cut * i) / B);
    const ey = Math.round((cut * (i + 1)) / B);
    const dx = Math.round(s * ((B - i) / B) ** 1.5);
    g.drawImage(img, 0, sy, iw, ey - sy, l + dx, tp + (sy / ih) * h, w, ((ey - sy) / ih) * h);
  }
}

/** 그림 모양 그대로 검게 만든 것 (그림자용, 그림마다 한 번) */
const sil = new WeakMap<object, HTMLCanvasElement>();
function silhouette(img: HTMLImageElement | HTMLCanvasElement): HTMLCanvasElement {
  let c = sil.get(img);
  if (!c) {
    c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const g = c.getContext("2d")!;
    g.drawImage(img, 0, 0);
    g.globalCompositeOperation = "source-in";
    g.fillStyle = "#101810";
    g.fillRect(0, 0, c.width, c.height);
    sil.set(img, c);
  }
  return c;
}

/** 한 방향 그림자: 발(footX, footY)에서 오른쪽 아래로 눕힘 (w, h = 그림을 그린 크기) · 건물 안은 안 그림 */
export function castShadow(g: Ctx, img: HTMLImageElement | HTMLCanvasElement, footX: number, footY: number, w: number, h: number, a = 0.22): void {
  if (!outdoor || !img.width) return;
  g.save();
  g.globalAlpha = a;
  g.transform(1, 0, -0.55, -0.32, footX, footY);
  g.drawImage(silhouette(img), -w / 2, -h, w, h);
  g.restore();
}

/** 정해진 수 0~1 */
const fr = (n: number): number => {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

/** 색 보정 · 나라별 입자 (지도 좌표 view, 사람 위에) */
export function drawWeather(g: Ctx, v: View, t: number): void {
  if (look.grade) {
    g.fillStyle = look.grade;
    g.fillRect(v.x, v.y, v.w, v.h);
  }
  const w = look.weather;
  if (!w) return;
  const n = w === "snow" ? 80 : w === "fireflies" ? 24 : w === "dust" ? 50 : 36;
  const period = w === "snow" ? 9 : w === "fireflies" ? 6 : w === "dust" ? 2.5 : 7;
  for (let i = 0; i < n; i++) {
    const k = (t / period + fr(i)) % 1;
    const bx = v.x + fr(i + 0.37) * v.w;
    const by = v.y + fr(i + 0.71) * v.h;
    if (w === "snow") {
      // 천천히 내리며 바람에 옆으로 흔들림 (화면 위아래를 감음)
      const x = bx + Math.sin(t * 0.8 + i) * 5 + k * 30 * look.wind;
      const y = v.y + ((by - v.y + k * v.h) % v.h);
      g.fillStyle = `rgba(255,255,255,${i % 3 ? 0.75 : 0.95})`;
      g.fillRect(x, y, i % 4 ? 1 : 2, i % 4 ? 1 : 2);
    } else if (w === "fireflies") {
      // 제자리에서 맴돌며 깜박이는 연둣빛
      const x = bx + Math.sin(t * 0.7 + i * 2.1) * 10;
      const y = by + Math.sin(t * 0.9 + i * 1.3) * 6;
      const a = Math.max(0, Math.sin(k * Math.PI * 2)) * 0.9;
      const glow = g.createRadialGradient(x, y, 0, x, y, 4);
      glow.addColorStop(0, `rgba(210,255,140,${a})`);
      glow.addColorStop(1, "rgba(210,255,140,0)");
      g.fillStyle = glow;
      g.fillRect(x - 4, y - 4, 8, 8);
    } else if (w === "dust") {
      // 낮게 빠르게 흐르는 모래바람 줄
      const x = v.x + ((bx - v.x + k * v.w) % v.w);
      g.fillStyle = `rgba(240,210,150,${0.35 * Math.sin(k * Math.PI)})`;
      g.fillRect(x, by, 4 + (i % 3) * 2, 1);
    } else {
      // 공장 그을음: 위로 오르며 옆으로 흩어지는 잿빛
      const x = bx + k * 14 * look.wind;
      const y = by - k * 26;
      g.fillStyle = `rgba(60,56,52,${0.5 * (1 - k)})`;
      g.fillRect(x, y, 1, 1);
    }
  }
}
