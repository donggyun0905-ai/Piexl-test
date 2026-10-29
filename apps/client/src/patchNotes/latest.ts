import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.242",
    date: "2026-10-30",
    items: {
      ko: [
        "패왕전 새 대결 '전쟁의 서막' (5대5, 밴픽): 아스칼론 진영과 엘프 진영의 전쟁 · 큰 네모 들판에 길 셋(위·가운데 대각선·아래), 길마다 편마다 포탑 둘 · 레벨·돈·집 상점·증강은 쟁탈전과 같음",
        "체크포인트 (윗길 왼쪽 위 귀퉁이 · 가운데 · 아랫길 오른쪽 아래 귀퉁이): 그 길 상대 맨 앞 포탑을 부숴야 점령할 수 있고, 점령하면 집에서 그곳으로 순간이동 · 다시 빼앗을 수 있음",
        "물가(왼쪽 위에서 오른쪽 아래로 흐르는 띠)는 늘 느려짐 · 안개 지역 넷은 들어가야 안이 보임: 위 파멸의 용·아래 갓이터(잡은 편 모두 2분 30초 강화), 양옆은 정글 몬스터·보스 몬스터 · 포탑을 다 부수고 상대 집을 점령하면 승리",
      ],
      en: [
        "New Champion Clash battle 'Prelude to War' (5v5, with draft): the war between Ascalon and the elves · three lanes on a huge square field (top, diagonal mid, bottom) with two towers per lane per team · levels, gold, home shop and augments work like the Divine Contest",
        "Checkpoints (top-left corner, center, bottom-right corner): break the front enemy tower of that lane to claim it, then teleport there from home · they can be taken back",
        "The river (top-left to bottom-right) always slows you · four fog zones hide what's inside until you step in: Doom Dragon at the top and God Eater at the bottom (the slaying team gets a 2:30 buff), jungle monsters and boss monsters on the sides · destroy every tower and capture their home to win",
      ],
      ja: [
        "覇王戦の新しい対決「戦争の序幕」(5対5、バンピック): アスカロン陣営とエルフ陣営の戦争 · 大きな四角い野に3本の道（上・中央の斜め・下）、道ごと・チームごとに砲塔2つ · レベル・お金・拠点ショップ・強化は争奪戦と同じ",
        "チェックポイント（上の道の左上の角・中央・下の道の右下の角）: その道の相手の最前の砲塔を壊すと占領でき、占領すると拠点からそこへ瞬間移動 · 奪い返せる",
        "水辺（左上から右下へ流れる帯）は常に遅くなる · 4つの霧の地域は入らないと中が見えない: 上に破滅の竜・下にゴッドイーター（倒したチーム全員が2分30秒強化）、両側は野生モンスター・ボスモンスター · 砲塔をすべて壊して相手拠点を占領すれば勝利",
      ],
    },
  },
  {
    version: "0.48.241",
    date: "2026-10-30",
    items: {
      ko: [
        "패왕전 새 대결 '쟁탈전' (5대5, 밴픽): 신의 제단 대각선 한 줄 길 · 병사 무리가 30초마다 나오고 편마다 포탑 둘 · 상대 포탑 둘을 부수면 가운데를 점령할 수 있고, 가운데를 가진 편은 병사가 강해지며 상대 집 보스를 때릴 수 있음 → 보스를 잡고 상대 집을 점령하면 승리",
        "성장: 레벨 최대 18 (오를 때 체력·공격력·공격 속도·방어력이 모두 함께) · 병사·포탑·상대를 막타로 잡으면 경험치·돈, 가까이 있으면 경험치 조금 · 1초마다 1원 · 3·7·11·15레벨에 증강 셋 중 하나 (흡혈·예리함·치명·강철 피부·재생·힘·신속·거인·집중·주문 강화·메아리·돌격)",
        "집(깃발 둘레): 체력이 빠르게 참 · 쓰러지면 여기서 다시 (레벨이 높을수록 오래 기다림) · 집 상점(B): 사용 아이템 5종 · 기본 장비 15종 · 전설 장비 27종 (가진 재료를 쓰고 모자란 재료 값은 더 냄, 금기된 아티팩트는 하나만, 반값에 팔기) · 전설 장비마다 중첩·확률 효과",
      ],
      en: [
        "New Champion Clash battle 'Divine Contest' (5v5, with draft): a single diagonal lane on the Altar of the Gods · minion waves every 30s and two towers per team · break both enemy towers to take the center; the team holding it gets stronger minions and can hit the enemy home boss → slay the boss and capture their home to win",
        "Growth: level up to 18 (HP, damage, attack speed and defense all rise together) · last-hit minions, towers and rivals for XP and gold; nearby allies get a little XP · +1 gold per second · pick 1 of 3 augments at levels 3, 7, 11 and 15 (Vampire, Sharpness, Fatal, Steel Skin, Bloom, Might, Swift, Giant, Focus, Empowered Spells, Echo, Rush)",
        "Home (around your flag): fast healing · respawn here (longer at higher levels) · Home Shop (B): 5 consumables · 15 basic gear · 27 legendary gear (uses parts you own and charges for the rest, only one Forbidden Artifact, sell for half) · every legendary has its own stacking or proc effect",
      ],
      ja: [
        "覇王戦の新しい対決「争奪戦」(5対5、バンピック): 神の祭壇の斜めの一本道 · 30秒ごとに兵士の群れが出て各チームに砲塔2つ · 相手の砲塔2つを壊すと中央を占領でき、中央を持つチームは兵士が強くなり相手拠点のボスを攻撃できる → ボスを倒して相手拠点を占領すれば勝利",
        "成長: レベル最大18（上がると体力・攻撃力・攻撃速度・防御力がすべて一緒に）· 兵士・砲塔・相手をとどめで倒すと経験値とお金、近くにいると経験値を少し · 1秒ごとに1G · レベル3・7・11・15で強化を3つから1つ（吸血・鋭さ・致命・鋼の皮膚・再生・力・迅速・巨人・集中・呪文強化・こだま・突撃）",
        "拠点（旗のまわり）: 体力が素早く回復 · 倒れるとここで復活（レベルが高いほど長く待つ）· 拠点ショップ(B): 使用アイテム5種 · 基本装備15種 · 伝説装備27種（持っている素材を使い、足りない素材は代金を追加、禁じられたアーティファクトは1つだけ、半額で売却）· 伝説装備ごとに累積・確率効果",
      ],
    },
  },
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
];
