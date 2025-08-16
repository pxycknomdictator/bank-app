import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

type KycStatus = "pending" | "verified" | "rejected";

interface UserSchema extends Document {
	fullname: string;
	username: string;
	email: string;
	password: string;
	dob: Date;
	cnicNumber: string;
	cnicExpiry: Date;
	verified: boolean;
	kycStatus: KycStatus;
}

const userSchema = new mongoose.Schema<UserSchema>(
	{
		fullname: {
			type: String,
			required: [true, "fullname is required"],
			minlength: [3, "fullname contains at least 3 characters long"]
		},
		username: {
			type: String,
			trim: true,
			unique: true,
			lowercase: true,
			required: [true, "username is required"],
			minlength: [3, "username contains at least 3 characters long"]
		},
		email: {
			type: String,
			unique: true,
			trim: true,
			lowercase: true,
			required: [true, "email is required"]
		},
		password: {
			type: String,
			select: false,
			required: [true, "password is required"],
			minlength: [8, "password contains at least 8 characters long"]
		},
		dob: {
			type: Date,
			select: false,
			required: [true, "date-of-birth is required"]
		},
		cnicNumber: {
			type: String,
			unique: true,
			select: false,
			required: [true, "cnic number is required"]
		},
		cnicExpiry: {
			type: Date,
			select: false,
			required: [true, "cnic expiry is required"]
		},
		verified: {
			type: Boolean,
			select: false,
			default: false
		},
		kycStatus: {
			type: String,
			enum: ["pending", "verified", "rejected"],
			select: false,
			default: "pending"
		}
	},
	{ timestamps: true }
);

export const User =
	(mongoose.models?.User as Model<UserSchema>) || mongoose.model<UserSchema>("User", userSchema);
