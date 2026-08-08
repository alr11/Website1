import { Heart } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Editorial panel — hidden on small screens where the form is the point */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-blush-50 p-12 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(at_20%_20%,theme(colors.blush.100)_0px,transparent_55%),radial-gradient(at_80%_70%,theme(colors.sage.100)_0px,transparent_55%)]"
        />
        <div className="relative flex items-center gap-2 text-blush-700">
          <Heart className="h-5 w-5 fill-blush-400 text-blush-400" />
          <span className="font-serif text-xl font-semibold tracking-tight">
            Everly
          </span>
        </div>

        <div className="relative max-w-md">
          <p className="font-serif text-4xl leading-tight text-blush-900">
            Every guest, every invoice, every deadline — in one calm place.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-blush-800/70">
            Track RSVPs, keep the budget honest, work through a checklist built
            from a real wedding timeline, and keep your vendors in order.
          </p>
        </div>

        <div className="relative flex gap-8 text-sm text-blush-800/60">
          <div>
            <p className="font-serif text-2xl text-blush-900">54</p>
            <p>checklist tasks, ready to go</p>
          </div>
          <div>
            <p className="font-serif text-2xl text-blush-900">10</p>
            <p>budget categories, pre-split</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
