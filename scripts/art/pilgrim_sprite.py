# 차원의 순례자 방향 시트 (python3 scripts/art/pilgrim_sprite.py) → apps/client/public/sprites/pilgrim.png
# 히든 상점 여자아이 = 히든 캐릭터 '차원의 순례자'. 48칸 (발 여백 3), 머리가 큰 귀여운 비율 · 얼굴은 갸름한 V라인
# 허리까지 풍성하게 물결치는 분홍빛 긴 머리 · 큰 파랑 눈 안 노란 십자 · 헐렁한 회녹색 후드 재킷(넓은 소매)·흰 티·남색 반바지·베이지 끈 부츠
# 등에 몸보다 훨씬 큰 둥글고 푹신한 천 배낭: 위 양쪽 귀 같은 주머니 덮개 · 옆주머니 · 꿰맨 선 · 차원 수정 열쇠고리 (두 손으로 어깨끈을 꼭 쥠)
from s2_common import Cell, hx, save_sheet, shade

S = 48
FOOT = S - 3
CX = S // 2

K = {
    "H": hx("#eeaaa2"), "h": hx("#c47a78"), "L": hx("#ffd8d0"),
    "S": hx("#fde2cf"), "s": hx("#eebba2"), "W": hx("#ffffff"), "B": hx("#1c3a96"), "b": hx("#3f74d8"),
    "Y": hx("#ffe040"), "P": hx("#ff9eb4"), "m": hx("#d0606a"),
}
C = dict(
    jacket=hx("#7c9c92"), jacketD=hx("#56736a"), jacketL=hx("#a6c4b8"), top=hx("#f8f6f0"), topD=hx("#d6d2c8"),
    shorts=hx("#3c5490"), shortsD=hx("#2a3c6c"), shortsL=hx("#6a80b8"), skin=K["S"], skinD=K["s"],
    boot=hx("#e2d2a8"), bootD=hx("#b09c70"), lace=hx("#6a5a3a"),
    bag=hx("#c8955a"), bagD=hx("#9a6a3a"), bagDD=hx("#74481f"), bagL=hx("#e2b57c"), stitch=hx("#f0d8a8"),
    strap=hx("#a8743e"), crystal=hx("#6ae0ff"), crystalL=hx("#e0fbff"), steelD=hx("#8a94a8"),
    outline=hx("#4a3248"),
)

# 머리 16×16 (앞 · 옆(오른쪽 봄) · 뒤). . 빈칸
HEAD_FRONT = [
    "....hhHHHHhh....",
    "...hHHLLHHHHh...",
    "..hHLLHHHHHHHh..",
    ".hHHHHHHHHHHHHh.",
    ".hHHHHhHHHHhHHh.",
    "hHHHHhHHHHhHHHHh",
    "hHHhHShHHhSHhHHh",
    "hHhSSSSHhSSSSHhh",
    "hHSWbBSSSSWbBSHh",
    "hHSBYBSSSSBYBSHh",
    "hHSYYYSSSSYYYSHh",
    "hHSBYBSSSSBYBSHh",
    "hHhPSSSmmSSSPhHh",
    "hHHhSSSSSSSShHHh",
    "hHH.sSSSSSSs.HHh",
    "hHh...sSSs...hHh",
]
HEAD_SIDE = [
    "...hhHHHHh......",
    "..hHHLLHHHHh....",
    ".hHLLHHHHHHHh...",
    "hHHHHHHHHHHHHh..",
    "hHHHHHHHHHhHHHh.",
    "hHHHHHHHHhHHhHHh",
    "hHHHHHHHhHSShSHh",
    "hHHHHHHhHSSSSSS.",
    "hHHHHHHhSSSSWbS.",
    "hHHHHHhHSSSSBYS.",
    "hHHHHHhHSSSSYYS.",
    "hHHHHhHHSSSSBYS.",
    "hHHHhHHhSSPSSmS.",
    "hHHHhHhSSSSSSs..",
    "hHHhHh.sSSSSs...",
    "hHHhh....sSs....",
]
HEAD_BACK = [
    "....hhHHHHhh....",
    "...hHHLLHHHHh...",
    "..hHLLHHHHHHHh..",
    ".hHHHHHHHHHHHHh.",
    ".hHHHHHHHHHHHHh.",
    "hHHHHhHHHHhHHHHh",
    "hHHHhHHHHHHhHHHh",
    "hHHhHHHHHHHHhHHh",
    "hHHhHHHHHHHHhHHh",
    "hHhHHHHhhHHHHhHh",
    "hHhHHHHHHHHHHhHh",
    "hHhHHHHHHHHHHhHh",
    "hHhHHhHHHHhHHhHh",
    "hHhHHhHHHHhHHhHh",
    "hHhHHhHHHHhHHhHh",
    "hHhHHhHHHHhHHhHh",
]


def stamp(c, x0, y0, rows):
    for j, row in enumerate(rows):
        for i, ch in enumerate(row):
            if ch != ".": c.px(x0 + i, y0 + j, K[ch])


