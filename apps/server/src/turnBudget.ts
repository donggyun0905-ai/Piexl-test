// 협동 중계(TURN) 안전장치: 한 달에 내주는 횟수와 한 사람(IP)이 하루에 받는 횟수를 셈.
// 한 번 = 최대 3시간 중계. 협동 한 연결은 1시간에 약 30MB(추정)라, 한 달 한도를 다 써도 무료 1,000GB에 못 미치게 잡음
import type { HubContext } from "./hub";
import { first } from "./sql";

export const TURN_MONTHLY_MAX = 2000;
export const TURN_DAILY_PER_IP = 20;

/** 하나 더 내줘도 되면 세고 true */
export function takeTurn(ctx: HubContext, ip: string): boolean {
  const now = ctx.now();
  const month = new Date(now).toISOString().slice(0, 7);
  const key = `turn:${month}`;
  const used = Number(first(ctx.sql, "SELECT v FROM meta WHERE k = ?", key)?.v ?? 0);
  if (used >= TURN_MONTHLY_MAX) return false;
  // 한 사람이 한도를 다 쓰지 못하게 (메모리만, 하루)
  const lim = ctx.limits.get(`turn:${ip}`);
  if (lim && lim.until > now && lim.count >= TURN_DAILY_PER_IP) return false;
  if (!lim || lim.until <= now) ctx.limits.set(`turn:${ip}`, { count: 1, until: now + 86_400_000 });
  else lim.count++;
  ctx.sql.exec("INSERT INTO meta (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v", key, String(used + 1));
  return true;
}
