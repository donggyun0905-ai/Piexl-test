// 티어표 캐릭터 미리보기: 허수아비 둘레를 돌며 계속 때리는 입력 (연습장 판에 그대로 넣음 · 기록 없음)
import { EMPTY_INPUT, WEAPONS, type RunState, type TickInput } from "@pixel-rogue/shared";

/** 한 바퀴 도는 틱 수 · 대시 간격 */
const ORBIT_TICKS = 600;
const DASH_EVERY = 150;

export function previewInput(s: RunState): TickInput {
  const p = s.player;
  const d = s.enemies.find((e) => e.kind === "dummy");
  if (!d) return { ...EMPTY_INPUT, autoAim: true };
  const w = WEAPONS[p.weaponId];
  // 근접은 붙고 원거리는 사거리 안쪽에서 빙 돎
  const r = Math.max(22, Math.min(70, w.range * (w.kind === "melee" ? 0.5 : 0.6)));
  const a = (s.tick / ORBIT_TICKS) * Math.PI * 2;
  const gx = d.x + Math.cos(a) * r;
  const gy = d.y + Math.sin(a) * r;
  // 베두인: 던져 떨어진 차크람을 주우러 감
  const pick = p.ckHeld === false && p.ck?.mode === "ground" ? p.ck : null;
  const dx = (pick ? pick.x : gx) - p.x;
  const dy = (pick ? pick.y : gy) - p.y;
  const len = Math.hypot(dx, dy);
  const go = len > 2 ? Math.min(1, len / 12) : 0;
  const ax = d.x - p.x;
  const ay = d.y - p.y;
  const al = Math.hypot(ax, ay) || 1;
  const step = Math.min(10, Math.max(1, Math.round(al / 12)));
  return {
    ...EMPTY_INPUT,
    moveX: len ? Math.round((dx / len) * go * 100) : 0,
    moveY: len ? Math.round((dy / len) * go * 100) : 0,
    aimX: Math.round((ax / al) * 100) * step,
    aimY: Math.round((ay / al) * 100) * step,
    attack: true,
    dash: s.tick % DASH_EVERY === DASH_EVERY - 1,
    // 스킬 키가 있는 캐릭터(추적자)는 돌아가며
    skill: s.tick % 120 === 60 ? 1 + ((s.tick / 120) | 0) % 3 : 0,
    autoAim: true,
  };
}
