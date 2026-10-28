"use client";
import { Marketplace, Expansion } from "./expansion";
import { Dashboard } from "./dashboard";
import { Discover, CompanyProfile } from "./network";
import { RFQList, RFQForm, RFQDetail, Offers, OfferDetail } from "./commercial";
import {
  CapacityExchange,
  Messages,
  OrganizationPage,
  SettingsPage,
} from "./supporting";
import { useDemo } from "./store";
import { Empty } from "@/components/ui/shared";
import Link from "next/link";
export function Workspace({ route }: { route: string[] }) {
  const { state } = useDemo();
  const [page, id, action] = route;
  if (["logistics", "jobs", "profile", "publish-capacity"].includes(page))
    return <Expansion module={page} />;
  if (page === "marketplace") return <Marketplace />;
  if (!page) return <Dashboard />;
  if (page === "discover") return <Discover />;
  if (page === "companies")
    return id ? <CompanyProfile id={id} /> : <Discover directory />;
  if (page === "rfqs") {
    if (id === "new") return <RFQForm />;
    if (id && action === "edit") {
      const r = state.rfqs.find((r) => r.id === id);
      return r?.status === "Draft" ? (
        <RFQForm existing={r} />
      ) : (
        <Empty
          title="Only drafts can be edited"
          description="Open the RFQ to review its current status."
        />
      );
    }
    return id ? <RFQDetail id={id} /> : <RFQList />;
  }
  if (page === "offers") return id ? <OfferDetail id={id} /> : <Offers />;
  if (page === "capacity") return <CapacityExchange id={id} />;
  if (page === "messages") return <Messages />;
  if (page === "organization") return <OrganizationPage />;
  if (page === "settings") return <SettingsPage />;
  return (
    <Empty
      title="Page not found"
      description="Return to your commercial workspace."
    >
      <Link href="/app">Go to dashboard →</Link>
    </Empty>
  );
}
