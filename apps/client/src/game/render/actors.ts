// 적·플레이어 그리기 (공격 예고선은 telegraphs): 적(체력 줄·자동 조준 표시) · 플레이어(대시 잔상·방향·맞는 범위·보호막)
import { drawLuxFoe } from "./lux";
import { additive, glow } from "./pwFxBits";
import { drawSlash, enemyPose } from "./enemyPose";
import { DASH_TICKS, inBush, inPlay, ENEMIES, isAlive, luxStage, morphEvolved, WEAPONS, type WeaponDef, type CharacterId, type EnemyState, type PlayerState, type RunState } from "@pixel-rogue/shared";
import { breathe, footShadow, hitPop } from "./bodyMotion";
import { drawCrate } from "./swarm";
import { drawFighter } from "./paewang";
import { drawPwBody } from "./pwLook";
import { drawGuardFx } from "./guardFx";
import { drawAimMark, drawHitRing } from "../aimMark";
import { drawUmbraActor } from "./umbra";
import { drawDemigodActor } from "./demigod";
import { drawSageActor } from "./sage";
import { drawStalker } from "./stalkers";
import { drawCharacter, drawEnemySprite, drawSprite, enemyFrames, hasV2, isCasting, isHurt, sheetFor, type CharacterPose } from "../sprites";
import { C, CHARM_INK, lerp, type Snap } from "./palette";
import { drawMinionDetail } from "./minions";
import { drawBossStatus, drawHitSpot } from "./bossLook";
import { drawParryCd } from "./titan";
import { drawTagCue } from "./tagCue";
import { drawSlayerGauge } from "./slayer";

