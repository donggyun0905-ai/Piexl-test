// 주인공 아지트 '기록의 다락방' (docs/QUEST.md 3절 · 안 지도 scripts/art/world_rooms.record_attic 18×12)
// 침대 옆에서 눈뜸 · 거울(캐릭터 고르기) · 장비 상자(장비창) · 기록서 책상(퀘스트 목록·이야기 다시 보기) · 오락실 문(로비, 열려야) · 아래 가운데 나가는 문(마지막에 있던 나라로) · 서기관
import type { Place, Region } from "../worldPlaces";

/** 아지트 지역 id (WorldMode 시작·나가기·돌아오기) */
export const ATTIC_ID = "attic";

const deco = (id: string, tx: number, ty: number, art: Place["art"]): Place => ({ id, kind: "deco", tx, ty, name: "wpAttic", art });

export const ATTIC: Record<string, Region> = {
  [ATTIC_ID]: {
    map: "world/record_attic.png",
    start: { tx: 4, ty: 5 },
    title: "wpAttic",
    indoor: true,
    places: [
      { id: "atticDoor", kind: "exit", tx: 9, ty: 10, name: "wpAtticDoor" },
      { id: "atticMirror", kind: "sign", tx: 8, ty: 3, name: "wpAtticMirror", art: "mirror", use: "char" },
      { id: "atticChest", kind: "sign", tx: 3, ty: 8, name: "wpAtticChest", art: "chest", use: "gear" },
      { id: "atticDesk", kind: "sign", tx: 13, ty: 3, name: "wpAtticDesk", art: "desk", use: "book" },
      { id: "atticArcade", kind: "sign", tx: 16, ty: 7, name: "wpAtticArcade", art: "arcadeDoor", use: "lobby" },
      { id: "atticScribe", kind: "npc", tx: 10, ty: 6, name: "scribe", who: "scribe", line: "wnAtticScribe" },
      deco("atticBed", 2, 4, "bed"),
      deco("atticShelf1", 15, 2, "shelf"),
      deco("atticShelf2", 16, 2, "shelf"),
      deco("atticPlant", 1, 10, "plant"),
      deco("atticFire", 5, 2, "fireplace"),
      deco("atticTable", 13, 8, "table"),
    ],
  },
};
