# Founder demonstration guide

## A complete sourcing conversation

1. Open the dashboard. Explain the Demo Environment indicator: every company, price, certification claim and availability is fictional.
2. Select Find Processors. In Discover, combine Netherlands, Atlantic cod, Freezing and MSC. Nordhaven Seafood and Westbank Ocean Foods should match.
3. Open a company profile. Review products, multiple business activities, technical capacity versus listed available capacity, and unverified certification claims. Save the company; it appears in Companies → Saved companies and the dashboard count.
4. Create RFQ. Enter a fictional cod requirement, quantity, grade, packaging, location, delivery and deadline. Save the draft.
5. On Suppliers, compare Matching requirements, Partial match and Outside product scope. Delivery, grade and volume are explicitly unknown. Select two relevant companies.
6. Simulate distribution and confirm the dialog. The status becomes Open. Nobody is contacted.
7. Simulate a quotation twice to receive one per selected supplier. Open Quotations; follow an offer to its details.
8. In Offers, filter to your RFQ, select both quotations and compare. Discuss unit prices, Incoterms, lead times, certification claims and payment terms. Different terms do not imply equivalent landed costs.
9. Optionally simulate awarding an offer. The request changes to Awarded and the quotation to Accepted. No contract is formed.
10. Return to the dashboard to see counts and local activity reflect the workflow.

## Other product pillars

- Capacity Exchange: filter country/service/species and an available date within November 2026. Open a listing and save a fictional inquiry. Find it in Messages.
- Messages: switch conversations and save a local demonstration message. No delivery or automatic supplier reply occurs.
- My Organization: edit the company name and multiple activities; save and observe the shared organization name in the sidebar.
- Refresh: drafts, shortlist, messages and organization changes persist in this browser.
- Settings → Demo data: confirm Reset demo data to restore the seeded scenario. Reset removes local changes.

## Feedback to collect

Ask whether specifications support real sourcing decisions; which supplier capabilities are missing; what evidence is needed for certification trust; which delivery terms and product tolerances affect comparison; and how processing availability should be confirmed. Prioritize workflow feedback before production backend implementation.

## Limits

No real identity, companies, verification, attachments, transport costing, negotiation engine, inventory, email, live capacity or billing. Price and date values are fixed illustrative records. Smart search supports documented keyword patterns only. Production multi-tenant security is a future milestone.

## SeaLink 2.0 public and operations walkthrough

Visit `/`, compare provisional €99 Starter / €199 Professional / custom Enterprise plans, then select a plan and finish the two-step `/join` demo. Business details update the organization; professional details update `/app/profile`. `/login` transparently opens the preview without authentication.

Visit `/app/marketplace` to browse fictional product capabilities. Existing company, RFQ and quotation workflows are now under `/app`. In Logistics, choose a provider, save shipment requirements and review them in My activity. No booking or external delivery occurs.

In Jobs & workforce, publish a fictional vacancy, save or apply to it, then use My activity to review applications and close/reopen owned vacancies. Employer review and applicant data remain in this local browser. In Publish capacity, select a supported company service and valid date range; the listing appears in the exchange and can be removed locally. Reset demo data restores the original scenario across modules.
