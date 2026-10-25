import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.45.17",
    date: "2026-10-21",
    items: {
      ko: ["기계공학자 추가 강화: 모든 무기 피해 +25% (기본 레이저 초당 피해 31 → 39), 사거리 +15% (기본 레이저 90 → 103)"],
      en: ["Engineer buffed again: all weapons deal +25% damage (base laser 31 → 39 damage per second) and have +15% range (base laser 90 → 103)"],
      ja: ["エンジニアをさらに強化：全武器のダメージ+25%（基本レーザーの毎秒ダメージ 31 → 39）、射程+15%（基本レーザー 90 → 103）"],
    },
  },
  {
    version: "0.45.16",
    date: "2026-10-21",
    items: {
      ko: [
        "기계공학자 강화: 모든 무기 피해 +40% (기본 레이저 초당 피해 22 → 31), 최대 체력 85 → 100",
        "기계공학자 전용 아이템 수치 올림: 고출력 렌즈 피해 +10% · 빔 스플리터 빔 피해 -10% · 열폭발 120% · 집속 코일 최대 +50% · 굴절 프리즘 50% · 냉각 시스템 공격 속도 +10% · 과부하 방출 200% · 에너지 회수 보호막 4 · 장갑 용해 최대 +20% · 오버클럭 +20%",
      ],
      en: [
        "Engineer buff: all weapons deal +40% damage (base laser 22 → 31 damage per second), max health 85 → 100",
        "Engineer items raised: High-Power Lens +10% damage · Beam Splitter beams -10% · Heat Buildup blast 120% · Focus Coil up to +50% · Refraction Prism 50% · Cooling System +10% attack speed · Overload Discharge 200% · Energy Recovery 4 shield · Armor Melt up to +20% · Overclock +20%",
      ],
      ja: [
        "エンジニア強化：全武器のダメージ+40%（基本レーザーの毎秒ダメージ 22 → 31）、最大体力 85 → 100",
        "エンジニア専用アイテムの数値アップ：高出力レンズ ダメージ+10% · ビームスプリッター ビーム-10% · 熱爆発120% · 集束コイル最大+50% · 屈折プリズム50% · 冷却システム攻撃速度+10% · 過負荷放出200% · エネルギー回収シールド4 · 装甲溶解最大+20% · オーバークロック+20%",
      ],
    },
  },
  {
    version: "0.45.15",
    date: "2026-10-21",
    items: {
      ko: [
        "라스트 보스 궁극기: 기절·위압·얼음 시계 중이어도 체력 10% 아래면 궁극기를 쓰고, 궁극기 동안에도 멈추지 않습니다",
        "라스트 보스는 한 번에 큰 피해를 받아도 궁극기를 쓰기 전에는 쓰러지지 않습니다",
      ],
      en: [
        "Final boss ultimates: they now trigger below 10% health even while stunned, feared or frozen by the Frost Clock, and are not paused during the ultimate",
        "Final bosses can no longer be killed by one huge hit before using their ultimate",
      ],
      ja: [
        "ラストボスの奥義：気絶·威圧·氷の時計の間でも体力10%以下なら奥義を使い、奥義中も止まりません",
        "ラストボスは一度に大ダメージを受けても、奥義を使う前には倒れません",
      ],
    },
  },
  {
    version: "0.45.14",
    date: "2026-10-21",
    items: {
      ko: ["거너 드론 무기: 드론이 최대 10대에서 5대로 줄었습니다"],
      en: ["Gunner's Drones weapon: the drone limit is lowered from 10 to 5"],
      ja: ["ガンナーのドローン武器：ドローンの上限が10機から5機になりました"],
    },
  },
  {
    version: "0.45.13",
    date: "2026-10-21",
    items: {
      ko: ["쌍광연격: 3타 찌르기 길이와 별 크기가 내 공격 범위를 따라갑니다 (공격 범위가 넓어질수록 더 멀리·크게, 가까운 적은 꿰뚫고 공격 범위 끝까지)"],
      en: ["Twin Light Barrage: the third-hit thrust length and the star size now follow your attack range (the wider your range, the farther and bigger; it thrusts through nearby enemies to the edge of your range)"],
      ja: ["双光連撃：3打目の突きの長さと星の大きさが自分の攻撃範囲に合わせて変わります（攻撃範囲が広いほど遠く·大きく、近くの敵は貫いて攻撃範囲の端まで）"],
    },
  },
  {
    version: "0.45.12",
    date: "2026-10-21",
    items: {
      ko: [
        "격투가 쌍광연격: 3타 찌르기가 적 바로 뒤에서 멈추지 않고 공격 범위 반대편 끝까지 나갑니다",
        "쌍광연격: 콤보를 5번 연속으로 마치면, 공격 범위 원 위 다섯 점을 찌르기로 이어 별을 그리며 공격합니다 (그동안 무적)",
      ],
      en: [
        "Brawler's Twin Light Barrage: the third-hit thrust no longer stops right behind the enemy; it goes all the way to the far edge of your attack range",
        "Twin Light Barrage: finishing 5 combos in a row links five points on your range circle with thrusts, drawing a star (invulnerable meanwhile)",
      ],
      ja: [
        "格闘家の双光連撃：3打目の突きが敵のすぐ後ろで止まらず、攻撃範囲の反対側の端まで進みます",
        "双光連撃：コンボを5回連続で決めると、攻撃範囲の円上の5点を突きでつないで星を描きながら攻撃します（その間無敵）",
      ],
    },
  },
  {
    version: "0.45.11",
    date: "2026-10-21",
    items: {
      ko: ["거너 특수용병: NOW!가 다음 콤보 단계가 나가기 직전 0.3초에만 뜹니다. NOW!가 아닐 때 스페이스를 누르면 대시가 나가고 가진 보호막이 바로 사라지며, 그 텀의 기회도 날아갑니다"],
      en: ["Gunner's Special Merc: NOW! appears only in the 0.3s right before the next combo step. Pressing Space outside NOW! dashes, instantly drops your shield and wastes that gap's chance"],
      ja: ["ガンナーの特殊傭兵：NOW!は次のコンボ段階が出る直前の0.3秒だけ出ます。NOW!以外でスペースを押すとダッシュが出て、持っているシールドがすぐ消え、その合間のチャンスもなくなります"],
    },
  },
  {
    version: "0.45.10",
    date: "2026-10-21",
    items: {
      ko: ["거너 특수용병: NOW! 동안 스페이스를 누르면 대시가 나가지 않고 보호막만 생깁니다"],
      en: ["Gunner's Special Merc: pressing Space during NOW! no longer dashes, it only grants the shield"],
      ja: ["ガンナーの特殊傭兵：NOW!の間にスペースを押すとダッシュせず、シールドだけが付きます"],
    },
  },
  {
    version: "0.45.9",
    date: "2026-10-21",
    items: {
      ko: ["거너 특수용병: NOW! 표시가 콤보마다 색이 다릅니다 (1콤보 뒤 빨강 · 2 노랑 · 3 초록 · 마무리 뒤 파랑), 막 뜰 때 크게 보입니다"],
      en: ["Gunner's Special Merc: the NOW! cue changes color per combo step (red, yellow, green, then blue after the finisher) and pops larger as it appears"],
      ja: ["ガンナーの特殊傭兵：NOW!の表示がコンボごとに色が変わり（1の後 赤 · 2 黄 · 3 緑 · 締めの後 青）、出た瞬間は大きく見えます"],
    },
  },
  {
    version: "0.45.8",
    date: "2026-10-21",
    items: {
      ko: ["거너 특수용병: 텀 보호막이 1초만 유지됩니다 (더 어려운 컨트롤)"],
      en: ["Gunner's Special Merc: the gap shield now lasts only 1s (harder control)"],
      ja: ["ガンナーの特殊傭兵：合間のシールドが1秒だけ持続します（より難しい操作）"],
    },
  },
  {
    version: "0.45.7",
    date: "2026-10-21",
    items: {
      ko: ["거너 특수용병: 스페이스를 누르면 보호막이 생기는 타이밍에 머리 위에 \"NOW!\"가 뜨고, 성공하면 1콤보 뒤 \"팅\" · 2콤보 뒤 \"탕\" · 3콤보 뒤 \"펑\" 소리가 납니다 (실패하면 소리 없음)"],
      en: ["Gunner's Special Merc: \"NOW!\" appears above your head while Space would grant the shield, and a success plays a \"ting\", \"bang\" or \"boom\" after combo step 1, 2 or 3 (no sound on a miss)"],
      ja: ["ガンナーの特殊傭兵：スペースでシールドが付くタイミングに頭上に「NOW!」が出て、成功するとコンボ1の後「チン」 · 2の後「タン」 · 3の後「ドン」と鳴ります（失敗すると音なし）"],
    },
  },
  {
    version: "0.45.6",
    date: "2026-10-21",
    items: {
      ko: ["거너 특수용병: 공격 속도가 빨라지고, 콤보 단계 사이 텀에 스페이스(대시)를 누르면 보호막 20이 생깁니다 (텀마다 한 번, 2초)"],
      en: ["Gunner's Special Merc: faster attacks, and pressing Space (dash) in the gap between combo steps grants a 20 shield (once per gap, 2s)"],
      ja: ["ガンナーの特殊傭兵：攻撃速度が上がり、コンボの合間にスペース（ダッシュ）を押すとシールド20が付きます（合間ごとに1回、2秒）"],
    },
  },
];
