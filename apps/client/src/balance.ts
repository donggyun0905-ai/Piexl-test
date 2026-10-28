// 게임 수치 (관리자 페이지에서 바꾼 값) 받기. 앱을 열 때·판이 끝날 때 서버에서 받고, 못 받으면 마지막으로 받은 값.
// 판 도중에는 바꾸지 않음 (일일 도전 기록은 판을 시작할 때의 수치 지문과 함께 냄)
// 던전 수치와 타워 디펜스 수치(tdBalance)·패왕전 수치(pwBalance)는 따로 받고 따로 넣음
import { DEFAULT_BALANCE_HASH, DUNGEON_BALANCE, PW_BALANCE, TD_BALANCE, type BalanceSet, type BalanceValues } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { apiGet } from "./api";
import { loadText, saveText } from "./storage";

const { cleanBalance } = DUNGEON_BALANCE;

interface Saved {
  hash: string;
  values: BalanceValues;
}

function readParam(name: string): string {
  try {
    return new URLSearchParams(location.search).get(name) ?? "";
  } catch {
    return "";
  }
}

/** 관리자 페이지 오른쪽 연습장 (?adminPractice=캐릭터 · ?adminTd=맵): 서버 대신 관리자 페이지에서 고치는 중인 수치를 씀 */
export const ADMIN_PRACTICE = readParam("adminPractice");
export const ADMIN_TD = readParam("adminTd");
export const ADMIN_PREVIEW_KEY = "pixel-rogue:adminPreview";
export const ADMIN_TD_PREVIEW_KEY = "pixel-rogue:adminTdPreview";

/** 수치 세트 하나 받기·넣기 (key: 이 기기 저장 이름 · query: 서버 주소 뒤 · preview: 관리자 연습장이면 고치는 중인 수치 이름) */
function balanceClient(set: BalanceSet, key: string, query: string, preview: string) {
  /** 관리자 페이지가 넣어 둔 고치는 중인 수치 (같은 탭이라 sessionStorage를 같이 봄) */
  const loadPreview = (): Saved => {
    try {
      return { hash: "preview", values: set.cleanBalance(JSON.parse(sessionStorage.getItem(preview) ?? "{}")) };
    } catch {
      return { hash: "preview", values: {} };
    }
  };
  const loadSaved = (): Saved => {
    try {
      const s = JSON.parse(loadText(key) ?? "null") as Saved | null;
      if (s && typeof s.hash === "string") return { hash: s.hash, values: set.cleanBalance(s.values) };
    } catch {
      // 망가진 값은 버림
    }
    return { hash: DEFAULT_BALANCE_HASH, values: {} };
  };
  const previewing = ADMIN_PRACTICE !== "" || ADMIN_TD !== "";
  const state = { latest: previewing ? loadPreview() : loadSaved(), inRun: false };
  set.applyBalance(state.latest.values);
  /** 서버에서 지금 수치 받기 (판 밖이면 바로 넣음) */
  const refresh = async (): Promise<void> => {
    if (previewing) return;
    const res = await apiGet<Saved>(`/api/balance${query}`);
    if (!res.ok || !res.data) return;
    state.latest = { hash: res.data.hash, values: set.cleanBalance(res.data.values) };
    saveText(key, JSON.stringify(state.latest));
    if (!state.inRun) set.applyBalance(state.latest.values);
  };
  return {
    state,
    refresh,
    /** 판 시작: 이 판의 수치를 넣음 (방에서 정한 수치가 있으면 그것). 돌려주는 값 = 지문 */
    begin(values?: BalanceValues): string {
      set.applyBalance(values ?? state.latest.values);
      state.inRun = true;
      return set.currentBalance().hash;
    },
    /** 판 끝: 다음 판을 위해 새 수치 받기 */
    end(): void {
      state.inRun = false;
      void refresh();
    },
  };
}

const dungeon = balanceClient(DUNGEON_BALANCE, "balance", "", ADMIN_PREVIEW_KEY);
/** 타워 디펜스 수치 (판 시작 begin · 끝 end) */
export const tdBalance = balanceClient(TD_BALANCE, "tdBalance", "?set=td", ADMIN_TD_PREVIEW_KEY);

/** 패왕전 수치 (역할군·캐릭터 능력치·스킬, 판 시작 begin · 끝 end) */
export const pwBalance = balanceClient(PW_BALANCE, "pwBalance", "?set=pw", "pixel-rogue:adminPwPreview");

/** 패왕전 판 동안 수치 고정 (판 도중에 받은 새 수치는 끝난 뒤에) */
export function usePwBalanceRun(): void {
  useState(() => pwBalance.begin());
  useEffect(() => () => pwBalance.end(), []);
}

/** 서버에서 지금 수치 받기 (던전·타워 디펜스·패왕전) */
export async function refreshBalance(): Promise<void> {
  await Promise.all([dungeon.refresh(), tdBalance.refresh(), pwBalance.refresh()]);
}

/** 내 화면의 수치 지문 (배틀·협동 방에 알림) */
export function latestBalanceHash(): string {
  return dungeon.state.latest.hash;
}

export const beginRun = dungeon.begin;
export const endRun = dungeon.end;

const versions = new Map<string, BalanceValues>();

/** 지문으로 그 수치 받기 (못 받으면 null) */
async function fetchVersion(hash: string): Promise<BalanceValues | null> {
  if (hash === dungeon.state.latest.hash) return dungeon.state.latest.values;
  const hit = versions.get(hash);
  if (hit) return hit;
  const res = await apiGet<Saved>(`/api/balance?v=${encodeURIComponent(hash)}`);
  if (!res.ok || !res.data) return null;
  const values = cleanBalance(res.data.values);
  versions.set(hash, values);
  return values;
}

/** 배틀·협동 방: 시작하면 방에서 정한 수치를 받아 둠. 받기 전에는 ready=false */
export function useRoomBalance(hash: string | undefined, playing: boolean): { ready: boolean; values?: BalanceValues } {
  const [got, setGot] = useState<{ hash: string; values?: BalanceValues } | null>(null);
  useEffect(() => {
    if (!playing || !hash) return;
    let alive = true;
    void fetchVersion(hash).then((values) => {
      if (alive) setGot({ hash, values: values ?? undefined });
    });
    return () => {
      alive = false;
    };
  }, [hash, playing]);
  if (!hash) return { ready: true };
  return got?.hash === hash ? { ready: true, values: got.values } : { ready: false };
}
