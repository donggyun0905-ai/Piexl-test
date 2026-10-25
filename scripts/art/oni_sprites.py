# 오니(도깨비) 방향 시트·스킨을 코드로 그림 (python3 scripts/art/oni_sprites.py)
# 시트: 48×48 칸(발 여백 3, 거인처럼 큰 칸: 몸은 32칸 기준으로 그리고 OX·OY만큼 옮겨 큰 방망이 자리를 둠), 4줄(앞 걷기 · 뒤 걷기 · 오른쪽 걷기 · 공격) × 4칸. 규격은 docs/ART.md
# 생김새: 사람 피부의 도깨비 수인 · 뿔 둘 · 뒤로 묶은 거친 머리 · 흉터 · 송곳니 드러낸 웃음 · 웃통 벗은 근육질 · 손목 붕대 · 범 가죽 허리띠 · 짙은 바지
# 방망이는 무기마다 다른 그림이라 몸 시트에는 넣지 않고 oni_clubs.py가 같은 칸 자리로 따로 만듦 (게임이 몸 뒤·앞에 겹쳐 그림) · skins/oni_god.png = 신인족 모습
import os
from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), "../../apps/client/public/sprites")
C = 48
# 몸(32칸 기준)을 큰 칸 안으로 옮기는 양: 가로 가운데, 발은 아래 여백 3
OX, OY = 8, 15

def hx(s):
    s = s.lstrip("#")
    return (int(s[0:2], 16), int(s[2:4], 16), int(s[4:6], 16), 255)

BASE = dict(
    skin=hx("#e0a476"), skinD=hx("#b07850"), skinL=hx("#f4c8a0"), hair=hx("#1e1418"), hairL=hx("#3e2a30"),
    horn=hx("#f0e4c8"), hornD=hx("#b8a07a"), eye=hx("#e83a2a"), fang=hx("#ffffff"), scar=hx("#c87a6a"),
    pants=hx("#2a2632"), pantsL=hx("#3e3848"), stripe=hx("#2a1a14"), pelt=hx("#e8902a"), belt=hx("#d8c08a"), beltD=hx("#a88a5a"), band=hx("#f0ece0"),
    club=hx("#3a3446"), clubL=hx("#6a6478"), stud=hx("#f2c14e"), grip=hx("#6a4a32"), shoe=hx("#2a1a14"),
    outline=hx("#1a1018"),
)

DRAW_CLUB = True

class Cell:
    def __init__(self): self.p = {}
    def px(self, x, y, c):
        x, y = int(round(x)) + OX, int(round(y)) + OY
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

def horns(c, k, x, y, view, theme=None):
    """짧고 굵은 뿔 둘 (옆은 하나). 신인족은 위로 길게 휘어 솟은 뿔"""
    pts = ((0, 0, "D"), (0, -1, "L"), (-1, -2, "L"), (-1, -3, "H"))
    if theme and theme.get("god"):
        # 밑동은 두 줄로 굵게, 바깥으로 휘었다가 끝이 위로 솟음 (초승달)
        pts = ((0, 0, "D"), (1, 0, "D"), (0, -1, "L"), (1, -1, "D"), (0, -2, "L"), (1, -2, "L"), (-1, -3, "L"), (0, -3, "L"), (-1, -4, "L"), (-1, -5, "H"), (-1, -6, "H"), (-1, -7, "H"), (0, -8, "H"))
    def one(bx, out):
        for dx, dy, t in pts:
            c.px(bx + dx * out, y + dy, k["hornD"] if t == "D" else k["horn"])
        c.px(bx + out * -1 + (0 if out > 0 else 0), y, k["hornD"])
    if view == "side": one(x + 3, 1)
    else:
        one(x + 1, 1)
        one(x + 8, -1)

