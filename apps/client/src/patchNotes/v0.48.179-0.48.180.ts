import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.180",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 경기장 25개 추가: 대결 유형마다 5개 (1대1·토너먼트 · 2대2 · 3대3 · 5대5 · 대난투 · 데스매치) · 진흙(느려짐)·용암(피해)·얕은 물·차례로 솟는 가시·연못·수풀 등 지형이 저마다 다름",
        "대결을 고른 뒤 경기장 고르기 (다섯 개 중 하나 또는 무작위) · 친구와 같이 하기는 방장이 고름 · 랭크전은 늘 무작위",
        "새 대결 2대2 추가",
        "1대1·2대2·3대3·5대5·토너먼트는 3판 2선승: 판마다 다시 3·2·1 준비, 위쪽 가운데에 이긴 판 수, 판이 끝나면 '이번 판 승리/패배'",
        "패왕전 평타 크기 줄임: 영사 실은 방 끝까지가 아니라 앞으로 짧게, 학살자 대낫 콤보는 범위를 줄임 (큰 공격은 스킬 개편에서 스킬로 옮김)",
      ],
      en: [
        "25 new Champion Clash arenas: five for each battle type (1v1/Tournament · 2v2 · 3v3 · 5v5 · Brawl · Deathmatch) with varied terrain: mud (slow), lava (damage), shallow water, cycling spikes, ponds, bushes and more",
        "Choose an arena after picking a battle (one of five or random) · in friend rooms the host picks · Ranked is always random",
        "New battle: 2v2",
        "1v1, 2v2, 3v3, 5v5 and Tournament are now best of 3: each round starts with a fresh 3·2·1, the top shows rounds won, and each round ends with 'Round won/lost'",
        "Smaller basic attacks in Champion Clash: Silk's threads reach a short way ahead instead of across the arena, and the Slayer's scythe combo covers less ground (big attacks move to skills in the skill rework)",
      ],
      ja: [
        "覇王戦の闘技場を25個追加: 対決タイプごとに5つ (1対1・トーナメント · 2対2 · 3対3 · 5対5 · 大乱闘 · デスマッチ) · 泥 (遅くなる)・溶岩 (ダメージ)・浅い水・順に飛び出すトゲ・池・茂みなど地形がそれぞれ違う",
        "対決を選んだあと闘技場を選ぶ (5つから1つかランダム) · 友だちと一緒は部屋主が選ぶ · ランク戦は常にランダム",
        "新しい対決 2対2 を追加",
        "1対1・2対2・3対3・5対5・トーナメントは3本中2本先取: ラウンドごとに3・2・1の準備、上の中央に勝ったラウンド数、ラウンド終了時に「このラウンド勝利/敗北」",
        "覇王戦の通常攻撃を小さく: 影糸使いの糸は闘技場の端までではなく前方に短く、虐殺者の大鎌コンボは範囲を縮小 (大きな攻撃はスキル改編でスキルへ移す)",
      ],
    },
  },
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
];
