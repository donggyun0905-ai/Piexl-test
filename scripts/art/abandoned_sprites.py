# 버려진 자들(P1 방패 소년 · P2 총 소녀 · P3 검 소년) 방향 시트·스킨을 코드로 그림 (python3 scripts/art/abandoned_sprites.py)
# 시트: 32×32 칸, 4줄(앞 걷기 · 뒤 걷기 · 오른쪽 걷기 · 공격) × 4칸. 규격은 docs/ART.md
# 생김새: 작고 갸름한 얼굴 · 검은 옷 · 빛(금빛 눈·흰 줄)과 어둠(보랏빛 눈·보라 줄)이 섞인 몸 · 무기만 아이 색(초록 방패·빨강 총·파랑 검)
import os
from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), "../../apps/client/public/sprites")
C = 32
OUTLINE = (24, 18, 30, 255)

def hx(s):
    s = s.lstrip("#")
    return (int(s[0:2], 16), int(s[2:4], 16), int(s[4:6], 16), 255)

SKIN = hx("#f4d0b0")
SKIN_D = hx("#d8a888")
EYE = hx("#14101c")
WHITE = hx("#ffffff")
LIGHT = hx("#ffd060")   # 빛: 금빛
LIGHT_H = hx("#fffbe8")
DARK = hx("#8a4ae0")    # 어둠: 보랏빛
DARK_D = hx("#4a2480")

class Cell:
    def __init__(self):
        self.p = {}
    def px(self, x, y, c):
        if c is None: return
        if 0 <= x < C and 0 <= y < C: self.p[(x, y)] = c
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

# ───────── 아이마다 생김새 (테마가 덮어씀) ─────────
BLACK = dict(coat=hx("#221f2c"), coatL=hx("#423d54"), coatD=hx("#100e16"), pants=hx("#191720"), shoe=hx("#2a2430"), trimA=LIGHT, trimB=DARK)
KIDS = {
    # P1 방패: 굳건한 얼굴의 소년 · 짧게 솟은 검갈색 머리(끝이 금빛) · 검은 후드 점퍼 · 초록 방패
    "p1": dict(BLACK, girl=False, hair=hx("#2a1e1c"), hairL=hx("#4a3630"), tips=hx("#a8803a"), face="sturdy", weapon="shield", style="hood",
               acc=hx("#2f9a4c"), accL=hx("#8af0a8"), accD=hx("#155a2a")),
    # P2 총: 날카로운 눈매의 소녀 · 긴 흑발 높은 포니테일(한 가닥 흰 빛) · 짧은 검은 재킷·반바지·검은 긴 양말 · 빨간 권총
    "p2": dict(BLACK, girl=True, hair=hx("#16121c"), hairL=hx("#2e2838"), tips=LIGHT_H, face="sharp", weapon="gun", style="jacket",
               acc=hx("#d8303a"), accL=hx("#ff8a80"), accD=hx("#6a1018")),
    # P3 검: 결심한 얼굴의 소년 · 헝클어진 흑남색 머리(끝이 보랏빛) · 긴 검은 코트 + 흰 목도리 · 파란 검
    "p3": dict(BLACK, girl=False, hair=hx("#161a2a"), hairL=hx("#2c3450"), tips=hx("#5a3a9a"), face="determined", weapon="sword", style="coat",
               acc=hx("#3a8aff"), accL=hx("#c0e4ff"), accD=hx("#1a3a8a"), scarf=hx("#f0ecf4"), scarfD=hx("#b8b0c8")),
}

# ───────── 머리 (작고 갸름하게) ─────────

