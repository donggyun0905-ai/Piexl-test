# 고해상도 캐릭터 몸 틀 (손으로 찍은 픽셀 표): 64칸 · 머리가 큰 2등신 · 얼굴형·눈·귀·목·손·다리·구두는 표로 정해 모든 캐릭터가 같이 씀
# 캐릭터마다 머리(앞머리 끝 표·옆머리·뒷머리)·옷·무기만 덧칠하고 색만 바꿈 (예: hd_mage.py)
# 표 글자: . 빈칸 · S 피부 · s 피부 그늘 · r 짙은 그늘 · k 속눈썹 · I 눈동자 짙음 · i 눈동자 · j 눈동자 밝음 · w 빛 · b 홍조 · m 입
from s2_common import Cell, hx  # noqa: F401

S = 64
CX = 32  # 얼굴 가운데 (31과 32 사이)

# 얼굴 (앞): 위에서부터 줄마다 반폭 (가운데 CX 기준 [CX-h, CX+h-1]) · 넓은 볼, 짧고 둥근 턱
FACE_HALF = [9, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 10, 10, 10, 9, 8, 7, 5, 3]
FACE_TOP = 13

# 오른눈 (바깥이 오른쪽) 8×8 · 왼눈은 좌우를 뒤집어 씀
EYE = [
    "......kk",
    "..kkkkk.",
    ".kIIIIIk",
    ".IwwIiIi",
    ".Iwwiiii",
    ".iiiiiji",
    ".iijjjji",
    "..jjjjj.",
    "..ssss..",
]
EYE_Y = 18
EYE_X = (23, 33)  # 왼눈·오른눈 왼쪽 끝


def face_colors(k):
    sk = k["skin"]
    return {
        "S": sk, "s": k.get("skinS", hx("#f2c8b4")), "r": k.get("skinR", hx("#dca090")),
        "k": k.get("lash", hx("#2a1e3c")), "I": k.get("irisD", hx("#4a3aa8")), "i": k["iris"], "j": k.get("irisL", hx("#bcb0ff")),
        "w": hx("#ffffff"), "b": k.get("blush", hx("#f6a0a8")), "m": k.get("mouth", hx("#d77a72")),
    }


def stamp(c, x, y, rows, pal, flip=False):
    for j, row in enumerate(rows):
        r = row[::-1] if flip else row
        for i, ch in enumerate(r):
            if ch != "." and ch in pal: c.px(x + i, y + j, pal[ch])


def face(c, k, dy=0):
    """앞 얼굴: 피부 · 오른쪽·턱 아래 그늘 · 귀 · 눈 · 홍조 · 코 · 입"""
    p = face_colors(k)
    for j, h in enumerate(FACE_HALF):
        y = FACE_TOP + j + dy
        for x in range(CX - h, CX + h):
            edge = x >= CX + h - 2 or j >= len(FACE_HALF) - 2
            c.px(x, y, p["s"] if edge else p["S"])
    for sx in (CX - 12, CX + 11):
        for j in range(6, 10): c.px(sx, FACE_TOP + j + dy, p["s"] if j < 9 else p["r"])
    stamp(c, EYE_X[0], EYE_Y + dy, EYE, p, flip=True)
    stamp(c, EYE_X[1], EYE_Y + dy, EYE, p)
    # 홍조: 눈 아래 볼에 옅은 분홍 덩어리 (줄여도 남게 2줄)
    soft = tuple(round(p["S"][i] * 0.5 + p["b"][i] * 0.5) for i in range(3)) + (255,)
    for ex in (EYE_X[0], EYE_X[1] + 4):
        for i in range(4):
            c.px(ex + i, EYE_Y + 10 + dy, soft); c.px(ex + i, EYE_Y + 11 + dy, soft if 0 < i < 3 else p["S"])
    c.px(CX, EYE_Y + 9 + dy, p["s"])
    c.px(CX - 1, EYE_Y + 12 + dy, p["m"]); c.px(CX, EYE_Y + 12 + dy, p["m"])


