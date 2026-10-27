# 시즌 2 아스칼론 캐릭터 방향 시트 (python3 scripts/art/ascalon_sprites.py) → apps/client/public/sprites/{tracker,forgotten}.png
# 그림체는 s2_common.person (시즌 1 그림체: 얼굴 아래 4줄·입 없음·보랏빛 테두리, docs/ART.md)
# 추적자(여): 높이 묶은 밤색 포니테일 · 초록 눈 · 목 뒤로 내린 국방색 두건 망토 · 짙은 사냥복에 가죽 탄띠 · 등에 멘 긴 저격총(붉은 조준경 빛)
#   공격 칸은 저격총을 들어 앞으로 겨눔 (긴 총열 · 위에 조준경)
# 잊혀진 자(여): 허리까지 흘러내리는 백금빛 긴 머리 · 금빛 눈 · 이마의 금 머리띠와 하늘빛 보석 · 어깨를 드러낸 흰 여신 드레스(금 테·금 허리끈) · 팔의 금 팔찌
#   공격 칸은 뻗은 손끝에 빛 구슬이 맺힘
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

GEO = {
    "tracker": dict(head=(10, 9), torso=(8, 7), leg=9),
    "forgotten": dict(head=(10, 9), torso=(8, 7), leg=9),
}

def main():
    save_sheet("tracker", lambda r, col: person(TRACKER, r, col, GEO["tracker"], tracker_deco))
    save_sheet("forgotten", lambda r, col: person(FORGOTTEN, r, col, GEO["forgotten"], forgotten_deco))

if __name__ == "__main__":
    main()
