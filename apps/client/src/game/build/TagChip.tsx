// 꼬리표 칩: 꼬리표 색 테두리·이름 (아이템 설명 말풍선·세트 칸·꼬리표 고르기)
import type { ItemTag } from "@pixel-rogue/shared";
import { useLang, type TextKey } from "../../i18n";
import { TAG_COLORS } from "./tagColors";

export function TagChip({ tag, onClick }: { tag: ItemTag; onClick?: () => void }) {
  const { t } = useLang();
  const style = { color: TAG_COLORS[tag], borderColor: TAG_COLORS[tag] };
  const label = t(`bt_${tag}` as TextKey);
  return onClick ? (
    <button type="button" className="tag-chip pick" style={style} onClick={onClick}>
      {label}
    </button>
  ) : (
    <span className="tag-chip" style={style}>
      {label}
    </span>
  );
}
