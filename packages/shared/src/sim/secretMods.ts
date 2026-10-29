// 시즌 2 히든 캐릭터 능력치 몫 모음 (recalcStats): 차원의 순례자 도감 · 몰락한 왕 영혼
import type { StatMod } from "../stats";
import { fallenKingMods } from "./fallenKing";
import { pilgrimMods } from "./pgBag";
import type { PlayerState } from "./types";

export const secretMods = (p: PlayerState): StatMod[] => [...pilgrimMods(p), ...fallenKingMods(p)];