def head(c, k, x, y, view, theme):
    """x,y = 머리 왼쪽 위 (10×9). 뒤로 묶은 거친 머리 · 날 선 눈썹 · 붉은 눈 · 왼눈 흉터 · 송곳니 웃음"""
    h, hl = k["hair"], k["hairL"]
    girl = theme.get("girl")
    if view == "back":
        c.rect(x, y, 10, 9, h); c.rect(x - 1, y + 1, 12, 5, h); c.px(x + 3, y + 1, hl); c.px(x + 6, y + 3, hl)
        # 뒤로 묶은 굵은 머리 다발
        c.rect(x + 4, y + 8, 3, 1, k["band"]); c.rect(x + 4, y + 9, 3, 4 if not girl else 7, h); c.px(x + 5, y + 11, hl)
        return
    if view == "front":
        # 갸름한 얼굴: 폭 7, 턱으로 갈수록 좁아짐
        c.rect(x + 2, y + 2, 7, 6, k["skin"]); c.rect(x + 3, y + 8, 5, 1, k["skin"]); c.rect(x + 4, y + 9, 3, 1, k["skinD"])
        c.px(x + 2, y + 7, k["skinD"]); c.px(x + 8, y + 7, k["skinD"])
        # 거칠게 뒤로 넘긴 머리 (뾰족)
        c.rect(x + 1, y, 9, 2, h); c.rect(x + 1, y + 1, 1, 5, h); c.rect(x + 9, y + 1, 1, 5, h)
        for sx in (x, x + 3, x + 5, x + 7, x + 10): c.px(sx, y - 1, h)
        c.px(x + 4, y, hl); c.px(x + 7, y, hl); c.px(x + 5, y + 2, h)
        if girl: c.rect(x, y + 2, 2, 9, h); c.rect(x + 9, y + 2, 2, 9, h)
        # 날 선 눈썹 (안쪽으로 내려감) · 붉은 눈 · 왼눈 흉터
        c.px(x + 2, y + 3, h); c.px(x + 3, y + 4, h); c.px(x + 8, y + 3, h); c.px(x + 7, y + 4, h)
        c.px(x + 3, y + 5, k["eye"]); c.px(x + 4, y + 5, k["outline"]); c.px(x + 6, y + 5, k["outline"]); c.px(x + 7, y + 5, k["eye"])
        c.px(x + 3, y + 4, k["scar"]); c.px(x + 3, y + 6, k["scar"]); c.px(x + 2, y + 6, k["scar"])
        # 송곳니 드러낸 웃음
        c.rect(x + 4, y + 7, 3, 1, k["outline"]); c.px(x + 4, y + 7, k["fang"]); c.px(x + 6, y + 7, k["fang"])
    else:
        c.rect(x + 2, y + 2, 7, 6, k["skin"]); c.rect(x + 4, y + 8, 4, 1, k["skin"]); c.rect(x + 5, y + 9, 2, 1, k["skinD"]); c.px(x + 9, y + 5, k["skin"])
        c.rect(x, y, 9, 2, h); c.rect(x - 1, y + 1, 4, 6, h); c.px(x + 1, y - 1, h); c.px(x + 4, y - 1, h); c.px(x + 7, y - 1, h)
        c.rect(x - 3, y + 3, 2, 1, k["band"]); c.rect(x - 5, y + 3, 2, 5 if not girl else 8, h); c.px(x - 4, y + 5, hl)
        c.px(x + 6, y + 3, h); c.px(x + 7, y + 3, h); c.px(x + 8, y + 4, h)
        c.px(x + 7, y + 5, k["eye"]); c.px(x + 8, y + 5, k["outline"])
        c.rect(x + 6, y + 7, 3, 1, k["outline"]); c.px(x + 8, y + 7, k["fang"])

def arm(c, k, x, y, theme, wide=4):
    """굵은 팔: 어깨 근육 · 팔뚝 · 손목 붕대 · 주먹"""
    sk, skd, skl = k["skin"], k["skinD"], k["skinL"]
    sl = theme.get("sleeve")
    c.rect(x, y, wide, 7, sl or sk)
    if not sl:
        c.rect(x, y, wide, 1, skl); c.px(x + 1, y + 3, skd); c.px(x + 2, y + 3, skd)
    c.rect(x, y + 5, wide, 2, k["band"]); c.px(x + 1, y + 6, k["beltD"])
    c.rect(x, y + 7, wide, 2, sk); c.rect(x, y + 8, wide, 1, skd)

