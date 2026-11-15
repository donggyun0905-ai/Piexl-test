// 사냥터 몬스터 이름: 던전 몬스터·보스 이름 그대로 (i18n/enemies.enemyName) · 지금 말은 WorldMode가 알려 줌
import { enemyName } from "../../i18n/enemies";
import type { Lang } from "../../i18n";
import type { HuntGround } from "./huntGrounds";

let lang: Lang = "ko";
export const setHuntLang = (l: Lang): void => void (lang = l);
export const mobName = (g: HuntGround): string => enemyName(g.kind, lang);
