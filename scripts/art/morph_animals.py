# 변희가 변하는 동물 열 마리 (python3 scripts/art/morph_animals.py) → apps/client/public/sprites/morph-{동물}.png
# 동물은 옆모습만 씀 (게임이 왼쪽을 볼 때 뒤집음): 1~3줄은 같은 걷기 4칸, 4줄은 공격 4칸 (게임은 4줄 4칸을 씀)
from s2_common import Cell, hx, save_sheet

O = hx("#140e10")
EYE = hx("#100808")
WH = hx("#ffffff")

def wolf(c, f, atk):
    fur, furD, furL = hx("#8a8a9a"), hx("#5a5a6a"), hx("#c8c8d4")
    leg = (0, 1, 0, -1)[f]
    c.oval(14, 20, 8, 4, fur); c.rect(7, 19, 14, 3, furL)
    for x, d in ((8, leg), (12, -leg), (17, leg), (20, -leg)): c.rect(x + d, 23, 2, 6, furD if x in (12, 20) else fur)
    c.line(6, 18, 2, 14 - (f % 2), fur); c.line(6, 19, 2, 15 - (f % 2), furD)
    hx0 = 21 + (2 if atk else 0)
    c.oval(hx0 + 2, 16, 4, 3, fur); c.rect(hx0 + 4, 16, 5, 2, fur); c.px(hx0 + 1, 12, fur); c.px(hx0 + 2, 12, fur); c.px(hx0 + 1, 13, furD)
    c.px(hx0 + 3, 15, hx("#ffd040")); c.px(hx0 + 8, 16, EYE)
    if atk:
        c.rect(hx0 + 4, 18, 5, 1, hx("#e84a4a")); c.px(hx0 + 5, 17, WH); c.px(hx0 + 7, 17, WH); c.px(hx0 + 5, 19, WH)

def bear(c, f, atk):
    fur, furD, muz = hx("#7a5030"), hx("#4a3018"), hx("#c8a070")
    leg = (0, 1, 0, -1)[f]
    c.oval(14, 19, 10, 6, fur); c.oval(10, 16, 6, 3, fur)
    for x, d in ((6, leg), (10, -leg), (17, leg), (21, -leg)): c.rect(x + d, 23, 3, 6, furD if x in (10, 21) else fur)
    hx0 = 22 if not atk else 23
    c.oval(hx0 + 2, 15, 4, 4, fur); c.px(hx0, 10, fur); c.px(hx0 + 1, 10, fur); c.px(hx0, 11, furD)
    c.rect(hx0 + 5, 15, 3, 3, muz); c.px(hx0 + 7, 15, EYE); c.px(hx0 + 3, 13, EYE)
    if atk:
        c.rect(hx0 + 1, 18, 4, 4, fur); c.px(hx0 + 5, 19, WH); c.px(hx0 + 5, 21, WH); c.px(hx0 + 4, 22, WH)

def eagle(c, f, atk):
    br, brD, wh, beak = hx("#5a3a20"), hx("#3a2410"), hx("#f4f4f0"), hx("#ffc030")
    flap = (0, -3, 0, 3)[f] if not atk else -5
    c.oval(14, 17, 6, 4, br)
    c.line(9, 15, 3, 9 + flap, brD); c.line(10, 15, 4, 9 + flap, br); c.line(11, 15, 6, 8 + flap, br); c.line(12, 15, 8, 8 + flap, br)
    c.rect(5, 18, 4, 3, brD); c.px(4, 19, brD)
    c.oval(21, 13, 3, 3, wh); c.rect(23, 13, 3, 2, beak); c.px(25, 15, hx("#e08a10")); c.px(21, 12, EYE)
    c.rect(13, 21, 1, 6, beak); c.rect(16, 21, 1, 6, beak); c.rect(12, 27, 3, 1, beak); c.rect(15, 27, 3, 1, beak)
    if atk:
        c.line(17, 21, 20, 26, beak); c.px(21, 27, WH)

