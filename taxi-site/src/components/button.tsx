import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "onDark";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  // Gold plate with near-black text — 10:1 contrast, reads as the one action.
  primary: "bg-gold-400 text-ink hover:bg-gold-300 active:bg-gold-500 shadow-card",
  // Outlined, for light backgrounds.
  secondary: "border border-ink/20 bg-white text-ink hover:border-ink/40 hover:bg-bone-200",
  ghost: "text-ink hover:bg-ink/5",
  // Outlined gold, for use on the near-black hero / CTA bands.
  onDark: "border border-gold-400/60 text-gold-200 hover:bg-gold-400/10 hover:border-gold-400",
};

const sizes: Record<Size, string> = {
  // min-h-11 = 44px, the minimum comfortable tap target.
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-14 px-7 text-base",
};

const shared =
  "inline-flex items-center justify-center gap-2 rounded-sm font-semibold uppercase tracking-[0.08em] transition-colors duration-200";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cx(shared, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const classes = cx(shared, variants[variant], sizes[size], className);
  const isInternal = href.startsWith("/") && !href.startsWith("//");

  if (isInternal) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...props}>
      {children}
    </a>
  );
}