def hair_cap(c, k, top, dy=0):
    """머리 덮개 (앞): 둥글고 볼륨 있는 머리통 · 정수리에서 양옆으로 갈라지는 결 묶음 · 왼쪽 위 윤기 · 바깥쪽 그늘"""
    l, b, d = k["hairL"], k["hair"], k["hairD"]
    half = [5, 8, 10, 12, 13, 14, 14, 15, 15, 16, 16, 16]
    for j, h in enumerate(half):
        y = top + j + dy
        for x in range(CX - h, CX + h):
            u = x - CX + 0.5
            clump = j > 2 and int(abs(u) + j * 0.6) % 5 == 0
            c.px(x, y, d if x >= CX + h - 3 or x < CX - h + 1 or clump else b)
    # 윤기: 왼쪽 위에 휘는 밝은 띠 (빛이 왼쪽 위에서)
    for x in range(CX - 10, CX + 3):
        yy = top + 3 + dy + abs(x - CX + 4) // 3
        c.px(x, yy, l); c.px(x + 1, yy + 1, l if abs(x - CX + 4) < 4 else b)


def bangs(c, k, tips, top, dy=0):
    """앞머리: tips = [(시작 x, 너비, 끝 y)] 결마다 끝이 뾰족 · 결 오른쪽 가장자리는 그늘"""
    b, d = k["hair"], k["hairD"]
    for x0, w, end in tips:
        for i in range(w):
            x = x0 + i
            stop = end - (0 if i == w // 2 else 1 if w > 2 else 0) + dy
            for y in range(top + dy, stop + 1):
                c.px(x, y, d if i == w - 1 and y > top + dy + 1 else b)


def legs(c, k, step, dy=0, view="front"):
    """다리·구두: 걷기 칸마다 한쪽이 들림"""
    lift = (0, 2, 0, -2)[step]
    L, Ld = k["legs"], k.get("legsD", hx("#1a1630"))
    for i, lx in enumerate((27, 33)):
        up = max(0, lift) if i == 0 else max(0, -lift)
        for y in range(54 + dy, 58 - up):
            for x in range(lx, lx + 4): c.px(x, y, Ld if x == lx + 3 else L)
        for x in range(lx - (1 if i == 0 else 0), lx + 4 + (1 if i else 0)):
            for y in range(58 - up, 61 - up): c.px(x, y, k["shoe"] if y > 58 - up else k.get("shoeL", hx("#3a4290")))


def face_side(c, k, dy=0, x0=CX - 3):
    """옆얼굴 (오른쪽을 봄): 이마에서 코끝·입·둥근 턱으로 · 귀 · 눈 한쪽(좁게) · 홍조"""
    p = face_colors(k)
    # 줄마다 (왼쪽 끝, 오른쪽 끝) · 오른쪽 윤곽: 이마 → 코(살짝 튀어나옴) → 입 → 턱
    right = [8, 9, 9, 10, 10, 10, 10, 10, 11, 11, 10, 10, 10, 9, 9, 8, 6, 4, 2]
    for j, r in enumerate(right):
        y = FACE_TOP + j + dy
        left = 0 if j < 15 else j - 14
        for x in range(x0 + left, x0 + r + 1):
            c.px(x, y, p["s"] if x <= x0 + left + 1 or j >= len(right) - 2 else p["S"])
    for j in range(6, 10): c.px(x0 + 1, FACE_TOP + j + dy, p["s"] if j < 9 else p["r"])
    stamp(c, x0 + 5, EYE_Y + dy, [row[2:] for row in EYE], p)
    soft = tuple(round(p["S"][i] * 0.55 + p["b"][i] * 0.45) for i in range(3)) + (255,)
    for i in range(3): c.px(x0 + 6 + i, EYE_Y + 10 + dy, soft)
    c.px(x0 + 9, EYE_Y + 12 + dy, p["m"])
