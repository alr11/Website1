import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { BookingForm, type BookingPrefill } from "@/components/booking-form";
import { PageHero, StarRating } from "@/components/sections";
import { MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Book a taxi",
  description: `Book ${siteConfig.business.name} online, or call ${siteConfig.contact.phone} for urgent journeys from ${siteConfig.contact.locality}.`,
};

/** Reads a single query-string value, ignoring repeats. */
function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function ContactPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  // Values carried over from the /pricing estimator, if the visitor came from there.
  const prefill: BookingPrefill = {
    pickup: one(searchParams.pickup),
    destination: one(searchParams.destination),
    date: one(searchParams.date),
    time: one(searchParams.time),
    vehicle: one(searchParams.vehicle),
    estimate: one(searchParams.estimate),
    ret: one(searchParams.ret),
  };

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Book your taxi"
        intro="Pre-booked journeys are available for early-morning, daytime and late-night travel, subject to availability. For anything urgent, call us directly — the phone is answered by the driver."
        image={siteConfig.images.hero}
      >
        <a
          href={`tel:${siteConfig.contact.phoneHref}`}
          className="inline-flex min-h-14 items-center gap-3 rounded-sm border border-gold-400 bg-gold-400/10 px-7 text-base font-bold uppercase tracking-[0.08em] text-gold-200 transition-colors hover:bg-gold-400/20"
        >
          <PhoneIcon className="h-5 w-5" />
          Urgent booking — call {siteConfig.contact.phone}
        </a>
      </PageHero>

      <section className="bg-ink pb-24 pt-4">
        <div className="container-content grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          {/* ------------------------------------------------- booking form */}
          <div className="rounded-sm border border-ink-700 bg-ink-800 p-6 sm:p-10">
            <p className="eyebrow-on-dark">Booking request</p>
            <h2 className="mt-3 font-display text-display-md font-bold text-bone">
              Request a quote
            </h2>
            <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-bone/70">
              <StarRating />
              <span>
                Rated {siteConfig.social.rating.toFixed(1)} from {siteConfig.social.reviewCount}{" "}
                {siteConfig.social.ratingSource} — every journey pre-booked with a licensed driver.
              </span>
            </p>

            {/* The form itself sits on a light card so the fields stay high-contrast. */}
            <div className="mt-9 rounded-sm bg-bone p-6 sm:p-8">
              <BookingForm prefill={prefill} />
            </div>
          </div>

          {/* ----------------------------------------------- contact details */}
          <aside className="h-fit lg:sticky lg:top-28">
            <div className="rounded-sm border border-ink-700 bg-ink-800 p-8">
              <p className="eyebrow-on-dark">Direct contact</p>
              <h2 className="mt-3 font-display text-2xl font-bold text-bone">
                Rather just speak to someone?
              </h2>
              <ul className="mt-8 space-y-6">
                <ContactRow
                  icon={<PhoneIcon className="h-5 w-5" />}
                  label="Phone"
                  value={siteConfig.contact.phone}
                  href={`tel:${siteConfig.contact.phoneHref}`}
                />
                <ContactRow
                  icon={<WhatsAppIcon className="h-5 w-5" />}
                  label="WhatsApp"
                  value={siteConfig.contact.whatsapp}
                  href={`https://wa.me/${siteConfig.contact.whatsappHref}`}
                  external
                />
                <ContactRow
                  icon={<MailIcon className="h-5 w-5" />}
                  label="Email"
                  value={siteConfig.contact.email}
                  href={`mailto:${siteConfig.contact.email}`}
                />
                <ContactRow
                  icon={<MapPinIcon className="h-5 w-5" />}
                  label="Based in"
                  value={siteConfig.contact.locality}
                />
              </ul>

              <p className="mt-8 border-t border-ink-600 pt-6 text-sm text-bone/65">
                <span className="block font-semibold text-gold-300">Hours</span>
                {siteConfig.contact.hours}
              </p>
            </div>

            <div className="mt-6 rounded-sm border border-gold-400/25 bg-ink-800 p-6">
              <h2 className="font-display text-lg font-bold text-bone">Before you book</h2>
              <ul className="mt-4 space-y-2 text-sm text-bone/70">
                <li>Give us your flight number and we will track it.</li>
                <li>Tell us about luggage — we would rather know in advance.</li>
                <li>All prices are confirmed in writing before you travel.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <li className="flex items-start gap-4">
      <span className="mt-0.5 shrink-0 text-gold-400">{icon}</span>
      <span>
        <span className="block text-xs uppercase tracking-[0.16em] text-bone/50">{label}</span>
        {href ? (
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="text-base text-bone transition-colors hover:text-gold-300"
          >
            {value}
          </a>
        ) : (
          <span className="text-base text-bone">{value}</span>
        )}
      </span>
    </li>
  );
}
