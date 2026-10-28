"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { createDemoState } from "@/data/demo";
import { restoreState, STORAGE_KEY } from "@/lib/business";
import type { DemoState } from "@/types";
type Context = {
  state: DemoState;
  update: (fn: (s: DemoState) => DemoState) => void;
  notify: (text: string) => void;
  ready: boolean;
  reset: () => void;
};
const Ctx = createContext<Context | null>(null);
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(createDemoState);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  const notify = useCallback((t: string) => setToast(t), []);
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const data = restoreState(localStorage.getItem(STORAGE_KEY));
        if (data) setState(data as DemoState);
      } catch {
        setToast(
          "Browser storage is unavailable. Changes last for this session.",
        );
      }
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        const timer = setTimeout(
          () =>
            setToast(
              "Changes could not be persisted. Browser storage may be full or unavailable.",
            ),
          0,
        );
        return () => clearTimeout(timer);
      }
  }, [state, ready]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  return (
    <Ctx.Provider
      value={{
        state,
        update: setState,
        notify,
        ready,
        reset: () => {
          setState(createDemoState());
          window.dispatchEvent(new Event("sealink-reset"));
          notify("Demonstration data reset.");
        },
      }}
    >
      {children}
      {toast && (
        <div role="status" className="toast">
          <span className="status-dot" />
          {toast}
          <button
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}
    </Ctx.Provider>
  );
}
export function useDemo() {
  const c = useContext(Ctx);
  if (!c) throw new Error("DemoProvider required");
  return c;
}
