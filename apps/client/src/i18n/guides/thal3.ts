// 캐릭터 설명: 탈라시아 3 (훅) · 한·영·일 (수치는 weaponsHook·itemsHook과 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_THAL3: Guide = {
  hook: [
    "탈라시아 · 훅 · 자유의 바다를 누비는 해적 · 체력 115 · 공격력 13 · 이동 1.3 · 행운 2",
    "갈고리: 누르면 바라보는 쪽으로 커다란 빛 갈고리를 던짐 (거리 120) · 지나가는 적을 걸어(최대 3, 공격력 30%) 내 앞까지 끌어옴",
    "더블배럴 산탄총: 갈고리가 돌아오면 품속 산탄총으로 앞 부채꼴에 초근접 발사 (공격력 100%, 끌려온 적은 130%) · 끌려온 적은 원래 있던 자리로 튕겨 날아가고, 아닌 적은 뒤로 밀려남",
    "난파: 튕겨 날아가던 적이 벽·기둥에 부딪히면 추가 피해(공격력 80%) + 기절",
    "밧줄 타기: 빈 갈고리가 벽에 박히면 밧줄을 타고 그 벽으로 날아가(날아가는 동안 무적) 내리며 방 쪽으로 쏨 · 보스에 걸면 내가 보스 코앞으로 끌려가 쏘고 원래 자리로 튕겨 돌아옴",
    "무기 6: 녹슨 갈고리 · 크라켄 갈고리(2마리 더) · 작살 갈고리(멀리·빠르게) · 폭풍탄 산탄총(번개) · 용의 숨결탄(넓게·불) · 역조 갈고리(멀리 밀어냄·난파 2배)",
    "전용 아이템 10: 닻사슬 · 네 갈래 갈고리 · 밧줄 그네 · 쌍발 연사 · 흑색 화약 · 난파선 · 약탈 · 럼주 한 병 · 해골 깃발 · 자유의 돛 (공용 아이템도 나옴)",
  ],
};

export const GUIDE_EN_THAL3: Guide = {
  hook: [
    "Thalassia · Hook · a pirate roaming the sea of freedom · HP 115 · ATK 13 · Move 1.3 · Luck 2",
    "Hook: press to throw a giant spectral hook where you face (range 120) · it snags foes along the way (up to 3, 30% ATK) and reels them right in front of you",
    "Double-barrel shotgun: when the hook returns, a shotgun from the coat fires point-blank in a forward cone (100% ATK, 130% to hooked foes) · hooked foes fly back to where they were, others are pushed away",
    "Wreck: a foe flying back into a wall or pillar takes extra damage (80% ATK) and is stunned",
    "Rope swing: an empty hook that sticks into a wall swings you over to it (invulnerable while flying) and you fire back into the room as you land · hook a boss and you are pulled point-blank, fire, then bounce back",
    "6 weapons: Rusty Hook · Kraken Hook (2 more foes) · Harpoon Hook (farther, faster) · Stormshot Scattergun (lightning) · Dragon's Breath Shells (wider, burn) · Undertow Hook (pushes farther, 2x wreck)",
    "10 exclusive items: Anchor Chain · Grapnel · Rope Swing · Double Tap · Black Powder · Shipwreck · Plunder · Bottle of Rum · Jolly Roger · Sail of Freedom (shared items also drop)",
  ],
};

export const GUIDE_JA_THAL3: Guide = {
  hook: [
    "タラシア · フック · 自由の海を駆ける海賊 · 体力115 · 攻撃力13 · 移動1.3 · 運2",
    "フック：押すと向いている方へ大きな光のフックを投げる（距離120）· 通り道の敵を掛けて（最大3、攻撃力30%）目の前まで引き寄せる",
    "ダブルバレル散弾銃：フックが戻ると懐の散弾銃で前方の扇形へ零距離射撃（攻撃力100%、引き寄せた敵は130%）· 引き寄せた敵は元の場所へ吹き飛び、ほかの敵は後ろへ押される",
    "難破：吹き飛んだ敵が壁・柱に当たると追加ダメージ（攻撃力80%）＋気絶",
    "ロープ移動：空のフックが壁に刺さるとロープでその壁へ飛び（飛んでいる間無敵）着地しながら部屋の方へ撃つ · ボスに掛けると自分がボスの目の前へ引き寄せられて撃ち、元の場所へ跳ね返る",
    "武器6：錆びたフック · クラーケンのフック（2体多く）· 銛のフック（遠く・速く）· 嵐弾の散弾銃（雷）· 竜の息吹弾（広く・火）· 逆潮のフック（遠くへ押し出す・難破2倍）",
    "専用アイテム10：錨の鎖 · 四爪錨 · ロープブランコ · 二連射 · 黒色火薬 · 難破船 · 略奪 · ラム酒一瓶 · 海賊旗 · 自由の帆（共用アイテムも出る）",
  ],
};
