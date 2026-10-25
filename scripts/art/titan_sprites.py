# 거인(기계팔 탱커) 방향 시트·스킨을 코드로 그림 (python3 scripts/art/titan_sprites.py)
# 시트: 48×48 칸(발 여백 3), 4줄(앞 걷기 · 뒤 걷기 · 오른쪽 걷기 · 공격) × 4칸. 오른팔(보는 쪽 오른쪽)이 커다란 기계팔
import os
from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), "../../apps/client/public/sprites")
C = 48

def hx(s):
    s = s.lstrip("#")
    return (int(s[0:2], 16), int(s[2:4], 16), int(s[4:6], 16), 255)

BASE = dict(
    dark=hx("#2e3440"), mid=hx("#4f5a6c"), light=hx("#7f8ba0"), hi=hx("#c4ccda"),
    cloth=hx("#4a3428"), clothL=hx("#6a4a34"), trim=hx("#c8702e"), trimL=hx("#f0a050"),
    glow=hx("#ffb040"), glowH=hx("#fff0a0"), visor=hx("#ff8a2a"), outline=hx("#1e1820"),
    skin=hx("#d8a070"), skinD=hx("#b07a52"), hair=hx("#3a2418"), beard=hx("#5a3a24"),
    shirt=hx("#5a6a5a"), shirtL=hx("#7a8a72"), pants=hx("#3a3a44"), boot=hx("#2a221e"),
    horn=hx("#ece0c4"), hornD=hx("#a8946e"),
)

class Cell:
    def __init__(self): self.p = {}
    def px(self, x, y, c):
        if c is not None and 0 <= x < C and 0 <= y < C: self.p[(x, y)] = c
    def rect(self, x, y, w, h, c):
        for j in range(h):
            for i in range(w): self.px(x + i, y + j, c)
    def outline(self, color):
        add = {}
        for (x, y) in list(self.p):
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                q = (x + dx, y + dy)
                if q not in self.p and 0 <= q[0] < C and 0 <= q[1] < C: add[q] = color
        self.p.update(add)
    def blit(self, img, ox, oy):
        for (x, y), c in self.p.items(): img.putpixel((ox + x, oy + y), c)

def plate(c, x, y, w, h, k):
    """갑옷 판: 가운데 중간색, 위 밝게, 아래 어둡게"""
    c.rect(x, y, w, h, k["mid"]); c.rect(x, y, w, 1, k["light"]); c.rect(x, y + h - 1, w, 1, k["dark"])

def head(c, k, x, y, view):
    """거인 머리: 짧은 머리 · 굵은 눈썹 · 한쪽 기계 눈(주황) · 덥수룩한 수염 · 이마 상처"""
    if view == "back":
        c.rect(x, y, 10, 10, k["hair"]); c.rect(x + 1, y - 1, 8, 1, k["hair"]); c.rect(x + 1, y + 8, 8, 2, k["skinD"])
        c.rect(x + 7, y + 3, 3, 3, k["mid"]); c.px(x + 8, y + 4, k["glow"])
        return
    if view == "front":
        c.rect(x, y + 1, 10, 9, k["skin"]); c.rect(x + 1, y, 8, 1, k["skin"])
        c.rect(x, y - 1, 10, 3, k["hair"]); c.rect(x + 1, y - 2, 8, 1, k["hair"])
        c.rect(x + 1, y + 3, 3, 1, k["hair"]); c.rect(x + 6, y + 3, 3, 1, k["hair"])
        c.px(x + 2, y + 4, k["outline"]); c.px(x + 3, y + 4, k["outline"])
        # 기계 눈 (오른쪽, 기계팔 쪽)
        c.rect(x + 6, y + 4, 3, 2, k["mid"]); c.px(x + 7, y + 4, k["visor"]); c.px(x + 7, y + 5, k["glowH"])
        c.px(x + 4, y + 6, k["skinD"]); c.px(x + 5, y + 6, k["skinD"])
        c.rect(x, y + 7, 10, 3, k["beard"]); c.rect(x + 1, y + 10, 8, 1, k["beard"]); c.rect(x + 3, y + 8, 4, 1, k["skinD"])
        c.px(x + 2, y + 1, k["skinD"]); c.px(x + 3, y + 2, k["skinD"])
    else:
        c.rect(x + 1, y + 1, 9, 9, k["skin"]); c.rect(x + 10, y + 5, 1, 2, k["skin"])
        c.rect(x, y - 1, 9, 4, k["hair"]); c.rect(x, y + 3, 4, 4, k["hair"])
        c.rect(x + 6, y + 3, 4, 1, k["hair"]); c.rect(x + 7, y + 4, 3, 2, k["mid"]); c.px(x + 8, y + 4, k["visor"])
        c.rect(x + 3, y + 7, 7, 3, k["beard"]); c.rect(x + 4, y + 10, 5, 1, k["beard"])

