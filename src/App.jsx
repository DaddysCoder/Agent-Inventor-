import React, { useEffect, useMemo, useState } from "react";
import { buildInventorPrompt, buildSpecialistPrompt, chooseSpecialists, MODES, SPECIALISTS } from "./agents.js";
import { callAgent } from "./provider.js";

const starter = "How could we create something that helps people discover needs they cannot easily put into words?";

export default function App() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("decide");
  const [status, setStatus] = useState("idle");
  const [called, setCalled] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [inventor, setInventor] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("inventor-history")) || []; } catch { return []; }
  });

  useEffect(() => localStorage.setItem("inventor-history", JSON.stringify(history.slice(0, 8))), [history]);
  const busy = status !== "idle";
  const route = useMemo(() => called.map((id) => SPECIALISTS[id].name).join(" + "), [called]);

  async function run(question = input, forced, direction = "") {
    const clean = question.trim();
    if (!clean || busy) return;
    setError(""); setInventor(""); setOutputs([]);
    const selected = forced || chooseSpecialists(`${clean} ${direction}`, mode);
    setCalled(selected); setStatus(selected.length ? "consulting" : "inventing");
    try {
      const material = await Promise.all(selected.map(async (id) => ({
        id,
        content: await callAgent({ agentId: id, question: clean, userPrompt: buildSpecialistPrompt(id, clean, direction) }),
      })));
      setOutputs(material); setStatus("inventing");
      const result = await callAgent({ agentId: "inventor", question: clean, prior: direction, userPrompt: buildInventorPrompt(clean, material) });
      setInventor(result);
      setHistory((old) => [{ question: clean, mode, called: selected, outputs: material, inventor: result }, ...old].slice(0, 8));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Something failed."); }
    finally { setStatus("idle"); }
  }

  async function push(id, direction) {
    if (!inventor || busy) return;
    setError(""); setStatus("consulting"); setCalled([id]);
    try {
      const extra = { id, content: await callAgent({ agentId: id, question: input, prior: inventor, userPrompt: buildSpecialistPrompt(id, input, `${inventor}\n${direction}`) }) };
      const material = [...outputs, extra]; setOutputs(material); setStatus("inventing");
      const result = await callAgent({ agentId: "inventor", question: input, prior: inventor, userPrompt: buildInventorPrompt(`${input}\nDirection: ${direction}`, material) });
      setInventor(result);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Something failed."); }
    finally { setStatus("idle"); }
  }

  function restore(item) {
    setInput(item.question); setMode(item.mode); setCalled(item.called); setOutputs(item.outputs); setInventor(item.inventor); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return <main className="shell">
    <header className="masthead">
      <div className="eyebrow">Experimental synthesis engine <span>Demo provider</span></div>
      <h1>Inventor<span className="period">.</span></h1>
      <p className="intro">Give it a hard problem, strange thought or half-built idea. Inventor owns the problem and calls specialist minds only when they can materially improve it.</p>
    </header>

    <section className="composer" aria-label="Ask Inventor">
      <label htmlFor="problem">What are you thinking about?</label>
      <textarea id="problem" value={input} onChange={(event) => setInput(event.target.value)} placeholder={starter} />
      <div className="modes" role="group" aria-label="Thinking mode">
        {MODES.map(([id, label]) => <button key={id} className={mode === id ? "selected" : ""} onClick={() => setMode(id)}>{label}</button>)}
      </div>
      <button className="convene" disabled={!input.trim() || busy} onClick={() => run()}>
        {status === "consulting" ? "Specialists thinking…" : status === "inventing" ? "Inventor synthesising…" : "Give it to Inventor"}
      </button>
    </section>

    {(called.length > 0 || inventor) && <section className="route">
      <span>Inventor called</span><strong>{route || "No specialist — thinking independently"}</strong>
    </section>}

    {outputs.length > 0 && <section className="specialist-list">
      {outputs.map((output, index) => { const mind = SPECIALISTS[output.id]; return <details key={`${output.id}-${index}`}>
        <summary><i style={{ color: mind.colour }}>{mind.mark}</i><span><b>{mind.name}</b><small>{mind.note}</small></span><em>Read notes</em></summary>
        <div className="notes">{output.content}</div>
      </details>; })}
    </section>}

    {inventor && <section className="result">
      <div className="result-label"><span>Inventor synthesis</span><i>Primary mind</i></div>
      <div className="answer">{inventor}</div>
    </section>}

    {error && <p className="error" role="alert">{error}</p>}

    {inventor && !busy && <section className="push">
      <p>Push the thinking</p>
      <div>
        <button onClick={() => push("creative", "This is still too ordinary. Mutate it until the mechanism becomes genuinely strange.")}>✦ Go stranger</button>
        <button onClick={() => push("scientific", "Solve the hardest technical or evidentiary problem properly.")}>Σ Solve it properly</button>
        <button onClick={() => push("pathfinder", "Find a legitimate route the current answer missed.")}>◇ Find another path</button>
        <button onClick={() => run(input, ["creative", "scientific", "pathfinder"], "Force a deeper collision between all three minds.")}>↻ Run full collision</button>
      </div>
    </section>}

    {history.length > 0 && <section className="history">
      <h2>Previous investigations</h2>
      {history.map((item, index) => <button key={`${item.question}-${index}`} onClick={() => restore(item)}><span>{item.question}</span><small>{item.called.length ? item.called.map((id) => SPECIALISTS[id].mark).join(" ") : "Inventor alone"}</small></button>)}
    </section>}

    <footer>Inventor is the central intelligence. Specialists advise; they do not lead.</footer>
  </main>;
}
