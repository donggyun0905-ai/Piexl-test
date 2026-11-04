import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.10",
    date: "2026-11-04",
    items: {
      ko: [
        "새 캐릭터 레오(아스칼론, 영물): 이마에 보석이 박힌 뇌전의 사자 · 뇌전 발톱 하나로 번갈아 할퀴고 세 번째마다 번개 물기 · 맞힌 적에 뇌인 · 전하가 차면 사자후로 방 안 모든 적에게 낙뢰 · 보석이 몇 초마다 가장 먼 적에게 낙뢰 · 전용 아이템 10 (번개 갈기·천뢰 보석·우레 포효·뇌광 도약·연쇄 뇌전·뇌운·사자의 긍지·번개 송곳니·황금 갑주·백수의 왕)",
        "풍류사 분신술: 분신이 옆에 붙어 따라 쓰지 않고, 저마다 다른 적을 찾아 따로 돌아다니며 제 박자로 글자를 씀",
      ],
      en: [
        "New character Leo (Ascalon, Spirit Beast): a thunder lion with a gem in his brow · rakes with his Thunder Claws and bites with lightning every third strike · hits leave Thunder Marks · full charge unleashes Lion's Roar, striking every foe in the room · the gem strikes the farthest foe every few seconds · 10 exclusive items",
        "Pungryu Clone Art: clones no longer just copy your letters at your side — each roams to its own target and writes on its own rhythm",
      ],
      ja: [
        "新キャラ レオ（アスカロン、霊獣）：額に宝石が埋まった雷電の獅子 · 雷電の爪で交互に引っかき3回目ごとに雷の噛みつき · 当てた敵に雷印 · 電荷が満ちると獅子吼で部屋の全ての敵に落雷 · 宝石が数秒ごとに一番遠い敵に落雷 · 専用アイテム10",
        "風流士の分身術：分身が横で真似して書くのではなく、それぞれ別の敵を追って動き回り自分のリズムで文字を書く",
      ],
    },
  },
  {
    version: "0.49.9",
    date: "2026-11-04",
    items: {
      ko: ["숨은 시련 '죽음의 바다': 숨 게이지가 캐릭터 뒤에 가려지던 것을 고쳐, 캐릭터 위 체력 줄 바로 위에 보이게 함"],
      en: ["Hidden trial 'Sea of Death': the breath gauge no longer hides behind your character and now sits right above your health bar"],
      ja: ["隠し試練「死の海」: 息ゲージがキャラクターの後ろに隠れていたのを直し、頭上の体力バーのすぐ上に表示"],
    },
  },
  {
    version: "0.49.8",
    date: "2026-11-04",
    items: {
      ko: ["빌드 세트 설명: 브라우저 기본 툴팁 대신 패시브 설명과 같은 말풍선으로 뜸 (꼬리표 칩 · 단계마다 필요한 수와 효과 · 켜진 단계는 꼬리표 색 · 지금 수와 다음 단계까지) · 모바일은 눌러서 열고 닫음"],
      en: ["Build set details: now shown in the same tooltip as passives instead of the browser's plain tooltip (tag chip · count and effect per tier · active tiers in the tag color · current count and how many to the next tier) · tap to open/close on mobile"],
      ja: ["ビルドセットの説明：ブラウザ標準のツールチップではなくパッシブ説明と同じ吹き出しで表示（タグチップ・段階ごとの必要数と効果・達成した段階はタグの色・今の数と次の段階まで）・モバイルはタップで開閉"],
    },
  },
  {
    version: "0.49.7",
    date: "2026-11-04",
    items: {
      ko: [
        "풍류사 분신술: 분신이 먹으로 그린 듯 새까만 모습으로 나옴 (둘레 먹 번짐 · 발밑 먹 웅덩이 · 떨어지는 먹물)",
        "풍류사 이펙트 다듬기: 글자탄에 먹 붓질 꼬리·빛 · 구절 완성 때 바닥 금빛 문양과 네 글자 · 하늘 기둥 내리꽂기·땅 기둥 솟음과 갈라짐 · 굵은 물결과 흰 물마루 · 명검 거궐이 큰 검기 초승달로 그어짐 · 찬바람·뜨거운 바람 초승달 · 금빛 거두기 · 서리 결정 · 축지 먹 붓질 · 먹 터짐",
      ],
      en: [
        "Pungryu Clone Art: clones now look painted in ink — pitch black with ink wisps, an ink puddle and dripping ink",
        "Pungryu effects polished: ink-brush tails and glow on letters · golden floor rune and four glyphs on a verse · heaven pillar strikes down, earth pillar bursts up with cracks · thick waves with white crests · Geogwol cleaves with huge sword-qi crescents · cold/hot wind crescents · golden reaping · frost crystals · ink-stroke teleport · ink splashes",
      ],
      ja: [
        "風流士の分身術：分身が墨で描いたような真っ黒な姿に（周りの墨のにじみ・足元の墨だまり・垂れる墨）",
        "風流士のエフェクト調整：文字弾に墨の筆跡の尾と光・句の完成で床の金色の紋様と四文字・天の柱が降り注ぎ地の柱が割れて立ち上がる・太い波と白い波頭・名剣巨闕が大きな剣気の三日月で斬る・冷たい風／熱い風の三日月・金色の刈り取り・霜の結晶・縮地の墨の一筆・墨の飛沫",
      ],
    },
  },
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
];