def snake(c, f, atk):
    sk, skD, belly = hx("#4a9a3a"), hx("#2a6a2a"), hx("#c8d870")
    wave = (0, 1, 0, -1)[f]
    pts = [(4, 26), (8, 27 + wave), (12, 26), (16, 25 - wave), (19, 26)]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        for t in range(0, 5):
            x = x0 + (x1 - x0) * t / 4; y = y0 + (y1 - y0) * t / 4
            c.rect(x, y - 1, 2, 3, sk); c.px(x, y + 1, belly)
    rise = 6 if atk else 0
    c.line(19, 26, 21, 19 - rise, sk); c.line(20, 26, 22, 19 - rise, skD)
    c.oval(23, 17 - rise, 3, 2, sk); c.rect(24, 17 - rise, 3, 2, sk); c.px(24, 16 - rise, hx("#ffd040")); c.px(24, 16 - rise, EYE)
    c.px(2, 26, skD); c.px(3, 25, sk)
    for x in (6, 11, 16): c.px(x, 25, skD)
    if atk:
        c.px(27, 18 - rise, hx("#e83a3a")); c.px(28, 17 - rise, hx("#e83a3a")); c.px(28, 19 - rise, hx("#e83a3a")); c.px(25, 19 - rise, WH)

def boar(c, f, atk):
    fur, furD, snout = hx("#6a4a3a"), hx("#4a3024"), hx("#c88a7a")
    leg = (0, 1, 0, -1)[f] if not atk else (2, -2, 2, -2)[f]
    lean = 1 if atk else 0
    c.oval(14, 20, 9, 5, fur); c.rect(8, 14, 10, 3, furD)
    for x, d in ((7, leg), (11, -leg), (17, leg), (20, -leg)): c.rect(x + d, 24, 2, 5, furD)
    c.oval(23 + lean, 19, 3, 3, fur); c.rect(25 + lean, 19, 3, 3, snout); c.px(27 + lean, 20, EYE); c.px(23 + lean, 17, EYE)
    c.line(25 + lean, 22, 27 + lean, 19, WH); c.px(22 + lean, 15, fur); c.px(4, 18, furD); c.px(5, 19, furD)
    if atk:
        for y in (16, 20, 24): c.line(0, y, 3, y, hx("#c8a070"))

def scorpion(c, f, atk):
    sh, shD, shL = hx("#a8642a"), hx("#6a3a14"), hx("#d8944a")
    leg = (0, 1, 0, -1)[f]
    c.oval(14, 23, 7, 3, sh); c.rect(9, 22, 10, 1, shL)
    for i, x in enumerate((9, 12, 15, 18)): c.line(x, 25, x - 2 + (leg if i % 2 else -leg), 28, shD)
    # 꼬리: 뒤에서 위로 휘어 앞을 향함
    tail = [(7, 22), (5, 18), (6, 13), (9, 10), (13, 9)] if not atk else [(7, 22), (6, 17), (9, 12), (14, 10), (19, 11)]
    for (x0, y0), (x1, y1) in zip(tail, tail[1:]): c.line(x0, y0, x1, y1, sh); c.line(x0 + 1, y0, x1 + 1, y1, shD)
    tx, ty = tail[-1]; c.rect(tx, ty - 1, 3, 2, shD); c.px(tx + 3, ty + (1 if atk else 0), hx("#e83a3a"))
    c.line(20, 23, 24, 20, sh); c.rect(24, 18, 3, 2, shL); c.rect(24, 21, 3, 1, shL); c.px(19, 22, EYE)

