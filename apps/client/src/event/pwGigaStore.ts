// 기간토마키아 끝나면 배낭의 상점 물건 받기 (이어하기는 0.48.257에 없앰)
import { addChips } from "../lobby/chips";
import { grantRandomFx } from "../shop/effects";
import { addMissionCoupons, grantLimitedSkin } from "../shop/wallet";
import { addEventCoins } from "./eventCoins";

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
