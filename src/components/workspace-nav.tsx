"use client";
import Link from "next/link";
import { useSyncExternalStore } from "react";
function subscribeViewport(fn: () => void) {
  const m = window.matchMedia("(min-width: 761px)");
  m.addEventListener("change", fn);
  return () => m.removeEventListener("change", fn);
}

import {
  LayoutDashboard,
  Inbox,
  Building2,
  Users,
  ChartNoAxesCombined,
  Search,
  Bookmark,
  Store,
  Factory,
  Truck,
  BriefcaseBusiness,
  FileText,
  Layers3,
  ShoppingBag,
  Package,
  Settings,
  MessageSquare,
  UserRound,
  Plus,
  ChevronDown,
} from "lucide-react";
import { useWorkspace } from "@/features/workspace-state";
import { useDemo } from "@/features/store";
import { useExpansion } from "@/features/expansion";
import { buildInbox } from "@/lib/workspace";
export function routeActive(path: string, href: string) {
  if (
    href === "/app/organization" &&
    ["/app/communications", "/app/company-preferences"].includes(path)
  )
    return true;
  return href === "/app" ? path === "/app" : path.startsWith(href);
}
export const navigation = [
  {
    name: "Overview",
    items: [
      { label: "Dashboard", href: "/app", icon: LayoutDashboard },
      { label: "Unified Inbox", href: "/app/inbox", icon: Inbox },
      { label: "Messages", href: "/app/messages", icon: MessageSquare },
    ],
  },
  {
    name: "My Business",
    items: [
      {
        label: "My Organization",
        href: "/app/organization",
        icon: Building2,
        business: true,
      },
      {
        label: "Team & Members",
        href: "/app/team",
        icon: Users,
        business: true,
      },
      {
        label: "Business Overview",
        href: "/app/business",
        icon: ChartNoAxesCombined,
        business: true,
      },
      { label: "Professional profile", href: "/app/profile", icon: UserRound },
    ],
  },
  {
    name: "Marketplace",
    items: [
      { label: "Discover", href: "/app/discover", icon: Search },
      { label: "Companies", href: "/app/companies", icon: Bookmark },
      { label: "Seafood marketplace", href: "/app/marketplace", icon: Store },
      { label: "Capacity Exchange", href: "/app/capacity", icon: Factory },
      { label: "Logistics", href: "/app/logistics", icon: Truck },
      { label: "Jobs & Workforce", href: "/app/jobs", icon: BriefcaseBusiness },
      {
        label: "Publish capacity",
        href: "/app/publish-capacity",
        icon: Plus,
        business: true,
      },
    ],
  },
  {
    name: "Operations",
    items: [
      { label: "RFQs", href: "/app/rfqs", icon: FileText, business: true },
      { label: "Offers", href: "/app/offers", icon: Layers3, business: true },
      {
        label: "Orders",
        href: "/app/orders",
        icon: ShoppingBag,
        business: true,
      },
      {
        label: "Shipments",
        href: "/app/shipments",
        icon: Package,
        business: true,
      },
    ],
  },
  {
    name: "Account",
    items: [{ label: "Settings", href: "/app/settings", icon: Settings }],
  },
];
export function SideNavigation({
  path,
  professional,
  onNavigate,
}: {
  path: string;
  professional: boolean;
  onNavigate: () => void;
}) {
  const { ui, setUI } = useWorkspace();
  const desktop = useSyncExternalStore(
    subscribeViewport,
    () => window.matchMedia("(min-width: 761px)").matches,
    () => false,
  );
  const { state } = useDemo();
  const { data } = useExpansion();
  const unread = buildInbox(state, data).filter(
    (i) => !ui.read.includes(i.id),
  ).length;
  return (
    <nav aria-label="Main navigation" className="grouped-navigation">
      {navigation.map((group, index) => {
        const items = group.items.filter(
          (i) => !professional || !("business" in i && i.business),
        );
        if (!items.length) return null;
        const expanded =
          (ui.compact && desktop) || ui.groups[group.name] !== false;
        const active = items.some((i) => routeActive(path, i.href));
        return (
          <section
            className={`nav-group ${active ? "has-active" : ""}`}
            key={group.name}
          >
            <button
              className="nav-group-toggle"
              aria-expanded={expanded}
              aria-controls={`nav-group-${index}`}
              onClick={() =>
                setUI((s) => ({
                  ...s,
                  groups: { ...s.groups, [group.name]: !expanded },
                }))
              }
            >
              <span>{group.name}</span>
              <ChevronDown size={12} />
            </button>
            <div
              className="nav-group-items"
              id={`nav-group-${index}`}
              hidden={!expanded}
            >
              {items.map(({ label, href, icon: Icon }) => {
                const selected = routeActive(path, href);
                return (
                  <Link
                    title={label}
                    aria-label={label}
                    aria-current={selected ? "page" : undefined}
                    href={href}
                    key={href}
                    className={`nav-item ${selected ? "active" : ""}`}
                    onClick={onNavigate}
                  >
                    <Icon size={18} />
                    <span className="nav-text">{label}</span>
                    {label === "Unified Inbox" && unread > 0 && (
                      <span className="nav-count">{unread}</span>
                    )}
                    {label === "RFQs" && (
                      <span className="nav-count">
                        {state.rfqs.filter((r) => r.status === "Open").length}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </nav>
  );
}
