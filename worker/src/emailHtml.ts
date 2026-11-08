import { CONFIG } from "./config";

export function buildEmailHtml(date: string, hourlyMd: string, tidalMd: string, multiMd: string): string {
	const base = `font-family:Arial,sans-serif;font-size:13px;color:#1a1a2e;`;
	const h2s = `font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0a3d62;border-bottom:2px solid #1e90ff;padding-bottom:5px;margin:20px 0 12px;`;
	const tds = `padding:5px 8px;border-bottom:1px solid #e8edf2;white-space:nowrap;`;
	const ths = `${tds}background:#f0f8ff;font-weight:700;color:#0a3d62;`;

	// Extracts only the FIRST contiguous markdown table block
	function mdToEmailTable(md: string): string {
		const lines = md.split("\n");
		const rows: string[] = [];
		let collecting = false;
		for (const l of lines) {
			if (l.match(/^\|[-| :]+\|$/)) continue; // skip separator rows
			if (l.startsWith("|")) {
				collecting = true;
				rows.push(l);
			} else if (collecting) {
				break; // stop after first table
			}
		}
		if (!rows.length) return "";
		const [head, ...body] = rows;
		const ths_row = head
			.split("|")
			.slice(1, -1)
			.map((c) => `<th style="${ths}">${c.trim().replace(/\*\*/g, "")}</th>`)
			.join("");
		const trs = body
			.map((r) => {
				const cells = r
					.split("|")
					.slice(1, -1)
					.map((c) => `<td style="${tds}">${c.trim().replace(/\*\*/g, "")}</td>`)
					.join("");
				return `<tr>${cells}</tr>`;
			})
			.join("");
		return `<table style="width:100%;border-collapse:collapse;">${ths_row ? `<thead><tr>${ths_row}</tr></thead>` : ""}<tbody>${trs}</tbody></table>`;
	}

	// Renders fenced code blocks (``` ... ```) as styled pre elements
	function mdCodeBlock(md: string): string {
		const m = md.match(/```\n([\s\S]+?)\n```/);
		if (!m) return "";
		return `<pre style="background:#1a1a2e;color:#a8d8ea;padding:10px 14px;border-radius:6px;font-size:11px;font-family:monospace;margin:8px 0;line-height:1.6;">${m[1]}</pre>`;
	}

	function section(title: string, md: string): string {
		const table = mdToEmailTable(md);
		const code = mdCodeBlock(md);
		const note = md
			.split("\n")
			.filter((l) => l.startsWith(">"))
			.map(
				(l) =>
					`<div style="background:#fff9e6;border-left:3px solid #f9a825;padding:6px 10px;font-size:11px;margin:6px 0;">${l.replace(/^> /, "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</div>`,
			)
			.join("");
		const summary = md.split("\n").find((l) => l.startsWith("**Wind summary") || l.startsWith("**Week reading")) || "";
		return `<h2 style="${h2s}">${title}</h2>${note}${code}${table}${summary ? `<p style="font-size:11px;color:#555;margin-top:8px;">${summary.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>` : ""}`;
	}

	const body = [
		section("Today — Hourly Forecast", hourlyMd),
		section("Tides", tidalMd),
		section("Multi-Day Forecast", multiMd),
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
    <p style="font-size:10px;color:#aaa;">Generated ${new Date().toISOString().replace("T", " ").slice(0, 16)} UTC · maritime-weather skill · Windy API + Open-Meteo · Reply to unsubscribe.</p>
  </div>
</div>`;
}
