# 시즌 2 테라코어 캐릭터 방향 시트 (python3 scripts/art/terra2_sprites.py) → apps/client/public/sprites/{automata,rider,bomber,artifacter,punk}.png
# 그림체는 s2_common.person (시즌 1 그림체: 얼굴 아래 4줄·입 없음·보랏빛 테두리, docs/ART.md)
# 오토마타(여): 하늘빛으로 빛나는 눈 · 은백색 단발 · 도자기 같은 하얀 피부와 관절 이음매 · 몸에 흐르는 하늘빛 회로 줄 · 흰·남색 기계 드레스 · 공격 칸은 손끝이 빛남
# 붐버(남): 헝클어진 붉은 머리·이마의 주황 고글·주황 목도리·국방색 작업복에 폭탄 띠 · 공격 칸은 불붙은 폭탄
# 아티팩터(남): 짧은 흰 머리·소매 없는 긴 조끼·맨팔 가득 푸른빛 문신 줄 · 공격 칸은 문신이 빛나는 팔과 리펄스 총
# 펑크(여): 한쪽으로 쓸어 넘긴 분홍 머리(끝은 하늘빛)·밀어 올린 옆머리·분홍 눈·배가 드러난 짧은 검은 재킷·크롬 왼팔·반바지와 부츠 · 공격 칸은 손끝 네온 칼날
# 라이더(남, 48칸): 진한 파랑 스포츠 오토바이에 올라탐 (큰 바퀴·카울·윈드스크린·배기관이 그림 안) · 뾰족한 검은 머리(파란 윤기)와 이마의 고글 · 검은 가죽 재킷에 진한 파랑 줄
from s2_common import hx, person, save_sheet

AUTOMATA = dict(
    skin=hx("#f4eef0"), skinD=hx("#c8c0cc"), eye=hx("#2a8ab8"), eyeL=hx("#8ae8ff"), outline=hx("#4e4262"), blush=hx("#f0c8d8"),
    top=hx("#e8eaf4"), arm=hx("#f4eef0"), legs=hx("#f4eef0"), legsD=hx("#c8c0cc"), shoe=hx("#2a3458"),
    hair=hx("#d8e0ec"), hairD=hx("#9aa6bc"), hairL=hx("#ffffff"),
    dress=hx("#2a3458"), dressL=hx("#4a5a88"), glow=hx("#8ae8ff"), joint=hx("#a8a0b0"),
)

