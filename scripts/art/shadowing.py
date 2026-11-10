# 쉐도잉 효과 그림 (python3 scripts/art/shadowing.py)
# · shadowingFx.webp: 효과 줄 21개 × 4칸(192px, 검은 바탕은 밝기만큼 투명하게)
#   0~4 쉐도잉 효과 5종(art/캐릭터/쉐도잉) · 5~19 레이드용 맵 잔패턴 덩어리(art/레이드보스/루시퍼) · 20 붓 자국(먹물 번짐)
#   줄 번호는 화면 render/shadowingArt.SD_FX와 같게
# · shadowingBrush.png: 마법의 보석 붓 4칸(128px, 투명 바탕) — 마우스 커서·손에 든 붓
# 캐릭터 몸 시트는 import_v2.py shadowing (src/shadowing-1~3.png)
import os

import numpy as np
from PIL import Image, ImageFilter

from s2_common import SPRITES

HERE = os.path.dirname(__file__)
CHAR = os.path.join(HERE, "../../art/캐릭터/쉐도잉")
RAID = os.path.join(HERE, "../../art/레이드보스/루시퍼")
CELL = 192

# 쉐도잉 효과: 가로 4칸 한 장
OWN = ["마법 검격 스프라이트 시트.png", "마법의 수묵화 소환 연출.png", "마법의 연꽃 각성 연속 장면.png", "청백 학과 구름의 마법 연출.png", "픽셀 아트 벚꽃 물결 연속 장면.png"]
# 레이드 잔패턴: (파일, 묶음 0~2, 세로 범위) — 묶음 하나 = 가로 512px에 4칸
M1 = "레이드용 맵 잔패턴.png"
M2 = "레이드용 맵 잔패턴 (2).png"
RAID_FX = [
    (M2, 2, (847, 977)),  # 5 사슬
    (M2, 0, (611, 714)),  # 6 불기둥
    (M2, 1, (6, 117)),  # 7 얼음 결정
    (M2, 1, (137, 251)),  # 8 소용돌이
    (M2, 1, (617, 729)),  # 9 달
    (M2, 1, (382, 490)),  # 10 별
    (M2, 2, (16, 116)),  # 11 시계
    (M2, 2, (144, 243)),  # 12 유령
    (M2, 2, (729, 834)),  # 13 가시 장미
    (M2, 2, (379, 488)),  # 14 혜성
    (M2, 0, (509, 594)),  # 15 나비
    (M2, 0, (841, 967)),  # 16 황금 문
    (M1, 0, (704, 790)),  # 17 날개
    (M1, 0, (810, 897)),  # 18 유성
    (M1, 0, (905, 1003)),  # 19 용 머리
]


def fit(im):
    k = min((CELL - 4) / im.width, (CELL - 4) / im.height)
    im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    cell = Image.new("RGB", (CELL, CELL))
    cell.paste(im, ((CELL - im.width) // 2, (CELL - im.height) // 2))
    return cell


def trim(im):
    """검은 둘레를 잘라 내용만 (밝기 24 넘는 곳)"""
    box = im.convert("L").point(lambda v: 255 if v > 24 else 0).getbbox()
    return im.crop(box) if box else im


def own_rows():
    rows = []
    for name in OWN:
        im = Image.open(os.path.join(CHAR, name)).convert("RGB")
        fw = im.width / 4
        rows.append([fit(trim(im.crop((round(i * fw), 0, round((i + 1) * fw), im.height)))) for i in range(4)])
    return rows


def raid_rows():
    rows = []
    for name, g, (y0, y1) in RAID_FX:
        im = Image.open(os.path.join(RAID, name)).convert("RGB")
        gw = im.width / 3
        fw = gw / 4
        rows.append([fit(trim(im.crop((round(g * gw + i * fw), y0, round(g * gw + (i + 1) * fw), y1)))) for i in range(4)])
    return rows


def ink_row():
    """먹물 번짐 4칸 (붓 자국 끝·획이 사라질 때): 수묵화 첫 칸의 아래쪽 물결을 흐리게 키워 씀"""
    im = Image.open(os.path.join(CHAR, OWN[1])).convert("RGB")
    fw = im.width / 4
    base = trim(im.crop((0, 0, round(fw), im.height)))
    out = []
    for i in range(4):
        blur = base.filter(ImageFilter.GaussianBlur(i * 3))
        out.append(fit(blur))
    return out


def fx_sheet():
    rows = own_rows() + raid_rows() + [ink_row()]
    sheet = Image.new("RGB", (CELL * 4, CELL * len(rows)))
    for r, row in enumerate(rows):
        for c, cell in enumerate(row):
            sheet.paste(cell, (c * CELL, r * CELL))
    # 검은 바탕을 투명으로: 투명도 = 가장 밝은 색 값, 색은 그만큼 밝혀 둠 (투명한 층에 그려도 검은 네모가 안 생김)
    rgb = np.asarray(sheet).astype(np.float32)
    a = rgb.max(axis=2, keepdims=True)
    a = np.where(a < 10, 0, a)
    col = np.where(a > 0, rgb * 255 / np.maximum(a, 1), 0)
    out = Image.fromarray(np.concatenate([col, a], axis=2).clip(0, 255).astype(np.uint8), "RGBA")
    out.save(os.path.join(SPRITES, "shadowingFx.webp"), quality=72, method=6)
    print("shadowingFx.webp", out.size)


def brush_sheet():
    """붓 4칸: 원본을 가로 4등분해 검은 바탕(밝기 20 이하)을 지우고 각 칸 가운데에"""
    im = Image.open(os.path.join(CHAR, "마법의 보석 붓 스프라이트 시트.png")).convert("RGB")
    C = 128
    sheet = Image.new("RGBA", (C * 4, C), (0, 0, 0, 0))
    fw = im.width / 4
    for i in range(4):
        p = trim(im.crop((round(i * fw), 0, round((i + 1) * fw), im.height))).convert("RGBA")
        p.putalpha(p.convert("L").point(lambda v: 0 if v <= 20 else 255).filter(ImageFilter.MinFilter(3)))
        k = min((C - 4) / p.width, (C - 4) / p.height)
        p = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
        sheet.alpha_composite(p, (i * C + (C - p.width) // 2, (C - p.height) // 2))
    sheet.save(os.path.join(SPRITES, "shadowingBrush.png"))
    print("shadowingBrush.png", sheet.size)


if __name__ == "__main__":
    fx_sheet()
    brush_sheet()
