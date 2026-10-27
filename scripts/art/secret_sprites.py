# 시즌 2 히든 캐릭터 방향 시트 (python3 scripts/art/secret_sprites.py) → apps/client/public/sprites/{miner,voyager,zeus}.png
# 몸·얼굴은 s2_common.person (시즌 1 그림체), 캐릭터마다 다른 것은 *_deco 꾸밈 함수에만
# 에테르 광부는 거대한 곡괭이를 들어서 64칸 (몸 크기는 32칸 캐릭터와 같음)
import math
from s2_common import hx, person, save_sheet

MINER = dict(
    skin=hx("#e8c4a4"), skinD=hx("#c09878"), eye=hx("#2a1a14"), eyeL=hx("#6a4a3a"), outline=hx("#4e4262"),
    top=hx("#c8503a"), arm=hx("#c8503a"), legs=hx("#3a5a8a"), legsD=hx("#26406a"), shoe=hx("#4a3020"),
    hair=hx("#6a4428"), hairD=hx("#4a2c18"), hairL=hx("#8a6040"),
    overall=hx("#3a5a8a"), overallD=hx("#26406a"), helmet=hx("#ffd040"), helmetD=hx("#c8a020"),
    lamp=hx("#c8fbff"), ether=hx("#5ad8e8"),
    shaft=hx("#1a2448"), shaftL=hx("#2e3e7a"), blade=hx("#2a5ad8"), bladeD=hx("#16306e"), edge=hx("#8ac8ff"), grip=hx("#0e1430"),
)

def big_pick(c, k, x, y, deg, L=26, H=14, bend=6):
    """거대한 곡괭이: 손 (x, y)에서 deg 방향(0 = 오른쪽, -90 = 위)으로 긴 남색 자루 · 끝에 가로로 걸친 ^ 파란 날 (양끝이 뾰족하게 가늘어짐)"""
    dx, dy = math.cos(math.radians(deg)), math.sin(math.radians(deg))
    nx, ny = -dy, dx
    # 자루 (손 뒤로 조금 · 손잡이 감은 부분은 더 짙게)
    for i in range(-3, L + 1):
        c.px(x + dx * i, y + dy * i, k["grip"] if i < 4 else k["shaft"])
        c.px(x + dx * i + nx, y + dy * i + ny, k["grip"] if i < 4 else k["shaftL"])
    ex, ey = x + dx * L, y + dy * L
    # 날: 가운데가 두껍고(3) 끝으로 갈수록 가늘게(1) · 앞쪽 가장자리는 밝은 날빛 · 뒤쪽은 짙은 남색
    for j in range(-H * 4, H * 4 + 1):
        s = j / 4
        u = abs(s) / H
        back = bend * u * u
        bx, by = ex + nx * s - dx * back, ey + ny * s - dy * back
        thick = 3 if u < 0.45 else 2 if u < 0.8 else 1
        for d in range(thick):
            col = k["edge"] if d == thick - 1 and thick > 1 else k["blade"] if d else k["bladeD"]
            c.px(bx + dx * (d - 1), by + dy * (d - 1), col)
    # 날 끝은 뾰족하게 한 칸 더 · 자루를 감싼 쇠고리
    for sg in (1, -1):
        c.px(ex + nx * (H + 1) * sg - dx * (bend + 1.5), ey + ny * (H + 1) * sg - dy * (bend + 1.5), k["edge"])
    c.px(ex, ey, k["edge"]); c.px(ex - dx, ey - dy, k["bladeD"])

