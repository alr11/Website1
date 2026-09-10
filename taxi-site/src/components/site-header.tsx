"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";
import { cx } from "@/lib/utils";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/icons";

/**
 * Sticky header: logo, nav, and a persistent Call Now button carrying the
 * phone number from siteConfig. Goes translucent-dark once the page scrolls
 * so it stays legible over both the dark hero and the light inner pages.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer on navigation, and lock the body while it is open.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "bg-ink/95 shadow-lift backdrop-blur supports-[backdrop-filter]:bg-ink/80"
          : "bg-gradient-to-b from-ink/80 to-transparent",
      )}
    >
      <div className="container-content flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={`${siteConfig.business.name} — home`}
        >
          <Image
            src={siteConfig.images.logo}
            alt=""
            width={44}
            height={44}
            priority
            className="h-11 w-11 rounded-sm"
          />
          <span className="leading-none">
            <span className="block text-[0.6rem] uppercase tracking-[0.35em] text-gold-300">
              {siteConfig.contact.baseTown}
            </span>
            <span className="block font-display text-lg font-bold tracking-wide text-bone sm:text-xl">
              {siteConfig.business.name}
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {siteConfig.nav.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "relative py-2 text-sm font-medium uppercase tracking-[0.12em] transition-colors",
                      active ? "text-gold-300" : "text-bone/80 hover:text-bone",
                    )}
                  >
                    {item.label}
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute inset-x-0 -bottom-0.5 h-px bg-gold-400"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${siteConfig.contact.phoneHref}`}
            className="hidden min-h-11 items-center gap-2 rounded-sm bg-gold-400 px-5 text-sm font-bold text-ink transition-colors hover:bg-gold-300 sm:inline-flex"
          >
            <PhoneIcon className="h-4 w-4" />
            <span>{siteConfig.contact.phone}</span>
            <span className="sr-only">— call now</span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-bone/25 text-bone lg:hidden"
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-ink-600 bg-ink lg:hidden"
      >
        <nav aria-label="Mobile" className="container-content py-4">
          <ul className="flex flex-col">
            {siteConfig.nav.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href} className="border-b border-ink-600 last:border-0">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "flex min-h-14 items-center text-base font-medium uppercase tracking-[0.12em]",
                      active ? "text-gold-300" : "text-bone/85",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <a
            href={`tel:${siteConfig.contact.phoneHref}`}
            className="mt-4 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-sm bg-gold-400 px-6 font-bold text-ink"
          >
            <PhoneIcon className="h-5 w-5" />
            Call {siteConfig.contact.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
