/**
 * The assistant's reply format: short markdown, then action tags on their own
 * lines — [[book]], [[lead]], [[project:slug]], [[service:slug]],
 * [[suggest:A|B|C]]. Tags are lifted out of the text and drawn as cards.
 */

export interface ReplyParts {
  text: string;
  book: boolean;
  lead: boolean;
  /** The model failed mid-answer; what arrived is kept. */
  interrupted: boolean;
  projects: string[];
  services: string[];
  suggestions: string[];
}

const TAG = /\[\[\s*(book|lead|interrupted|project:\s*[\w-]+|service:\s*[\w-]+|suggest:[^\]]*)\s*\]\]/gi;

export function parseReply(raw: string, streaming = false): ReplyParts {
  const parts: ReplyParts = { text: '', book: false, lead: false, interrupted: false, projects: [], services: [], suggestions: [] };

  let text = raw.replace(TAG, (_, body: string) => {
    const [kind, ...rest] = body.split(':');
    const value = rest.join(':').trim();
    switch (kind!.trim().toLowerCase()) {
      case 'book':
        parts.book = true;
        break;
      case 'lead':
        parts.lead = true;
        break;
      case 'interrupted':
        parts.interrupted = true;
        break;
      case 'project':
        if (!parts.projects.includes(value) && parts.projects.length < 3) parts.projects.push(value);
        break;
      case 'service':
        if (!parts.services.includes(value) && parts.services.length < 2) parts.services.push(value);
        break;
      case 'suggest':
        parts.suggestions = value
          .split('|')
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 3);
        break;
    }
    return '';
  });

  // Mid-stream, hide a tag that has started but not finished arriving.
  if (streaming) text = text.replace(/\[\[?[^\]\n]*$/, '');

  parts.text = text.replace(/\n{3,}/g, '\n\n').trim();
  return parts;
}

/* ── a deliberately tiny markdown subset ──────────────────────────── */

export type Inline =
  | { type: 'text'; value: string }
  | { type: 'strong'; value: string }
  | { type: 'link'; value: string; href: string; external: boolean };

export type Block = { type: 'p'; lines: Inline[][] } | { type: 'ul' | 'ol'; items: Inline[][] };

const INLINE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Internal paths, https and mailto only — anything else stays plain text. */
function safeHref(href: string): { href: string; external: boolean } | null {
  if (/^\/(?!\/)[\w\-/#?=&.]*$/.test(href)) return { href, external: false };
  if (/^https:\/\/[^\s]+$/i.test(href)) return { href, external: true };
  if (/^mailto:[^\s]+$/i.test(href)) return { href, external: false };
  return null;
}

function inline(line: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of line.matchAll(INLINE)) {
    if (m.index > last) out.push({ type: 'text', value: line.slice(last, m.index) });
    if (m[1]) out.push({ type: 'strong', value: m[1] });
    else {
      const safe = safeHref(m[3]!);
      out.push(safe ? { type: 'link', value: m[2]!, ...safe } : { type: 'text', value: m[2]! });
    }
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push({ type: 'text', value: line.slice(last) });
  return out;
}

const BULLET = /^\s*[-*•]\s+/;
const NUMBER = /^\s*\d+[.)]\s+/;

export function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  for (const chunk of text.split(/\n\s*\n/)) {
    const lines = chunk.split('\n').filter((l) => l.trim());
    let para: string[] = [];
    let list = null as { type: 'ul' | 'ol'; items: string[] } | null;

    const flushPara = () => {
      if (para.length) blocks.push({ type: 'p', lines: para.map(inline) });
      para = [];
    };
    const flushList = () => {
      if (list) blocks.push({ type: list.type, items: list.items.map(inline) });
      list = null;
    };

    for (const line of lines) {
      const kind = BULLET.test(line) ? 'ul' : NUMBER.test(line) ? 'ol' : null;
      if (kind) {
        flushPara();
        if (list?.type !== kind) {
          flushList();
          list = { type: kind, items: [] };
        }
        list!.items.push(line.replace(kind === 'ul' ? BULLET : NUMBER, ''));
      } else {
        flushList();
        para.push(line.trim());
      }
    }
    flushPara();
    flushList();
  }
  return blocks;
}