def miner_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    if layer == "body":
        # 붉은 셔츠 위 파란 멜빵바지(가슴판·멜빵) · 허리에 하늘색 에테르 결정 주머니
        if v in ("front", "back"):
            c.rect(tx + 1, ty + 3, tw - 2, th - 3, k["overall"])
            c.px(tx + 1, ty, k["overall"]); c.px(tx + 1, ty + 1, k["overall"]); c.px(tx + 1, ty + 2, k["overall"])
            c.px(tx + tw - 2, ty, k["overall"]); c.px(tx + tw - 2, ty + 1, k["overall"]); c.px(tx + tw - 2, ty + 2, k["overall"])
            if v == "front":
                c.rect(cx - 1, ty + 4, 2, 2, k["overallD"]); c.px(tx + 1, ty + 3, k["helmet"]); c.px(tx + tw - 2, ty + 3, k["helmet"])
                c.px(tx + tw - 1, hip - 1, k["ether"]); c.px(tx + tw - 1, hip - 2, k["lamp"])
        else:
            c.rect(cx - 3, ty + 3, 6, th - 3, k["overall"]); c.px(cx - 1, ty, k["overall"]); c.px(cx - 1, ty + 1, k["overall"]); c.px(cx - 1, ty + 2, k["overall"])
            c.px(cx + 2, hip - 2, k["ether"])
    if layer == "hair":
        # 짧은 갈색 머리 (안전모 아래로 옆머리만)
        if v == "front":
            c.rect(hx0, hy + 2, hw, 2, k["hair"]); c.rect(hx0 - 1, hy + 2, 2, hh - 4, k["hair"]); c.rect(hx0 + hw - 1, hy + 2, 2, hh - 4, k["hair"])
        elif v == "back":
            c.rect(hx0 - 1, hy + 2, hw + 2, hh - 2, k["hair"]); c.rect(hx0, hy + hh - 1, hw, 1, k["hairD"])
        else:
            c.rect(hx0, hy + 2, hw, 2, k["hair"]); c.rect(hx0 - 1, hy + 2, 4, hh - 3, k["hair"])
    if layer == "hat":
        miner_pick(c, k, g)
        # 노란 안전모 (둥근 머리 · 넓은 챙) · 앞에 하늘빛 광부 등불
        c.rect(hx0, hy - 1, hw, 3, k["helmet"]); c.rect(hx0 + 1, hy - 2, hw - 2, 1, k["helmet"])
        c.rect(hx0 - 1, hy + 2, hw + 2, 1, k["helmetD"])
        if v == "front": c.rect(cx - 1, hy - 1, 2, 2, k["lamp"]); c.px(cx, hy - 2, k["ether"])
        elif v == "side": c.rect(hx0 + hw - 2, hy, 2, 2, k["lamp"]); c.px(hx0 + hw + 1, hy + 2, k["helmetD"])

def miner_pick(c, k, g):
    """곡괭이 자세: 걸을 때는 어깨에 메고, 공격 줄은 치켜듦 → 앞으로 → 내리찍음 (4칸은 옆에서 내리찍음)"""
    v, tx, ty, tw, th, cx = g["view"], g["tx"], g["ty"], g["tw"], g["th"], g["cx"]
    if g["cast"]:
        if v == "front":
            hand = (tx + tw + 5, ty + 1)
            deg = (-100, -50, -12)[min(g["col"], 2)]
        else:
            hand, deg = (cx + 3, ty + 1), 0
    elif v == "front": hand, deg = (tx + tw + 1, ty + th - 1), -65
    elif v == "back": hand, deg = (tx - 2, ty + th - 1), -115
    else: hand, deg = (cx, ty + th - 2), -130
    # 휘두를 때는 칸 안에 들어오게 자루를 조금 짧게
    big_pick(c, k, hand[0], hand[1], deg, L=18 if g["cast"] and deg > -90 else 26)

VOYAGER = dict(
    skin=hx("#d8a884"), skinD=hx("#b08060"), eye=hx("#1e2a4a"), eyeL=hx("#4a5a8a"), outline=hx("#4e4262"),
    top=hx("#c8a060"), arm=hx("#d8a884"), legs=hx("#d8a884"), legsD=hx("#b08060"), shoe=hx("#6a4a2a"),
    hair=hx("#2a1e18"), hairD=hx("#1a120e"), hairL=hx("#4a3a30"),
    armor=hx("#c8903a"), armorL=hx("#f0c060"), cloak=hx("#a8302a"), cloakD=hx("#701e1a"), skirt=hx("#e8dcc0"),
    bow=hx("#e8b040"), bowL=hx("#ffe08a"), string=hx("#c8e8ff"), shaft=hx("#a87a4a"), tip=hx("#ffffff"), dice=hx("#f2ecdc"),
)

def bow(c, k, x, y, h=11, bend=4, drawn=False, d=1):
    """큰 금빛 활 (가운데 손 x, y · 위아래 h · d 쪽으로 휨) · drawn이면 시위를 당겨 화살을 걸어 둠"""
    for j in range(-h, h + 1):
        u = abs(j) / h
        bx = x + d * round(bend * (1 - u * u))
        c.px(bx, y + j, k["bowL"] if abs(j) < 2 else k["bow"])
        if u > 0.85: c.px(bx - d, y + j, k["bow"])
    pull = -6 * d if drawn else 0
    c.line(x, y - h, x + pull, y, k["string"]); c.line(x + pull, y, x, y + h, k["string"])
    if drawn:
        c.line(x + pull, y, x + d * (bend + 6), y, k["shaft"]); c.px(x + d * (bend + 7), y, k["tip"]); c.px(x + d * (bend + 6), y - 1, k["tip"]); c.px(x + d * (bend + 6), y + 1, k["tip"])

