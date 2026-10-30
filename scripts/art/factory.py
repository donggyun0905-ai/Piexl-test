# 그림 공장: OpenAI 그림 API로 캐릭터·스킨·이펙트 그림을 만듦 (GitHub Actions '그림 공장'에서만 실행, .github/workflows/art-factory.yml)
# 실행마다 저장소 주인이 GitHub에서 승인해야 돌아감(환경 art-factory) · 결과는 art-factory/{번호} 브랜치에만 저장 → Claude가 보여 주고 허락받은 뒤에 게임에 넣음
# 환경 변수: OPENAI_API_KEY(환경 비밀) · KIND(character·skin·effect) · TARGET(캐릭터 id 또는 이펙트 이름) · THEME · DESC · VARIANTS · QUALITY · MODEL · RUN_ID
import base64
import json
import os
import sys

import requests

from factory_prompts import prompt_for

HERE = os.path.dirname(__file__)
SPRITES = os.path.join(HERE, "../../apps/client/public/sprites")
API = "https://api.openai.com/v1/images"


def reference(kind, target):
    """참고 그림: 스킨·캐릭터 다시 그리기는 그 캐릭터 원본 조각(scripts/art/src) → 없으면 게임 시트"""
    if kind == "effect": return None
    for p in (os.path.join(HERE, "src", f"{target}.png"), os.path.join(SPRITES, f"{target}.png")):
        if os.path.exists(p): return p
    return None


def main():
    key = os.environ.get("OPENAI_API_KEY")
    if not key: sys.exit("OPENAI_API_KEY 없음 (저장소 Settings → Environments → art-factory → 비밀)")
    kind, target = os.environ["KIND"], os.environ["TARGET"].strip()
    theme, desc = os.environ.get("THEME", "").strip(), os.environ.get("DESC", "").strip()
    n = max(1, min(4, int(os.environ.get("VARIANTS", "2"))))
    quality = os.environ.get("QUALITY", "medium")
    model = os.environ.get("MODEL", "gpt-image-2")
    prompt = prompt_for(kind, target, theme, desc)
    ref = reference(kind, target) if kind == "skin" or (kind == "character" and not desc) else None
    size = "1536x1024" if kind != "effect" else "1024x1024"
    head = {"Authorization": f"Bearer {key}"}
    if ref:
        with open(ref, "rb") as f:
            r = requests.post(f"{API}/edits", headers=head, files={"image[]": (os.path.basename(ref), f, "image/png")},
                              data={"model": model, "prompt": prompt, "n": n, "size": size, "quality": quality}, timeout=600)
    else:
        r = requests.post(f"{API}/generations", headers={**head, "Content-Type": "application/json"},
                          data=json.dumps({"model": model, "prompt": prompt, "n": n, "size": size, "quality": quality}), timeout=600)
    if r.status_code != 200: sys.exit(f"API 오류 {r.status_code}: {r.text[:500]}")
    out = os.path.join(HERE, "factory", kind, f"{target}{'_' + theme if theme else ''}")
    os.makedirs(out, exist_ok=True)
    run = os.environ.get("RUN_ID", "local")
    for i, d in enumerate(r.json()["data"]):
        with open(os.path.join(out, f"{run}_{i + 1}.png"), "wb") as f: f.write(base64.b64decode(d["b64_json"]))
    usage = r.json().get("usage", {})
    with open(os.path.join(out, f"{run}_info.json"), "w", encoding="utf-8") as f:
        json.dump({"kind": kind, "target": target, "theme": theme, "desc": desc, "model": model, "quality": quality, "n": n, "ref": ref and os.path.relpath(ref, HERE), "prompt": prompt, "usage": usage}, f, ensure_ascii=False, indent=1)
    print(f"{n}장 저장: {out}")


if __name__ == "__main__":
    main()
