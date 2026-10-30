// 기간토마키아 이 기기 저장: 나갔다가 이어하기 (판 상태 통째로) · 끝나면 배낭의 상점 물건 받기
import type { RunState } from "@pixel-rogue/shared";
import { addChips } from "../lobby/chips";
import { grantRandomFx } from "../shop/effects";
import { addMissionCoupons, grantLimitedSkin } from "../shop/wallet";
import { loadText, saveText } from "../storage";
import { addEventCoins } from "./eventCoins";

// 맵이 바뀌면 이름을 바꿔 예전 맵의 판은 읽지 않음 (0.48.255: 1.5배 + 건물)
const KEY = "pwGigaSave2";

/** 판 저장 (끝난 판은 지움) */
export function saveGiga(run: RunState): void {
  try {
    saveText(KEY, run.over ? "" : JSON.stringify(run));
  } catch {
    // 저장 공간이 모자라면 이어하기 없이 계속
  }
}

export function loadGiga(): RunState | null {
  try {
    const raw = loadText(KEY);
    return raw ? (JSON.parse(raw) as RunState) : null;
  } catch {
    return null;
  }
}

export const clearGiga = () => saveText(KEY, "");

/** 상점 물건 받기: 만능 티켓(쿠폰 10) · 이벤트 재화(코인 10) · 로비 돈(칩 3,000) · 한정 스킨권 · 한정 추가 효과권. 받은 물건 id 목록 */
export function claimGoods(items: readonly string[]): string[] {
  const got: string[] = [];
  for (const id of items) {
    if (id === "g:ticket") addMissionCoupons(10);
    else if (id === "g:ecoin") addEventCoins(10);
    else if (id === "g:chips") addChips(3000);
    else if (id === "g:skin") grantLimitedSkin();
    else if (id === "g:fx") grantRandomFx();
    else continue;
    got.push(id);
  }
  return got;
}
