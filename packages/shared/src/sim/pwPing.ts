// 패왕전 성장 대결 핑: 같은 편에게 보이는 표시 (모여 · 위험 · 공격 · 큰 보스 잡자). 사람은 T(위험은 Alt+T)로 마우스 자리에, AI는 큰 보스를 잡을 때
// 입력 menu 코드로 들어와 모두가 같은 계산 (자리는 4px 단위). 종류는 찍은 곳에 따라: 큰 보스 둘레 = 보스, 상대 포탑·캐릭터 둘레 = 공격
import { PW_PING } from "../pwRules";
import { allPlayers, seatNo } from "./party";
import { inPlay } from "./pvpWorld";
import type { PwPing } from "./pwGrowTypes";
import type { RunState } from "./types";

export const PING_MENU = 1_800_000;
/** 사람 핑 입력 코드 (danger: 위험 핑) */
export const pingCode = (x: number, y: number, danger: boolean): number => PING_MENU + (danger ? 160_000 : 0) + Math.max(0, Math.min(399, Math.round(x / 4))) * 400 + Math.max(0, Math.min(399, Math.round(y / 4)));

const near = (a: { x: number; y: number }, x: number, y: number, r: number) => (a.x - x) ** 2 + (a.y - y) ** 2 <= r * r;

/** 핑 찍기 (자리 seat의 편) · 종류는 찍은 곳에 따라 */
export function addPing(s: RunState, seat: number, x: number, y: number, danger = false): PwPing | undefined {
  const pv = s.pvp!;
  const g = pv.grow;
  const st = pv.seats[seat]!;
  if (!g || (st.pingAt !== undefined && s.tick - st.pingAt < PW_PING.every)) return undefined;
  st.pingAt = s.tick;
  const team = st.team;
  const big = g.units.find((u) => (u.kind === "dragon" || u.kind === "godeater") && u.body.hp > 0 && near(u.body, x, y, 48));
  const foe = g.units.some((u) => u.team === 1 - team && u.kind === "tower" && u.body.hp > 0 && near(u.body, x, y, 40)) || allPlayers(s).some((p, j) => pv.seats[j]!.team !== team && inPlay(s, j) && near(p, x, y, 30));
  const ping: PwPing = { team, seat, x: big ? big.body.x : x, y: big ? big.body.y : y, at: s.tick, kind: danger ? "danger" : big ? "boss" : foe ? "attack" : "go" };
  if (big && !danger) ping.boss = big.kind as "dragon" | "godeater";
  g.pings = [...(g.pings ?? []).filter((p) => s.tick - p.at < PW_PING.show && p.seat !== seat), ping];
  return ping;
}

/** 사람 핑 입력 (처리했으면 true) */
export function pingMenu(s: RunState, code: number): boolean {
  if (!s.pvp?.grow || code < PING_MENU || code >= PING_MENU + 320_000) return false;
  const k = code - PING_MENU;
  const danger = k >= 160_000;
  const v = k % 160_000;
  addPing(s, seatNo(s), Math.floor(v / 400) * 4, (v % 400) * 4, danger);
  return true;
}

/** 우리 편 핑 중 아직 따를 것 (가장 새 것, kind를 주면 그 종류만) */
export function teamPing(s: RunState, team: number, kind?: PwPing["kind"], ticks = PW_PING.followTicks): PwPing | undefined {
  const list = s.pvp?.grow?.pings ?? [];
  for (let k = list.length - 1; k >= 0; k--) {
    const p = list[k]!;
    if (p.team === team && s.tick - p.at < ticks && (!kind || p.kind === kind)) return p;
  }
  return undefined;
}
