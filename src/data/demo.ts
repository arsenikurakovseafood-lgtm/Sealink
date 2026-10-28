import type { Company, Capacity, DemoState, RFQ, Offer } from "@/types";
const records: [
  string,
  string,
  string,
  string[],
  string[],
  string[],
  string[],
][] = [
  [
    "Nordhaven Seafood",
    "Rotterdam",
    "Netherlands",
    ["Processor", "Exporter"],
    ["Atlantic cod", "Haddock"],
    ["Filleting", "Freezing", "Packaging"],
    ["MSC", "BRCGS"],
  ],
  [
    "Baltic Crest Foods",
    "Tallinn",
    "Estonia",
    ["Processor", "Supplier"],
    ["Atlantic cod", "Atlantic salmon"],
    ["Filleting", "Portioning", "Freezing"],
    ["MSC", "ASC", "IFS"],
  ],
  [
    "Fjordline Trading",
    "Aarhus",
    "Denmark",
    ["Trader", "Importer"],
    ["Atlantic salmon", "Atlantic cod"],
    ["Cold storage", "Packaging"],
    ["ASC", "MSC"],
  ],
  [
    "Hanseatic Blue",
    "Hamburg",
    "Germany",
    ["Processor", "Buyer"],
    ["Atlantic cod", "Alaska pollock"],
    ["Filleting", "Freezing", "Glazing"],
    ["MSC", "IFS"],
  ],
  [
    "Vistula Marine",
    "Gdańsk",
    "Poland",
    ["Processor", "Exporter"],
    ["Atlantic salmon", "Herring"],
    ["Smoking", "Portioning", "Packaging"],
    ["ASC", "BRCGS"],
  ],
  [
    "Daugava Coldchain",
    "Riga",
    "Latvia",
    ["Cold storage", "Logistics"],
    ["Atlantic cod", "Herring"],
    ["Cold storage", "Freezing"],
    ["IFS"],
  ],
  [
    "Amber Shoal Seafood",
    "Klaipėda",
    "Lithuania",
    ["Processor", "Supplier"],
    ["Atlantic cod", "Herring"],
    ["Filleting", "Freezing", "Packaging"],
    ["MSC", "IFS"],
  ],
  [
    "Westbank Ocean Foods",
    "IJmuiden",
    "Netherlands",
    ["Processor", "Supplier"],
    ["Atlantic cod", "Haddock"],
    ["Filleting", "Portioning", "Freezing"],
    ["MSC", "BRCGS"],
  ],
  [
    "Skagen Meridian",
    "Skagen",
    "Denmark",
    ["Supplier", "Exporter"],
    ["Herring", "Mackerel"],
    ["Freezing", "Glazing"],
    ["MSC"],
  ],
  [
    "Elbe Select Seafood",
    "Bremen",
    "Germany",
    ["Trader", "Buyer"],
    ["Atlantic salmon", "Atlantic cod"],
    ["Packaging", "Cold storage"],
    ["ASC", "IFS"],
  ],
  [
    "Saare Coast Processing",
    "Kuressaare",
    "Estonia",
    ["Processor", "Exporter"],
    ["Herring", "Atlantic cod"],
    ["Smoking", "Filleting", "Freezing"],
    ["MSC"],
  ],
  [
    "Pomeranian Catch",
    "Szczecin",
    "Poland",
    ["Processor", "Supplier"],
    ["Alaska pollock", "Atlantic cod"],
    ["Portioning", "Freezing", "Glazing"],
    ["MSC", "BRCGS"],
  ],
  [
    "Kurzeme Sea Partners",
    "Liepāja",
    "Latvia",
    ["Trader", "Exporter"],
    ["Herring", "Mackerel"],
    ["Packaging", "Cold storage"],
    ["MSC"],
  ],
  [
    "Nemunas Seafood Works",
    "Kaunas",
    "Lithuania",
    ["Processor", "Buyer"],
    ["Atlantic salmon", "Atlantic cod"],
    ["Filleting", "Portioning", "Packaging"],
    ["ASC", "IFS"],
  ],
  [
    "Zeeland Protein Co.",
    "Vlissingen",
    "Netherlands",
    ["Importer", "Buyer"],
    ["Alaska pollock", "Haddock"],
    ["Cold storage", "Packaging"],
    ["MSC"],
  ],
  [
    "North Sound Logistics",
    "Esbjerg",
    "Denmark",
    ["Logistics", "Cold storage"],
    ["Atlantic salmon", "Atlantic cod"],
    ["Cold storage", "Freezing"],
    ["IFS"],
  ],
  [
    "Oder Ocean Partners",
    "Rostock",
    "Germany",
    ["Processor", "Exporter"],
    ["Atlantic cod", "Haddock"],
    ["Filleting", "Freezing", "Packaging"],
    ["MSC", "BRCGS"],
  ],
  [
    "Pärnu Blue Foods",
    "Pärnu",
    "Estonia",
    ["Processor", "Supplier"],
    ["Atlantic salmon", "Herring"],
    ["Smoking", "Packaging"],
    ["ASC", "IFS"],
  ],
];
export const companies: Company[] = records.map((r, i) => ({
  id: `co-${i + 1}`,
  name: r[0],
  city: r[1],
  country: r[2],
  activities: r[3],
  species: r[4],
  capabilities: r[5],
  certifications: r[6],
  description: `An independent seafood partner based in ${r[2]} specializing in ${r[4].join(" and ").toLowerCase()}. Supporting European foodservice, retail and industrial customers with traceable supply and flexible production.`,
  buys: r[4].map((s) => `${s} whole round`),
  sells: r[4].map(
    (s) => `${s} ${r[5].includes("Filleting") ? "fillets" : "bulk packs"}`,
  ),
  markets: [
    "European Union",
    "United Kingdom",
    ...(i % 3 === 0 ? ["Nordic countries"] : []),
  ],
  completeness: 82 + (i % 5) * 4,
  color: ["blue", "teal", "slate", "ochre"][i % 4],
  technicalCapacity: 20 + i * 3,
}));
export const countries = [...new Set(companies.map((c) => c.country))].sort();
export const species = [...new Set(companies.flatMap((c) => c.species))].sort();
export const capabilities = [
  ...new Set(companies.flatMap((c) => c.capabilities)),
].sort();
export const certifications = ["MSC", "ASC", "BRCGS", "IFS"];
export const activities = [
  ...new Set(companies.flatMap((c) => c.activities)),
].sort();
export const capacities: Capacity[] = Array.from({ length: 10 }, (_, i) => {
  const c = companies[i];
  return {
    id: `cap-${i + 1}`,
    companyId: c.id,
    service: c.capabilities[[0, 2, 1, 1, 1, 0, 2, 0, 0, 1][i]],
    species: c.species,
    amount: 12 + i * 4,
    unit:
      c.capabilities[[0, 2, 1, 1, 1, 0, 2, 0, 0, 1][i]] === "Cold storage"
        ? "pallet spaces"
        : "tonnes / week",
    from: "2026-11-02",
    to: "2026-12-18",
  };
});
const titles = [
  "Frozen Atlantic cod loins",
  "Skin-on salmon portions",
  "MSC cod fillets, IQF",
  "Whole round herring",
  "Haddock fillets for foodservice",
  "Pollock blocks, frozen",
  "Salmon retail portions",
  "Cod portions, skinless",
];
const initialRfqs: RFQ[] = titles.map((title, i) => ({
  id: `SL-${2026}-${String(1042 - i).padStart(4, "0")}`,
  title,
  species: [
    "Atlantic cod",
    "Atlantic salmon",
    "Atlantic cod",
    "Herring",
    "Haddock",
    "Alaska pollock",
    "Atlantic salmon",
    "Atlantic cod",
  ][i],
  form: i % 2 ? "Portions" : "Fillets",
  quantity: [24000, 12000, 18000, 30000, 8000, 22000, 6000, 15000][i],
  unit: "kg",
  grading: "140–160 g",
  origin: "Northeast Atlantic",
  condition: "Frozen",
  certifications: [i % 2 ? "ASC" : "MSC"],
  packaging: "10 kg cartons, food-grade liner",
  country: "Netherlands",
  location: "Rotterdam cold store",
  delivery: "2026-11-23",
  incoterms: "DAP",
  specifications:
    "Skinless, boneless. Full traceability and temperature records required.",
  deadline: `2026-11-${String(5 + i).padStart(2, "0")}`,
  status: (
    [
      "Open",
      "Open",
      "Draft",
      "Open",
      "Closed",
      "Awarded",
      "Open",
      "Cancelled",
    ] as const
  )[i],
  recipients:
    i === 2
      ? []
      : companies
          .filter((c) =>
            c.species.includes(
              [
                "Atlantic cod",
                "Atlantic salmon",
                "Atlantic cod",
                "Herring",
                "Haddock",
                "Alaska pollock",
                "Atlantic salmon",
                "Atlantic cod",
              ][i],
            ),
          )
          .slice(0, 3)
          .map((c) => c.id),
  notes: "",
  activity: [
    "RFQ created in demonstration workspace",
    ...(i === 2 ? [] : ["Distribution simulated to selected suppliers"]),
  ],
}));
const initialOffers: Offer[] = initialRfqs
  .filter((r) => r.status !== "Draft" && r.status !== "Cancelled")
  .flatMap((r, i) =>
    r.recipients.slice(0, i < 3 ? 3 : 2).map((companyId, j) => ({
      id: `offer-${i}-${j}`,
      rfqId: r.id,
      companyId,
      quantity: r.quantity,
      unit: r.unit,
      price: Number((5.8 + i * 0.85 + j * 0.24).toFixed(2)),
      currency: "EUR",
      incoterms: j === 1 ? "FCA" : "DAP",
      leadDays: 7 + j * 3,
      expires: "2026-11-18",
      payment:
        j === 1
          ? "30% deposit, balance before dispatch"
          : "30 days from invoice",
      notes:
        j === 1
          ? "Collection from supplier facility; transport priced separately."
          : "Temperature-controlled transport included. Subject to final specification approval.",
      status: r.status === "Awarded" && j === 0 ? "Accepted" : "Received",
      certifications: companies.find((c) => c.id === companyId)!.certifications,
    })),
  );
