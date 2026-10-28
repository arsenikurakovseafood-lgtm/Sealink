"use client";
import { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { z } from "zod";
import { companies, countries, capabilities, species } from "@/data/demo";
import type { Capacity } from "@/types";
import { useDemo } from "./store";
import { Button } from "@/components/ui/button";
import { Field, Modal, Badge, Empty } from "@/components/ui/shared";
export type Job = {
  id: string;
  title: string;
  country: string;
  companyId: string;
  type: string;
  salary: string;
  description: string;
  active: boolean;
  owned: boolean;
};
type Application = {
  jobId: string;
  name: string;
  summary: string;
  status: string;
};
type Inquiry = {
  id: string;
  provider: string;
  origin: string;
  destination: string;
  cargo: string;
  weight: number;
  temperature: string;
  date: string;
  requirements: string;
};
export type Extra = {
  jobs: Job[];
  saved: string[];
  applications: Application[];
  inquiries: Inquiry[];
  capacity: Capacity[];
  profile: {
    name: string;
    country: string;
    specialization: string;
    experience: string;
    interests: string;
  };
};
const initial = (): Extra => ({
  jobs: [
    "Fish filleter",
    "Production manager",
    "Quality control specialist",
    "Seafood trader",
    "Logistics coordinator",
    "Vessel crew",
    "Cold storage specialist",
    "Processing operator",
  ].map((title, i) => ({
    id: `job-${i}`,
    title,
    country: companies[i].country,
    companyId: companies[i].id,
    type: i % 2 ? "Permanent" : "Seasonal",
    salary:
      i % 2 ? "To be discussed" : "€2,400–€3,000 gross / month (fictional)",
    description:
      "Work with a specialist seafood team. Experience with food safety and traceability is valued. This vacancy and its employment terms are fictional.",
    active: true,
    owned: false,
  })),
  saved: [],
  applications: [],
  inquiries: [],
  capacity: [],
  profile: {
    name: "Alex Demo",
    country: "Estonia",
    specialization: "Quality control",
    experience: "Five years in seafood processing",
    interests: "Permanent European roles",
  },
});
const Context = createContext<{
  data: Extra;
  set: React.Dispatch<React.SetStateAction<Extra>>;
} | null>(null);
export function ExpansionProvider({ children }: { children: React.ReactNode }) {
  const [data, set] = useState<Extra>(initial);
  const { notify } = useDemo();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem("sealink-expansion-v1");
        if (raw) {
          const d = JSON.parse(raw);
          if (
            Array.isArray(d.jobs) &&
            Array.isArray(d.capacity) &&
            Array.isArray(d.inquiries) &&
            Array.isArray(d.saved) &&
            Array.isArray(d.applications) &&
            d.profile
          )
            set(d);
        }
      } catch {}
      setReady(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem("sealink-expansion-v1", JSON.stringify(data));
      } catch {
        const t = setTimeout(
          () => notify("Local demo changes could not be persisted."),
          0,
        );
        return () => clearTimeout(t);
      }
  }, [data, ready, notify]);
  useEffect(() => {
    const reset = () => {
      set(initial());
      try {
        localStorage.removeItem("sealink-account");
      } catch {}
    };
    window.addEventListener("sealink-reset", reset);
    return () => window.removeEventListener("sealink-reset", reset);
  }, []);
  return <Context.Provider value={{ data, set }}>{children}</Context.Provider>;
}
export function useExpansion() {
  const c = useContext(Context);
  if (!c) throw new Error("Expansion provider required");
  return c;
}
const inquirySchema = z.object({
  origin: z.string().min(2),
  destination: z.string().min(2),
  cargo: z.string().min(2),
  weight: z.coerce.number().positive(),
  temperature: z.string().min(1),
  date: z.string().min(1),
  requirements: z.string(),
});
export function Expansion({ module }: { module: string }) {
  const { data, set } = useExpansion();
  const { notify } = useDemo();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [modal, setModal] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState(() =>
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("activity")
      ? "My activity"
      : "Browse",
  );
  const title =
    module === "logistics"
      ? "Logistics network"
      : module === "jobs"
        ? "Jobs & workforce"
        : module === "profile"
          ? "Professional profile"
          : "Publish processing capacity";
  const close = () => {
    setModal("");
    setError("");
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">THE CONNECTED INDUSTRY</span>
          <h1>{title}</h1>
          <p>
            Fictional opportunities and local-only workflows. No external
            delivery or real availability.
          </p>
        </div>
        {module === "jobs" && (
          <Button onClick={() => setModal("post")}>Publish a vacancy</Button>
        )}
      </div>
      <div className="notice inline-notice">
        Demo Mode · Use fictional details only. Applications and inquiries are
        private to this local browser, not publicly published.
      </div>
      {module === "profile" ? (
        <form
          className="panel padded"
          onSubmit={(e) => {
            e.preventDefault();
            const d = Object.fromEntries(new FormData(e.currentTarget));
            set((s) => ({ ...s, profile: d as Extra["profile"] }));
            notify("Professional profile saved locally.");
          }}
        >
          {Object.entries(data.profile).map(([k, v]) => (
            <Field label={k[0].toUpperCase() + k.slice(1)} key={k}>
              <input name={k} defaultValue={v} required />
            </Field>
          ))}
          <Button>Save professional profile</Button>
        </form>
      ) : module === "publish-capacity" ? (
        <>
          <form
            className="panel padded"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const from = String(f.get("from")),
                to = String(f.get("to"));
              if (to < from) {
                setError("End date must follow the start date.");
                return;
              }
              const companyId = String(f.get("company"));
              const c = companies.find((c) => c.id === companyId)!;
              const service = String(f.get("service"));
              if (!c.species.includes(String(f.get("species")))) {
                setError("Choose a species handled by this company.");
                return;
              }
              if (!c.capabilities.includes(service)) {
                setError("Choose a service supported by this company profile.");
                return;
              }
              set((s) => ({
                ...s,
                capacity: [
                  ...s.capacity,
                  {
                    id: `cap-${crypto.randomUUID()}`,
                    companyId,
                    service,
                    species: [String(f.get("species"))],
                    amount: Number(f.get("amount")),
                    unit: String(f.get("unit")),
                    from,
                    to,
                  },
                ],
              }));
              notify("Fictional capacity published in this browser.");
              setError("");
            }}
          >
            <h2>Publish illustrative availability</h2>
            <p>
              Choose an existing fictional company to represent in this
              demonstration.
            </p>
            <div className="form-grid">
              <Field label="Company">
                <select name="company">
                  {companies.map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Service">
                <select name="service" defaultValue="Filleting">
                  {capabilities.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
              <Field label="Species">
                <select name="species" defaultValue="Atlantic cod">
                  {species.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
              <Field label="Available capacity">
                <input name="amount" type="number" min="1" required />
              </Field>
              <Field label="Unit">
                <select name="unit">
                  <option>tonnes / week</option>
                  <option>pallet spaces</option>
                </select>
              </Field>
              <Field label="Available from">
                <input name="from" type="date" required />
              </Field>
              <Field label="Available until">
                <input name="to" type="date" required />
              </Field>
            </div>
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <Button>Publish demo capacity</Button>
          </form>
          <div className="panel padded">
            <h2>Your local listings</h2>
            {data.capacity.map((c) => (
              <div className="list-row" key={c.id}>
                <Link href={`/app/capacity/${c.id}`}>
                  {c.service} · {c.amount} {c.unit}
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    set((s) => ({
                      ...s,
                      capacity: s.capacity.filter((v) => v.id !== c.id),
                    }));
                    notify("Local listing removed.");
                  }}
                >
                  Remove listing
                </Button>
              </div>
            ))}
            <Link href="/app/capacity">Browse all capacity →</Link>
          </div>
        </>
      ) : (
        <>
          <div className="list-toolbar panel">
            <input
              aria-label="Search opportunities"
              placeholder={
                module === "jobs"
                  ? "Search profession or company..."
                  : "Search provider or service..."
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              aria-label="Filter country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">All countries</option>
              {countries.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={() =>
                setTab(tab === "Browse" ? "My activity" : "Browse")
              }
            >
              {tab === "Browse" ? "My activity" : "Browse opportunities"}
            </Button>
          </div>
          {module === "logistics" ? (
            <>
              {tab === "Browse" ? (
                <div className="logistics-list">
                  {companies
                    .filter(
                      (c) =>
                        c.activities.includes("Logistics") ||
                        c.activities.includes("Cold storage"),
                    )
                    .filter(
                      (c) =>
                        (!country || c.country === country) &&
                        `${c.name} Refrigerated transport Freight forwarding Cold storage`
                          .toLowerCase()
                          .includes(query.toLowerCase()),
                    )
                    .map((c) => (
                      <article className="panel padded" key={c.id}>
                        <Badge tone="blue">FICTIONAL SERVICE PROVIDER</Badge>
                        <h2>{c.name}</h2>
                        <p>
                          {c.city}, {c.country}
                        </p>
                        <div className="tags">
                          <Badge>Refrigerated transport</Badge>
                          <Badge>Cold storage</Badge>
                          <Badge>Freight forwarding</Badge>
                        </div>
                        <p>
                          Illustrative routes across Netherlands, Germany,
                          Denmark and the Baltics. Frozen and chilled cargo
                          requirements must be confirmed. No carrier
                          availability is asserted.
                        </p>
                        <div className="heading-actions">
                          <Button onClick={() => setModal(c.id)}>
                            Create transport inquiry
                          </Button>
                          <Link href={`/app/companies/${c.id}`}>
                            Service provider profile →
                          </Link>
                        </div>
                      </article>
                    ))}
                </div>
              ) : (
                <section className="panel padded">
                  <h2>Your local transport inquiries</h2>
                  {data.inquiries.map((i) => (
                    <article className="list-row" key={i.id}>
                      <div>
                        <strong>
                          {i.origin} → {i.destination}
                        </strong>
                        <p>
                          {i.cargo} · {i.weight} kg · {i.temperature} · {i.date}
                        </p>
                        <small>
                          {i.requirements} · Saved locally, not booked or sent
                        </small>
                      </div>
                    </article>
                  ))}
                  {!data.inquiries.length && (
                    <Empty
                      title="No inquiries yet"
                      description="Choose a provider to describe a fictional shipment."
                    />
                  )}
                </section>
              )}
            </>
          ) : (
            <>
              <div className="jobs-list">
                {data.jobs
                  .filter(
                    (j) =>
                      (tab === "Browse"
                        ? j.active
                        : j.owned ||
                          data.saved.includes(j.id) ||
                          data.applications.some((a) => a.jobId === j.id)) &&
                      (!country || j.country === country) &&
                      `${j.title} ${companies.find((c) => c.id === j.companyId)?.name}`
                        .toLowerCase()
                        .includes(query.toLowerCase()),
                  )
                  .map((j) => (
                    <article className="panel padded" key={j.id}>
                      <Badge tone="blue">
                        {j.type} · {j.active ? "Open demo role" : "Closed"}
                      </Badge>
                      <h2>{j.title}</h2>
                      <p>
                        {companies.find((c) => c.id === j.companyId)?.name} ·{" "}
                        {j.country}
                      </p>
                      <p>{j.description}</p>
                      <strong>{j.salary || "Salary not disclosed"}</strong>
                      <div className="heading-actions">
                        <Button
                          disabled={
                            !j.active ||
                            data.applications.some((a) => a.jobId === j.id)
                          }
                          onClick={() => setModal(`apply:${j.id}`)}
                        >
                          {data.applications.some((a) => a.jobId === j.id)
                            ? "Applied locally"
                            : "Apply in demo"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            set((s) => ({
                              ...s,
                              saved: s.saved.includes(j.id)
                                ? s.saved.filter((v) => v !== j.id)
                                : [...s.saved, j.id],
                            }))
                          }
                        >
                          {data.saved.includes(j.id)
                            ? "Unsave role"
                            : "Save role"}
                        </Button>
                        {j.owned && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              set((s) => ({
                                ...s,
                                jobs: s.jobs.map((v) =>
                                  v.id === j.id
                                    ? { ...v, active: !v.active }
                                    : v,
                                ),
                              }))
                            }
                          >
                            {j.active ? "Close vacancy" : "Reopen vacancy"}
                          </Button>
                        )}
                      </div>
                      {j.owned && (
                        <details>
                          <summary>
                            Review local applications (
                            {
                              data.applications.filter((a) => a.jobId === j.id)
                                .length
                            }
                            )
                          </summary>
                          {data.applications
                            .filter((a) => a.jobId === j.id)
                            .map((a, i) => (
                              <div key={i}>
                                <p>
                                  {a.name} · {a.summary}
                                </p>
                                <select
                                  aria-label="Application status"
                                  value={a.status}
                                  onChange={(e) =>
                                    set((s) => ({
                                      ...s,
                                      applications: s.applications.map((v) =>
                                        v === a
                                          ? { ...v, status: e.target.value }
                                          : v,
                                      ),
                                    }))
                                  }
                                >
                                  <option>Submitted</option>
                                  <option>Reviewed</option>
                                  <option>Shortlisted</option>
                                </select>
                              </div>
                            ))}
                          <small>
                            Local employer view only. No applicant information
                            appears in public job listings.
                          </small>
                        </details>
                      )}
                    </article>
                  ))}
              </div>
            </>
          )}
        </>
      )}
      {modal && (
        <Modal
          title={
            modal === "post"
              ? "Publish a fictional vacancy"
              : modal.startsWith("apply:")
                ? "Local job application"
                : "Transport inquiry · No booking"
          }
          onClose={close}
        >
          <form
            className="modal-body"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              if (module === "logistics") {
                const result = inquirySchema.safeParse(Object.fromEntries(f));
                if (!result.success) {
                  setError(
                    "Complete all shipment fields with a positive weight.",
                  );
                  return;
                }
                set((s) => ({
                  ...s,
                  inquiries: [
                    ...s.inquiries,
                    {
                      ...result.data,
                      id: crypto.randomUUID(),
                      provider: modal,
                    },
                  ],
                }));
                notify(
                  "Transport inquiry saved locally. No carrier contacted or booked.",
                );
              } else if (modal === "post") {
                set((s) => ({
                  ...s,
                  jobs: [
                    {
                      id: crypto.randomUUID(),
                      title: String(f.get("title")),
                      country: String(f.get("country")),
                      companyId: String(f.get("company")),
                      type: String(f.get("type")),
                      salary: String(f.get("salary")),
                      description: String(f.get("description")),
                      active: true,
                      owned: true,
                    },
                    ...s.jobs,
                  ],
                }));
                notify("Vacancy published locally.");
              } else {
                set((s) => ({
                  ...s,
                  applications: [
                    ...s.applications,
                    {
                      jobId: modal.split(":")[1],
                      name: String(f.get("name")),
                      summary: String(f.get("summary")),
                      status: "Submitted",
                    },
                  ],
                }));
                notify("Application saved locally. No employer contacted.");
              }
              close();
            }}
          >
            {module === "logistics" ? (
              <>
                {[
                  ["origin", "Origin"],
                  ["destination", "Destination"],
                  ["cargo", "Cargo type"],
                  ["weight", "Estimated weight (kg)"],
                  ["temperature", "Required temperature"],
                  ["date", "Pickup date"],
                  ["requirements", "Additional requirements"],
                ].map(([key, label]) => (
                  <Field label={label} key={key}>
                    <input
                      name={key}
                      required={key !== "requirements"}
                      type={
                        key === "weight"
                          ? "number"
                          : key === "date"
                            ? "date"
                            : "text"
                      }
                      min={key === "weight" ? 1 : undefined}
                    />
                  </Field>
                ))}
              </>
            ) : modal === "post" ? (
              <>
                <Field label="Position">
                  <input name="title" required minLength={3} />
                </Field>
                <Field label="Company">
                  <select name="company">
                    {companies.map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Country">
                  <select name="country">
                    {countries.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Employment type">
                  <select name="type">
                    <option>Permanent</option>
                    <option>Seasonal</option>
                    <option>Contract</option>
                  </select>
                </Field>
                <Field label="Salary (optional, fictional)">
                  <input name="salary" />
                </Field>
                <Field label="Role description">
                  <textarea name="description" required minLength={10} />
                </Field>
              </>
            ) : (
              <>
                <Field label="Fictional applicant name">
                  <input
                    name="name"
                    defaultValue={data.profile.name}
                    required
                  />
                </Field>
                <Field label="Experience and motivation (fictional only)">
                  <textarea name="summary" required minLength={10} />
                </Field>
              </>
            )}
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <Button>Save local demonstration</Button>
          </form>
        </Modal>
      )}
    </>
  );
}

