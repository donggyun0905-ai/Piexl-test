// 캐릭터 설명: 탈라시아 (토르켄) · 한·영·일 (수치는 weaponsThorken·itemsThorken과 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_THAL: Guide = {
  thorken: [
    "탈라시아 · 토르켄 · 자유의 바다를 누비는 뱃사람. 거대한 닻과 사슬로 이은 철구공으로 싸움 · 체력 120 · 공격력 12 · 이동 1.3 · 방어 5",
    "던지기: 철구공이 손에 있을 때 누르면 가까운 적(없으면 앞)으로 던짐 · 떨어진 자리에 물보라와 천둥 (둘레 피해 + 기절)",
    "휘두르기: 철구공이 나가 있으면 누를 때마다 닻을 넓게 휘두르고(공격력 250%, 느림) 사슬 끝 철구공이 나를 중심으로 크게 돌며 휩씀 · 공이 있던 쪽에서 바라보는 쪽을 지나 반대편까지 돌아서, 공을 어디에 두느냐에 따라 휩쓰는 길이 달라짐 · 멀어지면 공이 끌려옴",
    "대시하면 철구공을 감아 들임 → 다시 누르면 새로 던져 또 천둥 · 때릴수록 폭풍 게이지가 차고, 가득 차면 다음 휘두르기에 태풍(철구공을 따라다니며 적을 끌어당겨 때림) + 하늘에서 천둥 5번",
    "무기는 철구공만 바뀜 (10): 무쇠 · 조수(물결) · 뇌운(번개 튐) · 소용돌이 · 성게(가시) · 쌍둥이(공 둘) · 간헐천(물기둥) · 빙해(느려짐) · 크라켄(긴 사슬·사슬 베기) · 대해일(한 바퀴)",
    "전용 아이템 10: 순풍의 돛 · 갈매기 깃털 · 심해 진주 · 해방의 나침반 · 해방의 종 · 따개비 사슬 · 고래의 노래 · 바다의 삼지창 · 산호 갑옷 · 등대 (공용 아이템도 나옴)",
  ],
};

export const GUIDE_EN_THAL: Guide = {
  thorken: [
    "Thalassia · Thorken · a sailor of the free sea who fights with a giant anchor and a chained iron ball · 120 HP · 12 attack · 1.3 move · 5 defense",
    "Throw: with the ball in hand, a press hurls it at the nearest foe (or ahead) · where it lands, a splash and thunder (area damage + stun)",
    "Swing: with the ball out, each press swings the anchor wide (250% attack, slow) and the chained ball whips around you in a huge arc · it travels from where it lay, past where you face, to the far side, so where you leave the ball shapes the sweep · walk away and the ball is dragged along",
    "Dash reels the ball back → the next press throws it again for more thunder · hits fill the Storm gauge; when full, your next swing calls a typhoon (follows the ball, pulling and striking foes) + 5 thunderbolts from the sky",
    "Only the ball changes as a weapon (10): Iron · Tide (waves) · Thundercloud (forking lightning) · Whirlpool · Urchin (spines) · Twin (two balls) · Geyser (water pillar) · Ice Floe (slow) · Kraken (long chain that cuts) · Maelstrom (full circle)",
    "10 exclusive items: Tailwind Sail · Gull Feather · Deep-Sea Pearl · Compass of Liberty · Bell of Liberty · Barnacle Chain · Whale Song · Sea Trident · Coral Armor · Lighthouse (common items also appear)",
  ],
};

export const GUIDE_JA_THAL: Guide = {
  thorken: [
    "タラシア · トルケン · 自由の海を駆ける船乗り。巨大な錨と鎖でつないだ鉄球で戦う · 体力120 · 攻撃力12 · 移動1.3 · 防御5",
    "投げ: 鉄球が手にあるとき押すと近くの敵（いなければ前）へ投げる · 落ちた場所に水しぶきと雷（周りにダメージ + 気絶）",
    "振り: 鉄球が出ていると押すたびに錨を広く振り（攻撃力250%、遅い）、鎖の先の鉄球が自分を中心に大きく回って薙ぐ · 球があった方から向いている方を越えて反対側まで回るので、球をどこに置くかで薙ぐ道が変わる · 離れると球が引きずられる",
    "ダッシュで鉄球を巻き戻す → 次に押すとまた投げて雷 · 当てるほど嵐ゲージがたまり、満ちると次の振りで台風（鉄球について回り敵を引き寄せて打つ）+ 空から雷5回",
    "武器は鉄球だけが変わる（10）: 鉄 · 潮（波） · 雷雲（雷が跳ぶ） · 渦潮 · ウニ（トゲ） · 双子（球が2つ） · 間欠泉（水柱） · 氷海（鈍化） · クラーケン（長い鎖・鎖で斬る） · 大海嘯（一回転）",
    "専用アイテム10: 順風の帆 · カモメの羽 · 深海の真珠 · 解放の羅針盤 · 解放の鐘 · フジツボの鎖 · クジラの歌 · 海の三叉槍 · 珊瑚の鎧 · 灯台（共通アイテムも出る）",
  ],
};
