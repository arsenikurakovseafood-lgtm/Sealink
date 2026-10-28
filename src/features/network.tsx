"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  MapPin,
  Bookmark,
  Check,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Factory,
  Globe,
  ShieldCheck,
  Package,
  ChevronRight,
} from "lucide-react";
import {
  companies,
  countries,
  species,
  capabilities,
  certifications,
  activities,
  capacities,
} from "@/data/demo";
import {
  filterCompanies,
  emptyFilters,
  parseSmartQuery,
  smartMatches,
} from "@/lib/business";
import type { Company } from "@/types";
import { useDemo } from "./store";
import { Button } from "@/components/ui/button";
import { Badge, Empty, SectionTitle, Modal } from "@/components/ui/shared";
export function CompanyAvatar({
  company,
  large = false,
}: {
  company: Company;
  large?: boolean;
}) {
  return (
    <span
      className={`company-avatar avatar-${company.color} ${large ? "avatar-large" : ""}`}
    >
      {company.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")}
      <span className="avatar-wave">≈</span>
    </span>
  );
}
export function SaveCompany({ id }: { id: string }) {
  const { state, update, notify } = useDemo();
  const saved = state.saved.includes(id);
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={saved ? "Remove from shortlist" : "Save to shortlist"}
      onClick={() => {
        update((s) => ({
          ...s,
          saved: saved ? s.saved.filter((v) => v !== id) : [...s.saved, id],
        }));
        notify(
          saved
            ? "Company removed from shortlist."
            : "Company saved to your shortlist.",
        );
      }}
    >
      <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
    </Button>
  );
}
export function CompanyCard({ company: c }: { company: Company }) {
  return (
    <article className="company-card">
      <div className="company-card-top">
        <CompanyAvatar company={c} />
        <SaveCompany id={c.id} />
      </div>
      <Link href={`/companies/${c.id}`} className="company-name">
        {c.name}
        <ArrowUpRight size={15} />
      </Link>
      <p className="location">
        <MapPin size={12} />
        {c.city}, {c.country}
      </p>
      <div className="tags">
        {c.activities.map((a) => (
          <Badge key={a}>{a}</Badge>
        ))}
      </div>
      <p className="company-description">{c.description}</p>
      <div className="species-line">{c.species.join(" · ")}</div>
      <p className="card-capabilities">{c.capabilities.join(" · ")}</p>
      <div className="card-completeness">
        <span>Profile completeness</span>
        <strong>{c.completeness}%</strong>
      </div>
      <div className="company-card-bottom">
        <div className="certs">
          {c.certifications.slice(0, 2).map((v) => (
            <span key={v}>
              <ShieldCheck size={12} />
              {v}
            </span>
          ))}
        </div>
        <Link href={`/companies/${c.id}`} aria-label={`View ${c.name}`}>
          <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}
export function Discover({ directory = false }: { directory?: boolean }) {
  const [filters, setFilters] = useState(emptyFilters);
  const [smart, setSmart] = useState("");
  const [parsed, setParsed] = useState<ReturnType<
    typeof parseSmartQuery
  > | null>(null);
  const [sort, setSort] = useState("recommended");
  const [tab, setTab] = useState("all");
  const { state } = useDemo();
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = setTimeout(() => {
      setFilters({
        ...emptyFilters,
        query: p.get("q") || "",
        activity: p.get("activity") || "",
        species: p.get("species") || "",
        service: p.get("service") || "",
      });
      const query = p.get("smart");
      if (query) {
        setSmart(query);
        setParsed(parseSmartQuery(query));
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);
  let results = filterCompanies(companies, filters).filter(
    (c) => tab !== "saved" || state.saved.includes(c.id),
  );
  if (parsed?.supported)
    results = results.filter((c) => smartMatches(c, parsed));
  if (sort === "name") results.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "country")
    results.sort((a, b) => a.country.localeCompare(b.country));
  else results.sort((a, b) => b.completeness - a.completeness);
  const options = [
    ["country", "Country", countries],
    ["activity", "Business activity", activities],
    ["species", "Species", species],
    ["service", "Processing service", capabilities],
    ["certification", "Certification", certifications],
  ] as const;
  const reset = () => {
    setFilters(emptyFilters);
    setParsed(null);
    setSmart("");
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR INDUSTRY, CONNECTED</div>
          <h1>
            {directory ? "Company network" : "Discover your next partner"}
          </h1>
          <p>
            Find the right expertise, products and partnerships across Europe.
          </p>
        </div>
        <Badge tone="blue">{companies.length} fictional companies</Badge>
      </div>
      <div className="network-tabs">
        <button
          className={tab === "all" ? "selected" : ""}
          onClick={() => setTab("all")}
        >
          All companies <span>{companies.length}</span>
        </button>
        <button
          className={tab === "saved" ? "selected" : ""}
          onClick={() => setTab("saved")}
        >
          <Bookmark size={14} />
          Saved companies <span>{state.saved.length}</span>
        </button>
      </div>
      <div className="discovery-layout">
        <aside className="filter-panel panel">
          <div className="filter-heading">
            <strong>
              <SlidersHorizontal size={15} />
              Filters
            </strong>
            <button onClick={reset}>Reset all</button>
          </div>
          {options.map(([key, label, list]) => (
            <label className="filter-field" key={key}>
              <span>{label}</span>
              <select
                value={filters[key]}
                onChange={(e) =>
                  setFilters({ ...filters, [key]: e.target.value })
                }
              >
                <option value="">
                  All {label.toLowerCase()}
                  {label === "Country" ? " destinations" : ""}
                </option>
                {list.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
          ))}
          <div className="filter-note">
            <ShieldCheck size={20} />
            <p>
              Certification claims are self-reported and illustrative. Always
              verify with your partner.
            </p>
          </div>
        </aside>
        <section>
          <form className="search-input" onSubmit={(e) => e.preventDefault()}>
            <Search size={19} />
            <input
              aria-label="Search company directory"
              placeholder="Search companies, species, products or capabilities..."
              value={filters.query}
              onChange={(e) =>
                setFilters({ ...filters, query: e.target.value })
              }
            />
            {filters.query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setFilters({ ...filters, query: "" })}
              >
                <X size={16} />
              </button>
            )}
          </form>
          <form
            className="smart-search"
            onSubmit={(e) => {
              e.preventDefault();
              setParsed(parseSmartQuery(smart));
            }}
          >
            <div>
              <Sparkles size={16} />
              <strong>Smart search</strong>
              <Badge tone="blue">PREVIEW</Badge>
            </div>
            <p>
              Try “Find companies in Germany or the Netherlands that process
              Atlantic cod and offer freezing services.”
            </p>
            <div>
              <input
                aria-label="Smart search"
                value={smart}
                onChange={(e) => setSmart(e.target.value)}
                placeholder="Describe the partner you need..."
              />
              <Button size="sm" variant="outline">
                Find matches <ArrowRight size={14} />
              </Button>
            </div>
            {parsed && (
              <p className={parsed.supported ? "smart-result" : "error"}>
                {parsed.supported
                  ? `Applied: ${[...parsed.countries, ...parsed.fish, ...parsed.services, ...parsed.certs].join(" · ")}. `
                  : "This preview cannot interpret that query. Use country, species, certification and service names from the filters. "}
                <button
                  type="button"
                  onClick={() => {
                    setParsed(null);
                    setSmart("");
                  }}
                >
                  Clear
                </button>
              </p>
            )}
            <small>
              Deterministic keyword patterns, not AI. Countries/species use OR;
              services/certifications use AND.
            </small>
          </form>
          <div className="results-toolbar">
            <span>
              <strong>{results.length}</strong> companies{" "}
              {tab === "saved" ? "in your shortlist" : "in your network"}
            </span>
            <label>
              Sort by{" "}
              <select
                aria-label="Sort companies"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="recommended">Profile completeness</option>
                <option value="name">Company name</option>
                <option value="country">Country</option>
              </select>
            </label>
          </div>
          <div className="active-filters">
            {Object.entries(filters)
              .filter(([k, v]) => k !== "query" && v)
              .map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setFilters({ ...filters, [k]: "" })}
                >
                  {v}
                  <X size={12} />
                </button>
              ))}
          </div>
          {results.length ? (
            <div className="company-grid">
              {results.map((c) => (
                <CompanyCard key={c.id} company={c} />
              ))}
            </div>
          ) : (
            <Empty
              title="No companies match these criteria"
              description="Try removing a filter or searching a broader product category."
            >
              <Button variant="outline" onClick={reset}>
                Clear filters
              </Button>
            </Empty>
          )}
        </section>
      </div>
    </>
  );
}
export function CompanyProfile({ id }: { id: string }) {
  const c = companies.find((c) => c.id === id);
  const { update, notify, state } = useDemo();
  const router = useRouter();
  const [select, setSelect] = useState(false);
  useEffect(() => {
    if (c)
      update((s) =>
        s.viewed[0] === c.id
          ? s
          : {
              ...s,
              viewed: [c.id, ...s.viewed.filter((v) => v !== c.id)].slice(0, 6),
            },
      );
  }, [c, update]);
  if (!c)
    return (
      <Empty
        title="Company not found"
        description="Choose a company from the directory."
      />
    );
  const listings = capacities.filter((v) => v.companyId === c.id);
  return (
    <>
      <Link className="back-link" href="/discover">
        ← Back to discovery
      </Link>
      <div className="profile-cover">
        <div className="cover-lines" />
        <span>SEALINK COMPANY NETWORK</span>
        <Globe size={110} />
      </div>
      <div className="profile-header">
        <CompanyAvatar company={c} large />
        <div>
          <h1>{c.name}</h1>
          <p className="location">
            <MapPin size={14} />
            {c.city}, {c.country}
            <span>·</span>Fictional company
          </p>
          <div className="tags">
            {c.activities.map((a) => (
              <Badge key={a}>{a}</Badge>
            ))}
          </div>
        </div>
        <div className="profile-actions">
          <SaveCompany id={c.id} />
          <Button variant="outline" onClick={() => setSelect(true)}>
            Select for RFQ
          </Button>
          <Button
            onClick={() =>
              router.push(
                `/rfqs/new?supplier=${c.id}&species=${encodeURIComponent(c.species[0])}`,
              )
            }
          >
            Create RFQ <ArrowUpRight size={15} />
          </Button>
        </div>
      </div>
      <div className="profile-grid">
        <div className="stack">
          <section className="panel padded">
            <SectionTitle title="Company overview" />
            <p className="body-copy">{c.description}</p>
            <div className="detail-grid">
              <div>
                <small>Website placeholder</small>
                <strong>
                  {c.name.toLowerCase().replaceAll(" ", "")}.example
                </strong>
              </div>
              <div>
                <small>Company status</small>
                <Badge tone="green">Demo profile · Active</Badge>
              </div>
              <div>
                <small>Main markets</small>
                <strong>{c.markets.join(", ")}</strong>
              </div>
              <div>
                <small>Profile completeness</small>
                <strong>{c.completeness}%</strong>
                <div className="progress">
                  <i style={{ width: `${c.completeness}%` }} />
                </div>
              </div>
            </div>
          </section>
          <section className="panel padded">
            <SectionTitle
              title="Commercial activities"
              subtitle="Products and species represented in this preview."
            />
            <div className="detail-grid">
              <div>
                <small>Products bought</small>
                {c.buys.map((v) => (
                  <p key={v}>{v}</p>
                ))}
              </div>
              <div>
                <small>Products sold</small>
                {c.sells.map((v) => (
                  <p key={v}>{v}</p>
                ))}
              </div>
            </div>
            <div className="tags">
              {c.species.map((v) => (
                <Badge key={v} tone="blue">
                  {v}
                </Badge>
              ))}
            </div>
          </section>
          <section className="panel padded">
            <SectionTitle title="Processing capabilities" />
            <div className="capability-grid">
              {c.capabilities.map((v) => (
                <div key={v}>
                  <Factory size={19} />
                  <strong>{v}</strong>
                  <Check size={14} />
                </div>
              ))}
            </div>
            <div className="notice">
              <strong>Technical production capacity</strong>
              <p>
                Illustrative maximum throughput: {c.technicalCapacity} tonnes /
                week. This is not currently available capacity.
              </p>
            </div>
          </section>
          <section className="panel padded">
            <SectionTitle
              title="Available capacity"
              subtitle="Fictional availability, not real-time production data."
            />
            {listings.length ? (
              listings.map((l) => (
                <Link
                  className="list-row"
                  key={l.id}
                  href={`/capacity/${l.id}`}
                >
                  <Factory size={22} />
                  <div>
                    <strong>{l.service}</strong>
                    <small>
                      {l.amount} {l.unit} · {l.from} – {l.to}
                    </small>
                  </div>
                  <ChevronRight size={17} />
                </Link>
              ))
            ) : (
              <p className="muted">
                No available capacity listed. Contact through the demonstration
                inquiry workflow.
              </p>
            )}
          </section>
        </div>
        <div className="stack">
          <section className="panel padded">
            <SectionTitle title="Certification claims" />
            {c.certifications.map((v) => (
              <div className="certification" key={v}>
                <ShieldCheck size={24} />
                <div>
                  <strong>{v}</strong>
                  <small>Self-reported · Not verified</small>
                  <small>Illustrative expiry: 31 Dec 2027</small>
                </div>
              </div>
            ))}
            <p className="fine-print">
              SeaLink has not independently verified these claims. All records
              in this environment are fictional.
            </p>
          </section>
          <section className="panel padded commercial-card">
            <Package size={26} />
            <h3>Start a commercial conversation</h3>
            <p>Turn the right connection into a structured sourcing request.</p>
            <Button onClick={() => router.push(`/rfqs/new?supplier=${c.id}`)}>
              Create an RFQ <ArrowRight size={15} />
            </Button>
          </section>
        </div>
      </div>
      {select && (
        <Modal title="Select an RFQ" onClose={() => setSelect(false)}>
          <div className="modal-body">
            <p>
              Add {c.name} to a draft RFQ. You can review matching requirements
              before simulating distribution.
            </p>
            {state.rfqs
              .filter((r) => r.status === "Draft")
              .map((r) => (
                <button
                  className="list-row full-width"
                  key={r.id}
                  onClick={() => {
                    update((s) => ({
                      ...s,
                      rfqs: s.rfqs.map((v) =>
                        v.id === r.id
                          ? {
                              ...v,
                              recipients: [...new Set([...v.recipients, c.id])],
                            }
                          : v,
                      ),
                    }));
                    notify("Supplier added to draft RFQ.");
                    setSelect(false);
                    router.push(`/rfqs/${r.id}`);
                  }}
                >
                  <FileIcon />
                  <div>
                    <strong>{r.title}</strong>
                    <small>{r.id}</small>
                  </div>
                  <CheckCircle2 size={17} />
                </button>
              ))}
            <Button
              variant="outline"
              onClick={() => router.push(`/rfqs/new?supplier=${c.id}`)}
            >
              Create a new RFQ
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
function FileIcon() {
  return <Package size={19} />;
}
