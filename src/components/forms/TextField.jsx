import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/** Labelled input with optional leading icon and show/hide password. */
export default function TextField({ label, icon: Icon, type = "text", error, ...props }) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <div className="relative mt-1">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />}
        <input
          type={isPw && show ? "text" : type}
          className={`w-full rounded-lg border bg-white py-2.5 pr-3 text-sm transition focus:outline-none focus:ring-2 ${Icon ? "pl-10" : "pl-3"} ${error ? "border-red-400 focus:ring-red-200" : "border-slate-300 focus:border-brand-600 focus:ring-brand-200"}`}
          {...props}
        />
        {isPw && (
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <span className="mt-1 block text-xs text-red-600" role="alert">{error}</span>}
    </label>
  );
}
