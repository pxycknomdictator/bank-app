import fs from "node:fs/promises";
import { v2 as cloudinary } from "cloudinary";
import logger from "$utils/logger";
import * as env from "$env/static/private";

cloudinary.config({
	cloud_name: env.CLOUDINARY_CLOUD_NAME,
	api_key: env.CLOUDINARY_CLOUD_API_KEY,
	api_secret: env.CLOUDINARY_CLOUD_API_SECRET,
	secure: env.NODE_ENV !== "development"
});

interface UploadResponse {
	publicId: string | null;
	resourceType: string | null;
	link: string | null;
}

export class CloudManager {
	public async upload(location: string, folderName: string): Promise<UploadResponse> {
		try {
			const res = await cloudinary.uploader.upload(location, {
				folder: folderName,
				resource_type: "auto"
			});

			return {
				publicId: res.public_id,
				resourceType: res.resource_type,
				link: res.secure_url
			};
		} catch (error: any) {
			logger.error(`cloudinary upload failed: ${error.message}`);
			return { publicId: null, resourceType: null, link: null };
		} finally {
			await fs.unlink(location);
		}
	}

	public async destroy(publicId: string, resourceType: string): Promise<boolean> {
		try {
			const res = await cloudinary.uploader.destroy(publicId, {
				resource_type: resourceType
			});

			if (res.result !== "ok") {
				throw new Error(`Cloudinary deletion failed: ${res.result}`);
			}

			return true;
		} catch (error: any) {
			logger.error(`cloudinary deletion failed: ${error.message}`);
			throw error;
		}
	}
}
