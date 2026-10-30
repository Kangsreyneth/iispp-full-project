import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/logos/logo-full.png";
import seal from "@/assets/logos/seal.png";
import { BRAND } from "@/utils/constants";

/** Split-screen frame shared by Login, Signup and Forgot password. */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <img src={seal} alt="" className="pointer-events-none absolute -bottom-24 -right-24 h-[34rem] opacity-10" />
        <div className="relative inline-block self-start rounded-xl bg-white p-4 shadow-xl"><img src={logo} alt={BRAND.name} className="h-14 w-auto" /></div>
        <div className="relative">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300"><span className="h-px w-8 bg-gold-400" /> {BRAND.parent}</p>
          <h2 className="font-display text-4xl font-bold leading-tight">Manage news, events and programs for {BRAND.short}.</h2>
          <p className="mt-4 max-w-md text-brand-100">Sign in to the admin dashboard to publish content. Visitors do not need an account.</p>
        </div>
        <p className="relative text-sm text-brand-200">© {new Date().getFullYear()} {BRAND.short}</p>
      </aside>
      <main className="flex items-center justify-center bg-slate-50 px-4 py-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-brand-700"><ArrowLeft className="h-4 w-4" /> Back to website</Link>
          <div className="rounded-2xl border bg-white p-8 shadow-lg">
            <img src={logo} alt="" className="mb-5 h-10 w-auto lg:hidden" />
            <h1 className="font-display text-3xl font-bold text-brand-800">{title}</h1>
            {subtitle && <p className="mb-6 mt-1 text-sm text-slate-500">{subtitle}</p>}
            {children}
          </div>
          {footer && <p className="mt-5 text-center text-sm text-slate-600">{footer}</p>}
        </div>
      </main>
    </div>
  );
}
