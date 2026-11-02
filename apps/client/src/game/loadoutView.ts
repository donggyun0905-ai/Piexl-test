// 아래 장비 칸에 보낼 값 (gameLoop가 틱마다 만들어 바뀌었을 때만 보냄): 무기·사용 아이템·패시브 · 풋내기 레벨 · 추적자 스킬 대기 · 패왕전 스킬 · 판매 값 · 작업대 · 히든 고르는 창
import { expToNext, sellPrice, trackerSkills, type RunState } from "@pixel-rogue/shared";
import type { LoadoutView } from "./Loadout";
import { pwSkillView } from "./pwSkillView";
import { sellCodes } from "./SellBar";
import { stationView } from "./stationView";

export function loadoutView(run: RunState, armed: Parameters<typeof pwSkillView>[1]): LoadoutView {
  const p = run.player;
  return {
    weaponId: p.weaponId,
    slots: [...p.useSlots],
    passives: [...p.passives],
    // 제단·경매로 증강 기술이 새겨진 패시브 (칸에 ✦ · 설명에 기술 이름)
    ...(p.augments?.length ? { augs: p.augments.map((a) => ({ passive: a.passive, skills: [...a.skills] })) } : {}),
    ...(p.characterId === "novice" && !run.pvp ? { novice: { lv: p.lv ?? 1, exp: p.exp ?? 0, need: expToNext(p.lv ?? 1), points: p.points ?? 0 } } : {}),
    // 추적자 스킬 대기 (5% 단위로만 바뀌게)
    ...(p.characterId === "tracker" ? { skills: trackerSkills(p).map((v) => Math.ceil(v * 20) / 20) } : {}),
    ...(run.pvp ? { pw: pwSkillView(run, armed) } : {}),
    // 상점 휴지통에서 F로 판매 창을 열었을 때: 팔 수 있는 값 (무기 + 사용 아이템 2칸 + 패시브 순서, 0 = 못 팜)
    ...(run.prompt.kind === "trash" && run.prompt.confirm && !run.party ? { sell: sellCodes(p.passives.length).map((n) => sellPrice(run, n)) } : {}),
    ...(run.prompt.kind === "station" ? { station: stationView(run) } : {}),
    ...(p.hdPick ? { hdPick: p.hdPick } : {}),
  };
}
