import type { UseItemId } from "@pixel-rogue/shared";
import { useEffect, useRef, type PointerEvent, type RefObject } from "react";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";
import { getSettings, useSettings, type TouchButtonId } from "../settings";
import type { Controls } from "./controls";
import { ItemIcon } from "./itemIcon";

interface Props {
  slots: (UseItemId | null)[];
  lang: Lang;
  t: (key: TextKey) => string;
  controls: () => Controls | null;
  /** 상호작용 글 (상점·계단 등). 빈 글이면 버튼 없음 */
  interact: string;
  /** 대시 버튼 (gameLoop가 다시 쓸 수 있을 때까지 남은 양을 --cd로 그림) */
  dashRef: RefObject<HTMLButtonElement | null>;
  /** 설정의 조작키 바꾸기 화면: 누르면 동작 대신 버튼 끌기를 시작 (모든 버튼이 보임) */
  editing?: (e: PointerEvent<HTMLButtonElement>) => void;
}

/** 버튼이 하는 일 (data-act) */
type Act = TouchButtonId;

/** 누르는 순간 동작. hitbox는 누르는 동안만 켜짐 */
function act(c: Controls, a: Act, down: boolean): void {
  if (a === "hitbox") c.hitboxHeld = down;
  else if (!down) return;
  else if (a === "dash") c.queueDash();
  else if (a === "use1") c.queueUse(1);
  else if (a === "use2") c.queueUse(2);
  else c.queueInteract();
}

/** 누른 버튼을 잠깐 눌린 모양으로 + 짧은 진동 */
function feedback(el: HTMLElement): void {
  el.classList.add("pressed");
  setTimeout(() => el.classList.remove("pressed"), 120);
  if (getSettings().vibration) navigator.vibrate?.(8);
}

/** 모바일 오른쪽 아래 버튼 (오른손 엄지 자리): 대시(가장 큼) · 사용 아이템 1·2번 · 맞는 범위(누르는 동안 보임) · 상호작용.
 *  controls는 바뀌지 않는 함수로 넘길 것 (바뀌면 터치 받기를 다시 붙임).
 *  손가락마다 따로 받는 터치 이벤트로 처리해, 조이스틱을 잡은 채·여러 버튼을 동시에 눌러도 바로 동작 */
export function TouchButtons({ slots, lang, t, controls, interact, dashRef, editing }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const { buttonPos } = useSettings();

  useEffect(() => {
    const box = boxRef.current;
    if (!box || editing) return;
    /** 손가락 번호 → 누른 버튼 (뗄 때 맞는 범위 끄기용) */
    const held = new Map<number, Act>();
    const buttonOf = (target: EventTarget | null) => {
      const b = (target as Element | null)?.closest?.<HTMLButtonElement>("button[data-act]");
      return b && !b.disabled ? b : null;
    };
    const onStart = (e: TouchEvent) => {
      e.preventDefault(); // 확대·스크롤·늦게 오는 클릭 막기
      const c = controls();
      for (const touch of e.changedTouches) {
        const b = buttonOf(touch.target);
        if (!b || !c) continue;
        const a = b.dataset.act as Act;
        held.set(touch.identifier, a);
        feedback(b);
        act(c, a, true);
      }
    };
    const onEnd = (e: TouchEvent) => {
      const c = controls();
      for (const touch of e.changedTouches) {
        const a = held.get(touch.identifier);
        held.delete(touch.identifier);
        if (a && c) act(c, a, false);
      }
    };
    box.addEventListener("touchstart", onStart, { passive: false });
    box.addEventListener("touchend", onEnd);
    box.addEventListener("touchcancel", onEnd);
    return () => {
      box.removeEventListener("touchstart", onStart);
      box.removeEventListener("touchend", onEnd);
      box.removeEventListener("touchcancel", onEnd);
    };
  }, [controls, editing]);

  // 마우스로 누를 때 (터치는 위의 터치 이벤트가 받음)
  const mouse = (down: boolean) => (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const c = controls();
    const a = e.currentTarget.dataset.act as Act;
    if (!c) return;
    if (down) feedback(e.currentTarget);
    act(c, a, down);
  };
  const press = { onPointerDown: mouse(true), onPointerUp: mouse(false), onPointerLeave: mouse(false) };
  /** 버튼마다: 누를 때 할 일 + 설정에서 옮긴 자리 */
  const handlers = (a: Act) => {
    const pos = buttonPos[a];
    const style = pos ? { translate: `${pos[0] * 100}vw ${pos[1] * 100}vh` } : undefined;
    return { style, ...(editing ? { onPointerDown: editing } : press) };
  };

  return (
    <div ref={boxRef} className="touch-buttons">
      {interact && (
        <button type="button" className="touch-btn interact" data-act="interact" {...handlers("interact")}>
          {interact}
        </button>
      )}
      <button type="button" className="touch-btn hitbox" data-act="hitbox" {...handlers("hitbox")}>
        {t("hitboxToggle")}
      </button>
      {slots.map((id, i) => {
        const name = id ? itemName("use", id, lang) : t("empty");
        return (
          <button
            key={i}
            type="button"
            className={`touch-btn item item${i + 1} ${id ? "filled" : ""}`}
            disabled={!id && !editing}
            data-act={`use${i + 1}`}
            aria-label={name}
            title={name}
            {...handlers(i === 0 ? "use1" : "use2")}
          >
            {id ? <ItemIcon item={{ kind: "use", id }} size={26} /> : <span className="touch-empty">{i + 1}</span>}
            {id && <small>{name}</small>}
          </button>
        );
      })}
      <button ref={dashRef} type="button" className="touch-btn dash" data-act="dash" {...handlers("dash")}>
        {t("dash")}
      </button>
    </div>
  );
}
