import mongoose from "mongoose";
import type { Document, Model, ObjectId } from "mongoose";

interface SessionSchema extends Document {
	userId: ObjectId;
	sessionToken: string;
	ip: string;
	userAgent: string;
	browser?: string;
	os?: string;
	deviceName?: string;
	location?: string;
	isActive: boolean;
	lastUsedAt: Date;
	expiresAt: Date;
}

const sessionSchema = new mongoose.Schema<SessionSchema>(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "user id is required"]
		},
		sessionToken: {
			type: String,
			unique: true,
			required: [true, "session token is required"]
		},
		ip: {
			type: String,
			required: [true, "ip is required"]
		},
		userAgent: {
			type: String,
			required: [true, "user agent is required"]
		},
		browser: {
			type: String,
			required: false
		},
		os: {
			type: String,
			required: false
		},
		deviceName: {
			type: String,
			required: false
		},
		location: {
			type: String,
			required: false
		},
		isActive: {
			type: Boolean,
			default: true
		},
		lastUsedAt: {
			type: Date,
			default: Date.now
		},
		expiresAt: {
			type: Date,
			default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			index: { expires: 0 }
		}
	},
	{ timestamps: true }
);

export const Session =
	(mongoose.models?.Session as Model<SessionSchema>) ||
	mongoose.model<SessionSchema>("Session", sessionSchema);
