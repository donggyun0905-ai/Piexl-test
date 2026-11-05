import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.42",
    date: "2026-11-06",
    items: {
      ko: [
        "탈라시아 새 캐릭터 훅: 자유의 바다를 누비는 해적 (체력 115 · 공격력 13 · 이동 1.3, 여는 조건: 이동 속도 1.7 달성)",
        "누르면 커다란 빛 갈고리를 던져 지나가는 적을 걸고(최대 3) 내 앞까지 끌어온 뒤, 품속 더블배럴 산탄총으로 초근접 발사 · 맞은 적은 원래 있던 자리로 튕겨 날아가고 벽에 부딪히면 난파(추가 피해 + 기절)",
        "빈 갈고리가 벽에 박히면 밧줄을 타고 벽으로 날아가 내리며 쏨 · 보스에 걸면 보스 코앞으로 끌려가 쏘고 원래 자리로 튕겨 돌아옴",
        "갈고리 무기 6 (녹슨 · 크라켄 · 작살 · 폭풍탄 · 용의 숨결탄 · 역조) · 전용 아이템 10 · 빛 갈고리·밧줄·푸른 산탄 발사·난파 이펙트 · 효과음 · 그림 시트 · 패왕전 스킬",
      ],
      en: [
        "New Thalassia character Hook: a pirate roaming the sea of freedom (HP 115 · ATK 13 · Move 1.3, unlock: reach 1.7 move speed)",
        "Press to throw a giant spectral hook that snags foes along its path (up to 3) and reels them in, then a double-barrel shotgun from his coat fires point-blank · foes fly back to where they were and wreck on walls (extra damage + stun)",
        "An empty hook that sticks into a wall swings him over to it, firing as he lands · hook a boss and he is pulled point-blank, fires, then bounces back",
        "6 hook weapons (Rusty · Kraken · Harpoon · Stormshot · Dragon's Breath · Undertow) · 10 exclusive items · spectral hook, rope, blue shotgun blast and wreck effects · sounds · sprite sheet · Champion Clash skills",
      ],
      ja: [
        "タラシアの新キャラ フック：自由の海を駆ける海賊（体力115 · 攻撃力13 · 移動1.3、解放条件：移動速度1.7達成）",
        "押すと大きな光のフックを投げて通り道の敵を掛け（最大3）目の前まで引き寄せ、懐のダブルバレル散弾銃で零距離射撃 · 敵は元の場所へ吹き飛び、壁に当たると難破（追加ダメージ＋気絶）",
        "空のフックが壁に刺さるとロープで壁へ飛び着地しながら撃つ · ボスに掛けるとボスの目の前へ引き寄せられて撃ち、元の場所へ跳ね返る",
        "フック武器6（錆び · クラーケン · 銛 · 嵐弾 · 竜の息吹弾 · 逆潮）· 専用アイテム10 · 光のフック・ロープ・青い散弾・難破のエフェクト · 効果音 · スプライトシート · 覇王戦スキル",
      ],
    },
  },
  {
    version: "0.49.41",
    date: "2026-11-05",
    items: {
      ko: [
        "탈라시아 새 캐릭터 매드퀸: 해방의 바다를 다스리는 은빛 제독 (체력 100 · 공격력 11 · 이동 1.35, 여는 조건: 공격 속도 1.8 달성)",
        "손가락으로 가리키면 머리 위 미래형 대포가 터지는 포탄을 한 발씩 · 쏠 때마다 30% 확률로 맵 아무 곳에 네온 터렛(최대 4, 사거리 안 적을 저절로 쏨) · 30% 확률로 몸 양옆에 날개 무기(최대 4, 같이 레이저)",
        "터렛 4 + 날개 4가 모두 모이면 '전탄 일제사격': 맵 전체에 포탄이 쏟아지고 대포부터 다시 시작",
        "함대 무기 4 (해방의 파도포 · 적조 섬멸포 · 등대 번개포 · 산호 폭풍포, 대포·터렛·날개 색이 같이 바뀜) · 전용 아이템 10 (대포 아이템 셋으로 대포 최대 4문) · 포격·레이저·물보라 이펙트 · 효과음 · 그림 시트 · 패왕전 스킬",
      ],
      en: [
        "New Thalassia character Mad Queen: the silver admiral who rules the sea of liberty (HP 100 · ATK 11 · Move 1.35, unlock: reach 1.8 attack speed)",
        "Point a finger and the futuristic cannon above her head fires one exploding shell · each shot has a 30% chance to drop a neon turret anywhere on the map (up to 4, auto-fires at foes in range) and a 30% chance to add a wing weapon at her side (up to 4, fires lasers with her)",
        "With 4 turrets and 4 wings she unleashes an 'All-Guns Salvo': shells rain over the whole map, then it starts again from the cannon",
        "4 fleet weapons (Tide Liberator · Red Tide Annihilator · Lighthouse Thunder · Coral Tempest; cannon, turret and wing colors change together) · 10 exclusive items (up to 4 cannons with the three cannon items) · barrage, laser and spray effects · sounds · sprite sheet · Champion Clash skills",
      ],
      ja: [
        "タラシアの新キャラ マッドクイーン：解放の海を治める銀の提督（体力100 · 攻撃力11 · 移動1.35、解放条件：攻撃速度1.8達成）",
        "指さすと頭上の未来型大砲が爆発する砲弾を1発ずつ · 撃つたびに30%でマップのどこかにネオンタレット（最大4、射程内の敵を自動で撃つ）· 30%で体の両横に翼の武器（最大4、一緒にレーザー）",
        "タレット4と翼4がそろうと「全弾一斉射撃」：マップ全体に砲弾が降り注ぎ、大砲から再スタート",
        "艦隊武器4つ（解放の波動砲 · 赤潮殲滅砲 · 灯台の雷砲 · 珊瑚の嵐砲、大砲・タレット・翼の色が一緒に変わる）· 専用アイテム10（大砲アイテム3つで最大4門）· 砲撃・レーザー・しぶきのエフェクト · 効果音 · スプライトシート · 覇王戦スキル",
      ],
    },
  },
];
