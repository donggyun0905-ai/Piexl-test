// 한 프레임 그리기: 방 → 위험 → 궁극기 바닥 → 사거리 → 예고선 → 장치(포탑·지뢰) → 의사 바닥(가스·알약·봉합 실) → 원소술사 장판 → 악의 사도 장판·영혼 → 적 → 플레이어(+드론·보호막·회전체·고양이·덮치기 호랑이·닌자 그림자·시간술사 잔상·베두인 차크람·이무기 오라) → 의사 공중(탄·키트·구급차) → 투사체 → 효과 → 라스트 보스 어둠·궁극기 → 이무기 용·브레스 → 피해 숫자 → 보스 막대 → 조준점 (이 순서가 겹침 순서)
import { applyRoom, useSeat, type RunState, type TagSpecialKind } from "@pixel-rogue/shared";
import { cameraFor } from "../camera";
import { drawRangeRing } from "../rangeRing";
import { drawEnemies, drawPlayer } from "./actors";
import { drawTelegraphs } from "./telegraphs";
import { drawDevices, drawEngineerGear } from "./beams";
import { drawOrbitField, drawOrbs } from "./orbs";
import { drawBrawl } from "./brawl";
import { drawGunner } from "./guns";
import { drawPets } from "./pets";
import { drawBeastTiger, isTiger } from "./beastTiger";
import { drawTagHud, drawTagKids } from "./abandoned";
import { drawTitanArm } from "./titan";
import { drawOni, drawOniGround } from "./oni";
import { drawDucklings } from "./duck";
import { drawNinja } from "./ninja";
import { drawChrono } from "./chrono";
import { drawSummons } from "./summon";
import { drawBedouin } from "./bedouin";
import { drawLegendName } from "./general";
import { drawImugi, drawImugiOverlay } from "./imugi";
import { drawComboHud, drawImugiBody } from "./imugiAura";
import { drawApostleGround, drawSoulHud } from "./apostle";
import { drawEaterHud } from "./eaterHud";
import { drawStarGround, drawStarNodes } from "./star";
import { drawPrimeval, drawPrimevalOverlay } from "./primeval";
import { drawUltGround, drawUltOverlay } from "./ults";
import { drawArenaLabels } from "./arena";
import { drawUmbraTalk } from "./umbra";
import { drawBeastAir, drawBeastGround } from "./beastUlts";
import { drawDemigodAir } from "./demigod";
import { drawSageAir, drawSageBanner, drawSageGround } from "./sage";
import { drawMedicAir, drawMedicGround } from "./medic";
import { lerp, type Snap } from "./palette";
import { drawPickups, drawRoom } from "./room";
import { drawTerrain } from "./terrain";
import { drawInkMarks } from "./scribe";
import { drawIdra } from "./season2";
import { drawElderGround } from "./elder";
import { drawPlagueAir, drawPlagueGround } from "./plague";
import { drawSlayerRage } from "./slayer";
import { drawEaterAura } from "./eater";
import { drawMukinAura } from "./mukin";
import { drawDoomMarks, drawSamyeolGround } from "./samyeol";
import { drawTerraAura, drawTerraGround } from "./terra2";
import { drawClockMarks, drawRuneGround } from "./rune";
import { drawMorphGround } from "./morphFx";
import { drawMorphGot, drawMorphWake } from "./morphWake";
import { drawTerraAuraB, drawTerraGroundB } from "./terra2b";
import { drawTerraAuraC } from "./terra2c";
import { drawGreatSpirit, drawSpiritKin } from "./spirits";
import { drawHaloHud } from "./forgottenHalo";
import { drawPilgrim, drawRelicHud } from "./pilgrim";
import { drawOriginAura } from "./origin";
import { drawRunPet } from "./runPet";
import { drawOniUps, type OniUp } from "./oniUps";
import { drawSwarmGround } from "./swarmMap";
import { drawPaewang, drawPwGround } from "./paewang";
import { pwShown } from "./pwLook";
import { drawSkillAim } from "./pwAim";
import { themeFor } from "./floorThemes";
import { drawAmbushOverlay, drawTrackerAura } from "./tracker";
import { drawForgottenAura, drawForgottenBack } from "./forgotten";
import { drawRemnantEchoes } from "./remnant";
import { drawWandererAura, drawWandererGround } from "./wanderer";
import { drawSilkAmmo, drawSilkStacks } from "./silk";
import { drawSecretAura, drawSecretGround } from "./secret";
import { drawBossBar, drawEffects, drawProjectiles, drawReticleFor } from "./shots";

