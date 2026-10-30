import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

function hasPermission(profile, permission) {
  if (profile?.role === "super_admin") return true;
  return (profile?.permissions || []).some((granted) =>
    granted === "*" || granted === permission ||
    (granted.endsWith(".*") && permission.startsWith(granted.slice(0, -1)))
  );
}

export default function AdminPermission({ permission, children }) {
  const { profile } = useAuth();
  if (hasPermission(profile, permission)) return children;

  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
      <h1 className="font-display text-2xl font-bold text-brand-800">Access not granted</h1>
      <p className="mt-2 text-slate-600">Your staff account does not have permission to manage this section.</p>
      <Link to="/admin/dashboard" className="mt-5 inline-flex rounded-lg bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900">Back to dashboard</Link>
    </section>
  );
}
