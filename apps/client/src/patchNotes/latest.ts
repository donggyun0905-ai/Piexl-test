import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.129",
    date: "2026-10-27",
    items: {
      ko: [
        "변희 동물 능력 새로: 든 동물로 사냥하면 그 동물 경험치가 참 (일반 적 3 · 보스 20, 발밑 막대) · 100이 되면 그 동물 전용 능력 하나를 얻음 · 상점·보물방에서는 기본 아이템만 나옴 · 얻은 능력은 무기를 바꿔도 남음",
        "각성: 방어력 +20 · 공격 속도 +25% 추가 · 배·가슴에 동물마다 상징 색 갑옷 · 한 번 각성한 동물의 기술은 다른 동물을 들어도 계속 나옴 · 태양 불사조 각성 기술은 둘레 큰 열기 (안의 적에게 불꽃 x1~x5, 겹칠수록 센 화상)",
        "캐릭터 설명에 변희 각성 기술 목록",
      ],
      en: [
        "Byeonhui abilities reworked: hunting as an animal fills that animal's XP (3 per foe · 20 per boss, bar at her feet) · at 100 she gains one of its own abilities · shops and treasure rooms give only basic items · abilities stay when she switches weapons",
        "Awakening now also gives +20 defense and +25% attack speed, with chest armor in each animal's own color · awakened skills keep firing even as other animals · Sun Phoenix's skill is now a great heat around her (flames stack x1–x5 on foes inside, hotter burns as they stack)",
        "Byeonhui's awakened skills are listed in her character guide",
      ],
      ja: [
        "ビョンヒの動物能力を一新：持った動物で狩るとその動物の経験値が溜まる（通常の敵3 · ボス20、足元のバー）· 100でその動物の専用能力を一つ得る · ショップ・宝部屋は基本アイテムのみ · 得た能力は武器を替えても残る",
        "覚醒：防御力+20 · 攻撃速度+25%を追加 · 胸・腹に動物ごとの象徴色の鎧 · 一度覚醒した動物の技は別の動物でも出続ける · 太陽の不死鳥の覚醒技は周りに大きな熱気（中の敵に炎x1〜x5、重なるほど強い火傷）",
        "キャラ説明にビョンヒの覚醒技一覧",
      ],
    },
  },
  {
    version: "0.48.128",
    date: "2026-10-27",
    items: {
      ko: [
        "원소술사 손보기: 원소마다 상태이상 (불 화상 · 물 둔화 · 땅 기절 · 번개 감전 · 풀 독) · 행성도 하나씩 상태이상",
        "빛 구슬 30% 확률로 빛 폭발 · 은하수 안에 머문 적은 스택이 쌓여 100이면 빅뱅 · 중력은 내려찍은 자리에 두 번째 중력 · 강철 구슬 피해 +40% · 트리거 구슬 +1 확률 30% → 50%",
        "웨폰 마스터: 칼끝이 적을 향하는 진짜 검 5자루, 셋은 휘어지며 날아가 적을 쫓고 둘은 몸 둘레를 지키며 붙은 적을 벰 · 갓 핸드 모습 새로",
      ],
      en: [
        "Elementalist rework: each element inflicts a status (fire burn · water slow · earth stun · lightning shock · grass poison) · every planet now has a status too",
        "Light Orbs 30% chance to burst · foes staying inside the Milky Way build stacks and trigger a Big Bang at 100 · Gravity leaves a second gravity on the slam spot · Steel Orbs +40% damage · Trigger +1 orb chance 30% → 50%",
        "Blade Lord: 5 real swords with tips turned toward foes; 3 curve out to chase enemies, 2 guard your body and cut foes that close in · new God Hand look",
      ],
      ja: [
        "元素術師の見直し：元素ごとに状態異常（火は火傷 · 水は鈍化 · 土は気絶 · 雷は感電 · 草は毒）· 惑星にもそれぞれ状態異常",
        "光の珠は30%で光が弾ける · 天の川の中に留まった敵はスタックが溜まり100でビッグバン · 重力は叩きつけた場所に2つ目の重力 · 鋼の珠ダメージ+40% · トリガーの珠+1確率30% → 50%",
        "ウェポンマスター：切っ先が敵を向く本物の剣5本、3本は弧を描いて飛び敵を追い、2本は体の周りを守り近づいた敵を斬る · ゴッドハンドの見た目を一新",
      ],
    },
  },
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
