// 모바일 조이스틱 (드래그하는 동안만 보임)

export interface StickElements {
  moveBase: HTMLElement;
  moveKnob: HTMLElement;
  aimBase: HTMLElement;
  aimKnob: HTMLElement;
}

export interface Stick {
  pointerId: number;
  ox: number;
  oy: number;
  dx: number;
  dy: number;
  downAt: number;
  moved: number;
}

export function drawSticks(el: StickElements, move: Stick | null, aim: Stick | null): void {
  const place = (base: HTMLElement, knob: HTMLElement, s: Stick | null) => {
    base.style.display = s ? "block" : "none";
    knob.style.display = s ? "block" : "none";
    if (!s) return;
    base.style.transform = `translate(${s.ox}px, ${s.oy}px)`;
    knob.style.transform = `translate(${s.ox + s.dx}px, ${s.oy + s.dy}px)`;
  };
  place(el.moveBase, el.moveKnob, move);
  place(el.aimBase, el.aimKnob, aim);
}
