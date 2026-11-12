# 느아르 그림 (python3 scripts/art/noir.py) — 원본 art/캐릭터/느아르
# · noirFx.png (192칸 4×16, 투명 바탕, 모두 4칸): 기본 공격 1~4단계·추가 공격 1~4단계·스킬 4개와 강화판 (줄 번호는 화면 render/noirArt와 같게)
#   모두 빛 그림이라 밝기를 투명도로
# · noirMarks.png (160칸 4×1): 악마 계급 마크 하위·중위·고위·대악마 (캐릭터 뒤에 그림)
# · 몸 시트 원본 src/noir-1~3.png: 초록 배경을 검정으로 바꿔 둠 → 그다음 python3 scripts/art/import_v2.py noir
import os

import numpy as np
from PIL import Image

from baekryeong import split4
from rabbit import glow
from raven import cutout
from s2_common import SPRITES

HERE = os.path.dirname(__file__)
CHAR = os.path.join(HERE, "../../art/캐릭터/느아르")
C = 192
ROWS = ["1단계_기본공격_칠흑횡베기", "1단계_추가공격_심연의 손아귀", "2단계_기본공격_무형의난무", "2단계_추가공격_공간압축",
        "3단계_기본공격_공허의회전참", "3단계_추가공격_마력소멸", "4단계_기본공격_절대단절", "4단계_추가공격_공허포식",
        "스킬1번(강화)_시초의공허", "스킬1번_흑영돌진", "스킬2번(강화)_차원절멸", "스킬2번_공허의낙인",
        "스킬3번(강화)_무한심연", "스킬3번_결계붕괴", "스킬4번(강화)_태초의종언", "스킬4번_궁극기_흑월강림"]
# 몸 시트 원본: 1 서기·공격 · 2 걷기 · 3 맞음·쓰러짐·대시
BODY = ["네온 그린 배경의 다크 슬래시 스프라이트 시트", "초록 배경의 chibi 캐릭터 걷기 스프라이트 시트", "네온 초록 배경의 픽셀 캐릭터 포즈 모음"]
MARK = 160


def unkey(im):
    """초록 배경 → 검정 (초록이 다른 색보다 확 센 곳), 가장자리에 남은 초록 기운은 빼냄"""
    a = np.array(im.convert("RGB")).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    bg = (g > r + 40) & (g > b + 40)
    a[..., 1] = np.minimum(g, np.maximum(r, b))
    a[bg] = 0
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
    sheet.save(os.path.join(SPRITES, "noirFx.png"), optimize=True)
    marks = split4(cutout(Image.open(os.path.join(CHAR, "악마계급 마크.png")), 24))
    k = (MARK - 4) / max(max(p.width, p.height) for p in marks)
    out = Image.new("RGBA", (MARK * 4, MARK), (0, 0, 0, 0))
    for c, p in enumerate(marks):
        q = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
        out.alpha_composite(q, (c * MARK + (MARK - q.width) // 2, (MARK - q.height) // 2))
    out.save(os.path.join(SPRITES, "noirMarks.png"), optimize=True)
    for i, name in enumerate(BODY):
        unkey(Image.open(os.path.join(CHAR, name + ".png"))).save(os.path.join(HERE, "src", f"noir-{i + 1}.png"), optimize=True)
    print("noirFx.png", sheet.size, "· noirMarks.png", out.size, "· src/noir-1~3.png")


if __name__ == "__main__":
    main()
