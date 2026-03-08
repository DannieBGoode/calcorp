import { describe, it, expect } from "vitest";
import { grantsServices, suggestedPacks } from "./services-data.js";

// ---------------------------------------------------------------------------
// grantsServices data integrity
// ---------------------------------------------------------------------------
describe("grantsServices", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(grantsServices)).toBe(true);
    expect(grantsServices.length).toBeGreaterThan(0);
  });

  it("every service has a unique id", () => {
    const ids = grantsServices.map((s) => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("every service has a positive baseCost", () => {
    for (const service of grantsServices) {
      expect(service.baseCost, `${service.id}.baseCost`).toBeGreaterThan(0);
    }
  });

  it("every service has a subsidyPercent of 0.65 or 0.75", () => {
    const validRates = new Set([0.65, 0.75]);
    for (const service of grantsServices) {
      expect(
        validRates.has(service.subsidyPercent),
        `${service.id}.subsidyPercent must be 0.65 or 0.75`
      ).toBe(true);
    }
  });

  it("every service has a positive maxSubsidy", () => {
    for (const service of grantsServices) {
      expect(service.maxSubsidy, `${service.id}.maxSubsidy`).toBeGreaterThan(0);
    }
  });

  it("every service has name strings for en, es, cat", () => {
    for (const service of grantsServices) {
      expect(typeof service.name.en, `${service.id}.name.en`).toBe("string");
      expect(typeof service.name.es, `${service.id}.name.es`).toBe("string");
      expect(typeof service.name.cat, `${service.id}.name.cat`).toBe("string");
      expect(service.name.en.length, `${service.id}.name.en is empty`).toBeGreaterThan(0);
    }
  });

  it("every service has description strings for en, es, cat", () => {
    for (const service of grantsServices) {
      expect(typeof service.description.en, `${service.id}.description.en`).toBe("string");
      expect(typeof service.description.es, `${service.id}.description.es`).toBe("string");
      expect(typeof service.description.cat, `${service.id}.description.cat`).toBe("string");
    }
  });

  it("maxSubsidy is always less than or equal to the full subsidy at baseCost", () => {
    // baseCost is designed so that cost*percent ≥ maxSubsidy, meaning the cap is always hit
    for (const service of grantsServices) {
      const uncapped = service.baseCost * service.subsidyPercent;
      expect(
        uncapped,
        `${service.id}: baseCost * subsidyPercent should be >= maxSubsidy`
      ).toBeGreaterThanOrEqual(service.maxSubsidy - 0.01); // allow tiny float rounding
    }
  });

  it("contains the expected service IDs", () => {
    const ids = grantsServices.map((s) => s.id);
    const expected = [
      "web",
      "botiga-online",
      "seo-sem",
      "ia",
      "bi",
      "reserva-online",
      "erp-crm",
      "digitalitzacio-processos",
      "programari-gestio",
      "atencio-client",
      "formacions",
      "documents-colaboratives",
      "ingressos-preus",
      "restaurants",
    ];
    for (const id of expected) {
      expect(ids, `missing service id: ${id}`).toContain(id);
    }
  });
});

// ---------------------------------------------------------------------------
// suggestedPacks data integrity
// ---------------------------------------------------------------------------
describe("suggestedPacks", () => {
  it("has micro, ecommerce, and automation packs", () => {
    expect(suggestedPacks).toHaveProperty("micro");
    expect(suggestedPacks).toHaveProperty("ecommerce");
    expect(suggestedPacks).toHaveProperty("automation");
  });

  it("every pack is a non-empty array", () => {
    for (const [name, pack] of Object.entries(suggestedPacks)) {
      expect(Array.isArray(pack), `${name} should be an array`).toBe(true);
      expect(pack.length, `${name} should not be empty`).toBeGreaterThan(0);
    }
  });

  it("every service ID referenced in packs exists in grantsServices", () => {
    const validIds = new Set(grantsServices.map((s) => s.id));
    for (const [packName, ids] of Object.entries(suggestedPacks)) {
      for (const id of ids) {
        expect(
          validIds.has(id),
          `Pack '${packName}' references unknown service id '${id}'`
        ).toBe(true);
      }
    }
  });

  it("micro pack contains web, seo-sem, and formacions", () => {
    expect(suggestedPacks.micro).toContain("web");
    expect(suggestedPacks.micro).toContain("seo-sem");
    expect(suggestedPacks.micro).toContain("formacions");
  });

  it("ecommerce pack contains web, botiga-online, seo-sem, and bi", () => {
    expect(suggestedPacks.ecommerce).toContain("web");
    expect(suggestedPacks.ecommerce).toContain("botiga-online");
    expect(suggestedPacks.ecommerce).toContain("seo-sem");
    expect(suggestedPacks.ecommerce).toContain("bi");
  });

  it("automation pack contains digitalitzacio-processos, erp-crm, ia, and bi", () => {
    expect(suggestedPacks.automation).toContain("digitalitzacio-processos");
    expect(suggestedPacks.automation).toContain("erp-crm");
    expect(suggestedPacks.automation).toContain("ia");
    expect(suggestedPacks.automation).toContain("bi");
  });

  it("packs do not contain duplicate service IDs", () => {
    for (const [packName, ids] of Object.entries(suggestedPacks)) {
      const unique = new Set(ids);
      expect(
        unique.size,
        `Pack '${packName}' contains duplicate service ids`
      ).toBe(ids.length);
    }
  });
});
