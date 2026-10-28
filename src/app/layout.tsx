import type { Metadata } from "next";
import "./globals.css";
import "./premium.css";
import "./workspace.css";
import "./homepage-3.css";
import { ExpansionProvider } from "@/features/expansion";
import { WorkspaceProvider } from "@/features/workspace-state";
import { DemoProvider } from "@/features/store";
import { RouteShell } from "@/features/public";
export const metadata: Metadata = {
  title: "SeaLink — The European seafood industry, connected",
  description:
    "Discover seafood partners, processing capacity, cold-chain logistics and workforce opportunities. Explore the clearly labeled SeaLink demonstration.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <DemoProvider>
          <ExpansionProvider>
            <WorkspaceProvider>
              <RouteShell>{children}</RouteShell>
            </WorkspaceProvider>
          </ExpansionProvider>
        </DemoProvider>
      </body>
    </html>
  );
}
