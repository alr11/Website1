import { siteConfig } from "@/lib/siteConfig";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";

/**
 * Fixed click-to-call bar, mobile only. The <body> gets bottom padding via
 * the spacer in the root layout so nothing is ever hidden beneath it.
 */
export function MobileCallBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gold-400/25 bg-ink/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-[1fr_auto] gap-2 p-2">
        <a
          href={`tel:${siteConfig.contact.phoneHref}`}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-sm bg-gold-400 px-4 text-base font-bold text-ink"
        >
          <PhoneIcon className="h-5 w-5" />
          Call {siteConfig.contact.phone}
        </a>
        <a
          href={`https://wa.me/${siteConfig.contact.whatsappHref}`}
          className="inline-flex min-h-14 w-14 items-center justify-center rounded-sm border border-gold-400/50 text-gold-300"
          rel="noopener noreferrer"
          target="_blank"
        >
          <WhatsAppIcon className="h-6 w-6" />
          <span className="sr-only">Message {siteConfig.business.name} on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
