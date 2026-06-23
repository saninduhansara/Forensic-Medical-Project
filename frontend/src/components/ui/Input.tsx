import { cls } from "@/lib/utils";

interface InputProps {
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  className?: string;
}

export function Input({ value, onChange, disabled, type = "text", placeholder, className }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={e => onChange?.(e.target.value)}
      className={cls(
        "w-full border rounded px-3 py-1.5 text-sm transition-colors",
        disabled
          ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
          : "bg-white border-slate-300 text-slate-900 hover:border-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30",
        className
      )}
    />
  );
}
