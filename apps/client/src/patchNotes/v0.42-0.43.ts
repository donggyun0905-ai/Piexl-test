import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.43.0",
    date: "2026-10-21",
    items: {
      ko: [
        "멸망의 용: 무적 중 내뿜는 불덩이가 더 빨라지고 벽에 3번 튕긴 뒤, 한 번 더 닿으면 터져 작은 불꽃으로 퍼집니다",
        "갓이터 혼자 남았을 때: 방을 4구역으로 나눠 거대한 낫으로 하나씩 닫습니다 (닫힐 때 그 구역에 있으면 피해 20 + 주변이 깜깜해짐, 대시로 피할 수 있음) · 벽에 튕기며 계속 떠도는 거대한 낫 3개",
        "태초의 빛과 어둠: 둘이 있을 때 빛·어둠 화살 15발을 아무 데로나 난사(벽에 튕김) · 빛 혼자 남으면 검신을 소환합니다",
      ],
      en: [
        "Dragon of Ruin: the fireballs it releases while invulnerable are faster, bounce off walls 3 times, then burst into small flames on the next hit",
        "God Eater, once alone: splits the room into 4 zones and seals them one by one with a giant scythe (being inside when it closes deals 20 damage and darkens your view; dash to avoid) · 3 giant scythes that keep bouncing around the room",
        "Primeval Light & Dark: while both are alive, they fire 15 light and dark arrows in random directions that bounce off walls · Light alone summons the Sword Saint",
      ],
      ja: [
        "滅びの竜：無敵中に吐く火の玉がより速くなり、壁で3回跳ね返った後、もう一度当たると弾けて小さな炎に広がります",
        "ゴッドイーター単独時：部屋を4区画に分け、巨大な鎌で1つずつ閉じます（閉じる時その区画にいると20ダメージ＋周りが真っ暗に、ダッシュで回避可能） · 壁で跳ね返りながら漂い続ける巨大な鎌3本",
        "太初の光と闇：2体がいる間、光と闇の矢15本を四方八方に乱射（壁で跳ね返る） · 光が単独になると剣神を召喚します",
      ],
    },
  },
  {
    version: "0.42.1",
    date: "2026-10-21",
    items: {
      ko: ["갓이터 봉인의 사슬: 대시 연타 대신, 머리 위에 뜬 W·A·S·D 6개를 4초 안에 순서대로 누르면 풀립니다 (틀리거나 늦으면 큰 피해)"],
      en: ["God Eater's Sealing Chains: instead of mashing dash, press the 6 W/A/S/D keys shown above your head in order within 4s (a wrong key or running out of time deals heavy damage)"],
      ja: ["ゴッドイーターの封印の鎖：ダッシュ連打の代わりに、頭上に出るW·A·S·Dの6つを4秒以内に順番に押すと解けます（間違えるか遅れると大ダメージ）"],
    },
  },
  {
    version: "0.42.0",
    date: "2026-10-21",
    items: {
      ko: [
        "라스트 보스 강화: 넓어진 방에 맞춰 세 보스 모두 몸·공격 범위가 커지고 체력이 2배가 됐습니다",
        "멸망의 용: 꼬리로 바닥을 쾅쾅 쳐 원형 파동(대시로 넘어가야 함) · 내려찍기 범위가 커지고 바위 파편이 사방으로 튐 · 할퀴기 대신 긴 꼬리를 크게 휘두름 · 절반 아래 숨결이 세 갈래로 더 빠르게",
        "갓이터: 몸·대낫이 커지고 벽에서 날아오는 검기가 거대해짐 · 공격을 40% 확률로 받아 넘김(대검은 30%, 체력 2배) · 절반 아래면 멀리 날려 버리기 · 봉인의 사슬(3초 안에 대시를 6번 연타해야 풀림, 못 풀면 큰 피해)",
        "태초의 빛과 어둠: 기억력 패턴(흰 선이 차례로 깔린 뒤 마지막 선부터 거꾸로 터짐) · 어둠은 한 번 깔리면 걷히지 않고 유령에 닿을수록 짙어짐 · 빛 혼자 남으면 거울(5초 동안 이동 방향이 반대) · 범위 2배",
        "연습장: 라스트 보스는 실제와 같은 큰 방에서 연습합니다 (태초의 빛과 어둠은 둘이 함께, 상자 벽 방)",
      ],
      en: [
        "Final bosses buffed: to fit the bigger room, all three have larger bodies and attack ranges and double health",
        "Dragon of Ruin: pounds the floor with its tail to send circular shockwaves (dash over them) · a bigger dive slam that scatters rock debris everywhere · a long tail sweep replaces the claw · below half health its breath is a faster three-way stream",
        "God Eater: bigger body and scythes, giant sword waves from the walls · parries 40% of attacks (greatswords 30%, double health) · below half health it blasts you far away · Sealing Chains (mash dash 6 times within 3s or take heavy damage)",
        "Primeval Light & Dark: memory pattern (white lines appear one by one, then explode in reverse order) · darkness no longer fades and deepens with each ghost touch · Light alone casts Mirror (movement reversed for 5s) · ranges doubled",
        "Practice: final bosses are fought in the same big room as the real fight (Primeval Light & Dark together, in the box-wall room)",
      ],
      ja: [
        "ラストボス強化：広くなった部屋に合わせて3体とも体と攻撃範囲が大きくなり、体力が2倍になりました",
        "滅びの竜：尻尾で床を叩いて円形の衝撃波（ダッシュで越える） · 叩きつけの範囲が広がり岩の破片が四方に飛ぶ · 引っかきの代わりに長い尻尾を大きく振る · 体力半分以下のブレスが3方向でより速く",
        "ゴッドイーター：体と大鎌が大きくなり、壁から飛ぶ剣気が巨大に · 攻撃を40%の確率で受け流す（大剣は30%、体力2倍） · 体力半分以下で遠くへ吹き飛ばす · 封印の鎖（3秒以内にダッシュを6回連打しないと大ダメージ）",
        "太初の光と闇：記憶パターン（白い線が順に敷かれ、最後の線から逆順に爆発） · 闇は一度広がると晴れず、幽霊に触れるほど濃くなる · 光が単独になると鏡（5秒間移動方向が逆） · 範囲2倍",
        "練習場：ラストボスは本番と同じ広い部屋で練習できます（太初の光と闇は2体一緒に、箱の壁の部屋）",
      ],
    },
  },
];
