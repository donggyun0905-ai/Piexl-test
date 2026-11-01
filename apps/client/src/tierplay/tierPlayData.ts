// 관리자 티어 플레잉: 기록 모양 · 하는 순서 · 서버에 저장·불러오기 (관리자 로그인 필요, 이 브라우저에도 같이 남김)
import { CHARACTER_IDS, type CharacterId } from "@pixel-rogue/shared";
import { adminApi, homeServer } from "../admin/adminApi";
import { TIERS, type TierId } from "../archive/tierData";
import { loadText, saveText } from "../storage";

/** 캐릭터 하나를 해 본 기록 (자동: 클리어 시간·점수·쓰러진 횟수·보스·깎은 체력 · 별 1~5: 안정성·딜·속도감·재미·템 운 · 글: 비고·보스 비고) */
export interface TierRecord {
  character: CharacterId;
  clearTicks: number;
  score: number;
  deaths: number;
  stable: number;
  dmg: number;
  speed: number;
  fun: number;
  items: number;
  note: string;
  boss: string;
  bossCleared: boolean;
  /** 라스트 보스 체력을 깎은 비율 (0~100) */
  bossPct: number;
  bossNote: string;
  at?: number;
}

/** 별점 항목 [키, 이름] */
export const STAR_FIELDS = [
  ["stable", "안정성"],
  ["dmg", "딜"],
  ["speed", "속도감"],
  ["fun", "재미"],
  ["items", "템 잘 떴는지"],
] as const;

/** 하는 순서: 캐릭터 고르기 순서 (히든 빼고) */
export const PLAY_ORDER: readonly CharacterId[] = CHARACTER_IDS;

export interface TierRow {
  id: TierId;
  chars: CharacterId[];
}

/** 기본 표 (서버에 저장한 표가 없을 때) */
export const defaultTiers = (): TierRow[] => TIERS.map((t) => ({ id: t.id, chars: [...t.chars] }));

/** 서버 표 → 화면 표 (모르는 단계·캐릭터는 버림) */
export function readTiers(raw: unknown): TierRow[] | null {
  if (!Array.isArray(raw)) return null;
  const rows = TIERS.map((t) => {
    const got = (raw as { id?: string; chars?: string[] }[]).find((r) => r?.id === t.id);
    return { id: t.id, chars: (got?.chars ?? []).filter((c): c is CharacterId => (CHARACTER_IDS as readonly string[]).includes(c)) };
  });
  return rows;
}

const LOCAL = "pixel-rogue:tierPlay";

function localRecords(): TierRecord[] {
  try {
    return JSON.parse(loadText(LOCAL) ?? "[]") as TierRecord[];
  } catch {
    return [];
  }
}

/** 기록 불러오기 (서버 기록이 있으면 서버, 없거나 못 받으면 이 브라우저) */
export async function loadRecords(): Promise<TierRecord[]> {
  const res = await adminApi.tierPlays(homeServer());
  if (res.ok && res.data) return res.data.records as TierRecord[];
  return localRecords();
}

/** 기록 저장 (이 브라우저에 먼저, 그다음 서버) → 서버 저장이 됐는지 */
export async function saveRecord(r: TierRecord): Promise<boolean> {
  const list = localRecords().filter((x) => x.character !== r.character);
  saveText(LOCAL, JSON.stringify([...list, { ...r, at: Date.now() }]));
  const res = await adminApi.tierPlaySave(homeServer(), r.character, r);
  return res.ok;
}

/** 틱 → "분:초" */
export const clock = (ticks: number) => {
  const sec = Math.round(ticks / 60);
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
};
