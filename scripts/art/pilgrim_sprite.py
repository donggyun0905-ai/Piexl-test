# 차원의 순례자 방향 시트 (python3 scripts/art/pilgrim_sprite.py) → apps/client/public/sprites/pilgrim.png
# 히든 상점 여자아이 = 히든 캐릭터 '차원의 순례자'. 48칸 (발 여백 3), 머리가 큰 귀여운 비율 · 얼굴은 갸름한 V라인
# 하늘색 단발(옆머리·더듬이 머리·노란 별 핀) · 큰 파랑 눈 안 노란 십자 · 세일러 깃 블라우스·주름치마·흰 양말·갈색 부츠
# 등에 큰 배낭: 덮개·버클 끈 둘·앞주머니(별 패치·꿰맨 선)·옆주머니·차원 수정 열쇠고리·랜턴·냄비, 위에 침낭과 지팡이·깃발·칼·지도
from s2_common import Cell, hx, save_sheet, shade

S = 48
FOOT = S - 3
CX = S // 2

K = {
    "H": hx("#7ad0f0"), "h": hx("#4a98c8"), "L": hx("#d4f6ff"), "d": hx("#2f6e9e"),
    "S": hx("#fde2cf"), "s": hx("#eebba2"), "W": hx("#ffffff"), "B": hx("#1c3a96"), "b": hx("#3f74d8"),
    "Y": hx("#ffe040"), "y": hx("#e0a020"), "P": hx("#ff9eb4"), "m": hx("#d0606a"),
    "R": hx("#ff5a7a"), "r": hx("#c23256"),
}
C = dict(
    blouse=hx("#f8f4ec"), blouseD=hx("#d6cec2"), collar=hx("#3c4c94"), collarL=hx("#6a7cc8"), ribbon=K["R"], ribbonD=K["r"],
    skirt=hx("#3c4c94"), skirtD=hx("#28346c"), skirtL=hx("#6a7cc8"), sock=hx("#f8f4ec"), boot=hx("#8e5632"), bootD=hx("#5c3418"),
    skin=K["S"], skinD=K["s"], hair=K["H"], hairD=K["h"],
    bag=hx("#b8783e"), bagD=hx("#80502a"), bagL=hx("#e0a868"), bagDD=hx("#5e3818"), strap=hx("#5a3418"), buckle=hx("#ffd050"),
    stitch=hx("#f0d0a0"), patch=hx("#8a5aff"), patchL=hx("#c0a0ff"), star=hx("#ffe040"),
    roll=hx("#d84a5a"), rollD=hx("#9a2a3a"), rollL=hx("#ff8a94"), rollS=hx("#f4e0c0"),
    steel=hx("#d8e0ec"), steelD=hx("#8a94a8"), wood=hx("#8a5a30"), woodD=hx("#5e3a1c"), gem=hx("#ff6aa8"), gemL=hx("#ffd0e4"),
    flag=hx("#8a5aff"), flagL=hx("#c0a0ff"), map=hx("#ecdcac"), mapD=hx("#c0a870"), lamp=hx("#ffd860"), lampD=hx("#c08a20"),
    crystal=hx("#6ae0ff"), crystalL=hx("#e0fbff"), pot=hx("#4aa878"), potL=hx("#b0f4cc"),
    outline=hx("#4a3858"),
)

# 머리 16×16 (앞 · 옆(오른쪽 봄) · 뒤). . 빈칸
HEAD_FRONT = [
    "....hhHHHHhh....",
    "...hHHLLHHHHh...",
    "..hHLLHHHHHHYh..",
    ".hHHHHHHHHHYYYh.",
    ".hHHHHHHHHHhYHh.",
    "hHHHHhHHHHhHHHHh",
    "hHHhHShHHhSHhHHh",
    "hHhSSSSHhSSSSHhh",
    "hHSWbBSSSSWbBSHh",
    "hHSBYBSSSSBYBSHh",
    "hHSYYYSSSSYYYSHh",
    "hHSBYBSSSSBYBSHh",
    "hHhPSSSmmSSSPhHh",
    ".hHhSSSSSSSShHh.",
    "..hH.sSSSSs.Hh..",
    "..h...sSSs...h..",
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
    "hHHHhHHhSSPSSSS.",
    ".hHHhHhSSSSSSs..",
    "..hhHh.sSSSSs...",
    "...hh....sSs....",
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
    ".hhHHhHHHHhHHhh.",
    "..hHh.hHHh.hHh..",
    "..hh...hh...hh..",
    "................",
]


