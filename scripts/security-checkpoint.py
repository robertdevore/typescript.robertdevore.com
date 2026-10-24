#!/usr/bin/env python3
"""Run the reviewed checkpoint toolkit after the site build."""
import json
from pathlib import Path
import subprocess
import sys
ROOT = Path(__file__).resolve().parents[1]
TOOL = ROOT / "tools/security-checkpoint.pyz"
for command in ("install", "validate"):
    subprocess.run([sys.executable, str(TOOL), command, "--all", "--config", str(ROOT / "security-checkpoint.json")], check=True)
config = json.loads((ROOT / "security-checkpoint.json").read_text())
for site in config["sites"]:
    if site["adapter"].startswith("cloudflare-"):
        headers = ROOT / site["output_dir"] / "_headers"
        text = headers.read_text() if headers.exists() else ""
        marker = "# BEGIN security-checkpoint headers"
        if marker not in text:
            if any(line.strip() in ("/flag.txt", "/.well-known/security.txt") for line in text.splitlines()):
                raise SystemExit("Review existing checkpoint header rules before adding new rules")
            headers.write_text(text.rstrip() + "\n\n" + marker + "\n/flag.txt\n  Content-Type: text/plain; charset=utf-8\n/.well-known/security.txt\n  Content-Type: text/plain; charset=utf-8\n# END security-checkpoint headers\n")
