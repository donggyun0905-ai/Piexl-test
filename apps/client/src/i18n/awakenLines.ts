// 각성 증강 설명 (꼬리표 8개, 한·영·일). 수치는 buildSetDefs.AWAKEN을 읽음
import { AWAKEN as A, type ItemTag } from "@pixel-rogue/shared";
import type { Lang } from "./index";

const pct = (v: number) => Math.round(v * 100);
const sec = (t: number) => +(t / 60).toFixed(1);

function line(tag: ItemTag): [string, string, string] {
  const cd = sec(A[tag].cd);
  switch (tag) {
    case "ice": return [`서리바람 (${cd}초마다): 둥근 서리 범위에 얼음 결정이 눈처럼 내림 · ${sec(A.ice.ticks)}초 동안 둔화 + 0.25초마다 ${pct(A.ice.dmg)}%`, `Frost Gale (every ${cd}s): ice crystals fall like snow in a frosty circle · slows and deals ${pct(A.ice.dmg)}% every 0.25s for ${sec(A.ice.ticks)}s`, `霜風（${cd}秒ごと）：丸い霜の範囲に氷の結晶が雪のように降る・${sec(A.ice.ticks)}秒間鈍化＋0.25秒ごとに${pct(A.ice.dmg)}%`];
    case "fire": return [`유성우 (${cd}초마다): 적에게 유성 ${A.fire.n}개 (${pct(A.fire.dmg)}% · 점화)`, `Meteor Rain (every ${cd}s): ${A.fire.n} meteors on foes (${pct(A.fire.dmg)}% · ignite)`, `流星雨（${cd}秒ごと）：敵に流星${A.fire.n}個（${pct(A.fire.dmg)}%・着火）`];
    case "bolt": return [`뇌신의 사슬 (${cd}초마다): 적 사이를 ${A.bolt.jumps}번 튀는 번개 (${pct(A.bolt.dmg)}%)`, `Thunder Chain (every ${cd}s): lightning leaps ${A.bolt.jumps} times between foes (${pct(A.bolt.dmg)}%)`, `雷神の鎖（${cd}秒ごと）：敵の間を${A.bolt.jumps}回跳ねる雷（${pct(A.bolt.dmg)}%）`];
    case "poison": return [`역병 꽃 (${cd}초마다): 독꽃이 피어 ${sec(A.poison.ticks)}초 동안 독 안개 (중독)`, `Plague Bloom (every ${cd}s): a venom flower spreads toxic mist for ${sec(A.poison.ticks)}s (poison)`, `疫病の花（${cd}秒ごと）：毒の花が咲き${sec(A.poison.ticks)}秒間毒霧（毒）`];
    case "light": return [`성광 (${cd}초마다): 최대 체력 ${pct(A.light.heal)}% 회복 + 적 ${A.light.n}명에게 빛기둥 (${pct(A.light.dmg)}%)`, `Holy Radiance (every ${cd}s): heal ${pct(A.light.heal)}% max HP + light pillars on ${A.light.n} foes (${pct(A.light.dmg)}%)`, `聖光（${cd}秒ごと）：最大体力${pct(A.light.heal)}%回復＋敵${A.light.n}体に光の柱（${pct(A.light.dmg)}%）`];
    case "dark": return [`심연 (${cd}초마다): 적을 빨아들이는 소용돌이 ${sec(A.dark.ticks)}초`, `Abyss (every ${cd}s): a vortex pulls foes in for ${sec(A.dark.ticks)}s`, `深淵（${cd}秒ごと）：敵を吸い込む渦${sec(A.dark.ticks)}秒`];
    case "death": return [`사신의 낫 (${cd}초마다): 내 둘레 한 바퀴 (${pct(A.death.dmg)}%, 체력 ${pct(A.death.exec)}% 아래 일반 적 즉사)`, `Reaper's Scythe (every ${cd}s): a full sweep around you (${pct(A.death.dmg)}%, reaps normal foes below ${pct(A.death.exec)}% HP)`, `死神の鎌（${cd}秒ごと）：周りを一回転（${pct(A.death.dmg)}%、体力${pct(A.death.exec)}%未満の通常敵は即死）`];
    case "earth": return [`지각 분쇄 (${cd}초마다): 바위 가시 고리 ${A.earth.rings}겹이 퍼짐 (${pct(A.earth.dmg)}% · 경직)`, `Crust Breaker (every ${cd}s): ${A.earth.rings} rings of rock spikes spread out (${pct(A.earth.dmg)}% · stun)`, `地殻粉砕（${cd}秒ごと）：岩の棘の輪が${A.earth.rings}重に広がる（${pct(A.earth.dmg)}%・硬直）`];
    case "water": return [`해일 (${cd}초마다): 적 쪽으로 밀려가는 물결 (${pct(A.water.dmg)}% · 밀어냄)`, `Tidal Wave (every ${cd}s): a wave surges toward foes (${pct(A.water.dmg)}% · knockback)`, `津波（${cd}秒ごと）：敵の方へ押し寄せる波（${pct(A.water.dmg)}%・押し出し）`];
    case "sharp": return [`천검 (${cd}초마다): 하늘에서 칼 ${A.sharp.n}자루 (${pct(A.sharp.dmg)}%)`, `Thousand Blades (every ${cd}s): ${A.sharp.n} swords fall from the sky (${pct(A.sharp.dmg)}%)`, `千剣（${cd}秒ごと）：空から剣${A.sharp.n}本（${pct(A.sharp.dmg)}%）`];
    case "tough": return [`강철 요새 (${cd}초마다): 보호막 최대 체력 ${pct(A.tough.shield)}% + 육각 방벽이 ${sec(A.tough.ticks)}초 동안 둘레 적을 침`, `Steel Bastion (every ${cd}s): shield ${pct(A.tough.shield)}% max HP + a hex barrier strikes nearby foes for ${sec(A.tough.ticks)}s`, `鋼鉄の要塞（${cd}秒ごと）：シールド最大体力${pct(A.tough.shield)}%＋六角の防壁が${sec(A.tough.ticks)}秒間周りの敵を打つ`];
    case "wind": return [`대회오리 (${cd}초마다): 적 쪽으로 나아가는 회오리 ${sec(A.wind.ticks)}초`, `Great Cyclone (every ${cd}s): a tornado advances on foes for ${sec(A.wind.ticks)}s`, `大竜巻（${cd}秒ごと）：敵の方へ進む竜巻${sec(A.wind.ticks)}秒`];
    case "luck": return [`황금 소나기 (${cd}초마다): 금화 ${A.luck.n}개 (${pct(A.luck.dmg)}%, ${pct(A.luck.crit)}%로 3배)`, `Golden Shower (every ${cd}s): ${A.luck.n} coins (${pct(A.luck.dmg)}%, ${pct(A.luck.crit)}% chance ×3)`, `黄金の雨（${cd}秒ごと）：金貨${A.luck.n}枚（${pct(A.luck.dmg)}%、${pct(A.luck.crit)}%で3倍）`];
    case "summon": return [`정령 군단 (${cd}초마다): 정령 토템 ${sec(A.summon.ticks)}초 · 정령 ${A.summon.n}마리가 쏨 (${pct(A.summon.dmg)}%)`, `Spirit Legion (every ${cd}s): a spirit totem for ${sec(A.summon.ticks)}s · ${A.summon.n} spirits fire (${pct(A.summon.dmg)}%)`, `精霊の軍団（${cd}秒ごと）：精霊のトーテム${sec(A.summon.ticks)}秒・精霊${A.summon.n}体が撃つ（${pct(A.summon.dmg)}%）`];
    case "blood": return [`핏빛 달 (${cd}초마다): 적 ${A.blood.n}명 발밑에 피의 가시 (${pct(A.blood.dmg)}%, 준 피해의 ${pct(A.blood.leech)}% 회복)`, `Blood Moon (every ${cd}s): blood spikes under ${A.blood.n} foes (${pct(A.blood.dmg)}%, heal ${pct(A.blood.leech)}% of damage)`, `血の月（${cd}秒ごと）：敵${A.blood.n}体の足元に血の棘（${pct(A.blood.dmg)}%、与えたダメージの${pct(A.blood.leech)}%回復）`];
  }
}

/** 꼬리표 8개 각성 설명 */
export const awakenLine = (tag: ItemTag, lang: Lang): string => line(tag)[lang === "ko" ? 0 : lang === "en" ? 1 : 2];
