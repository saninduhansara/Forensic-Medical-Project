import { cls } from "@/lib/utils";

interface TextareaProps {
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  rows?: number;
  placeholder?: string;
}

export function Textarea({ value, onChange, disabled, rows = 3, placeholder }: TextareaProps) {
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      disabled={disabled}
      onChange={e => onChange?.(e.target.value)}
      className={cls(
        "w-full border rounded px-3 py-1.5 text-sm transition-colors resize-none",
        disabled
          ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
          : "bg-white border-slate-300 text-slate-900 hover:border-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
      )}
    />
  );
}
