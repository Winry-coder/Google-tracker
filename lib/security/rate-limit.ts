/**
 * VERY BASIC In-memory rate limiter for "Free/Smart" tier
 * Note: This only works if you have a single server instance.
 * For production, use Upstash Redis or similar.
 */
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_IP = 5; // 5 requests per minute per IP
const MAX_REQUESTS_CAMPAIGN = 50; // 50 requests per minute per campaign

export async function rateLimit(ip: string, campaignId?: string) {
  const now = Date.now();
  
  // 1. IP-based rate limiting
  const userData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - userData.lastReset > WINDOW_MS) {
    userData.count = 0;
    userData.lastReset = now;
  }

  userData.count++;
  rateLimitMap.set(ip, userData);

  if (userData.count > MAX_REQUESTS_IP) {
    return {
      isLimited: true,
      remaining: 0,
    };
  }

  // 2. Campaign-based rate limiting (Global protection)
  if (campaignId) {
    const campaignKey = `camp_${campaignId}`;
    const campaignData = rateLimitMap.get(campaignKey) || { count: 0, lastReset: now };

    if (now - campaignData.lastReset > WINDOW_MS) {
      campaignData.count = 0;
      campaignData.lastReset = now;
    }

    campaignData.count++;
    rateLimitMap.set(campaignKey, campaignData);

    if (campaignData.count > MAX_REQUESTS_CAMPAIGN) {
      return {
        isLimited: true,
        remaining: 0,
        reason: 'campaign_limit'
      };
    }
  }

  return {
    isLimited: false,
    remaining: MAX_REQUESTS_IP - userData.count,
  };
}
