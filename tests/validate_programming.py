from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "programming.js",
    "programming-round-reset.js",
    "programming.css",
    "programming-controls.css",
    "programming-toy.css",
    "PROGRAMMING_CURRICULUM.md",
]


def fail(message):
    print(f"FAIL: {message}")
    return 1


def main():
    problems = 0
    for name in REQUIRED:
        if not (ROOT / name).exists():
            problems += fail(f"missing {name}")

    if problems:
        return 1

    for name in ["programming.js", "programming-round-reset.js"]:
        result = subprocess.run(
            ["node", "--check", str(ROOT / name)], capture_output=True, text=True
        )
        if result.returncode:
            problems += fail(result.stderr.strip() or f"JavaScript syntax: {name}")

    html = (ROOT / "index.html").read_text(encoding="utf-8")
    js = (ROOT / "programming.js").read_text(encoding="utf-8")
    reset_js = (ROOT / "programming-round-reset.js").read_text(encoding="utf-8")
    css = (ROOT / "programming.css").read_text(encoding="utf-8")
    controls_css = (ROOT / "programming-controls.css").read_text(encoding="utf-8")
    toy_css = (ROOT / "programming-toy.css").read_text(encoding="utf-8")

    for marker in [
        'data-world="programming"',
        'src="programming.js"',
        'src="programming-round-reset.js"',
        'href="programming.css"',
        'href="programming-controls.css"',
        'href="programming-toy.css"',
    ]:
        if marker not in html:
            problems += fail(f"programming shell marker missing: {marker}")

    for activity in [
        "codeSequence",
        "codeRepeat",
        "codeCondition",
        "codeVariable",
        "codeDebug",
    ]:
        if activity not in js:
            problems += fail(f"programming activity missing: {activity}")

    for command in ["'F'", "'L'", "'R'", "'F2'", "'F3'", "'IFW'", "'PICK'", "'OPEN'"]:
        if command not in js:
            problems += fail(f"programming command missing: {command}")

    for capability in [
        "simulateProgram",
        "meetsConcept",
        "programRunning",
        "recordStageHint",
        "completeStage",
    ]:
        if capability not in js:
            problems += fail(f"programming capability missing: {capability}")

    if "completeStageWithProgramReset" not in reset_js:
        problems += fail("adaptive-round program reset missing")

    for selector in [
        ".code-world-node",
        ".program-grid",
        ".program-token",
        ".program-run",
        ".program-robot",
    ]:
        if selector not in css:
            problems += fail(f"programming style missing: {selector}")

    for marker in [
        "container-name: programboard",
        "grid-template-areas",
        'grid-area: controls',
        "@container programboard",
    ]:
        if marker not in controls_css:
            problems += fail(f"responsive controls capability missing: {marker}")

    for marker in [
        ".program-grid",
        ".program-robot",
        ".program-token",
        ".program-run",
        "box-shadow",
    ]:
        if marker not in toy_css:
            problems += fail(f"3D visual marker missing: {marker}")

    if "prefers-reduced-motion" not in css or "prefers-reduced-motion" not in toy_css:
        problems += fail("programming reduced-motion support missing")

    if problems:
        print(f"\n{problems} programming validation problem(s)")
        return 1

    print("PASS: Skola programming validation")
    return 0


if __name__ == "__main__":
    sys.exit(main())
