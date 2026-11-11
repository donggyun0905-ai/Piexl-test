# 아수라 그림 (python3 scripts/art/asura.py) — 원본 art/캐릭터/아수라
# · asuraFx.png (256칸 4×6, 투명 바탕): 0줄 일반펀치 3칸 · 1줄 연속펀치 3칸 · 2줄 아수라 각성 4칸
#   3줄 각성 후 1·2타 4칸 · 4줄 각성 후 3타(바닥 연속 강타) 4칸 · 5줄 각성 후 4타 4칸
#   모두 빛 그림이라 밝기를 투명도로 · 칸 번호는 화면 render/asuraArt와 같게
# 캐릭터 몸 시트는 import_v2.py asura (src/asura-1~3.png: 서기·공격 · 걷기 · 맞음·쓰러짐·대시)
import os

from PIL import Image

from baekryeong import place, split4
from rabbit import frames, glow
from s2_common import SPRITES

HERE = os.path.dirname(__file__)
CHAR = os.path.join(HERE, "../../art/캐릭터/아수라")
C = 256
ROWS = [("일반펀치.png", 3), ("연속펀치.png", 3), ("아수라각성.png", 4), ("각성 후기본공격1,2타 4프레임.png", 4), ("각성 후 기본공격 3타(연속 3번 바닥 연속강타).png", 4), ("각성 후 기본공격 4타.png", 4)]


def main():
    rows = [split4(im) if n == 4 else frames(im, n) for f, n in ROWS for im in [glow(Image.open(os.path.join(CHAR, f)))]]
    sheet = Image.new("RGBA", (C * 4, C * len(rows)), (0, 0, 0, 0))
    for r, row in enumerate(rows):
        # 한 줄은 같은 배율 (커지는 차례가 그대로 보이게)
        big = max(max(p.width, p.height) for p in row)
        for c, p in enumerate(row): place(sheet, p, c, r, (C - 6) / big)
    sheet.save(os.path.join(SPRITES, "asuraFx.png"), optimize=True)
    print("asuraFx.png", sheet.size, [len(r) for r in rows])




# ── 분노의 팔: 붉은 그림 (python3 scripts/art/asura.py red) ──
# asuraFxRed.png = 효과 시트의 파랑·빨강을 맞바꿈 (푸른 빛 → 붉은 빛)
# asuraRed.png = 몸 시트에서 푸른 귀신 팔(채도 있는 파랑·남색)만 붉게 (머리·피부·금장식은 그대로)
def red():
    import numpy as np

    fx = np.asarray(Image.open(os.path.join(SPRITES, "asuraFx.png")).convert("RGBA")).copy()
    fx[..., [0, 2]] = fx[..., [2, 0]]
    Image.fromarray(fx, "RGBA").save(os.path.join(SPRITES, "asuraFxRed.png"), optimize=True)
    body = Image.open(os.path.join(SPRITES, "asura.png")).convert("RGBA")
    hsv = np.asarray(body.convert("RGB").convert("HSV")).astype(np.int32)
    rgba = np.asarray(body).copy()
    h, s = hsv[..., 0], hsv[..., 1]
    # 파랑~보라 (PIL 색상 0~255: 약 150~200) · 채도 있음
    # 팔과 코트가 같은 남색이라 자리로도 나눔: 칸(128) 안에서 머리 위쪽 · 몸 가운데에서 좌우로 먼 곳 = 팔
    ys, xs = np.mgrid[0 : rgba.shape[0], 0 : rgba.shape[1]]
    cy, cx = ys % 128, xs % 128
    arm = (cy < 50) | (np.abs(cx - 64) > 22)
    blue = (h >= 145) & (h <= 205) & (s >= 70) & (rgba[..., 3] > 0) & arm
    r, b = rgba[..., 0].copy(), rgba[..., 2].copy()
    rgba[..., 0] = np.where(blue, b, r)
    rgba[..., 2] = np.where(blue, (r * 0.6).astype(np.uint8), b)
    rgba[..., 1] = np.where(blue, (rgba[..., 1] * 0.55).astype(np.uint8), rgba[..., 1])
    Image.fromarray(rgba, "RGBA").save(os.path.join(SPRITES, "asuraRed.png"), optimize=True)
    print("asuraFxRed.png · asuraRed.png", int(blue.sum()), "px")


if __name__ == "__main__":
    import sys

    red() if sys.argv[1:] == ["red"] else main()