def wavy_hair(c, x0, x1, top, bottom, seed):
    """허리까지 물결치며 흘러내리는 긴 머리 (x0~x1 폭, 아래 끝은 갈래갈래) · 갈래마다 짙은 결 · 윤기"""
    for y in range(top, bottom + 1):
        sway = (0, 1, 1, 0, -1, -1)[(y + seed) % 6]
        c.rect(x0 + sway, y, x1 - x0 + 1, 1, K["H"])
    for i, x in enumerate(range(x0, x1 + 1, 2)):
        for j in range(2 + (i + seed) % 3): c.px(x + (j % 2), bottom + 1 + j, K["H"])
    for x in range(x0 + 3, x1 - 1, 4):
        for y in range(top + 3, bottom + 1):
            c.px(x + (0, 1, 1, 0, -1, -1)[(y + seed) % 6], y, K["h"])
    for y in range(top + 1, top + 5): c.px(x0 + 2, y, K["L"])


def flyaway(c, x, y, dx, n):
    """바깥으로 휘날리는 머리 한 가닥"""
    for i in range(n):
        c.px(x + dx * i, y - i // 2 + (i % 3 == 2), K["H"])
        c.px(x + dx * i, y - i // 2 + 1, K["h"])


def round_bag(c, cx, cy, rx, ry, view, tick):
    """둥글고 푹신한 천 배낭: 몸통 · 아래 그늘 · 위 밝은 면 · 위 양쪽 귀 덮개 · 옆주머니 · 꿰맨 선 · 열쇠고리"""
    c.oval(cx, cy, rx, ry, C["bagD"])
    c.oval(cx - 1, cy - 1, rx - 1, ry - 1, C["bagL"])
    c.oval(cx, cy, rx - 2, ry - 2, C["bag"])
    for x in range(cx - rx + 3, cx + rx - 2): c.px(x, cy + ry - 2, C["bagDD"])
    for sx in (-1, 1):
        ex = cx + sx * (rx - 4)
        ey = cy - ry + 3
        c.rect(ex - 2, ey - 1, 5, 3, C["bag"]); c.px(ex + sx * 2, ey - 2, C["bag"]); c.px(ex + sx * 3, ey - 2, C["bagD"])
        c.rect(ex - 2, ey + 2, 5, 1, C["bagDD"])
    if view != "side":
        for sx in (-1, 1):
            px0 = cx + sx * rx - (2 if sx > 0 else 1)
            c.rect(px0, cy + 1, 3, 7, C["bag"]); c.rect(px0, cy + 1, 3, 2, C["bagD"]); c.px(px0 + 1, cy + 4, C["stitch"])
    for x in range(cx - rx + 4, cx + rx - 3, 2): c.px(x, cy + 3, C["stitch"])
    if view == "back":
        for sx in (-5, 5): c.rect(cx + sx, cy - ry + 4, 1, ry - 2, C["strap"])
        kx = cx + 7
        c.px(kx, cy + 4, C["steelD"]); c.px(kx, cy + 5, C["steelD"])
        c.rect(kx - 1, cy + 6, 3, 2, C["crystal"]); c.px(kx, cy + 8, C["crystal"])
        if tick % 2 == 0: c.px(kx - 1, cy + 6, C["crystalL"])


def boots(c, x, y, w):
    c.rect(x, y, w, 3, C["boot"]); c.rect(x, y + 2, w + 1, 1, C["bootD"])
    c.px(x + 1, y, C["lace"]); c.px(x + w - 2, y + 1, C["lace"])


def frame(row, col):
    c = Cell(S)
    view = "front" if row == 0 or (row == 3 and col < 3) else "back" if row == 1 else "side"
    cast = row == 3
    step = 0 if cast else col
    dy = 1 if step in (1, 3) else 0
    hy = 12 + dy
    ty = 28 + dy
    if view == "front":
        round_bag(c, CX, 25 + dy, 16, 15, view, col)
        # 뒤로 풍성하게 흘러내린 머리 + 바깥으로 휘날리는 가닥
        wavy_hair(c, CX - 10, CX + 9, 18 + dy, 35 + dy, col)
        flyaway(c, CX - 11, 15 + dy, -1, 5); flyaway(c, CX + 10, 15 + dy, 1, 5)
        flyaway(c, CX - 7, 11 + dy, -1, 4); flyaway(c, CX + 6, 11 + dy, 1, 4)
    elif view == "side":
        round_bag(c, CX - 8, 26 + dy, 11, 14, view, col)
        wavy_hair(c, CX - 10, CX - 2, 18 + dy, 34 + dy, col)
        flyaway(c, CX - 10, 16 + dy, -1, 5)
    # 다리 (맨다리 · 끈 부츠)
    if view in ("front", "back"):
        lift = (0, 1, 0, -1)[step]
        for i, lx in enumerate((CX - 4, CX + 2)):
            up = max(0, lift) if i == 0 else max(0, -lift)
            c.rect(lx, 38, 2, FOOT - 38 - up, C["skin"]); c.px(lx + i, 38, C["skinD"])
            boots(c, lx - (1 if i == 0 else 0), FOOT - 3 - up, 3)
    else:
        stride = (0, 2, 0, -2)[step]
        for i, sx in enumerate((CX - 2 + stride, CX - stride)):
            c.rect(sx, 38, 2, FOOT - 38, C["skin"] if i == 0 else C["skinD"])
            boots(c, sx, FOOT - 3, 3)
    # 남색 반바지 (접어 올린 단)
    sw = 12 if view != "side" else 8
    c.rect(CX - sw // 2, ty + 5, sw, 4, C["shorts"]); c.rect(CX - sw // 2, ty + 8, sw, 1, C["shortsL"])
    if view != "side": c.px(CX - 1, ty + 6, C["shortsD"]); c.px(CX, ty + 7, C["shortsD"])
    if view == "front":
        # 헐렁한 회녹색 후드 재킷 (앞이 열려 흰 티) · 목에 뭉친 후드 · 넓은 소매 · 두 손으로 어깨끈을 꼭 쥠
        c.rect(CX - 7, ty, 14, 6, C["jacket"]); c.rect(CX - 6, ty - 1, 12, 2, C["jacketD"]); c.rect(CX - 5, ty - 1, 10, 1, C["jacketL"])
        c.rect(CX - 2, ty + 1, 4, 5, C["top"]); c.px(CX - 1, ty + 5, C["topD"]); c.px(CX, ty + 5, C["topD"])
        for x in (CX - 7, CX + 6): c.rect(x, ty + 1, 1, 5, C["jacketD"])
        c.rect(CX - 4, ty, 1, 3, C["strap"]); c.rect(CX + 3, ty, 1, 3, C["strap"])
        c.rect(CX - 5, ty + 2, 2, 2, C["skin"]); c.rect(CX + 3, ty + 2, 2, 2, C["skin"])
        c.rect(CX - 10, ty + 1, 3, 4, C["jacket"]); c.rect(CX - 10, ty + 4, 3, 1, C["jacketD"])
        if cast:
            c.rect(CX + 7, ty + 1, 4, 3, C["jacket"]); c.rect(CX + 11, ty + 1, 3, 2, C["skin"])
            g = col % 3
            c.rect(CX + 14, ty - 1 - g % 2, 2, 2, C["crystal"]); c.px(CX + 14, ty - 1 - g % 2, C["crystalL"])
            c.px(CX + 17, ty - 3 + g, K["Y"])
        else:
            c.rect(CX + 7, ty + 1, 3, 4, C["jacket"]); c.rect(CX + 7, ty + 4, 3, 1, C["jacketD"])
        stamp(c, CX - 8, hy, HEAD_FRONT)
        c.px(CX, hy - 1, K["H"]); c.px(CX + 1, hy - 2, K["H"]); c.px(CX + 2, hy - 2, K["h"])
    elif view == "back":
        c.rect(CX - 7, ty, 14, 6, C["jacket"]); c.rect(CX - 10, ty + 1, 3, 4, C["jacket"]); c.rect(CX + 7, ty + 1, 3, 4, C["jacket"])
        round_bag(c, CX, 26 + dy, 15, 14, view, col)
        stamp(c, CX - 8, hy, HEAD_BACK)
        # 배낭 위로 쏟아져 흘러내리는 긴 머리
        wavy_hair(c, CX - 7, CX + 6, hy + 14, 33 + dy, col)
        flyaway(c, CX - 8, hy + 4, -1, 6); flyaway(c, CX + 7, hy + 4, 1, 6)
        flyaway(c, CX - 9, hy + 12, -1, 5); flyaway(c, CX + 8, hy + 12, 1, 5)
    else:
        c.rect(CX - 4, ty, 8, 6, C["jacket"]); c.rect(CX - 4, ty - 1, 6, 2, C["jacketD"])
        c.rect(CX + 2, ty + 1, 2, 4, C["top"]); c.rect(CX - 3, ty, 1, 4, C["strap"])
        if cast:
            c.rect(CX, ty + 1, 6, 3, C["jacket"]); c.rect(CX + 6, ty + 1, 2, 2, C["skin"])
            c.rect(CX + 9, ty, 2, 2, C["crystal"]); c.px(CX + 9, ty, C["crystalL"])
        else:
            s2 = (0, 1, 0, -1)[step]
            c.rect(CX - 1 + s2, ty + 1, 3, 4, C["jacket"]); c.rect(CX - 1 + s2, ty + 4, 3, 1, C["jacketD"]); c.px(CX + s2, ty + 5, C["skin"])
        stamp(c, CX - 8, hy, HEAD_SIDE)
        c.px(CX - 1, hy - 1, K["H"]); c.px(CX, hy - 2, K["H"]); c.px(CX + 1, hy - 2, K["h"])
    shade(c)
    c.outline(C["outline"])
    return c


def main():
    save_sheet("pilgrim", frame, size=S)


if __name__ == "__main__":
    main()
