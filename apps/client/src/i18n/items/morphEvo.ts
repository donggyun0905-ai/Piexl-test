// 변희 각성 글자 (한·영·일): 동물 무기 설명 뒤에 붙음 (전용 아이템 셋을 모두 모으면 각성, sim/morphEvo)
import type { AnimalKind } from "@pixel-rogue/shared";
import type { Names } from "./names";

const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const EVO_DESC: Record<AnimalKind, Names> = {
  wolf: c("각성(전용 아이템 3개): 하이울프 · 20%로 그림자 늑대 셋이 덮침", "Awaken (all 3 own items): Highwolf · 20%: three shadow wolves pounce", "覚醒（専用アイテム3つ）：ハイウルフ · 20%で影の狼三匹が飛びかかる"),
  bear: c("각성(전용 아이템 3개): 폭군 곰 · 20%로 둘레를 내리찍어 기절", "Awaken (all 3 own items): Tyrant Bear · 20%: slams all around, stunning", "覚醒（専用アイテム3つ）：暴君熊 · 20%で周りを叩きつけて気絶"),
  eagle: c("각성(전용 아이템 3개): 폭풍 독수리 · 20%로 하늘로 사라져 방 끝에서 끝까지 세 번 내리그음 (무적)", "Awaken (all 3 own items): Storm Eagle · 20%: vanishes into the sky and slashes across the room three times (invulnerable)", "覚醒（専用アイテム3つ）：嵐の鷲 · 20%で空へ消え、部屋の端から端まで三回切り裂く（無敵）"),
  snake: c("각성(전용 아이템 3개): 바실리스크 · 20%로 석화의 눈 (앞쪽 넓게 굳힘 + 독)", "Awaken (all 3 own items): Basilisk · 20%: petrifying gaze (wide stun ahead + poison)", "覚醒（専用アイテム3つ）：バジリスク · 20%で石化の眼（前方を広く固める＋毒）"),
  boar: c("각성(전용 아이템 3개): 철갑 멧돼지 왕 · 20%로 앞으로 긴 줄을 들이받음", "Awaken (all 3 own items): Ironclad Boar King · 20%: rams a long line ahead", "覚醒（専用アイテム3つ）：鉄甲猪王 · 20%で前方の長い列に体当たり"),
  scorpion: c("각성(전용 아이템 3개): 사막의 제왕 · 20%로 가까운 적 여섯에게 독침", "Awaken (all 3 own items): Desert Sovereign · 20%: stings the six nearest foes", "覚醒（専用アイテム3つ）：砂漠の帝王 · 20%で近くの敵六体に毒針"),
  bat: c("각성(전용 아이템 3개): 흡혈 박쥐왕 · 20%로 둘레 적의 피를 빨아 회복", "Awaken (all 3 own items): Vampire Bat King · 20%: drains every foe around to heal", "覚醒（専用アイテム3つ）：吸血蝙蝠王 · 20%で周りの敵の血を吸って回復"),
  elephant: c("각성(전용 아이템 3개): 매머드 왕 · 20%로 세 겹 대지진", "Awaken (all 3 own items): Mammoth King · 20%: a three-ring earthquake", "覚醒（専用アイテム3つ）：マンモス王 · 20%で三重の大地震"),
  spider: c("각성(전용 아이템 3개): 여왕 거미 · 20%로 가까운 적 여덟을 거미줄로 묶음", "Awaken (all 3 own items): Spider Queen · 20%: binds the eight nearest foes in webs", "覚醒（専用アイテム3つ）：女王蜘蛛 · 20%で近くの敵八体を糸で縛る"),
  phoenix: c("각성(전용 아이템 3개): 태양 불사조 · 20%로 하늘로 사라져 방 끝에서 끝까지 세 번 불길을 내리그음 (무적)", "Awaken (all 3 own items): Sun Phoenix · 20%: vanishes into the sky and rakes the room with fire three times (invulnerable)", "覚醒（専用アイテム3つ）：太陽の不死鳥 · 20%で空へ消え、部屋の端から端まで三回炎で切り裂く（無敵）"),
};
