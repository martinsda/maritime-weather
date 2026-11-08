import { CONFIG } from "./config";

export interface Env {
	WINDY_API_KEY: string;
	RESEND_API_KEY: string;
	EMAIL_FROM: string;
	EMAIL_TO: string;
}

export interface TideEvent {
	time: string;
	type: "high" | "low";
	height: number;
}

export async function fetchWindy(env: Env, model: string, parameters: string[]): Promise<any> {
	if (!env.WINDY_API_KEY) {
		console.warn("WINDY_API_KEY not set — skipping Windy fetch");
		return null;
	}
	const res = await fetch("https://api.windy.com/api/point-forecast/v2", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			lat: CONFIG.lat,
			lon: CONFIG.lon,
			model,
			parameters,
			levels: ["surface"],
			key: env.WINDY_API_KEY,
		}),
	});
	if (!res.ok) throw new Error(`Windy ${model} HTTP ${res.status}`);
	return res.json();
}

export async function fetchOpenMeteo(): Promise<any> {
	const params = new URLSearchParams({
		latitude: String(CONFIG.lat),
		longitude: String(CONFIG.lon),
		elevation: String(CONFIG.elev),
		hourly: "temperature_2m,precipitation_probability,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m",
		daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,precipitation_probability_mean,rain_sum,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant",
		wind_speed_unit: "kn",
		timezone: CONFIG.timezone,
		forecast_days: "7",
	});
	const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
	if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
	return res.json();
}

export async function fetchEcmwf(): Promise<any> {
	const params = new URLSearchParams({
		latitude: String(CONFIG.lat),
		longitude: String(CONFIG.lon),
		hourly: "wind_speed_10m,wind_direction_10m,wind_gusts_10m",
		wind_speed_unit: "kn",
		timezone: CONFIG.timezone,
		models: "ecmwf_ifs025",
		forecast_days: "2",
	});
	const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
	if (!res.ok) throw new Error(`Open-Meteo ECMWF HTTP ${res.status}`);
	return res.json();
}

// Fetches today's tides from the repo's pre-parsed Porto de Lisboa JSON (same
// source of truth as the GitHub Action — avoids bundling/duplicating the file
// and survives the yearly file rollover without a redeploy).
// Heights in the JSON are ZH metres — stored and displayed as-is.
export async function loadTides(): Promise<{ data: TideEvent[] } | null> {
	const today = new Date().toISOString().slice(0, 10);
	const year = new Date().getUTCFullYear();

	let allTides: Record<string, Record<string, { time: string; height: number }>>;
	try {
		const res = await fetch(
			`https://raw.githubusercontent.com/martinsda/maritime-weather/master/data/tides-${year}.json`,
		);
		if (!res.ok) return null;
		allTides = await res.json();
	} catch {
		return null;
	}

	const data: TideEvent[] = [];
	const entry = allTides[today];
	if (entry) {
		const keys: Array<[string, "high" | "low"]> = [
			["HW1", "high"], ["LW1", "low"], ["HW2", "high"], ["LW2", "low"],
		];
		for (const [key, type] of keys) {
			const ev = entry[key];
			if (!ev?.time) continue;
			data.push({ time: `${today}T${ev.time}:00Z`, type, height: ev.height });
		}
	}
	return data.length ? { data } : null;
}
