import type { Lang } from "../index";

// 화면 글자: 훈장 (캐릭터 선택창)
export const MEDAL_TEXT = {
  medals: { ko: "훈장", en: "Medals", ja: "勲章" },
  medalEmpty: { ko: "빈 훈장 칸 · 눌러서 달기", en: "Empty medal slot · tap to set", ja: "空の勲章欄 · 押して付ける" },
  medalNone: { ko: "아직 받은 훈장이 없어요. 라스트 보스를 깨거나 무한 모드·레이드 아레나·영웅의 길 기록을 세우면 캐릭터마다 훈장을 받아요", en: "No medals yet. Defeat a final boss or set a record in Endless, Raid Arena or Hero's Path to earn medals for that character", ja: "まだ勲章がありません。ラストボスを倒すか、エンドレス・レイドアリーナ・英雄の道で記録を出すとキャラクターごとに勲章をもらえます" },
  medalChar: { ko: "캐릭터", en: "Character", ja: "キャラクター" },
  medalTime: { ko: "보스를 잡은 시간", en: "Boss time", ja: "ボス撃破タイム" },
  medalDate: { ko: "깬 날", en: "Cleared on", ja: "撃破日" },
  medalChange: { ko: "바꾸기", en: "Change", ja: "変更" },
  medalChoose: { ko: "달 훈장 고르기", en: "Choose a medal", ja: "付ける勲章を選ぶ" },
  medalRemove: { ko: "빼기", en: "Remove", ja: "外す" },
  medalWorn: { ko: "다는 중", en: "Worn", ja: "装着中" },
  medalTitle: { ko: "{boss} 토벌 훈장", en: "{boss} Slayer Medal", ja: "{boss}討伐勲章" },
  medalModeTitle: { ko: "{mode} 훈장", en: "{mode} Medal", ja: "{mode}勲章" },
  medalRecord: { ko: "최고 기록", en: "Best record", ja: "最高記録" },
  medalRecEndless: { ko: "{n}층", en: "Floor {n}", ja: "{n}階" },
  medalRecArena: { ko: "Lv {n}", en: "Lv {n}", ja: "Lv {n}" },
  medalRecHero: { ko: "{n}단계", en: "Stage {n}", ja: "{n}段階" },
  medalRecTd: { ko: "남은 목숨 {n}/20", en: "{n}/20 lives left", ja: "残りライフ {n}/20" },
  medalRecTdAbyss: { ko: "남은 목숨 {n}/10", en: "{n}/10 lives left", ja: "残りライフ {n}/10" },
  medalAll: { ko: "모든 캐릭터", en: "All characters", ja: "全キャラクター" },
} satisfies Record<string, Record<Lang, string>>;
