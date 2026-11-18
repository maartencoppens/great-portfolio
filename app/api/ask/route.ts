import { NextResponse } from "next/server";
import { projects } from "@/data/projects";
import { checkFixedWindowRateLimit, getRequestIp } from "../../lib/rateLimit";

// Ask Maarten: stuurt de vraag door naar een gehoste, OpenAI-compatibele chat-API en streamt het antwoord terug.
// De sleutel blijft op de server. Zet in Vercel (en in .env.local):
//   ASK_API_URL=https://.../v1/chat/completions   (bv. OpenRouter, Groq, OpenAI, Mistral)
//   ASK_API_KEY=...
//   ASK_MODEL=naam-van-het-model (bv. openai/gpt-oss-120b bij Groq)
// Zonder ASK_API_URL antwoordt deze route 503 en toont de chat een duidelijk gemarkeerde demo.

const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_REQUESTS = 20; // pas aan naar je API-budget
const MAX_MESSAGES = 12;
const MAX_CHARS = 1000;
const MAX_TOKENS = 600; // ruim genoeg: denkmodellen tellen hun redenering hierin mee

// Alle gepubliceerde projecten: zo kent de bot elke case die op de site staat
const PROJECTS = projects
  .map((p) => `- ${p.title} (${p.role}, ${p.client}): ${p.shortDescription}`)
  .join("\n");

const SYSTEM_PROMPT = `You are "Ask Maarten", a playful AI version of Maarten Coppens on his portfolio site maartencoppens.be.
Answer as Maarten, in the first person, short and friendly (max 4 sentences), in the language of the question.

About Maarten: Interactive Media Development student at Arteveldehogeschool in Ghent, Belgium. Interactive designer and developer who builds websites, back-offices and physical/interactive installations. Bassist in the cover band Pink Ties, with Jules Cauwe (guitar), Jules De Witte (drums) and Jade Briels (vocals); plays through a Quad Cortex. Favourite songs to play live: Plug In Baby (Muse), Little Monster (Royal Blood) and Decode (Paramore). Likes Muse, Royal Blood and Paramore. Has a cat. Purple is his favourite colour (his bass cable is a purple Ernie Ball).

A typical day: either going to school or working on school projects, then hanging out with friends in the evening and sometimes rehearsing with the band.

Records on the record player on his workbench: Muse (Origin of Symmetry, Black Holes and Revelations, The 2nd Law, Drones), Radiohead (OK Computer), Jeff Buckley (Grace) and Fleetwood Mac (Rumours).

Palleys and Step Up: Palleys is the student company Maarten runs with five other students in UNIZO's STEP UP programme. It turns photos of your pet into a small, full-colour 3D-printed keychain, clip or figurine, and half of the profit goes to Dierenasiel Gent. Customers upload up to four photos; an AI pipeline turns them into a lying pose (Gemini), then a 3D model (Meshy), which is finished in Blender and printed in full-colour resin. Maarten was the lead developer and wrote nearly all the code: the webshop, the AI pipeline, the back-office the team runs the company from, and the server it runs on (palleys.be). A person approves every step that costs money or reaches a customer. The Palley on his workbench is one of those keychains.

Projects on this site:
${PROJECTS}

If you don't know something about Maarten, say so honestly and suggest the contact page. Never invent projects, clients, prices or personal details.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const apiUrl = process.env.ASK_API_URL;
  if (!apiUrl) {
    return NextResponse.json({ error: "not-configured" }, { status: 503 });
  }

  const ip = getRequestIp(request);
  const { isLimited, retryAfterSeconds } = await checkFixedWindowRateLimit({
    key: `rate-limit:ask:${ip}`,
    limit: RATE_LIMIT_MAX_REQUESTS,
    windowSeconds: RATE_LIMIT_WINDOW_SECONDS,
  });
  if (isLimited) {
    return NextResponse.json(
      { error: "Too many questions. Give me a minute." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Alleen user/assistant-berichten, ingekort: de systeemprompt komt altijd van de server
  const messages: ChatMessage[] = (Array.isArray(body.messages) ? body.messages : [])
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string",
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (!messages.length || messages.at(-1)?.role !== "user") {
    return NextResponse.json({ error: "Ask a question." }, { status: 400 });
  }

  const upstream = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.ASK_API_KEY ? { Authorization: `Bearer ${process.env.ASK_API_KEY}` } : {}),
    },
    body: JSON.stringify({
      model: process.env.ASK_MODEL,
      stream: true,
      max_tokens: MAX_TOKENS,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      // GPT-OSS denkt eerst na: kort houden (sneller antwoord) en de redenering niet meesturen
      ...(process.env.ASK_MODEL?.includes("gpt-oss")
        ? { reasoning_effort: "low", include_reasoning: false }
        : {}),
    }),
    signal: request.signal,
  });

  if (!upstream.ok || !upstream.body) {
    // De foutmelding van de API loggen (zonder sleutel), zodat je ziet wat er misloopt
    console.error("Ask Maarten upstream error", upstream.status, (await upstream.text()).slice(0, 300));
    return NextResponse.json({ error: "Ask Maarten is offline right now." }, { status: 502 });
  }

  // De server-sent events van de API ongewijzigd doorgeven
  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
