# 하이오크 큰 도트 (python3 scripts/art/highorc_sprite.py) — 사용자가 보여 준 느낌을 보고 한 칸씩 찍은 그림
# 붉은 피부 · 검은 상투와 뒤로 날리는 꽁지머리 · 뼈 가시 박힌 어깨 갑옷과 털 · 엄니 · 뼈 목걸이 · 해골 허리띠 · 털 장화 · 큰 양날 도끼 (원본 그림은 저장소에 넣지 않음)
# 1배 48칸(오른쪽을 봄) → hd_monsters_2x와 같은 2배 다듬기 → sprites/enemies/highorc.png (게임 크기 48, game/enemySprites ENEMY_SRC 2)
# 칸 차례: 걷기 1 · 걷기 2 · 도끼를 머리 뒤로 치켜듦(휘두르기 예고)
import os

from PIL import Image

from s2_common import Cell, hx
from hd_monsters_2x import OUT, SRC, bevel, scale2x

S = 48
SKIN, SKIN_D, SKIN_L = hx("#c8382a"), hx("#8a2018"), hx("#e86048")
HAIR, HAIR_L = hx("#1a1214"), hx("#3a2a2c")
METAL, METAL_D, METAL_L = hx("#5a4a46"), hx("#3a2e2c"), hx("#8a7468")
BONE, BONE_D = hx("#ece2c8"), hx("#b8a88a")
FUR, FUR_D = hx("#e8d8bc"), hx("#b8a488")
PANTS, PANTS_D = hx("#3a2a30"), hx("#241a1e")
BOOT, BOOT_D = hx("#5a3a24"), hx("#3a2414")
LEATHER = hx("#6a4424")
HAFT, HAFT_D = hx("#7a4a24"), hx("#4a2a14")
BLADE, BLADE_D, BLADE_L = hx("#c0c4d0"), hx("#7a7e8c"), hx("#f0f4ff")
GOLD, EYE, RUNE, MOUTH = hx("#e8b030"), hx("#ffe040"), hx("#c82020"), hx("#3a0a0a")
INK = hx("#140a0a")


def poly(c, pts, col):
    """볼록·오목 다각형 채우기 (짝수-홀수 규칙)"""
    ys = [p[1] for p in pts]
    for y in range(int(min(ys)), int(max(ys)) + 1):
        xs = []
        for i in range(len(pts)):
            (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % len(pts)]
            if (y0 <= y + 0.5 < y1) or (y1 <= y + 0.5 < y0):
                xs.append(x0 + (y + 0.5 - y0) * (x1 - x0) / (y1 - y0))
        xs.sort()
        for a, b in zip(xs[::2], xs[1::2]):
            for x in range(int(round(a)), int(round(b)) + 1):
                c.px(x, y, col)


def thick(c, x0, y0, x1, y1, col, w=2):
    for k in range(w):
        c.line(x0, y0 + k, x1, y1 + k, col)


def legs(c, f):
    # 걸음: 두 다리가 엇갈림 (f 0/1) · 치켜들 때는 넓게 버팀 (f 2)
    xs = [(13, 24), (17, 21), (11, 26)][f]
    for i, x in enumerate(xs):
        lift = 1 if (f < 2 and i == f) else 0
        c.rect(x, 33, 7, 8 - lift, PANTS)
        c.rect(x, 33, 2, 8 - lift, PANTS_D)
        c.rect(x - 1, 39 - lift, 9, 2, FUR)
        c.px(x, 40 - lift, FUR_D); c.px(x + 4, 40 - lift, FUR_D)
        c.rect(x - 1, 41 - lift, 10, 5, BOOT)
        c.rect(x - 1, 45 - lift, 11, 1, BOOT_D)
        c.px(x + 8, 42 - lift, METAL_L)


def body(c):
    # 구부정한 큰 몸통 · 가슴·배 근육 · 허리띠 · 해골 버클 · 털 허리 가리개
    c.oval(21, 26, 11, 8, SKIN)
    c.oval(26, 26, 5, 6, SKIN_L)
    c.line(26, 22, 31, 23, SKIN_D)
    for y in (26, 29):
        c.line(24, y, 30, y, SKIN_D)
    c.rect(10, 32, 22, 3, LEATHER)
    c.rect(10, 34, 22, 1, METAL_D)
    for x in (12, 16, 29):
        c.px(x, 33, METAL_L)
    c.oval(24, 34, 3, 3, BONE)
    c.px(23, 33, INK); c.px(25, 33, INK); c.rect(23, 36, 3, 1, BONE_D)
    poly(c, [(20, 36), (28, 36), (25, 42), (24, 43)], FUR_D)
    c.line(24, 37, 24, 41, hx("#d88a20"))


def hair(c):
    # 상투와 뒤로 길게 날리는 꽁지머리
    poly(c, [(29, 10), (21, 9), (12, 11), (6, 16), (13, 13), (21, 12), (28, 12)], HAIR)
    c.line(10, 13, 21, 10, HAIR_L)
    c.oval(30, 11, 3, 2, HAIR)
    c.oval(30, 7, 2, 2, HAIR)
    c.rect(29, 9, 3, 1, RUNE)


