/**
 * Server-only Cloudinary configuration loaded from environment variables.
 * Never import this module from client components.
 */

export type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

export type CloudinaryConfigStatus =
  | { ok: true; config: CloudinaryConfig }
  | { ok: false; missing: string[]; message: string };

function readEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export function getCloudinaryConfig(): CloudinaryConfig {
  return {
    cloudName: readEnv("CLOUDINARY_CLOUD_NAME"),
    apiKey: readEnv("CLOUDINARY_API_KEY"),
    apiSecret: readEnv("CLOUDINARY_API_SECRET"),
  };
}

export function getCloudinaryConfigStatus(): CloudinaryConfigStatus {
  const config = getCloudinaryConfig();
  const missing: string[] = [];

  if (!config.cloudName) missing.push("CLOUDINARY_CLOUD_NAME");
  if (!config.apiKey) missing.push("CLOUDINARY_API_KEY");
  if (!config.apiSecret) missing.push("CLOUDINARY_API_SECRET");

  if (missing.length > 0) {
    return {
      ok: false,
      missing,
      message: `Missing Cloudinary environment variables: ${missing.join(", ")}. Set them in .env or .env.local.`,
    };
  }

  return { ok: true, config };
}

export function isCloudinaryEnvConfigured(): boolean {
  return getCloudinaryConfigStatus().ok;
}
