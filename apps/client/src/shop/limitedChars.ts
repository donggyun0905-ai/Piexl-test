// 한정 캐릭터 (서고의 감시자) 보유 · 전용 뽑기 (이 기기 저장 "archiveChars", 서버 백업 칸). 꾸밈 뽑기라 브라우저 랜덤
// 한 번 10장 · 11번 90장 · 캐릭터 3% (60번째까지 못 뽑으면 확정) · 못 뽑으면 쿠폰 1장 돌려받음 · 이미 가졌으면 쿠폰 30장
import { LIMITED_CHARACTERS, type CharacterId } from "@pixel-rogue/shared";
import { loadText, saveText } from "../storage";
import { TEST_OPEN } from "../testFlags";
import { refundCoupons, spendCoupons } from "./wallet";

export const ARCHIVE_PRICE = 10;
export const ARCHIVE10_PRICE = 90;
export const ARCHIVE_ODDS = 0.03;
export const ARCHIVE_PITY = 60;
export const ARCHIVE_MISS = 1;
export const ARCHIVE_DUP = 30;

interface Store {
  owned: string[];
  /** 마지막으로 캐릭터가 나온 뒤 뽑은 수 (확정까지) */
  pity: number;
}

function load(): Store {
  try {
    const s = JSON.parse(loadText("archiveChars") ?? "{}") as Partial<Store>;
    return { owned: s.owned ?? [], pity: s.pity ?? 0 };
  } catch {
    return { owned: [], pity: 0 };
  }
}
const save = (s: Store) => saveText("archiveChars", JSON.stringify(s));

/** 가진 한정 캐릭터 (테스트 중에는 모두) */
export const ownedLimited = (): CharacterId[] => (TEST_OPEN ? [...LIMITED_CHARACTERS] : LIMITED_CHARACTERS.filter((c) => load().owned.includes(c)));
export const archivePity = (): number => load().pity;

/** 뽑기 결과 하나: 캐릭터(겹치면 dup) · 빛 부스러기(쿠폰 1장) */
export type ArchivePrize = { kind: "char"; id: CharacterId; dup: boolean } | { kind: "miss" };

export function archiveGacha(n: number, price: number): ArchivePrize[] | null {
  if (!spendCoupons(price)) return null;
  const st = load();
  const out = Array.from({ length: n }, (): ArchivePrize => {
    st.pity++;
    if (Math.random() < ARCHIVE_ODDS || st.pity >= ARCHIVE_PITY) {
      st.pity = 0;
      const id = LIMITED_CHARACTERS[Math.floor(Math.random() * LIMITED_CHARACTERS.length)]!;
      const dup = st.owned.includes(id);
      if (dup) refundCoupons(ARCHIVE_DUP);
      else st.owned.push(id);
      return { kind: "char", id, dup };
    }
    refundCoupons(ARCHIVE_MISS);
    return { kind: "miss" };
  });
  save(st);
  return out;
}
