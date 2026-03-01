/**
 * Maritime Weather Briefing — Auto-generator
 * Runs daily via GitHub Actions at 07:00 UTC
 *
 * Sources:
 *   Wind / Waves / Pressure  → Windy API (iconEu + gfsWave)
 *   Temp / Rain / Precip     → Open-Meteo (free, no key)
 *   Tides                    → Stormglass.io (optional, 10 req/day free)
 *
 * Outputs:
 *   output/YYYY-MM-DD_lisbon-cascais-briefing.md  (committed to repo)
 *   index.html                                     (GitHub Pages)
 *   Email via SMTP                                 (nodemailer)
 */

'use strict';

const nodemailer = require('nodemailer');
const { marked }  = require('marked');
const fs          = require('fs');
const path        = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────

const CONFIG = {
  lat:       38.682,
  lon:      -9.219,
  elev:      16,
  timezone: 'Europe/Lisbon',
  route:    'Lisbon → Cascais',
  port:     'Lisbon / Tagus Bar',
  windyKey:        process.env.WINDY_API_KEY       || '',
  stormglassKey:   process.env.STORMGLASS_API_KEY  || '',
  smtpHost:        process.env.SMTP_HOST           || '',
  smtpPort:        parseInt(process.env.SMTP_PORT  || '587'),
  smtpUser:        process.env.SMTP_USER           || '',
  smtpPass:        process.env.SMTP_PASS           || '',
  emailTo:         process.env.EMAIL_TO            || '',
};

// ─── Wind helpers ─────────────────────────────────────────────────────────────

const COMPASS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];

function spdKt(u, v)    { return Math.sqrt(u * u + v * v) * 1.94384; }
function dirDeg(u, v)   { return ((Math.atan2(u, v) * 180 / Math.PI) + 360) % 360; }
function dirLabel(deg)  { return COMPASS[Math.round(deg / 22.5) % 16]; }
function beaufort(kt) {
  const limits = [1, 4, 7, 11, 17, 22, 28, 34, 41, 48, 56, 64];
  const b = limits.findIndex(l => kt < l);
  return b === -1 ? 12 : b;
}

// ─── WMO weather code map ─────────────────────────────────────────────────────

const WMO = {
  0: 'Clear sky',        1: 'Mainly clear',     2: 'Partly cloudy',    3: 'Overcast',
  45: 'Fog',             48: 'Icy fog',
  51: 'Light drizzle',   53: 'Drizzle',          55: 'Heavy drizzle',
  61: '🌧 Light rain',   63: '🌧 Moderate rain', 65: '🌧 Heavy rain',
  71: 'Light snow',      73: 'Moderate snow',    75: 'Heavy snow',
  80: 'Rain showers',    81: 'Rain showers',     82: 'Heavy showers',
  95: '⚡ Thunderstorm', 96: '⚡ Storm+hail',    99: '⚡ Storm+hail',
};

function wmoLabel(code) { return WMO[code] || `Code ${code}`; }
function wmoIsDanger(code) { return [95, 96, 99].includes(code); }
function wmoIsRain(code)   { return code >= 61 && code <= 82; }

// ─── API fetchers ─────────────────────────────────────────────────────────────

async function fetchWindy(model, parameters) {
  if (!CONFIG.windyKey) {
    console.warn('WINDY_API_KEY not set — skipping Windy fetch');
    return null;
  }
  const res = await fetch('https://api.windy.com/api/point-forecast/v2', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      lat: CONFIG.lat, lon: CONFIG.lon,
      model, parameters, levels: ['surface'],
      key: CONFIG.windyKey,
    }),
  });
  if (!res.ok) throw new Error(`Windy ${model} HTTP ${res.status}`);
  return res.json();
}

