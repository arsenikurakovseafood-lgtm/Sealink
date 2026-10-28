"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Waves,
  LayoutDashboard,
  Search,
  Building2,
  FileText,
  Layers3,
  Factory,
  MessageSquare,
  Settings,
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
import { useDemo } from "@/features/store";
const nav = [
  ["Dashboard", "/app", "overview"],
  ["Discover", "/app/discover", "network"],
  ["Companies", "/app/companies", "network"],
  ["RFQs", "/app/rfqs", "workspace"],
  ["Offers", "/app/offers", "workspace"],
  ["Capacity Exchange", "/app/capacity", "workspace"],
  ["Messages", "/app/messages", "workspace"],
  ["My Organization", "/app/organization", "manage"],
  ["Settings", "/app/settings", "manage"],
  ["Seafood marketplace", "/app/marketplace", "trade"],
  ["Logistics", "/app/logistics", "operations"],
  ["Jobs & Workforce", "/app/jobs", "people"],
  ["Professional profile", "/app/profile", "people"],
  ["Publish capacity", "/app/publish-capacity", "operations"],
];
const icons = [
  LayoutDashboard,
  Search,
  Building2,
  FileText,
  Layers3,
  Factory,
  MessageSquare,
  Building2,
  Settings,
];
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [professional, setProfessional] = useState(false);
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
  const [menu, setMenu] = useState("");
  const [help, setHelp] = useState(false);
  const [query, setQuery] = useState("");
  const title =
    nav.find(([, href]) =>
      href === "/app" ? path === "/app" : path.startsWith(href),
    )?.[0] || "Workspace";
  return (
    <div className={state.preferences.compact ? "app compact" : "app"}>
      <aside className={mobile ? "sidebar sidebar-open" : "sidebar"}>
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
        <nav aria-label="Main navigation">
          {nav.map(([label, href, group], i) => {
            if (
              professional &&
              [
                "RFQs",
                "Offers",
                "My Organization",
                "Publish capacity",
              ].includes(label)
            )
              return null;
            const Icon = icons[i] || Factory;
            return (
              <div key={href}>
                {(i === 1 || i === 3 || i === 7) && (
                  <div className="nav-label">
                    {group === "network"
                      ? "NETWORK"
                      : group === "workspace"
                        ? "COMMERCIAL WORKSPACE"
                        : "ORGANIZATION"}
                  </div>
                )}
                <Link
                  href={href}
                  onClick={() => setMobile(false)}
                  className={
                    (href === "/app" ? path === "/app" : path.startsWith(href))
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                  {label === "RFQs" && (
                    <span className="nav-count">
                      {state.rfqs.filter((r) => r.status === "Open").length}
                    </span>
                  )}
                  {label === "Messages" && <span className="unread-dot" />}
                </Link>
              </div>
            );
          })}
        </nav>
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
