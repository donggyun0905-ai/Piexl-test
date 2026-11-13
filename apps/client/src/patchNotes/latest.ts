import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.64",
    date: "2026-11-13",
    items: {
      ko: ["무적인 적(레이드 보스·차례가 아닌 탑 등)을 때리면 피해가 안 들어간다는 \"텅\" 소리 · 방패·흰 보호막이 있는 적을 때리면 보호막 맞는 소리, 다 깨지면 깨지는 소리"],
      en: ["Hitting an invulnerable enemy (raid bosses, towers not on their turn, etc.) plays a hollow \"clonk\" so you know no damage got through · hitting an enemy's shield or white barrier plays a shield-hit sound, and a break sound when it is gone"],
      ja: ["無敵の敵（レイドボス・順番でない塔など）を攻撃するとダメージが入らないことが分かる「カーン」という音・盾や白いシールドを持つ敵を攻撃するとシールドに当たる音、壊れると割れる音"],
    },
  },
  {
    version: "0.52.63",
    date: "2026-11-13",
    items: {
      ko: [
        "게임 중 알림 소리: 안 깬 방에 들어가면 문 잠김(쿵·철컥) · 방을 정리하면 돌문 열림 · 보상이 한꺼번에 나오면 상자 열림 · 바닥 아이템 떨어짐(동전 짤랑·무기 챙그랑·패시브 반짝·사용 아이템 유리병) · 적이 새로 나타남",
        "내 탄이 벽에 맞음 · 보호막 깨짐(내 보호막이 남은 채 꺼질 때·적 방패) · 적 방패·받아 넘김에 막힌 타격 · 버프 끝 · 체력이 꽉 참 · 3초 넘게 기다린 스킬이 다시 준비됨",
      ],
      en: [
        "In-game cue sounds: door locks (thud and clank) when entering an uncleared room · stone door opens when the room is cleared · chest opening when several rewards appear at once · item drops (coin jingle, weapon clang, passive sparkle, potion clink) · new enemies appearing",
        "Your shots hitting walls · shield breaking (your shield ending early or an enemy shield) · blocked hits on enemy shields and parries · buff ending · HP full · a skill with a 3s+ cooldown ready again",
      ],
      ja: [
        "ゲーム中のお知らせ音：未クリアの部屋に入ると扉が閉まる（ドン・ガチャン）・部屋をクリアすると石の扉が開く・報酬がまとめて出ると宝箱が開く・床にアイテムが落ちる（コイン・武器・パッシブ・使用アイテムの瓶）・敵が新しく現れる",
        "自分の弾が壁に当たる・シールドが割れる（自分のシールドが途中で消えたとき・敵の盾）・敵の盾や受け流しで防がれた攻撃・バフ終了・HPが満タン・3秒以上待ったスキルが再び使える",
      ],
    },
  },
  {
    version: "0.52.62",
    date: "2026-11-13",
    items: {
      ko: [
        "상태이상 효과음: 지속 피해 16종마다 다른 소리 (화상 지글지글 · 업화·청염 화르륵 · 출혈 찢김 · 독·부패 보글보글 · 감전·폭풍 지지직 · 냉기 얼음 금 · 해일 촤 · 저주·죽음·공허 웅웅 · 황금·광휘·달빛 종소리)",
        "빙결(냉기 뒤 경직)·얼음 시계는 얼어붙는 소리, 풀리면 얼음 깨지는 소리 · 경직 띠잉 · 느려짐 · 속박 · 공포 걸릴 때도 소리",
        "메뉴 소리: 확인·닫기·탭·켜고 끄기·창 열기마다 다른 소리 · 상점에서 사기(동전 짤랑)·입기 · 쿠폰이 모자라면 안 됨 소리",
        "뽑기 소리: 봉투 찢는 소리 · 뜯김 · 카드 깔림 · 뒤집힘 · 결과마다 다른 등장 소리 (한정 스킨은 큰 팡파르)",
        "효과음 다듬기: 삑 튀던 소리를 부드럽게 · 단순했던 소리 25개를 결 있는 소리로 바꿈",
      ],
      en: [
        "Status sounds: each of the 16 damage-over-time types has its own sound (burn sizzle · hellfire/blue flame roar · bleed tear · poison/rot bubbles · shock/storm crackle · frost ice crack · tide splash · curse/death/void hum · gold/radiance/moon chimes)",
        "Freeze (stun right after frost) and the Ice Clock play a freezing sound, then an ice-shatter sound when they end · stun, slow, root and fear also have sounds",
        "Menu sounds: different sounds for confirm, close, tabs, toggles and opening windows · buying (coin jingle) and equipping in shops · a denied sound when you lack coupons",
        "Gacha sounds: envelope tearing · rip open · cards dealt · card flip · a different reveal sound per result (big fanfare for limited skins)",
        "Sound polish: harsh beeps are softer · 25 plain sounds were remade with more texture",
      ],
      ja: [
        "状態異常の効果音：継続ダメージ16種それぞれに別の音（火傷ジュウジュウ・業火/青炎ゴォッ・出血の裂ける音・毒/腐敗ブクブク・感電/嵐バチバチ・冷気の氷のひび・津波ザバッ・呪い/死/虚無ウォン・黄金/光輝/月光の鐘）",
        "凍結（冷気の直後の硬直）と氷の時計は凍りつく音、解けると氷が割れる音・硬直・鈍化・束縛・恐怖にも音",
        "メニューの音：決定・閉じる・タブ・オンオフ・ウィンドウを開くでそれぞれ違う音・ショップの購入（コインの音）と装備・クーポン不足のときの音",
        "ガチャの音：袋を破る音・開封・カードが並ぶ・めくる・結果ごとに違う登場音（限定スキンは大きなファンファーレ）",
        "効果音の調整：耳に刺さるピー音をやわらかく・単純だった25個の音を厚みのある音に作り直し",
      ],
    },
  },
  {
    version: "0.52.61",
    date: "2026-11-13",
    items: {
      ko: ["루주: 재생 가속이 잘못 붙어 있던 것을 뺌 (재생 가속은 느아르만)"],
      en: ["Rouge: removed the Regen Boost that was wrongly applied (Regen Boost is Noir only)"],
      ja: ["ルージュ：誤って付いていた再生加速を削除（再生加速はノワールのみ）"],
    },
  },
  {
    version: "0.52.60",
    date: "2026-11-13",
    items: {
      ko: ["느아르: 재생 가속을 절반으로 (재생력 회복 2.5배 → 1.25배)"],
      en: ["Noir: Regen Boost halved (regeneration 2.5× → 1.25×)"],
      ja: ["ノワール：再生加速を半分に（再生力の回復 2.5倍 → 1.25倍）"],
    },
  },
  {
    version: "0.52.59",
    date: "2026-11-13",
    items: {
      ko: [
        "아슈바르(느아르·루주): 성좌의 방에서 다음 방으로 못 나가던 문제 고침 · 단련의 방도 못 씀(레이드 단련 포인트도 없음)",
        "아슈바르 적응력: 레벨마다 흑 필요량 2배 · 승격은 실패해도 확률이 오르지 않음 · 레벨업·승격에서 방어력이 오르지 않음 · 사거리 증가가 공격 범위·이펙트 크기에 들어가지 않음",
        "느아르: 결계 붕괴 이펙트를 반으로 줄임",
      ],
      en: [
        "Ashvar (Noir · Rouge): fixed being stuck in the constellation room · training rooms can no longer be used either (no raid training points)",
        "Ashvar Adaptation: each level needs twice as much Black · promotion chance no longer rises on failure · level-ups and promotion no longer give defense · range bonuses no longer enlarge attacks or effects",
        "Noir: Barrier Collapse effect is half as big",
      ],
      ja: [
        "アシュヴァル（ノワール・ルージュ）：星座の部屋から次の部屋へ出られなかった問題を修正・鍛錬の部屋も使えない（レイドの鍛錬ポイントもなし）",
        "アシュヴァルの適応力：各レベルの黒の必要量が2倍・昇格は失敗しても確率が上がらない・レベルアップ・昇格で防御力が上がらない・射程増加が攻撃範囲・エフェクトの大きさに入らない",
        "ノワール：結界崩壊のエフェクトを半分に",
      ],
    },
  },
  {
    version: "0.52.58",
    date: "2026-11-13",
    items: {
      ko: [
        "새 캐릭터 루주 (아슈바르의 빨강, 로비 칩 45만): 장미쌍검 하나 · 패시브 없음 · 적응력(흑 게이지·레벨업·강화·승격)과 제약은 느아르와 같음",
        "루주 혈장미: 공격할 때 확률로 바닥에 작은 장미 → 닿은 적은 고정 피해 1 + 출혈 · 루주의 출혈은 2배 빠르고 5스택까지",
        "루주 공격: 적장미 쌍검격 · 혈염 난무 · 광란의 회전참 · 장미 가시 찌르기 · 추가 공격 혈화 개화 · 장미꽃잎 폭풍 · 선혈 가시숲 · 업화의 장미 · 스킬 혈영 돌진/혈화 만개 · 장미 낙인/광란의 혈검무 · 쌍검 혈월참/붉은 장미의 장례 · 진홍의 폭우/종언의 혈장미(방의 장미를 모아 터뜨림)",
      ],
      en: [
        "New character Rouge (the Red of Ashvar, 450,000 lobby chips): one pair of Twin Rose Blades · no passives · Adaptation (Black gauge, level-ups, upgrades, promotion) and the restriction work like Noir's",
        "Rouge's Blood Rose: attacks sometimes bloom small roses on the floor → foes touching them take 1 fixed damage + Bleed · Rouge's Bleed ticks twice as fast and stacks up to 5",
        "Rouge attacks: Crimson Rose Cross · Blood Flame Frenzy · Frenzied Spin Slash · Rose Thorn Thrust · extra attacks Blood Blossom · Rose Petal Storm · Crimson Thorn Forest · Hellfire Rose · skills Blood Shadow Rush/Full Blood Bloom · Rose Brand/Frenzied Blood Dance · Twin Blood Moon/Funeral of Red Roses · Crimson Downpour/Final Blood Rose (gathers every rose in the room)",
      ],
      ja: [
        "新キャラ ルージュ（アシュヴァルの赤、ロビーチップ45万）：薔薇の双剣ひとつ・パッシブなし・適応力（黒ゲージ・レベルアップ・強化・昇格）と制約はノワールと同じ",
        "ルージュの血薔薇：攻撃時に確率で床に小さな薔薇 → 触れた敵に固定ダメージ1＋出血・ルージュの出血は2倍速く、5スタックまで",
        "ルージュの攻撃：赤薔薇双剣撃・血炎乱舞・狂乱の回転斬・薔薇の棘突き・追加攻撃 血花開花・薔薇の花びらの嵐・鮮血の棘森・業火の薔薇・スキル 血影突進/血花満開・薔薇の烙印/狂乱の血剣舞・双剣血月斬/赤薔薇の葬礼・真紅の豪雨/終焉の血薔薇（部屋の薔薇を集めて弾けさせる）",
      ],
    },
  },
];
