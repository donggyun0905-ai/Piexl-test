// 바닥 아이템 설명: 마우스를 올린 아이템 위에 이름·값·설명·무기 비교 (경매장 무대 상품도)
import { devilCost, type DevilId, type RunState, type WeaponId } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { itemDesc, itemName } from "../i18n/items";
import { pickupAt, pickupScreenPos } from "./clickTargets";
import type { IconItem } from "./itemIcon";
import { ItemTip } from "./ItemTip";
import { compareWeapon, type WeaponCompare } from "./weaponCompare";
import { auctionTipAt } from "./vault/auctionText";

export interface FloorTip {
  icon: IconItem | null;
  name: string;
  desc: string;
  x: number;
  y: number;
  hint: string;
  compare: WeaponCompare | null;
}

/** 화면 좌표(x, y) 아래 바닥 아이템의 설명. 없으면 null */
export function floorTipAt(run: RunState, canvas: HTMLCanvasElement, zoom: number, x: number, y: number, lang: Lang, t: (k: TextKey) => string): FloorTip | null {
  const pk = run.over ? null : pickupAt(run, canvas, zoom, x, y);
  // 경매장 무대 위 상품 (바닥 물건이 아님)
  if (!pk) return run.over ? null : auctionTipAt(run, canvas, zoom, x, y, lang, t);
  const price = pk.price > 0 && pk.kind !== "trash" ? ` (${pk.price}G)` : "";
  const reward = pk.kind === "passive" && pk.group > 0 && pk.price === 0;
  const pos = pickupScreenPos(run, canvas, zoom, pk);
  return {
    icon: pk.kind === "coin" || pk.kind === "reroll" || pk.kind === "trash" || pk.kind === "bench" || pk.kind === "tune" || pk.kind === "gym" || pk.kind === "trial" || pk.kind === "boon" || pk.kind === "altar" || pk.kind === "gambler" || pk.kind === "auction" ? null : ({ kind: pk.kind === "devil" ? "passive" : pk.kind, id: pk.itemId } as IconItem),
    name: `${itemName(pk.kind, pk.itemId, lang)}${price}`,
    desc: itemDesc(pk.kind, pk.itemId, lang, t, pk.kind === "devil" ? devilCost(pk.itemId as DevilId, run.player) : undefined),
    x: pos.x,
    y: pos.y,
    hint: reward ? t("tipClickPick") : pk.kind === "weapon" && pk.price === 0 ? t("tipPressF") : "",
    compare: pk.kind === "weapon" ? compareWeapon(run, pk.itemId as WeaponId, lang, t) : null,
  };
}

export function PickupTip({ tip, t }: { tip: FloorTip; t: (k: TextKey) => string }) {
  return (
    <ItemTip pos={tip} icon={tip.icon} name={tip.name} desc={tip.desc}>
      {tip.compare && (
        <div className="item-tip-compare">
          <div className="item-tip-hint">{t("tipCompare").replace("{name}", tip.compare.currentName)}</div>
          {tip.compare.rows.map((r) => (
            <div key={r.label} className="item-tip-row">
              <span>{r.label}</span>
              <span>
                {r.value}
                {r.delta && <b className={r.better > 0 ? "up" : "down"}> ({r.delta})</b>}
              </span>
            </div>
          ))}
        </div>
      )}
      {tip.hint && <div className="item-tip-hint">{tip.hint}</div>}
    </ItemTip>
  );
}
