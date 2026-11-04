// 대장간 꼬리표 변환 기록 (sim/forge): 같은 패시브를 여러 개 가졌으면 하나하나 따로 (숫돌 3개 → 3개 저마다 다른 꼬리표)
// 기록 이름 = "패시브 id#몇 번째" (같은 패시브 중 차례, 0부터) · 예전 저장의 "패시브 id"는 그 패시브 모두에 붙은 것으로 읽음
import { passiveTag, type ItemTag } from "../itemsTags";
import type { PlayerState } from "./types";

/** k번째 패시브의 기록 이름 */
export function retagKey(p: PlayerState, k: number): string {
  const id = p.passives[k]!;
  let n = 0;
  for (let i = 0; i < k; i++) if (p.passives[i] === id) n++;
  return `${id}#${n}`;
}

/** k번째 패시브의 지금 꼬리표 (바꾼 것 → 예전 기록 → 원래 꼬리표) */
export function passiveTagAt(p: PlayerState, k: number): ItemTag | undefined {
  const id = p.passives[k]!;
  return p.retag?.[retagKey(p, k)] ?? p.retag?.[id] ?? passiveTag(id);
}

/** k번째 패시브 하나만 꼬리표를 바꿈 (예전 기록은 같은 패시브마다 따로 풀어 둠) */
export function setRetag(p: PlayerState, k: number, tag: ItemTag): void {
  const id = p.passives[k]!;
  const map = (p.retag ??= {});
  const old = map[id];
  if (old) {
    delete map[id];
    p.passives.forEach((x, i) => {
      if (x === id) map[retagKey(p, i)] ??= old;
    });
  }
  map[retagKey(p, k)] = tag;
}

/** 패시브 목록 splice (지우기·바꿔 넣기) + 꼬리표 기록을 남은 패시브에 그대로 맞춤. 지운 패시브를 돌려줌 */
export function splicePassives(p: PlayerState, start: number, del: number, ...add: PlayerState["passives"]): PlayerState["passives"] {
  if (!p.retag) return p.passives.splice(start, del, ...add);
  const tags = p.passives.map((id, k) => p.retag?.[retagKey(p, k)] ?? p.retag?.[id]);
  const out = p.passives.splice(start, del, ...add);
  tags.splice(start, del, ...add.map(() => undefined));
  p.retag = {};
  p.passives.forEach((_, k) => {
    const t = tags[k];
    if (t) p.retag![retagKey(p, k)] = t;
  });
  if (!Object.keys(p.retag).length) delete p.retag;
  return out;
}
