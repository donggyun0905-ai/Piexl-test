import type { Lang } from "../index";

// 화면 글자: 아카이브 (메인 버튼 · 메뉴 창) · 티어표 · 캐릭터 미리보기
export const TIER_TEXT = {
  archive: { ko: "아카이브", en: "Archive", ja: "アーカイブ" },
  archiveStoryDesc: { ko: "진영·최종 보스·아카식 레코드·캐릭터 설명", en: "Factions, final bosses, Akashic Records, character guides", ja: "陣営・最終ボス・アカシックレコード・キャラ説明" },
  tierList: { ko: "티어표", en: "Tier List", ja: "ティア表" },
  tierListDesc: { ko: "캐릭터 강함 순위 · 얼굴을 누르면 허수아비 미리보기", en: "Character strength ranking · click a face for a dummy preview", ja: "キャラの強さ順位 · 顔を押すとカカシでプレビュー" },
  tierNote: {
    ko: "로그(기본 모드) 기준 · 직접 해 본 표에 허수아비 측정·능력치를 맞춰 본 결과예요. 판마다 아이템에 따라 달라질 수 있어요",
    en: "Based on the standard run · a hands-on list checked against dummy tests and stats. Results vary with items each run",
    ja: "ローグ(基本モード)基準 · 実際に遊んだ表をカカシ測定・能力値と照らし合わせた結果です。アイテム次第で回ごとに変わります",
  },
  tierAll: { ko: "전체", en: "All", ja: "全体" },
  tierS1: { ko: "시즌 1", en: "Season 1", ja: "シーズン1" },
  tierS2: { ko: "시즌 2", en: "Season 2", ja: "シーズン2" },
  tierGod: { ko: "반신급", en: "Demigod", ja: "半神級" },
  tierMeal: { ko: "국밥급", en: "Reliable", ja: "定番級" },
  tierMid: { ko: "중간계", en: "Middle", ja: "中間" },
  tierMeh: { ko: "애매함", en: "Awkward", ja: "微妙" },
  tierTrash: { ko: "쓰레기", en: "Struggling", ja: "苦戦" },
  tierPick: { ko: "캐릭터 얼굴을 누르면 여기서 허수아비를 때리는 모습을 보여 줘요", en: "Click a character face to watch it hit the dummy here", ja: "キャラの顔を押すと、ここでカカシを叩く様子が見られます" },
  tierPreviewNote: { ko: "시작 무기 · 아이템 없음", en: "Starting weapon · no items", ja: "初期武器 · アイテムなし" },
} satisfies Record<string, Record<Lang, string>>;
