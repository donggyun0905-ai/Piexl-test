import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.50.9",
    date: "2026-11-07",
    items: {
      ko: [
        "비르디아 공생 정령 개편: 버프형·동행형은 처치 20·50·100번에 유년기 → 성장기 → 성숙기 → 궁극체로 자라며 단계마다 효과가 다름 · 버프형은 상시가 아니라 20초마다 10초 켜짐 · 동행형 유년기는 고정 피해 1 (부엉이 성장기·성숙기는 깃털 날리기)",
        "도박형: 장난꾸러기 여우 → 구미호 (5번 키로 이 방 아이템 전부를 무작위로 바꿈, 상점·경매·악마의 방·히든 상점도, 가격은 그대로) · 새 정령 '욕심 많은 코인 정령' (아이템을 다 먹고 가치만큼 점수 → 5번 키로 100·300·500·700·900 단계만큼 상자)",
        "꾸러미형 이름: 보따리 정령 · 미믹 정령 · 돼지 정령 (도박형·꾸러미형은 처음부터 궁극체)",
        "달빛 표시: 달 하나가 스택마다 초승달 → 보름달로 바뀜",
        "연습장: 들어갈 때마다 정령 카드가 달라짐 · 새 '진영' 탭 (스킬 대기 초기화 · 진영 게이지 가득 · 바닥에 아이템 놓기 · 정령 카드 다시 뽑기·바로 고르기·자람 단계)",
      ],
      en: [
        "Virdia Symbiote rework: buff and companion spirits grow Child → Growth → Mature → Ultimate at 20/50/100 kills, with different effects per stage · buffs are no longer permanent: they run for 10s every 20s · companions deal a fixed 1 damage as Children (the Owl throws feathers at Growth and Mature)",
        "Gamble: Trickster Fox → Nine-Tailed Fox (key 5 rerolls every item in the room, including shops, auctions, devil rooms and hidden shops; prices stay) · new 'Greedy Coin Spirit' (eats every item for points by value → key 5 cashes out chests by tier 100/300/500/700/900)",
        "Bundle names: Bundle Spirit · Mimic Spirit · Piggy Spirit (gamble and bundle spirits start at Ultimate)",
        "Moonlight mark: a single moon now waxes from crescent to full with each stack",
        "Practice: spirit cards differ each time you enter · new 'Faction' tab (reset skill cooldowns · fill faction gauge · drop items · redraw/choose spirits · growth stage)",
      ],
      ja: [
        "ヴィルディア共生精霊の刷新：バフ型・同行型は20・50・100体撃破で幼年期→成長期→成熟期→究極体に育ち、段階ごとに効果が違う・バフ型は常時ではなく20秒ごとに10秒・同行型の幼年期は固定1ダメージ（フクロウの成長期・成熟期は羽根を飛ばす）",
        "ギャンブル型：いたずら狐→九尾の狐（5キーでこの部屋のアイテムを全部ランダムに入れ替え、ショップ・オークション・悪魔の部屋・隠しショップも、価格はそのまま）・新精霊「欲張りなコイン精霊」（アイテムを全部食べて価値分の点数→5キーで100・300・500・700・900の段階分の宝箱）",
        "包み型の名前：風呂敷の精霊・ミミックの精霊・ブタの精霊（ギャンブル型・包み型は最初から究極体）",
        "月光の表示：月ひとつがスタックごとに三日月→満月へ変わる",
        "練習場：入るたびに精霊カードが変わる・新しい「陣営」タブ（スキル待ち時間リセット・陣営ゲージ満タン・床にアイテム・精霊カードの引き直し・直接選ぶ・成長段階）",
      ],
    },
  },
  {
    version: "0.50.8",
    date: "2026-11-07",
    items: {
      ko: [
        "테라코어 특징 '과열' → '에너지': 적에게 피해를 줄 때·맞을 때 운동 에너지가 쌓임 (저절로 안 빠짐) · 30 이상에서 대시하면 모은 만큼 둘레로 터짐 · 과부하(공격 불가)와 열 피해 증가는 없앰 · 의사·기계공학자도 이제 에너지가 쌓임",
        "새 상태이상 '달빛' (최대 5스택, 5초): 적 체력 줄 위에 달이 초승달 → 상현달 → 반달 → 하현달 → 보름달로 차오름 · 걸린 적은 주는 피해 -20% · 맞을 때 스택만큼 확률(5·10·15·30·50%)로 약점 공격 = 받은 피해의 50%를 한 번 더 (흰 숫자 + 초승달 표시)",
        "블래스트 성흔 각성: 달빛 산탄 대신 모든 공격에 확정으로 달빛 · 월광 산탄은 달빛이 한 번에 1스택 더 · 각성 화면에서 달을 빼고 맵 아래에서 달빛이 은은하게 올라옴 (깃털은 그대로)",
        "긴 캐릭터 설명은 플레이 방식이 먼저 보이고 진영·별명·배경 이야기는 맨 끝 줄로",
      ],
      en: [
        "Terracore trait 'Heat' → 'Energy': dealing or taking damage stores kinetic Energy (never drains on its own) · dash at 30+ to release it around you, stronger the more you stored · Overload (can't attack) and the heat damage bonus are gone · Doctor and Engineer now build Energy too",
        "New status 'Moonlight' (up to 5 stacks, 5s): a moon above the foe's HP bar waxes crescent → first quarter → half → last quarter → full · afflicted foes deal 20% less damage · each hit has a stack-based chance (5/10/15/30/50%) of a Weak Point strike = 50% of the damage again (white number with a crescent)",
        "Blast's Stigma awakening: every attack now surely inflicts Moonlight instead of firing moon pellets · Lunar Buckshot adds 1 more stack per hit · the awakening screen no longer shows a moon; soft moonlight rises from the bottom of the map instead (feathers stay)",
        "Long character descriptions now show how they play first, with faction, title and backstory moved to the last line",
      ],
      ja: [
        "テラコアの特徴「過熱」→「エネルギー」：敵にダメージを与えたとき・受けたときに運動エネルギーが溜まる（自然には減らない）・30以上でダッシュすると溜めた分だけ周囲に爆発・過負荷（攻撃不可）と熱のダメージ上昇は廃止・医者と機械工学者もエネルギーが溜まるように",
        "新しい状態異常「月光」（最大5スタック、5秒）：敵の体力バーの上の月が三日月→上弦→半月→下弦→満月と満ちる・かかった敵は与ダメージ-20%・被弾時にスタックに応じた確率（5・10・15・30・50%）で弱点攻撃＝受けたダメージの50%をもう一度（白い数字＋三日月マーク）",
        "ブラストの聖痕覚醒：月光散弾の代わりにすべての攻撃に確定で月光・月光散弾は1回で1スタック多く・覚醒画面から月をなくし、マップの下から月光がほのかに立ちのぼる（羽根はそのまま）",
        "長いキャラ説明は遊び方が先に見え、陣営・異名・背景は最後の行に",
      ],
    },
  },
  {
    version: "0.50.7",
    date: "2026-11-07",
    items: {
      ko: ["설명 정리: 긴 설명은 한 줄씩 목록으로 · 캐릭터 설명 창은 핵심 3줄만 보이고 '자세히'로 펼침 · 아이템 말풍선은 Shift를 누르면 전체", "설명이 짧던 캐릭터 14명에 플레이 요령 한 줄 추가", "튜토리얼 마지막에 진영마다 공통 특징 안내"],
      en: ["Cleaner descriptions: long ones are shown line by line · character info shows the key 3 lines with 'More' to expand · hold Shift in item tooltips for the full text", "Added a play tip to 14 characters with short descriptions", "The tutorial's last step now introduces each faction's trait"],
      ja: ["説明の整理：長い説明は1行ずつリストに・キャラ説明は要点3行だけ表示し「詳しく」で展開・アイテムの吹き出しはShiftで全部表示", "説明が短かったキャラ14人にプレイのコツを1行追加", "チュートリアルの最後に陣営ごとの共通の特徴を案内"],
    },
  },
  {
    version: "0.50.6",
    date: "2026-11-07",
    items: {
      ko: ["방 안 장애물 다듬기: 안쪽 벽(벽돌 줄·그림자) · 돌기둥(입체·이음매·금·이끼) · 구덩이(깊이·윗턱 돌)", "지형 함정 다듬기: 진흙(윤기·동심원·돌) · 용암(식은 바위 테·떠다니는 껍질·거품) · 물(깊이·가장자리 거품·반짝임) · 가시(쇠 발판·못·그늘진 가시)"],
      en: ["Polished room obstacles: inner walls (bricks, shadows) · stone pillars (depth, seams, cracks, moss) · pits (depth, stone lip)", "Polished floor hazards: mud (sheen, ripples, stones) · lava (cooled rock rim, drifting crust, bubbles) · water (depth, foam edge, sparkles) · spikes (iron plate, rivets, shaded spikes)"],
      ja: ["部屋の障害物を改善：内壁（レンガ・影）・石柱（立体・継ぎ目・ひび・苔）・穴（深さ・縁の石）", "地形の罠を改善：泥（つや・波紋・石）・溶岩（冷えた岩の縁・漂う殻・泡）・水（深さ・縁の泡・きらめき）・トゲ（鉄板・鋲・陰のあるトゲ）"],
    },
  },
  {
    version: "0.50.5",
    date: "2026-11-07",
    items: {
      ko: [
        "비르디아 공생 정령 10종: 시작할 때 카드 3장 중 하나를 고름 (Esc로 숨겼다가 버튼으로 다시) · 처치 30번 꽃, 80번 나무로 자라며 세짐",
        "버프형: 햇살(피해 +10%·처치 시 공격 속도) · 꽃(계속 회복) · 가시(받는 피해 -12%·맞으면 가시 폭발)",
        "동행형: 숲늑대(달려가 물어뜯음) · 부엉이(날다가 급강하) · 이끼 골렘(땅을 내려찍어 묶음)",
        "도박형: 장난꾸러기 여우 (방 5개마다 바꾸기 → 앞의 아이템을 무기·패시브·히든·악마·사용 아이템 전부 중 하나로)",
        "꾸러미형: 보관(칸이 차도 사용 아이템을 넣어 두고 빈 칸 키로 꺼냄) · 상자(4개 주울 때마다 패시브 3개 중 고름) · 먹보(두고 온 아이템을 먹고 5개마다 새 패시브)",
      ],
      en: [
        "Virdia Symbiotes (10): pick 1 of 3 cards at the start (Esc hides it, a button reopens) · grows into a Bloom at 30 kills and a Tree at 80",
        "Buff: Sunbeam (+10% damage, attack speed on kills) · Blossom (steady healing) · Thorn (-12% damage taken, thorns burst when hit)",
        "Companion: Forest Wolf (runs in and bites) · Owl (circles and dives) · Moss Golem (slams and roots)",
        "Gamble: Trickster Fox (a swap every 5 rooms → turns the item in front of you into any weapon, passive, hidden, devil or usable item)",
        "Bundle: Storage (keeps usable items when slots are full, take them out with an empty slot key) · Chest (every 4 pickups, choose 1 of 3 passives) · Glutton (eats items left behind, a new passive every 5)",
      ],
      ja: [
        "ヴィルディア共生精霊10種：開始時にカード3枚から1枚を選ぶ（Escで隠してボタンで再表示）・30体撃破で花、80体で樹に育ち強くなる",
        "バフ型：陽だまり（ダメージ+10%・撃破で攻撃速度）・花（持続回復）・棘（被ダメージ-12%・被弾で棘が弾ける）",
        "同行型：森の狼（駆け寄って噛みつく）・フクロウ（飛び回り急降下）・苔のゴーレム（地面を叩いて拘束）",
        "ギャンブル型：いたずら狐（5部屋ごとに入れ替え→目の前のアイテムを武器・パッシブ・隠し・悪魔・使用アイテム全部の中から1つに）",
        "包み型：保管（枠が埋まっても使用アイテムをしまい空き枠のキーで取り出す）・宝箱（4つ拾うごとにパッシブ3つから選ぶ）・食いしん坊（置いてきたアイテムを食べ5つごとに新しいパッシブ）",
      ],
    },
  },
];