export function createDemoState(): DemoState {
  return {
    version: 1,
    rfqs: structuredClone(initialRfqs),
    offers: structuredClone(initialOffers),
    saved: ["co-1", "co-2", "co-8"],
    viewed: ["co-1", "co-4", "co-8"],
    organization: {
      name: "Northwater Seafood",
      city: "Rotterdam",
      country: "Netherlands",
      description:
        "European seafood sourcing and distribution. Connecting responsible supply with long-term commercial partnerships.",
      activities: "Importer, Trader, Buyer",
      buys: "Atlantic cod fillets, Salmon portions",
      sells: "Foodservice seafood packs",
      species: "Atlantic cod, Atlantic salmon, Haddock",
      capabilities: "Cold storage, Packaging",
      certifications: "MSC (self-reported)",
      email: "commercial@northwater.example",
      phone: "+31 10 000 0100",
    },
    messages: [
      {
        id: "msg-1",
        companyId: "co-1",
        subject: "Atlantic cod • November delivery",
        entries: [
          {
            text: "Thank you for the detailed specification. We can offer IQF cod loins in the requested grade. Would delivery in week 48 work for your team?",
            own: false,
            time: "09:42",
          },
          {
            text: "Week 48 works. Please include the temperature records and carton specification with the quotation.",
            own: true,
            time: "10:15",
          },
        ],
      },
      {
        id: "msg-2",
        companyId: "co-2",
        subject: "Processing availability",
        entries: [
          {
            text: "We have illustrative filleting capacity available in November. You can view the listing in Capacity Exchange.",
            own: false,
            time: "Yesterday",
          },
        ],
      },
      {
        id: "msg-3",
        companyId: "co-8",
        subject: "Product specification review",
        entries: [
          {
            text: "Our production team has reviewed your portioning requirements. We would be happy to discuss the preferred cut.",
            own: false,
            time: "Yesterday",
          },
        ],
      },
    ],
    preferences: { digest: true, notifications: true, compact: false },
    events: ["Demo workspace initialized with fictional commercial records"],
  };
}
