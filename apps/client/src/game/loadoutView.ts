// 아래 장비 칸에 보낼 값 (gameLoop가 틱마다 만들어 바뀌었을 때만 보냄): 무기·사용 아이템·패시브 · 풋내기 레벨 · 추적자 스킬 대기 · 패왕전 스킬 · 판매 값 · 작업대 · 히든 고르는 창
import { coinTier, beatriceSkills, ianSkills, gabrielSkills, serenaSkills, rafaelSkills, yurielSkills, michaelaSkills, nailerSkills, nailerStages, stigmaGauge, factionGauge, BLAST, expToNext, passiveTagAt, sellPrice, trackerSkills, trialNoItems, raidCdLeft, TICK_RATE, type RunState } from "@pixel-rogue/shared";
import type { LoadoutView } from "./Loadout";
import type { SpiritView } from "./SpiritWindows";
import { pwSkillView } from "./pwSkillView";
import { sellCodes } from "./SellBar";
import { stationView } from "./stationView";
import type { AltarResultView } from "./altar/AltarResult";

/** 제단 결과 창: 증강·바꾸기·패시브를 빼앗긴 벌칙만, 고른 뒤 10초 */
function altarRes(run: RunState): { altarRes?: AltarResultView } {
  const l = run.player.altar?.last;
  if (!l || run.tick - l.tick > 600 || !(l.card === 1 || l.taken?.length)) return {};
  return { altarRes: { tick: l.tick, id: l.id, card: l.card, taken: [...(l.taken ?? [])], ...(l.keep ? { keep: l.keep } : {}), ...(l.swap ? { swap: true } : {}) } };
}

/** 블래스트 대시 슬라이딩 칸 (로그만): 남은 대기 0~1 (5% 단위) · 남은 초 · 미끄러지는 중 */
function blastSlide(run: RunState): { slide?: { cd: number; s: number; on: boolean } } {
  const p = run.player;
  if (run.pvp || run.pw || p.characterId !== "blast") return {};
  const left = p.blSlowCd ?? 0;
  return { slide: { cd: Math.ceil((left / BLAST.slowCd) * 20) / 20, s: Math.ceil(left / 60), on: (p.blSlow ?? 0) > 0 } };
}

/** 비르디아 공생 정령 창 (로그만) */
function spiritView(run: RunState): { spirit?: SpiritView } {
  const p = run.player;
  if (!factionGauge(run) || factionGauge(run)!.trait !== "virdia") return {};
  const v: SpiritView = {
    ...(p.fcSpPick ? { pick: [...p.fcSpPick] } : {}),
    ...(p.fcBagOpen && p.fcBag ? { bag: [...p.fcBag], bagOpen: true } : {}),
    ...(p.fcChest ? { chest: [...p.fcChest] } : {}),
    ...(p.fcSp === "fox" ? { fox: p.fcFox ?? 0, near: (run.rooms[run.roomId]?.pickups ?? []).some((x) => x.kind === "weapon" || x.kind === "passive" || x.kind === "use") } : {}),
    ...(p.fcSp === "coin" ? { coin: p.fcCoin ?? 0, tier: coinTier(p.fcCoin ?? 0) } : {}),
  };
  return Object.keys(v).length ? { spirit: v } : {};
}

