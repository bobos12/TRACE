/** Open the website assistant from anywhere — optionally asking a first question. */
export const CHAT_EVENT = 'trace:chat-open';

export interface ChatOpenDetail {
  prompt?: string;
  /** Where it was opened from, for analytics. */
  placement?: string;
}

export function openChat(detail: ChatOpenDetail = {}): void {
  window.dispatchEvent(new CustomEvent<ChatOpenDetail>(CHAT_EVENT, { detail }));
}
