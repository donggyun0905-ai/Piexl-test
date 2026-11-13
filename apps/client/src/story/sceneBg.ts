// 스토리 장면 임시 그림 (일러스트가 아직 없을 때): 배경 종류마다 하늘·땅·소품을 픽셀로 그리고, 말하는 캐릭터를 크게 세움
// 꾸밈이라 무늬는 좌표 해시로 (매번 같은 모양)
import { CHARACTERS, type CharacterId } from "@pixel-rogue/shared";
import { drawBody } from "../game/render/actors";
import type { SceneBg } from "./sceneCuts";

/** 그림 크기 (픽셀, 화면에서 늘림) */
export const SCENE_W = 192;
export const SCENE_H = 108;

const PAL: Record<SceneBg, { sky: [string, string]; ground: string; prop: string }> = {
  forest: { sky: ["#9fd6e8", "#d8f0d0"], ground: "#3f7a3a", prop: "#245a2a" },
  castle: { sky: ["#7ab0e8", "#d0e4f4"], ground: "#8a8478", prop: "#6e6880" },
  fire: { sky: ["#3a0a10", "#c8401a"], ground: "#2a1a14", prop: "#ff8a3a" },
  room: { sky: ["#4a3426", "#6a4a32"], ground: "#5a4030", prop: "#e8d8b8" },
  mountain: { sky: ["#4a5a7a", "#a0aac0"], ground: "#5a5048", prop: "#3a3440" },
  night: { sky: ["#0a0a1e", "#2a1a3e"], ground: "#141420", prop: "#7a3aa0" },
  dawn: { sky: ["#f0a878", "#ffe0b0"], ground: "#4a7a3a", prop: "#ffe066" },
  sea: { sky: ["#6ab0f0", "#d0ecff"], ground: "#2a6ab8", prop: "#e8f4ff" },
  temple: { sky: ["#e8d8a8", "#fff4d8"], ground: "#c8b890", prop: "#ffd84a" },
  snow: { sky: ["#a8c0dc", "#eef4fc"], ground: "#e8eef8", prop: "#7a8aa8" },
  abyss: { sky: ["#000000", "#2a0a2a"], ground: "#0a0a0a", prop: "#c83a4a" },
  city: { sky: ["#8ab0c8", "#c8d8e0"], ground: "#5a5a60", prop: "#3a3a44" },
};

const hash = (n: number) => (Math.imul(n, 2654435761) >>> 0) / 4294967296;

/** 배경 + (있으면) 말하는 캐릭터. sheet = 말하는 사람 그림 (storyData speakerSheet, 없으면 null) · t = 초 (불꽃·별 깜박임) */
export function drawSceneBg(g: CanvasRenderingContext2D, bg: SceneBg, sheet: string | null, t: number): void {
  const p = PAL[bg];
  const sky = g.createLinearGradient(0, 0, 0, SCENE_H);
  sky.addColorStop(0, p.sky[0]);
  sky.addColorStop(1, p.sky[1]);
  g.fillStyle = sky;
  g.fillRect(0, 0, SCENE_W, SCENE_H);
  const horizon = bg === "room" ? 70 : 78;
  // 소품
  for (let i = 0; i < 14; i++) {
    const x = Math.floor(hash(i + 1) * SCENE_W);
    const h = 10 + Math.floor(hash(i + 31) * 30);
    g.fillStyle = p.prop;
    if (bg === "forest" || bg === "dawn") {
      g.fillRect(x - 6, horizon - h, 12, h - 4);
      g.fillStyle = "#5a3a22";
      g.fillRect(x - 1, horizon - 6, 2, 6);
    } else if (bg === "mountain" || bg === "snow") {
      for (let k = 0; k < h; k++) g.fillRect(x - k, horizon - h + k, k * 2 + 1, 1);
    } else if (bg === "castle" || bg === "city") {
      g.fillRect(x - 5, horizon - h, 10, h);
      g.fillRect(x - 6, horizon - h - 3, 3, 3);
      g.fillRect(x + 3, horizon - h - 3, 3, 3);
    } else if (bg === "fire") {
      const f = Math.sin(t * 8 + i) > 0 ? 2 : 0;
      g.fillRect(x - 3, horizon - h / 2 - f, 6, h / 2 + f);
      g.fillStyle = "#ffd84a";
      g.fillRect(x - 1, horizon - h / 3, 2, h / 3);
    } else if (bg === "night" || bg === "abyss") {
      if (Math.sin(t * 2 + i * 1.7) > -0.3) g.fillRect(x, Math.floor(hash(i + 7) * 50), 1, 1);
    } else if (bg === "sea") {
      g.fillRect(x, horizon + 4 + (i % 4) * 6, 8, 1);
    } else if (bg === "temple") {
      g.fillRect(x - 2, horizon - 34, 4, 34);
    } else if (bg === "room" && i < 3) {
      g.fillRect(20 + i * 60, 18, 18, 22);
    }
  }
  g.fillStyle = p.ground;
  g.fillRect(0, horizon, SCENE_W, SCENE_H - horizon);
  // 말하는 캐릭터: 가운데에 크게 (2배)
  if (sheet) {
    const id = (sheet in CHARACTERS ? sheet : "abandoned") as CharacterId;
    g.save();
    g.translate(SCENE_W / 2, horizon + 12);
    g.scale(2, 2);
    g.imageSmoothingEnabled = false;
    drawBody(g, id, 0, -5, 5, { faceX: 0, faceY: 1, moving: false, casting: false, step: 0 }, 0, sheet);
    g.restore();
  }
}
