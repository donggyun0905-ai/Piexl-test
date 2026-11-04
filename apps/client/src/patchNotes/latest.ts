import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.6",
    date: "2026-11-04",
    items: {
      ko: [
        "대장간: 화덕은 왼쪽 벽, 연장·무기 걸이는 오른쪽 벽으로 옮겨 위쪽 출구 문이 잘 보임",
        "쇠사슬 간수: 사슬에 맞으면 천천히 끌려가지 않고 사슬을 따라 간수 앞까지 한 번에 끌려감",
        "오토마타: 자매 인형이 새 진홍빛 자매 인형 그림으로 나옴",
        "연습장 '방': 숨은 시련 5종(하이오크 부락 · 어둠의 세계 · 공성전 · 안개숲 · 죽음의 바다)을 바로 시작해 볼 수 있음 · '보통 방으로'를 누르면 끝남",
      ],
      en: [
        "Forge: the hearth moved to the left wall and the tool/weapon racks to the right wall, so the exit doors up top are easy to see",
        "Chain Warden: getting hit by the chain now yanks you straight to the warden instead of pulling you slowly",
        "Automata: the sister dolls now use the new crimson sister-doll art",
        "Practice 'Rooms': start any of the 5 Hidden Trials (High Orc Village · World of Darkness · Siege · Misty Forest · Sea of Death) right away · 'Back to normal' ends it",
      ],
      ja: [
        "鍛冶場：炉を左の壁、道具・武器掛けを右の壁に移し、上の出口の扉が見やすくなった",
        "鎖の看守：鎖に当たるとゆっくり引かれるのではなく、鎖に沿って看守の前まで一気に引き寄せられる",
        "オートマタ：姉妹人形が新しい真紅の姉妹人形の絵で登場",
        "練習場「部屋」：隠れた試練5種（ハイオークの集落・闇の世界・攻城戦・霧の森・死の海）をすぐ始められる・「普通の部屋に」で終了",
      ],
    },
  },
  {
    version: "0.49.5",
    date: "2026-11-04",
    items: {
      ko: ["잔영: 대시가 더 멀리 감 (대시 시간 9틱 → 15틱, 같은 빠르기) · 대시 무적도 그만큼 길어져 대시가 끝날 때 딱 끝남"],
      en: ["Remnant: dash goes farther (9 → 15 ticks at the same speed) · dash invulnerability lasts exactly as long as the dash"],
      ja: ["残影：ダッシュがより遠くへ（9ティック → 15ティック、同じ速さ）・ダッシュ無敵もその分長くなり、ダッシュの終わりとぴったり一緒に終わる"],
    },
  },
  {
    version: "0.49.4",
    date: "2026-11-04",
    items: {
      ko: ["잔영: 적 탄(원거리 공격)과 보스 기술(전갈 꼬리·괴조 급강하·개구리 혀·선장 갈고리·하데스 밀쳐내기·원형 파동·구역 닫기·가디언 휘두르기 등)을 대시로 피해도 회피 슬로우모션이 발동"],
      en: ["Remnant: dodging enemy shots (ranged attacks) and boss moves (scorpion sting, roc dive, toad tongue, captain's hook, Hades repel, ring waves, closing zones, guardian swings and more) with a dash now triggers the dodge slow-motion"],
      ja: ["残影：敵弾（遠距離攻撃）やボスの技（サソリの尾・怪鳥の急降下・カエルの舌・船長の鉤・ハデスの押し返し・円形の波動・区域閉鎖・ガーディアンの振り回しなど）をダッシュで避けても回避スローモーションが発動"],
    },
  },
  {
    version: "0.49.3",
    date: "2026-11-04",
    items: {
      ko: [
        "새 캐릭터 풍류사 (아스칼론): 늘 구름을 타고 다니는 의적 선비 · 큰 붓으로 천자문 글자를 써서 날림 · 글자 네 개를 쓰면 구절 완성 → 무기마다 큰 마법 · 2초 동안 쓰지 않으면 구절은 처음부터 · 발밑 네 칸에 쓴 글자 표시",
        "구름 타기: 지형·지속 피해 절반 · 천자문 무기 10 (천지현황 · 우주홍황 · 일월영측 · 진수열장 · 한래서왕 · 추수동장 · 운등치우 · 노결위상 · 금생여수 · 검호거궐)",
        "전용 아이템 10: 축지법(순간이동 대시) · 분신술 · 둔갑술 · 의적 주머니 · 오색 구름 · 먹물 붓 · 서당 개 삼 년 · 풍류 피리 · 천자문 책 · 활빈당 깃발 · 패왕전 스킬 4 · 해금: 이동 속도 2 달성",
      ],
      en: [
        "New character Pungryu (Ascalon): a scholar-outlaw who always rides a cloud · writes characters from the Thousand Character Classic with a giant brush and hurls them · every 4 letters complete a verse and unleash the weapon's great spell · stop for 2s and the verse restarts · four boxes under his feet show the letters written",
        "Cloud riding: half terrain and damage-over-time hurt · 10 verse weapons (Heaven Dark, Earth Gold · Vast Cosmos · Sun and Moon · Spread Stars · Cold Comes, Heat Goes · Autumn Harvest · Rising Clouds · Dew Turns Frost · Gold in the River · Sword Named Geogwol)",
        "10 exclusive items: Earth-Folding Step (teleport dash) · Clone Art · Shape-Shift · Outlaw's Pouch · Five-Color Cloud · Ink Brush · Three Years at School · Wandering Flute · Thousand Character Book · Banner of the Poor's Friends · 4 Champion Clash skills · unlock: reach 2 move speed",
      ],
      ja: [
        "新キャラ風流士（アスカロン）：いつも雲に乗って歩く義賊の書生・大きな筆で千字文の文字を書いて飛ばす・文字4つで句が完成 → 武器ごとの大きな魔法・2秒書かないと句は最初から・足元の4マスに書いた文字を表示",
        "雲に乗る：地形・持続ダメージ半分・千字文の武器10（天地玄黄・宇宙洪荒・日月盈昃・辰宿列張・寒来暑往・秋収冬蔵・雲騰致雨・露結為霜・金生麗水・剣号巨闕）",
        "専用アイテム10：縮地法（瞬間移動ダッシュ）・分身術・遁甲術・義賊の巾着・五色の雲・墨の筆・門前の小僧・風流の笛・千字文の書・活貧党の旗・覇王戦スキル4・解放：移動速度2達成",
      ],
    },
  },
  {
    version: "0.49.2",
    date: "2026-11-05",
    items: {
      ko: ["대장간 암흑 강화: 실패해서 무기가 부서지면 처음 무기가 새로 생기지 않고 맨손이 됨"],
      en: ["Forge dark upgrade: when it fails and the weapon shatters, you're now bare-handed instead of getting a fresh starting weapon"],
      ja: ["鍛冶場の暗黒強化：失敗して武器が壊れると、最初の武器が新しく出るのではなく素手になる"],
    },
  },
  {
    version: "0.49.1",
    date: "2026-11-05",
    items: {
      ko: ["노선도로 정한 길: 방을 정리해도 저절로 넘어가지 않고 '다음 방으로 이동할까요?' 안내가 뜸 → F(모바일은 상호작용 버튼)를 눌러야 이동 · 아이템 옆이거나 싸우는 동안은 안내가 뜨지 않아 방해하지 않음"],
      en: ["Planned route: clearing a room no longer moves you on automatically — a 'Move to the next room?' prompt appears and you press F (interact button on mobile) to go · no prompt while next to items or in combat"],
      ja: ["ルートマップで決めた道：部屋をクリアしても自動では進まず「次の部屋へ移動しますか？」と表示 → F（モバイルはアクションボタン）で移動・アイテムのそばや戦闘中は表示されず邪魔しない"],
    },
  },
  {
    version: "0.49.0",
    date: "2026-11-04",
    items: {
      ko: ["빌드 업데이트 묶음 (0.48.378~0.48.383): 패시브 꼬리표 15종 · 세트 효과 2·4·6개 · 각성 증강 8개 · 보상 편향 · 성좌 증강 꼬리표 · 대장간 — 이제부터 큰 기능 묶음마다 가운데 숫자가 올라감"],
      en: ["Build update bundle (0.48.378–0.48.383): 15 passive tags · 2/4/6 set bonuses · 8-tag awakenings · reward bias · constellation augment tags · the Forge — from now on the middle number goes up with each major feature bundle"],
      ja: ["ビルドアップデートまとめ（0.48.378〜0.48.383）：パッシブタグ15種・セット効果2・4・6個・覚醒増強8個・報酬の偏り・星座増強タグ・鍛冶場 — 今後は大きな機能のまとまりごとに真ん中の数字が上がります"],
    },
  },
  {
    version: "0.48.383",
    date: "2026-11-04",
    items: {
      ko: ["대장간: 새로 그린 드워프 대장장이가 모루에서 망치질 (들기 → 내려치기 → 불똥)"],
      en: ["Forge: a newly drawn dwarf blacksmith hammers at the anvil (raise → strike → sparks)"],
      ja: ["鍛冶場：新しく描いたドワーフの鍛冶屋が金床でハンマーを振るう（振り上げ → 打ち下ろし → 火花）"],
    },
  },
  {
    version: "0.48.382",
    date: "2026-11-04",
    items: {
      ko: [
        "새 특별한 방 '대장간': 2층부터 층마다 60%로 나옴 · 불타는 화덕과 연장이 걸린 방, 가운데 모루 옆 대장장이 앞에서 F",
        "무기 강화: +0→+1은 100%, 단계마다 10%씩 낮아져 최저 20% · 실패하면 한 단계 떨어짐 · 단계마다 무기 피해 +8% (최대 +10)",
        "꼬리표 변환: 무기·패시브 하나를 원하는 꼬리표로 (대장간마다 처음 1번 무료, 그다음은 점점 비쌈) · 무기에 붙인 꼬리표도 세트에 들어감",
        "암흑 강화: 50% · 성공하면 무기 피해 +16% · 실패하면 무기가 부서져 처음 무기로",
        "강화·꼬리표는 그 무기에만 남음 · 장비 줄 무기 이름 옆에 노란 별(강화)·보라 별(암흑 강화) 표시",
      ],
      en: [
        "New special room 'Forge': 60% per floor from floor 2 · a room with a blazing hearth and hanging tools — press F at the blacksmith beside the anvil",
        "Weapon upgrade: +0→+1 is 100%, 10% lower each level down to 20% · failure drops a level · +8% weapon damage per level (max +10)",
        "Tag reforge: set a weapon or passive to any tag (first one free at each forge, then pricier) · weapon tags count toward sets too",
        "Dark upgrade: 50% · success gives +16% weapon damage · failure shatters the weapon and you get your starting weapon",
        "Upgrades and tags stay on that weapon · yellow star (upgrade) and purple star (dark) next to the weapon name",
      ],
      ja: [
        "新しい特別な部屋「鍛冶場」：2階から各階60%で出現・燃える炉と道具が掛かった部屋、中央の金床のそばの鍛冶屋の前でF",
        "武器強化：+0→+1は100%、段階ごとに10%下がり最低20%・失敗すると1段階下がる・段階ごとに武器ダメージ+8%（最大+10）",
        "タグ変換：武器・パッシブ1つを好きなタグに（鍛冶場ごとに最初の1回無料、その後は高くなる）・武器に付けたタグもセットに入る",
        "暗黒強化：50%・成功で武器ダメージ+16%・失敗すると武器が壊れ最初の武器に",
        "強化・タグはその武器にだけ残る・装備欄の武器名の横に黄色い星（強化）・紫の星（暗黒強化）",
      ],
    },
  },
  {
    version: "0.48.381",
    date: "2026-11-04",
    items: {
      ko: [
        "각성 증강: 같은 꼬리표를 8개 모으면 그 꼬리표의 각성 기술이 저절로 나감 (15종) — 얼음 서리바람(둥근 범위에 얼음 결정이 눈처럼 내림) · 불 유성우 · 번개 뇌신의 사슬 · 독 역병 꽃 · 빛 성광 · 어둠 심연 · 죽음 사신의 낫 · 대지 지각 분쇄 · 물 해일 · 날카로움 천검 · 단단함 강철 요새 · 바람 대회오리 · 행운 황금 소나기 · 소환 정령 군단 · 피 핏빛 달",
        "빌드 세트 칸: 8개를 모으면 ✦ 표시와 '각성!' 알림 · 마우스를 올리면 각성 기술 설명",
        "끝없는 시련: 사용 아이템을 못 쓰는 동안 아이템 칸에 빨간 ✕",
        "수집가: 공격 이펙트가 거꾸로 재생되던 것을 고침 (피의 활 화살이 활에서 뻗어 나감)",
      ],
      en: [
        "Awakening: collect 8 of the same tag and that tag's awakening skill fires on its own (15 kinds) — Ice Frost Gale (ice crystals fall like snow in a circle) · Fire Meteor Rain · Lightning Thunder Chain · Poison Plague Bloom · Light Holy Radiance · Dark Abyss · Death Reaper's Scythe · Earth Crust Breaker · Water Tidal Wave · Sharp Thousand Blades · Sturdy Steel Bastion · Wind Great Cyclone · Luck Golden Shower · Summon Spirit Legion · Blood Blood Moon",
        "Build sets: 8 of a tag shows ✦ and an 'awakened!' banner · hover for the awakening skill",
        "Endless trial: a red ✕ on the item slots while use items are blocked",
        "Collector: attack effects no longer play backwards (Blood Bow arrows now shoot out from the bow)",
      ],
      ja: [
        "覚醒増強：同じタグを8個集めるとそのタグの覚醒技が自動で発動（15種）— 氷 霜風（丸い範囲に氷の結晶が雪のように降る）・火 流星雨・雷 雷神の鎖・毒 疫病の花・光 聖光・闇 深淵・死 死神の鎌・大地 地殻粉砕・水 津波・鋭さ 千剣・頑丈 鋼鉄の要塞・風 大竜巻・幸運 黄金の雨・召喚 精霊の軍団・血 血の月",
        "ビルドセット欄：8個集めると✦表示と「覚醒！」通知・カーソルを合わせると覚醒技の説明",
        "終わりなき試練：使用アイテムが使えない間はアイテム欄に赤い✕",
        "収集家：攻撃エフェクトが逆再生されていたのを修正（血の弓の矢が弓から伸びる）",
      ],
    },
  },
];
