import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { formatPrice } from "@/lib/utils";
import { QuoteEstimator } from "@/components/quote-estimator";
import { CtaBanner, PageHero, SectionHeading } from "@/components/sections";

export const metadata: Metadata = {
  title: "Pricing & instant quote",
  description: `Fixed airport transfer prices from ${siteConfig.contact.baseTown} and an instant journey estimate. No meters, no surprises.`,
};

const { pricing } = siteConfig;

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Know the price before you travel"
        intro="Build an estimate in a few seconds. Fixed airport rates, transparent local prices, and a written confirmation before you go."
        image={siteConfig.images.hero}
      />

      {/* ----------------------------------------------------- estimator */}
      <section className="bg-bone py-16 sm:py-24" aria-labelledby="estimator-heading">
        <div className="container-content">
          <SectionHeading
            eyebrow="Instant estimate"
            title="Price your journey"
            intro="Choose your destination, vehicle and time. The figure updates as you go — nothing is sent anywhere until you choose to book."
          />
          <h2 id="estimator-heading" className="sr-only">
            Journey price estimator
          </h2>
          <div className="mt-12">
            <QuoteEstimator />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- rate tables */}
      <section className="bg-white py-16 sm:py-24" aria-labelledby="rates-heading">
        <div className="container-content">
          <SectionHeading
            eyebrow="Standard rates"
            title="Our published prices"
            intro="These are the rates the estimator uses. Airport prices are fixed one-way fares from the Swindon area."
          />

          <h2 id="rates-heading" className="sr-only">
            Standard rates
          </h2>

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <RateTable
              caption="Fixed airport transfers"
              note="One way, from the Swindon area, in a standard vehicle."
              rows={pricing.fixedRoutes}
            />
            <RateTable
              caption="Local journeys"
              note="One way, from the Swindon area, in a standard vehicle."
              rows={pricing.localRoutes}
            />
          </div>

          {/* -------------------------------------------- adjustments */}
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <AdjustmentCard
              title="Anywhere else"
              value={`${pricing.currency}${pricing.perMile.toFixed(2)} / mile`}
              detail={`Minimum fare ${formatPrice(pricing.minimumFare, pricing.currency)}. Long-distance journeys are quoted individually.`}
            />
            <AdjustmentCard
              title={pricing.surcharges.night.label}
              value={`+${Math.round(pricing.surcharges.night.rate * 100)}%`}
              detail="Applied to the fare for pick-ups between 22:00 and 06:00."
            />
            <AdjustmentCard
              title="Return journeys"
              value={`−${Math.round(pricing.returnDiscount * 100)}%`}
              detail="Book the return at the same time and the second leg is discounted."
            />
          </div>

          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-ink/60">
            A {formatPrice(pricing.bookingFee, pricing.currency)} booking fee applies to every
            journey. Weekend pick-ups carry a{" "}
            {Math.round(pricing.surcharges.weekend.rate * 100)}% surcharge.{" "}
            {pricing.disclaimer}
          </p>
        </div>
      </section>

      <CtaBanner
        title="Happy with the estimate?"
        body="Send it over with your details and we will come back with a written fixed price."
      />
    </>
  );
}

function RateTable({
  caption,
  note,
  rows,
}: {
  caption: string;
  note: string;
  rows: readonly { id: string; label: string; price: number }[];
}) {
  return (
    <div className="overflow-hidden rounded-sm border border-bone-300 shadow-card">
      <table className="w-full border-collapse text-left">
        <caption className="border-b border-bone-300 bg-bone px-6 py-5 text-left">
          <span className="block font-display text-xl font-bold text-ink">{caption}</span>
          <span className="mt-1 block text-xs text-ink/60">{note}</span>
        </caption>
        <thead>
          <tr className="border-b border-bone-300 bg-white">
            <th scope="col" className="px-6 py-3 text-xs uppercase tracking-[0.14em] text-ink/65">
              Destination
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs uppercase tracking-[0.14em] text-ink/65"
            >
              From
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-bone-200 last:border-0 even:bg-bone/40">
              <th scope="row" className="px-6 py-4 text-[0.95rem] font-medium text-ink">
                {row.label}
              </th>
              <td className="px-6 py-4 text-right font-semibold tabular-nums text-ink">
                {formatPrice(row.price, siteConfig.pricing.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdjustmentCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-sm border-l-2 border-gold-400 bg-bone p-6">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-2 font-display text-3xl font-bold text-ink">{value}</p>
      <p className="mt-3 text-sm leading-relaxed text-ink/65">{detail}</p>
    </div>
  );
}
