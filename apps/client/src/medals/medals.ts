// 훈장: 라스트 보스(멸망의 용·갓이터·태초의 빛과 어둠)를 캐릭터마다 깨면 하나씩 (이 기기에 저장). 모드 훈장(무한·아레나·영웅의 길·타워 디펜스)은 modeMedals
// 같은 보스·캐릭터를 다시 깨면 금기 점수가 더 높은 판(같으면 보스를 더 빨리 잡은 판)으로 바꿈 · 캐릭터 선택창의 그 캐릭터 카드 오른쪽 위 4칸에 달고 바꿀 수 있음
import { RAID_BOSSES, tabooPoints, type CharacterId, type RunState } from "@pixel-rogue/shared";
import type { MedalKind } from "./modeMedals";
import type { RunSummaryData } from "../game/runSummary";
import { loadText, saveText } from "../storage";

export interface Medal {
  /** 라스트 보스 또는 모드 */
  boss: MedalKind;
  /** 캐릭터 ("all" = 모든 캐릭터 카드에 달 수 있음, 타워 디펜스) */
  character: CharacterId | "all";
  /** 보스방에 처음 들어간 때부터 잡기까지 (틱) */
  ticks: number;
  /** 깬 날 (YYYY-MM-DD) */
  date: string;
  /** 그 판의 한 판 요약 (타워 디펜스는 없음) */
  summary?: RunSummaryData;
  /** 모드 기록 (무한 층 · 아레나 레벨 · 영웅의 길 단계 · 타워 디펜스 남은 목숨) */
  value?: number;
  /** 금기의 서 점수 (걸지 않았으면 없음) */
  taboo?: number;
}

/** 캐릭터마다 다는 칸 수 */
export const MEDAL_SLOTS = 4;
const KEY = "medals";
/** 캐릭터마다 단 훈장 칸 저장 이름 */
const slotKey = (c: CharacterId) => `medalSlots:${c}`;

export const medalId = (m: Pick<Medal, "boss" | "character">): string => `${m.boss}|${m.character}`;

export function loadMedals(): Record<string, Medal> {
  try {
    const raw = loadText(KEY);
    return raw ? (JSON.parse(raw) as Record<string, Medal>) : {};
  } catch {
    return {};
  }
}

/** 훈장 보이는 순서: 라스트 보스 → 무한 → 아레나 → 영웅의 길 → 타워 디펜스 */
const ORDER: string[] = [...RAID_BOSSES, "endless", "arena", "hero", "td", "tdAbyss"];

/** 이 캐릭터가 달 수 있는 훈장 (모든 캐릭터 공용 포함) */
export function medalsOf(all: Record<string, Medal>, c: CharacterId): Medal[] {
  return Object.values(all)
    .filter((m) => m.character === c || m.character === "all")
    .sort((a, b) => ORDER.indexOf(a.boss) - ORDER.indexOf(b.boss));
}

/** 훈장 저장: 없거나 better(옛 훈장)가 참이면 바꿈. 처음 받으면 그 캐릭터 카드 빈칸에 바로 닮 (공용은 안 닮). 바뀌었으면 true */
export function storeMedal(medal: Medal, better: (old: Medal) => boolean): boolean {
  const all = loadMedals();
  const id = medalId(medal);
  const old = all[id];
  if (old && !better(old)) return false;
  all[id] = medal;
  saveText(KEY, JSON.stringify(all));
  if (!old && medal.character !== "all") {
    const slots = loadSlots(medal.character);
    const empty = slots.indexOf(null);
    if (empty >= 0 && !slots.includes(id)) {
      slots[empty] = id;
      saveSlots(medal.character, slots);
    }
  }
  return true;
}

/** 이 캐릭터 카드에 단 훈장 id 4칸 (빈칸은 null) */
export function loadSlots(c: CharacterId): (string | null)[] {
  try {
    const raw = loadText(slotKey(c));
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    const have = loadMedals();
    return Array.from({ length: MEDAL_SLOTS }, (_, i) => {
      const id = Array.isArray(list) ? list[i] : null;
      const m = typeof id === "string" ? have[id] : undefined;
      return m && (m.character === c || m.character === "all") ? id! : null;
    });
  } catch {
    return Array.from({ length: MEDAL_SLOTS }, () => null);
  }
}

export function saveSlots(c: CharacterId, slots: (string | null)[]): void {
  saveText(slotKey(c), JSON.stringify(slots.slice(0, MEDAL_SLOTS)));
}

/** 라스트 보스를 깬 판이면 훈장을 줌 (처음이면 그 캐릭터 카드 빈칸에 바로 닮). 새로 받았거나 금기 점수가 오르거나 더 빨라졌으면 true */
export function recordMedal(run: RunState, summary: RunSummaryData): boolean {
  const boss = RAID_BOSSES.find((b) => b === run.lastBoss);
  if (!run.won || !boss || run.raidTicks === undefined) return false;
  const pts = tabooPoints(run.taboo);
  const medal: Medal = { boss, character: run.player.characterId, ticks: run.raidTicks, date: new Date().toISOString().slice(0, 10), summary, ...(pts > 0 ? { taboo: pts } : {}) };
  return storeMedal(medal, (old) => {
    const oldPts = old.taboo ?? 0;
    return pts > oldPts || (pts === oldPts && medal.ticks < old.ticks);
  });
}
