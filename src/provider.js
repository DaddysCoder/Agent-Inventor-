import { SPECIALISTS } from "./agents.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function topic(text) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 96 ? `${clean.slice(0, 93)}…` : clean;
}

export async function callAgent({ agentId, userPrompt, question, prior = "" }) {
  // Demo provider. Set VITE_AGENT_ENDPOINT to a server-side endpoint later.
  // Never put a model API key in this client.
  const endpoint = import.meta.env.VITE_AGENT_ENDPOINT;
  if (endpoint) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, userPrompt, question, prior }),
    });
    if (!response.ok) throw new Error(`Agent endpoint failed (${response.status})`);
    const data = await response.json();
    return data.output;
  }

  await wait(420 + Math.random() * 380);
  const subject = topic(question);
  if (agentId === "scientific") {
    return `The difficult part of “${subject}” is probably not the visible task; it is identifying the variable that actually controls the outcome.\n\nKNOWN — there is a desired change and an assumed route to it.\nINFERRED — at least one hidden constraint is being treated as fixed.\nUNKNOWN — whether the current measure captures the thing that matters.\n\nI would map inputs → mechanism → observable outcome, then design one cheap discriminating test. A useful twist is to treat missing or inconsistent information as a signal: where the system fails to record something may reveal where the true mechanism sits.\n\nBest contribution to Inventor: invent around the measurement gap, not around the current solution.`;
  }
  if (agentId === "creative") {
    return `The obvious category for “${subject}” is too narrow. Three mutations:\n\n1. Reverse who adapts: the environment reorganises around signals from the person or problem.\n2. Borrow from ecology: make several small approaches compete, combine and die instead of committing to one grand answer.\n3. Make the invisible relationship the artefact—not another app or dashboard, but a device or ritual that exposes changes, tensions and openings over time.\n\nThe initially ridiculous idea: build something whose product is better unanswered questions. Its mechanism is a question lineage: each failed answer changes what can be asked next.\n\nBest contribution to Inventor: the solution may be a living search process, not a finished object.`;
  }
  if (agentId === "pathfinder") {
    return `Before accepting the barrier around “${subject}”, I would tag every constraint as: explicit rule, delegated discretion, workflow habit, technical limit or folklore.\n\nThen inspect the controlling definition, the decision-maker, thresholds, timing and sequence. A common legitimate opening is not an exemption but reordered steps: B → A can sometimes reach the same compliant result that A → B blocks. Adjacent systems may also confer a right, resource or evidence pathway this one never advertises.\n\nBest contribution to Inventor: keep the outcome fixed but redesign the route. Verify the exact authority before relying on it.`;
  }

  const consulted = [...userPrompt.matchAll(/(Scientific Genius|Creative Genius|Pathfinder):/g)].map((match) => match[1]);
  const collision = consulted.length
    ? `The useful collision is between ${consulted.join(" and ")}.`
    : "No specialist is needed yet; the first invention is a sharper frame.";
  return `${collision}\n\nINVENTION\nCreate a “possibility ledger” for ${subject}: every observation is stored not as a conclusion, but as a change to the available design space. Evidence can unlock or close mechanisms; strange ideas generate tests; constraints become parameters; alternate routes become prototypes.\n\nWHAT IS ACTUALLY NEW?\nNot several personalities sitting beside each other. The mechanism is recursive: each mind changes what the next mind is able to search, and Inventor must produce a transformed proposal rather than a summary.\n\nSTRONGEST NEXT MOVE\nChoose the most uncertain assumption and build the smallest test that could surprise you. Then feed that result back through Inventor.${prior ? "\n\nThis pass deliberately treats the earlier answer as raw material rather than a final." : ""}`;
}

export { SPECIALISTS };
