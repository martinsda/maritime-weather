export const WMO: Record<number, string> = {
	0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
	45: "Fog", 48: "Icy fog",
	51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
	61: "🌧 Light rain", 63: "🌧 Moderate rain", 65: "🌧 Heavy rain",
	71: "Light snow", 73: "Moderate snow", 75: "Heavy snow",
	80: "Rain showers", 81: "Rain showers", 82: "Heavy showers",
	95: "⚡ Thunderstorm", 96: "⚡ Storm+hail", 99: "⚡ Storm+hail",
};

export function wmoLabel(code: number): string {
	return WMO[code] || `Code ${code}`;
}

export function wmoIsDanger(code: number): boolean {
	return [95, 96, 99].includes(code);
}
