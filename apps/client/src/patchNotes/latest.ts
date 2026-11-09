import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.50.41",
    date: "2026-11-09",
    items: {
      ko: ["스토리 최종 보스 '갓이터' 설명을 7장에 맞게 고침 (천의 사도를 물들인 것은 아스모데우스, 갓이터는 악의 사도가 떠받드는 주인)"],
      en: ["Story final boss 'God Eater' description updated to match Chapter 7 (Asmodeus stained the Apostle of Heaven; the God Eater is the master the Apostle of Malice reveres)"],
      ja: ["ストーリーの最終ボス「ゴッドイーター」の説明を第7章に合わせて修正（天の使徒を染めたのはアスモデウス、ゴッドイーターは悪の使徒が仰ぐ主）"],
    },
  },
  {
    version: "0.50.40",
    date: "2026-11-09",
    items: {
      ko: [
        "스토리 시즌 3: 아카식 레코드 7장 「시작」·8장 「심연」·9장 「교류」 추가 (새벽의 성흔·아스모데우스의 화신체·천의 사도 · 성국과 악에 물든 이클립스 · 탈라시아의 합류와 깨어나는 신수들)",
      ],
      en: [
        "Story Season 3: Akashic Records Chapter 7 \"Beginning\", Chapter 8 \"The Abyss\" and Chapter 9 \"Exchange\" added (the Dawn Stigmata, the Avatar of Asmodeus and the Apostle of Heaven · the Holy Kingdom and a malice-stained Eclipse · Thalassia joins and the divine beasts awaken)",
      ],
      ja: [
        "ストーリー シーズン3：アカシックレコード第7章「始まり」・第8章「深淵」・第9章「交流」を追加（暁の聖痕・アスモデウスの化身・天の使徒 · 聖国と悪に染まったエクリプス · タラシアの合流と目覚める神獣たち）",
      ],
    },
  },
];
