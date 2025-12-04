import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

// Optional Redis client. When not configured, rotation falls back to in-memory behaviour.
export const redis = url && token ? new Redis({ url, token }) : null;


