import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.303",
    date: "2026-10-31",
    items: {
      ko: ["방 테두리 벽: 출구가 있는 위쪽 벽만 두껍게, 옆·아래 벽은 얇게 (움직일 수 있는 범위는 그대로)"],
      en: ["Room border walls: only the top wall with the exits stays thick; side and bottom walls are now thin (the walkable area is unchanged)"],
      ja: ["部屋の外壁: 出口のある上の壁だけ厚く、横・下の壁は薄く（動ける範囲はそのまま）"],
    },
  },
  {
    version: "0.48.302",
    date: "2026-10-31",
    items: {
      ko: ["천사장의 탑을 새로 그림: 계단 대리석 받침 · 금테 기둥 · 빛나는 아치 창 · 날개 장식 · 금빛 첨탑 · 떠 있는 빛 수정 (2배 촘촘) · 지금 부술 수 있는 탑은 하늘로 솟는 빛기둥"],
      en: ["The Archangel's towers are redrawn: stepped marble base, gold-banded column, glowing arched window, wing ornaments, golden spire and a floating light crystal (double detail) · the tower you can break now sends a pillar of light into the sky"],
      ja: ["大天使の塔を描き直し: 段の大理石台座 · 金縁の柱 · 光るアーチ窓 · 翼の飾り · 金の尖塔 · 浮かぶ光の水晶（2倍の細かさ）· 今壊せる塔は空へ伸びる光の柱"],
    },
  },
  {
    version: "0.48.301",
    date: "2026-10-31",
    items: {
      ko: ["빛의 사도 '은총의 옷자락': 몸 둘레를 도는 빛의 검이 뒤쪽을 지날 때는 캐릭터 뒤로 숨었다가(흐리고 작게) 앞으로 다시 나옴"],
      en: ["Apostle of Light 'Hem of Grace': the orbiting light swords now pass behind the character (dimmer and smaller) before coming back in front"],
      ja: ["光の使徒「恩寵の裾」: 体の周りを回る光の剣が後ろを通るときはキャラの後ろに隠れ（薄く小さく）、また前に出てくる"],
    },
  },
  {
    version: "0.48.300",
    date: "2026-10-31",
    items: {
      ko: [
        "상태이상 14종 모두 피해와 그 색·아이콘 피해 숫자: 장로 번개·서리·바람·하늘 진, 플라이 서리·번개 발톱(서리 발톱에 서리 피해 추가), 서기관 봉인·번개·서리·불꽃·공허, 제우스 번개, 별지기 서리 빛줄기, 이무기 성광, 음양사 번개·얼음(서리 피해 추가)·빛(광휘 피해 추가) 부적, 마법사 서리 주문(서리 피해 추가), 기계공학자 장갑 용해(더 들어간 몫이 부식)",
        "피해 없는 상태이상 표시를 모든 적에게: 기절 = 머리 위에 도는 별 · 느림 = 발밑에 퍼지는 노란 물결 · 공포 = 머리 위 보랏빛 해골과 식은땀 (속박은 몸을 감는 붕대 그대로)",
        "관리자 페이지 상태이상 탭을 정리본으로: 한눈에 보기 표(아이콘·피해 숫자 색·성격·동작·거는 캐릭터 그림·값 수) · 고르면 설명 카드와 그 상태이상 값을 바로 고침",
      ],
      en: [
        "All 14 status effects now deal damage shown in their own color and icon: Elder's thunder/frost/wind/heaven seals, Fly's frost and thunder talons (frost talons now deal frost damage), Scribe's seal/bolt/frost/flame/void words, Zeus's lightning, Stargazer's frost lines, Imugi's holy light, Mystic's spark, frost (adds frost damage) and radiant (adds radiance damage) charms, Mage's frost spell (adds frost damage), and Engineer's armor melt (the extra damage counts as rot)",
        "Non-damage statuses now show on every enemy: stun = stars circling overhead · slow = yellow ripples under the feet · fear = a purple skull and cold sweat overhead (root keeps its wrapping bandage)",
        "Admin status tab is now a full overview: a summary table (icon, number color, type, behavior, who applies it, value count); pick one for its card and edit its values right there",
      ],
      ja: [
        "状態異常14種すべてにダメージと、その色・アイコンのダメージ数字: 長老の雷・霜・風・天の陣、フライの霜・雷の爪（霜の爪に霜ダメージ追加）、書記官の封印・雷・霜・炎・虚空、ゼウスの雷、星守りの霜の光線、イムギの聖光、陰陽師の雷・氷（霜ダメージ追加）・光（光輝ダメージ追加）の札、魔法使いの霜の呪文（霜ダメージ追加）、機械工学者の装甲溶解（増えた分が腐食）",
        "ダメージのない状態異常の表示をすべての敵に: 気絶 = 頭上を回る星 · 鈍足 = 足元に広がる黄色い波紋 · 恐怖 = 頭上の紫のドクロと冷や汗（拘束は体に巻く包帯のまま）",
        "管理ページの状態異常タブを整理版に: 一覧表（アイコン・数字の色・性格・動作・かけるキャラの絵・値の数）· 選ぶと説明カードとその状態異常の値をその場で修正",
      ],
    },
  },
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
];
