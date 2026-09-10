import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { ButtonLink } from "@/components/button";
import { ArrowRightIcon, PhoneIcon } from "@/components/icons";
import {
  CtaBanner,
  PageHero,
  SectionHeading,
  ServiceCard,
  StarRating,
  Testimonials,
  TrustBar,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <PageHero
        tall
        eyebrow={siteConfig.business.tagline}
        title={siteConfig.business.name}
        intro={siteConfig.business.valueProp}
        image={siteConfig.images.hero}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <ButtonLink href="/pricing" size="lg">
            Get a quote
            <ArrowRightIcon className="h-4 w-4" />
          </ButtonLink>
          <a
            href={`tel:${siteConfig.contact.phoneHref}`}
            className="inline-flex min-h-14 items-center gap-3 rounded-sm border border-gold-400/50 px-6 text-base font-semibold text-gold-200 transition-colors hover:bg-gold-400/10"
          >
            <PhoneIcon className="h-5 w-5" />
            {siteConfig.contact.phone}
          </a>
        </div>
        <p className="mt-7 flex flex-wrap items-center gap-3 text-sm text-bone/70">
          <StarRating />
          <span>
            Rated {siteConfig.social.rating.toFixed(1)} from {siteConfig.social.reviewCount}{" "}
            {siteConfig.social.ratingSource}
          </span>
        </p>
      </PageHero>

      <TrustBar />

      {/* ------------------------------------------------------ services */}
      <section className="bg-bone py-20 sm:py-28">
        <div className="container-content">
          <SectionHeading
            eyebrow="What we do"
            title="Journeys planned properly, priced up front"
            intro="Every job is pre-booked and quoted before you travel. Pick the service that fits and we will confirm the details in writing."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {siteConfig.services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- fleet */}
      <section className="bg-ink py-20 sm:py-28">
        <div className="container-content grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-ink-600">
            <Image
              src={siteConfig.images.fleet}
              alt={`${siteConfig.fleet.vehicle} used by ${siteConfig.business.name}, gloss black with black alloy wheels`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              onDark
              eyebrow={siteConfig.fleet.heading}
              title={siteConfig.fleet.vehicle}
              intro={siteConfig.fleet.description}
            />
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
              {siteConfig.fleet.specs.map((spec) => (
                <div key={spec.label} className="border-t border-gold-400/25 pt-4">
                  <dt className="text-xs uppercase tracking-[0.18em] text-gold-300">
                    {spec.label}
                  </dt>
                  <dd className="mt-2 font-display text-xl text-bone">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- testimonials */}
      <section className="bg-bone py-20 sm:py-28">
        <div className="container-content">
          <SectionHeading
            align="center"
            eyebrow="What people say"
            title="Trusted for the journeys that matter"
            intro="Reviews shown here are placeholders until the live Google feed is connected."
          />
          <div className="mt-12">
            <Testimonials />
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
