// 지도 획득 알림: 오른쪽 가운데에 작게 쌓였다 2.5초 뒤 사라짐 (나무·몬스터 처치 · 같은 글이 이어지면 ×n으로 묶음)
import { useEffect, useState } from "react";

interface Toast {
  id: number;
  text: string;
  n: number;
  until: number;
}

let list: Toast[] = [];
let seq = 0;
const subs = new Set<() => void>();
const LIFE = 2500;

export function worldToast(text: string): void {
  const now = performance.now();
  const same = list.find((x) => x.text === text && x.until > now);
  if (same) [same.n, same.until] = [same.n + 1, now + LIFE];
  else list = [...list, { id: ++seq, text, n: 1, until: now + LIFE }].slice(-5);
  list = [...list];
  for (const f of subs) f();
}

export function WorldToasts() {
  const [, redraw] = useState(0);
  useEffect(() => {
    const f = () => redraw((v) => v + 1);
    subs.add(f);
    const id = window.setInterval(() => {
      const now = performance.now();
      if (list.some((x) => x.until <= now)) {
        list = list.filter((x) => x.until > now);
        f();
      }
    }, 300);
    return () => {
      subs.delete(f);
      window.clearInterval(id);
    };
  }, []);
  if (!list.length) return null;
  return (
    <div className="world-toasts">
      {list.map((x) => (
        <p key={x.id}>
          {x.text}
          {x.n > 1 ? ` ×${x.n}` : ""}
        </p>
      ))}
    </div>
  );
}
