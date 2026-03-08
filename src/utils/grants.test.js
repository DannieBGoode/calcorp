import { describe, it, expect } from "vitest";
import {
  formatEur,
  calculateSubsidy,
  calculateFinalCost,
  calculateTotals,
} from "./grants.js";

// ---------------------------------------------------------------------------
// formatEur
// ---------------------------------------------------------------------------
describe("formatEur", () => {
  it("formats zero", () => {
    expect(formatEur(0)).toBe("0.00 EUR");
  });

  it("formats a whole number with two decimal places", () => {
    expect(formatEur(1500)).toBe("1,500.00 EUR");
  });

  it("formats a decimal value", () => {
    expect(formatEur(769.23)).toBe("769.23 EUR");
  });

  it("formats a large value with thousands separator", () => {
    expect(formatEur(4615.38)).toBe("4,615.38 EUR");
  });

  it("always appends ' EUR' suffix", () => {
    expect(formatEur(100)).toMatch(/ EUR$/);
  });
});

// ---------------------------------------------------------------------------
// calculateSubsidy
// ---------------------------------------------------------------------------
describe("calculateSubsidy", () => {
  it("returns cost * percent when below the cap", () => {
    // 769.23 * 0.65 = 500.0, exactly at cap — let's use a lower value
    expect(calculateSubsidy(500, 0.65, 1500)).toBeCloseTo(325, 5);
  });

  it("returns the max when cost * percent exceeds cap", () => {
    // 2307.69 * 0.65 ≈ 1500, capped at 1500
    expect(calculateSubsidy(2307.69, 0.65, 1500)).toBeCloseTo(1500, 1);
  });

  it("returns exact max when cost * percent equals max", () => {
    expect(calculateSubsidy(2000, 0.75, 1500)).toBe(1500);
  });

  it("applies 75% subsidy rate correctly", () => {
    // 4000 * 0.75 = 3000, capped at 3000
    expect(calculateSubsidy(4000, 0.75, 3000)).toBe(3000);
  });

  it("returns 0 subsidy for 0 cost", () => {
    expect(calculateSubsidy(0, 0.65, 1500)).toBe(0);
  });

  it("handles sub-cap 75% rate", () => {
    // 1000 * 0.75 = 750, cap is 3000 → subsidy = 750
    expect(calculateSubsidy(1000, 0.75, 3000)).toBe(750);
  });
});

// ---------------------------------------------------------------------------
// calculateFinalCost
// ---------------------------------------------------------------------------
describe("calculateFinalCost", () => {
  it("subtracts subsidy from cost", () => {
    expect(calculateFinalCost(2307.69, 1500)).toBeCloseTo(807.69, 2);
  });

  it("returns 0 when subsidy equals cost", () => {
    expect(calculateFinalCost(1000, 1000)).toBe(0);
  });

  it("never returns a negative value", () => {
    // subsidy larger than cost (defensive)
    expect(calculateFinalCost(500, 600)).toBe(0);
  });

  it("returns full cost when subsidy is 0", () => {
    expect(calculateFinalCost(4000, 0)).toBe(4000);
  });
});

