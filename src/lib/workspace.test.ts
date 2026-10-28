import { test } from "node:test";
import assert from "node:assert/strict";
import { createDemoState } from "../data/demo";
import { buildInbox, filterInbox } from "./workspace";
const extra = {
  inquiries: [
    {
      id: "local-1",
      origin: "Riga",
      destination: "Rotterdam",
      cargo: "Frozen cod",
    },
  ],
  jobs: [{ id: "j1", title: "Quality manager" }],
  applications: [{ jobId: "j1", name: "Demo applicant", status: "Submitted" }],
};
test("unified inbox derives categories and context from actual records", () => {
  const state = createDemoState();
  const items = buildInbox(state, extra);
  assert.equal(
    items.filter((i) => i.category === "Messages").length,
    state.messages.length,
  );
  assert.equal(
    items.filter((i) => i.category === "Quotations").length,
    state.offers.filter((o) => o.status === "Received").length,
  );
  assert.equal(items.filter((i) => i.category === "Logistics").length, 1);
  assert.equal(
    items.find((i) => i.category === "Workforce")?.title,
    "Quality manager",
  );
  assert.equal(new Set(items.map((i) => i.id)).size, items.length);
  assert.ok(items.every((i) => i.href.startsWith("/app/")));
});
test("inbox filters combine category, search and local read state", () => {
  const items = buildInbox(createDemoState(), extra);
  const logistics = items.find((i) => i.category === "Logistics")!;
  assert.equal(filterInbox(items, "Logistics", "frozen", false, []).length, 1);
  assert.equal(
    filterInbox(items, "Logistics", "frozen", true, [logistics.id]).length,
    0,
  );
  assert.equal(filterInbox(items, "All", "nonexistent", false, []).length, 0);
});
test("a new message changes the record key, preserving old read decisions", () => {
  const s = createDemoState();
  const first = buildInbox(s, extra).find((i) => i.category === "Messages")!;
  s.messages[0].entries.push({
    text: "New local message",
    own: false,
    time: "Demo",
  });
  const next = buildInbox(s, extra).find((i) => i.category === "Messages")!;
  assert.notEqual(first.id, next.id);
  assert.equal(filterInbox([next], "Messages", "", true, [first.id]).length, 1);
});
