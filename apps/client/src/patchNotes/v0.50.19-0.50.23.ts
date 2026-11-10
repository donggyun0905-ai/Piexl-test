import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.50.23",
    date: "2026-11-08",
    items: {
      ko: ["헬피스트 이펙트 정리: 1타 후리기의 네모 주먹 그림 뺌 (붉은 궤적만) · 각성 중 허공검격 때 나와 적을 잇던 선 뺌"],
      en: ["Hellfist effects tidied: removed the square fist from the Hook (red trail only) · removed the line linking you to foes during Air Slash"],
      ja: ["ヘルフィストのエフェクト整理：1打目 振り抜きの四角い拳の絵を削除（赤い軌跡のみ）· 覚醒中の虚空剣撃で自分と敵をつないでいた線を削除"],
    },
  },
  {
    version: "0.50.22",
    date: "2026-11-08",
    items: {
      ko: ["헬피스트 3타 균열 파쇄 이펙트를 새 그림으로: 갈라진 땅 자리에서 붉게 빛나는 금이 뻗고 붉은 유리 조각으로 깨져 흩어짐 (사용자 그림)"],
      en: ["Hellfist's Shatter effect redrawn: glowing red cracks spread over the cracked ground and burst into red glass shards (user artwork)"],
      ja: ["ヘルフィストの3打目 亀裂破砕のエフェクトを新しい絵に：割れた地面の位置で赤く光る亀裂が伸び、赤いガラスの破片に砕け散る（ユーザーの絵）"],
    },
  },
  {
    version: "0.50.21",
    date: "2026-11-08",
    items: {
      ko: [
        "헬피스트 공격 바꿈: 1타 주먹 후리기 (부채꼴로 휘두르는 주먹 궤적) → 2타 내려찍기 (땅이 폭발 범위만큼 넓게 여러 갈래로 점점 벌어지며 갈라지고 2.5초 남음) → 3타 균열 파쇄 (갈라진 땅이 붉은 유리처럼 깨지며 그 위 적 160%)",
        "허공 긁기 → 허공검격으로 이름 바꿈 · 성흔이 가득 찬 적혈 각성 중에만 기본 공격이 모두 허공검격 (검지로 가리킨 적 자리에 안쪽 검고 테두리 붉은 X자 검격, 사용자 그림)",
      ],
      en: [
        "Hellfist attacks reworked: 1 Hook (a fist swung across a fan) → 2 Slam (the ground cracks wide across the blast area, many cracks spreading open over time, and stays for 2.5s) → 3 Shatter (the cracked ground breaks like red glass, 160% to foes on it)",
        "Air Claw renamed Air Slash · now only during Crimson Awakening, when every basic attack becomes Air Slash (an X slash, black inside with a red rim, where the pointed foe stands)",
      ],
      ja: [
        "ヘルフィストの攻撃を変更：1打目 拳の振り抜き（扇形に振る拳の軌跡）→ 2打目 叩きつけ（地面が爆発範囲ほど広く何筋にも徐々に開きながら割れ、2.5秒残る）→ 3打目 亀裂破砕（割れた地面が赤いガラスのように砕け、その上の敵に160%）",
        "虚空掻き → 虚空剣撃に改名 · 聖痕が満ちた赤血覚醒中のみ通常攻撃が全て虚空剣撃（指した敵の位置に内側が黒く縁が赤いX字の斬撃）",
      ],
    },
  },
  {
    version: "0.50.20",
    date: "2026-11-08",
    items: {
      ko: ["좌우 모습 고침: 블래스트 대시 · 시저스 공격 · 헬피스트 공격(평소·악마화 모습)이 반대쪽을 보던 것"],
      en: ["Facing fixes: Blast's dash, Scissors' attack and Hellfist's attack (normal and demonized forms) no longer face the wrong way"],
      ja: ["左右の向きを修正：ブラストのダッシュ・シザーズの攻撃・ヘルフィストの攻撃（通常・悪魔化の姿）が逆を向いていたのを修正"],
    },
  },
  {
    version: "0.50.19",
    date: "2026-11-08",
    items: {
      ko: ["헬피스트 캐릭터 그림: 흰 머리·검은 코트·붉은 악마 팔 (서기·공격·걷기·맞음·쓰러짐·대시) · 적혈 각성 중에는 뿔이 돋고 온몸이 붉은 악마화 모습으로 바뀜", "블래스트·네일러·시저스가 가만히 서 있을 때 왼쪽·오른쪽 모습이 반대로 보이던 것 고침"],
      en: ["Hellfist character art: white hair, black coat and a red demon arm (stand, attack, walk, hit, down, dash) · during Crimson Awakening he turns into a horned, crimson demonized form", "Fixed Blast, Nailer and Scissors facing the wrong way when standing still left or right"],
      ja: ["ヘルフィストのキャラ絵：白い髪・黒いコート・赤い悪魔の腕（立ち・攻撃・歩き・被弾・ダウン・ダッシュ）· 赤血覚醒中は角が生え全身が赤い悪魔化の姿に変わる", "ブラスト・ネイラー・シザーズが立ち止まった時に左右の向きが逆だったのを修正"],
    },
  },
];
