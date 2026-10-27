// 적·플레이어 그리기: 공격 예고선 · 적(체력 줄·자동 조준 표시) · 플레이어(대시 잔상·방향·맞는 범위·보호막)
import { allPlayers, DASH_TICKS, ENEMIES, isAlive, morphEvolved, WEAPONS, type WeaponDef, type CharacterId, type EnemyState, type PlayerState, type RunState } from "@pixel-rogue/shared";
import { drawCrate } from "./swarm";
import { drawAimMark, drawHitRing } from "../aimMark";
import { drawCharacter, drawEnemySprite, drawSprite, isCasting, sheetFor, type CharacterPose } from "../sprites";
import { C, CHARM_INK, lerp, type Snap } from "./palette";
import { drawGuardianWarn, drawMinionDetail } from "./minions";
import { drawBossStatus } from "./bossLook";
import { drawParryCd } from "./titan";
import { drawTagCue } from "./tagCue";
import { drawSlayerGauge } from "./slayer";

/** 곧 탄·소환·범위 공격을 쓰기 전 몸 둘레 고리가 줄어드는 보스 */
const RING_WARN = new Set<string>(["brood", "seer", "archer", "siren", "plant", "reaper", "archangel"]);

/** 공격 예고선: 탄을 쏘기 직전의 겨냥선, 돌진 직전의 돌진 방향 */
export function drawTelegraphs(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  for (const e of s.enemies) {
    const x = snap(lerp(e.prevX, e.x, alpha));
    const y = snap(lerp(e.prevY, e.y, alpha));
    drawGuardianWarn(ctx, e, x, y);
    let dx = 0;
    let dy = 0;
    let len = 0;
    if (e.kind === "spitter" && e.timer > 0 && e.timer <= 28) {
      const p = nearest(s, e);
      dx = p.x - e.x;
      dy = p.y - e.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      dx /= d;
      dy /= d;
      len = Math.min(d, 90);
    } else if ((e.kind === "charger" || e.kind === "hulk" || e.kind === "guardian" || e.kind === "centaur") && e.phase === "windup") {
      // 켄타우로스는 돌진 방향을 마지막에 정하므로 플레이어 쪽
      const c = e.kind === "centaur" ? (Math.hypot(s.player.x - e.x, s.player.y - e.y) || 1) : 1;
      dx = e.kind === "centaur" ? (s.player.x - e.x) / c : e.dirX;
      dy = e.kind === "centaur" ? (s.player.y - e.y) / c : e.dirY;
      len = e.kind === "hulk" ? 86 : e.kind === "centaur" ? 64 : 62;
    } else if (RING_WARN.has(e.kind) && e.phase !== "blink" && e.phase !== "act" && e.timer > 0 && e.timer <= 22) {
      // 보스가 곧 탄·소환을 씀: 몸 둘레의 고리가 줄어들며 깜빡임
      const f = e.timer / 22;
      ctx.strokeStyle = `rgba(255, 90, 90, ${0.9 - 0.5 * f})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, e.r + 3 + 10 * f, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (len > 0) {
      ctx.strokeStyle = "rgba(255, 90, 90, 0.55)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + dx * len, y + dy * len);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

export function drawEnemies(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  // 서큐버스(무리 여왕)가 부른 기는 적은 작은 인큐버스로 보임 (그림만)
  const brood = s.enemies.some((b) => b.kind === "brood");
  for (const e of s.enemies) {
    const x = snap(lerp(e.prevX, e.x, alpha));
    const y = snap(lerp(e.prevY, e.y, alpha));
    const size = e.r * 2;
    if (e.svBox) {
      drawCrate(ctx, x, y, e);
      continue;
    }
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
    if (drawEnemySprite(ctx, look, x, y, Math.floor(s.tick / 12), e.dirX < 0, tint, e.r / ENEMIES[e.kind].radius)) {
      drawBossStatus(ctx, e, x, y);
    } else {
      // 그림을 아직 못 불러왔으면 네모
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

/** 협동: 적이 노리는 가장 가까운 살아 있는 사람 (혼자면 나) */
function nearest(s: RunState, e: EnemyState): PlayerState {
  let best = s.player;
  let bestD = Infinity;
  for (const p of allPlayers(s)) {
    const dx = p.x - e.x;
    const dy = p.y - e.y;
    const d = dx * dx + dy * dy;
    if (isAlive(p) && d < bestD) [best, bestD] = [p, d];
  }
  return best;
}

/** 협동: 쓰러진 사람 (흐리게 엎드린 표시) */
function drawDown(ctx: CanvasRenderingContext2D, p: PlayerState, snap: Snap): void {
  const x = snap(p.x);
  const y = snap(p.y);
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
  if (s.party && !isAlive(p)) return drawDown(ctx, p, snap);
  const px = lerp(p.prevX, p.x, alpha);
  const py = lerp(p.prevY, p.y, alpha);
  // 잔영 그림자: 깜빡이지 않고 어두운 반투명 몸
  const shade = (p.rmShade ?? 0) > 0;
  const blink = !shade && p.invulnTicks > 0 && Math.floor(p.invulnTicks / 3) % 2 === 0;
  const moving = p.x !== p.prevX || p.y !== p.prevY;
  const pose = { faceX: p.faceX, faceY: p.faceY, moving, casting: isCasting(s.tick, p.attackCount), step: Math.floor(s.tick / 8) };
  if (p.dashTicks > 0) {
    // 대시 잔상: 그림이 있으면 캐릭터 모양 그대로 반투명하게
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
    // 갓이터 혼돈의 영혼이 남아 있으면 몸이 거의 보이지 않음
    if (s.enemies.some((e) => e.kind === "soul" && e.aux === 1 && e.hp > 0)) ctx.globalAlpha = 0.12;
    // 베두인: 차크람을 던져 손이 비면 등에 차크람이 없는 그림 (_bare)
    // 오니 신인족: 긴 뿔의 날렵한 모습
    const sheet = p.characterId === "oni" && (p.oGod ?? 0) > 0 ? "oni_god" : p.characterId === "slayer" && (p.slRage ?? 0) > 0 ? "slayer_rage" : sheetFor(p.characterId, p.lv, p.abM);
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
    const body = morphSheet(p) ?? (p.ckHeld === false ? `${sheet}_bare` : sheet);
    // 각성한 하늘 짐승이 공중 습격 중이면 몸이 보이지 않음
    if (shade) {
      ctx.globalAlpha = 0.4;
      ctx.filter = "brightness(0.15) sepia(1) hue-rotate(220deg) saturate(2)";
    }
    if (!hideBody && !p.mRaid) drawBody(ctx, p.characterId, x, y, p.r, morphPose(p, pose), moving ? Math.floor(s.tick / 8) : 0, body, club);
    if (twirl) ctx.restore();
    ctx.filter = "none";
    ctx.globalAlpha = 1;
    if (showHitbox) drawHitRing(ctx, x, y, p.r);
    if (!hideBody && !s.sudden) drawPlayerHp(ctx, p, x, y, s.tick);
    if (p.shieldTicks > 0) {
      ctx.strokeStyle = "rgba(120, 200, 255, 0.85)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, p.r + 4, 0, Math.PI * 2);
      ctx.stroke();
    }
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
  // 캐릭터 그림(32칸, 거인은 48칸, 발이 몸 아래)의 맨 위 바로 위
  const top = y + p.r - (p.characterId === "titan" || p.characterId === "oni" || p.characterId === "mukin" || p.characterId === "slayer" || p.characterId === "rider" || morphEvolved(p) ? 46 : 31);
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
