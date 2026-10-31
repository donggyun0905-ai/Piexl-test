import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.299",
    date: "2026-10-31",
    items: {
      ko: ["관리자 페이지 상태이상 탭을 게임의 상태이상 14종(출혈·화상·독·저주·폭풍·부식·죽음·지옥불·감전·서리·물결·황금·광휘·공허탄) + 기절·느림으로 나눔 · 아이콘 · 엉뚱한 값이 섞이던 것 고침"],
      en: ["Admin status tab now follows the game's 14 status effects (bleed, burn, poison, curse, storm, rot, death, hellfire, shock, frost, tide, gold, radiance, void bolt) plus stun/slow, with icons; unrelated values no longer slip in"],
      ja: ["管理ページの状態異常タブをゲームの14種（出血・火傷・毒・呪い・嵐・腐食・死・地獄火・感電・霜・波・黄金・光輝・虚空弾）＋気絶・鈍足に分け、アイコン付きに · 関係ない値が混ざるのを修正"],
    },
  },
  {
    version: "0.48.298",
    date: "2026-10-31",
    items: {
      ko: ["관리자 페이지: 항목마다 그림 (캐릭터·무기·패시브·아이템·적·보스, 규칙 표는 그 캐릭터) · 역할군·클리어 시간 표에도 캐릭터 그림 · 무한 모드 수치(보스 단계·세지는 정도) 추가 · 캐릭터 칸 제목이 모두 '근접 중심'처럼 나오던 것 고침"],
      en: ["Admin page: pictures for every entry (characters, weapons, passives, items, enemies, bosses; rule tables show their character) · character pictures in the role and clear-time tables · Endless mode values added (boss stages, scaling) · fixed character fields all showing the row description as their title"],
      ja: ["管理ページ: 項目ごとに絵（キャラ・武器・パッシブ・アイテム・敵・ボス、ルール表はそのキャラ）· 役割・クリア時間の表にもキャラの絵 · エンドレスモードの数値（ボス段階・強くなる度合い）を追加 · キャラ欄のタイトルがすべて行の説明になっていたのを修正"],
    },
  },
  {
    version: "0.48.297",
    date: "2026-10-31",
    items: {
      ko: ["캐릭터 선택창의 캐릭터 그림이 걷지 않고 앞을 보고 선 모습으로 (선택 카드·설명 창)"],
      en: ["Character select: portraits now stand still facing forward instead of walking (cards and the info window)"],
      ja: ["キャラ選択画面のキャラ絵が歩かず、前を向いて立つ姿に（選択カード・説明ウィンドウ）"],
    },
  },
  {
    version: "0.48.296",
    date: "2026-10-31",
    items: {
      ko: ["로그 층의 방 칸마다 방이 늘 3개 (왼쪽·가운데·오른쪽)"],
      en: ["Every row of rooms on a roguelike floor now always has 3 rooms (left, middle, right)"],
      ja: ["ローグの各階、部屋の列はいつも3部屋（左・中・右）"],
    },
  },
  {
    version: "0.48.295",
    date: "2026-10-31",
    items: {
      ko: ["로그 층마다 방 칸을 3줄씩 늘림 (1층 7칸 → 6층 11칸, 시작 방·보스방 빼고) · 노선도 창은 화면 높이 가운데에, 크기는 그대로 두고 칸이 많은 층은 안에서 작게 그림"],
      en: ["Each roguelike floor now has 3 more rows of rooms (7 on floor 1 up to 11 on floor 6, not counting start and boss rooms) · the route map is centered vertically and keeps its size; floors with more rows are drawn smaller inside it"],
      ja: ["ローグの各階の部屋を3列ずつ追加（1階7列〜6階11列、スタート部屋・ボス部屋を除く）· ルートマップは画面の高さ中央に、大きさはそのままで列の多い階は中で小さく表示"],
    },
  },
  {
    version: "0.48.294",
    date: "2026-10-31",
    items: {
      ko: ["게임 이름을 'Pixel Toybox'로 바꿈 (메인 화면·브라우저 탭·홈 화면 앱 이름·초대 글·관리자·도트 편집 페이지)"],
      en: ["The game is now called 'Pixel Toybox' (title screen, browser tab, home-screen app name, invite text, admin and pixel editor pages)"],
      ja: ["ゲーム名を「Pixel Toybox」に変更（タイトル画面・ブラウザのタブ・ホーム画面のアプリ名・招待文・管理・ドット編集ページ）"],
    },
  },
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
