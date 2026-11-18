'use client';
// De chat zelf: echte HTML (scherp, toegankelijk), precies over het laptopscherm gelegd.
// Op gsm (of als het scherm te klein in beeld is) wordt het een paneel over het volle scherm.
import { useEffect, useRef, useState } from 'react';
import { COLORS, SCENES, type SceneKey } from '@/app/components/werkbank/scene/config';
import { askMaarten, type Message } from './askMaarten';
import { SUGGESTIONS } from './prompts';
import { chatStore, closeChat, useChat } from './store';

const MIN_WIDTH = 520; // kleiner dan dit in beeld: geen overlay op de laptop maar een paneel

export function ChatPanel({ portrait, sceneKey }: { portrait: boolean; sceneKey: SceneKey }) {
  const { open, pending, rect } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const abort = useRef<AbortController | null>(null);
  const opener = useRef<Element | null>(null);

  const overlay = !portrait && rect && rect.width >= MIN_WIDTH;
  // Op desktop wachten we tot de camera is ingezoomd (rect bekend); op gsm meteen
  const visible = open && (portrait || !!rect);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput('');
    const history: Message[] = [...messages, { role: 'user', content: q }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setBusy(true);
    abort.current = new AbortController();
    const system: Message = {
      role: 'system',
      content: `The visitor is at Maarten's workbench on his portfolio. Current mood: ${SCENES[sceneKey].naam}.`,
    };
    try {
      await askMaarten(
        [system, ...history],
        (t) =>
          setMessages((m) => {
            const copy = [...m];
            copy[copy.length - 1] = { role: 'assistant', content: copy[copy.length - 1]!.content + t };
            return copy;
          }),
        abort.current.signal,
      );
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: 'assistant', content: 'Something went wrong. Try again in a moment.' };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  // Vraag van een aangeklikt object automatisch versturen
  useEffect(() => {
    if (visible && pending) {
      chatStore.set({ pending: undefined });
      send(pending);
    }
  }, [visible, pending]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus: bij openen naar het invoerveld, bij sluiten terug naar waar je was
  useEffect(() => {
    if (visible) {
      opener.current ??= document.activeElement;
      inputRef.current?.focus({ preventScroll: true });
    } else if (!open && opener.current) {
      (opener.current as HTMLElement).focus?.({ preventScroll: true });
      opener.current = null;
      abort.current?.abort();
    }
  }, [visible, open]);

  // Escape sluit
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return closeChat();
      // Tab blijft binnen het chatvenster (het is een modaal venster)
      if (e.key !== 'Tab') return;
      const dialog = document.querySelector<HTMLElement>('.ask[role="dialog"]');
      if (!dialog) return;
      const items = [...dialog.querySelectorAll<HTMLElement>('button, input, textarea, a[href], [tabindex]:not([tabindex="-1"])')].filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
      );
      const first = items[0];
      const last = items.at(-1);
      if (!first || !last) return;
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !dialog.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Altijd naar het nieuwste bericht scrollen
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  const frame: React.CSSProperties = overlay
    ? { left: rect!.left, top: rect!.top, width: rect!.width, height: rect!.height, borderRadius: 8 }
    : portrait
      ? { left: 0, right: 0, bottom: 0, height: '88dvh', borderRadius: '18px 18px 0 0' }
      : { left: '50%', top: '50%', width: 'min(760px, 92vw)', height: 'min(560px, 82vh)', transform: 'translate(-50%, -50%)', borderRadius: 12 };

  // Lettergrootte schaalt mee met de grootte van het laptopscherm in beeld
  const scale = overlay ? Math.min(1.2, Math.max(0.78, rect!.width / 860)) : portrait ? 0.92 : 1;
  const streaming = busy && messages.at(-1)?.content !== '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
      aria-hidden={!visible}
      className="ask"
      style={{
        position: 'fixed',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#0e0c12',
        color: COLORS.cream,
        border: overlay ? 'none' : '1px solid #2a2433',
        boxShadow: overlay ? 'none' : '0 30px 90px rgba(0,0,0,0.7)',
        fontSize: 16 * scale,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.35s ease',
        ...frame,
      }}
    >
      {/* Kop: naam, ON AIR-lamp en sluiten */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '0.8em', padding: '0.9em 1.2em', borderBottom: '1px solid #221d2b' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6em', minWidth: 0 }}>
          <span id="chat-title" style={{ font: '800 1.05em var(--font-display), sans-serif', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
            ASK MAARTEN
          </span>
          <span style={{ font: '500 0.75em var(--font-body), sans-serif', color: '#7d7589', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            an AI version of me
          </span>
        </div>
        <span style={{ flex: 1 }} />
        <OnAir live={busy} />
        <button onClick={closeChat} aria-label="Close chat" style={iconButton}>
          ✕
        </button>
      </header>

      <div ref={logRef} role="log" aria-live="polite" style={{ flex: 1, overflowY: 'auto', padding: '1.4em 1.4em 0.6em' }}>
        {messages.length === 0 && (
          <div className="rise">
            <h2 style={{ margin: 0, font: '400 2.7em/0.9 var(--font-anton), Impact, sans-serif', letterSpacing: '0.005em' }}>
              ASK ME
              <br />
              ANYTHING.
            </h2>
            <p style={{ margin: '0.9em 0 1.4em', font: '500 0.92em/1.5 var(--font-body), sans-serif', color: '#a49cb5', maxWidth: '34em' }}>
              I answer with what Maarten told me about himself. Or click something on his desk.
            </p>
            {/* Suggesties als een setlist */}
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid #221d2b' }}>
              {SUGGESTIONS.map((q, i) => (
                <li key={q} style={{ borderBottom: '1px solid #221d2b' }}>
                  <button onClick={() => send(q)} className="setlist-item" style={setlistItem}>
                    <span style={{ font: '600 0.72em var(--font-body), sans-serif', color: '#6d6676', width: '2.4em' }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ flex: 1 }}>{q.toUpperCase()}</span>
                    <span aria-hidden className="setlist-arrow">→</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className="rise" style={{ margin: i ? '1.8em 0 0.7em' : '0 0 0.7em' }}>
              <div style={label('#6d6676')}>YOU</div>
              <div style={{ font: '400 1.75em/0.98 var(--font-anton), Impact, sans-serif', letterSpacing: '0.005em' }}>{m.content.toUpperCase()}</div>
            </div>
          ) : (
            <div key={i} className="rise">
              <div style={label(COLORS.pink)}>MAARTEN</div>
              <p style={{ margin: 0, font: '500 1em/1.6 var(--font-body), sans-serif', color: '#e6dfef', whiteSpace: 'pre-wrap', maxWidth: '38em' }}>
                {m.content}
                {busy && i === messages.length - 1 && <span className="caret" aria-hidden />}
              </p>
            </div>
          ),
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        style={{ display: 'flex', alignItems: 'center', gap: '0.7em', padding: '0.9em 1.4em 0.5em' }}
      >
        <span aria-hidden style={{ color: COLORS.accent, font: '800 1.3em var(--font-display), sans-serif' }}>
          ›
        </span>
        <label htmlFor="chat-input" style={visuallyHidden}>
          Your question
        </label>
        <input
          id="chat-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={streaming ? 'Maarten is answering…' : 'Type your question…'}
          autoComplete="off"
          style={{
            flex: 1,
            minWidth: 0,
            padding: '0.55em 0',
            border: 'none',
            borderBottom: '1px solid #3a3346',
            background: 'transparent',
            color: COLORS.cream,
            font: '500 1em var(--font-body), sans-serif',
            outline: 'none',
          }}
        />
        <button type="submit" disabled={busy || !input.trim()} style={{ ...sendButton, opacity: busy || !input.trim() ? 0.35 : 1 }}>
          ASK ↵
        </button>
      </form>
      <p style={{ margin: 0, padding: '0 1.4em 0.9em', font: '500 0.68em var(--font-body), sans-serif', color: '#5b5368' }}>
        AI can be wrong. Not sure? Email the real Maarten.
      </p>
    </div>
  );
}

/** De ON AIR-lamp van een studio: licht roze op zolang Maarten antwoordt. */
function OnAir({ live }: { live: boolean }) {
  return (
    <span
      className={live ? 'onair live' : 'onair'}
      aria-hidden
      style={{
        font: '800 0.68em var(--font-display), sans-serif',
        letterSpacing: '0.16em',
        padding: '0.45em 0.8em',
        borderRadius: 4,
        border: `1px solid ${live ? '#ff4f8b' : '#3a3346'}`,
        background: live ? '#ff4f8b' : 'transparent',
        color: live ? '#16060d' : '#6d6676',
        boxShadow: live ? '0 0 18px rgba(255,79,139,0.7)' : 'none',
        transition: 'all 0.25s ease',
      }}
    >
      ON AIR
    </span>
  );
}

const label = (color: string): React.CSSProperties => ({
  font: '700 0.66em var(--font-body), sans-serif',
  letterSpacing: '0.2em',
  color,
  marginBottom: '0.5em',
});
const iconButton: React.CSSProperties = { background: 'none', border: 'none', color: '#a49cb5', fontSize: '1em', cursor: 'pointer', padding: 4 };
const setlistItem: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'baseline',
  gap: '0.6em',
  padding: '0.6em 0.2em',
  background: 'none',
  border: 'none',
  color: 'inherit',
  textAlign: 'left',
  font: '400 1.22em/1 var(--font-anton), Impact, sans-serif',
  letterSpacing: '0.01em',
  cursor: 'pointer',
};
const sendButton: React.CSSProperties = {
  background: 'none',
  border: `1px solid ${COLORS.accent}`,
  borderRadius: 999,
  padding: '0.45em 0.9em',
  color: COLORS.cream,
  font: '800 0.75em var(--font-display), sans-serif',
  letterSpacing: '0.1em',
  cursor: 'pointer',
};
const visuallyHidden: React.CSSProperties = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' };
