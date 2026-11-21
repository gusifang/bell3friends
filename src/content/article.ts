export const chapters = [
  {
    path: "/classical",
    label: "The impossible game",
    kicker: "01 / THE CHALLENGE",
    title: "Three friends. Four rules. No way out.",
    intro:
      "Alice, Bob and Charlie are invited to play a game. Three separate rooms. No communication. One question each: X or Y. Their only answers? +1 or −1.",
  },
  {
    path: "/cheating",
    label: "The cheating coordinator",
    kicker: "02 / A CHANGE OF PLAN",
    title: "A perfect score. A broken rule.",
    intro:
      "The coordinator returns with a new idea. He gives Alice and Bob their instructions as usual—but holds back Charlie’s. This time, he wants to hear the questions first.",
  },
  {
    path: "/quantum",
    label: "The quantum trick",
    kicker: "03 / THE EXTRAORDINARY PART",
    title: "Same game. Something extraordinary.",
    intro:
      "Our friends refuse to give up. Before each round, a source prepares three electrons together in a special quantum state, then sends one to each friend. Asked X? Measure X. Asked Y? Measure Y.",
  },
  {
    path: "/experiment",
    label: "The experiment",
    kicker: "04 / FROM STORY TO SCIENCE",
    title: "Turning the impossible game into an experimental setup",
    intro:
      "Replace the rooms with three separated measurement locations. A single physicist prepares Something, sends one part to each location, and later compares the records. The protocol stays the same.",
  },
];
export const objects = [
  ["letter", "A letter", "Two written answers, ready before the questions."],
  [
    "program",
    "A computer program",
    "A local lookup: input X or Y, return the prepared answer.",
  ],
  [
    "animal",
    "A trained animal",
    "Imagine two trained responses, one for each local cue.",
  ],
  [
    "light",
    "Classical light",
    "An illustrative local-response encoding with the same two answers.",
  ],
] as const;
