import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.232",
    date: "2026-10-29",
    items: {
      ko: [
        "로비 전시장 기록집: 전시장에 들어가면 가운데 펼쳐진 책 · 책이나 전시물 앞에서 F → 전시물마다 얻은 횟수·처음 얻은 날, 악의 사도로 모은 영혼 (10,000개 → 히든 캐릭터 '몰락한 왕')·차원의 순례자를 만난 횟수 (10번 → '차원의 순례자' 해금) · 연습장 기록은 들어가지 않음",
        "아티팩터 제작대: 강화한 패시브에 무엇이 어떻게 세졌는지 (원래 → 지금) 표시 · 합치기 고침: 여러 번 가질 수 있는 '빛나는 문신'이 후보에서 빠져 골드만 나가다 히든만 나오던 문제",
        "아티팩터 제작대·추적자 튜닝소 창을 크게 (글자·카드·단추 모두)",
        "차원의 순례자(상점)가 다른 층의 같은 번호 방에 모습만 남아 있던 문제 고침 · 히든 캐릭터 차원의 순례자: 수집 도감 공격력이 능력치 창 공격력에 바로 보이게",
      ],
      en: [
        "Hall Record Book: an open book in the middle of the Exhibition Hall · press F at the book or an exhibit to see how many times you got each exhibit and when, souls gathered as the Apostle (10,000 → hidden character 'Fallen King') and times you met the Dimensional Pilgrim (10 → unlocks 'Dimensional Pilgrim') · practice runs don't count",
        "Artifacter workbench: enhanced passives now show what got stronger and by how much (before → now) · Fuse fixed: the repeatable 'Glowing Tattoo' was missing from the pool, so gold was spent until a hidden passive came out",
        "Artifacter workbench and Tracker tuning bay windows are bigger (text, cards and buttons)",
        "Fixed the Dimensional Pilgrim (shop) staying visible in the same-numbered room on other floors · hidden character Dimensional Pilgrim: the collection-book attack bonus now shows in the stats window",
      ],
      ja: [
        "展示場の記録集: 展示場の真ん中に開いた本 · 本や展示物の前でF → 展示物ごとの入手回数・初入手日、悪の使徒で集めた魂 (10,000個 → ヒドゥンキャラ「没落した王」)・次元の巡礼者に会った回数 (10回 → 「次元の巡礼者」解放) · 練習場は数えない",
        "アーティファクターの作業台: 強化したパッシブの何がどれだけ強くなったか (元 → 今) を表示 · 合成の修正: 何度も持てる「光る刺青」が候補から抜け、ゴールドだけ減ってヒドゥンしか出なかった問題",
        "アーティファクターの作業台・追跡者のチューニング工房のウィンドウを大きく (文字・カード・ボタン)",
        "次元の巡礼者 (ショップ) が別の階の同じ番号の部屋に姿だけ残っていた問題を修正 · ヒドゥンキャラ次元の巡礼者: 収集図鑑の攻撃力がステータス画面の攻撃力にすぐ反映",
      ],
    },
  },
  {
    version: "0.48.231",
    date: "2026-10-29",
    items: {
      ko: ["로비 전시장: 로비 위 벽 가운데 금빛 아치 문으로 들어가면 라스트 보스방만 한 전시장 (대리석 바닥·붉은 융단·아치 창 빛·기둥) · 첫 전시물 영혼 조각(바스러져가는 왕관을 얻으면)·거대한 방주 월계선 · 가까이 가면 이름과 설명", "히든 아이템 '바스러져가는 왕관' 추가 (지금은 얻으면 전시장에 영혼 조각이 놓임, 변신은 다음 업데이트)"],
      en: ["Lobby Exhibition Hall: walk through the golden arch at the top of the lobby into a hall as big as a last-boss room (marble floor, red carpet, window light, pillars) · first exhibits: the Soul Shard (from the Crumbling Crown) and the giant Laurel Ark · get close to see names and stories", "New hidden item 'Crumbling Crown' (for now, obtaining it places a Soul Shard in the hall; the transformation comes in a later update)"],
      ja: ["ロビー展示場: ロビー上の壁の金のアーチ扉から、ラストボス部屋ほどの展示場へ (大理石の床・赤い絨毯・窓の光・柱) · 最初の展示物は魂のかけら (崩れゆく王冠を手に入れると)・巨大な方舟の月桂船 · 近づくと名前と説明", "ヒドゥンアイテム「崩れゆく王冠」を追加 (今は手に入れると展示場に魂のかけらが置かれる、変身は次のアップデート)"],
    },
  },
];
