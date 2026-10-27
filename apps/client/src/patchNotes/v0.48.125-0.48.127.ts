import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.127",
    date: "2026-10-27",
    items: {
      ko: [
        "마법사 새 특징 '마법 문양': 무기 공격은 일반 공격(피해 75%), 공격할 때마다 발밑 마법진에 한 획씩 새겨지고 6획이 차면 무기에 맞는 큰 마법이 가까운 적에게 떨어짐 (불꽃 폭발·번개 줄기·얼음·혜성·별비·공허) · 전보다 강해짐",
        "시간술사 '시간 붕괴': 잔상에 맞을 때마다 적 머리 위 시계 표식이 쌓이고, 5개가 되면 시계가 금 가며 깨져 공격력 400% (둘레 적에게도 절반)",
      ],
      en: [
        "Mage's new trait 'Magic Runes': weapon attacks are basic attacks (75% damage); each one carves a stroke into the circle at your feet, and at 6 strokes a big spell matching your weapon lands on the nearest foe (fire nova, lightning, frost, comet, starfall, void) · stronger than before",
        "Chronomancer 'Time Collapse': each afterimage hit stacks a clock mark over the foe; at 5 the clock cracks and shatters for 400% damage (half to foes nearby)",
      ],
      ja: [
        "魔法使いの新しい特徴「魔法紋様」：武器の攻撃は通常攻撃（ダメージ75%）、攻撃するたびに足元の魔法陣に一画ずつ刻まれ、6画で武器に合った大魔法が近くの敵に落ちる（炎の爆発・雷・氷・彗星・星の雨・虚空）· 以前より強く",
        "時間術師「時間崩壊」：残像に当たるたびに敵の頭上に時計の印が溜まり、5つでひび割れて砕け攻撃力400%（周りの敵にも半分）",
      ],
    },
  },
  {
    version: "0.48.126",
    date: "2026-10-27",
    items: {
      ko: [
        "격투가 가라테 새로: 정권 지르기(주먹 끝에서 범위) 두 번 → 보호막 20(쌓이지 않음) + 앞차기 → 큰 정권 지르기 + 큰 범위 · 쌍광연격·택견 빼고 다른 무기 공격력 +15%",
        "야수: 무기를 바꾸면 '한 마리 더'로 늘린 고양이가 계속 사라졌다 생기던 문제 고침 (그림자 발 등)",
        "펑크: 신경 가속 중에는 무기와 따로 퀵 해킹이 가까운 적 둘을 감전시킴 (0.3초마다 공격력 70%)",
        "능력치 창: 공격력·공격 속도·초당 피해가 지금 걸린 효과(공격 속도 버프·라이더 빠르기 등)까지 실시간으로 보임",
      ],
      en: [
        "Brawler Karate remade: straight punch (burst at the fist) twice → 20 shield (doesn't stack) + front kick → heavy straight punch + big burst · all other weapons except Twin Light Barrage and Taekkyon +15% damage",
        "Beastkin: fixed extra cats from 'One More Cat' vanishing and respawning after switching weapons (Shadow Paw etc.)",
        "Punk: during Neural Accel, a separate Quick Hack zaps the 2 nearest foes alongside the weapon (70% damage every 0.3s)",
        "Stats panel: damage, attack speed and DPS now update live with active effects (attack speed buffs, Rider speed, etc.)",
      ],
      ja: [
        "格闘家の空手を一新：正拳突き（拳の先で範囲）2回 → シールド20（重ならない）＋前蹴り → 大きな正拳突き＋大きな範囲 · 双光連撃・テッキョン以外の武器の攻撃力+15%",
        "獣人：武器を替えると「もう一匹」で増やした猫が消えては現れ続けた問題を修正（影の肉球など）",
        "パンク：神経加速中は武器とは別にクイックハックが近くの敵2体を感電させる（0.3秒ごとに攻撃力70%）",
        "能力値画面：攻撃力・攻撃速度・秒間ダメージがかかっている効果（攻撃速度バフ・ライダーの速さなど）までリアルタイムで表示",
      ],
    },
  },
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
];
