import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { ButtonLink } from "@/components/button";
import { ArrowRightIcon, serviceIcons, type ServiceIconName } from "@/components/icons";
import { CheckList, CtaBanner, PageHero, TrustBar } from "@/components/sections";

export const metadata: Metadata = {
  title: "Services",
  description: `Airport transfers, local taxi, corporate travel and pre-booked journeys from ${siteConfig.contact.baseTown}. Fixed prices, licensed driver.`,
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Every kind of journey, one standard"
        intro="Four ways we work — all pre-booked, all fixed-price, all in the same immaculately kept car."
        image={siteConfig.images.hero}
      />

      <TrustBar />

      <div className="bg-bone">
        {siteConfig.services.map((service, index) => {
          const Icon = serviceIcons[service.icon as ServiceIconName];
          const reversed = index % 2 === 1;

          return (
            <section
              key={service.slug}
              id={service.slug}
              aria-labelledby={`${service.slug}-heading`}
              className="scroll-mt-24 border-b border-bone-300 py-16 last:border-0 sm:py-24"
            >
              <div className="container-content grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={reversed ? "lg:order-2" : undefined}>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-ink text-gold-400">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h2
                    id={`${service.slug}-heading`}
                    className="mt-6 text-display-md font-bold text-ink"
                  >
                    {service.name}
                  </h2>
                  <p className="mt-5 text-lg leading-relaxed text-ink/70">
                    {service.description}
                  </p>
                  <div className="mt-8">
                    <CheckList items={service.points} />
                  </div>
                  <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                    <ButtonLink href="/pricing">
                      Request a quote
                      <ArrowRightIcon className="h-4 w-4" />
                    </ButtonLink>
                    <ButtonLink href="/contact" variant="secondary">
                      Book this service
                    </ButtonLink>
                  </div>
                </div>

                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-sm border border-bone-300 shadow-card ${
                    reversed ? "lg:order-1" : ""
                  }`}
                >
                  <Image
                    src={index % 2 === 0 ? siteConfig.images.fleet : siteConfig.images.fleetAlt}
                    alt={`${siteConfig.fleet.vehicle} prepared for ${service.name.toLowerCase()}`}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <CtaBanner />
    </>
  );
}
