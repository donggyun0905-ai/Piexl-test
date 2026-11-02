# 시즌 3 새 몬스터 그림 (python3 scripts/art/s3_monsters.py)
# 1배 원본 → scripts/art/src/monsters_1x/{bombbug,skelarcher,chainward,highorc}.png → hd_monsters_2x와 같은 2배 다듬기 → sprites/enemies/
# 규격(docs/ART.md): 움직임 칸 2장을 가로로, 오른쪽을 봄, 몸 크기 + 6~8
# 폭발풍뎅이: 붉은 등껍질 · 노란 불씨 무늬 · 등에 심지 불꽃 (2칸: 다리 · 불꽃 흔들림)
# 스켈레톤 궁병: 뼈 몸 · 검은 눈 구멍 · 낡은 활과 화살 (2칸: 걸음)
# 쇠사슬 간수: 회색 투구·갑옷 · 붉은 눈 · 손에 감은 쇠사슬과 갈고리 (2칸: 걸음·사슬 흔들림)
# 하이오크: 큰 초록 몸 · 엄니 · 가죽 갑옷 · 큰 양날 도끼 (2칸: 걸음)
import os

from PIL import Image

from s2_common import Cell, hx
from hd_monsters_2x import SRC, OUT, bevel, scale2x


def bombbug(f):
    c = Cell(18)
    shell, dark, spot, leg = hx("#c84a2a"), hx("#7a2414"), hx("#ffc040"), hx("#2a1410")
    # 다리 (걸음마다 엇갈림)
    for i, x in enumerate((5, 8, 11)):
        o = (i + f) % 2
        c.line(x, 12, x - 1 + o * 2, 15, leg)
    # 등껍질 · 가운데 줄 · 불씨 무늬
    c.oval(8, 9, 6, 4, shell)
    c.line(8, 5, 8, 13, dark)
    for x, y in ((5, 8), (11, 8), (6, 11), (10, 11)): c.px(x, y, spot)
    # 머리 · 더듬이
    c.oval(14, 10, 2, 2, dark)
    c.px(15, 9, hx("#ffe070"))
    c.line(15, 8, 17, 6, leg)
    # 등의 심지와 불꽃
    c.line(8, 5, 7, 3, hx("#6a5a4a"))
    c.px(7 - f, 2, hx("#ffe070")); c.px(6, 1 + f, hx("#ff7a2a")); c.px(7, 1, hx("#ffb040"))
    c.outline(hx("#1a0a06"))
    return c


def skelarcher(f):
    c = Cell(20)
    bone, shade, eye, wood, string = hx("#e8e0c8"), hx("#a8a090"), hx("#14101a"), hx("#7a5a32"), hx("#d8d0b8")
    # 머리뼈 · 눈 구멍 · 턱
    c.oval(9, 5, 3, 3, bone)
    c.px(9, 5, eye); c.px(11, 5, eye)
    c.rect(8, 8, 4, 1, shade)
    # 갈비뼈 몸 · 등뼈
    c.line(9, 9, 9, 14, bone)
    for y in (10, 12): c.line(7, y, 11, y, bone)
    c.px(7, 11, shade); c.px(11, 11, shade)
    # 다리 (걸음)
    c.line(9, 14, 7 + f, 18, bone); c.line(9, 14, 11 - f, 18, bone)
    # 활을 든 팔 · 활(앞쪽 반원) · 시위 · 화살
    c.line(9, 10, 13, 10, bone)
    for y in range(4, 17):
        dx = 3 - abs(y - 10) // 2
        c.px(14 + dx, y, wood)
    c.line(14, 4, 14, 16, string)
    c.line(10, 10, 18, 10, hx("#c8c0a8")); c.px(19, 10, hx("#f0f0ff"))
    c.outline(hx("#2a2620"))
    return c


def chainward(f):
    c = Cell(22)
    steel, dark, skin, chain, eye = hx("#8a8a98"), hx("#4a4a58"), hx("#b08a6a"), hx("#c8c8d8"), hx("#ff4040")
    # 다리
    c.rect(8, 16, 2, 4 - f, dark); c.rect(12, 16, 2, 3 + f, dark)
    # 몸 갑옷 · 허리띠
    c.rect(7, 9, 8, 7, steel)
    c.rect(7, 13, 8, 1, dark)
    # 투구 (눈구멍 줄)
    c.oval(11, 6, 4, 4, steel)
    c.rect(8, 6, 7, 1, dark)
    c.px(12, 6, eye); c.px(14, 6, eye)
    # 팔과 쇠사슬 (앞으로 늘어뜨림) · 갈고리
    c.rect(15, 10, 2, 4, skin)
    for i in range(5):
        c.px(17 + (i % 2), 11 + i + (f if i > 2 else 0), chain)
    c.line(18, 16 + f, 20, 17 + f, chain); c.px(20, 16 + f, chain)
    c.outline(hx("#18181e"))
    return c


def highorc(f):
    c = Cell(26)
    skin, dark, leather, tusk, blade, haft = hx("#4a7a3a"), hx("#2a4a22"), hx("#6a4a2a"), hx("#f0e8c8"), hx("#c8ccd8"), hx("#5a3a1a")
    # 다리
    c.rect(8, 19, 3, 5 - f, dark); c.rect(14, 19, 3, 4 + f, dark)
    # 큰 몸 · 가죽 갑옷
    c.oval(12, 14, 7, 6, skin)
    c.rect(7, 14, 11, 5, leather)
    c.rect(7, 16, 11, 1, dark)
    # 머리 · 엄니 · 눈
    c.oval(13, 7, 4, 4, skin)
    c.px(15, 6, hx("#ffd040")); c.px(12, 6, hx("#ffd040"))
    c.px(12, 10, tusk); c.px(15, 10, tusk); c.px(15, 9, tusk)
    # 도끼 자루 · 양날
    c.line(19, 4, 19, 20, haft)
    for y in range(1, 11):
        for x in range(19, 26):
            if x - 19 <= 6 - abs(y - 5) * 0.9: c.px(x, y, blade)
    c.line(20, 5, 24, 5, hx("#e8ecf8"))
    # 도끼를 쥔 팔
    c.rect(17, 11, 3, 3, skin)
    c.outline(hx("#14200e"))
    return c


def save(name, frames, size):
    img = Image.new("RGBA", (size * len(frames), size), (0, 0, 0, 0))
    for k, fr in enumerate(frames):
        for (x, y), col in fr.p.items():
            if 0 <= x < size and 0 <= y < size: img.putpixel((k * size + x, y), col)
    img.save(os.path.join(SRC, f"{name}.png"), optimize=True)
    bevel(scale2x(img)).save(os.path.join(OUT, f"{name}.png"), optimize=True)
    print(name, "ok")


if __name__ == "__main__":
    save("bombbug", [bombbug(0), bombbug(1)], 18)
    save("skelarcher", [skelarcher(0), skelarcher(1)], 20)
    save("chainward", [chainward(0), chainward(1)], 22)
    save("highorc", [highorc(0), highorc(1)], 26)
