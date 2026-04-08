#!/usr/bin/env node

/**
 * Extract PDF links from a public Playbook share page.
 *
 * Usage:
 *   node scripts/extract_playbook_pdf_links.mjs \
 *     --url "https://www.playbook.com/s/hawary/BK6BMdRQLhfZGXfXpoHaTZJ7" \
 *     --out "playbook_pdf_links.txt"
 *
 * Requirements:
 *   npm i -D playwright
 *   npx playwright install chromium
 */

import fs from 'node:fs/promises';
import process from 'node:process';
import { chromium } from 'playwright';

function getArg(flag, fallback = undefined) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return fallback;
  return process.argv[idx + 1];
}

const boardUrl = getArg('--url');
const outPath = getArg('--out', 'playbook_pdf_links.txt');
const maxIdleRounds = Number(getArg('--max-idle-rounds', '12'));
const scrollPauseMs = Number(getArg('--scroll-pause-ms', '1200'));

if (!boardUrl) {
  console.error('Missing required --url argument.');
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

const collected = new Map();

function toDownloadable(url) {
  const u = new URL(url);
  if (u.hostname !== 'www.playbook.com') return null;
  if (!u.searchParams.has('assetToken')) return null;
  u.searchParams.set('download', '1');
  return u.toString();
}

function rememberUrl(rawUrl) {
  try {
    const absolute = new URL(rawUrl, boardUrl).toString();
    const downloadUrl = toDownloadable(absolute);
    if (downloadUrl) {
      collected.set(downloadUrl, { source: 'anchor-or-request' });
    }
  } catch {
    // Ignore malformed URLs
  }
}

page.on('request', (req) => rememberUrl(req.url()));
page.on('response', (res) => rememberUrl(res.url()));

await page.goto(boardUrl, { waitUntil: 'networkidle', timeout: 120000 });

let idleRounds = 0;
let previousCount = 0;

while (idleRounds < maxIdleRounds) {
  const hrefs = await page.$$eval('a[href]', (anchors) => anchors.map((a) => a.href));
  hrefs.forEach((h) => rememberUrl(h));

  await page.mouse.wheel(0, 3000);
  await page.waitForTimeout(scrollPauseMs);

  if (collected.size === previousCount) {
    idleRounds += 1;
  } else {
    idleRounds = 0;
    previousCount = collected.size;
  }
}

const sorted = [...collected.keys()].sort((a, b) => a.localeCompare(b));
await fs.writeFile(outPath, `${sorted.join('\n')}\n`, 'utf8');

console.log(`Extracted ${sorted.length} PDF asset links.`);
console.log(`Saved to: ${outPath}`);

await browser.close();
