// 노선도 창(오른쪽 작은 지도) + 큰 지도: Tab(모바일은 작은 지도를 누름)으로 열고 닫음 · Esc로 닫힘
// 큰 지도에서 방을 누르면 미리 정한 길에 넣음 (지금 방·길 끝 방에서 이어진 방만, game/routePlan) → 파란 테두리
import { useEffect, useRef, useState, type RefObject } from "react";
import { type RunState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import { drawPlan, drawRoute, MINIMAP_BOX_H, MINIMAP_BOX_W, MINIMAP_WIDTH, routeHeight, routeNodePos, ROUTE_NODE_H, ROUTE_NODE_W } from "./minimap";
import { pickRoute, routePlan } from "./routePlan";

/** 큰 지도 배율 */
const BIG = 5;

function drawBig(ctx: CanvasRenderingContext2D, s: RunState): void {
  const plan = routePlan(s);
  const from = plan.length ? plan[plan.length - 1]! : s.roomId;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.setTransform(BIG, 0, 0, BIG, 0, 0);
  drawRoute(ctx, s.map, (id) => s.rooms[id]?.visited === true, s.roomId);
  drawPlan(ctx, s.map, plan, (s.map.rooms[from]?.exits ?? []).filter((n) => n >= 0));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/** 큰 지도에서 누른 자리의 방 */
function roomAt(s: RunState, x: number, y: number): number {
  const r = s.map.rooms.find((o) => {
    if (o.layer < 0) return false;
    const p = routeNodePos(s.map, o.layer, o.lane);
    return x >= p.x - 2 && x <= p.x + ROUTE_NODE_W + 2 && y >= p.y - 2 && y <= p.y + ROUTE_NODE_H + 2;
  });
  return r ? r.id : -1;
}

export function RouteMap(props: { miniRef: RefObject<HTMLCanvasElement | null>; run: () => RunState | null; t: (k: TextKey) => string }) {
  const { miniRef, run, t } = props;
  const [open, setOpen] = useState(false);
  const bigRef = useRef<HTMLCanvasElement>(null);
  // Tab: 열고 닫음 · Esc: 닫음 (열려 있을 때는 일시정지 창이 같이 뜨지 않게 먼저 받음)
  const openRef = useRef(false);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (e.repeat || (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA"))) return;
      if (e.code === "Tab") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.code === "Escape" && openRef.current) {
        e.stopImmediatePropagation();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, []);
  // 열려 있는 동안 계속 다시 그림 (방이 바뀌면 같이)
  useEffect(() => {
    if (!open) return;
    const draw = () => {
      const s = run();
      const ctx = bigRef.current?.getContext("2d");
      if (s && ctx) drawBig(ctx, s);
    };
    draw();
    const id = window.setInterval(draw, 150);
    return () => window.clearInterval(id);
  }, [open, run]);
  const s = run();
  const h = routeHeight(s?.map.layers ?? 10);
  const click = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cur = run();
    const c = bigRef.current;
    if (!cur || !c) return;
    const b = c.getBoundingClientRect();
    const id = roomAt(cur, ((e.clientX - b.left) * c.width) / b.width / BIG, ((e.clientY - b.top) * c.height) / b.height / BIG);
    if (id >= 0 && pickRoute(cur, id)) drawBig(c.getContext("2d")!, cur);
  };
  return (
    <>
      <canvas ref={miniRef} className="minimap route-mini" width={MINIMAP_BOX_W} height={MINIMAP_BOX_H} aria-label={t("minimap")} onPointerDown={() => setOpen((o) => !o)} />
      {open && (
        <div className="route-big" onPointerDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="route-big-box">
            <div className="route-big-title">{t("routeBigTitle")}</div>
            <canvas ref={bigRef} width={MINIMAP_WIDTH * BIG} height={h * BIG} onPointerDown={click} />
            <div className="route-big-hint">{t("routeBigHint")}</div>
          </div>
        </div>
      )}
    </>
  );
}
