import type { Env } from "./sources";

export async function sendViaResend(env: Env, subject: string, html: string): Promise<void> {
	const response = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from: `Maritime Briefing <${env.EMAIL_FROM}>`,
			to: env.EMAIL_TO.split(",").map((addr) => addr.trim()),
			subject,
			html,
		}),
	});
	if (!response.ok) {
		throw new Error(`Resend send failed: ${response.status} ${await response.text()}`);
	}
}
