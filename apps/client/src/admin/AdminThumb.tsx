// 관리자 페이지 항목 그림: 항목 id로 캐릭터·무기·아이템·적·보스 그림을 골라 작게 (맞는 그림이 없으면 빈칸)
import { CHARACTERS, PASSIVES, USE_ITEMS, WEAPONS, type PassiveId, type UseItemId, type WeaponId } from "@pixel-rogue/shared";
import { EnemyPortrait } from "../codex/EnemyPortrait";
import { ENEMY_SPRITES } from "../game/enemySprites";
import { ItemIcon, type IconItem } from "../game/itemIcon";
import { SkinPreview } from "../shop/SkinPreview";
import { ruleCharId } from "./autoLabels";

type Thumb = { char: string } | { enemy: string } | { item: IconItem };

const has = (table: object, id: string) => Object.prototype.hasOwnProperty.call(table, id);

/** 묶음·항목 id → 그림 종류 */
function thumbOf(group: string, id: string): Thumb | undefined {
  if (group === "weapons" && has(WEAPONS, id)) return { item: { kind: "weapon", id: id as WeaponId } };
  // 패시브·아이템 효과·패왕전 상점 (fx_ = 히든 아이템 효과)
  const pid = id.replace(/^fx_/, "");
  if (has(PASSIVES, pid) && group !== "characters") return { item: { kind: "passive", id: pid as PassiveId } };
  if (has(USE_ITEMS, id)) return { item: { kind: "use", id: id as UseItemId } };
  if (has(CHARACTERS, id)) return { char: id };
  if (ENEMY_SPRITES.includes(id)) return { enemy: id };
  // 보스 기술 수치 표 (BOSS_TOAD_RULES → toad)
  const boss = /^BOSS_([A-Z]+)_RULES$/.exec(id)?.[1]?.toLowerCase();
  if (boss && ENEMY_SPRITES.includes(boss)) return { enemy: boss };
  const owner = ruleCharId(id);
  if (owner && has(CHARACTERS, owner)) return { char: owner };
  return undefined;
}

export function AdminThumb({ group, id, size = 36 }: { group: string; id: string; size?: number }) {
  const t = thumbOf(group, id);
  if (!t) return null;
  return (
    <span className="admin-thumb" style={{ width: size, height: size }}>
      {"char" in t ? <SkinPreview sheet={t.char} size={size} still /> : "enemy" in t ? <EnemyPortrait kind={t.enemy} size={size} /> : <ItemIcon item={t.item} size={size} />}
    </span>
  );
}
