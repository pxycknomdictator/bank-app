import jwt, { type JwtPayload } from "jsonwebtoken";
import logger from "./logger";
import * as env from "$env/static/private";

interface TokenPayload {
	_id: string;
	email: string;
	username: string;
}

interface TokenResponse {
	access: string | null;
	refresh: string | null;
}

export class TokenManager {
	constructor(private readonly tokenPayload: TokenPayload) {}

	public getTokens(): TokenResponse {
		const refresh = this.refreshToken(this.tokenPayload);
		const access = this.accessToken(this.tokenPayload._id);

		if (!refresh || !access) {
			logger.error("failed to generate tokens");
			return { access: null, refresh: null };
		}

		return { refresh, access };
	}

	private accessToken(_id: string): string {
		const token = jwt.sign({ _id }, env.JWT_ACCESS_TOKEN_SECRET_KEY, {
			expiresIn: "15m",
			algorithm: "HS256"
		});
		return token;
	}

	private refreshToken(tokenPayload: TokenPayload): string {
		const token = jwt.sign(tokenPayload, env.JWT_REFRESH_TOKEN_SECRET_KEY, {
			expiresIn: "7d",
			algorithm: "HS256"
		});
		return token;
	}

	public verifyAccessToken(token: string): JwtPayload {
		const verify = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET_KEY) as JwtPayload;
		return verify;
	}

	public verifyRefreshToken(token: string): JwtPayload {
		const verify = jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET_KEY) as JwtPayload;
		return verify;
	}
}
