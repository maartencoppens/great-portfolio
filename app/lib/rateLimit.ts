import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

type FixedWindowRateLimitOptions = {
  key: string;
  limit: number;
  windowSeconds: number;
};

type FixedWindowRateLimitResult = {
  isLimited: boolean;
  retryAfterSeconds: number;
};

export function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function checkFixedWindowRateLimit({
  key,
  limit,
  windowSeconds,
}: FixedWindowRateLimitOptions): Promise<FixedWindowRateLimitResult> {
  try {
    const requestCount = await redis.incr(key);

    if (requestCount === 1) {
      await redis.expire(key, windowSeconds);
    }

    if (requestCount > limit) {
      const retryAfterSeconds = Math.max(
        (await redis.ttl(key)) ?? windowSeconds,
        1,
      );

      return {
        isLimited: true,
        retryAfterSeconds,
      };
    }
  } catch (error) {
    console.error("Rate limiter check failed", error);
  }

  return {
    isLimited: false,
    retryAfterSeconds: 0,
  };
}
