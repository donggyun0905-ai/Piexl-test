// 이벤트 코인 (이 기기에 저장): 광야의 새벽 맵·난이도를 깨면 받고(처음은 많이, 다시는 조금) · 뽑기 꽝 대신 받기도 함 · 이벤트 상점에서 씀
import { swarmCoins, type SwarmMapId } from "@pixel-rogue/shared";
import { loadText, saveText } from "../storage";

interface Saved {
  coins: number;
  /** 깬 맵·난이도 ("plains:0") */
  cleared: string[];
}

function load(): Saved {
  try {
    const s = JSON.parse(loadText("eventCoins") ?? "{}") as Partial<Saved>;
    return { coins: s.coins ?? 0, cleared: s.cleared ?? [] };
  } catch {
    return { coins: 0, cleared: [] };
  }
}

const save = (s: Saved) => saveText("eventCoins", JSON.stringify(s));
const key = (map: SwarmMapId, level: number) => `${map}:${level}`;

export const eventCoins = (): number => load().coins;

export const isCleared = (map: SwarmMapId, level: number): boolean => load().cleared.includes(key(map, level));

/** 코인 더하기 (뽑기 등) */
export function addEventCoins(n: number): void {
  const s = load();
  s.coins += n;
  save(s);
}

/** 코인 쓰기: 모자라면 false */
export function spendEventCoins(n: number): boolean {
  const s = load();
  if (s.coins < n) return false;
  s.coins -= n;
  save(s);
  return true;
}

/** 맵·난이도를 깼을 때: 받은 코인 · 처음인지 */
export function clearSwarmMap(map: SwarmMapId, level: number): { coins: number; first: boolean } {
  const s = load();
  const first = !s.cleared.includes(key(map, level));
  const coins = swarmCoins(map, level, first);
  s.coins += coins;
  if (first) s.cleared.push(key(map, level));
  save(s);
  return { coins, first };
}
