export const COMPASS = [
	"N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
	"S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
];

export function spdKt(u: number, v: number): number {
	return Math.sqrt(u * u + v * v) * 1.94384;
}

export function dirDeg(u: number, v: number): number {
	return ((Math.atan2(u, v) * 180) / Math.PI + 360) % 360;
}

export function dirLabel(deg: number): string {
	return COMPASS[Math.round(deg / 22.5) % 16];
}

export function beaufort(kt: number): number {
	const limits = [1, 4, 7, 11, 17, 22, 28, 34, 41, 48, 56, 64];
	const b = limits.findIndex((l) => kt < l);
	return b === -1 ? 12 : b;
}
