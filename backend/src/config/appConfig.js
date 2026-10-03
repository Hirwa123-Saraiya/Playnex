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
  environment: process.env.NODE_ENV || 'development'
};

export default config;
