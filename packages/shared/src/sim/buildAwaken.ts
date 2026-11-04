// 각성 증강: 같은 꼬리표 8개(단계 4)를 모으면 그 꼬리표 기술이 대기 시간마다 저절로 나감 (수치 buildSetDefs.AWAKEN)
// 여기는 대기 시간 · 깔린 장판·떨어지는 공격(awFields) 처리, 기술마다 내용은 awakenCasts · 그림은 client render/awaken*
import { AWAKEN as A } from "../buildSetDefs";
import { ITEM_TAGS, type ItemTag } from "../itemsTags";
import { CASTS, fieldPulse, fieldTick, strike } from "./awakenCasts";
import type { RunState } from "./types";
import { dist2 } from "./util";

/** 깔린 장판(next가 있음: every 틱마다) 또는 떨어지는 공격(end 틱에 한 번) */
export interface AwField {
  tag: ItemTag;
  x: number;
  y: number;
  r: number;
  end: number;
  next?: number;
  every?: number;
  /** 움직임 (회오리) · 안쪽 반경 (대지 고리) · 해일: 나아가는 방향·시작 틱·맞힌 적 */
  vx?: number;
  vy?: number;
  ir?: number;
  dx?: number;
  dy?: number;
  start?: number;
  hit?: number[];
}

export interface AwakenPlayerState {
  /** 꼬리표마다 남은 대기 (ITEM_TAGS 차례) · 깔린 장판·떨어지는 공격 · 장판을 깐 방 (방을 옮기면 지움) */
  awCd?: number[];
  awFields?: AwField[];
  awRoom?: number;
}

/** 각성한 꼬리표 (8개 이상) */
export const awakened = (tiers: readonly number[] | undefined): ItemTag[] => ITEM_TAGS.filter((_, i) => (tiers?.[i] ?? 0) >= 4);

/** 틱마다 (buildSetFx.setTick) */
export function awakenTick(s: RunState): void {
  const p = s.player;
  if (p.awRoom !== s.roomId) {
    p.awRoom = s.roomId;
    p.awFields = undefined;
  }
  const list = p.awFields;
  if (list?.length) {
    const keep = [];
    const n = list.length;
    for (const f of list.slice(0, n)) {
      fieldTick(s, f);
      if (f.next !== undefined) {
        if (s.tick >= f.next) {
          fieldPulse(s, f);
          f.next += f.every ?? 1;
        }
        if (s.tick < f.end) keep.push(f);
      } else if (s.tick >= f.end) strike(s, f);
      else keep.push(f);
    }
    // 처리 중에 새로 생긴 것은 그대로 이어 붙임
    keep.push(...(p.awFields ?? []).slice(n));
    p.awFields = keep.length ? keep : undefined;
  }
  const tags = awakened(p.setTiers);
  if (!tags.length || !s.enemies.some((e) => e.hp > 0 && !e.immune && dist2(e, p) <= A.range ** 2)) return;
  const cd = (p.awCd ??= ITEM_TAGS.map(() => 0));
  for (const tag of tags) {
    const i = ITEM_TAGS.indexOf(tag);
    if ((cd[i] ?? 0) > 0) {
      cd[i] = (cd[i] ?? 0) - 1;
      continue;
    }
    CASTS[tag](s);
    cd[i] = A[tag].cd;
  }
}
