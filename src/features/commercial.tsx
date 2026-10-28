"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  ArrowUpRight,
  FileText,
  ArrowRight,
  Check,
  Send,
  Clock,
  CheckCircle2,
  Layers3,
  FlaskConical,
  ChevronRight,
} from "lucide-react";
import { companies, countries, species, certifications } from "@/data/demo";
import {
  matchSupplier,
  rfqSchema,
  comparable,
  type RFQInput,
} from "@/lib/business";
import type { RFQ, Offer } from "@/types";
import { useDemo } from "./store";
import { CompanyAvatar } from "./network";
import { Button } from "@/components/ui/button";
import {
  Badge,
  Empty,
  Field,
  Modal,
  SectionTitle,
} from "@/components/ui/shared";
export const money = (v: number, currency = "EUR") =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(v);
export const number = (v: number) => new Intl.NumberFormat("en-IE").format(v);
export function Status({ value }: { value: string }) {
  return (
    <Badge
      tone={
        ["Open", "Received", "Accepted", "Awarded"].includes(value)
          ? "green"
          : value === "Draft"
            ? "neutral"
            : value === "Shortlisted"
              ? "blue"
              : "amber"
      }
    >
      <span className="tiny-dot" />
      {value}
    </Badge>
  );
}
export function RFQTable({
  items,
  compact = false,
}: {
  items: RFQ[];
  compact?: boolean;
}) {
  const { state } = useDemo();
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>RFQ / Product</th>
            <th>Quantity</th>
            {!compact && <th>Destination</th>}
            <th>Deadline</th>
            <th>Status</th>
            <th>Offers</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id}>
              <td>
                <Link className="table-title" href={`/rfqs/${r.id}`}>
                  {r.title}
                </Link>
                <small>
                  {r.id} · {r.species}
                </small>
              </td>
              <td>
                {number(r.quantity)} <span className="muted">{r.unit}</span>
              </td>
              {!compact && (
                <td>
                  {r.country}
                  <small>{r.recipients.length} suppliers invited</small>
                </td>
              )}
              <td>
                {new Date(`${r.deadline}T12:00:00`).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "short" },
                )}
                <small>2026</small>
              </td>
              <td>
                <Status value={r.status} />
              </td>
              <td>
                <span className="offer-count">
                  {state.offers.filter((o) => o.rfqId === r.id).length}
                </span>
              </td>
              <td>
                <Link aria-label={`Open ${r.title}`} href={`/rfqs/${r.id}`}>
                  <ArrowUpRight size={16} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function RFQList() {
  const { state } = useDemo();
  const [filter, setFilter] = useState("All RFQs");
  const [search, setSearch] = useState("");
  const items = state.rfqs.filter(
    (r) =>
      (filter === "All RFQs" || r.status === filter) &&
      `${r.title} ${r.id} ${r.species}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">FROM REQUIREMENT TO RELATIONSHIP</div>
          <h1>Requests for quotation</h1>
          <p>
            Manage your sourcing needs and keep every supplier response in one
            place.
          </p>
        </div>
        <Button asChild>
          <Link href="/rfqs/new">
            <Plus size={16} />
            Create RFQ
          </Link>
        </Button>
      </div>
      <div className="summary-strip">
        {["Open", "Draft", "Awarded"].map((v) => (
          <div key={v}>
            <span>{v} RFQs</span>
            <strong>{state.rfqs.filter((r) => r.status === v).length}</strong>
          </div>
        ))}
        <div>
          <span>Supplier quotations</span>
          <strong>{state.offers.length}</strong>
        </div>
      </div>
      <div className="panel">
        <div className="list-toolbar">
          <div className="tabs">
            {[
              "All RFQs",
              "Open",
              "Draft",
              "Closed",
              "Awarded",
              "Cancelled",
            ].map((t) => (
              <button
                className={t === filter ? "selected" : ""}
                key={t}
                onClick={() => setFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            aria-label="Search RFQs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search requests..."
          />
        </div>
        {items.length ? (
          <RFQTable items={items} />
        ) : (
          <Empty
            title="No requests here yet"
            description="Create an RFQ or adjust your search."
          />
        )}
      </div>
      <p className="fine-print">
        All requests and supplier responses are simulated. No RFQ is distributed
        externally.
      </p>
    </>
  );
}
export function RFQForm({ existing }: { existing?: RFQ }) {
  const { update, notify } = useDemo();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<RFQInput>({
    resolver: zodResolver(rfqSchema),
    defaultValues: existing || {
      title: "",
      species: "Atlantic cod",
      form: "Fillets",
      quantity: 1000,
      unit: "kg",
      grading: "140–160 g",
      origin: "Northeast Atlantic",
      condition: "Frozen",
      certifications: [],
      packaging: "10 kg cartons",
      country: "Netherlands",
      location: "",
      delivery: "2026-11-23",
      incoterms: "DAP",
      specifications: "",
      deadline: "2026-11-09",
    },
  });
  useEffect(() => {
    if (existing) return;
    const value = new URLSearchParams(window.location.search).get("species");
    if (value && species.includes(value)) setValue("species", value);
  }, [existing, setValue]);
  const selected = useWatch({ control, name: "certifications" });
  const field = (key: keyof RFQInput, label: string, type = "text") => (
    <Field label={label}>
      {
        <input
          type={type}
          {...register(key, { valueAsNumber: key === "quantity" })}
          aria-invalid={!!errors[key]}
        />
      }
      {errors[key] && <small className="error">{errors[key]?.message}</small>}
    </Field>
  );
  const submit = handleSubmit((data) => {
    setSaving(true);
    const params = new URLSearchParams(window.location.search);
    const supplier = params.get("supplier");
    const id = existing?.id || `SL-2026-${crypto.randomUUID().slice(0, 8)}`;
    const r: RFQ = {
      ...data,
      id,
      status: "Draft",
      recipients:
        existing?.recipients ||
        (supplier && companies.some((c) => c.id === supplier)
          ? [supplier]
          : []),
      notes: existing?.notes || "",
      activity: [
        ...(existing?.activity || []),
        existing
          ? "Draft requirements updated"
          : "RFQ created in demonstration workspace",
      ],
    };
    update((s) => ({
      ...s,
      rfqs: existing
        ? s.rfqs.map((v) => (v.id === id ? r : v))
        : [r, ...s.rfqs],
      events: [
        ...s.events,
        `${existing ? "Updated" : "Created"} ${id}: ${data.title}`,
      ],
    }));
    notify("RFQ draft saved. Choose suppliers to continue.");
    router.push(`/rfqs/${id}`);
  });
  return (
    <>
      <Link
        href={existing ? `/rfqs/${existing.id}` : "/rfqs"}
        className="back-link"
      >
        ← Back to RFQs
      </Link>
      <div className="page-heading">
        <div>
          <div className="eyebrow">STRUCTURED SOURCING</div>
          <h1>{existing ? "Edit request" : "Create a new RFQ"}</h1>
          <p>
            A clear specification helps the right suppliers respond with
            confidence.
          </p>
        </div>
        <Badge tone="blue">Demo · Local draft</Badge>
      </div>
      <div className="stepper">
        <span className="current">
          <i>1</i>Define requirements
        </span>
        <ChevronRight size={16} />
        <span>
          <i>2</i>Select suppliers
        </span>
        <ChevronRight size={16} />
        <span>
          <i>3</i>Simulate distribution
        </span>
      </div>
      <form onSubmit={submit} className="rfq-form">
        <div className="stack">
          <section className="panel padded">
            <SectionTitle
              title="Product requirements"
              subtitle="What would you like to source?"
            />
            {field("title", "RFQ title *")}
            <div className="form-grid">
              <Field label="Seafood species *">
                <select {...register("species")}>
                  {species.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
              <Field label="Product form *">
                <select {...register("form")}>
                  {[
                    "Fillets",
                    "Loins",
                    "Portions",
                    "Whole round",
                    "Blocks",
                    "Bulk packs",
                  ].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
              {field("quantity", "Quantity *", "number")}
              <Field label="Unit *">
                <select {...register("unit")}>
                  <option>kg</option>
                  <option>tonnes</option>
                </select>
              </Field>
              {field("grading", "Size grading *")}
              {field("origin", "Product origin *")}
              <Field label="Product condition *">
                <select {...register("condition")}>
                  <option>Frozen</option>
                  <option>Fresh</option>
                </select>
              </Field>
            </div>
            <label className="field">
              <span>Required certification claims</span>
              <div className="checkbox-row">
                {certifications.map((v) => (
                  <label key={v}>
                    <input
                      type="checkbox"
                      checked={selected.includes(v)}
                      onChange={(e) =>
                        setValue(
                          "certifications",
                          e.target.checked
                            ? [...selected, v]
                            : selected.filter((c) => c !== v),
                        )
                      }
                    />
                    {v}
                  </label>
                ))}
              </div>
            </label>
            {field("packaging", "Packaging requirements *")}
          </section>
          <section className="panel padded">
            <SectionTitle title="Delivery & commercial terms" />
            <div className="form-grid">
              <Field label="Delivery country *">
                <select {...register("country")}>
                  {countries.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
              {field("location", "Delivery location *")}
              {field("delivery", "Delivery date *", "date")}
              <Field label="Incoterms *">
                <select {...register("incoterms")}>
                  {["DAP", "FCA", "EXW", "CIF"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
              {field("deadline", "Quotation deadline *", "date")}
            </div>
            <Field label="Additional specifications">
              <textarea
                rows={4}
                {...register("specifications")}
                placeholder="Quality, traceability, tolerances or documentation requirements..."
              />
            </Field>
          </section>
          <div className="form-footer">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button disabled={saving} type="submit">
              {saving ? "Saving…" : "Save & select suppliers"}
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
        <aside>
          <div className="panel padded sticky-card">
            <FileText size={27} />
            <h3>
              Better specifications.
              <br />
              Better conversations.
            </h3>
            <p>
              Include the details a seafood supplier needs to assess product
              fit, production and delivery.
            </p>
            <ul className="check-list">
              <li>
                <Check size={15} />
                Species and product form
              </li>
              <li>
                <Check size={15} />
                Volume and size grading
              </li>
              <li>
                <Check size={15} />
                Certification requirements
              </li>
              <li>
                <Check size={15} />
                Delivery and commercial terms
              </li>
            </ul>
            <div className="notice">
              Your RFQ is saved only in this browser. Use fictional information.
              Nothing is sent externally.
            </div>
          </div>
        </aside>
      </form>
    </>
  );
}
export function RFQDetail({ id }: { id: string }) {
  const { state, update, notify } = useDemo();
  const r = state.rfqs.find((v) => v.id === id);
  const [tab, setTab] = useState("Overview");
  const [confirm, setConfirm] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const router = useRouter();
  if (!r)
    return (
      <Empty
        title="RFQ not found"
        description="This request may have been removed by a demo reset."
      />
    );
  const offers = state.offers.filter((o) => o.rfqId === id);
  const patch = (changes: Partial<RFQ>, event: string) => {
    update((s) => ({
      ...s,
      rfqs: s.rfqs.map((v) =>
        v.id === id
          ? { ...v, ...changes, activity: [...v.activity, event] }
          : v,
      ),
      events: [...s.events, `${id}: ${event}`],
    }));
    notify(event);
  };
  const simulate = () => {
    const cid = r.recipients.find(
      (c) => !offers.some((o) => o.companyId === c),
    );
    if (!cid) {
      notify("Every selected supplier already has a simulated quotation.");
      return;
    }
    const supplierIndex = companies.findIndex((c) => c.id === cid);
    const unitPrice = Number((6.05 + (supplierIndex % 7) * 0.17).toFixed(2));
    const o: Offer = {
      id: `offer-${crypto.randomUUID()}`,
      rfqId: r.id,
      companyId: cid,
      quantity: r.quantity,
      unit: r.unit,
      price: r.unit === "tonnes" ? unitPrice * 1000 : unitPrice,
      currency: "EUR",
      incoterms: supplierIndex % 2 ? "FCA" : r.incoterms,
      leadDays: 8 + (supplierIndex % 4) * 3,
      expires: "2026-11-30",
      payment:
        supplierIndex % 2
          ? "30% deposit, balance before dispatch"
          : "30 days from invoice",
      notes: `Illustrative ${r.form.toLowerCase()} quotation. ${r.grading}; ${r.condition.toLowerCase()}. Subject to final agreement.`,
      status: "Received",
      certifications: companies.find((c) => c.id === cid)!.certifications,
    };
    update((s) => ({
      ...s,
      offers: [o, ...s.offers],
      rfqs: s.rfqs.map((v) =>
        v.id === id
          ? { ...v, activity: [...v.activity, "Simulated quotation received"] }
          : v,
      ),
      events: [...s.events, `Simulated quotation received for ${id}`],
    }));
    notify("Fictional quotation received. No supplier was contacted.");
  };
  return (
    <>
      <Link href="/rfqs" className="back-link">
        ← Back to requests
      </Link>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            {r.id} <span> / </span> REQUEST FOR QUOTATION
          </div>
          <h1>{r.title}</h1>
          <p>
            {number(r.quantity)} {r.unit} · {r.species} · Delivery to{" "}
            {r.country}
          </p>
        </div>
        <div className="heading-actions">
          <Status value={r.status} />
          {r.status === "Draft" && (
            <Button
              variant="outline"
              onClick={() => router.push(`/rfqs/${id}/edit`)}
            >
              Edit requirements
            </Button>
          )}
          {r.status === "Open" && (
            <Button variant="outline" onClick={simulate}>
              <FlaskConical size={15} />
              Simulate quotation
            </Button>
          )}
        </div>
      </div>
      <div className="tabs page-tabs">
        {["Overview", "Suppliers", "Quotations", "Activity"].map((t) => (
          <button
            className={t === tab ? "selected" : ""}
            onClick={() => setTab(t)}
            key={t}
          >
            {t}
            {t === "Quotations" && <span>{offers.length}</span>}
          </button>
        ))}
      </div>
      {tab === "Overview" && (
        <div className="profile-grid">
          <div className="stack">
            <section className="panel padded">
              <SectionTitle title="Product specification" />
              <div className="detail-grid">
                {[
                  ["Species", r.species],
                  ["Product form", r.form],
                  ["Quantity", `${number(r.quantity)} ${r.unit}`],
                  ["Size grading", r.grading],
                  ["Origin", r.origin],
                  ["Condition", r.condition],
                  ["Packaging", r.packaging],
                  [
                    "Required certifications",
                    r.certifications.join(", ") || "None specified",
                  ],
                ].map(([k, v]) => (
                  <div key={k}>
                    <small>{k}</small>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
              <hr />
              <small>Additional specifications</small>
              <p>{r.specifications || "No additional specifications."}</p>
            </section>
            <section className="panel padded">
              <SectionTitle title="Delivery & terms" />
              <div className="detail-grid">
                {[
                  ["Destination", `${r.location}, ${r.country}`],
                  ["Delivery date", r.delivery],
                  ["Incoterms", r.incoterms],
                  ["Quotation deadline", r.deadline],
                ].map(([k, v]) => (
                  <div key={k}>
                    <small>{k}</small>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
            </section>
            <section className="panel padded">
              <SectionTitle
                title="Commercial notes"
                subtitle="Local demonstration notes only."
              />
              <textarea
                aria-label="Commercial notes"
                value={note ?? r.notes}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  patch({ notes: note ?? r.notes }, "Commercial notes saved")
                }
              >
                Save notes
              </Button>
            </section>
          </div>
          <aside className="stack">
            <section className="panel padded">
              <SectionTitle title="Sourcing progress" />
              <div className="stat-line">
                <span>Selected suppliers</span>
                <strong>{r.recipients.length}</strong>
              </div>
              <div className="stat-line">
                <span>Quotations received</span>
                <strong>{offers.length}</strong>
              </div>
              {r.status === "Draft" ? (
                <>
                  <p>
                    Review product fit and select recipients before simulating
                    distribution.
                  </p>
                  <Button
                    className="full-width"
                    onClick={() => setTab("Suppliers")}
                  >
                    Select suppliers
                    <ArrowRight size={15} />
                  </Button>
                </>
              ) : (
                <Button
                  className="full-width"
                  variant="outline"
                  onClick={() => setTab("Quotations")}
                >
                  Review quotations
                  <ArrowRight size={15} />
                </Button>
              )}
            </section>
            {r.status === "Open" && (
              <section className="panel padded">
                <h3>Manage request</h3>
                <p>Close sourcing when you have enough responses.</p>
                <Button variant="outline" onClick={() => setConfirm("Closed")}>
                  Close RFQ
                </Button>
                <Button variant="ghost" onClick={() => setConfirm("Cancelled")}>
                  Cancel request
                </Button>
              </section>
            )}
            <div className="notice">
              <FlaskConical size={19} />
              <p>
                Simulated commercial request. No external distribution takes
                place.
              </p>
            </div>
          </aside>
        </div>
      )}
      {tab === "Suppliers" && (
        <>
          <div className="section-title">
            <div>
              <h2>Find the right product fit</h2>
              <p>
                Matching uses species and certification claims. Volume, grade
                and delivery remain unknown.
              </p>
            </div>
            {r.status === "Draft" && (
              <Button
                disabled={!r.recipients.length}
                onClick={() => setConfirm("Open")}
              >
                <Send size={15} />
                Simulate distribution ({r.recipients.length})
              </Button>
            )}
          </div>
          <div className="supplier-list">
            {[...companies]
              .sort(
                (a, b) => matchSupplier(b, r).score - matchSupplier(a, r).score,
              )
              .map((c) => {
                const match = matchSupplier(c, r);
                const checked = r.recipients.includes(c.id);
                return (
                  <article
                    className={`panel supplier-row ${checked ? "supplier-selected" : ""}`}
                    key={c.id}
                  >
                    {r.status === "Draft" && (
                      <input
                        aria-label={`Select ${c.name}`}
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          patch(
                            {
                              recipients: checked
                                ? r.recipients.filter((v) => v !== c.id)
                                : [...r.recipients, c.id],
                            },
                            "Supplier selection updated",
                          )
                        }
                      />
                    )}
                    <CompanyAvatar company={c} />
                    <div className="supplier-info">
                      <Link href={`/companies/${c.id}`}>
                        <strong>{c.name}</strong>
                        <ArrowUpRight size={13} />
                      </Link>
                      <small>
                        {c.city}, {c.country}
                      </small>
                      <div className="tags">
                        <Badge
                          tone={
                            match.score === 3
                              ? "green"
                              : match.score >= 2
                                ? "amber"
                                : "neutral"
                          }
                        >
                          {match.level}
                        </Badge>
                        {checked && (
                          <Badge tone="blue">Selected recipient</Badge>
                        )}
                      </div>
                    </div>
                    <ul>
                      {match.reasons.map((reason, i) => (
                        <li key={reason}>
                          {i === 2 ? <Clock size={12} /> : <Check size={12} />}
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
          </div>
        </>
      )}
      {tab === "Quotations" && (
        <section className="panel">
          <div className="padded">
            <SectionTitle
              title={`${offers.length} supplier quotations`}
              action={
                <Button
                  variant="outline"
                  disabled={offers.length < 2}
                  onClick={() => router.push(`/offers?rfq=${id}&compare=1`)}
                >
                  <Layers3 size={15} />
                  Compare offers
                </Button>
              }
            />
          </div>
          {offers.length ? (
            <OfferTable offers={offers} />
          ) : (
            <Empty
              title="Your next offer starts here"
              description={
                r.status === "Draft"
                  ? "Select suppliers and simulate distribution to open this request."
                  : "Simulate a supplier response to explore quotation management."
              }
            >
              {r.status === "Open" && (
                <Button onClick={simulate}>
                  <FlaskConical size={15} />
                  Simulate quotation
                </Button>
              )}
            </Empty>
          )}
        </section>
      )}
      {tab === "Activity" && (
        <section className="panel padded">
          <SectionTitle title="Request activity" />
          <div className="timeline">
            {r.activity.map((a, i) => (
              <div key={i}>
                <CheckCircle2 size={18} />
                <div>
                  <strong>{a}</strong>
                  <small>Demonstration event {i + 1}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {confirm && (
        <Modal
          title={
            confirm === "Open"
              ? "Simulate RFQ distribution"
              : `${confirm === "Closed" ? "Close" : "Cancel"} this RFQ?`
          }
          onClose={() => setConfirm("")}
        >
          <div className="modal-body">
            <p>
              {confirm === "Open"
                ? `Simulate distribution to ${r.recipients.length} selected suppliers. Nothing will be emailed or sent externally.`
                : "This updates the local demonstration status. Existing quotations remain available."}
            </p>
            <div className="dialog-actions">
              <Button variant="outline" onClick={() => setConfirm("")}>
                Go back
              </Button>
              <Button
                onClick={() => {
                  patch(
                    { status: confirm as RFQ["status"] },
                    confirm === "Open"
                      ? "Distribution simulated to selected suppliers"
                      : `RFQ ${confirm.toLowerCase()}`,
                  );
                  setConfirm("");
                  setTab("Overview");
                }}
              >
                Confirm{" "}
                {confirm === "Open" ? "simulation" : confirm.toLowerCase()}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
export function OfferTable({
  offers,
  onSelect,
  selected = [],
}: {
  offers: Offer[];
  onSelect?: (id: string) => void;
  selected?: string[];
}) {
  const { state } = useDemo();
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {onSelect && <th />}
            <th>Supplier / RFQ</th>
            <th>Quantity</th>
            <th>Unit price</th>
            <th>Delivery</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {offers.map((o) => {
            const c = companies.find((c) => c.id === o.companyId)!;
            const r = state.rfqs.find((r) => r.id === o.rfqId)!;
            return (
              <tr key={o.id}>
                {onSelect && (
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Compare ${c.name} for ${r.title}`}
                      checked={selected.includes(o.id)}
                      onChange={() => onSelect(o.id)}
                    />
                  </td>
                )}
                <td>
                  <Link className="table-title" href={`/offers/${o.id}`}>
                    {c.name}
                  </Link>
                  <Link className="table-sub-link" href={`/rfqs/${r.id}`}>
                    {r.title}
                  </Link>
                </td>
                <td>
                  {number(o.quantity)} {o.unit}
                </td>
                <td>
                  <strong>{money(o.price, o.currency)}</strong>
                  <small>per {o.unit}</small>
                </td>
                <td>
                  {o.incoterms}
                  <small>{o.leadDays} days lead time</small>
                </td>
                <td>
                  <Status value={o.status} />
                </td>
                <td>
                  <Link
                    aria-label={`Open ${c.name} quotation`}
                    href={`/offers/${o.id}`}
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export function Offers() {
  const { state, notify } = useDemo();
  const [rfq, setRfq] = useState(() =>
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("rfq") || ""
      : "",
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [compare, setCompare] = useState(false);
  const offers = state.offers.filter((o) => !rfq || o.rfqId === rfq);
  const chosen = state.offers.filter((o) => selected.includes(o.id));
  function toggle(id: string) {
    const o = state.offers.find((v) => v.id === id)!;
    if (selected.includes(id)) {
      setSelected(selected.filter((v) => v !== id));
      return;
    }
    if (chosen.length && chosen[0].rfqId !== o.rfqId) {
      notify("Select quotations belonging to the same RFQ.");
      return;
    }
    setSelected([...selected, id]);
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">CLARITY IN EVERY COMMERCIAL DECISION</div>
          <h1>Supplier quotations</h1>
          <p>
            Explore responses, understand the differences and compare like for
            like.
          </p>
        </div>
        <Button disabled={selected.length < 2} onClick={() => setCompare(true)}>
          <Layers3 size={16} />
          Compare selected ({selected.length})
        </Button>
      </div>
      <div className="notice inline-notice">
        <FlaskConical size={18} />
        <span>
          All offers are fictional. Prices and terms are illustrative, not
          market guidance.
        </span>
      </div>
      <section className="panel">
        <div className="list-toolbar">
          <strong>{offers.length} quotations</strong>
          <label className="inline-label">
            Related RFQ
            <select
              aria-label="Filter offers by RFQ"
              value={rfq}
              onChange={(e) => {
                setRfq(e.target.value);
                setSelected([]);
              }}
            >
              <option value="">All requests</option>
              {state.rfqs.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        {offers.length ? (
          <OfferTable offers={offers} selected={selected} onSelect={toggle} />
        ) : (
          <Empty
            title="No quotations for this request"
            description="Open the RFQ to simulate a supplier response."
          />
        )}
      </section>
      <p className="fine-print">
        Select two or more quotations from the same RFQ. Different currencies or
        units are displayed without a price ranking.
      </p>
      {compare && (
        <Modal
          title="Compare supplier quotations"
          onClose={() => setCompare(false)}
        >
          <div className="modal-body comparison">
            <p>{state.rfqs.find((r) => r.id === chosen[0]?.rfqId)?.title}</p>
            {!comparable(chosen) && (
              <div className="notice">
                Units or currencies differ. These prices cannot be ranked
                directly.
              </div>
            )}
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Commercial terms</th>
                    {chosen.map((o) => (
                      <th key={o.id}>
                        {companies.find((c) => c.id === o.companyId)!.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    "Unit price",
                    "Quantity",
                    "Delivery terms",
                    "Lead time",
                    "Certification claims",
                    "Product specification",
                    "Payment",
                    "Offer expiry",
                  ].map((label, i) => (
                    <tr key={label}>
                      <th>{label}</th>
                      {chosen.map((o) => {
                        const r = state.rfqs.find((r) => r.id === o.rfqId)!;
                        const values = [
                          `${money(o.price, o.currency)} / ${o.unit}`,
                          `${number(o.quantity)} ${o.unit}`,
                          o.incoterms,
                          `${o.leadDays} days`,
                          o.certifications.join(", "),
                          `${r.form} · ${r.grading} · ${r.condition}`,
                          o.payment,
                          o.expires,
                        ];
                        const differs =
                          new Set(
                            chosen.map((v) =>
                              i === 0
                                ? v.price
                                : i === 2
                                  ? v.incoterms
                                  : i === 3
                                    ? v.leadDays
                                    : i === 4
                                      ? v.certifications.join(",")
                                      : i === 6
                                        ? v.payment
                                        : "",
                            ),
                          ).size > 1;
                        return (
                          <td
                            key={o.id}
                            className={differs ? "comparison-difference" : ""}
                          >
                            {values[i]}
                            {i === 0 &&
                              comparable(chosen) &&
                              o.price ===
                                Math.min(...chosen.map((v) => v.price)) && (
                                <Badge tone="green">Lowest unit price</Badge>
                              )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="notice">
              Highlighted cells show differences. Unit prices exclude
              unconfirmed landed costs;{" "}
              {chosen.some((o) => o.incoterms !== chosen[0].incoterms)
                ? "Incoterms differ, so transport obligations must be reviewed."
                : "confirm transport, duties and final specifications before a decision."}{" "}
              Certification claims are unverified.
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
export function OfferDetail({ id }: { id: string }) {
  const { state, update, notify } = useDemo();
  const [award, setAward] = useState(false);
  const o = state.offers.find((v) => v.id === id);
  if (!o)
    return (
      <Empty
        title="Quotation not found"
        description="Choose a quotation from the offers list."
      />
    );
  const c = companies.find((v) => v.id === o.companyId)!;
  const r = state.rfqs.find((v) => v.id === o.rfqId)!;
  return (
    <>
      <Link href="/offers" className="back-link">
        ← Back to quotations
      </Link>
      <div className="page-heading">
        <div>
          <div className="eyebrow">SIMULATED SUPPLIER RESPONSE</div>
          <h1>Quotation from {c.name}</h1>
          <p>
            {r.title} · {r.id}
          </p>
        </div>
        <Status value={o.status} />
      </div>
      <div className="profile-grid">
        <div className="stack">
          <section className="panel padded">
            <SectionTitle title="Commercial offer" />
            <div className="offer-price">
              {money(o.price, o.currency)}
              <span> / {o.unit}</span>
              <Badge tone="blue">Illustrative price</Badge>
            </div>
            <div className="detail-grid">
              {[
                ["Quantity", `${number(o.quantity)} ${o.unit}`],
                ["Delivery terms", o.incoterms],
                ["Lead time", `${o.leadDays} days`],
                ["Valid until", o.expires],
                ["Payment terms", o.payment],
                [
                  "Product specification",
                  `${r.species} · ${r.form} · ${r.condition} · ${r.grading}`,
                ],
                ["Certification claims", o.certifications.join(", ")],
              ].map(([k, v]) => (
                <div key={k}>
                  <small>{k}</small>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>
            <hr />
            <small>Supplier notes</small>
            <p>{o.notes}</p>
          </section>
          <div className="notice">
            No real supplier issued this quotation. Acceptance is a local
            simulation, with no contract or transaction.
          </div>
        </div>
        <aside className="stack">
          <section className="panel padded">
            <CompanyAvatar company={c} />
            <h3>{c.name}</h3>
            <p>
              {c.city}, {c.country}
            </p>
            <Button variant="outline" asChild>
              <Link href={`/companies/${c.id}`}>
                View company
                <ArrowUpRight size={14} />
              </Link>
            </Button>
          </section>
          <section className="panel padded">
            <h3>Related request</h3>
            <Link className="text-link" href={`/rfqs/${r.id}`}>
              {r.title}
              <ArrowRight size={15} />
            </Link>
            <hr />
            <div className="stack">
              <Button
                variant="outline"
                onClick={() => {
                  update((s) => ({
                    ...s,
                    offers: s.offers.map((v) =>
                      v.id === id
                        ? {
                            ...v,
                            status:
                              v.status === "Shortlisted"
                                ? "Received"
                                : "Shortlisted",
                          }
                        : v,
                    ),
                  }));
                  notify("Quotation shortlist updated.");
                }}
                disabled={o.status === "Accepted"}
              >
                {" "}
                {o.status === "Shortlisted"
                  ? "Remove from shortlist"
                  : "Shortlist quotation"}
              </Button>
              <Button
                onClick={() => setAward(true)}
                disabled={r.status !== "Open" || o.status === "Accepted"}
              >
                Simulate award
                <Check size={15} />
              </Button>
            </div>
          </section>
        </aside>
      </div>
      {award && (
        <Modal
          title="Simulate awarding this RFQ?"
          onClose={() => setAward(false)}
        >
          <div className="modal-body">
            <p>
              This marks the request as awarded and this quotation as accepted
              in the demonstration. No supplier is notified and no contract is
              created.
            </p>
            <Button
              onClick={() => {
                update((s) => ({
                  ...s,
                  offers: s.offers.map((v) =>
                    v.id === id ? { ...v, status: "Accepted" } : v,
                  ),
                  rfqs: s.rfqs.map((v) =>
                    v.id === r.id
                      ? {
                          ...v,
                          status: "Awarded",
                          activity: [
                            ...v.activity,
                            `Award simulated to ${c.name}`,
                          ],
                        }
                      : v,
                  ),
                  events: [...s.events, `Award simulated for ${r.id}`],
                }));
                notify("Award simulated. No transaction occurred.");
                setAward(false);
              }}
            >
              Confirm simulated award
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
