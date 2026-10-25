import type { Lang } from "../index";

// 화면 글자: 금기의 서 (캐릭터 선택창)
export const TABOO_UI_TEXT = {
  tabooBook: { ko: "금기의 서", en: "Book of Taboos", ja: "禁忌の書" },
  tabooOff: { ko: "금기 없음", en: "No taboos", ja: "禁忌なし" },
  tabooPts: { ko: "금기 {n}", en: "Taboo {n}", ja: "禁忌 {n}" },
  tabooIntro: {
    ko: "금기를 걸수록 어려워지고 점수가 쌓여요. 같은 금기를 여러 번 걸 수 있어요. 금기를 건 판은 순위표에 남지 않고, 라스트 보스를 깨면 점수가 새겨진 훈장을 받아요",
    en: "Each taboo makes the run harder and adds points. Some can be stacked. Taboo runs are not ranked; defeat a final boss to earn a medal engraved with your points",
    ja: "禁忌をかけるほど難しくなり点数がたまります。同じ禁忌を何度もかけられます。禁忌をかけた回はランキングに残らず、ラストボスを倒すと点数が刻まれた勲章をもらえます",
  },
  tabooTotal: { ko: "금기 점수", en: "Taboo points", ja: "禁忌点数" },
  tabooClear: { ko: "모두 풀기", en: "Clear all", ja: "すべて解く" },
  tabooGroupEnemy: { ko: "적", en: "Enemies", ja: "敵" },
  tabooGroupHurt: { ko: "받는 피해", en: "Damage taken", ja: "被ダメージ" },
  tabooGroupGold: { ko: "돈·상점·보상", en: "Gold · Shop · Rewards", ja: "お金・ショップ・報酬" },
  tabooGroupBody: { ko: "내 몸", en: "Your body", ja: "自分の体" },
  tabooHud: { ko: "금기 {n}", en: "Taboo {n}", ja: "禁忌 {n}" },
  medalTaboo: { ko: "금기 점수", en: "Taboo points", ja: "禁忌点数" },
} satisfies Record<string, Record<Lang, string>>;
