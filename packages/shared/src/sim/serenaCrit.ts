// 세레나 기본 치명타 (novice.critNow·rollCrit에서 부름): 무희의 눈길 · 치명적인 입맞춤
import { SERENA_PERKS as K } from "../itemsSerena";
import { SERENA as N } from "../weaponsSerena";
import type { PlayerState } from "./types";
import { hasPerk } from "./util";

/** 세레나면 치명타 확률·배율, 아니면 null */
export function serenaCrit(p: PlayerState): { chance: number; mul: number } | null {
  if (p.characterId !== "serena") return null;
  return {
    chance: N.critChance + (hasPerk(p, "snGrace") ? K.snGrace.crit : 0),
    mul: N.critMul + (hasPerk(p, "snFatal") ? K.snFatal.critMul : 0),
  };
}
