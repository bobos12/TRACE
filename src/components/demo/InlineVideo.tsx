'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { TrackedVideo } from './TrackedVideo';

/** Event a "watch the demo" button elsewhere on the page sends to start this player. */
export const PLAY_DEMO_EVENT = 'trace:play-demo';

/** Loads the prospect tracker on first play, so plays are recorded without weighing on every visit. */
function ensureTracker(site: string) {
  if (window.traceTrack || document.querySelector('script[src="/demos/_shared/trace-track.js"]')) return;
  const s = document.createElement('script');
  s.src = '/demos/_shared/trace-track.js';
  s.dataset.site = site;
  document.head.appendChild(s);
}

/**
 * The demo video, in the page: its poster (whose artwork carries the "Watch
 * the 36-second demo" pill) is the play button. Nothing from YouTube loads
 * until it is pressed — then the tracked player replaces it and starts. A
 * button elsewhere can start it by dispatching PLAY_DEMO_EVENT.
 */
export function InlineVideo({
  videoId,
  title,
  poster,
  label,
  duration,
  placement,
}: {
  videoId: string;
  title: string;
  poster: string;
  /** Accessible name of the poster button. */
  label: string;
  /** Shown on the poster, e.g. "0:36". */
  duration: string;
  placement: string;
}) {
  const [playing, setPlaying] = useState(false);

  const play = (from: string) => {
    ensureTracker('Home page');
    setPlaying(true);
    setTimeout(() => window.traceTrack?.('video_open', { video: videoId, placement: from }), 300);
  };

  useEffect(() => {
    const onPlay = (e: Event) => play((e as CustomEvent<string>).detail || 'home-hero');
    addEventListener(PLAY_DEMO_EVENT, onPlay);
    return () => removeEventListener(PLAY_DEMO_EVENT, onPlay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (playing) return <TrackedVideo id={videoId} title={title} autoplay />;

  return (
    <button
      type="button"
      onClick={() => play(placement)}
      aria-label={label}
      data-track="video"
      className="group/poster relative block aspect-video w-full overflow-hidden rounded-md bg-surface-sunken shadow-float ring-1 ring-line-strong"
    >
      <Image
        src={poster}
        alt=""
        fill
        sizes="(max-width: 1024px) 92vw, 720px"
        className="object-cover transition-transform duration-[600ms] ease-mark group-hover/poster:scale-[1.02]"
      />
      {/* The play button: unmistakably a video, with a ring that swells once. */}
      <span aria-hidden="true" className="absolute inset-0 grid place-items-center bg-carbon/10 transition-colors duration-[300ms] group-hover/poster:bg-carbon/0">
        <span data-reveal="fade" className="relative grid size-[clamp(3.5rem,2.5rem+4vw,5.5rem)] place-items-center">
          <span className="at-ring at-ring-round absolute inset-0 rounded-full ring-2 ring-nuqta" />
          <span className="grid size-full place-items-center rounded-full bg-nuqta text-on-nuqta shadow-float ring-4 ring-paper/20 transition-transform duration-[300ms] ease-mark group-hover/poster:scale-110 group-focus-visible/poster:scale-110">
            <svg viewBox="0 0 10 10" className="ms-[6%] size-[38%]" fill="currentColor">
              <path d="M2 1l7 4-7 4z" />
            </svg>
          </span>
        </span>
      </span>
      <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-sm bg-carbon/80 px-2 py-1 font-mono text-[12px] text-paper">
        <svg aria-hidden="true" viewBox="0 0 10 10" className="size-2" fill="currentColor">
          <path d="M2 1l7 4-7 4z" />
        </svg>
        {duration}
      </span>
    </button>
  );
}

export default InlineVideo;
