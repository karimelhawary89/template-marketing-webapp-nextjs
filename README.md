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
