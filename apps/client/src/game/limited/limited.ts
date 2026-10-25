// 한정 스킨을 입었는지 (입은 스킨의 테마가 뽑기 한정 테마면 그 테마)
import type { CharacterId } from "@pixel-rogue/shared";
import { isLimitedTheme, parseSkin, type LimitedTheme } from "../../shop/skins";
import { equippedSkin } from "../../shop/wallet";

export function wornLimited(c: CharacterId): LimitedTheme | null {
  const id = equippedSkin(c);
  if (!id) return null;
  const { theme } = parseSkin(id);
  return isLimitedTheme(theme) ? theme : null;
}
