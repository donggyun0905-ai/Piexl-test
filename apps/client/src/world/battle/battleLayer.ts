// 지도 전투(C안) 층: 사냥 층(hunt/huntLayer)이 부름 · 모든 사냥터·들판 무리·필드 보스
// 몬스터가 나를 쫓기 시작하면 → 주변 지도 조각으로 본편 판을 열고, 판 안 몬스터를 본편 적으로 · 끝나면 지도로 돌려보냄
import { setRoomSize, type CharacterId } from "@pixel-rogue/shared";
import { createRunSounds } from "../../audio/runSounds";
import { DamageTracker } from "../../game/damageNumbers";
import { frameTexts } from "../../game/frameTexts";
import { drawFrame } from "../../game/render";
import type { TextKey } from "../../i18n";
import type { Walker, View } from "../../lobby/walker";
import { getSettings, skillOf } from "../../settings";
import { WTILE, type WorldMap } from "../worldMap";
import { HUNT_RULES as R } from "../hunt/huntGrounds";
import { huntLang } from "../hunt/huntNames";
import type { Hunt, Mob } from "../hunt/huntSim";
import { sliceRoom } from "./battleRoom";
import { newPad, readPad } from "./battleInput";
import { battleResult, startBattle, stepBattle, type FieldBattle } from "./fieldBattle";


type Ctx = CanvasRenderingContext2D;
const FLEE_COOL = 3;

export function createBattleLayer(region: string, h: Hunt, keys: ReadonlySet<string>, who: () => CharacterId, mouse: () => readonly [number, number], onKill: (g: string) => void) {
  let b: FieldBattle | null = null;
  let sounds: ReturnType<typeof createRunSounds> | null = null;
  let damage = new DamageTracker();
  let n = 0;
  /** 도망친 뒤 잠깐은 다시 붙지 않음 (초) */
  let cool = 0;
  const pad = newPad();
  const end = (me: Walker, why: "won" | "fled" | "down") => {
    const r = battleResult(b!);
    [me.x, me.y, me.tx] = [r.at[0], r.at[1], -1];
    h.me.hp = h.me.st.maxHp * r.hpLeft;
    // 남은 몬스터: 사냥터로 돌아감 (도망·쓰러짐)
    for (const [m, x, y, k] of r.alive) [m.x, m.y, m.hp, m.st, m.t, m.cd] = [x, y, Math.max(1, m.g.hp * k), "home", 1, 1];
    if (why === "down") [h.me.hp, h.me.down] = [0, R.downTime];
    cool = FLEE_COOL;
    sounds?.dispose();
    [b, sounds] = [null, null];
    // 본편 전체가 같이 쓰는 방 크기를 보통 방으로 되돌림
    setRoomSize();
    pad.attack = false;
  };
  return {
    active: () => !!b,
    /** 옛 지도 전투 한 장면 뒤: 시험 사냥터 몬스터가 쫓기 시작했으면 판을 엶 */
    tryStart(m: WorldMap, me: Walker, dt: number): void {
      cool -= dt;
      if (b || h.me.down > 0 || cool > 0) return;
      const foe = h.mobs.find((x) => x.st === "chase" || x.st === "windup");
      if (!foe) return;
      // 판 가운데는 내 쪽에 가깝게 (몬스터 쪽으로 조금)
      const room = sliceRoom(m, (me.x + (foe.x - me.x) * 0.3) / WTILE, (me.y + (foe.y - me.y) * 0.3) / WTILE);
      const [x0, y0, x1, y1] = [(room.ox + 1) * WTILE, (room.oy + 1.5) * WTILE, (room.ox + room.cols - 1) * WTILE, (room.oy + room.rows - 1) * WTILE];
      // 판 안에 있는 몬스터는 무리가 달라도 모두 (필드 보스 포함)
      const inside = h.mobs.filter((x) => x.st !== "dead" && x.x > x0 && x.x < x1 && x.y > y0 && x.y < y1);
      b = startBattle(room, who(), n++ * 7919 + region.length, [me.x, me.y], h.me.hp / h.me.st.maxHp, inside, foe.g.power);
      // 판 안 몬스터는 지도에서 감춤 (끝나면 돌려보냄)
      for (const x of inside) [x.st, x.t] = ["dead", 1e9];
      sounds = createRunSounds(b.run, () => {}, false);
      damage = new DamageTracker();
    },
    /** 한 장면 (ms) · 내 지도 자리를 본편 자리로 */
    step(me: Walker, dt: number): void {
      if (!b) return;
      const p = b.run.player;
      const [mx, my] = mouse();
      const read = () => readPad(pad, keys, [mx - (p.x + b!.room.ox * WTILE), my - (p.y + b!.room.oy * WTILE)]);
      const why = stepBattle(b, dt * 1000, read, (m: Mob) => {
        [m.st, m.t] = ["dead", m.g.respawn];
        onKill(m.g.from ?? m.g.id);
      }, (s) => damage.observe(s));
      sounds?.update();
      [me.x, me.y] = [p.x + b.room.ox * WTILE, p.y + b.room.oy * WTILE];
      [me.fx, me.fy, me.moving] = [p.faceX, p.faceY, false];
      h.me.hp = h.me.st.maxHp * Math.max(0, p.hp / p.stats.maxHp);
      if (why) end(me, why);
    },
    /** 지도 그림 위에 본편 캐릭터·적·탄·이펙트 · 판 경계 빛 (k = 지도 1픽셀의 캔버스 픽셀) */
    draw(ctx: Ctx, view: View, k: number, t: (key: TextKey) => string, now: number): void {
      if (!b) return;
      const { room, run } = b;
      ctx.save();
      drawFrame(ctx, run, {
        bare: { x: Math.round(view.x * k) / k - room.ox * WTILE, y: Math.round(view.y * k) / k - room.oy * WTILE, k },
        alpha: b.acc / (1000 / 60),
        showReticle: false,
        showHitbox: getSettings().showHitbox,
        showRange: getSettings().showRange,
        pixelScale: k,
        zoom: 1,
        ...frameTexts(t, huntLang()),
        overlay: (c, snap) => getSettings().showDamage && damage.draw(c, run.tick, snap, 1),
      });
      ctx.restore();
      ctx.strokeStyle = `rgba(255,236,170,${0.35 + 0.2 * Math.sin(now / 300)})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(room.ox * WTILE + 1, (room.oy + 1) * WTILE + 1, room.cols * WTILE - 2, (room.rows - 1) * WTILE - 2);
    },
    /** 마우스: 판 안이면 좌클릭 꾹 = 공격 · 우클릭 = 대시 (true면 옛 휘두르기·걷기 안 함) */
    press(button: number, down: boolean): boolean {
      if (!b) return false;
      if (button === 0) pad.attack = down;
      else if (button === 2 && down) pad.dash = true;
      return true;
    },
    /** 키: K 대시 · 스킬 키 */
    key(code: string): boolean {
      if (!b) return false;
      if (code === "KeyK" || code === "Space") pad.dash = true;
      else if (skillOf(code)) pad.skill = skillOf(code);
      else return false;
      return true;
    },
    dispose(): void {
      sounds?.dispose();
    },
  };
}
