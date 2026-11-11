# 백인장 그림 (python3 scripts/art/baekinjang.py) — 원본 art/캐릭터/백인장
# · baekinjangFx.png (192칸 4×12, 투명 바탕, 모두 4칸): 0 혈월 쌍검격 · 1 적색 난무 · 2 선혈 회전참 · 3 섬광 돌진베기
#   4 붉은 날개 폭우 · 5 추적 침격 · 6 관통 나선창 · 7 기계익 충격파 · 8 적안 표식 · 9 혈철 감옥 · 10 사신의 팔연참 · 11 종언의 붉은 날개
#   모두 빛 그림이라 밝기를 투명도로 · 줄 번호는 화면 render/baekinjangArt와 같게
# · baekinjangDrone.png: 미니 창 드론 한 장 (오른쪽을 봄)
# 캐릭터 몸 시트는 import_v2.py baekinjang (src/baekinjang-1~3.png: 서기·공격 · 걷기 · 맞음·쓰러짐·대시)
import os

from PIL import Image

from baekryeong import cutout, split4, trim
from rabbit import glow
from s2_common import SPRITES

HERE = os.path.dirname(__file__)
CHAR = os.path.join(HERE, "../../art/캐릭터/백인장")
C = 192
ROWS = ["혈월 쌍검격", "적색난무", "선혈회전참", "섬광돌진베기", "붉은 날개 폭우", "추적침격", "관통나선창", "기계익충격파", "적안표시", "혈철감옥", "사신의팔연참", "종언의붉은날개"]


def main():
    sheet = Image.new("RGBA", (C * 4, C * len(ROWS)), (0, 0, 0, 0))
    for r, name in enumerate(ROWS):
        row = split4(glow(Image.open(os.path.join(CHAR, name + ".png"))))
        # 한 줄은 같은 배율 (커지는 차례가 그대로 보이게)
        k = (C - 4) / max(max(p.width, p.height) for p in row)
        for c, p in enumerate(row):
            q = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
            sheet.alpha_composite(q, (c * C + (C - q.width) // 2, r * C + (C - q.height) // 2))
    sheet.save(os.path.join(SPRITES, "baekinjangFx.png"), optimize=True)
    drone = trim(cutout(Image.open(os.path.join(CHAR, "붉은 빛의 드릴형 미니 드론.png"))))
    drone = drone.resize((96, round(drone.height * 96 / drone.width)), Image.LANCZOS)
    drone.save(os.path.join(SPRITES, "baekinjangDrone.png"), optimize=True)
    print("baekinjangFx.png", sheet.size, "· baekinjangDrone.png", drone.size)


if __name__ == "__main__":
    main()