def eyes_front(c, k, ey):
    """눈: 왼쪽은 빛(금빛), 오른쪽은 어둠(보랏빛)"""
    f = k["face"]
    h = k["hair"]
    for x, iris, glow in ((13, k.get("eyeL", hx("#f0a020")), LIGHT_H), (17, k.get("eyeR", hx("#9a50ff")), hx("#e0c8ff"))):
        if f == "sharp":
            c.px(x, ey, EYE); c.px(x + 1, ey, EYE); c.px(x, ey + 1, iris); c.px(x + 1, ey + 1, EYE if x == 13 else iris)
            if x == 13: c.px(x, ey + 1, EYE); c.px(x + 1, ey + 1, iris)
        else:
            c.px(x, ey, EYE); c.px(x + 1, ey, EYE); c.px(x, ey + 1, iris); c.px(x + 1, ey + 1, iris)
            c.px(x + (1 if x == 13 else 0), ey, glow)
    if f == "sharp":
        # 바깥 끝이 올라간 아이라인
        c.px(12, ey - 1, EYE); c.px(19, ey - 1, EYE); c.px(12, ey, EYE); c.px(19, ey, EYE)
        c.px(16, ey + 3, SKIN_D)
    elif f == "sturdy":
        # 굵은 일자 눈썹 · 다문 입 · 볼 반창고
        c.rect(13, ey - 1, 2, 1, h); c.rect(17, ey - 1, 2, 1, h); c.px(12, ey - 1, h); c.px(19, ey - 1, h)
        c.rect(15, ey + 3, 2, 1, SKIN_D)
        c.px(18, ey + 2, hx("#fff0d8")); c.px(19, ey + 2, hx("#e8c8a0"))
    else:
        # 안쪽으로 내려간 눈썹 · 꽉 다문 입
        c.px(13, ey - 2, h); c.px(14, ey - 1, h); c.px(18, ey - 2, h); c.px(17, ey - 1, h)
        c.rect(15, ey + 3, 2, 1, SKIN_D)

def head_front(c, k, hy, theme):
    """hy = 머리 꼭대기. 얼굴은 12~19 (8칸), 턱은 좁게"""
    h, hl, tip = k["hair"], k["hairL"], k["tips"]
    c.rect(12, hy + 3, 8, 6, SKIN); c.rect(13, hy + 9, 6, 1, SKIN); c.rect(14, hy + 10, 4, 1, SKIN_D)
    c.rect(12, hy, 8, 3, h); c.rect(11, hy + 1, 1, 5, h); c.rect(20, hy + 1, 1, 5, h); c.rect(13, hy - 1, 6, 1, h)
    if k["girl"]:
        # 비스듬한 앞머리 · 긴 옆머리 · 흰 빛 한 가닥
        c.rect(12, hy + 3, 3, 1, h); c.px(15, hy + 3, h); c.px(12, hy + 4, h)
        c.rect(10, hy + 2, 2, 9, h); c.rect(20, hy + 2, 2, 9, h); c.px(21, hy + 11, h); c.px(10, hy + 11, h)
        c.px(19, hy + 2, tip); c.px(20, hy + 4, tip); c.px(21, hy + 7, tip)
        c.px(14, hy, hl)
    elif k["face"] == "sturdy":
        # 짧게 솟은 머리 (끝이 금빛)
        c.rect(12, hy - 2, 2, 1, h); c.rect(15, hy - 2, 2, 1, h); c.rect(18, hy - 2, 2, 1, h)
        c.px(12, hy - 3, tip); c.px(15, hy - 3, tip); c.px(16, hy - 3, tip); c.px(19, hy - 3, tip)
        c.rect(12, hy + 3, 8, 1, h); c.px(13, hy + 4, h); c.px(18, hy + 4, h)
        c.px(16, hy, hl); c.px(14, hy - 1, hl)
    else:
        # 헝클어진 앞머리가 한쪽 눈썹까지 (끝이 보랏빛)
        c.rect(11, hy - 2, 3, 1, h); c.rect(15, hy - 2, 2, 1, h); c.rect(18, hy - 2, 2, 1, h)
        c.px(11, hy - 3, tip); c.px(15, hy - 3, tip); c.px(16, hy - 4, tip); c.px(19, hy - 3, tip)
        c.rect(12, hy + 3, 6, 1, h); c.px(16, hy + 4, h); c.px(17, hy + 4, h); c.px(12, hy + 4, h); c.px(12, hy + 5, tip)
        c.px(15, hy, hl); c.px(13, hy - 1, hl)
    eyes_front(c, k, hy + 5)

def head_back(c, k, hy):
    h, hl, tip = k["hair"], k["hairL"], k["tips"]
    c.rect(12, hy, 8, 10, h); c.rect(11, hy + 1, 10, 7, h); c.rect(13, hy - 1, 6, 1, h); c.rect(14, hy + 10, 4, 1, SKIN_D)
    c.px(14, hy + 1, hl); c.px(16, hy + 3, hl)
    if k["girl"]:
        c.rect(10, hy + 2, 12, 9, h)
        # 높은 포니테일 (흰 빛 끝)
        c.rect(15, hy + 1, 2, 1, k["acc"]); c.rect(15, hy + 2, 2, 7, h); c.px(16, hy + 9, tip); c.px(15, hy + 5, hl)
    elif k["face"] == "sturdy":
        for x in (12, 15, 18): c.rect(x, hy - 2, 2, 1, h); c.px(x + 1, hy - 3, tip)
    else:
        for x in (11, 15, 18): c.rect(x, hy - 2, 2, 1, h); c.px(x, hy - 3, tip)

