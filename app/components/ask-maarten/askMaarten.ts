'use client';
// Verbinding met Ask Maarten. De browser praat alleen met de eigen route /api/ask;
// die kent de API-sleutel en het model (zie app/api/ask/route.ts).
// Is die route nog niet ingesteld (503), dan draait een demo die duidelijk zegt dat het een demo is.

export type Message = { role: 'user' | 'assistant' | 'system'; content: string };

/** Stuurt het gesprek door en geeft het antwoord stukje per stukje terug via onToken. */
export async function askMaarten(messages: Message[], onToken: (t: string) => void, signal?: AbortSignal) {
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: messages.filter((m) => m.role !== 'system') }),
    signal: signal ?? null,
  });
  if (res.status === 503) return demo(messages, onToken, signal);
  if (res.status === 429) throw new Error('Too many questions at once. Give me a minute.');
  if (!res.ok || !res.body) throw new Error(`Ask Maarten is not answering right now (${res.status}).`);

  // Server-sent events: regels "data: {...}" met telkens een stukje tekst
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      const data = line.replace(/^data:\s*/, '').trim();
      if (!data || data === '[DONE]') continue;
      try {
        const token = JSON.parse(data).choices?.[0]?.delta?.content;
        if (token) onToken(token);
      } catch {
        // onvolledige regel, negeren
      }
    }
  }
}

async function demo(messages: Message[], onToken: (t: string) => void, signal?: AbortSignal) {
  const question = messages.filter((m) => m.role === 'user').at(-1)?.content ?? '';
  const answer =
    `Demo answer: soon Ask Maarten will answer "${question}" here. ` +
    'The chat API is not connected yet.';
  for (const word of answer.split(/(\s+)/)) {
    if (signal?.aborted) return;
    await new Promise((r) => setTimeout(r, 28));
    onToken(word);
  }
}
