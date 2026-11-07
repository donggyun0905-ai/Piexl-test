// 비르디아 공생 정령 픽셀 그림 10종 (factionFx.drawFactionBody가 부름): 어깨 위에 떠다니는 정령(햇살·꽃·가시·여우·꾸러미 셋) · 따로 다니는 동행(숲늑대·부엉이·이끼 골렘)
// 한 칸 = 2px · 자랄수록(꽃·나무 단계) 둘레 빛이 커짐 · 숫자는 색 번호 (0 = 빈칸)
import type { RunState, SpiritId } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, glow, type Ctx } from "./pwFxBits";

const ART: Record<SpiritId, { rows: string[]; col: string[]; glow: string }> = {
  sun: { rows: ["0010100", "0122210", "1223221", "0122210", "0010100"], col: ["", "#ffb84a", "#ffd86a", "#fff4c0"], glow: "#ffd86a" },
  bloom: { rows: ["01010", "12121", "01310", "00400", "04440"], col: ["", "#ff9ad8", "#ffd0ec", "#ffe86a", "#3a9a4a"], glow: "#ff9ad8" },
  thorn: { rows: ["1001001", "0122210", "1223221", "0122210", "1001001"], col: ["", "#2a6a2a", "#4ac86a", "#c8ff8a"], glow: "#6ae07a" },
  fox: { rows: ["1000001", "1100011", "1222221", "0232320", "0022200", "0002000"], col: ["", "#c85a1a", "#ff8a3a", "#1a1010"], glow: "#d88aff" },
  bag: { rows: ["00110", "01221", "12221", "12321", "01110"], col: ["", "#6a4a2a", "#a87a4a", "#ffd86a"], glow: "#8ad8ff" },
  chest: { rows: ["0111110", "1222221", "1333331", "1224221", "1222221", "0111110"], col: ["", "#5a3a1a", "#a8723c", "#ffd86a", "#fff4c0"], glow: "#ffd86a" },
  glutton: { rows: ["0111110", "1222221", "1232321", "1222221", "1244421", "0111110"], col: ["", "#2a6a3a", "#6ae07a", "#1a1010", "#ff6a8a"], glow: "#6ae07a" },
  wolf: { rows: ["10000001", "11000011", "12222221", "02322320", "02222220", "00244200", "02200220"], col: ["", "#3a4a3a", "#7a8a7a", "#ffe86a", "#1a1a1a"], glow: "#6ae07a" },
  owl: { rows: ["1000001", "1222221", "2343432", "2222222", "0255520", "0022200", "0060600"], col: ["", "#5a3a2a", "#9a6a4a", "#fff4c0", "#1a1010", "#d8b88a", "#ffb84a"], glow: "#fff4c0" },
  golem: { rows: ["00111100", "01222210", "12322321", "12222221", "11444411", "01222210", "11100111"], col: ["", "#4a5a3a", "#7a8a5a", "#c8ff8a", "#3a9a4a"], glow: "#6ae07a" },
};

function sprite(ctx: Ctx, id: SpiritId, x: number, y: number, flip = false): void {
  const a = ART[id];
  const w = a.rows[0]!.length;
  const h = a.rows.length;
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const v = Number(a.rows[r]![c]);
      if (!v) continue;
      ctx.fillStyle = a.col[v]!;
      ctx.fillRect(Math.round(x + ((flip ? w - 1 - c : c) - w / 2) * 2), Math.round(y + (r - h / 2) * 2), 2, 2);
    }
  }
}

export function drawSpirit(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  const id = p.fcSp;
  if (!id) return;
  const st = (p.fcSpKills ?? 0) >= 80 ? 2 : (p.fcSpKills ?? 0) >= 30 ? 1 : 0;
  const t = s.tick;
  const c = p.fcCo;
  if ((id === "wolf" || id === "owl" || id === "golem") && c) {
    const lift = id === "owl" ? -10 + Math.sin(t * 0.15) * 3 : 0;
    const x = snap(c.x);
    const y = snap(c.y + lift);
    if (id !== "owl") {
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(x - 7, y + 7, 14, 3);
    }
    additive(ctx, () => glow(ctx, x, y, 10 + st * 4, ART[id].glow, 0.25 + st * 0.1, 0.2));
    sprite(ctx, id, x, y, c.x < p.x);
    return;
  }
  if (p.fcSpX === undefined || p.fcSpY === undefined) return;
  const x = snap(p.fcSpX);
  const y = snap(p.fcSpY + Math.sin(t * 0.08) * 2);
  additive(ctx, () => glow(ctx, x, y, 12 + st * 4, ART[id].glow, 0.3 + st * 0.1, 0.3));
  sprite(ctx, id, x, y);
}
