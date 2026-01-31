/**
 * Lead scoring utility for wholesale property deals.
 *
 * Dimensions (total 0–100):
 *   Location desirability   → 0–25
 *   Price vs market (ARV)   → 0–25
 *   Property condition       → 0–15
 *   Seller motivation        → 0–20
 *   Property fundamentals    → 0–15
 */

// ──────────────────────────────────────────
// 1. Location score (0–25)
// ──────────────────────────────────────────

const CITY_TIER: Record<string, number> = {
  // Tier 1
  Mumbai: 25,
  Delhi: 25,
  Bangalore: 22,
  Bengaluru: 22,
  Hyderabad: 22,
  Chennai: 22,
  Kolkata: 20,
  // Tier 2
  Pune: 18,
  Ahmedabad: 18,
  Jaipur: 15,
  Lucknow: 15,
  Chandigarh: 15,
  Noida: 18,
  Gurgaon: 18,
  Gurugram: 18,
  // Tier 3 fallback handled below
};

function locationScore(city?: string): number {
  if (!city) return 5;
  // case-insensitive lookup
  const key = Object.keys(CITY_TIER).find(
    (k) => k.toLowerCase() === city.trim().toLowerCase(),
  );
  return key ? CITY_TIER[key] : 10; // unknown city → 10
}

// ──────────────────────────────────────────
// 2. Price attractiveness (0–25)
//    Compares listing_price against ARV
// ──────────────────────────────────────────

function priceScore(listingPrice?: number, arv?: number): number {
  if (!listingPrice || !arv || arv <= 0) return 5;
  const diffPct = ((arv - listingPrice) / arv) * 100;

  if (diffPct >= 20) return 25;
  if (diffPct >= 10) return 18;
  if (diffPct >= 0) return 10;
  return 5;
}

// ──────────────────────────────────────────
// 3. Property condition (0–15)
//    More renovation flags true → worse condition → lower score
// ──────────────────────────────────────────

interface ConditionFlags {
  kitchen_renovation_required?: boolean;
  bathroom_renovation_required?: boolean;
  exterior_paint_required?: boolean;
  new_floor_required?: boolean;
  drywall_repair_required?: boolean;
  interior_paint_required?: boolean;
}

function conditionScore(flags: ConditionFlags): number {
  const total = [
    flags.kitchen_renovation_required,
    flags.bathroom_renovation_required,
    flags.exterior_paint_required,
    flags.new_floor_required,
    flags.drywall_repair_required,
    flags.interior_paint_required,
  ].filter(Boolean).length;

  if (total === 0) return 15; // move-in ready
  if (total <= 2) return 10; // minor work
  if (total <= 4) return 7; // moderate
  return 4; // major renovation
}

// ──────────────────────────────────────────
// 4. Seller motivation / urgency (0–20)
//    Derived from listing age (days on market)
// ──────────────────────────────────────────

function urgencyScore(listingDate?: string | Date): number {
  if (!listingDate) return 5;
  const listed = new Date(listingDate);
  const daysOnMarket = Math.floor(
    (Date.now() - listed.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Longer on market → likely more motivated seller
  if (daysOnMarket > 90) return 20;
  if (daysOnMarket > 30) return 12;
  return 5;
}

// ──────────────────────────────────────────
// 5. Property fundamentals (0–15)
// ──────────────────────────────────────────

function fundamentalsScore(
  bedrooms?: number,
  bathrooms?: number,
  squareFeet?: number,
): number {
  let score = 0;
  if (bedrooms && bedrooms >= 2) score += 5;
  if (bathrooms && bathrooms >= 2) score += 5;
  if (squareFeet && squareFeet >= 1000) score += 5;
  return score;
}

// ──────────────────────────────────────────
// Public API
// ──────────────────────────────────────────

export interface LeadScoreInput {
  city?: string;
  listing_price?: number;
  arv?: number;
  listing_date?: string | Date;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  kitchen_renovation_required?: boolean;
  bathroom_renovation_required?: boolean;
  exterior_paint_required?: boolean;
  new_floor_required?: boolean;
  drywall_repair_required?: boolean;
  interior_paint_required?: boolean;
}

export interface LeadScoreResult {
  lead_score: number;
  lead_status: 'HOT' | 'WARM' | 'COLD';
  breakdown: {
    location: number;
    price: number;
    condition: number;
    urgency: number;
    fundamentals: number;
  };
}

export function calculateLeadScore(input: LeadScoreInput): LeadScoreResult {
  const location = locationScore(input.city);
  const price = priceScore(input.listing_price, input.arv);
  const condition = conditionScore(input);
  const urgency = urgencyScore(input.listing_date);
  const fundamentals = fundamentalsScore(
    input.bedrooms,
    input.bathrooms,
    input.square_feet,
  );

  const total = Math.min(
    location + price + condition + urgency + fundamentals,
    100,
  );

  return {
    lead_score: total,
    lead_status: total >= 80 ? 'HOT' : total >= 50 ? 'WARM' : 'COLD',
    breakdown: { location, price, condition, urgency, fundamentals },
  };
}
