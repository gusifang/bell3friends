export type Mode = "classical" | "cheating" | "quantum";
export type Setting = "X" | "Y";
export type Sign = 1 | -1;
export type Site = "A" | "B" | "C";
export type Triple<T> = [T, T, T];
export type ResponseTable = Record<Site, Record<Setting, Sign>>;
export type RNG = () => number;
export const sites: Site[] = ["A", "B", "C"];
export const accepted = ["XXX", "XYY", "YXY", "YYX"] as const;
export const discarded = ["XXY", "XYX", "YXX", "YYY"] as const;
export const targets: Record<string, Sign | undefined> = {
  XXX: -1,
  XYY: 1,
  YXY: 1,
  YYX: 1,
};
export type Event =
  | { kind: "prepare" | "distribute" | "choose" | "return" | "repeat" }
  | { kind: "inform"; settings: [Setting, Setting] }
  | { kind: "instruct"; setting: Setting; answer: Sign }
  | { kind: "measure"; outcomes: Triple<Sign> }
  | { kind: "filter"; accepted: boolean }
  | { kind: "verify"; passed: boolean };
export interface Round {
  id: number;
  mode: Mode;
  preparation: ResponseTable;
  settings: Triple<Setting>;
  outcomes: Triple<Sign>;
  accepted: boolean;
  targetParity?: Sign;
  observedParity: Sign;
  passed?: boolean;
  trace: Event[];
  exploratory: boolean;
}
export function seeded(seed: number): RNG {
  let n = seed >>> 0;
  return () => {
    n += 0x6d2b79f5;
    let t = Math.imul(n ^ (n >>> 15), 1 | n);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const product = (values: Sign[]): Sign =>
  values.reduce<number>((a, b) => a * b, 1) as Sign;
export const sign = (rng: RNG): Sign => (rng() < 0.5 ? -1 : 1);
export function tableFromIndex(n: number): ResponseTable {
  return Object.fromEntries(
    sites.map((s, i) => [
      s,
      { X: n & (1 << (i * 2)) ? 1 : -1, Y: n & (1 << (i * 2 + 1)) ? 1 : -1 },
    ]),
  ) as ResponseTable;
}
export const randomTable = (rng: RNG) => tableFromIndex(Math.floor(rng() * 64));
export const settingsFrom = (s: string) => s.split("") as Triple<Setting>;
export const localOutcomes = (
  table: ResponseTable,
  settings: Triple<Setting>,
) => sites.map((s, i) => table[s][settings[i]]) as Triple<Sign>;
export const allOutcomes: Triple<Sign>[] = Array.from(
  { length: 8 },
  (_, i) => [i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1] as Triple<Sign>,
);
export const support = (setting: string) =>
  allOutcomes.filter(
    (o) => targets[setting] === undefined || product(o) === targets[setting],
  );
export function lateInstruction(table: ResponseTable, a: Setting, b: Setting) {
  const setting: Setting = a === b ? "X" : "Y";
  const target = targets[a + b + setting]!;
  return { setting, answer: (target * table.A[a] * table.B[b]) as Sign };
}
export function makeRound(options: {
  id: number;
  mode: Mode;
  rng: RNG;
  table?: ResponseTable;
  settings?: Triple<Setting>;
  late?: boolean;
}): Round {
  const { id, mode, rng } = options;
  // Freeze a preparation before drawing any questions. Never consult remote choices here.
  const preparation = structuredClone(options.table ?? randomTable(rng));
  const settings = options.settings ?? [
    rng() < 0.5 ? "X" : "Y",
    rng() < 0.5 ? "X" : "Y",
    rng() < 0.5 ? "X" : "Y",
  ];
  const targetParity = targets[settings.join("")];
  const trace: Event[] = [
    { kind: "prepare" },
    { kind: "distribute" },
    { kind: "choose" },
  ];
  let outcomes = localOutcomes(preparation, settings);
  if (mode === "cheating" && options.late !== false) {
    const instruction = lateInstruction(preparation, settings[0], settings[1]);
    trace.push(
      { kind: "inform", settings: [settings[0], settings[1]] },
      { kind: "instruct", ...instruction },
    );
    if (settings[2] === instruction.setting) outcomes[2] = instruction.answer;
  }
  if (mode === "quantum") {
    const pool = support(settings.join(""));
    outcomes = [...pool[Math.floor(rng() * pool.length)]];
  }
  const observedParity = product(outcomes);
  const passed =
    targetParity === undefined ? undefined : observedParity === targetParity;
  trace.push(
    { kind: "measure", outcomes },
    { kind: "return" },
    { kind: "filter", accepted: targetParity !== undefined },
  );
  if (passed !== undefined) trace.push({ kind: "verify", passed });
  trace.push({ kind: "repeat" });
  return {
    id,
    mode,
    preparation,
    settings,
    outcomes,
    accepted: targetParity !== undefined,
    targetParity,
    observedParity,
    passed,
    trace,
    exploratory: !!options.settings,
  };
}
export interface Counts {
  total: number;
  accepted: number;
  discarded: number;
  passes: number;
  failures: number;
}
export const emptyCounts = (): Counts => ({
  total: 0,
  accepted: 0,
  discarded: 0,
  passes: 0,
  failures: 0,
});
export function countRound(c: Counts, r: Round): Counts {
  return {
    total: c.total + 1,
    accepted: c.accepted + Number(r.accepted),
    discarded: c.discarded + Number(!r.accepted),
    passes: c.passes + Number(r.passed === true),
    failures: c.failures + Number(r.passed === false),
  };
}
export const formatSign = (s: Sign) => (s === 1 ? "+1" : "−1");
export function summary(r: Round) {
  return `${r.settings.join("")}: ${r.outcomes.map(formatSign).join(" × ")} = ${formatSign(r.observedParity)}. ${!r.accepted ? "Discarded — outside the four test settings." : `${r.passed ? "PASS" : "FAIL"}; required ${formatSign(r.targetParity!)}.`}`;
}
