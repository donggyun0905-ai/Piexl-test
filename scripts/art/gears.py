# 기어스 그림 (python3 scripts/art/gears.py) — 원본 art/캐릭터/기어스
# · gearsFx.png (192칸 4×11, 투명 바탕, 모두 4칸): 0 쌍방패 강타 · 1 쌍성 방패 · 2 연속 방패타 · 3 거울 반격 · 4 마법 보호막 돔
#   5 대지 분쇄 · 6 마법 방패 충격파 · 7 육각 방벽 · 8 방패 던지기 · 9 천상의 수호자 · 10 청뢰 방패 폭풍
#   모두 빛 그림이라 밝기를 투명도로 · 줄 번호는 화면 render/gearsArt와 같게
# · gearsShield.png: 푸른 별 문양 방패 한 장 · gearsOrb.png: 푸른 보석 기계 구체 한 장 (대시 구체)
# 캐릭터 몸 시트는 import_v2.py gears (src/gears-1~3.png: 서기·공격 · 걷기 · 맞음·쓰러짐·대시)
import os

from PIL import Image

from baekryeong import split4, trim
from rabbit import glow
from raven import cutout
from s2_common import SPRITES

HERE = os.path.dirname(__file__)
CHAR = os.path.join(HERE, "../../art/캐릭터/기어스")
C = 192
ROWS = ["쌍방패강타이펙트4프레임", "쌍성방패", "연속방패타_4프레임", "거울반격", "네 단계로 완성되는 마법 보호막 돔", "대지분쇄",
        "마법 방패 충격파_4프레임", "마법의 푸른 육각 방벽 전개술", "방패던지기", "천상의 수호자", "청뢰방패폭풍"]


def one(name, w):
    im = trim(cutout(Image.open(os.path.join(CHAR, name + ".png")), 24))
    return im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)


def main():
    sheet = Image.new("RGBA", (C * 4, C * len(ROWS)), (0, 0, 0, 0))
    for r, name in enumerate(ROWS):
        row = split4(glow(Image.open(os.path.join(CHAR, name + ".png"))))
        # 한 줄은 같은 배율 (커지는 차례가 그대로 보이게)
        k = (C - 4) / max(max(p.width, p.height) for p in row)
        for c, p in enumerate(row):
            q = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
            sheet.alpha_composite(q, (c * C + (C - q.width) // 2, r * C + (C - q.height) // 2))
    sheet.save(os.path.join(SPRITES, "gearsFx.png"), optimize=True)
    one("푸른 별 문양의 은빛 방패", 96).save(os.path.join(SPRITES, "gearsShield.png"), optimize=True)
    one("푸른 보석 기계 구체", 128).save(os.path.join(SPRITES, "gearsOrb.png"), optimize=True)
    print("gearsFx.png", sheet.size, "· gearsShield.png · gearsOrb.png")


if __name__ == "__main__":
    main()
