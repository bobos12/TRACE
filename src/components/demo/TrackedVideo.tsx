'use client';

import { useEffect, useRef } from 'react';

/* The parts of the YouTube IFrame API used here. */
interface YTPlayer {
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
  playVideo(): void;
}
interface YTNamespace {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      host?: string;
      playerVars?: Record<string, number | string>;
      events?: { onReady?: (e: { target: YTPlayer }) => void; onStateChange?: (e: { data: number }) => void };
    },
  ) => YTPlayer;
}
type Track = ((type: string, data?: Record<string, unknown>) => void) & { flush?: (leaving?: boolean) => void };
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
    traceTrack?: Track;
  }
}

const PLAYING = 1;
const PAUSED = 2;
const ENDED = 0;
const MILESTONES = [10, 25, 50, 75, 90];

/** Loads the IFrame API once; resolves when YT is ready. */
function loadApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  return new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT!);
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.async = true;
      document.head.appendChild(s);
    }
  });
}

/**
 * The campaign video, with every step reported to the prospect tracker:
 * video_play (first play and each resume), video_pause, video_progress at
 * 10/25/50/75/90% and video_complete, each with the seconds actually watched.
 * Privacy-enhanced YouTube (no cookies until play).
 */
export function TrackedVideo({ id, title, autoplay = false }: { id: string; title: string; autoplay?: boolean }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let player: YTPlayer | null = null;
    let poll: ReturnType<typeof setInterval> | undefined;
    let watched = 0;
    let lastTick = 0;
    let plays = 0;
    const hit = new Set<number>();
    const track = (type: string, data: Record<string, unknown> = {}) =>
      window.traceTrack?.(type, { video: id, watched_seconds: Math.round(watched), ...data });

    const tick = () => {
      if (!player) return;
      const now = Date.now();
      if (lastTick) watched += (now - lastTick) / 1000;
      lastTick = now;
      const d = player.getDuration();
      const pct = d ? (player.getCurrentTime() / d) * 100 : 0;
      for (const m of MILESTONES) {
        if (pct >= m && !hit.has(m)) {
          hit.add(m);
          track('video_progress', { percent: m });
        }
      }
    };

    let cancelled = false;
    loadApi().then((YT) => {
      if (cancelled || !host.current) return;
      player = new YT.Player(host.current, {
        videoId: id,
        host: 'https://www.youtube-nocookie.com',
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1, autoplay: autoplay ? 1 : 0 },
        events: {
          onReady: ({ target }) => {
            if (autoplay) target.playVideo();
          },
          onStateChange: ({ data }) => {
            if (data === PLAYING) {
              plays += 1;
              lastTick = Date.now();
              track('video_play', { play: plays, at_second: Math.round(player?.getCurrentTime() ?? 0) });
              clearInterval(poll);
              poll = setInterval(tick, 1000);
            } else if (data === PAUSED || data === ENDED) {
              tick();
              lastTick = 0;
              clearInterval(poll);
              if (data === PAUSED) track('video_pause', { at_second: Math.round(player?.getCurrentTime() ?? 0) });
              else {
                track('video_complete', {});
                window.traceTrack?.flush?.();
              }
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      clearInterval(poll);
      player?.destroy();
    };
  }, [id, autoplay]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md bg-surface-sunken shadow-float ring-1 ring-line-strong">
      <div ref={host} title={title} className="absolute inset-0 size-full [&>iframe]:size-full" />
    </div>
  );
}

export default TrackedVideo;
