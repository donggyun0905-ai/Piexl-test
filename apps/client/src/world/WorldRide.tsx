// 타고 가는 곳(열차 안, Region.ride): 위 가운데에 '다음 역까지 남은 시간' · 시간이 다 되면 도착 (내리는 곳 = ride.to의 land 칸)
// 열차 안에서 할 일(보스전 등)은 나중에 넣음 · 화면 시간만 셈 (게임 결과와 무관)
import { useEffect, useState } from "react";
import "../styles/world-ride.css";
import type { TextKey } from "../i18n";
import type { Region } from "./worldPlaces";

interface Props {
  t: (k: TextKey) => string;
  ride: NonNullable<Region["ride"]>;
  onArrive: (to: string, land: readonly [number, number]) => void;
}

export function WorldRide({ t, ride, onArrive }: Props) {
  const [left, setLeft] = useState(ride.secs);
  useEffect(() => {
    const end = Date.now() + ride.secs * 1000;
    const id = window.setInterval(() => {
      const s = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) {
        window.clearInterval(id);
        onArrive(ride.to, ride.land);
      }
    }, 250);
    return () => window.clearInterval(id);
    // 열차에 탈 때 한 번만 (onArrive는 매번 새 함수)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ride]);
  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, "0");
  return <p className="world-ride">🚆 {t("wpRideLeft").replace("{t}", `${mm}:${ss}`)}</p>;
}