def bat(c, f, atk):
    b, bD, m = hx("#3a2a4a"), hx("#24182e"), hx("#5a4a6a")
    flap = (-4, 0, 4, 0)[f] if not atk else -2
    c.oval(16, 16, 3, 4, b); c.px(15, 11, b); c.px(17, 11, b)
    for side in (-1, 1):
        c.line(16 + side * 2, 15, 16 + side * 11, 12 + flap, bD); c.line(16 + side * 11, 12 + flap, 16 + side * 9, 19 + flap // 2, m)
        c.line(16 + side * 2, 17, 16 + side * 9, 19 + flap // 2, m)
        for t in range(3, 10): c.line(16 + side * t, 15 + (t * (flap - 3)) // 11, 16 + side * t, 17 + (t * (flap // 2 + 2)) // 9, m)
    c.px(17, 15, hx("#ff4a4a")); c.px(18, 15, hx("#ff4a4a")); c.px(17, 18, WH)
    if atk:
        for r in (4, 6): c.px(20 + r, 14, hx("#c08aff")); c.px(20 + r, 18, hx("#c08aff")); c.px(21 + r, 16, hx("#c08aff"))

def elephant(c, f, atk):
    sk, skD, tusk = hx("#a0a0b0"), hx("#70707e"), hx("#f4ecd8")
    leg = (0, 1, 0, -1)[f]
    c.oval(13, 17, 10, 7, sk); c.oval(22, 14, 4, 4, sk)
    for x, d in ((5, leg), (9, -leg), (16, leg), (20, -leg)): c.rect(x + d, 22, 3, 7, skD if x in (9, 20) else sk)
    c.oval(19, 14, 3, 4, skD)
    trunk = [(25, 15), (27, 18), (27, 22), (26, 24)] if not atk else [(25, 14), (27, 11), (28, 8), (27, 6)]
    for (x0, y0), (x1, y1) in zip(trunk, trunk[1:]): c.line(x0, y0, x1, y1, sk); c.line(x0 - 1, y0, x1 - 1, y1, skD)
    c.line(24, 17, 26, 19, tusk); c.px(23, 12, EYE); c.px(3, 15, skD); c.px(2, 17, skD)

def spider(c, f, atk):
    b, bD, red = hx("#2a2430"), hx("#4a4450"), hx("#e83a3a")
    leg = (0, 1, 0, -1)[f]
    c.oval(11, 21, 6, 4, b); c.oval(19, 22, 3, 3, b); c.px(10, 20, red); c.px(11, 21, red)
    for i, x in enumerate((13, 15, 17, 19)):
        d = leg if i % 2 else -leg
        c.line(x, 22, x - 3 + d, 18, bD); c.line(x - 3 + d, 18, x - 5 + d, 28, bD)
        c.line(x + 1, 23, x + 4 - d, 19, bD); c.line(x + 4 - d, 19, x + 6 - d, 28, bD)
    c.px(21, 21, red); c.px(22, 22, red)
    if atk:
        for x in range(23, 31, 2): c.px(x, 22, WH)

def phoenix(c, f, atk):
    fire, fireD, gold, red = hx("#ff7a2a"), hx("#e84a1a"), hx("#ffd040"), hx("#ff4a1a")
    flap = (0, -3, 0, 3)[f] if not atk else -4
    c.oval(15, 17, 5, 4, fire)
    c.line(11, 15, 4, 8 + flap, red); c.line(12, 15, 6, 7 + flap, fire); c.line(13, 15, 9, 7 + flap, gold); c.line(14, 15, 11, 8 + flap, fire)
    for i in range(4): c.line(10, 18 + i, 2 + i * 2, 26 + i, (red, fire, gold, fireD)[i])
    c.oval(21, 13, 3, 3, fire); c.rect(23, 13, 3, 1, gold); c.px(21, 12, EYE)
    c.line(20, 10, 19, 6, gold); c.line(21, 10, 22, 6, gold); c.px(18, 7, red)
    c.rect(14, 21, 1, 5, gold); c.rect(17, 21, 1, 5, gold)
    if atk:
        for x, y in ((26, 12), (27, 14), (28, 11), (29, 13)): c.px(x, y, gold if x % 2 else red)

ANIMALS = dict(wolf=wolf, bear=bear, eagle=eagle, snake=snake, boar=boar, scorpion=scorpion, bat=bat, elephant=elephant, spider=spider, phoenix=phoenix)

def frame_for(fn):
    def frame(row, col):
        c = Cell()
        fn(c, col, row == 3)
        c.outline(O)
        return c
    return frame

def main():
    for name, fn in ANIMALS.items(): save_sheet(f"morph-{name}", frame_for(fn))

if __name__ == "__main__":
    main()
