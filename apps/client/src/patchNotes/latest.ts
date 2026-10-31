import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.293",
    date: "2026-10-31",
    items: {
      ko: ["스킨 정리: 상점 테마 스킨 9종(수영복·크리스마스·할로윈·학교·새해·일본풍·중국풍·미국풍·성별 바꾸기)을 없애고 한정 스킨만 남김 · 리그 우승 '승리' 스킨은 장수·파수꾼·거너·추적자·잊혀진 자 5명만 · 뽑기는 한정 테마 1% · 이벤트 코인 22% · 쿠폰 77% · 나만의 스킨은 그대로"],
      en: ["Skin cleanup: the 9 shop theme skins (Swimsuit, Christmas, Halloween, School, New Year, Japanese, Chinese, American, Gender Swap) are gone; only limited skins remain · the league 'Victory' skin is now for 5 characters (General, Warden, Gunner, Tracker, The Forgotten) · gacha: limited theme 1%, event coins 22%, coupons 77% · My Own Skin is unchanged"],
      ja: ["スキン整理: ショップのテーマスキン9種（水着・クリスマス・ハロウィン・学校・お正月・和風・中華風・アメリカ風・性別チェンジ）を廃止し限定スキンのみに · リーグ優勝「勝利」スキンは武将・番人・ガンナー・追跡者・忘れられし者の5人のみ · ガチャは限定テーマ1%・イベントコイン22%・クーポン77% · マイスキンはそのまま"],
    },
  },
  {
    version: "0.48.292",
    date: "2026-10-31",
    items: {
      ko: ["새 캐릭터 그림(시험): 역병의사 · 앞·뒤·왼·오 모습과 공격·걷기·맞음·쓰러짐·대시 자세"],
      en: ["New art (trial): Plague Doctor · front/back/left/right with attack, walk, flinch, downed and dash poses"],
      ja: ["新しいキャラ絵（試験）: 疫病医 · 前・後ろ・左・右と攻撃・歩き・ひるみ・ダウン・ダッシュのポーズ"],
    },
  },
  {
    version: "0.48.291",
    date: "2026-10-31",
    items: {
      ko: ["좌우가 반대로 나오던 그림 고침: 변희 봉황 공격 · 각성 거미 공격"],
      en: ["Fixed mirrored poses: Byeonhui phoenix attack · awakened spider attack"],
      ja: ["左右が逆になっていた絵を修正: ビョンヒの鳳凰の攻撃 · 覚醒した蜘蛛の攻撃"],
    },
  },
  {
    version: "0.48.290",
    date: "2026-10-31",
    items: {
      ko: ["좌우가 반대로 나오던 변희 동물 그림 고침: 뱀·박쥐 공격·걷기 · 거미 걷기 · 각성 멧돼지·뱀 걷기 · 각성 늑대 공격"],
      en: ["Fixed mirrored Byeonhui animal poses: snake and bat attack/walk · spider walk · awakened boar and snake walk · awakened wolf attack"],
      ja: ["左右が逆になっていたビョンヒの動物の絵を修正: 蛇・コウモリの攻撃・歩き · 蜘蛛の歩き · 覚醒した猪・蛇の歩き · 覚醒した狼の攻撃"],
    },
  },
  {
    version: "0.48.289",
    date: "2026-10-31",
    items: {
      ko: ["새 캐릭터 그림: 변희 각성 동물 10종 (불꽃 곰·암흑 멧돼지·결정 거미·백금 독수리·보랏빛 코브라·불꽃 갑주 봉황·어둠의 박쥐 드래곤·황금 갑주 코끼리·황금 전갈·푸른 불꽃 늑대) · 앞·뒤·왼·오 모습과 공격·걷기·맞음·쓰러짐·대시 자세"],
      en: ["New art: Byeonhui's 10 awakened forms (flame bear, dark boar, crystal spider, platinum eagle, violet cobra, flame-armored phoenix, dark bat dragon, golden-armored elephant, golden scorpion, blue-flame wolf) · front/back/left/right with attack, walk, flinch, downed and dash poses"],
      ja: ["新しいキャラ絵: ビョンヒの覚醒動物10種（炎の熊・闇の猪・結晶の蜘蛛・白金の鷲・紫のコブラ・炎鎧の鳳凰・闇のコウモリドラゴン・黄金鎧の象・黄金の蠍・青い炎の狼）· 前・後ろ・左・右と攻撃・歩き・ひるみ・ダウン・ダッシュのポーズ"],
    },
  },
  {
    version: "0.48.288",
    date: "2026-10-31",
    items: {
      ko: ["새 캐릭터 그림: 변희 동물 코끼리·박쥐 · 앞·뒤·왼·오 모습과 공격·걷기·맞음·쓰러짐·대시 자세"],
      en: ["New art: Byeonhui's elephant and bat forms · front/back/left/right with attack, walk, flinch, downed and dash poses"],
      ja: ["新しいキャラ絵: ビョンヒの動物 象・コウモリ · 前・後ろ・左・右と攻撃・歩き・ひるみ・ダウン・ダッシュのポーズ"],
    },
  },
  {
    version: "0.48.287",
    date: "2026-10-31",
    items: {
      ko: ["새 캐릭터 그림: 변희 동물 거미·봉황 · 앞·뒤·왼·오 모습과 공격·걷기·맞음·쓰러짐·대시 자세"],
      en: ["New art: Byeonhui's spider and phoenix forms · front/back/left/right with attack, walk, flinch, downed and dash poses"],
      ja: ["新しいキャラ絵: ビョンヒの動物 蜘蛛・鳳凰 · 前・後ろ・左・右と攻撃・歩き・ひるみ・ダウン・ダッシュのポーズ"],
    },
  },
  {
    version: "0.48.286",
    date: "2026-10-31",
    items: {
      ko: ["보스 체력 막대 아래에 남은 체력 % 표시 · 필살기를 쓰는 체력 자리에 금빛 표식과 % (라스트 보스 10% · 괴력난신 70%·50%·10%) · 표식에 가까워지면 깜박이고, 지나가면 흐려짐"],
      en: ["Boss HP bar now shows the remaining HP % below it · gold markers with % at the HP where the boss uses its ultimate (last bosses 10% · Demigod of Wild Might 70%, 50%, 10%) · markers blink as you get close and dim once passed"],
      ja: ["ボスの体力バーの下に残り体力%を表示 · 必殺技を使う体力の位置に金色の印と%（ラストボス10% · 怪力乱神70%・50%・10%）· 近づくと点滅し、過ぎると暗くなる"],
    },
  },
  {
    version: "0.48.285",
    date: "2026-10-31",
    items: {
      ko: ["좌우가 반대로 나오던 그림 고침: 변희 서기·걷기·공격 · 곰 대시"],
      en: ["Fixed mirrored poses: Byeonhui standing, walking and attack · bear dash"],
      ja: ["左右が逆になっていた絵を修正: ビョンヒの立ち・歩き・攻撃 · 熊のダッシュ"],
    },
  },
  {
    version: "0.48.284",
    date: "2026-10-31",
    items: {
      ko: ["새 캐릭터 그림: 변희 · 변희 동물 늑대·곰 · 앞·뒤·왼·오 모습과 공격·걷기·맞음·쓰러짐·대시 자세"],
      en: ["New art: Byeonhui · her wolf and bear forms · front/back/left/right with attack, walk, flinch, downed and dash poses"],
      ja: ["新しいキャラ絵: ビョンヒ · 動物の狼・熊 · 前・後ろ・左・右と攻撃・歩き・ひるみ・ダウン・ダッシュのポーズ"],
    },
  },
  {
    version: "0.48.283",
    date: "2026-10-31",
    items: {
      ko: ["새 캐릭터 그림: 거인 · 오니(각성 모습 포함) · 이드라 · 변희 동물 4종(뱀·독수리·멧돼지·전갈) · 앞·뒤·왼·오 모습과 공격·걷기·맞음·쓰러짐·대시 자세"],
      en: ["New art: Titan · Oni (including the awakened form) · Idra · 4 of Byeonhui's animals (snake, eagle, boar, scorpion) · front/back/left/right with attack, walk, flinch, downed and dash poses"],
      ja: ["新しいキャラ絵: 巨人 · 鬼（覚醒した姿も）· イドラ · ビョンヒの動物4種（蛇・鷲・猪・蠍）· 前・後ろ・左・右と攻撃・歩き・ひるみ・ダウン・ダッシュのポーズ"],
    },
  },
];
