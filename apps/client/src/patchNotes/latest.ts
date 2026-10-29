import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
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
  {
    version: "0.48.234",
    date: "2026-10-29",
    items: {
      ko: [
        "히든 캐릭터 '몰락한 왕': 악의 사도로 영혼 10,000개를 모으면 해금 (로비 전시장 기록집에서 진행 확인) · 푸른 불꽃이 일렁이는 검은·푸른 갑옷의 거인, 붉은 츠바이핸더를 어깨에 걸침 · 콤보: X자 두 번 베기 → 가로로 길어지는 검기 → 검을 내리꽂으면 푸른 불꽃 선이 적에게 이어져 점화선처럼 타고 가 거대한 불기둥 · 쓰러뜨린 적의 영혼이 잘게 쪼개져 빛줄기로 들어와 공격력·체력 + (왼쪽 위 영혼 스택) · 전용 아이템 10",
      ],
      en: [
        "Hidden character 'Fallen King': unlocked by gathering 10,000 souls as the Apostle (check progress in the lobby hall record book) · a giant in black and blue armor flickering with blue flame, a red zweihänder on his shoulder · combo: two X slashes → a widening sword wave → plant the blade and blue flame lines race to foes like fuses into giant fire pillars · souls of the fallen shatter and stream into him for damage and HP (soul stack, top left) · 10 own items",
      ],
      ja: [
        "ヒドゥンキャラ「没落した王」: 悪の使徒で魂を10,000個集めると解放 (ロビー展示場の記録集で進み具合を確認) · 青い炎が揺らめく黒と青の鎧の巨人、赤いツヴァイヘンダーを肩に担ぐ · コンボ: X字の二連斬り → 横に伸びる剣気 → 剣を突き立てると青い炎の線が敵へつながり導火線のように走って巨大な火柱 · 倒した敵の魂が細かく砕けて光の筋で入り攻撃力・体力+ (左上の魂スタック) · 専用アイテム10",
      ],
    },
  },
  {
    version: "0.48.233",
    date: "2026-10-29",
    items: {
      ko: [
        "히든 아이템 넷 완성 (차원의 순례자 히든 상점에 나옴): 바스러져가는 왕관 — 그 방에서 한 번 거인만 한 옛 제국의 왕으로 변신 (붉은 츠바이핸더 · 체력 1000·공격력 100·방어력 30·재생력 50·치명타 50%·치명타 피해 300%·사거리 90, 능력치 창도 왕으로) · 대검 콤보: X자 두 번 베기 → 가로로 길어지는 검기 → 내리꽂으면 불꽃 선이 적에게 이어져 거대한 불기둥 · 방을 나가면 원래대로",
        "순례자의 월계선: 무작위 히든 캐릭터가 동료로 와서 같이 싸움 · 거짓된 용사(패시브): 풋내기 동료 (레벨이 오르면 능력치를 무작위로 고름, 쓰러지면 다음 층에 다시) · 동료는 체력이 있고 가까이 가서 F = 내 회복약 먹이기",
        "큐피트의 정령: 정령사의 대정령 열 중 하나가 곁에 와서 정령사처럼 몇 초마다 큰 기술",
      ],
      en: [
        "Four hidden items finished (sold by the Dimensional Pilgrim): Crumbling Crown — once in that room, become a giant king of the old empire (red zweihänder · 1000 HP, 100 damage, 30 defense, 50 regen, 50% crit, 300% crit damage, 90 range; the stats window shows the king) · greatsword combo: two X slashes → a sword wave that widens → plant the blade and flame lines race to foes for giant fire pillars · back to normal when you leave the room",
        "Pilgrim's Laurel Ark: a random hidden character joins you as an ally · False Hero (passive): a Novice ally (picks random stats on level-up; returns next floor if downed) · allies have HP — get close and press F to feed them your potion",
        "Cupid's Spirit: one of the Spiritist's ten great spirits joins you and casts its big skill every few seconds",
      ],
      ja: [
        "ヒドゥンアイテム4つ完成 (次元の巡礼者のヒドゥンショップ): 崩れゆく王冠 — その部屋で一度、巨人ほどの古き帝国の王に変身 (赤いツヴァイヘンダー · 体力1000・攻撃力100・防御力30・再生力50・クリティカル50%・クリティカルダメージ300%・射程90、ステータス画面も王に) · 大剣コンボ: X字の二連斬り → 横に伸びる剣気 → 突き立てると炎の線が敵へつながり巨大な火柱 · 部屋を出ると元どおり",
        "巡礼者の月桂船: ランダムなヒドゥンキャラが仲間として一緒に戦う · 偽りの勇者 (パッシブ): 新米の仲間 (レベルアップで能力をランダムに選ぶ、倒れたら次の階でまた) · 仲間には体力があり、近づいてF = 自分の回復薬を飲ませる",
        "キューピッドの精霊: 精霊使いの大精霊10体のうち1体がそばに来て、精霊使いのように数秒ごとに大技",
      ],
    },
  },
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
