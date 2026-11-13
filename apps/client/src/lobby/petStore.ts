// 펫 상점 기억 (이 기기): 산 펫 · 데리고 갈 펫. 사면 로비 칩이 줄어듦
import { uiSfx } from "../audio/uiSounds";
import { LOBBY_PETS, type LobbyPetId } from "@pixel-rogue/shared";
import { loadText, saveText } from "../storage";
import { addChips, loadChips } from "./chips";
import { TEST_OPEN } from "../testFlags";

interface Saved {
  owned: LobbyPetId[];
  equipped: LobbyPetId | null;
}

/** 테스트 중에는 펫 모두 가진 상태 */
const ALL = Object.keys(LOBBY_PETS) as LobbyPetId[];

function load(): Saved {
  try {
    const s = JSON.parse(loadText("lobbyPets") ?? "{}") as Partial<Saved>;
    return { owned: TEST_OPEN ? ALL : (s.owned ?? []), equipped: s.equipped ?? null };
  } catch {
    return { owned: TEST_OPEN ? ALL : [], equipped: null };
  }
}
/** 저장 (테스트 중 '모두 가짐'은 저장하지 않음: 원래 산 펫만 남김) */
function save(s: Saved): void {
  let owned = s.owned;
  if (TEST_OPEN) {
    try {
      owned = (JSON.parse(loadText("lobbyPets") ?? "{}") as Partial<Saved>).owned ?? [];
    } catch {
      owned = [];
    }
  }
  saveText("lobbyPets", JSON.stringify({ ...s, owned }));
}

export const ownedPets = (): LobbyPetId[] => load().owned;
/** 데리고 갈 펫 (산 것만) */
export function equippedPet(): LobbyPetId | null {
  const s = load();
  return s.equipped && s.owned.includes(s.equipped) ? s.equipped : null;
}

/** 사기: 칩이 모자라거나 이미 있으면 false. 사면 바로 데리고 감 */
export function buyPet(id: LobbyPetId): boolean {
  const s = load();
  const price = LOBBY_PETS[id].price;
  if (s.owned.includes(id) || loadChips() < price) return false;
  addChips(-price);
  s.owned.push(id);
  s.equipped = id;
  save(s);
  uiSfx("uiBuy");
  return true;
}

/** 데리고 가기 (null = 안 데려감) */
export function equipPet(id: LobbyPetId | null): void {
  const s = load();
  s.equipped = id && s.owned.includes(id) ? id : null;
  save(s);
  uiSfx("uiEquip");
}
