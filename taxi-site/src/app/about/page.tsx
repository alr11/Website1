import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { MapPinIcon, ShieldIcon } from "@/components/icons";
import { CtaBanner, PageHero, SectionHeading, TrustBar } from "@/components/sections";

export const metadata: Metadata = {
  title: "About",
  description: `${siteConfig.business.name} — a licensed, insured private hire service based in ${siteConfig.contact.locality}.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={siteConfig.about.heading}
        intro={`Licensed, insured and based in ${siteConfig.contact.locality} since ${siteConfig.business.established}.`}
        image={siteConfig.images.hero}
      />

      <TrustBar />

      {/* -------------------------------------------------- founder story */}
      <section className="bg-bone py-20 sm:py-28">
        <div className="container-content grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-bone-300 shadow-card">
            <Image
              src={siteConfig.images.about}
              alt={`${siteConfig.about.founder.name}, ${siteConfig.about.founder.role} at ${siteConfig.business.name}`}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <SectionHeading eyebrow="Our story" title="Why we do it this way" />
            <div className="mt-8 space-y-6">
              {siteConfig.about.story.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="text-lg leading-relaxed text-ink/75">
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-10 border-l-2 border-gold-400 pl-5">
              <span className="block font-display text-xl font-bold text-ink">
                {siteConfig.about.founder.name}
              </span>
              <span className="mt-1 block text-sm text-ink/60">
                {siteConfig.about.founder.role}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ licensing */}
      <section className="bg-ink py-20 sm:py-28">
        <div className="container-content">
          <SectionHeading
            onDark
            align="center"
            eyebrow="Credentials"
            title="Properly licensed, properly insured"
            intro="Private hire is a regulated trade. Here is exactly what we hold — ask to see any of it at the roadside."
          />
          <ul className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
            {siteConfig.trustBadges.map((badge) => (
              <li
                key={badge.label}
                className="flex items-start gap-4 rounded-sm border border-ink-600 bg-ink-800 p-6"
              >
                <ShieldIcon className="mt-0.5 h-6 w-6 shrink-0 text-gold-400" />
                <span>
                  <span className="block font-display text-lg font-bold text-bone">
                    {badge.label}
                  </span>
                  <span className="mt-1 block text-sm text-bone/65">{badge.detail}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-bone/60">
            {siteConfig.business.licensing} · Licence number{" "}
            <span className="text-gold-300">{siteConfig.business.licenceNumber}</span>
          </p>
        </div>
      </section>

      {/* --------------------------------------------------- service area */}
      <section className="bg-white py-20 sm:py-28">
        <div className="container-content grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Service area"
              title={siteConfig.serviceArea.heading}
              intro={siteConfig.serviceArea.description}
            />
            <ul className="mt-9 flex flex-wrap gap-2">
              {siteConfig.serviceArea.towns.map((town) => (
                <li
                  key={town}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-bone-300 bg-bone px-3 py-2 text-sm text-ink/75"
                >
                  <MapPinIcon className="h-3.5 w-3.5 text-gold-600" />
                  {town}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-ink/60">
              Travelling further afield? Long-distance journeys nationwide are quoted on request.
            </p>
          </div>

          <div className="relative aspect-[3/2] overflow-hidden rounded-sm border border-bone-300 shadow-card">
            <Image
              src={siteConfig.images.map}
              alt={`Map of the ${siteConfig.contact.county} area covered by ${siteConfig.business.name}`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
