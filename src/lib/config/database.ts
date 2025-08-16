import mongoose from "mongoose";
import logger from "$utils/logger";
import * as env from "$env/static/private";

async function database() {
	if (mongoose.connection.readyState === 1) return mongoose.connection;

	try {
		const connection = await mongoose.connect(env.DATABASE);
		logger.info("database is connected!");
		return connection;
	} catch (error) {
		logger.error("failed to connect with database");
		throw error;
	}
}

export default database;