def voyager_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    if layer == "back_hair":
        # 붉은 망토 (등 뒤로 길게)
        if v == "back": c.rect(tx - 1, ty, tw + 2, th + 6, k["cloak"]); c.rect(cx, ty + 2, 1, th + 3, k["cloakD"])
        elif v == "side": c.rect(cx - 6, ty + 1, 3, th + 5, k["cloak"])
        else: c.px(tx - 1, ty + th + 2, k["cloak"]); c.px(tx + tw, ty + th + 2, k["cloak"])
    if layer == "legs":
        # 흰 천 치마 · 샌들 끈
        if v in ("front", "back"): c.rect(tx, hip - 1, tw, 4, k["skirt"]); c.px(cx, hip + 1, k["armor"])
        else: c.rect(cx - 3, hip - 1, 6, 4, k["skirt"])
    if layer == "body":
        # 청동 흉갑 · 어깨에 망토 매듭 · 허리에 주사위 주머니
        if v in ("front", "back"):
            c.rect(tx, ty, tw, th - 1, k["armor"])
            if v == "front":
                c.rect(cx - 2, ty + 2, 1, 3, k["armorL"]); c.rect(cx + 1, ty + 2, 1, 3, k["armorL"]); c.rect(tx, ty + th - 2, tw, 1, k["armorL"])
                c.px(tx, ty, k["cloak"]); c.px(tx + tw - 1, ty, k["cloak"]); c.rect(tx + tw - 2, hip - 2, 2, 2, k["dice"])
        else:
            c.rect(cx - 3, ty, 6, th - 1, k["armor"]); c.px(cx + 1, ty + 2, k["armorL"]); c.rect(cx + 2, hip - 2, 2, 2, k["dice"])
    if layer == "hair":
        # 짧게 곱슬진 검은 머리 · 짧은 수염 (턱 아래)
        if v == "front":
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 2, hh - 4, k["hair"]); c.rect(hx0 + hw - 1, hy + 1, 2, hh - 4, k["hair"])
            for x in range(hx0, hx0 + hw, 2): c.px(x, hy - 1, k["hair"])
            c.rect(hx0 + 2, hy + hh, hw - 4, 1, k["hairD"])
        elif v == "back":
            c.rect(hx0 - 1, hy, hw + 2, hh, k["hair"])
            for x in range(hx0 - 1, hx0 + hw + 1, 2): c.px(x, hy - 1, k["hair"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 5, hh - 3, k["hair"]); c.px(hx0 + hw - 3, hy + hh, k["hairD"])
            for x in range(hx0, hx0 + hw, 2): c.px(x, hy - 1, k["hair"])
    if layer == "hat":
        # 큰 금빛 활: 걸을 땐 왼손(앞)·등(뒤)·앞(옆), 공격은 시위를 당긴 모습
        if g["cast"]:
            if v == "front": bow(c, k, tx + tw + 6, ty + 2, 12, 4, True)
            else: bow(c, k, cx + 7, ty + 2, 12, 4, True)
        elif v == "front": bow(c, k, tx - 3, ty + 4, 11, 3, False, -1)
        elif v == "back": c.line(tx - 1, ty - 4, tx + tw, ty + th + 3, k["bow"]); c.line(tx, ty - 4, tx + tw + 1, ty + th + 3, k["bowL"])
        else: bow(c, k, cx + 3, ty + 4, 11, 3)

ZEUS = dict(
    skin=hx("#e8c4a4"), skinD=hx("#c09878"), eye=hx("#2a5ab8"), eyeL=hx("#8ac8ff"), outline=hx("#4e4262"),
    top=hx("#f2f0ea"), arm=hx("#e8c4a4"), legs=hx("#e8c4a4"), legsD=hx("#c09878"), shoe=hx("#a8743a"),
    hair=hx("#c8ccdc"), hairD=hx("#8a90a8"), hairL=hx("#f0f2ff"),
    sash=hx("#2a4aa8"), sashL=hx("#4a7ae8"), toga=hx("#f2f0ea"), togaD=hx("#c8c4b8"), trim=hx("#ffd040"), laurel=hx("#6aa040"), bolt=hx("#ffe060"), boltL=hx("#ffffff"), glow=hx("#8ac8ff"),
)

def thunderbolt(c, k, x, y, up=True):
    """손에 든 번개 (x, y 손 · up이면 위로, 아니면 앞으로 뻗음)"""
    pts = [(0, 0), (2, -3), (0, -4), (3, -8), (1, -9), (4, -13)] if up else [(0, 0), (3, -2), (4, 0), (8, -2), (9, 0), (13, -2)]
    for (ax, ay), (bx, by) in zip(pts, pts[1:]): c.line(x + ax, y + ay, x + bx, y + by, k["bolt"])
    ex, ey = pts[-1]
    c.px(x + ex, y + ey, k["boltL"]); c.px(x + ex + (1 if not up else 0), y + ey - (1 if up else 0), k["glow"])

def zeus_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    if layer == "back_hair":
        # 어깨 아래까지 내려오는 흰 머리
        if v == "front": c.rect(hx0 - 1, hy + 2, 2, hh + 3, k["hair"]); c.rect(hx0 + hw - 1, hy + 2, 2, hh + 3, k["hair"])
        elif v == "side": c.rect(hx0 - 1, hy + 2, 5, hh + 4, k["hair"])
    if layer == "legs":
        # 무릎까지 오는 토가 자락 · 샌들
        if v in ("front", "back"): c.rect(tx - 1, hip - 1, tw + 2, 5, k["toga"]); c.rect(tx - 1, hip + 3, tw + 2, 1, k["trim"])
        else: c.rect(cx - 4, hip - 1, 8, 5, k["toga"]); c.rect(cx - 4, hip + 3, 8, 1, k["trim"])
    if layer == "body":
        # 한쪽 어깨에 걸친 흰 토가 (금빛 테두리 비스듬히) · 드러난 왼쪽 어깨
        if v in ("front", "back"):
            c.rect(tx, ty, tw, th, k["toga"])
            if v == "front":
                c.px(tx, ty, k["skin"]); c.px(tx + 1, ty, k["skin"]); c.px(tx, ty + 1, k["skin"])
                # 왼쪽 어깨에서 오른쪽 허리로 넓은 파란 망토 띠 (금빛 테두리)
                for d in range(3): c.line(tx + 1 + d, ty, tx + tw - 2 + d, ty + th - 2, k["sash"] if d else k["sashL"])
                c.line(tx + 4, ty, tx + tw + 1, ty + th - 2, k["trim"]); c.rect(tx, ty + th - 1, tw, 1, k["trim"])
            else:
                for d in range(3): c.line(tx + d, ty + th - 2, tx + tw - 3 + d, ty, k["sash"])
        else:
            c.rect(cx - 3, ty, 6, th, k["toga"])
            for d in range(2): c.line(cx - 3 + d, ty + th - 1, cx + 2 + d, ty, k["sash"])
            c.line(cx - 1, ty + th - 1, cx + 4, ty, k["trim"])
    if layer == "hair":
        # 흰 머리 · 긴 흰 수염 (얼굴 아래로 길게)
        if v == "front":
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 2, hh, k["hair"]); c.rect(hx0 + hw - 1, hy + 1, 2, hh, k["hair"])
            c.rect(hx0 + 1, hy + hh - 1, hw - 2, 2, k["hair"]); c.rect(hx0 + 2, hy + hh + 1, hw - 4, 2, k["hair"]); c.rect(hx0 + 3, hy + hh + 3, hw - 6, 1, k["hairD"])
        elif v == "back":
            c.rect(hx0 - 1, hy, hw + 2, hh + 4, k["hair"]); c.rect(cx - 1, hy + 2, 1, hh, k["hairD"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 5, hh + 1, k["hair"])
            c.rect(hx0 + hw - 4, hy + hh - 1, 4, 3, k["hair"]); c.rect(hx0 + hw - 4, hy + hh + 2, 3, 3, k["hairD"])
    if layer == "hat":
        # 금빛 띠에 초록 월계관 · 손에 든 번개 (공격: 앞은 치켜듦, 옆은 앞으로 내던짐)
        c.rect(hx0, hy + 1, hw, 1, k["trim"])
        for x in range(hx0 - 1, hx0 + hw + 1, 2): c.px(x, hy, k["laurel"])
        if g["cast"]:
            if v == "front": thunderbolt(c, k, tx + tw + 5, ty + 1, True)
            else: thunderbolt(c, k, cx + 7, ty + 2, False)
        elif v == "front": thunderbolt(c, k, tx + tw + 1, ty + th - 1, True)
        elif v == "side": thunderbolt(c, k, cx, ty + th - 1, True)

GEO = {
    "miner": dict(head=(10, 9), torso=(10, 8), leg=7, size=64),
    "voyager": dict(head=(10, 9), torso=(10, 8), leg=8, size=48),
    "zeus": dict(head=(10, 9), torso=(11, 9), leg=8, size=48),
}

def main():
    save_sheet("miner", lambda r, col: person(MINER, r, col, GEO["miner"], miner_deco), size=64)
    save_sheet("voyager", lambda r, col: person(VOYAGER, r, col, GEO["voyager"], voyager_deco), size=48)
    save_sheet("zeus", lambda r, col: person(ZEUS, r, col, GEO["zeus"], zeus_deco), size=48)

if __name__ == "__main__":
    main()
