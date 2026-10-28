import type { DemoState } from "@/types";
export type InboxCategory =
  | "Messages"
  | "RFQs"
  | "Quotations"
  | "Logistics"
  | "Workforce"
  | "Notifications";
export type InboxItem = {
  id: string;
  category: InboxCategory;
  title: string;
  context: string;
  href: string;
  priority: "Review" | "Normal";
};
type Operations = {
  inquiries: {
    id: string;
    origin: string;
    destination: string;
    cargo: string;
  }[];
  applications: { jobId: string; name: string; status: string }[];
  jobs: { id: string; title: string }[];
};
export function buildInbox(state: DemoState, extra: Operations): InboxItem[] {
  return [
    ...state.messages
      .filter((m) => m.entries.length)
      .map((m) => ({
        id: `message:${m.id}:${m.entries.length}`,
        category: "Messages" as const,
        title: m.subject,
        context: m.entries.at(-1)!.text,
        href: `/app/messages?thread=${m.id}`,
        priority: "Normal" as const,
      })),
    ...state.rfqs
      .filter((r) => r.status === "Draft" || r.status === "Open")
      .map((r) => ({
        id: `rfq:${r.id}:${r.status}`,
        category: "RFQs" as const,
        title: r.title,
        context: `${r.id} · ${r.status} · ${r.quantity.toLocaleString("en-IE")} ${r.unit}`,
        href: `/app/rfqs/${r.id}`,
        priority:
          r.status === "Draft" ? ("Review" as const) : ("Normal" as const),
      })),
    ...state.offers
      .filter((o) => o.status === "Received")
      .map((o) => ({
        id: `offer:${o.id}`,
        category: "Quotations" as const,
        title: `Quotation for ${state.rfqs.find((r) => r.id === o.rfqId)?.title || o.rfqId}`,
        context: `${o.currency} ${o.price} / ${o.unit} · ${o.incoterms} · ${o.leadDays} days`,
        href: `/app/offers/${o.id}`,
        priority: "Review" as const,
      })),
    ...extra.inquiries.map((i) => ({
      id: `logistics:${i.id}`,
      category: "Logistics" as const,
      title: `${i.origin} → ${i.destination}`,
      context: `${i.cargo} · Local inquiry saved; no booking`,
      href: "/app/logistics?activity=1",
      priority: "Normal" as const,
    })),
    ...extra.applications.map((a, i) => ({
      id: `application:${a.jobId}:${i}:${a.status}`,
      category: "Workforce" as const,
      title:
        extra.jobs.find((j) => j.id === a.jobId)?.title ||
        "Workforce application",
      context: `${a.status} · Fictional applicant ${a.name}`,
      href: "/app/jobs?activity=1",
      priority:
        a.status === "Submitted" ? ("Review" as const) : ("Normal" as const),
    })),
    ...state.events.map((e, i) => ({
      id: `event:${i}:${e}`,
      category: "Notifications" as const,
      title: e,
      context: "Local demonstration activity",
      href: "/app/business",
      priority: "Normal" as const,
    })),
  ];
}
export function filterInbox(
  items: InboxItem[],
  category: string,
  query: string,
  unreadOnly: boolean,
  read: string[],
) {
  return items.filter(
    (i) =>
      (category === "All" || i.category === category) &&
      (!unreadOnly || !read.includes(i.id)) &&
      `${i.title} ${i.context}`.toLowerCase().includes(query.toLowerCase()),
  );
}
