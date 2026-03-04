/**
 * parse-tides-pdf.mjs
 *
 * One-time script: downloads the official Porto de Lisboa tide table PDF
 * and produces data/tides-YYYY.json with all HW/LW predictions for the year.
 *
 * Run annually:
 *   node scripts/parse-tides-pdf.mjs
 *
 * Source: https://www.portodelisboa.pt/mares
 * Heights are in metres above Zero Hidrográfico (ZH) — Portuguese chart datum.
 * Times are UTC.
 */

import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PDF_URL =
  'https://www.portodelisboa.pt/documents/20121/239129/Tabela+de+Mar%C3%A9s+2026-+Porto+de+Lisboa.pdf/a6807595-d690-9b8f-744f-52a732e6d080?t=1765534108118';
const YEAR      = 2026;
const LOCAL_PDF = join(__dirname, '..', `tabela-mares-${YEAR}.pdf`);
const OUT_JSON  = join(__dirname, '..', 'data', `tides-${YEAR}.json`);

const MONTHS_PT = [
  'janeiro','fevereiro','março','abril','maio','junho',
  'julho','agosto','setembro','outubro','novembro','dezembro',
];

const TIME_RE   = /^\d{2}[:.]\d{2}$/;
const HEIGHT_RE = /^\d{1,2}[,.]?\d?$/;  // "3,7" | "0,8" | "1" | "1,1"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normaliseTime(s) { return s.replace('.', ':'); }
function parseHeight(s)   { return parseFloat(s.replace(',', '.')); }

function isTime(s)   { return TIME_RE.test(s); }
function isHeight(s) { return HEIGHT_RE.test(s) && !isTime(s); }

/** Group PDF text items by Y-coordinate (±tolerance pixels). */
function groupByY(items, tol = 8) {
  const groups = [];
  for (const item of items) {
    const g = groups.find(g => Math.abs(g.y - item.y) <= tol);
    if (g) g.items.push(item);
    else   groups.push({ y: item.y, items: [item] });
  }
  return groups;
}

/** Assign each X value to one of 6 column centres (nearest centre wins). */
function assignToCol(x, centres) {
  let best = 0, bestDist = Infinity;
  centres.forEach((cx, i) => {
    const d = Math.abs(x - cx);
    if (d < bestDist) { bestDist = d; best = i; }
  });
  return best;
}

// ─── Core parser ──────────────────────────────────────────────────────────────

