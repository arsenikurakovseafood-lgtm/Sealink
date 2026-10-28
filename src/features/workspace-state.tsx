"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";
import { useDemo } from "./store";
const schema = z.object({
  groups: z.record(z.string(), z.boolean()),
  compact: z.boolean(),
  read: z.array(z.string()),
  team: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      role: z.enum(["Administrator", "Commercial", "Operations"]),
      email: z.string(),
    }),
  ),
  orderNotes: z.record(z.string(), z.string()),
  preferences: z.object({
    reviewDigest: z.boolean(),
    defaultSection: z.enum(["Dashboard", "Inbox"]),
  }),
});
type State = z.infer<typeof schema>;
const initial = (): State => ({
  groups: {
    Overview: true,
    "My Business": false,
    Marketplace: true,
    Operations: false,
    Account: true,
  },
  compact: false,
  read: [],
  team: [
    {
      id: "demo-admin",
      name: "Alex Kuura",
      role: "Administrator",
      email: "alex@northwater.example",
    },
  ],
  orderNotes: {},
  preferences: { reviewDigest: true, defaultSection: "Dashboard" },
});
const C = createContext<{
  ui: State;
  setUI: React.Dispatch<React.SetStateAction<State>>;
} | null>(null);
export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [ui, setUI] = useState(initial);
  const [ready, setReady] = useState(false);
  const { notify } = useDemo();
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const d = schema.safeParse(
          JSON.parse(localStorage.getItem("sealink-workspace-v22") || "null"),
        );
        if (d.success) setUI(d.data);
      } catch {}
      setReady(true);
    }, 0);
    const reset = () => setUI(initial());
    window.addEventListener("sealink-reset", reset);
    return () => {
      clearTimeout(t);
      window.removeEventListener("sealink-reset", reset);
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("sealink-workspace-v22", JSON.stringify(ui));
    } catch {
      const t = setTimeout(
        () =>
          notify(
            "Workspace preferences could not be saved. Changes last for this session.",
          ),
        0,
      );
      return () => clearTimeout(t);
    }
  }, [ready, ui, notify]);
  return <C.Provider value={{ ui, setUI }}>{children}</C.Provider>;
}
export function useWorkspace() {
  const c = useContext(C);
  if (!c) throw new Error("Workspace provider missing");
  return c;
}