export function Marketplace() {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const results = companies.filter(
    (c) =>
      (!country || c.country === country) &&
      `${c.name} ${c.sells.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">SEAFOOD MARKETPLACE · DEMO</span>
          <h1>Source with context.</h1>
          <p>
            Illustrative product capabilities, not live inventory or offers.
          </p>
        </div>
        <Button asChild>
          <Link href="/app/rfqs/new">Create sourcing request</Link>
        </Button>
      </div>
      <div className="list-toolbar panel">
        <input
          aria-label="Search products"
          placeholder="Species, product or supplier..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          aria-label="Product origin country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <Link href="/app/discover">Advanced partner discovery →</Link>
      </div>
      <div className="jobs-list">
        {results.map((c) => (
          <article className="panel padded" key={c.id}>
            <Badge tone="blue">FICTIONAL PRODUCT CAPABILITY</Badge>
            <h2>{c.sells.join(" · ")}</h2>
            <p>
              {c.name} · {c.country}
            </p>
            <p>{c.capabilities.join(" · ")}</p>
            <div className="heading-actions">
              <Button asChild>
                <Link
                  href={`/app/rfqs/new?supplier=${c.id}&species=${encodeURIComponent(c.species[0])}`}
                >
                  Request a quotation
                </Link>
              </Button>
              <Link href={`/app/companies/${c.id}`}>Supplier profile →</Link>
            </div>
          </article>
        ))}
      </div>
      {!results.length && (
        <Empty
          title="No products match"
          description="Try a different species or country."
        />
      )}
    </>
  );
}
