import { z } from 'zod';
import { systemPrompt } from '@/lib/chat/knowledge';

/**
 * The website assistant. Takes the conversation, streams the reply back as
 * plain text. Gemini is called over REST — no SDK, nothing extra to ship.
 *
 * Errors before the first word come back as JSON with a code the panel turns
 * into a friendly line and the booking card. A model that fails mid-answer
 * ends the stream with [[interrupted]], which the panel handles the same way —
 * a failed answer still ends at "Book a call".
 */

/* Tried in order: a busy or rate-limited model falls through to the next.
   Each has its own quota, so the fallbacks are different model families. */
const MODELS = [
  ...new Set([process.env.GEMINI_MODEL || 'gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite']),
];
const RETRYABLE = new Set([429, 500, 502, 503, 504]);

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        text: z.string().trim().min(1).max(4000),
      }),
    )
    .min(1)
    .max(30),
  /** The page the visitor is on, for context. A path, never a full URL. */
  page: z.string().max(200).regex(/^\/[\w\-/]*$/).optional(),
});

/* Per-IP limit: generous for a conversation, tight for a script. In-memory
   and per-instance, like the contact form's. */
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 30;
const hits = new Map<string, number[]>();

function allow(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return false;
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return true;
}

type Code = 'invalid' | 'rate' | 'offline' | 'upstream';
const fail = (code: Code, status: number) => Response.json({ error: code }, { status });

interface GeminiEvent {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
  error?: { code?: number; message?: string };
}

interface Attempt {
  index: number;
  model: string;
  iterator: AsyncGenerator<GeminiEvent>;
}

/** Yields the parsed events of one Gemini SSE response. */
async function* events(body: NonNullable<Response['body']>): AsyncGenerator<GeminiEvent> {
  const reader = body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (value) buffer += value;
      const lines = buffer.split(/\r?\n/);
      buffer = done ? '' : (lines.pop() ?? '');
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        try {
          yield JSON.parse(line.slice(5)) as GeminiEvent;
        } catch {
          // A malformed event: skip it rather than end the answer.
        }
      }
      if (done) return;
    }
  } finally {
    reader.releaseLock();
  }
}

export async function POST(request: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return fail('offline', 503);

  const ip = (request.headers.get('x-forwarded-for') ?? 'local').split(',')[0]?.trim() || 'local';
  if (!allow(ip)) return fail('rate', 429);

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail('invalid', 400);

  const { messages, page } = parsed.data;
  // The last 20 turns, opening with the user — Gemini wants it that way.
  const recent = messages.slice(-20);
  const turns = recent.slice(Math.max(0, recent.findIndex((m) => m.role === 'user')));
  if (turns.at(-1)?.role !== 'user') return fail('invalid', 400);

  const system = page ? `${systemPrompt()}\n\n# Context\nThe visitor is on ${page}.` : systemPrompt();
  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: turns.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    })),
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 2048,
      thinkingConfig: { thinkingLevel: 'low' },
    },
  });

  const call = (model: string) =>
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      signal: request.signal,
      body: payload,
    }).catch(() => null);

  const encoder = new TextEncoder();
  let lastStatus = 0;

  /*
   * Walk the models until one answers. A failure before the first word —
   * a busy status, or an error event at the top of the stream — moves on to
   * the next model unseen. One after it ends the answer with [[interrupted]].
   */
  const first = await (async (): Promise<Attempt | null> => {
    for (const [i, model] of MODELS.entries()) {
      const res = await call(model);
      if (!res?.ok || !res.body) {
        lastStatus = res?.status ?? 0;
        console.error('[chat] upstream', model, lastStatus, (await res?.text().catch(() => ''))?.slice(0, 300));
        if (request.signal.aborted || (res && !RETRYABLE.has(res.status))) return null;
        continue;
      }
      return { index: i, model, iterator: events(res.body) };
    }
    return null;
  })();

  if (!first) return fail(lastStatus === 429 ? 'rate' : 'upstream', 502);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let current: Attempt | null = first;
      let sent = 0;

      try {
        while (current) {
          let failed = false;
          for await (const event of current.iterator) {
            if (event.error) {
              console.error('[chat] stream error', current.model, event.error.code, event.error.message);
              failed = true;
              break;
            }
            const candidate = event.candidates?.[0];
            for (const part of candidate?.content?.parts ?? []) {
              if (part.text && !part.thought) {
                controller.enqueue(encoder.encode(part.text));
                sent += part.text.length;
              }
            }
            if (candidate?.finishReason && !['STOP', 'MAX_TOKENS'].includes(candidate.finishReason)) {
              console.error('[chat] finished early', current.model, candidate.finishReason);
            }
          }

          if (!failed) break;
          if (sent > 0) {
            controller.enqueue(encoder.encode('\n\n[[interrupted]]'));
            break;
          }

          // Nothing said yet — try the next model as if this one never answered.
          const from: number = current.index + 1;
          current = null;
          for (const model of MODELS.slice(from) as string[]) {
            const res = await call(model);
            if (res?.ok && res.body) {
              current = { index: MODELS.indexOf(model), model, iterator: events(res.body) };
              break;
            }
          }
          if (!current) controller.enqueue(encoder.encode('[[interrupted]]'));
        }
        controller.close();
      } catch (error) {
        if (!request.signal.aborted) console.error('[chat] stream', error);
        try {
          controller.close();
        } catch {}
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
