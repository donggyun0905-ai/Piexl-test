# 차원의 순례자 방향 시트 (python3 scripts/art/pilgrim_sprite.py) → apps/client/public/sprites/pilgrim.png
# 히든 상점 꼬마 (나중에 히든 캐릭터 '차원 순례자'로도 씀). 몸·얼굴은 s2_common.person (시즌 1 그림체)
# 하늘색 단발 · 진한 파랑 눈동자 안에 노란 십자 · 평범한 옷 (흰 셔츠·청바지) · 키보다 훨씬 큰 배낭 (장비가 삐죽삐죽) → 48칸
from s2_common import hx, person, save_sheet

PILGRIM = dict(
    skin=hx("#f4d2b8"), skinD=hx("#d8aa8c"), eye=hx("#1a3a9a"), eyeL=hx("#2a52c0"), outline=hx("#4e4262"),
    top=hx("#f2ece0"), arm=hx("#f2ece0"), legs=hx("#5a72a8"), legsD=hx("#42568a"), shoe=hx("#7a4e2a"),
    hair=hx("#7ad0f0"), hairD=hx("#4a9ac8"), hairL=hx("#d0f4ff"),
    pupil=hx("#14286e"), cross=hx("#ffe040"),
    bag=hx("#9a6438"), bagD=hx("#6a4022"), bagL=hx("#c08a52"), strap=hx("#5a3418"), buckle=hx("#e0b040"),
    roll=hx("#b83a3a"), rollD=hx("#82242a"), steel=hx("#c8d0dc"), steelD=hx("#7a8494"), wood=hx("#7a5230"),
    gem=hx("#ff6aa8"), pot=hx("#3a9a6a"), potL=hx("#a8f0c8"), flag=hx("#8a5aff"), cup=hx("#ffd040"), map=hx("#e8d8a8"),
)

def gear(c, k, x0, top):
    """배낭 위로 삐죽삐죽 튀어나온 장비 (x0 = 배낭 왼쪽, top = 배낭 윗줄)"""
    # 둘둘 만 침낭 (가로로 길게 · 끈 둘)
    c.rect(x0 + 1, top - 4, 20, 4, k["roll"]); c.rect(x0 + 1, top - 1, 20, 1, k["rollD"])
    c.rect(x0 + 6, top - 4, 1, 4, k["strap"]); c.rect(x0 + 15, top - 4, 1, 4, k["strap"])
    # 칼 (손잡이·가드가 위로)
    c.rect(x0 + 3, top - 12, 1, 8, k["steel"]); c.rect(x0 + 1, top - 6, 5, 1, k["steelD"]); c.rect(x0 + 3, top - 14, 1, 2, k["wood"])
    # 지팡이 + 분홍 보석
    c.rect(x0 + 18, top - 15, 1, 11, k["wood"]); c.rect(x0 + 17, top - 18, 3, 3, k["gem"]); c.px(x0 + 17, top - 18, k["hairL"])
    # 깃발 (보라 차원 깃발)
    c.rect(x0 + 12, top - 16, 1, 12, k["steelD"]); c.rect(x0 + 13, top - 16, 4, 3, k["flag"])
    # 물약 병 · 황금 잔 · 둘둘 만 지도
    c.rect(x0 + 8, top - 8, 3, 4, k["pot"]); c.px(x0 + 9, top - 9, k["potL"]); c.px(x0 + 9, top - 10, k["wood"])
    c.rect(x0 + 5, top - 7, 3, 3, k["cup"]); c.px(x0 + 6, top - 4, k["cup"])
    c.rect(x0 + 14, top - 7, 2, 3, k["map"])

