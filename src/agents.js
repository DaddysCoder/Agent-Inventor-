export const SPECIALISTS = {
  scientific: {
    id: "scientific",
    name: "Scientific Genius",
    mark: "Σ",
    note: "Give me the horrible problem",
    colour: "#80b8a2",
  },
  creative: {
    id: "creative",
    name: "Creative Genius",
    mark: "✦",
    note: "Reality can wait a minute",
    colour: "#d6a868",
  },
  pathfinder: {
    id: "pathfinder",
    name: "Pathfinder",
    mark: "◇",
    note: "Finds the door everyone missed",
    colour: "#9c9ed8",
  },
};

export const MODES = [
  ["decide", "Inventor decides"],
  ["invent", "Invent"],
  ["solve", "Solve"],
  ["explore", "Explore"],
  ["path", "Find a path"],
];

export function chooseSpecialists(input, mode = "decide") {
  if (mode === "invent") return ["creative"];
  if (mode === "solve") return ["scientific"];
  if (mode === "explore") return ["creative", "scientific"];
  if (mode === "path") return ["pathfinder"];

  const text = input.toLowerCase();
  const chosen = [];
  if (/research|science|technical|data|method|measure|model|cause|evidence|complex|solve|optim|experiment|test/.test(text)) chosen.push("scientific");
  if (/idea|novel|invent|creative|weird|strange|different|future|possib|new|imagine|concept/.test(text)) chosen.push("creative");
  if (/rule|policy|law|allowed|requirement|funding|eligib|bureaucr|approval|restriction|government|ndis|regulation|can't|cannot|blocked/.test(text)) chosen.push("pathfinder");
  return chosen;
}

export function buildSpecialistPrompt(id, question, context = "") {
  const briefs = {
    scientific: "Decompose the real mechanism. Separate known, inferred, plausible, speculative and unknown. Propose a test, proxy or model that could resolve the hardest uncertainty. Do not act as a feasibility cop.",
    creative: "Break the category. Use inversions and distant analogies. Produce non-obvious mechanisms, including one idea that sounds ridiculous before its mechanism is explained. Do not self-censor for practicality.",
    pathfinder: "Separate actual requirements from convention and assumption. Inspect definitions, thresholds, timing, discretion and alternate legitimate sequences. Never facilitate deception, illegality or bypassing safeguards.",
  };
  return `${briefs[id]}\n\nProblem: ${question}${context ? `\n\nCurrent thinking: ${context}` : ""}`;
}

export function buildInventorPrompt(question, specialistOutputs) {
  const material = specialistOutputs.length
    ? specialistOutputs.map((item) => `${SPECIALISTS[item.id].name}:\n${item.content}`).join("\n\n")
    : "No specialist was necessary. Think independently.";
  return `You are Inventor, the primary intelligence. Transform the material; never merely summarise it. Ask what becomes possible if these things are true at once. Identify a genuinely new mechanism, what is actually new, and the most useful next move.\n\nProblem: ${question}\n\nSpecialist material:\n${material}`;
}
