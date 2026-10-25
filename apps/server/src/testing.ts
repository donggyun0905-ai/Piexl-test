// 시험용: Node SQLite로 Durable Object 저장소 흉내 (배포 코드에서는 쓰지 않음)
import { routeHub, type HubContext } from "./hub";
import type { Row, SqlLike } from "./sql";

interface NodeSqlite {
  DatabaseSync: new (path: string) => { prepare(q: string): { all(...params: unknown[]): Row[] } };
}

export function memorySql(): SqlLike {
  // 서버 타입 설정에 Node 타입이 없어 Node 내장 모듈을 직접 꺼냄 (Node 22 이상)
  const proc = (globalThis as unknown as { process: { getBuiltinModule(name: string): unknown } }).process;
  const { DatabaseSync } = proc.getBuiltinModule("node:sqlite") as NodeSqlite;
  const db = new DatabaseSync(":memory:");
  return {
    exec(query: string, ...bindings: unknown[]) {
      const rows = db.prepare(query).all(...bindings);
      return { toArray: () => rows.map((r) => ({ ...r })) };
    },
  };
}

/** Hub에 요청 보내기 (본문이 있으면 POST) */
export async function call(ctx: HubContext, path: string, body?: unknown) {
  const res = await routeHub(
    ctx,
    new Request(`https://x${path}`, body === undefined ? {} : { method: "POST", body: JSON.stringify(body) }),
  );
  return { status: res.status, body: (await res.json()) as Record<string, unknown> };
}

