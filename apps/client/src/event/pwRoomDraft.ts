// 패왕전 같이 하기 밴픽 (event/PwRoom): 방장이 차례를 진행해 손님에게 상태를 보내고, 손님은 내 차례에 고른 것을 방장에게 보냄
// 자리 = 방에 들어온 순서 (게임과 같음). 편의 밴은 그 편 첫 자리 사람이, 사람이 없는 편·자리는 AI가 함. 사람이 들어오거나 나가면 밴픽을 다시
import { draftOk, draftSize, draftTurn, pwHasDraft, pwSeatCount, type CharacterId, type PwDraftTurn, type PwMode } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import type { CoopMsg } from "../coop/lockstep";
import { type DraftClock, startDraft, stepDraft, useDraftDrive } from "./pwDraftDrive";

/** seatPids: 게임에 나올 사람들 (들어온 순서) · send: to 없으면 손님 모두(방장) / 방장(손님) */
export function usePwRoomDraft(mode: PwMode | null, ranked: boolean, isHost: boolean, you: string, seatPids: readonly string[], send: (msg: CoopMsg, to?: string) => void) {
  const [state, setState] = useState<(DraftClock & { pids: string }) | null>(null);
  const on = !!mode && !ranked && pwHasDraft(mode);
  const seats = mode ? seatPids.slice(0, pwSeatCount(mode)) : [];
  const pidsKey = seats.join();
  // 방장: 대결이 바뀌거나 사람이 바뀌면 그 밴픽은 없는 것으로
  const cur = state && (!isHost || (on && state.d.mode === mode && state.pids === pidsKey)) ? state : null;
  const owner = (turn: PwDraftTurn) => (turn.ban ? seats[turn.team * draftSize(mode!)] : seats[turn.seat]) ?? "";
  const hostAct = (c: CharacterId | null) => {
    const next = cur && stepDraft(cur, c);
    if (next) setState({ ...next, pids: cur.pids });
  };
  useDraftDrive(isHost ? cur : null, hostAct, (turn) => !owner(turn));
  const wire = (to?: string) => send({ t: "pwd", d: cur?.d ?? null, left: cur ? cur.endAt - Date.now() : 0 }, to);
  // 방장: 바뀔 때마다 손님 모두에게
  useEffect(() => {
    if (isHost) wire();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur, isHost]);
  const turn = cur ? draftTurn(cur.d) : undefined;
  return {
    on,
    d: on ? (cur?.d ?? null) : null,
    endAt: cur?.endAt ?? 0,
    me: seats.indexOf(you),
    mine: !!turn && owner(turn) === you,
    seats,
    start: () => isHost && on && setState({ ...startDraft(mode!), pids: pidsKey }),
    act: (c: CharacterId | null) => (isHost ? hostAct(c) : cur && send({ t: "pwda", c, at: cur.d.at })),
    /** 받은 메시지 (pwd: 손님이 받음 · pwda: 방장이 받음) */
    onMsg: (pid: string, msg: CoopMsg) => {
      if (msg.t === "pwd" && !isHost) setState(mode && draftOk(msg.d, mode) ? { d: msg.d, endAt: Date.now() + msg.left, pids: "" } : null);
      if (msg.t === "pwda" && isHost && cur && turn && msg.at === cur.d.at && owner(turn) === pid) hostAct(msg.c);
    },
    /** 방장: 새로 연결된 손님에게 지금 밴픽 */
    onOpen: (pid: string) => isHost && wire(pid),
  };
}
