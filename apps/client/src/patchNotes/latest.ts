import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.36",
    date: "2026-11-12",
    items: {
      ko: [
        "도박꾼의 야바위: 섞는 시간이 3초 길어짐 (10번 → 28번) · 섞는 동안 방해 3번 — 연막이 탁자를 덮음 · 도박꾼이 카드를 뿌림 · 방 한쪽에서 금화 폭죽 (판마다 순서가 다름)",
        "결과 창 요약: 피해 상세 추가 — 보통 공격 · 치명타 · 상태이상 종류 전부를 많이 준 순서로, 피해량 · 비율 · 막대로 보여 줌",
      ],
      en: [
        "Gambler's shell game: shuffling lasts 3 seconds longer (10 → 28 swaps) · three distractions during the shuffle — smoke covers the table · the gambler throws cards · a coin burst goes off at one side of the room (order differs each game)",
        "Result summary: damage breakdown added — normal hits, criticals and every status type, highest first, with amount, share and a bar",
      ],
      ja: [
        "ギャンブラーのシェルゲーム：混ぜる時間が3秒長く（10回 → 28回）・混ぜている間に妨害が3回 — 煙幕がテーブルを覆う・ギャンブラーがカードをばらまく・部屋の片側で金貨の花火（毎回順番が変わる）",
        "結果画面のまとめ：ダメージ内訳を追加 — 通常攻撃・クリティカル・すべての状態異常を多い順に、ダメージ量・割合・バーで表示",
      ],
    },
  },
  {
    version: "0.52.35",
    date: "2026-11-12",
    items: {
      ko: ["백인장 종언의 붉은 날개: 레이저 선 대신 기본 패시브의 미니 창 드론 그림 180기가 날개에서 실제로 날아가 적에게 꽂힘 (붉은 레이저 자국을 남기고, 꽂히는 순간 피해)"],
      en: ["Baekinjang, Red Wings of the End: instead of laser lines, 180 mini lance drones (the base passive's drone art) actually fly out of the wings and stab foes (trailing red lasers, damage on impact)"],
      ja: ["百人長・終焉の赤い翼：レーザーの線の代わりに、基本パッシブのミニ槍ドローン180機が実際に翼から飛んで敵に刺さる（赤いレーザーの跡を残し、刺さった瞬間にダメージ）"],
    },
  },
  {
    version: "0.52.34",
    date: "2026-11-12",
    items: {
      ko: ["백인장: 전용 패시브 9개 추가 (모두 20개) — 편대 증설(드론 8기) · 과열 드릴(드론이 더 세게·자주) · 혈흔(드론에 찔리면 출혈) · 표적 공유(표식 붙은 적을 드론 전부가 노림·2배) · 연환(콤보를 끝내면 5초 공격 속도 +30%) · 잔월(기본 검격이 날아가 한 번 더 벰) · 날개 과부하(확률 기술 +5%p) · 사신의 계약(표식·출혈·죽음 걸린 적 처치 시 회복·스킬 대기 감소) · 강철 날개(받는 피해 -12%·돌진베기 뒤 잠깐 무적)"],
      en: ["Baekinjang: 9 more exclusive passives (20 in all) — Expanded Squadron (8 drones) · Overheated Drills (drones hit harder and more often) · Bloodstain (drone stabs cause bleeding) · Shared Target (all drones hunt the marked foe · 2x) · Unbroken Chain (+30% attack speed for 5s after finishing the combo) · Waning Moon (the basic slash flies on and cuts once more) · Wing Overload (+5%p to chance skills) · Reaper's Pact (killing a marked, bleeding or Death-struck foe heals and cuts skill cooldowns) · Steel Wings (-12% damage taken · brief invulnerability after the rush)"],
      ja: ["百人長：専用パッシブを9個追加（全部で20個）— 編隊増設（ドローン8機）・過熱ドリル（ドローンがより強く頻繁に）・血痕（ドローンに刺されると出血）・標的共有（刻印の敵を全機が狙う・2倍）・連環（コンボを決めると5秒攻撃速度+30%）・残月（通常の斬撃が飛んでもう一度斬る）・翼の過負荷（確率技+5%p）・死神の契約（刻印・出血・死の敵を倒すと回復・スキル待機減少）・鋼鉄の翼（被ダメージ-12%・突進斬り後に少し無敵）"],
    },
  },
  {
    version: "0.52.33",
    date: "2026-11-12",
    items: {
      ko: [
        "새 캐릭터 백인장 (실베르): 기계 날개와 미니 창 드론을 부리는 쌍검의 기사 · 무기는 혈월 쌍검 하나: 누르면 앞을 붉은 초승달 검격 둘로 X자로 벰",
        "기본 패시브: 미니 창 드론 5기가 늘 붉은 레이저를 남기며 적을 쫓아가 찌르고, 지나갔다가 돌아와 다시 찌름",
        "전용 패시브 11 — 콤보 3: 적색 난무(2타) → 선혈 회전참(4타) → 섬광 돌진베기(길게 돌진·크게 1타) · 확률 원거리 기술 4: 붉은 날개 폭우(15타)·추적 침격(15타)·관통 나선창·기계익 충격파 · 스킬 개방 4(숫자 키 1~4): 적안 표식(받는 피해 +10%·치명타로 맞을 확률 +15%)·혈철 감옥(보스는 큰 피해와 출혈)·사신의 팔연참(죽음 상태이상, 보스는 절반)·궁극기 종언의 붉은 날개(드론 180기가 180번 찌르고 살아남은 적에게 쌓인 피해를 한 번 더)",
      ],
      en: [
        "New character Baekinjang (Silber): a twin-blade knight with mech wings and mini lance drones · one weapon, the Blood Moon Twin Blades: press to carve an X ahead with two red crescent slashes",
        "Base passive: five mini lance drones always chase foes trailing red lasers, stab, fly past and come back to stab again",
        "11 exclusive passives — 3 combo steps: Crimson Flurry (2 hits) → Bloodspin Slash (4 hits) → Flash Rush Slash (long rush · one heavy hit) · 4 chance-based ranged skills: Red Wing Downpour (15 hits), Seeker Needles (15 hits), Piercing Spiral Lance, Mech Wing Shockwave · 4 skill unlocks (number keys 1-4): Red Eye Mark (+10% damage taken · +15% chance to be crit), Blood Iron Prison (bosses take heavy damage and bleed), Reaper's Eightfold Slash (Death, halved on bosses) and the ultimate Red Wings of the End (180 drones stab 180 times, then survivors take all that damage once more)",
      ],
      ja: [
        "新キャラクター百人長（シルベル）：機械の翼とミニ槍ドローンを操る双剣の騎士・武器は血月の双剣ひとつ：押すと前を赤い三日月の斬撃2つでX字に斬る",
        "基本パッシブ：ミニ槍ドローン5機が常に赤いレーザーを残して敵を追い、刺して通り過ぎ、戻ってまた刺す",
        "専用パッシブ11 — コンボ3：赤色乱舞（2打）→鮮血回転斬（4打）→閃光突進斬り（長く突進・大きく1打）・確率発動の遠距離技4：赤い翼の豪雨（15打）・追跡針撃（15打）・貫通螺旋槍・機械翼衝撃波・スキル解放4（数字キー1〜4）：赤眼の刻印（被ダメージ+10%・会心を受ける確率+15%）・血鉄の牢獄（ボスは大ダメージと出血）・死神の八連斬（死の状態異常、ボスは半分）・究極技 終焉の赤い翼（ドローン180機が180回刺し、生き残った敵に蓄積ダメージをもう一度）",
      ],
    },
  },
  {
    version: "0.52.32",
    date: "2026-11-11",
    items: {
      ko: ["혼령: 대시 자세·기본 공격 연기용 그림의 좌우가 반대이던 것 고침 · 늑대는 맵에 2마리, 범은 1마리까지 · 혼-영 분신이 방의 무작위 자리에 생김 · 혼-귀 공포는 보스에게 안 걸림"],
      en: ["Honryeong: fixed the dash pose and the basic smoke dragon being mirrored · up to 2 wolves and 1 tiger on the map · Spirit: Shade decoys appear at a random spot in the room · Spirit: Ghost fear no longer affects bosses"],
      ja: ["魂霊：ダッシュの姿勢と通常攻撃の煙の龍が左右逆だったのを修正・狼はマップに2匹、虎は1匹まで・魂・影の分身が部屋のランダムな場所に現れる・魂・鬼の恐怖はボスにかからない"],
    },
  },
  {
    version: "0.52.31",
    date: "2026-11-11",
    items: {
      ko: ["혼령: 연기 구름을 작고 옅게 · 내 몸 가까운 구름은 더 투명하게 · 은신하면 캐릭터가 구름 위로 빛나는 테두리와 함께 보임"],
      en: ["Honryeong: smoke clouds are smaller and fainter · clouds near you are more transparent · while hidden, your character shows above the clouds with a glowing outline"],
      ja: ["魂霊：煙の雲を小さく薄く・自分の近くの雲はさらに透明に・隠密中はキャラクターが雲の上に光る縁取りつきで見える"],
    },
  },
  {
    version: "0.52.30",
    date: "2026-11-11",
    items: {
      ko: [
        "새 캐릭터 혼령 (실베르): 곰방대를 피우는 여인 · 곰방대에서 보랏빛 연기용을 앞으로 내뿜어 공격 · 공격할 때마다 방 어딘가에 연기 구름이 생김 (30개까지 · 10초 · 같은 곳에 겹치지 않음 · 다 차면 방을 덮음) · 구름 안에 들어가면 은신: 적이 쫓아오지만 내 자리를 정확히 겨누지 못함",
        "혼령 무기 10: 곰방대 · 불씨(화상) · 서리(느려짐) · 독초(중독) · 약초(회복) · 뇌전(기절) · 혈연초(출혈) · 장죽 · 단죽 · 몽환(구름 둘)",
        "혼령 전용 패시브 10 (모두 새 기술·능력 + 능력치): 혼-랑(늑대 둘) · 혼-범(범) · 혼-효(앉아 있다 낙하 공격하는 부엉이) · 혼-룡(방을 덮는 용이 지나가며 60번 따로 때림) · 혼-영(적을 끌어들이고 쓰러지면 터지는 분신) · 혼령사냥(은신하면 소환수도 은신 · 늑대 확정 치명타·출혈 · 범 1.5배 · 부엉이 계속 날며 공격) · 혼-귀(구름 안 적 공포) · 짙은 연기 · 혼의 계약 · 깊은 들숨",
      ],
      en: [
        "New character Honryeong (Silber): a pipe-smoking lady · breathes a violet smoke dragon forward from her pipe · every attack leaves a smoke cloud somewhere in the room (up to 30 · 10s · never on top of another · a full set covers the room) · stand inside a cloud to hide: foes still chase you but cannot aim at you precisely",
        "10 Honryeong weapons: Long Pipe · Ember (burn) · Frost (slow) · Poison Herb (poison) · Healing Herb (heal) · Thunder (stun) · Bloodleaf (bleed) · Great Pipe · Short Pipe · Dream (two clouds)",
        "10 Honryeong passives (each a new skill or ability + stats): Spirit: Wolf (two wolves) · Spirit: Tiger · Spirit: Owl (perches, then dive-bombs) · Spirit: Dragon (a room-covering dragon that hits 60 separate times) · Spirit: Shade (a decoy that draws foes and bursts when it falls) · Spirit Hunt (summons hide when you hide · wolf guaranteed crit and bleed · tiger x1.5 · owls keep flying and attacking) · Spirit: Ghost (fear inside clouds) · Thick Smoke · Spirit Pact · Deep Breath",
      ],
      ja: [
        "新キャラクター魂霊（シルベル）：キセルを吸う女性・キセルから紫の煙の龍を前方へ吹き出して攻撃・攻撃するたびに部屋のどこかに煙の雲ができる（30個まで・10秒・同じ場所には重ならない・全部そろうと部屋を覆う）・雲の中に入ると隠密：敵は追ってくるが正確に狙えない",
        "魂霊の武器10：キセル・火種（火傷）・霜（鈍化）・毒草（毒）・薬草（回復）・雷電（気絶）・血煙草（出血）・長ギセル・短ギセル・夢幻（雲ふたつ）",
        "魂霊の専用パッシブ10（すべて新しい技・能力＋能力値）：魂・狼（狼2匹）・魂・虎・魂・梟（止まってから急降下攻撃するフクロウ）・魂・龍（部屋を覆う龍が通り抜け60回別々に攻撃）・魂・影（敵を引きつけ、倒れると弾ける分身）・魂霊狩り（隠れると召喚獣も隠れる・狼の確定クリティカル・出血・虎1.5倍・フクロウは飛び続けて攻撃）・魂・鬼（雲の中の敵に恐怖）・濃い煙・魂の契約・深い一服",
      ],
    },
  },
];
