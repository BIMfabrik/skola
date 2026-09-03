from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = ["index.html", "styles.css", "app.js", "README.md", "PRODUCT_SPEC.md", "favicon.svg"]

class VisibleTextParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hidden_depth = 0
        self.text = []
    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style"}:
            self.hidden_depth += 1
    def handle_endtag(self, tag):
        if tag in {"script", "style"} and self.hidden_depth:
            self.hidden_depth -= 1
    def handle_data(self, data):
        if not self.hidden_depth and data.strip():
            self.text.append(data.strip())

def fail(message):
    print(f"FAIL: {message}")
    return 1

def main():
    problems = 0
    for name in REQUIRED:
        if not (ROOT / name).exists():
            problems += fail(f"missing {name}")

    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "styles.css").read_text(encoding="utf-8")
    js = (ROOT / "app.js").read_text(encoding="utf-8")

    result = subprocess.run(["node", "--check", str(ROOT / "app.js")], capture_output=True, text=True)
    if result.returncode:
        problems += fail(result.stderr.strip() or "JavaScript syntax")

    parser = VisibleTextParser()
    parser.feed(html)
    allowed = {"Skola", "skola", "★", "0", "♪", "×"}
    unexpected = [text for text in parser.text if text not in allowed]
    if unexpected:
        problems += fail(f"unexpected visible child-shell text: {unexpected}")

    if re.search(r'<(?:script|link)[^>]+(?:src|href)=["\']https?://', html, re.I):
        problems += fail("external runtime asset dependency found")

    if "min-height: 44px" not in css:
        problems += fail("44px minimum touch target rule missing")

    required_types = ["choice", "fraction", "mirror", "pattern", "angle", "rhythm", "ramp", "mix", "order"]
    for activity_type in required_types:
        if f"type: '{activity_type}'" not in js:
            problems += fail(f"renderer type missing: {activity_type}")

    for world in ["math", "music", "physics", "chemistry", "nature"]:
        if f"{world}: [" not in js:
            problems += fail(f"world missing: {world}")

    if "localStorage" not in js:
        problems += fail("progress persistence missing")
    if "prefers-reduced-motion" not in css:
        problems += fail("reduced-motion support missing")

    if problems:
        print(f"\n{problems} validation problem(s)")
        return 1
    print("PASS: Skola static validation")
    return 0

if __name__ == "__main__":
    sys.exit(main())
