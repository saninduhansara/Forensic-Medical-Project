import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cls } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  collapsible?: boolean;
}

export function FormSection({ title, badge, children, collapsible }: FormSectionProps) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-6 border border-slate-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => collapsible && setOpen(o => !o)}
        className={cls(
          "w-full flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200",
          collapsible ? "cursor-pointer hover:bg-slate-100" : "cursor-default"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">{title}</span>
          {badge}
        </div>
        {collapsible && (open
          ? <ChevronUp size={14} className="text-slate-400" />
          : <ChevronDown size={14} className="text-slate-400" />
        )}
      </button>
      {open && <div className="px-4 pt-4 pb-2">{children}</div>}
    </div>
  );
}
