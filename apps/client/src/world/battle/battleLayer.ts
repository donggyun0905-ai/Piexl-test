// 지도 전투(C안) 층: 사냥 층(hunt/huntLayer)이 부름 · 모든 사냥터·들판 무리·필드 보스
// 몬스터가 나를 쫓기 시작하거나 내가 공격·대시·스킬을 누르면 → 주변 지도 조각으로 본편 판을 열고, 판 안 몬스터를 본편 적으로 · 끝나면 지도로 돌려보냄
import { setRoomSize, type CharacterId } from "@pixel-rogue/shared";
import { createRunSounds } from "../../audio/runSounds";
import { DamageTracker } from "../../game/damageNumbers";
import { frameTexts } from "../../game/frameTexts";
import { createGlowLayer, type GlowLayer } from "../../game/glow/glowLayer";
import { drawFrame } from "../../game/render";
import type { TextKey } from "../../i18n";
import type { Walker, View } from "../../lobby/walker";
import { getSettings, skillOf } from "../../settings";
import { WTILE, type WorldMap } from "../worldMap";
import { HUNT_RULES as R } from "../hunt/huntGrounds";
import { huntLang } from "../hunt/huntNames";
import type { Hunt, Mob } from "../hunt/huntSim";
import { JOIN_DIST, sliceRoom, type BattleRoom } from "./battleRoom";
import { newPad, readPad } from "./battleInput";
import { battleResult, joinMob, startBattle, stepBattle, type FieldBattle } from "./fieldBattle";
import { carryFor, keepCarry, setLive } from "./fieldCarry";


type Ctx = CanvasRenderingContext2D;
const FLEE_COOL = 3;

