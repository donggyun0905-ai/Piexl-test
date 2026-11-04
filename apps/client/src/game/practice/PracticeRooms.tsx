// 연습장 방 시험: 상점·천상의 상점·여신의 선물·보물방·단련의 방·시련·제단·비밀의 방 셋·금 간 벽·쉼터로 지금 방을 바꿈 (sim/practiceRoom) · 보통 방으로 되돌리기
// 관리자가 만든 방 모양으로 바꿔 보기 (sim/customRooms practiceShape) · 숨은 시련 5종 바로 시작 (sim/practiceRoom practiceHidden)
import { customMaps, PRACTICE_HIDDEN, PRACTICE_ROOMS, type HiddenKind, type PracticeRoom } from "@pixel-rogue/shared";
import type { TextKey } from "../../i18n";
import { roomLook } from "../minimap";

/** 방 이름 글자 (방 설명 창 RoomGuide도 씀) */
export const ROOM_NAME: Record<PracticeRoom, TextKey> = { shop: "sumRoomShop", heaven: "roomHeaven", golden: "sumRoomGolden", treasure: "sumRoomTreasure", gym: "sumRoomGym", trial: "sumRoomTrial", altar: "sumRoomAltar", forge: "sumRoomForge", devil: "sumRoomDevil", gamble: "sumRoomGamble", auction: "sumRoomAuction", crack: "sumRoomCrack", rest: "sumRoomRest" };

/** 방 색 (미니맵과 같음) */
export const practiceRoomLook = (k: PracticeRoom) => roomLook({ type: k === "heaven" ? "shop" : k === "crack" ? "combat" : k, ...(k === "heaven" ? { heaven: true } : {}) });

interface Props {
  t: (key: TextKey) => string;
  onRoom: (kind: PracticeRoom | null) => void;
  onShape: (rows: readonly string[] | null) => void;
  onHidden: (kind: HiddenKind) => void;
}

export function PracticeRooms({ t, onRoom, onShape, onHidden }: Props) {
  const shapes = customMaps("room");
  return (
    <div className="practice-rooms">
      {PRACTICE_ROOMS.map((k) => {
        const look = practiceRoomLook(k);
        return (
          <button key={k} type="button" className="practice-room" onClick={() => onRoom(k)}>
            <i style={{ background: look.color, borderColor: look.ink }} />
            {t(ROOM_NAME[k])}
          </button>
        );
      })}
      <button type="button" className="practice-room off" onClick={() => onRoom(null)}>
        {t("practiceRoomOff")}
      </button>
      <small className="practice-shapes">{t("practiceHiddenTitle")}</small>
      {PRACTICE_HIDDEN.map((k) => (
        <button key={`h${k}`} type="button" className="practice-room" title={t(`hiddenHint_${k}` as TextKey)} onClick={() => onHidden(k)}>
          {t(`hiddenName_${k}` as TextKey).replace(/^[^:：]*[:：]\s*/, "")}
        </button>
      ))}
      {shapes.length > 0 && <small className="practice-shapes">{t("practiceShapes")}</small>}
      {shapes.map((m) => (
        <button key={m.id} type="button" className="practice-room" onClick={() => onShape(m.tiles)}>
          {m.name}
        </button>
      ))}
      {shapes.length > 0 && (
        <button type="button" className="practice-room off" onClick={() => onShape(null)}>
          {t("practiceShapeOff")}
        </button>
      )}
    </div>
  );
}
