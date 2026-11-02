// 캐릭터·숨은 캐릭터 효과 밑에 까는 빛 (겹치면 밝아짐): 효과 종류마다 그 캐릭터 느낌의 색 · 크기 · 터지면 충격파 · 줄이면 빛줄기
// 그림 자체는 각 캐릭터 파일 그대로, 여기서는 빛만 더함 (shots.drawEffects가 먼저 부름). fx.tint가 있으면 그 색
import { allPlayers, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { ACCENT } from "../limited/tigerArt";
import { additive, beam, glow, shock } from "./pwFxBits";
import type { Snap } from "./palette";

/** 색 · 크기 배율(fx.size 기준) · 충격파 */
type Bloom = readonly [string, number, boolean?];

const B: Partial<Record<string, Bloom>> = {
  // 별지기 · 베두인 · 장수 · 근접 공용
  stPlace: ["#fff4c0", 1], stComet: ["#fff4c0", 1.2], stBurst: ["#fff4c0", 1, true], sandspin: ["#e8c890", 0.9], thrust: ["#ffe0a0", 0.6], legend: ["#ffd060", 1, true], cleave: ["#ffe8c0", 0.7],
  ghostgun: ["#a8e8ff", 0.8], lob: ["#ffb060", 1, true], scratch: ["#ff8a5a", 0.7], tigerScratch: ["#ffd040", 0.8],
  // 버려진 자들 · 거인
  tagSwap: ["#ffffff", 0.8], tagSpecial: ["#ffd060", 1, true], tagDash: ["#fff0c0", 0.7], tagCut: ["#fff0c0", 0.8], tagMeteor: ["#ffb060", 1, true], tagShove: ["#fff0c0", 0.8, true], tagFlash: ["#ffffff", 1], tagMiss: ["#ff5a5a", 0.8],
  titanSlam: ["#ffb060", 1, true], titanSmash: ["#ffb060", 1, true], titanDrill: ["#ffd060", 0.8], titanParry: ["#8ad0ff", 1, true],
  // 오니
  oBolt: ["#ffe040", 0.7], oFlame: ["#ff6a2a", 0.9], oCoins: ["#ffd040", 0.8], oFrost: ["#9ae8ff", 0.9], oDark: ["#8a5ab8", 0.9], oPillar: ["#fff4c0", 0.9], oWave: ["#3a9aff", 0.9], oSplash: ["#8ad0ff", 0.7], oSpirit: ["#c8f4ff", 1], oGod: ["#ffd040", 1, true], oSwing: ["#ffe0a0", 0.6],
  // 야수 · 서기관 · 이드라 · 장로 · 렌 · 변희 · 플라이 · 정령사
  catnip: ["#7ad86a", 0.9], scWord: ["#c8a0ff", 0.8], gaiaSwap: ["#7ad86a", 1, true],
  elPillar: ["#ffd8a0", 0.9], elWalls: ["#c8a070", 0.6], elSword: ["#e8ecf4", 0.7], elFist: ["#ff9a5a", 0.9, true],
  renSlam: ["#c8a070", 1, true], renRock: ["#c8a070", 0.8], renHead: ["#c8a070", 0.8], renStone: ["#c8a070", 0.7], renDrop: ["#c8a070", 1, true], renCrush: ["#c8a070", 1, true],
  mRaid: ["#ffd8a0", 1, true], mEvo: ["#ff8a3a", 1, true], bearSwipe: ["#c89060", 0.8], flyRake: ["#ff4a4a", 0.8],
  spBeam: ["#8af0ff", 0.5], gsCast: ["#a8e8ff", 0.9], gsFist: ["#c8a070", 1, true], gsCube: ["#a8e8ff", 1, true], gsChant: ["#a8e8ff", 1], gsArrow: ["#c8a0ff", 0.6], gsBeam: ["#8af0ff", 0.5], gsGas: ["#7ad86a", 1], gsRune: ["#a8e8ff", 1],
  // 역병의사 · 학살자 · 이터 · 묵인 · 사멸
  plBurst: ["#a0e060", 1, true], plMark: ["#7ad86a", 0.8], plSwarmBite: ["#a0e060", 0.6], plPuff: ["#7ad86a", 1], plGrip: ["#7ad86a", 0.9],
  slSlash: ["#ff2a3a", 0.7], slChop: ["#ff2a3a", 0.8], slSpin: ["#ff2a3a", 0.9], slBurst: ["#ff2a3a", 1, true], slLine: ["#ff2a3a", 0.5], slRage: ["#ff2a3a", 1], slX: ["#ff2a3a", 0.8], slNova: ["#ff2a3a", 1, true], slReap: ["#ff2a3a", 0.9], slSky: ["#ff2a3a", 0.9], slRaid: ["#ff2a3a", 0.9], slGrand: ["#ff2a3a", 1, true],
  eaSlash: ["#b05aff", 0.7], eaBite: ["#ff5a8a", 0.8], eaAbyss: ["#b05aff", 1, true], eaSpear: ["#b05aff", 0.6], eaX: ["#b05aff", 0.8], eaLurk: ["#7a3ab8", 0.9], eaEat: ["#ff5a8a", 1],
  mkGuard: ["#8ad0ff", 1, true], smGas: ["#7ad86a", 0.8], smBurst: ["#a0e060", 1, true],
  // 오토마타 · 라이더 · 붐버 · 아티팩터 · 펑크
  adBeam: ["#6ae8ff", 0.5], adLaunch: ["#6ae8ff", 0.8], adSat: ["#6ae8ff", 1, true], adSword: ["#6ae8ff", 0.8],
  rdPulse: ["#ff6a2a", 1, true], rdSmash: ["#ff6a2a", 1, true], rdStab: ["#ff8a3a", 0.6], rdSpin: ["#ff6a2a", 0.9], rdFlame: ["#ff6a2a", 0.9], rdLance: ["#ff8a3a", 0.6], rdCut: ["#ff8a3a", 0.7],
  bmBoom: ["#ff8a2a", 1, true], bmStar: ["#ffe060", 0.8], afBlast: ["#ffb060", 1, true], afMuzzle: ["#ffd080", 0.8], afCraft: ["#ffd080", 1],
  cySlash: ["#ff3ae0", 0.7], cyWire: ["#3ae8ff", 0.5], cyMantis: ["#ff3ae0", 0.8], cyPunch: ["#3ae8ff", 0.9, true], cySpin: ["#ff3ae0", 0.9], cyHack: ["#3ae8ff", 0.9], cyEmp: ["#3ae8ff", 1, true], cyAccel: ["#ff3ae0", 1],
  // 마법사 · 시간술사 · 추적자 · 잊혀진 자 · 잔영 · 방랑객 · 영사
  mgSpell: ["#d9a6ff", 1, true], chCollapse: ["#8ad0ff", 1, true],
  trSnipe: ["#ff5a4a", 0.5], trBeam: ["#ff5a4a", 0.5], trSkill: ["#ff5a4a", 0.9],
  fgCross: ["#fff4c0", 0.9], fgFlash: ["#ffffff", 1], fgBeam: ["#fff4c0", 0.5], fgNova: ["#fff4c0", 1, true], fgSlash: ["#fff4c0", 0.7], fgPillar: ["#fff4c0", 0.9], fgAwaken: ["#ffe8a0", 1, true],
  rmStab: ["#8a6aff", 0.6], rmDodge: ["#8a6aff", 1], rmFlurry: ["#8a6aff", 0.8], rmEclipse: ["#ffe9a8", 1, true],
  wdSlash: ["#c8e8ff", 0.7], wdIai: ["#e8f4ff", 0.6], wdCut: ["#c8e8ff", 0.7], wdPull: ["#c8e8ff", 0.9], wdTempest: ["#c8e8ff", 1, true], wdSharp: ["#e8f4ff", 0.8],
  skLine: ["#f0f0ff", 0.4], skRend: ["#ff3a4a", 0.9, true], skBleed: ["#ff3a4a", 1, true], skReload: ["#f0f0ff", 1],
  // 이무기 · 악의 사도 · 오리
  imBolt: ["#ffe040", 0.7], imBoom: ["#8ae8c8", 1, true], imLight: ["#fff4c0", 0.9], imBite: ["#8ae8c8", 0.8], imSky: ["#8ae8c8", 1], imRise: ["#8ae8c8", 1], imAwaken: ["#8ae8c8", 1, true],
  apCross: ["#b05aff", 0.9], apAura: ["#7a3ab8", 0.8], apBeam: ["#ff5ab8", 0.5], apCoin: ["#ffd040", 0.8], apGrav: ["#7a3ab8", 1, true], apSleep: ["#a8a8ff", 0.9], apSoul: ["#b890ff", 0.8], apFlame: ["#6ad8ff", 0.9],
  quack: ["#fff4a0", 0.7], splash: ["#8ad0ff", 0.8], bigQuack: ["#fff4a0", 1, true], duckEgg: ["#ffd040", 0.6],
  // 의사
  slash: ["#a8c8ff", 0.5], cut: ["#ff4a5a", 0.8], ecg: ["#7affb0", 0.6], zap: ["#ffe070", 1.4], pole: ["#7ad8ff", 0.9], puff: ["#7fd88a", 1], pillpop: ["#ffd060", 0.8], medburst: ["#ff6a6a", 1.2, true], lash: ["#f0f0ff", 0.4], stitch: ["#ff8a9a", 0.6], plus: ["#7fd88a", 0.6], antibody: ["#8ad0ff", 1, true], bump: ["#ffe070", 1, true],
  // 숨은 캐릭터: 광부 · 제우스
  mnSwing: ["#c8a070", 0.7], mnCrack: ["#c8a070", 0.8], mnErupt: ["#ff8a2a", 1, true], mnRock: ["#c8a070", 0.8], mnBoom: ["#ff8a2a", 1, true], mnShatter: ["#8af0ff", 1, true], mnGem: ["#8af0ff", 0.8], mnPillar: ["#c8a070", 0.9], mnBurst: ["#ffb060", 1, true],
  zsSky: ["#ffe040", 0.9], zsArc: ["#8ad0ff", 0.6], zsOverload: ["#ffe040", 1, true], zsDescend: ["#ffe040", 1, true], zsAegis: ["#ffd060", 1, true], zsClap: ["#ffe040", 1, true], zsSpear: ["#ffe040", 0.6],
};

/** 효과 밑의 빛 (표에 있는 종류만) */
export function drawFxBloom(ctx: CanvasRenderingContext2D, fx: EffectState, px: number, py: number, snap: Snap): void {
  const b = B[fx.kind];
  if (!b) return;
  const t = fx.ticks / fx.maxTicks;
  const c = fx.tint && /^#[0-9a-f]{6}$/i.test(fx.tint) ? fx.tint : b[0];
  const x = snap(fx.follow ? px : fx.x);
  const y = snap(fx.follow ? py : fx.y);
  // 크게 번지면 화면이 하얗게 타니 빛은 작게·옅게 (충격파만 크게)
  const r = Math.max(6, fx.size * b[1]);
  const gr = Math.min(r, 34);
  additive(ctx, () => {
    if (fx.toX !== undefined && fx.toY !== undefined && Math.hypot(fx.toX - fx.x, fx.toY - fx.y) > 12) {
      beam(ctx, x, y, snap(fx.toX), snap(fx.toY), Math.max(2, Math.min(8, (fx.width ?? 2) * 1.2)), c, t * 0.35);
      glow(ctx, snap(fx.toX), snap(fx.toY), 9, c, t * 0.5, 0.6);
      return;
    }
    glow(ctx, x, y, gr, c, t * 0.35, 0.25);
    if (b[2]) shock(ctx, x, y, r * (1.2 - 0.5 * t), c, t * 0.6, 4);
  });
}

/** 내 탄 밑의 옅은 빛: 쏜 캐릭터의 색 (탄 그림은 각 캐릭터 파일 그대로) */
export function drawShotBloom(ctx: CanvasRenderingContext2D, s: RunState, pr: ProjectileState, x: number, y: number): void {
  const who = (pr.shooter !== undefined ? allPlayers(s)[pr.shooter] : undefined) ?? s.player;
  const c = ACCENT[who.characterId] ?? "#fff3b0";
  additive(ctx, () => glow(ctx, x, y, pr.r * 2.4 + 3, c, 0.45));
}
