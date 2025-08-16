import { Resend } from "resend";
import logger from "$utils/logger";
import * as env from "$env/static/private";

const resend = new Resend(env.RESEND_API_KEY);

interface SendEmailProps {
	to: string[];
	subject: string;
	htmlContent: string;
	from?: string;
}

export async function sendEmail({
	to,
	subject,
	htmlContent,
	from = env.RESEND_FROM_EMAIL || "Acme <onboarding@resend.dev>"
}: SendEmailProps) {
	try {
		const { data, error } = await resend.emails.send({
			from,
			to,
			subject,
			html: htmlContent
		});

		if (error) {
			logger.error(`failed to send email to ${to}: ${error.message}`);
			throw new Error(`Resend error: ${error.message}`);
		}

		logger.info(`email sent successfully to ${to}`);
		return data;
	} catch (error: any) {
		logger.error(`unexpected error sending email to ${to}: ${error.message}`);
		throw error;
	}
}
