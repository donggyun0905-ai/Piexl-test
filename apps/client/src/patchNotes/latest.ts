import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.82",
    date: "2026-11-07",
    items: {
      ko: ["블래스트 대시 슬라이딩(1.7초) 중에 움직이는 방향으로 방향을 바꾸며 이동할 수 있게", "새벽의 성흔 특징: 성흔(달빛 각성)이 발동하면 화면 위로 하얀 달과 달빛이 비치고 가장자리로 흰 깃털이 흩날림"],
      en: ["Blast can now steer and move in any direction during the 1.7s dash slide", "Dawn Stigmata trait: when the Stigma (Moonlight Awakening) triggers, a white moon and moonlight shine over the screen and white feathers drift around its edges"],
      ja: ["ブラストのダッシュ・スライディング（1.7秒）中に移動方向へ向きを変えながら動けるように", "暁の聖痕の特徴：聖痕（月光覚醒）が発動すると画面の上に白い月と月光が差し、縁に白い羽根が舞う"],
    },
  },
  {
    version: "0.49.81",
    date: "2026-11-07",
    items: {
      ko: ["블래스트 파란 탄 피해 60%로 (슬라이딩 중엔 공격을 맞지 않으니)"],
      en: ["Blast blue shells now deal 60% damage (you can't be hit while sliding)"],
      ja: ["ブラストの青い弾のダメージを60%に（スライディング中は攻撃を受けないため）"],
    },
  },
  {
    version: "0.49.80",
    date: "2026-11-07",
    items: {
      ko: [
        "블래스트 대시 슬라이딩: 대시가 끝난 뒤 느려지던 것을, 대시 자체가 1.7초 동안 천천히 미끄러지는 슬라이딩이 되고 그동안 모두가 느려지게 (적은 더 느리게) · 미끄러지는 동안 파란 탄을 다 쏠 수 있음",
        "슬로우모션 중엔 탄창 5발이 사라지고 파란 탄 4발로 바뀜 → 잿빛 화면이 끝나면 원래 탄창으로 돌아옴",
      ],
      en: [
        "Blast dash slide: instead of slowing after the dash, the dash itself becomes a slow 1.7s slide during which everyone slows down (enemies even more) · you can fire all blue shells while sliding",
        "During the slow motion the 5-shell magazine is replaced by 4 blue shells → the original magazine returns when the gray screen ends",
      ],
      ja: [
        "ブラストのダッシュ・スライディング：ダッシュ後に遅くなっていたのを、ダッシュ自体が1.7秒のゆっくりしたスライディングになり、その間全員が遅くなるように（敵はさらに遅く）・滑りながら青い弾を撃ち切れる",
        "スローモーション中は弾倉5発が消えて青い弾4発に → 灰色の画面が終わると元の弾倉に戻る",
      ],
    },
  },
  {
    version: "0.49.79",
    date: "2026-11-07",
    items: {
      ko: [
        "블래스트 탄창 5발: 5발마다 마지막 발은 확정 치명타 (체력 줄 위 새빨간 탄) · 쏘지 않을 때 한 발씩 장전하며 철컥 소리 · 한 발만 들어가도 바로 쏠 수 있지만 치명타 탄은 다시 5번째 발에서 (두 발 → 펌프질 방식은 없앰)",
        "블래스트 대시 슬로우모션 (7초마다): 2초 동안 나를 포함한 모두가 느려지고 화면이 잿빛으로 · 파란 탄 4발이 바로 장전 (푸른 폭발) · 그동안 공격 속도와 탄은 그대로",
        "아이템 바뀜: 빠른 펌프 → 빠른 장전 (한 발 장전 시간 -30%)",
      ],
      en: [
        "Blast 5-shell magazine: every 5th shell is a guaranteed crit (bright red shell above the HP bar) · reloads one shell at a time with a click when not firing · you can fire as soon as one shell is in, but the crit shell comes again only on the 5th shot (the two-shots-then-pump pattern is gone)",
        "Blast dash slow motion (every 7s): for 2s everyone including you slows down and the screen turns gray · 4 blue shells load instantly (blue blast) · your attack speed and shots stay the same",
        "Item changed: Quick Pump → Quick Reload (-30% time to load each shell)",
      ],
      ja: [
        "ブラストの弾倉5発：5発ごとに最後の1発は確定クリティカル（体力バーの上に真っ赤な弾）・撃たない間に1発ずつ装填しガチャッと音・1発入ればすぐ撃てるがクリティカル弾は再び5発目に（2発→ポンプ方式は廃止）",
        "ブラストのダッシュスローモーション（7秒ごと）：2秒間、自分を含む全員が遅くなり画面が灰色に・青い弾4発が即装填（青い爆発）・その間も攻撃速度と弾はそのまま",
        "アイテム変更：素早いポンプ → 素早い装填（1発の装填時間-30%）",
      ],
    },
  },
];
