// 티어표 이유: 실베르 빙설 (한·영·일, dawn.ts가 커서 나눔)
import type { CharacterId } from "@pixel-rogue/shared";

type Reasons = Partial<Record<CharacterId, string>>;

export const TIER_KO_SILBER: Reasons = {
  bingseol: "실베르의 얼음을 다루는 해군 소녀. 몸 둘레 얼음 영역이 가까이 온 적을 늘 느리게 해 버티기 쉽고 무기 10개로 베기·찌르기·던지기를 고를 수 있지만, 처음엔 피해가 약함. 얼음가루가 유도·급속 얼음으로 모이고 빙설무장 활·창이 쌓인 뒤 궁극기 빙설창이 맵 끝까지 적마다 60연타를 넣으면 방 하나를 통째로 얼림 (새 캐릭터, 아직 판이 적음)",
};

export const TIER_EN_SILBER: Reasons = {
  bingseol: "Silber's navy girl of ice. Her frost field always slows nearby foes, so she survives easily, and her 10 weapons let you pick slashes, thrusts or throws, but her early damage is low. Once ice dust fuses into homing and rapid ice, Frost Arms bows and spears pile up, and the Frostsnow Lance ultimate lands 60 hits on every foe to the edge of the map, she freezes whole rooms (new character, few runs so far)",
};

export const TIER_JA_SILBER: Reasons = {
  bingseol: "シルベルの氷を操る海軍少女。体の周りの氷の領域が近づいた敵をいつも遅くするので耐えやすく、武器10個で斬る・突く・投げるを選べるが、最初はダメージが弱い。氷の粉が誘導氷・急速氷に集まり、氷雪武装の弓・槍が重なったあと、奥義・氷雪槍がマップの端まで敵ごとに60連打を入れると部屋ひとつを丸ごと凍らせる（新キャラ、まだプレイ数が少ない）",
};
