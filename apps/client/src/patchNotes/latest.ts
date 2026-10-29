import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.238",
    date: "2026-10-29",
    items: {
      ko: ["몰락한 왕·옛 제국의 왕 뒷모습: 손잡이·날밑은 몸에 가려지고 어깨 위로 칼날만 보이게"],
      en: ["Fallen King and the Old Empire King from behind: the hilt and guard are hidden by the body, only the blade shows over the shoulder"],
      ja: ["没落した王・古き帝国の王の後ろ姿: 柄と鍔は体に隠れ、肩の上に刃だけが見えるように"],
    },
  },
  {
    version: "0.48.237",
    date: "2026-10-29",
    items: {
      ko: ["몰락한 왕·옛 제국의 왕(바스러져가는 왕관): 앞·옆에서 볼 때 붉은 대검을 오른손에 쥐고 어깨에 기대 몸 앞으로 보이게", "도트 편집 페이지(/pixel/) 창작 공간: 16·32·96·128·256·512·1024·2048칸 등 크기를 마음대로 정한 빈 그림판에 직접 그리기 · 칸 나누기(캐릭터 시트처럼 여러 장) · 이 기기에 자동 저장 · PNG 내려받기 · 큰 그림판은 더 굵은 붓과 확대·축소"],
      en: ["Fallen King and the Old Empire King (Crumbling Crown): seen from the front or side, the red greatsword is now held in the right hand and rests on the shoulder in front of the body", "Pixel editor (/pixel/) Creative Space: draw on a blank canvas of any size (16, 32, 96, 128, 256, 512, 1024, 2048…) · split into frames like a character sheet · auto-saved on this device · download as PNG · bigger brushes and zoom for large canvases"],
      ja: ["没落した王・古き帝国の王 (崩れゆく王冠): 前・横から見ると赤い大剣を右手に持ち肩に担いで体の前に見えるように", "ドット編集ページ (/pixel/) 創作スペース: 16・32・96・128・256・512・1024・2048など好きな大きさの白紙に直接描く · コマ分け (キャラシートのように複数枚) · この端末に自動保存 · PNGダウンロード · 大きな画面は太いブラシと拡大・縮小"],
    },
  },
  {
    version: "0.48.236",
    date: "2026-10-29",
    items: {
      ko: ["몰락한 왕 그림 새로: 가시가 돋은 겹겹의 검은 판금 갑옷 · 가시 왕관과 그늘진 얼굴에 빛나는 푸른 눈 · 머리 위와 어깨·갑옷 마디마다 타오르는 푸른 불꽃 · 찢어진 검은 망토 · 검은 날에 붉게 빛나는 날 끝과 룬이 새겨진 거대한 츠바이핸더 (공격하면 땅에 내리꽂음) · 몸 둘레에 푸른 불빛과 불티"],
      en: ["Fallen King redrawn: layered spiked black plate armor · a spiked crown over a shadowed face with glowing blue eyes · blue flames over his head, shoulders and every armor joint · a torn black cape · a giant zweihänder with a black blade, glowing red edges and runes (planted into the ground when he attacks) · blue glow and embers around him"],
      ja: ["没落した王の絵を描き直し: 棘の生えた重なる黒い板金鎧 · 棘の王冠と影の顔に光る青い目 · 頭上と肩・鎧の継ぎ目ごとに燃える青い炎 · 破れた黒いマント · 黒い刃に赤く光る刃先とルーンの巨大なツヴァイヘンダー (攻撃すると地面に突き立てる) · 体の周りに青い光と火の粉"],
    },
  },
  {
    version: "0.48.235",
    date: "2026-10-29",
    items: {
      ko: [
        "패왕전 사용 아이템 수치를 던전과 따로 (폭탄 피해 20 · 회복약 · 명약 · 수호부)",
        "관리자 페이지: 값마다 한국어 설명 (코드에 적힌 설명을 그대로 보여 줌, 영어 이름은 작게) · 탭마다 무엇을 바꾸는 곳인지 설명 · 칸을 카드로 크게 · 찾기에 설명도 · 패왕전 '사용 아이템' 탭 · 대결 방식 수치 · 히든 아이템·광야의 새벽·금기·로비 펫·추적자 부품·지형 수치도 바꿀 수 있게",
      ],
      en: [
        "Paewang now has its own use-item values, separate from the dungeon (bomb damage 20 · potion · elixir · ward)",
        "Admin page: a Korean description for every value (taken from the code comments; code names shown small) · a note on what each tab changes · bigger card cells · search covers descriptions · Paewang 'Use items' tab · match-mode values · hidden items, Dawn of the Wilds, taboos, lobby pets, tracker parts and terrain values are now editable",
      ],
      ja: [
        "覇王戦の使用アイテムの数値をダンジョンと別に (爆弾ダメージ20 · 回復薬 · 霊薬 · 守護符)",
        "管理者ページ: 値ごとに韓国語の説明 (コードの説明をそのまま表示、英語名は小さく) · タブごとに何を変える所かの説明 · セルをカードで大きく · 検索に説明も · 覇王戦「使用アイテム」タブ · 対戦方式の数値 · ヒドゥンアイテム・荒野の夜明け・禁忌・ロビーペット・追跡者パーツ・地形の数値も変更可能に",
      ],
    },
  },
];
