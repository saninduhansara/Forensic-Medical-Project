import { cls } from "@/lib/utils";
import type { Urgency } from "@/types";

const MAP: Record<Urgency, string> = {
  routine: "bg-gray-100 text-gray-700",
  urgent:  "bg-orange-100 text-orange-800",
  stat:    "bg-red-100 text-red-800",
};

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span className={cls("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide", MAP[urgency])}>
      {urgency}
    </span>
  );
}
