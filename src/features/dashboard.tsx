"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Plus,
  FileText,
  Layers3,
  Bookmark,
  Factory,
  Users,
  PackageSearch,
  Globe2,
  CheckCircle2,
  ChevronRight,
  Waves,
  CalendarDays,
} from "lucide-react";
import { companies, capacities } from "@/data/demo";
import { useDemo } from "./store";
import { Button } from "@/components/ui/button";
import { Badge, SectionTitle, TextLink } from "@/components/ui/shared";
import { CompanyCard, CompanyAvatar } from "./network";
import { RFQTable } from "./commercial";
export function Dashboard() {
  const { state } = useDemo();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const active = state.rfqs.filter((r) => r.status === "Open");
  const pending = state.offers.filter((o) => o.status === "Received");
  return (
    <>
      <div className="page-heading dashboard-heading">
        <div>
          <div className="eyebrow">
            <span className="tiny-dot" />
            YOUR COMMERCIAL WORKSPACE
          </div>
          <h1>
            Welcome to SeaLink<span className="heading-period">.</span>
          </h1>
          <p>Your seafood industry network and commercial workspace.</p>
        </div>
        <div className="heading-actions">
          <span className="date-label">
            <CalendarDays size={15} />
            27 October 2026 <Badge>Demo date</Badge>
          </span>
          <Button asChild>
            <Link href="/rfqs/new">
              <Plus size={16} />
              Create RFQ
            </Link>
          </Button>
        </div>
      </div>
      <section className="search-hero">
        <div className="hero-map">
          <Globe2 size={320} strokeWidth={0.45} />
          <span className="map-point point-1" />
          <span className="map-point point-2" />
          <span className="map-point point-3" />
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span />A MORE CONNECTED SEAFOOD INDUSTRY
          </div>
          <h2>
            The right partner.
            <br />A sea of possibilities.
          </h2>
          <p>Discover expertise and build your next commercial connection.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/discover?smart=${encodeURIComponent(query)}`);
            }}
          >
            <Search size={20} />
            <input
              aria-label="What are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find MSC-certified cod processors in the Netherlands..."
            />
            <Button type="submit">
              Search network
              <ArrowRight size={16} />
            </Button>
          </form>
          <div className="hero-suggestions">
            <span>EXPLORE</span>
            {[
              ["Atlantic cod", "Atlantic cod"],
              ["MSC certified", "MSC"],
              ["Cold storage", "Cold storage"],
            ].map(([label, q]) => (
              <button key={q} onClick={() => router.push(`/discover?q=${q}`)}>
                {label}
                <ArrowUpRight size={11} />
              </button>
            ))}
          </div>
        </div>
        <div className="hero-caption">
          <span className="tiny-dot" />
          EUROPEAN NETWORK <span>07 COUNTRIES</span>
        </div>
      </section>
      <div className="quick-actions">
        {[
          {
            label: "Find Suppliers",
            sub: "Source the right product",
            icon: PackageSearch,
            url: "/discover?activity=Supplier",
          },
          {
            label: "Find Buyers",
            sub: "Build new partnerships",
            icon: Users,
            url: "/discover?activity=Buyer",
          },
          {
            label: "Find Processors",
            sub: "Discover industrial expertise",
            icon: Factory,
            url: "/discover?activity=Processor",
          },
          {
            label: "Explore Capacity",
            sub: "Make production possible",
            icon: Waves,
            url: "/capacity",
          },
        ].map(({ label, sub, icon: Icon, url }) => (
          <Link key={label} href={url}>
            <span className="quick-icon">
              <Icon size={20} />
            </span>
            <div>
              <strong>{label}</strong>
              <small>{sub}</small>
            </div>
            <ArrowUpRight size={16} />
          </Link>
        ))}
      </div>
      <div className="metrics-grid">
        {[
          {
            title: "Active RFQs",
            value: active.length,
            icon: FileText,
            foot: `${state.rfqs.filter((r) => r.status === "Draft").length} draft ready to complete`,
            url: "/rfqs",
          },
          {
            title: "Pending quotations",
            value: pending.length,
            icon: Layers3,
            foot: "Supplier responses to review",
            url: "/offers",
          },
          {
            title: "Saved companies",
            value: state.saved.length,
            icon: Bookmark,
            foot: "Your growing partner shortlist",
            url: "/companies",
          },
          {
            title: "Capacity opportunities",
            value: capacities.length,
            icon: Factory,
            foot: "Illustrative listings across Europe",
            url: "/capacity",
          },
        ].map(({ title, value, icon: Icon, foot, url }) => (
          <Link className="metric-card" href={url} key={title}>
            <div>
              <span>{title}</span>
              <Icon size={17} />
            </div>
            <strong>{String(value).padStart(2, "0")}</strong>
            <p>
              {foot}
              <ArrowUpRight size={13} />
            </p>
          </Link>
        ))}
      </div>
      <div className="dashboard-columns">
        <div className="stack">
          <section className="panel">
            <div className="panel-heading">
              <SectionTitle
                title="Active sourcing"
                subtitle="Your open requests, moving forward."
                action={
                  <TextLink onClick={() => router.push("/rfqs")}>
                    View all RFQs
                  </TextLink>
                }
              />
            </div>
            {active.length ? (
              <RFQTable items={active.slice(0, 3)} compact />
            ) : (
              <div className="padded">
                No active sourcing requests. Create an RFQ to get started.
              </div>
            )}
            <Link className="table-bottom-link" href="/rfqs/new">
              <Plus size={14} />
              Create a new sourcing request
              <ArrowRight size={14} />
            </Link>
          </section>
          <section>
            <SectionTitle
              title="Recommended connections"
              subtitle="Selected for your seafood sourcing network."
              action={
                <TextLink onClick={() => router.push("/discover")}>
                  Explore network
                </TextLink>
              }
            />
            <div className="recommend-grid">
              {[companies[0], companies[1], companies[7]].map((c) => (
                <CompanyCard company={c} key={c.id} />
              ))}
            </div>
          </section>
        </div>
        <aside className="stack">
          <section className="panel activity-panel">
            <SectionTitle
              title="Commercial activity"
              action={
                <span className="live-label">
                  <span />
                  LOCAL DEMO
                </span>
              }
            />
            <div className="activity-feed">
              {state.events
                .slice(-3)
                .reverse()
                .map((text, i) => (
                  <div key={`event-${i}`}>
                    <span className="activity-icon">
                      <CheckCircle2 size={15} />
                    </span>
                    <div>
                      <p>{text}</p>
                      <small>Demonstration workspace</small>
                    </div>
                  </div>
                ))}
              <div>
                <span className="activity-icon">
                  <Layers3 size={15} />
                </span>
                <div>
                  <p>
                    <strong>{state.offers.length} quotations</strong> available
                    to review
                  </p>
                  <Link href="/offers">
                    Explore supplier responses <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
              <div>
                <span className="activity-icon">
                  <Bookmark size={15} />
                </span>
                <div>
                  <p>
                    <strong>{state.saved.length} companies</strong> in your
                    shortlist
                  </p>
                  <Link href="/companies">
                    Review saved partners <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section className="opportunity-card">
            <div>
              <Badge>CAPACITY SPOTLIGHT</Badge>
              <Factory size={25} />
            </div>
            <h3>
              Put the right capacity
              <br />
              within reach.
            </h3>
            <p>
              Explore available filleting, freezing and packaging expertise
              across Europe.
            </p>
            <Link href="/capacity">
              Explore Capacity Exchange <ArrowRight size={15} />
            </Link>
            <small>Fictional availability · Preview</small>
          </section>
          <section className="panel padded recently">
            <SectionTitle title="Recently viewed" />
            {state.viewed.slice(0, 3).map((id) => {
              const c = companies.find((c) => c.id === id);
              return c ? (
                <Link key={id} href={`/companies/${id}`}>
                  <CompanyAvatar company={c} />
                  <div>
                    <strong>{c.name}</strong>
                    <small>{c.country}</small>
                  </div>
                  <ChevronRight size={14} />
                </Link>
              ) : null;
            })}
            {!state.viewed.length && <p>Viewed profiles will appear here.</p>}
          </section>
        </aside>
      </div>
      <div className="network-footnote">
        <Globe2 size={17} />
        <span>A shared industry. A stronger network.</span>
        <span>
          {companies.length} fictional companies across 7 European countries
        </span>
      </div>
    </>
  );
}
