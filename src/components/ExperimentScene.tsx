import { useId } from "react";
import { formatSign, type Mode, type Round, type Site } from "../domain/engine";
export const eventLabels: Record<string, string> = {
  prepare: "Prepare Something",
  distribute: "Send to the three locations",
  choose: "Choose X/Y independently",
  inform: "A/B question labels return — pause and inspect",
  instruct: "Deliver C’s late instruction",
  measure: "Reveal the local outcomes",
  return: "Return records to the same physicist",
  filter: "Filter accepted / discarded",
  verify: "Check the required parity",
  repeat: "Round complete · repeat",
};
function Location({
  site,
  x,
  y,
  choice,
  outcome,
}: {
  site: Site;
  x: number;
  y: number;
  choice?: string;
  outcome?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className="location-box" width="224" height="118" rx="14" />
      <text className="svg-label" x="18" y="29">
        LOCATION {site}
      </text>
      <text className="svg-small" x="18" y="55">
        Independent local choice
      </text>
      <rect
        className="choice-pill"
        x="16"
        y="69"
        width="192"
        height="34"
        rx="8"
      />
      <text x="112" y="92" textAnchor="middle" className="svg-choice">
        {choice ?? "X or Y"} · {outcome ?? "±1"}
      </text>
    </g>
  );
}
function Physicist({ quantum }: { quantum: boolean }) {
  return (
    <g className="physicist">
      <rect x="365" y="190" width="230" height="126" rx="20" />
      <circle cx="480" cy="217" r="10" />
      <path d="M458 244 Q480 222 502 244" />
      <text x="480" y="269" textAnchor="middle">
        ONE PHYSICIST
      </text>
      <text className="source-caption" x="480" y="294" textAnchor="middle">
        {quantum ? "Three entangled electrons" : "Prepares “Something”"}
      </text>
    </g>
  );
}
function PacketArrow({
  d,
  active,
  kind,
  marker,
}: {
  d: string;
  active: boolean;
  kind: string;
  marker: string;
}) {
  return (
    <g>
      <path
        d={d}
        markerEnd={`url(#${marker})`}
        className={`packet-path ${kind} ${active ? "active" : ""}`}
      />
      {active && (
        <circle
          r="7"
          className={`packet-token ${kind}`}
          style={{ offsetPath: `path('${d}')` }}
        />
      )}
    </g>
  );
}
export function ExperimentScene({
  mode,
  round,
  cursor,
  timeline = false,
  late = true,
  playing = false,
}: {
  mode: Mode;
  round: Round | null;
  cursor: number;
  timeline?: boolean;
  late?: boolean;
  playing?: boolean;
}) {
  const id = useId().replaceAll(":", "");
  const current = round?.trace[cursor]?.kind;
  const seen = (kind: string) =>
    !!round &&
    round.trace.findIndex((e) => e.kind === kind) >= 0 &&
    round.trace.findIndex((e) => e.kind === kind) <= cursor;
  const cheat = mode === "cheating" && late;
  const positions = [
    { s: "A" as const, x: 30, y: 70 },
    { s: "B" as const, x: 706, y: 70 },
    { s: "C" as const, x: 368, y: 365 },
  ];
  const outgoing = [
    "M365 215 Q310 145 254 145",
    "M595 215 Q650 145 706 145",
    "M454 316 L454 365",
  ];
  const returning = [
    "M254 172 Q310 285 365 275",
    "M706 172 Q650 285 595 275",
    "M506 365 L506 316",
  ];
  const protocolStep =
    current === "prepare" || current === "distribute"
      ? 0
      : current === "choose" ||
          current === "inform" ||
          current === "instruct" ||
          current === "measure"
        ? 1
        : current === "return"
          ? 2
          : current === "filter"
            ? 3
            : current === "verify"
              ? 4
              : current === "repeat"
                ? 5
                : -1;
  return (
    <div
      className={`experiment-scene ${mode} event-${current ?? "ready"}`}
      data-testid="experiment-scene"
      data-paused={!playing}
    >
      <div className="scene-topline">
        <span className="eyebrow">ONE PROTOCOL · THREE LOCATIONS</span>
        <span className={`mode-tag ${mode}`}>
          {mode === "quantum"
            ? "Ideal GHZ model"
            : mode === "cheating" && late
              ? "Late message · invalid separated test"
              : "Local instructions"}
        </span>
      </div>
      {timeline ? (
        <>
          <ol className="pipeline">
            {[
              "Prepare & send Something",
              "Choose X/Y independently at A/B/C",
              "Return (setting, outcome) to the same physicist",
              "Filter accepted/discarded triples",
              "Check parity of accepted triples",
              "Repeat",
            ].map((s, i) => (
              <li
                key={s}
                aria-current={protocolStep === i ? "step" : undefined}
              >
                <b>{i + 1}</b>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          {seen("choose") && (
            <p className="timeline-records">
              {positions
                .map(
                  (p, i) =>
                    `${p.s}: ${round!.settings[i]} / ${seen("measure") ? formatSign(round!.outcomes[i]) : "awaiting outcome"}`,
                )
                .join(" · ")}
            </p>
          )}
          {cheat && (
            <p className="timeline-cheat">
              Invalid late path: A/B question labels → coordinator → C’s
              instruction
            </p>
          )}
        </>
      ) : (
        <>
          <svg
            className="triangle"
            viewBox="0 0 960 510"
            role="img"
            aria-labelledby={`${id}-title ${id}-desc`}
          >
            <title id={`${id}-title`}>
              One physicist and three independent locations
            </title>
            <desc id={`${id}-desc`}>
              A at upper left, B at upper right, C below. Preparation travels
              outward; records return later.{" "}
              {cheat
                ? "Red dashed arrows mark the invalid late information path."
                : "No question information travels between locations."}
            </desc>
            <defs>
              {["out", "back", "cheat"].map((m) => (
                <marker
                  key={m}
                  id={`${id}-${m}`}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M1 1 L9 5 L1 9"
                    className={`marker-${m}`}
                    fill="none"
                    strokeWidth="2"
                  />
                </marker>
              ))}
            </defs>
            <path className="geometry" d="M142 130 L818 130 L480 425 Z" />
            {outgoing.map((d, i) => (
              <PacketArrow
                key={d}
                d={d}
                active={current === "distribute" && (!cheat || i < 2)}
                kind="outgoing"
                marker={`${id}-out`}
              />
            ))}
            {returning.map((d) => (
              <PacketArrow
                key={d}
                d={d}
                active={current === "return"}
                kind="returning"
                marker={`${id}-back`}
              />
            ))}
            {mode === "quantum" && (
              <g
                className={`joint-preparation ${current === "prepare" ? "pulse" : ""}`}
              >
                <ellipse cx="480" cy="252" rx="136" ry="84" />
                <text x="480" y="153" textAnchor="middle">
                  Prepared together, before choices
                </text>
              </g>
            )}
            <Physicist quantum={mode === "quantum"} />
            {positions.map((p, i) => (
              <Location
                key={p.s}
                site={p.s}
                x={p.x}
                y={p.y}
                choice={seen("choose") ? round!.settings[i] : undefined}
                outcome={
                  seen("measure") ? formatSign(round!.outcomes[i]) : undefined
                }
              />
            ))}
            {cheat && (
              <g data-testid="cheating-arrow" className="cheat-path">
                <path
                  className={current === "inform" ? "active-message" : ""}
                  d="M254 88 Q390 38 480 190"
                  markerEnd={`url(#${id}-cheat)`}
                />
                <path
                  className={current === "inform" ? "active-message" : ""}
                  d="M706 88 Q570 38 480 190"
                  markerEnd={`url(#${id}-cheat)`}
                />
                <path
                  className={current === "instruct" ? "active-message" : ""}
                  d="M595 300 Q675 355 592 411"
                  markerEnd={`url(#${id}-cheat)`}
                />
                <text x="480" y="25" textAnchor="middle">
                  A/B QUESTIONS → COORDINATOR
                </text>
                <text x="670" y="335" textAnchor="middle">
                  LATE INSTRUCTION
                </text>
              </g>
            )}
            <g className="legend">
              <text x="30" y="501">
                — Preparation sent
              </text>
              <text x="242" y="501">
                — Records returned later
              </text>
            </g>
          </svg>
          <div className="mobile-lanes">
            <div className="mobile-source">
              One physicist ·{" "}
              {mode === "quantum"
                ? "three jointly prepared entangled electrons"
                : "prepares Something"}
            </div>
            {positions.map((p, i) => (
              <div className="mobile-location" key={p.s}>
                <b>Location {p.s}</b>
                <span>
                  Independent choice:{" "}
                  {seen("choose") ? round!.settings[i] : "X / Y"}
                </span>
                <strong>
                  {seen("measure") ? formatSign(round!.outcomes[i]) : "±1"}
                </strong>
                <small>
                  {current === "distribute"
                    ? cheat && i === 2
                      ? "C’s instruction is withheld"
                      : "Receiving preparation"
                    : current === "instruct" && i === 2
                      ? "Receiving the late instruction"
                      : current === "return"
                        ? "Returning record to physicist"
                        : "Local measurement"}
                </small>
              </div>
            ))}
            {cheat && (
              <div className="mobile-cheat">
                A/B question labels → coordinator → C’s late instruction
              </div>
            )}
          </div>
        </>
      )}
      <div className="stage-readout">
        <span className="stage-dot" />
        <strong>
          {current ? eventLabels[current] : "Ready. Prepare a round to begin."}
        </strong>
        {round && (
          <span>
            {cursor + 1}/{round.trace.length}
          </span>
        )}
      </div>
      {seen("filter") && round && (
        <svg
          className="routing"
          viewBox="0 0 800 85"
          role="img"
          aria-label={
            round.accepted
              ? "Accepted record routed to parity verification"
              : "Discarded record routed to gray bin, bypassing verification"
          }
        >
          <path
            d="M400 5 L400 25 L180 25 L180 50"
            className={!round.accepted ? "selected-discard" : "inactive-route"}
          />
          <path
            d="M400 5 L400 25 L620 25 L620 50"
            className={round.accepted ? "selected-accept" : "inactive-route"}
          />
          <text x="180" y="74" textAnchor="middle">
            {!round.accepted ? "▼ " : ""}DISCARD · no verification
          </text>
          <text x="620" y="74" textAnchor="middle">
            {round.accepted ? "▼ " : ""}ACCEPT · proceed to parity
          </text>
          {current === "filter" && (
            <circle
              r="6"
              className="packet-token"
              style={{
                offsetPath: `path('${round.accepted ? "M400 5 L400 25 L620 25 L620 50" : "M400 5 L400 25 L180 25 L180 50"}')`,
              }}
            />
          )}
        </svg>
      )}
      <div className="scene-processing">
        <FilterGate round={round} visible={seen("filter")} />
        <ParityCheck round={round} visible={seen("verify")} />
      </div>
    </div>
  );
}
export function FilterGate({
  round,
  visible,
}: {
  round: Round | null;
  visible: boolean;
}) {
  return (
    <div className="filter-gate">
      <span className="eyebrow">04 / FILTER</span>
      <b>
        {visible
          ? round!.accepted
            ? "ACCEPTED"
            : "DISCARDED"
          : "Which settings belong?"}
      </b>
      <span>XXX · XYY · YXY · YYX</span>
      <small>
        {visible && !round!.accepted
          ? "Outside the four test settings. No pass/fail check."
          : "Other settings go to the gray discard bin."}
      </small>
      <div
        className={`discard-bin ${visible && !round!.accepted ? "filled" : ""}`}
      >
        Discard bin{" "}
        {visible && !round!.accepted
          ? `· ${round!.settings.join("")}`
          : "· XXY, XYX, YXX, YYY"}
      </div>
    </div>
  );
}
export function ParityCheck({
  round,
  visible,
}: {
  round: Round | null;
  visible: boolean;
}) {
  return (
    <div className="parity-check">
      <span className="eyebrow">05 / VERIFY ACCEPTED ONLY</span>
      {visible && round ? (
        <>
          <b className={round.passed ? "pass" : "fail"}>
            {round.passed ? "✓ PASS" : "✕ FAIL"}
          </b>
          <span className="equation">
            {round.outcomes.map(formatSign).join(" × ")} ={" "}
            {formatSign(round.observedParity)}
          </span>
          <small>
            {round.settings.join("")} requires {formatSign(round.targetParity!)}
          </small>
        </>
      ) : (
        <>
          <b>Compare the product</b>
          <span>XXX → −1</span>
          <span>XYY · YXY · YYX → +1</span>
          <small>Discarded rounds never enter this check.</small>
        </>
      )}
    </div>
  );
}
