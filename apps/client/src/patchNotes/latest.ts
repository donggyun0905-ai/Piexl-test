import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.179",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 시작: 맵이 나오고 3초 동안 아무도 못 움직이며 화면 가운데 3·2·1·START! · 준비 동안 내 편은 파란 오라, 상대는 빨간 오라 · 내 캐릭터 위에 큰 초록 화살표",
        "패왕전 처음 보호막(300)을 없애고 모두가 받는 피해·회복을 조금 줄임 (서로 안 피하고 맞붙으면 대개 10초 안에 끝남) · 맞은 뒤 깜빡이며 무적이 되는 것을 없앰",
        "패왕전 모든 대결에 사용 아이템(회복약·폭탄·수호 부적·얼음 시계)과 강화 구슬(초록 회복 · 주황 공격 속도 · 하늘색 이동 속도)이 떨어짐 · 대난투의 무기·패시브 떨어뜨리기는 없앰",
        "패왕전 얼음 시계: 누른 곳으로 얼음 폭탄을 던져 범위 안 상대를 1.5초 얼림",
        "패왕전 화면: 내 체력 줄은 초록, 다른 사람은 편 색 · 체력 줄을 캐릭터 그림 머리 위에 정확히 · 위쪽에 내 준 피해·받은 피해, 점수판에 사람마다 준 피해·받은 피해 · 능력치 창·위쪽 정보 줄·맞는 범위 버튼·아래 조작 안내를 숨기고 화면을 좌우 빈칸 없이 꽉 채움 · 공격 범위 원은 늘 보이고 상대가 범위 안이면 빨강",
        "수풀에 숨으면 상대에게 보이지 않음 (아주 가까이 오면 보임), 나와 내 편은 반투명 (패왕전·무한 모드 AI 대결)",
        "모든 모드: 무적 보호막은 빛나는 육각 방패막, 보호막 점수는 금빛 막으로 · 회복하면 몸에 초록 빛과 + 표시",
        "패왕전 대결 방법 안내 (대결 고르기의 '대결 방법', 처음 한 번 저절로 열림)",
        "고침: 쓰러진 사람의 탄·장치·효과가 남아 보이던 것 · 데스매치에서 남이 쓴 필살기 이름이 내 머리 위에 뜨던 것 · 쓰러진 뒤 나가기를 누르면 나가지 않고 보는 사람만 바뀌던 것 · 같이 하기에서 남의 공격으로 내 한정 스킨 효과가 나던 것 · 패왕전에 협동용 '친구 살리기' 안내가 뜨고 회복약으로 쓰러진 사람을 살릴 수 있던 것",
      ],
      en: [
        "Champion Clash start: after the arena appears, no one can move for 3 seconds while 3·2·1·START! counts down · during the ready time allies glow blue and rivals red · a big green arrow marks your character",
        "Champion Clash: the 300 starting shield is gone, and damage taken and healing are slightly reduced for everyone (a toe-to-toe fight usually ends within 10 seconds) · no more flashing invincibility after a hit",
        "Every Champion Clash battle now drops consumables (potion, bomb, ward, frost clock) and power orbs (green heal · orange attack speed · sky-blue move speed) · Brawl no longer drops weapons or passives",
        "Champion Clash frost clock: throws an ice bomb where you aim, freezing rivals in range for 1.5s",
        "Champion Clash screen: your HP bar is green, others use team colors · HP bars sit right above each character's head · your damage dealt and taken at the top, and per player on the scoreboard · the stats panel, top info line, hitbox button and bottom control hints are hidden and the view fills the screen with no side gaps · the attack range circle is always shown and turns red when a rival is in range",
        "Hiding in a bush makes you invisible to rivals (unless they come very close), while you and allies look translucent (Champion Clash and Endless AI duels)",
        "All modes: invincibility shields now look like glowing hexagonal barriers and shield points like a golden film · healing makes your body glow green with rising + marks",
        "Champion Clash How to play guide (the 'How to play' button on the battle list, opens once on your first visit)",
        "Fixed: a fallen player's shots, devices and effects lingering · in Deathmatch, someone else's ultimate name appearing over your head · pressing Exit after falling only switched the watched player · in co-op, other players' attacks triggering your limited skin effects · Champion Clash showing the co-op revive prompt and letting potions revive fallen players",
      ],
      ja: [
        "覇王戦の開始: 闘技場が出たあと3秒間は誰も動けず、画面中央に3・2・1・START! · 準備中は味方が青いオーラ、相手が赤いオーラ · 自分のキャラの上に大きな緑の矢印",
        "覇王戦の開始時シールド (300) をなくし、全員の被ダメージと回復を少し減らした (避けずに殴り合うとたいてい10秒以内に決着) · 被弾後に点滅して無敵になる仕組みをなくした",
        "覇王戦のすべての対決で使用アイテム (回復薬・爆弾・守りの札・氷の時計) と強化オーブ (緑は回復 · オレンジは攻撃速度 · 水色は移動速度) が落ちる · 大乱闘の武器・パッシブのドロップはなくした",
        "覇王戦の氷の時計: 狙った所に氷の爆弾を投げ、範囲内の相手を1.5秒凍らせる",
        "覇王戦の画面: 自分の体力バーは緑、他の人はチーム色 · 体力バーをキャラの頭のすぐ上に · 上に自分の与ダメ・被ダメ、スコアボードに一人ずつの与ダメ・被ダメ · 能力値ウィンドウ・上の情報行・当たり判定ボタン・下の操作案内を隠し、左右の空きなく画面いっぱいに · 攻撃範囲の円は常に表示、相手が範囲内なら赤",
        "茂みに隠れると相手から見えない (すぐ近くなら見える)、自分と味方は半透明 (覇王戦・無限モードのAI対決)",
        "全モード: 無敵シールドは光る六角形のバリア、シールドポイントは金色の膜に · 回復すると体が緑に光り + が浮かぶ",
        "覇王戦の遊び方ガイド (対決選びの「対決の遊び方」、初回に一度自動で開く)",
        "修正: 倒れた人の弾・装置・エフェクトが残って見えていた · デスマッチで他人が使った必殺技の名前が自分の頭上に出ていた · 倒れた後に退出を押しても出られず観戦相手だけ変わっていた · 協力プレイで他人の攻撃で自分の限定スキン効果が出ていた · 覇王戦で協力用の「仲間を起こす」案内が出て、回復薬で倒れた人を起こせていた",
      ],
    },
  },
  {
    version: "0.48.178",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 편 구별: 캐릭터 외곽선이 편 색(우리 편 파랑 · 상대 빨강)으로 바뀌고 스킨 외곽선은 가려짐 · 초록 체력 줄을 없애고 편 색 체력 줄 하나로 (나도 표시)",
        "패왕전 화면 다듬기: 위쪽 점수판(편마다 처치 수 · 남은 사람 점) · 모드 목표 안내 · 가장 가까운 적 이름 표시",
        "가장 가까운 적을 내 몸 둘레의 빨간 화살표가 가리키고, 그 적에게 빨간 조준 표시와 머리 위 꺾쇠가 붙음",
        "처치 알림: 오른쪽 위에 누가 누구를 쓰러뜨렸는지 · 내가 처치하면 가운데 큰 글자(더블·트리플 킬) · 쓰러지면 안내와 다시 나오기까지 초",
      ],
      en: [
        "Champion Clash teams: character outlines now use team colors (allies blue, rivals red) and hide skin outlines · the green HP bar is gone, leaving one team-colored HP bar (shown for you too)",
        "Champion Clash HUD polish: top scoreboard (team KOs and alive dots) · mode goal · nearest rival's name",
        "A red arrow around you points at the nearest rival, who gets a red target mark and a bouncing marker overhead",
        "KO alerts: a top-right feed of who took down whom · big center text when you score (Double/Triple KO) · a notice with respawn countdown when you fall",
      ],
      ja: [
        "覇王戦のチーム区別: キャラクターの輪郭がチーム色 (味方は青・相手は赤) になり、スキンの輪郭は隠れる · 緑の体力バーをなくし、チーム色の体力バー1本に (自分にも表示)",
        "覇王戦の画面を改善: 上部スコアボード (チームごとの撃破数・残り人数の点) · モードの目標 · 一番近い敵の名前",
        "一番近い敵を自分の周りの赤い矢印が指し、その敵に赤い照準と頭上のマーカーが付く",
        "撃破通知: 右上に誰が誰を倒したか · 自分が倒すと中央に大きな文字 (ダブル・トリプル撃破) · 倒れると案内と復帰までの秒数",
      ],
    },
  },
  {
    version: "0.48.177",
    date: "2026-10-28",
    items: {
      ko: [
        "아카이브 스토리에 시즌 2 추가: 아카식 레코드 4장 「뒷면」 · 5장 「원군」 · 6장 「황혼의 종언」, 최종 보스에 검은 잔영·괴력난신·제천대성 (목록은 시즌 1·2로 나눠 보임)",
        "땅 물고기가 솟구쳐 공중에 떠 있는 시간이 길어져 때리기 쉬워짐 (0.7초 → 1.7초)",
        "베놈 독가스를 밟으면 독 상태이상 3초 (0.5초마다 피해, 가스를 나가도 남음) · 부식독(회복·재생 40% 감소)은 3초 → 6초",
      ],
      en: [
        "Season 2 added to the Archive story: Akashic Records Chapter 4 'The Other Side', Chapter 5 'Reinforcements', Chapter 6 'The End of Twilight', plus Black Umbra, Demigod of Might and Great Sage under Final Bosses (lists are split into Seasons 1 and 2)",
        "Land Fish now stays airborne longer after bursting out, making it easier to hit (0.7s → 1.7s)",
        "Stepping in Venom's poison gas now inflicts Poison for 3s (damage every 0.5s, lingers after leaving the gas) · Corrosion (healing and regen −40%) lasts 6s instead of 3s",
      ],
      ja: [
        "アーカイブのストーリーにシーズン2を追加: アカシックレコード第4章「裏側」・第5章「援軍」・第6章「黄昏の終焉」、最終ボスに黒い残影・怪力乱神・斉天大聖 (一覧はシーズン1・2に分けて表示)",
        "土ザカナが飛び出して宙に浮いている時間が長くなり、攻撃を当てやすくなった (0.7秒 → 1.7秒)",
        "ヴェノムの毒ガスを踏むと毒の状態異常3秒 (0.5秒ごとにダメージ、ガスを出ても残る) · 腐食毒 (回復・再生40%減少) は3秒 → 6秒",
      ],
    },
  },
  {
    version: "0.48.176",
    date: "2026-10-28",
    items: {
      ko: [
        "방의 적을 다 잡으면 지형이 멈춤: 진흙·물에서 느려지지 않고, 용암·감전된 물·가시 함정·독가스 피해가 없음 (가시는 들어간 채)",
        "바닥 아이템이 늘 지형(진흙·용암·물·가시·독가스) 위에 보여서 가려지지 않음",
      ],
      en: [
        "Terrain stops once a room is cleared: no slowing in mud or water, and no damage from lava, shocked water, spike traps or poison gas (spikes stay down)",
        "Floor items are always drawn above terrain (mud, lava, water, spikes, poison gas), so they're never hidden",
      ],
      ja: [
        "部屋の敵を全滅させると地形が止まる: 泥・水で遅くならず、溶岩・感電した水・トゲの罠・毒ガスのダメージなし (トゲは引っ込んだまま)",
        "床のアイテムが常に地形 (泥・溶岩・水・トゲ・毒ガス) の上に表示され、隠れない",
      ],
    },
  },
  {
    version: "0.48.175",
    date: "2026-10-28",
    items: {
      ko: [
        "메인의 '스토리' 버튼이 '아카이브'로 바뀜: 누르면 메뉴 창에서 스토리(그대로)와 새 티어표를 고름",
        "티어표: 반신급·국밥급·중간계·애매함·쓰레기 다섯 단계 · 전체/시즌 1/시즌 2 · 캐릭터 얼굴에 마우스를 올리면 그 자리인 이유",
        "티어표에서 캐릭터 얼굴을 누르면 아래에서 그 캐릭터가 시작 무기로 허수아비를 때리는 미리보기 (피해 숫자·초당 피해)",
      ],
      en: [
        "The main 'Story' button is now 'Archive': it opens a menu with Story (unchanged) and the new Tier List",
        "Tier List: five tiers (Demigod, Reliable, Middle, Awkward, Struggling) · All / Season 1 / Season 2 · hover a character face to see why it sits there",
        "Click a face in the Tier List to watch that character hit the dummy with its starting weapon below (damage numbers, DPS)",
      ],
      ja: [
        "メインの「ストーリー」ボタンが「アーカイブ」に: 押すとメニューでストーリー（そのまま）と新しいティア表を選べる",
        "ティア表: 半神級・定番級・中間・微妙・苦戦の5段階 · 全体/シーズン1/シーズン2 · キャラの顔にマウスを乗せるとその位置の理由",
        "ティア表でキャラの顔を押すと、下でそのキャラが初期武器でカカシを叩くプレビュー（ダメージ数字・秒間ダメージ）",
      ],
    },
  },
];
