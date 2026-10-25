import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.38.1",
    date: "2026-10-20",
    items: {
      ko: [
        "검신: 체력 절반 아래의 검기 격자 두 번 중 먼저 터지는 쪽이 붉은 검기로 보입니다. 일섬이 더 빨라졌습니다",
        "천사장: 네 모서리에 탑 4개가 섭니다. 탑은 차례로 하나씩만 맞으며, 부술수록 소환이 줄다가(성기사 절반 → 가디언 절반 → 성기사 멈춤 → 가디언 멈춤) 다 부수면 천사장이 앞으로 큰 빛 구슬을 쏘기 시작합니다",
      ],
      en: [
        "Sword Saint: below half health, the first of the two sword-light grids is shown in red so you can tell which bursts first. The flash strike is faster",
        "Archangel: 4 towers stand in the corners. Only one can be hit at a time, in order. Each one you break weakens the summons (half paladins → half guardians → no paladins → no guardians), and once all are down the Archangel starts firing big orbs of light",
      ],
      ja: [
        "剣神：体力半分以下の剣気の格子2回のうち、先に弾ける方が赤い剣気で表示されます。一閃が速くなりました",
        "大天使：四隅に塔が4本立ちます。塔は順番に1本ずつしか攻撃できず、壊すほど召喚が減り（聖騎士半分 → ガーディアン半分 → 聖騎士停止 → ガーディアン停止）、全部壊すと大天使が前方に大きな光の玉を撃ち始めます",
      ],
    },
  },
  {
    version: "0.38.0",
    date: "2026-10-20",
    items: {
      ko: [
        "무한 모드: 혼자 하기에서 고를 수 있습니다. 6층에서 끝나지 않고 계속 내려가며, 갈수록 적이 단단해지고 7층부터는 모든 보스 중 하나가 나옵니다. 최고 층 기록이 따로 남습니다",
        "격투가 쌍광연격: 피해를 절반으로 낮추고, 관통 돌진이 더 멀리 나갑니다",
        "거너 드론 무기: 드론은 최대 10대까지 늘어납니다",
      ],
      en: [
        "Endless Mode: pick it from Play Solo. The run doesn't end at floor 6 — keep going down as enemies get tougher, and from floor 7 any boss can appear. Your deepest floor is recorded separately",
        "Brawler Twin Light Barrage: damage halved, and the piercing dash goes farther",
        "Gunner Drones: drones now cap at 10",
      ],
      ja: [
        "エンドレスモード：ひとりで遊ぶから選べます。6階で終わらずに降り続け、敵はだんだん硬くなり、7階からは全ボスの中から1体が出ます。最高到達階は別に記録されます",
        "格闘家の双光連撃：ダメージを半分にし、貫通突進がより遠くまで届きます",
        "ガンナーのドローン：ドローンは最大10機まで増えます",
      ],
    },
  },
];
