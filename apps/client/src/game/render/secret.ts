// 시즌 2 히든 캐릭터 그리기 모음 (index·season2가 한 줄로 부름)
import type { EffectState, ProjectileState, RunState } from "@pixel-rogue/shared";
import { drawMinerAura, drawMinerFx, drawMinerGround, drawMinerShot } from "./miner";
import type { Snap } from "./palette";
import { drawVoyagerAura, drawVoyagerGround, drawVoyagerShot, type FateName } from "./voyager";
import { drawVoyagerFx } from "./voyagerFx";
import { drawZeusAura, drawZeusFx, drawZeusGround, drawZeusShot } from "./zeus";
import { drawPgAura, drawPgFx, drawPgGround, drawPgShot } from "./pgHero";
import { drawKingFx } from "./kingFx";
import { drawKingAura } from "./fallenKing";
import { drawLuxAura, drawLuxFx, drawLuxShot } from "./lux";

type Ctx = CanvasRenderingContext2D;

export function drawSecretGround(ctx: Ctx, s: RunState, snap: Snap): void {
  drawMinerGround(ctx, s, snap);
  drawVoyagerGround(ctx, s, snap);
  drawZeusGround(ctx, s, snap);
  drawPgGround(ctx, s, snap);
}
export function drawSecretAura(ctx: Ctx, s: RunState, alpha: number, snap: Snap, fateName?: FateName): void {
  drawMinerAura(ctx, s, alpha, snap);
  drawVoyagerAura(ctx, s, alpha, snap, fateName);
  drawZeusAura(ctx, s, alpha, snap);
  drawPgAura(ctx, s, alpha, snap);
  drawKingAura(ctx, s, alpha, snap);
  drawLuxAura(ctx, s, alpha, snap);
}
export function drawSecretShot(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  return drawMinerShot(ctx, pr, x, y, tick) || drawVoyagerShot(ctx, pr, x, y, tick) || drawZeusShot(ctx, pr, x, y, tick) || drawPgShot(ctx, pr, x, y, tick) || drawLuxShot(ctx, pr, x, y);
}
export function drawSecretFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  return drawMinerFx(ctx, fx, snap) || drawVoyagerFx(ctx, fx, snap) || drawZeusFx(ctx, fx, snap) || drawPgFx(ctx, fx, snap) || drawKingFx(ctx, fx, snap) || drawLuxFx(ctx, fx, snap);
}
