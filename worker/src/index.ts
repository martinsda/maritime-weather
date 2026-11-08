import type { Env } from "./sources";
import { fetchWindy, fetchEcmwf, fetchOpenMeteo, loadTides } from "./sources";
import { buildHourlyTable } from "./hourlyTable";
import { buildTidalSection } from "./tidalSection";
import { buildMultiDayTable } from "./multiDayTable";
import { buildEmailHtml } from "./emailHtml";
import { sendViaResend } from "./resend";

export default {
	async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
		const today = new Date().toISOString().slice(0, 10);
		console.log(`⚓ Generating maritime briefing for ${today} (Sunday Worker)...`);

		// Individual source failures are non-fatal, except Open-Meteo (fatal, same as the
		// GitHub Action — the briefing is meaningless without its hourly/daily data).
		const [iconEu, ecmwf, openMeteo, tides] = await Promise.all([
			fetchWindy(env, "iconEu", ["wind", "windGust", "pressure", "temp"]).catch((e) => {
				console.warn("Windy iconEu failed:", e.message);
				return null;
			}),
			fetchEcmwf().catch((e) => {
				console.warn("ECMWF failed:", e.message);
				return null;
			}),
			fetchOpenMeteo(),
			loadTides(),
		]);

		const hourlyMd = buildHourlyTable(iconEu, ecmwf, openMeteo);
		const tidalMd = buildTidalSection(tides);
		const multiMd = buildMultiDayTable(openMeteo);
		const html = buildEmailHtml(today, hourlyMd, tidalMd, multiMd);

		await sendViaResend(env, `⚓ Maritime Briefing — ${today}`, html);
		console.log(`✓ Sent via Resend → ${env.EMAIL_TO}`);
	},

	// Required by Wrangler's scheduled-event test harness (`--test-scheduled`); never
	// routable in production since `workers_dev` is disabled and no routes are bound.
	async fetch(): Promise<Response> {
		return new Response("Not found", { status: 404 });
	},
};
