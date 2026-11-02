// 방 음악: 특별한 방(시련·제단)에 있는 동안 기본 곡 대신 그 방 곡 (나가면 원래 곡으로, 한정 스킨 곡이었으면 그 곡으로)
import { musicBeat, setMusicBeat } from "./sound";

type Beat = NonNullable<ReturnType<typeof musicBeat>>;
let saved: ReturnType<typeof musicBeat> | undefined;

/** 방 곡 켜기 (null = 원래 곡으로) */
export function setRoomMusic(beat: Beat | null): void {
  if (beat) {
    if (saved === undefined) saved = musicBeat();
    setMusicBeat(beat);
  } else if (saved !== undefined) {
    setMusicBeat(saved);
    saved = undefined;
  }
}
