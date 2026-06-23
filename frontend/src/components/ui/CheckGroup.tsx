import { cls } from "@/lib/utils";

interface CheckGroupProps {
  label: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}

export function CheckGroup({ label, checked, onChange, disabled }: CheckGroupProps) {
  return (
    <label className={cls("flex items-center gap-2 text-sm", disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer")}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange?.(e.target.checked)}
        className="rounded border-slate-300 text-primary focus:ring-primary/30"
      />
      <span className="text-slate-700">{label}</span>
    </label>
  );
}
