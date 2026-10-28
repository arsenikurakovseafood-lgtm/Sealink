import type { Metadata } from "next";
import "./globals.css";
import { DemoProvider } from "@/features/store";
import { Shell } from "@/components/shell";
export const metadata: Metadata = {
  title: "SeaLink — Seafood industry workspace",
  description:
    "A connected, fictional European seafood industry product preview.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DemoProvider>
          <Shell>{children}</Shell>
        </DemoProvider>
      </body>
    </html>
  );
}