def horns(c, k, x, y, view):
    """거인족 뿔: 머리 양옆에서 바깥으로 뻗었다가 위로 휘는 굵은 소뿔 (모자 위로도 보임). y = 머리 위"""
    shape = ((0, 1, "D"), (0, 0, "D"), (-1, 1, "D"), (-1, 0, "D"), (-2, 0, "L"), (-2, -1, "L"), (-3, -1, "L"), (-3, -2, "L"), (-4, -2, "L"), (-4, -3, "H"), (-4, -4, "H"), (-3, -5, "H"))
    def horn(bx, out):
        for dx, dy, t in shape:
            c.px(bx - dx * out * -1 if out > 0 else bx + dx, y + dy, k["hornD"] if t == "D" else k["horn"] if t == "L" else hx("#fff8e8"))
    if view == "side":
        horn(x + 2, -1)
    else:
        horn(x, -1)
        horn(x + 9, 1)

def helmet(c, k, x, y, view):
    plate(c, x, y + 1, 10, 9, k)
    c.rect(x + 1, y, 8, 1, k["light"])
    c.rect(x + 4, y - 2, 2, 2, k["trim"])  # 볏
    if view == "front":
        c.rect(x + 1, y + 4, 8, 2, k["dark"]); c.rect(x + 2, y + 4, 6, 1, k["visor"]); c.px(x + 4, y + 5, k["visor"]); c.px(x + 5, y + 5, k["visor"])
        c.px(x + 3, y + 4, k["glowH"]); c.px(x + 6, y + 4, k["glowH"])
        c.rect(x + 3, y + 7, 4, 1, k["dark"])
    elif view == "side":
        c.rect(x + 6, y + 4, 4, 2, k["dark"]); c.rect(x + 7, y + 4, 3, 1, k["visor"]); c.px(x + 9, y + 4, k["glowH"])
    else:
        c.rect(x + 2, y + 3, 6, 1, k["dark"]); c.rect(x + 1, y + 8, 8, 1, k["trim"])

def mech_arm(c, k, x, y, reach=0, raise_=0):
    """기계팔: 큰 어깨판(빛나는 동력 코어) · 피스톤 위팔 · 두꺼운 아래팔 · 마디마다 빛나는 커다란 주먹"""
    # 어깨판
    plate(c, x, y, 10, 7, k); c.rect(x + 1, y - 1, 8, 1, k["light"]); c.rect(x, y + 6, 10, 1, k["trim"])
    c.rect(x + 3, y + 2, 4, 3, k["dark"]); c.rect(x + 4, y + 3, 2, 1, k["glow"]); c.px(x + 4, y + 2, k["glowH"])
    for rx in (x + 1, x + 8): c.px(rx, y + 1, k["hi"])
    # 위팔: 피스톤 두 줄
    ay = y + 7 - raise_
    c.rect(x + 2, ay, 6, 7, k["dark"]); c.rect(x + 3, ay, 1, 7, k["hi"]); c.rect(x + 6, ay, 1, 7, k["light"])
    c.rect(x + 4, ay + 2, 2, 3, k["glow"])
    # 아래팔 (앞으로 뻗으면 오른쪽으로)
    fx = x + reach
    fy = ay + 7
    plate(c, fx, fy, 10, 6, k); c.rect(fx + 1, fy + 2, 8, 1, k["trim"]); c.px(fx + 2, fy + 4, k["hi"]); c.px(fx + 7, fy + 4, k["hi"])
    # 주먹: 손가락 판 넷 + 사이 불빛
    gy = fy + 6
    c.rect(fx - 1, gy, 12, 7, k["dark"])
    for i in range(4):
        plate(c, fx + i * 3, gy + 1, 2, 5, k)
        if i < 3: c.rect(fx + i * 3 + 2, gy + 2, 1, 3, k["glow"])
    c.rect(fx - 1, gy, 12, 1, k["light"])

def legs(c, k, frame, bob, x0=15, x1=27):
    up_l = 2 if frame == 1 else 0
    up_r = 2 if frame == 3 else 0
    for lx, up in ((x0, up_l), (x1, up_r)):
        c.rect(lx, 31 + bob, 7, 9 - up, k["pants"]); c.rect(lx, 31 + bob, 1, 9 - up, k["shirt"])
        c.rect(lx + 1, 35 + bob, 5, 1, k["mid"]); c.px(lx + 3, 35 + bob, k["light"])
        c.rect(lx - 1, 40 - up, 9, 5, k["boot"]); c.rect(lx, 40 - up, 7, 1, k["clothL"]); c.rect(lx - 1, 43 - up, 9, 1, k["dark"])

