"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Waves,
  Search,
  Layers3,
  ChevronDown,
  ChevronsUpDown,
  ArrowUpRight,
  Bell,
  Menu,
  X,
  HelpCircle,
  Bookmark,
  Plus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/shared";
import { SideNavigation, navigation } from "./workspace-nav";
import { useWorkspace } from "@/features/workspace-state";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useDemo } from "@/features/store";
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { ui, setUI } = useWorkspace();
  const [professional, setProfessional] = useState(false);
  useEffect(() => {
    const reset = () => setProfessional(false);
    window.addEventListener("sealink-reset", reset);
    return () => window.removeEventListener("sealink-reset", reset);
  }, []);
  const [membership, setMembership] = useState("Preview");
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        setMembership(
          JSON.parse(localStorage.getItem("sealink-account") || "{}").plan ||
            "Preview",
        );
        setProfessional(
          JSON.parse(localStorage.getItem("sealink-account") || "{}")
            .category === "Professional",
        );
      } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, []);
  const router = useRouter();
  const { state, ready } = useDemo();
  const [mobile, setMobile] = useState(false);
  const navigationRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!mobile) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () =>
      Array.from(
        navigationRef.current?.querySelectorAll<HTMLElement>(
          "a[href],button:not([disabled]),input,select",
        ) || [],
      ).filter((el) => el.getClientRects().length > 0);
    focusable()[0]?.focus();
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobile(false);
        return;
      }
      if (event.key === "Tab") {
        const els = focusable();
        const first = els[0],
          last = els.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.removeEventListener("keydown", handle);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [mobile]);
  const [menu, setMenu] = useState("");
  const [help, setHelp] = useState(false);
  const [query, setQuery] = useState("");
  const title =
    navigation
      .flatMap((g) => g.items)
      .find(({ href }) =>
        href === "/app" ? path === "/app" : path.startsWith(href),
      )?.label || "Workspace";
  return (
    <div
      className={`${state.preferences.compact ? "app compact" : "app"} ${ui.compact ? "compact-sidebar" : ""}`}
    >
      <aside
        ref={navigationRef}
        role={mobile ? "dialog" : undefined}
        aria-modal={mobile || undefined}
        aria-label={mobile ? "Workspace navigation" : undefined}
        className={mobile ? "sidebar sidebar-open" : "sidebar"}
      >
        <Link href="/app" className="brand">
          <Waves size={31} strokeWidth={2.1} />
          <span>
            SeaLink<span className="brand-dot">.</span>
          </span>
        </Link>
        <button
          className="org-switch"
          onClick={() => setMenu(menu === "org" ? "" : "org")}
        >
          <span className="org-avatar">N</span>
          <span>
            <strong>{state.organization.name}</strong>
            <small>Organization workspace</small>
          </span>
          <ChevronsUpDown size={14} />
        </button>
        {menu === "org" && (
          <div className="sidebar-pop">
            <p>Demo organization</p>
            <Link href="/app/organization" onClick={() => setMenu("")}>
              Manage {state.organization.name}
              <ArrowUpRight size={14} />
            </Link>
            <small>One organization in this preview.</small>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="sidebar-collapse"
          aria-label={ui.compact ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={ui.compact}
          onClick={() => setUI((v) => ({ ...v, compact: !v.compact }))}
        >
          {ui.compact ? (
            <PanelLeftOpen size={17} />
          ) : (
            <PanelLeftClose size={17} />
          )}
        </Button>
        <SideNavigation
          path={path}
          professional={professional}
          onNavigate={() => setMobile(false)}
        />
        <div className="sidebar-bottom">
          <div className="plan-card">
            <span className="plan-eyebrow">YOUR WORKSPACE</span>
            <strong>
              Built for better connections
              <ArrowUpRight size={15} />
            </strong>
            <p>{membership} membership · Demo</p>
            <Link href="/app/settings">
              View subscription <span>→</span>
            </Link>
          </div>
          <button className="help" onClick={() => setHelp(true)}>
            <HelpCircle size={17} />
            Help & demo guide
            <ArrowUpRight size={14} />
          </button>
          <button
            className="user"
            onClick={() => setMenu(menu === "user" ? "" : "user")}
          >
            <span className="user-avatar">AK</span>
            <span>
              <strong>Alex Kuura</strong>
              <small>Workspace administrator</small>
            </span>
            <ChevronDown size={14} />
          </button>
          {menu === "user" && (
            <div className="sidebar-pop">
              <Link href="/app/settings" onClick={() => setMenu("")}>
                User preferences
              </Link>
              <small>Local demonstration identity. No authentication.</small>
            </div>
          )}
        </div>
      </aside>
      {mobile && (
        <button
          className="scrim"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <Button
              className="mobile-menu"
              variant="ghost"
              size="icon"
              onClick={() => setMobile(!mobile)}
              aria-label="Open navigation"
            >
              {mobile ? <X size={18} /> : <Menu size={18} />}
            </Button>
            <span>Workspace</span>
            <span className="slash">/</span>
            <strong>{title}</strong>
          </div>
          <form
            className="global-search"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/app/discover?q=${encodeURIComponent(query)}`);
            }}
          >
            <Search size={15} />
            <input
              aria-label="Search companies"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your network..."
            />
            <kbd>↵</kbd>
          </form>
          <div className="top-actions">
            <button className="demo-pill" onClick={() => setHelp(true)}>
              <span />
              Demo Environment
            </button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Activity notifications"
              onClick={() =>
                setMenu(menu === "notifications" ? "" : "notifications")
              }
            >
              <Bell size={19} />
              {state.preferences.notifications && <i className="bell-dot" />}
            </Button>
            <span className="top-avatar">AK</span>
          </div>
          {menu === "notifications" && (
            <div className="notification-pop panel">
              <h3>Workspace activity</h3>
              {state.events
                .slice(-4)
                .reverse()
                .map((e, i) => (
                  <p key={i}>
                    <Check size={14} />
                    {e}
                  </p>
                ))}
              <Link href="/app/rfqs" onClick={() => setMenu("")}>
                View RFQs →
              </Link>
            </div>
          )}
        </header>
        <main>
          {!ready ? (
            <div className="loading">Loading your demonstration workspace…</div>
          ) : (
            children
          )}
        </main>
        <footer>
          <Link href="/">Public website</Link>
          SeaLink Preview{" "}
          <span>
            All companies and commercial activity are fictional. No external
            delivery or real transactions.
          </span>
          <button onClick={() => setHelp(true)}>
            About this demo <ArrowUpRight size={12} />
          </button>
        </footer>
      </div>
      {help && (
        <Modal
          title="A connected seafood workspace"
          onClose={() => setHelp(false)}
        >
          <div className="modal-body">
            <span className="eyebrow">DEMONSTRATION ENVIRONMENT</span>
            <p>
              All companies, certification claims, capacity listings and
              quotations are fictional. Requests and messages stay in this
              browser. No external messages, transactions or independent
              verification occur.
            </p>
            <ol className="guide">
              <li>
                <Search size={18} />
                <div>
                  <strong>Discover a partner</strong>
                  <p>
                    Combine country, species, services and certification
                    filters.
                  </p>
                </div>
              </li>
              <li>
                <Bookmark size={18} />
                <div>
                  <strong>Build your shortlist</strong>
                  <p>Explore profiles and save relevant companies.</p>
                </div>
              </li>
              <li>
                <Plus size={18} />
                <div>
                  <strong>Create an RFQ</strong>
                  <p>
                    Define a specification, select suppliers and simulate
                    distribution.
                  </p>
                </div>
              </li>
              <li>
                <Layers3 size={18} />
                <div>
                  <strong>Compare offers</strong>
                  <p>
                    Simulate quotations and review price, terms and product
                    differences.
                  </p>
                </div>
              </li>
            </ol>
            <p className="notice">
              Use fictional information only. Local browser storage is
              unsuitable for sensitive commercial data. Reset it in Settings.
            </p>
            <Button onClick={() => setHelp(false)}>
              Explore the workspace
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