export function drawEnemies(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  // 무리 여왕이 부른 기는 적은 인큐버스 그림
  const brood = s.enemies.some((b) => b.kind === "brood");
  for (const e of s.enemies) {
    const x = snap(lerp(e.prevX, e.x, alpha));
    const y = snap(lerp(e.prevY, e.y, alpha));
    const size = e.r * 2;
    if (e.svBox) {
      drawCrate(ctx, x, y, e);
      continue;
    }
    // 패왕전 그림자 적은 안 그림 · 무한 모드 AI
    if (s.pvp) continue;
    if (e.pw) {
      drawFighter(ctx, s, e, alpha, snap);
      continue;
    }
    // 빛의 사도: 떨어진 빛의 힘을 얻은 적 둘레 금빛
    drawLuxFoe(ctx, e, x, y, s.tick);
    // 주황 방 정예: 붉은 기운 · 머리 위 붉은 표식
    if (e.champ) {
      const f = 0.7 + 0.3 * Math.sin(s.tick * 0.12 + e.id);
      additive(ctx, () => glow(ctx, x, y, e.r * 2.2, "#ff4a2a", 0.4 * f, 0.25));
      ctx.fillStyle = "#ff5a3a";
      ctx.beginPath();
      ctx.moveTo(x, y - e.r - 4);
      ctx.lineTo(x - 3, y - e.r - 9);
      ctx.lineTo(x + 3, y - e.r - 9);
      ctx.fill();
    }
    // 검은 잔영·거대한 짐승 셋 (땅속·하늘·솟기)
    if (drawUmbraActor(ctx, s, e, x, y) || drawDemigodActor(ctx, s, e, x, y) || drawSageActor(ctx, s, e, x, y) || drawStalker(ctx, s, e, x, y)) continue;
    // 하늘로 날아오른 보스: 그림자만
    if (e.air) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.beginPath();
      ctx.ellipse(x, y, e.r * 1.2, e.r * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    const flashing = (e.phase === "windup" || e.phase === "blink") && Math.floor(s.tick / 4) % 2 === 0;
    const stunned = s.freezeTicks > 0 || (e.stunTicks ?? 0) > 0;
    const tint: readonly [string, number] | undefined = e.hitFlash > 0 ? [C.hit, 1] : stunned ? [C.frozen, 0.5] : flashing ? [C.windup, 0.55] : undefined;
    const look = brood && e.kind === "crawler" && e.noGold ? "incubus" : e.kind;
    footShadow(ctx, x, y, e.r);
    // 보스: 공격 동작 (몸을 젖히고 내지르고 비틂 · 베기 궤적, render/enemyPose)
    const pose = ENEMIES[e.kind].boss ? enemyPose(s, e) : undefined;
    if (pose) {
      ctx.save();
      ctx.translate(x + pose.ox, y + pose.oy);
      ctx.rotate(pose.rot);
      ctx.scale(pose.sx, pose.sy);
      ctx.translate(-x, -y);
    }
    // 공격 그림이 있는 보스(4칸): 걷기 2 · 공격 준비 · 공격
    const atk = pose && enemyFrames(look) >= 4;
    const frame = atk && e.phase === "windup" ? 2 : atk && (pose.slash > 0 || e.phase !== "walk") ? 3 : Math.floor(s.tick / 12) % (atk ? 2 : 1e9);
    const drawn = drawEnemySprite(ctx, look, x, y, frame, e.dirX < 0, tint, (e.r / ENEMIES[e.kind].radius) * hitPop(e.hitFlash));
    if (pose) {
      ctx.restore();
      if (drawn) drawSlash(ctx, x, y, e.r, pose);
    }
    if (drawn) {
      drawHitSpot(ctx, s.tick, e, x, y);
      drawBossStatus(ctx, e, x, y);
    } else {
      ctx.fillStyle = C.enemyEdge;
      ctx.fillRect(x - e.r - 1, y - e.r - 1, size + 2, size + 2);
      ctx.fillStyle = tint ? tint[0] : C[e.kind];
      ctx.fillRect(x - e.r, y - e.r, size, size);
      drawBossStatus(ctx, e, x, y);
    }
    // 체력 줄 (맞은 적만)
    if (e.hp < e.maxHp && !ENEMIES[e.kind].boss) {
      ctx.fillStyle = "#000";
      ctx.fillRect(x - e.r, y - e.r - 4, size, 2);
      ctx.fillStyle = "#e0606a";
      ctx.fillRect(x - e.r, y - e.r - 4, Math.max(1, Math.round((size * e.hp) / e.maxHp)), 2);
    }
    drawMinionDetail(ctx, s, e, x, y);
    drawStuckCharms(ctx, e, x, y);
    if (e.id === s.autoTargetId) drawTargetMark(ctx, x, y, e.r + 3);
  }
}

/** 협동: 쓰러진 사람 (흐리게 엎드린 표시) */
function drawDown(ctx: CanvasRenderingContext2D, p: PlayerState, snap: Snap): void {
  const x = snap(p.x);
  const y = snap(p.y);
  // 새 시트(v2)면 쓰러진 그림
  const sheet = sheetFor(p.characterId, p.lv, p.abM);
  if (hasV2(sheet)) {
    drawCharacter(ctx, sheet, x, y, p.r, { faceX: 0, faceY: 1, moving: false, casting: false, step: 0, down: true });
    return;
  }
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = C[p.characterId];
  ctx.fillRect(x - p.r - 1, y - 2, p.r * 2 + 2, 4);
  ctx.globalAlpha = 1;
  ctx.fillStyle = C.target;
  ctx.fillRect(x - 2, y - p.r - 4, 1, 1);
  ctx.fillRect(x + 1, y - p.r - 4, 1, 1);
  ctx.fillRect(x - 1, y - p.r - 3, 2, 1);
  ctx.fillRect(x - 2, y - p.r - 2, 1, 1);
  ctx.fillRect(x + 1, y - p.r - 2, 1, 1);
}

/** 플레이어 (맞은 뒤 무적이면 깜빡임). 협동은 사람마다 그 자리를 꺼내 놓고 부름 */
/** hideBody: 몸을 그리지 않음 (범 풍류 대기 때 백호 위에 누운 모습을 따로 그림) */
export function drawPlayer(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap, showHitbox: boolean, hideBody = false): void {
  const p = s.player;
  // 패왕전: 경기장에 없는 사람(대기·쓰러짐)은 그리지 않음
  if (s.pvp && !inPlay(s, s.seat ?? 0)) return;
  if (s.party && !isAlive(p)) return drawDown(ctx, p, snap);
  const px = lerp(p.prevX, p.x, alpha);
  const py = lerp(p.prevY, p.y, alpha);
  // 잔영 그림자: 깜빡이지 않고 어두운 반투명 몸
  const shade = (p.rmShade ?? 0) > 0;
  const blink = !shade && !s.pvp && p.invulnTicks > 0 && Math.floor(p.invulnTicks / 3) % 2 === 0;
  const moving = p.x !== p.prevX || p.y !== p.prevY;
  // 기계공학자 레이저는 공격 횟수가 늘지 않음 → 몸에서 나가는 레이저가 있으면 공격 자세
  const beaming = p.characterId === "engineer" && s.effects.some((f) => f.kind === "beam" && Math.abs(f.x - p.x) < 12 && Math.abs(f.y - p.y) < 12);
  const pose = { faceX: p.faceX, faceY: p.faceY, moving, casting: beaming || isCasting(s.tick, p.attackCount), step: Math.floor(s.tick / 8), hurt: isHurt(p.characterId, s.tick, p.hp), dash: p.dashTicks > 0 };
  if (p.dashTicks > 0) {
    // 대시 잔상 (반투명 몸)
    const gx = snap(p.prevX - p.dashDirX * 6);
    const gy = snap(p.prevY - p.dashDirY * 6);
    ctx.globalAlpha = 0.35;
    if (!drawCharacter(ctx, morphSheet(p) ?? p.characterId, gx, gy, p.r, { ...morphPose(p, pose), casting: false })) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(gx - p.r, gy - p.r, p.r * 2, p.r * 2);
    }
    ctx.globalAlpha = 1;
  }
  if (!blink && !s.over) {
    const x = snap(px);
    const y = snap(py);
    if (!hideBody) drawAimMark(ctx, x, y, p.r, p.faceX, p.faceY);
    // 혼돈의 영혼이 있으면 몸이 흐림
    if (s.enemies.some((e) => e.kind === "soul" && e.aux === 1 && e.hp > 0)) ctx.globalAlpha = 0.12;
    // 베두인: 차크람을 던지면 _bare 그림 (새 그림 시트 v2는 빈손 그림이 아직 없어 그대로)
    // 오니 신인족: 긴 뿔의 날렵한 모습
    const sheet = p.kingRoom !== undefined ? "crownKing" : p.characterId === "oni" && (p.oGod ?? 0) > 0 ? "oni_god" : p.characterId === "slayer" && (p.slRage ?? 0) > 0 ? "slayer_rage" : p.characterId === "lux" && luxStage(p) > 0 ? `lux${luxStage(p) + 1}` : sheetFor(p.characterId, p.lv, p.abM);
    // 베두인 무희의 춤: 대시하는 동안 몸이 한 바퀴 빙글 돎
    const twirl = p.characterId === "bedouin" && p.dashTicks > 0 && p.passives.includes("duneRush");
    if (twirl) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((1 - p.dashTicks / DASH_TICKS) * Math.PI * 2);
      ctx.translate(-x, -y);
    }
    const club = WEAPONS[p.weaponId].kind === "club" ? p.weaponId : null;
    // 변희: 든 동물의 모습 (옆모습)
    const body = morphSheet(p) ?? (p.ckHeld === false && !hasV2(sheet) ? `${sheet}_bare` : sheet);
    // 각성한 하늘 짐승이 공중 습격 중이면 몸이 보이지 않음
    if (shade) {
      ctx.globalAlpha = 0.4;
      ctx.filter = "brightness(0.15) sepia(1) hue-rotate(220deg) saturate(2)";
    }
    const look = [p.characterId, x, y, p.r, morphPose(p, pose), moving ? Math.floor(s.tick / 8) : 0, body, club] as const;
    // 패왕전: 편 색 외곽선
    if (s.pw && inBush(s.pw.arena, x, y)) ctx.globalAlpha *= 0.5;
    if (!hideBody && !p.mRaid) footShadow(ctx, x, y, p.r);
    if (!hideBody && !p.mRaid && s.pvp) drawPwBody(ctx, s, ...look);
    else if (!hideBody && !p.mRaid) breathe(ctx, x, y + p.r, s.tick, !moving && !pose.casting, () => drawBody(ctx, ...look));
    if (twirl) ctx.restore();
    ctx.filter = "none";
    ctx.globalAlpha = 1;
    if (showHitbox) drawHitRing(ctx, x, y, p.r);
    // 패왕전은 편 색 체력 줄(paewang)만
    if (!hideBody && !s.sudden && !s.pvp) drawPlayerHp(ctx, p, x, y, s.tick);
    drawGuardFx(ctx, s, p, x, y);
  }
}

