import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.44.3",
    date: "2026-10-21",
    items: {
      ko: ["갓이터 탄막: 궁극기 동안은 다른 패턴을 쓰지 않고(쓰던 공격·구슬·낫·망령도 거둠, 끝나면 다시 나옴), 탄 수는 그대로 두고 빠르기를 절반쯤으로 줄였습니다"],
      en: ["God Eater's Barrage: no other patterns during the ultimate (its attacks, orbs, scythes and wraiths are cleared and return afterwards), and the bullets keep their number but fly about half as fast"],
      ja: ["ゴッドイーターの弾幕：奥義中は他のパターンを使わず（攻撃·球·鎌·亡霊も消え、終わると再び出る）、弾の数はそのままで速さを半分ほどにしました"],
    },
  },
  {
    version: "0.44.2",
    date: "2026-10-21",
    items: {
      ko: [
        "라스트 보스 궁극기가 완전히 끝날 때까지 보스가 무적입니다 (용: 마지막 분화구가 터질 때까지 · 갓이터: 탄막이 끝날 때까지 · 태초의 빛·어둠: 불러낸 보스를 다 쓰러뜨릴 때까지, 흰 방벽으로 표시)",
        "기계공학자 공격 · 의사 공격 · 불타기 · 부적 봉인 피해가 무적인 적(천사장 탑 등)에게 들어가던 문제를 고쳤습니다",
      ],
      en: [
        "Final bosses are now invulnerable until their ultimate fully ends (Dragon: until the last crater explodes · God Eater: until the barrage ends · Primeval Light & Dark: until every summoned boss is defeated, shown by a white barrier)",
        "Fixed Engineer attacks, Doctor attacks, burning and talisman seal damage hurting invulnerable enemies (such as the Archangel's towers)",
      ],
      ja: [
        "ラストボスは奥義が完全に終わるまで無敵になりました（竜：最後の火口が爆発するまで · ゴッドイーター：弾幕が終わるまで · 太初の光・闇：召喚したボスを全て倒すまで、白い障壁で表示）",
        "機械工学者の攻撃 · 医者の攻撃 · 燃焼 · 呪符の封印ダメージが無敵の敵（天使長の塔など）に入っていた問題を修正しました",
      ],
    },
  },
  {
    version: "0.44.1",
    date: "2026-10-21",
    items: {
      ko: ["갓이터: 벽에 튕기며 떠도는 거대한 낫이 2배로 커지고, 한 번 나오면 갓이터가 쓰러질 때까지 계속 날아다닙니다"],
      en: ["God Eater: the giant scythes bouncing around the room are twice as large and, once summoned, keep flying until God Eater falls"],
      ja: ["ゴッドイーター：壁で跳ね返りながら漂う巨大な鎌が2倍の大きさになり、一度出るとゴッドイーターが倒れるまで飛び続けます"],
    },
  },
  {
    version: "0.44.0",
    date: "2026-10-21",
    items: {
      ko: [
        "라스트 보스 궁극기: 체력이 10% 아래로 내려가면 한 번, 하던 패턴을 그대로 쓰면서 궁극기를 씁니다",
        "멸망의 용 염옥: 입에서 방 절반만 한 불덩이가 커지다 터지고, 방 전체에 분화구 장면이 차례로 보였다 사라집니다. 그 뒤 마지막 장면부터 거꾸로, 예고 없이 터집니다 (장면마다 비어 있던 한 칸을 기억해서 따라가야 함)",
        "갓이터 탄막: 어둠이 좁혀 와 방이 아주 작아지고, 그 안에서 사방에서 쏟아지는 탄을 15초 동안 피해야 합니다 (그동안 갓이터는 맞지 않음)",
        "태초의 빛·어둠: 혼자 남아 10% 아래면 보스 다섯을 부릅니다 (빛: 강철 거구·무리 여왕·세이렌·하드플랜트·검신 / 어둠: 공허의 눈·검은 기사·얍삽한 활잡이·켄타우로스·데스)",
        "갓이터: 혼자 남았을 때 떠다니는 구슬이 3배로 커짐 · 혼돈의 검이 쫓아오며 큰 베기 3번 + 찌르기 · 파괴의 검이 찌르기 돌진 뒤 회전하며 한 번 더 돌진",
        "태초의 빛 혼자: 하늘에서 떨어지는 빛의 화살이 방 전체에 35발",
      ],
      en: [
        "Final boss ultimates: once health drops below 10%, each uses an ultimate once while keeping its other patterns",
        "Dragon of Ruin, Inferno: a fireball half the size of the room grows in its mouth and bursts, then crater scenes flash across the whole room one by one. Afterwards they explode in reverse order with no warning (remember the one empty cell in each scene and follow it)",
        "God Eater, Barrage: darkness closes in until the room is tiny, and you must dodge bullets pouring in from every side for 15s (God Eater can't be hit meanwhile)",
        "Primeval Light & Dark: the survivor below 10% summons five bosses (Light: Iron Hulk, Brood Queen, Siren, Hardplant, Sword Saint / Dark: Void Seer, Black Knight, Sly Archer, Centaur, Death)",
        "God Eater: once alone its floating orbs are 3x larger · Sword of Chaos chases you with 3 huge slashes and a thrust · Sword of Ruin follows its lunge with a second spinning lunge",
        "Primeval Light alone: 35 arrows of light rain down across the whole room",
      ],
      ja: [
        "ラストボスの奥義：体力が10%を切ると一度だけ、それまでのパターンを続けながら奥義を使います",
        "滅びの竜 炎獄：口の中で部屋の半分ほどの火の玉が膨らんで弾け、部屋全体に火口の場面が順に現れては消えます。その後、最後の場面から逆順に予告なしで爆発します（場面ごとに空いていた1マスを覚えて追う）",
        "ゴッドイーター 弾幕：闇が迫って部屋がとても狭くなり、その中で四方から降り注ぐ弾を15秒間避け続けます（その間ゴッドイーターは攻撃を受けない）",
        "太初の光・闇：単独で10%を切るとボスを5体召喚します（光：鋼の巨躯·群れの女王·セイレーン·ハードプラント·剣神 / 闇：虚ろの眼·黒騎士·ずる賢い弓使い·ケンタウロス·デス）",
        "ゴッドイーター：単独時に漂う球が3倍に · 混沌の剣が追いかけて大きな斬撃3回＋突き · 破壊の剣が突進の後、回転しながらもう一度突進",
        "太初の光単独：空から降る光の矢が部屋全体に35本",
      ],
    },
  },
];