def body(c, k, frame, by, view, theme):
    """몸통·팔·다리. by = 어깨 높이. 웃통 벗은 근육질 (넓은 어깨 · 가슴 · 복근 · 가슴 흉터)"""
    sk, skd, skl = k["skin"], k["skinD"], k["skinL"]
    top = theme.get("top")
    swing = (0, 1, 0, -1)[frame]
    slim = theme.get("god")
    if view in ("front", "back") and slim:
        # 신인족: 날렵한 몸 (좁은 어깨 · 가는 팔) · 검은 겉옷 자락 · 금빛 띠
        c.rect(11, by, 10, 4, sk); c.rect(12, by + 4, 8, 4, sk); c.rect(11, by, 10, 1, skl)
        if view == "front":
            c.px(14, by + 2, skd); c.px(17, by + 2, skd); c.px(15, by + 5, skd); c.px(16, by + 5, skd)
            for yy in range(by + 4, by + 9): c.px(16, yy, k["mark"])
        c.rect(9, by, 3, 9, k["coat"]); c.rect(20, by, 3, 9, k["coat"]); c.px(10, by, k["coatL"]); c.px(21, by, k["coatL"])
        arm(c, k, 7, by + swing, theme, 3)
        arm(c, k, 22, by - swing, theme, 3)
        c.rect(11, by + 8, 10, 1, k["belt"])
        up_l = 1 if frame == 1 else 0
        up_r = 1 if frame == 3 else 0
        ly = by + 9
        for lx, up in ((11, up_l), (17, up_r)):
            c.rect(lx, ly, 4, 6 - up, k["pants"]); c.px(lx + 1, ly, k["pantsL"])
            c.rect(lx, ly + 6 - up, 4, 1, k["shoe"])
        return
    if slim:
        # 신인족 옆모습: 가는 몸 · 뒤로 날리는 겉옷 자락
        c.rect(13, by, 7, 8, sk); c.rect(13, by, 7, 1, skl); c.px(18, by + 3, skd)
        c.rect(10, by, 3, 10, k["coat"]); c.px(9, by + 9, k["coat"]); c.px(11, by, k["coatL"])
        c.rect(13, by + 8, 7, 1, k["belt"])
        stride = (0, 2, 0, -2)[frame]
        ly = by + 9
        for lx in (14 + stride, 14 - stride):
            c.rect(lx, ly, 3, 6, k["pants"]); c.rect(lx, ly + 6, 4, 1, k["shoe"])
        arm(c, k, 15 - stride // 2, by + 1, theme, 3)
        return
    if view in ("front", "back"):
        c.rect(9, by, 14, 4, sk); c.rect(10, by + 4, 12, 4, sk); c.rect(9, by, 14, 1, skl)
        if view == "front" and not top:
            # 가슴 근육 · 복근 · 비스듬한 흉터
            c.rect(10, by + 3, 5, 1, skd); c.rect(17, by + 3, 5, 1, skd); c.px(16, by + 1, skd); c.px(16, by + 2, skd)
            for yy in (by + 5, by + 7):
                c.px(13, yy, skd); c.px(18, yy, skd); c.px(15, yy, skd); c.px(16, yy, skd)
            c.px(15, by + 4, skd); c.px(16, by + 6, skd)
            c.px(12, by + 1, k["scar"]); c.px(13, by + 2, k["scar"]); c.px(14, by + 3, k["scar"])
        elif view == "back" and not top:
            c.px(16, by + 1, skd); c.px(16, by + 3, skd); c.px(16, by + 5, skd); c.rect(11, by + 2, 2, 1, skd); c.rect(19, by + 2, 2, 1, skd)
        if top: c.rect(9, by, 14, 8, top); c.rect(9, by, 14, 1, theme.get("topL", top))
        arm(c, k, 5, by + swing, theme)
        arm(c, k, 23, by - swing, theme)
        # 새끼줄 띠 + 범 가죽 허리 두름
        c.rect(10, by + 8, 12, 1, k["belt"]); c.px(12, by + 8, k["beltD"]); c.px(16, by + 8, k["beltD"]); c.px(20, by + 8, k["beltD"])
        c.rect(10, by + 9, 12, 2, k["pelt"])
        for xx in range(10, 22, 3): c.px(xx, by + 9, k["stripe"]); c.px(xx + 1, by + 10, k["stripe"])
        if view == "front": c.rect(14, by + 11, 4, 2, k["pelt"]); c.px(15, by + 12, k["stripe"])
        up_l = 1 if frame == 1 else 0
        up_r = 1 if frame == 3 else 0
        ly = by + 11
        for lx, up in ((10, up_l), (17, up_r)):
            c.rect(lx, ly, 5, 4 - up, k["pants"]); c.px(lx + 1, ly, k["pantsL"]); c.px(lx + 1, ly + 1, k["pantsL"])
            c.rect(lx, ly + 4 - up, 5, 1, k["band"])
            c.rect(lx, ly + 5 - up, 5, 2, k["shoe"])
    else:
        c.rect(12, by, 9, 8, sk if not top else top); c.rect(12, by, 9, 1, skl if not top else theme.get("topL", top))
        if not top: c.px(18, by + 3, skd); c.px(18, by + 5, skd); c.px(19, by + 2, skd)
        c.rect(12, by + 8, 9, 1, k["belt"]); c.rect(12, by + 9, 9, 2, k["pelt"]); c.px(14, by + 9, k["stripe"]); c.px(17, by + 10, k["stripe"])
        stride = (0, 2, 0, -2)[frame]
        ly = by + 11
        for lx in (14 + stride, 14 - stride):
            c.rect(lx, ly, 4, 4, k["pants"]); c.rect(lx, ly + 4, 4, 1, k["band"]); c.rect(lx, ly + 5, 5, 2, k["shoe"])
        arm(c, k, 15 - stride // 2, by + 1, theme, 3)

# 방망이 모양 (oni_clubs.py가 무기마다 바꿈): 색 · 굵기 · 꾸밈 (spikes 가시 · crystal 얼음 결정 · flame 끝 불꽃 · coins 큰 금화 징
# · prongs 세 갈래 뱀 머리 · pillar 곧은 기둥과 머리장식 · ribbon 감긴 바람 띠 · wave 물결 마루 · cracks 갈라진 번개 금)
STYLE = dict(grip=hx("#6a4a32"), band=hx("#f2c14e"), body=hx("#3a3446"), bodyL=hx("#6a6478"), stud=hx("#f2c14e"), glow=hx("#fff27a"), base=1.0, top=3.0, deco=())

def club(c, k, x0, y0, dx, dy, n=9):
    """방망이: 손잡이 (x0, y0)에서 (dx, dy) 쪽으로 n칸. 감은 손잡이 · 띠 · 끝으로 갈수록 굵어지는 몸 · 징 · 끝 마개 + STYLE 꾸밈"""
    if not DRAW_CLUB: return
    S = STYLE
    deco = S["deco"]
    ln = (dx * dx + dy * dy) ** 0.5
    ux, uy = dx / ln, dy / ln
    nx, ny = -uy, ux
    at = lambda i, a: (x0 + ux * i + nx * a, y0 + uy * i + ny * a)
    pillar = "pillar" in deco
    def half(i):
        t = (i - 7) / max(1, n - 7)
        return S["top"] if pillar else S["base"] + t * (S["top"] - S["base"])
    for i in range(-2, n + 1):
        if i < 5:
            c.px(*at(i, 0), S["grip"] if i % 2 else S["band"]); c.px(*at(i, 1), S["grip"])
            continue
        if i in (5, 6):
            for a in range(-2, 3): c.px(*at(i, a), S["band"])
            continue
        h = half(i)
        for a10 in range(int(-h * 10), int(h * 10) + 1, 5):
            a = a10 / 10
            c.px(*at(i, a), S["bodyL"] if a < -h + 0.8 else S["body"])
        if "ribbon" in deco and i % 4 in (0, 1):
            a = -h + ((i // 2) % 3) * h
            c.px(*at(i, a), S["glow"])
        if "cracks" in deco and i >= 8:
            a = ((i * 7) % 5 - 2) * h / 2.5
            c.px(*at(i, a), S["glow"])
        if pillar and i % 6 == 0:
            for a in range(-int(h) - 1, int(h) + 2): c.px(*at(i, a), S["stud"])
        elif "coins" in deco and i >= 9 and i % 3 == 0:
            for a in (h + 1, -h - 1): c.px(*at(i, a), S["stud"]); c.px(*at(i + 1, a), S["glow"])
        elif not pillar and "crystal" not in deco and i >= 9 and i % 3 == 0:
            c.px(*at(i, h + 1), S["stud"]); c.px(*at(i, -h - 1), S["stud"])
        if "spikes" in deco and i >= n - 9 and i % 3 == 1:
            for sgn in (1, -1): c.px(*at(i, sgn * (h + 1)), S["stud"]); c.px(*at(i + 1, sgn * (h + 2)), S["glow"])
        if "crystal" in deco and i >= 10 and i % 4 == 2:
            sgn = 1 if (i // 4) % 2 else -1
            for d in range(3): c.px(*at(i + d, sgn * (h + 1 + d)), S["stud"] if d < 2 else S["glow"])
        if "wave" in deco and i >= 9 and i % 2 == 0:
            c.px(*at(i, -h + 1), S["glow"])
    tip = n + 1
    h = half(n)
    if pillar:
        for a in range(-int(h) - 2, int(h) + 3): c.px(*at(tip, a), S["stud"]); c.px(*at(tip + 1, a), S["glow"])
    elif "prongs" in deco:
        # 세 갈래 뱀 머리: 가운데는 곧게, 양옆은 벌어짐 · 끝에 빛나는 눈
        for sgn in (-1, 0, 1):
            for d in range(4): c.px(*at(tip + d, sgn * (1 + d * 0.8) if sgn else 0), S["body"])
            c.px(*at(tip + 4, sgn * 4.2 if sgn else 0), S["glow"])
    elif "flame" in deco:
        for a in range(-2, 3): c.px(*at(tip, a), S["stud"])
        for d in range(1, 6):
            w = max(0, 2 - d // 2)
            for a in range(-w, w + 1): c.px(*at(tip + d, a + (1 if d % 2 else 0) * (d > 2)), S["glow"] if d > 2 or a == 0 else S["stud"])
    elif "wave" in deco:
        for a in range(-3, 3): c.px(*at(tip, a), S["bodyL"])
        for d, a in ((1, -3), (2, -3), (2, -2), (3, -1), (2, 0), (1, 1)): c.px(*at(tip + d, a), S["glow"])
    else:
        for a in range(-2, 3): c.px(*at(tip, a), S["bodyL"])
        if "spikes" in deco or "cracks" in deco:
            c.px(*at(tip + 1, 0), S["stud"]); c.px(*at(tip + 2, 0), S["glow"])
    if "crystal" in deco:
        for d, a in ((1, 0), (2, 0), (3, 0), (1, -1), (1, 1), (2, 1)): c.px(*at(tip + d, a), S["glow"] if d == 3 else S["stud"])

def hat(c, theme, x, y, view):
    t = theme.get("hat")
    if not t: return
    a, b = theme["hatC"], theme["hatL"]
    if t == "santa":
        c.rect(x - 1, y + 1, 12, 2, b); c.rect(x, y - 2, 10, 3, a); c.rect(x + 5, y - 4, 4, 2, a); c.rect(x + 8, y - 5, 2, 2, b)
    elif t == "witch":
        c.rect(x - 3, y + 1, 16, 2, a); c.rect(x + 1, y - 2, 8, 3, a); c.rect(x + 3, y - 5, 4, 3, a); c.rect(x + 5, y - 7, 2, 2, a); c.rect(x + 1, y, 8, 1, b)
    elif t == "cap":
        c.rect(x, y - 1, 10, 3, a); c.rect(x + (2 if view != "side" else 6), y + 2, 7, 1, b)
    elif t == "gat":
        # 갓: 넓은 챙 + 높은 둥근 모자 (설날)
        c.rect(x - 3, y + 1, 16, 1, a); c.rect(x + 2, y - 3, 6, 4, a); c.rect(x + 3, y - 3, 4, 1, b)
    elif t == "headband":
        c.rect(x, y + 2, 10, 1, a); c.px(x + 5 if view == "front" else x - 1, y + 2, b)
    elif t == "goggles":
        c.rect(x, y + 1, 10, 1, b); c.rect(x + 1, y, 3, 2, a); c.rect(x + 6, y, 3, 2, a)
    elif t == "crown":
        c.rect(x + 1, y - 1, 8, 2, a); c.px(x + 1, y - 2, a); c.px(x + 4, y - 3, a); c.px(x + 5, y - 3, a); c.px(x + 8, y - 2, a); c.px(x + 4, y, b)
    elif t == "cowboy":
        c.rect(x - 3, y + 1, 16, 2, a); c.rect(x + 1, y - 3, 8, 4, a); c.rect(x + 1, y - 1, 8, 1, b)
    elif t == "tiger":
        # 사나운 백호 가죽: 귀 · 노려보는 눈 · 줄무늬 · 송곳니
        c.rect(x - 1, y - 2, 12, 4, a)
        for ex in (x - 1, x + 8): c.rect(ex, y - 4, 3, 2, a); c.px(ex + 1, y - 3, b)
        if view == "front":
            for ex in (x + 1, x + 6): c.rect(ex, y, 3, 1, theme["eye"]); c.px(ex + (2 if ex == x + 1 else 0), y, b)
            c.rect(x + 4, y - 2, 2, 2, b)
            c.px(x + 2, y + 2, hx("#ffffff")); c.px(x + 7, y + 2, hx("#ffffff"))
        else:
            for sx in (x + 1, x + 4, x + 7): c.rect(sx, y - 2, 1, 2, b)

def frame(k, theme, row, col, layer="body"):
    """layer: body = 몸만 (캐릭터 시트) · behind = 몸 뒤에 그릴 방망이 · front = 몸 앞에 그릴 방망이 (무기별 방망이 시트, oni_clubs.py)"""
    c = Cell()
    on = layer == "body"
    def cl(tag, *a):
        if layer == tag: club(c, k, *a)
    bob = 1 if col in (1, 3) else 0
    if row == 0 or (row == 3 and col < 3):
        cast = row == 3
        b = 0 if cast else bob
        by = 14 + b
        if not cast: cl("behind", 27, by + 8, 0.25, -1, 26)  # 방망이를 세워 듦 (어깨 위로 크게)
        if on:
            body(c, k, 0 if cast else col, by, "front", theme)
            head(c, k, 11, 5 + b, "front", theme)
            hat(c, theme, 11, 4 + b, "front")
            horns(c, k, 11, 4 + b, "front", theme)
        if cast: cl("front", 26, by + 5, 1, -0.55, 18)
    elif row == 1:
        by = 14 + bob
        if on:
            body(c, k, col, by, "back", theme)
            head(c, k, 11, 5 + bob, "back", theme)
            hat(c, theme, 11, 4 + bob, "back")
            horns(c, k, 11, 4 + bob, "back", theme)
        cl("front", 4, by + 8, -0.25, -1, 26)
    else:
        cast = row == 3
        b = 0 if cast else bob
        by = 14 + b
        if on:
            body(c, k, 0 if cast else col, by, "side", theme)
            head(c, k, 12, 5 + b, "side", theme)
            hat(c, theme, 12, 4 + b, "side")
            horns(c, k, 12, 4 + b, "side", theme)
        if cast: cl("front", 18, by + 4, 1, -0.15, 20)
        else: cl("front", 19, by + 6, 0.5, -1, 24)
    if on and theme.get("tail") and row in (1, 2):
        tc, tl = theme["hatC"], theme["hatL"]
        if row == 2: c.rect(9, by + 9, 3, 2, tc); c.px(8, by + 8, tc); c.px(10, by + 9, tl)
        else: c.rect(15, by + 11, 2, 3, tc); c.px(15, by + 12, tl)
    c.outline(theme.get("outline", k["outline"]))
    return c

def sheet(k, theme, layer="body"):
    img = Image.new("RGBA", (C * 4, C * 4), (0, 0, 0, 0))
    for row in range(4):
        for col in range(4): frame(k, theme, row, col, layer).blit(img, col * C, row * C)
    return img

def pal(**over):
    k = dict(BASE); k.update({key: hx(v) for key, v in over.items()}); return k

THEMES = {
    # 귀여운 여름: 하늘색 반바지 + 튜브 같은 노란 띠 + 물안경
    "swim": (pal(pants="#3ac8e8", pantsL="#8ae8ff", pelt="#ffd040", stripe="#ff8a3a", belt="#ffd040", beltD="#ff8a3a", shoe="#f2d070", band="#ffffff"), {"hat": "goggles", "hatC": hx("#8ae8ff"), "hatL": hx("#2a6a8a")}),
    "xmas": (pal(pants="#c82a36", pantsL="#e84a4a", pelt="#f4f4f4", stripe="#c82a36", belt="#2a6a3a", beltD="#f2c14e", band="#f4f4f4"), {"hat": "santa", "hatC": hx("#d8303a"), "hatL": hx("#ffffff"), "top": hx("#c82a36"), "topL": hx("#ffffff")}),
    "halloween": (pal(pants="#2a2032", pelt="#f28a2a", stripe="#2a1a14", eye="#7aff6a", band="#5a2a8a"), {"hat": "witch", "hatC": hx("#2a2032"), "hatL": hx("#f28a2a")}),
    "school": (pal(pants="#2a3458", stripe="#2a3458", belt="#1a1a1a", beltD="#f2c040", band="#2a3458"), {"hat": "cap", "hatC": hx("#2a3458"), "hatL": hx("#f2c040"), "top": hx("#f4f4f4"), "topL": hx("#ffffff"), "sleeve": hx("#f4f4f4")}),
    "newyear": (pal(pants="#3a5ad8", stripe="#e84a6a", belt="#f2c040", band="#e84a6a"), {"hat": "gat", "hatC": hx("#1a1a1a"), "hatL": hx("#3a3a3a"), "top": hx("#f4ecd8"), "topL": hx("#e84a6a"), "sleeve": hx("#e84a6a")}),
    "japan": (pal(pants="#2a3a6a", stripe="#e8e8f0", belt="#e83a3a"), {"hat": "headband", "hatC": hx("#f4f4f4"), "hatL": hx("#e83a3a"), "top": hx("#2a3a6a"), "topL": hx("#e8e8f0")}),
    "china": (pal(pants="#2a2028", stripe="#e8b030", belt="#e8b030", band="#e8b030"), {"hat": "crown", "hatC": hx("#e8b030"), "hatL": hx("#d8303a"), "top": hx("#c8202a"), "topL": hx("#e8b030")}),
    "usa": (pal(pants="#3a5aa8", stripe="#f4f4f4", belt="#8a5a32", shoe="#6a4a2a"), {"hat": "cowboy", "hatC": hx("#8a5a32"), "hatL": hx("#5a3a20"), "top": hx("#d8303a"), "topL": hx("#f4f4f4")}),
    # 여자 도깨비: 푸른 피부 · 긴 머리
    "swap": (pal(hair="#f4f4f8", hairL="#c8c8d8", pants="#2a2632", pelt="#e84a8a", stripe="#2a1a2a"), {"girl": True, "top": hx("#2a2632"), "topL": hx("#e84a8a")}),
    # 한정 스킨: 오니는 백호 대신 적호 (붉은 범 가죽 · 금빛 눈 · 짙은 줄무늬, 웃통은 그대로 벗음)
    "tiger": (pal(pants="#1e1b26", pelt="#d8361e", stripe="#141414", belt="#f2c040", band="#f2c040"), {"hat": "tiger", "hatC": hx("#d8361e"), "hatL": hx("#141414"), "eye": hx("#ffd040"), "tail": True, "outline": hx("#6a1408")}),
}

def main():
    sheet(BASE, {}).save(os.path.join(OUT, "oni.png"), optimize=True)
    # 신인족: 창백한 사람 피부 · 붉은 무늬 · 긴 흰 머리 · 금빛 눈 · 긴 뿔 · 날렵한 검은 겉옷
    god = pal(skin="#f2dccc", skinD="#c8a898", skinL="#fff0e4", hair="#f4f0f8", hairL="#c8c0d8", horn="#ffe8a0", hornD="#d89a3a", eye="#ffd040",
              scar="#d8283a", pants="#14121a", pantsL="#2a2632", belt="#f2c040", beltD="#a8781a", band="#f2c040", shoe="#14121a")
    god.update(mark=hx("#d8283a"), coat=hx("#14121a"), coatL=hx("#f2c040"))
    sheet(god, {"god": True, "girl": True, "outline": hx("#2a0a14")}).save(os.path.join(OUT, "skins", "oni_god.png"), optimize=True)
    for t, (k, theme) in THEMES.items():
        sheet(k, theme).save(os.path.join(OUT, "skins", f"oni_{t}.png"), optimize=True)
    print("oni ok")

if __name__ == "__main__":
    main()
