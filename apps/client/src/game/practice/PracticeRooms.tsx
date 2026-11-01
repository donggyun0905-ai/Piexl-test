// 연습장 방 시험: 상점·천상의 상점·여신의 선물·보물방·단련의 방·쉼터로 지금 방을 바꿈 (sim/practiceRoom) · 보통 방으로 되돌리기
import { PRACTICE_ROOMS, type PracticeRoom } from "@pixel-rogue/shared";
import type { TextKey } from "../../i18n";
import { roomLook } from "../minimap";

const NAME: Record<PracticeRoom, TextKey> = { shop: "sumRoomShop", heaven: "roomHeaven", golden: "sumRoomGolden", treasure: "sumRoomTreasure", gym: "sumRoomGym", rest: "sumRoomRest" };

interface Props {
  t: (key: TextKey) => string;
  onRoom: (kind: PracticeRoom | null) => void;
}

export function PracticeRooms({ t, onRoom }: Props) {
  return (
    <div className="practice-rooms">
      {PRACTICE_ROOMS.map((k) => {
        const look = roomLook({ type: k === "heaven" ? "shop" : k, ...(k === "heaven" ? { heaven: true } : {}) });
        return (
          <button key={k} type="button" className="practice-room" onClick={() => onRoom(k)}>
            <i style={{ background: look.color, borderColor: look.ink }} />
            {t(NAME[k])}
          </button>
        );
      })}
      <button type="button" className="practice-room off" onClick={() => onRoom(null)}>
        {t("practiceRoomOff")}
      </button>
    </div>
  );
}
