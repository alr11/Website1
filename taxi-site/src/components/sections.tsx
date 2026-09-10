import type { ReactNode } from "react";
import { siteConfig } from "@/lib/siteConfig";
import { cx } from "@/lib/utils";
import { ButtonLink } from "@/components/button";
import {
  ArrowRightIcon,
  CheckIcon,
  PhoneIcon,
  ShieldIcon,
  StarIcon,
  serviceIcons,
  type ServiceIconName,
} from "@/components/icons";

/* -------------------------------------------------------------- page hero */

/**
 * Dark image-backed hero used at the top of every page. The image is a CSS
 * background layer behind a gradient scrim; the scrim keeps text contrast
 * above 4.5:1 no matter how light the replacement photograph turns out to be.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  children,
  tall = false,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  image: string;
  children?: ReactNode;
  tall?: boolean;
}) {
  return (
    <section
      className={cx(
        "relative isolate flex items-end overflow-hidden bg-ink",
        tall ? "min-h-[88svh] pb-16 pt-32 sm:pb-24" : "min-h-[52svh] pb-14 pt-32 sm:pb-20",
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url('${image}')` }}
      />
      {/* Scrim: strong at the bottom where the copy sits. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/90 to-ink/70"
      />
      <div className="container-content animate-fade-up">
        <p className="eyebrow-on-dark">{eyebrow}</p>
        <h1
          className={cx(
            "mt-4 max-w-4xl font-display font-bold text-bone",
            tall ? "text-display-xl" : "text-display-lg",
          )}
        >
          {title}
        </h1>
        {intro ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone/85">{intro}</p>
        ) : null}
        {children ? <div className="mt-9">{children}</div> : null}
      </div>
    </section>
  );
}

/* ------------------------------------------------------- section heading */

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  onDark = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  onDark?: boolean;
}) {
  return (
    <div className={cx("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className={onDark ? "eyebrow-on-dark" : "eyebrow"}>{eyebrow}</p>
      <h2
        className={cx(
          "mt-3 text-display-md font-bold",
          onDark ? "text-bone" : "text-ink",
        )}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={cx(
            "mt-4 text-lg leading-relaxed",
            onDark ? "text-bone/80" : "text-ink/70",
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------ star rating */

export function StarRating({
  rating = siteConfig.social.rating,
  className,
}: {
  rating?: number;
  className?: string;
}) {
  const label = `Rated ${rating} out of 5`;
  return (
    <span className={cx("inline-flex items-center gap-0.5 text-gold-400", className)} role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} half={rating < i && rating > i - 1} className="h-4 w-4" />
      ))}
    </span>
  );
}

/* --------------------------------------------------------------- trust bar */

export function TrustBar({ onDark = false }: { onDark?: boolean }) {
  return (
    <section
      aria-label="Credentials"
      className={cx(
        "border-y",
        onDark ? "border-ink-600 bg-ink-800" : "border-bone-300 bg-white",
      )}
    >
      <div className="container-content grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
        <div className={cx(
          "flex flex-wrap items-center gap-x-3 gap-y-1 lg:border-r lg:pr-6",
          onDark ? "lg:border-ink-600" : "lg:border-bone-300",
        )}>
          <StarRating />
          <span className={cx("text-sm", onDark ? "text-bone/80" : "text-ink/75")}>
            <strong className={onDark ? "text-bone" : "text-ink"}>
              {siteConfig.social.rating.toFixed(1)}
            </strong>{" "}
            from {siteConfig.social.reviewCount} {siteConfig.social.ratingSource}
          </span>
        </div>
        {siteConfig.trustBadges.map((badge) => (
          <div key={badge.label} className="flex items-start gap-3">
            <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
            <span>
              <span
                className={cx(
                  "block text-sm font-semibold",
                  onDark ? "text-bone" : "text-ink",
                )}
              >
                {badge.label}
              </span>
              <span className={cx("block text-xs", onDark ? "text-bone/60" : "text-ink/60")}>
                {badge.detail}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ service card */

export function ServiceCard({
  service,
}: {
  service: (typeof siteConfig.services)[number];
}) {
  const Icon = serviceIcons[service.icon as ServiceIconName];
  return (
    <article className="group flex h-full flex-col rounded-sm border border-bone-300 bg-white p-7 shadow-card transition-shadow duration-300 hover:shadow-lift">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-ink text-gold-400">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-6 font-display text-2xl font-bold text-ink">{service.name}</h3>
      <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink/70">{service.summary}</p>
      <a
        href={`/services#${service.slug}`}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.1em] text-gold-600 transition-colors hover:text-ink"
      >
        Read more
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </a>
    </article>
  );
}

/* ----------------------------------------------------------- testimonials */

export function Testimonials({ onDark = false }: { onDark?: boolean }) {
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {siteConfig.testimonials.map((t) => (
        <li
          key={t.author}
          className={cx(
            "flex flex-col rounded-sm border p-7",
            onDark ? "border-ink-600 bg-ink-800" : "border-bone-300 bg-white shadow-card",
          )}
        >
          <StarRating rating={5} />
          <blockquote className="mt-5 flex-1">
            <p
              className={cx(
                "font-display text-lg leading-relaxed",
                onDark ? "text-bone/90" : "text-ink/85",
              )}
            >
              &ldquo;{t.quote}&rdquo;
            </p>
          </blockquote>
          <footer className="mt-6">
            <p className={cx("text-sm font-semibold", onDark ? "text-bone" : "text-ink")}>
              {t.author}
            </p>
            <p className={cx("text-xs", onDark ? "text-bone/55" : "text-ink/65")}>{t.context}</p>
          </footer>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------- CTA banner */

export function CtaBanner({
  title = "Ready to book?",
  body = "Use the booking form for planned journeys. For anything urgent, call us directly — we answer the phone ourselves.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="bg-ink py-20">
      <div className="container-content">
        <div className="mx-auto max-w-3xl rounded-sm border border-gold-400/25 bg-ink-800 px-6 py-14 text-center sm:px-12">
          <ShieldIcon className="mx-auto h-9 w-9 text-gold-400" />
          <h2 className="mt-6 text-display-md font-bold text-bone">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-bone/75">{body}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink href="/contact" size="lg">
              Book online
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
            <a
              href={`tel:${siteConfig.contact.phoneHref}`}
              className="inline-flex min-h-14 items-center gap-2 px-2 text-base text-bone/85 transition-colors hover:text-gold-300"
            >
              <PhoneIcon className="h-5 w-5 text-gold-400" />
              Call {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- bullets */

export function CheckList({
  items,
  onDark = false,
}: {
  items: readonly string[];
  onDark?: boolean;
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
          <span className={cx("text-[0.95rem]", onDark ? "text-bone/80" : "text-ink/75")}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
