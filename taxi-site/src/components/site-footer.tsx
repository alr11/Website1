import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gold-400/20 bg-ink text-bone/75">
      <div className="container-content grid gap-12 py-16 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src={siteConfig.images.logo}
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 rounded-sm"
            />
            <span className="font-display text-xl font-bold text-bone">
              {siteConfig.business.name}
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            {siteConfig.business.valueProp}
          </p>
          <p className="mt-5 flex items-center gap-2 text-sm text-gold-300">
            <MapPinIcon className="h-4 w-4" />
            {siteConfig.contact.locality}
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="eyebrow-on-dark">Quick links</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-gold-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow-on-dark">Contact us</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <span>
                <span className="block text-xs uppercase tracking-widest text-bone/50">Phone</span>
                <a
                  href={`tel:${siteConfig.contact.phoneHref}`}
                  className="text-bone transition-colors hover:text-gold-300"
                >
                  {siteConfig.contact.phone}
                </a>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <span>
                <span className="block text-xs uppercase tracking-widest text-bone/50">
                  WhatsApp
                </span>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsappHref}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone transition-colors hover:text-gold-300"
                >
                  {siteConfig.contact.whatsapp}
                </a>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <span>
                <span className="block text-xs uppercase tracking-widest text-bone/50">Email</span>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-bone transition-colors hover:text-gold-300"
                >
                  {siteConfig.contact.email}
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-600">
        <div className="container-content flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.business.name}. All rights reserved.
          </p>
          <p>
            {siteConfig.business.licensing} · Licence {siteConfig.business.licenceNumber}
          </p>
        </div>
      </div>
    </footer>
  );
}
