import type { Lang } from "../index";

// 화면 글자: 레이드 명예의 전당 (일일 도전 화면 버튼 · 명예의 전당 · 라스트 보스 결과 창)
export const RAID_TEXT = {
  hallButton: { ko: "레이드 명예의 전당", en: "Raid Hall of Fame", ja: "レイド殿堂" },
  hallTitle: { ko: "레이드 명예의 전당", en: "Raid Hall of Fame", ja: "レイド殿堂" },
  hallSub: {
    ko: "최강의 존재를 가장 빨리 쓰러뜨린 전설들",
    en: "The legends who felled the mightiest the fastest",
    ja: "最強の存在を最速で倒した伝説たち",
  },
  hallChampion: { ko: "최강자", en: "Champion", ja: "最強者" },
  hallEmpty: {
    ko: "아직 아무도 오르지 못했습니다. 첫 전설이 되어 보세요!",
    en: "No one has made it yet. Become the first legend!",
    ja: "まだ誰も到達していません。最初の伝説になろう！",
  },
  hallNote: {
    ko: "혼자 하기에서 6층을 깨고 라스트 보스에 도전해, 보스방에 들어가서 잡기까지 걸린 시간 (보스마다 10위까지)",
    en: "Solo: clear floor 6, challenge a final boss, and beat it fast. Time counts from entering the boss room (top 10 per boss)",
    ja: "ソロで6階をクリアしてラストボスに挑戦し、ボス部屋に入ってから倒すまでの時間（ボスごとに10位まで）",
  },
  hallMusicOn: { ko: "♪ 음악 켜기", en: "♪ Music on", ja: "♪ 音楽オン" },
  hallMusicOff: { ko: "♪ 음악 끄기", en: "♪ Music off", ja: "♪ 音楽オフ" },
  arenaButton: { ko: "레이드 아레나", en: "Raid Arena", ja: "レイドアリーナ" },
  arenaBoardNote: {
    ko: "혼자 하기 → 레이드 아레나: 깬 레벨이 높은 순, 같으면 빠른 시간 순 (전체 기간 30위까지)",
    en: "Solo → Raid Arena: highest level cleared first, then fastest time (all-time top 30)",
    ja: "ソロ → レイドアリーナ：クリアしたレベルが高い順、同じなら速い順（全期間30位まで）",
  },
  arenaRanked: { ko: "⚔ 레이드 아레나 {n}위에 올랐습니다!", en: "⚔ You placed #{n} in the Raid Arena!", ja: "⚔ レイドアリーナ{n}位にランクイン！" },
  arenaNotRanked: { ko: "아쉽게도 30위 안에 들지 못했습니다", en: "Not enough for the top 30 this time", ja: "惜しくも30位に届きませんでした" },
  raidTimeLabel: { ko: "레이드 시간", en: "Raid time", ja: "レイドタイム" },
  raidRanked: { ko: "🏆 명예의 전당 {n}위에 올랐습니다!", en: "🏆 You entered the Hall of Fame at #{n}!", ja: "🏆 殿堂入り！{n}位です！" },
  raidKept: { ko: "명예의 전당 {n}위 (내 최고 기록이 더 빠름)", en: "Hall of Fame #{n} (your best is faster)", ja: "殿堂{n}位（自己ベストの方が速い）" },
  raidNotRanked: { ko: "아쉽게도 10위 안에 들지 못했습니다", en: "Not fast enough for the top 10 this time", ja: "惜しくも10位に届きませんでした" },
  raidNoLog: {
    ko: "이 판은 입력 기록이 빠져 있어(예전 버전에서 이어 한 판 등) 명예의 전당에 올릴 수 없습니다",
    en: "This run is missing its input record (e.g. resumed from an older version), so it can't enter the Hall of Fame",
    ja: "このプレイは入力記録が欠けているため（旧バージョンから再開した等）殿堂に登録できません",
  },
} satisfies Record<string, Record<Lang, string>>;
