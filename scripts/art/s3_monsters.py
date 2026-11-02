# 시즌 3 새 몬스터 그림 (python3 scripts/art/s3_monsters.py)
# 1배 원본 → scripts/art/src/monsters_1x/{bombbug,skelarcher}.png → hd_monsters_2x와 같은 2배 다듬기 → sprites/enemies/
# 규격(docs/ART.md): 움직임 칸 2장을 가로로, 오른쪽을 봄, 몸 크기 + 6~8
# 폭발풍뎅이: 붉은 등껍질 · 노란 불씨 무늬 · 등에 심지 불꽃 (2칸: 다리 · 불꽃 흔들림)
# 스켈레톤 궁병: 뼈 몸 · 검은 눈 구멍 · 낡은 활과 화살 (2칸: 걸음)
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