async function parsePage(pdf, pageNum) {
  const page    = await pdf.getPage(pageNum);
  const content = await page.getTextContent();

  const items = content.items
    .map(i => ({ str: i.str.trim(), x: i.transform[4], y: i.transform[5] }))
    .filter(i => i.str.length > 0);

  // ── Identify the 3 months shown on this page ──────────────────────────────
  const pageMonths = [];
  for (const it of items) {
    const lc  = it.str.toLowerCase().replace(/\s+/g, '');
    const idx = MONTHS_PT.indexOf(lc);
    if (idx >= 0) pageMonths.push({ monthNum: idx + 1, x: it.x });
  }
  pageMonths.sort((a, b) => a.x - b.x);

  if (pageMonths.length < 3) {
    console.warn(`  Page ${pageNum}: found ${pageMonths.length} months — skipping`);
    return {};
  }
  const months3 = pageMonths.slice(0, 3).map(m => m.monthNum);

  // ── Find all TIME items and determine 6 column X-centres ─────────────────
  const allTimeItems = items.filter(i => isTime(i.str));
  if (!allTimeItems.length) return {};

  // Use the most common X-positions to find the 6 column centres
  // Sort all time-item X values and cluster into 6 groups
  const sortedXs = [...allTimeItems].sort((a, b) => a.x - b.x).map(i => i.x);
  const colCentres = [];
  let cluster = [sortedXs[0]];
  for (let k = 1; k < sortedXs.length; k++) {
    if (sortedXs[k] - sortedXs[k - 1] < 25) {
      cluster.push(sortedXs[k]);
    } else {
      colCentres.push(cluster.reduce((s, v) => s + v, 0) / cluster.length);
      cluster = [sortedXs[k]];
    }
  }
  colCentres.push(cluster.reduce((s, v) => s + v, 0) / cluster.length);

  if (colCentres.length !== 6) {
    console.warn(`  Page ${pageNum}: expected 6 X-clusters, got ${colCentres.length}`);
    return {};
  }

  // ── Per-column extraction anchored by day-number labels ──────────────────
  // Day number labels (1-31) appear just to the left of each time column.
  // Use their Y positions to bracket exactly which time items belong to each day,
  // so missing tide rows in the PDF don't corrupt the day assignment.
  const HEIGHT_TOL = 6;    // ±px Y tolerance to find associated height item

  // Assign every time item to its nearest column centre (no items lost)
  const colTimeArrays = Array.from({ length: 6 }, () => []);
  for (const t of allTimeItems) {
    colTimeArrays[assignToCol(t.x, colCentres)].push(t);
  }

  const colHeights = items.filter(i => isHeight(i.str));
  const result = {};

  for (let col = 0; col < 6; col++) {
    const cx    = colCentres[col];
    const month = months3[Math.floor(col / 2)];

    // Find day-number labels: text "1"-"31" appearing 5-35px left of this column
    const rawLabels = items.filter(i =>
      /^\d{1,2}$/.test(i.str) &&
      i.x >= cx - 35 && i.x <= cx - 5 &&
      parseInt(i.str) >= 1 && parseInt(i.str) <= 31
    );

    // Deduplicate (same day at same Y appears multiple times in PDF text layer)
    const seen = new Set();
    const dayLabels = rawLabels
      .filter(i => { const k = `${i.str}-${Math.round(i.y)}`; return seen.has(k) ? false : (seen.add(k), true); })
      .sort((a, b) => b.y - a.y);   // descending Y = chronological (top of page first)

    if (!dayLabels.length) continue;

    // Sort time items for this column top→bottom
    const colTimes = colTimeArrays[col].sort((a, b) => b.y - a.y);

    // For each day label, collect its tide events using Y boundaries
    // Boundary between days = midpoint of consecutive label Y values
    for (let i = 0; i < dayLabels.length; i++) {
      const label   = dayLabels[i];
      const yTop    = i === 0 ? label.y + 30 : (dayLabels[i - 1].y + label.y) / 2;
      const yBottom = i === dayLabels.length - 1 ? label.y - 30 : (label.y + dayLabels[i + 1].y) / 2;

      const dayTimes = colTimes
        .filter(t => t.y <= yTop && t.y >= yBottom)
        .sort((a, b) => b.y - a.y);

      if (!dayTimes.length) continue;

      const events = dayTimes.map(t => {
        const h = colHeights
          .filter(h => Math.abs(h.y - t.y) <= HEIGHT_TOL && h.x > t.x && h.x < t.x + 60)
          .sort((a, b) => a.x - b.x)[0];
        return { time: normaliseTime(t.str), height: h ? parseHeight(h.str) : null };
      });

      const [hw1, lw1, hw2, lw2] = events;
      if (!hw1?.time) continue;

      const day     = parseInt(label.str);
      const dateStr = `${YEAR}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

      // Validate calendar date
      const dt = new Date(`${dateStr}T00:00:00Z`);
      if (dt.getUTCFullYear() !== YEAR || dt.getUTCMonth() + 1 !== month || dt.getUTCDate() !== day) continue;

      result[dateStr] = { HW1: hw1, LW1: lw1, HW2: hw2, LW2: lw2 };
    }
  }

  const m = months3.map(n => MONTHS_PT[n - 1]).join(', ');
  console.log(`  Page ${pageNum} [${m}]: ${Object.keys(result).length} days parsed`);
  return result;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Download or use local copy
  let pdfData;
  if (existsSync(LOCAL_PDF)) {
    console.log(`Using local PDF: ${LOCAL_PDF}`);
    pdfData = new Uint8Array(readFileSync(LOCAL_PDF));
  } else {
    console.log(`Downloading PDF from Porto de Lisboa…`);
    const res = await fetch(PDF_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    pdfData = new Uint8Array(await res.arrayBuffer());
    writeFileSync(LOCAL_PDF, Buffer.from(pdfData));
    console.log(`Saved to ${LOCAL_PDF}`);
  }

  const pdf = await getDocument({ data: pdfData }).promise;
  console.log(`PDF loaded — ${pdf.numPages} pages`);

  let allTides = {};
  for (let p = 2; p <= pdf.numPages; p++) {
    const pageTides = await parsePage(pdf, p);
    allTides = { ...allTides, ...pageTides };
  }

  // Sort by date
  allTides = Object.fromEntries(Object.entries(allTides).sort());

  const total = Object.keys(allTides).length;
  console.log(`\nTotal: ${total} days`);

  // ── Verification against known official values ────────────────────────────
  const KNOWN = {
    [`${YEAR}-03-03`]: { HW1:'03:04', LW1:'09:03', HW2:'15:26', LW2:'21:12' },
    [`${YEAR}-03-04`]: { HW1:'03:42', LW1:'09:38', HW2:'16:01', LW2:'21:46' },
  };
  console.log('\nVerification:');
  for (const [date, expected] of Object.entries(KNOWN)) {
    const got = allTides[date];
    if (!got) { console.error(`  ✗ MISSING ${date}`); continue; }
    const ok =
      got.HW1.time === expected.HW1 && got.LW1.time === expected.LW1 &&
      got.HW2.time === expected.HW2 && got.LW2.time === expected.LW2;
    const sym = ok ? '✓' : '✗';
    console.log(`  ${sym} ${date}: HW1=${got.HW1.time}(${got.HW1.height}m) LW1=${got.LW1.time}(${got.LW1.height}m) HW2=${got.HW2.time}(${got.HW2.height}m) LW2=${got.LW2.time}(${got.LW2.height}m)`);
  }

  mkdirSync(join(__dirname, '..', 'data'), { recursive: true });
  writeFileSync(OUT_JSON, JSON.stringify(allTides, null, 2));
  console.log(`\nWritten → ${OUT_JSON}`);
}

main().catch(e => { console.error(e); process.exit(1); });
