import type { Lang } from "../index";

// 화면 글자: 스토리 (메인 메뉴 버튼 · 탭 · 책 넘기기)
export const STORY_TEXT = {
  story: { ko: "스토리", en: "Story", ja: "ストーリー" },
  storySeason1: { ko: "시즌 1 · 캐릭터별 서사", en: "Season 1 · Character Tales", ja: "シーズン1 · キャラクター別の物語" },
  storyFactions: { ko: "진영", en: "Factions", ja: "陣営" },
  storyBosses: { ko: "최종 보스", en: "Final Bosses", ja: "最終ボス" },
  storyAkashic: { ko: "아카식 레코드", en: "Akashic Records", ja: "アカシックレコード" },
  storyChapterN: { ko: "{n}장", en: "Chapter {n}", ja: "第{n}章" },
  storyRead: { ko: "읽기", en: "Read", ja: "読む" },
  storyPrev: { ko: "◀ 이전", en: "◀ Prev", ja: "◀ 前へ" },
  storyNext: { ko: "다음 ▶", en: "Next ▶", ja: "次へ ▶" },
  storyToList: { ko: "목록으로", en: "Back to chapters", ja: "目次へ" },
  storyCast: { ko: "등장", en: "Cast", ja: "登場" },
  storyUnknown: { ko: "(아직 미지정)", en: "(yet unknown)", ja: "（未定）" },
  storyChars: { ko: "캐릭터", en: "Characters", ja: "キャラクター" },
  charGuideShow: { ko: "캐릭터 설명 보기", en: "Character guide", ja: "キャラクター説明を見る" },
  charGuideHide: { ko: "캐릭터 설명 닫기", en: "Hide guide", ja: "キャラクター説明を閉じる" },
} satisfies Record<string, Record<Lang, string>>;
