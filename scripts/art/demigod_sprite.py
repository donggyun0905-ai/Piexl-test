# 시즌 2 라스트 보스 괴력난신 몬스터 그림: 오니 신족화와 같은 종족의 남성 반신 (흰 머리 · 금빛 뿔 · 날렵하고 큰 몸 · 맨주먹에 감은 붕대 · 붉은 문양)
# 규격(docs/ART.md): enemies/demigod.png, 64칸 4장 가로 (0·1 걷기 · 2 주먹 지르기 · 3 두 손 들어 기 모으기), 오른쪽을 봄
import os
from PIL import Image
from s2_common import Cell, hx

OUT = os.path.join(os.path.dirname(__file__), "../../apps/client/public/sprites/enemies")
S = 64
EDGE = hx("#1a0a10")
SKIN, SKIN_S, SKIN_D, SKIN_L = hx("#f0d8c0"), hx("#d2b092"), hx("#a8846a"), hx("#fff0e0")
HAIR, HAIR_S, HAIR_D = hx("#f6f4fa"), hx("#c8c4d8"), hx("#8a86a0")
GOLD, GOLD_L, GOLD_D = hx("#e8c040"), hx("#fff0a0"), hx("#a07818")
RED, RED_D = hx("#d0202c"), hx("#8a1018")
PANT, PANT_S, PANT_L = hx("#24202c"), hx("#14121a"), hx("#3e3848")
WRAP, WRAP_S = hx("#ece6dc"), hx("#b8b0a4")

def poly(c, pts, col):
    ys = [p[1] for p in pts]
    for y in range(int(min(ys)), int(max(ys)) + 1):
        xs = []
        for i in range(len(pts)):
            (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % len(pts)]
            if (y0 <= y + 0.5 < y1) or (y1 <= y + 0.5 < y0): xs.append(x0 + (y + 0.5 - y0) * (x1 - x0) / (y1 - y0))
        xs.sort()
        for a, b in zip(xs[::2], xs[1::2]):
            for x in range(int(round(a)), int(round(b)) + 1): c.px(x, y, col)

def thick(c, x0, y0, x1, y1, w, col):
    n = int(max(abs(x1 - x0), abs(y1 - y0), 1))
    for i in range(n + 1):
        t = i / n
        c.oval(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, w, w, col)

def limb(c, x0, y0, x1, y1, w):
    """팔 한 마디: 살색 + 아래쪽 그늘 + 위쪽 빛 + 가운데 근육 갈라짐"""
    thick(c, x0, y0, x1, y1, w, SKIN)
    thick(c, x0 + 0.8, y0 + 0.9, x1 + 0.8, y1 + 0.9, w * 0.5, SKIN_S)
    thick(c, x0 - 0.7, y0 - 0.7, x1 - 0.7, y1 - 0.7, w * 0.28, SKIN_L)
    c.line((x0 * 2 + x1) / 3, (y0 * 2 + y1) / 3 + 1, (x0 + x1 * 2) / 3, (y0 + y1 * 2) / 3 + 1, SKIN_D)

def wraps(c, x0, y0, x1, y1):
    """팔뚝 붕대: 흰 천에 붉은 끈"""
    thick(c, x0, y0, x1, y1, 2.8, WRAP)
    n = int(max(abs(x1 - x0), abs(y1 - y0)))
    for i in range(0, n + 1, 2):
        t = i / max(1, n)
        c.px(x0 + (x1 - x0) * t + 1, y0 + (y1 - y0) * t + 1, WRAP_S)
    c.px((x0 + x1) / 2, (y0 + y1) / 2, RED)

def fist(c, x, y, big=1.0):
    """붕대 감은 큰 주먹: 손가락 마디 넷 · 붉은 끈"""
    c.oval(x, y, 4 * big, 3.6 * big, WRAP)
    c.oval(x + 1, y + 1.2, 2.6 * big, 2 * big, WRAP_S)
    for k in range(4):
        c.px(x - 2.4 * big + k * 1.6 * big, y - 2.4 * big, SKIN)
        c.px(x - 2.4 * big + k * 1.6 * big, y - 1.6 * big, SKIN_S)
    c.line(x - 3.5 * big, y + 1, x + 3.5 * big, y, RED)

def legs(c, f):
    # 넓게 벌린 하카마 바지 (걸음마다 앞뒤)
    s = 2 if f == 1 else 0
    poly(c, [(24, 42), (40, 42), (44, 60), (35, 61), (32, 50), (29, 61), (19 - s, 60)], PANT)
    poly(c, [(32, 46), (35, 61), (44, 60), (41, 47)], PANT_L)
    for x0, x1 in ((26, 22 - s), (30, 30), (37, 40), (41, 43)):
        c.line(x0, 44, x1, 59, PANT_S)
    # 발목 붕대 · 맨발
    for fx in (22 - s, 40):
        c.rect(fx - 2, 59, 6, 2, WRAP)
        c.rect(fx - 2, 61, 7, 2, SKIN_S)
        c.px(fx + 4, 61, SKIN_D)

