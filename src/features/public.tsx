"use client";
import Link from "next/link";
import { Homepage3 } from "./homepage-3";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Waves, Menu, X, ArrowUpRight, ArrowRight } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/shared";
import { plans } from "@/data/pricing";
import { useExpansion } from "./expansion";
import { useDemo } from "./store";
export function RouteShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [publicMenu, setPublicMenu] = useState(false);
  return path.startsWith("/app") ? (
    <Shell>{children}</Shell>
  ) : (
    <div className={path === "/" ? "public-site home3-site" : "public-site"}>
      {path === "/" && (
        <a className="home3-skip" href="#homepage-content">
          Skip to content
        </a>
      )}
      <header className="public-nav">
        <Link className="brand" href="/">
          <Waves />
          SeaLink.
        </Link>
        {path === "/" && (
          <Button
            className="home3-menu-trigger"
            variant="ghost"
            size="icon"
            aria-label={
              publicMenu ? "Close public navigation" : "Open public navigation"
            }
            aria-expanded={publicMenu}
            aria-controls="home3-public-navigation"
            onClick={() => setPublicMenu((v) => !v)}
          >
            {publicMenu ? <X size={22} /> : <Menu size={22} />}
          </Button>
        )}
        <nav
          id="home3-public-navigation"
          className={publicMenu ? "public-menu-open" : ""}
          aria-label="Public navigation"
          onClick={() => setPublicMenu(false)}
        >
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
        <Link href="/credits">Photography & type credits</Link>
      </footer>
    </div>
  );
}
export function PublicPage({ route }: { route: string }) {
  if (route === "credits")
    return (
      <section className="public-section credits">
        <span className="eyebrow">DESIGN SOURCES</span>
        <h1>Photography & typography</h1>
        <p>
          The SeaLink 3 homepage uses an original AI-generated industrial
          concept illustration, not documentary photography or a real SeaLink
          facility. Its source and generation record are documented in
          docs/ASSET_CREDITS.md. Previously used photographs are retained in the
          repository with the following credits. Photography is used for
          editorial atmosphere only. It does not depict SeaLink companies or
          imply endorsement. The photographs are supplied by Start Bootstrap
          (MIT) and Openscapes (CC BY 4.0). Fishing harbour photograph: Alicia
          Miller. Coastal and workshop photographs: Openscapes contributors.
          Images are cropped and converted to WebP.
        </p>
        <p>
          Manrope and Instrument Serif are self-hosted under the SIL Open Font
          License. Source and license notices are included with the font files.
        </p>
        <ul>
          <li>
            <a href="https://github.com/StartBootstrap/startbootstrap-landing-page">
              Open-water photograph: Start Bootstrap · MIT
            </a>
          </li>
          <li>
            <a href="https://github.com/nmfs-openscapes/nmfs-openscapes.github.io/blob/main/blog/2020-03-06-workshop-noaa-nefsc/index.qmd">
              Harbour boats: Alicia Miller · Openscapes · CC BY 4.0
            </a>
          </li>
          <li>
            <a href="https://github.com/nmfs-openscapes/nmfs-openscapes.github.io/blob/main/blog/2022-03-21-news-march-2022/index.qmd">
              Coastal photograph: Openscapes contributors · CC BY 4.0
            </a>
          </li>
          <li>
            <a href="https://github.com/nmfs-openscapes/nmfs-openscapes.github.io/blob/main/blog/2020-03-06-workshop-noaa-nefsc/index.qmd">
              Fisheries workshop: Openscapes contributors · CC BY 4.0
            </a>
          </li>
          <li>
            <a href="https://creativecommons.org/licenses/by/4.0/">
              Creative Commons Attribution 4.0 license
            </a>
          </li>
        </ul>
        <Link href="/">Back to SeaLink →</Link>
      </section>
    );
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
  return <Homepage3 />;
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
