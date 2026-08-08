import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Badge whose colours come from a lookup table in `lib/constants`. */
export function StatusBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn("font-medium", className)}>
      {label}
    </Badge>
  );
}
