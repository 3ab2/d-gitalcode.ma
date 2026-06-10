"use client";

import { Link2 } from "lucide-react";
import { useState } from "react";
import { LinkedInIcon } from "@/components/social/LinkedInIcon";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function BlogShare({
  url,
  title,
  label,
}: {
  url: string;
  title: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* fallback */
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-white/40">{label}</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:border-brand-green/30 hover:text-brand-green"
        aria-label="Share on X"
      >
        <XIcon className="h-4 w-4" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:border-brand-green/30 hover:text-brand-green"
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon className="h-4 w-4" />
      </a>
      <button
        type="button"
        onClick={() => void share()}
        className="flex h-9 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-xs text-white/50 hover:border-brand-green/30 hover:text-brand-green"
      >
        <Link2 className="h-3.5 w-3.5" />
        {copied ? "✓" : "Link"}
      </button>
    </div>
  );
}
