import { expect, it } from "vitest";
import { makeRound, seeded } from "./engine";
import { initialPlayback, playbackReducer, type Playback } from "./playback";
const round = makeRound({ id: 1, mode: "quantum", rng: seeded(1) });
function finish(s: Playback) {
  for (let i = 0; i < 20; i++) s = playbackReducer(s, { type: "tick" });
  return s;
}
it("counts a finished round once and does not count replay", () => {
  let s = playbackReducer(initialPlayback(), {
    type: "start",
    round,
    remaining: 0,
  });
  s = finish(s);
  expect(s.counts.total).toBe(1);
  expect(s.playing).toBe(false);
  s = finish(playbackReducer(s, { type: "replay" }));
  expect(s.counts.total).toBe(1);
  expect(s.round).toBe(round);
});
it("preserves position on pause/resume and clears queues on reset", () => {
  let s = playbackReducer(initialPlayback(), {
    type: "start",
    round,
    remaining: 199,
  });
  s = playbackReducer(s, { type: "tick" });
  s = playbackReducer(s, { type: "pause" });
  expect(s.cursor).toBe(1);
  expect(s.playing).toBe(false);
  s = playbackReducer(s, { type: "resume" });
  expect(s.cursor).toBe(1);
  expect(s.playing).toBe(true);
  expect(playbackReducer(s, { type: "reset" })).toEqual(initialPlayback());
});
it("moves to the next round without losing accumulated counters", () => {
  let s = finish(
    playbackReducer(initialPlayback(), { type: "start", round, remaining: 1 }),
  );
  const second = { ...round, id: 2 };
  s = playbackReducer(s, { type: "next", round: second });
  expect(s.remaining).toBe(0);
  expect(s.cursor).toBe(0);
  s = finish(s);
  expect(s.counts.total).toBe(2);
});
