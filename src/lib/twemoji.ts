/**
 * Returns the Twemoji CDN URL for a given Unicode codepoint string.
 * Codepoints use lowercase hex joined by hyphens, e.g. "1f354" or "1f37d-fe0f".
 * Source: https://github.com/twitter/twemoji (CC-BY 4.0)
 */
export function twemojiUrl(codepoint: string): string {
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codepoint}.svg`;
}
