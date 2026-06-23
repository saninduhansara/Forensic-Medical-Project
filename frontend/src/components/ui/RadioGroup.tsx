import { cls } from "@/lib/utils";

interface RadioGroupProps {
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange?: (v: string) => void;
  disabled?: boolean;
}

export function RadioGroup({ name, value, options, onChange, disabled }: RadioGroupProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {options.map(o => (
        <label key={o.value} className={cls("flex items-center gap-2 text-sm", disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer")}>
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            disabled={disabled}
            onChange={() => onChange?.(o.value)}
            className="text-primary focus:ring-primary/30"
          />
          <span className="text-slate-700">{o.label}</span>
        </label>
      ))}
    </div>
  );
}