def backpack(c, k, x0, top, w, h, front):
    """큰 배낭 몸통: 주머니 · 버클 · 꿰맨 줄 (front: 몸 앞에서 보이는 모습은 테두리만, 몸이 가림)"""
    c.rect(x0, top, w, h, k["bag"]); c.rect(x0, top, w, 2, k["bagL"]); c.rect(x0, top + h - 2, w, 2, k["bagD"])
    if front: return
    c.rect(x0 + 2, top + h // 2, w - 4, h // 2 - 3, k["bagD"]); c.rect(x0 + 3, top + h // 2 + 1, w - 6, h // 2 - 5, k["bag"])
    c.rect(x0 + w // 2 - 1, top + h // 2 + 1, 2, 2, k["buckle"])
    for y in range(top + 3, top + h - 3, 3): c.px(x0 + 1, y, k["bagD"]); c.px(x0 + w - 2, y, k["bagD"])
    # 옆에 매단 작은 냄비
    c.rect(x0 - 2, top + 4, 2, 4, k["steelD"]); c.px(x0 - 3, top + 4, k["steel"])

def eye(c, k, x, y, w):
    """진한 파랑 눈동자 안에 노란 십자 (앞: 3×4, 옆: 2×4) · 왼쪽 위 흰 빛"""
    rows = ["WBB", "BYB", "YYY", "BYB"] if w == 3 else ["WB", "BY", "YY", "BY"]
    col = {"B": k["pupil"], "Y": k["cross"], "W": (244, 240, 255, 255)}
    for dy, row in enumerate(rows):
        for dx, ch in enumerate(row): c.px(x + dx, y + dy, col[ch])

def pilgrim_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    bw, bh = 22, 26
    btop = ty - 16 + g["bob"]
    if layer == "back_hair":
        # 앞·옆: 몸 뒤 배낭 (앞은 머리·몸 둘레로 삐져나옴, 옆은 등 쪽 = 왼쪽)
        if v == "front":
            backpack(c, k, cx - bw // 2, btop, bw, bh, True); gear(c, k, cx - bw // 2, btop)
        elif v == "side":
            backpack(c, k, cx - 14, btop + 2, 12, bh - 2, False); gear(c, k, cx - 15, btop + 2)
    if layer == "body":
        # 흰 셔츠 단추 · 어깨에 걸친 배낭 끈
        if v == "front":
            c.rect(tx + 1, ty, 1, th, k["strap"]); c.rect(tx + tw - 2, ty, 1, th, k["strap"])
            c.px(cx, ty + 2, k["skinD"]); c.px(cx, ty + 4, k["skinD"])
        elif v == "side":
            c.rect(cx - 2, ty, 1, th - 1, k["strap"])
    if layer == "hair":
        # 하늘색 단발: 앞머리 · 귀 옆으로 내려온 옆머리 · 정수리 삐침 한 가닥
        if v == "front":
            c.rect(hx0, hy, hw, 4, k["hair"]); c.rect(hx0 - 1, hy + 2, 2, hh - 1, k["hair"]); c.rect(hx0 + hw - 1, hy + 2, 2, hh - 1, k["hair"])
            for x in range(hx0 + 1, hx0 + hw - 1, 3): c.px(x, hy + 4, k["hair"])
        elif v == "back":
            c.rect(hx0 - 1, hy, hw + 2, hh + 1, k["hair"]); c.rect(cx - 1, hy + 2, 1, hh - 2, k["hairD"])
        else:
            c.rect(hx0, hy, hw, 4, k["hair"]); c.rect(hx0 - 1, hy + 1, 5, hh, k["hair"]); c.px(hx0 + hw - 1, hy + 4, k["hair"])
        c.px(cx, hy - 1, k["hair"]); c.px(cx + 1, hy - 2, k["hair"])
    if layer == "hat":
        fy = hy + hh - 4
        if v == "front":
            fx0, fw = hx0 + 1, hw - 2
            # 큰 눈 (얼굴 위쪽 3줄)
            for ex in (fx0 + 1, fx0 + fw - 4): eye(c, k, ex, fy - 2, 3)
        elif v == "side":
            eye(c, k, hx0 + hw - 3, fy - 2, 2)
        else:
            # 뒤: 등을 다 가리는 배낭 (머리 위쪽만 보임)
            backpack(c, k, cx - bw // 2, hy + 5, bw, hip - hy - 3, False); gear(c, k, cx - bw // 2, hy + 5)
            # 하늘색 머리 윗부분은 장비 앞으로 보이게
            c.rect(hx0 - 1, hy, hw + 2, 5, k["hair"]); c.rect(cx - 1, hy + 2, 1, 3, k["hairD"]); c.px(cx, hy - 1, k["hair"]); c.px(cx + 1, hy - 2, k["hair"])

GEO = dict(head=(12, 10), torso=(8, 7), leg=6, size=48)

def main():
    save_sheet("pilgrim", lambda r, col: person(PILGRIM, r, col, GEO, pilgrim_deco), size=48)

if __name__ == "__main__":
    main()
