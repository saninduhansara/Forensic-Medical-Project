import { cls } from "@/lib/utils";

const STATUS_MAP: Record<string, string> = {
  complete:    "bg-emerald-100 text-emerald-800",
  submitted:   "bg-emerald-100 text-emerald-800",
  completed:   "bg-emerald-100 text-emerald-800",
  draft:       "bg-amber-100 text-amber-800",
  pending:     "bg-sky-100 text-sky-800",
  in_progress: "bg-violet-100 text-violet-800",
};

const STATUS_LABELS: Record<string, string> = {
  complete: "Complete", submitted: "Submitted", completed: "Completed",
  draft: "Draft", pending: "Pending", in_progress: "In Progress",
};

export function Badge({ status }: { status: string }) {
  return (
    <span className={cls(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
      STATUS_MAP[status] ?? "bg-gray-100 text-gray-700"
    )}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
