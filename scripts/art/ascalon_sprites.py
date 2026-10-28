# 시즌 2 아스칼론 캐릭터 방향 시트 (python3 scripts/art/ascalon_sprites.py) → apps/client/public/sprites/{tracker,forgotten,remnant,wanderer,silk}.png
# 영사(여): 허리까지 물결치는 와인빛 긴 머리 · 분홍 눈 · 어깨가 드러나고 옆이 깊게 트인 검은 드레스(분홍 테) · 손가락 금반지 · 공격 칸은 손끝에서 은실 세 가닥
# 그림체는 s2_common.person (시즌 1 그림체: 얼굴 아래 4줄·입 없음·보랏빛 테두리, docs/ART.md)
# 추적자(여): 높이 묶은 밤색 포니테일 · 초록 눈 · 목 뒤로 내린 국방색 두건 망토 · 짙은 사냥복에 가죽 탄띠 · 등에 멘 긴 저격총(붉은 조준경 빛)
#   공격 칸은 저격총을 들어 앞으로 겨눔 (긴 총열 · 위에 조준경)
# 잊혀진 자(여): 허리까지 흘러내리는 백금빛 긴 머리 · 금빛 눈 · 이마의 금 머리띠와 하늘빛 보석 · 어깨를 드러낸 흰 여신 드레스(금 테·금 허리끈) · 팔의 금 팔찌
#   공격 칸은 뻗은 손끝에 빛 구슬이 맺힘
# 잔영(남): 눈만 보이는 검은 두건과 입가리개 · 보라로 빛나는 눈 · 앞머리로 비죽 나온 은회색 머리 · 끝이 해진 검은 망토 · 뒤로 흩날리는 보라 목도리 · 허리 양쪽 단검
#   공격 칸은 단검을 거꾸로 쥐고 앞으로 그음
# 방랑객(남): 넓은 삿갓(밀짚색) · 묶어 올린 검은 머리 · 해진 쪽빛 겉옷(하오리)과 흰 속옷 · 붉은 허리띠에 찬 긴 카타나(그림 칸 48) · 짚신
#   공격 칸은 긴 카타나를 뽑아 치켜듦 → 비스듬히 벰 → 앞으로 그음 (옆은 찌름)
from s2_common import hx, person, save_sheet

TRACKER = dict(
    skin=hx("#f2d6c2"), skinD=hx("#d0ac96"), eye=hx("#1e4a2a"), eyeL=hx("#6ad87a"), outline=hx("#4e4262"), blush=hx("#f0a0a0"),
    top=hx("#2e3a2e"), arm=hx("#2e3a2e"), legs=hx("#2a2a30"), legsD=hx("#1a1a20"), shoe=hx("#4a3424"),
    hair=hx("#7a3e26"), hairD=hx("#4e2414"), hairL=hx("#b8683a"),
    cloak=hx("#4a6a3a"), cloakD=hx("#2e4a26"), belt=hx("#8a5a32"), ammo=hx("#e8c050"),
    gun=hx("#2a2a32"), stock=hx("#6a4428"), scope=hx("#ff4a4a"),
)

