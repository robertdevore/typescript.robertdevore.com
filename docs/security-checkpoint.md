# Security checkpoint

The build installs `/flag.txt` and `/.well-known/security.txt` with the shared security-checkpoint 1.0.0 CLI. Contact: me@robertdevore.com. These files are advisory; they grant no authorization and do not prevent exploitation.

Source: https://github.com/robertdevore/security-checkpoint (private). The reviewed archive is vendored in `tools/` with its SHA-256. Regenerate it from that repository and update the archive/checksum together; do not edit it here. Python 3.10+ is required. No network dependency download is needed for checkpoint generation.

Configuration is `security-checkpoint.json`. The hook `scripts/security-checkpoint.py` runs after generation. Output remains generated and uncommitted. Local ownership and retained audit records live in ignored `.security-checkpoint/`, outside the publish root. Fresh CI builds generate new files; repeat builds retain the recorded expiration.

Preview changes with `python3 tools/security-checkpoint.pyz update --all`; apply with `--apply`, then use the normal deployment workflow. Validate locally with `python3 tools/security-checkpoint.pyz validate --all`. Public validation additionally requires `--public --allow-domain DOMAIN`. Do not claim deployment from local files.

No monitoring or alerts are enabled. Existing logging and security headers are preserved. Cloudflare builds append exact-path plaintext header rules. A request to the checkpoint is not evidence of malicious activity.

For removal, first remove the build hook, review `uninstall --all --dry-run`, then run `uninstall --all --yes` and deploy through the existing workflow. Retain audit history and unrelated logs.

`expires` is pinned in the configuration so clean CI and local builds produce identical content. Review and advance this date before expiration, then run update and redeploy.
