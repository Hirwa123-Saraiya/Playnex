import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import withPWAInit from "@ducanh2912/next-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Automatically load the common root .env into Next.js if present
try {
  const rootEnvPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(rootEnvPath)) {
    const envConfig = fs.readFileSync(rootEnvPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key && values.length > 0 && !process.env[key.trim()]) {
          process.env[key.trim()] = values.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    });
  }
} catch (e) {
  // Graceful fallback
}

// This block has been updated with the buildExcludes fix:
const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", 
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/], 
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Playnex Club Management',
  },
};

export default withPWA(nextConfig);
