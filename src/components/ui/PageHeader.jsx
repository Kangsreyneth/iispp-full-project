import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import seal from "@/assets/logos/seal.png";

/** Maroon banner at the top of inner pages. crumbs = [["Academics", "/academics"], ["Title"]] */
export default function PageHeader({ title, subtitle, crumbs = [], children }) {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-brand-900 via-brand-800 to-brand-700 text-white">
      <img src={seal} alt="" className="pointer-events-none absolute -right-10 top-1/2 h-72 -translate-y-1/2 opacity-10" />
      <div className="container-page relative py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1 text-sm text-brand-100">
          <Link to="/" className="hover:underline">Home</Link>
          {crumbs.map(([label, to], i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5" />
              {to ? <Link to={to} className="hover:underline">{label}</Link> : <span className="max-w-[16rem] truncate text-white">{label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="font-display text-3xl font-bold sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-brand-100">{subtitle}</p>}
        {children}
      </div>
    </header>
  );
}