def torso(c, k, bob, back=False):
    y = 16 + bob
    c.rect(13, y, 21, 14, k["shirt"]); c.rect(14, y, 19, 1, k["shirtL"])
    if not back:
        # 가죽 조끼 (가운데 열림) · 기계팔로 이어지는 쇠 멜빵 · 동력선
        c.rect(13, y, 7, 14, k["cloth"]); c.rect(27, y, 7, 14, k["cloth"]); c.rect(14, y + 1, 1, 12, k["clothL"]); c.rect(32, y + 1, 1, 12, k["clothL"])
        c.rect(21, y + 2, 5, 9, k["skin"]); c.rect(21, y + 2, 5, 1, k["skinD"]); c.px(23, y + 5, k["skinD"])
        for i in range(8): c.px(26 + i // 2, y + i, k["mid"]); c.px(27 + i // 2, y + i, k["light"])
        c.rect(30, y + 1, 3, 3, k["dark"]); c.px(31, y + 2, k["glow"])
    else:
        c.rect(13, y, 21, 14, k["cloth"]); c.rect(14, y + 1, 19, 1, k["clothL"])
        for i in range(10): c.px(14 + i, y + i, k["mid"]); c.px(15 + i, y + i, k["light"])
        c.rect(15, y + 3, 3, 3, k["dark"]); c.px(16, y + 4, k["glow"])
    c.rect(13, y + 12, 21, 3, k["boot"]); c.rect(22, y + 12, 3, 3, k["trim"]); c.px(23, y + 13, k["trimL"])
    # 허리 아래 천
    c.rect(15, y + 15, 17, 2, k["pants"])

def left_arm(c, k, x, y, swing):
    """사람 팔: 어깨 천 · 굵은 맨팔 · 손목 띠 · 주먹"""
    c.rect(x, y, 6, 4, k["shirt"]); c.rect(x, y, 6, 1, k["shirtL"])
    c.rect(x, y + 4 + swing, 6, 7, k["skin"]); c.rect(x, y + 4 + swing, 1, 7, k["skinD"]); c.px(x + 3, y + 6 + swing, k["skinD"])
    c.rect(x, y + 10 + swing, 6, 1, k["cloth"])
    c.rect(x, y + 11 + swing, 6, 3, k["skin"]); c.rect(x, y + 13 + swing, 6, 1, k["skinD"])

def hat(c, theme, hx0, hy, view):
    t = theme.get("hat")
    if not t: return
    a, b = theme["hatC"], theme["hatL"]
    if t == "santa":
        c.rect(hx0 - 1, hy - 1, 12, 3, b); c.rect(hx0, hy - 4, 10, 3, a); c.rect(hx0 + 5, hy - 7, 4, 3, a); c.rect(hx0 + 9, hy - 8, 2, 2, b)
    elif t == "witch":
        c.rect(hx0 - 3, hy, 16, 2, a); c.rect(hx0 + 1, hy - 4, 8, 4, a); c.rect(hx0 + 3, hy - 8, 4, 4, a); c.rect(hx0 + 5, hy - 10, 2, 2, a); c.rect(hx0 + 1, hy - 1, 8, 1, b)
    elif t == "cowboy":
        c.rect(hx0 - 3, hy, 16, 2, a); c.rect(hx0 + 1, hy - 4, 8, 4, a); c.rect(hx0 + 1, hy - 2, 8, 1, b)
    elif t == "headband":
        c.rect(hx0, hy + 2, 10, 2, a); c.px(hx0 + 5 if view == "front" else hx0 - 1, hy + 3, b)
    elif t == "goggles":
        c.rect(hx0, hy + 1, 10, 1, b); c.rect(hx0 + 1, hy - 1, 3, 3, a); c.rect(hx0 + 6, hy - 1, 3, 3, a)
    elif t == "tiger":
        # 사나운 백호 머리 가죽: 이마에 王 줄무늬 · 노려보는 금빛 눈 · 둥근 귀 · 볼까지 내려오는 털 · 이마로 내려온 송곳니
        c.rect(hx0 - 1, hy - 3, 12, 5, a)
        for ex in (hx0 - 1, hx0 + 8):
            c.rect(ex, hy - 5, 3, 2, a); c.px(ex + 1, hy - 4, b)
        if view == "side":
            c.rect(hx0 - 1, hy + 2, 3, 6, a); c.px(hx0, hy + 4, b)
            c.rect(hx0 + 6, hy - 1, 3, 1, theme["eye"]); c.px(hx0 + 8, hy - 1, b); c.px(hx0 + 6, hy - 2, b); c.px(hx0 + 7, hy - 2, b)
            c.px(hx0 + 9, hy + 2, hx("#ffffff"))
            return
        for sx in (hx0 - 1, hx0 + 10):
            c.rect(sx, hy + 2, 1, 6, a)
        if view == "front":
            c.rect(hx0 + 3, hy - 3, 4, 1, b); c.rect(hx0 + 4, hy - 2, 2, 1, b); c.rect(hx0 + 3, hy - 1, 4, 1, b)
            for ex, inner in ((hx0, hx0 + 2), (hx0 + 7, hx0 + 7)):
                c.rect(ex, hy, 3, 1, theme["eye"]); c.px(inner, hy, b); c.rect(ex, hy - 1, 3, 1, b)
            for fx in (hx0 + 2, hx0 + 7):
                c.px(fx, hy + 2, hx("#ffffff")); c.px(fx, hy + 3, hx("#ffffff"))
        else:
            for sx in (hx0 + 1, hx0 + 4, hx0 + 7): c.rect(sx, hy - 3, 2, 1, b); c.rect(sx + 1, hy - 1, 1, 2, b)
    elif t == "cap":
        c.rect(hx0, hy - 2, 10, 3, a); c.rect(hx0 + (2 if view != "side" else 6), hy + 1, 8 if view != "side" else 6, 1, b)
    elif t == "crown":
        c.rect(hx0 + 1, hy - 2, 8, 2, a); c.px(hx0 + 1, hy - 3, a); c.px(hx0 + 4, hy - 4, a); c.px(hx0 + 5, hy - 4, a); c.px(hx0 + 8, hy - 3, a); c.px(hx0 + 4, hy - 1, b)

def frame(k, theme, row, col):
    c = Cell()
    bob = 1 if col in (1, 3) else 0
    if row == 0 or (row == 3 and col < 3):
        cast = row == 3
        b = 0 if cast else bob
        legs(c, k, 0 if cast else col, b)
        torso(c, k, b)
        left_arm(c, k, 7, 16 + b, (0, 1, 0, -1)[col] if not cast else 0)
        head(c, k, 19, 6 + b, "front")
        hat(c, theme, 19, 5 + b, "front")
        horns(c, k, 19, 6 + b, "front")
        mech_arm(c, k, 32, 14 + b, reach=3 if cast else 0, raise_=3 if cast else 0)
    elif row == 1:
        legs(c, k, col, bob)
        mech_arm(c, k, 5, 14 + bob)
        torso(c, k, bob, back=True)
        left_arm(c, k, 34, 16 + bob, (0, 1, 0, -1)[col])
        head(c, k, 19, 6 + bob, "back")
        hat(c, theme, 19, 5 + bob, "back")
        horns(c, k, 19, 6 + bob, "back")
    else:
        cast = row == 3
        b = 0 if cast else bob
        stride = 0 if cast else (0, 3, 0, -3)[col]
        legs(c, k, 0, b, 20 + stride, 20 - stride)
        c.rect(16, 16 + b, 16, 14, k["shirt"]); c.rect(16, 16 + b, 6, 14, k["cloth"]); c.rect(17, 17 + b, 4, 1, k["clothL"])
        c.rect(16, 28 + b, 16, 3, k["boot"]); c.px(25, 29 + b, k["trim"]); c.rect(18, 31 + b, 12, 2, k["pants"])
        c.rect(13, 18 + b, 3, 8, k["dark"]); c.px(14, 20 + b, k["glow"]); c.px(14, 23 + b, k["glow"])  # 등 동력통
        head(c, k, 20, 6 + b, "side")
        hat(c, theme, 20, 5 + b, "side")
        horns(c, k, 20, 6 + b, "side")
        mech_arm(c, k, 22, 14 + b, reach=8 if cast else 2, raise_=4 if cast else 0)
    if theme.get("stripes"):
        # 범 줄무늬: 몸통 천에 굵은 검은 줄
        for (x, y), col in list(c.p.items()):
            if col == k["cloth"] and (x * 2 + y) % 12 in (0, 1) and y % 5 != 0: c.p[(x, y)] = theme["hatL"]
    if theme.get("tail") and row in (1, 2):
        tc, tl = theme["hatC"], theme["hatL"]
        tx = 23 if row == 1 else 11
        c.rect(tx, 30, 3, 6, tc); c.px(tx + 1, 32, tl); c.px(tx + 1, 34, tl)
    c.outline(theme.get("outline", k["outline"]))
    return c

def sheet(k, theme):
    img = Image.new("RGBA", (C * 4, C * 4), (0, 0, 0, 0))
    for row in range(4):
        for col in range(4): frame(k, theme, row, col).blit(img, col * C, row * C)
    return img

def pal(**over):
    k = dict(BASE); k.update({key: hx(v) for key, v in over.items()}); return k

THEMES = {
    "swim": (pal(mid="#3a9ac8", light="#7ad8f8", dark="#1e5a88", cloth="#f2a03a", clothL="#ffd070", trim="#f2d070", shirt="#d8a070", shirtL="#e8b888", pants="#3ac8e8"), {"hat": "goggles", "hatC": hx("#8ae8ff"), "hatL": hx("#2a6a8a")}),
    "xmas": (pal(mid="#a8242e", light="#e8484a", dark="#6a1a22", cloth="#2a6a3a", clothL="#3a8a4a", trim="#f4f4f4", shirt="#c82a36", shirtL="#f4f4f4", pants="#2a6a3a"), {"hat": "santa", "hatC": hx("#d8303a"), "hatL": hx("#ffffff")}),
    "halloween": (pal(mid="#4a2a6a", light="#7a4a9a", dark="#2a1640", cloth="#2a2230", trim="#f28a2a", trimL="#ffb060", shirt="#5a2a8a", shirtL="#f28a2a", pants="#2a2230"), {"hat": "witch", "hatC": hx("#2a2032"), "hatL": hx("#f28a2a")}),
    "school": (pal(mid="#2a3458", light="#4a5a88", dark="#1a2038", cloth="#2a3458", trim="#f2c040", shirt="#f4f4f4", shirtL="#ffffff", pants="#4a4a5a"), {"hat": "cap", "hatC": hx("#2a3458"), "hatL": hx("#f2c040")}),
    "newyear": (pal(mid="#c8a030", light="#f2d070", dark="#8a6a20", cloth="#3a6ad8", clothL="#5a8af0", trim="#e84a6a", shirt="#f2c040", shirtL="#ffe080", pants="#3a6ad8"), {"hat": "crown", "hatC": hx("#f2c040"), "hatL": hx("#e84a6a")}),
    "japan": (pal(mid="#2a3a6a", light="#4a5a9a", dark="#1a2440", cloth="#2a3a6a", clothL="#e8e8f0", trim="#e83a3a", shirt="#e8e8f0", shirtL="#ffffff", pants="#2a2a3a"), {"hat": "headband", "hatC": hx("#f4f4f4"), "hatL": hx("#e83a3a")}),
    "china": (pal(mid="#a81e26", light="#d8303a", dark="#6a1218", cloth="#c8202a", clothL="#e8b030", trim="#e8b030", trimL="#ffd860", shirt="#e8b030", shirtL="#ffd860", pants="#2a2028"), {"hat": "crown", "hatC": hx("#e8b030"), "hatL": hx("#d8303a")}),
    "usa": (pal(mid="#2a3a8a", light="#4a5ab8", dark="#1a2258", cloth="#2a3a8a", clothL="#f4f4f4", trim="#f4f4f4", shirt="#f4f4f4", shirtL="#d8303a", pants="#3a5aa8"), {"hat": "cowboy", "hatC": hx("#8a5a32"), "hatL": hx("#5a3a20")}),
    "swap": (pal(mid="#8a5a7a", light="#c88ab0", dark="#5a3450", trim="#ffd0e8", visor="#ff6ab8", hair="#c84a8a", beard="#d8a070", shirt="#f2a8c8", shirtL="#ffd0e8", cloth="#8a3a6a", clothL="#c86aa0"), {}),
    "tiger": (pal(mid="#d8d8e0", light="#ffffff", dark="#8a8a98", trim="#2a2a2a", trimL="#5a5a5a", shirt="#f8f8f8", shirtL="#2a2a2a", cloth="#f8f8f8", clothL="#2a2a2a", pants="#f0f0f0"), {"hat": "tiger", "hatC": hx("#fcfcfc"), "hatL": hx("#1a1a1a"), "eye": hx("#ffc81e"), "tail": True, "stripes": True, "outline": hx("#c8901e")}),
}

def main():
    sheet(BASE, {}).save(os.path.join(OUT, "titan.png"), optimize=True)
    for t, (k, theme) in THEMES.items():
        sheet(k, theme).save(os.path.join(OUT, "skins", f"titan_{t}.png"), optimize=True)
    print("titan ok")

if __name__ == "__main__":
    main()
