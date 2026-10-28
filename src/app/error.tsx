"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section className="public-section">
      <h1>This screen could not load</h1>
      <p>
        Your local demo may contain incompatible records. Try again, or reset
        demo data from Settings.
      </p>
      <Button onClick={reset}>Try again</Button>
      <Link href="/app/settings">Open settings</Link>
    </section>
  );
}
