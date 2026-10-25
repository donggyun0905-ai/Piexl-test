# 시즌 2 비르디아 캐릭터 방향 시트 (python3 scripts/art/virdia_sprites.py) → apps/client/public/sprites/{idra,byeonhui}.png
# 이드라: 세계수의 아이 (작은 여자아이) · 잎사귀 머리카락에 꽃 장식 · 연둣빛 원피스 · 맨발에 덩굴 발찌
# 렌: 두건 달린 로브의 토목 소녀
# 변희: 만물의 소녀 · 헝클어진 긴 적갈색 머리 · 짐승 이빨 목걸이 · 배가 드러난 짧은 윗옷 · 짧은 바지 · 맨발, 몸에 짐승 무늬 칠
from s2_common import hx, person, save_sheet

IDRA = dict(
    skin=hx("#f6dcc4"), skinD=hx("#d8b49a"), eye=hx("#1e5a2a"), eyeL=hx("#5ac84a"), mouth=hx("#e8907a"), outline=hx("#4e4262"),
    top=hx("#c8f0a0"), arm=hx("#f6dcc4"), legs=hx("#f6dcc4"), legsD=hx("#d8b49a"), shoe=hx("#6a8a3a"),
    hair=hx("#5ac84a"), hairD=hx("#2a8a3a"), hairL=hx("#9ae870"), dress=hx("#a8e080"), dressD=hx("#78b858"), bloom=hx("#ff8ac8"), gold=hx("#ffd040"),
)

