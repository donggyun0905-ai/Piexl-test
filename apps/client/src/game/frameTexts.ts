// 그리기에 넘기는 글자들 (gameLoop → render/drawFrame): 화면 언어로 이름·대사 (판 시작 때 한 번 만듦)
import { LEGENDS } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";
import { SPECIAL_NAMES } from "../i18n/items/abandoned";
import { LEGEND_NAMES } from "../i18n/items/general";
import { fateParts } from "../i18n/items/voyagerAbilities";
import type { DrawOptions } from "./render";

/** 머리 위 히든 글자 (효과 hdText 번호): 0~3 저주받은 주사위 저주 (sim/hiddenDice 순서) · 4~13 떨어진 신의 파편으로 얻은 힘 (sim/hiddenPerks 순서) */
const HIDDEN_TEXT = ["curseSummon", "curseHp", "cursePassives", "curseBare", "shard0", "shard1", "shard2", "shard3", "shard4", "shard5", "shard6", "shard7", "shard8", "shard9"] as const;
/** 검은 잔영 대사 */
const UMBRA_LINES: readonly TextKey[] = ["umbraSay0", "umbraSay1", "umbraSay2", "umbraSay3", "umbraSay4", "umbraSay5", "umbraSay6"];

export function frameTexts(t: (k: TextKey) => string, lang: Lang): Partial<DrawOptions> {
  return {
    pilgrimLine: t("pilgrimHello"),
    curseNames: HIDDEN_TEXT.map((k) => t(k)),
    legendName: (i) => LEGEND_NAMES[LEGENDS[i] ?? "charge"][lang],
    passiveName: (id) => itemName("passive", id as never, lang),
    fateName: (part, i) => fateParts(i, lang)[part]!.name,
    tagName: (kind) => SPECIAL_NAMES[kind][lang],
    oniUp: (k) => t(k === "hp" ? "oniUpHp" : k === "regen" ? "oniUpRegen" : "oniUpReach"),
    umbraLine: (i) => t(UMBRA_LINES[i] ?? "umbraSay0"),
    sageText: t("sageMaxStaff"),
    trialText: (k) => t(k as TextKey),
    useName: (id) => itemName("use", id as never, lang),
    bossName: (k) => t(k === "dragon" ? "bossDragon" : k === "godeater" ? "bossGodEater" : "bossPrimeval"),
  };
}