def head_side(c, k, hy):
    h, hl, tip = k["hair"], k["hairL"], k["tips"]
    c.rect(13, hy + 3, 7, 6, SKIN); c.rect(14, hy + 9, 5, 1, SKIN); c.px(20, hy + 6, SKIN); c.rect(15, hy + 10, 3, 1, SKIN_D)
    c.rect(12, hy, 8, 3, h); c.rect(13, hy - 1, 6, 1, h); c.rect(12, hy + 3, 4, 5, h); c.px(16, hy + 3, h)
    c.px(14, hy, hl)
    ey = hy + 5
    if k["girl"]:
        c.rect(11, hy + 2, 2, 9, h); c.rect(9, hy, 3, 2, h); c.rect(7, hy + 1, 3, 2, h); c.rect(6, hy + 3, 2, 5, h); c.px(6, hy + 8, tip)
        c.px(12, hy + 1, k["acc"]); c.px(13, hy + 4, tip)
        c.px(18, ey, EYE); c.px(19, ey, EYE); c.px(18, ey + 1, EYE); c.px(19, ey + 1, k.get("eyeL", hx("#f0a020"))); c.px(20, ey - 1, EYE)
    elif k["face"] == "sturdy":
        for x in (12, 15, 18): c.rect(x, hy - 2, 2, 1, h); c.px(x + 1, hy - 3, tip)
        c.px(11, hy + 1, h)
        c.rect(17, ey - 1, 3, 1, h); c.px(18, ey, EYE); c.px(18, ey + 1, k.get("eyeL", hx("#f0a020"))); c.px(19, ey, LIGHT_H); c.px(19, ey + 1, EYE)
        c.px(18, ey + 2, hx("#fff0d8"))
    else:
        for x in (11, 14, 17): c.rect(x, hy - 2, 2, 1, h); c.px(x + 1, hy - 3, tip)
        c.px(20, hy + 2, h); c.px(20, hy + 3, tip)
        c.px(18, ey - 2, h); c.px(19, ey - 1, h); c.px(18, ey, EYE); c.px(19, ey, EYE); c.px(18, ey + 1, k.get("eyeL", hx("#f0a020"))); c.px(19, ey + 1, k.get("eyeL", hx("#f0a020")))
    c.px(19, ey + 3, SKIN_D)

# ───────── 몸 (검은 옷 · 왼쪽 금빛 줄 · 오른쪽 보라 줄) ─────────

def body_front(c, k, frame, by, back=False, theme=None):
    coat, coatL, coatD = k["coat"], k["coatL"], k["coatD"]
    style = k["style"]
    # 목 · 몸통
    c.rect(15, by - 1, 2, 1, SKIN_D)
    c.rect(12, by, 8, 6, coat); c.rect(13, by, 6, 1, coatL)
    if not back:
        if style == "hood":
            c.rect(12, by, 8, 1, coatL); c.rect(11, by, 1, 2, coatL); c.rect(20, by, 1, 2, coatL)
            c.rect(16, by + 1, 1, 5, coatD); c.px(16, by + 1, k["trimA"])
        elif style == "jacket":
            c.rect(15, by + 1, 2, 3, k.get("inner", hx("#2c2834"))); c.rect(12, by + 4, 8, 1, coatD); c.px(15, by + 4, hx("#e8b030"))
        else:
            c.rect(15, by + 1, 2, 5, coatD)
            c.rect(12, by, 8, 1, k["scarf"]); c.px(19, by + 1, k["scarf"]); c.px(19, by + 2, k["scarfD"])
        c.px(12, by + 1, k["trimA"]); c.px(12, by + 2, k["trimA"]); c.px(19, by + 3, k["trimB"]); c.px(19, by + 4, k["trimB"])
    else:
        if style == "hood": c.rect(13, by, 6, 2, coatL); c.rect(14, by + 2, 4, 1, coatL)
        if style == "coat": c.rect(12, by, 8, 1, k["scarf"]); c.rect(17, by + 1, 2, 3, k["scarf"]); c.px(18, by + 4, k["scarfD"])
        c.px(19, by + 1, k["trimA"]); c.px(12, by + 3, k["trimB"])
    swing = (0, 1, 0, -1)[frame]
    c.rect(10, by + swing, 2, 5, coat); c.rect(20, by - swing, 2, 5, coat); c.px(10, by + swing, coatL); c.px(21, by - swing, coatL)
    c.rect(10, by + 5 + swing, 2, 1, SKIN); c.rect(20, by + 5 - swing, 2, 1, SKIN)
    # 아래: 코트 자락 · 다리
    up_l = 1 if frame == 1 else 0
    up_r = 1 if frame == 3 else 0
    ly = by + 6
    if style == "coat":
        c.rect(12, ly, 8, 2, coat); c.px(12, ly + 2, coat); c.px(19, ly + 2, coat); c.px(16, ly, coatD); c.px(16, ly + 1, coatD)
    if k["girl"]:
        c.rect(12, ly, 8, 2, k["pants"]); c.px(12, ly + 1, k["trimA"])
        for x, up in ((13, up_l), (17, up_r)):
            c.px(x, ly + 2, SKIN); c.px(x + 1, ly + 2, SKIN); c.rect(x, ly + 3, 2, 3 - up, k.get("sock", hx("#14121a")))
    else:
        for x, up in ((13, up_l), (17, up_r)): c.rect(x, ly, 2, 5 - up, k["pants"])
        c.rect(15, ly, 2, 1, k["pants"])
    c.rect(12, by + 11 - up_l, 3, 2, k["shoe"]); c.rect(17, by + 11 - up_r, 3, 2, k["shoe"])

