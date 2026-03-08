import { describe, it, expect } from "vitest";
import { getFormattedDate } from "./all.js";

describe("getFormattedDate", () => {
  it("returns empty string for null", () => {
    expect(getFormattedDate(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(getFormattedDate(undefined)).toBe("");
  });

  it("returns empty string for empty string", () => {
    expect(getFormattedDate("")).toBe("");
  });

  it("formats a date string correctly", () => {
    // Jan 15 2024 in en-US locale → "Jan 15, 2024"
    expect(getFormattedDate("2024-01-15")).toBe("Jan 15, 2024");
  });

  it("formats a Date object correctly", () => {
    expect(getFormattedDate(new Date("2023-06-01"))).toBe("Jun 1, 2023");
  });

  it("formats a date at the end of the month", () => {
    expect(getFormattedDate("2024-12-31")).toBe("Dec 31, 2024");
  });

  it("formats a date at the start of the year", () => {
    expect(getFormattedDate("2020-01-01")).toBe("Jan 1, 2020");
  });

  it("uses en-US short month names", () => {
    const result = getFormattedDate("2024-07-04");
    expect(result).toMatch(/^Jul/);
  });
});
