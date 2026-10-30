import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import seal from "@/assets/logos/seal.png";
import { useLang } from "@/hooks/useLang";

/** Maroon banner at the top of inner pages. crumbs = [["Academics", "/academics"], ["Title"]] */
export default function PageHeader({ title, subtitle, crumbs = [], children }) {
  const { t } = useLang();
  return (
    <header className="relative overflow-hidden bg-brand-700 text-white">
      <img src={seal} alt="" className="pointer-events-none absolute -right-12 top-1/2 h-64 -translate-y-1/2 opacity-[0.07]" />
      <div className="container-page relative py-10 sm:py-14">
        <nav aria-label={t("breadcrumb")} className="mb-4 flex flex-wrap items-center gap-1 text-xs text-white/70 sm:text-sm">
          <Link to="/" className="hover:underline">{t("home")}</Link>
          {crumbs.map(([label, to], i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5" />
              {to ? <Link to={to} className="hover:underline">{label}</Link> : <span className="max-w-[16rem] truncate text-white">{label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="font-display text-3xl font-semibold leading-tight sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl leading-7 text-white/80">{subtitle}</p>}
        {children}
      </div>
    </header>
  );
}