export function loadoutView(run: RunState, armed: Parameters<typeof pwSkillView>[1]): LoadoutView {
  const p = run.player;
  return {
    weaponId: p.weaponId,
    slots: [...p.useSlots],
    // 끝없는 시련 등 사용 아이템을 못 쓰는 동안 (칸에 ✕)
    ...(trialNoItems(run) ? { useOff: true } : {}),
    // 레이드: 칸마다 쿨타임 [남은 초, 비율 (5% 단위)]
    ...(run.raidBoss ? { cds: p.useSlots.map((_, i): [number, number] => [Math.max(0, Math.ceil(((p.raidCd?.[i] ?? 0) - run.tick) / TICK_RATE)), Math.round(raidCdLeft(run, i) * 20) / 20]) } : {}),
    passives: [...p.passives],
    // 대장간 (sim/forge): 지금 무기 강화·암흑 강화·꼬리표 · 꼬리표를 바꾼 패시브
    ...(p.forge?.[p.weaponId] ? { forge: { lv: p.forge[p.weaponId]!.lv ?? 0, dark: p.forge[p.weaponId]!.dark ?? 0, ...(p.forge[p.weaponId]!.tag ? { tag: p.forge[p.weaponId]!.tag } : {}) } } : {}),
    ...(p.retag ? { tags: p.passives.map((_, k) => passiveTagAt(p, k)) } : {}),
    // 제단·경매로 증강 기술이 새겨진 패시브 (칸에 ✦ · 설명에 기술 이름)
    ...(p.augments?.length ? { augs: p.augments.map((a) => ({ passive: a.passive, skills: [...a.skills] })) } : {}),
    ...(p.characterId === "novice" && !run.pvp ? { novice: { lv: p.lv ?? 1, exp: p.exp ?? 0, need: expToNext(p.lv ?? 1), points: p.points ?? 0 } } : {}),
    // 추적자 스킬 대기 (5% 단위로만 바뀌게)
    ...(p.characterId === "tracker" ? { skills: trackerSkills(p).map((v) => Math.ceil(v * 20) / 20) } : {}),
    ...(p.characterId === "beatrice" && !run.pvp ? { skills: beatriceSkills(p).map((v) => Math.ceil(v * 20) / 20) } : {}),
    ...(p.characterId === "ian" && !run.pvp ? { skills: ianSkills(p).map((v) => Math.ceil(v * 20) / 20), skillSet: "ia" as const } : {}),
    ...(p.characterId === "gabriel" && !run.pvp ? { skills: gabrielSkills(p).map((v) => Math.ceil(v * 20) / 20), skillSet: "gb" as const } : {}),
    ...(p.characterId === "serena" && !run.pvp ? { skills: serenaSkills(p).map((v) => Math.ceil(v * 20) / 20), skillSet: "sn" as const } : {}),
    ...(p.characterId === "rafael" && !run.pvp ? { skills: rafaelSkills(p).map((v) => Math.ceil(v * 20) / 20), skillSet: "rf" as const } : {}),
    ...(p.characterId === "yuriel" && !run.pvp ? { skills: yurielSkills(p).map((v) => Math.ceil(v * 20) / 20), skillSet: "yr" as const } : {}),
    ...(stigmaGauge(p) ? { stigma: { v: Math.round(stigmaGauge(p)!.v * 50) / 50, awake: stigmaGauge(p)!.awake, ...(p.characterId === "hellfist" ? { hell: true } : {}), ...blastSlide(run) } } : {}),
    ...(p.characterId === "michaela" && !run.pvp ? { skills: michaelaSkills(p).map((v) => Math.ceil(v * 20) / 20), skillSet: "mc" as const } : {}),
    ...(p.characterId === "nailer" && !run.pvp ? { skills: nailerSkills(p).map((v) => Math.ceil(v * 20) / 20), skillSet: "nl" as const, stages: nailerStages(p) } : {}),
    // 진영 특징 (로그만: 물결 콤보·타락·과열·맹세·정령·핵심 스킬)
    ...(factionGauge(run) ? { faction: factionGauge(run)! } : {}),
    ...(run.pvp ? { pw: pwSkillView(run, armed) } : {}),
    // 상점 휴지통에서 F로 판매 창을 열었을 때: 팔 수 있는 값 (무기 + 사용 아이템 2칸 + 패시브 순서, 0 = 못 팜)
    ...(run.prompt.kind === "trash" && run.prompt.confirm && !run.party ? { sell: sellCodes(p.passives.length).map((n) => sellPrice(run, n)) } : {}),
    ...(run.prompt.kind === "station" ? { station: stationView(run) } : {}),
    ...(p.hdPick ? { hdPick: p.hdPick } : {}),
    ...spiritView(run),
    ...altarRes(run),
  };
}
