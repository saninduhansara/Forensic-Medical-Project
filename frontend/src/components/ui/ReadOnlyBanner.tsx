import { Eye } from "lucide-react";

export function ReadOnlyBanner({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
      <Eye size={13} /><span>{text}</span>
    </div>
  );
}
