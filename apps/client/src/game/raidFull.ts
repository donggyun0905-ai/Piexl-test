// 레이드 방: 화면을 꽉 채움 (미니맵 숨김) · 왼쪽 능력치 창은 꺼 둠 (C로 다시 켤 수 있음, 방을 나가면 원래대로)
import { RAID_ROOM, type RunState } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { getSettings, setSettings } from "../settings";

export function useRaidFull(run: () => RunState | null): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      const s = run();
      setOn(!!s?.raidBoss && s.roomId === RAID_ROOM.boss);
    }, 300);
    return () => clearInterval(id);
  }, [run]);
  useEffect(() => {
    if (!on) return;
    const prev = getSettings().showStats;
    setSettings({ showStats: false });
    return () => setSettings({ showStats: prev });
  }, [on]);
  return on;
}
