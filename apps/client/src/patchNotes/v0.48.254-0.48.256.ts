import type { PatchNote } from "./types";

export const NOTES: PatchNote[] = [
  {
    version: "0.48.256",
    date: "2026-10-30",
    items: {
      ko: [
        "캐릭터 선택창(로그·기간토마키아 등 모두): 전체 · 아스칼론 · 테라코어 · 비르디아 · 헬리오스 · 아카식 레코드(테스트 전용 히든) 탭과 이름 검색",
        "캐릭터 카드는 크게 그린 생김새 · 이름 · 스킨 이름 · 훈장 · 스킨 바꾸기만 · 카드를 누르면 설명·능력치·숙련도 창이 뜨고 '진행하기'로 시작 ('취소'·Esc로 닫음)",
        "캐릭터 숙련도 (Lv.1~7): 그 캐릭터로 게임을 시작할 때마다 오름 · 레벨마다 카드 테두리가 열림 (나무 · 강철 · 청동 · 은빛 · 황금 · 비취 왕관 · 전설의 무지개)",
        "스킨 바꾸기 창: 스킨 · 테두리 · 카드 꾸밈 탭 · 카드 꾸밈 5종(균열의 문 · 용의 비늘 · 서리 왕관 · 잿불 성채 · 별의 심연)은 시즌 3 레이드 보스 이벤트에서 얻을 수 있음 (테스트 중에는 모두 써 볼 수 있음)",
        "로그: 라스트 보스방에 들어가면 체력이 가득 참",
      ],
      en: [
        "Character select (Dungeon, Gigantomachia and more): tabs for All · Ascalon · Terracore · Virdia · Helios · Akashic Records (test-only hidden) and a name search",
        "Character cards now show only a larger portrait, name, skin, medals and the skin button · click a card to see its guide, stats and mastery, then press 'Start' (close with 'Cancel' or Esc)",
        "Character mastery (Lv.1–7): rises each time you start a game with that character · each level unlocks a card frame (Oak · Steel · Bronze · Silver · Golden · Jade Crown · Legendary Prism)",
        "Skin window: Skin · Frame · Card design tabs · 5 card designs (Rift Gate · Dragon Scale · Frost Crown · Ember Keep · Star Abyss) can be earned in the Season 3 raid boss event (all open during testing)",
        "Dungeon: entering the last boss room fully restores your HP",
      ],
      ja: [
        "キャラクター選択（ローグ・ギガントマキアなどすべて）: すべて · アスカロン · テラコア · ヴィルディア · ヘリオス · アカシックレコード（テスト専用の隠し）タブと名前検索",
        "キャラカードは大きな姿 · 名前 · スキン名 · 勲章 · スキン変更だけに · カードを押すと説明・能力値・熟練度の窓が開き「進む」で開始（「キャンセル」・Escで閉じる）",
        "キャラ熟練度（Lv.1〜7）: そのキャラでゲームを始めるたびに上昇 · レベルごとにカードの枠が開く（木 · 鋼 · 青銅 · 銀 · 黄金 · 翡翠の冠 · 伝説の虹）",
        "スキン変更の窓: スキン · 枠 · カードデザインのタブ · カードデザイン5種（亀裂の門 · 竜の鱗 · 霜の冠 · 残り火の城砦 · 星の深淵）はシーズン3のレイドボスイベントで手に入る（テスト中はすべて試せる）",
        "ローグ: ラストボスの部屋に入ると体力が全回復",
      ],
    },
  },
  {
    version: "0.48.255",
    date: "2026-10-30",
    items: {
      ko: [
        "기간토마키아 맵 1.5배 (348×204칸) · 거인·도깨비·상자도 늘림",
        "기간토마키아 건물: 학교 2 · 아파트 4(2층, 층마다 방 여럿) · 집 8 · 문 앞에서 F로 들어가 실내 방으로 바뀜 (계단으로 위층) · 실내는 밖에서 안 보이고 상자가 더 좋음 · 건물 안은 문 자리로 자기장을 셈",
        "기간토마키아 AI: 처음 1분 30초 뒤로는 보이는 상대와 싸우고 쫓음 · 체력이 낮거나 상대가 훨씬 세면 도망 · 건물에 들어가 파밍하고, 다 털었거나 자기장이 오면 나옴",
      ],
      en: [
        "Gigantomachia map is 1.5× larger (348×204) · more giants, goblins and chests",
        "Gigantomachia buildings: 2 schools · 4 apartments (2 floors with several rooms) · 8 houses · press F at a door to step into the interior (stairs lead upstairs) · interiors are hidden from outside and hold better chests · inside a building, the zone counts you at its door",
        "Gigantomachia AI: after the first 1:30 they fight and chase rivals they see · flee when low or facing a much stronger rival · they loot buildings and leave once they're empty or the zone closes in",
      ],
      ja: [
        "ギガントマキアのマップを1.5倍に（348×204マス）· 巨人・トッケビ・宝箱も増加",
        "ギガントマキアの建物: 学校2 · マンション4（2階建て、各階に部屋がいくつか）· 家8 · ドアの前でFを押すと室内の部屋へ（階段で上の階）· 室内は外から見えず、宝箱がより良い · 建物の中はドアの位置で磁場を判定",
        "ギガントマキアのAI: 最初の1分30秒の後は見えた相手と戦い追いかける · 体力が低い・相手がずっと強いと逃げる · 建物に入って漁り、空になったか磁場が来たら出る",
      ],
    },
  },
  {
    version: "0.48.254",
    date: "2026-10-30",
    items: {
      ko: [
        "로그 화면: 맵 좌우에 칸을 두고 맵은 그 사이를 꽉 채움 · 왼쪽 칸은 능력치 · '캐릭터 설명' 버튼 · 버프 창 (켜진 버프와 대기 시간·남은 초)",
        "캐릭터 설명 큰 창 (버튼 또는 I): 게임이 멈추고 왼쪽에 설명·모든 무기·전용 아이템(누르면 들어 봄), 오른쪽에 직접 움직이는 작은 연습장 · Esc·I로 닫음",
        "아티팩터 제작대·추적자 튜닝소 창: Esc로도 닫힘",
        "기간토마키아: 폭탄 피해 45",
      ],
      en: [
        "Dungeon screen: side columns next to the map, which now fills the space between · left column: stats, a 'Character guide' button and a buff panel (active buffs and cooldowns with seconds left)",
        "Character guide window (button or I): pauses the game; the left shows the guide, every weapon and exclusive item (click to try), the right is a small practice room you control · close with Esc or I",
        "Artifacter's workbench and Tracker's tuning shop windows now also close with Esc",
        "Gigantomachia: bombs deal 45 damage",
      ],
      ja: [
        "ローグ画面: マップの左右に欄を置き、マップはその間いっぱいに · 左欄は能力値・「キャラクター説明」ボタン・バフ欄（発動中のバフと待機時間・残り秒）",
        "キャラクター説明の大きなウィンドウ（ボタンかI）: ゲームが止まり、左に説明・全武器・専用アイテム（押すと装備）、右に自分で動かす小さな練習場 · Esc・Iで閉じる",
        "アーティファクターの作業台・追跡者のチューニング所ウィンドウ: Escでも閉じる",
        "ギガントマキア: 爆弾ダメージ45",
      ],
    },
  },
];
