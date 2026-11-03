import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.377",
    date: "2026-11-04",
    items: {
      ko: [
        "쓰러질 때 연출: 바로 결과 창이 뜨지 않고, 쓰러지기 직전 장면이 느리게 다시 나온 뒤(맞은 공격이 보임) 몸이 옆으로 쓰러지고 나서 결과 창",
        "결과 창에 '쓰러진 원인': 마지막 한 방 · 이 방에서 무엇에 얼마나 맞았는지 막대 (맞은 횟수·가장 큰 한 방)",
        "단련의 방: 미니게임 설명 창에 저절로 해 보이는 예시 화면 (샌드백·랫풀다운·벤치 프레스)",
      ],
      en: [
        "Death sequence: instead of the result window popping up at once, the moments before you fall replay in slow motion (you see what hit you), your body topples, then the result window",
        "'What took you down' in the result window: the final blow and bars for what hit you in this room (hits and biggest hit)",
        "Training room: the minigame explanation now has a self-playing example (sandbag, lat pull, bench press)",
      ],
      ja: [
        "倒れたときの演出：すぐに結果ウィンドウを出さず、倒れる直前の場面をスローで再生（受けた攻撃が見える）→ 体が横に倒れてから結果ウィンドウ",
        "結果ウィンドウに「倒れた原因」：最後の一撃・この部屋で何にどれだけ受けたかのバー（被弾回数・最大の一撃）",
        "鍛錬の部屋：ミニゲーム説明ウィンドウに自動で遊ぶ例の画面（サンドバッグ・ラットプル・ベンチプレス）",
      ],
    },
  },
  {
    version: "0.48.376",
    date: "2026-11-03",
    items: {
      ko: [
        "끝없는 시련: 처치로 느려지는 이동 속도가 능력치 창에도 보임 · 시련 중에는 모든 회복이 막힘 (흡혈·재생·회복약·레벨업 회복 등) · 사용 아이템을 못 씀",
        "비밀의 방: 위쪽 출구가 없어지고, 들어온 쪽(아래 가운데)의 빛나는 뒷문으로 원래 방에 돌아감 (금 간 벽에서 조금 안쪽에 섬) · 시련 보상 상자로 들어간 비밀의 방도 같은 뒷문으로 시련의 방에 돌아옴",
      ],
      en: [
        "Endless trial: the move-speed slowdown from kills now shows in the stats window · all healing is blocked during the trial (lifesteal, regen, potions, level-up heals…) · use items can't be used",
        "Secret rooms: no more top exits — leave through the glowing back door where you came in (bottom center) to return to the original room (you stand just inside the cracked wall) · secret rooms opened from trial reward chests use the same back door to return to the trial room",
      ],
      ja: [
        "終わりなき試練：撃破で遅くなる移動速度が能力値ウィンドウにも表示・試練中はすべての回復が無効（吸血・再生・回復薬・レベルアップ回復など）・使用アイテム不可",
        "秘密の部屋：上の出口をなくし、入ってきた側(下の中央)の光る裏口から元の部屋に戻る（ひび割れた壁の少し内側に立つ）・試練の報酬箱から入った秘密の部屋も同じ裏口で試練の部屋に戻る",
      ],
    },
  },
];
