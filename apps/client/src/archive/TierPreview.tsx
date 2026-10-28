// 티어표 캐릭터 미리보기: 연습장 판(허수아비 하나)을 자동 입력으로 돌리며 작은 캔버스에 그림 (기록·업적 없음)
import { applyRoom, createPracticeRun, stepSim, TICK_MS, VIEW_HEIGHT, VIEW_WIDTH, type CharacterId } from "@pixel-rogue/shared";
import { useEffect, useRef } from "react";
import type { TextKey } from "../i18n";
import { DamageTracker } from "../game/damageNumbers";
import { drawFrame } from "../game/render";
import { previewInput } from "./previewBot";

/** 캔버스 해상도 배율 · 화면 확대 (허수아비 둘레만 크게) */
const SCALE = 2;
const ZOOM = 1.7;

export function TierPreview({ id, t }: { id: CharacterId; t: (k: TextKey) => string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const run = createPracticeRun(id);
    const damage = new DamageTracker();
    const labels = [t("dummyAvg"), t("dummyDps"), t("dummyLast"), t("dummyTotal")];
    let last = performance.now();
    let acc = 0;
    let frame = 0;
    const loop = (now: number) => {
      applyRoom(run);
      acc = Math.min(acc + now - last, TICK_MS * 10);
      last = now;
      while (acc >= TICK_MS) {
        stepSim(run, previewInput(run));
        damage.observe(run);
        // 미리보기는 쓰러지지 않음
        if (run.over) run.over = false;
        run.player.hp = run.player.stats.maxHp;
        acc -= TICK_MS;
      }
      drawFrame(ctx, run, {
        alpha: acc / TICK_MS,
        showReticle: false,
        showHitbox: false,
        showRange: false,
        pixelScale: SCALE,
        zoom: ZOOM,
        overlay: (c, snap) => {
          damage.draw(c, run.tick, snap);
          damage.drawDummy(c, run, labels, snap);
        },
      });
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [id, t]);
  return <canvas ref={ref} className="tier-preview-canvas" width={VIEW_WIDTH * SCALE} height={VIEW_HEIGHT * SCALE} />;
}
