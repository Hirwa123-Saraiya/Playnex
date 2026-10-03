import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load from common root .env first, fallback to local directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  environment: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'hackathon-playnex-access-secret-2026',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'hackathon-playnex-refresh-secret-2026',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_TjZWl4KibRZy5o',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'jBRYEzoRlPvjRk0Z8cIu0AUI',
};

export const cookieOptions = {
  httpOnly: true,
  secure: config.environment === 'production',
  sameSite: 'lax',
  path: '/',
};

export default config;
