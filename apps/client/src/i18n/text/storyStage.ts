import type { Lang } from "../index";

// 화면 글자: 스토리 진행 단계 (메인 화면 '새 장 열림'·다음 장 조건, progress/StageNotice) · stGoal{n} = progress/storyStage의 STAGE_GOALS 차례
export const STORY_STAGE_TEXT = {
  stNew: { ko: "{n}장이 열렸습니다", en: "Chapter {n} unlocked", ja: "第{n}章が開きました" },
  stNewHint: { ko: "새 진영·모드가 생겼어요. 이야기는 아카이브 › 스토리에서", en: "New factions and modes are here. Read it in Archive › Story", ja: "新しい陣営・モードが登場。物語はアーカイブ › ストーリーで" },
  stOk: { ko: "확인", en: "OK", ja: "確認" },
  stNext: { ko: "다음 {n}장:", en: "Next, Chapter {n}:", ja: "次の第{n}章:" },
  stGoal0: { ko: "혼자 하기 1층 보스 처치", en: "Defeat the floor 1 boss in Play Solo", ja: "「ひとりで遊ぶ」で1階のボスを倒す" },
  stGoal1: { ko: "혼자 하기 3층 보스 처치", en: "Defeat the floor 3 boss in Play Solo", ja: "「ひとりで遊ぶ」で3階のボスを倒す" },
  stGoal2: { ko: "혼자 하기 첫 클리어", en: "Clear a Play Solo run", ja: "「ひとりで遊ぶ」で初クリア" },
  stGoal3: { ko: "라스트 보스 처치", en: "Defeat the Last Boss", ja: "ラストボスを倒す" },
  stGoal4: { ko: "영웅의 길 3단계 도착", en: "Reach stage 3 of the Hero's Path", ja: "英雄の道ステージ3に到達" },
  stGoal5: { ko: "무한 모드 10층 도착", en: "Reach floor 10 in Endless Mode", ja: "エンドレスモード10階に到達" },
  stGoal6: { ko: "혼자 하기 클리어 5번", en: "Clear Play Solo 5 times", ja: "「ひとりで遊ぶ」でクリア5回" },
  stGoal7: { ko: "혼자 하기 클리어 8번", en: "Clear Play Solo 8 times", ja: "「ひとりで遊ぶ」でクリア8回" },
  stGoal8: { ko: "혼자 하기 클리어 12번", en: "Clear Play Solo 12 times", ja: "「ひとりで遊ぶ」でクリア12回" },
} satisfies Record<string, Record<Lang, string>>;
