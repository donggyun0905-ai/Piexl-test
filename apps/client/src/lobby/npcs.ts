// 로비 사람들: 다른 캐릭터들이 각자 뭔가 하는 중 (게임기 하기 · 응원 · 수다 · 춤 · 소파에 앉기 · 산책). 말풍선 그림문자
// 시간 t만으로 자리·모습이 정해짐 (따로 기억할 상태 없음)
import type { CharacterId } from "@pixel-rogue/shared";
import { drawBody } from "../game/render/actors";
import { r } from "./lobbyItems";

type Ctx = CanvasRenderingContext2D;
type Act = "play" | "cheer" | "chat" | "dance" | "sit" | "walk";

interface Npc {
  id: CharacterId;
  act: Act;
  x: number;
  y: number;
  /** 바라보는 쪽 */
  fx: number;
  fy: number;
  /** 말풍선 그림문자 (차례로) */
  say?: readonly string[];
  /** 산책: 오가는 끝 자리 */
  to?: readonly [number, number];
  /** 시간 어긋남 (모두 같은 박자로 움직이지 않게) */
  off: number;
}

const R = 5;

export const NPCS: readonly Npc[] = [
  { id: "drifter", act: "play", x: 120, y: 70, fx: 0, fy: -1, say: ["🎮", "😤"], off: 0.3 },
  { id: "mage", act: "play", x: 216, y: 70, fx: 0, fy: -1, say: ["🍎", "✨"], off: 1.1 },
  { id: "ninja", act: "play", x: 280, y: 70, fx: 0, fy: -1, say: ["🔥"], off: 2.0 },
  { id: "gunner", act: "cheer", x: 297, y: 76, fx: -1, fy: 0, say: ["👏", "🎉"], off: 0.7 },
  { id: "mystic", act: "chat", x: 50, y: 92, fx: 1, fy: 0, say: ["💬", "😆", "🍵"], off: 0 },
  { id: "elementalist", act: "chat", x: 68, y: 92, fx: -1, fy: 0, say: ["💖", "🤭"], off: 1.5 },
  { id: "brawler", act: "dance", x: 148, y: 136, fx: 0, fy: 1, say: ["🎵"], off: 0 },
  { id: "beast", act: "dance", x: 188, y: 136, fx: 0, fy: 1, say: ["🎶"], off: 0.25 },
  { id: "doctor", act: "sit", x: 82, y: 161, fx: 0, fy: 1, say: ["🥤"], off: 0.9 },
  { id: "engineer", act: "sit", x: 95, y: 161, fx: 0, fy: 1, say: ["🔧", "💤"], off: 2.4 },
  { id: "summoner", act: "walk", x: 228, y: 112, fx: 1, fy: 0, to: [262, 150], say: ["🌸"], off: 0 },
  { id: "novice", act: "play", x: 291, y: 106, fx: 1, fy: 0, say: ["🍀", "💰"], off: 1.7 },
  { id: "chronomancer", act: "play", x: 291, y: 148, fx: 1, fy: 0, say: ["🎲"], off: 0.5 },
  { id: "bedouin", act: "dance", x: 168, y: 150, fx: 0, fy: 1, say: ["💃", "🎵"], off: 0.6 },
  { id: "general", act: "cheer", x: 263, y: 76, fx: 1, fy: 0, say: ["⚔️", "👏"], off: 1.3 },
  { id: "imugi", act: "walk", x: 120, y: 120, fx: 1, fy: 0, to: [200, 120], say: ["🐉", "✨"], off: 0.8 },
  { id: "apostle", act: "sit", x: 108, y: 161, fx: 0, fy: 1, say: ["🕯️", "💀"], off: 1.9 },
  { id: "abandoned", act: "walk", x: 60, y: 130, fx: 1, fy: 0, to: [110, 130], say: ["🛡️", "🔫", "🗡️"], off: 0.4 },
  { id: "titan", act: "cheer", x: 230, y: 76, fx: 1, fy: 0, say: ["🦾", "💪"], off: 2.2 },
  { id: "oni", act: "dance", x: 262, y: 96, fx: -1, fy: 0, say: ["👹", "⚡"], off: 3.1 },
];

/** 지금 자리·모습 */
function pose(n: Npc, t: number) {
  const tt = t + n.off;
  let { x, y, fx, fy } = n;
  let moving = false;
  let casting = false;
  switch (n.act) {
    case "play":
      // 게임기 앞에서 버튼을 두드림
      casting = Math.floor(tt * 2.5) % 3 === 0;
      break;
    case "cheer":
      y -= Math.abs(Math.sin(tt * 6)) * 3;
      casting = Math.floor(tt * 3) % 2 === 0;
      break;
    case "chat":
      y -= Math.floor(tt * 2) % 4 === 0 ? 1 : 0;
      break;
    case "dance": {
      // 박자마다 앞 → 옆 → 뒤 → 반대 옆으로 돌며 들썩임
      const beat = Math.floor(tt * 2.2) % 4;
      [fx, fy] = ([[0, 1], [1, 0], [0, -1], [-1, 0]] as const)[beat]!;
      y -= Math.abs(Math.sin(tt * 4.4 * Math.PI / 2)) * 2.5;
      moving = true;
      casting = beat === 0;
      break;
    }
    case "sit":
      break;
    case "walk": {
      // 두 자리 사이를 천천히 오감
      const [x2, y2] = n.to!;
      const k = (Math.sin(tt * 0.35) + 1) / 2;
      const dir = Math.cos(tt * 0.35);
      x = n.x + (x2 - n.x) * k;
      y = n.y + (y2 - n.y) * k;
      fx = Math.sign(x2 - n.x) * Math.sign(dir) || 1;
      fy = 0;
      moving = true;
      break;
    }
  }
  return { x, y, fx, fy, moving, casting, step: Math.floor(tt * 6) };
}

/** 말풍선 (그림문자 하나, 몇 초마다 나왔다 들어감) */
function bubble(ctx: Ctx, n: Npc, x: number, y: number, t: number): void {
  if (!n.say) return;
  const cycle = (t + n.off * 3) % 5;
  if (cycle > 2.6) return;
  const text = n.say[Math.floor((t + n.off * 3) / 5) % n.say.length]!;
  const top = y - 24;
  r(ctx, x - 4, top, 9, 8, "#ffffff");
  r(ctx, x - 3, top - 1, 7, 1, "#ffffff");
  r(ctx, x - 3, top + 8, 7, 1, "#ffffff");
  r(ctx, x - 1, top + 9, 2, 1, "#ffffff");
  ctx.font = "6px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + 0.5, top + 4.5);
}

/** 로비 사람들 그리기 목록 (발 y로 앞뒤 정함) */
export function npcDrawers(ctx: Ctx, t: number): { y: number; draw: () => void }[] {
  return NPCS.map((n) => {
    const p = pose(n, t);
    return {
      y: n.act === "sit" ? n.y - 4 : p.y,
      draw: () => {
        drawBody(ctx, n.id, Math.round(p.x), Math.round(p.y - R), R, { faceX: p.fx, faceY: p.fy, moving: p.moving, casting: p.casting, step: p.step }, 0);
        bubble(ctx, n, Math.round(p.x), Math.round(p.y), t);
      },
    };
  });
}