/** 변희가 변한 동물 그림 (없으면 사람 모습) */
function morphSheet(p: PlayerState): string | undefined {
  // 대시한 뒤에는 사람 모습 (다시 공격하면 동물)
  const a = p.characterId === "byeonhui" && !p.mHuman ? (WEAPONS[p.weaponId] as WeaponDef).animal : undefined;
  return a ? `morph-${a}${morphEvolved(p) ? "-evo" : ""}` : undefined;
}
/** 동물은 옆모습만: 위·아래를 봐도 옆으로 */
function morphPose(p: PlayerState, pose: CharacterPose): CharacterPose {
  return morphSheet(p) ? { ...pose, faceX: p.faceX < 0 ? -1 : 1, faceY: 0 } : pose;
}

/** 머리 위 작은 체력 줄 (깎이는 게 바로 보이게, 낮으면 붉게) */
function drawPlayerHp(ctx: CanvasRenderingContext2D, p: PlayerState, x: number, y: number, tick: number): void {
  const w = 16;
  const r = Math.max(0, Math.min(1, p.hp / p.stats.maxHp));
  // 캐릭터 그림(모두 파수꾼과 같은 32칸, 발이 몸 아래)의 맨 위 바로 위 · 큰 변신 모습(각성 오니·피의 학살·각성 동물)은 48칸
  const top = y + p.r - ((p.characterId === "oni" && (p.oGod ?? 0) > 0) || (p.characterId === "slayer" && (p.slRage ?? 0) > 0) || morphEvolved(p) ? 46 : 31);
  ctx.fillStyle = "rgba(10,8,16,0.85)";
  ctx.fillRect(x - w / 2 - 1, top - 1, w + 2, 4);
  ctx.fillStyle = r > 0.5 ? "#6ad86a" : r > 0.25 ? "#f2c14e" : "#e0505a";
  ctx.fillRect(x - w / 2, top, Math.max(r > 0 ? 1 : 0, Math.round(w * r)), 2);
  if (p.characterId === "titan") drawParryCd(ctx, p, x + w / 2 + 3, top + 1);
  drawTagCue(ctx, p, x, top, tick);
  drawSlayerGauge(ctx, p, x, top, tick);
}

