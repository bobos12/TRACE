/**
 * Runs before paint. Two jobs:
 *   1. `html.js` — so the scroll-reveal CSS only hides content when JavaScript
 *      is actually there to reveal it again.
 *   2. The theme: stored choice, else the OS preference, onto `data-theme`.
 */
const script = `(function(){var d=document.documentElement;d.classList.add('js');try{var s=localStorage.getItem('trace-theme');var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.setAttribute('data-theme',t);d.style.colorScheme=t;}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export const THEME_KEY = 'trace-theme';
