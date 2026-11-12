import { describe, expect, it } from "vitest";
import { damagePlayer, envDamage } from "./combat";
import { FINAL_BOSS_HIT_RULES as R } from "./finalBossHit";
import { drifter, enemy } from "./perkTestUtil";
import type { EnemyKind } from "../enemyDefs";

/** 최대 체력 maxHp인 떠돌이 + (있으면) kind 적 하나 */
function setup(maxHp: number, kind?: EnemyKind) {
  const s = drifter();
  s.player.stats.maxHp = maxHp;
  s.player.hp = maxHp;
  if (kind) s.enemies.push({ ...enemy(1, 200, 200), kind });
  return s;
}

describe("최종보스 체력 비례 피해", () => {
  it("라스트 보스와 싸우면 맞는 피해에 최대 체력 5%를 더함 (탱커일수록 더 아픔)", () => {
    for (const kind of ["dragon", "sage", "asmodeus", "lucifer"] as EnemyKind[]) {
      const s = setup(400, kind);
      damagePlayer(s, 20);
      expect(400 - s.player.hp).toBeCloseTo(20 + 400 * R.MAX_HP_PCT);
    }
  });

  it("일반 몬스터·일반 보스 전투는 그대로", () => {
    for (const kind of [undefined, "crawler", "hulk"] as (EnemyKind | undefined)[]) {
      const s = setup(400, kind);
      damagePlayer(s, 20);
      expect(400 - s.player.hp).toBeCloseTo(20);
    }
  });

  it("죽은 보스·지형 피해에는 더하지 않음", () => {
    const dead = setup(400, "dragon");
    dead.enemies[0]!.hp = 0;
    damagePlayer(dead, 20);
    expect(400 - dead.player.hp).toBeCloseTo(20);

    const env = setup(400, "cerberus");
    envDamage(env, 5);
    expect(400 - env.player.hp).toBeCloseTo(5);
  });
});