async function fetchOpenMeteo() {
  const params = new URLSearchParams({
    latitude:   CONFIG.lat,
    longitude:  CONFIG.lon,
    elevation:  CONFIG.elev,
    hourly:     'temperature_2m,precipitation_probability,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
    daily:      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,precipitation_probability_mean,rain_sum,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant',
    wind_speed_unit: 'kn',
    timezone:   CONFIG.timezone,
    forecast_days: 7,
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
  return res.json();
}

async function fetchTides() {
  if (!CONFIG.stormglassKey) return null;
  const today    = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const start    = today.toISOString().slice(0, 10) + 'T00:00:00Z';
  const end      = tomorrow.toISOString().slice(0, 10) + 'T00:00:00Z';
  const url = `https://api.stormglass.io/v2/tide/extremes/point?lat=${CONFIG.lat}&lng=${CONFIG.lon}&start=${start}&end=${end}`;
  const res = await fetch(url, { headers: { Authorization: CONFIG.stormglassKey } });
  if (!res.ok) throw new Error(`Stormglass HTTP ${res.status}`);
  return res.json();
}

// ─── Section: TODAY — HOURLY FORECAST ────────────────────────────────────────

function buildHourlyTable(windyIconEu, windyGfs, om) {
  const isTestKey = windyIconEu?.warning?.includes('shuffled');
  const hasWindy  = windyIconEu?.ts?.length > 0;
  const hasGfs    = windyGfs?.ts?.length > 0;

  const windyNote = hasWindy
    ? (isTestKey
        ? 'ICON-EU: **Windy API** (3-hourly, ⚠ test key — values shuffled, not reliable)'
        : 'ICON-EU: **Windy API** (3-hourly ✓) · GFS cross-check enabled')
    : 'Wind: **Open-Meteo** (Windy key not configured)';

  // Build Open-Meteo lookup keyed by local datetime string (YYYY-MM-DDTHH:MM)
  const omByTime = {};
  om.hourly.time.forEach((t, i) => {
    omByTime[t] = {
      temp: om.hourly.temperature_2m[i],
      pp:   om.hourly.precipitation_probability[i],
      rain: om.hourly.rain[i],
      spd:  om.hourly.wind_speed_10m[i],
      dir:  om.hourly.wind_direction_10m[i],
      gust: om.hourly.wind_gusts_10m[i],
    };
  });

  // Build GFS lookup keyed by local datetime string
  const gfsByTime = {};
  if (hasGfs) {
    windyGfs.ts.forEach((ts, i) => {
      const localStr = new Date(ts).toLocaleString('sv-SE', { timeZone: CONFIG.timezone })
                                   .replace(' ', 'T').slice(0, 16);
      gfsByTime[localStr] = {
        spd: spdKt(windyGfs['wind_u-surface'][i], windyGfs['wind_v-surface'][i]),
        dir: dirDeg(windyGfs['wind_u-surface'][i], windyGfs['wind_v-surface'][i]),
      };
    });
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const rows = [];

  if (hasWindy) {
    windyIconEu.ts.forEach((ts, i) => {
      const localStr = new Date(ts).toLocaleString('sv-SE', { timeZone: CONFIG.timezone })
                                   .replace(' ', 'T').slice(0, 16);
      if (localStr.slice(0, 10) !== todayStr) return;

      const spd  = spdKt(windyIconEu['wind_u-surface'][i], windyIconEu['wind_v-surface'][i]);
      const dir  = dirDeg(windyIconEu['wind_u-surface'][i], windyIconEu['wind_v-surface'][i]);
      const gust = windyIconEu['gust-surface'][i] * 1.94384;
      const om3  = omByTime[localStr] || {};
      const gfs3 = gfsByTime[localStr] || null;

      rows.push({
        time: localStr.slice(11, 16),
        temp: om3.temp ?? null,
        pp:   om3.pp   ?? null,
        rain: om3.rain ?? null,
        spd, dir, gust,
        bf:   beaufort(spd),
        dl:   dirLabel(dir),
        gfsSpd: gfs3?.spd ?? null,
        gfsDl:  gfs3 ? dirLabel(gfs3.dir) : null,
      });
    });
  } else {
    om.hourly.time.forEach((t, i) => {
      if (!t.startsWith(todayStr)) return;
      const spd = om.hourly.wind_speed_10m[i];
      const dir = om.hourly.wind_direction_10m[i];
      rows.push({
        time: t.slice(11, 16),
        temp: om.hourly.temperature_2m[i],
        pp:   om.hourly.precipitation_probability[i],
        rain: om.hourly.rain[i],
        spd, dir,
        gust: om.hourly.wind_gusts_10m[i],
        bf:   beaufort(spd),
        dl:   dirLabel(dir),
        gfsSpd: null,
        gfsDl:  null,
      });
    });
  }

  if (!rows.length) return `## TODAY — HOURLY FORECAST\n\n> ⚠ No data for today.\n`;

  const peakIdx = rows.reduce((b, r, i) => r.spd > rows[b].spd ? i : b, 0);
  const fv = (v, suffix, dp = 1) => v != null ? v.toFixed(dp) + suffix : '—';

  // Delta between ICON-EU and GFS — flag if divergence > 5kt
  const fDelta = (iconSpd, gfsSpd) => {
    if (gfsSpd == null) return '—';
    const d = gfsSpd - iconSpd;
    const sign = d >= 0 ? '+' : '';
    return Math.abs(d) > 5 ? `⚠ ${sign}${d.toFixed(1)}` : `${sign}${d.toFixed(1)}`;
  };

  const header = [
    `## TODAY — HOURLY FORECAST`,
    ``,
    `> ${windyNote} · Temp / Precip / Rain: **Open-Meteo** (live)`,
    `> Δkt = GFS minus ICON-EU — divergence ⚠ >5kt signals low forecast confidence.`,
    ``,
    `| Time  | Temp    | ICON-EU Dir     | ICON (kt) | Gust (kt) | BFT  | GFS Dir  | GFS (kt) | Δkt   | Precip % | Rain (mm) |`,
    `|-------|---------|-----------------|-----------|-----------|------|----------|----------|-------|----------|-----------|`,
  ];

  const tableRows = rows.map((r, i) => {
    const p = i === peakIdx;
    const b = s => p ? `**${s}**` : s;
    return `| ${b(r.time)}  | ${b(fv(r.temp, '°C'))}  | ${b(String(Math.round(r.dir)).padStart(3) + '° ' + r.dl.padEnd(5))} | ${b(fv(r.spd, 'kt'))} | ${b(fv(r.gust, 'kt'))} | ${b('F' + r.bf)} | ${b(r.gfsDl ? r.gfsDl.padEnd(5) : '—')} | ${b(fv(r.gfsSpd, 'kt'))} | ${b(fDelta(r.spd, r.gfsSpd))} | ${b(r.pp != null ? r.pp + '%' : '—')} | ${b(fv(r.rain, 'mm'))} |`;
  });

  const peak    = rows[peakIdx];
  const temps   = rows.map(r => r.temp).filter(t => t != null);
  const minTemp = temps.length ? Math.min(...temps).toFixed(1) : '—';
  const maxTemp = temps.length ? Math.max(...temps).toFixed(1) : '—';
  const totalR  = rows.reduce((s, r) => s + (r.rain ?? 0), 0).toFixed(1);
  const dirEvo  = [...new Set(rows.map(r => r.dl))].join(' → ');
  const maxDelta = rows
    .filter(r => r.gfsSpd != null)
    .reduce((m, r) => Math.max(m, Math.abs(r.gfsSpd - r.spd)), 0);

  const summary = [
    ``,
    `**Wind summary**: Peak ${fv(peak.spd, 'kt')} from ${Math.round(peak.dir)}° ${peak.dl} ` +
    `at ${peak.time}, gusting ${fv(peak.gust, 'kt')} (F${peak.bf}). ` +
    `Direction: ${dirEvo}. ` +
    (hasGfs ? `Max model spread: **${maxDelta.toFixed(1)}kt** (ICON-EU vs GFS${maxDelta > 5 ? ' — ⚠ low confidence' : ' — models agree'})${maxDelta > 5 ? ', plan for the stronger figure' : ''}. ` : '') +
    (parseFloat(totalR) > 0 ? `Total rain: ${totalR}mm. ` : `Zero precipitation. `) +
    `Temperature: **${minTemp}°C** (min) → **${maxTemp}°C** (max).`,
  ];

  return [...header, ...tableRows, ...summary].join('\n');
}

// ─── Section: TIDES ───────────────────────────────────────────────────────────

// Stormglass returns heights above MSL. Portuguese charts and Porto de Lisboa
// use Zero Hidrográfico (ZH), which sits 2.08m below MSL at Cascais.
// Adding this offset converts Stormglass values to the ZH datum.
const ZH_OFFSET = 2.08;

function buildTidalSection(tidesData) {
  const lines = [`## TIDES — ${CONFIG.port}`, ``];

  if (!tidesData?.data?.length) {
    lines.push(
      `> ⚠ Tidal data unavailable. Add \`STORMGLASS_API_KEY\` to GitHub Secrets for automated tides.`,
      `> Cross-check: [Tides4Fishing Lisboa](https://tides4fishing.com/pt/lisboa/lisboa) · [Porto de Lisboa](https://www.portodelisboa.pt/mares)`,
      ``,
      `\`\`\``,
      `HW1: --:-- — ?.?m`,
      `LW:  --:-- — ?.?m`,
      `HW2: --:-- — ?.?m`,
      `\`\`\``,
    );
    return lines.join('\n');
  }

  const tides = [...tidesData.data].sort((a, b) => new Date(a.time) - new Date(b.time));
  const highs = tides.filter(t => t.type === 'high');
  const lows  = tides.filter(t => t.type === 'low');
  const fmt   = ts => new Date(ts).toTimeString().slice(0, 5);
  const zh    = h  => (h + ZH_OFFSET).toFixed(2);

  lines.push(
    `> Heights above **Zero Hidrográfico (ZH)** — same datum as Porto de Lisboa and Portuguese charts.`,
    `> Stormglass model prediction (+2.08 m MSL→ZH offset applied). Always verify against the official source before critical passages.`,
    `> **Official tide table → [Porto de Lisboa — Marés](https://www.portodelisboa.pt/mares)**`,
    ``,
  );

  lines.push('```');
  highs.forEach((h, i) => lines.push(`HW${i + 1}: ${fmt(h.time)} UTC — ${zh(h.height)}m (ZH)`));
  lows.forEach(l  => lines.push(`LW:  ${fmt(l.time)} UTC — ${zh(l.height)}m (ZH)`));

  if (highs.length && lows.length) {
    const range = Math.abs(highs[0].height - lows[0].height).toFixed(2);
    lines.push(`Tidal range: ${range}m`);
  }
  lines.push('```', ``);

  // Tidal stream table (computed relative to first HW)
  if (highs.length) {
    const hwMs   = new Date(highs[0].time).getTime();
    const lwMs   = lows.length ? new Date(lows[0].time).getTime() : null;
    const hw2Ms  = highs.length > 1 ? new Date(highs[1].time).getTime() : null;
    const toHHMM = ms => new Date(ms).toTimeString().slice(0, 5);

    lines.push(
      `| Time          | Stream                | Passage note                           |`,
      `|---------------|-----------------------|----------------------------------------|`,
      `| ${toHHMM(hwMs - 7200000)} | Flood at peak         | Assists entry to estuary               |`,
      `| ${toHHMM(hwMs)}           | HW slack              | Cross bars and shallows — timing key   |`,
      `| ${toHHMM(hwMs + 7200000)} | Ebb building          | Assists exit from estuary → sea        |`,
    );
    if (lwMs) {
      lines.push(
        `| ${toHHMM(lwMs - 7200000)} | Ebb at peak           | Fast exit — bar active, wind/tide risk |`,
        `| ${toHHMM(lwMs)}           | LW slack              | Calmest bar crossing window            |`,
      );
    }
    if (hw2Ms) {
      lines.push(
        `| ${toHHMM(hw2Ms)}          | HW2 — flood building  | Comfortable return bar entry           |`,
      );
    }
  }

  return lines.join('\n');
}

// ─── Section: MULTI-DAY FORECAST ─────────────────────────────────────────────

function buildMultiDayTable(om) {
  const d = om.daily;
  const lines = [
    `## MULTI-DAY FORECAST (Open-Meteo — Live Data)`,
    ``,
    `| Date          | Condition             | Max°C | Min°C | Rain % | Precip (mm) | Wind Max (kt) | Gust Max (kt) | Dom. Dir      |`,
    `|---------------|-----------------------|-------|-------|--------|-------------|---------------|---------------|---------------|`,
  ];

  const flags = [];

  d.time.forEach((date, i) => {
    const label     = new Date(date).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
    const wmo       = d.weather_code[i];
    const condition = wmoLabel(wmo);
    const pp        = d.precipitation_probability_max[i];
    const bold      = pp >= 50;
    const b         = s => bold ? `**${s}**` : s;
    const dl        = dirLabel(d.wind_direction_10m_dominant[i]);

    lines.push(
      `| ${b(label.padEnd(13))} | ${b(condition.padEnd(21))} | ${b(d.temperature_2m_max[i].toFixed(1))} | ${b(d.temperature_2m_min[i].toFixed(1))} | ${b(pp + '%')} | ${b(d.precipitation_sum[i].toFixed(1))} | ${b(d.wind_speed_10m_max[i].toFixed(1))} | ${b(d.wind_gusts_10m_max[i].toFixed(1))} | ${b(d.wind_direction_10m_dominant[i] + '° ' + dl)} |`
    );

    if (wmoIsDanger(wmo)) {
      flags.push(`⚡ **${label} — DO NOT SAIL**: Thunderstorm (WMO ${wmo}), ${pp}% probability.`);
    }
  });

  if (flags.length) { lines.push('', ...flags); }

  const settled   = d.time.filter((_, i) => d.precipitation_probability_max[i] < 20 && d.wind_speed_10m_max[i] < 15).length;
  const worstGust = Math.max(...d.wind_gusts_10m_max).toFixed(1);
  const worstDay  = d.time[d.wind_gusts_10m_max.indexOf(Math.max(...d.wind_gusts_10m_max))];
  const worstLabel = new Date(worstDay).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });

  lines.push(
    ``,
    `**Week reading**: ${settled} of 7 days settled (rain <20%, wind <15kt). ` +
    `Peak gust this week: **${worstGust}kt** on ${worstLabel}. ` +
    `Confidence high D+0–D+2, indicative only beyond 72 hrs.`,
  );

  return lines.join('\n');
}

// ─── HTML page (GitHub Pages) ─────────────────────────────────────────────────

function buildPageHtml(date, hourlyMd, tidalMd, multiMd, reportFilename) {
  const sections = [
    { id: 'hourly', content: hourlyMd },
    { id: 'tides',  content: tidalMd  },
    { id: 'multi',  content: multiMd  },
  ];

  const renderedSections = sections
    .map(s => `<section id="${s.id}">${marked.parse(s.content)}</section>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Maritime Briefing — ${date}</title>
  <style>
    :root {
      --sea:   #0a3d62;
      --sky:   #1e90ff;
      --foam:  #f0f8ff;
      --warn:  #e67e22;
      --rain:  #2980b9;
      --storm: #c0392b;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: var(--foam);
      color: #1a1a2e;
      line-height: 1.5;
    }
    header {
      background: var(--sea);
      color: white;
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    header h1  { font-size: 1.3rem; font-weight: 700; letter-spacing: 0.04em; }
    header p   { font-size: 0.82rem; opacity: 0.75; margin-top: 0.2rem; }
    .badge     {
      font-size: 0.72rem;
      background: var(--sky);
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      white-space: nowrap;
    }
    main { max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem; display: grid; gap: 1rem; }
    section {
      background: white;
      border-radius: 10px;
      padding: 1.5rem 1.75rem;
      box-shadow: 0 1px 6px rgba(0,0,0,0.07);
      overflow-x: auto;
    }
    h2 {
      color: var(--sea);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding-bottom: 0.6rem;
      margin-bottom: 1rem;
      border-bottom: 2px solid var(--sky);
    }
    table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
    th    { background: #f0f8ff; color: var(--sea); font-weight: 600; text-align: left; padding: 0.5rem 0.75rem; border-bottom: 2px solid #d0e8f8; white-space: nowrap; }
    td    { padding: 0.4rem 0.75rem; border-bottom: 1px solid #eef2f7; white-space: nowrap; }
    tr:hover td { background: #f7fbff; }
    tr strong td, td strong { color: var(--sea); font-weight: 700; }
    blockquote {
      background: #fff9e6;
      border-left: 3px solid #f9a825;
      padding: 0.6rem 1rem;
      border-radius: 0 6px 6px 0;
      font-size: 0.83rem;
      margin: 0.5rem 0 1rem;
      color: #5d4037;
    }
    blockquote strong { color: inherit; }
    pre  {
      background: #1a1a2e;
      color: #a8d8ea;
      padding: 1rem 1.25rem;
      border-radius: 6px;
      font-size: 0.8rem;
      overflow-x: auto;
      white-space: pre;
    }
    p    { font-size: 0.87rem; margin-top: 0.75rem; color: #444; }
    p strong { color: var(--sea); }
    footer {
      text-align: center;
      font-size: 0.75rem;
      color: #888;
      padding: 1.5rem;
    }
    footer a { color: var(--sky); }
    @media (max-width: 640px) {
      header { padding: 1rem; }
      section { padding: 1rem; }
    }
  </style>
</head>
<body>

<header>
  <div>
    <h1>⚓ Maritime Weather Briefing</h1>
    <p>${CONFIG.route} &nbsp;·&nbsp; ${date} &nbsp;·&nbsp; ${CONFIG.lat}°N, ${Math.abs(CONFIG.lon)}°W</p>
  </div>
  <span class="badge">Generated ${new Date().toISOString().replace('T', ' ').slice(0, 16)} UTC</span>
</header>

<main>
  ${renderedSections}
</main>

<footer>
  Data: <strong>Windy API</strong> (wind/waves) + <strong>Open-Meteo</strong> (temp/rain) + <strong>Stormglass</strong> (tides if configured)
  &nbsp;·&nbsp; <a href="output/${reportFilename}">Full markdown report</a>
  &nbsp;·&nbsp; Generated by maritime-weather skill
</footer>

</body>
</html>`;
}

// ─── Email (SMTP) ─────────────────────────────────────────────────────────────

function buildEmailHtml(date, hourlyMd, tidalMd, multiMd) {
  const base = `font-family:Arial,sans-serif;font-size:13px;color:#1a1a2e;`;
  const h2s  = `font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0a3d62;border-bottom:2px solid #1e90ff;padding-bottom:5px;margin:20px 0 12px;`;
  const tds  = `padding:5px 8px;border-bottom:1px solid #e8edf2;white-space:nowrap;`;
  const ths  = `${tds}background:#f0f8ff;font-weight:700;color:#0a3d62;`;

  function mdToEmailTable(md) {
    const rows = md.split('\n').filter(l => l.startsWith('|') && !l.match(/^\|[-| :]+\|$/));
    if (!rows.length) return '';
    const [head, ...body] = rows;
    const ths_row = head.split('|').slice(1, -1).map(c => `<th style="${ths}">${c.trim().replace(/\*\*/g, '')}</th>`).join('');
    const trs = body.map(r => {
      const cells = r.split('|').slice(1, -1).map(c => `<td style="${tds}">${c.trim().replace(/\*\*/g, '')}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table style="width:100%;border-collapse:collapse;">${ths_row ? `<thead><tr>${ths_row}</tr></thead>` : ''}<tbody>${trs}</tbody></table>`;
  }

  function section(title, md) {
    const table   = mdToEmailTable(md);
    const note    = md.split('\n').filter(l => l.startsWith('>')).map(l =>
      `<div style="background:#fff9e6;border-left:3px solid #f9a825;padding:6px 10px;font-size:11px;margin:6px 0;">${l.replace(/^> /, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</div>`
    ).join('');
    const summary = md.split('\n').find(l => l.startsWith('**Wind summary') || l.startsWith('**Week reading')) || '';
    return `<h2 style="${h2s}">${title}</h2>${note}${table}${summary ? `<p style="font-size:11px;color:#555;margin-top:8px;">${summary.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>` : ''}`;
  }

  const body = [
    section('Today — Hourly Forecast', hourlyMd),
    section('Tides',                   tidalMd),
    section('Multi-Day Forecast',      multiMd),
  ].join('<hr style="border:none;border-top:1px solid #e8edf2;margin:16px 0;">');

  return `<div style="${base}max-width:680px;margin:0 auto;">
  <div style="background:#0a3d62;color:white;padding:18px 22px;border-radius:8px 8px 0 0;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:8px;">
    <div>
      <div style="font-size:17px;font-weight:700;">⚓ Maritime Weather Briefing</div>
      <div style="font-size:11px;opacity:0.75;margin-top:3px;">${CONFIG.route} &nbsp;·&nbsp; ${date} &nbsp;·&nbsp; ${CONFIG.lat}°N, ${Math.abs(CONFIG.lon)}°W</div>
    </div>
    <a href="https://martinsda.github.io/maritime-weather/" style="font-size:11px;color:white;background:rgba(255,255,255,0.15);padding:5px 12px;border-radius:20px;text-decoration:none;white-space:nowrap;">View online →</a>
  </div>
  <div style="background:white;padding:20px 22px;border-radius:0 0 8px 8px;border:1px solid #dde4ed;">
    ${body}
    <hr style="border:none;border-top:1px solid #e8edf2;margin:20px 0 10px;">
    <p style="font-size:10px;color:#aaa;">Generated ${new Date().toISOString().replace('T', ' ').slice(0, 16)} UTC · maritime-weather skill · Windy API + Open-Meteo · Reply to unsubscribe.</p>
  </div>
</div>`;
}

async function sendEmail(date, html) {
  console.log(`  SMTP config: host=${CONFIG.smtpHost} port=${CONFIG.smtpPort} user=${CONFIG.smtpUser} to=${CONFIG.emailTo}`);

  const transporter = nodemailer.createTransport({
    host:   CONFIG.smtpHost,
    port:   CONFIG.smtpPort,
    secure: CONFIG.smtpPort === 465,
    auth:   { user: CONFIG.smtpUser, pass: CONFIG.smtpPass },
    debug:  true,
    logger: true,
  });

  await transporter.verify();
  console.log('  SMTP connection verified ✓');

  const info = await transporter.sendMail({
    from:    `"Maritime Briefing ⚓" <${CONFIG.smtpUser}>`,
    to:      CONFIG.emailTo,
    subject: `⚓ Maritime Briefing — ${date}`,
    html,
  });

  console.log(`✓ Email sent → ${CONFIG.emailTo}`);
  console.log(`  Message ID : ${info.messageId}`);
  console.log(`  Response   : ${info.response}`);
  console.log(`  Accepted   : ${info.accepted}`);
  console.log(`  Rejected   : ${info.rejected}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  console.log(`\n⚓ Generating maritime briefing for ${today}...\n`);

  // Fetch all data in parallel — individual failures are non-fatal
  const [iconEu, gfs, , openMeteo, tides] = await Promise.all([
    fetchWindy('iconEu',  ['wind', 'windGust', 'pressure', 'temp']).catch(e => { console.warn('  ✗ Windy iconEu:', e.message);  return null; }),
    fetchWindy('gfs',     ['wind', 'windGust']).catch(e =>                      { console.warn('  ✗ Windy GFS:', e.message);     return null; }),
    fetchWindy('gfsWave', ['waves', 'swell1', 'swell2']).catch(e =>             { console.warn('  ✗ Windy gfsWave:', e.message); return null; }),
    fetchOpenMeteo().catch(e =>                                                  { throw new Error('Open-Meteo failed: ' + e.message); }),
    fetchTides().catch(e =>                                                      { console.warn('  ✗ Stormglass:', e.message);    return null; }),
  ]);

  console.log(`  ✓ Open-Meteo   — ${openMeteo.hourly.time.length} hourly steps`);
  if (iconEu)  console.log(`  ✓ Windy iconEu — ${iconEu.ts.length} steps${iconEu.warning ? ' ⚠ test key' : ''}`);
  if (gfs)     console.log(`  ✓ Windy GFS    — ${gfs.ts.length} steps${gfs.warning ? ' ⚠ test key' : ''}`);
  if (tides)   console.log(`  ✓ Stormglass   — ${tides.data?.length} tidal extremes`);

  // Build the three automated sections
  const hourlyMd = buildHourlyTable(iconEu, gfs, openMeteo);
  const tidalMd  = buildTidalSection(tides);
  const multiMd  = buildMultiDayTable(openMeteo);

  // Assemble full markdown report
  const dateLabel  = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const filename   = `${today}_lisbon-cascais-briefing.md`;
  const fullReport = [
    `# MARITIME WEATHER BRIEFING`,
    `**Date**: ${dateLabel}`,
    `**Route**: ${CONFIG.route}`,
    `**Base coordinates**: ${CONFIG.lat}°N, ${Math.abs(CONFIG.lon)}°W | Elevation: ${CONFIG.elev}m`,
    `**Web**: [martinsda.github.io/maritime-weather](https://martinsda.github.io/maritime-weather/)`,
    ``,
    `---`,
    ``,
    hourlyMd,
    ``,
    `---`,
    ``,
    tidalMd,
    ``,
    `---`,
    ``,
    multiMd,
    ``,
    `---`,
    ``,
    `## SOURCES`,
    ``,
    `| Source | Type | Endpoint |`,
    `|--------|------|----------|`,
    `| Windy API / iconEu | Wind, pressure, temp | \`api.windy.com/api/point-forecast/v2\` |`,
    `| Windy API / gfsWave | Waves, swell | \`api.windy.com/api/point-forecast/v2\` |`,
    `| Open-Meteo | Temp, rain, precip probability | \`api.open-meteo.com/v1/forecast\` |`,
    `| Stormglass.io | Tidal extremes | \`api.stormglass.io/v2/tide/extremes/point\` |`,
    ``,
    `*Generated: ${new Date().toISOString()} UTC*`,
  ].join('\n');

  // Save markdown
  const outDir = path.join(process.cwd(), 'output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, filename), fullReport, 'utf8');
  console.log(`\n  ✓ Saved → output/${filename}`);

  // Save GitHub Pages HTML
  const pageHtml = buildPageHtml(today, hourlyMd, tidalMd, multiMd, filename);
  fs.writeFileSync(path.join(process.cwd(), 'index.html'), pageHtml, 'utf8');
  console.log(`  ✓ Saved → index.html`);

  // Send email
  if (CONFIG.smtpHost && CONFIG.smtpUser && CONFIG.smtpPass && CONFIG.emailTo) {
    const emailHtml = buildEmailHtml(today, hourlyMd, tidalMd, multiMd);
    await sendEmail(today, emailHtml);
  } else {
    console.log(`  ✗ Email skipped — SMTP_HOST / SMTP_USER / SMTP_PASS / EMAIL_TO not all set`);
  }

  console.log(`\n⚓ Done.\n`);
}

main().catch(err => {
  console.error('\n✗ Fatal:', err.message);
  process.exit(1);
});
