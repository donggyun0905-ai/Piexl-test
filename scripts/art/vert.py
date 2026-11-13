# 베르 그림 (python3 scripts/art/vert.py) — 원본 art/캐릭터/베르
# · vertFx.png (192칸 4×16, 투명 바탕, 모두 4칸): 기본 공격 1~4단계·추가 공격 1~4단계·스킬 4개와 강화판 (줄 번호는 화면 render/vertArt와 같게)
#   모두 빛 그림이라 밝기를 투명도로 · 악마 계급 마크는 느아르와 같은 noirMarks.png
# · 몸 시트 원본 src/vert-1~3.png: 초록 배경을 검정으로 바꿔 둠 → 그다음 python3 scripts/art/import_v2.py vert
import os

import numpy as np

from PIL import Image

from baekryeong import split4
from rabbit import glow
from s2_common import SPRITES

HERE = os.path.dirname(__file__)
CHAR = os.path.join(HERE, "../../art/캐릭터/베르")
C = 192
ROWS = ["기본공격1단계_녹식쌍낫격", "기본공격2단계_가시회전무", "기본공격3단계_부패의난무", "기본공격4단계_맹독덩굴채찍",
        "추가공격1단계_기생씨앗", "추가공격2단계_체내개화", "추가공격3단계_생명착취", "추가공격4단계_시든육신",
        "스킬1번_부패의꽃밭", "스킬2번_가시숲강림", "스킬3번_대지부식", "스킬4번_기생덩굴감옥",
        "스킬1번(강화)_사령화조종", "스킬2번(강화)_만개의포식자", "스킬3번(강화)_천륜가시무", "스킬4번(강화)_종언의생명수확"]
# 몸 시트 원본: 1 서기·공격 · 2 걷기 · 3 맞음·쓰러짐·대시
BODY = ["베르 서기·공격", "베르 걷기", "베르 맞음·쓰러짐·대시"]


def unkey(im):
    """초록 배경 → 검정. 베르는 몸이 초록이라 noir.unkey(초록 줄이기)를 쓰지 않음:
    아주 밝은 순수 초록만 배경 · 배경 둘레 2점 안의 밝은 초록 번짐만 배경으로 (몸 초록은 그대로)"""
    a = np.array(im.convert("RGB")).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    bg = (g > 190) & (g - np.maximum(r, b) > 140)
    near = bg.copy()
    for _ in range(2):
        n = near.copy()
        n[1:] |= near[:-1]
        n[:-1] |= near[1:]
        n[:, 1:] |= near[:, :-1]
        n[:, :-1] |= near[:, 1:]
        near = n
    spill = near & ~bg & (g > 160) & (g - np.maximum(r, b) > 90)
    a[bg | spill] = 0
    return Image.fromarray(a.astype("uint8"))


def main():
    sheet = Image.new("RGBA", (C * 4, C * len(ROWS)), (0, 0, 0, 0))
    for r, name in enumerate(ROWS):
        row = split4(glow(Image.open(os.path.join(CHAR, name + ".png"))))
        # 한 줄은 같은 배율 (커지는 차례가 그대로 보이게)
        k = (C - 4) / max(max(p.width, p.height) for p in row)
        for c, p in enumerate(row):
            q = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
            sheet.alpha_composite(q, (c * C + (C - q.width) // 2, r * C + (C - q.height) // 2))
    sheet.save(os.path.join(SPRITES, "vertFx.png"), optimize=True)
    for i, name in enumerate(BODY):
        unkey(Image.open(os.path.join(CHAR, name + ".png"))).save(os.path.join(HERE, "src", f"vert-{i + 1}.png"), optimize=True)
    print("vertFx.png", sheet.size, "· src/vert-1~3.png")


if __name__ == "__main__":
    main()
