/**
 * VERY BASIC In-memory rate limiter for "Free/Smart" tier
 * Note: This only works if you have a single server instance.
 * For production, use Upstash Redis or similar.
 */
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute per IP

export async function rateLimit(ip: string) {
  const now = Date.now();
  const userData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  // Reset if window has passed
  if (now - userData.lastReset > WINDOW_MS) {
    userData.count = 0;
    userData.lastReset = now;
  }

  userData.count++;
  rateLimitMap.set(ip, userData);

  if (userData.count > MAX_REQUESTS) {
    return {
      isLimited: true,
      remaining: 0,
    };
  }

  return {
    isLimited: false,
    remaining: MAX_REQUESTS - userData.count,
  };
}