def torso(c):
    # 넓은 어깨 → 좁은 허리 (역삼각형), 가슴·복근 · 붉은 문양
    poly(c, [(21, 22), (45, 22), (42, 34), (39, 42), (25, 42), (23, 34)], SKIN)
    poly(c, [(36, 22), (45, 22), (42, 34), (39, 42), (35, 42)], SKIN_S)
    c.line(32, 24, 32, 40, SKIN_D)
    for y in (29, 33, 37): c.line(28, y, 36, y, SKIN_S)
    c.line(24, 27, 31, 28, SKIN_D); c.line(33, 28, 41, 27, SKIN_D)
    c.line(23, 23, 29, 23, SKIN_L); c.line(23, 24, 25, 30, SKIN_L)
    # 문양: 왼가슴에서 배로 내려오는 붉은 줄 둘
    c.line(25, 25, 29, 31, RED); c.line(29, 31, 28, 36, RED)
    c.line(39, 25, 36, 30, RED); c.px(36, 31, RED_D)
    # 허리띠: 붉은 끈 + 금 매듭
    c.rect(24, 40, 17, 3, RED)
    c.rect(24, 42, 17, 1, RED_D)
    c.oval(33, 41, 2, 2, GOLD); c.px(32, 40, GOLD_L)
    c.line(34, 43, 31, 50, RED); c.line(35, 43, 36, 49, RED_D)

def head(c, f):
    # 뒤로 길게 흩날리는 흰 머리 (등 뒤 왼쪽, 결마다 그늘)
    sway = 1 if f == 1 else 0
    poly(c, [(28, 4), (38, 5), (37, 12), (31, 20), (25, 36 + sway), (17, 31), (20, 25 - sway), (12, 27), (18, 18), (16, 12), (22, 8)], HAIR)
    for i, (x0, y0, x1, y1) in enumerate(((26, 8, 14, 26), (28, 11, 18, 31), (30, 14, 22, 35), (27, 6, 17, 15), (32, 17, 26, 36))):
        c.line(x0, y0, x1, y1 + sway, (HAIR_S, HAIR_D, HAIR_S, HAIR_D, HAIR_S)[i])
    c.line(13, 27, 16, 25, HAIR_D); c.line(18, 31, 20, 29, HAIR_D)
    # 얼굴 (오른쪽을 봄): 각진 턱 · 머리와 얼굴 사이 그늘
    poly(c, [(31, 7), (40, 8), (42, 13), (41, 18), (38, 21), (33, 21), (31, 16)], SKIN)
    poly(c, [(38, 14), (42, 13), (41, 18), (38, 21), (36, 19)], SKIN_S)
    c.line(31, 8, 31, 19, SKIN_D)
    c.line(32, 20, 37, 21, SKIN_D)
    c.px(33, 10, SKIN_L); c.px(34, 10, SKIN_L); c.px(33, 11, SKIN_L)
    # 앞머리 (이마를 덮는 흰 머리)
    poly(c, [(29, 4), (40, 5), (42, 9), (38, 8), (36, 10), (34, 8), (31, 11), (29, 9)], HAIR)
    c.line(31, 6, 39, 6, HAIR_S)
    # 날카로운 눈썹 · 붉은 눈 · 입
    c.line(35, 11, 40, 10, EDGE)
    c.rect(37, 12, 3, 2, hx("#ffffff"))
    c.px(38, 12, RED); c.px(38, 13, RED); c.px(39, 12, RED_D)
    c.line(36, 18, 39, 18, SKIN_D)
    c.px(42, 14, SKIN_S); c.px(43, 15, SKIN_D)
    # 붉은 문양: 눈 밑에서 뺨으로 두 줄
    c.line(36, 15, 39, 17, RED); c.line(35, 16, 37, 18, RED)
    # 금빛 뿔 둘 (위로 휘며 뒤로, 뿌리는 굵게)
    for bx, h in ((32, 0), (38, 1)):
        thick(c, bx, 7, bx - 0.5, 3 - h, 1.5, GOLD)
        thick(c, bx - 0.5, 3 - h, bx - 2.5, -1 - h, 1.0, GOLD)
        c.line(bx + 0.8, 6, bx + 0.2, 1 - h, GOLD_L)
        c.px(bx - 1, 6, GOLD_D); c.px(bx - 3, -1 - h, GOLD_D)

def body(f):
    c = Cell(S)
    legs(c, 0 if f in (0, 2, 3) else 1)
    # 뒤쪽 팔 (왼팔)
    if f == 3:
        limb(c, 23, 24, 17, 15, 3.4); wraps(c, 17, 14, 20, 8); fist(c, 21, 5, 1.15)
    else:
        sw = -2 if f == 1 else 1
        limb(c, 23, 24, 19 + sw, 33, 3.4); limb(c, 19 + sw, 33, 20 + sw, 41, 3.0)
        wraps(c, 19.5 + sw, 36, 20 + sw, 40); fist(c, 20 + sw, 43)
    torso(c)
    # 앞쪽 팔 (오른팔)
    if f == 2:
        # 주먹 지르기: 어깨에서 앞으로 쭉
        limb(c, 42, 24, 50, 27, 3.6); limb(c, 50, 27, 57, 27, 3.2)
        wraps(c, 52, 27, 56, 27); fist(c, 60, 27, 1.25)
        for i in range(3): c.line(44 - i * 4, 18 + i * 2, 48 - i * 4, 18 + i * 2, WRAP_S)
    elif f == 3:
        limb(c, 43, 24, 49, 15, 3.4); wraps(c, 49, 14, 46, 8); fist(c, 45, 5, 1.15)
    else:
        sw = 2 if f == 1 else -1
        limb(c, 43, 24, 46 + sw, 33, 3.6); limb(c, 46 + sw, 33, 46 + sw, 40, 3.2)
        wraps(c, 46 + sw, 36, 46 + sw, 40); fist(c, 46 + sw, 43, 1.15)
    c.line(44, 27, 46, 32, RED)
    head(c, f)
    c.outline(EDGE)
    return c

img = Image.new("RGBA", (S * 4, S), (0, 0, 0, 0))
for k in range(4):
    for (x, y), col in body(k).p.items(): img.putpixel((k * S + x, y), col)
img.save(os.path.join(OUT, "demigod.png"), optimize=True)
print("demigod ok")
