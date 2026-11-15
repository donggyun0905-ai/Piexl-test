# 시즌 스킨 그림 넣기 (python3 scripts/art/season_skins.py [캐릭터 이름 ...]) — 사용자가 올린 그림 docs/SKIN_ART.md
# 시트: art/스킨/S{시즌}/{이름}-시트.png · 시트2 · 시트3 (원본 시트와 같은 칸 배치) → import_v2로 apps/client/public/sprites/skins/{id}_{테마}.png (4×5 v2)
#   칸 고르기 규칙(왼쪽 뒤집기·공격 칸 등)은 기본 캐릭터 것을 그대로 씀
# 일러스트: art/스킨/S{시즌}/{이름}-일러.png → apps/client/public/sprites/charArt/skin/{스킨 id}.webp (+ card/ 정사각형) · 목록 select/skinArtList.ts
import glob
import os
import sys
import tempfile

from PIL import Image

import import_v2

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SKIN_SRC = os.path.join(ROOT, "art", "스킨")
ART_OUT = os.path.join(ROOT, "apps", "client", "public", "sprites", "charArt", "skin")
LIST = os.path.join(ROOT, "apps", "client", "src", "select", "skinArtList.ts")
# 시즌 폴더 → 스킨 테마 (shop/skins의 테마 이름)
THEME = {"S1": "tiger"}
# 이름 → 캐릭터 id (그림이 올라온 캐릭터만)
IDS = {"파수꾼": "warden", "떠돌이": "drifter", "마법사": "mage", "음양사": "mystic", "기계공학자": "engineer", "원소술사": "elementalist", "격투가": "brawler", "의사": "doctor"}
W, CARD = 1376, 400


def inherit(skin, base):
    """import_v2의 캐릭터별 규칙 표에 스킨 이름을 기본 캐릭터와 똑같이 넣음"""
    for v in vars(import_v2).values():
        if isinstance(v, set) and base in v: v.add(skin)
        elif isinstance(v, dict) and base in v: v.setdefault(skin, v[base])


def sheet(season, kor, skin, base, tmp):
    for tag, suffix in (("1", ""), ("2", "2"), ("3", "3")):
        os.symlink(os.path.join(SKIN_SRC, season, f"{kor}-시트{suffix}.png"), os.path.join(tmp, "src", f"{skin}-{tag}.png"))
    inherit(skin, base)
    import_v2.build(skin)


def illust(season, kor, skin):
    im = Image.open(os.path.join(SKIN_SRC, season, f"{kor}-일러.png")).convert("RGB")
    im.resize((W, round(im.height * W / im.width)), Image.LANCZOS).save(os.path.join(ART_OUT, skin + ".webp"), "WEBP", quality=86, method=6)
    x = (im.width - im.height) // 2
    im.crop((x, 0, x + im.height, im.height)).resize((CARD, CARD), Image.LANCZOS).save(os.path.join(ART_OUT, "card", skin + ".webp"), "WEBP", quality=88, method=6)


def main(only):
    os.makedirs(os.path.join(ART_OUT, "card"), exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        os.makedirs(os.path.join(tmp, "src"))
        import_v2.HERE = tmp
        for season, theme in THEME.items():
            for p in sorted(glob.glob(os.path.join(SKIN_SRC, season, "*-일러.png"))):
                kor = os.path.basename(p)[: -len("-일러.png")]
                base = IDS.get(kor)
                if not base or (only and kor not in only and base not in only): continue
                skin = f"{base}_{theme}"
                sheet(season, kor, skin, base, tmp)
                illust(season, kor, skin)
    ids = sorted(os.path.splitext(f)[0] for f in os.listdir(ART_OUT) if f.endswith(".webp"))
    with open(LIST, "w", encoding="utf8") as f:
        f.write("// 시즌 스킨 일러스트가 있는 스킨 (scripts/art/season_skins.py가 만듦, 손으로 고치지 않음)\n")
        f.write("export const SKIN_ART: ReadonlySet<string> = new Set([\n")
        for i in range(0, len(ids), 6):
            f.write("  " + ", ".join(f'"{x}"' for x in ids[i:i + 6]) + ",\n")
        f.write("]);\n")
    print(len(ids), "스킨 일러스트")


if __name__ == "__main__":
    main(set(sys.argv[1:]))
