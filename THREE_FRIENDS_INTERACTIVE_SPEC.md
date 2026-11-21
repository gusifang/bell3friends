# Three Friends and the Impossible Game
## Codex-ready specification for an interactive web article

**Status:** Implementation specification, not an implementation.  
**Primary source:** `Three friends and the impossible game.pdf` (the author's story).  
**Visual reference:** `ghz_layout_1_triangle.svg`, with `ghz_layout_2_pipeline.svg` and `ghz_layout_3_arena.svg` as optional alternatives.  
**Audience:** Curious adults with no quantum-mechanics background.  
**Language:** English; write concise, vivid prose and avoid unnecessary interpretation debates.

## 1. Concept and non-negotiable principles

Build a polished, responsive, self-contained educational web article. Its promise is that **the experimental protocol stays the same** across the classical, cheating, and quantum chapters: prepare three items; send one to each separated location; choose X or Y locally; obtain ±1 outcomes; return choice/outcome records; accept only XXX, XYY, YXY, YYX; check the product rule; repeat.

Only the preparation differs between honest classical and quantum experiments. The cheating variant adds a conspicuous *late information path* that changes the chronology. **Do not imply that the quantum variant uses that information path.** Keep one underlying animated SVG scene and one simulation engine, configured by mode; avoid three unrelated animations.

The story calls the participants Alice, Bob and Charlie; the later experimental diagram should label them **Location A, B, C**. A **single physicist** prepares and distributes the items and later receives and checks the records. Keep the original story's playful tone and extraordinary conclusion. Preserve the story's stakes in text if used, but do not animate violence.

Use accessible wording for the item distributed: **“Something”** — letter, computer program, trained animal, classical light signal, or three carefully prepared entangled electrons. The selectable classical objects are *different embodiments of the same local-response model*, not different loopholes or physical claims about actual animals or optical equipment.

## 2. Structure: four chapters

Navigation: **1. The impossible game → 2. The cheating coordinator → 3. The quantum trick → 4. The experiment.** Use clear Previous/Next controls, a progress indicator, and bookmarkable URLs (`/classical`, `/cheating`, `/quantum`, `/experiment`). On page entry, preserve the same orientation of the three locations. Each chapter alternates two-to-four-sentence narrative passages with interactive moments; do not display a whole PDF page at once.

### Chapter 1 — The impossible classical game

**Question:** Can any set of local instructions guarantee victory?

1. Introduce Alice, Bob and Charlie in isolated rooms. Show X/Y question cards and ±1 answers. Present the four accepted settings and target products: **XXX→−1; XYY→+1; YXY→+1; YYX→+1**. Demonstrate one example: XYY with (+1,+1,+1) passes; XYY with (+1,+1,−1) fails.
2. Let the visitor choose what the physicist sends (letter, program, trained animal, classical light, or “surprise me”). Show a short one-line analogy and its consistent *hidden response table*; no choice changes the mathematical rules.
3. Provide six interactive ±1 switches: `A.X`, `A.Y`, `B.X`, `B.Y`, `C.X`, `C.Y`. Explain: **for any deterministic classical preparation in this model, each location's answer to X and Y is fixed for that round, independent of distant question choices**. A different response table may be prepared before the next round. An apparently random local object cannot guarantee perfection either; locally generated randomness does not escape the bound.
4. Display the four rows' calculated products live, with PASS/FAIL badges. The visitor can edit the six switches to try to make all four pass. Offer “Find a counterexample” (choose one of the failing accepted settings for the current table), “Random accepted round”, and “Try another preparation”. Never claim that a particular finite series *must* contain a failure: it is impossible to guarantee success for all possible accepted settings.
5. **Animated multiplication proof:** show all four left-hand products as twelve labeled chips. On “Multiply all four rows”, move and pair the two occurrences of each of `A.X`, `A.Y`, `B.X`, `B.Y`, `C.X`, `C.Y`. Every pair contributes (+1), so the product of the four *classical* row products is **+1**. Opposite side: multiply required targets `−1 × +1 × +1 × +1 = −1`. Finish with `+1 ≠ −1`. Provide Step back / Next step / Replay, plus an accessible static explanation. Optional secondary explanation: multiply the last three rows to infer XXX must be +1, contrary to its required −1.
6. Reveal the quantitative result *with its assumptions stated*: when each X/Y choice is independent and fair, no fixed local instruction table wins more than **75% of accepted rounds on average** (at least a **25% failure probability per accepted round**). Use separate counters for accepted, discarded, passed, and failed rounds. Don't describe 25% as a guaranteed observed fraction in every short run.

### Chapter 2 — The cheating coordinator

**Question:** What changes if the coordinator learns two questions before sending the third instruction?

Use exactly the same three-location picture. Add a conspicuous red dashed arrow **A/B question choices → coordinator → Charlie's late instruction**, absent in Chapters 1 and 3. The timeline is the principal interaction and must make the broken chronology visually unmistakable.

1. First show the **honest** sequence: prepare and distribute all three instructions → local questions are selected independently → local answers → results collected. The coordinator cannot adapt the preparation to the questions.
2. Toggle **“Allow a late message to C”**. Pause at the decisive moment: A and B have been given complete response tables and now receive their random questions; their *question labels* travel back to the coordinator. The coordinator has **not** seen their answers; he knows them because he chose their instructions.
3. For an accepted triple, C's required question is inferable from A/B's settings: `XX→X` (required parity −1), `XY→Y` (+1), `YX→Y` (+1), `YY→X` (+1). The coordinator then sends C a late instruction for that question, selected to enforce `outcomeC = requiredParity × outcomeA × outcomeB`. Show this equation and animate the late message **before Charlie answers**. This is possible only because the late message violates the original simultaneous/no-communication setup.
4. Include a worked example with A asked X and B asked Y; if their preassigned answers are −1 and +1, then C must answer −1, giving `(−1) × (+1) × (−1) = +1`. Let the visitor choose C's answer before revealing the correct one.
5. Show a split timeline: **honest preparation (all three instructions before questions)** versus **cheat (C's instruction after A/B questions)**. Highlight which event changed position. Add “Remove late message”: the cheating algorithm immediately loses its guarantee and reverts to the classical table bound.
6. The cheat can produce **100% pass among accepted rounds**, but it is not a valid local explanation of a spacelike-separated experiment. Note explicitly: it does **not** need to know A/B's measured answers, only their settings and the prearranged A/B instructions. For discarded triples, record/discard normally; do not invent a success rule.

### Chapter 3 — The quantum trick

**Question:** How can the same accepted measurements all pass without a late message?

The geometry, filtering, result collection and parity panel are unchanged. Replace “Something” by **three entangled electrons in an ideal GHZ state**. Show a continuous, jointly prepared connection at the source, but **no arrows carrying settings between the remote measurement sites**.

1. The three measurement choices X/Y are made independently and *after* preparation. For the interactive demonstration, offer **Run one**, **Run 20**, **Run 200**, **Pause**, **Reset**, and speed control. Indicate clearly that this is an **ideal mathematical simulation**, not a live physical apparatus.
2. For accepted setting triples, sample uniformly from the four possible ±1 outcome triples whose product equals the required parity. The individual outcomes must vary unpredictably; **do not always show the same winning answers**. Reveal all three outcomes simultaneously (or with purely decorative animation), never as though Charlie waits for information from A or B.
3. For discarded setting triples (XXY, XYX, YXX, YYY), show “Discarded — outside the four test settings”, not “Failed”. In an ideal GHZ model, these settings need not obey one of the four selected parity rules; to simulate the X/Y measurement scheme, they may be sampled uniformly from all eight ±1 triples.
4. For every accepted round, animate the multiplication of the three outcomes, illuminate the matching target, and mark **PASS**. The ideal-model accepted failure counter remains **0**, whatever the run length. Alongside it display discarded count and variable individual ±1 outcomes.
5. Add an expandable **“Why not a message?”** panel: the source never learns future choices; the stations send no messages to one another during the measurements; an observer cannot use these correlations to send a controlled faster-than-light message. Their unusual pattern is visible only when the independent records are compared later by ordinary communication.
6. Optional **“Show the physics”** drawer (not a prerequisite): use `|GHZ−⟩ = (|000⟩ − |111⟩)/√2`, with X and Y as spin components, and show `XXX = −1`, `XYY = YXY = YYX = +1`. The story uses electrons as an illustrative spin-½ system. A historical footnote should say that Zeilinger and collaborators tested a three-*photon* GHZ experiment in 2000. Do not imply real experiments achieve literally zero errors.

### Chapter 4 — Turning the impossible game into an experimental setup

Use the title **“Turning the impossible game into an experimental setup”** and the *triangular diagram* as the primary layout. The existing SVG is a **visual reference**; rebuild its shapes as accessible, animatable React/SVG components rather than inserting it only as an inert image. Offer an optional “Timeline view” inspired by the pipeline layout to clarify the sequence.

The step labels are: **1 Prepare & send Something → 2 Choose X/Y independently at A/B/C → 3 Return (setting, outcome) to the same physicist → 4 Filter accepted/discarded triples → 5 Check the parity of accepted triples → 6 Repeat.** Maintain the user's distinction between filtering and verification as separate stages.

Offer a three-way selector **Classical / Cheating / Quantum**, controlling the exact same visualization; keep the “cheat” setting visibly marked **invalid for a properly separated test**. Animate a sample packet through each location, then three records returning to the physicist. At the filter, **accepted settings** (XXX, XYY, YXY, YYX) proceed to the rule check; **discarded settings** (XXY, XYX, YXX, YYY) go to a gray discard bin and do **not** affect the pass percentage.

For accepted rounds, show a multiplication strip, e.g. `(+1) × (−1) × (−1) = +1`, compared with the required product for its setting. Use red/green **plus explicit text/icons**, not color alone. The terminal comparison should make these precise points: **Classical: at most 75% accepted-round success with independent uniform settings; Cheating: 100% by breaking chronology; Quantum: 100% in the ideal GHZ model without the late information path.** Provide one final paragraph connecting the contradiction to Bell's locality argument, avoiding the inaccurate claim that entanglement by itself means signalling faster than light.

## 3. Shared visual language and animation behavior

- **Art direction:** refined editorial/scientific graphic; generous white space; dark ink text, indigo preparation, turquoise independent choices, amber filtering, gray discard, green pass, vermilion fail, purple quantum, red dashed cheating message. No realistic experimental apparatus.
- **Reused geometry:** one physicist and three labeled locations (A, B, C). The same location and action icons persist across chapter transitions. On mobile, rearrange the triangular scene into three stacked lanes without changing order or meaning.
- **Animated events:** source preparation pulses → three *outgoing* packets → local X/Y choice flips independently → ±1 outcomes appear → three *return* records → ACCEPT/DISCARD routing → multiplication/check → counter updates → return to start. Allow stepping and pausing; do not animate discarded results through verification.
- **Chronology:** label stages and show a progress cursor. In Cheating, the red late-message arrow animates after A/B settings are displayed and before C's answer. In Quantum, never show such a transmission. Never imply an outcome travels instantaneously between stations.
- **Timing:** keep transitions readable (roughly 300–800 ms per meaningful event), adjustable speed; add `prefers-reduced-motion` support, keyboard-accessible controls, and a text-only transcript of the latest round.
- **Responsiveness/accessibility:** no information encoded only by color or motion; labels always visible; minimum 44×44 px touch targets; semantic controls; focus indicators; ARIA-live for round summaries without announcing every decorative movement; zoomable/selectable SVG text; high contrast.

## 4. Exact mathematical and simulation requirements

**Set of accepted settings** `S = {XXX, XYY, YXY, YYX}`; target parity `T(XXX)=−1`, `T(XYY)=T(YXY)=T(YYX)=+1`. **Discarded** `D = {XXY, XYX, YXX, YYY}`. Each local outcome is +1 or −1; a setting is a triple ordered A, B, C. Every accepted round passes iff `a*b*c === T(setting)`.

Define a clean, pure domain model, e.g. `Mode = 'classical' | 'cheating' | 'quantum'`; `Setting = 'X' | 'Y'`; `Sign = 1 | -1`; `ResponseTable = { A:{X,Y}, B:{X,Y}, C:{X,Y} }`; `Round = { id, mode, preparation, settings:[Setting,Setting,Setting], outcomes:[Sign,Sign,Sign], accepted, targetParity?, observedParity, passed?:boolean, trace:[Event] }`. Use exact TypeScript types; keep mathematical functions separate from UI components.

**Classical:** generate or let the visitor choose all six local values *before* any questions; resolve each outcome by its own location and setting only. A shared random seed or a newly sampled table each round is allowed, provided it is drawn before the settings and cannot depend on remote settings. The six-variable proof must work for all `2^6 = 64` deterministic tables. Every table violates either one or three of the four accepted target constraints; no table passes all four. For independently fair setting choices, the maximum expected pass fraction among accepted settings is 3/4. The simulation's *observed* percentage is not forcibly capped on short finite runs.

**Cheating:** generate A and B response tables first; let A/B settings be selected; expose only their **settings** to the coordinator; derive C's required setting for accepted rounds from A/B settings and its required parity; choose C's corresponding response to satisfy `target * a * b`, and deliver that instruction *after A/B question selection but before C's answer*. If the actual C setting produces a discarded triple, discard it. Ensure there is no dependency on seeing A/B's answer events; their values are already known from the original instructions.

**Quantum (ideal GHZ):** generate all three independent, uniformly random settings after preparation. If accepted, sample one of exactly four sign triples of the required parity with equal probability; if discarded, sample one of the eight sign triples uniformly. **Crucial implementation constraint:** sample an atomic *joint outcome*, not an event in which C receives a message or its outcome is causally computed from information delivered by A/B. (Internally computing a parity-consistent vector is fine; the animation must not depict a communication mechanism.) Local marginals must be 50/50, regardless of other sites' choices. This is a simple explanatory simulator, not a general-purpose quantum simulator.

Use an optional seeded pseudorandom number generator for reproducible demonstrations; let a “Replay same round” button show exactly the same questions, outputs, filtering, and verification. Random questions in normal mode must remain independent and unbiased; manually selecting a question is labeled **Explore a combination**, distinct from the independent-random experiment.

**Statistics:** counts for total, accepted, discarded, passes, failures; passing percentage denominator is **accepted** only. The theoretical classical bound is a statement about probability/long-run average, not a hard cap on finite observations. Distinguish the ideal quantum prediction (100%) from real-world noisy experimental results.

## 5. Engineering choices and deliverables

- Use **React + TypeScript + Vite**. Use native SVG/React components for dynamic diagrams and CSS transitions or a small animation library if justified. Avoid canvas and rasterizing the scientific diagram. Use local content/data rather than network services; article should work offline after loading. No backend, tracking, authentication, or paid APIs are needed.
- Separate `src/domain/` (GHZ rules, classical tables, cheating logic, sampling), `src/components/` (Physicist, Location, PacketArrow, Timeline, FilterGate, ParityCheck, Counters, MultiplicationProof), `src/chapters/` (chapter-specific narrative/interactions), and `src/content/` (the article prose). The reusable `ExperimentScene` receives a mode and a round trace; narrative drives the same scene through typed events.
- The article's text must be adapted from the supplied story **without silently replacing its main argument**. Reorder its quantum and cheating episodes to match the requested navigation. Correct the old PDF's historical addendum: name **Greenberger, Horne and Zeilinger (1989)**; note that experimental three-photon GHZ tests were published in **2000**, rather than claiming the experiment remains only a thought experiment. Describe the correlation as an ideal prediction, not exception-free real hardware.
- Deliver `README.md` with `npm install`, `npm run dev`, `npm run build`, `npm run test` and `npm run test:e2e`; clean project structure; responsive styling; all application source; tested math functions; replayable seeded examples; no placeholder buttons or dead interactions.

## 6. Tests and acceptance criteria

1. Verify the **exact four accepted and four discarded settings** and correct target sign for each; rejected triples never enter pass/fail counters.
2. Exhaustively enumerate all **64 classical response tables**: none passes all four settings; each violates an odd number (one or three); best accepted-setting success probability is exactly 3/4 for fair independent settings.
3. Exercise cheating with all four accepted triples and many A/B response tables: 100% pass when and only when the late message is enabled; event trace proves C's instruction is created **after** A/B settings and **before** C's response, with no dependence on actually observed A/B answers.
4. Run thousands of seeded ideal GHZ rounds: **0 accepted failures**; verify varied local ±1 outcomes, approximately balanced marginal outcomes, and correct discard behavior. Do not claim observed 0 failures establishes a physical theorem by itself.
5. Test the four-row proof animation step-by-step and its static fallback: six pairs each contribute +1 while required product is −1.
6. Browser tests cover both keyboard and touch interaction, pause/replay, counters, responsive layout, navigation/deep links, reduced motion, and the absence of a cheating arrow on the quantum page.
7. Run `npm run build`, `npm run test`, and `npm run test:e2e` successfully. Fix SVG label overflow and layout overlaps on desktop, tablet, and narrow phone widths.

## 7. Suggested development order

**Milestone A:** app shell, typography, chapter navigation, shared three-location scene and filter/rule display.  
**Milestone B:** pure simulation engine with unit tests; six-switch classical game and four-row multiplication animation.  
**Milestone C:** cheating chronology timeline, interactive late-message demonstration, and trace assertions.  
**Milestone D:** ideal GHZ animation, statistics, historical note, unified experiment chapter, accessibility and responsive QA.

### Prompt to give Codex

> Implement the interactive article described in `THREE_FRIENDS_INTERACTIVE_SPEC.md`. Use the attached `Three friends and the impossible game.pdf` as the source narrative and `ghz_layout_1_triangle.svg` as the primary visual reference (pipeline/arena SVGs are optional references). Implement the mathematical engine first and verify all the correctness tests before polishing animation. Use one shared SVG experiment scene across the chapters, with three mode configurations. Do not fake a quantum communication channel or apply pass/fail rules to discarded measurements. Produce a complete runnable React/TypeScript/Vite project, tests, and a README. Treat the specification's acceptance criteria as the definition of done.
