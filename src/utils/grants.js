/**
 * Pure calculation utilities for the Andorra grants calculator.
 * These functions are shared between the component and the test suite.
 */

const _formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format a numeric value as a EUR string, e.g. "1,500.00 EUR" */
export function formatEur(value) {
  return `${_formatter.format(value)} EUR`;
}

/**
 * Calculate the subsidy amount for a service.
 * The subsidy is `cost * percent` capped at `max`.
 */
export function calculateSubsidy(cost, percent, max) {
  return Math.min(cost * percent, max);
}

/**
 * Calculate the final cost after applying a subsidy.
 * Never goes below zero.
 */
export function calculateFinalCost(cost, subsidy) {
  return Math.max(cost - subsidy, 0);
}

/**
 * Aggregate totals for a set of services given the selected service IDs.
 *
 * @param {Array<{id: string, baseCost: number, subsidyPercent: number, maxSubsidy: number}>} services
 * @param {string[]} selectedIds
 * @returns {{ totalCost: number, totalSubsidy: number, totalFinal: number }}
 */
export function calculateTotals(services, selectedIds) {
  let totalCost = 0;
  let totalSubsidy = 0;

  for (const service of services) {
    if (selectedIds.includes(service.id)) {
      const subsidy = calculateSubsidy(
        service.baseCost,
        service.subsidyPercent,
        service.maxSubsidy
      );
      totalCost += service.baseCost;
      totalSubsidy += subsidy;
    }
  }

  return {
    totalCost,
    totalSubsidy,
    totalFinal: calculateFinalCost(totalCost, totalSubsidy),
  };
}
