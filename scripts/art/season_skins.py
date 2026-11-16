# 시즌 스킨 그림 넣기 (python3 scripts/art/season_skins.py [캐릭터 이름 ...]) — 사용자가 올린 그림 docs/SKIN_ART.md
# 시트: art/스킨/S{시즌}/{이름}-시트.png · 시트2 · 시트3 (원본 시트와 같은 칸 배치) → import_v2로 apps/client/public/sprites/skins/{id}_{테마}.png (4×5 v2)
#   칸 고르기 규칙(왼쪽 뒤집기·공격 칸 등)은 기본 캐릭터 것을 그대로 씀
# 일러스트: art/스킨/S{시즌}/{이름}-일러.png → apps/client/public/sprites/charArt/skin/{스킨 id}.webp (+ card/ 정사각형) · 목록 select/skinArtList.ts (SKIN_ART · SKIN_SHEETS)
# 변신 모습(풋내기 레벨·버려진 자들 2·3·학살자 분노·오토마타 인형·이클립스 밤)은 FORMS: 시트만 (일러스트 없음)
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
# 시즌 폴더 → 스킨 테마 (shop/skins의 테마 이름: 범 풍류 · 여름 파도 · 네온 펄스 · 성탄 눈꽃 · 벨벳 티타임)
THEME = {"S1": "tiger", "S2": "summer", "S3": "cyber", "S4": "noel", "S5": "maid"}
# 이름 → 캐릭터 id (docs/SKIN_ART.md 시즌 1~5 · 그림이 없으면 건너뜀)
IDS = {
    "파수꾼": "warden", "떠돌이": "drifter", "마법사": "mage", "음양사": "mystic", "기계공학자": "engineer", "원소술사": "elementalist", "격투가": "brawler",
    "의사": "doctor", "야수": "beast", "거너": "gunner", "닌자": "ninja", "시간술사": "chronomancer", "소환술사": "summoner", "풋내기": "novice",
    "베두인": "bedouin", "장수": "general", "이무기": "imugi", "악의 사도": "apostle", "버려진 자들": "abandoned", "거인": "titan", "오니": "oni",
    "이드라": "idra", "변희": "byeonhui", "플라이": "fly", "장로": "elder", "렌": "ren", "정령사": "spiritist", "역병의사": "plague", "학살자": "slayer",
    "이터": "eater", "묵인": "mukin", "사멸": "samyeol", "오토마타": "automata", "라이더": "rider", "붐버": "bomber", "아티팩터": "artifacter",
    "펑크": "punk", "수집가": "collector", "추적자": "tracker", "잊혀진 자": "forgotten", "잔영": "remnant", "방랑객": "wanderer",
    "영사": "silk", "풍류사": "pungryu", "레오": "leo", "오닉스": "onyx", "펜리르": "fenrir", "이클립스": "eclipse", "토르켄": "thorken",
    "리바이어": "levia", "테일": "tail", "매드퀸": "madQueen", "훅": "hook", "오르카": "orca", "웨이브": "wave", "미류": "miryu",
    "베아트리스": "beatrice", "이안": "ian", "가브리엘": "gabriel", "세레나": "serena", "미카엘라": "michaela", "유리엘": "yuriel", "라파엘": "rafael",
    "블래스트": "blast", "네일러": "nailer", "시저스": "scissors", "헬피스트": "hellfist", "실버불렛": "silverBullet", "블루 플레임": "blueFlame", "루나틱": "lunatic",
    "인시전": "incision", "크루세이더": "crusader", "조커": "joker", "쉐도잉": "shadowing", "인형술사": "puppeteer", "래빗": "rabbit", "백령": "baekryeong",
    "빙설": "bingseol", "혼령": "honryeong", "백인장": "baekinjang", "아리아": "aria", "레이븐": "chessRaven", "기어스": "gears", "아수라": "asura",
    "느아르": "noir", "루주": "rouge", "블뢰": "bleu", "존": "jaune", "마젠타": "magenta", "베르": "vert", "블랑": "blanc",
}
# 변신 모습 (그림 파일 이름 → 캐릭터 · 기본 그림 규칙 이름(import_v2) · 스킨 이름 뒤 꼬리, 게임은 game/sprites skinForm)
FORMS = {
    "풋내기10": ("novice", "novice10", "lv10"), "풋내기15": ("novice", "novice15", "lv15"), "풋내기20": ("novice", "novice20", "lv20"),
    "버려진 자들2": ("abandoned", "abandoned2", "p2"), "버려진 자들3": ("abandoned", "abandoned3", "p3"),
    "학살자_분노": ("slayer", "slayer_rage", "rage"), "오토마타_인형": ("automata", "automataDoll", "doll"), "이클립스_밤": ("eclipse", "eclipseNight", "night"),
}
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


def names(season, theme):
    """그 시즌 폴더의 그림 → (그림 이름, 캐릭터, 규칙 이름, 스킨 이름, 시트 있음, 일러 있음)"""
    seen = {os.path.basename(p).split("-")[0] for p in glob.glob(os.path.join(SKIN_SRC, season, "*.png"))}
    for kor in sorted(seen):
        if kor in FORMS: base, rule, tail = FORMS[kor]; skin = f"{base}_{theme}_{tail}"
        elif kor in IDS: base = rule = IDS[kor]; skin = f"{base}_{theme}"
        else: print("모르는 그림 이름:", season, kor); continue
        has = lambda suf: os.path.exists(os.path.join(SKIN_SRC, season, f"{kor}-{suf}.png"))
        yield kor, base, rule, skin, has("시트") and has("시트2") and has("시트3"), has("일러")


def write_list(art, sheets):
    with open(LIST, "w", encoding="utf8") as f:
        f.write("// 시즌 스킨 그림 목록 (scripts/art/season_skins.py가 만듦, 손으로 고치지 않음)\n")
        for const, ids, what in (("SKIN_ART", art, "일러스트가 있는 스킨"), ("SKIN_SHEETS", sheets, "사용자 그림 시트(v2 4×5)가 있는 스킨 · 변신 모습은 뒤에 _lv10·_p2·_rage·_doll·_night")):
            f.write(f"/** {what} */\nexport const {const}: ReadonlySet<string> = new Set([\n")
            for i in range(0, len(ids), 5):
                f.write("  " + ", ".join(f'"{x}"' for x in ids[i:i + 5]) + ",\n")
            f.write("]);\n")


def main(only):
    os.makedirs(os.path.join(ART_OUT, "card"), exist_ok=True)
    sheets = []
    with tempfile.TemporaryDirectory() as tmp:
        os.makedirs(os.path.join(tmp, "src"))
        import_v2.HERE = tmp
        for season, theme in THEME.items():
            for kor, base, rule, skin, has_sheet, has_art in names(season, theme):
                if has_sheet: sheets.append(skin)
                if only and kor not in only and base not in only: continue
                if has_sheet: sheet(season, kor, skin, rule, tmp)
                if has_art: illust(season, kor, skin)
    art = sorted(os.path.splitext(f)[0] for f in os.listdir(ART_OUT) if f.endswith(".webp"))
    write_list(art, sorted(sheets))
    print(len(art), "스킨 일러스트 ·", len(sheets), "스킨 시트")


if __name__ == "__main__":
    main(set(sys.argv[1:]))
