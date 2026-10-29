// 패왕전 성장 대결 지도 (쟁탈전·전쟁의 서막): 오른쪽 아래 작은 미니맵 · 전쟁의 서막 포털(F)에서 여는 큰 지도(체크포인트를 눌러 순간이동)
// 벽·집·포탑·체크포인트 · 우리 편(파랑)·나(노랑) · 상대(빨강)는 우리 편 누군가가 보고 있을 때만 이름과 함께 (안개·수풀 은신은 안 보임)
import { allPlayers, inPlay, PW, PW_ARENAS, pwGrid, spotXY, TILE_SIZE, TILE_WALL, tileAt, type RunState } from "@pixel-rogue/shared";
import { useEffect, useRef } from "react";
import { pwShown } from "../game/render/pwLook";
import type { TextKey } from "../i18n";

interface Props {
  run: RunState;
  me: number;
  /** 한 칸의 화면 픽셀 */
  cell: number;
  t: (k: TextKey) => string;
  /** 큰 지도: 체크포인트를 누름 */
  onPoint?: (k: number) => void;
  className?: string;
}

/** 우리 편 누군가에게 보이는 상대인지 (보이는 거리 안 + 수풀·안개·투명 아님) */
export function spotted(run: RunState, me: number, j: number): boolean {
  const pv = run.pvp!;
  const ps = allPlayers(run);
  const q = ps[j]!;
  if (!inPlay(run, j) || pwShown(run, j) === 0) return false;
  const team = pv.seats[me]!.team;
  return ps.some((p, i) => pv.seats[i]!.team === team && inPlay(run, i) && (p.x - q.x) ** 2 + (p.y - q.y) ** 2 <= PW.sight ** 2);
}

export function PwMapView({ run, me, cell, t, onPoint, className = "pw-minimap" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pv = run.pvp!;
  const a = PW_ARENAS[pv.arena];
  const mine = pv.seats[me]!.team;
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const k = cell / TILE_SIZE;
    const px = (v: number) => v * k;
    const g = pwGrid(pv.arena);
    ctx.fillStyle = "#2a3a2a";
    ctx.fillRect(0, 0, a.cols * cell, a.rows * cell);
    ctx.fillStyle = "#14121a";
    for (let r = 0; r < a.rows; r++) for (let c = 0; c < a.cols; c++) if (tileAt(g, c, r) === TILE_WALL) ctx.fillRect(c * cell, r * cell, cell, cell);
    const col = (team: number) => (team === mine ? "#5ab0ff" : "#ff5a5a");
    (a.homes ?? []).forEach((h, team) => {
      const [x, y] = spotXY(h);
      ctx.fillStyle = col(team);
      ctx.fillRect(px(x) - 4, px(y) - 4, 8, 8);
    });
    (a.points ?? []).forEach((pt, i) => {
      const [x, y] = spotXY(pt.at);
      const own = pv.grow?.points?.[i]?.owner ?? -1;
      ctx.strokeStyle = own < 0 ? "#d8d8e8" : col(own);
      ctx.lineWidth = onPoint ? 3 : 1.5;
      ctx.beginPath();
      ctx.arc(px(x), px(y), onPoint ? 12 : 4, 0, Math.PI * 2);
      ctx.stroke();
    });
    for (const u of pv.grow?.units ?? []) {
      if (u.kind !== "tower" || u.body.hp <= 0) continue;
      ctx.fillStyle = col(u.team);
      ctx.fillRect(px(u.body.x) - 2, px(u.body.y) - 2, 4, 4);
    }
    ctx.font = `bold ${onPoint ? 12 : 9}px sans-serif`;
    ctx.textAlign = "center";
    allPlayers(run).forEach((p, i) => {
      const ours = pv.seats[i]!.team === mine;
      if (!inPlay(run, i) || (!ours && !spotted(run, me, i))) return;
      ctx.fillStyle = i === me ? "#ffe040" : col(pv.seats[i]!.team);
      ctx.beginPath();
      ctx.arc(px(p.x), px(p.y), i === me ? 3.5 : 2.5, 0, Math.PI * 2);
      ctx.fill();
      // 발견한 상대는 캐릭터 이름
      if (!ours) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        const name = t(p.characterId as TextKey);
        ctx.strokeText(name, px(p.x), px(p.y) - 5);
        ctx.fillText(name, px(p.x), px(p.y) - 5);
      }
    });
  });
  const click = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onPoint) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * a.cols * TILE_SIZE;
    const y = ((e.clientY - r.top) / r.height) * a.rows * TILE_SIZE;
    const k = (a.points ?? []).findIndex((pt) => {
      const [px, py] = spotXY(pt.at);
      return (px - x) ** 2 + (py - y) ** 2 < 48 * 48 && pv.grow?.points?.[a.points!.indexOf(pt)]?.owner === mine;
    });
    if (k >= 0) onPoint(k);
  };
  return <canvas ref={ref} className={className} width={a.cols * cell} height={a.rows * cell} onClick={click} aria-hidden={!onPoint} />;
}