def rifle_back(c, g, x0, y0, x1, y1):
    """등에 멘 저격총: 개머리판(나무) → 총열(검정), 끝에 조준경 빛"""
    k = g["k"]
    n = max(abs(x1 - x0), abs(y1 - y0))
    for i in range(n + 1):
        x = x0 + (x1 - x0) * i / n
        y = y0 + (y1 - y0) * i / n
        c.px(x, y, k["stock"] if i < n // 3 else k["gun"])
    c.px(x1, y1, k["scope"])

def rifle_aim(c, g, x, y, length):
    """앞으로 겨눈 저격총: 개머리판 · 몸통 · 긴 총열 · 위 조준경(붉은 렌즈) · 아래 손잡이"""
    k = g["k"]
    c.rect(x - 3, y, 3, 2, k["stock"])
    c.rect(x, y, 5, 2, k["gun"])
    c.rect(x + 5, y, length - 5, 1, k["gun"])
    c.rect(x + 1, y - 2, 4, 1, k["gun"]); c.px(x + 5, y - 2, k["scope"])
    c.px(x + 2, y + 2, k["gun"])
    c.px(x + length, y, hx("#ffe080"))

def tracker_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    if layer == "back_hair":
        # 높이 묶어 늘어뜨린 포니테일 · 앞·옆에서는 등의 총이 어깨 뒤로 비죽
        if v == "front":
            c.rect(hx0 + hw - 2, hy + 3, 3, hh + 2, k["hairD"])
            if not g["cast"]: rifle_back(c, g, tx + tw + 1, hip - 1, tx - 3, hy - 2)
        elif v == "side":
            c.rect(hx0 - 2, hy + 1, 3, hh + 3, k["hairD"]); c.px(hx0 - 1, hy + hh + 4, k["hair"])
            if not g["cast"]: rifle_back(c, g, cx - 3, hip, cx - 5, hy - 2)
    if layer == "legs":
        # 무릎까지 오는 갈색 장화 · 허벅지 끈
        if v in ("front", "back"):
            for lx in (cx - tw // 2 + 1, cx + tw // 2 - 3): c.px(lx, hip + 2, k["belt"]); c.px(lx + 1, hip + 2, k["belt"])
        else:
            c.px(cx - 2, hip + 2, k["belt"])
        for (x, y), col in list(c.p.items()):
            if col in (k["legs"], k["legsD"]) and y >= hip + 5: c.p[(x, y)] = k["shoe"]
    if layer == "body":
        # 국방색 짧은 망토가 어깨를 덮음 · 가슴을 가로지르는 가죽 탄띠(금빛 탄) · 허리띠
        if v in ("front", "back"):
            c.rect(tx - 2, ty, tw + 4, 2, k["cloak"]); c.rect(tx - 2, ty + 2, 2, 2, k["cloak"]); c.rect(tx + tw, ty + 2, 2, 2, k["cloakD"])
            c.rect(tx, hip - 1, tw, 1, k["belt"])
            if v == "front":
                c.line(tx, ty + 2, tx + tw - 1, hip - 2, k["belt"])
                for i in (1, 3, 5): c.px(tx + i, ty + 2 + i * (th - 4) // (tw - 1), k["ammo"])
                c.px(cx - 1, ty, k["cloakD"]); c.px(cx, ty, k["cloakD"])
            else:
                # 등: 두건이 목 뒤로 내려앉음 · 등에 비스듬히 멘 저격총
                c.rect(cx - 3, ty, 6, 3, k["cloakD"]); c.rect(cx - 2, ty + 3, 4, 1, k["cloak"])
                rifle_back(c, g, tx - 1, hip, tx + tw + 2, hy + 1)
        else:
            c.rect(cx - 4, ty, 8, 2, k["cloak"]); c.rect(cx - 4, ty + 2, 3, 2, k["cloakD"])
            c.rect(cx - 3, hip - 1, 6, 1, k["belt"]); c.px(cx, ty + 3, k["ammo"])
        if g["cast"]:
            # 저격총을 들어 앞으로 겨눔
            if v == "front": rifle_aim(c, g, tx + tw - 1, ty + 1, 11)
            else: rifle_aim(c, g, cx - 1, ty + 1, 13)
    if layer == "hair":
        # 앞머리를 한쪽으로 넘김 · 머리를 높이 묶은 가죽 끈
        if v == "front":
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 2, hh - 3, k["hair"]); c.rect(hx0 + hw - 1, hy + 1, 2, hh - 2, k["hair"])
            c.rect(hx0 + 1, hy + 2, 3, 1, k["hair"])
            c.px(hx0 + hw, hy + 1, k["belt"])
        elif v == "back":
            c.rect(hx0 - 1, hy, hw + 2, hh, k["hair"])
            c.rect(cx - 1, hy + 1, 2, 1, k["belt"]); c.rect(cx - 1, hy + 2, 2, hh, k["hairD"]); c.px(cx - 1, hy + hh + 2, k["hair"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 4, hh - 2, k["hair"]); c.px(hx0, hy + 1, k["belt"])

FORGOTTEN = dict(
    skin=hx("#fbe8dc"), skinD=hx("#e0c0b0"), eye=hx("#8a5a10"), eyeL=hx("#ffd860"), outline=hx("#4e4262"), blush=hx("#ffa8b8"),
    top=hx("#fbe8dc"), arm=hx("#fbe8dc"), legs=hx("#fbe8dc"), legsD=hx("#e0c0b0"), shoe=hx("#e8c060"),
    hair=hx("#f2d88a"), hairD=hx("#c8a458"), hairL=hx("#fff6d0"),
    dress=hx("#ffffff"), dressD=hx("#c8cce8"), gold=hx("#f2c040"), gem=hx("#6ad0ff"), glow=hx("#fff6c0"),
)

def forgotten_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    if layer == "back_hair":
        # 허리 아래까지 흘러내리는 긴 머리 (끝은 살짝 갈라짐)
        if v == "front":
            # 어깨 뒤로 넘긴 두 갈래 (팔 뒤로 보임)
            for x0 in (hx0 - 1, hx0 + hw - 1): c.rect(x0, hy + 3, 2, hh + 8, k["hairD"])
        elif v == "side":
            c.rect(hx0 - 2, hy + 2, 5, hh + 10, k["hairD"]); c.px(hx0 - 1, hy + hh + 12, k["hair"])
    if layer == "legs":
        # 발목까지 오는 흰 드레스 자락 (금 테) · 금 샌들
        if v in ("front", "back"):
            for i in range(7): c.rect(tx - i // 3, hip + i, tw + (i // 3) * 2, 1, k["dress"] if i % 3 else k["dressD"])
            c.rect(tx - 2, hip + 7, tw + 4, 1, k["gold"])
        else:
            for i in range(7): c.rect(cx - 3 - i // 3, hip + i, 7 + i // 3, 1, k["dress"] if i % 3 else k["dressD"])
            c.rect(cx - 5, hip + 7, 9, 1, k["gold"])
    if layer == "body":
        # 어깨를 드러낸 흰 드레스 윗옷 · 가슴 금 테 · 금 허리끈(가운데 하늘빛 보석) · 팔의 금 팔찌
        if v in ("front", "back"):
            c.rect(tx, ty + 2, tw, th - 2, k["dress"]); c.rect(tx, ty + 2, tw, 1, k["gold"])
            c.rect(tx, hip - 2, tw, 1, k["gold"]); c.rect(tx + tw - 1, ty + 3, 1, th - 5, k["dressD"])
            if v == "front":
                c.px(cx - 1, hip - 2, k["gem"]); c.px(cx, hip - 2, k["gem"])
                c.px(tx + 2, ty + 4, k["dressD"]); c.px(tx + tw - 3, ty + 4, k["dressD"])
            c.px(tx - 2, ty + 3, k["gold"]); c.px(tx - 1, ty + 3, k["gold"])
            if not g["cast"]: c.px(tx + tw, ty + 3, k["gold"]); c.px(tx + tw + 1, ty + 3, k["gold"])
        else:
            c.rect(cx - 3, ty + 2, 6, th - 2, k["dress"]); c.rect(cx - 3, ty + 2, 6, 1, k["gold"]); c.rect(cx - 3, hip - 2, 6, 1, k["gold"])
        if g["cast"]:
            # 뻗은 손끝의 빛 구슬
            bx = tx + tw + 7 if v == "front" else cx + 9
            c.rect(bx - 1, ty, 3, 3, k["glow"]); c.px(bx, ty + 1, hx("#ffffff"))
            c.px(bx, ty - 2, k["gold"]); c.px(bx + 3, ty + 1, k["gold"]); c.px(bx, ty + 4, k["gold"])
            if v == "front": c.px(tx + tw + 2, ty + 1, k["gold"])
    if layer == "hair":
        # 가운데 가르마 긴 앞머리 · 얼굴 옆으로 길게 · 이마의 금 머리띠와 하늘빛 보석
        if v == "front":
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 2, hh + 3, k["hair"]); c.rect(hx0 + hw - 1, hy + 1, 2, hh + 3, k["hair"])
            c.px(cx - 1, hy + 3, k["hair"]); c.px(cx, hy + 3, k["hair"]); c.px(hx0 + 1, hy + 3, k["hair"]); c.px(hx0 + hw - 2, hy + 3, k["hair"])
            c.rect(hx0, hy + 2, hw, 1, k["gold"]); c.px(cx - 1, hy + 2, k["gem"]); c.px(cx, hy + 2, k["gem"])
        elif v == "back":
            # 등을 덮고 끝으로 갈수록 가늘어지는 긴 머리 · 가운데 결
            c.rect(hx0 - 1, hy, hw + 2, hh + 3, k["hair"]); c.rect(hx0, hy + hh + 3, hw, 4, k["hair"]); c.rect(hx0 + 2, hy + hh + 7, hw - 4, 3, k["hair"])
            c.line(cx - 1, hy + 4, cx - 1, hy + hh + 8, k["hairD"]); c.px(hx0 + 1, hy + hh + 5, k["hairD"]); c.px(hx0 + hw - 2, hy + hh + 5, k["hairD"])
            c.rect(hx0 - 1, hy + 2, hw + 2, 1, k["gold"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 5, hh + 2, k["hair"])
            c.rect(hx0, hy + 2, hw, 1, k["gold"]); c.px(hx0 + hw - 1, hy + 2, k["gem"])

REMNANT = dict(
    skin=hx("#e8cdb8"), skinD=hx("#c0a490"), eye=hx("#2a1a4a"), eyeL=hx("#b88aff"), outline=hx("#3a2e4e"), blush=None,
    top=hx("#24202e"), arm=hx("#24202e"), legs=hx("#1a1822"), legsD=hx("#121018"), shoe=hx("#2e2a3a"),
    hair=hx("#9aa0b4"), hairD=hx("#6a7084"), hairL=hx("#d0d4e0"),
    hood=hx("#1e1a28"), hoodD=hx("#141018"), scarf=hx("#7a4ae8"), scarfD=hx("#4a2aa0"), belt=hx("#4a3a5a"), blade=hx("#d8dcf0"),
)

def remnant_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    if layer == "back_hair":
        # 뒤로 흩날리는 보라 목도리 끝 (걸을 때 흔들림)
        wave = (0, 1, 0, -1)[g["step"]]
        if v == "front":
            c.rect(hx0 + hw - 1, ty, 2, 6 + wave, k["scarfD"])
        elif v == "side":
            c.rect(hx0 - 4, ty + 1 + wave, 5, 2, k["scarf"]); c.rect(hx0 - 6, ty + 2 + wave, 3, 2, k["scarfD"])
    if layer == "legs":
        # 끝이 해진 짧은 망토 자락 · 허리 양쪽 단검
        if v in ("front", "back"):
            for i, x in enumerate(range(tx - 2, tx + tw + 2)): c.rect(x, hip, 1, 2 + (i % 2), k["hood"])
        else:
            for i, x in enumerate(range(cx - 5, cx + 2)): c.rect(x, hip, 1, 2 + (i % 2), k["hood"])
    if layer == "body":
        # 검은 망토가 어깨를 덮음 · 가슴을 가로지르는 띠 · 목에 감은 보라 목도리
        if v in ("front", "back"):
            c.rect(tx - 2, ty, tw + 4, 3, k["hood"]); c.rect(tx - 2, ty + 3, 2, th - 2, k["hood"]); c.rect(tx + tw, ty + 3, 2, th - 2, k["hoodD"])
            c.rect(tx, ty, tw, 2, k["scarf"]); c.rect(tx + 1, ty + 2, tw - 2, 1, k["scarfD"])
            c.rect(tx, hip - 1, tw, 1, k["belt"])
            if v == "front":
                c.line(tx + 1, ty + 3, tx + tw - 2, hip - 2, k["belt"])
                if not g["cast"]: c.rect(tx - 3, hip - 2, 1, 4, k["blade"]); c.rect(tx + tw + 2, hip - 2, 1, 4, k["blade"])
        else:
            c.rect(cx - 4, ty, 8, 3, k["hood"]); c.rect(cx - 3, ty, 6, 2, k["scarf"]); c.rect(cx - 3, hip - 1, 6, 1, k["belt"])
            c.rect(cx - 5, ty + 3, 3, th - 2, k["hood"])
        if g["cast"]:
            # 거꾸로 쥔 단검을 앞으로 그음 (보라 칼빛)
            if v == "front":
                bx = tx + tw + 5
                c.line(bx, ty + 2, bx + 4, ty - 2, k["blade"]); c.px(bx + 5, ty - 3, hx("#ffffff")); c.px(bx + 1, ty + 4, k["scarf"])
            else:
                bx = cx + 7
                c.line(bx, ty + 2, bx + 5, ty, k["blade"]); c.px(bx + 6, ty - 1, hx("#ffffff")); c.px(bx + 2, ty + 4, k["scarf"])
    if layer == "hair":
        # 눈만 보이는 검은 두건 + 입가리개 · 이마로 비죽 나온 은회색 앞머리
        if v == "front":
            c.rect(hx0 - 1, hy - 1, hw + 2, 4, k["hood"]); c.rect(hx0 - 1, hy + 3, 2, hh - 3, k["hood"]); c.rect(hx0 + hw - 1, hy + 3, 2, hh - 3, k["hood"])
            c.rect(hx0 + 2, hy + 2, hw - 4, 1, k["hair"]); c.px(hx0 + 3, hy + 3, k["hair"]); c.px(hx0 + hw - 4, hy + 3, k["hairD"])
            # 입가리개 (눈 아래부터)
            c.rect(hx0 + 1, hy + hh - 2, hw - 2, 2, k["hoodD"]); c.px(cx, hy + hh - 2, k["scarfD"])
            c.px(cx - 1, hy - 2, k["hoodD"]); c.px(cx, hy - 2, k["hoodD"])
        elif v == "back":
            c.rect(hx0 - 1, hy - 1, hw + 2, hh + 1, k["hood"]); c.rect(cx - 1, hy - 2, 2, 1, k["hoodD"]); c.rect(hx0, hy + hh - 1, hw, 1, k["hoodD"])
        else:
            c.rect(hx0 - 1, hy - 1, hw + 1, 4, k["hood"]); c.rect(hx0 - 1, hy + 3, 5, hh - 3, k["hood"])
            c.px(hx0 + hw - 3, hy + 2, k["hair"]); c.rect(hx0 + hw - 4, hy + hh - 2, 4, 2, k["hoodD"])

WANDERER = dict(
    skin=hx("#e8c4a4"), skinD=hx("#c09878"), eye=hx("#2a1a14"), eyeL=hx("#6a4a3a"), outline=hx("#4e4262"), blush=None,
    top=hx("#f0ece0"), arm=hx("#2a3a6a"), legs=hx("#3a3a48"), legsD=hx("#262632"), shoe=hx("#c8a870"),
    hair=hx("#1e1a20"), hairD=hx("#100e12"), hairL=hx("#4a4250"),
    coat=hx("#2a3a6a"), coatD=hx("#1a2648"), hat=hx("#d8b878"), hatD=hx("#a8884a"), sash=hx("#c83a3a"), sheath=hx("#2a1e22"), blade=hx("#e8ecf4"),
)

def _dark(col, f=0.68):
    return (int(col[0] * f), int(col[1] * f), int(col[2] * f), 255)

def katana(c, k, x, y, ux, uy, n):
    """손(x, y)에서 (ux, uy) 쪽으로 뻗은 긴 카타나: 손잡이(감은 끈) · 금빛 코등이 · 살짝 휜 두 줄 칼날 · 반짝이는 칼끝"""
    m = (ux * ux + uy * uy) ** 0.5
    ux, uy = ux / m, uy / m
    px, py = -uy, ux
    if py > 0: px, py = -px, -py   # 칼등은 늘 위쪽
    for i in range(1, 5): c.px(x - ux * i, y - uy * i, k.get("wrap", hx("#1a1418")) if i % 2 else k.get("wrapL", hx("#e8e0d0")))
    c.px(x - ux * 5, y - uy * 5, k.get("tsuba", hx("#d8b040")))
    gx, gy = x + ux, y + uy
    for s in (-1, 0, 1): c.px(gx + px * s, gy + py * s, k.get("tsuba", hx("#d8b040")))
    spine = _dark(k["blade"])
    sx, sy = round(px), round(py)
    pts = [(x + ux * i + px * 1.4 * i * (n - i) / (n * n), y + uy * i + py * 1.4 * i * (n - i) / (n * n)) for i in range(2, n + 1)]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        c.line(x0 + sx, y0 + sy, x1 + sx, y1 + sy, spine)
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]): c.line(x0, y0, x1, y1, k["blade"])
    c.px(x + ux * (n + 1), y + uy * (n + 1), hx("#ffffff"))
    for i in (n // 2, n // 2 + 1): c.px(*pts[i - 2], hx("#ffffff"))

def wanderer_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    tsuba, wrapc = k.get("tsuba", hx("#d8b040")), k.get("wrap", hx("#1a1418"))
    if layer == "back_hair" and v == "side":
        # 허리 뒤로 길게 비스듬히 찬 칼집
        c.line(cx + 1, hip - 3, cx - 11, hip + 3, k["sheath"])
    if layer == "legs":
        # 넓은 바지(하카마) 자락
        if v in ("front", "back"):
            c.rect(tx - 1, hip, tw + 2, 4, k["legs"]); c.px(cx, hip + 1, k["legsD"]); c.px(cx, hip + 2, k["legsD"])
        else:
            c.rect(cx - 4, hip, 7, 4, k["legs"])
    if layer == "body":
        # 쪽빛 겉옷(앞이 열려 흰 속옷이 V자로) · 해진 소매 끝 · 붉은 허리띠 · 긴 칼집(뽑으면 빈 칼집만)
        if v in ("front", "back"):
            c.rect(tx, ty, tw, th, k["coat"])
            if v == "front":
                for i in range(4): c.rect(cx - 2 + i // 2, ty + i, 4 - (i // 2) * 2, 1, k["top"])
            c.rect(tx, hip - 2, tw, 2, k["sash"])
            c.px(tx - 2, ty + th - 1, k["coatD"]); c.px(tx + tw + 1, ty + th - 1, k["coatD"])
            sd = -1 if v == "front" else 1
            ex = tx + 1 if v == "front" else tx + tw - 2
            c.line(ex, hip - 1, ex + sd * 9, hip + 4, k["sheath"])
            if not g["cast"]:
                c.px(ex - sd, hip - 2, tsuba); c.px(ex - sd * 2, hip - 2, tsuba)
                c.line(ex - sd * 2, hip - 3, ex - sd * 4, hip - 5, wrapc); c.px(ex - sd * 3, hip - 4, k.get("wrapL", hx("#e8e0d0")))
        else:
            c.rect(cx - 3, ty, 6, th, k["coat"]); c.rect(cx - 3, hip - 2, 6, 2, k["sash"]); c.px(cx + 2, ty + 1, k["top"])
            if not g["cast"]:
                c.px(cx + 3, hip - 3, tsuba); c.px(cx + 3, hip - 4, tsuba)
                c.line(cx + 4, hip - 4, cx + 7, hip - 6, wrapc); c.px(cx + 5, hip - 5, k.get("wrapL", hx("#e8e0d0")))
    if layer == "hair":
        # 묶어 올린 검은 머리 (뒤 상투) · 옆머리
        if v == "front":
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 2, hh - 3, k["hair"]); c.rect(hx0 + hw - 1, hy + 1, 2, hh - 3, k["hair"])
        elif v == "back":
            c.rect(hx0 - 1, hy, hw + 2, hh, k["hair"]); c.rect(cx - 1, hy + hh - 3, 2, 3, k["hairD"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 4, hh - 2, k["hair"]); c.rect(hx0 - 2, hy + 2, 2, 2, k["hairD"])
    if layer == "hat":
        # 넓은 삿갓 (얼굴 위를 살짝 가림) · 짚 결
        brim = hw + 8
        x0 = cx - brim // 2
        c.rect(x0, hy + 1, brim, 2, k["hat"]); c.rect(x0 + 1, hy + 3, brim - 2, 1, k["hatD"])
        for i in range(3): c.rect(x0 + 3 + i * 2, hy - 1 - i, brim - 6 - i * 4, 1, k["hat"])
        for x in range(x0 + 2, x0 + brim - 2, 3): c.px(x, hy + 2, k["hatD"])
        if g["cast"]:
            # 뽑아 든 긴 카타나: 앞모습은 치켜듦 → 비스듬히 벰 → 앞으로 내려 그음, 옆모습은 앞으로 길게 찌름
            if v == "front":
                ux, uy, n = ((0.3, -1.0, 21), (0.8, -0.65, 15), (1.0, -0.12, 11))[min(g["col"], 2)]
                katana(c, k, tx + tw + 5, ty + 1, ux, uy, n)
            else:
                katana(c, k, cx + 7, ty + 1, 1.0, -0.55, 14)

SILK = dict(
    skin=hx("#f8e0d4"), skinD=hx("#d8b4a4"), eye=hx("#5a1a3a"), eyeL=hx("#ff6ab8"), outline=hx("#4e4262"), blush=hx("#ff9ab8"),
    top=hx("#2a1a2e"), arm=hx("#f8e0d4"), legs=hx("#f8e0d4"), legsD=hx("#d8b4a4"), shoe=hx("#1a1020"),
    hair=hx("#8a1e4a"), hairD=hx("#5a0e30"), hairL=hx("#d8508a"),
    dress=hx("#2a1a2e"), dressD=hx("#1a0e1e"), trim=hx("#ff4aa8"), thread=hx("#f4e8ff"), ring=hx("#ffd860"),
)

def silk_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    if layer == "back_hair":
        # 허리까지 물결치는 긴 와인빛 머리
        if v == "front":
            for x0 in (hx0 - 1, hx0 + hw - 1):
                c.rect(x0, hy + 3, 2, hh + 7, k["hairD"]); c.px(x0 + (1 if x0 < cx else -1), hy + hh + 6, k["hairD"])
        elif v == "side":
            c.rect(hx0 - 2, hy + 2, 5, hh + 8, k["hairD"]); c.px(hx0 - 3, hy + hh + 4, k["hairD"])
    if layer == "legs":
        # 발목까지 오는 검은 드레스 · 한쪽 옆이 깊게 트임(분홍 단) · 검은 굽
        if v in ("front", "back"):
            for i in range(7): c.rect(tx, hip + i, tw, 1, k["dress"] if i % 3 else k["dressD"])
            if v == "front": c.rect(cx + 1, hip + 1, 2, 6, k["skin"]); c.line(cx + 1, hip, cx + 1, hip + 6, k["trim"])
        else:
            for i in range(7): c.rect(cx - 3, hip + i, 6, 1, k["dress"])
            c.rect(cx + 1, hip + 2, 2, 5, k["skin"])
    if layer == "body":
        # 어깨가 드러난 검은 드레스 윗옷 · 분홍 테 · 가슴의 분홍 매듭 · 손가락의 금반지와 은실
        if v in ("front", "back"):
            c.rect(tx, ty + 2, tw, th - 2, k["dress"]); c.rect(tx, ty + 2, tw, 1, k["trim"]); c.rect(tx, hip - 2, tw, 1, k["trim"])
            if v == "front": c.px(cx - 1, ty + 3, k["trim"]); c.px(cx, ty + 3, k["trim"])
            c.px(tx - 2, ty + th - 1, k["ring"])
        else:
            c.rect(cx - 3, ty + 2, 6, th - 2, k["dress"]); c.rect(cx - 3, ty + 2, 6, 1, k["trim"])
        if g["cast"]:
            # 뻗은 손끝에서 은실 세 가닥이 뻗음
            bx = tx + tw + 5 if v == "front" else cx + 7
            c.px(bx, ty + 1, k["ring"])
            for dy in (-2, 0, 2): c.line(bx + 1, ty + 1, bx + 8, ty + 1 + dy * 2, k["thread"])
    if layer == "hair":
        # 한쪽으로 넘긴 물결 앞머리 · 얼굴 옆으로 길게
        if v == "front":
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 2, hh + 2, k["hair"]); c.rect(hx0 + hw - 1, hy + 1, 2, hh + 2, k["hair"])
            c.rect(hx0 + 1, hy + 2, 4, 1, k["hair"]); c.px(hx0 + 1, hy + 3, k["hair"])
            c.px(hx0 + hw - 2, hy + 1, k["trim"])
        elif v == "back":
            c.rect(hx0 - 1, hy, hw + 2, hh + 3, k["hair"]); c.rect(hx0, hy + hh + 3, hw, 4, k["hair"]); c.rect(hx0 + 2, hy + hh + 7, hw - 4, 2, k["hair"])
            for y in range(hy + 4, hy + hh + 8, 3): c.px(cx - 2, y, k["hairD"]); c.px(cx + 2, y + 1, k["hairD"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 5, hh + 1, k["hair"]); c.px(hx0 + hw - 1, hy + 1, k["trim"])

GEO = {
    "tracker": dict(head=(10, 9), torso=(8, 7), leg=9),
    "forgotten": dict(head=(10, 9), torso=(8, 7), leg=9),
    "remnant": dict(head=(10, 9), torso=(9, 8), leg=8),
    "wanderer": dict(head=(10, 9), torso=(9, 8), leg=8, size=48),
    "silk": dict(head=(10, 9), torso=(8, 7), leg=9),
}

def main():
    save_sheet("tracker", lambda r, col: person(TRACKER, r, col, GEO["tracker"], tracker_deco))
    save_sheet("forgotten", lambda r, col: person(FORGOTTEN, r, col, GEO["forgotten"], forgotten_deco))
    save_sheet("remnant", lambda r, col: person(REMNANT, r, col, GEO["remnant"], remnant_deco))
    save_sheet("wanderer", lambda r, col: person(WANDERER, r, col, GEO["wanderer"], wanderer_deco), size=48)
    save_sheet("silk", lambda r, col: person(SILK, r, col, GEO["silk"], silk_deco))

if __name__ == "__main__":
    main()
