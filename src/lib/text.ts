/**
 * Display lines end in the vermilion nuqta *instead of* a full stop
 * (docs/02-brand-essentials.md). The content files write natural sentences, so
 * strip the terminal stop wherever a <Stop /> is rendered after it.
 */
export function stripTerminalStop(text: string): string {
  return text.replace(/[.。．۔]\s*$/u, '');
}

/** Split a headline into its lines, ready for the per-line mask reveal. */
export function headlineLines(title: string[]): string[] {
  return title.map((line, i) => (i === title.length - 1 ? stripTerminalStop(line) : line));
}
