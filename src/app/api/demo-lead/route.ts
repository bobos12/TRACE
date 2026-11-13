import { deliverDemoEvent, demoEventSchema, rateLimit } from '@/lib/leads';

/**
 * The Ellison & Reyes demo reports every form here — the bail application,
 * wanted tips, check-ins, reminders, payments and the chat — and each one is
 * emailed to the team. Only the demo on this site may call it: a request from
 * any other origin is refused. Card and bank numbers are never sent.
 */

/** Enough for one visitor to try every form, not enough to flood the inbox. */
const MAX_PER_WINDOW = 20;

function where(h: Headers): string {
  const part = (name: string) => {
    const v = h.get(name);
    if (!v) return '';
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  };
  return [part('x-vercel-ip-city'), part('x-vercel-ip-country-region'), part('x-vercel-ip-country')]
    .filter(Boolean)
    .join(', ');
}

function device(ua: string): string {
  const os = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android'
    : /Mac OS X/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : '';
  const browser = /Edg\//.test(ua) ? 'Edge' : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /FxiOS|Firefox\//.test(ua) ? 'Firefox'
    : /Safari\//.test(ua) ? 'Safari' : '';
  return [os, browser].filter(Boolean).join(' · ');
}

export async function POST(request: Request) {
  const h = request.headers;

  const origin = h.get('origin');
  const host = h.get('x-forwarded-host') ?? h.get('host');
  if (!origin || !host || new URL(origin).host !== host) {
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: 'invalid' }, { status: 400 });
  }
  const parsed = demoEventSchema.safeParse(json);
  if (!parsed.success) return Response.json({ error: 'invalid' }, { status: 400 });
  if (parsed.data.website) return Response.json({ ok: true });

  const ip = (h.get('x-forwarded-for') ?? 'local').split(',')[0]?.trim() || 'local';
  if (!rateLimit(`demo:${ip}`, MAX_PER_WINDOW)) {
    return Response.json({ error: 'rate_limited' }, { status: 429 });
  }

  try {
    await deliverDemoEvent(parsed.data, {
      where: where(h),
      device: device(h.get('user-agent') ?? ''),
      referrer: parsed.data.from ?? '',
    });
    return Response.json({ ok: true });
  } catch (error) {
    console.error('[demo-lead] delivery failed', error);
    return Response.json({ error: 'unavailable' }, { status: 503 });
  }
}
