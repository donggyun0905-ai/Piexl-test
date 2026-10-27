import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.125",
    date: "2026-10-27",
    items: {
      ko: [
        "1단계 얍삽한 활잡이: 화살 피해 40% 줄임",
        "아티팩터: 제작 때 숨겨진 아이템 확률 12% → 5% · 리펄스 총 기본 공격력 14 → 10",
        "오토마타: 자매 인형 레이저는 본체의 절반 · 자매 인형 미사일 5% · 본체 미사일 20% → 10%",
        "라이더: 오토바이라 받는 피해 +20% · 펄스 게이지가 더 천천히 참 · 암살 단검: 빠르기 피해가 대시·빠른 이동으로 끝없이 커지던 문제 고침(최대 +40%) · 대시 목 베기 220% → 160%",
        "이터: 재생력이 0.5초마다 참 (두 배 빠르게)",
        "사멸 독연기·라이더 불꽃 자국이 방을 옮기면 사라짐",
        "음양사 어둠의 부적: 거리와 상관없이 늘 적을 따라감",
        "오니: 사용 아이템(회복약·방패·폭탄 등)을 줍거나 살 수 없음 (패시브는 그대로)",
        "격투가 택견: 공격 속도 최대 7.6 (너무 빠르면 기술 무적이 이어지던 문제)",
      ],
      en: [
        "Stage 1 Sly Archer: arrow damage reduced by 40%",
        "Artifacter: hidden item chance when crafting 12% → 5% · Repulsor base damage 14 → 10",
        "Automata: sister doll laser deals half of the main body's · doll missiles 5% · own missiles 20% → 10%",
        "Rider: bikes are risky, +20% damage taken · pulse gauge fills more slowly · Assassin's Dagger: speed bonus no longer grows endlessly from dashing and fast movement (max +40%) · dash throat-slash 220% → 160%",
        "Eater: regen ticks every 0.5s (twice as fast)",
        "Samyeol's poison smoke and Rider's flame trails now vanish when you change rooms",
        "Mystic Dark charm: always homes in on enemies at any distance",
        "Oni: can no longer pick up or buy use items (potions, shields, bombs, etc.; passives still allowed)",
        "Brawler Taekkyon: attack speed capped at 7.6 (fixes endless move invulnerability at very high speed)",
      ],
      ja: [
        "1段階ずる賢い弓使い：矢のダメージ40%減",
        "アーティファクター：製作時の隠しアイテム確率12% → 5% · リパルサー基本攻撃力14 → 10",
        "オートマタ：姉妹人形のレーザーは本体の半分 · 人形のミサイル5% · 本体のミサイル20% → 10%",
        "ライダー：バイクは危険なので被ダメージ+20% · パルスゲージが溜まりにくく · 暗殺ダガー：ダッシュや速い移動で速さダメージが際限なく上がる問題を修正（最大+40%）· ダッシュ喉斬り220% → 160%",
        "イーター：再生力が0.5秒ごとに溜まる（2倍速く）",
        "死滅の毒煙・ライダーの炎の跡が部屋を移ると消えるように",
        "陰陽師の闇の札：距離に関係なく必ず敵を追う",
        "鬼：使用アイテム（回復薬・盾・爆弾など）を拾ったり買ったりできない（パッシブはそのまま）",
        "格闘家テッキョン：攻撃速度の上限7.6（速すぎると技の無敵が続く問題）",
      ],
    },
  },
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
