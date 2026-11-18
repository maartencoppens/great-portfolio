import { Redis } from "@upstash/redis";

// Rate limits voor de contactform en Ask Maarten.
// Upstash Redis als die geconfigureerd is en werkt; anders tellen we in het geheugen.
// Faalt Redis (database weg, offline, time-out), dan schakelen we meteen over en
// proberen we pas na een minuut opnieuw, zodat niemand seconden op een time-out wacht.

type FixedWindowRateLimitOptions = {
  key: string;
  limit: number;
  windowSeconds: number;
};

type FixedWindowRateLimitResult = {
  isLimited: boolean;
  retryAfterSeconds: number;
};

// De Vercel-integratie maakt variabelen met een prefix aan (…_KV_REST_API_URL/TOKEN).
// Die gaan voor, zodat een oude UPSTASH_REDIS_REST_URL nooit naar een verdwenen database wijst.
const url =
  process.env.UPSTASH_REDIS_REST_KV_REST_API_URL ??
  process.env.KV_REST_API_URL ??
  process.env.UPSTASH_REDIS_REST_URL;
const token =
  process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN ??
  process.env.KV_REST_API_TOKEN ??
  process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token, retry: false }) : null;

const REDIS_TIMEOUT_MS = 1500;
const RETRY_AFTER_MS = 60_000;
let redisDownUntil = 0;

type Entry = { count: number; expires: number };
const globalForMemory = globalThis as unknown as { __rateLimitMemory?: Map<string, Entry> };
const memory = (globalForMemory.__rateLimitMemory ??= new Map<string, Entry>());

export function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("redis timeout")), REDIS_TIMEOUT_MS),
    ),
  ]);
}

/** Telt in Redis. Geeft [aantal, resterende seconden] terug. */
async function redisCount(key: string, windowSeconds: number): Promise<[number, number]> {
  if (!redis) throw new Error("no redis");
  return withTimeout(
    (async (): Promise<[number, number]> => {
      const count = await redis.incr(key);
      if (count === 1) await redis.expire(key, windowSeconds);
      const ttl = count > 1 ? await redis.ttl(key) : windowSeconds;
      return [count, ttl > 0 ? ttl : windowSeconds];
    })(),
  );
}

/** Telt in het geheugen van deze serverinstantie. */
function memoryCount(key: string, windowSeconds: number): [number, number] {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.expires < now) {
    memory.set(key, { count: 1, expires: now + windowSeconds * 1000 });
    return [1, windowSeconds];
  }
  entry.count += 1;
  return [entry.count, Math.ceil((entry.expires - now) / 1000)];
}

export async function checkFixedWindowRateLimit({
  key,
  limit,
  windowSeconds,
}: FixedWindowRateLimitOptions): Promise<FixedWindowRateLimitResult> {
  let result: [number, number] | null = null;

  if (redis && Date.now() > redisDownUntil) {
    try {
      result = await redisCount(key, windowSeconds);
    } catch (error) {
      redisDownUntil = Date.now() + RETRY_AFTER_MS;
      console.warn(
        "Upstash onbereikbaar, rate limit tijdelijk in het geheugen:",
        (error as Error).message,
      );
    }
  }

  const [count, ttl] = result ?? memoryCount(key, windowSeconds);

  return {
    isLimited: count > limit,
    retryAfterSeconds: count > limit ? Math.max(ttl, 1) : 0,
  };
}