export function createBattleLayer(region: string, h: Hunt, keys: ReadonlySet<string>, who: () => CharacterId, mouse: () => readonly [number, number], onKill: (g: string) => void, shake: (power: number) => void) {
  let b: FieldBattle | null = null;
  /** 빛 효과 층 (본편 game/glow, 판이 열려 있는 동안만) */
  let glow: GlowLayer | null = null;
  /** 터치로 싸우는 중 (누른 곳으로 걷기 + 자동 공격) */
  let touch = false;
  let sounds: ReturnType<typeof createRunSounds> | null = null;
  let damage = new DamageTracker();
  let n = 0;
  /** 도망친 뒤 잠깐은 다시 붙지 않음 (초) */
  let cool = 0;
  let cdMax = 1;
  const pad = newPad();
  /** 판 안쪽(테두리 벽 빼고)에 있는 지도 몬스터인지 */
  const inRoom = (r: BattleRoom, x: Mob) => x.x > (r.ox + 1) * WTILE && x.x < (r.ox + r.cols - 1) * WTILE && x.y > (r.oy + 1.5) * WTILE && x.y < (r.oy + r.rows - 1) * WTILE;
  /** 내 둘레(화면 안팎)에 있는 지도 몬스터인지 */
  const near = (x: Mob, me: Walker) => Math.hypot(x.x - me.x, x.y - me.y) < JOIN_DIST;
  const end = (me: Walker, why: "won" | "fled" | "down") => {
    const r = battleResult(b!);
    [me.x, me.y, me.tx] = [r.at[0], r.at[1], -1];
    h.me.hp = h.me.st.maxHp * r.hpLeft;
    // 남은 몬스터: 사냥터로 돌아감 (도망·쓰러짐)
    for (const [m, x, y, k] of r.alive) [m.x, m.y, m.hp, m.st, m.t] = [x, y, Math.max(1, m.g.hp * k), "home", 1];
    if (why === "down") [h.me.hp, h.me.down] = [0, R.downTime];
    // 도망·쓰러짐 뒤에는 잠깐 다시 붙지 않음 · 몬스터 없이 연 판이 닫힌 뒤는 바로
    cool = why === "won" ? 0 : FLEE_COOL;
    h.me.calm = 0;
    // 다음 판에 이어 줄 상태 (쓰러지면 버림)
    keepCarry(b!.run, why === "down");
    setLive(null);
    sounds?.dispose();
    glow?.destroy();
    [b, sounds, glow] = [null, null, null];
    // 본편 전체가 같이 쓰는 방 크기를 보통 방으로 되돌림
    setRoomSize();
    pad.attack = false;
  };
  /** 판 열기: 가운데는 내 쪽에 가깝게 (몬스터 쪽으로 조금) · 판 안 몬스터는 무리가 달라도 모두 (필드 보스 포함) */
  const open = (m: WorldMap, me: Walker, foe: Mob | null) => {
    const [fx, fy] = foe ? [foe.x, foe.y] : [me.x, me.y];
    const room = sliceRoom(m, (me.x + (fx - me.x) * 0.3) / WTILE, (me.y + (fy - me.y) * 0.3) / WTILE);
    const inside = h.mobs.filter((x) => x.st !== "dead" && inRoom(room, x) && (x.st === "chase" || near(x, me)));
    const power = Math.max(0, ...inside.map((x) => x.g.power));
    b = startBattle(room, who(), n++ * 7919 + region.length, [me.x, me.y], h.me.hp / h.me.st.maxHp, inside, power, carryFor(who()));
    setLive({ pad, run: b.run });
    // 판 안 몬스터는 지도에서 감춤 (끝나면 돌려보냄)
    for (const x of inside) [x.st, x.t] = ["dead", 1e9];
    sounds = createRunSounds(b.run, (pw) => getSettings().shake && shake(pw), false);
    damage = new DamageTracker();
  };
  return {
    active: () => !!b,
    /** 몬스터가 쫓기 시작했으면 판을 엶 (지도 몬스터 한 장면 뒤) */
    tryStart(m: WorldMap, me: Walker, dt: number): void {
      cool -= dt;
      if (b || h.me.down > 0 || cool > 0) return;
      const foe = h.mobs.find((x) => x.st === "chase");
      if (foe) open(m, me, foe);
    },
    /** 공격·대시·스킬을 누름: 판이 없으면 그 자리에 엶 (몬스터가 없어도, 조용하면 곧 닫힘) · 대시만 누른 것(dash)은 둘레에 몬스터가 있을 때만 */
    act(m: WorldMap | null, me: Walker, dash = false): boolean {
      if (!b && m && h.me.down <= 0 && (!dash || h.mobs.some((x) => x.st !== "dead" && near(x, me)))) open(m, me, null);
      return !!b;
    },
    /** 한 장면 (ms) · 내 지도 자리를 본편 자리로 */
    step(me: Walker, dt: number): void {
      if (!b) return;
      const p = b.run.player;
      const [mx, my] = mouse();
      // 터치: 누른 곳(walker가 적은 me.tx)까지 · 닿으면 지움
      const [wx, wy] = [p.x + b.room.ox * WTILE, p.y + b.room.oy * WTILE];
      if (me.tx >= 0 && Math.hypot(me.tx - wx, me.ty - wy) < 5) me.tx = -1;
      const walk: readonly [number, number] | null = touch ? (me.tx >= 0 ? [me.tx - wx, me.ty - wy] : [0, 0]) : null;
      const read = () => readPad(pad, keys, [mx - (p.x + b!.room.ox * WTILE), my - (p.y + b!.room.oy * WTILE)], walk);
      const why = stepBattle(b, dt * 1000, read, (m: Mob) => {
        [m.st, m.t] = ["dead", m.g.respawn];
        onKill(m.g.from ?? m.g.id);
      }, (s) => damage.observe(s));
      sounds?.update();
      [me.x, me.y] = [p.x + b.room.ox * WTILE, p.y + b.room.oy * WTILE];
      [me.fx, me.fy, me.moving] = [p.faceX, p.faceY, false];
      // 판을 열 때 멀리 있던 몬스터: 내가 다가가면 판에 들어옴
      if (!why) {
        for (const x of h.mobs) {
          if (x.st === "dead" || !near(x, me) || !inRoom(b.room, x)) continue;
          joinMob(b, x);
          [x.st, x.t] = ["dead", 1e9];
        }
      }
      h.me.hp = h.me.st.maxHp * Math.max(0, p.hp / p.stats.maxHp);
      // 대시 준비: 쓴 순간 남은 시간을 최대로 (game/gameLoop와 같은 방식)
      cdMax = p.dashCooldown === 0 ? 1 : Math.max(cdMax, p.dashCooldown);
      h.me.dashK = 1 - p.dashCooldown / cdMax;
      if (why) end(me, why);
    },
    /** 지도 그림 위에 본편 캐릭터·적·탄·이펙트 (판 경계는 안 그림: 판이 화면보다 훨씬 넓음 · k = 지도 1픽셀의 캔버스 픽셀) */
    draw(ctx: Ctx, view: View, k: number, t: (key: TextKey) => string): void {
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
      // 빛 효과: 지도 카메라 그대로 (f = 지도 1픽셀의 CSS 크기)
      glow ??= createGlowLayer(ctx.canvas);
      const css = k / (ctx.canvas.width / Math.max(1, ctx.canvas.clientWidth));
      glow.frame(run, 1, b.acc / (1000 / 60), false, { x: view.x - room.ox * WTILE, y: view.y - room.oy * WTILE, f: css });
    },
    /** 마우스: 판 안이면 좌클릭 꾹 = 공격 · 우클릭 = 대시 (true면 옛 휘두르기·걷기 안 함) */
    press(button: number, down: boolean): boolean {
      if (!b) return false;
      touch = false;
      if (button === 0) pad.attack = down;
      else if (button === 2 && down) pad.dash = true;
      return true;
    },
    /** 판 안을 손가락으로 누름: 그곳으로 걷기 (false: walker가 누른 곳을 적게 둠) */
    tap(): boolean {
      if (b) touch = true;
      return false;
    },
    /** 판에 넘길 키인지: J 공격 · K 대시 · 스킬 키 */
    wants: (code: string): boolean => code === "KeyJ" || code === "KeyK" || skillOf(code) > 0,
    /** 키 누름·뗌 (J는 누르고 있는 동안 공격) */
    key(code: string, down: boolean): void {
      if (!b) return;
      if (code === "KeyJ") pad.attack = down;
      else if (!down) return;
      else if (code === "KeyK") pad.dash = true;
      else if (skillOf(code)) pad.skill = skillOf(code);
    },
    dispose(): void {
      setLive(null);
      sounds?.dispose();
      glow?.destroy();
    },
  };
}
