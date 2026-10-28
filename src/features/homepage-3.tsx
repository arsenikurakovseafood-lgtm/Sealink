"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Check,
  Inbox,
  FileText,
  LayoutDashboard,
  Building2,
  Factory,
  Truck,
  Users,
  Layers3,
  ChevronRight,
  CheckCircle2,
  MessageSquare,
  PackageSearch,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { companies } from "@/data/demo";
import { plans } from "@/data/pricing";
import { filterCompanies, emptyFilters } from "@/lib/business";
import { buildInbox } from "@/lib/workspace";
import { useDemo } from "./store";
import { useExpansion } from "./expansion";
import { useWorkspace } from "./workspace-state";
import { Modal } from "@/components/ui/shared";
function ProductPreview() {
  const { state } = useDemo();
  const { data } = useExpansion();
  const { ui } = useWorkspace();
  const [view, setView] = useState("Overview");
  const [query, setQuery] = useState("");
  const items = buildInbox(state, data);
  const unread = items.filter((i) => !ui.read.includes(i.id));
  const matches = filterCompanies(companies, { ...emptyFilters, query }).slice(
    0,
    3,
  );
  return (
    <div
      className="h3-product"
      role="region"
      aria-label="Interactive SeaLink product preview"
    >
      <div className="h3-product-chrome">
        <span className="h3-product-mark">≈</span>
        <strong>SeaLink</strong>
        <span className="h3-product-org">{state.organization.name}</span>
        <Link href="/app" aria-label="Open full workspace">
          Open <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="h3-product-layout">
        <div className="h3-product-rail" aria-hidden="true">
          <LayoutDashboard size={18} />
          <Compass size={18} />
          <Inbox size={18} />
          <FileText size={18} />
          <Building2 size={18} />
        </div>
        <div className="h3-product-main">
          <div
            className="h3-product-tabs"
            role="group"
            aria-label="Product preview views"
          >
            {["Overview", "Inbox", "Marketplace"].map((v) => (
              <button
                key={v}
                aria-pressed={view === v}
                onClick={() => setView(v)}
              >
                {v}
              </button>
            ))}
          </div>
          {view === "Overview" ? (
            <>
              <div className="h3-preview-heading">
                <div>
                  <span>YOUR DAILY WORKSPACE</span>
                  <h3>A clearer view of your business.</h3>
                </div>
                <span className="h3-connection-dot" />
              </div>
              <div className="h3-preview-metrics">
                <div>
                  <strong>
                    {state.rfqs.filter((r) => r.status === "Open").length}
                  </strong>
                  <span>Active RFQs</span>
                </div>
                <div>
                  <strong>
                    {state.offers.filter((o) => o.status === "Received").length}
                  </strong>
                  <span>Quotations</span>
                </div>
                <div>
                  <strong>{unread.length}</strong>
                  <span>Unread records</span>
                </div>
              </div>
              <div className="h3-preview-section">
                <strong>Recent sourcing requests</strong>
                <Link href="/app/rfqs">
                  View all <ArrowUpRight size={12} />
                </Link>
              </div>
              {state.rfqs.slice(0, 3).map((r) => (
                <Link
                  className="h3-preview-row"
                  href={`/app/rfqs/${r.id}`}
                  key={r.id}
                >
                  <span className="h3-row-icon">
                    <FileText size={15} />
                  </span>
                  <div>
                    <strong>{r.title}</strong>
                    <span>
                      {r.quantity.toLocaleString("en-IE")} {r.unit} ·{" "}
                      {r.country}
                    </span>
                  </div>
                  <span
                    className={`h3-row-status ${r.status === "Draft" ? "draft" : ""}`}
                  >
                    {r.status}
                  </span>
                </Link>
              ))}
              <div className="h3-preview-activity">
                <span>
                  <CheckCircle2 size={15} />
                  <strong>Business activity</strong>
                </span>
                <p>
                  {state.events.at(-1) ||
                    "Your workspace activity appears here."}
                </p>
              </div>
            </>
          ) : view === "Inbox" ? (
            <>
              <div className="h3-preview-heading">
                <div>
                  <span>COMMERCIAL CONTEXT</span>
                  <h3>Unified Inbox</h3>
                </div>
                <Link href="/app/inbox" aria-label="Open Unified Inbox">
                  <ArrowUpRight size={17} />
                </Link>
              </div>
              <p className="h3-preview-helper">
                Messages, requests and quotations in one internal view.
              </p>
              {items.slice(0, 4).map((i) => (
                <Link key={i.id} href={i.href} className="h3-preview-inbox-row">
                  <span className="h3-row-icon">
                    <Inbox size={15} />
                  </span>
                  <div>
                    <span>{i.category}</span>
                    <strong>{i.title}</strong>
                    <p>{i.context}</p>
                  </div>
                  <ChevronRight size={14} />
                </Link>
              ))}
              <span className="h3-preview-local">
                Internal records only. External channels are not connected.
              </span>
            </>
          ) : (
            <>
              <div className="h3-preview-heading">
                <div>
                  <span>YOUR INDUSTRY NETWORK</span>
                  <h3>Find your next partner.</h3>
                </div>
              </div>
              <label className="h3-preview-search">
                <Search size={16} />
                <input
                  aria-label="Search the marketplace preview"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search species, companies or capabilities..."
                />
              </label>
              {matches.map((c) => (
                <Link
                  key={c.id}
                  href={`/app/companies/${c.id}`}
                  className="h3-preview-row"
                >
                  <span className="h3-company-initials">
                    {c.name
                      .split(" ")
                      .slice(0, 2)
                      .map((v) => v[0])
                      .join("")}
                  </span>
                  <div>
                    <strong>{c.name}</strong>
                    <span>
                      {c.country} · {c.species.join(", ")}
                    </span>
                  </div>
                  <ArrowUpRight size={14} />
                </Link>
              ))}
              {!matches.length && (
                <p className="h3-preview-helper">
                  No matching companies. Try “cod” or “Netherlands”.
                </p>
              )}
              <Link className="h3-preview-directory" href="/app/discover">
                Explore all {companies.length} company profiles{" "}
                <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export function Homepage3() {
  const { state } = useDemo();
  const [disclosure, setDisclosure] = useState(false);
  const [country, setCountry] = useState("Netherlands");
  const matches = companies.filter((c) => c.country === country).slice(0, 2);
  const rfq = state.rfqs[0];
  const offer = state.offers.find((o) => o.rfqId === rfq?.id);
  return (
    <main id="homepage-content" className="home3">
      <section className="h3-hero">
        <div className="h3-hero-copy">
          <div className="h3-eyebrow">
            <span />
            THE EUROPEAN SEAFOOD INDUSTRY, CONNECTED
          </div>
          <h1>
            Trade seafood.
            <br />
            Run your business.
            <br />
            <span>One platform.</span>
          </h1>
          <p>
            Find suppliers and buyers, manage sourcing requests, and organize
            your seafood business in one connected workspace.
          </p>
          <div className="h3-hero-actions">
            <Button asChild>
              <Link href="/join">
                Get started <ArrowUpRight size={18} />
              </Link>
            </Button>
            <Link className="h3-secondary" href="/app">
              Explore the platform <ArrowRight size={18} />
            </Link>
          </div>
          <div className="h3-audience">
            <span>Built for</span> suppliers, buyers, processors & industry
            teams
          </div>
        </div>
        <div className="h3-hero-scene">
          <div className="h3-scene-grid" aria-hidden="true" />
          <div className="h3-industrial">
            <Image
              src="/images/homepage-3/container-terminal.webp"
              alt="Original illustration of blue and orange shipping containers at an intermodal terminal"
              fill
              priority
              sizes="(max-width: 700px) 95vw, 40vw"
            />
            <span>Industrial concept illustration</span>
          </div>
          <ProductPreview />
          <div className="h3-scene-note">
            <span>
              <Layers3 size={18} />
            </span>
            <div>
              <strong>From discovery to daily decisions.</strong>
              <p>One connected commercial workspace.</p>
            </div>
            <ArrowUpRight size={17} />
          </div>
        </div>
      </section>
      <div className="h3-value-strip">
        <span>A SHARED INDUSTRY. A CONNECTED WAY TO WORK.</span>
        <div>
          <Check size={16} />
          Find commercial partners
        </div>
        <div>
          <Check size={16} />
          Structure your sourcing
        </div>
        <div>
          <Check size={16} />
          Keep business in context
        </div>
      </div>
      <section className="h3-section h3-journey" id="platform">
        <div className="h3-section-heading">
          <div>
            <span className="h3-eyebrow">A SIMPLER WAY FORWARD</span>
            <h2>Discover. Connect. Manage.</h2>
          </div>
          <p>
            Go from finding the right expertise to moving the conversation
            forward.
          </p>
        </div>
        <div className="h3-steps">
          {[
            {
              number: "01",
              title: "Discover",
              copy: "Find suppliers, buyers and specialist services by the criteria that matter to your business.",
              icon: Search,
              href: "/app/discover",
            },
            {
              number: "02",
              title: "Connect",
              copy: "Build a shortlist, define your requirements and compare supplier quotations in context.",
              icon: MessageSquare,
              href: "/app/rfqs",
            },
            {
              number: "03",
              title: "Manage",
              copy: "Keep requests, conversations and business activity together in your company workspace.",
              icon: LayoutDashboard,
              href: "/app",
            },
          ].map(({ number, title, copy, icon: Icon, href }) => (
            <Link href={href} key={title}>
              <div>
                <span>{number}</span>
                <Icon size={24} />
              </div>
              <h3>
                {title}
                <ArrowUpRight size={18} />
              </h3>
              <p>{copy}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="h3-market" id="solutions">
        <div className="h3-section h3-market-grid">
          <div>
            <span className="h3-eyebrow">
              A MARKETPLACE WITH INDUSTRY CONTEXT
            </span>
            <h2>
              The right partner.
              <br />
              For your next requirement.
            </h2>
            <p>
              Seafood trade depends on product knowledge, processing expertise
              and reliable relationships. Start with a network built around
              those needs.
            </p>
            <div className="h3-capabilities">
              {[
                {
                  title: "Seafood sourcing & buyers",
                  description:
                    "Find partners by species, products and country.",
                  href: "/app/marketplace",
                  icon: PackageSearch,
                },
                {
                  title: "Processing capacity",
                  description:
                    "Explore filleting, freezing, packaging and storage.",
                  href: "/app/capacity",
                  icon: Factory,
                },
                {
                  title: "Logistics providers",
                  description:
                    "Structure temperature-controlled transport inquiries.",
                  href: "/app/logistics",
                  icon: Truck,
                },
                {
                  title: "Workforce opportunities",
                  description:
                    "Explore industry roles and specialist expertise.",
                  href: "/app/jobs",
                  icon: Users,
                },
              ].map(({ title, description, href, icon: Icon }) => (
                <Link href={href} key={title}>
                  <Icon size={22} />
                  <div>
                    <strong>{title}</strong>
                    <span>{description}</span>
                  </div>
                  <ArrowUpRight size={17} />
                </Link>
              ))}
            </div>
          </div>
          <div className="h3-network-panel">
            <div className="h3-network-title">
              <span>
                <Compass size={23} />
              </span>
              <div>
                <strong>Explore the European network</strong>
                <p>Company profiles, with commercial context.</p>
              </div>
            </div>
            <div
              className="h3-country-tabs"
              role="group"
              aria-label="Explore companies by country"
            >
              {["Netherlands", "Germany", "Estonia"].map((v) => (
                <button
                  aria-pressed={country === v}
                  key={v}
                  onClick={() => setCountry(v)}
                >
                  {v}
                </button>
              ))}
            </div>
            {matches.map((c) => (
              <Link
                className="h3-network-company"
                href={`/app/companies/${c.id}`}
                key={c.id}
              >
                <div>
                  <span className="h3-company-initials">
                    {c.name
                      .split(" ")
                      .slice(0, 2)
                      .map((v) => v[0])
                      .join("")}
                  </span>
                  <ArrowUpRight size={18} />
                </div>
                <h3>{c.name}</h3>
                <p>
                  {c.city}, {c.country}
                </p>
                <div className="h3-company-tags">
                  {c.activities.map((v) => (
                    <span key={v}>{v}</span>
                  ))}
                </div>
                <span>{c.species.join(" · ")}</span>
              </Link>
            ))}
            <Link
              className="h3-network-all"
              href={`/app/discover?q=${encodeURIComponent(country)}`}
            >
              Discover companies in {country}
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="h3-section h3-workspace" id="workspace">
        <div className="h3-workspace-board">
          <div className="h3-board-top">
            <span>
              <LayoutDashboard size={18} />
              Business workspace
            </span>
            <Link href="/app">
              Open workspace <ArrowUpRight size={15} />
            </Link>
          </div>
          <h3>Your business, in view.</h3>
          <div className="h3-board-inbox">
            <span>
              <Inbox size={18} />
              Unified Inbox
            </span>
            <p>Internal messages, RFQs, quotations and operational records.</p>
            <Link href="/app/inbox">
              Review your activity <ArrowRight size={16} />
            </Link>
          </div>
          <div className="h3-board-links">
            <Link href="/app/organization">
              <Building2 size={21} />
              <span>Company context</span>
              <ArrowUpRight size={15} />
            </Link>
            <Link href="/app/team">
              <Users size={21} />
              <span>Team directory</span>
              <ArrowUpRight size={15} />
            </Link>
            <Link href="/app/business">
              <FileText size={21} />
              <span>Commercial activity</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="h3-planned">
            <MessageSquare size={18} />
            <p>
              <strong>More channels. One future workspace.</strong>
              <span>
                Email and WhatsApp connections are planned, not operational.
              </span>
            </p>
            <span>PLANNED</span>
          </div>
        </div>
        <div>
          <span className="h3-eyebrow">MORE THAN A MARKETPLACE</span>
          <h2>
            Keep the whole
            <br />
            business in view.
          </h2>
          <p>
            Finding a partner is only the beginning. SeaLink brings sourcing
            activity, company information and internal communications into a
            shared business context.
          </p>
          <ul className="h3-benefits">
            <li>
              <CheckCircle2 size={20} />
              <div>
                <strong>Know what needs attention</strong>
                <p>
                  Review open requests and supplier responses without losing
                  their commercial context.
                </p>
              </div>
            </li>
            <li>
              <CheckCircle2 size={20} />
              <div>
                <strong>Keep conversations connected</strong>
                <p>
                  Move between internal messages, company records and sourcing
                  workflows.
                </p>
              </div>
            </li>
            <li>
              <CheckCircle2 size={20} />
              <div>
                <strong>Organize the next step</strong>
                <p>
                  Explore company management, team records and local planning
                  tools.
                </p>
              </div>
            </li>
          </ul>
          <Link className="h3-text-link" href="/app">
            Explore your workspace <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <section className="h3-experience" id="experience">
        <div className="h3-section">
          <div className="h3-section-heading">
            <div>
              <span className="h3-eyebrow">A CONNECTED PRODUCT EXPERIENCE</span>
              <h2>
                Follow the work.
                <br />
                Keep the context.
              </h2>
            </div>
            <p>
              Explore an existing sourcing journey in the interactive
              application.
            </p>
          </div>
          <div className="h3-commercial-path">
            <Link href="/app/discover">
              <span>01 / DISCOVER THE EXPERTISE</span>
              <Search size={24} />
              <h3>Find a suitable partner</h3>
              <p>
                Search {companies.length} fictional profiles by country,
                species, service and certification claims.
              </p>
              <span className="h3-path-link">
                Explore company discovery <ArrowUpRight size={17} />
              </span>
            </Link>
            <Link href={rfq ? `/app/rfqs/${rfq.id}` : "/app/rfqs"}>
              <span>02 / DEFINE YOUR REQUEST</span>
              <FileText size={24} />
              <h3>{rfq?.title || "Create a sourcing request"}</h3>
              <p>
                {rfq
                  ? `${rfq.quantity.toLocaleString("en-IE")} ${rfq.unit} · ${rfq.country} · ${rfq.status}`
                  : "Structure product, delivery and certification requirements."}
              </p>
              <span className="h3-path-link">
                Open the sourcing request <ArrowUpRight size={17} />
              </span>
            </Link>
            <Link href={offer ? `/app/offers/${offer.id}` : "/app/offers"}>
              <span>03 / UNDERSTAND THE OFFER</span>
              <Layers3 size={24} />
              <h3>Review commercial terms</h3>
              <p>
                {offer
                  ? `${new Intl.NumberFormat("en-IE", { style: "currency", currency: offer.currency }).format(offer.price)} / ${offer.unit} · ${offer.incoterms} · ${offer.leadDays} days lead time`
                  : "Compare supplier responses for the same request."}
              </p>
              <span className="h3-path-link">
                Explore supplier quotations <ArrowUpRight size={17} />
              </span>
            </Link>
          </div>
        </div>
      </section>
      <section className="h3-section h3-membership" id="pricing">
        <div className="h3-section-heading">
          <div>
            <span className="h3-eyebrow">MEMBERSHIP</span>
            <h2>Find your place in SeaLink.</h2>
          </div>
          <p>
            Indicative prices and feature allocations are provisional. Billing
            is not active.
          </p>
        </div>
        <div className="h3-pricing">
          {plans.map((plan, i) => (
            <article
              key={plan.name}
              className={i === 1 ? "h3-plan-featured" : ""}
            >
              <span>
                {i === 1
                  ? "FOR CONNECTED COMMERCIAL WORKFLOWS"
                  : "MEMBERSHIP CONCEPT"}
              </span>
              <h3>{plan.name}</h3>
              <div className="h3-price">
                {plan.price}
                <span>{i < 2 ? "/ month" : " pricing"}</span>
              </div>
              <p>
                {i < 2
                  ? "+ applicable VAT"
                  : "Discuss your business requirements"}
              </p>
              <ul>
                {plan.features.map((v) => (
                  <li key={v}>
                    <Check size={18} />
                    {v}
                  </li>
                ))}
              </ul>
              <Button variant={i === 1 ? "default" : "outline"} asChild>
                <Link href={`/join?plan=${plan.name}`}>
                  Explore {plan.name}
                  <ArrowUpRight size={17} />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>
      <section className="h3-final">
        <div>
          <span className="h3-eyebrow">YOUR NEXT COMMERCIAL CONNECTION</span>
          <h2>
            Trade with context.
            <br />
            Work with clarity.
          </h2>
        </div>
        <div>
          <p>
            Explore a connected marketplace and business workspace built around
            the European seafood industry.
          </p>
          <Button asChild>
            <Link href="/join">
              Get started with SeaLink <ArrowUpRight size={18} />
            </Link>
          </Button>
          <Link className="h3-secondary" href="/app">
            Explore the platform <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <div className="h3-disclosure">
        <p>
          This is an interactive product preview using fictional companies and
          commercial records.
        </p>
        <button onClick={() => setDisclosure(true)}>
          About the preview <ArrowUpRight size={15} />
        </button>
      </div>
      {disclosure && (
        <Modal
          title="About this product preview"
          onClose={() => setDisclosure(false)}
        >
          <div className="modal-body">
            <p>
              All seeded companies, quotations and capacity records are
              fictional. Changes are local to this browser. No real
              transactions, external messages, verified company claims or
              payments occur. Team records are illustrative, not secure access
              controls. Email and WhatsApp integrations are planned and are not
              connected.
            </p>
            <p>
              The container-terminal visual is an original AI-generated
              industrial illustration. It does not depict an actual SeaLink
              facility or partner.
            </p>
            <Button onClick={() => setDisclosure(false)}>
              Continue exploring
            </Button>
          </div>
        </Modal>
      )}
    </main>
  );
}
