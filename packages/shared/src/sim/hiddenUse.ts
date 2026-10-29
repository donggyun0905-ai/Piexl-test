// 히든 사용 아이템 효과 (itemsHidden.HIDDEN_USES, sim/items.useSlot이 부름): 에테르 폭탄 · 대마법사의 금지된 주문서 · 차원이동문 · 둘째 묶음은 sim/hiddenDice
import { HIDDEN_USES as U } from "../itemsHidden";
import { createRng, deriveSeed } from "../rng";
import { blastAt, removeDead } from "./combat";
import { climb } from "./rooms";
import { fateDice, portalGun } from "./hiddenDice";
import type { RunState } from "./types";
import { addEffect, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 히든 사용 아이템 하나 쓰기 (다른 아이템이면 아무 일 없음) */
export function hiddenUse(s: RunState, item: string, slot: number): void {
  const p = s.player;
  if (item === "aetherBomb") {
    const { damage, radius } = U.aetherBomb;
    blastAt(s, p.x, p.y, radius, damage);
    removeDead(s);
    addEffect(s, { kind: "hdAether", x: p.x, y: p.y, dirX: 0, dirY: 0, size: radius, maxTicks: 30 });
  } else if (item === "forbiddenScroll") {
    // 적 자리 먼저, 남는 발은 방 곳곳에 (떨어질 자리를 먼저 보여 줌)
    const m = U.forbiddenScroll;
    const rng = createRng(deriveSeed(s.seed, "meteor", s.tick));
    const live = s.enemies.filter((e) => e.hp > 0);
    for (let i = 0; i < m.count; i++) {
      const e = live[i];
      const x = e ? e.x : rng.int(Math.ceil(ROOM_MIN_X) + 16, Math.floor(ROOM_MAX_X) - 16);
      const y = e ? e.y : rng.int(Math.ceil(ROOM_MIN_Y) + 16, Math.floor(ROOM_MAX_Y) - 16);
      const tick = s.tick + m.fuse + i * m.gap;
      s.pendingBlasts.push({ tick, x, y, radius: m.radius, damage: m.damage });
      addEffect(s, { kind: "hdMeteor", x, y, dirX: 0, dirY: 0, size: m.radius, maxTicks: m.fuse + i * m.gap });
    }
    addEffect(s, { kind: "hdScroll", x: p.x, y: p.y - 12, dirX: 0, dirY: 0, size: 16, maxTicks: 40 });
  } else if (item === "dimensionGate") {
    // 이 층을 건너뜀 (마지막 층이면 클리어)
    addEffect(s, { kind: "hdGate", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 24, maxTicks: 40 });
    climb(s);
  } else if (item === "portalGun") portalGun(s, slot);
  else if (item === "fateDice") fateDice(s);
  // 저주받은 주사위 · 테라포밍: 고르는 창을 엶 (hiddenDice.hiddenPick)
  else if (item === "cursedDice") p.hdPick = "curse";
  else if (item === "terraform") p.hdPick = "terra";
}
