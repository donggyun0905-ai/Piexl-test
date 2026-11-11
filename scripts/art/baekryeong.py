# 백령 그림 (python3 scripts/art/baekryeong.py) — 원본 art/캐릭터/백령
# · baekryeongFx.png (256칸 4×6, 투명 바탕): 0줄 에너지 참격 4칸(커지는 차례) · 1줄 검무 소용돌이 4칸 · 2줄 유령 망령 3칸
#   3줄 유령팔(혼불 대태도) 위 4칸 · 4줄 유령팔 아래 4칸(휘두르기) · 5줄 0칸 (진)대태도(푸른 불꽃 장식 검, 칼끝이 아래)
#   참격·소용돌이·망령은 빛 그림이라 밝기를 투명도로 · 칸 번호는 화면 render/baekArt와 같게
# 캐릭터 몸 시트는 import_v2.py baekryeong (src/baekryeong-1~3.png)
import os

import numpy as np
from PIL import Image

from puppeteer import cutout, trim
from rabbit import frames, glow
from s2_common import SPRITES

HERE = os.path.dirname(__file__)
CHAR = os.path.join(HERE, "../../art/캐릭터/백령")
C = 256


def load(name):
    return Image.open(os.path.join(CHAR, name))


def cells(im, cols, rows):
    """cols×rows 칸으로 잘라 줄마다 칸 목록 (투명 바탕을 둘레만 남김)"""
    w, h = im.width // cols, im.height // rows
    return [[trim(im.crop((c * w, r * h, (c + 1) * w, (r + 1) * h))) for c in range(cols)] for r in range(rows)]


def split4(im):
    """가로 4칸: 4등분 자리 둘레에서 빛이 가장 적은 세로줄로 나눔 (조각이 칸 사이에 걸쳐도 됨)"""
    a = np.asarray(im.getchannel("A")).astype(np.int64).sum(axis=0)
    w = im.width
    cut = [0] + [min(range(k * w // 4 - w // 10, k * w // 4 + w // 10), key=lambda x: a[x]) for k in (1, 2, 3)] + [w]
    return [trim(im.crop((cut[i], 0, cut[i + 1], im.height))) for i in range(4)]


def place(sheet, p, c, r, k):
    q = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
    sheet.alpha_composite(q, (c * C + (C - q.width) // 2, r * C + (C - q.height) // 2))


def main():
    arms = cells(cutout(load("푸른 혼불의 카타나 검무 스프라이트 시트.png")), 4, 2)
    rows = [
        split4(glow(load("시원한 청록 에너지 참격 4연속.png"))),
        frames(glow(load("네 단계 검무 소용돌이 효과.png"))),
        frames(glow(load("유령 망령 픽셀 아트 스프라이트 시트.png")), 3),
        arms[0],
        arms[1],
        [trim(cutout(load("푸른 불꽃의 장식 검.png")))],
    ]
    sheet = Image.new("RGBA", (C * 4, C * 6), (0, 0, 0, 0))
    for r, row in enumerate(rows):
        # 한 줄은 같은 배율 (가장 큰 칸 기준) — 커지는 차례가 그대로 보이게 (유령팔 두 줄은 같은 배율)
        big = max(max(p.width, p.height) for p in (arms[0] + arms[1] if r in (3, 4) else row))
        for c, p in enumerate(row): place(sheet, p, c, r, (C - 6) / big)
    sheet.save(os.path.join(SPRITES, "baekryeongFx.png"), optimize=True)
    print("baekryeongFx.png", sheet.size, [len(r) for r in rows])


if __name__ == "__main__":
    main()
