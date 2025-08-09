import { Resend } from "resend";
import { logger } from "$lib/utils/logger";
import * as env from "$env/static/private";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail(receiver: string, subject: string, htmlContent: string) {
	try {
		const { data, error } = await resend.emails.send({
			from: "Acme <onboarding@resend.dev>",
			to: receiver,
			subject,
			html: htmlContent
		});

		if (error) {
			logger.error("notification.ts -> Failed to send email", { to: receiver, subject });
			throw error;
		}

		logger.info("notification.ts -> Email sent successfully", { to: receiver, subject });
		return data;
	} catch (error) {
		logger.error("notification.ts -> Failed to send email", { error, to: receiver, subject });
		throw error;
	}
}
