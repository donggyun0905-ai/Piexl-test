# 아리아 그림 (python3 scripts/art/aria.py) — 원본 art/캐릭터/아리아
# · ariaFx.png (256칸 4×5, 투명 바탕): 0·1줄 음표 8종(온·두·높은음자리·낮은음자리·셋잇·점·샵·플랫) · 2줄 바이올린 서기(앞·뒤·왼·오)
#   3줄 바이올린 공격 4칸 · 4줄 악기(피아노·하프·호른·클라리넷) — 줄 번호는 화면 render/ariaArt와 같게
# · ariaBoom.png (192칸 4×8): 폭죽 터짐 4칸을 음표 색 8가지로 (줄 = 음표 종류, 색은 render/ariaArt AR_COLORS와 같은 차례)
# 캐릭터 몸 시트는 import_v2.py aria (src/aria-1~3.png: 서기·공격 · 걷기 · 맞음·쓰러짐·대시)
import os

import numpy as np
from PIL import Image

from baekryeong import cells, split4, trim
from puppeteer import cutout
from rabbit import glow
from s2_common import SPRITES

HERE = os.path.dirname(__file__)
CHAR = os.path.join(HERE, "../../art/캐릭터/아리아")
# 폭죽 색: 음표 종류마다 바꿀 색상(0~255 HSV) · 금 원본 그대로가 0
HUES = [0, 236, 140, 70, 205, 25, 170, 110]


def load(name):
    return Image.open(os.path.join(CHAR, name + ".png"))


def sheet(rows, cell, same):
    out = Image.new("RGBA", (cell * 4, cell * len(rows)), (0, 0, 0, 0))
    for r, row in enumerate(rows):
        big = max(max(p.width, p.height) for p in row)
        for c, p in enumerate(row):
            k = (cell - 4) / (big if same(r) else max(p.width, p.height))
            q = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
            out.alpha_composite(q, (c * cell + (cell - q.width) // 2, r * cell + (cell - q.height) // 2))
    return out


def hue(im, h):
    if h == 0:
        return im
    a = im.getchannel("A")
    hsv = np.asarray(im.convert("RGB").convert("HSV")).copy()
    hsv[..., 0] = (hsv[..., 0].astype(np.int32) + h) % 256
    hsv[..., 1] = np.clip(hsv[..., 1].astype(np.int32) * 1.15, 0, 255)
    out = Image.fromarray(hsv, "HSV").convert("RGBA")
    out.putalpha(a)
    return out


def main():
    notes = cells(cutout(load("황금빛 픽셀 아트 음악 기호 8종")), 4, 2)
    violin = cells(cutout(load("황금 유령 손의 바이올린 연주 스프라이트")), 4, 2)
    inst = [trim(cutout(load(n))) for n in ("황금빛 유령 손의 피아노 연주", "황금빛 유령 손의 하프 연주", "황금빛 유령 손과 프렌치호른 음악 문장", "황금 유령 손의 클라리넷 선율")]
    sheet([notes[0], notes[1], violin[0], violin[1], inst], 256, lambda r: r in (2, 3)).save(os.path.join(SPRITES, "ariaFx.png"), optimize=True)
    boom = split4(glow(load("픽셀 불꽃놀이 폭발 시퀀스")))
    sheet([[hue(p, h) for p in boom] for h in HUES], 192, lambda r: True).save(os.path.join(SPRITES, "ariaBoom.png"), optimize=True)
    print("ariaFx.png · ariaBoom.png")


if __name__ == "__main__":
    main()