// ---------------------------------------------------------------------------
// calculateTotals
// ---------------------------------------------------------------------------
describe("calculateTotals", () => {
  const services = [
    { id: "web", baseCost: 2307.69, subsidyPercent: 0.65, maxSubsidy: 1500 },
    { id: "seo-sem", baseCost: 769.23, subsidyPercent: 0.65, maxSubsidy: 500 },
    { id: "ia", baseCost: 4000, subsidyPercent: 0.75, maxSubsidy: 3000 },
  ];

  it("returns zero totals when no services selected", () => {
    const result = calculateTotals(services, []);
    expect(result.totalCost).toBe(0);
    expect(result.totalSubsidy).toBe(0);
    expect(result.totalFinal).toBe(0);
  });

  it("calculates totals for a single selected service (65%, capped)", () => {
    const result = calculateTotals(services, ["web"]);
    expect(result.totalCost).toBeCloseTo(2307.69, 2);
    expect(result.totalSubsidy).toBeCloseTo(1500, 1); // 2307.69 * 0.65 ≈ 1500, capped
    expect(result.totalFinal).toBeCloseTo(807.69, 1);
  });

  it("calculates totals for a single selected service (65%, under cap)", () => {
    // 769.23 * 0.65 = 500.0, exactly at cap of 500
    const result = calculateTotals(services, ["seo-sem"]);
    expect(result.totalCost).toBeCloseTo(769.23, 2);
    expect(result.totalSubsidy).toBeCloseTo(500, 1);
    expect(result.totalFinal).toBeCloseTo(269.23, 1);
  });

  it("calculates totals for a 75% subsidy service (capped)", () => {
    const result = calculateTotals(services, ["ia"]);
    expect(result.totalCost).toBe(4000);
    expect(result.totalSubsidy).toBe(3000); // 4000 * 0.75 = 3000, exactly at cap
    expect(result.totalFinal).toBe(1000);
  });

  it("aggregates multiple selected services correctly", () => {
    const result = calculateTotals(services, ["web", "seo-sem"]);
    expect(result.totalCost).toBeCloseTo(2307.69 + 769.23, 2);
    expect(result.totalSubsidy).toBeCloseTo(1500 + 500, 1);
    expect(result.totalFinal).toBeCloseTo(807.69 + 269.23, 1);
  });

  it("ignores services not in selectedIds", () => {
    const result = calculateTotals(services, ["web"]);
    expect(result.totalCost).toBeCloseTo(2307.69, 2); // only web, not ia or seo-sem
  });

  it("handles all services selected", () => {
    const result = calculateTotals(services, ["web", "seo-sem", "ia"]);
    const expectedCost = 2307.69 + 769.23 + 4000;
    const expectedSubsidy = 1500 + 500 + 3000;
    expect(result.totalCost).toBeCloseTo(expectedCost, 1);
    expect(result.totalSubsidy).toBeCloseTo(expectedSubsidy, 1);
    expect(result.totalFinal).toBeCloseTo(expectedCost - expectedSubsidy, 1);
  });

  it("handles unknown service IDs gracefully", () => {
    const result = calculateTotals(services, ["nonexistent"]);
    expect(result.totalCost).toBe(0);
    expect(result.totalSubsidy).toBe(0);
    expect(result.totalFinal).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Real pack calculations using actual services data
// ---------------------------------------------------------------------------
describe("calculateTotals — real suggested packs", () => {
  // Import lazily to keep tests self-contained, but use the real data
  it("micro pack: web + seo-sem + formacions", async () => {
    const { grantsServices, suggestedPacks } = await import(
      "../content/grants/services-data.js"
    );
    const result = calculateTotals(grantsServices, suggestedPacks.micro);
    // All costs must be positive
    expect(result.totalCost).toBeGreaterThan(0);
    // Subsidy must be less than or equal to total cost
    expect(result.totalSubsidy).toBeLessThanOrEqual(result.totalCost);
    // Final = cost - subsidy (never negative)
    expect(result.totalFinal).toBeGreaterThanOrEqual(0);
    expect(result.totalFinal).toBeCloseTo(
      result.totalCost - result.totalSubsidy,
      5
    );
  });

  it("ecommerce pack produces non-zero totals", async () => {
    const { grantsServices, suggestedPacks } = await import(
      "../content/grants/services-data.js"
    );
    const result = calculateTotals(grantsServices, suggestedPacks.ecommerce);
    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.totalSubsidy).toBeGreaterThan(0);
    expect(result.totalFinal).toBeGreaterThan(0);
  });

  it("automation pack produces non-zero totals", async () => {
    const { grantsServices, suggestedPacks } = await import(
      "../content/grants/services-data.js"
    );
    const result = calculateTotals(grantsServices, suggestedPacks.automation);
    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.totalSubsidy).toBeGreaterThan(0);
    expect(result.totalFinal).toBeGreaterThan(0);
  });
});
