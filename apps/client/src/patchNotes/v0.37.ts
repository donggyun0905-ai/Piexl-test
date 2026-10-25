import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.37.4",
    date: "2026-10-20",
    items: {
      ko: ["격투가 택견: 무적 돌진의 무적 시간을 예전대로 되돌렸습니다 (이제 돌진이 적 앞에서 멈춰 부딪히지 않습니다)", "격투가 콤보(파동탄): 한 발 피해를 10에서 5로 낮췄습니다"],
      en: ["Brawler Taekkyon: the invulnerable dash's invulnerability is back to its old length (the dash now stops before the enemy, so you no longer bump into it)", "Brawler Combo (energy shots): damage per shot lowered from 10 to 5"],
      ja: ["格闘家のテッキョン：無敵突進の無敵時間を元に戻しました（突進が敵の前で止まるのでぶつからなくなりました）", "格闘家のコンボ（波動弾）：1発のダメージを10から5に下げました"],
    },
  },
  {
    version: "0.37.3",
    date: "2026-10-20",
    items: {
      ko: [
        "격투가 주짓수를 빼고 새 무기 쌍광연격으로 바꿨습니다: 앞쪽을 두 검으로 동시에 두 번 베기 → 한 바퀴 돌며 두 번 베기 → 무적으로 적을 꿰뚫고 지나가 바로 뒤에서 멈추는 돌진 (주짓수에서 멈춰 버리던 문제도 함께 사라졌습니다)",
        "격투가 유도·종합격투기: 보스처럼 들 수 없는 적 앞에서는 바위를 만들어 들고(던질 때까지 무적) 던집니다",
      ],
      en: [
        "Brawler Jiu-jitsu is replaced by a new weapon, Twin Light Barrage: two swords slash the front twice at once → spinning double slash → invulnerable dash that pierces through an enemy and stops right behind it (this also removes the Jiu-jitsu freeze)",
        "Brawler Judo and MMA: in front of enemies you can't lift, like bosses, you conjure a rock, hold it (invulnerable until you throw) and slam it down",
      ],
      ja: [
        "格闘家の柔術をなくし、新しい武器「双光連撃」にしました：二本の剣で前を同時に2回斬る → 一回転して2回斬る → 無敵で敵を貫いて通り抜け、すぐ後ろで止まる突進（柔術で固まってしまう問題もなくなりました）",
        "格闘家の柔道・総合格闘技：ボスのように持ち上げられない敵の前では岩を作って持ち（投げるまで無敵）、叩きつけます",
      ],
    },
  },
  {
    version: "0.37.2",
    date: "2026-10-20",
    items: {
      ko: [
        "검은 기사: 베기 범위가 1.5배로 넓어졌습니다",
        "하드플랜트: 덩굴이 사방 8줄로 솟아 더 빨리 내려찍습니다 (체력 절반 아래면 그 사이로 한 번 더)",
        "데스: 낫 범위가 1.5배로 넓어졌습니다",
        "천사장: 쫓아오는 성기사 2마리(절반 아래 4마리)와 천사장 곁을 지키는 가디언 3마리를 부릅니다. 빛기둥이 더 크고 빠르게 떨어집니다",
        "거너 특수용병: 돌진이 적에게 닿지 않고 바로 앞에서 멈춥니다",
      ],
      en: [
        "Black Knight: slash range is 1.5x wider",
        "Hardplant: vines now burst out in 8 directions and slam faster (once more in between below half health)",
        "Death: scythe range is 1.5x wider",
        "Archangel: summons 2 paladins that chase you (4 below half health) and 3 guardians that protect the Archangel. Pillars of light are bigger and fall faster",
        "Gunner Special Merc: the dash now stops right in front of the enemy instead of bumping into it",
      ],
      ja: [
        "黒騎士：斬りの範囲が1.5倍に広がりました",
        "ハードプラント：つるが四方8本に伸び、より速く叩きつけます（体力半分以下でその間にもう一度）",
        "デス：鎌の範囲が1.5倍に広がりました",
        "大天使：追ってくる聖騎士2体（半分以下で4体）と大天使のそばを守るガーディアン3体を呼びます。光の柱がより大きく速く落ちます",
        "ガンナーの特殊傭兵：突進が敵にぶつからず目の前で止まります",
      ],
    },
  },
  {
    version: "0.37.1",
    date: "2026-10-20",
    items: {
      ko: [
        "격투가: 파동탄(콤보) 무기 말고는 기술이 적을 맞혀야 다음 기술로 넘어갑니다",
        "격투가 킥·택견·종합격투기: 돌진이 적에게 닿지 않고 바로 앞에서 멈춥니다",
        "격투가 유도: 첫 치기 사거리를 줄였고, 붙잡은 적은 경직되며 내리꽂을 때까지 무적입니다",
        "격투가 주짓수 새로: 태클(적 앞까지 달려들어 넘어뜨림) → 관절기(2초 묶고 피해, 그동안 무적) → 서브미션(3배 피해)",
        "격투가 가라테: 마무리 기술이 입힌 피해의 30%만큼 체력을 회복합니다",
        "격투가 택견: 무적 돌진의 무적 시간을 1.5초 늘렸습니다",
        "연습장: 아이템 목록을 마우스 휠로 스크롤할 수 있습니다",
      ],
      en: [
        "Brawler: except for the energy-shot Combo weapon, a move must hit an enemy to chain into the next one",
        "Brawler Kick, Taekkyon, MMA: dashes now stop right in front of the enemy instead of bumping into it",
        "Brawler Judo: shorter first hit; the grabbed enemy is stunned and you are invulnerable until the slam",
        "Brawler Jiu-jitsu remade: tackle (rush in and take the enemy down) → joint lock (pin for 2s with damage, invulnerable meanwhile) → submission (3x damage)",
        "Brawler Karate: the finisher heals 30% of the damage it deals",
        "Brawler Taekkyon: the invulnerable dash lasts 1.5s longer",
        "Practice: the item list now scrolls with the mouse wheel",
      ],
      ja: [
        "格闘家：波動弾（コンボ）武器以外は、技が敵に当たらないと次の技に進みません",
        "格闘家の蹴り・テッキョン・総合格闘技：突進が敵にぶつからず目の前で止まります",
        "格闘家の柔道：最初の打撃の射程を短くし、つかんだ敵は硬直、叩きつけるまで無敵です",
        "格闘家の柔術を作り直し：タックル（敵の前まで飛び込んで倒す） → 関節技（2秒固定してダメージ、その間無敵） → サブミッション（3倍ダメージ）",
        "格闘家の空手：とどめの技が与えたダメージの30%だけ体力を回復します",
        "格闘家のテッキョン：無敵突進の無敵時間を1.5秒延ばしました",
        "練習場：アイテム一覧をマウスホイールでスクロールできます",
      ],
    },
  },
  {
    version: "0.37.0",
    date: "2026-10-20",
    items: {
      ko: [
        "새 보스 8종: 층마다 그 단계 보스 중 하나가 무작위로 나옵니다 (모든 보스는 체력 절반 아래면 더 세집니다)",
        "1·2층: 검은 기사(3연속 베기·찌르며 돌진) · 얍삽한 활잡이(벽에 튕기는 화살, 가까이 가면 뒤로 뜀)",
        "3·4층: 세이렌(벽에 튕기며 도는 음표에 맞으면 1.5초 동안 끌려감) · 켄타우로스(돌진 찌르기 3번 → 사방 창 던지기 → 휘두르며 찌르기) · 하드플랜트(바닥 범위 공격·솟아오르는 덩굴 내려찍기)",
        "5·6층: 데스(큰 낫 휘두르기·등 뒤로 순간이동) · 검신(방 전체에 반짝이는 검기 격자, 빛나지 않는 칸으로 피하세요) · 천사장(성기사 소환·빛기둥)",
        "보스의 큰 공격은 범위(원·부채꼴·선)가 먼저 보입니다. 대시로 피할 수 있어요",
        "격투가 찌르기 기술에 뻗어 나가는 찌르기 효과를 넣었습니다",
      ],
      en: [
        "8 new bosses: each floor now picks one boss at random from its stage (every boss gets stronger below half health)",
        "Floors 1–2: Black Knight (3-hit slash combo, lunging thrust) · Sly Archer (wall-bouncing arrows, leaps away when you get close)",
        "Floors 3–4: Siren (wall-bouncing notes pull you toward her for 1.5s on hit) · Centaur (3 dash-thrusts → spears in all directions → sweep with a thrust) · Hardplant (ground area attacks, vines rising to slam)",
        "Floors 5–6: Death (huge scythe sweeps, teleports behind you) · Sword Saint (a sparkling grid of sword light over the room — dodge into the squares that don't shine) · Archangel (summons paladins, pillars of light)",
        "Big boss attacks show their area (circle, fan or line) first. You can dash through them",
        "Brawler thrust moves now show a stabbing effect",
      ],
      ja: [
        "新ボス8体：各階でその段階のボスからランダムに1体が出ます（全ボス、体力が半分を切ると強くなります）",
        "1・2階：黒騎士（3連続斬り・突きながら突進） · ずる賢い弓使い（壁で跳ね返る矢、近づくと後ろへ跳ぶ）",
        "3・4階：セイレーン（壁で跳ね返りながら回る音符に当たると1.5秒引き寄せられる） · ケンタウロス（突進突き3回 → 四方に槍投げ → 振り回しながら突き） · ハードプラント（地面の範囲攻撃・伸び上がるつるの叩きつけ）",
        "5・6階：デス（大鎌の振り回し・背後へ瞬間移動） · 剣神（部屋全体にきらめく剣気の格子、光っていないマスへ避けよう） · 大天使（聖騎士召喚・光の柱）",
        "ボスの大技は範囲（円・扇形・線）が先に表示されます。ダッシュで避けられます",
        "格闘家の突き技に伸びる突きエフェクトを入れました",
      ],
    },
  },
];
