import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.363",
    date: "2026-11-03",
    items: {
      ko: ["수집가 검격 이펙트가 겹쳐 보이던 것 고침: 칼날을 한 줄로만 그림(잔상·바깥 빛 겹침 없앰) · 다음 공격이 나가면 앞 칼날은 바로 사라짐", "스켈레톤 궁병: 선이 굳은 뒤 레이저처럼 선 전체에 피해를 주던 것을 진짜 화살 한 발이 매우 빠르게 날아가는 것으로 바꿈 (선에서 비키면 안 맞음)"],
      en: ["Fixed the Collector's blade arcs looking stacked: each arc is now a single blade (no offset shadow or outer glow layer) · the previous arc vanishes as soon as the next attack starts", "Skeleton Archer: instead of a laser-like hit along the whole locked line, it now fires a single very fast arrow along that line (step off the line to dodge)"],
      ja: ["コレクターの斬撃エフェクトが重なって見えていたのを修正：刃を一本だけで描画（残像・外側の光の重なりを削除）· 次の攻撃が出ると前の刃はすぐ消える", "スケルトン弓兵：線が固まった後、レーザーのように線全体にダメージを与えていたのを、本物の矢が一本とても速く飛ぶように変更（線から外れれば当たらない）"],
    },
  },
  {
    version: "0.48.362",
    date: "2026-11-03",
    items: {
      ko: [
        "수집가 콤보를 격투가처럼: 공격할 때마다 한 칸씩 기본 검 → 얻은 차례대로 수집 무기 → 다시 기본 검 · 1초 쉬면 처음부터 · 발밑에 콤보 단계 점 (지나온 칸은 그 무기 색, 10칸마다 한 줄 아래)",
        "수집가 검격 끝에 붙던 짧은 빗금 파편 이펙트를 없앰",
      ],
      en: [
        "Collector combo now works like the Brawler's: each attack fires the next step — blade → collectibles in the order obtained → blade again · pause 1s and it restarts · combo dots under his feet (done steps glow in each weapon's color, a new row every 10)",
        "Removed the short slash-mark shards at the end of the Collector's blade arcs",
      ],
      ja: [
        "コレクターのコンボを格闘家のように：攻撃するたびに一段ずつ基本の剣 → 手に入れた順に収集武器 → また基本の剣 · 1秒休むと最初から · 足元にコンボ段階の点（済んだ段はその武器の色、10段ごとに一行下）",
        "コレクターの斬撃の先に付いていた短い斜線の破片エフェクトを削除",
      ],
    },
  },
  {
    version: "0.48.361",
    date: "2026-11-03",
    items: {
      ko: [
        "수집가 수집 무기 30개 공격을 하나하나 다시 만듦 (빛나는 칼날·흰 가장자리·어두운 잔상·파편 이펙트, 무기 색): 성검 검격 · 피의 검 X자 · 서리 검 내려찍기+얼음 가시 · 태양 검 한 바퀴 · 공허의 검 큰 반원 · 사슬 큰칼 더 큰 부채꼴 · 붉은 카타나 칼선 4연속 · 태양 빛기둥 · 블랙홀 · 덩굴 묶기",
        "수집가 원거리: 흰 날개 활 유도 화살 셋 · 얼음 활 갈라지는 얼음 화살 · 황금 활 거대한 마력 화살 · 석궁 출혈 · 쌍열 권총 산탄+반동 · 별의 마법서 유도 별빛 여덟 · 눈의 마법서 모았다가 레이저",
        "수집가 근접: 황금 건틀릿 거대한 주먹+뒤 충격파 · 어둠의 발톱 두 번 할퀴기 · 푸른 창 바닥 찍고 지르기 · 붉은 창 검격+찌르기 · 얼음 창 10연 찌르기 · 황금 창 찌르기+검격 · 돌 망치 느린 강타 · 피의 망치·푸른 도끼 날아가는 칼날 · 붉은 도끼 3연타 · 해골 낫 3방향 · 쌍월 되돌아오는 칼날 둘+검격 두 번",
      ],
      en: [
        "Every one of the Collector's 30 weapons now has its own attack (glowing blades with white edges, dark afterimages and shards, in each weapon's color): Holy Sword slash · Blood Sword X · Frost Sword slam + ice spikes · Sun Sword spin · Void Sword huge half-circle · Chain Cleaver wider fan · Crimson Katana 4 needle cuts · sun pillar · black hole · binding vines",
        "Collector ranged: White Wing Bow 3 homing arrows · Ice Bow splitting ice arrows · Golden Bow giant mana arrow · Crossbow bleed · Twin-Barrel Pistol shotgun + recoil · Star Tome 8 homing starlights · Eye Tome charged laser",
        "Collector melee: Golden Gauntlet giant fist + shockwave behind · Shadow Claw double rake · Azure Spear ground strike then thrust · Crimson Spear slash + thrust · Ice Spear 10 thrusts · Golden Spear thrust + slash · Stone Hammer slow smash · Blood Hammer and Azure Axe flying blades · Crimson Axe triple swing · Skull Scythe 3 reaps · Twin Crescent 2 returning blades + 2 slashes",
      ],
      ja: [
        "コレクターの収集武器30の攻撃を一つずつ作り直し（輝く刃・白い縁・暗い残像・破片のエフェクト、武器の色）：聖剣の斬撃 · 血の剣X字 · 霜の剣叩きつけ+氷の棘 · 太陽の剣一回転 · 虚空の剣大きな半円 · 鎖の大鉈さらに広い扇 · 紅の刀の刀線4連 · 太陽の光柱 · ブラックホール · 蔦の拘束",
        "コレクター遠距離：白翼の弓追尾矢3本 · 氷の弓分かれる氷の矢 · 黄金の弓巨大な魔力の矢 · クロスボウ出血 · 二連拳銃散弾+反動 · 星の魔導書追尾する星明かり8つ · 瞳の魔導書溜めてレーザー",
        "コレクター近接：黄金の籠手巨大な拳+後ろの衝撃波 · 闇の鉤爪二回引っかき · 蒼の槍地面突き→突き · 紅の槍斬撃+突き · 氷の槍十連突き · 黄金の槍突き+斬撃 · 石の大槌ゆっくり強打 · 血の大槌・蒼の斧飛ぶ刃 · 紅の斧三連 · 髑髏の鎌三方向 · 双月の刃戻る刃2つ+斬撃2回",
      ],
    },
  },
  {
    version: "0.48.360",
    date: "2026-11-03",
    items: {
      ko: [
        "수집가 콤보 다시 만듦: 무기가 방에 박히던 것을 없애고, 공격 한 번에 기본 검 → 모은 무기 전부가 짧은 간격(0.08초)으로 이어지는 콤보 (끝나면 공격 대기)",
        "수집가 무기마다 다른 공격: 검은 둘레를 한 바퀴 · 낫은 크게 쓸기 · 망치·큰칼은 떨어져 내리찍기 · 카타나는 발도 · 지팡이는 떠올라 마법(빛기둥·소용돌이·덩굴) · 활·석궁·총은 나타나 쏨 · 창·쌍월은 던짐 · 별이 떨어짐 · 빛줄기 · 거대한 주먹 · X자 할퀴기 · 도끼가 둘레를 돎 (그 무기 그림이 직접 날아 나와 공격)",
        "수집가 기본 검 이펙트가 여러 겹으로 겹쳐 보이던 것을 깔끔한 한 줄로 고침",
      ],
      en: [
        "Collector combo reworked: weapons no longer stick in the room; one attack chains the blade and every collected weapon at short intervals (0.08s), then the attack cooldown",
        "Each Collector weapon attacks differently: swords whirl around you · the scythe reaps wide · hammers and the cleaver drop and slam · the katana draws · staves rise and cast (light pillar, vortex, vines) · bows, crossbow and pistol appear and shoot · spears and the crescent are thrown · stars fall · a beam · a giant fist · X claws · axes circle you (the weapon itself flies out to attack)",
        "Fixed the Collector's blade effect looking stacked several times; it is now a single clean arc",
      ],
      ja: [
        "コレクターのコンボを作り直し：武器が部屋に刺さる仕組みをなくし、一回の攻撃で基本の剣 → 集めた武器すべてが短い間隔（0.08秒）で続くコンボに（終われば攻撃待ち）",
        "コレクターの武器ごとに違う攻撃：剣は周りを一周 · 鎌は大きく薙ぐ · 大槌・大鉈は落ちて叩きつけ · 刀は抜刀 · 杖は浮かんで魔法（光の柱・渦・蔦）· 弓・クロスボウ・銃は現れて撃つ · 槍・双月は投げる · 星が降る · 光線 · 巨大な拳 · X字の引っかき · 斧が周りを回る（その武器自体が飛び出して攻撃）",
        "コレクターの基本の剣のエフェクトが何重にも重なって見えたのを、すっきり一本に修正",
      ],
    },
  },
];
