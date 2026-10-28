"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Waves,
  ArrowUpRight,
  ArrowRight,
  Factory,
  Truck,
  Users,
  Globe,
  Check,
} from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/shared";
import { plans } from "@/data/pricing";
import { useExpansion } from "./expansion";
import { useDemo } from "./store";
export function RouteShell({ children }: { children: React.ReactNode }) {
  return usePathname().startsWith("/app") ? (
    <Shell>{children}</Shell>
  ) : (
    <div className="public-site">
      <header className="public-nav">
        <Link className="brand" href="/">
          <Waves />
          SeaLink.
        </Link>
        <nav>
          <Link href="/#platform">Platform</Link>
          <Link href="/#solutions">Solutions</Link>
          <Link href="/#pricing">Membership</Link>
          <Link href="/login">Log in</Link>
          <Button asChild>
            <Link href="/join">
              Get started <ArrowUpRight size={15} />
            </Link>
          </Button>
        </nav>
      </header>
      {children}
      <footer>
        © SeaLink · European seafood industry platform{" "}
        <Link href="/app">Explore demo workspace →</Link>
        <span>Fictional preview · No billing or external delivery</span>
      </footer>
    </div>
  );
}
export function PublicPage({ route }: { route: string }) {
  return route === "home" ? (
    <Homepage />
  ) : route === "join" || route === "login" ? (
    <Onboarding login={route === "login"} />
  ) : (
    <section className="public-section">
      <h1>Page not found</h1>
      <Link href="/">Return home</Link>
    </section>
  );
}
function Homepage() {
  return (
    <>
      <section className="public-hero">
        <div>
          <span className="eyebrow">ONE INDUSTRY. NEW POSSIBILITIES.</span>
          <h1>
            The European
            <br />
            Seafood Industry.
            <br />
            <em>Connected.</em>
          </h1>
          <p>
            Discover partners, source seafood, access processing capacity,
            manage logistics, and connect with industry professionals — all in
            one platform.
          </p>
          <div className="heading-actions">
            <Button asChild>
              <Link href="/join">
                Get started <ArrowUpRight size={16} />
              </Link>
            </Button>
            <Link className="text-link" href="/app">
              Explore the platform <ArrowRight size={16} />
            </Link>
          </div>
          <small>Local demonstration · No payment required</small>
        </div>
        <div
          className="maritime-art"
          role="img"
          aria-label="Illustrated European maritime routes, photography placeholder"
        >
          <div className="sea-orbit" />
          <Waves size={120} strokeWidth={0.7} />
          <span>ROTTERDAM ↗ TALLINN</span>
          <strong>
            A shared ocean.
            <br />A stronger network.
          </strong>
          <small>Maritime illustration · Photography pending</small>
        </div>
      </section>
      <section className="coverage-line">
        BUILT AROUND YOUR INDUSTRY <span>Seafood trade</span>
        <span>Processing</span>
        <span>Cold chain</span>
        <span>People</span>
      </section>
      <section className="public-section intro" id="platform">
        <span className="eyebrow">LESS FRAGMENTATION. MORE CONNECTION.</span>
        <h2>
          Your next opportunity
          <br />
          starts with the right connection.
        </h2>
        <p>
          Seafood businesses work across borders, specialisms and seasons.
          SeaLink brings the commercial context together — from finding a
          supplier to understanding what they can deliver.
        </p>
      </section>
      <section className="public-section" id="solutions">
        <div className="ecosystem">
          {[
            [
              Globe,
              "Seafood marketplace",
              "Find partners by species, geography and capabilities. Turn discovery into a sourcing request.",
              "/app/discover",
            ],
            [
              Factory,
              "Processing capacity",
              "Find specialist production services. Publish fictional availability and start a conversation.",
              "/app/capacity",
            ],
            [
              Truck,
              "Logistics network",
              "Explore refrigerated transport and cold storage. Structure your shipment requirements.",
              "/app/logistics",
            ],
            [
              Users,
              "Jobs & workforce",
              "Connect industry expertise with new opportunities. Publish roles and explore careers.",
              "/app/jobs",
            ],
          ].map(([Icon, title, copy, url]) => {
            const I = Icon as typeof Globe;
            return (
              <Link href={String(url)} key={String(title)}>
                <I size={30} />
                <h3>{String(title)}</h3>
                <p>{String(copy)}</p>
                <ArrowUpRight size={19} />
              </Link>
            );
          })}
        </div>
      </section>
      <section className="public-section how">
        <span className="eyebrow">FROM DISCOVERY TO OPPORTUNITY</span>
        <h2>A clearer way to work together.</h2>
        <div>
          {[
            "Build your industry profile",
            "Discover the right expertise",
            "Start a structured conversation",
          ].map((v, i) => (
            <article key={v}>
              <span>0{i + 1}</span>
              <h3>{v}</h3>
              <p>
                {
                  [
                    "Join as a business or industry professional. Show what you do and what you need.",
                    "Filter a connected European network by the industrial criteria that matter.",
                    "Compare offers, explore capacity and keep your commercial context in one workspace.",
                  ][i]
                }
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="public-section europe">
        <div>
          <span className="eyebrow">EUROPEAN BY DESIGN</span>
          <h2>
            Across borders.
            <br />
            Across the supply chain.
          </h2>
          <p>
            The preview represents seven European countries. This is an
            illustrative network, not a claim of live commercial coverage.
          </p>
        </div>
        <div>
          {[
            "Netherlands",
            "Germany",
            "Denmark",
            "Poland",
            "Estonia",
            "Latvia",
            "Lithuania",
          ].map((v) => (
            <span key={v}>
              {v}
              <ArrowUpRight size={14} />
            </span>
          ))}
        </div>
      </section>
      <section className="public-section">
        <div className="preview-editorial">
          <div>
            <span className="eyebrow">A WORKSPACE WITH CONTEXT</span>
            <h2>
              One specification.
              <br />
              Every conversation connected.
            </h2>
            <p>
              Follow a complete demonstration from company discovery to
              quotation comparison. Your local changes stay connected across the
              workspace.
            </p>
            <Button asChild>
              <Link href="/app">
                Open interactive preview <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          <div className="preview-ticket">
            <span>REQUEST FOR QUOTATION · DEMO</span>
            <h3>Frozen Atlantic cod loins</h3>
            <p>24,000 kg · Rotterdam · MSC claim required</p>
            <hr />
            <div>
              01 &nbsp; Discover suitable processors <Check size={16} />
            </div>
            <div>
              02 &nbsp; Review supplier responses <Check size={16} />
            </div>
            <div>
              03 &nbsp; Compare commercial terms <ArrowRight size={16} />
            </div>
            <small>Fictional request. No supplier contacted.</small>
          </div>
        </div>
      </section>
      <section className="public-section" id="pricing">
        <span className="eyebrow">MEMBERSHIP, MADE CLEAR</span>
        <h2>A place for your next chapter.</h2>
        <p>
          Provisional prices and benefits, subject to commercial validation.
          Billing is inactive.
        </p>
        <div className="pricing-grid">
          {plans.map((p, i) => (
            <article key={p.name} className={i === 1 ? "featured" : ""}>
              <span>
                {i === 1 ? "CONNECTED WORKFLOWS" : "MEMBERSHIP CONCEPT"}
              </span>
              <h3>{p.name}</h3>
              <div className="plan-price">
                {p.price}
                <small>{i < 2 ? "/ month + applicable VAT" : " pricing"}</small>
              </div>
              <ul>
                {p.features.map((v) => (
                  <li key={v}>
                    <Check size={15} />
                    {v}
                  </li>
                ))}
              </ul>
              <Button variant={i === 1 ? "default" : "outline"} asChild>
                <Link href={`/join?plan=${p.name}`}>
                  Explore {p.name}
                  <ArrowRight size={15} />
                </Link>
              </Button>
              <small>Preview only · No payment</small>
            </article>
          ))}
        </div>
      </section>
      <section className="public-section faq">
        <h2>A few things worth knowing.</h2>
        {[
          [
            "Is this a live commercial network?",
            "This is a product preview. All seeded companies, prices and capacity listings are fictional. No transactions or external messages occur.",
          ],
          [
            "Can I join as an individual?",
            "Yes. The demo supports business and professional onboarding, with a professional profile and job application workflow.",
          ],
          [
            "Are certifications verified?",
            "No. Claims in this preview are illustrative and self-reported. Production verification is a future milestone.",
          ],
          [
            "Will I be charged?",
            "No. Membership prices are provisional placeholders. No payment information is collected.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <section className="public-section final-cta">
        <span className="eyebrow">THE NEXT CONNECTION IS YOURS</span>
        <h2>Let’s move the industry forward.</h2>
        <Button asChild>
          <Link href="/join">
            Explore SeaLink <ArrowUpRight size={16} />
          </Link>
        </Button>
      </section>
    </>
  );
}
function Onboarding({ login }: { login: boolean }) {
  const { update, notify } = useDemo();
  const { set } = useExpansion();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("Business");
  const [plan, setPlan] = useState("Starter");
  useEffect(() => {
    const t = setTimeout(() => {
      const value = new URLSearchParams(window.location.search).get("plan");
      if (plans.some((p) => p.name === value)) setPlan(value!);
    }, 0);
    return () => clearTimeout(t);
  }, []);
  return (
    <section className="onboarding">
      <div>
        <span className="eyebrow">DEMO ONBOARDING · NO AUTHENTICATION</span>
        <h1>
          {login
            ? "Welcome back to SeaLink"
            : "Your industry. Your next connection."}
        </h1>
        <p>
          No password, payment or secure account is created. Use fictional
          information only.
        </p>
      </div>
      {login ? (
        <div className="panel padded">
          <h2>Enter the local preview</h2>
          <p>This is an open demonstration workspace, not a secure login.</p>
          <Button asChild>
            <Link href="/app">Continue to demo</Link>
          </Button>
          <Link href="/join">Set up a demo profile →</Link>
        </div>
      ) : (
        <form
          className="panel padded"
          onSubmit={(e) => {
            e.preventDefault();
            if (step === 1) {
              setStep(2);

              return;
            }
            const d = new FormData(e.currentTarget);
            if (category === "Business")
              update((s) => ({
                ...s,
                organization: {
                  ...s.organization,
                  name: String(d.get("name")),
                  country: String(d.get("country")),
                  description: String(d.get("description")),
                  activities: String(d.get("specialization")),
                  email: String(d.get("contact")),
                },
              }));
            if (category === "Professional")
              set((s) => ({
                ...s,
                profile: {
                  name: String(d.get("name")),
                  country: String(d.get("country")),
                  specialization: String(d.get("specialization")),
                  experience: String(d.get("experience")),
                  interests: String(d.get("interests")),
                },
              }));
            try {
              localStorage.setItem(
                "sealink-account",
                JSON.stringify({
                  category,
                  plan,
                  name: d.get("name"),
                  country: d.get("country"),
                  specialization: d.get("specialization"),
                  experience: d.get("experience"),
                  interests: d.get("interests"),
                }),
              );
            } catch {
              notify(
                "Profile storage unavailable. You can still explore the demo.",
              );
            }
            notify(
              "Demo profile created locally. No secure account or billing activated.",
            );
            router.push(category === "Business" ? "/app" : "/app/profile");
          }}
        >
          <span className="eyebrow">STEP {step} OF 2</span>
          {step === 1 ? (
            <>
              <Field label="Account category">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Business</option>
                  <option>Professional</option>
                </select>
              </Field>
              <Field label="Provisional membership">
                <select value={plan} onChange={(e) => setPlan(e.target.value)}>
                  {plans.map((p) => (
                    <option key={p.name}>{p.name}</option>
                  ))}
                </select>
              </Field>
              <Button>
                Continue <ArrowRight size={15} />
              </Button>
            </>
          ) : (
            <>
              <Field
                label={
                  category === "Business" ? "Company name" : "Professional name"
                }
              >
                <input name="name" required minLength={2} />
              </Field>
              <Field label="Country">
                <input name="country" required />
              </Field>
              <Field
                label={
                  category === "Business"
                    ? "Business categories and main activities"
                    : "Professional specialization"
                }
              >
                <input name="specialization" required />
              </Field>
              {category === "Business" ? (
                <>
                  <Field label="Company description">
                    <textarea name="description" required />
                  </Field>
                  <Field label="Fictional contact email">
                    <input type="email" name="contact" required />
                  </Field>
                </>
              ) : (
                <>
                  <Field label="Experience">
                    <input name="experience" required />
                  </Field>
                  <Field label="Employment interests">
                    <input name="interests" required />
                  </Field>
                </>
              )}
              <div className="heading-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button>
                  Enter demo workspace <ArrowRight size={15} />
                </Button>
              </div>
            </>
          )}
        </form>
      )}
    </section>
  );
}
