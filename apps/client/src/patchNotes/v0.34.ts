import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.34.2",
    date: "2026-10-20",
    items: {
      ko: ["날벌레가 너무 빨라서 플레이어 이동 속도와 같게 낮췄습니다"],
      en: ["Gnats were too fast; they now move at the same speed as you"],
      ja: ["羽虫が速すぎたため、プレイヤーの移動速度と同じにしました"],
    },
  },
  {
    version: "0.34.1",
    date: "2026-10-20",
    items: {
      ko: [
        "날벌레·가디언이 1층부터 나옵니다",
        "날벌레가 한 번에 6마리씩 넓게 퍼져서 나오고, 플레이어 이동 속도보다 조금 더 빠르게 날아옵니다 (대시로 따돌리세요)",
      ],
      en: [
        "Gnats and Guardians now appear from floor 1",
        "Gnats now come 6 at a time, spread out when they appear, and fly a little faster than you move (dash to shake them off)",
      ],
      ja: [
        "羽虫・ガーディアンが1階から出るようになりました",
        "羽虫が一度に6匹ずつ広がって現れ、プレイヤーの移動速度より少し速く飛んできます（ダッシュで振り切りましょう）",
      ],
    },
  },
  {
    version: "0.34.0",
    date: "2026-10-20",
    items: {
      ko: [
        "새 적 '날벌레' (2층부터): 4마리가 한 무리로 붙어 다니며 이리저리 흔들리면서 천천히 다가옵니다. 약하지만 수가 많습니다",
        "새 적 '가디언' (3층부터): 방패 3칸이 있어 처음 3번 맞는 동안은 피해가 들어가지 않습니다 (머리 위 파란 칸). 가까워지면 깜빡이며 돌진하고, 멈춰서 붉은 부채꼴 예고 뒤 앞쪽을 크게 휘두릅니다 (대시로 피할 수 있음)",
        "연습장 적 부르기에 날벌레·가디언 추가",
      ],
      en: [
        "New enemy, Gnats (from floor 2): a swarm of 4 that sticks together and slowly drifts toward you. Weak but numerous",
        "New enemy, Guardian (from floor 3): has a 3-point shield, so the first 3 hits deal no damage (blue marks above its head). Up close it flashes and charges, then stops and swings a wide arc in front after a red warning (dash to dodge)",
        "Gnats and the Guardian can be spawned in Practice",
      ],
      ja: [
        "新しい敵「羽虫」（2階から）：4匹の群れでまとまって動き、ふらふらしながらゆっくり近づきます。弱いですが数が多いです",
        "新しい敵「ガーディアン」（3階から）：盾が3つあり、最初の3回はダメージが入りません（頭上の青い印）。近づくと点滅して突進し、止まって赤い扇形の予告の後に前方を大きく振ります（ダッシュで避けられる）",
        "練習場の敵呼び出しに羽虫・ガーディアンを追加",
      ],
    },
  },
];
