// lib/redis.ts
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Environment validation
const validateEnv = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
    console.warn("Redis credentials not configured");
    return false;
  }
  return true;
};

// Singleton Redis instance
let redisInstance: Redis | null = null;

export const getRedis = () => {
  if (!validateEnv()) return null;
  
  if (!redisInstance) {
    redisInstance = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  
  return redisInstance;
};

// Singleton Ratelimiter instance
let ratelimiter: Ratelimit | null = null;

export const getRateLimiter = () => {
  const redis = getRedis();
  if (!redis) return null;
  
  if (!ratelimiter) {
    ratelimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "1 m"),
      analytics: true,
      prefix: "@upstash/ratelimit",
    });
  }
  
  return ratelimiter;
};