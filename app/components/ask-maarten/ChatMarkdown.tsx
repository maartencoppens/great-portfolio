'use client';
// Markdown in de antwoorden van Ask Maarten: alleen wat in een chatbericht thuishoort.
// Geen HTML, afbeeldingen, koppen of tabellen (die worden gewone tekst), en links alleen naar eigen domeinen.
import Markdown, { type Components } from 'react-markdown';
import { COLORS } from '@/app/components/werkbank/scene/config';

const ALLOWED = ['p', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'code', 'br'];
const SAFE_HOSTS = ['maartencoppens.be', 'palleys.be'];

/** Alleen relatieve links, mailto en eigen domeinen. Een gemanipuleerd antwoord kan zo geen phishinglink tonen. */
function safeHref(href?: string) {
  if (!href) return null;
  if (href.startsWith('/') || href.startsWith('#')) return href;
  if (href.startsWith('mailto:')) return href;
  try {
    const url = new URL(href);
    const ok = url.protocol === 'https:' && SAFE_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`));
    return ok ? url.href : null;
  } catch {
    return null;
  }
}

/** Tijdens het streamen: een half binnengekomen link of ** niet even als ruwe tekens tonen. */
function tidyPartial(text: string) {
  let t = text
    .replace(/\[([^\]]*)\]\([^)]*$/, '$1') // [tekst](https://pal…  → tekst
    .replace(/\[([^\]]*)$/, '$1'); // [tekst…  → tekst
  // Oneven aantal ** = nog niet gesloten: de laatste even weglaten
  if ((t.match(/\*\*/g) ?? []).length % 2) {
    const at = t.lastIndexOf('**');
    t = t.slice(0, at) + t.slice(at + 2);
  }
  return t;
}

const components: Components = {
  p: ({ children }) => <p style={{ margin: '0 0 0.7em' }}>{children}</p>,
  a: ({ href, children }) => {
    const safe = safeHref(href);
    if (!safe) return <>{children}</>;
    const external = /^https?:/.test(safe);
    return (
      <a
        href={safe}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        style={{ color: COLORS.pink, textDecoration: 'underline', textUnderlineOffset: '0.2em' }}
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => <ul style={{ margin: '0 0 0.7em', paddingLeft: '1.2em', listStyle: 'disc' }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ margin: '0 0 0.7em', paddingLeft: '1.4em', listStyle: 'decimal' }}>{children}</ol>,
  li: ({ children }) => <li style={{ margin: '0.15em 0' }}>{children}</li>,
  strong: ({ children }) => <strong style={{ fontWeight: 700, color: '#fff' }}>{children}</strong>,
  code: ({ children }) => (
    <code style={{ font: '0.9em ui-monospace, monospace', background: 'rgba(255,255,255,0.08)', padding: '0.1em 0.35em', borderRadius: 4 }}>
      {children}
    </code>
  ),
};

export function ChatMarkdown({ text, streaming }: { text: string; streaming: boolean }) {
  return (
    <div className="ask-md">
      <Markdown allowedElements={ALLOWED} unwrapDisallowed skipHtml components={components}>
        {streaming ? tidyPartial(text) : text}
      </Markdown>
    </div>
  );
}
