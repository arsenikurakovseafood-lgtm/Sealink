import { test } from "node:test";
import assert from "node:assert/strict";
import { companies, createDemoState, capacities } from "../data/demo";
import {
  emptyFilters,
  filterCompanies,
  parseSmartQuery,
  smartMatches,
  matchSupplier,
  rfqSchema,
  comparable,
  restoreState,
} from "./business";
test("combined industrial filters only return actual matching companies", () => {
  const result = filterCompanies(companies, {
    ...emptyFilters,
    country: "Netherlands",
    species: "Atlantic cod",
    service: "Freezing",
    certification: "MSC",
  });
  assert.equal(result.length, 2);
  assert.deepEqual(
    result.map((c) => c.id),
    ["co-1", "co-8"],
  );
  assert.equal(
    filterCompanies(companies, {
      ...emptyFilters,
      country: "Latvia",
      species: "Atlantic salmon",
    }).length,
    0,
  );
});
test("search includes products and business capabilities", () => {
  assert.ok(
    filterCompanies(companies, { ...emptyFilters, query: "whole round" })
      .length,
  );
  assert.equal(
    filterCompanies(companies, { ...emptyFilters, query: "nonexistent firm" })
      .length,
    0,
  );
});
test("supported smart search combines OR countries and AND capabilities", () => {
  const p = parseSmartQuery(
    "Find companies in Germany or the Netherlands that process Atlantic cod and offer freezing services.",
  );
  assert.equal(p.supported, true);
  const result = companies.filter((c) => smartMatches(c, p));
  assert.deepEqual(
    result.map((c) => c.id),
    ["co-1", "co-4", "co-8", "co-17"],
  );
  assert.equal(
    parseSmartQuery("Find the cheapest reliable supplier near my factory")
      .supported,
    false,
  );
});
test("supplier fit distinguishes known requirements and unknown delivery", () => {
  const r = createDemoState().rfqs[0];
  assert.equal(matchSupplier(companies[0], r).level, "Matching requirements");
  assert.equal(matchSupplier(companies[5], r).level, "Partial match");
  assert.equal(matchSupplier(companies[4], r).level, "Outside product scope");
  assert.match(
    matchSupplier(companies[0], r).reasons[2],
    /require confirmation/,
  );
});
test("RFQ validation rejects invalid quantity and deadline chronology", () => {
  const r = createDemoState().rfqs[0];
  assert.ok(rfqSchema.safeParse(r).success);
  assert.equal(rfqSchema.safeParse({ ...r, quantity: 0 }).success, false);
  assert.equal(
    rfqSchema.safeParse({ ...r, deadline: "2027-01-01" }).success,
    false,
  );
  assert.equal(
    rfqSchema.safeParse({ ...r, title: "x", location: "" }).success,
    false,
  );
});
test("quotation comparison requires same RFQ, unit and currency", () => {
  const offers = createDemoState().offers;
  assert.ok(comparable(offers.slice(0, 2)));
  assert.equal(
    comparable([offers[0], { ...offers[1], currency: "USD" }]),
    false,
  );
  assert.equal(
    comparable([offers[0], { ...offers[1], unit: "tonnes" }]),
    false,
  );
  assert.equal(comparable([offers[0], offers[3]]), false);
});
test("all demo relationships resolve and suppliers handle their RFQ species", () => {
  const d = createDemoState();
  for (const o of d.offers) {
    const r = d.rfqs.find((r) => r.id === o.rfqId);
    assert.ok(r);
    assert.ok(r.recipients.includes(o.companyId));
    assert.ok(
      companies.find((c) => c.id === o.companyId)?.species.includes(r.species),
    );
  }
  for (const c of capacities)
    assert.ok(
      companies
        .find((co) => co.id === c.companyId)
        ?.capabilities.includes(c.service),
    );
});
test("persisted state round-trips edits and rejects corrupt versions", () => {
  const d = createDemoState();
  d.organization.name = "Demo edited organization";
  d.saved.push("co-4");
  assert.deepEqual(restoreState(JSON.stringify(d)), d);
  assert.equal(restoreState("{broken"), null);
  assert.equal(restoreState(JSON.stringify({ ...d, version: 2 })), null);
  assert.equal(restoreState(null), null);
});
test("reset factory produces independent pristine records", () => {
  const a = createDemoState();
  a.rfqs[0].title = "changed";
  a.saved.length = 0;
  assert.notEqual(createDemoState().rfqs[0].title, "changed");
  assert.equal(createDemoState().saved.length, 3);
});

test("capacity exchange includes every promised service category", () => {
  for (const service of [
    "Filleting",
    "Freezing",
    "Portioning",
    "Packaging",
    "Cold storage",
  ])
    assert.ok(
      capacities.some((c) => c.service === service),
      service,
    );
});

test("storage restoration rejects malformed nested records and broken relationships", () => {
  const d = createDemoState();
  assert.equal(
    restoreState(JSON.stringify({ ...d, rfqs: [{ id: "broken" }] })),
    null,
  );
  assert.equal(
    restoreState(
      JSON.stringify({ ...d, offers: [{ ...d.offers[0], rfqId: "missing" }] }),
    ),
    null,
  );
  assert.equal(
    restoreState(
      JSON.stringify({ ...d, organization: { name: "Incomplete" } }),
    ),
    null,
  );
});
