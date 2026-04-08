# Playbook PDF Link Extractor

This repository includes a script that extracts all PDF document links from a public Playbook share board.

## Script

- `scripts/extract_playbook_pdf_links.mjs`

## Install

```bash
npm init -y
npm i -D playwright
npx playwright install chromium
```

## Usage

```bash
node scripts/extract_playbook_pdf_links.mjs \
  --url "https://www.playbook.com/s/hawary/BK6BMdRQLhfZGXfXpoHaTZJ7" \
  --out "playbook_pdf_links.txt"
```

Optional flags:

- `--max-idle-rounds` (default: `12`)
- `--scroll-pause-ms` (default: `1200`)

The output file is a newline-delimited list of direct downloadable Playbook PDF URLs (each includes `download=1`), suitable for further ingestion workflows (e.g., Apify pipelines).

---

## Windows PowerShell quick start (fixes your exact errors)

Your logs show three separate issues:

1. **PowerShell execution policy blocks `npm.ps1`/`npx.ps1`.**
2. **You ran commands from `C:\WINDOWS\system32` instead of this repo folder.**
3. **You used Bash line continuations (`\`) in PowerShell.**

Use the exact commands below in **PowerShell**:

```powershell
# 1) Go to this repo (change path if you cloned elsewhere)
cd "C:\path\to\template-marketing-webapp-nextjs"

# 2) Bypass npm/npx PowerShell policy by calling .cmd shims
npm.cmd init -y
npm.cmd i -D playwright
npx.cmd playwright install chromium

# 3) Run extractor as ONE line
node .\scripts\extract_playbook_pdf_links.mjs --url "https://www.playbook.com/s/hawary/BK6BMdRQLhfZGXfXpoHaTZJ7" --out ".\playbook_pdf_links.txt"
```

If you prefer multiline in PowerShell, use backtick (`` ` ``), not `\`:

```powershell
node .\scripts\extract_playbook_pdf_links.mjs `
  --url "https://www.playbook.com/s/hawary/BK6BMdRQLhfZGXfXpoHaTZJ7" `
  --out ".\playbook_pdf_links.txt" `
  --max-idle-rounds 30 `
  --scroll-pause-ms 2000
```

### If you still hit policy errors

Run this once in PowerShell and retry:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

(Or keep using `npm.cmd` / `npx.cmd`, which usually avoids policy issues.)
