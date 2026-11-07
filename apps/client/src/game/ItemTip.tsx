// 아이템 설명 말풍선 (바닥 아이템·장비 줄 패시브·연습장 도구가 같이 씀)
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ItemIcon, type IconItem } from "./itemIcon";
import { passiveTag, type ItemTag } from "@pixel-rogue/shared";
import { TagChip } from "./build/TagChip";
import { TipDesc } from "./FoldDesc";

const TIP_HALF_WIDTH = 132;
/** 이보다 위쪽이면 말풍선을 아래로 띄움 */
const TIP_MIN_TOP = 120;

export interface TipPos {
  x: number;
  y: number;
  below: boolean;
}

/** 말풍선 위치: 가로는 화면 밖으로 안 나가게, 위가 좁으면(canFlip) 아래쪽 */
export function tipPos(x: number, top: number, bottom: number, canFlip = true): TipPos {
  const below = canFlip && top < TIP_MIN_TOP;
  return { x: Math.min(Math.max(x, TIP_HALF_WIDTH), window.innerWidth - TIP_HALF_WIDTH), y: below ? bottom : top, below };
}

/** 열려 있을 때 selector 밖을 누르면 닫기 (close에는 setState를 그대로 넘김. ignoreMouse: 마우스 누름은 무시) */
export function useCloseOutside(active: boolean, selector: string, close: (none: null) => void, ignoreMouse = false) {
  useEffect(() => {
    if (!active) return;
    const onDown = (e: PointerEvent) => {
      if (ignoreMouse && e.pointerType === "mouse") return;
      if (!(e.target instanceof Element) || !e.target.closest(selector)) close(null);
    };
    document.addEventListener("pointerdown", onDown, true);
    return () => document.removeEventListener("pointerdown", onDown, true);
  }, [active, selector, close, ignoreMouse]);
}

interface Props {
  pos: { x: number; y: number; below?: boolean };
  icon: IconItem | null;
  /** 첫 줄 (아이콘 옆 이름) */
  name: ReactNode;
  desc: string;
  /** 설명 아래에 덧붙임 (무기 비교·안내) */
  children?: ReactNode;
  /** 꼬리표 (대장간에서 바꾼 것·무기 꼬리표, 없으면 패시브 원래 꼬리표) */
  tag?: ItemTag;
  /** 같은 패시브 여럿이 저마다 다른 꼬리표일 때 (대장간, 겹치지 않게 모두 보임) */
  tags?: ItemTag[];
}

/** 말풍선은 body에 그림: 감싼 창이 transform·스크롤을 가지면 fixed가 그 창 안에 붙어 창이 커졌다 줄었다 흔들림 (패왕전 Tab 점수판) */
export function ItemTip({ pos, icon, name, desc, children, tag, tags }: Props) {
  const one = tag ?? (icon?.kind === "passive" ? passiveTag(icon.id) : undefined);
  const shown = tags?.length ? [...new Set(tags)] : one ? [one] : [];
  return createPortal(
    <div className={pos.below ? "item-tip below" : "item-tip"} style={{ left: pos.x, top: pos.y }}>
      <div className="item-tip-name">
        {icon && <ItemIcon item={icon} size={24} />}
        {name}
        {shown.map((g) => <TagChip key={g} tag={g} />)}
      </div>
      <TipDesc text={desc} />
      {children}
    </div>,
    document.body,
  );
}
