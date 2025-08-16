import argon2 from "argon2";
import logger from "./logger";
import * as env from "$env/static/private";

export class PasswordManager {
	private readonly argon2Options = {
		type: argon2.argon2id,
		memoryCost: 65536,
		timeCost: 3,
		secret: Buffer.from(env.ARGON2_SECRET_KEY, "utf-8"),
		parallelism: 2,
		hashLength: 69
	};

	public async hashPassword(password: string): Promise<string> {
		try {
			const hash = await argon2.hash(password, this.argon2Options);
			return hash;
		} catch (error) {
			logger.error("failed to generate hash");
			throw error;
		}
	}

	public async verifyPassword(hash: string, password: string): Promise<boolean> {
		try {
			const verify = argon2.verify(hash, password, { secret: this.argon2Options.secret });
			return verify;
		} catch (error) {
			logger.error("failed to verify hash");
			throw error;
		}
	}
}
