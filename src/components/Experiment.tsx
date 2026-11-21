import { useEffect, useReducer, useRef, useState } from "react";
import {
  accepted,
  makeRound,
  seeded,
  settingsFrom,
  summary,
  type Mode,
  type ResponseTable,
  type Triple,
  type Setting,
} from "../domain/engine";
import { initialPlayback, playbackReducer } from "../domain/playback";
import { ExperimentScene } from "./ExperimentScene";
export interface RunRequest {
  setting: string;
  serial: number;
}
export function Experiment({
  mode,
  table,
  late = true,
  request,
  allowTimeline = false,
}: {
  mode: Mode;
  table?: ResponseTable;
  late?: boolean;
  request?: RunRequest;
  allowTimeline?: boolean;
}) {
  const [state, dispatch] = useReducer(
    playbackReducer,
    undefined,
    initialPlayback,
  );
  const [speed, setSpeed] = useState(1);
  const [timeline, setTimeline] = useState(false);
  const [combination, setCombination] = useState("XXX");
  const [seed, setSeed] = useState(() =>
    String(crypto.getRandomValues(new Uint32Array(1))[0]),
  );
  const rng = useRef(seeded(Number(seed)));
  const section = useRef<HTMLElement>(null);
  const nextId = useRef(1);
  const handled = useRef(0);
  const create = (settings?: Triple<Setting>) =>
    makeRound({
      id: nextId.current++,
      mode,
      rng: rng.current,
      table,
      late,
      settings,
    });
  const run = (n: number, settings?: Triple<Setting>) =>
    dispatch({ type: "start", round: create(settings), remaining: n - 1 });
  useEffect(() => {
    dispatch({ type: "reset" });
  }, [mode, late]);
  useEffect(() => {
    if (request && request.serial !== handled.current) {
      handled.current = request.serial;
      run(1, settingsFrom(request.setting));
      section.current?.scrollIntoView({ block: "start" });
    }
  }, [request]);
  useEffect(() => {
    if (!state.playing || !state.round) return;
    const timer = window.setTimeout(() => {
      if (state.cursor === state.round!.trace.length - 1 && state.remaining > 0)
        dispatch({ type: "next", round: create() });
      else {
        dispatch({ type: "tick" });
        // Stop at the newly exposed information path on a single cheating demonstration.
        if (
          mode === "cheating" &&
          late &&
          state.remaining === 0 &&
          state.round!.trace[state.cursor + 1]?.kind === "inform" &&
          !state.replay
        )
          dispatch({ type: "pause" });
      }
    }, 500 / speed);
    return () => window.clearTimeout(timer);
  }, [
    state.playing,
    state.cursor,
    state.round,
    state.remaining,
    speed,
    mode,
    late,
    table,
  ]);
  const done = !!state.round && state.cursor === state.round.trace.length - 1;
  const c = state.counts;
  return (
    <section
      ref={section}
      className="experiment"
      aria-label="Interactive experiment"
    >
      <div className="experiment-heading">
        <h2>Put it to the test</h2>
        {allowTimeline && (
          <button
            aria-pressed={timeline}
            onClick={() => setTimeline(!timeline)}
          >
            {timeline ? "Triangle view" : "Timeline view"}
          </button>
        )}
      </div>
      <p className="experiment-note">
        {mode === "quantum"
          ? "Ideal mathematical simulation · not a live physical apparatus."
          : mode === "cheating" && late
            ? "This late-message protocol is invalid for a properly separated test."
            : "Answers are prepared before independent, fair X/Y questions."}
      </p>
      <ExperimentScene
        mode={mode}
        late={late}
        round={state.round}
        cursor={state.cursor}
        timeline={timeline}
        playing={state.playing}
      />
      <div className="controls">
        <button className="primary" onClick={() => run(1)}>
          Run one
        </button>
        <button onClick={() => run(20)}>Run 20</button>
        <button onClick={() => run(200)}>Run 200</button>
        <button
          disabled={!state.round || (done && state.remaining === 0)}
          onClick={() => dispatch({ type: state.playing ? "pause" : "resume" })}
        >
          {state.playing ? "Pause" : "Resume"}
        </button>
        <button
          disabled={!state.round || (done && state.remaining === 0)}
          onClick={() => {
            dispatch({ type: "pause" });
            if (done && state.remaining > 0)
              dispatch({ type: "next", round: create() });
            else dispatch({ type: "tick" });
          }}
        >
          Next step
        </button>
        <button
          disabled={!state.round}
          onClick={() => dispatch({ type: "replay" })}
        >
          Replay same round
        </button>
        <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
        <label>
          Speed{" "}
          <select
            aria-label="Speed"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          >
            <option value={0.5}>0.5×</option>
            <option value={1}>1×</option>
            <option value={2}>2×</option>
            <option value={8}>8×</option>
            <option value={40}>40× batch</option>
          </select>
        </label>
      </div>
      {state.remaining > 0 && (
        <p className="batch-status">{state.remaining} more rounds queued</p>
      )}
      {state.round?.trace[state.cursor].kind === "inform" && (
        <div className="callout warning">
          <b>The decisive moment.</b> Only A/B’s question labels have arrived.
          The coordinator already knows their prepared answers. C has not
          answered. Choose Resume or Next step to deliver the late instruction.
        </div>
      )}
      {state.round?.trace[state.cursor].kind === "instruct" && (
        <p className="callout warning">
          C’s late answer = required parity × A’s preassigned answer × B’s
          preassigned answer. It is delivered before any answer event.
        </p>
      )}
      <div className="counters" aria-label="Round statistics">
        {Object.entries(c).map(([key, value]) => (
          <div key={key}>
            <strong data-testid={`count-${key}`}>{value}</strong>
            <span>{key}</span>
          </div>
        ))}
        <div>
          <strong data-testid="pass-rate">
            {c.accepted
              ? `${((100 * c.passes) / c.accepted).toFixed(1)}%`
              : "—"}
          </strong>
          <span>accepted pass rate</span>
        </div>
      </div>
      <p className="stat-note">
        Observed counts, not a guaranteed finite-run fraction. Only accepted
        rounds enter the pass percentage. Exploration rounds are included; Reset
        starts a fresh random run.
      </p>
      <p className="transcript" aria-live="polite" aria-atomic="true">
        {done
          ? `${state.round!.exploratory ? "Explore a combination. " : ""}${state.replay ? "Replay (not counted again). " : ""}${summary(state.round!)}`
          : "Complete a round to read its outcome here."}
      </p>
      <details>
        <summary>Explore a combination & reproducible settings</summary>
        <div className="controls">
          <label>
            Setting{" "}
            <select
              aria-label="Explore setting"
              value={combination}
              onChange={(e) => setCombination(e.target.value)}
            >
              {[...accepted, "XXY", "XYX", "YXX", "YYY"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <button onClick={() => run(1, settingsFrom(combination))}>
            Explore a combination
          </button>
          <label>
            Random seed{" "}
            <input
              aria-label="Random seed"
              type="number"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
            />
          </label>
          <button
            onClick={() => {
              rng.current = seeded(Number(seed) || 0);
              dispatch({ type: "reset" });
            }}
          >
            Apply seed & reset
          </button>
        </div>
        <p>
          Manual exploration fixes the questions; it is not an
          independent-random experiment. Replay preserves the complete sampled
          round.
        </p>
      </details>
    </section>
  );
}
