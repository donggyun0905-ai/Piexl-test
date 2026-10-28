import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.177",
    date: "2026-10-28",
    items: {
      ko: [
        "아카이브 스토리에 시즌 2 추가: 아카식 레코드 4장 「뒷면」 · 5장 「원군」 · 6장 「황혼의 종언」, 최종 보스에 검은 잔영·괴력난신·제천대성 (목록은 시즌 1·2로 나눠 보임)",
        "땅 물고기가 솟구쳐 공중에 떠 있는 시간이 길어져 때리기 쉬워짐 (0.7초 → 1.7초)",
        "베놈 독가스를 밟으면 독 상태이상 3초 (0.5초마다 피해, 가스를 나가도 남음) · 부식독(회복·재생 40% 감소)은 3초 → 6초",
      ],
      en: [
        "Season 2 added to the Archive story: Akashic Records Chapter 4 'The Other Side', Chapter 5 'Reinforcements', Chapter 6 'The End of Twilight', plus Black Umbra, Demigod of Might and Great Sage under Final Bosses (lists are split into Seasons 1 and 2)",
        "Land Fish now stays airborne longer after bursting out, making it easier to hit (0.7s → 1.7s)",
        "Stepping in Venom's poison gas now inflicts Poison for 3s (damage every 0.5s, lingers after leaving the gas) · Corrosion (healing and regen −40%) lasts 6s instead of 3s",
      ],
      ja: [
        "アーカイブのストーリーにシーズン2を追加: アカシックレコード第4章「裏側」・第5章「援軍」・第6章「黄昏の終焉」、最終ボスに黒い残影・怪力乱神・斉天大聖 (一覧はシーズン1・2に分けて表示)",
        "土ザカナが飛び出して宙に浮いている時間が長くなり、攻撃を当てやすくなった (0.7秒 → 1.7秒)",
        "ヴェノムの毒ガスを踏むと毒の状態異常3秒 (0.5秒ごとにダメージ、ガスを出ても残る) · 腐食毒 (回復・再生40%減少) は3秒 → 6秒",
      ],
    },
  },
  {
    version: "0.48.176",
    date: "2026-10-28",
    items: {
      ko: [
        "방의 적을 다 잡으면 지형이 멈춤: 진흙·물에서 느려지지 않고, 용암·감전된 물·가시 함정·독가스 피해가 없음 (가시는 들어간 채)",
        "바닥 아이템이 늘 지형(진흙·용암·물·가시·독가스) 위에 보여서 가려지지 않음",
      ],
      en: [
        "Terrain stops once a room is cleared: no slowing in mud or water, and no damage from lava, shocked water, spike traps or poison gas (spikes stay down)",
        "Floor items are always drawn above terrain (mud, lava, water, spikes, poison gas), so they're never hidden",
      ],
      ja: [
        "部屋の敵を全滅させると地形が止まる: 泥・水で遅くならず、溶岩・感電した水・トゲの罠・毒ガスのダメージなし (トゲは引っ込んだまま)",
        "床のアイテムが常に地形 (泥・溶岩・水・トゲ・毒ガス) の上に表示され、隠れない",
      ],
    },
  },
  {
    version: "0.48.175",
    date: "2026-10-28",
    items: {
      ko: [
        "메인의 '스토리' 버튼이 '아카이브'로 바뀜: 누르면 메뉴 창에서 스토리(그대로)와 새 티어표를 고름",
        "티어표: 반신급·국밥급·중간계·애매함·쓰레기 다섯 단계 · 전체/시즌 1/시즌 2 · 캐릭터 얼굴에 마우스를 올리면 그 자리인 이유",
        "티어표에서 캐릭터 얼굴을 누르면 아래에서 그 캐릭터가 시작 무기로 허수아비를 때리는 미리보기 (피해 숫자·초당 피해)",
      ],
      en: [
        "The main 'Story' button is now 'Archive': it opens a menu with Story (unchanged) and the new Tier List",
        "Tier List: five tiers (Demigod, Reliable, Middle, Awkward, Struggling) · All / Season 1 / Season 2 · hover a character face to see why it sits there",
        "Click a face in the Tier List to watch that character hit the dummy with its starting weapon below (damage numbers, DPS)",
      ],
      ja: [
        "メインの「ストーリー」ボタンが「アーカイブ」に: 押すとメニューでストーリー（そのまま）と新しいティア表を選べる",
        "ティア表: 半神級・定番級・中間・微妙・苦戦の5段階 · 全体/シーズン1/シーズン2 · キャラの顔にマウスを乗せるとその位置の理由",
        "ティア表でキャラの顔を押すと、下でそのキャラが初期武器でカカシを叩くプレビュー（ダメージ数字・秒間ダメージ）",
      ],
    },
  },
];
