import { useState } from "react";
const rows = [
  ["A.X", "B.X", "C.X"],
  ["A.X", "B.Y", "C.Y"],
  ["A.Y", "B.X", "C.Y"],
  ["A.Y", "B.Y", "C.X"],
];
const names = ["A.X", "A.Y", "B.X", "B.Y", "C.X", "C.Y"];
export function MultiplicationProof() {
  const [step, setStep] = useState(0);
  return (
    <section className="proof">
      <div className="section-heading">
        <span className="eyebrow">THE IMPOSSIBILITY, IN SIX PAIRS</span>
        <h2>Multiply the four rows.</h2>
      </div>
      <p>
        Every prepared answer appears twice. Whether it is +1 or −1, multiplying
        it by itself gives +1.
      </p>
      <div className={`proof-board step-${step}`} data-testid="proof-board">
        <div className="proof-chips">
          {rows.flatMap((row, r) =>
            row.map((name, c) => {
              const pair = names.indexOf(name);
              const occurrence = rows
                .flat()
                .slice(0, r * 3 + c)
                .filter((n) => n === name).length;
              return (
                <span
                  key={`${r}-${c}`}
                  className={`proof-chip pair-${pair}`}
                  style={{
                    left: `${step === 0 ? c * 33.33 : occurrence * 35}%`,
                    top: `${step === 0 ? r * 48 : pair * 36}px`,
                    width: step === 0 ? "31%" : "32%",
                  }}
                >
                  {name}
                </span>
              );
            }),
          )}
          {step >= 2 &&
            names.map((name, i) => (
              <span
                className="pair-value"
                style={{ top: `${i * 36}px` }}
                key={name}
                aria-label={`${name} pair equals +1`}
              >
                = +1
              </span>
            ))}
        </div>
        <div className="proof-result">
          <span>Required targets</span>
          <strong>−1 × +1 × +1 × +1</strong>
          <b>= −1</b>
          {step >= 2 && (
            <>
              <span>Six classical pairs, each equal to +1</span>
              <strong>(+1)⁶ = +1</strong>
            </>
          )}
          {step === 3 && <b className="contradiction">+1 ≠ −1</b>}
        </div>
      </div>
      <p aria-live="polite" data-testid="proof-description">
        {
          [
            "Twelve answer chips, arranged in the four accepted rows.",
            "The two occurrences of each answer move together into six pairs.",
            "Each pair contributes +1. The product of all four classical row products is +1.",
            "The required targets multiply to −1. No local response table can satisfy all four.",
          ][step]
        }
      </p>
      <div className="controls">
        <button
          className="primary"
          onClick={() => setStep((s) => Math.min(3, s + 1))}
          disabled={step === 3}
        >
          {step === 0 ? "Multiply all four rows" : "Next step"}
        </button>
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={!step}
        >
          Step back
        </button>
        <button onClick={() => setStep(0)}>Replay proof</button>
      </div>
      <details>
        <summary>Read the static proof</summary>
        <p>
          Multiplying the four left-hand products gives A.X² × A.Y² × B.X² ×
          B.Y² × C.X² × C.Y² = +1. Multiplying the required right-hand sides
          gives −1 × +1 × +1 × +1 = −1. Those cannot be equal.
        </p>
        <p>
          Equivalently, multiply the last three rules. Each Y answer appears
          twice and cancels to +1, leaving A.X × B.X × C.X = +1. The first rule
          demands −1.
        </p>
      </details>
    </section>
  );
}
