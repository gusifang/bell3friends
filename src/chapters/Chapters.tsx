import { useState } from "react";
import {
  accepted,
  formatSign,
  localOutcomes,
  product,
  randomTable,
  settingsFrom,
  sites,
  tableFromIndex,
  targets,
  type Mode,
  type ResponseTable,
  type Setting,
} from "../domain/engine";
import { objects } from "../content/article";
import { Experiment, type RunRequest } from "../components/Experiment";
import { MultiplicationProof } from "../components/MultiplicationProof";
export function Rules() {
  return (
    <div className="rules" aria-label="Four accepted rules">
      {accepted.map((s) => (
        <div key={s}>
          <span>{s.split("").join(" · ")}</span>
          <strong>{formatSign(targets[s]!)}</strong>
        </div>
      ))}
    </div>
  );
}
export function Classical() {
  const [table, setTable] = useState<ResponseTable>(tableFromIndex(63));
  const [object, setObject] = useState(0);
  const [request, setRequest] = useState<RunRequest>();
  const send = (setting: string) =>
    setRequest({ setting, serial: (request?.serial ?? 0) + 1 });
  return (
    <>
      <section className="narrative">
        <p>
          The stakes are terrible: one loss, and the friends will be killed.
          Their ally is a coordinator who can give them instructions before each
          round—but cannot know which questions will come next.
        </p>
        <p>
          Can even the cleverest instructions guarantee that they survive every
          possible round?
        </p>
      </section>
      <Rules />
      <p className="caption">
        Multiply the three answers. Match the required sign. These are the four
        accepted settings.
      </p>
      <div className="example-pair">
        <div>
          <b className="pass">✓ XYY passes</b>
          <p>(+1) × (+1) × (+1) = +1</p>
        </div>
        <div>
          <b className="fail">✕ XYY fails</b>
          <p>(+1) × (+1) × (−1) = −1</p>
        </div>
      </div>
      <section className="workbench">
        <span className="eyebrow">YOUR TURN / PREPARE SOMETHING</span>
        <h2>Write their way out.</h2>
        <p>
          A letter, a program, even a trained animal: imagine Something that
          gives a local answer to either question. These are different
          embodiments of the same response table, not different loopholes.
        </p>
        <div className="object-choices">
          {objects.map((o, i) => (
            <button
              key={o[0]}
              aria-pressed={object === i}
              onClick={() => setObject(i)}
            >
              {o[1]}
            </button>
          ))}
          <button
            onClick={() =>
              setObject(Math.floor(Math.random() * objects.length))
            }
          >
            Surprise me
          </button>
        </div>
        <p className="object-analogy">{objects[object][2]}</p>
        <div className="instruction-grid">
          {sites.map((site) => (
            <div className="instruction-card" key={site}>
              <h3>
                {{ A: "Alice", B: "Bob", C: "Charlie" }[site]}{" "}
                <span>Location {site}</span>
              </h3>
              {(["X", "Y"] as Setting[]).map((setting) => (
                <label key={setting}>
                  <span>If asked {setting}</span>
                  <button
                    aria-label={`${site}.${setting}`}
                    aria-pressed={table[site][setting] === 1}
                    onClick={() =>
                      setTable((t) => ({
                        ...t,
                        [site]: { ...t[site], [setting]: -t[site][setting] },
                      }))
                    }
                  >
                    {formatSign(table[site][setting])}
                  </button>
                </label>
              ))}
            </div>
          ))}
        </div>
        <p>
          For this preparation, each answer is fixed for the round and
          independent of distant question choices. Flip any of the six switches.
          Can you make every row pass?
        </p>
        <div className="live-table">
          <table>
            <caption>Results of your current response table</caption>
            <thead>
              <tr>
                <th>Setting</th>
                <th>Answers</th>
                <th>Product / target</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {accepted.map((s) => {
                const o = localOutcomes(table, settingsFrom(s));
                const p = product(o);
                const pass = p === targets[s];
                return (
                  <tr key={s}>
                    <th>{s}</th>
                    <td>{o.map(formatSign).join(" · ")}</td>
                    <td>
                      {formatSign(p)} / {formatSign(targets[s]!)}
                    </td>
                    <td className={pass ? "pass" : "fail"}>
                      {pass ? "✓ PASS" : "✕ FAIL"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="controls">
          <button
            className="primary"
            onClick={() =>
              send(
                accepted.find(
                  (s) =>
                    product(localOutcomes(table, settingsFrom(s))) !==
                    targets[s],
                )!,
              )
            }
          >
            Find a counterexample
          </button>
          <button onClick={() => send(accepted[Math.floor(Math.random() * 4)])}>
            Random accepted round
          </button>
          <button onClick={() => setTable(randomTable(Math.random))}>
            Try another preparation
          </button>
        </div>
        <p className="caption">
          These two demonstrations explore accepted settings. The experiment
          below normally chooses all three questions independently.
        </p>
      </section>
      <MultiplicationProof />
      <section className="narrative">
        <h2>No guarantee. A precise limit.</h2>
        <p>
          A fresh instruction table before every round cannot solve the
          contradiction. Local randomness cannot either: it mixes strategies
          that each face the same bound.
        </p>
        <p>
          With independent, fair X/Y choices, the best classical strategy passes{" "}
          <strong>75% of accepted rounds on average</strong>. Each accepted
          round has at least a 25% failure probability. A short lucky streak can
          still pass every time.
        </p>
      </section>
      <Experiment mode="classical" table={table} request={request} />
    </>
  );
}
export function Cheating() {
  const [late, setLate] = useState(false);
  const [guess, setGuess] = useState<number | null>(null);
  return (
    <>
      <section className="narrative">
        <p>
          In an honest round, all three instructions leave before the questions
          are chosen. But what if the coordinator secretly waits to hear Alice’s
          and Bob’s question labels before instructing Charlie?
        </p>
        <p>
          He does not need their measured answers. He already knows what they
          will say—he wrote their instructions.
        </p>
      </section>
      <section className="workbench">
        <span className="eyebrow">THE CHRONOLOGY IS THE TRICK</span>
        <h2>Move just one event.</h2>
        <div className="split-timeline">
          <div>
            <h3>Honest preparation</h3>
            <ol>
              <li>
                Prepare and send A, B, <b>C instructions</b>
              </li>
              <li>Choose local X/Y questions independently</li>
              <li>Reveal local answers</li>
              <li>Collect records</li>
            </ol>
          </div>
          <div className={late ? "cheat-enabled" : ""}>
            <h3>Cheating coordinator</h3>
            <ol>
              <li>Prepare and send A/B instructions</li>
              <li>Choose questions; return A/B labels</li>
              <li>
                <b>Send C’s late instruction</b>
              </li>
              <li>Reveal answers; collect records</li>
            </ol>
          </div>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={late}
            onChange={(e) => setLate(e.target.checked)}
          />
          Allow a late message to C
        </label>
        {late && (
          <button onClick={() => setLate(false)}>Remove late message</button>
        )}
        <p>
          {late
            ? "The guarantee now comes from breaking the chronology. C’s instruction follows A/B’s questions."
            : "Without the late message, all three instructions are fixed before questions. The classical bound applies."}
        </p>
      </section>
      <section className="narrative">
        <h2>Charlie’s answer is the last piece.</h2>
        <p>
          For accepted triples, A/B’s questions tell the coordinator which
          question C must receive: XX → X, XY → Y, YX → Y, YY → X. The actual C
          choice remains independent; other triples are discarded normally.
        </p>
        <div className="formula">
          C = required parity × A’s prepared answer × B’s prepared answer
        </div>
        <p>
          Alice is asked X and answers −1. Bob is asked Y and answers +1. For
          accepted XYY, what must Charlie answer?
        </p>
        <div className="controls">
          <button aria-pressed={guess === -1} onClick={() => setGuess(-1)}>
            Charlie answers −1
          </button>
          <button aria-pressed={guess === 1} onClick={() => setGuess(1)}>
            Charlie answers +1
          </button>
        </div>
        {guess !== null && (
          <p aria-live="polite" className={guess === -1 ? "pass" : "fail"}>
            {guess === -1 ? "Exactly." : "Try the other sign."} (−1) × (+1) ×
            (−1) = +1.
          </p>
        )}
      </section>
      <Experiment mode="cheating" late={late} />
      <section className="narrative">
        <p>
          The cheat can pass 100% of accepted rounds. Its success is no mystery:
          information about two distant questions reaches the coordinator in
          time to change the third instruction.
        </p>
        <p>
          That is not a valid local explanation of a properly separated
          experiment. Now comes the astonishing part: quantum mechanics predicts
          the same perfect pattern without that late information path.
        </p>
      </section>
    </>
  );
}
export function Quantum() {
  return (
    <>
      <section className="narrative">
        <p>
          Each friend measures one of two perpendicular spin components, X or Y.
          Each result is +1 or −1. They can measure either component, but not
          both on the same electron.
        </p>
        <p>
          The questions are chosen independently, after preparation. No station
          sends another its question. No coordinator waits to tailor Charlie’s
          answer.
        </p>
      </section>
      <Rules />
      <div className="pull-quote">
        The individual answers vary.
        <br />
        <em>The accepted products agree.</em>
      </div>
      <Experiment mode="quantum" />
      <section className="narrative">
        <h2>A pattern no instruction table can carry.</h2>
        <p>
          In the ideal GHZ model, every accepted round passes. Each local answer
          is still equally likely to be +1 or −1. The extraordinary pattern
          appears only in their joint results.
        </p>
        <p>
          This is a mathematical prediction, not a claim that real apparatus is
          free from noise or error. Seeing zero simulated failures illustrates
          the rule; it does not experimentally prove it.
        </p>
        <details>
          <summary>Why not a message?</summary>
          <p>
            The source never learns future question choices. During measurement,
            the stations send no messages to one another. No observer can
            control their random local outcome to transmit a faster-than-light
            message.
          </p>
          <p>
            Only later, when the independently recorded settings and outcomes
            are compared by ordinary communication, does the correlation become
            visible. The jointly sampled simulation is a description of those
            probabilities, not a proposed hidden communication mechanism.
          </p>
        </details>
        <details>
          <summary>Show the physics</summary>
          <div className="formula">|GHZ−⟩ = (|000⟩ − |111⟩) / √2</div>
          <p>
            X and Y denote perpendicular spin components (Pauli measurements).
            This state predicts XXX = −1 and XYY = YXY = YYX = +1. Each accepted
            setting has four equally likely outcome triples. The discarded
            settings have eight equally likely triples.
          </p>
          <p>
            Greenberger, Horne and Zeilinger introduced the argument in 1989.
            Electrons are the story’s illustrative spin-½ system; Zeilinger and
            collaborators published an experimental three-photon GHZ test in
            2000. Real experiments do not achieve literally exception-free
            hardware.
          </p>
        </details>
      </section>
    </>
  );
}
export function FinalExperiment() {
  const [mode, setMode] = useState<Mode>("classical");
  return (
    <>
      <section className="narrative">
        <p>
          In the story, the examiner uses only the four game settings. In this
          experiment, every location chooses X or Y independently. That produces
          eight possible triples; only four enter the test.
        </p>
        <p>
          First filter. Then verify. A discarded triple is neither a win nor a
          loss.
        </p>
      </section>
      <div className="mode-selector" aria-label="Experiment mode">
        {(["classical", "cheating", "quantum"] as Mode[]).map((m) => (
          <button key={m} aria-pressed={mode === m} onClick={() => setMode(m)}>
            {m[0].toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
      <Experiment key={mode} mode={mode} allowTimeline />
      <section className="conclusion">
        <span className="eyebrow">
          SAME TEST. THREE VERY DIFFERENT STORIES.
        </span>
        <h2>What makes the difference?</h2>
        <div className="comparison">
          <div>
            <span>Classical</span>
            <strong>≤ 75%</strong>
            <p>
              Accepted-round success on average, with independent uniform
              choices.
            </p>
          </div>
          <div>
            <span>Cheating</span>
            <strong>100%</strong>
            <p>
              By breaking chronology. Invalid for a properly separated test.
            </p>
          </div>
          <div>
            <span>Ideal quantum</span>
            <strong>100%</strong>
            <p>
              Without the late information path. Real experiments include
              errors.
            </p>
          </div>
        </div>
        <p>
          The contradiction sharpens Bell’s locality argument: these ideal
          correlations cannot come from local instruction tables independent of
          the later measurement choices. Quantum mechanics predicts what that
          model cannot reproduce. Yet the friends still cannot use their
          outcomes to communicate faster than light.
        </p>
        <p>
          Three ordinary questions. Three unpredictable answers. An
          extraordinary pattern when we bring them together.
        </p>
      </section>
    </>
  );
}
