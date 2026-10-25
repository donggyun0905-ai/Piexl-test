// 아이템 아이콘 (화면용). 그림은 iconArt에서
import { useEffect, useRef } from "react";
import { iconCanvas, ICON_SIZE, type IconItem } from "./iconArt";
import { onCustomArt } from "./customArt";

export type { IconItem };

export function ItemIcon({ item, size = 36 }: { item: IconItem; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { kind, id } = item;
  useEffect(() => {
    const draw = () => {
      const ctx = ref.current?.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, ICON_SIZE, ICON_SIZE);
      ctx.drawImage(iconCanvas({ kind, id } as IconItem), 0, 0);
    };
    draw();
    // 도트 편집에서 고친 아이콘이 늦게 불러와지면 다시 그림
    return onCustomArt(draw);
  }, [kind, id]);
  return <canvas ref={ref} width={ICON_SIZE} height={ICON_SIZE} className="item-icon" style={{ width: size, height: size }} aria-hidden="true" />;
}
