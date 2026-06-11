/**
 * Server-only Cloudinary configuration loaded from environment variables.
 * Never import this module from client components.
 */

export type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

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

export function isCloudinaryEnvConfigured(): boolean {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  return Boolean(cloudName && apiKey && apiSecret);
}
