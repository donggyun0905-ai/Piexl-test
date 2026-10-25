// 버려진 자들: 지금 해야 할 행동을 조종 중인 아이 머리 위(체력 줄 위)에 표시 — 공격(그 아이 색 칼) · 탭(금빛 ⇄, 깜빡) · 틀림(붉은 ✕)
import { stageTokens, TAG_SETS, WEAPONS, type PlayerState, type WeaponDef } from "@pixel-rogue/shared";
import { MEMBER_COLORS } from "./abandoned";

type Ctx = CanvasRenderingContext2D;

/** 다음 행동: 0·1·2 = 그 아이로 공격 · -1 = 탭 · -2 = 틀려서 처음으로 · null = 없음 */
function nextCue(p: PlayerState): number | null {
  const w: WeaponDef = WEAPONS[p.weaponId];
  const set = w.tag ? TAG_SETS[w.tag] : undefined;
  if (!set) return null;
  if ((p.abMiss ?? 0) > 0) return -2;
  if (p.abDone) return -1;
  return stageTokens(set, p.abStage ?? 0)[p.abPos ?? 0] ?? null;
}

/** x: 머리 가운데 · top: 체력 줄 위 끝 */
export function drawTagCue(ctx: Ctx, p: PlayerState, x: number, top: number, tick: number): void {
  if (p.characterId !== "abandoned") return;
  const cue = nextCue(p);
  if (cue === null) return;
  const y = top - 7 + (cue === -1 ? Math.round(Math.sin(tick * 0.3)) : 0);
  const color = cue === -2 ? "#ff5a5a" : cue === -1 ? "#ffd84a" : MEMBER_COLORS[cue] ?? "#ffffff";
  // 작은 말풍선 바탕 + 아래 꼬리
  ctx.fillStyle = "rgba(10,8,16,0.88)";
  ctx.fillRect(x - 6, y - 4, 12, 9);
  ctx.fillRect(x - 1, y + 5, 2, 1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 5.5, y - 3.5, 11, 8);
  ctx.fillStyle = color;
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (cue === -1) {
    if ((tick >> 3) % 2 === 0) ctx.fillText("⇄", x, y + 1);
  } else if (cue === -2) ctx.fillText("✕", x, y + 1);
  else {
    // 공격: 비스듬한 칼 + 손잡이 (그 아이 색)
    for (let i = 0; i < 5; i++) ctx.fillRect(x - 2 + i, y + 2 - i, 1, 1);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 2, y - 2, 1, 1);
    ctx.fillStyle = color;
    ctx.fillRect(x - 3, y + 1, 3, 1);
    ctx.fillRect(x - 2, y + 3, 1, 1);
  }
  ctx.textAlign = "start";
}