def head(c, roar):
    # 앞으로 내민 머리 (오른쪽) · 굵은 눈썹 · 노란 눈 · 큰 엄니 · 뾰족 귀 금 귀걸이 · 땋은 수염
    c.oval(31, 18, 6, 6, INK)
    c.oval(31, 18, 5, 5, SKIN)
    c.rect(32, 20, 5, 4, SKIN)
    c.oval(30, 16, 3, 2, SKIN_L)
    c.line(28, 15, 36, 16, INK)
    c.line(28, 16, 35, 17, SKIN_D)
    c.px(33, 17, EYE); c.px(34, 17, EYE)
    if roar:
        c.rect(33, 21, 4, 3, MOUTH)
        c.px(36, 20, BONE); c.px(33, 20, BONE)
    else:
        c.line(33, 23, 36, 23, SKIN_D)
    c.px(36, 21, BONE); c.px(36, 22, BONE); c.px(34, 22, BONE); c.px(34, 21, BONE)
    poly(c, [(28, 17), (23, 13), (29, 20)], SKIN)
    c.px(27, 20, GOLD)
    c.line(35, 24, 35, 26, HAIR); c.px(35, 26, BONE)


def shoulder(c):
    # 어깨 갑옷: 어두운 쇠 · 뼈 가시 셋 · 아래 털 장식 · 뼈 이빨 목걸이
    c.oval(16, 20, 8, 5, INK)
    c.oval(16, 20, 7, 4, METAL)
    c.oval(15, 18, 5, 2, METAL_L)
    c.line(10, 22, 22, 22, METAL_D)
    for x in (11, 21):
        c.px(x, 20, BONE_D)
    for x, h in ((11, 5), (16, 7), (21, 5)):
        poly(c, [(x - 2, 16), (x + 2, 16), (x, 16 - h)], BONE)
        c.line(x - 1, 15, x, 16 - h + 1, BONE_D)
    for i, x in enumerate(range(9, 25, 2)):
        c.rect(x, 24, 2, 2 + (i % 2), FUR)
        c.px(x + 1, 25 + (i % 2), FUR_D)
    for x in (26, 28, 30):
        c.px(x, 24, BONE); c.px(x, 25, BONE_D)


def blade(c, bx, by, up):
    # 양날 도끼 머리 (자루 끝 bx,by) · up: 날이 위아래로 선 모양(True) / 옆으로(False)
    if up:
        poly(c, [(bx - 1, by - 2), (bx - 7, by - 6), (bx - 8, by + 1), (bx - 7, by + 8), (bx - 1, by + 4)], BLADE)
        poly(c, [(bx + 1, by - 2), (bx + 5, by - 4), (bx + 6, by + 1), (bx + 5, by + 6), (bx + 1, by + 3)], BLADE)
        c.line(bx - 8, by + 1, bx - 7, by + 7, BLADE_L); c.line(bx - 7, by - 6, bx - 8, by, BLADE_L)
        c.px(bx - 4, by + 1, RUNE); c.px(bx - 4, by, RUNE); c.px(bx - 5, by + 2, RUNE)
    else:
        poly(c, [(bx - 2, by + 1), (bx - 6, by + 7), (bx + 1, by + 9), (bx + 8, by + 7), (bx + 4, by + 1)], BLADE)
        poly(c, [(bx - 2, by - 1), (bx - 5, by - 5), (bx + 1, by - 6), (bx + 6, by - 5), (bx + 3, by - 1)], BLADE)
        c.line(bx - 6, by + 7, bx + 8, by + 7, BLADE_L)
        c.px(bx + 1, by + 4, RUNE); c.px(bx + 2, by + 4, RUNE); c.px(bx + 1, by + 5, RUNE)
    c.rect(bx - 1, by - 1, 3, 3, METAL_D)


def haft(c, x0, y0, x1, y1):
    thick(c, x0, y0, x1, y1, HAFT)
    c.line(x0, y0 + 1, x1, y1 + 1, HAFT_D)


def arm(c, sx, sy, ex, ey):
    thick(c, sx, sy, ex, ey, SKIN, 4)
    c.line(sx, sy + 3, ex, ey + 3, SKIN_D)
    mx, my = round((sx + ex) / 2), round((sy + ey) / 2)
    c.rect(mx - 1, my, 4, 4, METAL)
    c.line(mx - 1, my, mx + 2, my, METAL_L)
    c.oval(ex + 1, ey + 2, 3, 3, SKIN)
    c.px(ex + 2, ey + 1, SKIN_L)


def orc(f):
    c = Cell(S)
    raise_ = f == 2
    hair(c)
    if raise_:
        # 도끼를 머리 뒤로 치켜듦 (날이 왼쪽 위) → 휘두르기 예고
        haft(c, 27, 5, 11, 2)
        blade(c, 9, 5, True)
        arm(c, 21, 21, 25, 4)
    legs(c, f)
    body(c)
    if not raise_:
        # 도끼를 앞으로 낮게 끌고 감 (날이 아래·앞)
        haft(c, 33, 33, 41, 38 - f)
        blade(c, 41, 38 - f, False)
        arm(c, 22, 26, 31, 31)
    shoulder(c)
    head(c, raise_)
    c.outline(INK)
    return c


def save(frames):
    img = Image.new("RGBA", (S * len(frames), S), (0, 0, 0, 0))
    for k, fr in enumerate(frames):
        for (x, y), col in fr.p.items():
            img.putpixel((k * S + x, y), col)
    img.save(os.path.join(SRC, "highorc.png"), optimize=True)
    bevel(scale2x(img)).save(os.path.join(OUT, "highorc.png"), optimize=True)
    print("highorc ok", img.size)


if __name__ == "__main__":
    save([orc(0), orc(1), orc(2)])