def idra_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    if layer == "back_hair" and v != "back":
        # 어깨까지 오는 잎사귀 머리 (뒤쪽)
        c.rect(hx0 - 1, hy + 3, hw + 2, hh + 1, k["hairD"])
    if layer == "body":
        # 원피스: 몸통 + 퍼지는 치마 (다리 위쪽을 덮음)
        tx, ty, tw, th = g["tx"], g["ty"], g["tw"], g["th"]
        if v in ("front", "back"):
            c.rect(tx, ty, tw, th, k["dress"])
            for i in range(3): c.rect(tx - 1 - i // 2, ty + th + i, tw + 2 + i, 1, k["dress"] if i < 2 else k["dressD"])
            if v == "front": c.px(g["cx"], ty + 1, k["bloom"]); c.px(g["cx"] - 1, ty + 2, k["gold"])
        else:
            c.rect(g["cx"] - 3, ty, 6, th, k["dress"])
            for i in range(3): c.rect(g["cx"] - 4, ty + th + i, 8, 1, k["dress"] if i < 2 else k["dressD"])
    if layer == "hair":
        if v == "back":
            c.rect(hx0, hy, hw, hh + 3, k["hair"]); c.rect(hx0 + 1, hy + hh + 1, hw - 2, 2, k["hairD"])
            for x in (hx0 + 1, hx0 + 4, hx0 + 7): c.px(x, hy + 3, k["hairL"])
        elif v == "front":
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 2, hh + 1, k["hair"]); c.rect(hx0 + hw - 1, hy + 1, 2, hh + 1, k["hair"])
            c.px(hx0 + 3, hy + 3, k["hair"]); c.px(hx0 + 6, hy + 3, k["hair"])
            for x in (hx0 + 1, hx0 + 5, hx0 + 8): c.px(x, hy - 1, k["hairL"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 4, hh + 1, k["hair"]); c.px(hx0 + 1, hy - 1, k["hairL"]); c.px(hx0 + 5, hy - 1, k["hairL"])
        # 꽃 장식 (옆머리)
        fx = hx0 + hw - 1 if v != "back" else hx0
        c.px(fx, hy + 1, k["bloom"]); c.px(fx + 1, hy + 1, k["bloom"]); c.px(fx, hy + 2, k["bloom"]); c.px(fx + 1, hy + 2, k["gold"])

BYEON = dict(
    skin=hx("#e8b890"), skinD=hx("#c08a64"), eye=hx("#5a2a0a"), eyeL=hx("#e8901a"), mouth=hx("#b85a4a"), outline=hx("#4e4262"),
    top=hx("#e8b890"), arm=hx("#e8b890"), legs=hx("#e8b890"), legsD=hx("#c08a64"), shoe=hx("#c08a64"),
    hair=hx("#8a3a1e"), hairD=hx("#5a2010"), hairL=hx("#b85a2a"), crop=hx("#3a5a2a"), cropD=hx("#24401a"), shorts=hx("#6a4a2a"),
    fang=hx("#f4ecd8"), cord=hx("#3a2414"), paint=hx("#b83a2a"), fur=hx("#c8a070"),
)

def byeon_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx = g["tx"], g["ty"], g["tw"], g["th"], g["cx"]
    if layer == "back_hair" and v != "back":
        # 허리까지 오는 헝클어진 머리
        c.rect(hx0 - 1, hy + 3, hw + 2, hh + 6, k["hairD"]); c.px(hx0 - 2, hy + 8, k["hairD"]); c.px(hx0 + hw + 1, hy + 10, k["hairD"])
    if layer == "legs":
        # 짧은 바지 (허벅지 위쪽만)
        hip = g["hip"]
        if v in ("front", "back"):
            c.rect(tx, hip, tw, 3, k["shorts"]); c.px(tx, hip + 3, k["shorts"]); c.px(tx + tw - 1, hip + 3, k["shorts"])
        else:
            c.rect(cx - 3, hip, 6, 3, k["shorts"])
    if layer == "body":
        # 배가 드러난 짧은 윗옷 (가슴만) · 짐승 이빨 목걸이 · 팔 무늬
        if v in ("front", "back"):
            c.rect(tx, ty, tw, 4, k["crop"]); c.rect(tx + 1, ty + 4, tw - 2, 1, k["cropD"])
            if v == "front":
                c.rect(tx + 1, ty, tw - 2, 1, k["skin"]); c.line(tx + 1, ty, cx, ty + 2, k["cord"]); c.line(cx, ty + 2, tx + tw - 2, ty, k["cord"]); c.px(cx, ty + 3, k["fang"]); c.px(cx - 2, ty + 2, k["fang"]); c.px(cx + 1, ty + 2, k["fang"])
                c.px(cx, ty + 6, k["skinD"])
            c.px(tx - 2, ty + 3, k["paint"]); c.px(tx + tw + 1, ty + 3, k["paint"])
        else:
            c.rect(cx - 3, ty, 6, 4, k["crop"]); c.rect(cx - 2, ty + 4, 4, 1, k["cropD"]); c.px(cx + 2, ty + 1, k["fang"])
        # 허리에 두른 털 (한쪽)
        c.rect(tx if v != "side" else cx - 3, g["hip"] - 1, 3, 2, k["fur"])
    if layer == "hair":
        if v == "back":
            c.rect(hx0 - 1, hy, hw + 2, hh + 8, k["hair"]); c.rect(hx0, hy + hh + 5, hw, 3, k["hairD"])
            for x in (hx0 + 1, hx0 + 4, hx0 + 7): c.px(x, hy + 2, k["hairL"])
        elif v == "front":
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 2, hh + 4, k["hair"]); c.rect(hx0 + hw - 1, hy + 1, 2, hh + 4, k["hair"])
            c.px(hx0 + 2, hy + 3, k["hair"]); c.px(hx0 + 5, hy + 3, k["hair"]); c.px(hx0 + 1, hy - 1, k["hairL"]); c.px(hx0 + hw - 2, hy - 1, k["hairL"])
            # 볼의 짐승 무늬
            c.px(hx0 + 1, hy + hh // 2 + 2, k["paint"]); c.px(hx0 + hw - 2, hy + hh // 2 + 2, k["paint"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 4, hh + 6, k["hair"]); c.px(hx0 + 2, hy - 1, k["hairL"])
            c.px(hx0 + hw - 1, hy + hh // 2 + 2, k["paint"])

FLY = dict(
    skin=hx("#f0d0b8"), skinD=hx("#c8a890"), eye=hx("#1a3a4a"), eyeL=hx("#3ad8e8"), mouth=hx("#c86a6a"), outline=hx("#4e4262"),
    top=hx("#f0d0b8"), arm=hx("#f0d0b8"), legs=hx("#1e1e26"), legsD=hx("#141418"), shoe=hx("#2a2a34"),
    hair=hx("#2a8aa8"), hairD=hx("#1a5a7a"), hairL=hx("#6ad8e8"), crop=hx("#1e1e26"), cropL=hx("#3a3a48"),
    wing=hx("#d8f8ff"), wingM=hx("#b0ecff"), wingT=hx("#e8d0ff"), wingS=hx("#3a8aa8"), wingD=hx("#5ac0e0"), vein=hx("#ffffff"),
)

def wing_px(c, x0, y0, side, ang, ln, wd, k):
    """잠자리 날개 한 장: (x0,y0)에서 side 쪽으로 ang(위로 -) 기울여 길이 ln, 폭 wd인 긴 잎꼴"""
    import math
    dx, dy = math.cos(ang) * side, math.sin(ang)
    for y in range(int(y0 - ln) - 2, int(y0 + ln) + 3):
        for x in range(int(x0 - ln) - 2, int(x0 + ln) + 3):
            u = (x - x0) * dx + (y - y0) * dy           # 날개 길이 방향
            w = -(x - x0) * dy + (y - y0) * dx          # 폭 방향
            if u < 0.5 or u > ln: continue
            half = wd * math.sin(math.pi * min(1.0, u / ln * 0.95 + 0.05)) * (1.0 if w < 0 else 0.75)
            if abs(w) > half: continue
            edge = abs(w) > half - 0.9 or u > ln - 1.0
            t = u / ln
            col = k["wingD"] if edge else k["vein"] if abs(w) < 0.5 else k["wingT"] if t > 0.72 and w < 0 else k["wing"] if t < 0.45 else k["wingM"]
            if not edge and t > 0.82 and abs(w) < 1.2: col = k["wingS"]
            c.px(x, y, col)
        # 가로 날개맥
    for i in range(1, 4):
        u = ln * i / 4
        bx, by = x0 + dx * u, y0 + dy * u
        c.px(bx - dy * 1.4, by + dx * 1.4 * side * side, k["vein"])

def fly_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx = g["tx"], g["ty"], g["tw"], g["th"], g["cx"]
    if layer == "back_hair":
        # 등의 큰 잠자리 날개 네 장: 칸 끝까지 펼친 투명한 날개 · 흰 날개맥 · 끝에 무지갯빛 · 걸을 때 파닥임
        flut = (0, -1, 0, 1)[g["step"]]
        root_y = ty + 2
        if v in ("front", "back"):
            for side in (-1, 1):
                for ang, ln, wd in ((-0.5 + flut * 0.08, 15, 2.7), (0.42 - flut * 0.08, 12.5, 2.2)):
                    wing_px(c, cx + side * 2, root_y, side, ang, ln, wd, k)
        else:
            # 옆모습: 등 뒤로 두 쌍이 겹쳐 비스듬히
            for ang, ln, wd in ((-0.6 + flut * 0.08, 14, 2.6), (-0.05 - flut * 0.08, 12, 2.2)):
                wing_px(c, cx - 1, root_y, -1, ang, ln, wd, k)
        # 짧은 단발 (뒤쪽)
        if v != "back": c.rect(hx0 - 1, hy + 3, hw + 2, hh - 1, k["hairD"])
    if layer == "legs":
        # 까만 레깅스 위에 은빛 줄
        hip = g["hip"]
        if v in ("front", "back"):
            c.px(tx + 1, hip + 3, k["cropL"]); c.px(tx + tw - 2, hip + 3, k["cropL"])
    if layer == "body":
        # 배가 드러난 짧은 윗옷 · 손끝의 날카로운 발톱
        if v in ("front", "back"):
            c.rect(tx, ty, tw, 4, k["crop"]); c.rect(tx, ty + 4, tw, 1, k["cropL"])
            c.rect(tx, g["hip"] - 1, tw, 2, k["crop"])
            for hxp in (tx - 2, tx + tw + 1):
                c.px(hxp, ty + th + 1, k["wing"])
        else:
            c.rect(cx - 3, ty, 6, 4, k["crop"]); c.rect(cx - 3, g["hip"] - 1, 6, 2, k["crop"])
            c.px(cx + 1, ty + th + 1, k["wing"])
    if layer == "hair":
        if v == "back":
            c.rect(hx0 - 1, hy, hw + 2, hh, k["hair"]); c.rect(hx0, hy + hh - 2, hw, 2, k["hairD"])
        elif v == "front":
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 2, hh - 1, k["hair"]); c.rect(hx0 + hw - 1, hy + 1, 2, hh - 1, k["hair"])
            c.px(hx0 + 3, hy + 3, k["hair"]); c.px(hx0 + hw - 2, hy - 1, k["hairL"]); c.px(hx0 + 1, hy - 1, k["hairL"])
            # 겹눈 같은 고글 띠
            c.rect(hx0 + 1, hy + 1, hw - 2, 1, k["hairL"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 4, hh - 1, k["hair"]); c.px(hx0 + 4, hy - 1, k["hairL"])

ELDER = dict(
    skin=hx("#e0b898"), skinD=hx("#b88a6a"), eye=hx("#2a2a2a"), mouth=hx("#f4f4f0"), outline=hx("#4e4262"),
    top=hx("#6a7a5a"), arm=hx("#6a7a5a"), legs=hx("#5a6a4a"), legsD=hx("#4a5a3a"), shoe=hx("#3a2a1a"),
    smallEye=True, blush=None, beard=hx("#f4f4f0"), beardD=hx("#c8c8c0"), robeL=hx("#8a9a72"), sash=hx("#c8a040"), staff=hx("#8a6a3a"), staffD=hx("#5a4020"), gem=hx("#5ac84a"),
)

def elder_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx = g["tx"], g["ty"], g["tw"], g["th"], g["cx"]
    if layer == "legs":
        # 긴 도포 자락이 다리를 덮음
        hip = g["hip"]
        if v in ("front", "back"):
            for i in range(5): c.rect(tx - i // 2, hip + i, tw + i, 1, k["top"])
        else:
            for i in range(5): c.rect(cx - 3, hip + i, 6 + i // 2, 1, k["top"])
    if layer == "body":
        # 허리띠 · 지팡이(옆에 세움, 끝에 초록 구슬)
        c.rect(tx if v != "side" else cx - 3, g["hip"] - 2, tw if v != "side" else 6, 1, k["sash"])
        if v == "front": c.rect(cx - 1, ty, 2, th - 2, k["robeL"])
        if not g["cast"]:
            sx = tx + tw + 2 if v != "back" else tx - 3
            if v == "side": sx = cx + 3
            c.rect(sx, ty - 5, 1, 18 + 3, k["staff"]); c.px(sx, ty - 6, k["gem"]); c.px(sx - 1, ty - 5, k["staffD"]); c.px(sx + 1, ty - 5, k["staffD"])
        else:
            c.line(cx + tw // 2 + 4, ty - 6, cx + tw // 2 + 6, ty + 10, k["staff"]); c.px(cx + tw // 2 + 4, ty - 7, k["gem"])
    if layer == "hair":
        if v == "back":
            c.rect(hx0 + 1, hy + 4, hw - 2, hh - 4, k["beardD"]); c.rect(hx0 + 2, hy + 1, hw - 4, 2, k["skin"])
        elif v == "front":
            # 벗어진 머리 · 하얀 눈썹 · 길게 늘어진 수염
            c.rect(hx0, hy + 2, 2, 4, k["beardD"]); c.rect(hx0 + hw - 2, hy + 2, 2, 4, k["beardD"])
            c.rect(hx0 + 1, hy + hh // 2, 3, 1, k["beard"]); c.rect(hx0 + hw - 4, hy + hh // 2, 3, 1, k["beard"])
            c.rect(hx0 + 1, hy + hh - 2, hw - 2, 3, k["beard"]); c.rect(hx0 + 2, hy + hh + 1, hw - 4, 4, k["beard"]); c.rect(cx - 1, hy + hh + 5, 3, 2, k["beardD"])
        else:
            c.rect(hx0, hy + 2, 3, 4, k["beardD"]); c.rect(hx0 + hw - 3, hy + hh // 2, 3, 1, k["beard"])
            c.rect(hx0 + hw - 4, hy + hh - 2, 4, 3, k["beard"]); c.rect(hx0 + hw - 4, hy + hh + 1, 3, 4, k["beard"])

REN = dict(
    skin=hx("#e8c0a0"), skinD=hx("#c09878"), eye=hx("#3a2a14"), eyeL=hx("#e8b040"), mouth=hx("#b86a5a"), outline=hx("#4e4262"),
    top=hx("#4a5a32"), arm=hx("#4a5a32"), legs=hx("#3a2a1a"), legsD=hx("#2a1e12"), shoe=hx("#3a2a1a"),
    hair=hx("#6a4a2a"), hairD=hx("#4a3018"), hairL=hx("#9a6a3a"), sash=hx("#5ac84a"),
    robe=hx("#4a5a32"), robeD=hx("#34402a"), robeL=hx("#6a7a48"), trim=hx("#b89858"), hood=hx("#3e4c2a"), shade=hx("#5a4030"),
    rock=hx("#a8a090"), rockD=hx("#7a7268"), wood=hx("#8a6a3a"), leaf=hx("#5ac84a"),
)

def ren_deco(c, layer, g):
    """렌: 떠돌이처럼 두건 달린 긴 이끼빛 로브 · 금빛 단 · 초록 허리띠 · 목둘레에 둥실 뜬 토목 고리"""
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx = g["tx"], g["ty"], g["tw"], g["th"], g["cx"]
    hip = g["hip"]
    if layer == "back_hair":
        # 두건 뒷자락 (어깨까지 늘어짐)
        c.rect(hx0 - 1, hy + 1, hw + 2, hh + 3, k["hood"])
        if v != "back": c.rect(hx0 + 1, hy + 3, hw - 2, hh - 1, k["hairD"])
    if layer == "legs":
        # 발목까지 내려오는 로브 자락: 아래로 갈수록 넓어짐 · 걸을 때 끝이 흔들림
        sway = (0, 1, 0, -1)[g["step"]]
        top = hip - 1
        for i, y in enumerate(range(top, 28)):
            w = tw - 1 + (i * 2) // 3
            x0 = cx - w // 2 + (sway if y > 24 else 0)
            c.rect(x0, y, w, 1, k["robe"])
            if v != "back": c.px(x0, y, k["robeD"]); c.px(x0 + w - 1, y, k["robeD"])
            if v in ("front",) and y > top + 1: c.px(cx, y, k["robeD"])
        bw = tw - 1 + ((27 - top) * 2) // 3
        c.rect(cx - bw // 2 + sway, 27, bw, 1, k["trim"])
    if layer == "body":
        # 어깨 망토 (몸통보다 넓게) · 금빛 단 · 초록 허리띠
        if v in ("front", "back"):
            c.rect(tx - 1, ty, tw + 2, 3, k["robeL"]); c.rect(tx - 1, ty + 3, tw + 2, 1, k["trim"])
            if v == "front":
                c.line(cx, ty + 4, cx, hip - 3, k["robeD"]); c.px(cx - 1, ty + 4, k["trim"])
        else:
            c.rect(cx - 4, ty, 8, 3, k["robeL"]); c.rect(cx - 4, ty + 3, 8, 1, k["trim"])
        c.rect(tx if v != "side" else cx - 3, hip - 2, tw if v != "side" else 6, 1, k["sash"])
        bob = (0, 1, 0, 1)[g["step"]]
        ring = [(-6, 0), (-4, -2), (-1, -3), (2, -3), (5, -2), (7, 0), (5, 2), (-4, 2)]
        for i, (dx, dy) in enumerate(ring):
            col = (k["rock"], k["wood"], k["rockD"], k["wood"])[i % 4]
            c.px(cx + dx, ty - 1 + dy - bob, col); c.px(cx + dx + 1, ty - 1 + dy - bob, col)
        c.px(cx + 1, ty - 4 - bob, k["leaf"])
    if layer == "hair":
        # 두건: 머리를 덮고 얼굴 위는 그늘, 끝이 살짝 뾰족 · 앞머리 한 가닥과 잎
        if v == "back":
            c.rect(hx0, hy - 1, hw, hh + 3, k["hood"]); c.rect(hx0 - 1, hy + 1, hw + 2, hh + 1, k["hood"]); c.px(cx + 1, hy - 2, k["hood"]); c.px(cx + 2, hy - 3, k["hood"])
            c.line(cx, hy + 1, cx, hy + hh, k["robeD"])
        elif v == "front":
            c.rect(hx0 + 1, hy - 2, hw - 2, 1, k["hood"]); c.rect(hx0, hy - 1, hw, 3, k["hood"]); c.px(cx + 1, hy - 3, k["hood"]); c.px(cx + 2, hy - 4, k["hood"])
            c.rect(hx0 - 1, hy + 1, 2, hh + 2, k["hood"]); c.rect(hx0 + hw - 1, hy + 1, 2, hh + 2, k["hood"])
            c.rect(hx0 + 1, hy + 1, hw - 2, 1, k["robeL"]); c.px(hx0 + 1, hy + 2, k["robeL"]); c.px(hx0 + hw - 2, hy + 2, k["robeL"])
            c.rect(hx0 + 2, hy + 2, hw - 4, 1, k["shade"])
            c.px(hx0 + 2, hy + 3, k["hair"]); c.px(hx0 + 3, hy + 3, k["hair"]); c.px(hx0 + hw - 3, hy + 3, k["hairL"])
            c.px(hx0 + hw - 2, hy - 1, k["leaf"])
        else:
            c.rect(hx0 - 1, hy - 1, hw + 1, 3, k["hood"]); c.px(hx0 + 3, hy - 2, k["hood"]); c.px(hx0 + 2, hy - 3, k["hood"])
            c.rect(hx0 - 1, hy + 1, 4, hh + 1, k["hood"]); c.rect(hx0 + 3, hy + 2, hw - 3, 1, k["shade"])
            c.px(hx0 + 5, hy - 1, k["leaf"])

SPIRITIST = dict(
    skin=hx("#f6dcc8"), skinD=hx("#d8b8a0"), eye=hx("#2a3a7a"), eyeL=hx("#8ab8ff"), mouth=hx("#e8907a"), outline=hx("#4e4262"),
    top=hx("#f4f4f8"), arm=hx("#f4f4f8"), legs=hx("#f6dcc8"), legsD=hx("#d8b8a0"), shoe=hx("#2a2030"),
    hair=hx("#2a2a4a"), hairD=hx("#1a1a30"), hairL=hx("#4a4a7a"), navy=hx("#2a3a6a"), navyL=hx("#3a5a9a"), ribbon=hx("#d83a4a"), sock=hx("#1e1e2a"),
)

def spiritist_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx = g["tx"], g["ty"], g["tw"], g["th"], g["cx"]
    if layer == "back_hair" and v != "back":
        c.rect(hx0 - 1, hy + 3, hw + 2, hh + 6, k["hairD"])
    if layer == "legs":
        # 남색 주름치마 · 검은 긴 양말
        hip = g["hip"]
        if v in ("front", "back"):
            for i in range(4): c.rect(tx - 1 - i // 2, hip - 1 + i, tw + 2 + i, 1, k["navy"] if i % 2 == 0 else k["navyL"])
            c.rect(tx + 1, FOOT_SOCK, 2, 3, k["sock"]); c.rect(tx + tw - 3, FOOT_SOCK, 2, 3, k["sock"])
        else:
            for i in range(4): c.rect(cx - 4, hip - 1 + i, 8, 1, k["navy"] if i % 2 == 0 else k["navyL"])
    if layer == "body":
        # 세일러 깃 · 빨간 리본 · 소매 끝
        if v == "front":
            c.rect(tx, ty, tw, 2, k["navy"]); c.px(tx + 1, ty + 2, k["navy"]); c.px(tx + tw - 2, ty + 2, k["navy"])
            c.px(cx - 1, ty + 2, k["ribbon"]); c.px(cx, ty + 2, k["ribbon"]); c.px(cx - 1, ty + 3, k["ribbon"]); c.px(cx, ty + 4, k["ribbon"])
        elif v == "back":
            c.rect(tx, ty, tw, 4, k["navy"]); c.rect(tx + 1, ty + 3, tw - 2, 1, WHITE)
        else:
            c.rect(cx - 3, ty, 6, 2, k["navy"]); c.px(cx + 2, ty + 2, k["ribbon"])
    if layer == "hair":
        if v == "back":
            c.rect(hx0 - 1, hy, hw + 2, hh + 8, k["hair"]); c.rect(hx0, hy + hh + 6, hw, 2, k["hairD"])
        elif v == "front":
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 2, hh + 6, k["hair"]); c.rect(hx0 + hw - 1, hy + 1, 2, hh + 6, k["hair"])
            c.px(hx0 + 3, hy + 3, k["hair"]); c.px(hx0 + 6, hy + 3, k["hair"]); c.px(hx0 + 2, hy - 1, k["hairL"])
            # 머리 장식: 작은 정령 빛 구슬
            c.px(hx0 + hw - 1, hy + 1, k["eyeL"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 4, hh + 7, k["hair"]); c.px(hx0 + 3, hy - 1, k["hairL"])

FOOT_SOCK = 25
WHITE = hx("#ffffff")

# 몸 크기 (머리는 조금 크게 · virdia_skins도 같이 씀)
GEO = {
    "idra": dict(head=(11, 9), torso=(7, 6), leg=6),
    "byeonhui": dict(head=(10, 9), torso=(8, 8), leg=8),
    "fly": dict(head=(10, 9), torso=(8, 8), leg=8),
    "elder": dict(head=(10, 9), torso=(9, 9), leg=7),
    "ren": dict(head=(10, 9), torso=(8, 8), leg=8),
    "spiritist": dict(head=(10, 9), torso=(8, 7), leg=8),
}

def main():
    save_sheet("idra", lambda r, col: person(IDRA, r, col, GEO["idra"], idra_deco))
    save_sheet("byeonhui", lambda r, col: person(BYEON, r, col, GEO["byeonhui"], byeon_deco))
    save_sheet("fly", lambda r, col: person(FLY, r, col, GEO["fly"], fly_deco))
    save_sheet("elder", lambda r, col: person(ELDER, r, col, GEO["elder"], elder_deco))
    save_sheet("ren", lambda r, col: person(REN, r, col, GEO["ren"], ren_deco))
    save_sheet("spiritist", lambda r, col: person(SPIRITIST, r, col, GEO["spiritist"], spiritist_deco))

if __name__ == "__main__":
    main()