/** 캐릭터 몸 (그림이 없으면 도형). 타워 디펜스 캐릭터 고르기 칸에도 씀 */
/** sheet: 그림 이름 (풋내기는 레벨마다 다른 옷, 없으면 캐릭터 이름) */
/** club: 오니가 든 방망이 (없으면 명뢰봉, null이면 빈손) */
export function drawBody(ctx: CanvasRenderingContext2D, id: CharacterId, x: number, y: number, r: number, pose: CharacterPose, frame: number, sheet: string = sheetFor(id), club?: string | null): void {
  if (drawCharacter(ctx, sheet, x, y, r, pose, club) || drawCharacter(ctx, id, x, y, r, pose, club) || drawSprite(ctx, id, x, y, frame, pose.faceX < 0)) return;
  ctx.fillStyle = C.playerEdge;
  ctx.fillRect(x - r - 1, y - r - 1, r * 2 + 2, r * 2 + 2);
  ctx.fillStyle = C[id];
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  // 야수: 고양이 귀
  if (id === "beast") for (const ex of [x - r, x + r - 2]) ctx.fillRect(ex, y - r - 2, 2, 2);
}

/** 적 몸에 붙은 부적 자리 (최대 4장: 위 왼쪽·오른쪽, 아래 왼쪽·오른쪽) */
const STUCK_AT: readonly (readonly [number, number])[] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];

/** 적에게 붙은 부적 (수양은 도트 장 수, 나머지는 추가 효과까지 모은 수. 터지면 떨어져 안 보임) */
function drawStuckCharms(ctx: CanvasRenderingContext2D, e: EnemyState, x: number, y: number): void {
  const seal = (e.seal ?? 0) > 0;
  const n = Math.min(STUCK_AT.length, seal ? (e.seal ?? 0) : (e.charms ?? 0));
  const ink = seal ? CHARM_INK.seal : e.charmKind ? CHARM_INK[e.charmKind] : C.charmPaper;
  for (let i = 0; i < n; i++) {
    const [sx, sy] = STUCK_AT[i]!;
    const px = x + sx * (e.r - 1) - (sx > 0 ? 2 : 1);
    const py = y + sy * (e.r - 2) - 2;
    ctx.fillStyle = "#3a2a1a";
    ctx.fillRect(px - 1, py - 1, 5, 6);
    ctx.fillStyle = C.charmPaper;
    ctx.fillRect(px, py, 3, 4);
    ctx.fillStyle = ink;
    ctx.fillRect(px + 1, py + 1, 1, 2);
  }
}

function drawTargetMark(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.fillStyle = C.target;
  for (const [sx, sy] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ] as const) {
    const cx = x + sx * r;
    const cy = y + sy * r;
    ctx.fillRect(cx - (sx > 0 ? 2 : 0), cy, 3, 1);
    ctx.fillRect(cx, cy - (sy > 0 ? 2 : 0), 1, 3);
  }
}

/** 보스 눈 (임시 그림) */
