import type { SVGProps } from "react";

/**
 * Hand-rolled inline icons — keeps the bundle free of an icon dependency.
 * All are decorative; they are rendered with aria-hidden and the surrounding
 * element always carries the accessible text.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.6 3.5h-.9A2.7 2.7 0 0 0 3 6.2c0 8.2 6.6 14.8 14.8 14.8a2.7 2.7 0 0 0 2.7-2.7v-.9a1.3 1.3 0 0 0-1-1.3l-3.1-.8a1.3 1.3 0 0 0-1.3.5l-.8 1a11.6 11.6 0 0 1-5.3-5.3l1-.8a1.3 1.3 0 0 0 .5-1.3l-.8-3.1a1.3 1.3 0 0 0-1.1-.8Z" />
    </svg>
  );
}

export function PlaneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10.2 13.8 3 11.4l1.4-1.5 5 .8 3.2-3.3-6.4-3.7L7.8 2l8.5 2.3 2.4-2.4a1.9 1.9 0 0 1 2.7 2.7l-2.4 2.4L21.3 15l-1.7 1.6-3.7-6.4-3.3 3.2.8 5-1.5 1.4-2.4-7.2Z" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 10.5c0 5.2-6.4 10.6-7.6 11.5a.7.7 0 0 1-.8 0C10.4 21.1 4 15.7 4 10.5a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10.3" r="2.8" />
    </svg>
  );
}

export function BriefcaseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.8" y="7.2" width="18.4" height="13" rx="2.2" />
      <path d="M8.6 7.2V5.4a2 2 0 0 1 2-2h2.8a2 2 0 0 1 2 2v1.8M2.8 12.4h18.4" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6.8V12l3.4 2" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.6 4.5 5.5v6c0 4.6 3.1 8.7 7.5 9.9 4.4-1.2 7.5-5.3 7.5-9.9v-6L12 2.6Z" />
      <path d="m8.9 11.9 2.1 2.1 4.1-4.1" />
    </svg>
  );
}

export function StarIcon({ half = false, ...props }: IconProps & { half?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" {...props}>
      <defs>
        {half ? (
          <linearGradient id="star-half">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        ) : null}
      </defs>
      <path
        d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9L12 2.6Z"
        fill={half ? "url(#star-half)" : "currentColor"}
        stroke="currentColor"
        strokeWidth={half ? 1.2 : 0}
      />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...props}>
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.3 4c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.7 4.2 3.7 2 .8 2.5.7 2.9.6.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4l-.6-.3-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.7-1.6-2-.1-.2 0-.4.1-.5l.4-.5.3-.5v-.5l-.8-1.8c-.2-.5-.4-.5-.6-.5Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.8" y="4.8" width="18.4" height="14.4" rx="2.2" />
      <path d="m3.4 6.6 8.6 6 8.6-6" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

/** Maps the `icon` string in siteConfig.services to a component. */
export const serviceIcons = {
  plane: PlaneIcon,
  "map-pin": MapPinIcon,
  briefcase: BriefcaseIcon,
  clock: ClockIcon,
} as const;

export type ServiceIconName = keyof typeof serviceIcons;
