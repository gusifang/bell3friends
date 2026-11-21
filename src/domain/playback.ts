import { countRound, emptyCounts, type Counts, type Round } from "./engine";
export interface Playback {
  round: Round | null;
  cursor: number;
  playing: boolean;
  remaining: number;
  counts: Counts;
  counted: number[];
  replay: boolean;
}
export const initialPlayback = (): Playback => ({
  round: null,
  cursor: 0,
  playing: false,
  remaining: 0,
  counts: emptyCounts(),
  counted: [],
  replay: false,
});
export type Action =
  | { type: "start"; round: Round; remaining: number }
  | { type: "next"; round: Round }
  | { type: "tick" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "reset" }
  | { type: "replay" };
export function playbackReducer(s: Playback, a: Action): Playback {
  if (a.type === "reset") return initialPlayback();
  if (a.type === "start")
    return {
      ...s,
      round: a.round,
      cursor: 0,
      remaining: a.remaining,
      playing: true,
      replay: false,
    };
  if (a.type === "next")
    return {
      ...s,
      round: a.round,
      cursor: 0,
      remaining: s.remaining - 1,
      replay: false,
    };
  if (a.type === "pause") return { ...s, playing: false };
  if (a.type === "resume") return { ...s, playing: !!s.round };
  if (a.type === "replay")
    return s.round
      ? { ...s, cursor: 0, remaining: 0, playing: true, replay: true }
      : s;
  if (!s.round) return s;
  const cursor = Math.min(s.cursor + 1, s.round.trace.length - 1);
  const complete = cursor === s.round.trace.length - 1;
  const shouldCount = complete && !s.replay && !s.counted.includes(s.round.id);
  return {
    ...s,
    cursor,
    counts: shouldCount ? countRound(s.counts, s.round) : s.counts,
    counted: shouldCount ? [...s.counted, s.round.id] : s.counted,
    playing: complete && s.remaining === 0 ? false : s.playing,
  };
}
