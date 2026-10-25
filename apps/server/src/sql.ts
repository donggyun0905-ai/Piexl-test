// Durable Object SQLite (ctx.storage.sql) 중 쓰는 부분만. 시험에서는 Node SQLite로 바꿔 끼움
export type Row = Record<string, string | number | null | ArrayBuffer>;

export interface SqlLike {
  exec(query: string, ...bindings: unknown[]): { toArray(): Row[] };
}

export function first(sql: SqlLike, query: string, ...bindings: unknown[]): Row | undefined {
  return sql.exec(query, ...bindings).toArray()[0];
}
