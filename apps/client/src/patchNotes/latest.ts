import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.240",
    date: "2026-10-29",
    items: {
      ko: [
        "패왕전 새 대결 '점령전' (5대5, 밴픽): 점령 구역에 우리 편만 있으면 점령도가 오르고 100%가 되면 승리 · 쓰러지면 6초 뒤 집에서 다시 태어남 · 8분이 지나면 점령도가 높은 편이 승리",
        "점령전 경기장 3종: 네 갈래 회랑(양옆 방에서 통로 넷) · 낭떠러지 섬(가운데를 낭떠러지가 둘러싸 떨어지면 쓰러짐, 점프대로 건넘) · 원형 제단(위쪽 동그라미 구역)",
        "노랑 버프 자리: F를 누르고 3초 동안 가만히 있으면 40초 동안 공격력·공격 속도·이동 속도가 오르고 체력이 조금씩 참 · 먹으면 1분 뒤 다시 생김",
      ],
      en: [
        "New Champion Clash battle 'Capture' (5v5, with draft): while only your team stands in the zone your capture rises — reach 100% to win · fallen fighters respawn at home after 6s · after 8 minutes the team with more capture wins",
        "Three Capture arenas: Four-Way Hall (four corridors from the side rooms) · Cliff Island (a cliff surrounds the center — fall and you're down; cross with jump pads) · Ring Altar (a round zone at the top)",
        "Yellow buff spots: press F and hold still for 3s for 40s of extra damage, attack speed and move speed plus slow healing · respawns 1 minute after being taken",
      ],
      ja: [
        "覇王戦の新しい対決「占領戦」(5対5、バンピック): 占領区域に味方だけがいると占領度が上がり、100%で勝利 · 倒れると6秒後に拠点で復活 · 8分経つと占領度が高いチームの勝利",
        "占領戦の闘技場3種: 四つ筋の回廊（両側の部屋から通路が4本）· 断崖の島（中央を断崖が囲み、落ちると倒れる。ジャンプ台で渡る）· 円形の祭壇（上の丸い区域）",
        "黄色のバフ地点: Fを押して3秒じっとすると40秒間、攻撃力・攻撃速度・移動速度が上がり体力が少しずつ回復 · 取られると1分後に再出現",
      ],
    },
  },
  {
    version: "0.48.239",
    date: "2026-10-29",
    items: {
      ko: [
        "저주받은 주사위가 틀리면 어떤 저주가 걸렸는지 머리 위에 붉은 글자 (몬스터·보스 소환 / 최대 체력 44 / 패시브 모두 사라짐 / 맨손 + 몬스터) · 떨어진 신의 파편은 얻은 힘을 금빛 글자로",
        "능력치 창이 실제 계산과 늘 같게: 히든 아이템(신의 파편·금기된 아티팩트·운명/저주받은 주사위)·왕 변신이 더한 방어력·재생력·치명타·치명타 피해·예리함이 바로 보임 · 치명타는 실제 굴리는 값 그대로",
        "공격할 때만 곱해져 능력치 창에 안 보이던 공격 속도 (아티팩터 회로 폭주·잊혀진 자 강림·이드라 모습·닌자 그림자 질주·순례자 세계수 잎·이터 광분·펑크 신경 가속·학살자 분노·제우스 강림)와 공격력 (이드라 모습·사계절·학살자 낮은 체력·분노)이 능력치 창에 실시간으로",
        "안전망: 0.5초마다 능력치를 다시 계산해 쌓이는 힘·바뀐 상태가 늦게 들어가는 일이 없게",
      ],
      en: [
        "When the Cursed Dice misses, red text over your head says which curse hit (monsters or a boss / max HP 44 / all passives lost / bare hands + monsters) · the Fallen God's Shard shows the power you got in gold text",
        "The stats window now always matches the real numbers: defense, regen, crit, crit damage and sharpness from hidden items (God's Shard, Forbidden Artifacts, Dice of Fate/Cursed Dice) and the king form show right away · crit uses the exact values that are rolled",
        "Attack speed that was only applied when attacking (Artifacter Surge, Forgotten descent, Idra forms, Ninja Shadow Rush, Pilgrim World Leaf, Eater Frenzy, Punk neural boost, Slayer rage, Zeus descent) and damage (Idra forms and seasons, Slayer low HP and rage) now show live in the stats window",
        "Safety net: stats are recalculated every 0.5s so stacking powers and state changes never lag behind",
      ],
      ja: [
        "呪われたサイコロが外れると、どの呪いかを頭上に赤い文字で (モンスター・ボス召喚 / 最大体力44 / パッシブ全消失 / 素手 + モンスター) · 堕ちた神の欠片は得た力を金色の文字で",
        "ステータス画面が実際の計算と常に同じに: ヒドゥンアイテム (神の欠片・禁じられたアーティファクト・運命/呪われたサイコロ)・王の変身で増えた防御力・再生力・クリティカル・クリティカルダメージ・鋭さがすぐ表示 · クリティカルは実際に振る値そのまま",
        "攻撃時だけ掛かっていてステータス画面に出なかった攻撃速度 (アーティファクターの回路暴走・忘れられた者の降臨・イドラの姿・忍者の影走り・巡礼者の世界樹の葉・イーターの狂乱・パンクの神経加速・殺戮者の怒り・ゼウスの降臨) と攻撃力 (イドラの姿・四季・殺戮者の低体力・怒り) がリアルタイムで表示",
        "安全網: 0.5秒ごとに能力値を再計算し、積み上がる力や状態の変化が遅れて入ることがないように",
      ],
    },
  },
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
