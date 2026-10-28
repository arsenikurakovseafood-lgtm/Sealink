"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Inbox,
  FileText,
  Layers3,
  Truck,
  Users,
  Check,
  Mail,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useDemo } from "./store";
import { useExpansion } from "./expansion";
import { useWorkspace } from "./workspace-state";
import { buildInbox, filterInbox, type InboxItem } from "@/lib/workspace";
import { Button } from "@/components/ui/button";
import { Badge, Empty, Field, SectionTitle } from "@/components/ui/shared";
import { RFQTable } from "./commercial";
import { OrganizationPage } from "./supporting";
function useItems() {
  const { state } = useDemo();
  const { data } = useExpansion();
  return buildInbox(state, data);
}
function Item({ item }: { item: InboxItem }) {
  const { ui, setUI } = useWorkspace();
  const read = ui.read.includes(item.id);
  return (
    <article
      data-record-id={item.id}
      className={`inbox-row ${read ? "is-read" : "is-unread"}`}
    >
      <span
        className={`inbox-indicator ${item.priority === "Review" ? "priority" : ""}`}
      />
      <div className="inbox-item-body">
        <div>
          <Badge tone={item.priority === "Review" ? "amber" : "neutral"}>
            {item.category}
          </Badge>
          {item.priority === "Review" && <small>Needs review</small>}
          {!read && <span className="unread-label">Unread</span>}
        </div>
        <Link
          href={item.href}
          onClick={() =>
            setUI((s) => ({ ...s, read: [...new Set([...s.read, item.id])] }))
          }
        >
          <strong>{item.title}</strong>
          <ArrowUpRight size={15} />
        </Link>
        <p>{item.context}</p>
        <small>Demo record · No external notification</small>
      </div>
      <Button
        variant="ghost"
        size="sm"
        aria-label={`${read ? "Mark unread" : "Mark read"}: ${item.title}`}
        onClick={() =>
          setUI((s) => ({
            ...s,
            read: read
              ? s.read.filter((v) => v !== item.id)
              : [...s.read, item.id],
          }))
        }
      >
        {read ? <Mail size={15} /> : <Check size={15} />}
        <span>{read ? "Mark unread" : "Mark read"}</span>
      </Button>
    </article>
  );
}
export function UnifiedInbox() {
  const items = useItems();
  const { ui, setUI } = useWorkspace();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [unread, setUnread] = useState(false);
  const filtered = filterInbox(items, category, query, unread, ui.read);
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR BUSINESS, IN CONTEXT</span>
          <h1>Unified Inbox</h1>
          <p>
            Messages and commercial records from this local SeaLink workspace.
          </p>
        </div>
        <Button
          variant="outline"
          disabled={!filtered.some((i) => !ui.read.includes(i.id))}
          onClick={() =>
            setUI((s) => ({
              ...s,
              read: [...new Set([...s.read, ...filtered.map((i) => i.id)])],
            }))
          }
        >
          <Check size={15} />
          Mark visible as read
        </Button>
      </div>
      <div className="inbox-notice">
        <Inbox size={19} />
        <div>
          <strong>One internal inbox. No external connections.</strong>
          <p>
            Read states are local. Gmail, Outlook and WhatsApp are not
            connected. A record appearing here does not mean an external message
            arrived.
          </p>
        </div>
      </div>
      <div className="panel">
        <div className="inbox-toolbar">
          <input
            aria-label="Search inbox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages, requests or commercial context..."
          />
          <label>
            <input
              type="checkbox"
              checked={unread}
              onChange={(e) => setUnread(e.target.checked)}
            />
            Unread only
          </label>
        </div>
        <div
          className="inbox-categories"
          role="group"
          aria-label="Inbox category"
        >
          {[
            "All",
            "Messages",
            "RFQs",
            "Quotations",
            "Logistics",
            "Workforce",
            "Notifications",
          ].map((v) => (
            <button
              className={category === v ? "selected" : ""}
              onClick={() => setCategory(v)}
              key={v}
            >
              {v}
              <span>
                {items.filter((i) => v === "All" || i.category === v).length}
              </span>
            </button>
          ))}
        </div>
        <div className="inbox-result-count">
          {filtered.length} records ·{" "}
          {filtered.filter((i) => !ui.read.includes(i.id)).length} unread in
          this view
        </div>
        {filtered.map((i) => (
          <Item key={i.id} item={i} />
        ))}
        {!filtered.length && (
          <Empty
            title="You're up to date in this view"
            description="Try another category or clear the search to see more local records."
          />
        )}
      </div>
    </>
  );
}
export function DailyDashboard() {
  const { state } = useDemo();
  const { data } = useExpansion();
  const { ui } = useWorkspace();
  const items = useItems();
  const attention = items.filter(
    (i) => i.priority === "Review" && !ui.read.includes(i.id),
  );
  const messages = items.filter(
    (i) => i.category === "Messages" && !ui.read.includes(i.id),
  );
  const open = state.rfqs.filter((r) => r.status === "Open");
  return (
    <>
      <div className="page-heading daily-heading">
        <div>
          <span className="eyebrow">
            DAILY BUSINESS OVERVIEW · DEMO WORKSPACE
          </span>
          <h1>
            Welcome to SeaLink<span className="heading-period">.</span>
          </h1>
          <p>What needs a decision, a response, or a closer look.</p>
        </div>
        <Button asChild>
          <Link href="/app/rfqs/new">
            <Plus size={16} />
            Create RFQ
          </Link>
        </Button>
      </div>
      <div className="daily-metrics">
        {[
          {
            name: "Unread messages",
            count: messages.length,
            href: "/app/inbox",
            icon: Inbox,
          },
          {
            name: "Active RFQs",
            count: open.length,
            href: "/app/rfqs",
            icon: FileText,
          },
          {
            name: "Quotations to review",
            count: state.offers.filter((o) => o.status === "Received").length,
            href: "/app/offers",
            icon: Layers3,
          },
          {
            name: "Logistics inquiries",
            count: data.inquiries.length,
            href: "/app/logistics?activity=1",
            icon: Truck,
          },
          {
            name: "Submitted applications",
            count: data.applications.filter((a) => a.status === "Submitted")
              .length,
            href: "/app/jobs?activity=1",
            icon: Users,
          },
        ].map(({ name, count, href, icon: Icon }) => (
          <Link key={name} href={href}>
            <Icon size={17} />
            <strong>{count}</strong>
            <span>{name}</span>
            <ArrowUpRight size={13} />
          </Link>
        ))}
      </div>
      <div className="daily-grid">
        <section className="panel attention-panel">
          <div className="panel-heading">
            <SectionTitle
              title="Needs Your Attention"
              subtitle="Unreviewed local records — not live external alerts."
              action={<Badge tone="amber">{attention.length} to review</Badge>}
            />
          </div>
          {attention.slice(0, 5).map((i) => (
            <Item key={i.id} item={i} />
          ))}
          {!attention.length && (
            <Empty
              title="No unreviewed attention items"
              description="Your commercial records are still available in their respective workflows."
            />
          )}
          <Link className="table-bottom-link" href="/app/inbox">
            Open Unified Inbox
            <ArrowRight size={14} />
          </Link>
        </section>
        <aside className="stack">
          <section className="panel padded">
            <SectionTitle
              title="Conversations"
              action={<Badge tone="blue">{messages.length} unread</Badge>}
            />
            {messages.slice(0, 3).map((i) => (
              <Link className="conversation-summary" href={i.href} key={i.id}>
                <Mail size={16} />
                <div>
                  <strong>{i.title}</strong>
                  <p>{i.context}</p>
                </div>
                <ArrowUpRight size={13} />
              </Link>
            ))}
            {!messages.length && (
              <p className="muted">No unread conversation records.</p>
            )}
            <Link className="text-link" href="/app/messages">
              Open messages <ArrowRight size={13} />
            </Link>
          </section>
          <section className="daily-next">
            <span className="eyebrow">YOUR NEXT CONNECTION</span>
            <h2>
              Find the expertise
              <br />
              your business needs.
            </h2>
            <p>
              Explore your industry network, with your requirements in mind.
            </p>
            <Link href="/app/discover">
              Discover companies <ArrowUpRight size={16} />
            </Link>
            <Link href="/app/capacity">
              Explore processing capacity <ArrowUpRight size={16} />
            </Link>
            <Link href="/app/network-overview">
              Network overview <ArrowUpRight size={16} />
            </Link>
          </section>
        </aside>
      </div>
      <section className="panel daily-sourcing">
        <div className="panel-heading">
          <SectionTitle
            title="Active commercial requests"
            subtitle="Keep your open sourcing work moving."
            action={
              <Link className="text-link" href="/app/rfqs">
                All RFQs →
              </Link>
            }
          />
        </div>
        {open.length ? (
          <RFQTable items={open.slice(0, 3)} />
        ) : (
          <Empty
            title="No active RFQs"
            description="Create a sourcing request to begin."
          />
        )}
      </section>
      <section className="panel padded daily-activity">
        <SectionTitle
          title="Recent commercial activity"
          subtitle="Recorded locally as you use the demonstration."
        />
        {state.events
          .slice(-4)
          .reverse()
          .map((e, i) => (
            <div className="activity-row" key={i}>
              <Check size={15} />
              <span>{e}</span>
              <small>Local demonstration event</small>
            </div>
          ))}
      </section>
    </>
  );
}
const orgTabs = [
  ["Company Profile", "/app/organization"],
  ["Team Members", "/app/team"],
  ["Business Activity", "/app/business"],
  ["Communication Overview", "/app/communications"],
  ["Company Preferences", "/app/company-preferences"],
];
export function OrganizationArea({ section }: { section: string }) {
  const { state, notify } = useDemo();
  const { data } = useExpansion();
  const { ui, setUI } = useWorkspace();
  const items = useItems();
  const [edit, setEdit] = useState("");
  const member = ui.team.find((m) => m.id === edit);
  const active =
    orgTabs.find(([, href]) => href === `/app/${section}`)?.[0] ||
    "Company Profile";
  return (
    <>
      <div className="organization-area-title">
        <span className="eyebrow">MY BUSINESS</span>
        <h2>{state.organization.name}</h2>
        <p>Organization management · local demonstration</p>
      </div>
      <nav className="org-tabs" aria-label="Organization sections">
        {orgTabs.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            aria-current={label === active ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      {section === "organization" ? (
        <OrganizationPage />
      ) : (
        <>
          <div className="page-heading">
            <div>
              <h1>{section === "business" ? "Business Overview" : active}</h1>
              <p>Company context derived from the same commercial workspace.</p>
            </div>
            <Badge tone="blue">Demo organization</Badge>
          </div>
          {section === "team" ? (
            <>
              <section className="panel padded">
                <SectionTitle
                  title="Team directory"
                  subtitle="Local roles are illustrative; they do not enforce access permissions or invite external users."
                />
                {ui.team.map((m) => (
                  <div className="team-row" key={m.id}>
                    <span className="team-avatar">
                      {m.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                    <div>
                      <strong>{m.name}</strong>
                      <small>{m.email}</small>
                    </div>
                    <Badge>{m.role}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEdit(m.id)}
                    >
                      Edit member
                    </Button>
                    {m.id !== "demo-admin" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUI((s) => ({
                            ...s,
                            team: s.team.filter((v) => v.id !== m.id),
                          }));
                          notify("Demo member removed locally.");
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </section>
              <form
                key={edit}
                className="panel padded team-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  const m = {
                    id: edit || crypto.randomUUID(),
                    name: String(f.get("name")),
                    email: String(f.get("email")),
                    role: String(f.get("role")) as
                      "Administrator" | "Commercial" | "Operations",
                  };
                  setUI((s) => ({
                    ...s,
                    team: edit
                      ? s.team.map((v) => (v.id === edit ? m : v))
                      : [...s.team, m],
                  }));
                  setEdit("");
                  e.currentTarget.reset();
                  notify("Team record saved locally. No invitation sent.");
                }}
              >
                <SectionTitle
                  title={edit ? "Edit local member" : "Add a demo team member"}
                />
                <div className="form-grid">
                  <Field label="Fictional member name">
                    <input
                      name="name"
                      required
                      minLength={2}
                      defaultValue={member?.name}
                    />
                  </Field>
                  <Field label="Fictional email">
                    <input
                      name="email"
                      type="email"
                      required
                      defaultValue={member?.email}
                    />
                  </Field>
                  <Field label="Illustrative role">
                    <select
                      name="role"
                      defaultValue={member?.role || "Commercial"}
                    >
                      <option>Administrator</option>
                      <option>Commercial</option>
                      <option>Operations</option>
                    </select>
                  </Field>
                </div>
                <Button>Save local member</Button>
                {edit && (
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setEdit("")}
                  >
                    Cancel edit
                  </Button>
                )}
              </form>
            </>
          ) : section === "company-preferences" ? (
            <section className="panel padded">
              <SectionTitle
                title="Company preferences"
                subtitle="These are local demonstration preferences, not external notification settings."
              />
              <div className="setting-row">
                <div>
                  <strong>Highlight review summaries</strong>
                  <p>
                    Save the organization’s preference for a future review
                    digest. No email is sent.
                  </p>
                </div>
                <input
                  aria-label="Highlight review summaries"
                  role="switch"
                  type="checkbox"
                  checked={ui.preferences.reviewDigest}
                  onChange={(e) => {
                    setUI((s) => ({
                      ...s,
                      preferences: {
                        ...s.preferences,
                        reviewDigest: e.target.checked,
                      },
                    }));
                    notify("Company preference saved.");
                  }}
                />
              </div>
              <Field label="Preferred starting section">
                <select
                  value={ui.preferences.defaultSection}
                  onChange={(e) => {
                    setUI((s) => ({
                      ...s,
                      preferences: {
                        ...s.preferences,
                        defaultSection: e.target.value as "Dashboard" | "Inbox",
                      },
                    }));
                    notify("Preferred section saved. Use the shortcut below.");
                  }}
                >
                  <option>Dashboard</option>
                  <option>Inbox</option>
                </select>
              </Field>
              <Button asChild>
                <Link
                  href={
                    ui.preferences.defaultSection === "Inbox"
                      ? "/app/inbox"
                      : "/app"
                  }
                >
                  Open preferred section
                </Link>
              </Button>
            </section>
          ) : section === "communications" ? (
            <section className="panel padded">
              <SectionTitle
                title="Communication Overview"
                subtitle="All records are internal to this browser; no external integrations are connected."
              />
              <div className="summary-strip">
                <div>
                  <span>Conversations</span>
                  <strong>{state.messages.length}</strong>
                </div>
                <div>
                  <span>Unread message records</span>
                  <strong>
                    {
                      items.filter(
                        (i) =>
                          i.category === "Messages" && !ui.read.includes(i.id),
                      ).length
                    }
                  </strong>
                </div>
                <div>
                  <span>Logistics inquiries</span>
                  <strong>{data.inquiries.length}</strong>
                </div>
              </div>
              <Button asChild>
                <Link href="/app/inbox">
                  Review Unified Inbox <ArrowRight size={15} />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/app/messages">Open conversations</Link>
              </Button>
            </section>
          ) : (
            <>
              <div className="business-summary">
                {[
                  [
                    "Active RFQs",
                    state.rfqs.filter((r) => r.status === "Open").length,
                    "/app/rfqs",
                  ],
                  [
                    "Outstanding quotations",
                    state.offers.filter((o) => o.status === "Received").length,
                    "/app/offers",
                  ],
                  [
                    "Important unreviewed records",
                    items.filter(
                      (i) => i.priority === "Review" && !ui.read.includes(i.id),
                    ).length,
                    "/app/inbox",
                  ],
                  [
                    "Workforce applications",
                    data.applications.length,
                    "/app/jobs?activity=1",
                  ],
                  [
                    "Transport inquiries",
                    data.inquiries.length,
                    "/app/logistics?activity=1",
                  ],
                  ["Team members", ui.team.length, "/app/team"],
                ].map(([label, count, href]) => (
                  <Link href={String(href)} key={label}>
                    <span>{label}</span>
                    <strong>{count}</strong>
                    <ArrowUpRight size={17} />
                  </Link>
                ))}
              </div>
              <section className="panel padded">
                <SectionTitle title="Business activity" />
                {state.events
                  .slice(-8)
                  .reverse()
                  .map((e, i) => (
                    <div className="activity-row" key={i}>
                      <Check size={14} />
                      <span>{e}</span>
                    </div>
                  ))}
                <Link href="/app/inbox" className="text-link">
                  See all commercial context →
                </Link>
              </section>
            </>
          )}
        </>
      )}
    </>
  );
}
export function OperationsPrototype({
  shipments = false,
}: {
  shipments?: boolean;
}) {
  const { state, notify } = useDemo();
  const { data } = useExpansion();
  const { ui, setUI } = useWorkspace();
  const records = shipments
    ? data.inquiries.map((i) => ({
        id: i.id,
        title: `${i.origin} → ${i.destination}`,
        detail: `${i.cargo} · ${i.weight} kg · ${i.date}`,
        href: "/app/logistics?activity=1",
      }))
    : state.rfqs
        .filter((r) => r.status === "Awarded")
        .map((r) => ({
          id: r.id,
          title: r.title,
          detail: `${r.quantity} ${r.unit} · ${r.incoterms} · ${r.location}`,
          href: `/app/rfqs/${r.id}`,
        }));
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            OPERATIONS · FUNCTIONAL LOCAL PROTOTYPE
          </span>
          <h1>{shipments ? "Shipments" : "Orders"}</h1>
          <p>
            {shipments
              ? "Planning context from saved transport inquiries. No carrier tracking or booked shipments."
              : "Planning context from awarded RFQs. No purchase order or commercial contract is created."}
          </p>
        </div>
        <Badge tone="amber">Prototype · Not confirmed</Badge>
      </div>
      <div className="stack">
        {records.map((r) => (
          <section className="panel padded" key={r.id}>
            <SectionTitle
              title={r.title}
              subtitle={r.detail}
              action={
                <Link className="text-link" href={r.href}>
                  Open source record <ArrowUpRight size={14} />
                </Link>
              }
            />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const note = String(new FormData(e.currentTarget).get("notes"));
                setUI((s) => ({
                  ...s,
                  orderNotes: {
                    ...s.orderNotes,
                    [`${shipments ? "shipment" : "order"}:${r.id}`]: note,
                  },
                }));
                notify(
                  "Planning note saved locally. No external operation performed.",
                );
              }}
            >
              <Field label="Local planning notes">
                <textarea
                  name="notes"
                  defaultValue={
                    ui.orderNotes[
                      `${shipments ? "shipment" : "order"}:${r.id}`
                    ] || ""
                  }
                  placeholder="Fictional planning details only..."
                />
              </Field>
              <Button variant="outline" size="sm">
                Save planning note
              </Button>
            </form>
          </section>
        ))}
        {!records.length && (
          <Empty
            title={
              shipments
                ? "No transport inquiry context yet"
                : "No awarded requests yet"
            }
            description={
              shipments
                ? "Save a local logistics inquiry to explore shipment planning."
                : "Simulate awarding an RFQ to explore local order planning."
            }
          >
            <Button asChild>
              <Link href={shipments ? "/app/logistics" : "/app/rfqs"}>
                Open {shipments ? "logistics" : "RFQs"}
              </Link>
            </Button>
          </Empty>
        )}
      </div>
    </>
  );
}
