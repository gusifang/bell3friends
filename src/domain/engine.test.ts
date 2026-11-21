import { describe, expect, it } from "vitest";
import {
  accepted,
  discarded,
  targets,
  settingsFrom,
  tableFromIndex,
  localOutcomes,
  product,
  makeRound,
  seeded,
  support,
  emptyCounts,
  countRound,
  lateInstruction,
} from "./engine";
describe("GHZ rules and classical bound", () => {
  it("partitions exactly eight settings with the specified signs", () => {
    expect(accepted).toEqual(["XXX", "XYY", "YXY", "YYX"]);
    expect(discarded).toEqual(["XXY", "XYX", "YXX", "YYY"]);
    expect(new Set([...accepted, ...discarded]).size).toBe(8);
    expect(accepted.map((s) => targets[s])).toEqual([-1, 1, 1, 1]);
    discarded.forEach((s) => expect(targets[s]).toBeUndefined());
  });
  it("exhausts all 64 tables and proves the best probability is 3/4", () => {
    const scores = Array.from({ length: 64 }, (_, i) => {
      const table = tableFromIndex(i);
      const products = accepted.map((s) =>
        product(localOutcomes(table, settingsFrom(s))),
      );
      expect(product(products)).toBe(1);
      const failures = products.filter(
        (p, j) => p !== targets[accepted[j]],
      ).length;
      expect([1, 3]).toContain(failures);
      return (4 - failures) / 4;
    });
    expect(Math.max(...scores)).toBe(0.75);
  });
  it("keeps each classical answer local across distant choices", () => {
    for (let i = 0; i < 64; i++) {
      const table = tableFromIndex(i);
      for (const setting of [...accepted, ...discarded]) {
        const r = makeRound({
          id: i,
          mode: "classical",
          table,
          rng: seeded(i),
          settings: settingsFrom(setting),
        });
        expect(r.outcomes).toEqual(localOutcomes(table, settingsFrom(setting)));
        expect(
          r.trace.some((e) => e.kind === "inform" || e.kind === "instruct"),
        ).toBe(false);
      }
    }
  });
});
describe("late-message cheating", () => {
  it("wins all accepted settings for every preparation with the correct chronology", () => {
    for (let i = 0; i < 64; i++)
      for (const s of accepted) {
        const table = tableFromIndex(i);
        const r = makeRound({
          id: i,
          mode: "cheating",
          table,
          rng: seeded(i),
          settings: settingsFrom(s),
        });
        expect(r.passed).toBe(true);
        const kinds = r.trace.map((e) => e.kind);
        expect(kinds.indexOf("choose")).toBeLessThan(kinds.indexOf("inform"));
        expect(kinds.indexOf("inform")).toBeLessThan(kinds.indexOf("instruct"));
        expect(kinds.indexOf("instruct")).toBeLessThan(
          kinds.indexOf("measure"),
        );
        expect(r.trace[kinds.indexOf("inform")]).toEqual({
          kind: "inform",
          settings: [s[0], s[1]],
        });
        expect(r.outcomes[2]).toBe(
          lateInstruction(table, r.settings[0], r.settings[1]).answer,
        );
      }
  });
  it("restores the classical bound when the late message is removed", () => {
    for (let i = 0; i < 64; i++) {
      let wins = 0;
      for (const s of accepted) {
        const r = makeRound({
          id: i,
          mode: "cheating",
          late: false,
          table: tableFromIndex(i),
          rng: seeded(i),
          settings: settingsFrom(s),
        });
        wins += Number(r.passed);
        expect(
          r.trace.some((e) => e.kind === "inform" || e.kind === "instruct"),
        ).toBe(false);
      }
      expect(wins).toBeLessThanOrEqual(3);
    }
  });
});
describe("ideal joint GHZ sampling", () => {
  it("has exact uniform supports and unbiased marginals for every setting", () => {
    for (const s of [...accepted, ...discarded]) {
      const pool = support(s);
      expect(pool).toHaveLength(targets[s] === undefined ? 8 : 4);
      for (let site = 0; site < 3; site++)
        expect(pool.filter((o) => o[site] === 1)).toHaveLength(pool.length / 2);
      if (targets[s] !== undefined)
        pool.forEach((o) => expect(product(o)).toBe(targets[s]));
    }
  });
  it("samples all outcomes, independent settings, and zero accepted failures over 16000 rounds", () => {
    const rng = seeded(2000);
    let counts = emptyCounts();
    const settingsCounts = new Map<string, number>();
    const positive = [0, 0, 0];
    const seen = new Set<string>();
    for (let i = 0; i < 16000; i++) {
      const r = makeRound({ id: i, mode: "quantum", rng });
      counts = countRound(counts, r);
      const key = r.settings.join("");
      settingsCounts.set(key, (settingsCounts.get(key) ?? 0) + 1);
      r.outcomes.forEach((s, j) => (positive[j] += Number(s === 1)));
      seen.add(r.outcomes.join(","));
      expect(
        r.trace.some((e) => e.kind === "inform" || e.kind === "instruct"),
      ).toBe(false);
    }
    expect(counts.failures).toBe(0);
    expect(seen.size).toBe(8);
    positive.forEach((n) => expect(n / 16000).toBeGreaterThan(0.48));
    positive.forEach((n) => expect(n / 16000).toBeLessThan(0.52));
    expect(settingsCounts.size).toBe(8);
    settingsCounts.forEach((n) => expect(Math.abs(n - 2000)).toBeLessThan(160));
  });
  it("reproduces seeded rounds exactly", () => {
    const a = seeded(42),
      b = seeded(42);
    for (let id = 0; id < 30; id++)
      expect(makeRound({ id, mode: "quantum", rng: a })).toEqual(
        makeRound({ id, mode: "quantum", rng: b }),
      );
  });
  it("never assigns discarded measurements a target or pass/fail check", () => {
    for (const mode of ["classical", "cheating", "quantum"] as const)
      for (const s of discarded) {
        const r = makeRound({
          id: 1,
          mode,
          rng: seeded(1),
          settings: settingsFrom(s),
        });
        expect(r.passed).toBeUndefined();
        expect(r.targetParity).toBeUndefined();
        expect(r.trace.some((e) => e.kind === "verify")).toBe(false);
        expect(countRound(emptyCounts(), r)).toEqual({
          total: 1,
          accepted: 0,
          discarded: 1,
          passes: 0,
          failures: 0,
        });
      }
  });
});
