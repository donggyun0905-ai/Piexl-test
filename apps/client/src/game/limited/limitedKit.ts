// 한정 스킨 테마마다 쓰는 것 묶음 (gameLoop가 고름): 효과 클래스 · 바닥/위 그리기 · 대기에 몸 숨김 · 강해짐 글자 · 큰/작은 소리
// 범 풍류(기본) · 여름 파도 · 네온 펄스 · 성탄 눈꽃 · 벨벳 티타임 (새 테마는 여기에 한 줄 · docs/LIMITED_SKIN.md)
import type { RunState } from "@pixel-rogue/shared";
import type { TextKey } from "../../i18n";
import { roar } from "../../audio/tigerSound";
import { splash } from "../../audio/summerSound";
import { zap } from "../../audio/cyberSound";
import { jingle } from "../../audio/xmasSound";
import { teaBell } from "../../audio/maidSound";
import type { Snap } from "../render/palette";
import { TigerFx, type TigerHooks } from "./tigerFx";
import { drawTigerOver, drawTigerUnder, tigerResting } from "./tigerDraw";
import { SummerFx } from "./summerFx";
import { drawSummerOver, drawSummerUnder, summerResting } from "./summerDraw";
import { CyberFx } from "./cyberFx";
import { cyberResting, drawCyberOver, drawCyberUnder } from "./cyberDraw";
import { XmasFx } from "./xmasFx";
import { drawXmasOver, drawXmasUnder, xmasResting } from "./xmasDraw";
import { MaidFx } from "./maidFx";
import { drawMaidOver, drawMaidUnder, maidResting } from "./maidDraw";

type Draw = (ctx: CanvasRenderingContext2D, fx: TigerFx, s: RunState, alpha: number, snap: Snap, tick: number) => void;

export interface LimitedKit {
  make: (hooks: TigerHooks) => TigerFx;
  under: Draw;
  over: Draw;
  resting: (fx: TigerFx) => boolean;
  power: TextKey;
  sound: (big: boolean) => void;
}

const TIGER: LimitedKit = { make: (h) => new TigerFx(h), under: drawTigerUnder, over: drawTigerOver, resting: tigerResting, power: "tigerPower", sound: roar };
const KITS: Readonly<Record<string, LimitedKit>> = {
  summer: { make: (h) => new SummerFx(h), under: drawSummerUnder, over: drawSummerOver, resting: summerResting, power: "summerPower", sound: splash },
  cyber: { make: (h) => new CyberFx(h), under: drawCyberUnder, over: drawCyberOver, resting: cyberResting, power: "cyberPower", sound: zap },
  noel: { make: (h) => new XmasFx(h), under: drawXmasUnder, over: drawXmasOver, resting: xmasResting, power: "xmasPower", sound: jingle },
  maid: { make: (h) => new MaidFx(h), under: drawMaidUnder, over: drawMaidOver, resting: maidResting, power: "maidPower", sound: teaBell },
};

/** 입은 한정 테마의 묶음 (없거나 범 풍류면 범) */
export const limitedKit = (theme: string | null): LimitedKit => (theme && KITS[theme]) || TIGER;
