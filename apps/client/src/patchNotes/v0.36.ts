import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.36.5",
    date: "2026-10-20",
    items: {
      ko: [
        "격투가 에너지파 → 콤보: 레이저 대신 파동탄 4단 콤보로 바뀌었습니다. 1발 → 부채꼴 3발 → 부채꼴 5발 → 기를 모아 사방으로 30발 난사 (한 발 피해 10)",
        "음양사 어둠의 부적: 5번 맞히면 등 뒤에서 유도 부적 5장이 나가 적을 쫓아가 미사일처럼 범위로 터집니다 (다시 5번 맞히면 또 나감)",
        "원소술사 웨폰 마스터: 피해를 절반으로 낮췄습니다 (×0.7 → ×0.35)",
        "원소술사 별똥별: 피해를 절반으로 낮췄습니다 (×1 → ×0.5)",
        "거너 드론 무기: 한 발 피해가 1이 아니라 2부터 시작합니다 (드론이 늘 때마다 +1, 최대 8)",
      ],
      en: [
        "Brawler Energy Wave → Combo: the beam is now a 4-step energy shot combo. 1 shot → 3 in a fan → 5 in a fan → gather energy and spray 30 shots everywhere (10 damage each)",
        "Talisman Master Dark Talisman: every 5 hits now launches 5 homing talismans from behind you that chase enemies and explode in an area like missiles (again every 5 hits)",
        "Elementalist Blade Lord: damage halved (×0.7 → ×0.35)",
        "Elementalist Shooting Stars: damage halved (×1 → ×0.5)",
        "Gunner Drones: each shot now starts at 2 damage instead of 1 (+1 per extra drone, up to 8)",
      ],
      ja: [
        "格闘家のエネルギー波 → コンボ：レーザーの代わりに波動弾の4段コンボになりました。1発 → 扇状に3発 → 扇状に5発 → 気を溜めて四方に30発乱射（1発10ダメージ）",
        "陰陽師の闇の符：5回当てると背後から追尾する符が5枚飛び出し、敵を追ってミサイルのように範囲で爆発します（また5回当てるとまた出る）",
        "元素術師ウェポンマスター：ダメージを半分にしました（×0.7 → ×0.35）",
        "元素術師流れ星：ダメージを半分にしました（×1 → ×0.5）",
        "ガンナーのドローン：1発のダメージが1ではなく2から始まります（ドローンが増えるごとに+1、最大8）",
      ],
    },
  },
  {
    version: "0.36.4",
    date: "2026-10-20",
    items: {
      ko: [
        "음양사 벚꽃 부적: 보통 탄 빠르기로 나갔다가 1초쯤 동안 점점 느려져 지금의 느린 빠르기가 됩니다 (사거리는 그대로)",
        "음양사 어둠의 부적: 5번 맞히면 유도 부적 한 장 대신 다음 공격 5장이 모두 유도됩니다",
      ],
      en: [
        "Talisman Master Cherry Blossom Talisman: now launches at normal shot speed and slows over about 1s to its slow drift (same range)",
        "Talisman Master Dark Talisman: every 5 hits now makes all 5 talismans of your next attack homing, instead of one homing talisman",
      ],
      ja: [
        "陰陽師の桜の符：普通の弾の速さで飛び出し、約1秒かけてだんだん今の遅い速さになります（射程はそのまま）",
        "陰陽師の闇の符：5回当てると追尾する符1枚の代わりに、次の攻撃の5枚がすべて追尾します",
      ],
    },
  },
  {
    version: "0.36.3",
    date: "2026-10-20",
    items: {
      ko: [
        "원소술사 웨폰 마스터: 검이 차례를 기다리지 않고 각자 따로 적에게 날아갑니다 (같은 적도 여러 검이 함께 노림)",
        "원소술사 별똥별: 별 수를 줄였습니다. 제자리에서 도는 안쪽 3개 · 넓게 퍼졌다 돌아오기를 반복하는 가운데 4개 · 각자 적에게 날아가 때리고 돌아오는 바깥 5개",
      ],
      en: [
        "Elementalist Blade Lord: swords no longer take turns; each flies at enemies on its own (several can target the same enemy)",
        "Elementalist Shooting Stars: fewer stars. Inner 3 circle in place · middle 4 spread wide and come back · outer 5 each fly at enemies and return",
      ],
      ja: [
        "元素術師ウェポンマスター：剣が順番を待たず、それぞれ別々に敵へ飛びます（同じ敵を複数の剣が同時に狙う）",
        "元素術師流れ星：星の数を減らしました。その場で回る内側3つ · 大きく広がって戻るのを繰り返す中間4つ · それぞれ敵へ飛んで叩いて戻る外側5つ",
      ],
    },
  },
  {
    version: "0.36.2",
    date: "2026-10-20",
    items: {
      ko: [
        "야수 덮치기: 덮칠 때 보호막 20을 얻고 3초 동안 유지됩니다",
        "거너 드론 무기: 한 발 피해가 드론 1대일 때 1(공격력의 1/8)에서 시작해 드론이 1대 늘 때마다 +1, 최대 8까지 오릅니다 (드론 수 제한은 그대로 없음)",
        "거너 지원사격: 지원 드론은 최대 5대까지, 지원 드론 탄에는 치명타가 붙지 않습니다",
      ],
      en: [
        "Beastkin Pounce: pouncing grants a 20 shield that lasts 3s",
        "Gunner Drones: each shot starts at 1 damage (1/8 of your damage) with 1 drone and gains +1 per extra drone, up to 8 (still no limit on drones)",
        "Gunner Support Fire: up to 5 support drones, and support drone shots never crit",
      ],
      ja: [
        "獣人の飛びかかり：飛びかかる時にシールド20を得て3秒間続きます",
        "ガンナーのドローン：1発のダメージはドローン1機で1（攻撃力の1/8）から始まり、1機増えるごとに+1、最大8まで上がります（ドローン数の上限はなしのまま）",
        "ガンナーの支援射撃：支援ドローンは最大5機まで、支援ドローンの弾はクリティカルしません",
      ],
    },
  },
  {
    version: "0.36.1",
    date: "2026-10-20",
    items: {
      ko: [
        "원소술사 웨폰 마스터: 검 5개가 원소마다 따로 움직입니다. 불은 날아가 세게 3번 때리고 돌아오기를 반복 · 물은 적을 계속 따라다니며 벱니다 · 번개는 빠르게 약하게 5번 (치명타 15%) · 땅은 아주 세게 한 번 범위 피해 · 풀은 몸 둘레를 돌며 적 탄을 막습니다",
        "원소술사 은하수: 장판 반경 46 → 56",
        "원소술사 중력: 피해 ×2.4 → ×3.2, 사거리 안에 들어온 적 탄도 절반 속도로 느려집니다",
        "원소술사 별똥별: 세 고리의 별이 모두 공격력만큼(×0.18 → ×1) 때립니다. 닿는 고리는 0.15초 틱 피해 대신 공격 간격마다 한 번",
        "원소술사 강철 구슬: 피해 ×0.6 → ×1",
        "원소술사 트리거: 치명타 20%, 기본 수보다 더 채워진 구슬 하나마다 +5% (치명타 탄은 주황)",
        "음양사 벚꽃 부적: 날아갈 때 꽃 한 송이 대신 연한 분홍 꽃잎이 흩날리며 지나갑니다 (터질 때 만개는 그대로)",
      ],
      en: [
        "Elementalist Blade Lord: the 5 swords now act by element. Fire flies out and hits hard 3 times, then returns and repeats · Water keeps chasing and slashing an enemy · Lightning hits fast and light 5 times (15% crit) · Earth strikes once very hard in an area · Grass circles you and blocks enemy shots",
        "Elementalist Milky Way: field radius 46 → 56",
        "Elementalist Gravity: damage ×2.4 → ×3.2, and enemy shots entering your range slow to half speed",
        "Elementalist Shooting Stars: stars in all three rings now hit for your full damage (×0.18 → ×1). Touching rings hit once per attack interval instead of every 0.15s",
        "Elementalist Steel Orbs: damage ×0.6 → ×1",
        "Elementalist Trigger: 20% crit, +5% per orb loaded beyond the base count (crit shots are orange)",
        "Talisman Master Cherry Blossom Talisman: instead of a single flower, light pink petals now scatter as it flies (the full bloom burst is unchanged)",
      ],
      ja: [
        "元素術師ウェポンマスター：剣5本が元素ごとに別々に動きます。火は飛んで強く3回叩いて戻るのを繰り返す · 水は敵を追い続けて斬る · 雷は速く弱く5回（クリティカル15%） · 土はとても強く1回の範囲ダメージ · 草は体の周りを回って敵の弾を防ぎます",
        "元素術師天の川：場の半径 46 → 56",
        "元素術師重力：ダメージ ×2.4 → ×3.2、射程内に入った敵の弾も半分の速さに遅くなります",
        "元素術師流れ星：三つの輪の星がすべて攻撃力分（×0.18 → ×1）叩きます。触れる輪は0.15秒ごとのダメージの代わりに攻撃間隔ごとに1回",
        "元素術師鋼の珠：ダメージ ×0.6 → ×1",
        "元素術師トリガー：クリティカル20%、基本数より多く込めた珠1つごとに+5%（クリティカル弾はオレンジ）",
        "陰陽師の桜の符：飛ぶときに花一輪の代わりに淡いピンクの花びらが舞い散ります（弾けるときの満開はそのまま）",
      ],
    },
  },
  {
    version: "0.36.0",
    date: "2026-10-20",
    items: {
      ko: [
        "새 캐릭터 야수(고양이 수인): 고양이 펫이 스스로 적에게 달려가 할큅니다. 발이 빠르고 체력 95",
        "야수 무기 10개: 고양이 발톱 · 덮치기 · 털실 뭉치(벽에 튕김) · 고양이 무리(고양이 3마리) · 사자의 심장(사자) · 헤어볼(느리게+불탐) · 캣닢(구름 피해, 고양이 두 배 빠르게) · 고양이 방울(둘레 기절) · 그림자 발(순간이동 고양이 2마리) · 호랑이 발톱",
        "야수 전용 아이템 10개: 고양이 낮잠 · 한 마리 더 · 날카로운 발톱 · 아홉 목숨 · 고양이 몸놀림 · 사냥 본능 · 골골송 · 무리의 우두머리 · 생선 간식 · 포효",
        "새 업적: 야생의 부름 (야수로 클리어)",
      ],
      en: [
        "New character Beastkin (cat-folk): pet cats run at enemies and scratch on their own. Quick on their feet, 95 health",
        "10 Beastkin weapons: Cat Claws · Pounce · Yarn Ball (bounces off walls) · Cat Pack (3 cats) · Lionheart (a lion) · Hairball (slow + burn) · Catnip (damaging cloud, cats twice as fast) · Cat Bell (stuns nearby) · Shadow Paw (2 teleporting cats) · Tiger Claw",
        "10 Beastkin items: Cat Nap · One More Cat · Sharp Claws · Nine Lives · Feline Agility · Hunter's Instinct · Purr · Pack Leader · Fish Treat · Wild Roar",
        "New achievement: Call of the Wild (clear as the Beastkin)",
      ],
      ja: [
        "新キャラクター獣人（猫の獣人）：ペットの猫が自分から敵に駆け寄って引っかきます。足が速く体力95",
        "獣人の武器10種：猫の爪 · 飛びかかり · 毛糸玉（壁で跳ね返る） · 猫の群れ（猫3匹） · 獅子の心（ライオン） · 毛玉（鈍足＋炎上） · マタタビ（ダメージの雲、猫が2倍速く） · 猫の鈴（周りを気絶） · 影の肉球（瞬間移動する猫2匹） · 虎の爪",
        "獣人専用アイテム10種：猫の昼寝 · もう一匹 · 鋭い爪 · 九つの命 · 猫の身のこなし · 狩りの本能 · ゴロゴロ · 群れのボス · お魚おやつ · 咆哮",
        "新しい実績：野生の呼び声（獣人でクリア）",
      ],
    },
  },
];