export interface DrawOptions {
  /** 0~1: 이전 틱과 이번 틱 사이 위치 */
  alpha: number;
  showReticle: boolean;
  /** 캐릭터의 실제 맞는 범위 고리 */
  showHitbox: boolean;
  /** 공격 사거리 원 */
  showRange: boolean;
  /** 차원의 순례자 말풍선 (화면 언어) */
  pilgrimLine?: string;
  /** 패왕전: 체력 줄 위 캐릭터 이름 (없으면 안 그림) */
  charName?: (id: string) => string;
  /** 게임 1픽셀이 실제 화면(기기) 몇 픽셀인지 (확대 전) */
  pixelScale: number;
  /** 화면 확대 (1 = 방 전체) */
  zoom: number;
  /** 마우스 자리 (브라우저 화면 좌표, 추적자 암습 저격 조준 원). 없으면 자동 조준 */
  cursor?: () => { x: number; y: number } | null;
  /** 보스 이름 (레이드 아레나 최종 보스 출구 표시) */
  bossName?: (kind: string) => string;
  /** 검은 잔영 대사 (0 처음 · 1~3 짐승을 잡을 때마다) */
  umbraLine?: (i: number) => string;
  /** 제천대성 즉사기 문구 */
  sageText?: string;
  /** 장수 필살기 이름 (generalLegends.LEGENDS 순번) */
  legendName?: (i: number) => string;
  /** 운명의 여행자 운명 이름 (버프 0 · 기술 1 · 능력 2, 칸 번호) */
  fateName?: (part: 0 | 1 | 2, i: number) => string;
  /** 패시브 이름 (변희가 경험치로 얻은 능력을 머리 위에) */
  passiveName?: (id: string) => string;
  /** 오니 능력치 오름 글자 (화면 언어) */
  oniUp?: (k: OniUp) => string;
  /** 버려진 자들 특수기 이름 (화면 언어) */
  tagName?: (kind: TagSpecialKind) => string;
  /** 플레이어 몸을 그리지 않음 (범 풍류 대기 때 누운 모습을 따로 그림) */
  hidePlayer?: () => boolean;
  /** 바닥 위·적 아래에 더 그릴 것 (한정 스킨 발자국·대기 기운) */
  under?: (ctx: CanvasRenderingContext2D, snap: Snap) => void;
  /** 효과 위에 더 그릴 것 (피해 숫자) */
  overlay?: (ctx: CanvasRenderingContext2D, snap: Snap) => void;
  /** 패왕전 조준 중인 스킬 (0~3, 없으면 -1) */
  skillAim?: number;
  /** 모드별로 맨 위에 더 그리기 (협동 이름표·신호) */
  modeOverlay?: DrawOverlay | undefined;
}

export type DrawOverlay = (ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: (v: number) => number) => void;

/** 사람마다 그 자리를 꺼내 놓고 그림 (협동은 다른 사람 먼저, 나는 맨 위). me: 내 자리 */
/** 패왕전: 쓰러진 사람·수풀에 숨은 상대는 몸·장치·효과를 하나도 그리지 않음 */
function eachPerson(s: RunState, fn: (me: boolean) => void): void {
  const party = s.party;
  if (!party) return fn(true);
  const mine = s.seat ?? 0;
  for (let i = 0; i < party.length; i++) {
    if (i === mine || (s.pvp && !pwShown(s, i))) continue;
    useSeat(s, i);
    fn(false);
  }
  useSeat(s, mine);
  if (!s.pvp || pwShown(s, mine)) fn(true);
}

