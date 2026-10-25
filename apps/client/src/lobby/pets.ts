// 로비 펫: 고양이 · 강아지 · 슬라임 · 아기 용 · 토끼 · 병아리. 시간 t만으로 움직임, 가끔 하트·음표
import { r } from "./lobbyItems";
import { drawPetArt as draw, type PetKind } from "./petArt";

type Ctx = CanvasRenderingContext2D;

interface Pet {
  kind: PetKind;
  /** 오가는 두 자리 */
  a: readonly [number, number];
  b: readonly [number, number];
  speed: number;
  off: number;
}

const PETS: readonly Pet[] = [
  { kind: "cat", a: [60, 182], b: [120, 186], speed: 0.4, off: 0 },
  { kind: "dog", a: [140, 190], b: [200, 196], speed: 0.7, off: 1 },
  { kind: "slime", a: [40, 140], b: [52, 172], speed: 0.3, off: 2 },
  { kind: "dragon", a: [130, 82], b: [210, 92], speed: 0.5, off: 0.5 },
  { kind: "bunny", a: [230, 150], b: [250, 196], speed: 0.45, off: 3 },
  { kind: "chick", a: [100, 120], b: [128, 128], speed: 0.6, off: 4 },
];

function at(p: Pet, t: number) {
  const tt = t * p.speed + p.off;
  const k = (Math.sin(tt) + 1) / 2;
  const face = Math.cos(tt) >= 0 ? (p.b[0] >= p.a[0] ? 1 : -1) : p.b[0] >= p.a[0] ? -1 : 1;
  return { x: p.a[0] + (p.b[0] - p.a[0]) * k, y: p.a[1] + (p.b[1] - p.a[1]) * k, face, tt };
}

/** 하트·음표가 가끔 떠오름 */
function emote(ctx: Ctx, x: number, y: number, tt: number, kind: PetKind): void {
  const c = tt % 6;
  if (c > 1.4) return;
  const up = c * 6;
  const col = kind === "dragon" ? "#ffd040" : "#ff6a9a";
  r(ctx, x - 2, y - 14 - up, 2, 2, col);
  r(ctx, x + 1, y - 14 - up, 2, 2, col);
  r(ctx, x - 2, y - 12 - up, 5, 1, col);
  r(ctx, x - 1, y - 11 - up, 3, 1, col);
  r(ctx, x, y - 10 - up, 1, 1, col);
}

export function petDrawers(ctx: Ctx, t: number): { y: number; draw: () => void }[] {
  return PETS.map((p) => {
    const { x, y, face, tt } = at(p, t);
    return {
      y,
      draw: () => {
        draw(ctx, p.kind, Math.round(x), Math.round(y), face, t + p.off);
        emote(ctx, Math.round(x), Math.round(y), tt, p.kind);
      },
    };
  });
}
