export function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// Safe, generic placeholders that shouldn't 404/cors in demos
export const defaultAvatar = "https://picsum.photos/seed/aetherbot/80";
export const defaultBanner = "https://picsum.photos/seed/aetherbanner/800/200";

export function timeAgo(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export function generateMockAnswer(q: string) {
  const lower = q.toLowerCase();
  if (lower.includes("price") || lower.includes("cost"))
    return "Our pricing is usage-based in the MVP. You can tune limits per avatar in Settings → Billing.";
  if (lower.includes("hello") || lower.includes("hi"))
    return "Hi! 👋 How can I assist you today?";
  if (lower.includes("refund"))
    return "Refunds are processed within 5–7 business days once approved.";
  if (lower.includes("docs") || lower.includes("pdf"))
    return "You can upload PDFs, Word, CSV and more. We’ll chunk and index them for retrieval.";
  if (lower.includes("firecrawl") || lower.includes("crawl"))
    return "Firecrawl integration lets you add website content with scheduled re-crawls.";
  return "Got it! I’ll look that up in the knowledge base and get back with a clear answer.";
}