/** 마우스 자리 → 게임 좌표 */
function cursorWorld(ctx: CanvasRenderingContext2D, opt: DrawOptions, k: number, camX: number, camY: number): { x: number; y: number } | null {
  const m = opt.cursor?.();
  if (!m) return null;
  const r = ctx.canvas.getBoundingClientRect();
  return { x: ((m.x - r.left) * (ctx.canvas.width / r.width)) / k + camX, y: ((m.y - r.top) * (ctx.canvas.height / r.height)) / k + camY };
}

export function drawFrame(ctx: CanvasRenderingContext2D, s: RunState, opt: DrawOptions): void {
  const { alpha } = opt;
  // 지금 방 크기 (라스트 보스방은 큼)
  applyRoom(s);
  // 화면 해상도로 그림: 움직이는 것은 게임 픽셀이 아니라 화면 픽셀 단위로 맞춰서 부드럽게 보이게
  const cam = cameraFor(s, opt.zoom, alpha);
  const k = opt.pixelScale * opt.zoom;
  const snap = (v: number) => Math.round(v * k) / k;
  const camX = snap(cam.x);
  const camY = snap(cam.y);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = themeFor(s).wall;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.setTransform(k, 0, 0, k, -camX * k, -camY * k);
  ctx.imageSmoothingEnabled = false;

  drawRoom(ctx, s);
  drawTerrain(ctx, s, snap);
  drawSwarmGround(ctx, s, snap);
  drawPwGround(ctx, s);
  drawPickups(ctx, s, alpha, snap);
  if (opt.bossName) drawArenaLabels(ctx, s, opt.bossName);
  if (opt.showRange && !s.over && (!s.pvp || pwShown(s, s.seat ?? 0))) drawRangeRing(ctx, s, snap(lerp(s.player.prevX, s.player.x, alpha)), snap(lerp(s.player.prevY, s.player.y, alpha)));
  drawTelegraphs(ctx, s, alpha, snap);
  drawUltGround(ctx, s);
  drawBeastGround(ctx, s);
  drawSageGround(ctx, s);
  opt.under?.(ctx, snap);
  eachPerson(s, () => {
    drawDevices(ctx, s, snap);
    drawMedicGround(ctx, s, snap);
    drawOrbitField(ctx, s, alpha, snap);
    drawApostleGround(ctx, s, snap);
    drawStarGround(ctx, s, snap);
    drawOniGround(ctx, s, snap);
    drawElderGround(ctx, s, snap);
    drawPlagueGround(ctx, s, snap);
    drawSamyeolGround(ctx, s, snap);
    drawTerraGround(ctx, s, snap);
    drawTerraGroundB(ctx, s, snap);
    drawRuneGround(ctx, s, snap);
    drawMorphGround(ctx, s, snap);
    drawForgottenBack(ctx, s, alpha, snap);
    drawRemnantEchoes(ctx, s, snap);
    drawWandererGround(ctx, s, snap);
    drawSecretGround(ctx, s, snap);
  });
  drawEnemies(ctx, s, alpha, snap);
  drawPilgrim(ctx, s, opt.pilgrimLine);
  drawInkMarks(ctx, s, alpha, snap);
  drawClockMarks(ctx, s, snap);
  eachPerson(s, () => drawStarNodes(ctx, s, snap));
  drawPrimeval(ctx, s, snap);
  eachPerson(s, () => drawGreatSpirit(ctx, s, alpha, snap));
  eachPerson(s, (me) => {
    drawPlayer(ctx, s, alpha, snap, me && opt.showHitbox, isTiger(s) || (me && (opt.hidePlayer?.() ?? false)));
    drawEngineerGear(ctx, s, alpha, snap);
    drawOrbs(ctx, s, alpha, snap);
    drawBrawl(ctx, s, alpha, snap);
    drawGunner(ctx, s, alpha, snap);
    drawPets(ctx, s, alpha, snap);
    drawBeastTiger(ctx, s, alpha, snap);
    drawTagKids(ctx, s, alpha, snap);
    drawTitanArm(ctx, s, alpha, snap);
    drawOni(ctx, s, alpha, snap);
    drawIdra(ctx, s, alpha, snap);
    drawSpiritKin(ctx, s, alpha, snap);
    drawRunPet(ctx, s, alpha, snap);
    drawDucklings(ctx, s, alpha, snap);
    drawNinja(ctx, s, alpha, snap);
    drawChrono(ctx, s, snap);
    drawSummons(ctx, s, alpha, snap);
    drawBedouin(ctx, s, alpha, snap);
    if (me) drawImugi(ctx, s, alpha, snap);
    else drawImugiBody(ctx, s, alpha, snap);
    drawMedicAir(ctx, s, snap);
    drawPlagueAir(ctx, s, alpha, snap);
    drawSlayerRage(ctx, s, alpha, snap);
    drawEaterAura(ctx, s, alpha, snap);
    drawMukinAura(ctx, s, alpha, snap);
    drawDoomMarks(ctx, s, alpha, snap);
    drawTerraAura(ctx, s, alpha, snap);
    drawTerraAuraB(ctx, s, alpha, snap);
    drawTerraAuraC(ctx, s, alpha, snap);
    drawTrackerAura(ctx, s, alpha, snap);
    drawOriginAura(ctx, s, alpha, snap);
    drawForgottenAura(ctx, s, alpha, snap);
    drawWandererAura(ctx, s, alpha, snap);
    drawSilkAmmo(ctx, s, alpha, snap);
    drawSilkStacks(ctx, s, snap);
    drawSecretAura(ctx, s, alpha, snap, opt.fateName);
  });
  drawProjectiles(ctx, s, alpha, snap);
  drawEffects(ctx, s, alpha, snap);
  drawPrimevalOverlay(ctx, s, alpha, snap);
  drawUltOverlay(ctx, s, snap);
  drawImugiOverlay(ctx, s);
  drawBeastAir(ctx, s);
  drawDemigodAir(ctx, s);
  drawSageAir(ctx, s);
  if (opt.legendName) drawLegendName(ctx, s, alpha, opt.legendName);
  drawMorphGot(ctx, s, alpha, snap, opt.passiveName);
  drawPaewang(ctx, s, alpha, snap, opt.charName);
  opt.overlay?.(ctx, snap);
  drawOniUps(ctx, s, alpha, snap, opt.oniUp);
  opt.modeOverlay?.(ctx, s, alpha, snap);
  drawAmbushOverlay(ctx, s, snap, s.player.aimDist === undefined ? null : cursorWorld(ctx, opt, k, camX, camY));
  // 패왕전 스킬 조준 미리보기
  if (s.pvp && (opt.skillAim ?? -1) >= 0 && !s.over) drawSkillAim(ctx, s, opt.skillAim!, cursorWorld(ctx, opt, k, camX, camY), alpha, snap);
  drawBossBar(ctx, s);
  drawUmbraTalk(ctx, s, opt.pixelScale, opt.umbraLine);
  drawSageBanner(ctx, s, opt.pixelScale, opt.sageText);
  drawMorphWake(ctx, s);
  if (opt.showReticle && !s.over) drawReticleFor(ctx, s, alpha, snap);
  // 화면에 붙는 글자 (카메라와 상관없이 왼쪽 위)
  drawComboHud(ctx, s, opt.pixelScale);
  drawHaloHud(ctx, s, opt.pixelScale);
  drawRelicHud(ctx, s, opt.pixelScale);
  drawSoulHud(ctx, s, opt.pixelScale);
  drawEaterHud(ctx, s, opt.pixelScale);
  drawTagHud(ctx, s, opt.pixelScale, opt.tagName);
}
