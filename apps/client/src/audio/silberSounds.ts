// 실베르 캐릭터 효과음 묶음 (sound.ts·sfxSkills.ts가 커서 나눔): 소리 표 · 소리 이름 · 틱마다 고르기
import type { RunState } from "@pixel-rogue/shared";
import { ARIA_SOUNDS, ariaSounds, type AriaSfx } from "./ariaSounds";
import { ASURA_SOUNDS, asuraSounds, type AsuraSfx } from "./asuraSounds";
import { BAEKINJANG_SOUNDS, baekinjangSounds, type BaekinjangSfx } from "./baekinjangSounds";
import { BAEK_SOUNDS, baekSounds, type BaekSfx } from "./baekSounds";
import { BINGSEOL_SOUNDS, bingseolSounds, type BingseolSfx } from "./bingseolSounds";
import { HONRYEONG_SOUNDS, honryeongSounds, type HonryeongSfx } from "./honryeongSounds";
import { jokerSounds } from "./jokerSounds";
import { puppetSounds } from "./puppetSounds";
import { RABBIT_SOUNDS, rabbitSounds, type RabbitSfx } from "./rabbitSounds";
import { RAVEN_SOUNDS, ravenSounds, type RavenSfx } from "./ravenSounds";
import { GEARS_SOUNDS, gearsSounds, type GearsSfx } from "./gearsSounds";
import { NOIR_SOUNDS, noirSounds, type NoirSfx } from "./noirSounds";
import { shadowingSounds } from "./shadowingSounds";
import type { Sfx } from "./sound";

export const SILBER_SOUNDS = { ...RABBIT_SOUNDS, ...BAEK_SOUNDS, ...BINGSEOL_SOUNDS, ...ASURA_SOUNDS, ...BAEKINJANG_SOUNDS, ...HONRYEONG_SOUNDS, ...ARIA_SOUNDS, ...RAVEN_SOUNDS, ...GEARS_SOUNDS, ...NOIR_SOUNDS };
export type SilberSfx = RabbitSfx | BaekSfx | BingseolSfx | AsuraSfx | BaekinjangSfx | HonryeongSfx | AriaSfx | RavenSfx | GearsSfx | NoirSfx;

export function silberSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  for (const f of [jokerSounds, shadowingSounds, puppetSounds, rabbitSounds, baekSounds, bingseolSounds, asuraSounds, baekinjangSounds, honryeongSounds, ariaSounds, ravenSounds, gearsSounds, noirSounds]) f(run, out, onShake);
}
