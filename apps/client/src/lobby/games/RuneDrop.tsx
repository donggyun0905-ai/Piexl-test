// 룬 블록: 떨어지는 룬 돌(4칸 7가지)을 돌리고 옮겨 가로줄을 채우면 사라짐. 단계가 오를수록 빨라짐 (규칙 runeLogic · 그림 runeDraw)
// 키: ←→ 옮기기 · ↑/X 돌리기 · ↓ 빨리 · Space 바로 떨어뜨리기 (모바일은 아래 버튼)
import { useEffect, useRef, useState } from "react";
import type { TextKey } from "../../i18n";
import { loadText, saveText } from "../../storage";
import { addChips } from "../chips";
import { C, drawRune, SIDE } from "./runeDraw";
import { fallEvery, H, newRune, runeAct, W, type RuneAct } from "./runeLogic";

const BEST_KEY = "runeBest";
const KEYS: Record<string, RuneAct> = { ArrowLeft: "l", ArrowRight: "r", ArrowUp: "rot", KeyX: "rot", ArrowDown: "down", Space: "drop" };

export function RuneDrop({ t }: { t: (k: TextKey) => string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const game = useRef(newRune());
  const [view, setView] = useState({ lines: 0, points: 0, over: false });
  const sync = () => {
    const g = game.current;
    setView({ lines: g.lines, points: g.points, over: g.over });
    if (g.over && g.points > (Number(loadText(BEST_KEY)) || 0)) saveText(BEST_KEY, String(g.points));
  };
  const act = (a: RuneAct) => {
    const cleared = runeAct(game.current, a, performance.now());
    if (cleared >= 2) addChips(cleared * 10);
    sync();
  };

  // 키 · 저절로 떨어짐 (50ms마다 세고 단계에 맞는 간격마다 한 칸)
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const a = KEYS[e.code];
      if (!a) return;
      e.preventDefault();
      act(a);
    };
    window.addEventListener("keydown", key);
    const id = window.setInterval(() => {
      const g = game.current;
      if (g.over || ++g.tick < fallEvery(g)) return;
      g.tick = 0;
      act("down");
    }, 50);
    return () => {
      window.removeEventListener("keydown", key);
      window.clearInterval(id);
    };
  });

  // 그리기: 번쩍임이 있어 매 프레임
  const labelRef = useRef({ next: "", level: "" });
  useEffect(() => {
    labelRef.current = { next: t("mgNext"), level: t("mgLevel") };
  });
  useEffect(() => {
    let id = 0;
    const frame = () => {
      const ctx = ref.current?.getContext("2d");
      if (ctx) drawRune(ctx, game.current, performance.now(), labelRef.current);
      id = requestAnimationFrame(frame);
    };
    id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="mg blocks">
      <p className="mg-sum">
        {t("mgPoints")} <b>{view.points}</b> · {t("mgLines")} <b>{view.lines}</b> · {t("mgBest")} <b>{Number(loadText(BEST_KEY)) || 0}</b>
        {view.over && <strong className="mg-result lose"> · {t("mgGameOver")}</strong>}
      </p>
      <canvas ref={ref} width={W * C + SIDE} height={H * C} className="blocks-canvas" />
      <div className="mg-row pad">
        <button type="button" onClick={() => act("l")}>◀</button>
        <button type="button" onClick={() => act("rot")}>⟳</button>
        <button type="button" onClick={() => act("r")}>▶</button>
        <button type="button" onClick={() => act("down")}>▼</button>
        <button type="button" onClick={() => act("drop")}>⤓</button>
        {view.over && (
          <button
            type="button"
            className="primary"
            onClick={() => {
              game.current = newRune();
              sync();
            }}
          >
            {t("mgAgain")}
          </button>
        )}
      </div>
      <p className="mg-note">{t("mgBlocksKeys")}</p>
    </div>
  );
}
