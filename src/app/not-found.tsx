import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[720px] px-6 md:px-12 pt-24 pb-16 text-center">
      <p className="text-sm text-ink-3 mb-4">404</p>
      <h1 className="display text-[clamp(2rem,4.5vw,3rem)] mb-4">
        This page doesn&rsquo;t exist.
      </h1>
      <p className="text-[17px] leading-[1.65] text-ink-2 mb-10">
        The link may be broken, or the page may have moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-accent hover:text-accent-ink"
      >
        <ArrowLeft size={16} strokeWidth={1.75} /> back to home
      </Link>
    </div>
  );
}