def automata_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    if layer == "legs":
        # 남색 기계 치마(하늘빛 단) · 무릎 관절 이음매
        if v in ("front", "back"):
            for i in range(4): c.rect(tx - 1 - i // 2, hip + i, tw + 2 + i, 1, k["dress"])
            c.rect(tx - 2, hip + 3, tw + 4, 1, k["glow"])
            for lx in (cx - tw // 2 + 1, cx + tw // 2 - 3): c.px(lx, hip + 5, k["joint"]); c.px(lx + 1, hip + 5, k["joint"])
        else:
            for i in range(4): c.rect(cx - 4, hip + i, 8, 1, k["dress"])
            c.rect(cx - 4, hip + 3, 8, 1, k["glow"]); c.px(cx - 1, hip + 5, k["joint"])
    if layer == "body":
        # 흰 몸판 · 가운데 하늘빛 회로 줄 · 가슴 동력 코어 · 어깨·팔꿈치 관절
        if v in ("front", "back"):
            c.rect(tx, ty, tw, th, k["top"]); c.rect(tx, hip - 2, tw, 1, k["dress"])
            if v == "front":
                c.px(cx, ty + 2, k["glow"]); c.px(cx - 1, ty + 2, k["glow"])
                c.line(cx, ty + 3, cx, hip - 3, k["glow"])
            else:
                c.line(cx, ty + 1, cx, hip - 3, k["glow"])
            c.px(tx - 2, ty + 1, k["joint"]); c.px(tx + tw + 1, ty + 1, k["joint"])
            c.px(tx - 2, ty + 3, k["joint"])
        else:
            c.rect(cx - 3, ty, 6, th, k["top"]); c.rect(cx - 3, hip - 2, 6, 1, k["dress"]); c.px(cx + 1, ty + 2, k["glow"])
        if g["cast"]:
            # 뻗은 손끝이 하늘빛으로 빛남
            fx = tx + tw + 5 if v == "front" else cx + 7
            c.px(fx + 1, ty + 1, k["glow"]); c.px(fx + 1, ty + 2, k["glow"]); c.px(fx + 2, ty + 1, hx("#ffffff"))
    if layer == "hair":
        # 은백색 단발 (턱선에서 일자로) · 귀 자리의 하늘빛 감지기
        if v == "front":
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 2, hh - 1, k["hair"]); c.rect(hx0 + hw - 1, hy + 1, 2, hh - 1, k["hair"])
            c.rect(hx0 + 2, hy + 2, 2, 1, k["hair"])
            c.px(hx0 - 1, hy + hh - 3, k["glow"]); c.px(hx0 + hw, hy + hh - 3, k["glow"])
        elif v == "back":
            c.rect(hx0 - 1, hy, hw + 2, hh + 1, k["hair"]); c.rect(hx0, hy + hh, hw, 1, k["hairD"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 5, hh, k["hair"]); c.px(hx0 + 3, hy + hh - 3, k["glow"])

RIDER = dict(
    skin=hx("#e8c0a0"), skinD=hx("#c09878"), eye=hx("#141420"), eyeL=hx("#3a7aff"), outline=hx("#4e4262"), blush=None,
    top=hx("#16161e"), arm=hx("#16161e"), legs=hx("#1a1e2e"), legsD=hx("#10121c"), shoe=hx("#0e0e14"),
    hair=hx("#1a1a28"), hairD=hx("#0c0c14"), hairL=hx("#3a5ad8"),
    stripe=hx("#1e4ad8"), goggle=hx("#6ab8ff"), strap=hx("#2a2a3a"),
    bike=hx("#1838a8"), bikeD=hx("#0e1e5a"), bikeL=hx("#4a7aff"), tire=hx("#121216"), rim=hx("#8a92a8"), chrome=hx("#d8e0f0"), lamp=hx("#bfe4ff"),
)

def wheel(c, x, y, r, k):
    """굵은 타이어 · 은빛 휠 · 가운데 디스크"""
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            d = dx * dx + dy * dy
            if d > r * r + r * 0.6: continue
            col = k["tire"] if d >= (r - 2) * (r - 2) else k["rim"] if d >= 2 else k["chrome"]
            c.px(x + dx, y + dy, col)
    c.px(x - 1, y - r + 1, k["rim"])

GLASS = hx("#8ac8ff")

def bike(c, g):
    """스포츠 오토바이 (다리 위에 덮어 그림): 옆모습은 큰 앞뒤 바퀴·낮고 긴 카울·윈드스크린·위로 올라간 꼬리·배기관,
    앞·뒤 모습은 넓은 카울·두 개의 전조등(뒤는 꼬리등)·백미러"""
    k = g["k"]
    v, cx, hip = g["view"], g["cx"], g["hip"]
    if v == "side":
        wy = 39
        wheel(c, cx - 14, wy, 6, k); wheel(c, cx + 14, wy, 6, k)
        c.line(cx - 14, wy, cx - 4, hip + 4, k["chrome"])           # 스윙암
        c.line(cx + 11, hip + 1, cx + 14, wy, k["rim"])             # 앞 포크
        c.rect(cx - 6, hip + 3, 9, 5, k["strap"])                    # 엔진
        # 카울: 줄마다 (시작, 끝) — 뒤는 위로 솟고 앞은 뾰족한 코
        rows = [(-3, cx - 17, cx - 14), (-2, cx - 15, cx - 10), (-1, cx - 13, cx + 10), (0, cx - 12, cx + 14),
                (1, cx - 10, cx + 17), (2, cx - 6, cx + 19), (3, cx - 4, cx + 18), (4, cx - 2, cx + 15), (5, cx, cx + 11)]
        # 앞쪽 카울은 높게 솟음 (뒤쪽은 그대로)
        rows += [(-2, cx + 5, cx + 15), (-3, cx + 7, cx + 16), (-4, cx + 9, cx + 16), (-5, cx + 11, cx + 15), (-6, cx + 13, cx + 14)]
        for dy, x0, x1 in rows:
            for x in range(x0, x1 + 1): c.px(x, hip + dy, k["bikeD"] if dy >= 4 else k["bike"])
        for x in range(cx + 9, cx + 17): c.px(x, hip - 4 + (x - cx - 9) // 3, k["bikeL"])  # 앞 카울 윗선
        c.rect(cx - 11, hip - 2, 9, 1, k["tire"])                    # 안장
        for x in range(cx - 12, cx + 14): c.px(x, hip, k["bikeL"])   # 윗선 반짝
        for x in range(cx - 2, cx + 17): c.px(x, hip + 2, hx("#e8ecf4") if x % 6 else k["bikeL"])  # 경주 줄무늬
        c.rect(cx + 2, hip + 3, 3, 1, hx("#ffffff"))                 # 번호
        c.line(cx + 10, hip - 5, cx + 13, hip - 9, GLASS); c.line(cx + 11, hip - 5, cx + 14, hip - 9, GLASS)  # 윈드스크린
        c.rect(cx + 16, hip - 1, 2, 2, k["lamp"])                     # 전조등 (높아진 앞 카울)
        c.line(cx - 6, hip + 6, cx - 16, hip + 2, k["chrome"]); c.px(cx - 17, hip + 1, k["rim"])  # 배기관
        c.px(cx - 17, hip - 3, hx("#ff2a3a"))                         # 꼬리등
        # 몸을 숙여 무릎을 탱크에 붙인 다리
        c.rect(cx - 4, hip - 2, 7, 2, k["legs"]); c.rect(cx + 1, hip, 2, 4, k["legs"]); c.rect(cx, hip + 4, 3, 1, k["shoe"])
    else:
        wy = 40
        c.rect(cx - 2, wy - 5, 4, 10, k["tire"]); c.rect(cx - 1, wy - 5, 2, 10, k["rim"])
        # 넓은 카울 (아래로 좁아짐)
        for i, half in enumerate((9, 9, 8, 8, 7, 6, 5, 4)):
            c.rect(cx - half, hip + i, half * 2, 1, k["bikeD"] if i >= 6 else k["bike"])
        c.rect(cx - 9, hip, 18, 1, k["bikeL"])
        for sx in (-1, 1):
            c.px(cx + sx * 10, hip - 2, k["chrome"]); c.px(cx + sx * 9, hip - 1, k["rim"])  # 백미러
            c.rect(cx + sx * 9 - (1 if sx < 0 else 0), hip + 2, 2, 5, k["legs"]); c.rect(cx + sx * 9 - (1 if sx < 0 else 0), hip + 7, 2, 1, k["shoe"])
        if v == "front":
            c.rect(cx - 4, hip - 3, 8, 3, GLASS); c.rect(cx - 3, hip - 3, 2, 1, hx("#ffffff"))  # 윈드스크린
            for sx in (-3, 2): c.rect(cx + sx, hip + 3, 2, 2, k["lamp"])                       # 두 전조등
            c.rect(cx - 1, hip + 2, 2, 4, hx("#e8ecf4"))                                        # 가운데 줄무늬
        else:
            c.rect(cx - 5, hip - 1, 10, 2, k["tire"])                                           # 안장
            c.rect(cx - 3, hip + 2, 6, 1, hx("#ff2a3a"))                                        # 꼬리등
            c.line(cx + 5, hip + 6, cx + 8, hip + 9, k["chrome"])                               # 배기관

def rider_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx = g["tx"], g["ty"], g["tw"], g["th"], g["cx"]
    if layer == "legs":
        # 서 있는 다리는 지우고 오토바이 위에 앉힘
        hip = g["hip"]
        for (x, y) in list(c.p.keys()):
            if y >= hip: del c.p[(x, y)]
        bike(c, g)
    if layer == "body":
        # 검은 가죽 재킷 · 가슴의 진한 파랑 줄 두 개 · 어깨 징
        if v in ("front", "back"):
            c.rect(tx, ty, tw, th, k["top"]); c.rect(tx, ty + 2, tw, 1, k["stripe"]); c.rect(tx, ty + 4, tw, 1, k["stripe"])
            c.px(tx - 2, ty, k["chrome"]); c.px(tx + tw + 1, ty, k["chrome"])
            if v == "front": c.line(cx, ty, cx, ty + th - 1, k["strap"])
        else:
            c.rect(cx - 3, ty, 6, th, k["top"]); c.rect(cx - 3, ty + 2, 6, 1, k["stripe"])
    if layer == "hair":
        # 뒤로 뾰족하게 넘긴 검은 머리 · 이마에 올린 하늘빛 고글
        if v == "front":
            c.rect(hx0, hy, hw, 3, k["hair"])
            for x in range(hx0, hx0 + hw, 2): c.px(x, hy - 1, k["hair"])
            c.rect(hx0 - 1, hy + 2, hw + 2, 1, k["strap"]); c.rect(hx0 + 1, hy + 1, 3, 2, k["goggle"]); c.rect(hx0 + hw - 4, hy + 1, 3, 2, k["goggle"])
        elif v == "back":
            c.rect(hx0, hy, hw, hh, k["hair"])
            for x in range(hx0, hx0 + hw, 2): c.px(x, hy - 1, k["hair"])
            c.rect(hx0 - 1, hy + 2, hw + 2, 1, k["strap"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0, hy + 1, 4, hh - 2, k["hair"])
            for i in range(3): c.px(hx0 - 1 - i, hy + i, k["hair"])
            c.rect(hx0, hy + 2, hw, 1, k["strap"]); c.rect(hx0 + hw - 3, hy + 1, 3, 2, k["goggle"])

BOMBER = dict(
    skin=hx("#e8c0a0"), skinD=hx("#c09878"), eye=hx("#3a2418"), eyeL=hx("#ff8a3a"), outline=hx("#4e4262"), blush=None,
    top=hx("#6a5a3a"), arm=hx("#6a5a3a"), legs=hx("#4a4a3a"), legsD=hx("#34342a"), shoe=hx("#2a2018"),
    hair=hx("#8a2a1a"), hairD=hx("#5a180e"), hairL=hx("#c8503a"),
    scarf=hx("#ff6a2a"), belt=hx("#3a2a1a"), bomb=hx("#2a2a34"), fuse=hx("#ffd040"), lens=hx("#ffb04a"), soot=hx("#5a5050"),
)

def bomber_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    fy = hy + hh - 4
    if layer == "body":
        # 국방색 작업복 · 주황 목도리 · 가슴을 가로지른 폭탄 띠 · 허리띠
        if v in ("front", "back"):
            c.rect(tx, ty, tw, th, k["top"]); c.rect(tx, hip - 2, tw, 1, k["belt"])
            c.rect(tx - 1, ty, tw + 2, 1, k["scarf"])
            for i in range(tw): c.px(tx + i, ty + 1 + i * (th - 3) // max(1, tw - 1), k["belt"])
            if v == "front":
                for i in (1, 4): c.px(tx + i, ty + 1 + i * (th - 3) // max(1, tw - 1) - 1, k["bomb"])
            else:
                c.px(cx + 3, ty, k["scarf"]); c.px(cx + 4, ty + 1, k["scarf"])
        else:
            c.rect(cx - 3, ty, 6, th, k["top"]); c.rect(cx - 3, ty, 6, 1, k["scarf"]); c.rect(cx - 3, hip - 2, 6, 1, k["belt"])
            c.px(cx - 4, ty + 1, k["scarf"]); c.px(cx - 5, ty + 2, k["scarf"])
        if g["cast"]:
            # 불붙은 폭탄을 든 손
            bx = tx + tw + 6 if v == "front" else cx + 8
            c.rect(bx, ty, 3, 3, k["bomb"]); c.px(bx + 2, ty - 1, k["fuse"]); c.px(bx + 3, ty - 2, hx("#ffffff"))
    if layer == "hair":
        # 헝클어진 붉은 머리 · 이마에 올린 주황 고글 · 뺨의 그을음
        if v == "front":
            c.rect(hx0, hy, hw, 3, k["hair"])
            for x in range(hx0 - 1, hx0 + hw + 1, 3): c.px(x, hy - 1, k["hair"])
            c.rect(hx0, hy + 2, hw, 1, k["belt"]); c.rect(hx0 + 1, hy + 1, 3, 2, k["lens"]); c.rect(hx0 + hw - 4, hy + 1, 3, 2, k["lens"])
            c.px(hx0 + hw - 3, fy + 2, k["soot"])
        elif v == "back":
            c.rect(hx0, hy, hw, hh, k["hair"])
            for x in range(hx0 - 1, hx0 + hw + 1, 3): c.px(x, hy - 1, k["hair"])
            c.rect(hx0 - 1, hy + 2, hw + 2, 1, k["belt"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0, hy + 1, 4, hh - 2, k["hair"]); c.px(hx0 - 1, hy, k["hair"])
            c.rect(hx0, hy + 2, hw, 1, k["belt"]); c.rect(hx0 + hw - 3, hy + 1, 3, 2, k["lens"])

ARTIFACTER = dict(
    skin=hx("#e0b898"), skinD=hx("#b89070"), eye=hx("#1a2a4a"), eyeL=hx("#6ab8ff"), outline=hx("#4e4262"), blush=None,
    top=hx("#24283a"), arm=hx("#e0b898"), legs=hx("#2a2e40"), legsD=hx("#1c1e2c"), shoe=hx("#1a1a22"),
    hair=hx("#e8ecf4"), hairD=hx("#a8b0c4"), hairL=hx("#ffffff"),
    ink=hx("#2a7aff"), inkL=hx("#a8e0ff"), coat=hx("#3a4058"), gun=hx("#4a5470"), brass=hx("#c8a040"),
)

def artifacter_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    if layer == "legs":
        # 무릎까지 오는 조끼 자락
        if v in ("front", "back"):
            c.rect(tx, hip, 2, 3, k["coat"]); c.rect(tx + tw - 2, hip, 2, 3, k["coat"])
        else:
            c.rect(cx - 3, hip, 2, 3, k["coat"])
    if layer == "body":
        # 소매 없는 긴 조끼 · 놋쇠 단추 · 맨팔 가득 푸른빛 문신 줄
        if v in ("front", "back"):
            c.rect(tx, ty, tw, th, k["top"]); c.rect(tx, ty, 2, th, k["coat"]); c.rect(tx + tw - 2, ty, 2, th, k["coat"])
            if v == "front": c.px(cx, ty + 2, k["brass"]); c.px(cx, ty + 4, k["brass"])
            sw = 0 if g["cast"] else (0, 1, 0, -1)[g["step"]]
            for ax, d in ((tx - 2, sw), (tx + tw, -sw)):
                if g["cast"] and v == "front" and ax > cx: continue
                for y in range(ty + 1 + d, ty + th + d): c.px(ax + (y % 2), y, k["ink"] if y % 3 else k["inkL"])
        else:
            c.rect(cx - 3, ty, 6, th, k["top"]); c.rect(cx - 3, ty, 2, th, k["coat"])
            if not g["cast"]:
                sw = (0, 2, 0, -2)[g["step"]]
                for y in range(ty + 2, ty + th): c.px(cx - 1 + sw // 2, y, k["ink"] if y % 3 else k["inkL"])
        if g["cast"]:
            # 뻗은 팔의 문신이 밝게 빛나고 손에 든 리펄스 총
            if v == "front":
                for x in range(tx + tw, tx + tw + 5): c.px(x, ty + 1, k["inkL"] if x % 2 else k["ink"])
                gx = tx + tw + 5
            else:
                for x in range(cx, cx + 7): c.px(x, ty + 1, k["inkL"] if x % 2 else k["ink"])
                gx = cx + 7
            c.rect(gx, ty, 3, 3, k["gun"]); c.px(gx + 3, ty + 1, k["inkL"])
    if layer == "hair":
        # 짧은 흰 머리 · 이마의 작은 푸른 문양
        if v == "front":
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0, hy + 1, 1, 4, k["hair"]); c.rect(hx0 + hw - 1, hy + 1, 1, 4, k["hair"])
            c.px(hx0 + hw // 2, hy + 3, k["ink"])
        elif v == "back":
            c.rect(hx0, hy, hw, hh - 1, k["hair"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0, hy + 1, 4, hh - 3, k["hair"])

PUNK = dict(
    skin=hx("#f2d4c4"), skinD=hx("#d0aa98"), eye=hx("#3a1a4a"), eyeL=hx("#ff4ad8"), outline=hx("#4e4262"), blush=hx("#ff8ab8"),
    top=hx("#f2d4c4"), arm=hx("#f2d4c4"), legs=hx("#1e1a28"), legsD=hx("#14101c"), shoe=hx("#1a1424"),
    hair=hx("#ff4ad8"), hairD=hx("#a82a8a"), hairL=hx("#ffb0f0"),
    jacket=hx("#1e1a28"), neon=hx("#4af0ff"), chrome=hx("#c8d0e0"), chromeD=hx("#8a92a8"), shorts=hx("#2a2440"), tip=hx("#4af0ff"),
)

def punk_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    if layer == "back_hair":
        # 한쪽으로 길게 내린 분홍 머리 (끝은 하늘빛)
        if v != "back":
            side = hx0 + hw - 2 if v == "front" else hx0
            c.rect(side, hy + 3, 3, hh + 3, k["hairD"]); c.rect(side, hy + hh + 5, 3, 1, k["tip"])
    if layer == "legs":
        # 짧은 반바지 · 허벅지 · 무릎 위까지 오는 검은 부츠(하늘빛 줄)
        if v in ("front", "back"):
            c.rect(tx, hip, tw, 2, k["shorts"]); c.px(tx, hip, k["neon"]); c.px(tx + tw - 1, hip, k["neon"])
            for lx in (cx - tw // 2 + 1, cx + tw // 2 - 3):
                c.rect(lx, hip + 2, 2, 2, k["skin"]); c.rect(lx, hip + 4, 2, 1, k["neon"])
        else:
            c.rect(cx - 3, hip, 6, 2, k["shorts"]); c.rect(cx - 2, hip + 2, 4, 2, k["skin"]); c.rect(cx - 2, hip + 4, 4, 1, k["neon"])
    if layer == "body":
        # 배가 드러난 짧은 검은 재킷(하늘빛 단) · 크롬 왼팔
        if v in ("front", "back"):
            c.rect(tx, ty, tw, 3, k["jacket"]); c.rect(tx, ty + 3, tw, 1, k["neon"])
            if v == "front": c.px(cx, hip - 3, k["skinD"])
            c.rect(tx - 2, ty + 1, 2, th - 1, k["chrome"]); c.px(tx - 2, ty + 3, k["neon"]); c.rect(tx - 2, ty + th - 1, 2, 1, k["chromeD"])
            c.rect(tx - 2, ty, 2, 1, k["jacket"]); c.rect(tx + tw, ty, 2, 1, k["jacket"])
        else:
            c.rect(cx - 3, ty, 6, 3, k["jacket"]); c.rect(cx - 3, ty + 3, 6, 1, k["neon"])
        if g["cast"]:
            # 뻗은 손끝의 네온 칼날
            bx = tx + tw + 6 if v == "front" else cx + 8
            c.line(bx, ty + 1, bx + 4, ty - 3, k["eyeL"]); c.line(bx + 1, ty + 1, bx + 5, ty - 3, hx("#ffffff"))
    if layer == "hair":
        # 한쪽을 밀어 올린 분홍 머리 · 반대쪽 옆머리는 짧게 밀어 하늘빛 · 귀의 크롬 장치
        if v == "front":
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 + hw - 3, hy + 1, 3, hh - 1, k["hair"])
            c.rect(hx0, hy + 1, 1, 3, k["neon"]); c.px(hx0, hy + hh - 3, k["chrome"])
            c.rect(hx0 + 2, hy - 1, hw - 3, 1, k["hairL"])
        elif v == "back":
            c.rect(hx0, hy, hw, hh, k["hair"]); c.rect(hx0, hy + 1, 2, hh - 2, k["neon"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0, hy + 1, 4, hh - 2, k["hair"]); c.rect(hx0 + 1, hy - 1, hw - 2, 1, k["hairL"])

GEO = {
    "automata": dict(head=(10, 9), torso=(8, 7), leg=8),
    "rider": dict(head=(12, 11), torso=(12, 10), leg=12, size=48),
    "bomber": dict(head=(10, 9), torso=(9, 7), leg=8),
    "artifacter": dict(head=(10, 9), torso=(9, 8), leg=8),
    "punk": dict(head=(10, 9), torso=(8, 7), leg=9),
}

def main():
    save_sheet("automata", lambda r, col: person(AUTOMATA, r, col, GEO["automata"], automata_deco))
    save_sheet("rider", lambda r, col: person(RIDER, r, col, GEO["rider"], rider_deco), size=48)
    save_sheet("bomber", lambda r, col: person(BOMBER, r, col, GEO["bomber"], bomber_deco))
    save_sheet("artifacter", lambda r, col: person(ARTIFACTER, r, col, GEO["artifacter"], artifacter_deco))
    save_sheet("punk", lambda r, col: person(PUNK, r, col, GEO["punk"], punk_deco))

if __name__ == "__main__":
    main()
