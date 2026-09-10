import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cx } from "@/lib/utils";

/** Shared control styling — 48px tall, so every field is a comfortable tap target. */
const control =
  "min-h-12 w-full rounded-sm border border-bone-300 bg-white px-4 text-base text-ink " +
  "placeholder:text-ink/35 transition-colors hover:border-ink/30 " +
  "focus:border-gold-500 disabled:cursor-not-allowed disabled:opacity-60";

export function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;

  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
        {required ? (
          <>
            {" "}
            <span aria-hidden className="text-gold-600">
              *
            </span>
            <span className="sr-only">(required)</span>
          </>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="text-xs text-ink/65">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(control, className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx(control, "appearance-none pr-10", className)} {...props}>
      {children}
    </select>
  );
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(control, "min-h-32 py-3 leading-relaxed", className)} {...props} />;
}

export function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-sm border border-bone-300 bg-white p-4">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-gold-500"
      />
      <label htmlFor={id} className="cursor-pointer">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {description ? (
          <span className="mt-1 block text-xs text-ink/60">{description}</span>
        ) : null}
      </label>
    </div>
  );
}
