// 패왕전 증강 고르기: 카드 셋 (픽셀 그림 · 이름 · 효과) · 누르면 controls.queueMenu → 입력 menu (sim/pwGrow)
import { GROW_MENU } from "@pixel-rogue/shared";
import { useEffect, useRef } from "react";
import type { Controls } from "../game/controls";
import type { TextKey } from "../i18n";
import { AUG_ART, AUG_PAL } from "./augArt";

function AugIcon({ id }: { id: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 16, 16);
    (AUG_ART[id] ?? []).forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const c = AUG_PAL[row[x]!];
        if (!c) continue;
        ctx.fillStyle = c;
        ctx.fillRect(x, y, 1, 1);
      }
    });
  }, [id]);
  return <canvas ref={ref} width={16} height={16} className="pw-aug-icon" aria-hidden="true" />;
}

export function PwAugPick({ offer, t, controls }: { offer: readonly string[]; t: (k: TextKey) => string; controls: () => Controls | null }) {
  return (
    <div className="pw-aug" role="dialog" aria-label={t("pwAugPick")}>
      <b>{t("pwAugPick")}</b>
      <div className="pw-aug-cards">
        {offer.map((id, k) => {
          const text = t(`pwAug_${id}` as TextKey);
          const at = text.indexOf(": ");
          return (
            <button key={id} type="button" className={`pw-aug-card aug-${id}`} onClick={() => controls()?.queueMenu(GROW_MENU.aug + k)}>
              <AugIcon id={id} />
              <strong>{at > 0 ? text.slice(0, at) : text}</strong>
              <small>{at > 0 ? text.slice(at + 2) : ""}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}
