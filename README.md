# Inventor

An experimental synthesis engine where **Inventor is the primary mind**. It can call Scientific Genius, Creative Genius, and Pathfinder for specialist work, then transforms their material into a new synthesis.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Cloudflare Pages

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

The current app uses a clearly labelled demo provider, so it runs without credentials. To connect a real server-side model router later, set `VITE_AGENT_ENDPOINT` to your Worker endpoint. Keep provider API keys in the Worker, never in this client.

## Architecture

- `src/agents.js` — routing and prompt construction
- `src/provider.js` — demo/live provider boundary
- `src/App.jsx` — session orchestration and interface
- `test/agents.test.js` — routing tests for all five modes

Clean extension points remain for server-side model routing, research tools, MCP, browser automation, budgets, parallel execution, Durable Objects, scheduling, and human approval.