def body_side(c, k, frame, by):
    coat, coatL, coatD = k["coat"], k["coatL"], k["coatD"]
    style = k["style"]
    c.rect(15, by - 1, 2, 1, SKIN_D)
    c.rect(13, by, 6, 6, coat); c.rect(14, by, 4, 1, coatL); c.px(18, by + 2, k["trimA"]); c.px(18, by + 3, k["trimA"])
    if style == "hood": c.rect(12, by, 2, 3, coatL)
    if style == "coat":
        c.rect(13, by, 6, 1, k["scarf"]); c.rect(10, by + 1, 3, 1, k["scarf"]); c.px(9, by + 2, k["scarfD"])
        c.rect(13, by + 6, 5, 2, coat); c.px(12, by + 7, coat)
    stride = (0, 2, 0, -2)[frame]
    ly = by + 6
    if k["girl"]:
        c.rect(13, ly, 6, 2, k["pants"])
        for sx in (15 + stride, 15 - stride): c.rect(sx, ly + 2, 2, 1, SKIN); c.rect(sx, ly + 3, 2, 2, k.get("sock", hx("#14121a")))
    else:
        for sx in (15 + stride, 15 - stride): c.rect(sx, ly, 2, 5, k["pants"])
    c.rect(15 + stride, by + 11, 3, 2, k["shoe"]); c.rect(15 - stride, by + 11, 3, 2, k["shoe"])
    c.rect(15 - stride // 2, by + 1, 2, 4, coatL); c.px(15 - stride // 2, by + 5, SKIN); c.px(16 - stride // 2, by + 5, SKIN)

# ───────── 무기 (아이 색) ─────────

def shield(c, k, x, y):
    a, l, d = k["acc"], k["accL"], k["accD"]
    c.rect(x, y, 6, 7, a); c.rect(x + 1, y - 1, 4, 1, a); c.rect(x + 1, y + 7, 4, 1, d)
    c.rect(x, y, 1, 7, l); c.rect(x + 5, y, 1, 7, d)
    # 가운데 문양: 빛과 어둠 반쪽씩
    c.px(x + 2, y + 2, LIGHT_H); c.px(x + 2, y + 3, LIGHT); c.px(x + 3, y + 3, DARK); c.px(x + 3, y + 4, DARK_D)

def gun(c, k, x, y, flip=False):
    a, l, d = k["acc"], k["accL"], k["accD"]
    s = -1 if flip else 1
    for i in range(5): c.px(x + i * s, y, a)
    c.px(x + s, y - 1, l); c.px(x + 2 * s, y - 1, l); c.px(x + 4 * s, y - 1, LIGHT_H)
    c.px(x, y + 1, d); c.px(x, y + 2, d); c.px(x + s, y + 1, hx("#2a2430"))

def sword(c, k, x, y, dx, dy, n=7):
    a, l, d = k["acc"], k["accL"], k["accD"]
    c.px(x - dx, y - dy, hx("#2a2430")); c.px(x - dx * 2, y - dy * 2, DARK)
    c.px(x - dy, y + dx, d); c.px(x + dy, y - dx, d)
    for i in range(1, n + 1): c.px(x + dx * i, y + dy * i, l if i >= n - 1 else a)

def weapon(c, k, view, cast, by):
    w = k["weapon"]
    if w == "shield":
        if view == "front": shield(c, k, 5 if not cast else 22, by - 1)
        elif view == "back": shield(c, k, 13, by)
        else: shield(c, k, 18 if not cast else 20, by - 1)
    elif w == "gun":
        if view == "front": gun(c, k, 21, by + 5) if not cast else gun(c, k, 22, by + 1)
        elif view == "side": gun(c, k, 17, by + 3) if not cast else gun(c, k, 19, by + 1)
    else:
        if view == "front":
            if cast: sword(c, k, 22, by + 3, 1, -1, 7)
            else: sword(c, k, 9, by - 1, -1, -1, 5)
        elif view == "back": sword(c, k, 12, by + 6, 1, -1, 8)
        else:
            if cast: sword(c, k, 19, by + 2, 1, 0, 9)
            else: sword(c, k, 12, by + 1, -1, -1, 5)

# ───────── 테마 꾸밈 (모자·옷) ─────────

def hat(c, theme, view, hy, k):
    t = theme.get("hat")
    if not t: return
    a, b = theme["hatC"], theme["hatL"]
    side = view == "side"
    if t == "santa":
        c.rect(12, hy - 1, 8, 3, a); c.rect(13, hy - 3, 6, 2, a); c.rect(16 if not side else 11, hy - 5, 3, 2, a)
        c.rect(11, hy + 1, 10, 2, b); c.rect(18 if not side else 9, hy - 6, 2, 2, b)
    elif t == "witch":
        c.rect(9, hy + 1, 14, 2, a); c.rect(12, hy - 2, 8, 3, a); c.rect(14, hy - 5, 4, 3, a); c.rect(16, hy - 7, 2, 2, a); c.px(18, hy - 7, a)
        c.rect(12, hy, 8, 1, b)
    elif t == "vamp":
        # 흡혈귀 높은 깃 (머리 뒤로)
        c.rect(10, hy + 6, 2, 5, a); c.rect(20, hy + 6, 2, 5, a); c.px(10, hy + 6, b); c.px(21, hy + 6, b)
    elif t == "pumpkin":
        c.rect(13, hy - 3, 6, 3, a); c.rect(12, hy - 2, 8, 2, a); c.px(15, hy - 4, b); c.px(16, hy - 5, b)
        if view == "front": c.px(14, hy - 2, EYE); c.px(17, hy - 2, EYE)
    elif t == "cowboy":
        c.rect(8, hy + 1, 16, 2, a); c.rect(12, hy - 3, 8, 4, a); c.rect(12, hy - 1, 8, 1, b)
    elif t == "headband":
        c.rect(11, hy + 3, 10, 1, a)
        if view == "front": c.px(16, hy + 3, b)
        else: c.px(10, hy + 4, a); c.px(9, hy + 5, a); c.px(8, hy + 6, b)
    elif t == "goggles":
        c.rect(11, hy + 2, 10, 1, b)
        if view != "back": c.rect(12, hy + 1, 3, 2, a); c.rect(17, hy + 1, 3, 2, a); c.px(13, hy + 1, WHITE); c.px(18, hy + 1, WHITE)
    elif t == "flower":
        c.rect(18, hy - 1, 3, 3, a); c.px(19, hy, b); c.px(17, hy, a)
    elif t == "buns":
        c.rect(10, hy - 2, 3, 3, a); c.rect(19, hy - 2, 3, 3, a); c.px(11, hy - 2, b); c.px(20, hy - 2, b)
    elif t == "cap":
        c.rect(12, hy - 1, 8, 3, a); c.rect(13, hy - 2, 6, 1, a)
        if view == "front": c.rect(12, hy + 2, 8, 1, b)
        elif side: c.rect(19, hy + 2, 4, 1, b)
    elif t == "bok":
        # 복건(설날 아이 모자): 검은 두건 + 금박
        c.rect(12, hy - 1, 8, 3, a); c.rect(13, hy - 2, 6, 1, a); c.px(15, hy, b); c.px(16, hy, b)
        if view == "back": c.rect(14, hy + 2, 4, 4, a)
    elif t == "ribbon":
        c.rect(18, hy - 1, 2, 2, a); c.rect(21, hy - 1, 2, 2, a); c.px(20, hy, b)
    elif t == "tiger":
        # 사나운 백호 머리 가죽: 뾰족 귀 · 노려보는 금빛 눈 · 이마 王 줄무늬 · 볼까지 내려온 털 · 송곳니
        c.rect(11, hy - 2, 10, 4, a); c.rect(10, hy, 1, 9, a); c.rect(21, hy, 1, 9, a)
        for x in (11, 19): c.rect(x, hy - 4, 2, 2, a); c.px(x + (1 if x == 11 else 0), hy - 3, b)
        if not side and view == "front":
            c.rect(14, hy - 2, 4, 1, b); c.rect(15, hy - 1, 2, 1, b)
            for ex in (12, 18): c.rect(ex, hy, 2, 1, theme["eye"]); c.px(ex + (1 if ex == 12 else 0), hy, b)
            c.px(12, hy - 1, b); c.px(19, hy - 1, b)
            for fx in (13, 18): c.px(fx, hy + 2, WHITE); c.px(fx, hy + 3, WHITE)
            for sx in (10, 21): c.px(sx, hy + 3, b); c.px(sx, hy + 6, b)
        elif side:
            c.rect(17, hy, 3, 1, theme["eye"]); c.px(19, hy, b); c.px(17, hy - 1, b); c.px(19, hy + 2, WHITE)
            c.px(12, hy - 2, b); c.px(15, hy - 2, b)
        else:
            for sx in (12, 15, 18): c.rect(sx, hy - 2, 2, 1, b); c.px(sx + 1, hy, b)

def outfit(c, theme, k, view, by, frame):
    """옷 꾸밈: 수영복 튜브 · 학교 세일러 깃 · 설날 색동 소매 · 백호 발톱 장갑 등"""
    o = theme.get("outfit")
    if not o: return
    if o == "swim":
        # 귀여운 튜브 (허리) · 물방울
        ring = theme["ring"]
        if view != "side":
            c.rect(10, by + 4, 12, 3, ring); c.rect(11, by + 4, 10, 1, WHITE)
            for x in (12, 16, 20): c.px(x, by + 5, theme["ringL"])
        else:
            c.rect(11, by + 4, 10, 3, ring); c.rect(12, by + 4, 8, 1, WHITE); c.px(15, by + 5, theme["ringL"])
    elif o == "sailor" and view == "front":
        c.rect(12, by, 8, 2, hx("#2a3458")); c.px(15, by + 2, hx("#e83a48")); c.px(16, by + 2, hx("#e83a48")); c.px(15, by + 3, hx("#e83a48"))
    elif o == "tie" and view == "front":
        c.px(15, by + 1, hx("#c83040")); c.px(16, by + 1, hx("#c83040")); c.px(15, by + 2, hx("#c83040")); c.px(15, by + 3, hx("#8a1e28"))
    elif o == "saekdong":
        cols = [hx("#e83a48"), hx("#f2c040"), hx("#3cb85a"), hx("#3a7ae8"), hx("#e84ab0")]
        swing = (0, 1, 0, -1)[frame] if view != "side" else 0
        if view != "side":
            for i in range(5):
                c.rect(10, by + swing + i, 2, 1, cols[i]); c.rect(20, by - swing + i, 2, 1, cols[i])
        else:
            for i in range(4): c.rect(15, by + 1 + i, 2, 1, cols[i])
    elif o == "claws":
        # 범 발톱 장갑
        swing = (0, 1, 0, -1)[frame] if view != "side" else 0
        if view != "side":
            for x, sw in ((10, swing), (20, -swing)):
                c.rect(x, by + 4 + sw, 2, 2, theme["hatC"]); c.px(x, by + 6 + sw, WHITE); c.px(x + 1, by + 6 + sw, WHITE)
        for (x, y), col in list(c.p.items()):
            if col == k["coat"] and y % 3 == 1 and (x + y) % 6 < 2: c.p[(x, y)] = theme["hatL"]

# ───────── 시트 ─────────

HEAD_Y = 6

def frame(k, theme, row, col):
    c = Cell()
    bob = 1 if col in (1, 3) else 0
    if row == 0 or (row == 3 and col < 3):
        cast = row == 3
        b = 0 if cast else bob
        by = 17 + b
        if k["weapon"] == "shield" and not cast: weapon(c, k, "front", cast, by)
        body_front(c, k, col if row == 0 else 0, by, theme=theme)
        outfit(c, theme, k, "front", by, col if row == 0 else 0)
        if cast: c.rect(20, by + 1, 4, 2, k["coat"]); c.px(20, by + 1, k["coatL"]); c.rect(24, by + 1, 1, 2, SKIN)
        head_front(c, k, HEAD_Y + b, theme)
        hat(c, theme, "front", HEAD_Y + b, k)
        if not (k["weapon"] == "shield" and not cast): weapon(c, k, "front", cast, by)
    elif row == 1:
        by = 17 + bob
        if k["weapon"] == "gun": weapon(c, k, "back", False, by)
        body_front(c, k, col, by, back=True, theme=theme)
        outfit(c, theme, k, "back", by, col)
        if k["weapon"] != "gun": weapon(c, k, "back", False, by)
        head_back(c, k, HEAD_Y + bob)
        hat(c, theme, "back", HEAD_Y + bob, k)
    else:
        cast = row == 3
        b = 0 if cast else bob
        by = 17 + b
        body_side(c, k, 0 if cast else col, by)
        outfit(c, theme, k, "side", by, 0 if cast else col)
        head_side(c, k, HEAD_Y + b)
        hat(c, theme, "side", HEAD_Y + b, k)
        if cast: c.rect(16, by + 1, 4, 2, k["coatL"]); c.px(20, by + 1, SKIN); c.px(20, by + 2, SKIN)
        weapon(c, k, "side", cast, by)
    if theme.get("tail"):
        tc, tl = theme["hatC"], theme["hatL"]
        if row == 2 or (row == 3 and col == 3):
            c.rect(9, 23, 3, 2, tc); c.px(8, 22, tc); c.px(7, 21, tc); c.px(10, 23, tl); c.px(7, 21, tl)
        elif row == 1: c.rect(15, 24, 2, 4, tc); c.px(15, 25, tl); c.px(16, 27, tl)
    c.outline(theme.get("outline", OUTLINE))
    return c

def sheet(k, theme):
    img = Image.new("RGBA", (C * 4, C * 4), (0, 0, 0, 0))
    for row in range(4):
        for col in range(4):
            frame(k, theme, row, col).blit(img, col * C, row * C)
    return img

# ───────── 테마 (스킨) ─────────

def kid(kind, **over):
    k = dict(KIDS[kind]); k.update(over); return k

GOLD = hx("#e8b030")

def swim(n):
    # 귀여운 수영복: P1 바다색 래시가드 · P2 분홍 프릴 수영복 + 꽃 · P3 하늘색 래시가드, 다들 튜브와 물안경
    cols = {"p1": ("#3ac8e8", "#8ae8ff"), "p2": ("#ff7aa8", "#ffc0d8"), "p3": ("#5ab0ff", "#a8dcff")}[n]
    over = {"coat": hx(cols[0]), "coatL": hx(cols[1]), "coatD": hx(cols[0]), "pants": hx(cols[0]), "shoe": hx("#f2d070"), "sock": SKIN, "inner": hx(cols[1]), "trimA": WHITE, "trimB": WHITE,
            "scarf": hx(cols[1]), "scarfD": hx(cols[0]), "style": "jacket" if n != "p3" else "hood"}
    ring = {"p1": ("#ffd040", "#e83a48"), "p2": ("#8ae8a0", "#ff7aa8"), "p3": ("#ff8a3a", "#ffffff")}[n]
    return over, {"hat": "goggles" if n != "p2" else "flower", "hatC": hx("#8ae8ff") if n != "p2" else hx("#ffe060"), "hatL": hx("#2a6a8a") if n != "p2" else hx("#ff7aa8"),
                  "outfit": "swim", "ring": hx(ring[0]), "ringL": hx(ring[1])}

THEMES = {
    "swim": swim,
    "xmas": lambda n: ({"coat": hx("#c82a36"), "coatL": hx("#f4f4f4"), "coatD": hx("#8a1a22"), "inner": hx("#f4f4f4"), "pants": hx("#2a6a3a"), "trimA": WHITE, "trimB": GOLD, "sock": hx("#c82a36")},
                       {"hat": "santa", "hatC": hx("#d8303a"), "hatL": hx("#ffffff")}),
    "halloween": lambda n: ({"coat": hx("#2a2032"), "coatL": hx("#5a2a8a"), "trimA": hx("#f28a2a"), "trimB": hx("#8a4ae0"), "inner": hx("#f28a2a"), "sock": hx("#5a2a8a")},
                            {"hat": {"p1": "vamp", "p2": "witch", "p3": "pumpkin"}[n], "hatC": {"p1": hx("#8a1a2a"), "p2": hx("#2a2032"), "p3": hx("#f28a2a")}[n], "hatL": {"p1": hx("#e83a48"), "p2": hx("#f28a2a"), "p3": hx("#3a8a3a")}[n]}),
    "school": lambda n: ({"coat": hx("#22284a"), "coatL": hx("#3a4478"), "coatD": hx("#141830"), "inner": hx("#f4f4f4"), "pants": hx("#2a2e44") if n != "p2" else hx("#3a4478"), "trimA": hx("#f2c040"), "trimB": hx("#f4f4f4"), "sock": hx("#f4f4f4")},
                         {"hat": "cap" if n == "p1" else "ribbon" if n == "p2" else None, "hatC": hx("#22284a") if n == "p1" else hx("#e83a48"), "hatL": hx("#f2c040"), "outfit": "sailor" if n == "p2" else "tie"}),
    "newyear": lambda n: ({"coat": hx("#f4ecd8") if n != "p2" else hx("#f28ab0"), "coatL": hx("#ffffff"), "coatD": hx("#d8c8a8"), "inner": hx("#e84a6a"), "pants": hx("#3a5ad8") if n != "p2" else hx("#e84a6a"), "trimA": GOLD, "trimB": hx("#e84a6a"), "sock": hx("#f4f4f4")},
                          {"hat": "bok" if n != "p2" else "flower", "hatC": hx("#1e1b26") if n != "p2" else hx("#ff6a8a"), "hatL": GOLD, "outfit": "saekdong"}),
    "japan": lambda n: ({"coat": hx("#2a3a6a"), "coatL": hx("#e8e8f0"), "coatD": hx("#1a2440"), "inner": hx("#e8e8f0"), "pants": hx("#2a2a3a"), "trimA": hx("#e8e8f0"), "trimB": hx("#e83a3a")},
                        {"hat": "headband", "hatC": hx("#f4f4f4"), "hatL": hx("#e83a3a")}),
    "china": lambda n: ({"coat": hx("#a81e26"), "coatL": hx("#d8303a"), "coatD": hx("#6a1218"), "inner": GOLD, "pants": hx("#1e1b26"), "trimA": GOLD, "trimB": GOLD},
                        {"hat": "buns" if n == "p2" else None, "hatC": hx("#16121c"), "hatL": GOLD}),
    "usa": lambda n: ({"coat": hx("#2a3a8a"), "coatL": hx("#4a5ab8"), "coatD": hx("#1a2258"), "inner": hx("#d8303a"), "pants": hx("#3a5aa8"), "trimA": hx("#f4f4f4"), "trimB": hx("#d8303a"), "shoe": hx("#6a4a2a")},
                      {"hat": "cowboy", "hatC": hx("#8a5a32"), "hatL": hx("#5a3a20")}),
    "swap": lambda n: ({"girl": n != "p2"}, {}),
    # 한정 스킨: 버려진 자들은 백호 대신 흑호 (검은 범 가죽 · 금빛 줄무늬 · 금빛 눈 · 흰 발톱)
    "tiger": lambda n: ({"coat": hx("#26222e"), "coatL": hx("#3e3848"), "coatD": hx("#16131c"), "inner": hx("#26222e"), "pants": hx("#16131c"), "trimA": hx("#f2c040"), "trimB": hx("#c8902a"),
                         "scarf": hx("#26222e"), "scarfD": hx("#c8902a"), "sock": hx("#16131c")},
                        {"hat": "tiger", "hatC": hx("#26222e"), "hatL": hx("#d8a030"), "eye": hx("#ffd040"), "tail": True, "outfit": "claws", "outline": hx("#c8901e")}),
}

def main():
    names = {"p1": "abandoned", "p2": "abandoned2", "p3": "abandoned3"}
    for n, file in names.items():
        sheet(KIDS[n], {}).save(os.path.join(OUT, file + ".png"), optimize=True)
        for t, make in THEMES.items():
            over, theme = make(n)
            if t == "swap" and n == "p2": over = {"girl": False}
            suffix = "" if n == "p1" else f"_{n}"
            sheet(kid(n, **over), theme).save(os.path.join(OUT, "skins", f"abandoned_{t}{suffix}.png"), optimize=True)
    print("abandoned ok")

if __name__ == "__main__":
    main()
