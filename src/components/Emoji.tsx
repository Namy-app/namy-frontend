import { twemojiUrl } from "@/lib/twemoji";

interface EmojiProps {
  /** Twemoji Unicode codepoint, e.g. "1f354" or "1f37d-fe0f" */
  cp: string;
  label: string;
  className?: string;
}

/**
 * Renders an emoji as a Twemoji SVG image.
 * Avoids iOS WKWebView color-emoji font issues.
 */

export const Emoji = ({
  cp,
  label,
  className = "inline-block w-5 h-5 align-text-bottom",
}: EmojiProps) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={twemojiUrl(cp)} alt={label} className={className} />
);
