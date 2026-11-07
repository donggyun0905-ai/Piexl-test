import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.80",
    date: "2026-11-07",
    items: {
      ko: [
        "블래스트 대시 슬라이딩: 대시가 끝난 뒤 느려지던 것을, 대시 자체가 1.7초 동안 천천히 미끄러지는 슬라이딩이 되고 그동안 모두가 느려지게 (적은 더 느리게) · 미끄러지는 동안 파란 탄을 다 쏠 수 있음",
        "슬로우모션 중엔 탄창 5발이 사라지고 파란 탄 4발로 바뀜 → 잿빛 화면이 끝나면 원래 탄창으로 돌아옴",
      ],
      en: [
        "Blast dash slide: instead of slowing after the dash, the dash itself becomes a slow 1.7s slide during which everyone slows down (enemies even more) · you can fire all blue shells while sliding",
        "During the slow motion the 5-shell magazine is replaced by 4 blue shells → the original magazine returns when the gray screen ends",
      ],
      ja: [
        "ブラストのダッシュ・スライディング：ダッシュ後に遅くなっていたのを、ダッシュ自体が1.7秒のゆっくりしたスライディングになり、その間全員が遅くなるように（敵はさらに遅く）・滑りながら青い弾を撃ち切れる",
        "スローモーション中は弾倉5発が消えて青い弾4発に → 灰色の画面が終わると元の弾倉に戻る",
      ],
    },
  },
  {
    version: "0.49.79",
    date: "2026-11-07",
    items: {
      ko: [
        "블래스트 탄창 5발: 5발마다 마지막 발은 확정 치명타 (체력 줄 위 새빨간 탄) · 쏘지 않을 때 한 발씩 장전하며 철컥 소리 · 한 발만 들어가도 바로 쏠 수 있지만 치명타 탄은 다시 5번째 발에서 (두 발 → 펌프질 방식은 없앰)",
        "블래스트 대시 슬로우모션 (7초마다): 2초 동안 나를 포함한 모두가 느려지고 화면이 잿빛으로 · 파란 탄 4발이 바로 장전 (푸른 폭발) · 그동안 공격 속도와 탄은 그대로",
        "아이템 바뀜: 빠른 펌프 → 빠른 장전 (한 발 장전 시간 -30%)",
      ],
      en: [
        "Blast 5-shell magazine: every 5th shell is a guaranteed crit (bright red shell above the HP bar) · reloads one shell at a time with a click when not firing · you can fire as soon as one shell is in, but the crit shell comes again only on the 5th shot (the two-shots-then-pump pattern is gone)",
        "Blast dash slow motion (every 7s): for 2s everyone including you slows down and the screen turns gray · 4 blue shells load instantly (blue blast) · your attack speed and shots stay the same",
        "Item changed: Quick Pump → Quick Reload (-30% time to load each shell)",
      ],
      ja: [
        "ブラストの弾倉5発：5発ごとに最後の1発は確定クリティカル（体力バーの上に真っ赤な弾）・撃たない間に1発ずつ装填しガチャッと音・1発入ればすぐ撃てるがクリティカル弾は再び5発目に（2発→ポンプ方式は廃止）",
        "ブラストのダッシュスローモーション（7秒ごと）：2秒間、自分を含む全員が遅くなり画面が灰色に・青い弾4発が即装填（青い爆発）・その間も攻撃速度と弾はそのまま",
        "アイテム変更：素早いポンプ → 素早い装填（1発の装填時間-30%）",
      ],
    },
  },
  {
    version: "0.49.78",
    date: "2026-11-07",
    items: {
      ko: [
        "블래스트 산탄 이펙트: 총구 앞에 주황·검붉은 폭발 (번쩍 → 검은 연기 → 초승달 충격 → 흩어짐, 펌프 앞 둘째 발은 더 크게)",
        "블래스트 탄약: 체력 줄 위에 남은 탄피 2발 표시 (쏜 발은 어둡게 · 펌프질 중엔 금빛 줄이 깜빡임)",
      ],
      en: [
        "Blast shot effect: an orange and dark-red explosion at the muzzle (flash → black smoke → crescent shock → scatter; the second shot before the pump is bigger)",
        "Blast ammo: the 2 remaining shells are shown above the HP bar (spent ones dim · a gold line blinks while pumping)",
      ],
      ja: [
        "ブラストの散弾エフェクト：銃口の前にオレンジと赤黒い爆発（閃光→黒煙→三日月の衝撃→散る、ポンプ前の2発目はより大きく）",
        "ブラストの弾薬：体力バーの上に残り2発の薬莢を表示（撃った分は暗く・ポンプ中は金色の線が点滅）",
      ],
    },
  },
  {
    version: "0.49.77",
    date: "2026-11-07",
    items: {
      ko: [
        "새 소속 새벽의 성흔(악마 사냥꾼, 흰색) · 새 캐릭터 블래스트 '폭멸의 탄환': 근접한 악마들을 날려 버리는 화력 담당 (체력 115 · 공격력 15 · 방어력 2 · 이동 1.35, 여는 조건: 공격 속도 1.6 달성)",
        "산탄총 두 발 → 펌프질 · 붙을수록 세고 크게 밀침 · 초근접으로 처치하면 폭멸(몸이 터져 둘레 피해)",
        "새벽의 성흔은 스킬 대신 흰 성흔(달빛의 힘) 게이지: 맞히면 차고 가득 차면 6초 달빛 각성 (달빛 폭발 · 피해 1.4배 · 더 멀리·넓게·빠르게 · 달빛 산탄)",
        "전용 아이템 20 (화력 · 폭멸 · 성흔 · 사냥꾼) · 산탄·폭멸·달빛 이펙트 · 효과음 · 그림 시트 · 패왕전 스킬",
        "소속 색 바뀜: 성국 노랑 · 테라코어 갈색 · 아카식 레코드·서고의 감시자는 제 색 그대로 은은하게 빛남",
      ],
      en: [
        "New faction Dawn Stigmata (demon hunters, white) · new character Blast 'The Annihilating Round': the firepower who blows nearby demons apart (HP 115 · Damage 15 · Defense 2 · Move 1.35, unlock: reach 1.6 attack speed)",
        "Two shotgun blasts → pump · stronger and harder-hitting up close · point-blank kills annihilate (the body bursts, hurting those around)",
        "Dawn Stigmata use a white Stigma (power of moonlight) gauge instead of skills: it fills as you hit and, when full, grants a 6s Moonlight Awakening (moonlight burst · 1.4x damage · longer, wider, faster shots · moon pellets)",
        "20 exclusive items (Firepower · Annihilation · Stigma · Hunter) · shot, annihilation and moonlight effects · sounds · sprite sheet · Paewang skills",
        "Faction colors changed: Holy Kingdom yellow · Terracore brown · Akashic Records and Archive Wardens keep their colors with a soft glow",
      ],
      ja: [
        "新しい所属「暁の聖痕」（悪魔狩り、白）・新キャラクター ブラスト「爆滅の弾丸」：近づいた悪魔を吹き飛ばす火力担当（体力115・攻撃力15・防御力2・移動1.35、解放条件：攻撃速度1.6達成）",
        "散弾銃2発→ポンプ・近いほど強く大きく押し出す・至近距離で倒すと爆滅（体が弾けて周囲にダメージ）",
        "暁の聖痕はスキルの代わりに白い聖痕（月光の力）ゲージ：当てると満ち、満ちると6秒間の月光覚醒（月光爆発・ダメージ1.4倍・より遠く広く速く・月光散弾）",
        "専用アイテム20（火力・爆滅・聖痕・狩人）・散弾・爆滅・月光エフェクト・効果音・スプライトシート・覇王戦スキル",
        "所属の色を変更：聖国は黄色・テラコアは茶色・アカシックレコードと書庫の監視者は元の色のままほのかに光る",
      ],
    },
  },
  {
    version: "0.49.76",
    date: "2026-11-07",
    items: {
      ko: [
        "미카엘라 2 칼날 교대: 순간 이동해 잡은 무기로 1.5초 안에 적을 잡으면 2번 스킬 대기가 바로 초기화",
        "미카엘라 4 무한의 무기고: 적 하나씩이 아니라 모든 적에게 한꺼번에 무기가 내려꽂히고, 맵 곳곳에도 여러 개가 동시에 쏟아짐",
      ],
      en: [
        "Michaela 2 Blade Swap: kill an enemy within 1.5s with the weapon you teleported to and skill 2's cooldown resets instantly",
        "Michaela 4 Infinite Armory: weapons now slam into every enemy at once instead of one at a time, and several also rain across the whole map simultaneously",
      ],
      ja: [
        "ミカエラ 2 刃の交代：瞬間移動して持った武器で1.5秒以内に敵を倒すと、スキル2の待ち時間がすぐにリセット",
        "ミカエラ 4 無限の武器庫：敵1体ずつではなく全ての敵に同時に武器が突き刺さり、マップのあちこちにも複数が同時に降り注ぐ",
      ],
    },
  },
  {
    version: "0.49.75",
    date: "2026-11-07",
    items: {
      ko: [
        "미카엘라 무기마다 고유 기술: 37가지 무기가 저마다 3연격 기술 셋과 닿았을 때 기술 둘을 지님 · 기술 14가지 (베기 · 내려찍기 · 휘두르기 · 회전 베기 · 찌르기 · 돌진 찌르기 · 던지기 · 세 갈래 던지기 · X 베기 · 땅 가르기 · 올려베기 · 회오리 · 칼비 · 꿰뚫는 빛 창)",
        "박힌 무기에 닿거나 대시로 순간 이동해 들면 그 무기의 기술 둘이 연달아 (예: 은적 대검은 내려찍고 휘두르기 · 보라 낫창은 회오리 치고 던지기 · 비취 창은 칼비를 부르고 찌르기)",
        "무기를 바꿀 때·던질 때 터지던 폭발과 연쇄 폭발을 뺌 (폭발은 3 일제 폭파에만) · 기술마다 그 무기 그림이 휘둘러지고 꽂히고 날아가며 속성 색 빛",
        "아이템 바뀜: 성스러운 화약 기술 피해 · 넓은 폭심 기술 범위 · 공명 닿을 때 3연격 마지막 기술까지 · 긴 도화선 일제 폭파 피해 · 공허의 칼날 순간 이동해 들 때 기술 피해",
      ],
      en: [
        "Michaela's weapons each have their own techniques: all 37 weapons carry three chain techniques and two touch techniques · 14 techniques (slash · slam · sweep · spin · thrust · lunge · throw · triple throw · cross slash · ground split · rising slash · whirlwind · blade rain · piercing lance)",
        "Touch a planted weapon or dash-teleport to it and its two techniques fire in a row (e.g. the silver-crimson greatsword slams then sweeps · the violet scythe-spear whirls then throws · the jade spear calls blade rain then thrusts)",
        "Removed the explosions on swap and throw and the chain explosions (explosions only in 3 Mass Detonation) · each technique swings, plants and hurls the weapon's own art with its element's glow",
        "Items changed: Holy Powder technique damage · Wide Blast technique range · Resonance also fires the 3rd chain technique on touch · Long Fuse Mass Detonation damage · Void Edge technique damage when dash-teleporting",
      ],
      ja: [
        "ミカエラの武器ごとに固有の技：37本の武器それぞれが3連撃の技3つと触れた時の技2つを持つ · 技14種（斬り · 叩きつけ · 薙ぎ払い · 回転斬り · 突き · 突進突き · 投げ · 三方投げ · X斬り · 地割り · 斬り上げ · 旋風 · 剣の雨 · 貫く光の槍）",
        "刺さった武器に触れるかダッシュで瞬間移動して持つと、その武器の技2つが連続で（例：白銀紅の大剣は叩きつけて薙ぎ払う · 紫の鎌槍は旋風から投げ · 翡翠の槍は剣の雨を呼んで突く）",
        "持ち替え・投擲時の爆発と連鎖爆発を削除（爆発は3 一斉爆破のみ）· 技ごとにその武器の絵が振られ、突き刺さり、飛び、属性の色に光る",
        "アイテム変更：聖なる火薬 技ダメージ · 広い爆心 技の範囲 · 共鳴 触れた時に3連撃最後の技まで · 長い導火線 一斉爆破ダメージ · 虚空の刃 瞬間移動して持つ時の技ダメージ",
      ],
    },
  },
  {
    version: "0.49.74",
    date: "2026-11-07",
    items: {
      ko: [
        "미카엘라 무기 그림: 사용자 그림의 창 21개·검 16개를 하나씩 잘라 게임 무기로 · 방에 쏟아지는 무기·박힌 무기·손에 든 무기·몸 둘레에 떠다니는 무기·던진 무기·떨어지는 무기·베기·찌르기·바꿔 들기·무기고 모두 그 그림으로",
        "무기마다 그림 색에 맞는 속성 (예: 붉은 창 홍염 · 하늘색 수정 검 빙결 · 보라 낫창 자전 · 금빛 검 천광) · 그 무기로 공격하고 터질 때 그 속성 효과와 색 · 투척 뒤에는 다른 종류(검 ↔ 창)의 새 무기를 꺼냄",
      ],
      en: [
        "Michaela's weapon art: the 21 spears and 16 swords from the provided artwork are cut out one by one as in-game weapons · weapons raining into rooms, planted weapons, the weapon in hand, the floating swarm, thrown and falling weapons, slashes, thrusts, swaps and the Armory all use that art",
        "Each weapon has the element matching its colours (e.g. red spear Crimson Flame · sky-blue crystal sword Frost · violet scythe-spear Violet Storm · golden sword Heavenly Light) · attacks and explosions with it carry that element's effect and colour · after a throw she draws a new weapon of the other kind (sword ↔ spear)",
      ],
      ja: [
        "ミカエラの武器の絵：ユーザーの絵の槍21本・剣16本を1本ずつ切り出してゲームの武器に · 部屋に降り注ぐ武器・刺さった武器・手に持つ武器・体の周りに漂う武器・投げた武器・落ちてくる武器・斬り・突き・持ち替え・武器庫の全てがその絵",
        "武器ごとに絵の色に合う属性（例：赤い槍は紅炎 · 水色の水晶の剣は氷結 · 紫の鎌槍は紫電 · 金の剣は天光）· その武器での攻撃と爆発にその属性効果と色 · 投擲後は別の種類（剣 ↔ 槍）の新しい武器を取り出す",
      ],
    },
  },
];