def stamp(c, x0, y0, rows, flip=False):
    for j, row in enumerate(rows):
        for i, ch in enumerate(row):
            if ch == ".": continue
            c.px(x0 + (len(row) - 1 - i if flip else i), y0 + j, K[ch])


def bedroll(c, x0, y, w):
    """둘둘 만 침낭 (줄무늬·끈 둘)"""
    c.rect(x0 + 1, y, w - 2, 4, C["roll"]); c.rect(x0, y + 1, w, 2, C["roll"])
    c.rect(x0 + 1, y, w - 2, 1, C["rollL"]); c.rect(x0 + 1, y + 3, w - 2, 1, C["rollD"])
    for x in range(x0 + 3, x0 + w - 2, 4): c.rect(x, y + 1, 1, 2, C["rollS"])
    for x in (x0 + w // 4, x0 + w - w // 4 - 1): c.rect(x, y, 1, 4, C["strap"])


def gear(c, x0, y, w):
    """침낭 위로 삐죽삐죽 튀어나온 장비 (y = 침낭 윗줄)"""
    # 지팡이 + 분홍 보석 (왼쪽)
    c.rect(x0 + 2, y - 11, 1, 11, C["wood"]); c.rect(x0 + 1, y - 14, 3, 3, C["gem"]); c.px(x0 + 1, y - 14, C["gemL"]); c.px(x0 + 2, y - 15, C["gem"])
    c.px(x0 + 0, y - 13, C["steelD"]); c.px(x0 + 4, y - 13, C["steelD"])
    # 둘둘 만 지도 (리본)
    c.rect(x0 + 5, y - 5, 2, 5, C["map"]); c.px(x0 + 6, y - 5, C["mapD"]); c.px(x0 + 5, y - 3, C["ribbon"]); c.px(x0 + 6, y - 3, C["ribbon"])
    # 칼 손잡이·가드 (오른쪽 가운데)
    c.rect(x0 + w - 5, y - 6, 1, 6, C["steel"]); c.rect(x0 + w - 6, y - 6, 3, 1, C["buckle"]); c.rect(x0 + w - 5, y - 8, 1, 2, C["woodD"]); c.px(x0 + w - 5, y - 9, C["buckle"])
    # 보라 차원 깃발 + 노란 별 (오른쪽)
    c.rect(x0 + w - 3, y - 13, 1, 13, C["steelD"]); c.px(x0 + w - 3, y - 14, C["buckle"])
    c.rect(x0 + w - 2, y - 13, 5, 4, C["flag"]); c.rect(x0 + w - 2, y - 13, 5, 1, C["flagL"]); c.px(x0 + w, y - 11, C["star"])
    c.px(x0 + w + 2, y - 9, C["flag"])


def bag_back(c, x0, y, w, h, tick):
    """뒤에서 본 배낭: 덮개·버클 끈·앞주머니(꿰맨 선·별 패치)·옆주머니·열쇠고리"""
    c.rect(x0 + 1, y, w - 2, h, C["bag"]); c.rect(x0, y + 1, w, h - 2, C["bag"])
    c.rect(x0, y + h - 2, w, 1, C["bagD"]); c.rect(x0 + 1, y + h - 1, w - 2, 1, C["bagDD"])
    # 덮개 (위 1/3, 둥근 아래 끝)
    fh = 5
    c.rect(x0 + 1, y, w - 2, fh, C["bagD"]); c.rect(x0 + 2, y, w - 4, 1, C["bagL"]); c.rect(x0 + 2, y + fh, w - 4, 1, C["bagDD"])
    for x in range(x0 + 3, x0 + w - 3, 2): c.px(x, y + fh - 1, C["stitch"])
    # 버클 끈 둘
    for sx in (x0 + 5, x0 + w - 6):
        c.rect(sx, y + 1, 1, fh + 2, C["strap"]); c.rect(sx - 1, y + fh, 3, 2, C["buckle"]); c.px(sx, y + fh, C["strap"])
    # 앞주머니 + 꿰맨 테두리 + 별 패치
    py = y + fh + 3
    ph = h - fh - 4
    c.rect(x0 + 3, py, w - 6, ph, C["bagL"]); c.rect(x0 + 4, py + 1, w - 8, ph - 2, C["bag"])
    for x in range(x0 + 4, x0 + w - 4, 2): c.px(x, py + 1, C["stitch"]); c.px(x, py + ph - 2, C["stitch"])
    pcx = x0 + w // 2
    c.oval(pcx - 0.5, py + ph / 2 - 0.5, 2.6, 2.6, C["patch"])
    sy = py + ph // 2 - 2
    for dx, dy in ((0, 0), (-1, 1), (0, 1), (1, 1), (-1, 2), (0, 2), (-2, 2), (1, 2), (-1, 3), (0, 3)):
        c.px(pcx + dx, sy + dy, C["star"])
    c.px(pcx - 2, sy, C["patchL"])
    # 옆주머니 (양쪽으로 불룩)
    for sx in (x0 - 2, x0 + w):
        c.rect(sx, y + 6, 2, 8, C["bagD"]); c.rect(sx, y + 6, 2, 1, C["bagL"]); c.px(sx + (0 if sx < x0 else 1), y + 9, C["buckle"])
    # 덮개 버클에 매단 차원 수정 열쇠고리 (반짝)
    kx = x0 + w // 2 + 4
    c.px(kx, y + fh + 1, C["steelD"]); c.px(kx, y + fh + 2, C["steelD"])
    c.rect(kx - 1, y + fh + 3, 3, 2, C["crystal"]); c.px(kx, y + fh + 5, C["crystal"])
    if tick % 2 == 0: c.px(kx - 1, y + fh + 3, C["crystalL"])
    # 덮개 위 이름표 · 옆에 매단 물약 병
    c.rect(x0 + 2, y + 2, 3, 2, C["map"])
    c.rect(x0 - 3, y + 1, 2, 4, C["pot"]); c.px(x0 - 3, y + 2, C["potL"]); c.px(x0 - 2, y, C["wood"])


def lantern(c, x, y, tick):
    c.px(x + 1, y, C["steelD"]); c.rect(x, y + 1, 3, 1, C["woodD"])
    c.rect(x, y + 2, 3, 3, C["lamp"]); c.px(x + 1, y + 3, C["W"] if False else hx("#fff6c0")); c.rect(x, y + 5, 3, 1, C["woodD"])
    if tick % 2: c.px(x + 1, y + 2, C["lampD"])


C["W"] = K["W"]


def bag_front(c, x0, y, w, h, tick):
    """앞에서 본 배낭: 몸 뒤라 양옆만 보임 · 옆주머니 · 랜턴 · 냄비"""
    c.rect(x0 + 1, y, w - 2, h, C["bagD"]); c.rect(x0, y + 1, w, h - 2, C["bagD"])
    c.rect(x0 + 1, y, w - 2, 1, C["bagL"]); c.rect(x0, y + h - 2, w, 2, C["bagDD"])
    for yy in range(y + 2, y + h - 2, 2): c.px(x0 + 1, yy, C["stitch"]); c.px(x0 + w - 2, yy, C["stitch"])
    # 옆주머니
    for sx in (x0 - 1, x0 + w - 1):
        c.rect(sx, y + 8, 2, 7, C["bag"]); c.px(sx, y + 8, C["bagL"])
    lantern(c, x0 - 3, y + 9, tick)
    # 오른쪽 냄비
    c.rect(x0 + w, y + 6, 3, 3, C["steelD"]); c.rect(x0 + w, y + 6, 3, 1, C["steel"]); c.px(x0 + w + 3, y + 7, C["woodD"])


def bag_side(c, x0, y, w, h, tick):
    """옆에서 본 배낭 (등 쪽 = 왼쪽): 옆주머니·끈·랜턴, 위에 침낭 끝(돌돌 말린 원)"""
    c.rect(x0 + 1, y, w - 1, h, C["bag"]); c.rect(x0, y + 1, w, h - 2, C["bag"])
    c.rect(x0 + 1, y, w - 2, 1, C["bagL"]); c.rect(x0, y + h - 2, w, 2, C["bagD"]); c.rect(x0 + w - 2, y, 2, h, C["bagD"])
    c.rect(x0 + 1, y, w - 2, 6, C["bagD"]); c.rect(x0 + 1, y, w - 2, 1, C["bagL"])
    for x in range(x0 + 2, x0 + w - 2, 2): c.px(x, y + 5, C["stitch"])
    # 옆주머니 + 꿰맨 선 + 버클
    c.rect(x0 - 1, y + 8, w - 3, 8, C["bagL"]); c.rect(x0, y + 9, w - 5, 6, C["bag"])
    for yy in range(y + 9, y + 15, 2): c.px(x0 - 1, yy, C["stitch"])
    c.rect(x0 + 3, y + 7, 1, 4, C["strap"]); c.rect(x0 + 2, y + 9, 3, 2, C["buckle"])
    lantern(c, x0 - 4, y + 13, tick)
    # 침낭 끝 (원 + 소용돌이)
    rx, ry = x0 + 4, y - 3
    c.oval(rx, ry, 3.4, 2.6, C["roll"]); c.px(rx, ry, C["rollS"]); c.px(rx + 1, ry, C["rollD"]); c.px(rx - 1, ry - 1, C["rollL"])
    c.px(rx + 1, ry - 1, C["rollS"]); c.px(rx - 1, ry + 1, C["rollD"])


def legs_front(c, step, back):
    lift = (0, 1, 0, -1)[step]
    for i, (lx, up) in enumerate(((CX - 4, max(0, lift)), (CX + 2, max(0, -lift)))):
        top = 38
        c.rect(lx, top, 2, FOOT - top - up, C["sock"]); c.px(lx + (1 if i else 0), top, C["skinD"])
        c.rect(lx - (0 if i else 1), FOOT - 3 - up, 3, 3, C["boot"]); c.rect(lx - (0 if i else 1), FOOT - 1 - up, 3, 1, C["bootD"])
        if not back: c.px(lx + (0 if i else 1), FOOT - 3 - up, C["bootD"])


def skirt(c, y, w0, back=False):
    for j in range(5):
        w = w0 + min(j, 2) * 2
        x0 = CX - w // 2
        c.rect(x0, y + j, w, 1, C["skirt"])
        for x in range(x0 + 1 + j % 2, x0 + w - 1, 3): c.px(x, y + j, C["skirtD"])
    c.rect(CX - (w0 + 4) // 2, y + 4, w0 + 4, 1, C["skirtL"])


def frame(row, col):
    c = Cell(S)
    view = "front" if row == 0 or (row == 3 and col < 3) else "back" if row == 1 else "side"
    cast = row == 3
    step = 0 if cast else col
    tick = col
    dy = 1 if step in (1, 3) else 0
    hy = 12 + dy
    if view == "front":
        bw = 24
        bedroll(c, CX - 12, 18 + dy, 24); gear(c, CX - 12, 18 + dy, 24)
        bag_front(c, CX - bw // 2, 22 + dy, bw, 16, tick)
        legs_front(c, step, False)
        skirt(c, 33 + dy, 12)
        # 블라우스 · 세일러 깃 · 리본 · 배낭 끈
        ty = 28 + dy
        c.rect(CX - 5, ty, 10, 5, C["blouse"]); c.rect(CX - 5, ty + 4, 10, 1, C["blouseD"])
        c.rect(CX - 5, ty, 10, 1, C["collar"]); c.rect(CX - 5, ty + 1, 3, 1, C["collar"]); c.rect(CX + 2, ty + 1, 3, 1, C["collar"])
        c.rect(CX - 5, ty + 2, 2, 1, C["collar"]); c.rect(CX + 3, ty + 2, 2, 1, C["collar"])
        c.px(CX - 5, ty + 1, C["collarL"]); c.px(CX + 4, ty + 1, C["collarL"])
        for x in (CX - 3, CX - 2, CX + 1, CX + 2): c.px(x, ty + 1, C["ribbon"])
        c.px(CX - 3, ty + 2, C["ribbon"]); c.px(CX + 2, ty + 2, C["ribbon"]); c.px(CX - 2, ty + 2, C["ribbonD"]); c.px(CX + 1, ty + 2, C["ribbonD"])
        c.rect(CX - 1, ty + 1, 2, 2, C["ribbonD"]); c.px(CX - 1, ty + 3, C["ribbon"]); c.px(CX, ty + 4, C["ribbon"])
        c.rect(CX - 4, ty, 1, 5, C["strap"]); c.rect(CX + 3, ty, 1, 5, C["strap"]); c.px(CX - 4, ty + 3, C["buckle"]); c.px(CX + 3, ty + 3, C["buckle"])
        # 팔 (퍼프 소매)
        sw = (0, 1, 0, -1)[step]
        c.rect(CX - 7, ty, 2, 2, C["blouse"]); c.rect(CX - 7, ty + 2 + sw, 2, 3, C["skin"]); c.px(CX - 7, ty + 5 + sw, C["skinD"])
        if cast:
            c.rect(CX + 5, ty, 2, 2, C["blouse"]); c.rect(CX + 7, ty + 1, 4, 2, C["skin"]); c.rect(CX + 11, ty, 2, 3, C["skin"])
            g = (col % 3)
            c.rect(CX + 13, ty - 1 - g % 2, 2, 2, C["crystal"]); c.px(CX + 13, ty - 1 - g % 2, C["crystalL"])
            c.px(CX + 16, ty - 3 + g, C["star"]); c.px(CX + 15, ty + 2, C["crystalL"])
        else:
            c.rect(CX + 5, ty, 2, 2, C["blouse"]); c.rect(CX + 5, ty + 2 - sw, 2, 3, C["skin"]); c.px(CX + 6, ty + 5 - sw, C["skinD"])
        c.rect(CX - 1, ty - 1, 2, 1, C["skinD"])
        stamp(c, CX - 8, hy, HEAD_FRONT)
        c.px(CX, hy - 1, K["H"]); c.px(CX + 1, hy - 2, K["H"]); c.px(CX + 2, hy - 2, K["h"])
    elif view == "back":
        legs_front(c, step, True)
        skirt(c, 33 + dy, 12, True)
        ty = 28 + dy
        sw = (0, 1, 0, -1)[step]
        c.rect(CX - 7, ty, 2, 2, C["blouse"]); c.rect(CX - 7, ty + 2 - sw, 2, 3, C["skin"])
        c.rect(CX + 5, ty, 2, 2, C["blouse"]); c.rect(CX + 5, ty + 2 + sw, 2, 3, C["skin"])
        stamp(c, CX - 8, hy, HEAD_BACK)
        bw = 22
        bag_back(c, CX - bw // 2, 23 + dy, bw, 16, tick)
        bedroll(c, CX - 12, 20 + dy, 24); gear(c, CX - 12, 20 + dy, 24)
    else:
        stride = (0, 2, 0, -2)[step]
        bag_side(c, CX - 13, 21 + dy, 9, 17, tick)
        # 뒤에 보이는 지팡이·깃발
        c.rect(CX - 11, 6 + dy, 1, 12, C["wood"]); c.rect(CX - 12, 4 + dy, 3, 3, C["gem"]); c.px(CX - 12, 4 + dy, C["gemL"])
        c.rect(CX - 7, 7 + dy, 1, 11, C["steelD"]); c.rect(CX - 12, 7 + dy, 5, 3, C["flag"]); c.rect(CX - 12, 7 + dy, 5, 1, C["flagL"])
        # 다리 (양말·부츠)
        for i, sx in enumerate((CX - 2 + stride, CX - stride)):
            c.rect(sx, 38, 2, FOOT - 38, C["sock"] if i == 0 else C["blouseD"])
            c.rect(sx, FOOT - 3, 3, 3, C["boot"]); c.rect(sx, FOOT - 1, 4, 1, C["bootD"])
        ty = 28 + dy
        for j in range(5):
            w = 8 + min(j, 2) * 2
            c.rect(CX - 1 - w // 2, ty + 5 + j, w, 1, C["skirt"])
            for x in range(CX - w // 2 + j % 2, CX - 1 + w // 2, 3): c.px(x, ty + 5 + j, C["skirtD"])
        c.rect(CX - 6, ty + 9, 11, 1, C["skirtL"])
        c.rect(CX - 3, ty, 6, 5, C["blouse"]); c.rect(CX - 3, ty, 4, 2, C["collar"]); c.px(CX + 2, ty + 1, C["ribbon"]); c.px(CX + 2, ty + 2, C["ribbonD"])
        c.rect(CX - 2, ty, 1, 5, C["strap"])
        if cast:
            c.rect(CX, ty + 1, 7, 2, C["skin"]); c.rect(CX - 1, ty, 2, 2, C["blouse"])
            c.rect(CX + 8, ty, 2, 2, C["crystal"]); c.px(CX + 8, ty, C["crystalL"])
        else:
            sw = (0, 2, 0, -2)[step] // 2
            c.rect(CX - 1, ty, 2, 2, C["blouse"]); c.rect(CX - 1 + sw, ty + 2, 2, 3, C["skin"])
        c.rect(CX, ty - 1, 2, 1, C["skinD"])
        stamp(c, CX - 8, hy, HEAD_SIDE)
        c.px(CX - 1, hy - 1, K["H"]); c.px(CX, hy - 2, K["H"]); c.px(CX + 1, hy - 2, K["h"])
    shade(c)
    c.outline(C["outline"])
    return c


def main():
    save_sheet("pilgrim", frame, size=S)


if __name__ == "__main__":
    main()
