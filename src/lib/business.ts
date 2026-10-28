import { z } from "zod";
import type { Company, Offer, RFQ } from "@/types";
export type Filters = {
  query: string;
  country: string;
  activity: string;
  species: string;
  service: string;
  certification: string;
};
export const emptyFilters: Filters = {
  query: "",
  country: "",
  activity: "",
  species: "",
  service: "",
  certification: "",
};
export function filterCompanies(companies: Company[], f: Filters) {
  return companies.filter(
    (c) =>
      (!f.query ||
        [
          c.name,
          c.city,
          c.country,
          c.description,
          ...c.activities,
          ...c.species,
          ...c.capabilities,
          ...c.certifications,
          ...c.buys,
          ...c.sells,
        ]
          .join(" ")
          .toLowerCase()
          .includes(f.query.toLowerCase())) &&
      (!f.country || c.country === f.country) &&
      (!f.activity || c.activities.includes(f.activity)) &&
      (!f.species || c.species.includes(f.species)) &&
      (!f.service || c.capabilities.includes(f.service)) &&
      (!f.certification || c.certifications.includes(f.certification)),
  );
}
export function parseSmartQuery(query: string) {
  const q = query.toLowerCase();
  const countries = [
    "Germany",
    "Netherlands",
    "Denmark",
    "Poland",
    "Estonia",
    "Latvia",
    "Lithuania",
  ].filter((v) => q.includes(v.toLowerCase()));
  const fish = [
    "Atlantic cod",
    "Atlantic salmon",
    "Haddock",
    "Herring",
    "Mackerel",
    "Alaska pollock",
  ].filter((v) => q.includes(v.toLowerCase()));
  if (!fish.length && q.includes("cod")) fish.push("Atlantic cod");
  const services = [
    "Filleting",
    "Freezing",
    "Portioning",
    "Packaging",
    "Smoking",
    "Cold storage",
    "Glazing",
  ].filter((v) => q.includes(v.toLowerCase()));
  const certs = ["MSC", "ASC", "BRCGS", "IFS"].filter((v) =>
    new RegExp(`\\b${v}\\b`, "i").test(query),
  );
  const residue = q
    .replace(
      /germany|netherlands|denmark|poland|estonia|latvia|lithuania|atlantic cod|atlantic salmon|alaska pollock|haddock|herring|mackerel|cod|filleting|freezing|portioning|packaging|smoking|cold storage|glazing|msc|asc|brcgs|ifs|find|companies|company|in|or|and|that|process|offer|services|certified|processors|with|the|\W+/g,
      "",
    )
    .trim();
  return {
    supported:
      !residue &&
      !!(countries.length + fish.length + services.length + certs.length),
    countries,
    fish,
    services,
    certs,
  };
}
export function smartMatches(
  c: Company,
  p: ReturnType<typeof parseSmartQuery>,
) {
  return (
    (!p.countries.length || p.countries.includes(c.country)) &&
    (!p.fish.length || p.fish.some((s) => c.species.includes(s))) &&
    p.services.every((s) => c.capabilities.includes(s)) &&
    p.certs.every((s) => c.certifications.includes(s))
  );
}
export function matchSupplier(c: Company, r: RFQ) {
  const species = c.species.includes(r.species);
  const certs = r.certifications.every((v) => c.certifications.includes(v));
  return {
    score: Number(species) * 2 + Number(certs),
    level:
      species && certs
        ? "Matching requirements"
        : species
          ? "Partial match"
          : "Outside product scope",
    reasons: [
      species ? `${r.species} handled` : `${r.species} not listed`,
      certs
        ? "Required certification claims present"
        : "Some certification claims missing",
      "Delivery, volume and grade require confirmation",
    ],
  };
}
export function comparable(offers: Offer[]) {
  return (
    offers.length > 1 &&
    new Set(offers.map((o) => o.rfqId)).size === 1 &&
    new Set(offers.map((o) => o.unit)).size === 1 &&
    new Set(offers.map((o) => o.currency)).size === 1
  );
}
export const rfqSchema = z
  .object({
    title: z.string().min(5, "Use at least 5 characters"),
    species: z.string().min(1, "Select a species"),
    form: z.string().min(1),
    quantity: z.number().positive("Quantity must be greater than zero"),
    unit: z.enum(["kg", "tonnes"]),
    grading: z.string().min(1, "Specify the size or grade"),
    origin: z.string().min(1),
    condition: z.enum(["Fresh", "Frozen"]),
    certifications: z.array(z.string()),
    packaging: z.string().min(3),
    country: z.string().min(1),
    location: z.string().min(2),
    delivery: z.string().min(1),
    incoterms: z.enum(["DAP", "FCA", "EXW", "CIF"]),
    specifications: z.string(),
    deadline: z.string().min(1),
  })
  .refine((v) => v.deadline <= v.delivery, {
    message: "Deadline must be on or before delivery",
    path: ["deadline"],
  });
export type RFQInput = z.infer<typeof rfqSchema>;
export const STORAGE_KEY = "sealink-demo-v1";
const stringList = z.array(z.string());
const stateSchema = z.object({
  version: z.literal(1),
  rfqs: z.array(
    rfqSchema.safeExtend({
      id: z.string(),
      status: z.enum(["Draft", "Open", "Closed", "Awarded", "Cancelled"]),
      recipients: stringList,
      notes: z.string(),
      activity: stringList,
    }),
  ),
  offers: z.array(
    z.object({
      id: z.string(),
      rfqId: z.string(),
      companyId: z.string(),
      quantity: z.number().positive(),
      unit: z.string(),
      price: z.number().nonnegative(),
      currency: z.enum(["EUR", "USD", "GBP", "DKK", "PLN"]),
      incoterms: z.string(),
      leadDays: z.number().nonnegative(),
      expires: z.string(),
      payment: z.string(),
      notes: z.string(),
      status: z.enum(["Received", "Shortlisted", "Accepted"]),
      certifications: stringList,
    }),
  ),
  saved: stringList,
  viewed: stringList,
  events: stringList,
  organization: z.object({
    name: z.string(),
    city: z.string(),
    country: z.string(),
    description: z.string(),
    activities: z.string(),
    buys: z.string(),
    sells: z.string(),
    species: z.string(),
    capabilities: z.string(),
    certifications: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  messages: z.array(
    z.object({
      id: z.string(),
      companyId: z.string(),
      subject: z.string(),
      entries: z.array(
        z.object({ text: z.string(), own: z.boolean(), time: z.string() }),
      ),
    }),
  ),
  preferences: z.object({
    digest: z.boolean(),
    notifications: z.boolean(),
    compact: z.boolean(),
  }),
});
export function restoreState(raw: string | null): unknown {
  if (!raw) return null;
  try {
    const parsed = stateSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return null;
    const d = parsed.data;
    if (
      d.offers.some(
        (o) =>
          !d.rfqs.some(
            (r) => r.id === o.rfqId && r.recipients.includes(o.companyId),
          ),
      )
    )
      return null;
    return d;
  } catch {
    return null;
  }
}
