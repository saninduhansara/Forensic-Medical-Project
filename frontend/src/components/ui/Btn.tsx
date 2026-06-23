import { cls } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary:   "bg-primary text-white hover:bg-blue-700 active:bg-blue-800",
  secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
  ghost:     "text-slate-600 hover:bg-slate-100 active:bg-slate-200",
  danger:    "bg-red-600 text-white hover:bg-red-700",
  success:   "bg-emerald-600 text-white hover:bg-emerald-700",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}

export function Btn({ children, onClick, variant = "primary", size = "md", icon, disabled, type = "button", className }: BtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls(
        "inline-flex items-center gap-1.5 font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30",
        VARIANTS[variant],
        SIZES[size],
        disabled ? "opacity-50 cursor-not-allowed" : "",
        className
      )}
    >
      {icon}{children}
    </button>
  );
}
