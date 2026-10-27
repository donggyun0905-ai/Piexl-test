import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.124",
    date: "2026-10-26",
    items: {
      ko: ["관리자 페이지: 적·보스 탭에 표의 모든 숫자와 기술 수치(보스마다 브레스·운석·패턴 등) · 위쪽에 '몬스터·보스 그림 고치기'(도트 편집) 바로 가기"],
      en: ["Admin page: the Enemies and Bosses tabs now show every stat plus skill numbers (each boss's breath, meteors, patterns and more) · added a 'Edit monster/boss art' link to the pixel editor"],
      ja: ["管理者ページ：敵・ボスタブに表のすべての数値と技の数値（ボスごとのブレス・隕石・パターンなど）· 上に「モンスター・ボスの絵を直す」（ドット編集）へのリンク"],
    },
  },
  {
    version: "0.48.123",
    date: "2026-10-26",
    items: {
      ko: ["모든 캐릭터가 가질 수 있는 기본 스탯 추가 (관리자 페이지에서 캐릭터마다 정함, 처음엔 0이라 지금 게임은 그대로): 치명타 확률·치명타 피해, 방어력, 받는 피해 감소, 회피, 재생력, 흡혈, 예리함(맞힐 때 확률로 적 방어 -25%와 출혈), 상태이상 강화, 돈 획득 · 값이 있으면 능력치 창에 보임", "관리자 페이지: '상태이상' 탭 (독·화상·출혈·부식·죽음·빙결·감전·기절 등에 쓰이는 값을 모아 바꿈)"],
      en: ["Added base stats any character can have (set per character on the admin page; all start at 0 so the game is unchanged): crit chance and crit damage, armor, damage reduction, dodge, regen, lifesteal, sharpness (chance on hit for -25% enemy defense plus bleed), status power and gold gain · shown in the stats panel when set", "Admin page: new Status tab gathering every value used by poison, burn, bleed, corrosion, death, frost, shock, stun and more"],
      ja: ["すべてのキャラが持てる基本ステータスを追加（管理者ページでキャラごとに設定、最初は0なのでゲームはそのまま）：会心率・会心ダメージ、防御力、被ダメージ軽減、回避、再生力、吸血、鋭さ（当てた時に確率で敵の防御-25%と出血）、状態異常強化、ゴールド獲得 · 値があれば能力値画面に表示", "管理者ページ：「状態異常」タブ（毒・火傷・出血・腐食・死・凍結・感電・気絶などの値をまとめて調整）"],
    },
  },
  {
    version: "0.48.122",
    date: "2026-10-26",
    items: {
      ko: ["관리자 페이지: 캐릭터·무기·기술·아이템 효과의 수치를 모두 바꿀 수 있게 (무기 모양 안의 미사일 수·확률·범위, 캐릭터마다 기술 수치 약 4,300개) · 찾기 칸과 캐릭터별 분류 추가"],
      en: ["Admin page: every number for characters, weapons, skills and item effects can now be tuned (missile counts, chances and radii inside weapon styles, about 4,300 values) · added search and per-character filters"],
      ja: ["管理者ページ：キャラ・武器・技・アイテム効果の数値をすべて調整可能に（武器の形の中のミサイル数・確率・範囲など約4,300個）· 検索欄とキャラ別の分類を追加"],
    },
  },
];
