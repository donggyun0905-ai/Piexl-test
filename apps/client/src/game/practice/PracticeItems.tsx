// 연습장 아이템 목록: 묶음마다 접고 펴는 제목 + 아이콘 칸 (가진 수 · 하나 빼기 · 여러 번 가질 수 있는지 표시)
import { practiceCanStack, type PassiveId } from "@pixel-rogue/shared";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { Lang, TextKey } from "../../i18n";
import { itemName } from "../../i18n/items";
import { ItemIcon, type IconItem } from "../itemIcon";
import type { Group } from "./practiceGroups";

interface Props {
  groups: Group<IconItem>[];
  query: string;
  lang: Lang;
  t: (key: TextKey) => string;
  owned: (item: IconItem) => number;
  onGive: (item: IconItem) => void;
  onRemove: (item: IconItem) => void;
  onTip: (item: IconItem | null, e?: ReactPointerEvent<HTMLElement>) => void;
}

/** 묶음 제목: "○○ 전용"처럼 캐릭터 이름을 넣음 */
export const groupTitle = (g: Group<unknown>, t: (key: TextKey) => string) => t(g.title).replace("{who}", g.who ? t(g.who) : "");

export function PracticeItems({ groups, query, lang, t, owned, onGive, onRemove, onTip }: Props) {
  const q = query.trim().toLowerCase();
  const shown = groups
    .map((g) => ({ ...g, list: q ? g.list.filter((it) => itemName(it.kind, it.id, lang).toLowerCase().includes(q)) : g.list }))
    .filter((g) => g.list.length > 0);
  if (!shown.length) return <p className="practice-empty">{t("practiceNone")}</p>;
  return (
    <>
      {shown.map((g) => (
        // 찾는 중이면 모두 펼침
        <details key={g.key} className="practice-group" open={q ? true : g.open}>
          <summary>
            {groupTitle(g, t)} <small>{g.list.length}</small>
          </summary>
          <div className="practice-grid">
            {g.list.map((item) => {
              const n = owned(item);
              const stack = item.kind === "passive" && practiceCanStack(item.id as PassiveId);
              return (
                <div key={`${item.kind}:${item.id}`} className={`practice-cell ${n > 0 ? "owned" : ""}`}>
                  <button
                    type="button"
                    className="practice-item"
                    aria-label={itemName(item.kind, item.id, lang)}
                    onClick={() => onGive(item)}
                    onPointerEnter={(e) => onTip(item, e)}
                    onPointerMove={(e) => e.pointerType === "mouse" && onTip(item, e)}
                    onPointerLeave={(e) => e.pointerType === "mouse" && onTip(null)}
                    onPointerDown={(e) => e.pointerType !== "mouse" && onTip(item, e)}
                  >
                    <ItemIcon item={item} size={40} />
                    {stack && <i title={t("practiceStack")}>+</i>}
                    {n > 1 && <b>×{n}</b>}
                  </button>
                  {n > 0 && item.kind !== "weapon" && (
                    <button type="button" className="practice-minus" aria-label={t("practiceRemove")} onClick={() => onRemove(item)}>
                      −
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </details>
      ))}
    </>
  );
}
