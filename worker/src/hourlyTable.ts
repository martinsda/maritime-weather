import { CONFIG } from "./config";
import { spdKt, dirDeg, dirLabel, beaufort } from "./windHelpers";

export function buildHourlyTable(windyIconEu: any, ecmwf: any, om: any): string {
	const isTestKey = windyIconEu?.warning?.includes("shuffled");
	const hasWindy = windyIconEu?.ts?.length > 0;
	const hasEcmwf = ecmwf?.hourly?.time?.length > 0;
	const hasEcmwfGust = hasEcmwf && ecmwf.hourly.wind_gusts_10m?.some((v: number | null) => v != null);

	const todayStr = new Date().toISOString().slice(0, 10);

	// Open-Meteo lookup (temp / precip / gust fallback)
	const omByTime: Record<string, any> = {};
	om.hourly.time.forEach((t: string, i: number) => {
		omByTime[t] = {
			temp: om.hourly.temperature_2m[i],
			pp: om.hourly.precipitation_probability[i],
			rain: om.hourly.precipitation[i],
			gust: om.hourly.wind_gusts_10m[i],
		};
	});

	// ECMWF lookup (primary wind source)
	const ecmwfByTime: Record<string, any> = {};
	if (hasEcmwf) {
		ecmwf.hourly.time.forEach((t: string, i: number) => {
			ecmwfByTime[t] = {
				spd: ecmwf.hourly.wind_speed_10m[i],
				dir: ecmwf.hourly.wind_direction_10m[i],
				gust: ecmwf.hourly.wind_gusts_10m?.[i] ?? null,
			};
		});
	}

	// ICON-EU lookup (auxiliary / gust fallback)
	const iconByTime: Record<string, any> = {};
	if (hasWindy) {
		windyIconEu.ts.forEach((ts: number, i: number) => {
			const localStr = new Date(ts)
				.toLocaleString("sv-SE", { timeZone: CONFIG.timezone })
				.replace(" ", "T")
				.slice(0, 16);
			iconByTime[localStr] = {
				spd: spdKt(windyIconEu["wind_u-surface"][i], windyIconEu["wind_v-surface"][i]),
				dir: dirDeg(windyIconEu["wind_u-surface"][i], windyIconEu["wind_v-surface"][i]),
				gust: windyIconEu["gust-surface"][i] * 1.94384,
			};
		});
	}

	const rows: any[] = [];

	if (hasEcmwf) {
		// ── ECMWF is primary ──
		ecmwf.hourly.time.forEach((t: string) => {
			if (!t.startsWith(todayStr)) return;
			const ecm = ecmwfByTime[t];
			const om3 = omByTime[t] || {};
			const icon = iconByTime[t] || null;

			// Gust preference: ECMWF → ICON-EU → Open-Meteo
			const gust = ecm.gust ?? icon?.gust ?? om3.gust ?? null;
			const gustSrc = ecm.gust != null ? "ecmwf" : icon?.gust != null ? "icon" : "om";

			rows.push({
				time: t.slice(11, 16),
				temp: om3.temp ?? null,
				pp: om3.pp ?? null,
				rain: om3.rain ?? null,
				spd: ecm.spd,
				dir: ecm.dir,
				gust,
				gustSrc,
				bf: beaufort(ecm.spd),
				dl: dirLabel(ecm.dir),
				iconSpd: icon?.spd ?? null,
				iconDir: icon?.dir ?? null,
				iconDl: icon ? dirLabel(icon.dir) : null,
			});
		});
	} else if (hasWindy) {
		// ── ICON-EU fallback (no ECMWF) ──
		windyIconEu.ts.forEach((ts: number, i: number) => {
			const localStr = new Date(ts)
				.toLocaleString("sv-SE", { timeZone: CONFIG.timezone })
				.replace(" ", "T")
				.slice(0, 16);
			if (localStr.slice(0, 10) !== todayStr) return;
			const spd = spdKt(windyIconEu["wind_u-surface"][i], windyIconEu["wind_v-surface"][i]);
			const dir = dirDeg(windyIconEu["wind_u-surface"][i], windyIconEu["wind_v-surface"][i]);
			const om3 = omByTime[localStr] || {};
			rows.push({
				time: localStr.slice(11, 16),
				temp: om3.temp ?? null,
				pp: om3.pp ?? null,
				rain: om3.rain ?? null,
				spd,
				dir,
				gust: windyIconEu["gust-surface"][i] * 1.94384,
				gustSrc: "icon",
				bf: beaufort(spd),
				dl: dirLabel(dir),
				iconSpd: spd,
				iconDir: dir,
				iconDl: dirLabel(dir),
			});
		});
	} else {
		// ── Open-Meteo only ──
		om.hourly.time.forEach((t: string, i: number) => {
			if (!t.startsWith(todayStr)) return;
			const spd = om.hourly.wind_speed_10m[i];
			const dir = om.hourly.wind_direction_10m[i];
			rows.push({
				time: t.slice(11, 16),
				temp: om.hourly.temperature_2m[i],
				pp: om.hourly.precipitation_probability[i],
				rain: om.hourly.precipitation[i],
				spd,
				dir,
				gust: om.hourly.wind_gusts_10m[i],
				gustSrc: "om",
				bf: beaufort(spd),
				dl: dirLabel(dir),
				iconSpd: null,
				iconDir: null,
				iconDl: null,
			});
		});
	}

	if (!rows.length) return `## TODAY — HOURLY FORECAST\n\n> ⚠ No data for today.\n`;

	const peakIdx = rows.reduce((b, r, i) => (r.spd > rows[b].spd ? i : b), 0);
	const fv = (v: number | null, suffix: string, dp = 1) => (v != null ? v.toFixed(dp) + suffix : "—");

	// ── Source note ──
	const primaryLabel = hasEcmwf ? "ECMWF IFS" : hasWindy ? "ICON-EU" : "Open-Meteo";
	const gustLabel = hasEcmwf && !hasEcmwfGust && hasWindy ? " †" : "";
	const sourceNote = hasEcmwf
		? hasWindy
			? isTestKey
				? "Wind: **ECMWF IFS** via Open-Meteo · ICON-EU: Windy API (3-hourly, ⚠ test key — values shuffled)"
				: "Wind: **ECMWF IFS** via Open-Meteo (hourly ✓) · ICON-EU cross-check: Windy API (3-hourly)"
			: "Wind: **ECMWF IFS** via Open-Meteo (hourly ✓)"
		: hasWindy
			? isTestKey
				? "Wind: **ICON-EU** via Windy API (3-hourly, ⚠ test key — values shuffled, not reliable)"
				: "Wind: **ICON-EU** via Windy API (3-hourly ✓)"
			: "Wind: **Open-Meteo** (Windy key not configured)";

	// ── Primary table ──
	const header = [
		`## TODAY — HOURLY FORECAST`,
		``,
		`> ${sourceNote} · Temp / Precip / Rain: **Open-Meteo** (live)`,
		hasEcmwf && hasWindy
			? `> Δkt (ECMWF − ICON-EU) shown in auxiliary table below. Divergence ⚠ >5 kt = low forecast confidence.`
			: "",
		hasEcmwf && !hasEcmwfGust && hasWindy
			? `> † Gust from ICON-EU (ECMWF IFS does not publish gusts at this resolution).`
			: "",
		``,
		`| Time  | Temp    | ${primaryLabel} Dir   | Wind (kt) | Gust (kt)${gustLabel} | BFT  | Precip % | Rain (mm) |`,
		`|-------|---------|---------------------|-----------|------------|------|----------|-----------|`,
	].filter(Boolean);

	const tableRows = rows.map((r, i) => {
		const p = i === peakIdx;
		const b = (s: string) => (p ? `**${s}**` : s);
		const dirCell = String(Math.round(r.dir)).padStart(3) + "° " + r.dl.padEnd(5);
		return `| ${b(r.time)}  | ${b(fv(r.temp, "°C"))}  | ${b(dirCell)} | ${b(fv(r.spd, "kt"))} | ${b(fv(r.gust, "kt"))} | ${b("F" + r.bf)} | ${b(r.pp != null ? r.pp + "%" : "—")} | ${b(fv(r.rain, "mm"))} |`;
	});

	// ── Wind summary ──
	const peak = rows[peakIdx];
	const temps = rows.map((r) => r.temp).filter((t) => t != null);
	const minTemp = temps.length ? Math.min(...temps).toFixed(1) : "—";
	const maxTemp = temps.length ? Math.max(...temps).toFixed(1) : "—";
	const totalR = rows.reduce((s, r) => s + (r.rain ?? 0), 0).toFixed(1);
	const dirEvo = [...new Set(rows.map((r) => r.dl))].join(" → ");

	const hasIconInRows = rows.some((r) => r.iconSpd != null) && hasEcmwf;
	const maxDelta = hasIconInRows
		? rows
				.filter((r) => r.iconSpd != null)
				.reduce((m, r) => Math.max(m, Math.abs(r.spd - r.iconSpd)), 0)
		: 0;

	const summary = [
		``,
		`**Wind summary**: Peak ${fv(peak.spd, "kt")} from ${Math.round(peak.dir)}° ${peak.dl} ` +
			`at ${peak.time}, gusting ${fv(peak.gust, "kt")} (F${peak.bf}). ` +
			`Direction: ${dirEvo}. ` +
			(hasIconInRows
				? `Max model spread: **${maxDelta.toFixed(1)}kt** (ECMWF vs ICON-EU${maxDelta > 5 ? " — ⚠ low confidence" : " — models agree"})${maxDelta > 5 ? ", plan for the stronger figure" : ""}. `
				: "") +
			(parseFloat(totalR) > 0 ? `Total rain: ${totalR}mm. ` : `Zero precipitation. `) +
			`Temperature: **${minTemp}°C** (min) → **${maxTemp}°C** (max).`,
	];

	// ── Auxiliary ICON-EU table (only when ECMWF is primary and ICON-EU available) ──
	const auxSection: string[] = [];
	if (hasEcmwf && hasWindy) {
		const fDelta = (ecmSpd: number, iconSpd: number | null) => {
			if (iconSpd == null) return "—";
			const d = ecmSpd - iconSpd;
			const sign = d >= 0 ? "+" : "";
			return Math.abs(d) > 5 ? `⚠ ${sign}${d.toFixed(1)}` : `${sign}${d.toFixed(1)}`;
		};

		auxSection.push(
			``,
			`### ICON-EU Cross-Check (Windy API — 3-hourly${isTestKey ? ", ⚠ test key" : ""})`,
			``,
			`| Time  | ICON-EU Dir     | ICON-EU (kt) | Δkt (ECMWF−ICON) |`,
			`|-------|-----------------|--------------|------------------|`,
			...rows
				.filter((r) => r.iconSpd != null)
				.map((r) => {
					const orig = rows.indexOf(r);
					const p = orig === peakIdx;
					const b = (s: string) => (p ? `**${s}**` : s);
					const dirCell = r.iconDl
						? String(Math.round(r.iconDir)).padStart(3) + "° " + r.iconDl.padEnd(5)
						: "—";
					return `| ${b(r.time)}  | ${b(dirCell)} | ${b(fv(r.iconSpd, "kt"))} | ${b(fDelta(r.spd, r.iconSpd))} |`;
				}),
		);
	}

	return [...header, ...tableRows, ...summary, ...auxSection].join("\n");
}
