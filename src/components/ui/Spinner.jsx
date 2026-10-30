import { Loader2 } from "lucide-react";

export default function Spinner({ label = "Loading…", className = "py-16" }) {
  return (
    <div className={`flex items-center justify-center gap-2 text-slate-500 ${className}`} role="status">
      <Loader2 className="h-5 w-5 animate-spin text-brand-700" /> {label}
    </div>
  );
}
