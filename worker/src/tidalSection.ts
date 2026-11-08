import { CONFIG } from "./config";
import type { TideEvent } from "./sources";

export function buildTidalSection(tidesData: { data: TideEvent[] } | null): string {
	const lines = [`## TIDES — ${CONFIG.port}`, ``];

	if (!tidesData?.data?.length) {
		lines.push(
			`> ⚠ Tidal data unavailable — \`data/tides-${new Date().getUTCFullYear()}.json\` missing or incomplete.`,
			`> Cross-check: [Tides4Fishing Lisboa](https://tides4fishing.com/pt/lisboa/lisboa) · [Porto de Lisboa](https://www.portodelisboa.pt/mares)`,
			``,
			`\`\`\``,
			`HW1: --:-- — ?.?m`,
			`LW:  --:-- — ?.?m`,
			`HW2: --:-- — ?.?m`,
			`\`\`\``,
		);
		return lines.join("\n");
	}

	const tides = [...tidesData.data].sort((a, b) => +new Date(a.time) - +new Date(b.time));
	const highs = tides.filter((t) => t.type === "high");
	const lows = tides.filter((t) => t.type === "low");
	const fmt = (ts: string) => new Date(ts).toTimeString().slice(0, 5);
	const zh = (h: number) => h.toFixed(2);

	lines.push(
		`> Heights above **Zero Hidrográfico (ZH)** — same datum as Porto de Lisboa and Portuguese charts.`,
		`> Official Porto de Lisboa tide table 2026 (parsed from PDF). Always verify against the official source before critical passages.`,
		`> **Official tide table → [Porto de Lisboa — Marés](https://www.portodelisboa.pt/mares)**`,
		``,
	);

	let hwN = 0;
	let lwN = 0;
	lines.push("```");
	tides.forEach((t) => {
		if (t.type === "high") {
			hwN++;
			lines.push(`HW${hwN}: ${fmt(t.time)} UTC — ${zh(t.height)}m (ZH)`);
		} else {
			lwN++;
			lines.push(`LW${lwN}: ${fmt(t.time)} UTC — ${zh(t.height)}m (ZH)`);
		}
	});

	if (highs.length && lows.length) {
		const range = Math.abs(highs[0].height - lows[0].height).toFixed(2);
		lines.push(`Tidal range: ${range}m`);
	}
	lines.push("```", ``);

	// Convert tide event timestamps to local decimal hours for arithmetic
	const toLocalDecHour = (ts: string) => {
		const s = new Date(ts).toLocaleString("sv-SE", { timeZone: CONFIG.timezone }); // "YYYY-MM-DD HH:MM:SS"
		return parseInt(s.slice(11, 13)) + parseInt(s.slice(14, 16)) / 60;
	};

	const events = tides
		.map((t) => ({
			type: t.type,
			timeStr: fmt(t.time),
			localHour: toLocalDecHour(t.time),
			height: t.height,
		}))
		.sort((a, b) => a.localHour - b.localHour);

	// Determine tidal stream phase and relative rate at a given local decimal hour.
	// Rate uses a sine curve: 0 at slack (HW/LW), 1 at mid-cycle peak.
	function streamAt(hour: number) {
		let prev: (typeof events)[number] | null = null;
		let next: (typeof events)[number] | null = null;
		for (const e of events) {
			if (e.localHour <= hour) prev = e;
			else if (!next) next = e;
		}
		if (!prev || !next) return null;
		const isEbb = prev.type === "high"; // after HW = ebb; after LW = flood
		const cycleHrs = next.localHour - prev.localHour;
		const elapsed = hour - prev.localHour;
		const relRate = Math.sin((elapsed / cycleHrs) * Math.PI); // 0→1→0
		const rateLabel = relRate < 0.35 ? "slack" : relRate < 0.7 ? "moderate" : "strong";
		return { phase: isEbb ? "ebb" : "flood", relRate, rateLabel, prev, next };
	}

	const dep = streamAt(CONFIG.depHour);
	const ret = streamAt(CONFIG.retHour);
	const retPhase = ret?.phase;

	// Ebb  = water flows seaward  → favorable for OUTBOUND (Cascais)
	// Flood = water flows inward  → favorable for INBOUND  (Lisbon / upriver)
	function passageNote(stream: ReturnType<typeof streamAt>, leg: "dep" | "ret"): string {
		if (!stream) return "—";
		const { phase, rateLabel, prev, next } = stream;
		if (rateLabel === "slack") return `Near-slack (${prev.timeStr}→${next.timeStr} UTC) — minimal current`;
		if (leg === "dep") {
			// Direction is set by the RETURN stream (retPhase), not the departure stream
			const dir = retPhase === "ebb" ? "upriver" : "seaward (Cascais)";
			return `${rateLabel} ${phase} — depart ${dir}`;
		}
		if (leg === "ret") {
			// Return stream brings you home
			const homeDir = phase === "ebb" ? "seaward back to base ✓" : "inward back to base ✓";
			return `${rateLabel} ${phase} — ${homeDir}`;
		}
		return "—";
	}

	// Slack water windows useful for bar crossings
	const slackRows = events.map(
		(e) =>
			`| ${e.timeStr} UTC | ${e.type === "high" ? "HW" : "LW"} slack (${e.height.toFixed(2)}m ZH) | Calmest bar crossing window |`,
	);

	lines.push(
		`| Time (UTC)    | Stream at departure/return    | Passage note                                     |`,
		`|---------------|-------------------------------|--------------------------------------------------|`,
		`| ${String(CONFIG.depHour).padStart(2, "0")}:00 (dep)  | ${dep ? (dep.rateLabel + " " + dep.phase).padEnd(29) : "—".padEnd(29)} | ${passageNote(dep, "dep")} |`,
		`| ${String(CONFIG.retHour).padStart(2, "0")}:00 (ret)  | ${ret ? (ret.rateLabel + " " + ret.phase).padEnd(29) : "—".padEnd(29)} | ${passageNote(ret, "ret")} |`,
		...slackRows,
	);

	// Direction logic:
	// The return stream at 17h determines where you sailed to:
	//   ebb at 17h  → water flows seaward → you return seaward → you departed UPRIVER
	//   flood at 17h → water flows inward  → you return inward  → you departed SEAWARD (Cascais)
	const depDir = retPhase === "ebb" ? "upriver" : "seaward (Cascais)";
	const retDir = retPhase === "ebb" ? "seaward (back to base)" : "upriver (back to base)";

	// Nearest HW/LW to departure — ideal slack window
	const nearestSlack = events.reduce((best, e) =>
		Math.abs(e.localHour - CONFIG.depHour) < Math.abs(best.localHour - CONFIG.depHour) ? e : best,
	);
	const slackGapMins = Math.round(Math.abs(nearestSlack.localHour - CONFIG.depHour) * 60);
	const slackNote =
		slackGapMins <= 30
			? `near-slack (${nearestSlack.type.toUpperCase()} at ${nearestSlack.timeStr} UTC — minimal adverse current on departure)`
			: `${dep?.rateLabel ?? "—"} ${dep?.phase ?? "—"} at departure (${nearestSlack.type.toUpperCase()} slack ${slackGapMins} min away at ${nearestSlack.timeStr} UTC)`;

	const rec = ret
		? `Depart ${CONFIG.depHour}:00 → **${depDir}** (${slackNote}). ` +
			`Return ${CONFIG.retHour}:00 on **${ret.rateLabel} ${ret.phase}** — ✓ ${retDir}.`
		: `⚠ Insufficient tidal data to compute passage window.`;

	lines.push(``, `> **Passage window**: ${rec}`);

	return lines.join("\n");
}
