import type { Lang } from "../index";

// 화면 글자: 스토리 (메인 메뉴 버튼 · 탭 · 책 넘기기)
export const STORY_TEXT = {
  story: { ko: "스토리", en: "Story", ja: "ストーリー" },
  storySeason1: { ko: "시즌 1~3 · 캐릭터별 서사", en: "Seasons 1–3 · Character Tales", ja: "シーズン1～3 · キャラクター別の物語" },
  storyS1: { ko: "시즌 1", en: "Season 1", ja: "シーズン1" },
  storyS2: { ko: "시즌 2", en: "Season 2", ja: "シーズン2" },
  storyS3: { ko: "시즌 3", en: "Season 3", ja: "シーズン3" },
  storyFactions: { ko: "진영", en: "Factions", ja: "陣営" },
  storyBosses: { ko: "최종 보스", en: "Final Bosses", ja: "最終ボス" },
  storyAkashic: { ko: "아카식 레코드", en: "Akashic Records", ja: "アカシックレコード" },
  storyChapterN: { ko: "{n}장", en: "Chapter {n}", ja: "第{n}章" },
  storyRead: { ko: "읽기", en: "Read", ja: "読む" },
  storyPrev: { ko: "◀ 이전", en: "◀ Prev", ja: "◀ 前へ" },
  storyNext: { ko: "다음 ▶", en: "Next ▶", ja: "次へ ▶" },
  sceneBook: { ko: "📖 책으로 보기", en: "📖 Read as book", ja: "📖 本で読む" },
  sceneFull: { ko: "⛶ 전체 화면", en: "⛶ Fullscreen", ja: "⛶ 全画面" },
  sceneFullExit: { ko: "⛶ 전체 화면 끄기", en: "⛶ Exit fullscreen", ja: "⛶ 全画面を終了" },
  sceneSkip: { ko: "건너뛰기 ✕", en: "Skip ✕", ja: "スキップ ✕" },
  sceneHint: { ko: "누르기·Space 다음 · ← 이전 · Esc 닫기", en: "Tap / Space next · ← back · Esc close", ja: "タップ・Space 次へ・← 戻る・Esc 閉じる" },
  storyToList: { ko: "목록으로", en: "Back to chapters", ja: "目次へ" },
  storyCast: { ko: "등장", en: "Cast", ja: "登場" },
  storyUnknown: { ko: "(아직 미지정)", en: "(yet unknown)", ja: "（未定）" },
  storyChars: { ko: "캐릭터", en: "Characters", ja: "キャラクター" },
  charGuideShow: { ko: "캐릭터 설명 보기", en: "Character guide", ja: "キャラクター説明を見る" },
  charGuideHide: { ko: "캐릭터 설명 닫기", en: "Hide guide", ja: "キャラクター説明を閉じる" },
} satisfies Record<string, Record<Lang, string>>;
