// 캐릭터 설명: 실베르 (인형술사) · 한·영·일 (수치는 weaponsPuppet·itemsPuppet·factionDefs.FACTION_GROWTH와 맞춤) — silber.ts가 커서 나눔
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SILBER2: Guide = {
  puppeteer: [
    "실베르 · 인형술사 '붉은 실로 인형을 부리는 소녀' · 체력 90 · 공격력 7 · 이동 1.2 · 행운 1 · 처음엔 약하지만 패시브를 먹을수록 강해짐 (진영 특징: 패시브 하나마다 최대 체력 +3 · 공격력·공격 속도·투사체 속도 +2% · 이동 속도 +1%, 30개까지)",
    "실 조종: 마우스 자리가 곧 반투명한 커다란 손 (손이 닿는 거리 140까지 · 사거리 증가만큼 멀리·크게) · 짧게 클릭 = 손 크기(반지름 20) 아래로 실을 내리쳐 공격력의 130% (0.27초마다, 공격 속도가 빠를수록 자주)",
    "꾹 누르기 = 손 아래 적에게 실을 걸어 조종 게이지를 채움 (약 1.3초 · 체력이 많은 적일수록 최대 3배 오래) → 가득 차면 머리 위에 나무 왕관이 씌워지고 아군이 됨 (보스 빼고 · 최대 3) · 게이지를 채우는 동안 그 적이 피해를 받거나 나를 때리면 0으로 · 손이 떠나면 조금씩 줄어듦 · 왕관 쓴 아군은 원래 체력의 1.5배로 나를 따라다니며 가까운 적을 때림 (공격력의 90%) · 방을 옮기면 같이 옴 · 자동 조준이면 조종할 수 있는 적은 조종하고 아니면 계속 내리침",
    "무기: 인형술사의 손 하나 · 전용 아이템 20 (모두 새 기술·능력 + 능력치): 미니 인형 8종(리본·태엽·광대·신사·공주·춤추는·빨간 망토·고양이 — 때릴 때 확률로 내 쪽에서 나와 적에게 달려가 터짐) · 시체 폭발 · 내 친구~(거대 인형 친구) · 검은 실 · 분신 · 네 번째 왕관 · 실타래 · 긴 실 · 거미줄 · 꼭두각시 춤 · 마지막 인사 · 바느질 · 금사슬",
  ],
};

export const GUIDE_EN_SILBER2: Guide = {
  puppeteer: [
    "Silber · Puppeteer, the girl who works dolls on red strings · 90 HP · 7 damage · 1.2 move · 1 luck · weak at first but grows with every passive (faction trait: each passive grants +3 max HP · +2% damage, attack speed and projectile speed · +1% move speed, up to 30)",
    "String Control: your cursor is a giant translucent hand (reaching up to 140 · farther and bigger with range) · tap = whip threads down under the hand (radius 20) for 130% of damage (every 0.27s, more often with attack speed)",
    "Hold = string the foe under your hand and fill a control gauge (about 1.3s · up to 3x longer for tougher foes) → when full, a wooden crown lands on its head and it becomes your ally (not bosses · up to 3) · the gauge resets if that foe takes damage or hits you, and slowly drains while your hand is away · crowned allies have 1.5x their HP, follow you and hit nearby foes (90% of damage) · they follow you between rooms · with auto-aim you control what you can and whip the rest",
    "Weapon: one Puppeteer's Hand · 20 exclusive items (each unlocks a new skill or ability + stats): 8 mini dolls (Ribbon · Wind-up · Jester · Gentleman · Princess · Dancing · Red Hood · Cat — thread strikes may send one from you to rush a foe and burst) · Corpse Burst · My Friend~ (giant doll friend) · Black Thread · Doppelganger · Fourth Crown · Spool · Long Thread · Cobweb · Marionette Dance · Final Bow · Stitching · Golden Chain",
  ],
};

export const GUIDE_JA_SILBER2: Guide = {
  puppeteer: [
    "シルベル・人形使い『赤い糸で人形を操る少女』・体力90・攻撃力7・移動1.2・幸運1・最初は弱いがパッシブを得るほど強くなる（陣営の特徴：パッシブ1つごとに最大体力+3・攻撃力・攻撃速度・弾速+2%・移動速度+1%、30個まで）",
    "糸操り：カーソルが半透明の大きな手になる（手が届く距離140まで・射程増加で遠く大きく）・短くクリック＝手の大きさ（半径20）だけ下へ糸を叩きつけ攻撃力の130%（0.27秒ごと、攻撃速度が速いほど頻繁）",
    "長押し＝手の下の敵に糸をかけ操りゲージをためる（約1.3秒・体力が多い敵ほど最大3倍長く）→満タンで頭に木の冠がかぶさり味方になる（ボス以外・最大3）・ためている間にその敵がダメージを受けるか自分を叩くと0に・手が離れると少しずつ減る・冠をかぶった味方は元の体力の1.5倍で自分について回り近くの敵を叩く（攻撃力の90%）・部屋を移ると一緒に来る・自動照準なら操れる敵は操り、それ以外は叩き続ける",
    "武器：人形使いの手ひとつ・専用アイテム20（すべて新しい技・能力＋能力値）：ミニ人形8種（リボン・ゼンマイ・道化・紳士・姫・踊る・赤ずきん・猫 — 叩くと確率で自分から飛び出し敵に突っ込んで弾ける）・死体爆発・ぼくのともだち〜（巨大人形の友達）・黒い糸・分身・四つ目の冠・糸巻き・長い糸・蜘蛛の巣・操り人形の舞・最後のお辞儀・縫い合わせ・金の鎖",
  ],
};
