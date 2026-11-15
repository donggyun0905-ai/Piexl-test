// 아스칼론 모험가 집합소 (docs/QUEST.md · 성 안 주거지 문 하나, 안 지도는 여관과 같은 ascalon_inn 17×11)
// 접수대의 파수꾼 → 함께 하기 · 협동 (퀘스트 '첫 흉수' 뒤에 열림) · 긴 탁자에 모험가들
import type { Place, Region } from "../worldPlaces";

/** 집합소로 바꾼 주거지 문 자리 (ascalonLayout ASCALON_HOUSE_DOORS 안) */
export const GUILD_DOOR: readonly [number, number] = [107, 74];

const deco = (id: string, tx: number, ty: number, art: Place["art"]): Place => ({ id, kind: "deco", tx, ty, name: "wpGuild", art });

export const ASCALON_GUILD: Record<string, Region> = {
  ascalonGuild: {
    map: "world/ascalon_inn.png",
    start: { tx: 8, ty: 8 },
    title: "wpGuild",
    indoor: true,
    places: [
      { id: "exit", kind: "exit", tx: 8, ty: 9, name: "wpGoOut" },
      { id: "guildMaster", kind: "npc", tx: 8, ty: 3, name: "wpGuildMaster", who: "warden", gate: "guild" },
      deco("guildCounterL", 6, 3, "counter"),
      deco("guildCounterR", 10, 3, "counter"),
      deco("guildBoard", 13, 2, "board"),
      deco("guildTable1", 3, 6, "longTable"),
      deco("guildTable2", 12, 7, "longTable"),
      deco("guildBarrel", 1, 9, "barrel"),
      deco("guildRack", 3, 2, "rack"),
      { id: "guildDrifter", kind: "npc", tx: 4, ty: 8, name: "drifter", who: "drifter", line: "wnGuildDrifter" },
      { id: "guildGunner", kind: "npc", tx: 14, ty: 5, name: "gunner", who: "gunner", line: "wnGuildGunner" },
    ],
  },
};
