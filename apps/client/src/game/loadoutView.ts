// 아래 장비 칸에 보낼 값 (gameLoop가 틱마다 만들어 바뀌었을 때만 보냄): 무기·사용 아이템·패시브 · 풋내기 레벨 · 추적자 스킬 대기 · 패왕전 스킬 · 판매 값 · 작업대 · 히든 고르는 창
import { beatriceSkills, ianSkills, gabrielSkills, serenaSkills, rafaelSkills, expToNext, passiveTagAt, sellPrice, trackerSkills, trialNoItems, type RunState } from "@pixel-rogue/shared";
import type { LoadoutView } from "./Loadout";
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

export function loadoutView(run: RunState, armed: Parameters<typeof pwSkillView>[1]): LoadoutView {
  const p = run.player;
  return {
    weaponId: p.weaponId,
    slots: [...p.useSlots],
    // 끝없는 시련 등 사용 아이템을 못 쓰는 동안 (칸에 ✕)
    ...(trialNoItems(run) ? { useOff: true } : {}),
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
    ...(run.pvp ? { pw: pwSkillView(run, armed) } : {}),
    // 상점 휴지통에서 F로 판매 창을 열었을 때: 팔 수 있는 값 (무기 + 사용 아이템 2칸 + 패시브 순서, 0 = 못 팜)
    ...(run.prompt.kind === "trash" && run.prompt.confirm && !run.party ? { sell: sellCodes(p.passives.length).map((n) => sellPrice(run, n)) } : {}),
    ...(run.prompt.kind === "station" ? { station: stationView(run) } : {}),
    ...(p.hdPick ? { hdPick: p.hdPick } : {}),
    ...altarRes(run),
  };
}
