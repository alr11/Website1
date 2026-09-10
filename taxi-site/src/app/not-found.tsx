import { siteConfig } from "@/lib/siteConfig";
import { ButtonLink } from "@/components/button";
import { PhoneIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center bg-ink pt-24">
      <div className="container-content text-center">
        <p className="eyebrow-on-dark">404</p>
        <h1 className="mt-4 text-display-lg font-bold text-bone">We could not find that page</h1>
        <p className="mx-auto mt-5 max-w-lg text-lg text-bone/70">
          The link may be out of date. Head back to the home page, or call us and we will sort your
          journey out over the phone.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href="/" size="lg">
            Back to home
          </ButtonLink>
          <a
            href={`tel:${siteConfig.contact.phoneHref}`}
            className="inline-flex min-h-14 items-center gap-2 px-2 text-bone/85 hover:text-gold-300"
          >
            <PhoneIcon className="h-5 w-5 text-gold-400" />
            {siteConfig.contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
