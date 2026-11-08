import { dirLabel } from "./windHelpers";
import { wmoLabel, wmoIsDanger } from "./wmo";

export function buildMultiDayTable(om: any): string {
	const d = om.daily;
	const lines = [
		`## MULTI-DAY FORECAST (Open-Meteo — Live Data)`,
		``,
		`| Date          | Condition             | Max°C | Min°C | Rain % | Precip (mm) | Wind Max (kt) | Gust Max (kt) | Dom. Dir      |`,
		`|---------------|-----------------------|-------|-------|--------|-------------|---------------|---------------|---------------|`,
	];

	const flags: string[] = [];

	d.time.forEach((date: string, i: number) => {
		const label = new Date(date).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
		const wmo = d.weather_code[i];
		const condition = wmoLabel(wmo);
		const pp = d.precipitation_probability_max[i];
		const bold = pp >= 50;
		const b = (s: string) => (bold ? `**${s}**` : s);
		const dl = dirLabel(d.wind_direction_10m_dominant[i]);

		lines.push(
			`| ${b(label.padEnd(13))} | ${b(condition.padEnd(21))} | ${b(d.temperature_2m_max[i].toFixed(1))} | ${b(d.temperature_2m_min[i].toFixed(1))} | ${b(pp + "%")} | ${b(d.precipitation_sum[i].toFixed(1))} | ${b(d.wind_speed_10m_max[i].toFixed(1))} | ${b(d.wind_gusts_10m_max[i].toFixed(1))} | ${b(d.wind_direction_10m_dominant[i] + "° " + dl)} |`,
		);

		if (wmoIsDanger(wmo)) {
			flags.push(`⚡ **${label} — DO NOT SAIL**: Thunderstorm (WMO ${wmo}), ${pp}% probability.`);
		}
	});

	if (flags.length) {
		lines.push("", ...flags);
	}

	const settled = d.time.filter(
		(_: string, i: number) => d.precipitation_probability_max[i] < 20 && d.wind_speed_10m_max[i] < 15,
	).length;
	const worstGust = Math.max(...d.wind_gusts_10m_max).toFixed(1);
	const worstDay = d.time[d.wind_gusts_10m_max.indexOf(Math.max(...d.wind_gusts_10m_max))];
	const worstLabel = new Date(worstDay).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });

	lines.push(
		``,
		`**Week reading**: ${settled} of 7 days settled (rain <20%, wind <15kt). ` +
			`Peak gust this week: **${worstGust}kt** on ${worstLabel}. ` +
			`Confidence high D+0–D+2, indicative only beyond 72 hrs.`,
	);

	return lines.join("\n");
}
