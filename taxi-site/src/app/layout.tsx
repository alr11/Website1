import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/siteConfig";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileCallBar } from "@/components/mobile-call-bar";

const display = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.business.name} — ${siteConfig.business.tagline}`,
    template: `%s | ${siteConfig.business.name}`,
  },
  description: siteConfig.business.metaDescription,
  openGraph: {
    title: siteConfig.business.name,
    description: siteConfig.business.metaDescription,
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-gold-400 focus:px-4 focus:py-3 focus:font-semibold focus:text-ink"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <MobileCallBar />
        {/* Spacer so the fixed mobile call bar never covers footer content. */}
        <div aria-hidden className="h-[4.75rem] md:hidden" />
      </body>
    </html>
  );
}
