import winston from "winston";
import * as env from "$env/static/private";

const { combine, colorize, timestamp, printf } = winston.format;

const formatter = printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`);
const formateOptions = combine(colorize(), timestamp(), formatter);

export const logger = winston.createLogger({
	level: env.NODE_ENV === "development" ? "debug" : "info",
	format: formateOptions,
	transports: [new winston.transports.Console({ format: formateOptions })]
});
