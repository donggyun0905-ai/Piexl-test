import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.265",
    date: "2026-10-31",
    items: {
      ko: ["고해상도 그림 시범 2: 마법사를 손으로 찍은 몸 틀로 다시 그림 (더 귀여운 얼굴·큰 눈·볼 홍조·얼굴을 감싸는 옆머리 · 뒷모습 V자 머리끝과 리본 · 옆얼굴)"],
      en: ["High-res art trial 2: the Mage redrawn on a hand-pixeled body template (cuter face, big eyes, blush, side locks framing the face · V-tipped hair and ribbon from behind · side profile)"],
      ja: ["高解像度の試作2: 魔法使いを手打ちの体テンプレートで描き直し（よりかわいい顔・大きな瞳・頬の赤み・顔を包む横髪 · 後ろ姿のV字の毛先とリボン · 横顔）"],
    },
  },
  {
    version: "0.48.264",
    date: "2026-10-30",
    items: {
      ko: [
        "고해상도 그림 시범: 마법사(별빛 마법사)를 2배 촘촘한 그림으로 새로 그림 (큰 눈·결이 보이는 은빛 머리·명암·금 장식·수정 지팡이)",
        "고해상도 그림 시범: 1층 보스 강철 거구를 2배 촘촘하게 새로 그림 (용광로 심장·성난 눈·어깨 가시·굴뚝 연기) · 걷기·공격 준비(주먹을 머리 위로)·내려찍기(불티) 그림",
      ],
      en: [
        "High-res art trial: the Mage (Starlight Mage) redrawn at twice the detail (big eyes, strand-lit silver hair, shading, gold trim, crystal staff)",
        "High-res art trial: floor 1 boss Iron Hulk redrawn at twice the detail (furnace heart, angry eyes, shoulder spikes, chimney smoke) · walk, wind-up (fists overhead) and slam (sparks) frames",
      ],
      ja: [
        "高解像度の試作: 魔法使い（星光の魔法使い）を2倍細かい絵で描き直し（大きな瞳・毛筋の見える銀髪・陰影・金の飾り・水晶の杖）",
        "高解像度の試作: 1階ボス鋼鉄の巨躯を2倍細かく描き直し（溶鉱炉の心臓・怒った目・肩の棘・煙突の煙）· 歩き・攻撃準備（拳を頭上に）・叩きつけ（火花）の絵",
      ],
    },
  },
  {
    version: "0.48.263",
    date: "2026-10-30",
    items: {
      ko: [
        "돈 주머니: 사용 아이템 칸이 꽉 차도 닿으면 바로 돈이 됨 · 상점에서는 더 이상 팔지 않음",
        "몬스터가 더 많이 나옴 (방이 커진 만큼) · 주황 방(강한 적 방): 몬스터 +4·체력 더 높음 · 가장 센 몬스터 2마리 이상이 정예(붉은 기운·체력 2.5배·더 큼)",
        "영약이 회복약보다 드물게 나옴 · 사용 아이템 칸에 마우스를 올리면 효과 설명",
        "빛의 사도: 평타가 발사체 대신 사거리(45) 안 가장 가까운 적 자리에 작은 '+' 빛이 생겨 벰 · 세 번째 공격의 빛의 검(그림)은 사거리 2.5배 안 · 은총의 옷자락: 더 큰 빛의 검 넷이 몸 둘레를 떠다님 · 먼 빛: 사거리 +15",
        "몰락한 왕: 보통 캐릭터 크기로 (대검은 비율대로 크게)",
        "보스: 공격할 때 몸을 젖히고 내지르는 공격 동작과 베기 궤적",
        "괴력난신 10% 원기옥: 대시해야 하는 순간 화면이 붉게 점멸",
        "땅 물고기: 뛰어오른 동안 벽·장애물을 지나 내려앉을 자리까지 감 · 내려앉을 자리는 갈 수 있는 땅만 · 그 전에 쓰러뜨리면 공격 표시도 사라짐",
        "관리자 연습장: 숨은·한정 캐릭터도 고를 수 있음",
      ],
      en: [
        "Money Bag: picked up and turned into gold instantly even with full item slots · no longer sold in shops",
        "More monsters per room (rooms are bigger) · orange (elite) rooms: +4 monsters, more HP · the 2+ strongest become champions (red aura, 2.5× HP, larger)",
        "Elixirs are rarer than potions · hover a use-item slot to see its effect",
        "Apostle of Light: basic attacks now form a small '+' of light on the nearest foe within range (45) instead of firing · third-attack light swords reach 2.5× range · Hem of Grace: four larger light swords float around her · Distant Light: +15 range",
        "Fallen King: normal character size (the greatsword stays big in proportion)",
        "Bosses: lean-back and lunge attack motions with slash trails",
        "Demigod 10% spirit bomb: the screen flashes red at the moment to dash",
        "Land Fish: while leaping it passes over walls and obstacles to its landing spot · lands only on walkable ground · killing it first cancels the attack marker",
        "Admin practice: hidden and limited characters can be picked",
      ],
      ja: [
        "お金袋: アイテム枠がいっぱいでも触れるとすぐお金に · ショップでは売らなくなった",
        "モンスターが増えた（部屋が広くなった分）· オレンジの部屋（強敵部屋）: モンスター+4・体力アップ · 最も強い2体以上が精鋭（赤いオーラ・体力2.5倍・大きい）",
        "霊薬が回復薬より出にくく · 使用アイテム枠にマウスを乗せると効果説明",
        "光の使徒: 通常攻撃は弾の代わりに射程(45)内の一番近い敵の位置に小さな「+」の光が生まれて斬る · 3回目の攻撃の光の剣は射程2.5倍内 · 恩寵の裾: 大きな光の剣4本が体のまわりを漂う · 遠い光: 射程+15",
        "堕ちた王: 普通のキャラの大きさに（大剣は比率通り大きく）",
        "ボス: 攻撃時に身を反らして突き出す動作と斬撃の軌跡",
        "怪力乱神10%の元気玉: ダッシュすべき瞬間に画面が赤く点滅",
        "地の魚: 跳んでいる間は壁や障害物を越えて着地点まで行く · 着地点は歩ける地面だけ · その前に倒すと攻撃表示も消える",
        "管理者の練習場: 隠し・限定キャラも選べる",
      ],
    },
  },
  {
    version: "0.48.262",
    date: "2026-10-30",
    items: {
      ko: [
        "빛의 사도: 성장(빛의 조각 6개마다)하면 2배 촘촘한 그림으로 바뀜 · 큰 눈·빛나는 눈동자·볼 홍조·얼굴선을 감싸는 옆머리",
        "빛의 사도: 턱을 짧고 둥글게 다시 그림",
        "빛의 사도: 성장하는 순간 화면 가운데 띠에 빛의 사도 일러스트가 미끄러져 들어오는 연출",
      ],
      en: [
        "Apostle of Light: after each growth (every 6 Shards) she uses a twice-as-detailed sprite · larger shining eyes · blush · side locks framing the face",
        "Apostle of Light: shorter, rounder chin",
        "Apostle of Light: on growth, a banner slides across the screen with her illustration",
      ],
      ja: [
        "光の使徒: 成長（光のかけら6個ごと）すると2倍細かい絵に · 大きく輝く瞳・頬の赤み・顔まわりを包む横髪",
        "光の使徒: あごを短く丸く描き直し",
        "光の使徒: 成長の瞬間、画面中央の帯に光の使徒のイラストが滑り込む演出",
      ],
    },
  },
  {
    version: "0.48.261",
    date: "2026-10-30",
    items: {
      ko: [
        "빛의 사도: '+' 빛의 검을 새로 그린 픽셀 그림으로 바꿈 · 얼굴을 더 갸름하게 (V자 턱)",
        "은총의 옷자락: 최대 체력 +30 대신 → 빛의 검이 1.5배 넓은 곳까지 생기고 한 번에 5개 더 · 머리 위에 빛의 검 날개 두 개 (한 판에 하나)",
        "꿰뚫는 빛: 칼날이 한 명 더 뚫음 대신 → 빛의 검이 생긴 자리에 붉은(안쪽 흰) 빛의 검이 엇갈려 한 번 더 꿰뚫음 (피해 ×0.8)",
      ],
      en: [
        "Apostle of Light: '+' light swords now use new pixel art · slimmer face (V-shaped chin)",
        "Hem of Grace: instead of +30 max HP → light swords form 1.5× farther and 5 more each time · two light-sword wings above her head (one per run)",
        "Piercing Light: instead of piercing one more foe → a crimson (white-cored) light sword pierces again, crossed, where each light sword formed (damage ×0.8)",
      ],
      ja: [
        "光の使徒: 「+」の光の剣を新しいドット絵に · 顔をよりほっそり（V字のあご）",
        "恩寵の裾: 最大体力+30の代わりに → 光の剣が1.5倍広い範囲まで生まれ、1回につき5本多く · 頭上に光の剣の翼が2本（1回のプレイで1つ）",
        "貫く光: 刃が1体多く貫く代わりに → 光の剣が生まれた場所に紅（内側は白）の光の剣が交差してもう一度貫く（ダメージ×0.8）",
      ],
    },
  },
];
