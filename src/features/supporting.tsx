"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Factory,
  ArrowUpRight,
  ArrowRight,
  MapPin,
  CalendarDays,
  Send,
  Check,
  Settings2,
  Bell,
  Building2,
  RotateCcw,
  FlaskConical,
  ShieldCheck,
  MessageSquare,
  CheckCheck,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import {
  companies,
  capacities,
  countries,
  species,
  capabilities,
} from "@/data/demo";
import { Button } from "@/components/ui/button";
import {
  Badge,
  Empty,
  Field,
  Modal,
  SectionTitle,
} from "@/components/ui/shared";
import { useDemo } from "./store";
import { CompanyAvatar } from "./network";
import type { Organization } from "@/types";
export function CapacityExchange({ id }: { id?: string }) {
  const [country, setCountry] = useState("");
  const [service, setService] = useState("");
  const [fish, setFish] = useState("");
  const [date, setDate] = useState("");
  const [inquiry, setInquiry] = useState(false);
  const [text, setText] = useState("");
  const { update, notify } = useDemo();
  const router = useRouter();
  const selected = id ? capacities.find((c) => c.id === id) : null;
  const c = selected
    ? companies.find((c) => c.id === selected.companyId)!
    : null;
  const results = capacities.filter((v) => {
    const co = companies.find((c) => c.id === v.companyId)!;
    return (
      (!country || co.country === country) &&
      (!service || v.service === service) &&
      (!fish || v.species.includes(fish)) &&
      (!date || (v.from <= date && v.to >= date))
    );
  });
  const inquiryAction = () => {
    if (!text.trim()) return;
    const co = c!;
    update((s) => ({
      ...s,
      messages: [
        ...s.messages,
        {
          id: `msg-${Date.now()}`,
          companyId: co.id,
          subject: `Demo capacity inquiry: ${selected!.service}`,
          entries: [
            { text: text.trim(), own: true, time: "Just now · Local demo" },
          ],
        },
      ],
      events: [...s.events, `Capacity inquiry simulated to ${co.name}`],
    }));
    notify("Inquiry saved locally. Nothing was sent externally.");
    setInquiry(false);
    setText("");
  };
  return (
    <>
      {selected && (
        <Link href="/capacity" className="back-link">
          ← Back to Capacity Exchange
        </Link>
      )}
      <div className="page-heading">
        <div>
          <div className="eyebrow">MAKE PRODUCTION POSSIBLE</div>
          <h1>
            {selected ? `${selected.service} capacity` : "Capacity Exchange"}
          </h1>
          <p>
            {selected
              ? `${c!.name} · ${c!.city}, ${c!.country}`
              : "Connect production needs with specialist expertise across Europe."}
          </p>
        </div>
        <Badge tone="blue">Fictional availability · Preview</Badge>
      </div>
      {id && !selected ? (
        <Empty
          title="Listing not found"
          description="Explore the capacity directory for available demonstration listings."
        />
      ) : selected ? (
        <div className="profile-grid">
          <div className="stack">
            <section className="panel padded">
              <SectionTitle title="Capacity overview" />
              <div className="capacity-big">
                <Factory size={38} />
                <strong>
                  {selected.amount}
                  <span>{selected.unit}</span>
                </strong>
              </div>
              <div className="detail-grid">
                {[
                  ["Service", selected.service],
                  ["Species", selected.species.join(", ")],
                  ["Available from", selected.from],
                  ["Available until", selected.to],
                  ["Location", `${c!.city}, ${c!.country}`],
                  ["Certification claims", c!.certifications.join(", ")],
                ].map(([k, v]) => (
                  <div key={k}>
                    <small>{k}</small>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
              <hr />
              <p>
                Illustrative available production capacity for a potential
                processing partnership. Product specifications, yields,
                scheduling and commercial terms require confirmation.
              </p>
              <div className="notice">
                Available capacity shown here is separate from the company’s
                technical maximum throughput of {c!.technicalCapacity} tonnes /
                week. All information is fictional and is not real-time
                availability.
              </div>
            </section>
          </div>
          <aside className="stack">
            <section className="panel padded">
              <CompanyAvatar company={c!} />
              <h3>{c!.name}</h3>
              <p>
                {c!.city}, {c!.country}
              </p>
              <Button variant="outline" asChild>
                <Link href={`/companies/${c!.id}`}>
                  View company
                  <ArrowUpRight size={14} />
                </Link>
              </Button>
              <hr />
              <Button onClick={() => setInquiry(true)}>
                <Send size={14} />
                Simulate inquiry
              </Button>
            </section>
            <p className="fine-print">
              Certification claims are illustrative, self-reported and
              independently unverified.
            </p>
          </aside>
        </div>
      ) : (
        <>
          <section className="capacity-banner">
            <div>
              <span className="eyebrow">
                MORE FLEXIBILITY. NEW POSSIBILITIES.
              </span>
              <h2>
                Your next production partner
                <br />
                may already be in the network.
              </h2>
              <p>
                Explore specialist services, from first cut to final cold
                storage.
              </p>
            </div>
            <Factory size={102} strokeWidth={0.8} />
          </section>
          <div className="panel capacity-filters">
            <Field label="Country">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">All countries</option>
                {countries.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </Field>
            <Field label="Service">
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <option value="">All services</option>
                {capabilities.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </Field>
            <Field label="Species">
              <select value={fish} onChange={(e) => setFish(e.target.value)}>
                <option value="">All species</option>
                {species.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </Field>
            <Field label="Available on">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>
            <Button
              variant="ghost"
              onClick={() => {
                setCountry("");
                setService("");
                setFish("");
                setDate("");
              }}
            >
              Reset
            </Button>
          </div>
          <SectionTitle
            title={`${results.length} capacity opportunities`}
            subtitle="Fictional listings · Availability requires confirmation"
          />
          {results.length ? (
            <div className="capacity-grid">
              {results.map((v) => {
                const co = companies.find((c) => c.id === v.companyId)!;
                return (
                  <article className="panel capacity-card" key={v.id}>
                    <div className="capacity-card-top">
                      <span className="capacity-icon">
                        <Factory size={23} />
                      </span>
                      <Badge tone="green">Illustrative availability</Badge>
                    </div>
                    <Link className="company-name" href={`/capacity/${v.id}`}>
                      {v.service}
                      <ArrowUpRight size={16} />
                    </Link>
                    <Link
                      href={`/companies/${co.id}`}
                      className="capacity-company"
                    >
                      {co.name}
                    </Link>
                    <p className="location">
                      <MapPin size={12} />
                      {co.city}, {co.country}
                    </p>
                    <div className="capacity-number">
                      {v.amount}
                      <span>{v.unit}</span>
                    </div>
                    <p className="species-line">{v.species.join(" · ")}</p>
                    <div className="capacity-date">
                      <CalendarDays size={14} />
                      {v.from} — {v.to}
                    </div>
                    <div className="company-card-bottom">
                      <div className="certs">
                        {co.certifications.map((cert) => (
                          <span key={cert}>
                            <ShieldCheck size={12} />
                            {cert}
                          </span>
                        ))}
                      </div>
                      <button
                        className="text-link"
                        onClick={() => router.push(`/capacity/${v.id}`)}
                      >
                        View listing
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <Empty
              title="No capacity matches"
              description="Try a different service, date or country."
            />
          )}
        </>
      )}
      {inquiry && (
        <Modal
          title="Simulate a capacity inquiry"
          onClose={() => setInquiry(false)}
        >
          <form
            className="modal-body"
            onSubmit={(e) => {
              e.preventDefault();
              inquiryAction();
            }}
          >
            <p>
              To {c!.name} · {selected!.service}. This inquiry is saved only as
              a local demo message.
            </p>
            <Field label="Production requirements">
              <textarea
                required
                minLength={10}
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                placeholder="Describe a fictional product, volume and preferred dates..."
              />
            </Field>
            <Button type="submit">
              Save simulated inquiry
              <Send size={15} />
            </Button>
          </form>
        </Modal>
      )}
    </>
  );
}
export function Messages() {
  const { state, update, notify } = useDemo();
  const [selected, setSelected] = useState(state.messages[0]?.id || "");
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const current = state.messages.find((m) => m.id === selected);
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">KEEP THE CONVERSATION CONNECTED</div>
          <h1>Messages</h1>
          <p>Commercial conversations, in context.</p>
        </div>
        <Badge tone="blue">Local-only demonstration</Badge>
      </div>
      <div className="notice inline-notice">
        <MessageSquare size={18} />
        <span>
          These conversations are fictional. Messages you write remain in this
          browser; no external delivery occurs.
        </span>
      </div>
      <div className="messaging panel">
        <aside className="conversation-list">
          <input
            aria-label="Search conversations"
            placeholder="Search conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {state.messages
            .filter((m) =>
              `${m.subject} ${companies.find((c) => c.id === m.companyId)?.name}`
                .toLowerCase()
                .includes(query.toLowerCase()),
            )
            .map((m) => {
              const c = companies.find((c) => c.id === m.companyId)!;
              return (
                <button
                  key={m.id}
                  className={
                    selected === m.id ? "conversation selected" : "conversation"
                  }
                  onClick={() => setSelected(m.id)}
                >
                  <CompanyAvatar company={c} />
                  <div>
                    <strong>{c.name}</strong>
                    <span>{m.subject}</span>
                    <small>{m.entries.at(-1)?.text}</small>
                  </div>
                  <ChevronRight size={13} />
                </button>
              );
            })}
        </aside>
        {current ? (
          <section className="thread">
            <div className="thread-heading">
              <CompanyAvatar
                company={companies.find((c) => c.id === current.companyId)!}
              />
              <div>
                <strong>
                  {companies.find((c) => c.id === current.companyId)!.name}
                </strong>
                <small>{current.subject}</small>
              </div>
              <Link href={`/companies/${current.companyId}`}>
                <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="thread-messages">
              <span className="thread-date">DEMONSTRATION CONVERSATION</span>
              {current.entries.map((entry, i) => (
                <div className={entry.own ? "bubble own" : "bubble"} key={i}>
                  <p>{entry.text}</p>
                  <small>
                    {entry.time}
                    {entry.own && <CheckCheck size={12} />}
                  </small>
                </div>
              ))}
            </div>
            <form
              className="message-compose"
              onSubmit={(e) => {
                e.preventDefault();
                if (!text.trim()) return;
                update((s) => ({
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === selected
                      ? {
                          ...m,
                          entries: [
                            ...m.entries,
                            {
                              text: text.trim(),
                              own: true,
                              time: "Just now · Local demo",
                            },
                          ],
                        }
                      : m,
                  ),
                }));
                setText("");
                notify("Message saved locally. No external delivery.");
              }}
            >
              <textarea
                rows={2}
                aria-label="Write a demo message"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a demonstration message..."
              />
              <div>
                <small>Only fictional information. No external delivery.</small>
                <Button disabled={!text.trim()} type="submit">
                  Save demo message
                  <Send size={14} />
                </Button>
              </div>
            </form>
          </section>
        ) : (
          <Empty
            title="Choose a conversation"
            description="Select a fictional conversation to explore the messaging preview."
          />
        )}
      </div>
    </>
  );
}
export function OrganizationPage() {
  const { state, update, notify } = useDemo();
  const [form, setForm] = useState<Organization>(state.organization);
  const fields: [keyof Organization, string][] = [
    ["name", "Company name"],
    ["country", "Country"],
    ["city", "City"],
    ["email", "Contact email"],
    ["phone", "Contact phone"],
    ["activities", "Business activities"],
    ["buys", "Products bought"],
    ["sells", "Products sold"],
    ["species", "Seafood species"],
    ["capabilities", "Processing capabilities"],
    ["certifications", "Certification claims"],
  ];
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR COMPANY IN THE NETWORK</div>
          <h1>My Organization</h1>
          <p>Keep your commercial profile clear, current and useful.</p>
        </div>
        <Badge tone="blue">Demo organization</Badge>
      </div>
      <form
        className="profile-grid"
        onSubmit={(e) => {
          e.preventDefault();
          update((s) => ({
            ...s,
            organization: form,
            events: [...s.events, "Organization profile updated locally"],
          }));
          notify("Organization profile saved across your demo workspace.");
        }}
      >
        <section className="panel padded">
          <SectionTitle
            title="Organization profile"
            subtitle="Multiple business activities are supported. Separate list values with commas."
          />
          <div className="form-grid">
            {fields.map(([key, label]) => (
              <Field label={label} key={key}>
                <input
                  required={["name", "city", "country"].includes(key)}
                  type={key === "email" ? "email" : "text"}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </Field>
            ))}
          </div>
          <Field label="Company description">
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Field>
          <Button type="submit">
            Save demo profile
            <Check size={15} />
          </Button>
        </section>
        <aside className="stack">
          <section className="panel padded organization-preview">
            <div className="org-big">{form.name.slice(0, 1)}</div>
            <h2>{form.name}</h2>
            <p>
              <MapPin size={14} />
              {form.city}, {form.country}
            </p>
            <div className="tags">
              {form.activities.split(",").map((v, i) => (
                <Badge key={i}>{v.trim()}</Badge>
              ))}
            </div>
            <hr />
            <p>{form.description}</p>
            <Badge tone="green">Local preview</Badge>
          </section>
          <div className="notice">
            Use fictional contact and commercial information. Nothing is
            published externally and certification claims are unverified.
          </div>
        </aside>
      </form>
    </>
  );
}
export function SettingsPage() {
  const { state, update, notify, reset } = useDemo();
  const [section, setSection] = useState("Preferences");
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">MAKE THE WORKSPACE YOURS</div>
          <h1>Settings</h1>
          <p>Manage your preferences and demonstration workspace.</p>
        </div>
      </div>
      <div className="settings-layout">
        <aside className="settings-nav">
          {[
            ["Preferences", Settings2],
            ["Notifications", Bell],
            ["Organization", Building2],
            ["Subscription", CreditCard],
            ["Demo data", FlaskConical],
          ].map(([label, Icon]) => {
            const I = Icon as typeof Settings2;
            return (
              <button
                key={String(label)}
                className={section === label ? "selected" : ""}
                onClick={() => setSection(String(label))}
              >
                <I size={17} />
                {String(label)}
                <ChevronRight size={13} />
              </button>
            );
          })}
        </aside>
        <section className="panel padded">
          {section === "Preferences" && (
            <>
              <SectionTitle
                title="User preferences"
                subtitle="Alex Kuura · Demonstration administrator"
              />
              <div className="setting-row">
                <div>
                  <strong>Compact information density</strong>
                  <p>Reduce table spacing for more information on screen.</p>
                </div>
                <input
                  aria-label="Compact density"
                  type="checkbox"
                  role="switch"
                  checked={state.preferences.compact}
                  onChange={(e) => {
                    update((s) => ({
                      ...s,
                      preferences: {
                        ...s.preferences,
                        compact: e.target.checked,
                      },
                    }));
                    notify("Display preference saved.");
                  }}
                />
              </div>
              <div className="setting-row">
                <div>
                  <strong>Language & region</strong>
                  <p>English · European number and date formats</p>
                </div>
                <Badge>Preview default</Badge>
              </div>
              <div className="notice">
                No production authentication is enabled. Your demonstration
                identity is local to this preview.
              </div>
            </>
          )}
          {section === "Notifications" && (
            <>
              <SectionTitle
                title="Notification preferences"
                subtitle="Preferences are saved locally. No email or push notifications are sent."
              />
              {[
                [
                  "notifications",
                  "Commercial activity",
                  "Keep local activity indicators enabled.",
                ],
                [
                  "digest",
                  "Weekly sourcing digest",
                  "Save your preference for a future email digest.",
                ],
              ].map(([key, label, description]) => (
                <div className="setting-row" key={key}>
                  <div>
                    <strong>{label}</strong>
                    <p>{description}</p>
                  </div>
                  <input
                    type="checkbox"
                    role="switch"
                    aria-label={label}
                    checked={
                      state.preferences[key as "digest" | "notifications"]
                    }
                    onChange={(e) => {
                      update((s) => ({
                        ...s,
                        preferences: {
                          ...s.preferences,
                          [key]: e.target.checked,
                        },
                      }));
                      notify(
                        "Notification preference saved. No external notifications are sent.",
                      );
                    }}
                  />
                </div>
              ))}
            </>
          )}
          {section === "Organization" && (
            <>
              <SectionTitle title="Organization settings" />
              <h3>{state.organization.name}</h3>
              <p>
                {state.organization.city}, {state.organization.country}
              </p>
              <Button asChild variant="outline">
                <Link href="/organization">
                  Edit organization profile
                  <ArrowUpRight size={14} />
                </Link>
              </Button>
              <hr />
              <p>
                Multi-organization switching and team permissions are planned
                for a future milestone.
              </p>
              <Badge>Preview · Single organization</Badge>
            </>
          )}
          {section === "Subscription" && (
            <>
              <SectionTitle
                title="Subscription overview"
                subtitle="Illustrative plan concepts. No billing or validated prices."
              />
              <div className="subscription-grid">
                {["Network", "Professional", "Enterprise"].map((v) => (
                  <div
                    className={
                      v === "Professional"
                        ? "plan-option chosen"
                        : "plan-option"
                    }
                    key={v}
                  >
                    <Badge tone={v === "Professional" ? "blue" : "neutral"}>
                      {v === "Professional"
                        ? "Current preview"
                        : "Plan concept"}
                    </Badge>
                    <h3>{v}</h3>
                    <p>
                      {v === "Network"
                        ? "Company discovery and professional profiles"
                        : v === "Professional"
                          ? "Structured sourcing, quotations and capacity discovery"
                          : "Future team controls and enterprise integrations"}
                    </p>
                    <small>Pricing to be determined</small>
                  </div>
                ))}
              </div>
              <div className="notice">
                No payment details are collected. No subscription is activated
                by this preview.
              </div>
            </>
          )}
          {section === "Demo data" && (
            <>
              <SectionTitle
                title="Demonstration data"
                subtitle="This browser is your local preview workspace."
              />
              <div className="summary-strip">
                <div>
                  <span>Requests</span>
                  <strong>{state.rfqs.length}</strong>
                </div>
                <div>
                  <span>Quotations</span>
                  <strong>{state.offers.length}</strong>
                </div>
                <div>
                  <span>Saved partners</span>
                  <strong>{state.saved.length}</strong>
                </div>
              </div>
              <p>
                Resetting restores the original fictional dataset and removes
                your local requests, inquiries, messages, organization edits and
                preferences.
              </p>
              <Button variant="outline" onClick={() => setConfirm(true)}>
                <RotateCcw size={15} />
                Reset demo data
              </Button>
              <div className="notice">
                Do not enter sensitive commercial information. Local storage is
                not encrypted or access controlled.
              </div>
            </>
          )}
        </section>
      </div>
      {confirm && (
        <Modal
          title="Reset your demonstration workspace?"
          onClose={() => setConfirm(false)}
        >
          <div className="modal-body">
            <p>
              This permanently removes local demo edits and restores the
              original fictional records. This browser only.
            </p>
            <div className="dialog-actions">
              <Button variant="outline" onClick={() => setConfirm(false)}>
                Keep my demo
              </Button>
              <Button
                onClick={() => {
                  reset();
                  setConfirm(false);
                }}
              >
                Reset demo data
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
